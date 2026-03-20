// bookofday.js — Book of the Day feature

// ─── CURATED DAILY BOOKS ───────────────────────

const DAILY_BOOKS = [
  { title: "The Name of the Wind", author: "Patrick Rothfuss", isbn: "9780756404741", genre: "fantasy", mood: "adventurous", description: "A legendary wizard recounts his extraordinary life from orphaned street performer to the most feared magician of his age. Lyrical, immersive, and impossible to put down.", tags: ["epic fantasy", "magic", "lyrical"] },
  { title: "Normal People", author: "Sally Rooney", isbn: "9780571334650", genre: "literary", mood: "melancholic", description: "Two Irish teenagers navigate the push and pull of desire, class, and emotional vulnerability across years of connection and painful disconnection.", tags: ["contemporary", "Irish", "quiet"] },
  { title: "Project Hail Mary", author: "Andy Weir", isbn: "9780593135204", genre: "scifi", mood: "hopeful", description: "A lone astronaut wakes up millions of miles from Earth with no memory and must save the solar system using nothing but science and sheer will.", tags: ["space", "hopeful", "science"] },
  { title: "Gone Girl", author: "Gillian Flynn", isbn: "9780307588371", genre: "thriller", mood: "dark", description: "A woman disappears on her anniversary and her husband becomes the prime suspect in a case that grows darker and more twisted with every page.", tags: ["psychological", "twisty", "dark"] },
  { title: "Circe", author: "Madeline Miller", isbn: "9780316556347", genre: "fantasy", mood: "hopeful", description: "The witch of Greek mythology finally claims her own story, discovering her powers and finding her place among gods and mortals in this luminous retelling.", tags: ["mythology", "feminist", "lyrical"] },
  { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", isbn: "9781501161933", genre: "literary", mood: "romantic", description: "A reclusive Hollywood legend finally tells her extraordinary story to an unknown journalist, revealing a life of passion, ambition, and devastating love.", tags: ["historical", "glamorous", "twisty"] },
  { title: "A Gentleman in Moscow", author: "Amor Towles", isbn: "9780143110439", genre: "historical", mood: "peaceful", description: "A Russian count under house arrest in a luxury hotel finds meaning, beauty, and human connection across three extraordinary decades.", tags: ["cozy literary", "historical", "beautiful"] },
  { title: "The Midnight Library", author: "Matt Haig", isbn: "9780525559474", genre: "literary", mood: "hopeful", description: "Between life and death exists a library containing books about every life you could have lived. One woman must choose which life is worth living.", tags: ["philosophical", "hopeful", "emotional"] },
  { title: "Six of Crows", author: "Leigh Bardugo", isbn: "9781627792127", genre: "fantasy", mood: "adventurous", description: "A criminal genius assembles six misfits for an impossible heist in a city built entirely on greed, deception, and dangerous magic.", tags: ["heist", "YA", "ensemble"] },
  { title: "The Handmaid's Tale", author: "Margaret Atwood", isbn: "9780385490818", genre: "scifi", mood: "dark", description: "In a theocratic dystopia built on the ashes of America, a woman navigates a brutal system that has reduced her entirely to a vessel.", tags: ["dystopian", "feminist", "essential"] },
  { title: "Educated", author: "Tara Westover", isbn: "9780399590504", genre: "nonfiction", mood: "hopeful", description: "A woman raised by survivalists in rural Idaho educates herself out of poverty and into Cambridge University in this stunning and brave memoir.", tags: ["memoir", "inspiring", "education"] },
  { title: "The House in the Cerulean Sea", author: "TJ Klune", isbn: "9781250217318", genre: "fantasy", mood: "peaceful", description: "A gentle caseworker sent to inspect a magical orphanage finds himself falling for its enigmatic master in this extraordinarily cozy and warm fantasy.", tags: ["cozy fantasy", "wholesome", "sweet"] },
  { title: "Dune", author: "Frank Herbert", isbn: "9780441013593", genre: "scifi", mood: "adventurous", description: "A noble family takes control of the desert planet Arrakis, source of the most valuable substance in the universe, in this foundational science fiction epic.", tags: ["epic", "political", "classic"] },
  { title: "The Silent Patient", author: "Alex Michaelides", isbn: "9781250301697", genre: "thriller", mood: "curious", description: "A celebrity painter shoots her husband five times and then never speaks again, becoming the complete obsession of her forensic psychotherapist.", tags: ["psychological", "debut", "twisty"] },
  { title: "Pachinko", author: "Min Jin Lee", isbn: "9781455563937", genre: "historical", mood: "melancholic", description: "Four generations of a Korean family navigate discrimination, sacrifice, and identity in Japan across the twentieth century in this sweeping saga.", tags: ["family saga", "historical", "powerful"] },
  { title: "Beach Read", author: "Emily Henry", isbn: "9781984806734", genre: "romance", mood: "happy", description: "Two writers with opposite styles spend a summer challenging each other to swap genres and accidentally fall completely in love in the process.", tags: ["contemporary romance", "funny", "summer"] },
  { title: "The Lies of Locke Lamora", author: "Scott Lynch", isbn: "9780553588941", genre: "fantasy", mood: "adventurous", description: "A gang of brilliantly audacious con artists pull off elaborate schemes against the noble class of a fantastical city built on Renaissance Venice.", tags: ["heist", "funny", "complex"] },
  { title: "All the Light We Cannot See", author: "Anthony Doerr", isbn: "9781476746586", genre: "historical", mood: "melancholic", description: "A blind French girl and a German soldier's paths converge in occupied France during WWII in this Pulitzer Prize winning masterpiece of lyrical fiction.", tags: ["WWII", "lyrical", "emotional"] },
  { title: "The Kite Runner", author: "Khaled Hosseini", isbn: "9781594480003", genre: "literary", mood: "melancholic", description: "A privileged Afghan boy and his servant's son form a bond tested by betrayal and war as one man spends decades seeking redemption.", tags: ["Afghanistan", "redemption", "emotional"] },
  { title: "Daisy Jones and The Six", author: "Taylor Jenkins Reid", isbn: "9781524798659", genre: "literary", mood: "romantic", description: "The oral history of a legendary rock band told through interviews that slowly reveal the truth about their breakup and the love that tore them apart.", tags: ["music", "1970s", "unique format"] },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", genre: "nonfiction", mood: "curious", description: "A sweeping history of humankind from the Stone Age to the present examining how Homo sapiens came to dominate the entire planet through stories and myths.", tags: ["history", "science", "essential"] },
  { title: "The Night Circus", author: "Erin Morgenstern", isbn: "9780385534635", genre: "fantasy", mood: "romantic", description: "Two young magicians pitted against each other in a mysterious competition set within an enchanting black and white circus that appears without warning.", tags: ["atmospheric", "magical", "gorgeous"] },
  { title: "A Little Life", author: "Hanya Yanagihara", isbn: "9780804172706", genre: "literary", mood: "dark", description: "Four college friends navigate life in New York over decades as one man's devastating past slowly and painfully comes fully to light.", tags: ["devastating", "friendship", "essential"] },
  { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", genre: "nonfiction", mood: "hopeful", description: "A practical and beautifully written framework for building good habits through tiny changes that compound into remarkable results over time.", tags: ["self help", "practical", "motivating"] },
  { title: "The Cruel Prince", author: "Holly Black", isbn: "9780316310314", genre: "fantasy", mood: "dark", description: "A mortal girl schemes to survive and eventually thrive in the treacherous and beautiful Faerie court in this dark and addictive series opener.", tags: ["fae", "YA", "dark romance"] },
  { title: "Mexican Gothic", author: "Silvia Moreno-Garcia", isbn: "9780525620785", genre: "mystery", mood: "dark", description: "A glamorous socialite travels to a crumbling Mexican mansion to rescue her cousin and discovers something ancient and deeply wrong with the house itself.", tags: ["gothic horror", "feminist", "atmospheric"] },
  { title: "The Song of Achilles", author: "Madeline Miller", isbn: "9780062060624", genre: "literary", mood: "romantic", description: "The story of Achilles and Patroclus told through the eyes of the prince who loved him in this heartbreaking retelling of the Iliad.", tags: ["mythology", "romance", "heartbreaking"] },
  { title: "Where the Crawdads Sing", author: "Delia Owens", isbn: "9780735224292", genre: "mystery", mood: "melancholic", description: "A girl abandoned in the North Carolina marshes raises herself alone and becomes entangled in a murder mystery that tests everything she has built.", tags: ["atmospheric", "nature", "mystery romance"] },
  { title: "The Poppy War", author: "R.F. Kuang", isbn: "9780062662590", genre: "fantasy", mood: "dark", description: "A war orphan aces the empire's most difficult exam and enters a prestigious military academy where she discovers a power that may destroy her.", tags: ["dark fantasy", "Chinese history", "brutal"] },
  { title: "Klara and the Sun", author: "Kazuo Ishiguro", isbn: "9780571364879", genre: "scifi", mood: "melancholic", description: "An artificial friend observes the human world from a shop window and forms a profound bond with a sickly child in this quietly devastating novel.", tags: ["AI", "literary", "emotional"] },
];

// ─── GET TODAY'S BOOK ──────────────────────────

function getTodaysBook() {
  const now       = new Date();
  const start     = new Date(2024, 0, 1);
  const daysSince = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const index     = daysSince % DAILY_BOOKS.length;
  return DAILY_BOOKS[index];
}

// ─── RENDER BOOK OF THE DAY ───────────────────

async function renderBookOfDay() {
  const container = document.getElementById("bookOfDaySection");
  if (!container) return;

  const book = getTodaysBook();
  const isbn = book.isbn?.replace(/[-\s]/g, "") || "";

  // Use shared cover cache — delay to avoid competing with page load requests
  let cover = "";
  await new Promise(r => setTimeout(r, 1500));

  if (typeof fetchCoverWithCache === "function") {
    cover = await fetchCoverWithCache(isbn, book.title, book.author);
  } else {
    try {
      const cacheKey = `bod_cover_${isbn || book.title}`;
      const cached   = localStorage.getItem(cacheKey);
      if (cached) {
        cover = cached;
      } else if (isbn) {
        await new Promise(r => setTimeout(r, 500));
        const res = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1`
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

  // Get hours until next book
  const now      = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const hoursLeft = Math.ceil((tomorrow - now) / (1000 * 60 * 60));

  container.innerHTML = `
    <div class="bod-wrap">
      <div class="bod-header">
        <div class="bod-label">BOOK OF THE DAY</div>
        <div class="bod-timer">Changes in ${hoursLeft}h</div>
      </div>
      <div class="bod-card">
        <div class="bod-cover-wrap">
          ${cover
            ? `<img class="bod-cover" src="${escBOD(cover)}" alt="Cover of ${escBOD(book.title)}" onerror="this.style.display='none'" />`
            : `<div class="bod-cover-fallback">
                <div class="bod-fb-title">${escBOD(book.title)}</div>
                <div class="bod-fb-author">${escBOD(book.author)}</div>
               </div>`
          }
          <div class="bod-genre-tag">${escBOD(book.genre)}</div>
        </div>
        <div class="bod-info">
          <div class="bod-mood-tag">${escBOD(book.mood)}</div>
          <h3 class="bod-title">${escBOD(book.title)}</h3>
          <div class="bod-author">${escBOD(book.author)}</div>
          <p class="bod-desc">${escBOD(book.description)}</p>
          <div class="bod-tags">
            ${(book.tags || []).map(t => `<span class="bod-tag">${escBOD(t)}</span>`).join("")}
          </div>
          <div class="bod-actions">
            <button class="bod-quiz-btn" onclick="startQuizWithMood('${book.genre}', '${book.mood}')">
              Find Similar Books
            </button>
            <button class="bod-save-btn" id="bodSaveBtn" onclick="saveBookOfDay()">
              Add to Shelf
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  window.currentBookOfDay = { ...book, cover };
}

function escBOD(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

// ─── SAVE TO SHELF ────────────────────────────

async function saveBookOfDay() {
  if (!currentUser) {
    if (typeof showAuthModal === "function") showAuthModal();
    return;
  }

  const book = window.currentBookOfDay;
  if (!book) return;

  const btn = document.getElementById("bodSaveBtn");
  if (btn) { btn.textContent = "Saving..."; btn.disabled = true; }

  const { error } = await db
    .from("bookshelf")
    .upsert({
      user_id:  currentUser.id,
      title:    book.title,
      author:   book.author,
      isbn:     book.isbn   || "",
      cover:    book.cover  || "",
      genre:    book.genre  || "",
      mood:     book.mood   || "",
      source:   "book_of_day",
      added_at: new Date().toISOString()
    }, { onConflict: "user_id,title" });

  if (btn) {
    btn.textContent = error ? "Failed" : "Saved to Shelf";
    btn.disabled    = true;
  }
}

// ─── START QUIZ WITH PRESET ───────────────────

function startQuizWithMood(genre, mood) {
  document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    const genreBtn = document.querySelector(`#step1 .option-btn[data-value="${genre}"]`);
    if (genreBtn) genreBtn.click();
  }, 600);
}