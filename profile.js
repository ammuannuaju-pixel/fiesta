// profile.js — Public profile page logic

async function loadProfilePage() {
  // Get username from URL: profile.html?user=username
  const params   = new URLSearchParams(window.location.search);
  const username = params.get("user");

  // If no username in URL show own profile
  const targetUsername = username || currentProfile?.username;

  if (!targetUsername) {
    document.getElementById("profileHeader").innerHTML = `
      <div class="profile-error">
        No profile found. <a href="index.html">Return home</a>
      </div>
    `;
    return;
  }

  // Fetch profile by username
  const { data: profile } = await db
    .from("profiles")
    .select("*")
    .eq("username", targetUsername)
    .maybeSingle();

  if (!profile) {
    document.getElementById("profileHeader").innerHTML = `
      <div class="profile-error">
        Profile not found. <a href="index.html">Return home</a>
      </div>
    `;
    return;
  }

  const isOwnProfile = currentUser?.id === profile.id;

  // Render header
  renderProfileHeader(profile, isOwnProfile);

  // Load all data in parallel
  const [streak, badges, shelf, activity, quizCount] = await Promise.all([
    getStreakForUser(profile.id),
    getBadgesForUser(profile.id),
    getShelfForUser(profile.id),
    getActivityForUser(profile.id),
    getQuizCountForUser(profile.id),
  ]);

  renderProfileStats(streak, quizCount, shelf.length);
  renderProfileBadges(badges);
  renderProfileShelf(shelf);
  renderProfileActivity(activity);
}

// ─── DATA FETCHERS ─────────────────────────────

async function getStreakForUser(userId) {
  const { data } = await db
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

async function getBadgesForUser(userId) {
  const { data } = await db
    .from("badges")
    .select("badge_key, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });
  return data || [];
}

async function getShelfForUser(userId) {
  const { data } = await db
    .from("bookshelf")
    .select("*")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });
  return data || [];
}

async function getActivityForUser(userId) {
  const { data } = await db
    .from("quiz_results")
    .select("genre, subgenre, mood, created_at, books")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

async function getQuizCountForUser(userId) {
  const { count } = await db
    .from("quiz_results")
    .select("id", { count: "exact" })
    .eq("user_id", userId);
  return count || 0;
}

// ─── RENDERERS ─────────────────────────────────

function renderProfileHeader(profile, isOwnProfile) {
  const initials  = profile.username[0].toUpperCase();
  const bgColor   = seedToHsl(profile.avatar_seed || profile.id);

  document.getElementById("profileHeader").innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar-large" style="background:${bgColor}">
        ${initials}
      </div>
      <div class="profile-hero-info">
        <div class="profile-username">${escHTML(profile.username)}</div>
        <div class="profile-joined">Reader since ${new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
        ${isOwnProfile ? `
          <button class="profile-edit-btn" onclick="showUsernameModal()">Edit Profile</button>
        ` : `
          <button class="profile-follow-btn" id="profileFollowBtn" data-uid="${profile.id}" onclick="handleFollowClick(this)">
            Follow
          </button>
        `}
      </div>
    </div>
  `;

  // Check follow status if viewing another profile
  if (!isOwnProfile) {
    isFollowing(profile.id).then(following => {
      const btn = document.getElementById("profileFollowBtn");
      if (btn && following) {
        btn.textContent = "Following";
        btn.classList.add("active");
      }
    });
  }
}

function renderProfileStats(streak, quizCount, shelfCount) {
  document.getElementById("profileStats").innerHTML = `
    <div class="profile-stats-row">
      <div class="profile-stat">
        <div class="profile-stat-number">${streak?.current || 0}</div>
        <div class="profile-stat-label">Day Streak</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-number">${streak?.longest || 0}</div>
        <div class="profile-stat-label">Best Streak</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-number">${quizCount}</div>
        <div class="profile-stat-label">Quizzes Taken</div>
      </div>
      <div class="profile-stat">
        <div class="profile-stat-number">${shelfCount}</div>
        <div class="profile-stat-label">Books Saved</div>
      </div>
    </div>
  `;
}

function renderProfileBadges(badges) {
  const container = document.getElementById("profileBadges");
  if (!badges.length) {
    container.innerHTML = `<p class="profile-empty">No badges earned yet. Complete quizzes to unlock badges.</p>`;
    return;
  }

  container.innerHTML = badges.map(b => {
    const def = BADGE_DEFINITIONS?.[b.badge_key];
    if (!def) return "";
    return `
      <div class="badge-item" title="${def.desc}">
        <div class="badge-icon">${getBadgeIconSVG(def.icon)}</div>
        <div class="badge-name">${def.label}</div>
      </div>
    `;
  }).join("");
}

function renderProfileShelf(shelf) {
  const container = document.getElementById("profileShelf");
  if (!shelf.length) {
    container.innerHTML = `<p class="profile-empty">No books saved yet. Complete a quiz and save books to your shelf.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="shelf-grid">
      ${shelf.map(book => `
        <div class="shelf-book">
          ${book.cover
            ? `<img class="shelf-cover" src="${escHTML(book.cover)}" alt="${escHTML(book.title)}" loading="lazy" />`
            : `<div class="shelf-cover-fb">
                <div class="shelf-fb-title">${escHTML(book.title)}</div>
               </div>`
          }
          <div class="shelf-info">
            <div class="shelf-title">${escHTML(book.title)}</div>
            <div class="shelf-author">${escHTML(book.author)}</div>
            ${book.genre ? `<div class="shelf-genre">${escHTML(book.genre)}</div>` : ""}
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProfileActivity(activity) {
  const container = document.getElementById("profileActivity");
  if (!activity.length) {
    container.innerHTML = `<p class="profile-empty">No quiz history yet.</p>`;
    return;
  }

  container.innerHTML = activity.map(item => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-content">
        <div class="activity-title">
          Explored <strong>${escHTML(item.genre)}</strong>
          — ${escHTML(item.subgenre)}
          while feeling <strong>${escHTML(item.mood)}</strong>
        </div>
        <div class="activity-books">
          ${(item.books || []).slice(0, 3).map(b =>
            `<span class="activity-book">${escHTML(b.title || "")}</span>`
          ).join("")}
        </div>
        <div class="activity-time">${formatTime(item.created_at)}</div>
      </div>
    </div>
  `).join("");
}

// ─── INIT ──────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  // Wait for auth to initialize
  await new Promise(resolve => setTimeout(resolve, 800));
  loadProfilePage();
});