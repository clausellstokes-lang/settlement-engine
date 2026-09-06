# FINDER NOTES — Hobb × THE EPIGRAPH CENSUS (Opus finder, 2026-09-06)

## 0. A PREMISE IN THE BRIEF WAS FALSE — corrected before any claim was written
The angle said: "Elliott's reread series — 539 entries, every one fetched raw at HTTP 200 and on disk under
prose-research/hobb-raw/". **That is not the case on this machine.** `prose-research/hobb-raw/` does not exist;
the Hobb raw dir is `prose-research/sweep/hobb-raw/` and holds **104 files**, of which exactly ONE is an Elliott
page (`elliott-coins.*`). Across the WHOLE scratchpad only **5** Elliott reread entries were on disk
(`sweep/pages/elliott{1,26,226,254,315}.*`) plus `sweep/hobbcraft/elliott-reread-1.*` and `sweep/hobbcraft/elliott-226.*`
(duplicates). So the census could not be run off the existing corpus and the corpus was fetched fresh.

## 1. HOW THE CORPUS WAS ACTUALLY OBTAINED (route)
- `https://elliottrwi.com/sitemap.xml` → HTTP 200, 1001 `<loc>`s, only **420** rereading-series URLs (the sitemap is
  capped at the most recent 1001 posts, so entries ~2–142, all 2019–2020, are absent). `sitemap-2.xml`,
  `wp-sitemap.xml`, `sitemap_index.xml` all 404.
- Site is WordPress.com-hosted (`<!-- generator="wordpress.com" -->`). Full corpus pulled from the site's own
  public REST endpoint, which returns each post's published HTML content:
  `https://public-api.wordpress.com/rest/v1.1/sites/elliottrwi.com/posts/?tag=hobb-reread&fields=ID,title,URL,date,content&number=100`
  paginated by `page_handle`. **541 posts, `found: 541`.** Numbered entries 0–539 present, 5 gaps
  (126, 127, 136, 229, 291); 4 of the 5 recovered by `?search=`; only 127 (Ship of Magic, out of scope) unrecovered.
- FIDELITY CHECK: the API body for entry 226 is byte-for-byte the same prose as the independently curl-fetched
  rendered page already on disk at `sweep/pages/elliott226.txt`. The API is the page, not a summary.
- Working files: `sweep/epi/{reread_posts.json,all.json,census_raw.json,assigned.json,census3.py}`.

## 2. SCOPE OF THE CENSUS
Target = the three Fitz trilogies the angle names. Entry→book map derived from the post titles themselves:
  Farseer            entries   1–100  (Assassin's Apprentice 1–24, Royal Assassin 25–58, Assassin's Quest 59–100)
  Tawny Man          entries 221–314  (Fool's Errand 221–249, Golden Fool 250–277, Fool's Fate 278–314)
  Fitz and the Fool  entries 390–509  (Fool's Assassin 390–422, Fool's Quest 423–458, Assassin's Fate 459–509)
  TOTAL 314 entries. (Liveship 101–220, Rain Wilds 315–389, Soldier Son 510–539 excluded from the tally;
  entries 101 and 383 are quoted only as contrast cases.)

## 3. METHOD OF CLASSIFICATION (and its honest limit)
Elliott never uses the word "epigraph" — 0 occurrences in 541 entries. He describes the chapter's opening document
in a fixed set of frames: "opens/begins/starts with X before …", "Following X, «Title» …", "X prefaces «Title»",
"X precedes «Title»", "X serves as a prologue", "is introduced with X". A regex takes the first such frame per
entry; a name-initial capture (Fitz/Bee/… doing something) is treated as narrative, not a document, and the next
frame is tried. 285/314 yielded a document description; 29 did not (16 no frame matched, 13 only-narrative).
**The unit measured is Elliott's DESCRIPTION of the opening document, not Hobb's text.** Every claim says so.

## 4. THE TALLY (kind of document Elliott names, per trilogy)
KIND                                    Farseer  TawnyMan  Fitz&Fool  TOTAL
commentary/musing/note (form UNNAMED)     61        49        28        138
tale / story / legend / creation narrative 5        14         4         23
journal / diary                            0         0        21         21
report / account / testimony               4         5         9         18
letter                                     0         6        10         16
instruction / directive / pedagogy         3         2         7         12
history / annal / chronicle                6         4         1         11
song / verse / stanzas                     4         4         1          9
prophecy / dream record                    2         0         6          8
translation                                0         3         2          5
scroll                                     1         1         1          3
encyclopedia / reference entry             2         0         0          2
proverb / folk saying                      1         1         0          2
treatise                                   0         1         1          2
riddle                                     0         0         1          1
[narrative action, no document named]      0         0        13         13
[no opening description extracted]         5         4         7         16
[other/unclassified]                       6         0         8         14
TOTALS                                   100        94       120        314
RECIPE: **zero** in all 314 (the only "recipe" string in the target range is an image credit, entry 39).

## 5. STANCE AND LENGTH BANDS (Elliott's own words, counted)
- "in-milieu" appears in the opening description of  65 entries (Farseer 9, Tawny Man 49, Fitz&Fool 7).
- The description names a personal author or addressee (X's journals / a letter from X to Y / Badgerlock's / Bee's):
  Farseer 15, Tawny Man 17, Fitz and the Fool 39 — total 71. The trend is monotonic across the three trilogies.
- LENGTH: Elliott calls the opening "brief/short" 53 times, "extended/lengthy/long/longer-than-usual" 9 times
  (Farseer 30 vs 3; Tawny Man 15 vs 2; Fitz&Fool 8 vs 4). Roughly a 6:1 short-to-long band.

## 6. THE "INFECTED" LINE — Oliver, at the primary, on disk
`sweep/hobb-raw/oliver-mythlore.txt` = Matthew Oliver, "History in the Margins: Epigraphs and Negative Space in
Robin Hobb's Assassin's Apprentice," *Mythlore* 41.1 (141), Fall/Winter 2022, art. 4, dc.swosu.edu/mythlore/vol41/iss1/4.
- p.62: "the epigraphs become increasingly infected / by the style of imaginative fiction in place of the style of
  scholarly discourse." He names exactly THREE instances in Assassin's Apprentice: ch. 20 (epigraph in another
  culture's subjective perspective, the scholarly attribution moved into the main text), ch. 22 (a narrative
  intrusion — the epigraph describes a dream-vision of Fitz's), and ch. 15 (the best example: "a poetic lyricism
  creeps into his style in the epigraph").
- p.45: "The chapter epigraphs are excerpts from a public document, largely a formal history written in a distant,
  scholarly voice."  p.57: "the dry, impersonal, but objective history beginning the chapter".
- p.56: he concedes the epigraphs "are not truly epigraphs" — same narrator, no separate attributions.

## 7. CONTRAST CASES (Elliott, outside the three trilogies, quoted not tallied)
- Entry 101 (Ship of Magic prologue, 2020-05-29): "The lack of Asimovian encyclopedia-style entries is a subtler clue" —
  Liveship drops the device.
- Entry 383 (Blood of Dragons ch.17, 2024-01-22): the Rain Wilds chapter-prefaces are LETTERS and
  "the letters are rarely of any length, sensibly to them being carried by pigeons" — the carrier is the length rule.
- Entry 237 (Fool's Errand ch.17): the device named outright — "the Asimovian device with which Hobb opens the
  chapters of the Farseer and Tawny Man trilogies, the citation of in-milieu reference works."
- Entry 427 (Fool's Quest ch.5): "the Fitz-centric novels emulate the Asimovian encyclopedia-entries in their
  chapter-beginnings".

## 8. WHAT THIS GROUNDS
Rules 2, 4, 21, 27 rest on a COUNT now, not a metaphor: the dominant register of a chapter-opening record in the
Fitz books is an unattributed impersonal in-world commentary of a few sentences (138/314, 44%), with named document
forms (letter, journal, treatise, scroll, song) rare and CLUSTERED — journals appear only in Fitz and the Fool
(21/21), letters never in Farseer (0/100), treatises twice in 314.
