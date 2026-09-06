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
