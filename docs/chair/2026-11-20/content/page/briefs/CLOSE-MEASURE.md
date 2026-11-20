# CLOSE-MEASURE: the trouble half's closing measure and the owner's plain file. PAGE-10's brief, written 19:56 UTC 2026-11-20

A MEASURE ONLY. You change nothing under `src/` or `tests/`. Read first: `CLAUDE.md`, `briefs/BUILDER-RULES.md` (rules 1, 5, 6, 7
bind; a measure has no red), `measures/page-7/sim.mjs` WHOLE (your model: its tension selection, its sentence reader, its
"three in a row" and "interleaved sizes" code are REUSED, not re-invented), and on `origin/lane/seat-6-2026-11-20`
`docs/chair/2026-11-20/content/seat/u4/measure-lit.mjs :: visitorJob` (how a visitor's birth is configured).
THE OWNER: "So do what you can to comprehensively fix the sameness fault as much as you can".

TWO TREES, each a `git archive` into a temporary directory with `node_modules` symlinked (never the checkout's working tree):
BEFORE = `43ab0f5eb` (the working line at point 82, the lane's base: its src/tests equal the lane's before any trouble
unit); AFTER = the commit PAGE-10 gives at dispatch (the lane's tip with the hooks merged).
TWO POOLS, 150 places a size, the six sizes of `tests/components/pageCensusWalk.shared.mjs :: SIZES`:
M (measuring) = sim.mjs's own births (seeds `hxd-<size>-0..149`); V (the visitor's) = `visitorJob` copied verbatim
(seeds `visitor-<size>-0..149`; say in the header which commit you copied it from). The same seeds in both trees.
WHAT A PLACE PRINTS: each current trouble's SENTENCE (AFTER: `tensionCause.js :: tensionCauseSentenceOf` exactly as
sim.mjs calls it; BEFORE: the field the page printed for a trouble at 43ab0f5eb: find it, and name the field and the
component that printed it in your header) and its stored `plotHooks` (both trees). A place with no trouble counts in
every denominator.

THE METRICS, per tree × pool × size (and sim.mjs's interleaved sizes):
(a) TOP SHARE: the three sentences printed by the most places of the size, each as a share of ALL places of the size
    (the bar: about 15%, to 20% passes as sampling); the same for hooks.
(b) A SECOND PLACE REPEATS: over every unordered pair of distinct places of the size, the share that print at least one
    sentence word for word in common; the same for hooks (the hooks' bar: under 30%).
(c) A THIRD PLACE REPEATS: over 200,000 ordered triples of distinct places drawn with a FIXED seed (state it), the share
    where the third prints a sentence the first or second printed; the same for hooks; and sim.mjs's "three in a row"
    (any two of three share) for continuity with its 14.2% for three cities.
OUTPUT: `measures/page-10/close.mjs` (one command, its usage in its header); `close.out.txt` whose count lines start
`BAR <tree> <pool> <size> sentTop= sent2= sent3= row3= hookTop= hook2= hook3=` and `MIXED <tree> <pool> ...`; a
`close.md` table. Every figure `n/d` and %.

THE OWNER'S PLAIN FILE: `measures/page-10/owner-six.mjs` writing `OWNER-SIX.md`: the V pool's place 0 of each size
(`visitor-<size>-0`), BEFORE then AFTER: the place's name and size, and per trouble its sentence, its named sides and its
hooks as the DM reads them: plain text, no field names, no hashes. Nothing else.

FILES: only `docs/chair/2026-11-20/content/page/measures/page-10/`. Work in your own worktree on
`lane/page-10-2026-11-20-close`, cut from the commit PAGE-10 gives; commit by explicit paths with the run's time
and its count lines; never push or merge. Reply at most 250 words: commit, the BAR lines of AFTER for both pools, every
size where a bar is NOT met, every judgment you made the brief did not settle.
