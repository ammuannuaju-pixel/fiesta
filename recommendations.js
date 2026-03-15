// recommendations.js
// Curated seed books per genre and mood for high quality recommendations

const SEED_BOOKS = {
  romance: {
    dark: [
      { title: "Corrupt", author: "Penelope Douglas", isbn: "9781682306697", year: "2014", description: "A dark and twisted enemies to lovers story set at a prestigious prep school where obsession blurs the line between love and revenge.", tags: ["dark romance", "enemies to lovers", "new adult"] },
      { title: "Haunting Adeline", author: "H.D. Carlton", isbn: "9798350913910", year: "2022", description: "A writer discovers she is being stalked by a mysterious man who is utterly obsessed with her in this dark and provocative thriller romance.", tags: ["dark romance", "stalker", "gothic"] },
      { title: "Tears of Tess", author: "Pepper Winters", isbn: "9780994432902", year: "2014", description: "A young woman is kidnapped and sold into the world of human trafficking, where she must navigate impossible choices about survival and love.", tags: ["dark romance", "captive", "intense"] },
      { title: "Bully", author: "Penelope Douglas", isbn: "9781101987711", year: "2014", description: "A girl returns home to face the boy who made her life hell, only to discover the truth behind his cruelty runs deeper than she ever imagined.", tags: ["dark romance", "bully romance", "new adult"] },
      { title: "Vicious", author: "L.J. Shen", isbn: "9781542048774", year: "2017", description: "A ruthless billionaire and the girl he has tormented for years find themselves bound together by secrets neither can escape.", tags: ["dark romance", "billionaire", "enemies"] },
      { title: "Twist Me", author: "Anna Zaires", isbn: "9781631420436", year: "2014", description: "A young woman is kidnapped by a dangerous man who becomes completely obsessed with possessing her in every way.", tags: ["dark romance", "captive", "obsession"] },
    ],
    romantic: [
      { title: "The Kiss Quotient", author: "Helen Hoang", isbn: "9780451490803", year: "2018", description: "An econometrician with autism hires an escort to teach her about relationships and discovers that love cannot be calculated.", tags: ["contemporary romance", "sweet", "diverse"] },
      { title: "People We Meet on Vacation", author: "Emily Henry", isbn: "9781984806758", year: "2021", description: "Two best friends with undeniable chemistry take one last trip together to save their friendship and discover what they truly mean to each other.", tags: ["contemporary", "friends to lovers", "travel"] },
      { title: "The Spanish Love Deception", author: "Elena Armas", isbn: "9781982172442", year: "2021", description: "A woman asks her infuriating colleague to pose as her boyfriend at her sister's wedding in Spain with predictably chaotic and romantic results.", tags: ["fake dating", "enemies to lovers", "funny"] },
      { title: "Act Your Age Eve Brown", author: "Talia Hibbert", isbn: "9780062941275", year: "2021", description: "A chronically disorganised woman crashes into the life of an uptight bed and breakfast owner and turns everything beautifully upside down.", tags: ["contemporary", "grumpy sunshine", "sweet"] },
      { title: "In a Holidaze", author: "Christina Lauren", isbn: "9781982152376", year: "2020", description: "A young woman finds herself reliving the same holiday vacation over and over until she figures out what her heart truly wants.", tags: ["holiday", "second chance", "sweet romance"] },
      { title: "The Flatshare", author: "Beth O'Leary", isbn: "9781250295637", year: "2019", description: "Two strangers share a flat on a split schedule and fall in love entirely through notes they leave for each other.", tags: ["slow burn", "contemporary", "cozy"] },
    ],
    happy: [
      { title: "Beach Read", author: "Emily Henry", isbn: "9781984806734", year: "2020", description: "Two writers with opposite styles spend a summer challenging each other to swap genres and accidentally fall in love in the process.", tags: ["funny", "contemporary", "summer"] },
      { title: "The Hating Game", author: "Sally Thorne", isbn: "9780062439598", year: "2016", description: "Two office rivals who have perfected the art of mutual annoyance discover their feelings run much deeper than hatred.", tags: ["enemies to lovers", "office romance", "funny"] },
      { title: "Boyfriend Material", author: "Alexis Hall", isbn: "9781728206141", year: "2020", description: "A man with a terrible reputation needs a fake boyfriend to clean up his image and finds the most unlikely candidate imaginable.", tags: ["fake dating", "funny", "British"] },
      { title: "One Day in December", author: "Josie Silver", isbn: "9780525622871", year: "2018", description: "A woman spots her dream man through a bus window and spends a year looking for him, only to find him in the most unexpected place.", tags: ["sweet", "Christmas", "slow burn"] },
      { title: "The Unhoneymooners", author: "Christina Lauren", isbn: "9781501128035", year: "2019", description: "Two people who despise each other are forced to pretend to be a happy couple on a honeymoon trip meant for someone else.", tags: ["fake dating", "funny", "tropical"] },
      { title: "Second First Impressions", author: "Sally Thorne", isbn: "9780062819987", year: "2021", description: "A reserved woman running a retirement villa and a charming man hired to do odd jobs discover that first impressions are rarely the whole story.", tags: ["sweet", "funny", "slow burn"] },
    ],
    melancholic: [
      { title: "The Time Traveler's Wife", author: "Audrey Niffenegger", isbn: "9780156029438", year: "2003", description: "A love story about a man with a genetic disorder that causes him to time travel unpredictably and the wife who loves him across all their timelines.", tags: ["time travel", "emotional", "literary romance"] },
      { title: "Me Before You", author: "Jojo Moyes", isbn: "9780143124542", year: "2012", description: "A small town woman becomes caregiver to a paralyzed man and forms a bond that will forever change both their lives.", tags: ["emotional", "tearjerker", "contemporary"] },
      { title: "Normal People", author: "Sally Rooney", isbn: "9780571334650", year: "2018", description: "Two Irish teenagers navigate the push and pull of desire, class, and emotional vulnerability across years of connection and disconnection.", tags: ["literary", "quiet", "Irish"] },
      { title: "One Day", author: "David Nicholls", isbn: "9780307474315", year: "2009", description: "Two people meet on graduation day and the story follows them on the same date every year for twenty years.", tags: ["emotional", "British", "friends to lovers"] },
      { title: "If I Stay", author: "Gayle Forman", isbn: "9780142415436", year: "2009", description: "A teenage musician faces an impossible choice after a devastating accident leaves her hovering between life and death.", tags: ["YA", "emotional", "music"] },
      { title: "The Fault in Our Stars", author: "John Green", isbn: "9780525478812", year: "2012", description: "Two teenagers with cancer fall deeply in love and face the brutal unfairness of their circumstances with extraordinary grace and humour.", tags: ["YA", "tearjerker", "beautiful"] },
    ],
    adventurous: [
      { title: "Outlander", author: "Diana Gabaldon", isbn: "9780440212560", year: "1991", description: "A WWII nurse is swept back to 18th century Scotland where she falls for a Highland warrior and must navigate two worlds and two loves.", tags: ["historical", "time travel", "epic"] },
      { title: "The Bronze Horseman", author: "Paullina Simons", isbn: "9780060959722", year: "2000", description: "A sweeping wartime romance set in besieged Leningrad following two people bound together by impossible circumstances and devastating love.", tags: ["historical", "WWII", "epic"] },
      { title: "A Discovery of Witches", author: "Deborah Harkness", isbn: "9780670022410", year: "2011", description: "A scholar and witch discovers an enchanted manuscript and falls for a mysterious vampire in a world where magic and danger are inseparable.", tags: ["paranormal", "vampire", "historical"] },
      { title: "The Pillars of the Earth", author: "Ken Follett", isbn: "9780451166890", year: "1989", description: "The building of a cathedral in 12th century England becomes the backdrop for an epic story of love, ambition, and survival across generations.", tags: ["historical", "epic", "medieval"] },
    ],
    peaceful: [
      { title: "The Flatshare", author: "Beth O'Leary", isbn: "9781250295637", year: "2019", description: "Two strangers share a flat on a split schedule and fall in love entirely through the notes they leave each other.", tags: ["cozy", "slow burn", "sweet"] },
      { title: "In Other Words", author: "Jhumpa Lahiri", isbn: "9780307476944", year: "2016", description: "A celebrated author falls in love with the Italian language and spends a year in Rome learning to live and write in it.", tags: ["literary", "quiet", "beautiful"] },
      { title: "The House in the Cerulean Sea", author: "TJ Klune", isbn: "9781250217318", year: "2020", description: "A gentle caseworker is sent to investigate a magical orphanage and finds himself falling for its enigmatic master in this warm and cozy fantasy romance.", tags: ["cozy fantasy", "sweet", "wholesome"] },
      { title: "A Man Called Ove", author: "Fredrik Backman", isbn: "9781476738024", year: "2012", description: "A grumpy old widower finds his solitary existence disrupted by a lively family of neighbours who bring unexpected warmth back into his life.", tags: ["cozy", "heartwarming", "Swedish"] },
    ],
    hopeful: [
      { title: "Eleanor Oliphant is Completely Fine", author: "Gail Honeyman", isbn: "9780735220683", year: "2017", description: "A painfully isolated woman begins to open up to the world through an unlikely friendship and discovers that healing is possible.", tags: ["hopeful", "contemporary", "emotional"] },
      { title: "The Rosie Project", author: "Graeme Simsion", isbn: "9781476729060", year: "2013", description: "A genetics professor with no social skills devises a scientific questionnaire to find the perfect wife and meets someone who defies all his criteria.", tags: ["funny", "sweet", "neurodivergent"] },
      { title: "Where the Crawdads Sing", author: "Delia Owens", isbn: "9780735224292", year: "2018", description: "A girl abandoned in the North Carolina marshes raises herself alone and becomes entangled in a mystery that tests everything she has built.", tags: ["atmospheric", "mystery romance", "beautiful"] },
    ],
    curious: [
      { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", isbn: "9781501161933", year: "2017", description: "A reclusive Hollywood legend finally tells her full story to an unknown journalist, revealing a life of passion, ambition, and devastating love.", tags: ["historical", "glamorous", "twisty"] },
      { title: "Daisy Jones and The Six", author: "Taylor Jenkins Reid", isbn: "9781524798659", year: "2019", description: "The oral history of a legendary rock band told through interviews reveals the truth about their breakup and the love at the centre of it all.", tags: ["historical", "music", "unique format"] },
      { title: "Attachments", author: "Rainbow Rowell", isbn: "9780452297548", year: "2011", description: "An IT employee hired to monitor office emails falls in love with a woman through the emails he is not supposed to be reading.", tags: ["contemporary", "unique premise", "sweet"] },
    ],
  },

  fantasy: {
    dark: [
      { title: "The Name of the Wind", author: "Patrick Rothfuss", isbn: "9780756404741", year: "2007", description: "A legendary wizard recounts his extraordinary life story from orphaned street performer to the most feared magician of his age.", tags: ["epic", "magic", "lyrical"] },
      { title: "The Way of Kings", author: "Brandon Sanderson", isbn: "9780765326355", year: "2010", description: "On a world ravaged by magical storms, warriors scholars and assassins are drawn into an ancient conflict of cosmic proportions.", tags: ["epic", "complex", "worldbuilding"] },
      { title: "The Blade Itself", author: "Joe Abercrombie", isbn: "9780575079793", year: "2006", description: "A brutal and darkly comic fantasy following a torturer, a barbarian, and a crippled veteran as they are drawn into a war nobody wants.", tags: ["grimdark", "dark", "subversive"] },
      { title: "Prince of Thorns", author: "Mark Lawrence", isbn: "9780441020409", year: "2011", description: "A teenage prince leads a band of murderers across a shattered empire driven by revenge and a darkness that may be his destiny.", tags: ["grimdark", "dark", "controversial"] },
      { title: "The Black Company", author: "Glen Cook", isbn: "9780812521054", year: "1984", description: "A mercenary company serves a powerful sorceress in a world where the lines between good and evil are blurred beyond recognition.", tags: ["grimdark", "military fantasy", "classic"] },
      { title: "Red Sister", author: "Mark Lawrence", isbn: "9780425268582", year: "2017", description: "A girl trained as a killer nun in a dying world discovers she may be the key to its salvation or its destruction.", tags: ["dark fantasy", "assassin", "female lead"] },
    ],
    adventurous: [
      { title: "The Final Empire", author: "Brandon Sanderson", isbn: "9780765311788", year: "2006", description: "A street thief with rare magical powers joins a heist to overthrow a seemingly immortal ruler who has reigned for a thousand years.", tags: ["heist", "magic system", "epic"] },
      { title: "The Lies of Locke Lamora", author: "Scott Lynch", isbn: "9780553588941", year: "2006", description: "A gang of con artists pull off elaborate schemes against the noble class of a fantastical city modelled on Renaissance Venice.", tags: ["heist", "funny", "complex"] },
      { title: "The Deed of Paksenarrion", author: "Elizabeth Moon", isbn: "9780671721046", year: "1988", description: "A young farm girl joins a mercenary company and rises to become a legendary warrior blessed by the gods themselves.", tags: ["military fantasy", "female lead", "classic"] },
      { title: "Six of Crows", author: "Leigh Bardugo", isbn: "9781627792127", year: "2015", description: "A criminal genius assembles a crew of six misfits for an impossible heist in a city built on greed and deception.", tags: ["heist", "YA", "diverse cast"] },
      { title: "The Stormlight Archive", author: "Brandon Sanderson", isbn: "9780765326355", year: "2010", description: "An epic saga following multiple characters on a world where ancient evils are stirring and a new generation of legendary warriors must rise.", tags: ["epic", "long", "complex magic"] },
    ],
    romantic: [
      { title: "A Court of Thorns and Roses", author: "Sarah J. Maas", isbn: "9781619634442", year: "2015", description: "A mortal huntress is taken to a magical land where she falls for a dangerous fae lord and discovers a darkness threatening all worlds.", tags: ["fae", "passionate", "YA to adult"] },
      { title: "The Night Circus", author: "Erin Morgenstern", isbn: "9780385534635", year: "2011", description: "Two young magicians pitted against each other in a mysterious competition set within an enchanting black and white circus that appears without warning.", tags: ["atmospheric", "magical", "gorgeous prose"] },
      { title: "Daughter of the Moon Goddess", author: "Sue Lynn Tan", isbn: "9780063031807", year: "2022", description: "A young woman embarks on a quest across the celestial realm to save her imprisoned mother in this lush Chinese mythology inspired fantasy romance.", tags: ["mythology", "Chinese fantasy", "lyrical"] },
      { title: "The Shadow of the Wind", author: "Carlos Ruiz Zafon", isbn: "9780143034902", year: "2001", description: "A boy in postwar Barcelona discovers a mysterious novel whose author appears to have been erased from history in this gothic romantic mystery.", tags: ["gothic", "atmospheric", "Spain"] },
      { title: "Spinning Silver", author: "Naomi Novik", isbn: "9780399180996", year: "2018", description: "A moneylender's daughter makes a dangerous bargain with a winter king in this stunning Rumpelstiltskin retelling rich with Slavic folklore.", tags: ["fairy tale retelling", "feminist", "beautiful"] },
    ],
    hopeful: [
      { title: "The Priory of the Orange Tree", author: "Samantha Shannon", isbn: "9781635570298", year: "2019", description: "A matriarchal fantasy world faces an ancient evil as a queen, a dragonrider, and a spy must unite despite impossible odds.", tags: ["dragons", "feminist", "epic"] },
      { title: "Circe", author: "Madeline Miller", isbn: "9780316556347", year: "2018", description: "The witch of Greek mythology finally claims her own story, discovering her powers and finding her place among gods and mortals.", tags: ["mythology", "feminist", "lyrical"] },
      { title: "The House in the Cerulean Sea", author: "TJ Klune", isbn: "9781250217318", year: "2020", description: "A gentle caseworker sent to inspect a magical orphanage finds himself falling for its master in this extraordinarily cozy and wholesome fantasy.", tags: ["cozy fantasy", "wholesome", "found family"] },
      { title: "Piranesi", author: "Susanna Clarke", isbn: "9781635575637", year: "2020", description: "A man lives alone in a house containing infinite halls and tidal seas, cataloguing its beauty while searching for answers about his own identity.", tags: ["unique", "mysterious", "beautiful"] },
    ],
    melancholic: [
      { title: "Jonathan Strange and Mr Norrell", author: "Susanna Clarke", isbn: "9781582346038", year: "2004", description: "Two very different magicians attempt to restore magic to England during the Napoleonic Wars in this richly imagined and deeply melancholic novel.", tags: ["historical fantasy", "literary", "slow burn"] },
      { title: "The Bear and the Nightingale", author: "Katherine Arden", isbn: "9781101885932", year: "2017", description: "A girl with a gift for magic must face the winter demon threatening her village in a world where old gods still hold power.", tags: ["Russian folklore", "atmospheric", "feminist"] },
      { title: "Uprooted", author: "Naomi Novik", isbn: "9780804179034", year: "2015", description: "A young woman taken by a cold and powerful wizard discovers her own extraordinary magic and a darkness consuming the forest she loves.", tags: ["fairy tale", "feminist", "beautiful"] },
    ],
    curious: [
      { title: "The Gentleman's Guide to Vice and Virtue", author: "Mackenzi Lee", isbn: "9780062382818", year: "2017", description: "A young bisexual lord embarks on a Grand Tour of Europe with his best friend and discovers adventure, alchemy, and unexpected love.", tags: ["historical", "YA", "funny"] },
      { title: "The Philosopher's Flight", author: "Tom Miller", isbn: "9781476778150", year: "2018", description: "A young man determined to practice the female dominated art of empirical magic enlists during WWI in a world where magic is real and political.", tags: ["alternate history", "magic", "unique"] },
      { title: "Jonathan Strange and Mr Norrell", author: "Susanna Clarke", isbn: "9781582346038", year: "2004", description: "Two magicians attempt to restore magic to England during the Napoleonic Wars in this meticulously researched and endlessly inventive novel.", tags: ["historical", "literary", "detailed"] },
    ],
    peaceful: [
      { title: "The House in the Cerulean Sea", author: "TJ Klune", isbn: "9781250217318", year: "2020", description: "A cozy and warm fantasy about a gentle caseworker who discovers that love and belonging can be found in the most magical of places.", tags: ["cozy", "wholesome", "sweet romance"] },
      { title: "Legends and Lattes", author: "Travis Baldree", isbn: "9781250884466", year: "2022", description: "A retired orc barbarian opens a coffee shop in a fantasy city and discovers that the hardest battles are the ones fought for peace.", tags: ["cozy fantasy", "slice of life", "sweet"] },
      { title: "Piranesi", author: "Susanna Clarke", isbn: "9781635575637", year: "2020", description: "A man catalogues the beauty of an infinite magical house while piecing together the mystery of his own past in this quiet extraordinary novel.", tags: ["unique", "peaceful", "beautiful"] },
    ],
  },

  mystery: {
    dark: [
      { title: "Gone Girl", author: "Gillian Flynn", isbn: "9780307588371", year: "2012", description: "When a woman disappears on her anniversary her husband becomes the prime suspect in a case that grows darker and more twisted with every page.", tags: ["psychological", "twisty", "unreliable narrator"] },
      { title: "Sharp Objects", author: "Gillian Flynn", isbn: "9780307341556", year: "2006", description: "A journalist returns to her hometown to cover a series of murders and confronts the darkness of her own past and family.", tags: ["gothic", "psychological", "dark"] },
      { title: "Dark Places", author: "Gillian Flynn", isbn: "9780307341570", year: "2009", description: "The sole survivor of a family massacre agrees to revisit the night her brother was convicted of the crime and discovers the truth is far worse.", tags: ["dark", "psychological", "crime"] },
      { title: "In the Woods", author: "Tana French", isbn: "9780670038602", year: "2007", description: "A Dublin detective investigates a murder at an archaeological site connected to a childhood trauma he cannot remember in this atmospheric literary thriller.", tags: ["atmospheric", "literary", "Dublin"] },
      { title: "The Silent Patient", author: "Alex Michaelides", isbn: "9781250301697", year: "2019", description: "A famous painter shoots her husband five times and then never speaks again, becoming the obsession of her forensic psychotherapist.", tags: ["psychological", "twisty", "debut"] },
    ],
    curious: [
      { title: "And Then There Were None", author: "Agatha Christie", isbn: "9780312330873", year: "1939", description: "Ten strangers lured to an isolated island begin to die one by one in what remains the world's best selling mystery novel.", tags: ["classic", "locked room", "brilliant"] },
      { title: "The Thursday Murder Club", author: "Richard Osman", isbn: "9781984880963", year: "2020", description: "Four retirees in a peaceful village meet weekly to solve cold cases until a real murder lands right on their doorstep.", tags: ["cozy", "funny", "British"] },
      { title: "The Name of the Rose", author: "Umberto Eco", isbn: "9780151446476", year: "1980", description: "A Franciscan friar and his novice investigate a series of mysterious deaths in a medieval monastery rich with secrets and forbidden knowledge.", tags: ["historical", "intellectual", "classic"] },
      { title: "Big Little Lies", author: "Liane Moriarty", isbn: "9780399167065", year: "2014", description: "Three women's lives intertwine in a beachside community where a murder at a school fundraiser exposes long buried secrets about all of them.", tags: ["domestic", "funny", "twisty"] },
      { title: "Truly Devious", author: "Maureen Johnson", isbn: "9780062338051", year: "2018", description: "A true crime obsessed teenager arrives at an elite Vermont academy and investigates a decades old kidnapping that may be connected to new murders.", tags: ["YA", "boarding school", "mystery"] },
    ],
    happy: [
      { title: "The Thursday Murder Club", author: "Richard Osman", isbn: "9781984880963", year: "2020", description: "Four charming retirees solve real murders with wit, persistence, and a great deal of coffee in this delightful British cozy mystery.", tags: ["cozy", "funny", "heartwarming"] },
      { title: "The No. 1 Ladies Detective Agency", author: "Alexander McCall Smith", isbn: "9780375709616", year: "1998", description: "Botswana's first and only female detective solves cases with wisdom, warmth, and gentle good humour in this utterly charming series opener.", tags: ["cozy", "warm", "Botswana"] },
      { title: "Fluke", author: "Christopher Moore", isbn: "9780060566180", year: "2003", description: "A whale researcher discovers something impossible inside a humpback whale and gets pulled into a hilarious mystery beneath the Pacific Ocean.", tags: ["funny", "quirky", "marine biology"] },
    ],
    melancholic: [
      { title: "The Lovely Bones", author: "Alice Sebold", isbn: "9780316666343", year: "2002", description: "A murdered teenage girl narrates from heaven as she watches her family struggle to cope with her absence and find meaning in the aftermath.", tags: ["emotional", "grief", "literary"] },
      { title: "A Gentleman in Moscow", author: "Amor Towles", isbn: "9780143110439", year: "2016", description: "A Russian count sentenced to house arrest in a luxury hotel observes the transformation of his country across three decades from his elegant prison.", tags: ["literary", "historical", "beautiful"] },
      { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", isbn: "9780307454546", year: "2005", description: "A disgraced journalist and a brilliant antisocial hacker investigate a decades old disappearance in this gripping Scandinavian thriller.", tags: ["Scandinavian noir", "feminist", "complex"] },
    ],
  },

  scifi: {
    hopeful: [
      { title: "Project Hail Mary", author: "Andy Weir", isbn: "9780593135204", year: "2021", description: "A lone astronaut wakes up with no memory millions of miles from Earth and must save the solar system using nothing but science and ingenuity.", tags: ["hopeful", "science heavy", "page turner"] },
      { title: "The Martian", author: "Andy Weir", isbn: "9780804139021", year: "2011", description: "An astronaut stranded alone on Mars must use his botany skills and relentless ingenuity to survive long enough to be rescued.", tags: ["survival", "funny", "science"] },
      { title: "A Memory Called Empire", author: "Arkady Martine", isbn: "9781250186430", year: "2019", description: "An ambassador from a small space station arrives at the heart of a galactic empire and finds herself entangled in political intrigue and murder.", tags: ["political", "literary", "diverse"] },
      { title: "Children of Time", author: "Adrian Tchaikovsky", isbn: "9781447273448", year: "2015", description: "Uplifted spiders develop a civilisation over millennia while the last remnants of humanity search desperately for a new home.", tags: ["hard scifi", "epic scale", "unique"] },
    ],
    dark: [
      { title: "The Handmaid's Tale", author: "Margaret Atwood", isbn: "9780385490818", year: "1985", description: "In a theocratic dystopia built on the ashes of the United States a woman navigates a brutal system that has reduced her to a vessel.", tags: ["dystopian", "feminist", "terrifying"] },
      { title: "Never Let Me Go", author: "Kazuo Ishiguro", isbn: "9781400078776", year: "2005", description: "Students at an elite English boarding school slowly discover the devastating truth about their existence and what their future holds.", tags: ["quiet dystopia", "heartbreaking", "literary"] },
      { title: "Brave New World", author: "Aldous Huxley", isbn: "9780061776090", year: "1932", description: "A world where humans are engineered for happiness and stability is challenged by the arrival of a man who has known genuine emotion and suffering.", tags: ["classic", "dystopian", "philosophical"] },
      { title: "Station Eleven", author: "Emily St. John Mandel", isbn: "9780385353304", year: "2014", description: "A flu pandemic collapses civilisation and a travelling theatre company carries art and memory through the ruins in this haunting post-apocalyptic novel.", tags: ["post-apocalyptic", "literary", "hopeful darkness"] },
    ],
    adventurous: [
      { title: "Dune", author: "Frank Herbert", isbn: "9780441013593", year: "1965", description: "A noble family takes control of the desert planet Arrakis, source of the most valuable substance in the universe, in this foundational science fiction epic.", tags: ["epic", "political", "classic"] },
      { title: "The Long Way to a Small Angry Planet", author: "Becky Chambers", isbn: "9781500453305", year: "2014", description: "A crew of found family travels through a vast and wondrous galaxy on a tunnelling ship in this warm and character driven space opera.", tags: ["cozy scifi", "found family", "hopeful"] },
      { title: "Ender's Game", author: "Orson Scott Card", isbn: "9780812550702", year: "1985", description: "A brilliant child is recruited into a battle school in space to train as humanity's last hope against an alien invasion.", tags: ["classic", "military", "YA"] },
      { title: "Red Rising", author: "Pierce Brown", isbn: "9780345539786", year: "2014", description: "A miner on Mars discovers his society is built on lies and infiltrates the ruling class to destroy them from within in this brutal and gripping trilogy opener.", tags: ["dystopian", "action", "page turner"] },
    ],
    curious: [
      { title: "Flowers for Algernon", author: "Daniel Keyes", isbn: "9780156030304", year: "1966", description: "A man with an intellectual disability undergoes an experimental procedure that dramatically increases his intelligence with profound and unexpected consequences.", tags: ["classic", "emotional", "thought provoking"] },
      { title: "Klara and the Sun", author: "Kazuo Ishiguro", isbn: "9780571364879", year: "2021", description: "An artificial friend observes the human world from a shop window and forms a profound bond with a sickly child in this quietly devastating novel.", tags: ["AI", "literary", "emotional"] },
      { title: "The Hitchhiker's Guide to the Galaxy", author: "Douglas Adams", isbn: "9780345391803", year: "1979", description: "An ordinary man is swept through the cosmos after Earth is demolished and discovers that the answer to life the universe and everything is 42.", tags: ["funny", "satirical", "classic"] },
    ],
  },

  thriller: {
    dark: [
      { title: "The Silent Patient", author: "Alex Michaelides", isbn: "9781250301697", year: "2019", description: "A celebrity painter shoots her husband and then never speaks again, becoming the obsession of her forensic psychotherapist.", tags: ["psychological", "debut", "twisty"] },
      { title: "Behind Closed Doors", author: "B.A. Paris", isbn: "9781250121004", year: "2016", description: "A perfect marriage hides a terrifying secret that their friends cannot see in this chilling domestic thriller about control and survival.", tags: ["domestic", "dark", "chilling"] },
      { title: "The Woman in the Window", author: "A.J. Finn", isbn: "9780062678416", year: "2018", description: "An agoraphobic woman watching her neighbours through her window witnesses something she was never meant to see.", tags: ["psychological", "unreliable narrator", "suspenseful"] },
      { title: "Verity", author: "Colleen Hoover", isbn: "9781538724736", year: "2018", description: "A struggling writer discovers a disturbing manuscript hidden in a bestselling author's home that may contain a confession to terrible crimes.", tags: ["dark", "psychological", "romance thriller"] },
    ],
    adventurous: [
      { title: "The Da Vinci Code", author: "Dan Brown", isbn: "9780385504201", year: "2003", description: "A symbologist races through Europe solving a murder mystery that threatens to reveal a secret about the foundations of Christianity.", tags: ["fast paced", "conspiracy", "page turner"] },
      { title: "I Am Pilgrim", author: "Terry Hayes", isbn: "9781451697568", year: "2013", description: "A retired intelligence agent is pulled back into action to stop a bioterrorism plot that could kill millions across the world.", tags: ["espionage", "global", "page turner"] },
      { title: "The Girl with the Dragon Tattoo", author: "Stieg Larsson", isbn: "9780307454546", year: "2005", description: "A disgraced journalist and an antisocial hacker with a photographic memory investigate a decades old family mystery in frozen Sweden.", tags: ["Scandinavian", "feminist", "complex"] },
    ],
    curious: [
      { title: "Gone Girl", author: "Gillian Flynn", isbn: "9780307588371", year: "2012", description: "A woman's disappearance on her anniversary sets off a media frenzy and reveals that both husband and wife have been lying about everything.", tags: ["psychological", "unreliable narrator", "marriage"] },
      { title: "The Woman in the Window", author: "A.J. Finn", isbn: "9780062678416", year: "2018", description: "An agoraphobic child psychologist spies on her neighbours from her New York townhouse and witnesses a crime that no one believes she saw.", tags: ["Hitchcock inspired", "psychological", "twisty"] },
      { title: "Big Little Lies", author: "Liane Moriarty", isbn: "9780399167065", year: "2014", description: "Three women with seemingly perfect lives become entangled in a murder investigation that exposes the truth lurking beneath their polished surfaces.", tags: ["domestic", "twisty", "feminist"] },
    ],
  },

  literary: {
    melancholic: [
      { title: "A Little Life", author: "Hanya Yanagihara", isbn: "9780804172706", year: "2015", description: "Four college friends navigate life in New York over decades as one man's devastating past slowly and painfully comes to light.", tags: ["devastating", "friendship", "trauma"] },
      { title: "The God of Small Things", author: "Arundhati Roy", isbn: "9780006550686", year: "1997", description: "In Kerala India forbidden love and a family tragedy unfold across time in non-linear fashion in this Booker Prize winning masterpiece.", tags: ["Indian literature", "lyrical", "tragic"] },
      { title: "The Remains of the Day", author: "Kazuo Ishiguro", isbn: "9780679731726", year: "1989", description: "An English butler reflects on his decades of devoted service and the choices he made that quietly defined and diminished his life.", tags: ["quiet", "repression", "British"] },
      { title: "Never Let Me Go", author: "Kazuo Ishiguro", isbn: "9781400078776", year: "2005", description: "Students at an English boarding school slowly discover the devastating truth about their existence and learn to accept the unacceptable.", tags: ["dystopian", "heartbreaking", "quiet"] },
    ],
    curious: [
      { title: "Cloud Atlas", author: "David Mitchell", isbn: "9780375507250", year: "2004", description: "Six interlocking narratives spanning centuries and genres explore how human souls are connected across time and how the powerful exploit the weak.", tags: ["experimental", "complex", "ambitious"] },
      { title: "If on a winter's night a traveler", author: "Italo Calvino", isbn: "9780156439619", year: "1979", description: "A novel that directly addresses you the reader as you attempt to read a novel that keeps being interrupted by different beginnings.", tags: ["experimental", "postmodern", "unique"] },
      { title: "House of Leaves", author: "Mark Z. Danielewski", isbn: "9780375703768", year: "2000", description: "A blind old man writes an academic analysis of a documentary that does not exist about a house that is impossible in this labyrinthine horror novel.", tags: ["experimental", "horror", "unique format"] },
    ],
    hopeful: [
      { title: "The Alchemist", author: "Paulo Coelho", isbn: "9780062315007", year: "1988", description: "A shepherd boy travels from Spain to the Egyptian pyramids following a dream that teaches him about listening to his heart and finding his destiny.", tags: ["philosophical", "inspirational", "fable"] },
      { title: "Americanah", author: "Chimamanda Ngozi Adichie", isbn: "9780307455925", year: "2013", description: "A young Nigerian woman emigrates to America and navigates race identity and love across two continents in this vivid and important novel.", tags: ["contemporary", "race", "Nigerian literature"] },
      { title: "The Kite Runner", author: "Khaled Hosseini", isbn: "9781594480003", year: "2003", description: "A privileged Afghan boy and his servant's son form a bond tested by betrayal and war as one man spends his life seeking redemption.", tags: ["Afghanistan", "redemption", "emotional"] },
    ],
    dark: [
      { title: "Blood Meridian", author: "Cormac McCarthy", isbn: "9780679728757", year: "1985", description: "A teenager joins a group of mercenaries in the 1850s American southwest in what may be the most violent and philosophically dark novel ever written.", tags: ["dark", "violent", "masterpiece"] },
      { title: "American Psycho", author: "Bret Easton Ellis", isbn: "9780679735779", year: "1991", description: "A wealthy New York investment banker may or may not be a serial killer in this satirical and deeply disturbing examination of 1980s materialism.", tags: ["dark", "satire", "controversial"] },
      { title: "Lolita", author: "Vladimir Nabokov", isbn: "9780679723165", year: "1955", description: "A brilliant and unreliable narrator tells the story of his obsession in Nabokov's most controversial and stylistically extraordinary novel.", tags: ["controversial", "literary", "unreliable narrator"] },
    ],
    peaceful: [
      { title: "A Gentleman in Moscow", author: "Amor Towles", isbn: "9780143110439", year: "2016", description: "A Russian count under house arrest in a luxury hotel finds meaning beauty and connection across three decades in his elegant and shrinking world.", tags: ["cozy literary", "historical", "beautiful"] },
      { title: "The Remains of the Day", author: "Kazuo Ishiguro", isbn: "9780679731726", year: "1989", description: "A butler drives through the English countryside reflecting on his years of service in this quiet masterpiece about dignity and regret.", tags: ["quiet", "British", "reflective"] },
      { title: "84 Charing Cross Road", author: "Helene Hanff", isbn: "9780140143508", year: "1970", description: "A witty New York writer and a reserved London bookseller exchange letters over twenty years in this charming love letter to books and friendship.", tags: ["epistolary", "cozy", "book lover"] },
    ],
  },

  historical: {
    adventurous: [
      { title: "The Pillars of the Earth", author: "Ken Follett", isbn: "9780451166890", year: "1989", description: "The building of a cathedral in 12th century England becomes the backdrop for a sweeping epic of love power and survival across generations.", tags: ["medieval", "epic", "saga"] },
      { title: "Shogun", author: "James Clavell", isbn: "9780440178002", year: "1975", description: "An English navigator shipwrecked in feudal Japan becomes entangled in a power struggle between rival warlords in this epic and immersive saga.", tags: ["Japan", "epic", "adventure"] },
      { title: "The Name of the Rose", author: "Umberto Eco", isbn: "9780151446476", year: "1980", description: "A Franciscan friar investigates a series of mysterious deaths in a medieval monastery in this intellectually rich and atmospheric mystery.", tags: ["medieval", "mystery", "intellectual"] },
    ],
    melancholic: [
      { title: "All the Light We Cannot See", author: "Anthony Doerr", isbn: "9781476746586", year: "2014", description: "A blind French girl and a German soldier's paths converge in occupied Saint-Malo during WWII in this Pulitzer Prize winning novel.", tags: ["WWII", "lyrical", "emotional"] },
      { title: "The Book Thief", author: "Markus Zusak", isbn: "9780375842207", year: "2005", description: "A girl in Nazi Germany steals books and shares them with neighbours and a hidden Jew while Death narrates her story with dark tenderness.", tags: ["WWII", "YA", "unique narrator"] },
      { title: "Pachinko", author: "Min Jin Lee", isbn: "9781455563937", year: "2017", description: "Four generations of a Korean family navigate discrimination sacrifice and identity in Japan across the twentieth century in this sweeping saga.", tags: ["family saga", "Korean Japanese history", "powerful"] },
    ],
    curious: [
      { title: "Wolf Hall", author: "Hilary Mantel", isbn: "9780312429980", year: "2009", description: "Thomas Cromwell rises through the treacherous court of Henry VIII in this Booker Prize winning novel told in an extraordinary present tense voice.", tags: ["Tudor", "political", "Booker Prize"] },
      { title: "Lincoln in the Bardo", author: "George Saunders", isbn: "9780812985405", year: "2017", description: "President Lincoln visits his dead son's crypt on a single night and the ghosts trapped in the bardo are transformed by grief and love.", tags: ["experimental", "Civil War", "emotional"] },
      { title: "The Name of the Rose", author: "Umberto Eco", isbn: "9780151446476", year: "1980", description: "A medieval mystery set in a monastery where forbidden knowledge and murder intersect in this dense and rewarding intellectual thriller.", tags: ["medieval", "intellectual", "mystery"] },
    ],
  },

  nonfiction: {
    curious: [
      { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780062316097", year: "2011", description: "A sweeping history of humankind from the Stone Age to the present examining how stories and myths allowed Homo sapiens to dominate the planet.", tags: ["history", "science", "thought provoking"] },
      { title: "Thinking Fast and Slow", author: "Daniel Kahneman", isbn: "9780374533557", year: "2011", description: "A Nobel Prize winner examines the two systems of thought that drive our decisions and the systematic errors in our thinking.", tags: ["psychology", "science", "Nobel Prize"] },
      { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", isbn: "9781400052189", year: "2010", description: "The extraordinary story of a woman whose cancer cells were taken without her knowledge and became one of medicine's most important tools.", tags: ["science", "ethics", "biography"] },
      { title: "Guns Germs and Steel", author: "Jared Diamond", isbn: "9780393317558", year: "1997", description: "A Pulitzer Prize winning examination of why some civilisations came to dominate others through geography biology and the accidents of history.", tags: ["history", "geography", "Pulitzer Prize"] },
    ],
    hopeful: [
      { title: "Atomic Habits", author: "James Clear", isbn: "9780735211292", year: "2018", description: "A practical framework for building good habits and breaking bad ones through tiny changes that compound into remarkable results over time.", tags: ["self help", "practical", "motivating"] },
      { title: "Educated", author: "Tara Westover", isbn: "9780399590504", year: "2018", description: "A woman raised by survivalists in rural Idaho educates herself out of poverty and into Cambridge University in this stunning memoir.", tags: ["memoir", "inspiring", "education"] },
      { title: "Becoming", author: "Michelle Obama", isbn: "9781524763138", year: "2018", description: "The former First Lady shares her journey from the South Side of Chicago to the White House with warmth honesty and extraordinary grace.", tags: ["memoir", "inspiring", "political"] },
      { title: "Man's Search for Meaning", author: "Viktor Frankl", isbn: "9780807014271", year: "1946", description: "A psychiatrist and Holocaust survivor describes life in Nazi death camps and his method of finding purpose even in the most extreme suffering.", tags: ["philosophy", "Holocaust", "short but profound"] },
    ],
    dark: [
      { title: "In Cold Blood", author: "Truman Capote", isbn: "9780679745587", year: "1966", description: "The definitive account of the brutal murder of a Kansas farm family and the men who killed them told with novelistic precision and empathy.", tags: ["true crime", "literary journalism", "classic"] },
      { title: "The Body Keeps the Score", author: "Bessel van der Kolk", isbn: "9780143127741", year: "2014", description: "A leading trauma researcher explains how trauma reshapes the body and brain and the innovative paths to recovery he has discovered.", tags: ["psychology", "trauma", "important"] },
      { title: "Say Nothing", author: "Patrick Radden Keefe", isbn: "9780385543378", year: "2018", description: "The story of a murder during the Troubles in Northern Ireland and the lives of the IRA members who committed it decades later.", tags: ["true crime", "Ireland", "literary"] },
    ],
    melancholic: [
      { title: "When Breath Becomes Air", author: "Paul Kalanithi", isbn: "9780812988406", year: "2016", description: "A neurosurgeon diagnosed with terminal cancer reflects on mortality meaning and what makes a life worth living in this beautiful and devastating memoir.", tags: ["memoir", "mortality", "beautiful"] },
      { title: "The Year of Magical Thinking", author: "Joan Didion", isbn: "9781400078431", year: "2005", description: "A writer processes the sudden death of her husband of forty years in this raw honest and extraordinarily moving account of grief.", tags: ["memoir", "grief", "literary"] },
      { title: "H is for Hawk", author: "Helen Macdonald", isbn: "9780802123411", year: "2014", description: "A falconer trains a goshawk while processing the death of her father in this extraordinary meditation on grief wildness and the natural world.", tags: ["memoir", "nature", "grief"] },
    ],
  },
};

function getSeededBooks(genre, mood) {
  const genreBooks  = SEED_BOOKS[genre] || {};
  const moodBooks   = genreBooks[mood]  || [];

  // If we have enough seed books for this combo return them
  if (moodBooks.length >= 6) {
    return shuffleArray(moodBooks).slice(0, 6);
  }

  // Otherwise collect all books for this genre across all moods
  const allGenreBooks = Object.values(genreBooks).flat();
  const unique = deduplicateBooks(allGenreBooks);
  return shuffleArray(unique).slice(0, 6);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deduplicateBooks(books) {
  const seen = new Set();
  return books.filter(b => {
    if (seen.has(b.title)) return false;
    seen.add(b.title);
    return true;
  });
}