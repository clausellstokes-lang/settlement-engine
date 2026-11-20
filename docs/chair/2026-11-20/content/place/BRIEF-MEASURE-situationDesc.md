# PLACE-1 MEASURE brief 1 — `economicState.situationDesc` (the Economics tab's trade line)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:00Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE: it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/situationDesc-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/situationDesc/`.

## What the chair measured (50 places a size, the working line at 43ab0f5eb; re-run by PLACE-1 at the same tip and reproduced)
"Trade proceeds at an ordinary pace for a settlement of this size." prints in 35 of 50 thorps, 45 of 50 towns, 44 of 50 cities: THE MOST REPEATED SENTENCE IN THE PRODUCT. It says nothing the record holds.

## Where to start (a map, not the census: section B is yours to make complete)
- The writer: `src/generators/economy/prosperity.js :: situationDescOf` (every branch), wrapped by `:: deriveEconomicSituationDesc` (`resolveSibling` over `:: PROSPERITY_LINE_SIBLINGS`, the market twins). Its band reading: `:: tradeBandFor`, `:: TRADE_LINE_BANDS`, `:: tradeBandContradictsLabel` (COHERENCE-AGREE-3: the line never says the opposite of the prosperity label printed beside it). Read the file WHOLE.
- The caller: `src/generators/economy/economicState.js :: generateEconomicState`, in its returned object, AFTER the trade lists are normalized in scope (`primaryExports`, `primaryImports`, `transit`, `isEntrepot`, `tradeRoute`) — but a LATER pass (`economyReconcilePass`, per that file's own comment) may append imports: measure whether the in-scope lists equal the final record's (`canonExports` / `canonImports` in `src/domain/canonicalAccessors.js`). If they differ, say where in the pipeline a composer would read the final lists without moving a draw.
- Readers found by a first grep (incomplete; complete it): `src/components/new/tabs/EconomicsTab.jsx`, `EconomicsGlance.jsx`, `src/generators/generationCoherence.js`, `src/data/dossierStateProse/economy.generated.js`, `src/domain/display/stateProse/generalStateProse.js`, `src/domain/summary/settlementQuickGuide.js`, `src/domain/settlement.schema.js`, and every test that holds a literal of the field.

## What the proposal must respect for THIS field
- The "ordinary pace" line is the MEDIUM band's line: every replacement stays a medium-band, plain remark (neither brisk nor sluggish), must not open with any `TRADE_LINE_BANDS` pattern, and must never contradict the printed prosperity label.
- The crisis, food-gap, isolated and stress branches above it are NOT to be reworded unless one of them is itself above the bar in some size (measure them all; propose only where the bar is crossed).
- The change in `prosperity.js` may be ONE call line (the fortune lane also changes that file); the wordings and their composer live in a NEW data file (and, if the composer needs final trade lists, in a writer outside `prosperity.js`: say which, and why it is not one of the files the common brief forbids).
- The census at 100 places a size, taken by PLACE-1 at 43ab0f5eb with the chair's unmodified script, sits at `/tmp/claude-0/-home-user-settlement-engine/58514440-2366-5696-9d7c-b7a1562a1023/scratchpad/census/census100-before.json` (read it for the before; copy it into your tools directory if you cite it).
