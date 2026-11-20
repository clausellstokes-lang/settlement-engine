# PLACE-1 MEASURE brief 5 — `economicState.tradeDependencies[].impact` (the trade-dependency rows)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:05Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE: it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/tradeDependencies-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/tradeDependencies/`.

The before at 100 places a size (the chair's census, unmodified, at 43ab0f5eb; top sentence's places / holders): `tools/census/fields-before-100.txt`.

## Where to start
- The writer: `src/generators/economy/economicState.js :: generateEconomicState`, the `tradeDependencies` rows (the `impact` ternary: "Dependent on trade routes. Siege, road closure, or blockade would impair operations." in EVERY place that holds the field). Read the function WHOLE.
- The row already holds a `resource` and an `institution`: the impact can say what stops, and for whom, by the road the record holds (`tradeRouteOf`), never a siege the record lacks (a hypothetical "would" stays hypothetical: keep the conditional register).
- `economicState.js` is NOT a file another lane holds (only `prosperity.js` is); still, say every line a builder would touch.
