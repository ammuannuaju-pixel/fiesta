// checkin.js — Daily mood check-in with single book recommendation

const CHECKIN_MOODS = [
  { key: "happy",       label: "Joyful",      color: "#FFD700" },
  { key: "melancholic", label: "Reflective",   color: "#6495ED" },
  { key: "adventurous", label: "Restless",     color: "#FF4500" },
  { key: "peaceful",    label: "Serene",       color: "#98FB98" },
  { key: "dark",        label: "Intense",      color: "#8B0057" },
  { key: "hopeful",     label: "Inspired",     color: "#FF69B4" },
  { key: "romantic",    label: "Yearning",     color: "#FF1493" },
  { key: "curious",     label: "Intrigued",    color: "#DA70D6" },
];

const CHECKIN_BOOKS = {
  happy: [
    { title: "The Hating Game",          author: "Sally Thorne",      isbn: "9780062439598" },
    { title: "Beach Read",               author: "Emily Henry",       isbn: "9781984806734" },
    { title: "The Unhoneymooners",       author: "Christina Lauren",  isbn: "9781501128035" },
  ],
  melancholic: [
    { title: "The Remains of the Day",   author: "Kazuo Ishiguro",    isbn: "9780679731726" },
    { title: "A Little Life",            author: "Hanya Yanagihara",  isbn: "9780804172706" },
    { title: "Normal People",            author: "Sally Rooney",      isbn: "9780571334650" },
  ],
  adventurous: [
    { title: "Six of Crows",             author: "Leigh Bardugo",     isbn: "9781627792127" },
    { title: "The Lies of Locke Lamora", author: "Scott Lynch",       isbn: "9780553588941" },
    { title: "Dune",                     author: "Frank Herbert",     isbn: "9780441013593" },
  ],
  peaceful: [
    { title: "A Gentleman in Moscow",        author: "Amor Towles",   isbn: "9780143110439" },
    { title: "The House in the Cerulean Sea", author: "TJ Klune",     isbn: "9781250217318" },
    { title: "84 Charing Cross Road",        author: "Helene Hanff",  isbn: "9780140143508" },
  ],
  dark: [
    { title: "Gone Girl",      author: "Gillian Flynn",           isbn: "9780307588371" },
    { title: "The Poppy War",  author: "R.F. Kuang",              isbn: "9780062662590" },
    { title: "Mexican Gothic", author: "Silvia Moreno-Garcia",    isbn: "9780525620785" },
  ],
  hopeful: [
    { title: "Circe",                author: "Madeline Miller", isbn: "9780316556347" },
    { title: "The Midnight Library", author: "Matt Haig",       isbn: "9780525559474" },
    { title: "Project Hail Mary",    author: "Andy Weir",       isbn: "9780593135204" },
  ],
  romantic: [
    { title: "The Night Circus",                      author: "Erin Morgenstern",    isbn: "9780385534635" },
    { title: "The Song of Achilles",                  author: "Madeline Miller",     isbn: "9780062060624" },
    { title: "The Seven Husbands of Evelyn Hugo",     author: "Taylor Jenkins Reid", isbn: "9781501161933" },
  ],
  curious: [
    { title: "The Name of the Wind", author: "Patrick Rothfuss",  isbn: "9780756404741" },
    { title: "Sapiens",              author: "Yuval Noah Harari", isbn: "9780062316097" },
    { title: "Cloud Atlas",          author: "David Mitchell",    isbn: "9780375507250" },
  ],
};

// ─── CHECK IF ALREADY CHECKED IN TODAY ─────────

async function hasCheckedInToday() {
  if (!currentUser) return false;
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await db
    .from("daily_checkins")
    .select("id, mood, book_title, book_author")
    .eq("user_id", currentUser.id)
    .eq("date", today)
    .maybeSingle();
  return data || null;
}

// ─── SAVE CHECK-IN ─────────────────────────────

async function saveCheckin(mood, bookTitle, bookAuthor) {
  if (!currentUser) return;
  const today = new Date().toISOString().slice(0, 10);
  await db.from("daily_checkins").upsert({
    user_id:     currentUser.id,
    date:        today,
    mood,
    book_title:  bookTitle,
    book_author: bookAuthor,
  }, { onConflict: "user_id,date" });
}

// ─── GET BOOK FOR MOOD ─────────────────────────

function getDailyBookForMood(mood) {
  const books = CHECKIN_BOOKS[mood] || CHECKIN_BOOKS.curious;
  const day   = new Date().getDate();
  return books[day % books.length];
}

// ─── RENDER CHECK-IN WIDGET ───────────────────

async function renderCheckinWidget() {
  const container = document.getElementById("checkinWidget");
  if (!container) return;

  const existing = await hasCheckedInToday();

  if (existing) {
    renderCheckinResult(container, existing.mood, {
      title:  existing.book_title,
      author: existing.book_author,
      cover:  "",
    });
    return;
  }

  container.innerHTML = `
    <div class="checkin-wrap">
      <div class="checkin-header">
        <div class="checkin-label">DAILY CHECK-IN</div>
        <div class="checkin-question">How are you feeling right now?</div>
      </div>
      <div class="checkin-moods">
        ${CHECKIN_MOODS.map(m => `
          <button
            class="checkin-mood-btn"
            data-mood="${m.key}"
            style="--mood-color: ${m.color}"
            onclick="handleCheckin('${m.key}')"
          >
            ${m.label}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

async function handleCheckin(mood) {
  const container = document.getElementById("checkinWidget");
  if (!container) return;

  container.innerHTML = `
    <div class="checkin-wrap checkin-loading">
      <div class="checkin-label">FINDING YOUR BOOK</div>
      <div class="checkin-loader"></div>
    </div>
  `;

  const book = getDailyBookForMood(mood);

  // Use shared cover cache with a delay so it does not
  // compete with other page load requests
  let cover = "";
  await new Promise(r => setTimeout(r, 2000));

  if (typeof fetchCoverWithCache === "function") {
    cover = await fetchCoverWithCache(
      book.isbn?.replace(/[-\s]/g, ""),
      book.title,
      book.author
    );
  } else {
    try {
      const cacheKey = `checkin_cover_${book.isbn || book.title}`;
      const cached   = localStorage.getItem(cacheKey);
      if (cached) {
        cover = cached;
      } else {
        await new Promise(r => setTimeout(r, 500));
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}&maxResults=1`
        );
        if (res.status !== 429) {
          const dat = await res.json();
          cover = dat.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
            ?.replace("http://", "https://") || "";
          if (cover) localStorage.setItem(cacheKey, cover);
        }
      }
    } catch (e) { /* silent */ }
  }

  book.cover = cover;

  await saveCheckin(mood, book.title, book.author);
  renderCheckinResult(container, mood, book);
}

function renderCheckinResult(container, mood, book) {
  const moodDef = CHECKIN_MOODS.find(m => m.key === mood) || CHECKIN_MOODS[0];

  container.innerHTML = `
    <div class="checkin-wrap checkin-result">
      <div class="checkin-header">
        <div class="checkin-label">TODAY'S PICK FOR YOU</div>
        <div class="checkin-mood-shown" style="color:${moodDef.color}">
          Feeling ${moodDef.label}
        </div>
      </div>
      <div class="checkin-book">
        ${book.cover
          ? `<img class="checkin-cover" src="${book.cover}" alt="${book.title || ''}" onerror="this.style.display='none'" />`
          : `<div class="checkin-cover-fb"></div>`
        }
        <div class="checkin-book-info">
          <div class="checkin-book-title">${book.title || ""}</div>
          <div class="checkin-book-author">${book.author || ""}</div>
          <button class="checkin-explore-btn" onclick="startQuizWithMood('', '${mood}')">
            Explore More Like This
          </button>
        </div>
      </div>
    </div>
  `;
}