# BRIEF — THE REVIEW INTAKE, THIRD SEAT (lane REVIEW-INTAKE-3, 2026-11-06)

Seat: Opus 5.5, builder, continuing a lane two seats left at their context ceilings. Chair: Fable 5.1, cloud session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's full delegation. You send no messages; your report is the hand-back.

## 0. Where you work and the rules (unchanged)

- Worktree `/home/user/se-review`, branch `lane/review-intake-2026-11-06`, tip `5ac105919` (pushed). `node_modules` is a symlink; never `npm install`; never edit `package.json`/`package-lock.json`.
- 4 cores shared with a running gate and a sibling lane: corpus loops at `--workers 2`; vitest on targeted files only; never `npm test`, never `npm run check`.
- Never read a gate through a pipe (`sh scripts/gate-tail.sh <cmd…>` or redirect to a file under `/tmp/claude-0/-home-user-settlement-engine/91098d1e-536b-53ea-a385-88e9fe415a85/scratchpad/` and read the exit code there). No dumps into your context.
- READ WHOLE, ONCE, every source file you change or rule on.
- Commit by explicit paths, receipts in the body, ending with
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9`
- Push as transport after each unit (`git push -u origin lane/review-intake-2026-11-06`); never another branch; never a pull request. Stop at about 300k tokens of your own context, committed and pushed.
- Read first, whole: the two earlier briefs in this directory (`BRIEF-REVIEW-INTAKE-2026-11-06.md`, `BRIEF-REVIEW-INTAKE-2-2026-11-06.md`) and the lane record `docs/REVIEW_INTAKE_2026-11-06.md` on your branch, including its "SECOND SEAT" section. Then `docs/OPERATING_STANDARD.md` §1, §4, §5 and rule 32 (cite by symbol, not by line).

## 1. The chair's rulings on the second seat's questions (each vetoable by the owner)

- **R7 — the four pins on the shared fixture town `rate-11-9` (`tasteTowns.js`; two in `proseTasteInterested.walker`, two in `proseWaveGate.walker`) are re-seated on a RATE-grid replacement town**, chosen as the FIRST town of the same grid at your tip on which every precondition the four pins assert still holds (scan the grid in its own order; say how many you scanned). Re-key by identity with the cause named in a comment beside each (unit 2: a Housing row rolls one service, so later rolls fork in the captured town). If no grid town holds all four, re-seat each pin on the first town that holds ITS precondition, and say so. Do not change what the pins assert.
- **R8 — the two stale citations in `src/domain/prose/holderTable.js`** (`viability.js:588/608`, now 586/606) are re-addressed to SYMBOLS, permanently (rule 32: a citation that drifts is re-addressed to a symbol, never to a new line number): read the file whole first; cite `viability.js :: deriveWaterDependencyAnalysis` or whatever symbol owns each line. `proseWiringCensus` goes green with it; say so from the test's own run.
- **R9 — unit 4b, "a gap says which kind"**, under the chair's addendum already in the record (the writer and the record only; no display file): `evaluateInstitutionChain` classifies each would-be line against the record's evidence (the food record's import share / `economicState.primaryImports` / `localProduction` / `config.nearbyResources` and `availableResources` / a local producer per `localInstitutionSupplies`): `imported` → written with `kind: 'imported'` and an impact text saying the house runs on the imported input; `local` → not written (the chain-activation mismatch fixed at its source); `missing` → as today, `kind: 'missing'`. Red-first per class on READER R1's named seeds (`soak1k-0, -4, -8, -12, -22, -24`: the FALSE rows no longer written; the TRUE rows — the potter's clay, the vintner's grapes, the brickmaker's clay, the sawmill's timber — still written as `missing`). Count on the 1,000: settlements with any gap line, lines by kind, before (unit 4a's 5,166 / 980) → after; goldens moved (its own cause: "a gap says which kind").
- **R10 — unit 5, instruments only**: `coh:roster-duplicate-secret` and `coh:roster-duplicate-goal` in `scripts/audit/soak-review/checks.mjs` (the same text on two NPCs of one roster), keyed as a contradiction kind under the stop rule, red-first each with a planted roster, counted on the 1,000 (the first seat measured 459 and 634). No cure here (the census compose owns the draw sites; the INBOX row is already filed).
- **Accepted, no work:** the 11 struck pairs stand (listed for the owner's veto; `oasisDate` matching by tag is fine); `nameHeldThroughAssembly` A1 red since unit 2 is the expected golden-identity red until the landing re-records; the two registers (the citation roster's `dated` 9 → 10; the observed-shape readers' input hash) are the landing seat's refreeze.

## 2. The order

R8 (the citations; cheap, makes a walker green) → R7 (the pins) → R9 (unit 4b) → R10 (unit 5). Each its own commit, pushed.

## 3. The hand-back

- The lane record extended in place with a "THIRD SEAT" section (per unit: red-first title, before → after, goldens moved by cause; the replacement town and the scan count; anything left).
- Your final message: at most 350 words plus ONE table — outcome first; what the chair must rule; one CONFIRMED-vs-PLAUSIBLE sentence; the tip sha and whether it is pushed.
