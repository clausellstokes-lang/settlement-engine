# FORTUNE U5b BUILD: the merit's sentence printed in the governance paragraph; the neutral reading no longer contradicts it

Written 2026-11-20 by FORTUNE-5 on the chair's ruling of 22:26 UTC (verbatim in substance below). Base: the lane tip the
seat names. Read FIRST: `briefs/COMMON.md` (its laws bind), `COMMON-RULES.txt` on `origin/lane/chair-2026-11-08` under
`docs/chair/2026-11-20/seventh/prompts/` (rules 1 to 7 and 14(e) bind every line you write), then
`measures/sentences/SENTENCES.md` and `PAGES.md` (commit e0d1cbd65, branch `lane/fortune-5-2026-11-20-u5bsent-wip`: the
draft the chair ruled on, its served-needs table and its instrument `instruments/u5b-pages.mjs`).

## THE RULING (the chair, 22:26 UTC)

1. WHERE: NO RUNG IS RAISED. The sentence JOINS THE GOVERNANCE PARAGRAPH, directly after the standing sentence
   (`src/domain/display/governanceAccount.js :: governanceAccountOf`, section "2. THE STANDING"), on screen and in print
   alike (both read `governanceAccountOf`). It prints only where `src/domain/fortune/fortuneMerits.js :: meritsOf`
   credits the record (the SAME predicate the birth used: import it, never restate it) and names the event
   `weatheredCatastrophe` returns.
2. THE THREE WORDINGS, verbatim, each opening on the event's STORED name:
   A "{event} hit {place} {ago}; the place came through it, and its people hold the more firmly to {seat}."
   B "{event} is {past} at {place}; having come through it, people there are slower to turn on {seat}."
   C "{event} hit {place} {ago}, and coming through it has left its people readier to stand by {seat}."
   `{seat}` filled exactly as the governance paragraph fills the governing power mid-sentence (`powerNameInProse` /
   `powerSentenceName`), `{place}` as the paragraph's `place`. THE TIME WORDS from the event's own `yearsAgo`, no figure:
   `yearsAgo <= 10`: {ago} "only a few years ago", {past} "only a few years past"; 11 to 40: {ago} "within a generation",
   {past} "within living memory". The two cut-offs read the leaf's table where one exists (`FORTUNE_LAW_TUNING`'s
   `weatheredWithinYears` is the 40); a NEW figure (the 10) is a DRAFT row of that table, listed for the owner's signing
   (COMMON-RULES 9), never a literal in the code. The pick among A, B, C is the kernel's mixed keyed pick
   (`src/kernel/proseHash.js :: pickVariantMixed`), keyed on the record (no new draw, no draw count changed); the pool is
   declared like every other, through the one door (`src/domain/facts/drawDeclared.js`), in its OWN data file (NEW, e.g.
   `src/data/fortuneMeritLines.js`). If declaring its needs requires a vocabulary or class-table row (COMMON-RULES 6):
   STOP and report the row; the chair grants it.
3. THE RED THE PAGES FOUND: `src/domain/display/stateProse/powerStateProse.js :: legitimacyReadingPoolKey` counts only
   prosperity, safety, defense and food, so a place the merit lifted (all four 0, `breakdown.merits` > 0) prints "has no
   strong opinion of the {seat} either way" beside its Approved standing. CURE: `merits` counts as a pull; where the four
   terms are 0 and the merit is present, the neutral-baseline line does not print. NO NEW POOL. Pin it on
   `visitor-city-14` (the visitor config of `instruments/u5b-pages.mjs`, law 2 by the fixture arm): red first (the line
   prints at the base), green after.
4. PROOFS KEPT: each wording x each time word (6 strings) the same on the owner's record, on `toPublicSafe(record)`
   (`src/domain/display/publicSafe.js`) and under the widest veil (`galleryVeil.js`), on the six places of PAGES.md.
5. FIRST PAINT (COMMON-RULES 7): `governanceAccount.js` is pinned LAZY in `vite.config.js` (its FIRSTPAINT-4 entry); the
   new data file is imported only by it and is pinned with it if the walker or the build says so. THE BUILD IS THE PROOF:
   `npm run build` (through the mutex) and `VERIFY_DIST=1` on `tests/build/vendorPdfLazy.test.js` and
   `tests/build/generationWorkerLazy.test.js`: first paint's three figures and the worker's, before and after; ANY rise:
   STOP and report.

## FILES

`src/domain/display/governanceAccount.js` (section 2 only, and the imports, at the file's existing import block),
`src/domain/display/stateProse/powerStateProse.js` (`legitimacyReadingPoolKey` only), NEW data file, `fortuneLaw.js` (one
DRAFT table row, only if the 10 is added), `vite.config.js` (a pin line only if needed), NEW
`tests/domain/fortuneMeritSentence.test.js`, registers that red keyed on these files re-taken by their own doors (named).
NEVER the files COMMON.md lists, `tests/security/`, `publicSafe.js`, `galleryVeil.js`. No line packed (rule 10).

## TESTS (red first; computed from the pool, the table and the predicates, never quoting a sentence)

(a) on built law-2 records with the merit: the paragraph holds the pool's sentence for that record, right after the
standing sentence, with the time word the table gives (both bands of `yearsAgo` hit: build or find one of each);
(b) a law-1 record, a law-2 record without the merit, and a record with no `publicLegitimacy`: the paragraph is
byte-identical to the base tree's (no sentence; nothing else moved: the two-tree confinement 525/720 identical, run
`trees.mjs` from `origin/lane/names-3-2026-11-20:docs/chair/2026-11-20/content/tools/confinement/` copied out:
`node <copy>/trees.mjs <base> <your commit> <workdir> --words=none` through the mutex); (c) the visitor-city-14 pin of
item 3; (d) item 4's eighteen equalities; (e) no sentence printed twice in one place; each wording reachable.

## THE ONE FILE FOR THE CHAIR'S EYE

`measures/sentences/PAGES-BUILT.md`: Bailton's (hxd-metropolis-73) owner page AND shared page, and Cobamal's
(visitor-hamlet-21, "The Tyranny"), the governance paragraph WHOLE, as built. Nothing else re-rendered.

## GIT AND REPORT

Branch `lane/fortune-5-u5b`; one commit for the build (and its tests), one for PAGES-BUILT.md; message ends with COMMON.md's
co-author line; do not push. Every run through `sh scripts/gate-mutex.sh --run -- …` to a file, count lines read. Green at
your commit: your tests; every test file naming a changed module (`grep -rl <basename> tests`); `tests/lint` WHOLE (fetch
`review-fixes-2026-07-08` first); `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. REPORT at
most 300 words: commits; files; the red (failing titles) and the green (count lines); first-paint figures before/after;
registers re-taken; table rows added (DRAFT); any row asked of the chair; EXECUTED vs PLAUSIBLE.
