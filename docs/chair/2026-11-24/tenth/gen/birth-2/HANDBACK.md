# BIRTH-2 — HAND-BACK (the tenth chair's seat; kept current at every push)

## 0. WHERE THE SEAT STANDS (written 09:06 UTC 2026-11-25)
- Prompt: `docs/chair/2026-11-24/tenth/prompts/START-BIRTH-2.txt` + `START-GEN-COMMON.txt` on `lane/chair-2026-11-08`.
- Base: `origin/lane/close-7-2026-11-24-cures` at 0ec96f13d8 (point 116, troubles lit, guard merged; engine 0.10.0).
- Branch: `lane/birth-2-2026-11-25` (this file, probes). Units go up as `lane/birth-2-2026-11-25-<unit>-wip`, cut at the base.
- First message to the chair sent ~09:00 UTC.
- UNIT A5 (standing sentence as its own field): MEASURED; ruling ASKED at 09:10 UTC (proposal BESIDE: a `standing` field beside desc,
  desc unchanged; bytes ~440 B avg, ~1.8 KB max a birth on C and V; APART ~50 B). NOTHING BUILT until the chair rules.
  Writers read: `factionStanding.js :: annotateFactionStanding` (the one sentence writer, called from
  `rulingStructure.js :: generatePowerStructure`), then the settlers that rewrite the tail: `applyDensityLaw.js :: resizeSeats`
  (a minted rival copies its host's desc), `rosterText.js :: settleStandingToRoster` (assembly),
  `factionStanding.js :: settleSeatHolderToRecord` (pipeline end), `rosterText.js :: settleStandingToLegitimacy` (fortune merits).
  Post-birth editors of desc: the user's edit (`settlementPendingEdits.js` faction ['desc']), the rename
  (`factionRename.js`, rewriteProse on desc), the AI refine (`supabase/functions/generate-narrative/prompts.ts`, writes desc back).
  Probe: `probes/a5bytes.census.jsx` (+ `a5sum.mjs`), run on C and V.
- UNIT D4 (powers strongest-first; the page sorts; the bar marks the holder), as of 09:20 UTC:
  - MEASURED (probes/d4order.census.jsx, d4sum.mjs): out of order C 69/900, V 121/900. Causes read: `resizeSeats` appends
    rivals after the last sort; `rulerKin.js :: foldKin` grows the ruler in place (V dp-town-93, dp-city-134: first row wrong).
  - BUILT on `lane/birth-2-2026-11-25-d4-wip` (worktree /home/user/wt/d4, node_modules and .husky/_ symlinked) at 1c1ec43f4:
    `src/domain/display/powersStrongestFirst.js`; SummaryTab (sentence, copy text, tile, bar) and `aiLayer.js ::
    extractFullContext` read it. Red 8/13 at base, green 13/13. NOT YET PUSHED.
  - IN FLIGHT: probes/d4summary.census.jsx over every birth of C and V on base and d4 (scratchpad d4/chain.sh).
  - OWED: tests/lint whole, tests/copy whole, the named tests (56 files name the changed modules), page battery
    before/after, record hashes equal, build. Then push the -wip and hand in.
  - ASKED the chair (09:2x UTC): the holder mark's words (proposed: the Power tab's own "holds power" chip). Not built.
- Corpora: C = `close-7/read24/make-plan.mjs`, V = `make-visitor-plan.mjs` over the chair's `read/plan-lit.json`.
- Probes run as: vitest config rooted at the checkout, include the probe file (see the probe headers).
