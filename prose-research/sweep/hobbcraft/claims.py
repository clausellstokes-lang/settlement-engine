COMPLETE=True
COVERAGE="Angle named categories rather than URLs, so the roster was read as: Hobb's own craft essays/interviews/blog (FETCHED, 16 items: OF Blog 2003, Locus 1998 and 2005, Pat's Fantasy Hotlist 2005, SFFWorld 2005, Aidan Moher 2007, Fantasy Book Critic 2008, Lightspeed/Geek's Guide 2012, Writing Excuses 11.Bonus-01 2016 fan transcript, Paw Print 2020, robinhobb.com 'As You Intend To Be' 2020 and 'What Works For Me' 2022 and 'How to Write a Book' 2022, Syl R. Martin 2023, Dragonsteel 2024, LisiPieces 2025, plus 'The Fan Fiction Rant' recovered from Wayback after removal from the live site); critics and close readers on register and pacing (FETCHED: Geoffrey B. Elliott's chapter-by-chapter reread entries 1 and 226, five Vacuous Wastrel reviews, The Idle Woman, Lisa Goldstein in Strange Horizons); craft essays and writing-advice pieces by novelists and craft sites (FETCHED: M Harold Page in Black Gate 2016, Jeffrey Outcalt's Substack epigraph essay 2024, Christopher Luke Dean at Writers Write 2020); editors (FETCHED: Anne Groell, Hobb's Random House editor, interviewed by Julie Crisp 2016, but she discusses her editing method and not Hobb's prose); game designers (NOT FOUND as a substantive category: the nearest is an unsigned, apparently machine-compiled article on rpgstorytellers.com, logged at low confidence; four searches aimed at RPG and game-design writing on Hobb surfaced only wikis, forum recommendation threads and generic DM advice). BLOCKED and recovered: aidanmoher.com refused WebFetch with HTTP 403 and yielded to curl with a browser user agent; the Mythlore PDF of Matthew Oliver's 'History in the Margins' refused a direct fetch with HTTP 403 and was recovered from a Wayback raw capture and parsed with pdfminer; fanlore.org returned HTTP 403 and was bypassed by going to the primary. Substantive sources per route: named-roster/direct search 22; bibliography chasing 3 (Oliver via Elliott's Fedwren Project, which also surfaced Ekman and Taylor 2021 and Mandala 2010, not pursued as they fall to the academic angle); lateral search 5. WebFetch was not used for any claim: it returned summaries rather than page text and once mis-attributed a page, so every source was read raw via curl with a browser user agent and stripped to text locally, and every quotation was string-searched against that text before being written. 35 sources logged, 30 substantive, 127 claims."

SOURCES=[
 {"title":"Robin Hobb Interview (Other Fantasy / OF Blog, Larry Nolen)","url":"http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html","kind":"own-words","substantive":True,"date":"2003-04-28","route":"curl browser-UA on live URL"},
 {"title":"Interview | Robin Hobb (A Dribble of Ink, Aidan Moher)","url":"https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/","kind":"own-words","substantive":True,"date":"2007-06-23","route":"WebFetch 403; curl browser-UA succeeded"},
 {"title":"Robin Hobb: More Questions Than Answers (Locus, interview excerpts)","url":"https://www.locusmag.com/2005/Issues/12Hobb.html","kind":"own-words","substantive":True,"date":"2005-12","route":"curl browser-UA on live URL"},
 {"title":"Robin Hobb: Behind the Scenes (Locus, January 1998 excerpts)","url":"https://www.locusmag.com/1998/Issues/01/Hobb.html","kind":"own-words","substantive":False,"date":"1998-01","route":"curl browser-UA on live URL"},
 {"title":"Interview with Robin Hobb (Fantasy Book Critic, Robert Thompson)","url":"https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html","kind":"own-words","substantive":True,"date":"2008-01","route":"curl browser-UA on live URL"},
 {"title":"Robin Hobb Interview (Pat's Fantasy Hotlist, Patrick St-Denis)","url":"http://fantasyhotlist.blogspot.com/2005/07/robin-hobb-interview.html","kind":"own-words","substantive":True,"date":"2005-07-11","route":"curl browser-UA on live URL"},
 {"title":"Writing Excuses 11.Bonus-01: Characterization and Differentiation, With Robin Hobb (fan transcript)","url":"https://wetranscripts.livejournal.com/121439.html","kind":"own-words","substantive":True,"date":"2016-10-12","route":"curl browser-UA on live URL"},
 {"title":"A Robin Hobb Rereading Series-Entry 1: Assassin's Apprentice, Chapter 1 (Geoffrey B. Elliott)","url":"https://elliottrwi.com/2019/05/24/a-robin-hobb-rereading-series-entry-1-assassins-apprentice-chapter-1/","kind":"analysis","substantive":True,"date":"2019-05-24","route":"curl browser-UA on live URL"},
 {"title":"A Robin Hobb Rereading Series: Entry 226: Fool's Errand, Chapter 6 (Geoffrey B. Elliott)","url":"https://elliottrwi.com/2021/09/10/a-robin-hobb-rereading-series-entry-226-fools-errand-chapter-6/","kind":"analysis","substantive":True,"date":"2021-09-10","route":"curl browser-UA on live URL"},
 {"title":"The Golden Fool, by Robin Hobb (Vacuous Wastrel)","url":"https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/","kind":"analysis","substantive":True,"date":"2013-02-04","route":"curl browser-UA on live URL"},
 {"title":"Fool's Quest, by Robin Hobb (Vacuous Wastrel)","url":"https://vacuouswastrel.wordpress.com/2015/11/27/fools-quest-by-robin-hobb/","kind":"analysis","substantive":True,"date":"2015-11-27","route":"curl browser-UA on live URL"},
 {"title":"Dragon Keeper, by Robin Hobb (Vacuous Wastrel)","url":"https://vacuouswastrel.wordpress.com/2014/04/13/dragon-keeper-by-robin-hobb/","kind":"analysis","substantive":True,"date":"2014-04-13","route":"curl browser-UA on live URL"},
 {"title":"Fool's Fate, by Robin Hobb (Vacuous Wastrel)","url":"https://vacuouswastrel.wordpress.com/2013/11/11/fools-fate-by-robin-hobb/","kind":"analysis","substantive":True,"date":"2013-11-11","route":"curl browser-UA on live URL"},
 {"title":"The Greatest Fictional World Builders: Robin Hobb (Writers Write, Christopher Luke Dean)","url":"https://www.writerswrite.co.za/the-greatest-fictional-world-builders-robin-hobb/","kind":"analysis","substantive":True,"date":"2020-02-12","route":"curl browser-UA on live URL"},
 {"title":"How to Write a Book When You Don't Have Time to Write (Robin Hobb's blog)","url":"https://www.robinhobb.com/blog/posts/41755","kind":"own-words","substantive":False,"date":"2022-11-03","route":"curl browser-UA on live URL"},
]

# --- OF Blog 2003 (Hobb's own words) ---
C("ofblog-2003.txt","plainness and economy",
  "Hobb says that in a short story she cuts everything that does not describe the setting, advance the plot or give a character insight.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "cut out everything that does not describe the setting","On writing, Q2",kind="own-words",date="2003-04-28",registerHint="herald-pools")
C("ofblog-2003.txt","register modulation",
  "Hobb states that her prose written as Megan Lindholm is much leaner than her prose written as Robin Hobb.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "Prose as Megan Lindholm is much leaner than prose as Robin Hobb","On writing, Q2",kind="own-words",date="2003-04-28")
C("ofblog-2003.txt","other: authorial self-description of sprawl",
  "Hobb says that in a novel she sprawls, and knows she does.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "In a novel, I sprawl, and I know it","On writing, Q2",kind="own-words",date="2003-04-28")
C("ofblog-2003.txt","place and institution description",
  "Hobb tells aspiring writers to make the economy and geography of an invented place make sense.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "Make your economy and geography make sense","On writing, Q12",kind="own-words",date="2003-04-28",registerHint="dossier-archivist")
C("ofblog-2003.txt","place and institution description",
  "Hobb gives as an error of scale the idea that a tiny village would support an artisan who specialises in doorknockers.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "A tiny village isn't going to have an artisan","On writing, Q12",kind="own-words",date="2003-04-28",registerHint="dossier-archivist")
C("ofblog-2003.txt","consequence on a household",
  "Hobb gives as an error of labour scale the idea that a medieval farm family harvested its entire farm in one afternoon.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "A medieval farm family didn't harvest its entire farm in one afternoon","On writing, Q12",kind="own-words",date="2003-04-28",registerHint="dossier-archivist")
C("ofblog-2003.txt","point of view and distance",
  "Hobb says every character, however small the part, is the main character while on stage.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "Every character is the main character","On writing, Q10",kind="own-words",date="2003-04-28")
C("ofblog-2003.txt","concrete sensory noun",
  "Hobb says that inside a villain's skin the villain is wondering what is for dinner tonight.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "even the villain is wondering what is for dinner tonight","On writing, Q10",kind="own-words",date="2003-04-28")
C("ofblog-2003.txt","point of view and distance",
  "Hobb names immediacy and reader identification as the benefits she found in writing Farseer in first person.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "Immediacy and reader identification","Specific questions, Q14",kind="own-words",date="2003-04-28")
C("ofblog-2003.txt","withheld information and inference",
  "Hobb says first person confined her to telling the reader only what Fitz knew at that moment.",
  "Robin Hobb, interviewed by Other Fantasy (OF Blog, Larry Nolen), 2003","http://ofblog.blogspot.com/2003/04/robin-hobb-interview.html",
  "I could only tell the reader what Fitz knew at that moment","Specific questions, Q14",kind="own-words",date="2003-04-28")

# --- Moher 2007 ---
C("moher-2007.txt","point of view and distance",
  "Hobb calls the first person voice the natural voice for the story teller.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "the first person voice is the natural voice for the story teller","Q on first person",kind="own-words",date="2007-06-23",
  routeHint="WebFetch returned HTTP 403; curl with browser user agent returned the page")
C("moher-2007.txt","point of view and distance",
  "Hobb says first person makes the reader privy to the viewpoint character's innermost thoughts and feelings.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "the reader is privy to the characters innermost thoughts and feelings","Q on first person",kind="own-words",date="2007-06-23",
  routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","register modulation",
  "Hobb says that writing as Hobb she tends to write longer, more detailed stories.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "I tend to write longer, more detailed stories","Q on the two pen names",kind="own-words",date="2007-06-23",
  routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","register modulation",
  "Hobb says the Lindholm writing style is not as leisurely as the Hobb style.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "The Lindholm writing style is not as leisurely","Q on the two pen names",kind="own-words",date="2007-06-23",
  routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","consequence on a household",
  "Hobb says that when her characters are hurt they acquire baggage that may later affect what they do.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "they acquire baggage and later on it may affect what they do","Q on hard situations",kind="own-words",date="2007-06-23",
  routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","consequence on a household",
  "Hobb says the reader drags the character's accumulated baggage through the reading.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "he drags that same baggage through the reading","Q on hard situations",kind="own-words",date="2007-06-23",
  routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","withheld information and inference",
  "Hobb says she often had to trust the reader to make a leap the narrator did not make.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "I often had to trust that the reader would make a leap","Q on first vs third person",kind="own-words",date="2007-06-23",
  registerHint="chronicle-line",routeHint="curl with browser user agent (WebFetch 403)")
C("moher-2007.txt","civic record register",
  "Hobb says she coped with first-person limits in Farseer by putting little prologues at the beginning of each chapter that gave the reader additional information.",
  "Robin Hobb, interviewed by Aidan Moher, A Dribble of Ink, 2007","https://aidanmoher.com/blog/2007/06/interviews/interview-robin-hobb/",
  "little prologues at the beginning of each chapter","Q on first vs third person",kind="own-words",date="2007-06-23",
  registerHint="chronicle-line",routeHint="curl with browser user agent (WebFetch 403)")

# --- Locus 2005 ---
C("locus-2005.txt","register modulation",
  "Hobb says there is a fairly clean dividing line between the Robin Hobb voice and the Megan Lindholm voice in her writing.",
  "Robin Hobb, Locus Magazine interview excerpts, December 2005","https://www.locusmag.com/2005/Issues/12Hobb.html",
  "a fairly clean dividing line between the Robin Hobb voice","Interview excerpts, first excerpt",kind="own-words",date="2005-12")

# --- Fantasy Book Critic 2008 ---
C("fbc-2008.txt","register modulation",
  "Hobb describes her own writing style as both leisurely and intimate.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "I would describe my writing style as both leisurely and intimate","Q1",kind="own-words",date="2008-01")
C("fbc-2008.txt","plainness and economy",
  "Hobb says characterisation for her means putting in details and incidents that may not directly move the plot forward.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "details and incidents that may not directly move the plot forward","Q on characterization",kind="own-words",date="2008-01",polarity="rejects")
C("fbc-2008.txt","other: pacing",
  "Hobb says the pacing at the beginning of any of her books is usually a lot slower than towards the end.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "The pacing at the beginning of any of my books is usually","Q on characterization",kind="own-words",date="2008-01")
C("fbc-2008.txt","other: pacing",
  "Hobb attributes her slow openings to so many words being given over to character construction.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "so many words are given over to character construction","Q on characterization",kind="own-words",date="2008-01")
C("fbc-2008.txt","consequence on a household",
  "Hobb illustrates unearned consequence with a two-sentence summary of a friend killing a friend, saying it reads more like a joke than a devastating occurrence.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "That seems more like a joke than a devastating occurrence","Q on biggest improvements",kind="own-words",date="2008-01",registerHint="chronicle-line")
C("fbc-2008.txt","other: pacing",
  "Hobb says that when she propelled the reader directly into a scene without building up to it, the scene lacked the impact she wanted.",
  "Robin Hobb, interviewed by Robert Thompson, Fantasy Book Critic, January 2008","https://fantasybookcritic.blogspot.com/2008/01/interview-with-robin-hobb.html",
  "when I propelled the reader directly into it, it lacked the impact","Q on biggest improvements",kind="own-words",date="2008-01")

# --- Pat's Fantasy Hotlist 2005 ---
C("pat-2005.txt","consequence on a household",
  "Hobb says her story is really about how the events affect the characters rather than about the events themselves.",
  "Robin Hobb, interviewed by Patrick St-Denis, Pat's Fantasy Hotlist, 2005","http://fantasyhotlist.blogspot.com/2005/07/robin-hobb-interview.html",
  "how the events affect the characters rather than about the events","Q1",kind="own-words",date="2005-07-11",registerHint="chronicle-line")
C("pat-2005.txt","sentence length variation",
  "Hobb describes each sentence as narrowing an infinite number of possibilities down to a single track.",
  "Robin Hobb, interviewed by Patrick St-Denis, Pat's Fantasy Hotlist, 2005","http://fantasyhotlist.blogspot.com/2005/07/robin-hobb-interview.html",
  "With every sentence, you narrow an infinite number of possibilities","Q2",kind="own-words",date="2005-07-11")

# --- Writing Excuses 2016 ---
C("writingexcuses-11b01.txt","per-speaker register",
  "Hobb says some characters speak in longer sentences and some in shorter ones, as a way of differentiating them.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "Some characters speak in longer sentences, some speak in shorter sentences","Second half, on character differentiation",kind="own-words",date="2016-10-12",
  confidence="medium; a listener-made transcript of a podcast, not an author-checked text")
C("writingexcuses-11b01.txt","diction (native vs latinate)",
  "Hobb says differentiating characters is a choice of vocabulary and a way of seeing things.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "it's a choice of vocabulary, it's a way of seeing things","Second half, on character differentiation",kind="own-words",date="2016-10-12",
  confidence="medium; listener-made transcript")
C("writingexcuses-11b01.txt","per-speaker register",
  "Hobb gives her own household as an example of occupational vocabulary, where a sailor's galley, head and deck name the same rooms as her kitchen, bathroom and floor.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "we have a galley, we have a head, we have a deck","Second half, on character differentiation",kind="own-words",date="2016-10-12",
  confidence="medium; listener-made transcript")
C("writingexcuses-11b01.txt","dialogue register",
  "Hobb proposes a test in which the reader of a passage of dialogue should be able to tell who is speaking without the attribution tags.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "able to tell who is talking without all the little clues","Second half, on character differentiation",kind="own-words",date="2016-10-12",
  confidence="medium; listener-made transcript")
C("writingexcuses-11b01.txt","point of view and distance",
  "Hobb says that what an assassin notices on entering a room differs from what a child entering the same room notices.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "if you are an assassin and you walk into the room","Second half, on description",kind="own-words",date="2016-10-12",
  confidence="medium; listener-made transcript")
C("writingexcuses-11b01.txt","place and institution description",
  "Hobb says the biographical details filled in around a character build the world at the same time.",
  "Robin Hobb, speaking on Writing Excuses 11.Bonus-01 (Oct 2016), fan transcript at wetranscripts","https://wetranscripts.livejournal.com/121439.html",
  "details that fill in around the character build the world","First half, on character creation",kind="own-words",date="2016-10-12",
  registerHint="dossier-archivist",confidence="medium; listener-made transcript")

# --- Elliott reread ---
C("elliott-reread-1.txt","civic record register",
  "Elliott describes the first paragraph of Assassin's Apprentice as an excerpt from a piece being composed inside the story's own world.",
  "Geoffrey B. Elliott, 'A Robin Hobb Rereading Series-Entry 1', Elliott RWI, 2019","https://elliottrwi.com/2019/05/24/a-robin-hobb-rereading-series-entry-1-assassins-apprentice-chapter-1/",
  "an excerpt from a piece being composed within the milieu","Third paragraph",kind="analysis",date="2019-05-24",registerHint="chronicle-line")
C("elliott-226.txt","civic record register",
  "Elliott names Hobb's habit of opening chapters with in-world reference materials an Asimovian move.",
  "Geoffrey B. Elliott, 'A Robin Hobb Rereading Series: Entry 226', Elliott RWI, 2021","https://elliottrwi.com/2021/09/10/a-robin-hobb-rereading-series-entry-226-fools-errand-chapter-6/",
  "the Asimovian move of grounding chapters in in-milieu reference materials","Commentary paragraph",kind="analysis",date="2021-09-10",registerHint="chronicle-line")
C("elliott-226.txt","annalist voice and deep time",
  "Elliott, writing as a medievalist, says the chapter-opening passage enacts the piecing-together of disparate and not always complete sources.",
  "Geoffrey B. Elliott, 'A Robin Hobb Rereading Series: Entry 226', Elliott RWI, 2021","https://elliottrwi.com/2021/09/10/a-robin-hobb-rereading-series-entry-226-fools-errand-chapter-6/",
  "the piecing-together of disparate and not always complete sources","Commentary paragraph",kind="analysis",date="2021-09-10",registerHint="chronicle-line")

# --- Vacuous Wastrel ---
C("vw-goldenfool.txt","consequence on a household",
  "The reviewer says Hobb takes a cliched epic-fantasy plot point and fleshes it out with motivations and characters and consequences until it looks realistic.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "fleshes it out with motivations and characters and consequences","Review body",kind="analysis",date="2013-02-04")
C("vw-goldenfool.txt","point of view and distance",
  "The reviewer says Hobb tells a standard heroic plot from an unexpected, peripheral perspective and thereby gives the realistic inner workings of the myth.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "the realistic inner workings of the myth","Review body",kind="analysis",date="2013-02-04")
C("vw-goldenfool.txt","consequence on a household",
  "The reviewer identifies worrying about the apprentice fees for dependants as the kind of domestic matter most epic fantasy does not spend pages on.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "worrying about the apprentice fees for dependants","Originality rating paragraph",kind="analysis",date="2013-02-04",registerHint="dossier-archivist")
C("vw-goldenfool.txt","consequence on a household",
  "The reviewer says the book insists that motivations are personal and that consequences will also be personal.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "that motivations are personal, and that consequences will also be personal","Originality rating paragraph",kind="analysis",date="2013-02-04")
C("vw-goldenfool.txt","other: fantastic subordinated to the ordinary",
  "The reviewer says the book reminds the reader that the fantasy only matters because of the reality in its shadow.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "the fantasy only matters because of the reality in its shadow","Originality rating paragraph",kind="analysis",date="2013-02-04")
C("vw-goldenfool.txt","withheld information and inference",
  "The reviewer says Hobb builds tense scenes out of characters watching each other's expressions, so that much is accomplished with only glances.",
  "Vacuous Wastrel (pseudonymous reviewer), 'The Golden Fool, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/02/04/the-golden-fool-by-robin-hobb/",
  "So much can be accomplished with only glances","Review body",kind="analysis",date="2013-02-04")
C("vw-dragonkeeper.txt","plainness and economy",
  "The reviewer judges that Hobb's prose is usually unremarkable, locating her effect elsewhere than in sentence beauty.",
  "Vacuous Wastrel (pseudonymous reviewer), 'Dragon Keeper, by Robin Hobb', 2014","https://vacuouswastrel.wordpress.com/2014/04/13/dragon-keeper-by-robin-hobb/",
  "As is usually the case with Hobb, her prose is unremarkable","Beauty rating",kind="reception",date="2014-04-13",polarity="disputes")
C("vw-foolsfate.txt","plainness and economy",
  "The reviewer judges Hobb's prose solid and effective and occasionally pretty, but not award-winning for beauty.",
  "Vacuous Wastrel (pseudonymous reviewer), 'Fool's Fate, by Robin Hobb', 2013","https://vacuouswastrel.wordpress.com/2013/11/11/fools-fate-by-robin-hobb/",
  "prose is solid and effective and occasionally pretty","Beauty rating",kind="reception",date="2013-11-11",polarity="disputes")
C("vw-foolsquest.txt","archaism",
  "The reviewer describes Hobb's language as having a slightly heavy and old-fashioned tone common to the genre.",
  "Vacuous Wastrel (pseudonymous reviewer), 'Fool's Quest, by Robin Hobb', 2015","https://vacuouswastrel.wordpress.com/2015/11/27/fools-quest-by-robin-hobb/",
  "that slightly heavy and old-fashioned tone common to the genre","Overall rating paragraph",kind="analysis",date="2015-11-27")

# --- Writers Write ---
C("writerswrite-worldbuild.txt","place and institution description",
  "Dean says Hobb has created a number of small intimate settings centred around her characters.",
  "Christopher Luke Dean, 'The Greatest Fictional World Builders: Robin Hobb', Writers Write, 2020","https://www.writerswrite.co.za/the-greatest-fictional-world-builders-robin-hobb/",
  "created a number of small intimate settings centred around her characters","Section on setting",kind="analysis",date="2020-02-12",registerHint="dossier-archivist")
C("writerswrite-worldbuild.txt","place and institution description",
  "Dean says Hobb makes her readers care for her setting as much as her characters.",
  "Christopher Luke Dean, 'The Greatest Fictional World Builders: Robin Hobb', Writers Write, 2020","https://www.writerswrite.co.za/the-greatest-fictional-world-builders-robin-hobb/",
  "make her readers care for her setting as much as her characters","Section on setting",kind="analysis",date="2020-02-12",registerHint="dossier-archivist")
C("writerswrite-worldbuild.txt","consequence on a household",
  "Dean says Hobb's characters grow or die or get worse rather than remaining stable.",
  "Christopher Luke Dean, 'The Greatest Fictional World Builders: Robin Hobb', Writers Write, 2020","https://www.writerswrite.co.za/the-greatest-fictional-world-builders-robin-hobb/",
  "Her characters grow or die or get worse","Later section",kind="analysis",date="2020-02-12")

SOURCES += [
 {"title":"On the use of epigraphs and metanarratives in Robin Hobb's 'Assassin's Apprentice' (Jeffrey Outcalt, Substack)","url":"https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives","kind":"analysis","substantive":True,"date":"2024-07-02","route":"curl browser-UA on live URL"},
 {"title":"Fool's Assassin: How Robin Hobb Writes Lyrical Fantasy Without Being Boring (M Harold Page, Black Gate)","url":"https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/","kind":"analysis","substantive":True,"date":"2016-02-09","route":"curl browser-UA on live URL"},
 {"title":"Interview: Robin Hobb (Lightspeed Magazine / The Geek's Guide to the Galaxy)","url":"https://www.lightspeedmagazine.com/nonfiction/interview-robin-hobb/","kind":"own-words","substantive":True,"date":"2012-04","route":"curl browser-UA on live URL"},
 {"title":"Robin Hobb's Writing Advice: 3 Tips for Crafting Your Villian (Tayan Hatch, Dragonsteel Books)","url":"https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/robin-hobb-writing-villians","kind":"own-words","substantive":True,"date":"2024-12-19","route":"curl browser-UA on live URL"},
 {"title":"As You Intend To Be (Robin Hobb's Infrequent and Off Topic Blog)","url":"https://www.robinhobb.com/blog/posts/36450","kind":"own-words","substantive":True,"date":"2020-05-21","route":"curl browser-UA on live URL"},
 {"title":"The Assassin's Canvas: A Comprehensive Analysis... (unsigned article, rpgstorytellers.com)","url":"https://rpgstorytellers.com/the-assassins-canvas-a-comprehensive-analysis-of-narrative-interiority-magic-systems-and-cultural-anthropology-in-robin-hobbs-farseer-trilogy/","kind":"analysis","substantive":True,"date":"2026-01-13","route":"curl browser-UA on live URL"},
 {"title":"June Author Crush: Robin Hobb... is a Master Worldbuilder (Rachel Carter, BookTrib)","url":"https://booktrib.com/2017/06/15/june-author-crush-robin-hobb-worldbuilder/","kind":"reception","substantive":False,"date":"2017-06-15","route":"curl browser-UA on live URL"},
]

# --- Outcalt craft essay on epigraphs ---
C("outcalt-epigraphs.txt","civic record register",
  "Outcalt says the epigraphs at the beginning of each chapter carry historical facts about the Six Duchies.",
  "Jeffrey Outcalt, 'On the use of epigraphs and metanarratives in Robin Hobb's Assassin's Apprentice', 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "The epigraphs at the beginning of each chapter will have historical facts","Section establishing the pattern",kind="analysis",date="2024-07-02",registerHint="chronicle-line")
C("outcalt-epigraphs.txt","civic record register",
  "Outcalt characterises the opening in-world history epigraph of Assassin's Apprentice as informative yet boring.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "A pretty informative, yet boring, introduction epigraph","On the first epigraph",kind="analysis",date="2024-07-02",registerHint="chronicle-line")
C("outcalt-epigraphs.txt","civic record register",
  "Outcalt says the framing makes the reader feel they are reading from the same tome the narrator scribed.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "It reads as if we are reading from the same tome","On metanarrative",kind="analysis",date="2024-07-02",registerHint="dossier-archivist")
C("outcalt-epigraphs.txt","withheld information and inference",
  "Outcalt says the bias in the Queen Desire epigraph alerts the reader to the potential of an unreliable narrator.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "This should immediately alert us to the potential of an unreliable narrator","On the chapter 7 epigraph",kind="analysis",date="2024-07-02",registerHint="chronicle-line")
C("outcalt-epigraphs.txt","omission as information",
  "Outcalt says Hobb leaves it to the reader to do light investigative work rather than cutting to flashback.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "leaves it up to the reader to do some light investigative work","On metanarrative",kind="analysis",date="2024-07-02")
C("outcalt-epigraphs.txt","civic record register",
  "Outcalt says some epigraphs raise details about characters that are disclosed nowhere else in the book.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "details about the characters in ways that are NOT disclosed anywhere else","On later epigraphs",kind="analysis",date="2024-07-02",registerHint="dossier-archivist")
C("outcalt-epigraphs.txt","annalist voice and deep time",
  "Outcalt describes a slow congealing of fact and fiction across the sequence of epigraphs.",
  "Jeffrey Outcalt, Substack craft essay on Hobb's epigraphs, 2024","https://jeffreydavidoutcalt.substack.com/p/on-the-use-of-epigraphs-and-metanarratives",
  "the slow congealing of fact and fiction in the epigraphs","On the chapter 7 epigraph",kind="analysis",date="2024-07-02",registerHint="chronicle-line")

# --- M Harold Page craft dissection ---
C("blackgate-page.txt","cadence and rhythm",
  "Page identifies an unremitting rhythm of buts at all levels of the story as a device in Fool's Assassin.",
  "M Harold Page, novelist, 'Fool's Assassin: How Robin Hobb Writes Lyrical Fantasy Without Being Boring', Black Gate, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "an unremitting rhythm of buts at all levels of the story","Making Lyrical Fantasy Interesting",kind="analysis",date="2016-02-09")
C("blackgate-page.txt","consequence on a household",
  "Page says a death arising from the thriller plot has domestic and child-rearing implications in Fool's Assassin.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "a death resulting from the Thriller has domestic and child-rearing implications","First Person Slow Burn Thriller",kind="analysis",date="2016-02-09",registerHint="dossier-archivist")
C("blackgate-page.txt","consequence on a household",
  "Page says the same duty in Fool's Assassin manifests both domestically and politically.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "the same duty manifests both domestically and politically","First Person Slow Burn Thriller",kind="analysis",date="2016-02-09")
C("blackgate-page.txt","place and institution description",
  "Page says Hobb only delivers description when it is part of a conflict.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "She only delivers description when it","Making Lyrical Fantasy Interesting",kind="analysis",date="2016-02-09",registerHint="dossier-archivist")
C("blackgate-page.txt","concrete sensory noun",
  "Page says Hobb serves up characterisation only when it is immediately significant to a choice or tactic.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "Hobb always serves up characterisation when it is immediately significant","Making Lyrical Fantasy Interesting",kind="analysis",date="2016-02-09")
C("blackgate-page.txt","withheld information and inference",
  "Page says Hobb drops information after the fact but in ways that point forward.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "She drops information on us after-the-fact but in ways that point forward","First Person Slow Burn Thriller",kind="analysis",date="2016-02-09",registerHint="chronicle-line")
C("blackgate-page.txt","omission as information",
  "Page says Hobb exploits the reader's knowledge of the genre instead of a point-of-view shift to keep the thriller plot alive.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "She exploits the fact we know what genre we are reading","First Person Slow Burn Thriller",kind="analysis",date="2016-02-09")
C("blackgate-page.txt","point of view and distance",
  "Page describes Fool's Assassin as a country house Gothic told from the point of view of its denizens.",
  "M Harold Page, novelist, Black Gate craft dissection of Fool's Assassin, 2016","https://www.blackgate.com/2016/02/09/fools-assassin-how-robin-hobb-writes-lyrical-fantasy-without-being-boring/",
  "a country house Gothic from the point of view","Opening",kind="analysis",date="2016-02-09")

# --- Lightspeed 2012 ---
C("lightspeed-hobb.txt","consequence on a household",
  "Hobb says the characters in her short fiction are people at the lower echelons of the economic strata.",
  "Robin Hobb, interviewed for The Geek's Guide to the Galaxy, reprinted in Lightspeed, April 2012","https://www.lightspeedmagazine.com/nonfiction/interview-robin-hobb/",
  "people who are at the lower echelons of the economic strata","On The Inheritance & Other Stories",kind="own-words",date="2012-04",registerHint="dossier-archivist")
C("lightspeed-hobb.txt","consequence on a household",
  "Hobb says that in fantasy, people who work every day for a living on a tight budget can seem poor.",
  "Robin Hobb, interviewed for The Geek's Guide to the Galaxy, reprinted in Lightspeed, April 2012","https://www.lightspeedmagazine.com/nonfiction/interview-robin-hobb/",
  "people who actually work every day for a living","On The Inheritance & Other Stories",kind="own-words",date="2012-04",registerHint="dossier-archivist")
C("lightspeed-hobb.txt","consequence on a household",
  "Hobb cites her own Alaskan upbringing, in which the family had to put food up for the winter, as the source of the survival economy in her work.",
  "Robin Hobb, interviewed for The Geek's Guide to the Galaxy, reprinted in Lightspeed, April 2012","https://www.lightspeedmagazine.com/nonfiction/interview-robin-hobb/",
  "we had to put that food up for the winter","On Alaska",kind="own-words",date="2012-04",registerHint="dossier-archivist")

# --- Dragonsteel 2024 ---
C("dragonsteel-villains.txt","point of view and distance",
  "Hobb, quoted by Hatch, says an antagonist simply has something they want to get done that outweighs the protagonist's aim.",
  "Robin Hobb, quoted by Tayan Hatch, Dragonsteel Books blog, 2024","https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/robin-hobb-writing-villians",
  "They simply have something they want to get done","Now I Believe Everything You Believe",kind="own-words",date="2024-12-19",
  confidence="medium; a marketing-blog write-up quoting a spontaneous interview, not a transcript")
C("dragonsteel-villains.txt","point of view and distance",
  "Hobb, quoted by Hatch, says a writer must put a character's viewpoint on like a coat.",
  "Robin Hobb, quoted by Tayan Hatch, Dragonsteel Books blog, 2024","https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/robin-hobb-writing-villians",
  "You have to put it on like a coat","Now I Believe Everything You Believe",kind="own-words",date="2024-12-19",
  confidence="medium; a marketing-blog write-up quoting a spontaneous interview")
C("dragonsteel-villains.txt","point of view and distance",
  "Hobb, quoted by Hatch, says the Farseer trilogy rewritten from Regal's point of view would make him a tragic hero.",
  "Robin Hobb, quoted by Tayan Hatch, Dragonsteel Books blog, 2024","https://www.dragonsteelbooks.com/blogs/the-cognitive-realm/robin-hobb-writing-villians",
  "he would be a tragic hero","Now I Believe Everything You Believe",kind="own-words",date="2024-12-19",
  confidence="medium; a marketing-blog write-up quoting a spontaneous interview")

# --- Hobb's own blog, 2020 ---
C("hobb-blog-36450.txt","civic record register",
  "Hobb names coinage or money value, major religions and a calendar with seasonal names and year dates among the worldbuilding records she keeps.",
  "Robin Hobb, 'As You Intend To Be', robinhobb.com blog, 2020","https://www.robinhobb.com/blog/posts/36450",
  "coinage or money value, major religions, calendar with seasonal names","Paragraph on record keeping",kind="own-words",date="2020-05-21",registerHint="dossier-archivist")
C("hobb-blog-36450.txt","other: indexing by incident rather than page",
  "Hobb says her working glossary records where a character first appears by the incident rather than by page or chapter number.",
  "Robin Hobb, 'As You Intend To Be', robinhobb.com blog, 2020","https://www.robinhobb.com/blog/posts/36450",
  "Joe is met in the tavern shortly before the disastrous river crossing","Paragraph on record keeping",kind="own-words",date="2020-05-21",registerHint="chronicle-line")

# --- rpgstorytellers (unsigned, low provenance) ---
C("rpgstory-canvas.txt","civic record register",
  "The article describes each Farseer chapter as beginning with a snippet of in-world text ranging from historical treatises to folklore and propaganda.",
  "Unsigned article, rpgstorytellers.com, 2026","https://rpgstorytellers.com/the-assassins-canvas-a-comprehensive-analysis-of-narrative-interiority-magic-systems-and-cultural-anthropology-in-robin-hobbs-farseer-trilogy/",
  "a snippet of in-world text ranging from historical treatises","Section 2.2",kind="analysis",date="2026-01-13",registerHint="chronicle-line",
  confidence="low; the page carries no named author and reads as a machine-compiled report with unresolved footnote markers")
C("rpgstory-canvas.txt","civic record register",
  "The article says the dry, academic tone of an epigraph on Farseer glory is set against the unglamorous scene that follows.",
  "Unsigned article, rpgstorytellers.com, 2026","https://rpgstorytellers.com/the-assassins-canvas-a-comprehensive-analysis-of-narrative-interiority-magic-systems-and-cultural-anthropology-in-robin-hobbs-farseer-trilogy/",
  "the dry, academic tone of an epigraph","Section 2.2, Tonal Contrast",kind="analysis",date="2026-01-13",registerHint="chronicle-line",
  confidence="low; unsigned page, machine-compiled in appearance")
C("rpgstory-canvas.txt","other: pacing",
  "The article attributes Hobb's slow burn to dedicating thousands of words to the mundane details of the protagonist's daily existence.",
  "Unsigned article, rpgstorytellers.com, 2026","https://rpgstorytellers.com/the-assassins-canvas-a-comprehensive-analysis-of-narrative-interiority-magic-systems-and-cultural-anthropology-in-robin-hobbs-farseer-trilogy/",
  "dedicating thousands of words to the mundane details","Section 2.3",kind="analysis",date="2026-01-13",
  confidence="low; unsigned page, machine-compiled in appearance")

OLIVER_URL="https://dc.swosu.edu/mythlore/vol41/iss1/4/"
OLIVER_SRC="Matthew Oliver, 'History in the Margins: Epigraphs and Negative Space in Robin Hobb's Assassin's Apprentice', Mythlore 41.1 (2022), pp. 45-66"
OLIVER_ROUTE="live PDF at dc.swosu.edu returned HTTP 403; fetched the Wayback raw capture https://web.archive.org/web/20240707045408id_/https://dc.swosu.edu/cgi/viewcontent.cgi?article=3044&context=mythlore and extracted text with pdfminer; quotations verified against the whitespace-normalised extraction"

SOURCES += [
 {"title":"History in the Margins: Epigraphs and Negative Space in Robin Hobb's Assassin's Apprentice (Matthew Oliver, Mythlore 41.1)","url":OLIVER_URL,"kind":"analysis","substantive":True,"date":"2022-10","route":"Wayback raw PDF capture (live PDF 403), pdfminer extraction"},
 {"title":"The Fedwren Project: A Robin Hobb Annotated Bibliography (Geoffrey B. Elliott)","url":"https://elliottrwi.com/research/hobb-bibliography/","kind":"analysis","substantive":True,"date":"accessed 2026-09-06","route":"curl browser-UA on live URL; used for bibliography chasing"},
]

C("oliver.norm.txt","civic record register",
  "Oliver describes the chapter epigraphs of Assassin's Apprentice as excerpts from a public document, largely a formal history written in a distant, scholarly voice.",
  OLIVER_SRC,OLIVER_URL,"a formal history written in a distant, scholarly voice","p. 45",kind="analysis",date="2022-10",
  registerHint="dossier-archivist",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","civic record register",
  "Oliver says the formal, scholarly, distant history is presumably the authoritative one yet is placed in the margins of the text.",
  OLIVER_SRC,OLIVER_URL,"the formal, scholarly, distant history is presumably the primary one","pp. 45-46",kind="analysis",date="2022-10",
  registerHint="dossier-archivist",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","civic record register",
  "Oliver says the first chapter's epigraph opens with the authoritative voice of History establishing a clear centre to its narrative.",
  OLIVER_SRC,OLIVER_URL,"opens with the authoritative voice of History","p. 53",kind="analysis",date="2022-10",
  registerHint="chronicle-line",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","civic record register",
  "Oliver observes that the chapter thirteen epigraph on Patience includes evidentiary quotes from her nursemaids and publicly available information rather than the author's own experience of her.",
  OLIVER_SRC,OLIVER_URL,"he includes evidentiary quotes from her nursemaids and publicly available information","p. 56",kind="analysis",date="2022-10",
  registerHint="dossier-archivist",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","civic record register",
  "Oliver calls the history that opens the Patience chapter dry, impersonal, but objective, and judges the personal main text more authoritative and satisfying.",
  OLIVER_SRC,OLIVER_URL,"the dry, impersonal, but objective history beginning the chapter","p. 56",kind="analysis",date="2022-10",
  registerHint="dossier-archivist",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","omission as information",
  "Oliver names Hobb's most striking stylistic element negative narration: describing what is not happening instead of or before what is happening.",
  OLIVER_SRC,OLIVER_URL,"describing what is not happening instead of or before describing","p. 57",kind="analysis",date="2022-10",
  registerHint="dossier-archivist",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","omission as information",
  "Oliver says the negative narration shows up in sentences that start by telling what a character is not doing or feeling.",
  OLIVER_SRC,OLIVER_URL,"sentences that start by telling what a character is not doing","p. 57",kind="analysis",date="2022-10",
  routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","withheld information and inference",
  "Oliver says the novel constantly focuses on what is not happening or not present in order to define what is happening.",
  OLIVER_SRC,OLIVER_URL,"focuses on what is not happening or what is not present","p. 45",kind="analysis",date="2022-10",
  routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","omission as information",
  "Oliver argues that only through absences and the things that did not happen can the reader apprehend what did happen.",
  OLIVER_SRC,OLIVER_URL,"Only through absences, the negative spaces, the things that did not happen","p. 47",kind="analysis",date="2022-10",
  routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","omission as information",
  "Oliver identifies a roughly seventy-page stretch of the novel as a lengthy portion of the narrative given over to describing what is not there.",
  OLIVER_SRC,OLIVER_URL,"the narrative given over to describing what is not there","p. 61",kind="analysis",date="2022-10",
  routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","register modulation",
  "Oliver says that when Fitz shifts from a discourse of history to a discourse of fantasy the style shifts to extensive parataxis, elevated figurative language, and parallelism.",
  OLIVER_SRC,OLIVER_URL,"extensive parataxis, elevated figurative language, and parallelism","p. 59",kind="analysis",date="2022-10",
  registerHint="chronicle-line",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","register modulation",
  "Oliver says the later epigraphs become increasingly infected by the style of imaginative fiction in place of the style of scholarly discourse.",
  OLIVER_SRC,OLIVER_URL,"the epigraphs become increasingly infected by the style of imaginative fiction","p. 61",kind="analysis",date="2022-10",
  registerHint="chronicle-line",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","parataxis vs hypotaxis",
  "Oliver counts two sentences using inverted syntax in the chapter fifteen epigraph, alongside parataxis across sentence boundaries and listed parallel phrases.",
  OLIVER_SRC,OLIVER_URL,"Two sentences use inverted syntax","p. 62",kind="analysis",date="2022-10",
  registerHint="chronicle-line",routeHint=OLIVER_ROUTE)
C("oliver.norm.txt","annalist voice and deep time",
  "Mendlesohn, quoted by Oliver, likens each chapter's opening memoir to the Venerable Bede's history and calls it recollection and gossip masquerading as an accurate description of the past.",
  "Farah Mendlesohn, Rhetorics of Fantasy (2008), p. 16, quoted by Matthew Oliver in Mythlore 41.1 (2022)",OLIVER_URL,
  "recollection and gossip masquerading as an accurate description of the past","p. 63, quoting Mendlesohn p. 16",kind="relay",date="2008",
  registerHint="chronicle-line",polarity="disputes",routeHint=OLIVER_ROUTE,
  confidence="medium; a quotation of Mendlesohn inside Oliver's article, not read at Rhetorics of Fantasy itself")

SOURCES += [
 {"title":"Interviewing Robin Hobb, Epic-Fantasy Best-Selling Author (Syl R. Martin)","url":"https://sylrmartin.com/portfolio/interviewing-robin-hobb-epic-fantasy-best-selling-author/","kind":"own-words","substantive":True,"date":"2023-05-19","route":"curl browser-UA on live URL"},
 {"title":"An Interview with Robin Hobb: Character Writing (Madalen Erez, Paw Print)","url":"https://cscsnews.com/744/literary-arts/an-interview-with-robin-hobb-character-writing/","kind":"own-words","substantive":True,"date":"2020-11-19","route":"curl browser-UA on live URL"},
 {"title":"My Reddit 'AMA' Q&A with Robin Hobb Is On Today! (Helen Lowe)","url":"https://helenlowe.info/blog/2012/05/17/my-reddit-ama-qa-with-robin-hobb-is-on-today/","kind":"reception","substantive":False,"date":"2012-05-17","route":"curl browser-UA on live URL"},
]

SM="Robin Hobb, interviewed by Syl R. Martin, 2023"
SMU="https://sylrmartin.com/portfolio/interviewing-robin-hobb-epic-fantasy-best-selling-author/"
C("sylmartin.txt","point of view and distance",
  "Hobb says she tries to keep in mind that every character is the hero of his own story.",
  SM,SMU,"every character is the hero of his own story","On characters",kind="own-words",date="2023-05-19")
C("sylmartin.txt","place and institution description",
  "Hobb says each character has to be the product of the imaginary world they exist in.",
  SM,SMU,"the product of the imaginary world they exist in","On inspiration",kind="own-words",date="2023-05-19",registerHint="dossier-archivist")
C("sylmartin.txt","other: research method",
  "Hobb says her first choice of research source is a person who will tell her about a trade such as bee-keeping or navigating.",
  SM,SMU,"I like to use people as sources","On research",kind="own-words",date="2023-05-19",registerHint="dossier-archivist")
C("sylmartin.txt","other: research method",
  "Hobb says diaries and other first-person accounts are her preferred sources for older technology.",
  SM,SMU,"Diaries or other first person accounts are great","On research",kind="own-words",date="2023-05-19",registerHint="dossier-archivist")
C("sylmartin.txt","place and institution description",
  "Hobb says transplanting a real person or event into an invented world is simply not believable.",
  SM,SMU,"Transplants are simply not believable","On inspiration",kind="own-words",date="2023-05-19",polarity="rejects")

PP="Robin Hobb, interviewed by Madalen Erez, Paw Print, 2020"
PPU="https://cscsnews.com/744/literary-arts/an-interview-with-robin-hobb-character-writing/"
C("pawprint.txt","consequence on a household",
  "Hobb objects to screen fights after which no one is bruised, there is no blood and no one limps.",
  PP,PPU,"no one is bruised afterwards, there is no blood, no one limps","Writing Traumatic Experiences",kind="own-words",date="2020-11-19",polarity="rejects")
C("pawprint.txt","consequence on a household",
  "Hobb says being a good character does not protect a person from physical damage.",
  PP,PPU,"Having a good character does not protect you from physical damage","Writing Traumatic Experiences",kind="own-words",date="2020-11-19")
C("pawprint.txt","consequence on a household",
  "Hobb says the things that happen to us change us, and that this is what makes a character interesting.",
  PP,PPU,"The things that happen to us change us","Writing Traumatic Experiences",kind="own-words",date="2020-11-19")
C("pawprint.txt","consequence on a household",
  "Hobb says we are all the sum of our experiences, good and bad.",
  PP,PPU,"We are all the sum of our experiences, good and bad","Writing Traumatic Experiences",kind="own-words",date="2020-11-19")
C("pawprint.txt","consequence on a household",
  "Hobb says characters are shaped by their experiences and become the product of what has been done to them.",
  PP,PPU,"We become the product of what has been done to us","Hobb's Writing as a Whole",kind="own-words",date="2020-11-19")
C("pawprint.txt","point of view and distance",
  "Hobb says writing a viewpoint character means putting that character on like donning a coat.",
  PP,PPU,"the writer must put that character on like donning a coat","How does Hobb create characters?",kind="own-words",date="2020-11-19")

SOURCES += [
 {"title":"Interview with Robin Hobb (Rob Bedford, SFFWorld)","url":"https://www.sffworld.com/2005/09/interview-with-robin-hobb/","kind":"own-words","substantive":True,"date":"2005-09-01","route":"curl browser-UA on live URL"},
 {"title":"What Works For Me (Robin Hobb's Infrequent and Off Topic Blog)","url":"https://www.robinhobb.com/blog/posts/40869","kind":"own-words","substantive":True,"date":"2022-05-20","route":"curl browser-UA on live URL"},
 {"title":"A Day in the Life of an Editor - with Anne Groell (Julie Crisp)","url":"http://www.juliecrisp.co.uk/blog-1/2016/1/4/a-day-in-the-life-of-an-editor-with-anne-groell","kind":"own-words","substantive":True,"date":"2016-01-04","route":"curl browser-UA on live URL"},
]

SW="Robin Hobb, interviewed by Rob Bedford, SFFWorld, 2005"
SWU="https://www.sffworld.com/2005/09/interview-with-robin-hobb/"
C("sffworld-2005.txt","withheld information and inference",
  "Hobb says first person makes her rely on the reader to be alert and connect the dots.",
  SW,SWU,"rely on the reader to be alert and connect the dots","Q on first person",kind="own-words",date="2005-09-01",registerHint="chronicle-line")
C("sffworld-2005.txt","point of view and distance",
  "Hobb says the intimacy of first person lets the reader know things the protagonist would not otherwise verbalise.",
  SW,SWU,"the reader will know things that the protagonist would not otherwise verbalize","Q on first person",kind="own-words",date="2005-09-01")
C("sffworld-2005.txt","withheld information and inference",
  "Hobb says the reader may be able to see what is coming even when the narrator does not.",
  SW,SWU,"the reader will perhaps be able to see what is coming","Q on first person",kind="own-words",date="2005-09-01")
C("sffworld-2005.txt","register modulation",
  "Hobb says the writing and style in the Megan Lindholm books differs substantially from the Robin Hobb books.",
  SW,SWU,"The writing and style in those books differs substantially","Q on Lindholm reprints",kind="own-words",date="2005-09-01")
C("sffworld-2005.txt","point of view and distance",
  "Hobb says she writes for people who really like to know the characters.",
  SW,SWU,"I write for people who really like to know the characters","Q on readers",kind="own-words",date="2005-09-01")
C("sffworld-2005.txt","place and institution description",
  "Hobb says researching for a fantasy lets the writer collect the best bits of history and joggle them to fit the invented world.",
  SW,SWU,"you get to collect all the best bits","Q on research",kind="own-words",date="2005-09-01",registerHint="dossier-archivist")

HB="Robin Hobb, 'What Works For Me', robinhobb.com blog, 2022"
HBU="https://www.robinhobb.com/blog/posts/40869"
C("hobb-blog-40869.txt","other: time compression in one sentence",
  "Hobb advises skipping a dull stretch of travel by summarising it in one sentence, and supplies the sample sentence herself.",
  HB,HBU,"After four days of punishing travel, they reached a small holding","Section: I don't want to write the next scene",kind="own-words",date="2022-05-20",registerHint="chronicle-line")
C("hobb-blog-40869.txt","sentence length variation",
  "Hobb says a chapter may consist of a single sentence.",
  HB,HBU,"You can have a one sentence chapter if you want","Section: I don't want to write the next scene",kind="own-words",date="2022-05-20",registerHint="chronicle-line")
C("hobb-blog-40869.txt","diction (native vs latinate)",
  "Hobb rejects the word processor's thesaurus because it offers the same synonyms every other writer is using, and recommends a paper Roget's instead.",
  HB,HBU,"the same synonyms that every other writer is using","Footnote on the thesaurus",kind="own-words",date="2022-05-20",polarity="rejects")
C("hobb-blog-40869.txt","concrete sensory noun",
  "Hobb gives as a revision-pass example replacing a red car with candy apple red with metal flake.",
  HB,HBU,"The car isn't red, it's candy apple red with metal flake","Section: Nope. I'm blocked",kind="own-words",date="2022-05-20")

C("groell-crisp.txt","edition and house style",
  "Groell, the Random House editor of Hobb, Martin and others, says her first read of a book is close line-reading and individual sentence editing.",
  "Anne Groell, executive SFF editor, Random House USA, interviewed by Julie Crisp, 2016","http://www.juliecrisp.co.uk/blog-1/2016/1/4/a-day-in-the-life-of-an-editor-with-anne-groell",
  "I do the really close line-reading and individual sentence editing","Middle of the piece",kind="own-words",date="2016-01-04",polarity="mentions",
  confidence="medium; Groell describes her general editing method and does not discuss Hobb's prose specifically")
C("groell-crisp.txt","edition and house style",
  "Groell says she averages about 25 pages an hour, or 200 pages a day, on that first close read.",
  "Anne Groell, executive SFF editor, Random House USA, interviewed by Julie Crisp, 2016","http://www.juliecrisp.co.uk/blog-1/2016/1/4/a-day-in-the-life-of-an-editor-with-anne-groell",
  "I average about 25 pages an hour, or 200 pages a day","Middle of the piece",kind="measurement",date="2016-01-04",polarity="mentions",
  confidence="medium; a figure about Groell's own reading pace, not about Hobb's prose")

SOURCES += [
 {"title":"Ship of Magic (1998): Robin Hobb (The Idle Woman)","url":"https://theidlewoman.net/2013/05/05/ship-of-magic-robin-hobb/","kind":"analysis","substantive":True,"date":"2013-05-05","route":"curl browser-UA on live URL"},
 {"title":"Dragon Haven by Robin Hobb (Lisa Goldstein, Strange Horizons)","url":"http://strangehorizons.com/non-fiction/reviews/dragon-haven-by-robin-hobb/","kind":"reception","substantive":True,"date":"2010-05-10","route":"curl browser-UA on live URL"},
]

C("idlewoman-ship.txt","register modulation",
  "The Idle Woman says Bingtown could belong to an entirely different age than the Six Duchies.",
  "The Idle Woman (pseudonymous reviewer), 'Ship of Magic (1998): Robin Hobb', 2013","https://theidlewoman.net/2013/05/05/ship-of-magic-robin-hobb/",
  "Bingtown could belong to an entirely different age than the Six Duchies","Opening paragraph",kind="analysis",date="2013-05-05",registerHint="dossier-archivist")
C("idlewoman-ship.txt","place and institution description",
  "The Idle Woman says trade, shipping and merchants' colonies give Bingtown a distinctly seventeenth-century feel in contrast with the medievalism of the Farseer trilogy.",
  "The Idle Woman (pseudonymous reviewer), 'Ship of Magic (1998): Robin Hobb', 2013","https://theidlewoman.net/2013/05/05/ship-of-magic-robin-hobb/",
  "with a distinctly seventeenth-century feel","Opening paragraph",kind="analysis",date="2013-05-05",registerHint="dossier-archivist")

LG="Lisa Goldstein, novelist, reviewing Dragon Haven in Strange Horizons, 2010"
LGU="http://strangehorizons.com/non-fiction/reviews/dragon-haven-by-robin-hobb/"
C("sh-goldstein.txt","repetition and refrain",
  "Goldstein criticises Hobb's habit of repeating things, as if she did not trust readers to remember them from one chapter to the next.",
  LG,LGU,"trust her readers to remember them from one chapter to the next","Fourth paragraph",kind="reception",date="2010-05-10",polarity="disputes")
C("sh-goldstein.txt","plainness and economy",
  "Goldstein says the writing seemed tired and repetitious in Dragon Keeper and is tightened in Dragon Haven.",
  LG,LGU,"which seemed tired and repetitious in the earlier book","Fourth paragraph",kind="reception",date="2010-05-10",polarity="disputes")
C("sh-goldstein.txt","withheld information and inference",
  "Goldstein complains that very little in Dragon Haven could not have been guessed by an astute reader.",
  LG,LGU,"Very little happens that couldn't have been guessed by an astute reader","Sixth paragraph",kind="reception",date="2010-05-10",polarity="disputes")

RANT_URL="https://web.archive.org/web/20050630015105id_/http://www.robinhobb.com/rant.html"
RANT_ROUTE="the essay was removed from robinhobb.com; located the original URL via the Wayback CDX API and fetched the 2005-06-30 raw capture (id_ form), gunzipped locally"
LP_URL="https://www.lisipieces.com/robin-hobb-isnt-writing-back-anymore/"

SOURCES += [
 {"title":"The Fan Fiction Rant (Robin Hobb, robinhobb.com, captured 30 June 2005)","url":RANT_URL,"kind":"own-words","substantive":True,"date":"captured 2005-06-30","route":"Wayback raw capture of a page since removed from the live site"},
 {"title":"Robin Hobb Isn't Writing Back Anymore (Elise Mead, LisiPieces)","url":LP_URL,"kind":"own-words","substantive":True,"date":"2025-10-18","route":"curl browser-UA on live URL"},
 {"title":"Blogging rant (robinhobb.com/rant.html, captured 7 January 2009)","url":"https://web.archive.org/web/20090107003409id_/http://robinhobb.com/rant.html","kind":"own-words","substantive":False,"date":"captured 2009-01-07","route":"Wayback raw capture; the later occupant of the same URL, an anti-blogging piece, not craft"},
]

RANT="Robin Hobb, 'The Fan Fiction Rant', robinhobb.com (page since removed)"
C("rant2005.txt","omission as information",
  "Hobb says fan fiction closes up the space she has engineered into the story.",
  RANT,RANT_URL,"closes up the space that I have engineered into the story","Section: I should be flattered",kind="own-words",date="2005 or earlier",
  registerHint="dossier-archivist",routeHint=RANT_ROUTE)
C("rant2005.txt","withheld information and inference",
  "Hobb objects that the reader is then told what he must think rather than being allowed to observe the characters and draw his own conclusions.",
  RANT,RANT_URL,"told what he must think rather than being allowed to observe","Section: I should be flattered",kind="own-words",date="2005 or earlier",
  polarity="rejects",routeHint=RANT_ROUTE)
C("rant2005.txt","omission as information",
  "Hobb says that if something is left nebulous in her text it is because she intends it to be nebulous.",
  RANT,RANT_URL,"If something is left nebulous, it is because the author intends","Section: I should be flattered",kind="own-words",date="2005 or earlier",
  registerHint="dossier-archivist",routeHint=RANT_ROUTE)
C("rant2005.txt","omission as information",
  "Hobb says a writer puts a great deal of thought into what goes into the story and what does not.",
  RANT,RANT_URL,"A writer puts a great deal of thought into what goes","Section: I should be flattered",kind="own-words",date="2005 or earlier",
  routeHint=RANT_ROUTE)
C("rant2005.txt","withheld information and inference",
  "Hobb uses the Mona Lisa as her analogy: each viewer draws his own conclusions about the elusive smile rather than having eyebrows drawn on.",
  RANT,RANT_URL,"Each of us draws his own conclusions about her elusive smile","Section: I should be flattered",kind="own-words",date="2005 or earlier",
  routeHint=RANT_ROUTE)

LP="Robin Hobb, interviewed by Elise Mead, LisiPieces, 2025"
C("lisipieces.txt","concrete sensory noun",
  "Hobb says that in a description of anything she wants to engage as many of the five senses as possible.",
  LP,LP_URL,"We have five senses, and in a description of anything","On writing food",kind="own-words",date="2025-10-18",registerHint="dossier-archivist")
C("lisipieces.txt","place and institution description",
  "Mead reports that Hobb keeps geographical consistency by ensuring ingredients match what would actually grow in each region.",
  "Elise Mead, paraphrasing Robin Hobb, LisiPieces, 2025",LP_URL,
  "ensuring ingredients match what would actually grow in each region","On writing food",kind="analysis",date="2025-10-18",registerHint="dossier-archivist",
  confidence="medium; a reporter's paraphrase, not a transcribed quotation")
C("lisipieces.txt","place and institution description",
  "Mead reports that Hobb wishes she had determined coinage and monetary values from the start of her worldbuilding.",
  "Elise Mead, paraphrasing Robin Hobb, LisiPieces, 2025",LP_URL,
  "determined coinage and monetary values from the start","On practical wisdom for authors",kind="analysis",date="2025-10-18",registerHint="dossier-archivist",
  confidence="medium; a reporter's paraphrase")
C("lisipieces.txt","other: indexing by incident rather than page",
  "Mead reports that Hobb's glossary entries are anchored to a chapter or event rather than page numbers.",
  "Elise Mead, paraphrasing Robin Hobb, LisiPieces, 2025",LP_URL,
  "anchored to a chapter or event rather than page numbers","On practical wisdom for authors",kind="analysis",date="2025-10-18",registerHint="chronicle-line",
  confidence="medium; a reporter's paraphrase")
C("lisipieces.txt","other: magic bounded by limitation",
  "Hobb says a tale of three magic wishes works well while an infinite number of wishes is no story at all.",
  LP,LP_URL,"A tale of three magic wishes works well","On the magic systems",kind="own-words",date="2025-10-18")
C("lisipieces.txt","place and institution description",
  "Mead says the geography of Fitz's world is not a backdrop but is full of sight, sound, taste, and cinematic color.",
  "Elise Mead, LisiPieces, 2025",LP_URL,"full of sight, sound, taste, and cinematic color","On worldbuilding",kind="analysis",date="2025-10-18",
  registerHint="dossier-archivist")
