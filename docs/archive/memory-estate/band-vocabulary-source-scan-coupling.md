---
name: ""
metadata: 
  node_type: memory
  title: "Band-vocabulary moves red a source-scanning test in tests/ui (grep tests/, not just src/)"
  date: 2026-07-27
  tags: 
    - hazard
    - testing
    - display
    - bands
    - refactor
  status: live
  originSessionId: a84f4ff8-9bed-4c25-855b-122c9ed57f27
  modified: 2026-07-27T16:46:37.622Z
---

## The fact

`tests/ui/compendiumSafetyDefense.test.jsx` does not import the band producer — it
**reads the producer file as TEXT** and asserts the quoted literals are present:

```js
const src = read('src/domain/display/defenseScoreBands.js');   // was defenseDisplay.js
for (const { name } of ladder.levels) {
  expect(src.includes(`'${name.toUpperCase()}'`)).toBe(true);   // 'STRONG' 'ADEQUATE' 'WEAK' 'CRITICAL'
}
```

So **moving a band vocabulary from one module to another reds it**, even when every
runtime value is byte-identical. Wave R-5b item #20 hit this when `readinessBadge`
(the STRONG/ADEQUATE/WEAK/CRITICAL ladder) moved out of
`src/domain/display/defenseDisplay.js` into the new leaf
`src/domain/display/defenseScoreBands.js`. A `grep -rn "<symbol>" src/` came back
clean and the move looked safe; the red only appeared because the coupling is by
FILE PATH inside a test, not by import.

## Why it matters

The failure is invisible to import-graph reasoning and to any consumer census that
searches `src/` only. It is the same shape as the "GREP a component's importers
before any feature removal" lesson, one layer out: a doc-or-source **scan** is a
consumer too.

## How to apply

Before moving or renaming any vocabulary constant, band ladder, or copy string:

1. `grep -rn "<the module path>'" tests/` — find tests that read the file as text.
2. `grep -rn "'<THE LITERAL>'" tests/` — find tests that assert the literal.
3. Re-point the scan in the SAME change and say so in a comment, then re-run it.

Sibling doc reference that also went stale in the same move:
`src/domain/compendium/bandLadders.js` names the producer in its `DEFENSE_READINESS_LEVELS`
docstring. Comments there do NOT reach `compendiumData.generated.js` (verified: the
generated file contains zero occurrences), so fixing the comment needs no
`npm run gen:compendium-data`.

## The ladder itself (as of 2026-07-27)

`src/domain/display/defenseScoreBands.js` is now THE ONE 0-100 defence-score ladder:
`scoreBand` (STRONG >=65 / ADEQUATE >=40 / WEAK >=20 / else CRITICAL) and `scoreColor`
on the same three thresholds. Consumers: OverviewTab, DefenseTab, SummaryTab,
defenseDisplay (and through it the PDF readiness rows). Before the move there were
three spellings and TWO threshold sets (the tabs' colour-only twins used 70/45/25).
