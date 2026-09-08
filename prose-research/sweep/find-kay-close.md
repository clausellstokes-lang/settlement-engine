# FIND — Kay × close (close readings / line-level analysis: forums, blogs, video essays, reading groups)
Finder: Opus 5. Working files isolated in `kaywork/` (the sweep dir is shared with sibling finders — I clobbered a sibling `build.py` once by using a generic name; never again).
Output: `found-kay-close.json` (rebuilt by `kaywork/build-kay-close.py` from `kaywork/data-kay-close.py`; every quotation is substring-verified against the fetched text before the JSON is written).

## Fetch note
WebFetch returns a SUMMARY, not the page, for these sites — the first attempt on the Rowanwood blog came back as prose about the post. All reads below are raw `curl` with a browser user agent (`kaywork/../fetchraw.sh`-style pipeline: curl --compressed + a tag stripper), or a Wayback `id_` raw capture where the live host blocks.

## Roster status (the angle names venue TYPES, not named sources — see coverage note)
- forums: reddit r/Fantasy — **BLOCKED** (403 on www.reddit.com, old.reddit.com and the .json endpoints, with and without a browser UA). Wayback route attempted.
- blogs: FETCHED — Rowanwood, Falden's Forge, Speculiction, Peat Long, The Quill to Live, steelypips (rec.arts.sf.written repost), FantasyLiterature, Fantasy Book Review, Tor.com (via Wayback).
- reading groups / academic close readings: FETCHED — Töyrylä BA thesis (BrightWeavings).
- video essays: see below.

## Sources read (running)
1. rowanwood — Chris McBean, 2025-12-24. General stylistic analysis, no sentence quoted from the novels. SUBSTANTIVE.
2. larb — Kay interviewed by Christine Fischer Guy, LARB 2016-08-14. OWN WORDS. The competing-memory answer is here verbatim.
3. quill — The Quill to Live, 2016-01-07. Thin, reader-level.
4. falden — Eric Falden, Substack 2024-02-23. Real close reading of narrative distance and exposition.
5. bw-focal — Roosa Töyrylä, BA thesis, U. Helsinki 2017, hosted BrightWeavings. THE BEST SOURCE FOR THIS ANGLE: quotes passages of Tigana and analyses them line by line. Communal viewpoint ("as everyone knows", "word went forth", "according to most reports later"), matter-of-fact narratorial report, Ettocio the innkeeper, the Governor of Stevanien, figures (60%, 19+ focal characters).
6. walton-arbonne — Jo Walton, Tor.com 2010-08-06. The counter-case: the world denser than the characters; "too distanced".
7. steelypips — Kate Nepveu, 1999-05-12 (rec.arts.sf.written). Mosaic structure; details echoing across the book.
8. speculiction-sts — Jesse, 2014-05-06. Names the proleptic throwaway line as a habit and quotes a specimen; treats its frequency as a flaw.
9. walton-alter — Joshua Palmatier, Tor.com 2016-07-06 (via Wayback; live tor.com and reactormag both Cloudflare 403). "90 percent familiar"; alteration down to everyday ritual; and the counter-claim that the art is NOT in the language.
10. fantlit — Bill Capossere, FantasyLiterature, May 2025 (via Wayback; the live page returned an empty body). Micro/macro zoom taxonomy with quoted specimens; "no minor characters"; vignette structure.
11. fbr-sts — Fantasy Book Review (Floresiensis + Calvin Park), undated. Reader-level.
12. peatlong — Peat Long, 2026-07-02. NOT SUBSTANTIVE for prose (a plot/ending complaint).

## Overlap note
Sibling finders (kay-craft, kay-voice, kay-academic) already read rowanwood, quill, falden, LARB, walton-alter and onelastsketch. Kept here anyway because the claims are line-level and dedup happens at assembly; effort from here goes to genuinely NEW close-reading venues.
