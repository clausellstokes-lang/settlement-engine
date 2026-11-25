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
- UNIT D4 (powers strongest-first; the page sorts; the bar marks the holder): probe `probes/d4order.census.jsx` written,
  runs after A5's probe. Then red first, then one sorting reader for every print site.
- Corpora: C = `close-7/read24/make-plan.mjs`, V = `make-visitor-plan.mjs` over the chair's `read/plan-lit.json`.
- Probes run as: vitest config rooted at the checkout, include the probe file (see the probe headers).
