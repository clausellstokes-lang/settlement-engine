# BAR4-SERVICES · hand-back (kept current in every push)

Branch `lane/bar4-services-2026-11-16`, cut from 8aef8e7d4 (the closed tree of the round before: the tip of
`lane/bar3-close-doors-2-2026-11-16` read a71788851 when I started, which differs from 8aef8e7d4 in one hand-back document only).
Every cure is RENDER-TIME: no generator reads a changed function (`crisisDependence.js`, `crisisStoppedRow.js` and
`magicProvisionShown.js :: magicRoleHeld` are read by display leaves only), so NO RECORD MOVES.

## THE KINDS

| kind | detector | 720 before → after (instances in towns) | fresh 300 before → after | named exclusions (TRUE, with reason) | guard and positive control |
|---|---|---|---|---|---|
| S1 and S3 together | `tests/helpers/markPromise.js :: markPromiseInstances` (seven parts, below) | **93 in 53 → 0** (S1's six parts 60) | **167 in 58 → 0** (S1's 147) | EX-WITHIN 1 in 1 / 0; EX-CARRIED 7 in 6 / 19 in 19; EX-SPLIT 61 in 59 / 14 in 14 (a K6 split, named for the chair) | `tests/domain/bar4MarkPromise.test.js` (a) the zero over the 720; (b) seven controls, one a part: the detector with the tabs read blind must find the record's need in a named 720 town |
| · siege-import (a row on an input the record says is imported, bare under a siege) | same | 40 in 8 → 0 | 107 in 20 → 0 | none | control r2r-metropolis-14 (the smelter) |
| · siege-travel (a row whose own words are travel past the gates, bare under a siege) | same | 4 in 4 → 0 | 15 in 12 → 0 | EX-WITHIN: "Armed escort within the settlement's jurisdiction" (the barracks' Military escort) | control r2s-under_siege-metropolis-0 |
| · famine-food (a row naming the failed food, bare in the famine) | same | 7 in 6 → 0 (14 in 10 counted with the cooper) | 8 in 7 → 0 (27 in 23 with the cooper) | EX-CARRIED: the cooper's "Barrel making" ("barrels for ale, wine, salted meat, and fish") and the river freight's "Cargo freight": what they carry, not what they sell | control r2s-famine-village-2 |
| · gap-missing (a row of a house the record says lacks its input, bare) | same | 0 → 0 bare where the page's gap line speaks | 0 → 0 | EX-SPLIT (K6): 61 in 59 / 14 in 14 | control r2r-village-4 |
| · tab-split (one row marked on one tab, bare on the other) | same | 0 → 0 | 0 → 0 | none | control r2r-metropolis-14 (Institutions read blind) |
| · income-house (a share bare beside its trade's marked houses) | same | 9 in 9 → 0 | 17 in 17 → 0 | none | control r2s-under_siege-thorp-0 |
| S3 magic-medical ("Medical role: absent" beside a printed healing by magic) | same (its seventh part) | 33 in 33 → 0 | 20 in 20 → 0 | none | control r2r-village-1 |

The 30 read towns (packets10's seeds): 17 instances in 7 → 0 (bar the exclusions: EX-CARRIED 3, EX-SPLIT 1).

## The rows

| row | verdict | how |
|---|---|---|
| C0341, C0543 (rand-21 Iron refining) | CURED | S1 (i): the record's gap "Smelter runs on imported iron ore" under a siege: the house and its rows on that input read "Curtailed by the siege." (`crisisStoppedRow.js :: housesOnImportedInput`, `IMPORTED_INPUT` in `CURTAILED_BY`): it works what it holds and nothing more comes in (the trade record's own reading of a siege: "running on existing stockpiles only"; the smiths beside it print Impaired). Door word "(curtailed)". |
| C6093 (rand-23 Fresh bread, WEAK) | CURED | the same rule ("Bakers runs on imported grain"): the door now reads "Fresh bread (curtailed)" and the Services row "Impaired · Curtailed by the siege." The house's one tag already read Impaired. |
| C6632 (rand-23 Street food) | CURED | `"Street food": [GRAIN, LIVESTOCK]` (pies, roasted meats): "Scarce in the famine." The class: Drink service (ale) [GRAIN]; Grain storage and Strategic grain reserves [GRAIN]. |
| C19622 (rand-22 Armed escort) | CURED | `"Armed escort": [TRAVELLERS]`: "Stopped by the siege." The class: Mercenary hire "Off-duty soldiers available for escort" and Pack animal hire "… for journeys." by their descriptions (`SERVICE_DEPENDENCE_BY_DESC`). |
| C6795 (rand-23 Stone Quarrying, WEAK) | CURED | S1 (ii): a share titled by a resource trade (`incomeLineSiblings.js :: RESOURCE_ROW_TRADES`, the maritime fish share with the fish trade) whose every live house of the trade carries a crisis mark takes the mildest of them: "Stopped by the siege." beside its quarry. The class: the fish shares beside a stopped or curtailed fishing house (9 in the 720, 17 in the 300). |
| C46104 (rand-21 village Lumber milling) | NAMED (K6) | THE RECORD IS SPLIT: `resourceAnalysis.gaps` says "Sawmill exists but lacks access to timber" while the economy's production and exports list "Milled lumber" and the page's gap reader (`validationOnPage.js :: inputAnswered`) answers the input from them: no gap line prints. Marking the row short would set it against the town's own export list. The two leaves are `src/generators/resourceGenerator.js` (the gap) and `src/domain/display/validationOnPage.js` / the economy's production (neither mine). 61 rows in 59 towns of the 720 and 14 in 14 of the 300 (the charcoal burner 36, the caravanserai 16, the sawmill 8). |
| C22221 (r2s-plague_onset-thorp-2, fish stall) | NAMED (K6) | THE RECORD IS SPLIT: the food record counts `fish` among the town's sources (`foodSecurity.foodRecord.foodSources`) while the Depleted list holds its only fishery (`river_fish`) and no chain works it. A "Short of fish." mark would contradict the food ledger. 45 towns of the 720 and 30 of the 300 hold a fish food source with every fishery depleted. Leaves: `src/generators/economy/foodBalance.js` (foodSources) against `config.nearbyResourcesDepleted`. |
| C7595 (bar0-city-wartime-rand-6, "Fully exploited") | STRUCK by the measure | by the record a war takes 15 in 100 of the harvest (`foodBalance.js`: `productionMult *= 0.85`, "The levy has taken workers from the fields") and stops no chain (no war arm in `chainStateShown.js`; the own-ground chain cards of the 24 war towns of the 720 print running 53, vulnerable 52, impaired 37, entrepôt 8, as calm towns do). "Fully exploited" grades which grounds are worked, and they are all still worked. |
| C45429 (rand-23 village, "Medical role: absent", WEAK) | CURED | S3: `magicProvisionShown.js :: magicRoleHeld('medical')` also holds where a healing row of the record (`availableServices.healing`, not custom) names magic, the divine or a spell (`healingByMagicShown`): the row prints the profile's own band ("occasional", "common"), or is left out where that band is "absent". 33 towns of the 720. |

## Every new or changed line (THE VETO LIST)

No new words. These marks are new on rows that printed bare (the marks' words are the leaf's own, already on the list):
- "Curtailed by the siege." on a house on an imported input and its input rows (smelter, potter, brickmaker, bakers):
  r2r-metropolis-14 (metropolis), r2s-under_siege-city-2 (city), r2s-under_siege-town-1 (town). The smallest town it
  reaches is a town.
- "Stopped by the siege." on Armed escort, Mercenary hire (escort), Pack animal hire (journeys): r2s-under_siege-metropolis-0,
  bar0-hamlet-under_siege-rand-22 (hamlet), r2r-metropolis-14.
- "Scarce in the famine." on Street food, Drink service, Grain storage, Strategic grain reserves: r2s-famine-village-2
  (village), r2s-famine-town-1 (town), r2s-famine-city-1 (city).
- An income share's mark from its houses: r2s-under_siege-thorp-0 (thorp), r2r-village-21 (village, "Curtailed"),
  r2s-under_siege-city-0 (city).
- The Magic tab's medical row: "Medical role: occasional" where it read "absent" beside the priest's divine healing:
  r2r-village-1, r2r-village-4, r2r-village-5 (villages).

## The books my cures move

PENDING (the after-run and the books are run at my final tip; this section is filled before the last push).

## Registrations owed

- None under `tests/generators` (the guard is `tests/domain/bar4MarkPromise.test.js`: no manifest entry owed).
- A new import of `generators/economy/incomeLineSiblings.js` (`RESOURCE_ROW_TRADES`) in `src/domain/display/crisisStoppedRow.js`:
  it is not a goods module of amendment 12's list, so no roster row is owed.

## Left, in order (for a successor)

1. THE TWO K6 SPLITS (named above, for the chair): the gap "lacks access" against the economy's production and exports
   (C46104's class); the food record's fish against a depleted fishery (C22221's class). Neither writer is mine.

## How the instruments are re-made

`git archive` of `docs/chair/2026-11-14/probes/READ-ALL` (chair's lane) and `.../CENSUS-3` (census lane) to the scratch
directory. Records alone (enough for the detector): `TREE=<tree> OUT=<dir> SEEDS=<seeds file> node CENSUS-3/births.mjs`
(the 720: `seeds.txt`; the fresh 300: packets11's `seeds.fresh300.txt`; the read towns: packets10's `seeds.bar4.txt`).
The count: a twenty-line script over `corpus.ndjson.gz` that imports `<tree>/tests/helpers/markPromise.js` and tallies
`markPromiseInstances(s)` by `kind` (and `excluded`), town and line. The page census and the inventory diff as before:
`census3.sh <tree> <out> 4 --count-only` (with `--seeds <file>` for the 300), `inventory.py`, `inventory_diff.py`.
