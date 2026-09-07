# Martin — the CHRONICLE register (Fire & Blood / The World of Ice & Fire) — raw sweep notes
Sweep date 2026-09-06. Finder: research subagent. Method: WebSearch + WebFetch, with curl and the Browser pane for hosts that refuse WebFetch. Every source below marked READ was fetched and read, not inferred from a snippet.

## Access log (what could and could not be read)
- Irish Times (Nugent, 16 Feb 2019) — READ via WebFetch.
- Winter Is Coming roundup 23 Nov 2018 — READ via WebFetch + curl; its outbound links (verified by grep of hrefs): Mental Floss, GQ, Independent, Publishers Weekly, The Times (Rifkind), Sunday Times (Dan Jones), Tor.com (Lough). It does NOT link NYT, Guardian, or Vox. Three separate searches each for NYT / Guardian / Vox reviews returned nothing; domain-filtered searches for those three hosts are refused by the search API. Treated as NOT FOUND.
- Tor.com Lough review — the tor.com URL 301s to reactormag.com/2018/11/21/grrm-fire-and-blood-review/, which is a 404 on Reactor (checked in the Browser pane). Two further searches found no live slug. NOT READ; its one-line verdict is quoted secondhand by WiC and Wikipedia.
- Independent (O'Connor) — WebFetch blocked; READ via curl.
- GQ (Levesley) — WebFetch blocked; READ via curl.
- Publishers Weekly review — READ via WebFetch. PW interview 'Imaginary History' (Picker, 16 Jul 2018) — READ via WebFetch.
- EW interview (Hibberd, 19 Nov 2018) — WebFetch/curl 403; READ in the Browser pane.
- The Times (Rifkind) / Sunday Times (Jones) — paywalled JS shells (1.3KB); NOT READ; quoted secondhand via WiC/Wikipedia.
- Kirkus — READ. Grimdark Magazine (Phipps) — READ via curl. Fantasy Book Review (Barrs) — READ. Speculiction — READ. Jeroen (A Sky of Books) — READ via curl. BookAnalysis — READ via curl. Cannonball Read (narfna) — READ. Bookshelf Fantasies — READ. Cosmic Circus (Gauthier) — READ. Blast from the Past — READ. Books of Brilliance — READ.
- Damkjaer, Mythlore 43.2 — dc.swosu.edu PDF 403 to every fetch path; the landing page (abstract) READ; the FULL ISSUE PDF from mythsoc.org (ML_eLore146) downloaded and the article text extracted — READ.
- Blaszkiewicz, 'From Chronicle to Fairy Tale' (Märchen und Gesellschaft, WUW 2024, pp.163-175) — CEEOL abstract page READ; full text paywalled.
- Kirchanov (Kyrchanoff), Journal of Frontier Studies 2018 — PDF downloaded and READ (English).
- Medievalists.net (Mondschein, Aug 2022) — READ via curl. Nerdist — READ via curl. Collider (Hess quotes, Sep 2022) — READ. Collider Mushroom piece — READ. Mary Sue — READ via curl (secondhand on Martin). TV Tropes — READ in Browser pane (folders via textContent). awoiaf Gyldayn — READ in Browser pane. Reactor '6 Mysteries' — READ in pane. Reactor 'Princess and the Queen' excerpt (primary text) — READ in pane. Reactor Lough '19 Strange Things' (WOIAF) — READ in pane.
- Not a Blog 'Fire & Blood: On the Way' (25 Apr 2018) — READ. Not a Blog excerpt post (27 Sep 2018) — READ. georgerrmartin.com book pages — READ. WiC digests of PW/EW/Colbert — READ.
- Garcia/Antonsson: ShadowDance interview — Anubis PoW wall, pane navigation denied, NOT READ. adriasnews 2015 — domain hijacked (redirects to bit.ly), NOT READ. Euronews 2014 — READ (short quotes from Antonsson/Garcia). Drunk Monkeys WOIAF review — READ. litcritpop WOIAF review — READ. FiveThirtyEight — dead redirect.
- Wikipedia Fire & Blood — READ. Fandom wiki — 402. Aegon's Dream source list — READ (fan site). Wars and Politics — 410 gone. Mental Floss — 410 gone.

## Notes per source follow (see JSON for the claim list).

## Per-source notes (features only; quotations kept under twelve words)

### Martin in his own words
- PW interview (Picker, 16 Jul 2018): Gyldayn is "an opinionated guy"; "prejudices and gripes and his own cavils"; "you're reading the voice of a character". 'Fake history' dropped for 'imaginary history' after readers "took umbrage". "essentially a popular history", Costain's Plantagenets as model, "the GRRMarillion" accepted.
- EW interview (Hibberd, 19 Nov 2018): "written in the style of a textbook", "deliberately that way"; "I only have one voice to do"; Gyldayn "a crotchety old academic"; easy because "linear" — "here's what happened in the year 30"; historian analogy (Civil War historian working from "memories and court records"); "invented imaginary primary sources", "the same different events in three different ways"; generational cast "born, grow up and die"; origin: 300,000 words of WOIAF sidebars pulled out — "the GRRM-arillion".
- Not a Blog 25 Apr 2018: "not a novel"; "imaginary history"; "The essential point being the 'history' part."; Costain "(But with dragons.)"; manuscript "handwritten on vellum with a quill pen", transcribed to WordStar.
- Not a Blog 27 Sep 2018 (excerpt): Jaehaerys progress excerpt — regnal-year opener (58 AC), "is reported to have said", "His Grace", mixed long/short sentences, real embedded dialogue, a family history compressed into one sentence.
- georgerrmartin.com/fireandblood: "I love reading popular histories myself, and that's what I was aiming for here."
- WiC 3 May 2018 (Not a Blog comments): "it makes sense that he wouldn't have all the information"; mysteries are "possible answers, not meant to be definitive".

### Primary text (Reactor excerpt of The Princess and the Queen)
Long descriptive title ("Being A History of the Causes, Origins, Battles, and Betrayals…"), transcription credit; opening paragraph is the historian's objection to the name "Dance" and deference to tradition ("we must dance along with the rest"); four abstract summary paragraphs before any dated scene; triads and and-chains ("knives and lies and poison"); archaic markers (whilst, alarum, moon's turn, hour of the bat/owl); asterisked footnote on greens/blacks; lore blamed on "some singer"; death dated to day/moon/year and hour; plain Anglo-Saxon-leaning vocabulary rather than Latinate.

### Critics (professional)
- Irish Times (Nugent): "dry and staid"; "live full lives in the space of a single paragraph"; "an extremely unreliable narrator"; Silmarillion test; three chapters of Machiavellian set-pieces.
- Independent (O'Connor): "historical writing should be dry and clinical"; sky-battle "fall[s] as flat"; "at least six are called Aegon"; "piece of homework"; publisher's Gibbon line.
- GQ (Levesley): "a dry, dusty historical screed"; women's parleys "over in sentences" vs men's "pages of bluster" — the maester's voice as statement on history's erasure; Homeric "pageant of almost indistinguishable names"; least detail on the most interesting (diplomacy, rebellion).
- Publishers Weekly: "brisk summary" between brief dramatic bursts; "evocative storytelling style… mostly absent from this dry history"; "unhappy Westerosi schoolchildren"; "devoured the queen in six bites".
- Kirkus: "eldritch epochal terms"; "moving along briskly"; larger-than-life figures with human foibles.
- Grimdark (Phipps): personalities "leap from the page" without dialogue; mystery-box "breadcrumbs" with suggested answers; "A summary of the good parts".
- Times/Sunday Times/Tor.com: NOT READ — secondhand lines only ("interminable, self-indulgent crap"; "a masterpiece of popular historical fiction"; "best Song of Ice and Fire book in 18 years").

### Critics (blog/site)
- Speculiction: "more like a real work of history" vs Silmarillion's fables; "tight, end to end".
- Jeroen: crown-loyal maester decides what to tell or suggest, "gossipy about it"; "not written as if it is the King James Bible"; characters in "a couple of lines and details"; "a wash of names"; hint-not-tell.
- BookAnalysis: Gyldayn "placed two opposing stories side by side"; dialogue only at massive events.
- Cannonball (narfna): "history book, written in the style of a history book"; read a chapter or two at a time.
- Bookshelf Fantasies: "no overarching plotlines", "little in the way of dialogue"; "once I got into the rhythm of it".
- Cosmic Circus (Gauthier): "dry, omniscient narrator", "just basic reports of their actions"; "Long lists of lords and knights".
- Blast from the Past: Mushroom "up for debate" but enlivens. Books of Brilliance: "an actual textbook from Westeros"; legends/myths/records woven.

### Scholarship
- Damkjaer (Mythlore 43.2, 2025, pp.161-182; section "Chronicles and the Use of Historiography" pp.172-174): FaB "doubles as a diegetic chronicle"; opening sentence places history with "the maesters of the Citadel"; historiography "confined to the ivory tower"; Daeron's Conquest of Dorne "still discussed for its inaccuracy"; White Book "echoes of the warrior chronicles" (Froissart); Spiegel/Given-Wilson/Radulescu on royal sponsorship contrasted with Robert's un-chronicled rule; "Deep time is hostile to book knowledge"; "hidden truth… might not, in the end, be trustworthy".
- Blaszkiewicz (2024, CEEOL abstract): Harrenhal tourney in three registers — WOIAF chronicle → "scattered personal reminiscences of various eyewitness characters" → Meera's fairy tale.
- Kyrchanoff/Kirchanov (JFS 2018): WOIAF's authors "imitated the style of the medieval chronicle" fused with "modern simplistic historical representations"; linear periodized ages; chronicler's age-of-world estimate "ranged from 40 to 500 thousand years"; cites Cowlishaw 2015 "What Maesters Knew" (Mastering the Game of Thrones, McFarland, pp.57-70) — not read.
- Mondschein (Medievalists.net): three sources; Mushroom's "debauchery and ribald humor"; Procopius / Anglo-Saxon Chronicle / Froissart as "later compilations, paraphrases, and unreliable narrators"; Condal: "left that to the book".

### The mechanism of disputed facts (from Nerdist, Collider, TV Tropes, Reactor, awoiaf)
- Narrator admits "the history gets muddled" between Eustace (sober) and Mushroom (sensational) and leaves the reader to weigh (Nerdist).
- Hess: "three separate reporters" who "contradict each other"; "they are probably wrong" (Collider).
- Cite-then-flag: Mushroom cited, flagged false, "no follow-up statement serves to blunt" (TV Tropes); "history has mixed with folklore"; minor figures "simply disappear from the record".
- Gyldayn "brings his own bias to the importance and likelihood" — "this history is fluid" (Reactor).
- Suppressed source: Baelor "ordered it burned" (Collider). Lost manuscript: pages "damaged by neglect and by fire" (awoiaf).
- Authorship: Gyldayn = Martin; Yandel = Garcia/Antonsson (awoiaf, citing the r/asoiaf AMA).

### The Yandel register (WOIAF)
- Lough (Reactor 2014): dedication palimpsest over "not-entirely erased" Joffrey/Robert; Robert's page "very, very fawning. (And very short.)" — "Yandel knows how this game is played."
- Euronews 2014: Antonsson — "he could be wrong on some points", "chose to leave some things out"; reader — offer explanations then dismiss one "as silly, or mischievously skipping over material".
- Drunk Monkeys (McCarthy): "forced to walk a careful line"; "The Glorious Reign" as bias flag; "some records contradict one another".
- litcritpop: "basically as a textbook".

## Coverage table
| Angle | Sources read | Gap |
|---|---|---|
| Martin's own words | PW interview, EW interview, 2 Not a Blog posts, site page, WiC digest | Guardian 2018 interview referenced by EW not located |
| Named professional reviews | Irish Times, Independent, GQ, PW, Kirkus, Grimdark | Times x2 paywalled; Tor.com 404; NYT/Guardian/Vox not found |
| Scholarship | Damkjaer (full), Kyrchanoff (full), Blaszkiewicz (abstract), Mondschein | Cowlishaw 2015, Larrington/Czarnowus 2022 not accessed |
| Disputed-fact mechanism | Nerdist, Collider x2, TV Tropes, Reactor, awoiaf | — |
| Yandel/WOIAF register | Reactor (Lough), Euronews, Drunk Monkeys, litcritpop | ShadowDance + AMA unreachable |
| Primary text | Reactor PatQ excerpt, Not a Blog Jaehaerys excerpt | — |
