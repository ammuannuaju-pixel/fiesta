// archetype.js — Reader archetype cards with share functionality

const ARCHETYPES = {
  romance: {
    happy:       { name: "The Hopeless Romantic",      color: "#FF1493", palette: ["#FF1493","#FFB6D9","#1a0010"], desc: "You believe in love so fiercely it almost hurts. Every story is a promise that magic is real." },
    melancholic: { name: "The Tragic Romantic",        color: "#c4547a", palette: ["#c4547a","#7a2040","#0d0008"], desc: "You fall for love stories that leave scars. The ones that hurt are the ones you remember forever." },
    adventurous: { name: "The Wild Heart",             color: "#FF4D8C", palette: ["#FF4D8C","#ff8cb4","#1a000e"], desc: "Love is your greatest adventure. You chase it across continents, centuries, and dimensions." },
    peaceful:    { name: "The Gentle Dreamer",         color: "#d4729a", palette: ["#d4729a","#f0b8cc","#100008"], desc: "You find love in quiet moments. A glance, a letter, a hand held in the dark." },
    dark:        { name: "The Obsessive Lover",        color: "#8B0040", palette: ["#8B0040","#FF1493","#050002"], desc: "You are drawn to love that consumes. Dangerous, all-encompassing, and impossible to forget." },
    hopeful:     { name: "The Eternal Optimist",       color: "#FF69B4", palette: ["#FF69B4","#ffd6e8","#0d0008"], desc: "No matter how many times love fails, you believe the next story will be the one." },
    romantic:    { name: "The Midnight Romantic",      color: "#FF1493", palette: ["#FF1493","#cc0077","#08000a"], desc: "You read love stories at 2am and cry at the beautiful parts. Love is your religion." },
    curious:     { name: "The Love Archaeologist",     color: "#e05585", palette: ["#e05585","#ff99cc","#100005"], desc: "You dig beneath the surface of every romance, searching for what love truly means." },
  },
  fantasy: {
    happy:       { name: "The Enchanted Wanderer",     color: "#9B59B6", palette: ["#9B59B6","#d4a8e8","#08000f"], desc: "Magic follows you everywhere. You see wonder in every shadow and adventure behind every door." },
    melancholic: { name: "The Fallen Mage",            color: "#6C3483", palette: ["#6C3483","#a855d4","#050008"], desc: "You carry the weight of worlds untold. Power and loss are two sides of the same spell." },
    adventurous: { name: "The Shadow Realm Wanderer",  color: "#8E44AD", palette: ["#8E44AD","#FF1493","#05000d"], desc: "You live for the thrill of the unknown. Dark forests, ancient evils, impossible quests." },
    peaceful:    { name: "The Quiet Sorcerer",         color: "#7D3C98", palette: ["#7D3C98","#c39bd3","#060008"], desc: "Magic for you is not a weapon but a sanctuary. You find peace in worlds beyond this one." },
    dark:        { name: "The Dark Court Creature",    color: "#4A235A", palette: ["#4A235A","#8B0057","#030005"], desc: "You belong in the shadows of faerie courts. Morally complex, dangerously beautiful, unforgettable." },
    hopeful:     { name: "The Chosen One",             color: "#A569BD", palette: ["#A569BD","#FF69B4","#08000d"], desc: "You believe in heroes, in prophecies, in the idea that one person can change everything." },
    romantic:    { name: "The Fae Touched",            color: "#BB8FCE", palette: ["#BB8FCE","#FF99CC","#08000a"], desc: "You have been enchanted by worlds of magic and love. Reality feels pale in comparison." },
    curious:     { name: "The Lore Keeper",            color: "#884EA0", palette: ["#884EA0","#d2b4de","#050008"], desc: "You devour fantasy for the worldbuilding, the mythology, the history of invented civilisations." },
  },
  mystery: {
    happy:       { name: "The Amateur Sleuth",         color: "#2E86C1", palette: ["#2E86C1","#85C1E9","#00050f"], desc: "Puzzles delight you. You solve mysteries for the joy of it, a cup of tea in hand." },
    melancholic: { name: "The Haunted Detective",      color: "#1A5276", palette: ["#1A5276","#5DADE2","#000308"], desc: "Every case leaves its mark. You carry the weight of every unsolved question." },
    adventurous: { name: "The Midnight Investigator",  color: "#2980B9", palette: ["#2980B9","#FF1493","#000510"], desc: "You thrive in the dark. Rain-slicked streets, coded messages, impossible crimes." },
    peaceful:    { name: "The Cozy Detective",         color: "#5DADE2", palette: ["#5DADE2","#AED6F1","#000508"], desc: "You solve mysteries from comfortable armchairs with good tea and excellent intuition." },
    dark:        { name: "The Unreliable Narrator",    color: "#1F618D", palette: ["#1F618D","#922B21","#000305"], desc: "You are obsessed with the dark side of human nature. Nothing is what it seems. No one is innocent." },
    hopeful:     { name: "The Truth Seeker",           color: "#3498DB", palette: ["#3498DB","#85C1E9","#000510"], desc: "You believe every mystery can be solved. Justice exists if you are brave enough to find it." },
    romantic:    { name: "The Gothic Romantic",        color: "#2471A3", palette: ["#2471A3","#FF69B4","#00040c"], desc: "You love mysteries wrapped in atmosphere, old houses, forbidden secrets, and dangerous obsessions." },
    curious:     { name: "The Obsessive Analyst",      color: "#1ABC9C", palette: ["#1ABC9C","#76D7C4","#000a08"], desc: "You read mysteries to outsmart them. You have already guessed the killer by chapter three." },
  },
  scifi: {
    happy:       { name: "The Stardust Explorer",      color: "#00BFFF", palette: ["#00BFFF","#87CEEB","#00050f"], desc: "The universe is infinite and so is your curiosity. Every star is a story waiting to be told." },
    melancholic: { name: "The Last Human",             color: "#4169E1", palette: ["#4169E1","#87CEFA","#00020f"], desc: "You read sci-fi to mourn what we are losing and imagine what we might become." },
    adventurous: { name: "The Galactic Drifter",       color: "#00CED1", palette: ["#00CED1","#FF1493","#000a0a"], desc: "Space is not the final frontier for you. It is the beginning of everything." },
    peaceful:    { name: "The Star Gazer",             color: "#6495ED", palette: ["#6495ED","#B0C4DE","#000508"], desc: "You read sci-fi for the wonder of it. Quiet contemplation of humanity among the infinite stars." },
    dark:        { name: "The Dystopian Prophet",      color: "#191970", palette: ["#191970","#FF1493","#000005"], desc: "You see the cracks in civilisation and follow them to their logical, terrifying conclusion." },
    hopeful:     { name: "The Future Architect",       color: "#00FA9A", palette: ["#00FA9A","#00BFFF","#000a05"], desc: "You believe technology and humanity can coexist beautifully. The future is worth fighting for." },
    romantic:    { name: "The Cosmic Romantic",        color: "#7B68EE", palette: ["#7B68EE","#FF69B4","#05000f"], desc: "Love across star systems, across time, across the boundaries of what is even possible." },
    curious:     { name: "The Quantum Thinker",        color: "#40E0D0", palette: ["#40E0D0","#E0FFFF","#000a08"], desc: "You read hard sci-fi for the ideas. The science is the poetry. The theories are the thrill." },
  },
  thriller: {
    happy:       { name: "The Armchair Spy",           color: "#E74C3C", palette: ["#E74C3C","#F1948A","#0f0000"], desc: "You love the thrill of danger from a safe distance. Espionage is your favourite vacation." },
    melancholic: { name: "The Broken Witness",         color: "#922B21", palette: ["#922B21","#E74C3C","#080000"], desc: "You read thrillers because real darkness deserves to be examined, understood, and survived." },
    adventurous: { name: "The Adrenaline Addict",      color: "#FF4500", palette: ["#FF4500","#FF6347","#0f0200"], desc: "Heart pounding, pages flying. You need speed, danger, and an ending no one saw coming." },
    peaceful:    { name: "The Strategic Mind",         color: "#C0392B", palette: ["#C0392B","#F1948A","#0a0000"], desc: "You approach thrillers like chess. Calm, analytical, three moves ahead of every plot twist." },
    dark:        { name: "The Shadow Walker",          color: "#641E16", palette: ["#641E16","#FF1493","#050000"], desc: "You are drawn to the darkest corners of human psychology. You understand what others fear to admit." },
    hopeful:     { name: "The Survivor",               color: "#E74C3C", palette: ["#E74C3C","#FF69B4","#0f0005"], desc: "You read thrillers for the survival, the resilience, the unbreakable human will to keep going." },
    romantic:    { name: "The Dangerous Romantic",     color: "#D35400", palette: ["#D35400","#FF69B4","#0a0003"], desc: "Love and danger are inseparable for you. The most passionate stories are always the most deadly." },
    curious:     { name: "The Mind Game Player",       color: "#BA4A00", palette: ["#BA4A00","#F0B27A","#080200"], desc: "Psychological thrillers are your playground. You love being manipulated and then figuring out how." },
  },
  literary: {
    happy:       { name: "The Word Collector",         color: "#27AE60", palette: ["#27AE60","#82E0AA","#000a02"], desc: "You read for the beauty of language itself. A perfect sentence is worth a thousand plots." },
    melancholic: { name: "The Quiet Philosopher",      color: "#1E8449", palette: ["#1E8449","#58D68D","#000602"], desc: "Literature is how you make sense of the ache of being alive. Every book is a mirror." },
    adventurous: { name: "The Intellectual Nomad",     color: "#2ECC71", palette: ["#2ECC71","#FF1493","#000a05"], desc: "You travel through ideas the way others travel through countries. Restless, hungry, transformed." },
    peaceful:    { name: "The Quiet Observer",         color: "#58D68D", palette: ["#58D68D","#D5F5E3","#000802"], desc: "You notice everything. Literary fiction rewards your patience with profound, lasting beauty." },
    dark:        { name: "The Dark Academic",          color: "#145A32", palette: ["#145A32","#8B0040","#000300"], desc: "Candlelight, old books, moral ambiguity. You live in the intersection of beauty and darkness." },
    hopeful:     { name: "The Humanist",               color: "#52BE80", palette: ["#52BE80","#A9DFBF","#000802"], desc: "You read literary fiction because you believe in people. Even broken ones. Especially broken ones." },
    romantic:    { name: "The Literary Lover",         color: "#1ABC9C", palette: ["#1ABC9C","#FF99CC","#000a08"], desc: "The most romantic thing in the world to you is a beautifully written sentence about love." },
    curious:     { name: "The Deep Reader",            color: "#239B56", palette: ["#239B56","#A9DFBF","#000503"], desc: "You read between the lines, beneath the lines, beyond the lines. Subtext is your native language." },
  },
  historical: {
    happy:       { name: "The Time Traveller",         color: "#F39C12", palette: ["#F39C12","#FAD7A0","#0a0500"], desc: "History is your favourite destination. Every era is an adventure waiting to be lived." },
    melancholic: { name: "The Witness to History",     color: "#D68910", palette: ["#D68910","#F8C471","#080400"], desc: "You read historical fiction to mourn lost worlds and honour the lives that shaped our own." },
    adventurous: { name: "The Era Hopper",             color: "#F1C40F", palette: ["#F1C40F","#FF1493","#0a0800"], desc: "Medieval castles, Victorian drawing rooms, wartime trenches. You have lived a thousand lives." },
    peaceful:    { name: "The Antiquarian",            color: "#CA6F1E", palette: ["#CA6F1E","#FDEBD0","#080300"], desc: "You find comfort in the past. The slowness, the ritual, the weight of history feels like home." },
    dark:        { name: "The War Chronicler",         color: "#784212", palette: ["#784212","#E59866","#050200"], desc: "You read the darkest chapters of history because forgetting is more dangerous than remembering." },
    hopeful:     { name: "The Renaissance Soul",       color: "#F0B27A", palette: ["#F0B27A","#FDEBD0","#0a0500"], desc: "You believe every era had its beauty. Even in darkness, humans created extraordinary things." },
    romantic:    { name: "The Period Drama Devotee",   color: "#E67E22", palette: ["#E67E22","#FF69B4","#0a0300"], desc: "Ballgowns, candlelight, forbidden glances across crowded rooms. This is your natural habitat." },
    curious:     { name: "The History Detective",      color: "#D4AC0D", palette: ["#D4AC0D","#F9E79F","#080600"], desc: "You read historical fiction to uncover what the textbooks left out. The truth behind the story." },
  },
  nonfiction: {
    happy:       { name: "The Curious Mind",           color: "#E74C3C", palette: ["#E74C3C","#F1948A","#0f0000"], desc: "Knowledge is pure joy for you. Every fact is a small miracle, every book a door flung open." },
    melancholic: { name: "The Reflective Reader",      color: "#884EA0", palette: ["#884EA0","#D2B4DE","#050008"], desc: "You read nonfiction to understand the world and your place in it. Sometimes it is beautiful, sometimes devastating." },
    adventurous: { name: "The Knowledge Hunter",       color: "#2980B9", palette: ["#2980B9","#FF1493","#00050f"], desc: "You devour books across every subject. Science, history, psychology, philosophy. All of it." },
    peaceful:    { name: "The Mindful Scholar",        color: "#27AE60", palette: ["#27AE60","#A9DFBF","#000a02"], desc: "You read slowly and deeply. Understanding matters more than speed. Wisdom over information." },
    dark:        { name: "The Truth Confronter",       color: "#641E16", palette: ["#641E16","#922B21","#050000"], desc: "You read uncomfortable truths because looking away is a privilege you refuse to take." },
    hopeful:     { name: "The Lifelong Learner",       color: "#2ECC71", palette: ["#2ECC71","#A9DFBF","#000a02"], desc: "Every book makes you better. You read because growth is the most hopeful thing a person can do." },
    romantic:    { name: "The Passionate Intellectual", color: "#E91E63", palette: ["#E91E63","#F48FB1","#0a0005"], desc: "You fall in love with ideas the way others fall in love with people. Completely and forever." },
    curious:     { name: "The Polymath",               color: "#00BCD4", palette: ["#00BCD4","#80DEEA","#000a0a"], desc: "No single subject can contain you. You connect dots across disciplines and see patterns everywhere." },
  },
};

function getArchetype(genre, mood) {
  return ARCHETYPES[genre]?.[mood] || {
    name: "The Eternal Reader",
    color: "#FF1493",
    palette: ["#FF1493", "#cc0077", "#08000a"],
    desc: "Books are your universe. Every page is a new world, every story a new life lived."
  };
}

// ─── SHOW ARCHETYPE CARD ───────────────────────

function showArchetypeCard(genre, mood, username) {
  const archetype = getArchetype(genre, mood);
  const display   = username && !username.startsWith("reader_") ? username : "Reader";

  // Remove existing card if any
  document.getElementById("archetypeCard")?.remove();

  const overlay = document.createElement("div");
  overlay.id        = "archetypeCard";
  overlay.className = "archetype-overlay";
  overlay.innerHTML = `
    <div class="archetype-box" id="archetypeBox" style="--arch-color:${archetype.color};--arch-bg:${archetype.palette[2]}">
      <div class="arch-top">
        <div class="arch-site-name">FIESTA</div>
        <div class="arch-label">YOUR READER ARCHETYPE</div>
      </div>
      <div class="arch-deco-ring"></div>
      <div class="arch-name">${archetype.name}</div>
      <div class="arch-divider"></div>
      <div class="arch-desc">${archetype.desc}</div>
      <div class="arch-meta">
        <span class="arch-genre">${genre}</span>
        <span class="arch-dot">·</span>
        <span class="arch-mood">${mood}</span>
      </div>
      <div class="arch-user">— ${display}</div>
      <div class="arch-buttons">
        <button class="arch-btn-share" id="archShareBtn">Download Card</button>
        <button class="arch-btn-close" id="archCloseBtn">See My Books</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Animate in
  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    document.getElementById("archetypeBox").style.transform = "scale(1) translateY(0)";
  });

  document.getElementById("archCloseBtn").addEventListener("click", () => {
    overlay.style.opacity = "0";
    setTimeout(() => overlay.remove(), 400);
  });

  document.getElementById("archShareBtn").addEventListener("click", () => {
    downloadArchetypeCard(archetype, genre, mood, display);
  });
}

// ─── DOWNLOAD CARD AS IMAGE ────────────────────

function downloadArchetypeCard(archetype, genre, mood, username) {
  const canvas = document.createElement("canvas");
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");

  // Background
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0, archetype.palette[2]);
  bg.addColorStop(0.5, "#0a0005");
  bg.addColorStop(1, archetype.palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // Decorative circle
  ctx.save();
  ctx.strokeStyle = archetype.color;
  ctx.globalAlpha = 0.15;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(540, 540, 420, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(540, 540, 380, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 0.07;
  ctx.beginPath();
  ctx.arc(540, 540, 480, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // Glow effect
  ctx.save();
  const glow = ctx.createRadialGradient(540, 540, 0, 540, 540, 420);
  glow.addColorStop(0, archetype.color + "22");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1080);
  ctx.restore();

  // FIESTA label
  ctx.fillStyle = archetype.color;
  ctx.globalAlpha = 0.7;
  ctx.font = "300 28px serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "0.5em";
  ctx.fillText("F I E S T A", 540, 200);
  ctx.globalAlpha = 1;

  // YOUR READER ARCHETYPE
  ctx.fillStyle = archetype.color;
  ctx.globalAlpha = 0.5;
  ctx.font = "300 22px sans-serif";
  ctx.fillText("YOUR READER ARCHETYPE", 540, 260);
  ctx.globalAlpha = 1;

  // Divider line top
  ctx.strokeStyle = archetype.color;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(340, 300); ctx.lineTo(740, 300);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Archetype name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 72px serif";
  ctx.textAlign = "center";

  // Word wrap for long names
  const words = archetype.name.split(" ");
  if (archetype.name.length > 20) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(" ");
    const line2 = words.slice(mid).join(" ");
    ctx.fillText(line1, 540, 420);
    ctx.fillText(line2, 540, 510);
    // Description starts lower
    wrapText(ctx, archetype.desc, 540, 610, 700, 38);
  } else {
    ctx.fillText(archetype.name, 540, 470);
    wrapText(ctx, archetype.desc, 540, 580, 700, 38);
  }

  // Divider line bottom
  ctx.strokeStyle = archetype.color;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(340, 780); ctx.lineTo(740, 780);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Genre and mood tags
  ctx.fillStyle = archetype.color;
  ctx.font = "300 26px sans-serif";
  ctx.fillText(`${genre.toUpperCase()}  ·  ${mood.toUpperCase()}`, 540, 840);

  // Username
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = 0.45;
  ctx.font = "italic 24px serif";
  ctx.fillText(`— ${username}`, 540, 900);
  ctx.globalAlpha = 1;

  // fiesta url
  ctx.fillStyle = archetype.color;
  ctx.globalAlpha = 0.35;
  ctx.font = "300 20px sans-serif";
  ctx.fillText("stirring-cupcake-0aa910.netlify.app", 540, 980);
  ctx.globalAlpha = 1;

  // Download
  const link = document.createElement("a");
  link.download = `fiesta-${archetype.name.toLowerCase().replace(/\s+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "italic 30px serif";
  const words = text.split(" ");
  let line = "";
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

// ─── TRIGGER ───────────────────────────────────

function triggerArchetypeCard() {
  const genre    = sel.genre   || "literary";
  const mood     = sel.mood    || "curious";
  const username = currentProfile?.username || "Reader";

  setTimeout(() => {
    showArchetypeCard(genre, mood, username);
  }, 800);
}