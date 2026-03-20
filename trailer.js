// trailer.js — Animated Book Trailer Generator using Canvas API

// ─── MOOD COLOUR PALETTES ──────────────────────

const TRAILER_PALETTES = {
  dark:        { bg: "#050005", accent: "#8B0040", text: "#FF1493", glow: "rgba(139,0,64,0.4)" },
  romantic:    { bg: "#080008", accent: "#FF1493", text: "#FFB6D9", glow: "rgba(255,20,147,0.4)" },
  melancholic: { bg: "#000510", accent: "#4169E1", text: "#87CEFA", glow: "rgba(65,105,225,0.4)" },
  adventurous: { bg: "#080300", accent: "#FF4500", text: "#FFD700", glow: "rgba(255,69,0,0.4)" },
  hopeful:     { bg: "#000a02", accent: "#27AE60", text: "#98FB98", glow: "rgba(39,174,96,0.4)" },
  peaceful:    { bg: "#000508", accent: "#5DADE2", text: "#AED6F1", glow: "rgba(93,173,226,0.4)" },
  curious:     { bg: "#050008", accent: "#9B59B6", text: "#D2B4DE", glow: "rgba(155,89,182,0.4)" },
  happy:       { bg: "#080500", accent: "#F39C12", text: "#FAD7A0", glow: "rgba(243,156,18,0.4)" },
};

// ─── MOOD WORDS FOR ANIMATION ──────────────────

const MOOD_WORDS = {
  dark:        ["obsession", "shadows", "power", "secrets", "danger"],
  romantic:    ["longing", "desire", "devotion", "passion", "surrender"],
  melancholic: ["memory", "loss", "beauty", "silence", "ache"],
  adventurous: ["courage", "unknown", "freedom", "wild", "destiny"],
  hopeful:     ["light", "possibility", "rebirth", "grace", "wonder"],
  peaceful:    ["stillness", "warmth", "solace", "gentle", "home"],
  curious:     ["mystery", "discovery", "wonder", "truth", "beneath"],
  happy:       ["joy", "laughter", "warmth", "love", "alive"],
};

// ─── MAIN TRAILER CLASS ────────────────────────

class BookTrailer {
  constructor(book, mood, genre) {
    this.book    = book;
    this.mood    = mood || "dark";
    this.genre   = genre || "fiction";
    this.palette = TRAILER_PALETTES[this.mood] || TRAILER_PALETTES.dark;
    this.words   = MOOD_WORDS[this.mood]        || MOOD_WORDS.dark;

    this.canvas  = null;
    this.ctx     = null;
    this.overlay = null;
    this.rafId   = null;
    this.frame   = 0;
    this.phase   = "intro";     // intro → cover → words → title → cta → done
    this.phaseFrame = 0;
    this.coverImg   = null;
    this.coverLoaded = false;
    this.particles  = [];
    this.wordIndex  = 0;
    this.running    = false;

    // Phase durations in frames at 60fps
    this.PHASES = {
      intro:   90,   // 1.5s
      cover:   150,  // 2.5s
      words:   180,  // 3s  (5 words × ~36 frames each)
      title:   150,  // 2.5s
      cta:     120,  // 2s
    };
  }

  // ── Setup ────────────────────────────────────

  async init() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.id = "trailerOverlay";
    this.overlay.className = "trailer-overlay";
    this.overlay.innerHTML = `
      <div class="trailer-ui">
        <button class="trailer-close" id="trailerClose">Close</button>
        <div class="trailer-hint">Screen record to save and share</div>
      </div>
      <canvas id="trailerCanvas" class="trailer-canvas"></canvas>
      <div class="trailer-controls">
        <button class="trailer-replay" id="trailerReplay">Replay</button>
        <button class="trailer-download" id="trailerDownload">Save Poster</button>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.canvas = document.getElementById("trailerCanvas");
    this.ctx    = this.canvas.getContext("2d");
    this.resize();

    // Load cover image
    if (this.book.cover || this.book.isbn) {
      await this.loadCover();
    }

    // Init particles
    this.initParticles();

    // Wire up buttons
    document.getElementById("trailerClose").addEventListener("click", () => this.destroy());
    document.getElementById("trailerReplay").addEventListener("click", () => this.restart());
    document.getElementById("trailerDownload").addEventListener("click", () => this.savePoster());

    // Show overlay
    requestAnimationFrame(() => {
      this.overlay.style.opacity = "1";
    });

    this.start();
  }

  resize() {
    // Square format — best for Instagram and TikTok
    const size = Math.min(window.innerWidth, window.innerHeight, 700);
    this.canvas.width  = size;
    this.canvas.height = size;
    this.W = size;
    this.H = size;
  }

  async loadCover() {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        this.coverImg    = img;
        this.coverLoaded = true;
        resolve();
      };

      img.onerror = () => {
        // Try Google Books as fallback
        if (this.book.isbn) {
          const isbn   = this.book.isbn.replace(/[-\s]/g, "");
          const gbUrl  = `https://books.google.com/books/content?id=&printsec=frontcover&img=1&zoom=3&isbn=${isbn}`;
          img.src = gbUrl;
        } else {
          resolve(); // No cover available
        }
      };

      img.src = this.book.cover
        || `https://covers.openlibrary.org/b/isbn/${this.book.isbn?.replace(/[-\s]/g,"")}-L.jpg`;
    });
  }

  // ── Particles ────────────────────────────────

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 60; i++) {
      this.particles.push({
        x:     Math.random() * this.W,
        y:     Math.random() * this.H,
        r:     Math.random() * 2 + 0.3,
        vx:    (Math.random() - 0.5) * 0.4,
        vy:    (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      });
    }
  }

  drawParticles() {
    const { ctx, palette } = this;
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.phase += p.speed;
      if (p.x < 0) p.x = this.W;
      if (p.x > this.W) p.x = 0;
      if (p.y < 0) p.y = this.H;
      if (p.y > this.H) p.y = 0;

      const alpha = p.alpha * (0.4 + 0.6 * Math.abs(Math.sin(p.phase)));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = palette.accent;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = palette.accent;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  // ── Animation Loop ───────────────────────────

  start() {
    this.running    = true;
    this.frame      = 0;
    this.phaseFrame = 0;
    this.phase      = "intro";
    this.wordIndex  = 0;
    this.loop();
  }

  restart() {
    cancelAnimationFrame(this.rafId);
    this.start();
  }

  loop() {
    if (!this.running) return;
    this.draw();
    this.frame++;
    this.phaseFrame++;

    // Phase transitions
    const duration = this.PHASES[this.phase];
    if (duration && this.phaseFrame >= duration) {
      this.nextPhase();
    }

    this.rafId = requestAnimationFrame(() => this.loop());
  }

  nextPhase() {
    const order = ["intro", "cover", "words", "title", "cta"];
    const idx   = order.indexOf(this.phase);
    if (idx < order.length - 1) {
      this.phase      = order[idx + 1];
      this.phaseFrame = 0;
      if (this.phase === "words") this.wordIndex = 0;
    } else {
      this.phase = "done";
      this.running = false;
    }
  }

  // ── Drawing ──────────────────────────────────

  draw() {
    const { ctx, W, H, palette, phase } = this;

    // Background
    ctx.fillStyle = palette.bg;
    ctx.fillRect(0, 0, W, H);

    // Always draw particles
    this.drawParticles();

    // Phase specific drawing
    switch (phase) {
      case "intro":   this.drawIntro();  break;
      case "cover":   this.drawCover();  break;
      case "words":   this.drawWords();  break;
      case "title":   this.drawTitle();  break;
      case "cta":     this.drawCTA();    break;
      case "done":    this.drawDone();   break;
    }

    // Persistent FIESTA watermark
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle   = palette.accent;
    ctx.font        = `300 ${W * 0.028}px 'Cormorant SC', serif`;
    ctx.textAlign   = "center";
    ctx.fillText("F I E S T A", W / 2, H - W * 0.04);
    ctx.restore();
  }

  // ── Phase: Intro ─────────────────────────────

  drawIntro() {
    const { ctx, W, H, palette, phaseFrame } = this;
    const progress = Math.min(phaseFrame / 60, 1);
    const eased    = this.easeOut(progress);

    // Expanding ring
    ctx.save();
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth   = 1;
    ctx.globalAlpha = (1 - eased) * 0.6;
    const r = eased * W * 0.6;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Genre text
    ctx.save();
    ctx.globalAlpha = eased;
    ctx.fillStyle   = palette.text;
    ctx.font        = `300 ${W * 0.032}px 'Jost', sans-serif`;
    ctx.textAlign   = "center";
    ctx.letterSpacing = "0.4em";
    ctx.fillText(this.genre.toUpperCase(), W / 2, H * 0.45);
    ctx.restore();

    // Mood text
    ctx.save();
    ctx.globalAlpha = eased * 0.6;
    ctx.fillStyle   = palette.accent;
    ctx.font        = `italic ${W * 0.024}px 'Cormorant Garamond', serif`;
    ctx.textAlign   = "center";
    ctx.fillText(`a ${this.mood} story`, W / 2, H * 0.55);
    ctx.restore();
  }

  // ── Phase: Cover ─────────────────────────────

  drawCover() {
    const { ctx, W, H, palette, phaseFrame } = this;
    const progress = Math.min(phaseFrame / 90, 1);
    const eased    = this.easeOut(progress);

    if (this.coverLoaded && this.coverImg) {
      // Cover image with zoom in effect
      const scale    = 0.7 + eased * 0.15;
      const coverW   = W * 0.55 * scale;
      const coverH   = coverW * 1.5;
      const coverX   = (W - coverW) / 2;
      const coverY   = (H - coverH) / 2;

      ctx.save();
      ctx.globalAlpha = eased;

      // Glow behind cover
      ctx.shadowBlur  = 60;
      ctx.shadowColor = palette.glow;
      ctx.drawImage(this.coverImg, coverX, coverY, coverW, coverH);
      ctx.restore();

      // Gradient overlay at bottom
      const grad = ctx.createLinearGradient(0, H * 0.6, 0, H);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, palette.bg);
      ctx.fillStyle = grad;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

    } else {
      // No cover — show elegant text panel
      ctx.save();
      ctx.globalAlpha = eased;
      const panelW = W * 0.65;
      const panelH = panelW * 1.4;
      const panelX = (W - panelW) / 2;
      const panelY = (H - panelH) / 2;

      const grad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
      grad.addColorStop(0, "#1a0010");
      grad.addColorStop(1, "#2a0020");
      ctx.fillStyle = grad;
      ctx.shadowBlur  = 40;
      ctx.shadowColor = palette.glow;
      ctx.fillRect(panelX, panelY, panelW, panelH);

      ctx.strokeStyle = palette.accent;
      ctx.lineWidth   = 1;
      ctx.globalAlpha = eased * 0.5;
      ctx.strokeRect(panelX + 8, panelY + 8, panelW - 16, panelH - 16);
      ctx.restore();
    }

    // Decorative corner lines
    this.drawCornerLines(eased);
  }

  // ── Phase: Words ─────────────────────────────

  drawWords() {
    const { ctx, W, H, palette, phaseFrame } = this;
    const framesPerWord = this.PHASES.words / this.words.length;
    const wordIdx       = Math.floor(phaseFrame / framesPerWord);
    const wordProgress  = (phaseFrame % framesPerWord) / framesPerWord;

    if (wordIdx !== this.wordIndex) {
      this.wordIndex = wordIdx;
    }

    const word = this.words[Math.min(wordIdx, this.words.length - 1)];

    // Keep cover faintly visible
    if (this.coverLoaded && this.coverImg) {
      const coverW = W * 0.5;
      const coverH = coverW * 1.5;
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.drawImage(this.coverImg, (W - coverW) / 2, (H - coverH) / 2, coverW, coverH);
      ctx.restore();
    }

    // Dark vignette
    const vig = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.7);
    vig.addColorStop(0, "transparent");
    vig.addColorStop(1, palette.bg + "CC");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Word flash effect
    const alpha  = wordProgress < 0.15
      ? wordProgress / 0.15
      : wordProgress > 0.85
        ? (1 - wordProgress) / 0.15
        : 1;

    // Glow pulse
    ctx.save();
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle   = palette.accent;
    ctx.shadowBlur  = 80;
    ctx.shadowColor = palette.accent;
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Word
    ctx.save();
    ctx.globalAlpha  = alpha;
    ctx.fillStyle    = palette.text;
    ctx.shadowBlur   = 30;
    ctx.shadowColor  = palette.accent;
    ctx.font         = `300 ${W * 0.11}px 'Cormorant SC', serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, W / 2, H / 2);
    ctx.restore();

    // Small divider line
    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.35, H * 0.6);
    ctx.lineTo(W * 0.65, H * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  // ── Phase: Title ─────────────────────────────

  drawTitle() {
    const { ctx, W, H, palette, phaseFrame } = this;
    const progress = Math.min(phaseFrame / 80, 1);
    const eased    = this.easeOut(progress);

    // Faint cover background
    if (this.coverLoaded && this.coverImg) {
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.drawImage(this.coverImg, 0, 0, W, H);
      ctx.restore();
    }

    // Title background panel
    ctx.save();
    ctx.globalAlpha = eased * 0.85;
    const grad = ctx.createLinearGradient(0, H * 0.25, 0, H * 0.75);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(0.3, palette.bg + "EE");
    grad.addColorStop(0.7, palette.bg + "EE");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.25, W, H * 0.5);
    ctx.restore();

    // Horizontal accent lines
    ctx.save();
    ctx.globalAlpha = eased * 0.6;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth   = 1;
    const lineY1 = H * 0.38;
    const lineY2 = H * 0.62;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, lineY1); ctx.lineTo(W * 0.9, lineY1);
    ctx.moveTo(W * 0.1, lineY2); ctx.lineTo(W * 0.9, lineY2);
    ctx.stroke();
    ctx.restore();

    // Book title — word wrap
    ctx.save();
    ctx.globalAlpha  = eased;
    ctx.fillStyle    = "#ffffff";
    ctx.shadowBlur   = 20;
    ctx.shadowColor  = palette.accent;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";

    const titleWords = this.book.title.split(" ");
    const fontSize   = titleWords.length > 4 ? W * 0.065 : W * 0.08;
    ctx.font = `600 ${fontSize}px 'Cormorant SC', serif`;

    if (this.book.title.length > 25) {
      const mid    = Math.ceil(titleWords.length / 2);
      const line1  = titleWords.slice(0, mid).join(" ");
      const line2  = titleWords.slice(mid).join(" ");
      ctx.fillText(line1, W / 2, H * 0.47);
      ctx.fillText(line2, W / 2, H * 0.47 + fontSize * 1.2);
    } else {
      ctx.fillText(this.book.title, W / 2, H * 0.48);
    }
    ctx.restore();

    // Author
    ctx.save();
    ctx.globalAlpha  = eased * 0.8;
    ctx.fillStyle    = palette.text;
    ctx.font         = `italic ${W * 0.036}px 'Cormorant Garamond', serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.book.author, W / 2, H * 0.58);
    ctx.restore();
  }

  // ── Phase: CTA ───────────────────────────────

  drawCTA() {
    const { ctx, W, H, palette, phaseFrame } = this;
    const progress = Math.min(phaseFrame / 60, 1);
    const eased    = this.easeOut(progress);
    const pulse    = 0.85 + 0.15 * Math.sin(phaseFrame * 0.08);

    // Blurred cover
    if (this.coverLoaded && this.coverImg) {
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.drawImage(this.coverImg, 0, 0, W, H);
      ctx.restore();
    }

    // Central glow
    ctx.save();
    ctx.globalAlpha = 0.2 * pulse;
    const glow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W * 0.45);
    glow.addColorStop(0, palette.accent);
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // FIESTA large
    ctx.save();
    ctx.globalAlpha  = eased;
    ctx.fillStyle    = palette.accent;
    ctx.shadowBlur   = 30 * pulse;
    ctx.shadowColor  = palette.accent;
    ctx.font         = `700 ${W * 0.14}px 'Cormorant SC', serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("FIESTA", W / 2, H * 0.42);
    ctx.restore();

    // Tagline
    ctx.save();
    ctx.globalAlpha  = eased * 0.75;
    ctx.fillStyle    = palette.text;
    ctx.font         = `300 ${W * 0.032}px 'Jost', sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("books for every soul", W / 2, H * 0.54);
    ctx.restore();

    // Divider
    ctx.save();
    ctx.globalAlpha = eased * 0.5;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(W * 0.3, H * 0.6);
    ctx.lineTo(W * 0.7, H * 0.6);
    ctx.stroke();
    ctx.restore();

    // URL
    ctx.save();
    ctx.globalAlpha  = eased * 0.4;
    ctx.fillStyle    = palette.text;
    ctx.font         = `300 ${W * 0.022}px 'Jost', sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(window.location.hostname, W / 2, H * 0.66);
    ctx.restore();
  }

  // ── Phase: Done ──────────────────────────────

  drawDone() {
    // Hold on the last CTA frame
    this.drawCTA();
  }

  // ── Decorative corners ───────────────────────

  drawCornerLines(alpha) {
    const { ctx, W, H, palette } = this;
    const len = W * 0.06;
    const pad = W * 0.04;

    ctx.save();
    ctx.globalAlpha = alpha * 0.5;
    ctx.strokeStyle = palette.accent;
    ctx.lineWidth   = 1;

    const corners = [
      [pad, pad, 1, 1],
      [W - pad, pad, -1, 1],
      [pad, H - pad, 1, -1],
      [W - pad, H - pad, -1, -1],
    ];

    corners.forEach(([x, y, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(x, y); ctx.lineTo(x + dx * len, y);
      ctx.moveTo(x, y); ctx.lineTo(x, y + dy * len);
      ctx.stroke();
    });

    ctx.restore();
  }

  // ── Save Poster ──────────────────────────────

  savePoster() {
    // Jump to title phase and capture
    this.phase      = "title";
    this.phaseFrame = 40;
    this.draw();

    const link = document.createElement("a");
    link.download = `fiesta-${this.book.title.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.png`;
    link.href = this.canvas.toDataURL("image/png");
    link.click();
  }

  // ── Cleanup ──────────────────────────────────

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    this.overlay?.remove();
  }

  // ── Utility ──────────────────────────────────

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }
}

// ─── TRIGGER TRAILER ──────────────────────────

function showBookTrailer(book, mood, genre) {
  // Remove any existing trailer
  document.getElementById("trailerOverlay")?.remove();

  const trailer = new BookTrailer(book, mood, genre);
  trailer.init();
}