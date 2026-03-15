// streaks.js — Reading streaks and badges system

// ─── BADGE DEFINITIONS ─────────────────────────

const BADGE_DEFINITIONS = {
  // Streak badges
  streak_3:    { label: "3 Day Streak",     desc: "Visited 3 days in a row",           icon: "flame" },
  streak_7:    { label: "Week Devotee",      desc: "Visited 7 days in a row",           icon: "flame" },
  streak_14:   { label: "Fortnight Reader",  desc: "Visited 14 days in a row",          icon: "flame" },
  streak_30:   { label: "Monthly Obsessive", desc: "Visited 30 days in a row",          icon: "flame" },

  // Quiz badges
  first_quiz:  { label: "First Chapter",    desc: "Completed your first quiz",          icon: "book" },
  quiz_5:      { label: "Avid Explorer",    desc: "Completed 5 quizzes",               icon: "book" },
  quiz_10:     { label: "Book Devotee",     desc: "Completed 10 quizzes",              icon: "book" },
  quiz_25:     { label: "Literary Scholar", desc: "Completed 25 quizzes",              icon: "book" },

  // Genre explorer badges
  genre_3:     { label: "Genre Hopper",     desc: "Explored 3 different genres",       icon: "compass" },
  genre_5:     { label: "Literary Nomad",   desc: "Explored 5 different genres",       icon: "compass" },
  genre_all:   { label: "The Omnivore",     desc: "Explored all 8 genres",             icon: "compass" },

  // Mood badges
  mood_dark:   { label: "Shadow Dweller",   desc: "Chose dark mood 5 times",           icon: "moon" },
  mood_happy:  { label: "Sunshine Reader",  desc: "Chose joyful mood 5 times",         icon: "sun" },
  mood_romantic: { label: "Heart on Sleeve", desc: "Chose romantic mood 5 times",      icon: "heart" },

  // Social badges
  first_follow: { label: "Connected",       desc: "Followed your first reader",        icon: "users" },
  first_annotation: { label: "Margin Notes", desc: "Left your first book reaction",    icon: "pen" },
};

// ─── STREAK MANAGEMENT ─────────────────────────

async function updateStreak() {
  if (!currentUser) return null;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // Get existing streak
  const { data: existing } = await db
    .from("streaks")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();

  if (!existing) {
    // First ever visit — create streak
    const { data } = await db
      .from("streaks")
      .insert({ user_id: currentUser.id, current: 1, longest: 1, last_visit: today })
      .select().single();
    await checkStreakBadges(1);
    return data;
  }

  const lastVisit = existing.last_visit;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  // Already visited today — no change
  if (lastVisit === today) return existing;

  let newCurrent;

  if (lastVisit === yesterdayStr) {
    // Consecutive day — increase streak
    newCurrent = existing.current + 1;
  } else {
    // Missed a day — reset streak
    newCurrent = 1;
  }

  const newLongest = Math.max(existing.longest, newCurrent);

  const { data: updated } = await db
    .from("streaks")
    .update({ current: newCurrent, longest: newLongest, last_visit: today, updated_at: new Date().toISOString() })
    .eq("user_id", currentUser.id)
    .select().single();

  await checkStreakBadges(newCurrent);
  return updated;
}

async function getStreak() {
  if (!currentUser) return null;
  const { data } = await db
    .from("streaks")
    .select("*")
    .eq("user_id", currentUser.id)
    .maybeSingle();
  return data;
}

// ─── BADGE MANAGEMENT ──────────────────────────

async function awardBadge(badgeKey) {
  if (!currentUser) return;
  if (!BADGE_DEFINITIONS[badgeKey]) return;

  // upsert prevents duplicate badges
  const { data, error } = await db
    .from("badges")
    .insert({ user_id: currentUser.id, badge_key: badgeKey })
    .select().single();

  if (!error && data) {
    showBadgeToast(badgeKey);
  }
}

async function getUserBadges() {
  if (!currentUser) return [];
  const { data } = await db
    .from("badges")
    .select("badge_key, earned_at")
    .eq("user_id", currentUser.id)
    .order("earned_at", { ascending: false });
  return data || [];
}

async function checkStreakBadges(streakCount) {
  if (streakCount >= 3)  await awardBadge("streak_3");
  if (streakCount >= 7)  await awardBadge("streak_7");
  if (streakCount >= 14) await awardBadge("streak_14");
  if (streakCount >= 30) await awardBadge("streak_30");
}

async function checkQuizBadges() {
  if (!currentUser) return;

  const { count } = await db
    .from("quiz_results")
    .select("id", { count: "exact" })
    .eq("user_id", currentUser.id);

  if (count >= 1)  await awardBadge("first_quiz");
  if (count >= 5)  await awardBadge("quiz_5");
  if (count >= 10) await awardBadge("quiz_10");
  if (count >= 25) await awardBadge("quiz_25");
}

async function checkGenreBadges() {
  if (!currentUser) return;

  const { data } = await db
    .from("quiz_results")
    .select("genre")
    .eq("user_id", currentUser.id);

  if (!data) return;

  const uniqueGenres = new Set(data.map(r => r.genre));
  if (uniqueGenres.size >= 3) await awardBadge("genre_3");
  if (uniqueGenres.size >= 5) await awardBadge("genre_5");
  if (uniqueGenres.size >= 8) await awardBadge("genre_all");
}

async function checkMoodBadges(mood) {
  if (!currentUser) return;

  const moodMap = {
    dark:     "mood_dark",
    happy:    "mood_happy",
    romantic: "mood_romantic",
  };

  const badgeKey = moodMap[mood];
  if (!badgeKey) return;

  const { count } = await db
    .from("quiz_results")
    .select("id", { count: "exact" })
    .eq("user_id", currentUser.id)
    .eq("mood", mood);

  if (count >= 5) await awardBadge(badgeKey);
}

// ─── TOAST NOTIFICATION ────────────────────────

function showBadgeToast(badgeKey) {
  const badge = BADGE_DEFINITIONS[badgeKey];
  if (!badge) return;

  const iconMap = {
    flame:   "fire",
    book:    "book",
    compass: "compass",
    moon:    "crescent",
    sun:     "sun",
    heart:   "heart",
    users:   "people",
    pen:     "pencil",
  };

  const toast = document.createElement("div");
  toast.className = "badge-toast";
  toast.innerHTML = `
    <div class="badge-toast-inner">
      <div class="badge-toast-icon">${getBadgeIconSVG(badge.icon)}</div>
      <div class="badge-toast-text">
        <div class="badge-toast-title">Badge Unlocked</div>
        <div class="badge-toast-name">${badge.label}</div>
        <div class="badge-toast-desc">${badge.desc}</div>
      </div>
    </div>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("badge-toast-visible");
  });

  setTimeout(() => {
    toast.classList.remove("badge-toast-visible");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function getBadgeIconSVG(icon) {
  const icons = {
    flame:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 3c1.5 2 2 3.5 2 5a2 2 0 01-4 0c0-1.5.5-3 2-5z"/></svg>`,
    book:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    moon:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`,
    sun:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    heart:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`,
    users:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
    pen:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  };
  return icons[icon] || icons.book;
}

// ─── STREAK DISPLAY ────────────────────────────

async function renderStreakBadgePanel() {
  const container = document.getElementById("streakPanel");
  if (!container) return;

  const streak = await getStreak();
  const badges = await getUserBadges();

  const streakCount = streak?.current || 0;
  const longest     = streak?.longest || 0;

  container.innerHTML = `
    <div class="streak-panel">
      <div class="streak-display">
        <div class="streak-fire">${streakCount > 0 ? getFireEmoji(streakCount) : ""}</div>
        <div class="streak-info">
          <div class="streak-count">${streakCount}</div>
          <div class="streak-label">Day Streak</div>
          <div class="streak-best">Best: ${longest} days</div>
        </div>
      </div>
      ${badges.length > 0 ? `
        <div class="badges-wrap">
          <div class="badges-label">Your Badges</div>
          <div class="badges-grid">
            ${badges.map(b => {
              const def = BADGE_DEFINITIONS[b.badge_key];
              if (!def) return "";
              return `
                <div class="badge-item" title="${def.desc}">
                  <div class="badge-icon">${getBadgeIconSVG(def.icon)}</div>
                  <div class="badge-name">${def.label}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      ` : `<div class="badges-empty">Complete quizzes to earn badges</div>`}
    </div>
  `;
}

function getFireEmoji(count) {
  if (count >= 30) return "BLAZING";
  if (count >= 14) return "ON FIRE";
  if (count >= 7)  return "HEATING UP";
  if (count >= 3)  return "IGNITED";
  return "SPARKED";
}

// ─── TRIGGER ALL CHECKS AFTER QUIZ ─────────────

async function triggerStreakAndBadgeChecks(mood) {
  await updateStreak();
  await checkQuizBadges();
  await checkGenreBadges();
  await checkMoodBadges(mood);
  await renderStreakBadgePanel();
}