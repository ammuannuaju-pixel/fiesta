/* ================================================
   FIESTA — Book Recommendation App
   script.js
   ================================================ */

"use strict";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────

const SUBGENRES = {
  romance:    ["Contemporary Romance","Historical Romance","Paranormal Romance","Dark Romance","Romantic Comedy","Slow Burn"],
  fantasy:    ["Epic Fantasy","Dark Fantasy","Urban Fantasy","Romantasy","High Fantasy","Fae and Magic"],
  mystery:    ["Cozy Mystery","Noir Detective","Psychological Mystery","True Crime","Locked Room","Whodunit"],
  scifi:      ["Space Opera","Dystopian","Cyberpunk","Hard Sci-Fi","Time Travel","AI and Robots"],
  thriller:   ["Psychological Thriller","Legal Thriller","Political Thriller","Domestic Thriller","Espionage","Medical Thriller"],
  literary:   ["Character Study","Experimental","Coming of Age","Family Saga","Social Commentary","Philosophical"],
  historical: ["Medieval","Victorian Era","World Wars","Ancient Civilizations","Renaissance","Colonial Era"],
  nonfiction: ["Memoir and Biography","Popular Science","Psychology","Philosophy","True Crime","Self Development"],
};

const SUBGENRE_QUESTIONS = {
  romance:    "What kind of love story calls to you?",
  fantasy:    "Which magical world do you wish to enter?",
  mystery:    "What type of mystery intrigues you?",
  scifi:      "Which corner of the universe beckons?",
  thriller:   "What keeps you up at night?",
  literary:   "What kind of literature moves you?",
  historical: "Which era do you wish to visit?",
  nonfiction: "What do you want to explore?",
};

const MOOD_LABELS = {
  happy:       "joyful and light",
  melancholic: "wistful and reflective",
  adventurous: "bold and restless",
  peaceful:    "calm and serene",
  dark:        "dark and intense",
  hopeful:     "hopeful and inspired",
  romantic:    "yearning and romantic",
  curious:     "curious and intrigued",
};

const LENGTH_LABELS = {
  short:  "under 300 pages",
  medium: "300 to 500 pages",
  long:   "over 500 pages",
};

// YouTube video IDs: ambient/atmospheric playlists per genre
const MUSIC_MAP = {
  romance:    { title: "Romantic Piano Ambient",      vibe: "Soft and Dreamy",        vid: "kWNhygD3e_o" },
  fantasy:    { title: "Enchanted Realms Soundtrack", vibe: "Magical and Epic",        vid: "HGl75kurxok" },
  mystery:    { title: "Noir Jazz and Dark Ambience",  vibe: "Dark and Atmospheric",   vid: "4oStw0r33so" },
  scifi:      { title: "Interstellar Space Ambient",  vibe: "Cosmic and Ethereal",     vid: "MgTHPd4gYTc" },
  thriller:   { title: "Tension Cinematic Scores",    vibe: "Tense and Cinematic",     vid: "IrznRnzKPGk" },
  literary:   { title: "Classic Jazz and Piano",      vibe: "Intellectual and Refined", vid: "Dx5qFachd3A" },
  historical: { title: "Period Orchestral Suite",     vibe: "Grand and Timeless",      vid: "e3SRz9Sph5A" },
  nonfiction: { title: "Focus Flow Instrumental",     vibe: "Clear and Focused",       vid: "jfKfPfyJRdk" },
};

const SEASONAL_MESSAGES = {
  christmas:  "Wishing you a season filled with warm stories and cozy pages",
  newyear:    "May the new year bring you books that change your life forever",
  valentine:  "Books are love letters written from an author to their readers",
  halloween:  "The best mysteries lurk between the pages — if you dare",
  diwali:     "Let stories illuminate your soul this radiant festive season",
  spring:     "New seasons, new stories, new beginnings await you",
  summer:     "Long golden days and even longer adventures between covers",
  default:    "Every page turned is a new world discovered",
};

// ─────────────────────────────────────────────
//  SEASONAL DETECTION
// ─────────────────────────────────────────────

function detectSeason() {
  const now = new Date();
  const m = now.getMonth(); // 0-indexed
  const d = now.getDate();

  if (m === 11 && d >= 1  && d <= 26)  return "christmas";
  if ((m === 11 && d >= 27) || (m === 0 && d <= 7)) return "newyear";
  if (m === 1  && d >= 10 && d <= 14)  return "valentine";
  if (m === 9  && d >= 25)             return "halloween";
  if ((m === 9 && d >= 10) || (m === 10 && d <= 20)) return "diwali";
  if (m >= 2 && m <= 4)                return "spring";
  if (m >= 5 && m <= 7)                return "summer";
  return "default";
}

// ─────────────────────────────────────────────
//  CANVAS PARTICLES
// ─────────────────────────────────────────────

const canvas  = document.getElementById("seasonalCanvas");
const ctx     = canvas.getContext("2d");
let particles = [];
let fireworks = [];
let fwTimer   = 0;
let rafId     = null;
let canvasActive = false;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

// ── Particle classes ──────────────────────────

class Snowflake {
  constructor() { this.reset(true); }
  reset(init) {
    this.x    = Math.random() * canvas.width;
    this.y    = init ? Math.random() * canvas.height : -8;
    this.r    = Math.random() * 3.5 + 1;
    this.vy   = Math.random() * 1.2 + 0.4;
    this.vx   = Math.random() * 0.4 - 0.2;
    this.a    = Math.random() * 0.65 + 0.25;
    this.hue  = Math.random() > 0.5 ? "#FFB6D9" : "#ffffff";
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.y > canvas.height + 10) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.fillStyle   = this.hue;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class ChristmasLight {
  constructor() { this.reset(); }
  reset() {
    this.x       = Math.random() * canvas.width;
    this.y       = Math.random() * (canvas.height * 0.25) + 10;
    this.r       = Math.random() * 5 + 3;
    this.phase   = Math.random() * Math.PI * 2;
    this.speed   = Math.random() * 0.04 + 0.015;
    const colors = ["#FF1493","#FF0040","#00e5ff","#ffd700","#adff2f","#FF69B4"];
    this.color   = colors[Math.floor(Math.random() * colors.length)];
  }
  update() { this.phase += this.speed; }
  draw() {
    const alpha = 0.35 + 0.65 * Math.abs(Math.sin(this.phase));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.shadowBlur  = 16;
    ctx.shadowColor = this.color;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Petal {
  constructor() { this.reset(true); }
  reset(init) {
    this.x    = Math.random() * canvas.width;
    this.y    = init ? Math.random() * canvas.height : -12;
    this.w    = Math.random() * 12 + 5;
    this.h    = (this.w * 0.55);
    this.vy   = Math.random() * 1.3 + 0.4;
    this.vx   = Math.random() * 0.9 - 0.45;
    this.rot  = Math.random() * Math.PI * 2;
    this.drot = Math.random() * 0.04 - 0.02;
    this.a    = Math.random() * 0.5 + 0.3;
    this.pink = Math.random() > 0.45;
  }
  update() {
    this.y += this.vy; this.x += this.vx; this.rot += this.drot;
    if (this.y > canvas.height + 20) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.fillStyle = this.pink ? "#FF69B4" : "#FFB6C1";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.w, this.h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class TwinkleStar {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 2 + 0.5;
    this.ph = Math.random() * Math.PI * 2;
    this.sp = Math.random() * 0.04 + 0.01;
    this.a  = Math.random() * 0.5 + 0.2;
  }
  update() { this.ph += this.sp; }
  draw() {
    const alpha = this.a * (0.4 + 0.6 * Math.abs(Math.sin(this.ph)));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle   = "#FF99CC";
    ctx.shadowBlur  = 5;
    ctx.shadowColor = "#FF1493";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Bat {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() < 0.5 ? -30 : canvas.width + 30;
    this.y  = Math.random() * (canvas.height * 0.55) + 20;
    this.sz = Math.random() * 14 + 8;
    this.vx = (this.x < 0 ? 1 : -1) * (Math.random() * 1.5 + 0.5);
    this.vy = Math.random() * 0.3 - 0.15;
    this.wh = 0;
    this.ws = Math.random() * 0.12 + 0.08;
    this.a  = Math.random() * 0.5 + 0.35;
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.wh += this.ws;
    if (this.x > canvas.width + 50 || this.x < -50) this.reset();
  }
  draw() {
    const wf = Math.sin(this.wh) * 0.35 + 0.65;
    ctx.save();
    ctx.globalAlpha = this.a;
    ctx.fillStyle   = "#6a003a";
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.sz * 0.28, this.sz * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
    // left wing
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x - this.sz * wf, this.y - this.sz * 0.45 * wf, this.x - this.sz * 1.15, this.y + this.sz * 0.3, this.x - this.sz * 0.3, this.y + this.sz * 0.1);
    ctx.fill();
    // right wing
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x + this.sz * wf, this.y - this.sz * 0.45 * wf, this.x + this.sz * 1.15, this.y + this.sz * 0.3, this.x + this.sz * 0.3, this.y + this.sz * 0.1);
    ctx.fill();
    ctx.restore();
  }
}

// ── Fireworks ─────────────────────────────────

class FWParticle {
  constructor(x, y, color) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.2;
    this.x  = x; this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.r  = Math.random() * 2.5 + 0.8;
    this.c  = color;
    this.life = 1;
    this.decay = Math.random() * 0.018 + 0.009;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.09;
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.life -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle   = this.c;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = this.c;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Firework {
  constructor() {
    const COLORS = ["#FF1493","#FFD700","#FF4500","#00FFFF","#FF69B4","#ADFF2F","#FF6347","#DA70D6"];
    this.x       = Math.random() * canvas.width;
    this.y       = canvas.height + 20;
    this.ty      = Math.random() * canvas.height * 0.45 + 50;
    this.speed   = Math.random() * 4 + 3.5;
    this.color   = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.burst   = false;
    this.parts   = [];
    this.trail   = [];
  }
  update() {
    if (!this.burst) {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 6) this.trail.shift();
      this.y -= this.speed;
      if (this.y <= this.ty) {
        this.burst = true;
        for (let i = 0; i < 70; i++) this.parts.push(new FWParticle(this.x, this.y, this.color));
      }
    } else {
      this.parts.forEach(p => p.update());
      this.parts = this.parts.filter(p => p.life > 0);
    }
  }
  draw() {
    if (!this.burst) {
      this.trail.forEach((t, i) => {
        ctx.save();
        ctx.globalAlpha = (i / this.trail.length) * 0.45;
        ctx.fillStyle   = this.color;
        ctx.beginPath(); ctx.arc(t.x, t.y, 2, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
      ctx.save();
      ctx.fillStyle   = this.color;
      ctx.shadowBlur  = 10; ctx.shadowColor = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      this.parts.forEach(p => p.draw());
    }
  }
  done() { return this.burst && this.parts.length === 0; }
}

// ── Init particles by season ──────────────────

function initParticles(season) {
  particles = [];
  fireworks = [];
  fwTimer   = 0;

  if (season === "christmas") {
    for (let i = 0; i < 90; i++)  particles.push(new Snowflake());
    for (let i = 0; i < 55; i++)  particles.push(new ChristmasLight());
  } else if (season === "newyear") {
    for (let i = 0; i < 25; i++)  particles.push(new TwinkleStar());
  } else if (season === "diwali") {
    for (let i = 0; i < 30; i++)  particles.push(new TwinkleStar());
  } else if (season === "halloween") {
    for (let i = 0; i < 14; i++)  particles.push(new Bat());
    for (let i = 0; i < 25; i++)  particles.push(new TwinkleStar());
  } else if (season === "valentine") {
    for (let i = 0; i < 55; i++)  particles.push(new Petal());
    for (let i = 0; i < 20; i++)  particles.push(new TwinkleStar());
  } else if (season === "spring") {
    for (let i = 0; i < 65; i++)  particles.push(new Petal());
  } else if (season === "summer") {
    for (let i = 0; i < 80; i++)  particles.push(new TwinkleStar());
  } else {
    // default — soft starfield
    for (let i = 0; i < 55; i++)  particles.push(new TwinkleStar());
  }
}

function startCanvasLoop(season) {
  if (rafId) cancelAnimationFrame(rafId);

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (canvasActive) {
      // Firework-based seasons
      if (season === "diwali" || season === "newyear") {
        fwTimer++;
        if (fwTimer % 70 === 0) fireworks.push(new Firework());
        fireworks = fireworks.filter(f => !f.done());
        fireworks.forEach(f => { f.update(); f.draw(); });
      }
      particles.forEach(p => { p.update(); p.draw(); });
    }

    rafId = requestAnimationFrame(frame);
  }
  frame();
}

// Scroll-triggered visibility
window.addEventListener("scroll", () => {
  const threshold = window.innerHeight * 0.28;
  if (window.scrollY > threshold) {
    if (!canvasActive) {
      canvasActive = true;
      canvas.classList.add("active");
    }
  } else {
    if (canvasActive) {
      canvasActive = false;
      canvas.classList.remove("active");
    }
  }
}, { passive: true });

// ─────────────────────────────────────────────
//  SEASONAL BANNER
// ─────────────────────────────────────────────

function setupBanner(season) {
  const el = document.getElementById("seasonalBanner");
  el.textContent = SEASONAL_MESSAGES[season] || SEASONAL_MESSAGES.default;
  el.classList.remove("hidden");
}

// ─────────────────────────────────────────────
//  QUIZ STATE
// ─────────────────────────────────────────────

const sel = { genre: null, subgenre: null, mood: null, length: null };
let currentStep = 1;

function goToStep(n) {
  document.querySelectorAll(".quiz-step").forEach(s => s.classList.remove("active"));
  document.getElementById(`step${n}`).classList.add("active");
  currentStep = n;

  document.getElementById("progressFill").style.width = `${n * 25}%`;
  document.getElementById("progressFill").parentElement.setAttribute("aria-valuenow", n * 25);
  document.getElementById("progressText").textContent  = `Step ${n} of 4`;
}

// ── Step 1: Genre ──────────────────────────────
document.querySelectorAll("#step1 .option-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#step1 .option-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    sel.genre = btn.dataset.value;
    buildSubgenre(sel.genre);
    setTimeout(() => goToStep(2), 380);
  });
});

// ── Step 2: Sub-genre (dynamic) ───────────────
function buildSubgenre(genre) {
  const grid = document.getElementById("subgenreGrid");
  const q    = document.getElementById("subgenreQ");
  q.textContent = SUBGENRE_QUESTIONS[genre] || "Narrow it down...";
  grid.innerHTML = "";

  (SUBGENRES[genre] || []).forEach(sg => {
    const btn = document.createElement("button");
    btn.className   = "option-btn";
    btn.textContent = sg;
    btn.dataset.value = sg;
    btn.addEventListener("click", () => {
      grid.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      sel.subgenre = sg;
      setTimeout(() => goToStep(3), 380);
    });
    grid.appendChild(btn);
  });
}

// ── Step 3: Mood ──────────────────────────────
document.querySelectorAll("#step3 .option-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#step3 .option-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    sel.mood = btn.dataset.value;
    setTimeout(() => goToStep(4), 380);
  });
});

// ── Step 4: Length ────────────────────────────
const revealBtn = document.getElementById("revealBtn");

document.querySelectorAll("#step4 .option-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#step4 .option-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    sel.length = btn.dataset.value;
    revealBtn.disabled = false;
  });
});

// ── Submit ────────────────────────────────────
revealBtn.addEventListener("click", async () => {
  if (!sel.length) return;

  const resultsSection = document.getElementById("results");
  resultsSection.classList.remove("hidden");
  setTimeout(() => resultsSection.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

  setupMusicBar(sel.genre);
  await fetchBooks();
  if (typeof saveQuizResult === "function" && currentUser) saveQuizResult(sel, []);
  if (typeof renderReaderTwins === "function") renderReaderTwins();
  if (typeof renderFeed === "function") renderFeed();
  if (typeof enterReadingRoom === "function") enterReadingRoom(sel.genre, sel.mood);
  if (typeof triggerArchetypeCard === "function") triggerArchetypeCard();
  if (typeof triggerAuthModalIfNeeded === "function") triggerAuthModalIfNeeded();
});

// ─────────────────────────────────────────────
//  MUSIC PLAYER
// ─────────────────────────────────────────────

let musicOn = false;

function setupMusicBar(genre) {
  const m = MUSIC_MAP[genre] || MUSIC_MAP.literary;
  document.getElementById("musicName").textContent = m.title;
  document.getElementById("musicVibe").textContent = m.vibe;
}

document.getElementById("musicBtn").addEventListener("click", toggleMusic);

function toggleMusic() {
  musicOn = !musicOn;
  const btn   = document.getElementById("musicBtn");
  const wrap  = document.getElementById("ytWrap");
  const waves = document.getElementById("musicWaves");
  const frame = document.getElementById("ytFrame");

  if (musicOn) {
    const genre = sel.genre || "literary";
    const m = MUSIC_MAP[genre] || MUSIC_MAP.literary;
    frame.src = `https://www.youtube-nocookie.com/embed/${m.vid}?autoplay=1&loop=1&playlist=${m.vid}&controls=0&disablekb=1&modestbranding=1`;
    wrap.classList.remove("hidden");
    btn.textContent = "Disable Music";
    btn.classList.add("on");
    waves.classList.remove("paused");
  } else {
    frame.src = "";
    wrap.classList.add("hidden");
    btn.textContent = "Enable Music";
    btn.classList.remove("on");
    waves.classList.add("paused");
  }
}

// ─────────────────────────────────────────────
//  COVER CACHE — avoids Google Books rate limits
// ─────────────────────────────────────────────

const COVER_CACHE_KEY = "fiesta_covers";
const COVER_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCachedCover(key) {
  try {
    const cache = JSON.parse(localStorage.getItem(COVER_CACHE_KEY) || "{}");
    const entry = cache[key];
    if (entry && Date.now() - entry.ts < COVER_CACHE_TTL) return entry.url;
  } catch (e) { /* silent */ }
  return null;
}

function setCachedCover(key, url) {
  try {
    const cache = JSON.parse(localStorage.getItem(COVER_CACHE_KEY) || "{}");
    cache[key]  = { url, ts: Date.now() };
    const keys  = Object.keys(cache);
    if (keys.length > 100) delete cache[keys[0]];
    localStorage.setItem(COVER_CACHE_KEY, JSON.stringify(cache));
  } catch (e) { /* silent */ }
}

async function fetchCoverWithCache(isbn, title, author) {
  const cacheKey = isbn || title;
  const cached   = getCachedCover(cacheKey);
  if (cached) return cached;

  await new Promise(r => setTimeout(r, 300));

  let cover = "";

  if (isbn) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`
      );
      if (res.status === 429) return "";
      const dat = await res.json();
      cover = dat.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
        ?.replace("http://", "https://") || "";
    } catch (e) { /* silent */ }
  }

  if (!cover) {
    try {
      await new Promise(r => setTimeout(r, 300));
      const q   = encodeURIComponent(`intitle:${title} inauthor:${author}`);
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1`
      );
      if (res.status === 429) return "";
      const dat = await res.json();
      cover = dat.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
        ?.replace("http://", "https://") || "";
    } catch (e) { /* silent */ }
  }

  if (cover) setCachedCover(cacheKey, cover);
  return cover;
}

async function enrichBooksWithCovers(books) {
  const enriched = [];
  for (const book of books) {
    if (book.cover) {
      enriched.push(book);
      continue;
    }
    const cover = await fetchCoverWithCache(
      book.isbn?.replace(/[-\s]/g, ""),
      book.title,
      book.author
    );
    enriched.push({ ...book, cover });
  }
  return enriched;
}

// ─────────────────────────────────────────────
//  FETCH BOOKS — CURATED + GOOGLE BOOKS
// ─────────────────────────────────────────────

async function fetchBooks() {
  const loadingWrap = document.getElementById("loadingWrap");
  const booksGrid   = document.getElementById("booksGrid");
  const subtitle    = document.getElementById("resultsSubtitle");

  loadingWrap.classList.remove("hidden");
  booksGrid.innerHTML = "";
  subtitle.textContent = "";

  const moodLabel = MOOD_LABELS[sel.mood] || sel.mood || "reflective";

  await new Promise(r => setTimeout(r, 800));

  try {
    // Get curated seed books first
    const seedBooks = typeof getSeededBooks === "function"
      ? getSeededBooks(sel.genre, sel.mood)
      : [];

    // If we have 6 good seed books use them directly
    if (seedBooks.length >= 6) {
      const enriched = await enrichBooksWithCovers(seedBooks);
      loadingWrap.classList.add("hidden");
      subtitle.textContent = `Six books curated for your ${moodLabel} soul`;
      renderBooks(enriched);
      if (typeof initBookTrailers === "function") setTimeout(initBookTrailers, 100);
      return;
    }

    // Otherwise supplement with Google Books
    const query = buildSearchQuery(sel.genre, sel.subgenre, sel.mood);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12&orderBy=relevance&printType=books&langRestrict=en`;

    const response = await fetch(url);
    const data = await response.json();

    const googleBooks = (data.items || [])
      .filter(item => {
        const info = item.volumeInfo;
        return info.title && info.authors && info.description;
      })
      .map(item => {
        const info = item.volumeInfo;
        const isbn = info.industryIdentifiers?.find(id => id.type === "ISBN_13")?.identifier
                  || info.industryIdentifiers?.find(id => id.type === "ISBN_10")?.identifier
                  || "";
        return {
          title:       info.title,
          author:      info.authors?.[0] || "Unknown Author",
          isbn:        isbn,
          year:        info.publishedDate?.slice(0, 4) || "",
          description: (info.description?.slice(0, 220) || "") + "...",
          tags:        info.categories?.slice(0, 3) || [sel.genre],
          cover:       info.imageLinks?.thumbnail?.replace("http://", "https://") || ""
        };
      });

    // Combine seed books with Google Books, deduplicate
    const allBooks   = [...seedBooks, ...googleBooks];
    const seen       = new Set();
    const combined   = allBooks.filter(b => {
      if (seen.has(b.title)) return false;
      seen.add(b.title);
      return true;
    }).slice(0, 6);

    const finalBooks = combined.length > 0 ? combined : seedBooks.slice(0, 6);

    if (finalBooks.length === 0) throw new Error("No books found");

    const enrichedFinal = await enrichBooksWithCovers(finalBooks);

    loadingWrap.classList.add("hidden");
    subtitle.textContent = `Six books curated for your ${moodLabel} soul`;
    renderBooks(enrichedFinal);
    if (typeof initBookTrailers === "function") setTimeout(initBookTrailers, 100);

  } catch (err) {
    console.error("Book fetch error:", err);
    // Fallback to seed books if everything else fails
    const fallback = typeof getSeededBooks === "function"
      ? getSeededBooks(sel.genre, sel.mood)
      : [];
    if (fallback.length > 0) {
      const enrichedFallback = await enrichBooksWithCovers(fallback);
      loadingWrap.classList.add("hidden");
      subtitle.textContent = `Six books curated for your ${moodLabel} soul`;
      renderBooks(enrichedFallback);
      if (typeof initBookTrailers === "function") setTimeout(initBookTrailers, 100);
    } else {
      loadingWrap.innerHTML = `<p style="color:var(--pink-pale);font-family:var(--font-i);font-style:italic">Something went wrong while curating your list. Please try again.</p>`;
    }
  }
}

function buildSearchQuery(genre, subgenre, mood) {
  const subgenreMap = {
    "Dark Romance":           "dark romance novel",
    "Contemporary Romance":   "contemporary romance novel",
    "Historical Romance":     "historical romance novel",
    "Paranormal Romance":     "paranormal romance novel",
    "Romantic Comedy":        "romantic comedy novel",
    "Slow Burn":              "slow burn romance novel",
    "Epic Fantasy":           "epic fantasy novel",
    "Dark Fantasy":           "dark fantasy novel",
    "Urban Fantasy":          "urban fantasy novel",
    "Romantasy":              "fantasy romance novel",
    "High Fantasy":           "high fantasy novel",
    "Fae and Magic":          "fae fantasy novel",
    "Cozy Mystery":           "cozy mystery novel",
    "Noir Detective":         "noir detective novel",
    "Psychological Mystery":  "psychological mystery novel",
    "True Crime":             "true crime book",
    "Locked Room":            "locked room mystery novel",
    "Whodunit":               "whodunit mystery novel",
    "Space Opera":            "space opera science fiction",
    "Dystopian":              "dystopian fiction novel",
    "Cyberpunk":              "cyberpunk science fiction",
    "Hard Sci-Fi":            "hard science fiction novel",
    "Time Travel":            "time travel fiction novel",
    "AI and Robots":          "artificial intelligence fiction",
    "Psychological Thriller": "psychological thriller novel",
    "Legal Thriller":         "legal thriller novel",
    "Political Thriller":     "political thriller novel",
    "Domestic Thriller":      "domestic thriller novel",
    "Espionage":              "espionage spy thriller",
    "Medical Thriller":       "medical thriller novel",
    "Character Study":        "literary fiction character",
    "Experimental":           "experimental literary fiction",
    "Coming of Age":          "coming of age novel",
    "Family Saga":            "family saga fiction",
    "Social Commentary":      "social commentary fiction",
    "Philosophical":          "philosophical fiction novel",
    "Medieval":               "medieval historical fiction",
    "Victorian Era":          "victorian historical fiction",
    "World Wars":             "world war historical fiction",
    "Ancient Civilizations":  "ancient historical fiction",
    "Renaissance":            "renaissance historical fiction",
    "Colonial Era":           "colonial historical fiction",
    "Memoir and Biography":   "memoir biography",
    "Popular Science":        "popular science book",
    "Psychology":             "psychology book",
    "Philosophy":             "philosophy book",
    "Self Development":       "self help book",
  };
  const searchTerm = subgenreMap[subgenre] || `${subgenre} ${genre}`;
  return `subject:${genre} ${searchTerm} bestseller`;
}

// ─────────────────────────────────────────────
//  RENDER BOOKS
// ─────────────────────────────────────────────

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

function renderBooks(books) {
  const grid = document.getElementById("booksGrid");

  books.forEach((book, i) => {
    const isbn    = book.isbn ? String(book.isbn).replace(/[-\s]/g, "") : "";
    const coverURL = book.cover || (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : "");

    const tagsHTML = Array.isArray(book.tags)
      ? book.tags.map(t => `<span class="book-tag">${esc(t)}</span>`).join("")
      : "";

    const annId = isbn || book.title.replace(/\s+/g, "_").slice(0, 40);

    const card = document.createElement("div");
    card.className = "book-card";
    card.style.animationDelay = `${i * 0.1}s`;

    card.innerHTML = `
      <div class="book-cover-wrap">
        ${coverURL
          ? `<img
               class="book-cover"
               src="${esc(coverURL)}"
               alt="Cover of ${esc(book.title)}"
               loading="lazy"
             />`
          : buildFallback(book)
        }
        <div class="cover-overlay"></div>
      </div>
      <div class="book-info">
        <div class="book-title">${esc(book.title)}</div>
        <div class="book-author">${esc(book.author)}${book.year ? ` &middot; ${esc(book.year)}` : ""}</div>
        <div class="book-desc">${esc(book.description)}</div>
        ${tagsHTML ? `<div class="book-tags">${tagsHTML}</div>` : ""}
        <button class="save-to-shelf-btn"
          data-title="${esc(book.title)}"
          data-author="${esc(book.author)}"
          data-isbn="${esc(isbn)}"
          data-genre="${esc(sel.genre || '')}"
          data-mood="${esc(sel.mood || '')}"
          data-cover="${esc(book.cover || '')}">
          Save to Shelf
        </button>
        <div class="annotation-section" id="ann-${esc(annId)}">
          <div class="annotation-list" id="annlist-${esc(annId)}">
            <div class="ann-loading">Loading reactions...</div>
          </div>
          <div class="annotation-input-wrap">
            <input
              type="text"
              class="annotation-input"
              placeholder="Leave a reaction..."
              maxlength="150"
              data-isbn="${esc(annId)}"
              data-title="${esc(book.title)}"
            />
            <button
              class="annotation-submit"
              data-isbn="${esc(annId)}"
              data-title="${esc(book.title)}"
            >Post</button>
          </div>
        </div>
      </div>
    `;

    // Handle failed cover images
    if (coverURL) {
      const img = card.querySelector("img.book-cover");
      img.addEventListener("error", () => {
        const wrap = card.querySelector(".book-cover-wrap");
        img.remove();
        const overlay = wrap.querySelector(".cover-overlay");
        wrap.insertBefore(createFallbackEl(book), overlay);
      });
    }

    grid.appendChild(card);

    // Load annotations for this book
    if (typeof loadAndRenderAnnotations === "function") {
      loadAndRenderAnnotations(annId);
    }

    // Wire up the post button
    const submitBtn = card.querySelector(".annotation-submit");
    const inputEl   = card.querySelector(".annotation-input");

    submitBtn.addEventListener("click", async () => {
      const content = inputEl.value.trim();
      if (!content) return;
      submitBtn.disabled = true;
      submitBtn.textContent = "Posting...";
      if (typeof postAnnotation === "function") {
        await postAnnotation(annId, book.title, content);
      }
      inputEl.value = "";
      submitBtn.textContent = "Post";
      submitBtn.disabled = false;
      if (typeof loadAndRenderAnnotations === "function") {
        loadAndRenderAnnotations(annId);
      }
    });

    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") submitBtn.click();
    });

    // Wire up save to shelf button
    const saveBtn = card.querySelector(".save-to-shelf-btn");
    if (saveBtn) {
      saveBtn.addEventListener("click", async () => {
        if (!currentUser) { if (typeof showAuthModal === "function") showAuthModal(); return; }
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
        const { error } = await db.from("bookshelf").upsert({
          user_id: currentUser.id,
          title:   saveBtn.dataset.title,
          author:  saveBtn.dataset.author,
          isbn:    saveBtn.dataset.isbn || "",
          cover:   saveBtn.dataset.cover || "",
          genre:   saveBtn.dataset.genre || "",
          mood:    saveBtn.dataset.mood  || "",
          source:  "quiz",
          added_at: new Date().toISOString()
        }, { onConflict: "user_id,title" });
        saveBtn.textContent = error ? "Failed" : "Saved";
      });
    }

  });
}

function buildFallback(book) {
  return `<div class="book-fallback">
    <div class="fallback-title">${esc(book.title)}</div>
    <div class="fallback-sep"></div>
    <div class="fallback-author">${esc(book.author)}</div>
  </div>`;
}

function createFallbackEl(book) {
  const div = document.createElement("div");
  div.className = "book-fallback";
  div.innerHTML = `
    <div class="fallback-title">${esc(book.title)}</div>
    <div class="fallback-sep"></div>
    <div class="fallback-author">${esc(book.author)}</div>
  `;
  return div;
}

// ─────────────────────────────────────────────
//  RESTART
// ─────────────────────────────────────────────

document.getElementById("restartBtn").addEventListener("click", () => {
  // Clear selections
  sel.genre = sel.subgenre = sel.mood = sel.length = null;

  // Reset music
  if (musicOn) toggleMusic();
  document.getElementById("musicWaves").classList.add("paused");

  // Reset quiz UI
  document.querySelectorAll(".option-btn").forEach(b => b.classList.remove("selected"));
  document.getElementById("subgenreGrid").innerHTML = "";
  revealBtn.disabled = true;
  goToStep(1);

  // Hide results
  document.getElementById("results").classList.add("hidden");
  document.getElementById("loadingWrap").classList.remove("hidden");
  document.getElementById("loadingWrap").innerHTML =
    `<div class="loader-ring"></div><p class="loader-text">Curating your perfect reads...</p>`;
  document.getElementById("booksGrid").innerHTML = "";
  document.getElementById("resultsSubtitle").textContent = "";

  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ─────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────

function init() {
  resizeCanvas();
  const season = detectSeason();
  initParticles(season);
  startCanvasLoop(season);
  setupBanner(season);

  revealBtn.disabled = true;
  goToStep(1);

  // Load Book of the Day and Check-in after auth initializes
  setTimeout(() => {
    if (typeof renderBookOfDay     === "function") renderBookOfDay();
    if (typeof renderCheckinWidget === "function") renderCheckinWidget();
  }, 1000);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  const season = detectSeason();
  initParticles(season);
}, { passive: true });

init();