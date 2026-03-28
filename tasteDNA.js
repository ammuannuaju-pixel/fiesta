const GENRE_COLORS = {
  romance:    "#FF1493",
  fantasy:    "#9B59B6",
  mystery:    "#2E86C1",
  scifi:      "#00BFFF",
  thriller:   "#E74C3C",
  literary:   "#27AE60",
  historical: "#F39C12",
  nonfiction: "#E91E63",
};

const MOOD_COLORS = {
  happy:       "#FFD700",
  melancholic: "#6495ED",
  adventurous: "#FF4500",
  peaceful:    "#98FB98",
  dark:        "#8B0057",
  hopeful:     "#FF69B4",
  romantic:    "#FF1493",
  curious:     "#DA70D6",
};

const GENRE_LABELS = {
  romance:    "Romance",
  fantasy:    "Fantasy",
  mystery:    "Mystery",
  scifi:      "Sci-Fi",
  thriller:   "Thriller",
  literary:   "Literary",
  historical: "Historical",
  nonfiction: "Nonfiction",
};

const MOOD_LABELS_DNA = {
  happy:       "Joyful",
  melancholic: "Reflective",
  adventurous: "Restless",
  peaceful:    "Serene",
  dark:        "Intense",
  hopeful:     "Hopeful",
  romantic:    "Romantic",
  curious:     "Curious",
};

// ─── FETCH USER DATA ───────────────────────────

async function fetchDNAData(userId) {
  const { data } = await db
    .from("quiz_results")
    .select("genre, mood")
    .eq("user_id", userId || currentUser?.id)
    .order("created_at", { ascending: false })
    .limit(100);

  if (!data || !data.length) return null;

  // Count occurrences of each genre and mood
  const genreCounts = {};
  const moodCounts  = {};

  Object.keys(GENRE_COLORS).forEach(g => genreCounts[g] = 0);
  Object.keys(MOOD_COLORS).forEach(m  => moodCounts[m]  = 0);

  data.forEach(row => {
    if (genreCounts[row.genre] !== undefined) genreCounts[row.genre]++;
    if (moodCounts[row.mood]   !== undefined) moodCounts[row.mood]++;
  });

  const total = data.length;

  // Normalise to 0-1
  const genreNorm = {};
  const moodNorm  = {};
  const maxGenre  = Math.max(...Object.values(genreCounts), 1);
  const maxMood   = Math.max(...Object.values(moodCounts), 1);

  Object.keys(genreCounts).forEach(g => genreNorm[g] = genreCounts[g] / maxGenre);
  Object.keys(moodCounts).forEach(m  => moodNorm[m]  = moodCounts[m]  / maxMood);

  return { genreNorm, moodNorm, genreCounts, moodCounts, total };
}

// ─── DRAW RADAR CHART ──────────────────────────

function drawRadar(canvas, labels, values, colors, title) {
  const ctx    = canvas.getContext("2d");
  const W      = canvas.width;
  const H      = canvas.height;
  const cx     = W / 2;
  const cy     = H / 2 - 20;
  const radius = Math.min(W, H) * 0.32;
  const n      = labels.length;
  const step   = (Math.PI * 2) / n;

  ctx.clearRect(0, 0, W, H);

  // Background
  ctx.fillStyle = "#0a0008";
  ctx.fillRect(0, 0, W, H);

  // Title
  ctx.font      = "300 13px 'Jost', sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.25em";
  ctx.fillText(title.toUpperCase(), cx, 22);

  // Grid rings
  [0.25, 0.5, 0.75, 1.0].forEach(ring => {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const angle = step * i - Math.PI / 2;
      const x = cx + Math.cos(angle) * radius * ring;
      const y = cy + Math.sin(angle) * radius * ring;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,20,147,0.1)";
    ctx.lineWidth   = 1;
    ctx.stroke();
  });

  // Axis lines
  for (let i = 0; i < n; i++) {
    const angle = step * i - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = "rgba(255,20,147,0.08)";
    ctx.lineWidth   = 1;
    ctx.stroke();
  }

  // Filled polygon
  const keys    = Object.keys(values);
  const valArr  = keys.map(k => values[k] || 0);
  const colArr  = keys.map(k => colors[k] || "#FF1493");

  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const angle = step * i - Math.PI / 2;
    const val   = valArr[i];
    const x     = cx + Math.cos(angle) * radius * val;
    const y     = cy + Math.sin(angle) * radius * val;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient fill
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, "rgba(255,20,147,0.35)");
  grad.addColorStop(1, "rgba(255,20,147,0.05)");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = "#FF1493";
  ctx.lineWidth   = 1.5;
  ctx.shadowBlur  = 8;
  ctx.shadowColor = "#FF1493";
  ctx.stroke();
  ctx.shadowBlur  = 0;

  // Data points
  for (let i = 0; i < n; i++) {
    const angle = step * i - Math.PI / 2;
    const val   = valArr[i];
    const x     = cx + Math.cos(angle) * radius * val;
    const y     = cy + Math.sin(angle) * radius * val;

    if (val > 0) {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle   = colArr[i];
      ctx.shadowBlur  = 10;
      ctx.shadowColor = colArr[i];
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
  }

  // Labels
  ctx.font      = "400 11px 'Jost', sans-serif";
  ctx.textAlign = "center";

  for (let i = 0; i < n; i++) {
    const angle   = step * i - Math.PI / 2;
    const labelR  = radius + 22;
    const x       = cx + Math.cos(angle) * labelR;
    const y       = cy + Math.sin(angle) * labelR + 4;
    const val     = valArr[i];
    const isActive = val > 0.15;

    ctx.fillStyle   = isActive ? colArr[i] : "rgba(255,255,255,0.25)";
    ctx.shadowBlur  = isActive ? 6 : 0;
    ctx.shadowColor = colArr[i];
    ctx.fillText(labels[i], x, y);
    ctx.shadowBlur  = 0;
  }
}

// ─── GENERATE PERSONALITY SUMMARY ─────────────

function generatePersonalitySummary(data) {
  const { genreNorm, moodNorm, genreCounts, moodCounts, total } = data;

  // Find top genre and mood
  const topGenre = Object.entries(genreCounts).sort((a,b) => b[1]-a[1])[0]?.[0] || "literary";
  const topMood  = Object.entries(moodCounts).sort((a,b) => b[1]-a[1])[0]?.[0]  || "curious";
  const top2Genre = Object.entries(genreCounts).sort((a,b) => b[1]-a[1])[1]?.[0] || "mystery";

  // Count explored genres
  const exploredGenres = Object.values(genreCounts).filter(v => v > 0).length;

  const summaries = {
    "romance_romantic":    "You are a devoted romantic who seeks stories of the heart above all else. Love in all its forms — passionate, painful, triumphant — is what draws you to the page.",
    "romance_dark":        "You are drawn to love that burns and consumes. Dark romance is your sanctuary, where desire and danger intertwine in ways that feel deeply, urgently real.",
    "fantasy_adventurous": "You are a born explorer of imagined worlds. The thrill of the impossible, the weight of magic, the call of the unknown — these are the things that make you feel most alive.",
    "fantasy_dark":        "You inhabit the shadowed edges of fantastical worlds. Moral complexity and dark power are more interesting to you than simple heroism.",
    "mystery_curious":     "You are a natural detective. Your mind is drawn to puzzles, to hidden truths, to the satisfaction of understanding what others miss.",
    "thriller_dark":       "You read to feel the edges of fear and tension. The darker and more psychologically complex, the better. Nothing satisfies you like a twist that recontextualises everything.",
    "literary_melancholic":"You read to feel deeply and think carefully. Beautiful, sad, true — these are the words that describe your ideal book.",
    "scifi_hopeful":       "You are a visionary who believes in what humanity could become. Science fiction for you is not escapism but possibility made vivid.",
    "nonfiction_curious":  "You read to understand the world. Every book is a door into a subject you did not know you needed.",
    "historical_adventurous": "You are a time traveller at heart. The past is not dead to you — it breathes and moves and matters enormously.",
  };

  const key = `${topGenre}_${topMood}`;
  const base = summaries[key] || summaries[`${topGenre}_curious`] ||
    `You are a reader of wide and curious taste. ${GENRE_LABELS[topGenre]} calls to you most strongly, and you bring a ${MOOD_LABELS_DNA[topMood]?.toLowerCase() || "reflective"} heart to every page.`;

  const diversity = exploredGenres >= 6
    ? " Your reading spans an extraordinary range of genres — you are a true literary omnivore."
    : exploredGenres >= 4
    ? ` You also venture into ${GENRE_LABELS[top2Genre]?.toLowerCase() || "other genres"}, showing a pleasingly adventurous spirit.`
    : "";

  const count = total >= 20
    ? ` With ${total} explorations recorded, your taste profile is richly detailed.`
    : total >= 5
    ? ` You have taken ${total} quizzes — enough to reveal a clear and distinct reading personality.`
    : "";

  return base + diversity + count;
}

// ─── SHOW DNA MODAL ────────────────────────────

async function showTasteDNA() {
  if (!currentUser) {
    if (typeof showAuthModal === "function") showAuthModal();
    return;
  }

  // Remove existing modal
  document.getElementById("dnModal")?.remove();

  // Create modal
  const modal = document.createElement("div");
  modal.id        = "dnModal";
  modal.className = "dna-modal-overlay";
  modal.innerHTML = `
    <div class="dna-modal-box">
      <div class="dna-modal-header">
        <div class="dna-modal-label">YOUR READING DNA</div>
        <button class="dna-close-btn" onclick="document.getElementById('dnModal').remove()">Close</button>
      </div>
      <div class="dna-loading" id="dnaLoading">
        <div class="loader-ring"></div>
        <p>Analysing your reading personality...</p>
      </div>
      <div class="dna-content hidden" id="dnaContent">
        <div class="dna-charts-row">
          <div class="dna-chart-wrap">
            <canvas id="genreRadar" width="280" height="300"></canvas>
          </div>
          <div class="dna-chart-wrap">
            <canvas id="moodRadar" width="280" height="300"></canvas>
          </div>
        </div>
        <div class="dna-summary" id="dnaSummary"></div>
        <div class="dna-stats-row" id="dnaStatsRow"></div>
        <button class="dna-download-btn" onclick="downloadDNACard()">Download Your Reading DNA</button>
      </div>
      <div class="dna-empty hidden" id="dnaEmpty">
        <p>Complete at least one quiz to generate your Reading DNA.</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add("dna-modal-visible"));

  const data = await fetchDNAData();

  document.getElementById("dnaLoading").classList.add("hidden");

  if (!data || data.total === 0) {
    document.getElementById("dnaEmpty").classList.remove("hidden");
    return;
  }

  document.getElementById("dnaContent").classList.remove("hidden");

  // Draw genre radar
  const genreCanvas = document.getElementById("genreRadar");
  drawRadar(
    genreCanvas,
    Object.values(GENRE_LABELS),
    data.genreNorm,
    GENRE_COLORS,
    "Genre Landscape"
  );

  // Draw mood radar
  const moodCanvas = document.getElementById("moodRadar");
  drawRadar(
    moodCanvas,
    Object.values(MOOD_LABELS_DNA),
    data.moodNorm,
    MOOD_COLORS,
    "Emotional Spectrum"
  );

  // Summary
  document.getElementById("dnaSummary").textContent = generatePersonalitySummary(data);

  // Stats row
  const topGenres = Object.entries(data.genreCounts)
    .filter(([,v]) => v > 0)
    .sort((a,b) => b[1]-a[1])
    .slice(0, 3);

  document.getElementById("dnaStatsRow").innerHTML = `
    <div class="dna-stat">
      <div class="dna-stat-num">${data.total}</div>
      <div class="dna-stat-label">Quizzes Taken</div>
    </div>
    <div class="dna-stat">
      <div class="dna-stat-num">${Object.values(data.genreCounts).filter(v=>v>0).length}</div>
      <div class="dna-stat-label">Genres Explored</div>
    </div>
    <div class="dna-stat">
      <div class="dna-stat-num">${Object.values(data.moodCounts).filter(v=>v>0).length}</div>
      <div class="dna-stat-label">Moods Expressed</div>
    </div>
    <div class="dna-stat">
      <div class="dna-stat-num" style="color:${GENRE_COLORS[topGenres[0]?.[0]] || '#FF1493'}">
        ${GENRE_LABELS[topGenres[0]?.[0]] || "—"}
      </div>
      <div class="dna-stat-label">Favourite Genre</div>
    </div>
  `;

  // Store data for download
  window._dnaData = data;
}

// ─── DOWNLOAD DNA CARD ─────────────────────────

function downloadDNACard() {
  const data = window._dnaData;
  if (!data) return;

  const canvas = document.createElement("canvas");
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#080008";
  ctx.fillRect(0, 0, 1080, 1080);

  // Subtle grid
  ctx.strokeStyle = "rgba(255,20,147,0.05)";
  ctx.lineWidth   = 1;
  for (let x = 0; x <= 1080; x += 60) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,1080); ctx.stroke();
  }
  for (let y = 0; y <= 1080; y += 60) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(1080,y); ctx.stroke();
  }

  // Header
  ctx.font      = "300 18px sans-serif";
  ctx.fillStyle = "rgba(255,20,147,0.6)";
  ctx.textAlign = "center";
  ctx.fillText("F I E S T A", 540, 60);

  ctx.font      = "300 13px sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fillText("YOUR READING DNA", 540, 88);

  // Divider
  ctx.strokeStyle = "rgba(255,20,147,0.3)";
  ctx.lineWidth   = 1;
  ctx.beginPath(); ctx.moveTo(340, 105); ctx.lineTo(740, 105); ctx.stroke();

  // Draw both radars onto the download canvas
  const tempGenre = document.createElement("canvas");
  tempGenre.width = 400; tempGenre.height = 420;
  drawRadar(tempGenre, Object.values(GENRE_LABELS), data.genreNorm, GENRE_COLORS, "Genre Landscape");

  const tempMood = document.createElement("canvas");
  tempMood.width = 400; tempMood.height = 420;
  drawRadar(tempMood, Object.values(MOOD_LABELS_DNA), data.moodNorm, MOOD_COLORS, "Emotional Spectrum");

  ctx.drawImage(tempGenre, 40,  120, 460, 460);
  ctx.drawImage(tempMood,  580, 120, 460, 460);

  // Summary text
  const summary = generatePersonalitySummary(data);
  ctx.font      = "italic 22px serif";
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.textAlign = "center";
  wrapTextDNA(ctx, summary, 540, 630, 880, 34);

  // Stats
  const stats = [
    { num: data.total, label: "Quizzes" },
    { num: Object.values(data.genreCounts).filter(v=>v>0).length, label: "Genres" },
    { num: Object.values(data.moodCounts).filter(v=>v>0).length,  label: "Moods" },
  ];

  const statX = [270, 540, 810];
  stats.forEach((s, i) => {
    ctx.font      = "bold 48px serif";
    ctx.fillStyle = "#FF1493";
    ctx.textAlign = "center";
    ctx.shadowBlur  = 15;
    ctx.shadowColor = "#FF1493";
    ctx.fillText(s.num, statX[i], 850);
    ctx.shadowBlur  = 0;

    ctx.font      = "300 14px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillText(s.label.toUpperCase(), statX[i], 875);
  });

  // Username
  const username = window.currentProfile?.username || "Reader";
  ctx.font      = "italic 20px serif";
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.textAlign = "center";
  ctx.fillText(`— ${username}`, 540, 940);

  // URL
  ctx.font      = "300 14px sans-serif";
  ctx.fillStyle = "rgba(255,20,147,0.3)";
  ctx.fillText("fiesta.pages.dev", 540, 1010);

  const link = document.createElement("a");
  link.download = `fiesta-reading-dna-${username}.png`;
  link.href     = canvas.toDataURL("image/png");
  link.click();
}

function wrapTextDNA(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line    = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine  = line + words[n] + " ";
    const metrics   = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line     = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

// ─── GLOBAL EXPORTS ────────────────────────────

window.showTasteDNA    = showTasteDNA;
window.downloadDNACard = downloadDNACard;