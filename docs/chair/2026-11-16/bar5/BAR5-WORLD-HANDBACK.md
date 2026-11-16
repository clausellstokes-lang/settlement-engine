# BAR5-WORLD · hand-back (in progress)

**STATUS: IN PROGRESS.** Base `600b7683a` (the joined line), both audits merged (`d40d6ab28`, `c0ea05497`; documents and `tests/helpers/pageLaws/` only). Branch `lane/bar5-world-2026-11-16`.

## THE RULES

| rule | the two readings, and where | the one fact made | before: sixty · 720 · fresh 300 | after | cured by the one change / line by line | named exclusions | guard and positive control | LAW 5, my files |
|---|---|---|---|---|---|---|---|---|
| LAW 4 · 4n-founding ("Founded roadside") | the Overview's origin row (`settlementOriginProse.js :: ORIGIN_POOLS.road[2]`, drawn from the route before the History) against the History's founding (`history.founding.reason`, `narrativeData.js :: TERRAIN_NARRATIVE_HOOKS`) | none new: the founding has ONE home, the History; the road row says where the place stands ("It stands roadside, …"), as its siblings ("Sited on", "Established along") do; the same pick | 3·3 towns · 23·23 · 9·9 (the audit: 2 · 23 · 9) | pending the tip render | the one reword (no draw moved; no other origin row founds the town: measured, the 720 prints "Founded" in one other row, "Founded on the shore", a place) | none | `tests/generators/bar5WorldLines.test.js` (a): the read row of bar0-village-famine-rand-23 constructed; the three sixty towns it fired in | — |
| LAW 5 · my six files | the line speaks of the outside, of plenty or of fired clay; it declares no crisis | — | 35 undeclared (culture 16, daily life 10, narrative 4, history 5) | 1 (the culture foodways row, ruling asked) | 6 declared (`dailyLifeLogic.js` cells: the ledger's atoms and the siege, resolved through the one rule); 3 twinned in code (`dailyLife.js`); 25 by reviewed reason | `docs/chair/2026-11-16/bar5/AUDIT/tables/B.law5.exclusions.BAR5-WORLD.json` (28 rows; the inventory reads it after the walk, reports a stale row) | (c) of the same test: the famine towns of the surplus band | 35 → 1 |

### LAW 5: what prints in a crisis town (measured on the dossier tabs, base)

- `cultureProfiles.js:205` (arabic foodways, "… caravan-borne staples"): Systems/Economics, 60 towns of the 720 (siege 2, famine 3, plague 2), 27 of the fresh 300 (siege 6, famine 6). Its twin belongs in `src/data/foodwaysPrintSiblings.js` (the print-side form that already twins "Market supply and imported grain" under a siege): no seat holds that file: RULING ASKED of the chair.
- The History's founding reasons (`narrativeData.js` 95, 98, 119, 120) and the history hooks and past events (`historyData.js` 1465, 1511, 1556, 1560, 1564): print in crisis towns, true there (the past; a hook's own fact; a conditional): excluded by reason.
- Every other culture row: no dossier tab in the sixty, the 720 or the fresh 300 (the PDF's Identity section and the Journal only); the two architectural details print in no crisis town.
- `dailyLifeLogic.js` and `dailyLife.js`: no dossier tab (the slots feed the causal, counterfactual and AI-grounding views); `dailyLife.js`'s "plentiful" printed in 3 famine towns of the 720 there: cured.

## Batches

1. `76eabffc1`: the founding row; the daily-life cells; the daily-life twins; the exclusion table; the guard.

## THE VETO LIST (new or changed lines)

- "It stands roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night." (refused under a siege as before: ORIGIN_ROW_ADMITS) · bar0-village-famine-rand-23, bar0-metropolis-calm-rand-25, r2r-thorp-40.
- "The stores still hold: bread and broth reach most tables, and the households count what is left." · r2s-famine-hamlet-2, r2s-famine-town-1, r2s-famine-metropolis-3 (no dossier tab).
- "The merchants count their stock before light, and the porters wait for loads that do not come; dawn brings the smell of woodsmoke and grain." · a siege town with a merchant power ≥ 30: none in the 720 (no dossier tab).

## THE BOOKS MY CURES MOVE

- `tests/lint/presumedThings.walker.test.js` ARM 1 (red at the base with 8 rows of other files): a fresh row `settlementOriginProse.js :: openTrade :: "It stands roadside …"` (the reworded row, refused under a siege where it prints); stale rows: `settlementOriginProse.js openTrade 48564237c7b6ab26` (the old row) and `dailyLifeLogic.js` market 8c50dca21a85a099, docks a65bb8cf55e30dc6, docks f5a56e72692d7de6, openTrade a65bb8cf55e30dc6 (the cells now declared). NOT re-taken (L6): the close's door.
- The reference: pending.

## Registrations owed

- `scripts/mutation-coverage-manifest.json`: `tests/generators/bar5WorldLines.test.js` (kills a reword of ORIGIN_POOLS.road[2] back to a founding claim, the removal of the route cells' siege declaration, the removal of the surplus band's want twin).

## What is left, in order

1. The tip render's counts (after).
2. The foodways sibling (on the chair's ruling).
3. The net (amendment 2) at the tip, and the reference's count.
