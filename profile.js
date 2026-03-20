// profile.js — Public profile page logic

async function loadProfilePage() {
  const params   = new URLSearchParams(window.location.search);
  const username = params.get("user");

  // Re-fetch profile in case currentProfile is stale
  if (!currentProfile && currentUser) {
    if (typeof loadProfile === "function") {
      currentProfile = await loadProfile(currentUser.id);
    }
  }

  const targetUsername = username || currentProfile?.username;

  if (!targetUsername) {
    document.getElementById("profileHeader").innerHTML = `
      <div class="profile-error">
        No profile found. Complete a quiz first then visit this page.
        <br><br>
        <a href="index.html">Return home</a>
      </div>
    `;
    return;
  }

  // Fetch profile by username
  const { data: profile, error } = await db
    .from("profiles")
    .select("*")
    .eq("username", targetUsername)
    .maybeSingle();

  if (error || !profile) {
    document.getElementById("profileHeader").innerHTML = `
      <div class="profile-error">
        Profile not found for "${targetUsername}".
        <br><br>
        <a href="index.html">Return home</a>
      </div>
    `;
    return;
  }

  const isOwnProfile = currentUser?.id === profile.id;

  // Render header first so page feels responsive
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
  const initials = profile.username[0].toUpperCase();
  const bgColor  = typeof seedToHsl === "function"
    ? seedToHsl(profile.avatar_seed || profile.id)
    : "#3a0a2a";

  document.getElementById("profileHeader").innerHTML = `
    <div class="profile-hero">
      <div class="profile-avatar-large" style="background:${bgColor}">
        ${initials}
      </div>
      <div class="profile-hero-info">
        <div class="profile-username">${escHTML(profile.username)}</div>
        <div class="profile-joined">
          Reader since ${new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "long", year: "numeric"
          })}
        </div>
        ${isOwnProfile
          ? `<button class="profile-edit-btn" onclick="showUsernameEdit()">Edit Username</button>`
          : `<button
               class="profile-follow-btn"
               id="profileFollowBtn"
               data-uid="${profile.id}"
               onclick="handleFollowClick(this)">
               Follow
             </button>`
        }
      </div>
    </div>
  `;

  // Check follow status for other profiles
  if (!isOwnProfile && typeof isFollowing === "function") {
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
  const container = document.getElementById("profileStats");
  if (!container) return;

  container.innerHTML = `
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
  if (!container) return;

  if (!badges.length) {
    container.innerHTML = `
      <p class="profile-empty">
        No badges earned yet. Complete quizzes to unlock badges.
      </p>
    `;
    return;
  }

  container.innerHTML = badges.map(b => {
    const def = typeof BADGE_DEFINITIONS !== "undefined"
      ? BADGE_DEFINITIONS[b.badge_key]
      : null;
    if (!def) return "";
    const iconSVG = typeof getBadgeIconSVG === "function"
      ? getBadgeIconSVG(def.icon)
      : "";
    return `
      <div class="badge-item" title="${escHTML(def.desc)}">
        <div class="badge-icon">${iconSVG}</div>
        <div class="badge-name">${escHTML(def.label)}</div>
      </div>
    `;
  }).join("");
}

function renderProfileShelf(shelf) {
  const container = document.getElementById("profileShelf");
  if (!container) return;

  if (!shelf.length) {
    container.innerHTML = `
      <p class="profile-empty">
        No books saved yet. Complete a quiz and save books to your shelf.
      </p>
    `;
    return;
  }

  container.innerHTML = `
    <div class="shelf-grid">
      ${shelf.map(book => `
        <div class="shelf-book">
          ${book.cover
            ? `<img
                 class="shelf-cover"
                 src="${escHTML(book.cover)}"
                 alt="${escHTML(book.title)}"
                 loading="lazy"
                 onerror="this.style.display='none'"
               />`
            : `<div class="shelf-cover-fb">
                 <div class="shelf-fb-title">${escHTML(book.title)}</div>
               </div>`
          }
          <div class="shelf-info">
            <div class="shelf-title">${escHTML(book.title)}</div>
            <div class="shelf-author">${escHTML(book.author)}</div>
            ${book.genre
              ? `<div class="shelf-genre">${escHTML(book.genre)}</div>`
              : ""
            }
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderProfileActivity(activity) {
  const container = document.getElementById("profileActivity");
  if (!container) return;

  if (!activity.length) {
    container.innerHTML = `<p class="profile-empty">No quiz history yet.</p>`;
    return;
  }

  const timeAgo = typeof formatTime === "function" ? formatTime : (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000)  return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return new Date(iso).toLocaleDateString();
  };

  container.innerHTML = activity.map(item => `
    <div class="activity-item">
      <div class="activity-dot"></div>
      <div class="activity-content">
        <div class="activity-title">
          Explored <strong>${escHTML(item.genre)}</strong>
          — ${escHTML(item.subgenre || "")}
          while feeling <strong>${escHTML(item.mood)}</strong>
        </div>
        <div class="activity-books">
          ${(item.books || []).slice(0, 3).map(b =>
            `<span class="activity-book">${escHTML(b.title || "")}</span>`
          ).join("")}
        </div>
        <div class="activity-time">${timeAgo(item.created_at)}</div>
      </div>
    </div>
  `).join("");
}

// ─── USERNAME EDIT ─────────────────────────────

async function showUsernameEdit() {
  const newName = prompt("Enter new username (letters, numbers, underscores only):");
  if (!newName) return;

  if (!/^[a-zA-Z0-9_]{3,24}$/.test(newName)) {
    alert("Invalid username. Use 3-24 characters, letters numbers and underscores only.");
    return;
  }

  const { error } = await db
    .from("profiles")
    .update({ username: newName })
    .eq("id", currentUser.id);

  if (error) {
    alert("Could not update username: " + error.message);
  } else {
    currentProfile.username = newName;
    alert("Username updated successfully.");
    location.reload();
  }
}

// ─── HELPERS ───────────────────────────────────

function escHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── INIT ──────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  // First check if a session already exists
  const { data: { session } } = await db.auth.getSession();

  if (session) {
    currentUser    = session.user;
    if (typeof loadProfile === "function") {
      currentProfile = await loadProfile(session.user.id);
    }
    loadProfilePage();
    return;
  }

  // Otherwise listen for auth state change
  const { data: { subscription } } = db.auth.onAuthStateChange(
    async (event, session) => {
      if (session) {
        currentUser = session.user;
        if (typeof loadProfile === "function") {
          currentProfile = await loadProfile(session.user.id);
        }
        subscription.unsubscribe();
        loadProfilePage();
      } else {
        subscription.unsubscribe();
        loadProfilePage();
      }
    }
  );

  // Fallback: load after 5 seconds regardless
  setTimeout(() => {
    loadProfilePage();
  }, 5000);
});