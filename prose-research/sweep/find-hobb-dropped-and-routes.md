# find-hobb-dropped-and-routes — raw notes (Opus finder, 2026-09-06)

Angle: CLAIM WHAT IS ALREADY FETCHED, then the second routes.

## LOCATION CORRECTION
The brief says the files are at `prose-research/hobb-raw/` and `prose-research/hobb-acad/`.
They are actually at `prose-research/sweep/hobb-raw/` and `prose-research/sweep/hobb-acad/`.
Found by `find . -type f -name '5000words.txt'`.

## DEDUPE CHECK
`merged-hobb.json` holds 386 verified claims. Counted URLs: NONE of the ten named on-disk
sources appears among them. These files were fetched in an earlier round and never claimed.
So the whole named roster is virgin territory.

## ROSTER 1 — ON DISK (all ten READ IN FULL, all ten CLAIMED)
1. 5000words.txt — Hobb, "5000 Words About Myself", Alienisti/Finncon 2004.
   URL resolved via CDX: http://www.robinhobb.com/5000words.html, wayback ts 20050724083052.
   Text has apostrophes stripped/mojibaked ("dont", "Ive") — quotes chosen to avoid them.
2. guardian2017.txt — Alison Flood, Guardian, canonical 2017/jul/28 (NOT jun; brief unspecified).
3. guardian2014.txt — Alison Flood review, Guardian 2014/sep/10.
4. independent2015.txt — reviewer identified: AMANDA CRAIG (brief did not name her).
5. tor2014review.txt — Justin Landon, 2014-08-12. Canonical has MOVED to reactormag.com
   (reactormag.com/book-review-the-fools-assassin-robin-hobb/), not the tor.com URL.
   Page also carries 14 reader comments — a separate `kind: reader` seam.
6. sh-liveship.txt — Stephanie Dray, Strange Horizons, 5 November 2001.
7. orullian.txt — Peter Orullian interview, Tor.com 2012-02-07. Live URL is Cloudflare-403
   (orullian.html is the "Attention Required!" page); the TEXT came from the Wayback capture
   20201111180135. RICHEST SINGLE SOURCE ON THE ANGLE.
8. interzone98.txt — REVIEWER IDENTIFIED: **CHRIS MORGAN**, column "FIRST FANTASIES",
   Interzone 98, August 1995. Byte-verified: archive.org item `interzone-098-1995-08-bogof-39`,
   file `Interzone 098 1995-08 (Bogof39)_djvu.txt` = 441642 bytes = local file exactly.
   Morgan believes Hobb is a MAN and a historical novelist — uses "he" throughout.
9. asimovs9702.txt — REVIEWER: **PETER HECK**, "On Books", Asimov's Feb 1997, pp. 157–158.
   Byte-verified: item `asimovsv21n02199702_201908`, `Asimovs_v21n02_1997-02_djvu.txt`
   = 406311 bytes = local file exactly.
   BEST FIND OF THE ROSTER: Heck names the chapter epigraphs "a brief historical memoir".
10. hobb-acad/assistant.txt — Hodunok (Годунок) 2024, Visnyk LNU im. T. Shevchenka,
   Filolohichni nauky No. 2(361), pp. 148–156, DOI 10.12958/2227-2844-2024-2(361)-148-156.
   THIN for this program: it is a monomyth/character-function paper, no prose-style section.
   Grepped for оповідач / першої особи / стиль / деталі / побут — ZERO hits. Two claims only,
   both from the English abstract, confidence medium.

## OCR WHITESPACE HAZARD
interzone98.txt and asimovs9702.txt are djvu OCR: words separated by DOUBLE spaces, and
line-broken words carry a "¬" soft hyphen ("conve¬ nient", "roy¬ al", "For¬ mally").
Every quote was verified against a whitespace-NORMALISED copy. Quotes were then re-chosen
to avoid every ¬ break, so they survive normalisation intact. routeHint records this.

## PRE-VERIFY RESULT (first pass)
70 candidate quotes searched in the fetched text: 68 OK, 2 MISS.
Both misses were ¬-hyphen breaks in asimovs9702 ("conve¬ nient", "roy¬ al") — quotes retrimmed.

## ROSTER 2 — THE SECOND ROUTES (status log below, appended as worked)

### Second-route status log (final)
| Named route | Status | Detail |
|---|---|---|
| Mendlesohn, Rhetorics of Fantasy p.16 | BLOCKED at primary | `fulltext/inside.php` answers "Item not available" for `rhetoricsoffanta0000mend` on both d1 and d2; `api.archivelab.org` and `ia-fts.archive.org` return nothing unauthenticated. IA was also intermittently "Temporarily Offline". Elliott's relay annotation of it was ALREADY claimed last round, so nothing new taken. |
| Mandala, Language in SF&F pp.100-130 | NOT FOUND | No accessible full text (Bloomsbury Collections has no reachable record). Elliott's exhaustive Hobb bibliography has NO Mandala entry. |
| Oliver, Magic Words, Magic Worlds | MISATTRIBUTION, reached by proxy | Grimbeek's chapter-by-chapter review names Erikson, Donaldson, Martin, Kuang, Le Guin, Bakker, Cook, Jemisin, Sanderson, Moorcock, Gemmell, Leiber, Jordan — never Hobb. Ch.7 IS the epigraph/paratext chapter but its examples are Sanderson and Jordan. The brief conflated this McFarland monograph with Oliver's separate Mythlore article "History in the Margins" on Hobb's epigraphs (already claimed 35x in the corpus). 4 claims taken anyway: the paratext thesis transfers. |
| Ekman, Here Be Dragons (2013) | NOT FOUND for Hobb | No Elliott entry. NOTE: Ekman & Taylor on epigraphs is already in the corpus (6 claims) — a different work, probably what the brief half-remembered. |
| Borowska-Szerszun, Extrapolation 60.1 | ABSTRACT ONLY | Closed access per BOTH Unpaywall and OpenAlex (`oa_status: closed`, `any_repository_has_fulltext: false`). Absent from the UwB repository (which holds two other Borowska-Szerszun items). Abstract recovered from OpenAlex `abstract_inverted_index` — a verifier must reorder the word positions before the quote matches. 2 claims, confidence medium. |
| Shropshire 2019 (OSU) | NOT FOUND | SHAREOK (OSU's IR) returns ZERO records for "Robin Hobb"; the title query returns nothing. ProQuest-only. Elliott's relay of its five coded landscape functions was already claimed last round. |
| r/Fantasy AMAs (2012/2014/2017) | BLOCKED | reddit.com is disallowed to this user agent; reddit's own JSON API refuses unauthenticated clients; three Wayback CDX enumerations for the AMA threads timed out or returned empty (the CDX works for reddit generally — a plain `*hobb*` filter returned hundreds of comment permalinks — but not within budget for the AMA threads). |
| Video-essay transcripts | FETCHED 5/5 | `youtube-transcript-api` pip-installed. riddbook, JD, blinkbox (Hobb's own words), A Novel Review, Allison Annotated. 15 claims. |

### NEW LEAD (bibliography chasing, route (a))
Crane, Ralph, and Lisa Fletcher. "An Imaginary Water World: Robin Hobb's The Liveship Traders Trilogy."
*Island Genres, Genre Islands*, Rowman & Littlefield, 2017, pp. 165-75. No OA copy found; print only.
Its relay via Elliott was ALREADY claimed last round. Flagging it because it is the one piece of
scholarship devoted to how Hobb figures a PLACE, which is what this program wants most.

### SNIPPET SEEN, NO CLAIM TAKEN (method 4.8 forbids)
OpenLibrary search-inside surfaced verbatim text from Mendlesohn & James, *A Short History of Fantasy*
naming Hobb beside Patricia McKillip as American writers. Logged as a lead, not claimed.
Also established: that engine does NOT do exact phrase matching (a query for a phrase visible in its
own snippet returned 0 results), so its nil results are NOT evidence of absence.

### STOPPING RULE
Two consecutive dry probes: Crossref (`Robin Hobb style narration landscape`) surfaced only spam DOIs
plus one item already on disk; OpenAlex `title_and_abstract.search:"Robin Hobb"` (count 30) surfaced
nothing not already on disk. WebSearch budget hit its session cap of 200 partway through.

### FINAL
94 claims, 25 sources logged (17 substantive). Every quotation searched in the fetched text; the one
claim with an empty quote is the deliberate coverage claim about Hobb's absence from Oliver's book.
