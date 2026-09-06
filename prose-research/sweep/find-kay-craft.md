# Raw notes — Kay craft sweep (angle: craft essays / writing-advice analysing HOW the prose works)
Started 2026-09-06. Every source below was FETCHED (WebFetch) unless marked SNIPPET-ONLY.

## Wave 1 fetched
### Rowanwood Chronicles — Chris McBean, "Fantasy as Memory" (blog essay, 2025-12-24) — SUBSTANTIVE
- sentences "musical, but they are rarely flashy"; "cadence, balance, and carefully chosen imagery"
- diction "elegant without being ornamental"; avoids "invented terminology or ornate description"
- narrative uses "memory, foreknowledge, and reflective distance"
- "Characters often understand, sometimes too late, what a moment meant"
- interiority even for antagonists: "careful to see people rather than judge them"
- dialogue: "Emotion is often conveyed by what is not said"; "restraint, implication, and subtext"
- tone "suffused with a quiet melancholy"; "Triumphs are provisional. Victories are costly"
- "reflective, almost classical feel, closer to historical fiction"
### Clarkesworld — Chris Urie, "The 'Quarter Turn' of History" (interview, Issue 117, June 2016) — SUBSTANTIVE (conception-level, not sentence-level)
- "before you can do variations on a theme you should at least try to know the theme"
- quarter turn "acknowledges right from the outset that we can't get it exactly right"
- "Balancing, in fact, is one of the core things a novelist has to do"
### LARB "The Fantastic Worlds of Guy Gavriel Kay" — 403 on direct fetch; retry via web.archive.org
### Beamer Books — Eugene R. (blog post 2016) — NOT SUBSTANTIVE for prose (thematic: "from princes to paupers")
### Eric Falden, "You Should Read Tigana" (substack essay 2024-02-23) — SUBSTANTIVE
- "limited omniscience that vacillates between being in someone's head and being more objective"
- "changes narrative distance incredibly well, zooming in and out"
- contrasts "Third Person Video Game" locked camera
- "A given scene may be very detailed or rather sparse, but always for good reason"
- exposition "usually through the eyes or memory of the relevant characters"
- innocuous things/people "turn out—all at once—to be Chekhov's guns"
### Russ Allbery, review of Children of Earth and Sky (eyrie.org, 2022-02-21) — SUBSTANTIVE
- "master of a specific type of omniscient tight third person narration"
- "narrative commentary, foreshadowing, and emotional emphasis" alongside character thought
- "if something is important, Kay tells you"
- foreshadowing "can be described as portentous"; "like a soundtrack in a movie"
- POV shifts mid-scene w/o replay: "just a moment of doubled perspective or retrospective commentary"
- dialogue: "characters spar and thrust with every line"; "nuance into small details of wording"; plot turns "rest on the outcome of a careful conversation"
### Scott Oden, "A Quarter Turn" (substack, novelist) — SUBSTANTIVE
- "His prose can get lyrical in ways that remind me of ... JRRT"
- "The fantasy element — minimal as it is in most Kay novels — creates distance"
- "by using magic to externalize the psychological process, Kay gives the metaphor teeth"
- "Kay's quarter turn lets him compress that timeline, heighten the tragedy"
- "You're always reading about people, not wizards"
### Joel Miller, "I Drove 12 Hours to Meet Guy Gavriel Kay" (substack, 2026-05-03) — SUBSTANTIVE (process-level)
- "Readers who know nothing about the actual history don't ever feel they're behind the curve"
- begins with images ("a cabin in the woods"), no template
- "The past isn't even past" — characters carry cultural history

---

# ROUND 2 (2026-09-06, Opus finder, after the predecessor's session cutoff)

Working dir for raw fetches: `sweep/kaycraft2/` (every source has a `.html` and a `.txt`; `fetch.sh` = curl with a Chrome user agent + an HTML-to-text strip; `body.py` prints paragraphs >60 chars).
Exclusion set built from the four `found-kay-*.json` files (130 URLs) → `sweep/kay-craft-exclude.txt`.
Discovery: full BrightWeavings sitemap crawl (`wp-sitemap-posts-post-1.xml` + `-page-1.xml`, 549 URLs) diffed against that set; then eight lateral WebSearches. Last two searches surfaced nothing new.

## The highest-value finds
- **`brightweavings.com/review-by-bill-capossere-for-fantasy-literature/`** quotes the Rector's Council passage from *Children of Earth and Sky* verbatim: present tense, spelled-out count, civic nouns, institutional inventory ("There are sixty-five members of the Rector's Council as of this morning"), and Capossere's own analysis that the passage "goes on for several pages in this same wide-casting vision, often employing passive voice". This is the closest thing in the Kay corpus to the settlement-dossier register the program is reconstructing.
- **`brightweavings.com/books/ysabel-journal/`** — Kay at the sentence level with his copy-editor: colon vs semicolon in the novel's first sentence, deleting 'taste' to unclog a metaphor and to de-repeat a later use, "I'll use punctuation varaibly depending on context, speaker, rhythms" (sic), "LAST LIGHT is punctuated differently than the MOSAIC was", italics deleted every book because they "look LOUDER in galleys".
- **`brightweavings.com/books/under-heaven-tour-journal/`** — Kay's craft post: "just as language needs to suit setting, so does playing with emotions"; plus a guest post by his Penguin Canada production editor ("he forges his own rules when it comes to punctuation").
- **`brightweavings.com/nyrsf_halasz/`** (Peter Halasz, NYRSF 2000) — "the writing changes in every book"; the Sarantium prologue written as contrasting mosaic tiles; "The formal, brief lives of the two troubadours" framing *Arbonne*; "Details are critical."
- **`brightweavings.com/dictionary/`** — the Manguel & Guadalupi *Dictionary of Imaginary Places* entry on Fionavar, reproduced whole: a working GAZETTEER register over Kay's world (headword + locative gloss; builder and reign in parentheses; "Access to the Godwood and the tree is strictly controlled"; "Fionavar's prehistory is hazy"; "it is a matter of some dispute which race came first"; hedged reports; a parenthetical source list).
- **`brightweavings.com/review-by-desi-stern-for-petrichor-machine/`** — the *River of Stars* narrator is "omniscient and unreliable at once", and the tense switches per character (past for most, present for Shan).
- **`locusmag.com/review/gary-k-wolfe-reviews-a-brightness-long-ago...`** — the near-invisible outer narrator compared to Conrad's frame seaman; "Stories, he reminds us, are told, but novels are shaped."

## Disagreements worth keeping (the synthesis should not flatten them)
- **Spare vs lavish.** Dirda: "Kay has chosen a spare, slightly courtly style"; Snyder (same book, same year): "Kay's lavish descriptions of the remote landscape".
- **Clear vs obscure.** Capossere: "The prose is always under control"; Hoyle: "sentences are often convoluted, meanings often obscured" and "Kay's style is often obtuse".
- **Counter-reception.** MetaStellar's Amira Loutfi: "many other readers find it to be annoying"; Elitist Book Reviews (a completist fan): "his books tend towards a certain… sameness".

## Gaps this round could not fill
- No game designer writing about Kay's prose was found; the only games-adjacent source is the RPGnet thread the predecessor already read.
- No stylometric or corpus study of Kay located.
- Reddit is unreachable to curl (login interstitial on both old.reddit HTML and the .json endpoint), so no reader-forum claims this round.
- `justaword.fr` (Medium-hosted interview) returned a 750-byte stub: BLOCKED.
