// ─── FOLLOWS ───────────────────────────────────

async function followUser(targetId) {
  if (!currentUser || targetId === currentUser.id) return false;
  const { error } = await db
    .from("follows")
    .insert({ follower_id: currentUser.id, following_id: targetId });
  if (error && error.code !== "23505") { console.error(error.message); return false; }
  return true;
}

async function unfollowUser(targetId) {
  if (!currentUser) return;
  await db.from("follows").delete()
    .eq("follower_id", currentUser.id)
    .eq("following_id", targetId);
}

async function isFollowing(targetId) {
  if (!currentUser) return false;
  const { data } = await db.from("follows").select("follower_id")
    .eq("follower_id", currentUser.id)
    .eq("following_id", targetId)
    .maybeSingle();
  return !!data;
}

async function handleFollowClick(btn) {
  const targetId = btn.dataset.uid;
  if (!targetId) return;
  const already = btn.classList.contains("active");
  if (already) {
    await unfollowUser(targetId);
    btn.textContent = "Follow";
    btn.classList.remove("active");
  } else {
    const ok = await followUser(targetId);
    if (ok) { btn.textContent = "Following"; btn.classList.add("active"); }
  }
}

// ─── TASTE MATCHING ────────────────────────────

async function saveQuizResult(selections, books) {
  if (!currentUser) return;
  await db.from("quiz_results").insert({
    user_id:  currentUser.id,
    genre:    selections.genre,
    subgenre: selections.subgenre,
    mood:     selections.mood,
    length:   selections.length,
    books:    books
  });
}

async function findReaderTwins() {
  if (!currentUser) return [];
  const { data: myResults } = await db
    .from("quiz_results").select("genre, subgenre, mood")
    .eq("user_id", currentUser.id)
    .order("created_at", { ascending: false }).limit(15);
  if (!myResults?.length) return [];

  const myGenres = [...new Set(myResults.map(r => r.genre))];
  const myMoods  = [...new Set(myResults.map(r => r.mood))];

  const { data: candidates } = await db
    .from("quiz_results")
    .select("user_id, genre, mood, profiles(username, avatar_seed)")
    .neq("user_id", currentUser.id)
    .in("genre", myGenres)
    .order("created_at", { ascending: false }).limit(150);

  if (!candidates?.length) return [];

  const scores = {};
  candidates.forEach(row => {
    const uid = row.user_id;
    if (!scores[uid]) scores[uid] = { count: 0, profile: row.profiles };
    if (myGenres.includes(row.genre)) scores[uid].count += 2;
    if (myMoods.includes(row.mood))   scores[uid].count += 1;
  });

  return Object.entries(scores)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
    .map(([userId, val]) => ({
      userId,
      username:   val.profile?.username   || "Anonymous Reader",
      avatarSeed: val.profile?.avatar_seed || userId,
      matchScore: val.count
    }));
}

// ─── FEED ──────────────────────────────────────

async function loadFeed() {
  if (!currentUser) return [];
  const { data: follows } = await db
    .from("follows").select("following_id")
    .eq("follower_id", currentUser.id);
  if (!follows?.length) return [];

  const ids = follows.map(f => f.following_id);
  const { data: items } = await db
    .from("quiz_results")
    .select("id, genre, subgenre, mood, books, created_at, user_id, profiles(username, avatar_seed)")
    .in("user_id", ids)
    .order("created_at", { ascending: false }).limit(25);
  return items || [];
}

// ─── ANNOTATIONS ───────────────────────────────

async function postAnnotation(isbn, title, content) {
  if (!currentUser || !content.trim()) return;
  const { data, error } = await db.from("annotations")
    .insert({ user_id: currentUser.id, book_isbn: isbn, book_title: title, content })
    .select().single();
  if (error) console.error(error.message);
  return data;
}

async function getAnnotations(isbn) {
  const { data } = await db.from("annotations")
    .select("*, profiles(username)")
    .eq("book_isbn", isbn)
    .order("upvotes", { ascending: false }).limit(10);
  return data || [];
}

async function upvoteAnnotation(id) {
  await db.rpc("increment_upvote", { annotation_id: id });
}

// ─── READING ROOMS ─────────────────────────────

let activeRoomId  = null;
let activeChannel = null;

async function enterReadingRoom(genre, mood) {
  const { data: existing } = await db.from("reading_rooms")
    .select("*").eq("genre", genre).eq("mood", mood)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false }).limit(1);

  let room = existing?.[0] || null;

  if (!room) {
    const { data: newRoom } = await db.from("reading_rooms")
      .insert({ genre, mood }).select().single();
    room = newRoom;
  }

  if (!room) return;
  activeRoomId = room.id;

  const messages = await loadMessages(room.id);
  renderAllMessages(messages);
  subscribeToRoom(room.id);
  showRoomUI(genre, mood);
}

async function loadMessages(roomId) {
  const { data } = await db.from("room_messages")
    .select("id, content, created_at, user_id, profiles(username, avatar_seed)")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true }).limit(80);
  return data || [];
}

function subscribeToRoom(roomId) {
  if (activeChannel) db.removeChannel(activeChannel);
  activeChannel = db.channel(`room_messages_${roomId}`)
    .on("postgres_changes", {
      event: "INSERT", schema: "public",
      table: "room_messages", filter: `room_id=eq.${roomId}`
    }, async (payload) => {
      if (payload.new.user_id === currentUser?.id) return;
      const { data: profile } = await db.from("profiles")
        .select("username, avatar_seed").eq("id", payload.new.user_id).single();
      renderSingleMessage({ ...payload.new, profiles: profile });
    })
    .subscribe();
}

async function sendChatMessage(content) {
  const trimmed = content.trim();
  if (!trimmed || !activeRoomId || !currentUser) return;
  if (trimmed.length > 500) return;

  const optimistic = {
    id: "opt_" + Date.now(), user_id: currentUser.id,
    content: trimmed, created_at: new Date().toISOString(),
    profiles: currentProfile
  };
  renderSingleMessage(optimistic);
  document.getElementById("chatInput").value = "";

  const { error } = await db.from("room_messages")
    .insert({ room_id: activeRoomId, user_id: currentUser.id, content: trimmed });
  if (error) document.getElementById(optimistic.id)?.remove();
}

function renderAllMessages(messages) {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  container.innerHTML = "";
  messages.forEach(m => renderSingleMessage(m));
}

function renderSingleMessage(msg) {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  const isMe    = msg.user_id === currentUser?.id;
  const name    = isMe ? "You" : (msg.profiles?.username || "Reader");
  const initial = name[0].toUpperCase();
  const bg      = seedToHsl(msg.profiles?.avatar_seed || msg.user_id || "000");
  const time    = formatTime(msg.created_at);

  const el = document.createElement("div");
  el.id = msg.id;
  el.className = `chat-message ${isMe ? "chat-mine" : "chat-theirs"}`;
  el.innerHTML = `
    <div class="chat-avatar" style="background:${bg}">${initial}</div>
    <div class="chat-bubble-wrap">
      <div class="chat-sender">${escHTML(name)}</div>
      <div class="chat-bubble">${escHTML(msg.content)}</div>
      <div class="chat-time">${time}</div>
    </div>
  `;
  container.appendChild(el);
  const near = container.scrollHeight - container.scrollTop - container.clientHeight < 120;
  if (near) el.scrollIntoView({ behavior: "smooth", block: "end" });
}

function showRoomUI(genre, mood) {
  const wrap  = document.getElementById("readingRoomWrap");
  const title = document.getElementById("roomTitle");
  if (wrap)  wrap.classList.remove("hidden");
  if (title) title.textContent = `${genre} — ${mood}`;
}

// ─── RENDER TWINS ──────────────────────────────

async function renderReaderTwins() {
  const container = document.getElementById("twinsContainer");
  if (!container) return;
  const twins = await findReaderTwins();
  if (!twins.length) {
    container.innerHTML = `<p class="twins-empty">Complete more quizzes to find your reader twins.</p>`;
    return;
  }
  container.innerHTML = `
    <div class="twins-label">Readers Who Share Your Taste</div>
    <div class="twins-grid">
      ${twins.map(t => `
        <div class="twin-card">
          <div class="twin-avatar" style="background:${seedToHsl(t.avatarSeed)}">${t.username[0].toUpperCase()}</div>
          <div class="twin-info">
            <div class="twin-name">${escHTML(t.username)}</div>
            <div class="twin-score">${t.matchScore} shared taste points</div>
          </div>
          <button class="twin-follow-btn" data-uid="${t.userId}" onclick="handleFollowClick(this)">Follow</button>
        </div>
      `).join("")}
    </div>
  `;
  for (const t of twins) {
    const following = await isFollowing(t.userId);
    const btn = container.querySelector(`[data-uid="${t.userId}"]`);
    if (btn && following) { btn.textContent = "Following"; btn.classList.add("active"); }
  }
}

// ─── RENDER FEED ───────────────────────────────

async function renderFeed() {
  const container = document.getElementById("feedContainer");
  if (!container) return;
  container.innerHTML = `<div class="feed-loading">Loading your feed...</div>`;
  const items = await loadFeed();
  if (!items.length) {
    container.innerHTML = `<div class="feed-empty">Follow some readers to see their activity here.</div>`;
    return;
  }
  container.innerHTML = items.map(item => `
    <div class="feed-item">
      <div class="feed-avatar" style="background:${seedToHsl(item.profiles?.avatar_seed || item.user_id)}">
        ${(item.profiles?.username || "?")[0].toUpperCase()}
      </div>
      <div class="feed-content">
        <div class="feed-action">
          <strong>${escHTML(item.profiles?.username || "A reader")}</strong>
          explored ${escHTML(item.genre)} while feeling ${escHTML(item.mood)}
        </div>
        <div class="feed-books">
          ${(item.books || []).slice(0, 3).map(b => `<span class="feed-book-title">${escHTML(b.title)}</span>`).join("")}
        </div>
        <div class="feed-time">${formatTime(item.created_at)}</div>
      </div>
    </div>
  `).join("");
}

// ─── UTILS ─────────────────────────────────────

function seedToHsl(seed) {
  let hash = 0;
  for (let i = 0; i < Math.min((seed || "").length, 8); i++) hash += seed.charCodeAt(i);
  return `hsl(${(hash % 60) + 290}, 65%, 22%)`;
}

function escHTML(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function formatTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60000)    return "just now";
  if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return new Date(iso).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" });
  return new Date(iso).toLocaleDateString([], { month:"short", day:"numeric" });
}
// ─── LOAD AND RENDER ANNOTATIONS ──────────────

async function loadAndRenderAnnotations(isbn) {
  const listEl = document.getElementById(`annlist-${isbn}`);
  if (!listEl) return;

  const annotations = await getAnnotations(isbn);

  if (!annotations.length) {
    listEl.innerHTML = `<div class="ann-empty">No reactions yet. Be the first.</div>`;
    return;
  }

  listEl.innerHTML = annotations.map(ann => `
    <div class="ann-item">
      <div class="ann-avatar" style="background:${seedToHsl(ann.profiles?.username || ann.user_id)}">
        ${(ann.profiles?.username || "R")[0].toUpperCase()}
      </div>
      <div class="ann-body">
        <div class="ann-user">${escHTML(ann.profiles?.username || "Reader")}</div>
        <div class="ann-text">${escHTML(ann.content)}</div>
        <div class="ann-meta">
          <span class="ann-time">${formatTime(ann.created_at)}</span>
          <button class="ann-upvote" data-id="${ann.id}" onclick="handleUpvote(this)">
            ${ann.upvotes > 0 ? `+ ${ann.upvotes}` : "Resonate"}
          </button>
        </div>
      </div>
    </div>
  `).join("");

  // Subscribe to live new annotations
  subscribeToAnnotations(isbn, (newAnn) => {
    loadAndRenderAnnotations(isbn);
  });
}

async function handleUpvote(btn) {
  const id = btn.dataset.id;
  btn.disabled = true;
  btn.textContent = "Resonated";
  await upvoteAnnotation(id);
}
function subscribeToAnnotations(isbn, onNew) {
  db.channel(`annotations:${isbn}`)
    .on("postgres_changes", {
      event:  "INSERT",
      schema: "public",
      table:  "annotations",
      filter: `book_isbn=eq.${isbn}`
    }, payload => onNew(payload.new))
    .subscribe();
}