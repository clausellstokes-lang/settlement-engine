# PLACE-1 MEASURE brief 4 — `economicViability.dependencies[] and warnings[].description` (the viability card)

Written by PLACE-1, `date -u` at writing: 2026-11-20T16:05Z. Read `BRIEF-MEASURE-COMMON.md` beside this file FIRST and WHOLE: it says how; this says what.
Your output: `docs/chair/2026-11-20/content/place/viability-MEASURE.md` and `docs/chair/2026-11-20/content/place/tools/viability/`.

The before at 100 places a size (the chair's census, unmodified, at 43ab0f5eb; top sentence's places / holders): `tools/census/fields-before-100.txt`.

## Where to start
- The writer: `src/generators/economy/foodBalance.js` (WHOLE): every `dependencies` row (title, description, impact, suggestedFixes) and every `warnings.push`. The chair measured "A city consumes building materials and fuel faster than any local hinterland can supply." in 50 of 50 cities and "Creates trade dependency and vulnerability." in 31 of 32 towns; the summary line ("✓ VIABLE: … has 0 operational dependencies") is in 50 of 50 cities too: measure it, and say whether it is this field's to cure.
- These rows are CARDS: a title, a reason, an impact, fixes. Several wordings a row is the cure where the row is structural (every city imports building materials); where the record holds WHICH goods and from where (`canonImports`, the trade route by `src/domain/facts/terrain.js :: tradeRouteOf`), the description names them. The fixes are advice to the GM: keep them advice, never a plot.
- Section B matters most here: viability text is read by summary and warning surfaces; list every one.
