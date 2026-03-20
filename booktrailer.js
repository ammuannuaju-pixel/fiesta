// booktrailer.js — Cinematic book trailer generator

// ─── TRIGGER ON HOVER ──────────────────────────

function initBookTrailers() {
  document.querySelectorAll(".book-card").forEach(card => {
    let trailerTimeout = null;
    let trailerActive  = false;

    card.addEventListener("mouseenter", () => {
      trailerTimeout = setTimeout(() => {
        if (!trailerActive) {
          trailerActive = true;
          playBookTrailer(card);
        }
      }, 600); // delay before trailer starts
    });

    card.addEventListener("mouseleave", () => {
      clearTimeout(trailerTimeout);
      stopBookTrailer(card);
      trailerActive = false;
    });
  });
}

// ─── PLAY TRAILER ──────────────────────────────

function playBookTrailer(card) {
  const title  = card.querySelector(".book-title")?.textContent  || "";
  const author = card.querySelector(".book-author")?.textContent || "";
  const coverImg = card.querySelector("img.book-cover");
  const coverWrap = card.querySelector(".book-cover-wrap");

  if (!coverWrap) return;

  // Create canvas overlay on the cover
  const canvas  = document.createElement("canvas");
  canvas.className = "trailer-canvas";
  canvas.width  = coverWrap.offsetWidth  || 240;
  canvas.height = coverWrap.offsetHeight || 300;
  coverWrap.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let frame = 0;
  let rafId = null;

  // Genre colour from card tags
  const genreTag = card.querySelector(".book-tag");
  const accentColor = "#FF1493";

  // Mood words from tags
  const tags = Array.from(card.querySelectorAll(".book-tag"))
    .map(t => t.textContent.trim())
    .slice(0, 3);

  const TOTAL_FRAMES = 180; // 3 seconds at 60fps

  function drawFrame() {
    const w = canvas.width;
    const h = canvas.height;
    const progress = frame / TOTAL_FRAMES; // 0 to 1

    ctx.clearRect(0, 0, w, h);

    // ── Phase 1 (0-0.3): Dark overlay fades in ──
    if (progress <= 0.3) {
      const alpha = (progress / 0.3) * 0.88;
      ctx.fillStyle = `rgba(5, 0, 10, ${alpha})`;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = "rgba(5, 0, 10, 0.88)";
      ctx.fillRect(0, 0, w, h);
    }

    // ── Phase 2 (0.2-0.5): Pink glow line sweeps down ──
    if (progress >= 0.2 && progress <= 0.5) {
      const lineProgress = (progress - 0.2) / 0.3;
      const lineY = h * lineProgress;
      const gradient = ctx.createLinearGradient(0, lineY - 40, 0, lineY + 40);
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(0.5, accentColor + "88");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, lineY - 40, w, 80);
    }

    // ── Phase 3 (0.3-0.6): Title appears letter by letter ──
    if (progress >= 0.3) {
      const titleProgress = Math.min(1, (progress - 0.3) / 0.3);
      const charsToShow   = Math.floor(title.length * titleProgress);
      const displayTitle  = title.slice(0, charsToShow);

      ctx.save();
      ctx.font         = `600 ${Math.min(22, w / (title.length * 0.55))}px 'Cormorant SC', serif`;
      ctx.fillStyle    = "#ffffff";
      ctx.textAlign    = "center";
      ctx.shadowBlur   = 20;
      ctx.shadowColor  = accentColor;
      ctx.globalAlpha  = titleProgress;

      // Word wrap title
      const words     = displayTitle.split(" ");
      const maxWidth  = w - 24;
      let lines       = [];
      let currentLine = "";

      words.forEach(word => {
        const testLine = currentLine ? currentLine + " " + word : word;
        if (ctx.measureText(testLine).width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);

      const lineHeight = 28;
      const startY = h * 0.35 - (lines.length * lineHeight) / 2;
      lines.forEach((line, idx) => {
        ctx.fillText(line, w / 2, startY + idx * lineHeight);
      });

      ctx.restore();
    }

    // ── Phase 4 (0.5-0.7): Divider line draws ──
    if (progress >= 0.5) {
      const lineProgress = Math.min(1, (progress - 0.5) / 0.2);
      const lineWidth    = (w * 0.4) * lineProgress;

      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth   = 1;
      ctx.globalAlpha = lineProgress;
      ctx.beginPath();
      ctx.moveTo(w / 2 - lineWidth / 2, h * 0.52);
      ctx.lineTo(w / 2 + lineWidth / 2, h * 0.52);
      ctx.stroke();
      ctx.restore();
    }

    // ── Phase 5 (0.55-0.75): Author name fades in ──
    if (progress >= 0.55) {
      const alpha = Math.min(1, (progress - 0.55) / 0.2);
      ctx.save();
      ctx.font        = `italic 300 13px 'Cormorant Garamond', serif`;
      ctx.fillStyle   = "#FF99CC";
      ctx.textAlign   = "center";
      ctx.globalAlpha = alpha;
      ctx.fillText(author.split("·")[0].trim(), w / 2, h * 0.58);
      ctx.restore();
    }

    // ── Phase 6 (0.65-0.9): Tags appear one by one ──
    if (progress >= 0.65 && tags.length > 0) {
      tags.forEach((tag, idx) => {
        const tagStart = 0.65 + idx * 0.08;
        if (progress >= tagStart) {
          const alpha = Math.min(1, (progress - tagStart) / 0.08);
          const tagY  = h * 0.68 + idx * 22;

          ctx.save();
          ctx.font        = `300 10px 'Jost', sans-serif`;
          ctx.fillStyle   = accentColor;
          ctx.textAlign   = "center";
          ctx.globalAlpha = alpha * 0.8;
          ctx.letterSpacing = "0.15em";
          ctx.fillText(tag.toUpperCase(), w / 2, tagY);
          ctx.restore();
        }
      });
    }

    // ── Phase 7 (0.85-1.0): Corner decorations appear ──
    if (progress >= 0.85) {
      const alpha = Math.min(1, (progress - 0.85) / 0.15);
      const cornerSize = 12;

      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth   = 1;
      ctx.globalAlpha = alpha * 0.5;

      // Top left
      ctx.beginPath(); ctx.moveTo(8, 8 + cornerSize); ctx.lineTo(8, 8); ctx.lineTo(8 + cornerSize, 8); ctx.stroke();
      // Top right
      ctx.beginPath(); ctx.moveTo(w - 8 - cornerSize, 8); ctx.lineTo(w - 8, 8); ctx.lineTo(w - 8, 8 + cornerSize); ctx.stroke();
      // Bottom left
      ctx.beginPath(); ctx.moveTo(8, h - 8 - cornerSize); ctx.lineTo(8, h - 8); ctx.lineTo(8 + cornerSize, h - 8); ctx.stroke();
      // Bottom right
      ctx.beginPath(); ctx.moveTo(w - 8 - cornerSize, h - 8); ctx.lineTo(w - 8, h - 8); ctx.lineTo(w - 8, h - 8 - cornerSize); ctx.stroke();

      ctx.restore();
    }

    frame++;

    if (frame <= TOTAL_FRAMES) {
      rafId = requestAnimationFrame(drawFrame);
    } else {
      // Hold final frame
      rafId = null;
    }
  }

  canvas._stopTrailer = () => {
    if (rafId) cancelAnimationFrame(rafId);
  };

  drawFrame();
}

// ─── STOP TRAILER ──────────────────────────────

function stopBookTrailer(card) {
  const canvas = card.querySelector(".trailer-canvas");
  if (canvas) {
    if (canvas._stopTrailer) canvas._stopTrailer();
    canvas.style.opacity = "0";
    setTimeout(() => canvas.remove(), 300);
  }
}