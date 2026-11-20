# FRAME-2 · B1 — CF11's count: results

Written 2026-11-20T05:52Z (`date -u`) by builder B1 of FRAME-2 on `lane/frame-2-2026-11-20` (head `dbbc87384`). Measure only: no file under `src/` or `tests/` changed.

## The pool

The FRAME-1 pool script (`FRAME-1-HANDBACK.md`, "How to re-measure", the first script), unchanged, run from the repo root with its cache in the scratchpad: **tried 484, calm 330** (55 a tier), as FRAME-1 measured.

## How each strain was read (the fields found)

- **W1a** `coupContenders(settlement).incumbent.gated === false`. In the code (`src/domain/rulingPowerCoup.js:111`): `gated = challengers.length < 3 || amplifiedWeight >= challengers[2].weight`, where `amplifiedWeight = governing power × publicLegitimacy.govMultiplier` and the challengers are the top three non-governing, non-criminal powers of power ≥ 5, by coup weight. So `gated === false` means: a FULL field of three challengers stands AND the ruler's amplified weight is below the weakest of them, i.e. the ruler's case does not re-enter the top three; `resolveCoup` then holds the seat at pHold 0.08 ("the ruler has no standing left to argue from"). A field thinner than three always reads `gated: true`. Counted as the code defines it.
- **W1b** The gates read `governanceLedger(entry.settlement).legitimacyScore` (`stressorGates.js:504`), and `governanceLedger` returns `powerStructure.publicLegitimacy.score` when it is an object with a numeric score (`src/domain/governanceLedger.js:52-60`; a bare legacy number otherwise; 50 neutral when absent). I used `governanceLedger(s).legitimacyScore` (the gates' own read) and compared it to `powerStructure.publicLegitimacy.score` on every town: they agree on **330 of 330** (`publicLegitimacy` is an object on all 330). Edges: < 45 and < 30, as `politicalFractureGate` uses them.
- **W2** `powerStructure.conflicts` rows (`{ parties[2], issue, stakes, intensity, desc, plotHooks }`, from `src/generators/power/conflicts.js`; one is drawn only where a person's rival/enemy tie crosses two powers). `factionRelationships` lives at **`powerStructure.factionRelationships`** (`{ pair[2], type, direction, narrative }`). Grades on the pool (rows / towns holding one): subordinate 416/263, dependent 349/195, tense 240/198, competitive 240/113, symbiotic 101/101, corrupted 8/4. **No grade is named "rival"** (rival/enemy are person-tie grades, `conflicts.js:133`). I counted as "rival or worse" the three frictional kinds that `RELATIONSHIP_KIND_ORDER` (`src/domain/dossier/powerStrata.js:182`) lists ahead of the cooperative ones: **corrupted, competitive, tense**. A narrower reading (competitive, corrupted; tense left out) is shown as a sensitivity row.
- **W3a** `economicState.foodSecurity.label`. Labels on the pool: **Secure 329, Surplus 1**. The ladder (`src/domain/compendium/bandLadders.js:159`): Surplus, Secure, then Pressured, Import-Dependent, Deficit, Active Famine; "below secure" = any of the last four. None occurs.
- **W3b** The record marks a creditor power by a `powerStructure.factions` row named **"Creditor's Representative"** or **"Crown Creditors (Noble Coalition)"**, pushed only under the `indebted` stress (`src/generators/power/stressFactions.js:122-131`; the face row `src/data/stressPowerFaces.js:75`; `factionDynamics.js:628` reads it so). Tested as a faction name matching `/creditor/i`: none on the pool.
- **W3c** `economicState.activeChains[].status`. Statuses on the pool (rows): vulnerable 1373, running 1117, operational 1077, impaired 528, magically_sustained 91. There is no "broken" status; **`impaired`** is the worst (`computeActiveChains.js:433-458`: a depleted primary input, a critical trade dependency, or a missing upstream chain). Counted: at least one `impaired` chain.
- **(b) sides** a tension side names a power where the side, lower-cased with a leading "the " dropped, equals a power's name so normalised. A looser substring test added zero matches on the pool. W1's powers: the governing power (`coupContenders(...).incumbent.name`), plus the three challengers where W1a holds. W2's powers: both parties of a conflicts row, or both of a counted relationship row. W3: the matter test by tension type, strain by strain (food types for W3a, debt types for W3b, supply types for W3c).

## The count

| measure | thorp | hamlet | village | town | city | metropolis | total (of 330) |
|---|---:|---:|---:|---:|---:|---:|---:|
| towns | 55 | 55 | 55 | 55 | 55 | 55 | 330 |
| W1a gated=false | 0 | 0 | 4 | 0 | 0 | 0 | 4 |
| W1b leg<45 | 2 | 25 | 45 | 0 | 0 | 0 | 72 |
| W1b leg<30 | 0 | 1 | 2 | 0 | 0 | 0 | 3 |
| W1 (either) | 2 | 25 | 45 | 0 | 0 | 0 | 72 |
| W2 conflicts rows | 2 | 21 | 25 | 51 | 55 | 55 | 209 |
| W2 rel. rival-or-worse | 0 | 3 | 50 | 55 | 55 | 55 | 218 |
| (W2 rel. narrow: competitive/corrupted) | 0 | 2 | 4 | 4 | 51 | 53 | 114 |
| W2 (either) | 2 | 22 | 52 | 55 | 55 | 55 | 241 |
| W3a food<Secure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| W3b creditor power | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| W3c impaired chain | 2 | 4 | 8 | 39 | 39 | 53 | 145 |
| W3 (any) | 2 | 4 | 8 | 39 | 39 | 53 | 145 |
| **UNION W1∪W2∪W3** | 6 | 37 | 55 | 55 | 55 | 55 | 263 |
| W1 ∧ b(W1) | 0 | 3 | 9 | 0 | 0 | 0 | 12 |
| W2 ∧ b(W2) | 1 | 4 | 15 | 15 | 32 | 33 | 100 |
| (W2 ∧ b via conflicts row) | 1 | 4 | 4 | 13 | 24 | 25 | 71 |
| (W2 ∧ b via rel. row) | 0 | 0 | 14 | 7 | 32 | 32 | 85 |
| W3 ∧ b(W3) | 0 | 3 | 1 | 4 | 2 | 11 | 21 |
| **UNION ∧ (b)** | 1 | 8 | 17 | 19 | 34 | 41 | 120 |
| (W2 narrow ∧ b) | 1 | 4 | 4 | 14 | 32 | 32 | 87 |
| (UNION, W2 narrow) | 6 | 37 | 53 | 54 | 55 | 55 | 260 |
| (UNION ∧ b, W2 narrow) | 1 | 8 | 11 | 18 | 34 | 41 | 113 |
| legitimacy fields disagree | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| (chain with depleted input) | 2 | 4 | 16 | 40 | 43 | 55 | 160 |
| (chain vulnerable) | 43 | 40 | 34 | 55 | 55 | 55 | 282 |

Rows in parentheses are breakdowns or sensitivities, not strains of the definition. "W2 ∧ b via conflicts row" / "via rel. row" overlap.

**Totals.** UNION W1 ∪ W2 ∪ W3: **263 of 330** (thorp 6, hamlet 37, village 55, town 55, city 55, metropolis 55). UNION ∧ (b): **120 of 330** (thorp 1, hamlet 8, village 17, town 19, city 34, metropolis 41). Each strain with its own (b): W1 12, W2 100, W3 21.

## The tension types on the pool, and the matter classification (for the seat to rule)

27 types occur (counts are tensions, 1665 sides in all). The matter test counts a type for W3 only if it is about food, debt, or trade/supply:

| type | on pool | matter class (my reading) |
|---|---:|---|
| trade_collapse | 11 | **supply** (the trade the town lives on failing) |
| trade_dispute | 14 | **supply** (terms of trade with a partner settlement) |
| resource_scarcity | 12 | **food and supply** ("a critical resource is running short", hoarding, prices) |
| outside_debt | 12 | **debt** (a debt to an outside power, the creditor moving to collect) |
| market_crash | 6 | **debt** (borderline: a speculative crash in a commodity; a side is "Creditors calling in debts") |
| economic_disparity | 16 | not counted (borderline: the wealth gap, merchants vs labourers) |
| guild_conflict | 77 | not counted (borderline: who may sell what; a guild's rights, not a supply strain) |
| crime_wave | 88 | not counted |
| disputed_land | 26 | not counted |
| generational_divide | 24 | not counted |
| plague_years | 23 | not counted |
| external_threat | 22 | not counted |
| succession_crisis | 22 | not counted |
| popular_uprising | 21 | not counted |
| religious_tension | 21 | not counted |
| great_fire | 20 | not counted |
| wild_magic | 20 | not counted |
| infiltration_fear | 19 | not counted |
| tyranny | 17 | not counted |
| corruption_scandal | 17 | not counted |
| heresy_trial | 15 | not counted |
| great_flood | 11 | not counted |
| pilgrimage_surge | 9 | not counted |
| population_friction | 9 | not counted |
| magical_controversy | 8 | not counted |
| legitimacy_crisis | 8 | not counted |
| occupation_legacy | 7 | not counted |

Because W3a and W3b are empty on the pool, only the supply class moves the count. Sensitivity (W3c with an extra type counted as supply): + guild_conflict → W3∧b 74, UNION∧b **147**; + economic_disparity → W3∧b 32, UNION∧b 123; + market_crash → 22 / 120; all three → 81 / **149**.

## The matched tensions

Distribution of the matched tensions' types (tensions, a tension can match more than one strain):

- **W1**: succession_crisis 9, corruption_scandal 2, religious_tension 1.
- **W2**: crime_wave 64, succession_crisis 17, corruption_scandal 12, religious_tension 11, economic_disparity 10.
- **W3**: trade_dispute 11, trade_collapse 5, resource_scarcity 5.

Strains matched per passing town: W2 only 87, W3 only 18, W1+W2 10, W2+W3 3, W1 only 2 (no town matches all three). In 91 of the 120 the tension the generator wrote first (#0) is a matched one.

The sides that carry the W2 matches (a side equal to a party of a counted row), by tension: Military/Guard 66, Thieves' Guild 53, Religious Authorities 17, Merchant Guilds 15, Elder Council 5, Military Party 4, City Council 4, Grand Council 4, Merchant Guild Council 3, Headman's Authority 2, Merchant oligarchy 2, and seven with 1. **Most W2 passes are crime_wave tensions whose stock sides "Military/Guard" and "Thieves' Guild" are also the two powers of a Thieves' Guild / Military/Guard row** (competitive in the relationships, often a conflicts row too).

### Every passing town: strains held and the tensions matching each

Strain keys: W1a (ungated), W1b45 / W1b30 (legitimacy), W2c (a conflicts row), W2r (a rival-or-worse relationship row), W3c (an impaired chain). `#i` is the index in `history.currentTensions`.

| seed | tier | strains held | matched tensions (strain → #index type) |
|---|---|---|---|
| frame-calm-thorp-48 | thorp | W2c | W2→#0 corruption_scandal |
| frame-calm-hamlet-7 | hamlet | W2c,W3c | W3→#0 trade_collapse |
| frame-calm-hamlet-17 | hamlet | W1b45,W2c | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-hamlet-19 | hamlet | W1b45 | W1→#0 corruption_scandal |
| frame-calm-hamlet-35 | hamlet | W3c | W3→#0 trade_collapse |
| frame-calm-hamlet-45 | hamlet | W2c | W2→#0 crime_wave |
| frame-calm-hamlet-49 | hamlet | W3c | W3→#0 resource_scarcity |
| frame-calm-hamlet-54 | hamlet | W2c | W2→#0 crime_wave |
| frame-calm-hamlet-74 | hamlet | W1b45,W2c | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-village-9 | village | W1b45,W1b30,W2r | W2→#1 religious_tension |
| frame-calm-village-10 | village | W1b45,W2r | W1→#0 corruption_scandal · W2→#0 corruption_scandal |
| frame-calm-village-14 | village | W2r | W2→#1 succession_crisis |
| frame-calm-village-20 | village | W1b45,W2r,W3c | W3→#1 resource_scarcity |
| frame-calm-village-24 | village | W1b45,W2c,W2r | W2→#0 crime_wave |
| frame-calm-village-25 | village | W1b45,W2r | W2→#1 religious_tension |
| frame-calm-village-40 | village | W1b45,W2c,W2r | W1→#1 succession_crisis · W2→#1 succession_crisis |
| frame-calm-village-45 | village | W1b45,W2r | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-village-48 | village | W1b45,W2r,W3c | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-village-49 | village | W1b45,W2c,W2r,W3c | W1→#1 succession_crisis · W2→#1 succession_crisis |
| frame-calm-village-50 | village | W1a,W1b45,W2r | W1→#0 religious_tension · W2→#0 religious_tension |
| frame-calm-village-53 | village | W1b45 | W1→#1 succession_crisis |
| frame-calm-village-60 | village | W1b45,W2r | W2→#0 religious_tension |
| frame-calm-village-66 | village | W1b45,W2c,W2r | W2→#0 religious_tension |
| frame-calm-village-68 | village | W1b45,W2r | W2→#1 religious_tension |
| frame-calm-village-75 | village | W1b45,W2r | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-village-81 | village | W1b45,W2c,W2r | W1→#0 succession_crisis · W2→#0 succession_crisis |
| frame-calm-town-1 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-2 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-13 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-20 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-23 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-24 | town | W2c,W2r,W3c | W2→#0 succession_crisis |
| frame-calm-town-27 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-30 | town | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-town-33 | town | W2c,W2r,W3c | W3→#0 trade_dispute |
| frame-calm-town-34 | town | W2c,W2r | W2→#1 economic_disparity |
| frame-calm-town-46 | town | W2c,W2r | W2→#0 economic_disparity |
| frame-calm-town-56 | town | W2c,W2r,W3c | W3→#1 trade_collapse |
| frame-calm-town-67 | town | W2c,W2r,W3c | W2→#0 economic_disparity |
| frame-calm-town-68 | town | W2c,W2r,W3c | W3→#0 trade_collapse |
| frame-calm-town-69 | town | W2c,W2r | W2→#0 crime_wave |
| frame-calm-town-73 | town | W2c,W2r,W3c | W2→#0 economic_disparity |
| frame-calm-town-74 | town | W2c,W2r,W3c | W3→#0 trade_collapse |
| frame-calm-town-79 | town | W2c,W2r,W3c | W2→#1 economic_disparity |
| frame-calm-town-81 | town | W2c,W2r,W3c | W2→#1 religious_tension |
| frame-calm-city-0 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 economic_disparity |
| frame-calm-city-3 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-4 | city | W2c,W2r,W3c | W2→#2 corruption_scandal |
| frame-calm-city-6 | city | W2c,W2r | W2→#0 crime_wave |
| frame-calm-city-8 | city | W2c,W2r | W2→#0 crime_wave |
| frame-calm-city-9 | city | W2c,W2r | W2→#1 succession_crisis |
| frame-calm-city-10 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-12 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 succession_crisis |
| frame-calm-city-13 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 corruption_scandal |
| frame-calm-city-14 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-15 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-17 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 corruption_scandal |
| frame-calm-city-18 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 economic_disparity |
| frame-calm-city-20 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-21 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-23 | city | W2c,W2r,W3c | W3→#1 trade_dispute |
| frame-calm-city-25 | city | W2c,W2r | W2→#0 crime_wave |
| frame-calm-city-28 | city | W2c,W2r,W3c | W2→#1 economic_disparity |
| frame-calm-city-33 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-35 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-37 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-39 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-42 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-45 | city | W2c,W2r | W2→#1 crime_wave |
| frame-calm-city-49 | city | W2c,W2r,W3c | W2→#0 crime_wave; #1 religious_tension |
| frame-calm-city-52 | city | W2c,W2r,W3c | W3→#0 trade_dispute |
| frame-calm-city-55 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-city-57 | city | W2c,W2r | W2→#0 crime_wave; #1 corruption_scandal |
| frame-calm-city-58 | city | W2c,W2r | W2→#0 crime_wave |
| frame-calm-city-59 | city | W2c,W2r | W2→#0 succession_crisis; #2 religious_tension |
| frame-calm-city-60 | city | W2c,W2r | W2→#0 corruption_scandal |
| frame-calm-city-62 | city | W2c,W2r,W3c | W2→#1 succession_crisis |
| frame-calm-city-64 | city | W2c,W2r,W3c | W2→#0 succession_crisis |
| frame-calm-city-65 | city | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-1 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave · W3→#2 trade_dispute |
| frame-calm-metropolis-5 | metropolis | W2c,W2r,W3c | W2→#2 economic_disparity · W3→#1 trade_dispute |
| frame-calm-metropolis-6 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave; #2 corruption_scandal |
| frame-calm-metropolis-8 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-9 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-11 | metropolis | W2c,W2r,W3c | W2→#1 succession_crisis |
| frame-calm-metropolis-12 | metropolis | W2c,W2r,W3c | W3→#0 trade_dispute |
| frame-calm-metropolis-14 | metropolis | W2c,W2r,W3c | W3→#1 trade_dispute |
| frame-calm-metropolis-17 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-18 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-19 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-21 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-22 | metropolis | W2c,W2r,W3c | W3→#1 trade_dispute |
| frame-calm-metropolis-25 | metropolis | W2c,W2r,W3c | W2→#1 economic_disparity |
| frame-calm-metropolis-26 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-27 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-28 | metropolis | W2c,W2r,W3c | W2→#1 corruption_scandal; #2 crime_wave |
| frame-calm-metropolis-30 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-32 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-34 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave; #1 corruption_scandal |
| frame-calm-metropolis-36 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-38 | metropolis | W2c,W2r | W2→#0 crime_wave |
| frame-calm-metropolis-39 | metropolis | W2c,W2r,W3c | W3→#1 trade_dispute |
| frame-calm-metropolis-42 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave; #1 religious_tension |
| frame-calm-metropolis-43 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-47 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-48 | metropolis | W2c,W2r,W3c | W3→#1 resource_scarcity |
| frame-calm-metropolis-51 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-53 | metropolis | W2c,W2r,W3c | W3→#0 trade_dispute |
| frame-calm-metropolis-55 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-56 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave · W3→#1 trade_dispute |
| frame-calm-metropolis-57 | metropolis | W2c,W2r,W3c | W3→#1 resource_scarcity |
| frame-calm-metropolis-59 | metropolis | W2c,W2r,W3c | W3→#1 resource_scarcity |
| frame-calm-metropolis-60 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-64 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave; #2 corruption_scandal |
| frame-calm-metropolis-66 | metropolis | W2c,W2r,W3c | W2→#0 succession_crisis |
| frame-calm-metropolis-67 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-68 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave; #2 corruption_scandal |
| frame-calm-metropolis-69 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-70 | metropolis | W2c,W2r,W3c | W2→#0 crime_wave |
| frame-calm-metropolis-71 | metropolis | W2c,W2r,W3c | W2→#2 religious_tension |


## Five passing and five failing towns

A town passes where at least one tension is about a strain it holds; the five failing are two with no strain at all and three that hold strains but no tension about them.
### Five passing

**frame-calm-hamlet-17** (hamlet) — PASSES
- legitimacy: publicLegitimacy.score 38 (Contested), ledger 38; coup: incumbent Headman's Authority amplified 36.8, gated true; challengers Religious Authorities 42, Military Party 15
- conflicts: Headman's Authority vs Military Party (moderate); Religious Authorities vs Military Party (moderate); rival-or-worse rels: none
- food: Secure; creditor powers: none; impaired chains: none
- strains held: W1b45,W2c; tensions: #0 succession_crisis: Headman's Authority / Popular candidate / Religious Authorities
- matched: W1→#0 succession_crisis · W2→#0 succession_crisis

**frame-calm-hamlet-7** (hamlet) — PASSES
- legitimacy: publicLegitimacy.score 48 (Tolerated), ledger 48; coup: incumbent Feudal Stewardship amplified 41, gated true; challengers Religious Authorities 35, Manor Household 14.3, Military Party 13.75
- conflicts: Manor Household vs Military Party (moderate); rival-or-worse rels: none
- food: Secure; creditor powers: none; impaired chains: iron, petty_mining
- strains held: W2c,W3c; tensions: #0 trade_collapse: Traders who fear the buyers are going elsewhere / Workers afraid for their wages / Rivals who would gain if the trade moved
- matched: W3→#0 trade_collapse

**frame-calm-city-0** (city) — PASSES
- legitimacy: publicLegitimacy.score 75 (Endorsed), ledger 75; coup: incumbent Merchant oligarchy amplified 37.7, gated true; challengers Merchant Guilds 16.15, Military/Guard 13.75, Religious Authorities 11
- conflicts: Merchant oligarchy vs Craft Guilds (high); Merchant Guilds vs Craft Guilds (high); Craft Guilds vs Thieves' Guild (high); rival-or-worse rels: Merchant oligarchy / Thieves' Guild [competitive]; Merchant Guilds / Craft Guilds [competitive]; Thieves' Guild / Military/Guard [competitive]; Merchant Guilds / Religious Authorities [competitive]
- food: Secure; creditor powers: none; impaired chains: fortification, textiles, textile_finishing, leather_goods, stone
- strains held: W2c,W2r,W3c; tensions: #0 crime_wave: Military/Guard / Those who would take the law into their own hands / Thieves' Guild | #1 economic_disparity: Merchant Guilds / Poor workers / Moderate reformers | #2 tyranny: Those who want a strong hand / Those who fear a tyrant in the making / Those who will serve whoever wins
- matched: W2→#0 crime_wave; #1 economic_disparity

**frame-calm-metropolis-5** (metropolis) — PASSES
- legitimacy: publicLegitimacy.score 75 (Endorsed), ledger 75; coup: incumbent Grand Merchant Oligarchy amplified 35.1, gated true; challengers Military/Guard 16.25, Merchant Guilds 13.3, Religious Authorities 12
- conflicts: Noble Houses vs Craft Guilds (high); Grand Merchant Oligarchy vs Craft Guilds (moderate); rival-or-worse rels: Grand Merchant Oligarchy / Thieves' Guild [competitive]; Merchant Guilds / Craft Guilds [tense]; Thieves' Guild / Military/Guard [competitive]
- food: Secure; creditor powers: none; impaired chains: fuel
- strains held: W2c,W2r,W3c; tensions: #0 tyranny: Those who want a strong hand / Those who fear a tyrant in the making / Those who will serve whoever wins | #1 trade_dispute: Merchants who trade with the partner / Those who want new partners / Authorities caught between them | #2 economic_disparity: Merchant Guilds / Poor workers / Moderate reformers
- matched: W2→#2 economic_disparity · W3→#1 trade_dispute

**frame-calm-thorp-48** (thorp) — PASSES
- legitimacy: publicLegitimacy.score 57 (Tolerated), ledger 57; coup: incumbent Feudal Stewardship amplified 54, gated true; challengers Religious Authorities 46
- conflicts: Feudal Stewardship vs Religious Authorities (moderate); rival-or-worse rels: none
- food: Secure; creditor powers: none; impaired chains: none
- strains held: W2c; tensions: #0 corruption_scandal: Feudal Stewardship / Reformers / Complicit beneficiaries
- matched: W2→#0 corruption_scandal

### Five failing

**frame-calm-thorp-0** (thorp) — FAILS
- legitimacy: publicLegitimacy.score 49 (Tolerated), ledger 49; coup: incumbent Elder Council amplified 100, gated true; challengers none
- conflicts: none; rival-or-worse rels: none
- food: Secure; creditor powers: none; impaired chains: none
- strains held: —; tensions: #0 tyranny: Those who want a strong hand / Those who fear a tyrant in the making / Those who will serve whoever wins
- matched: none

**frame-calm-hamlet-0** (hamlet) — FAILS
- legitimacy: publicLegitimacy.score 48 (Tolerated), ledger 48; coup: incumbent Elder Council amplified 79, gated true; challengers Military Party 26.25
- conflicts: none; rival-or-worse rels: none
- food: Secure; creditor powers: none; impaired chains: none
- strains held: —; tensions: #0 tyranny: Those who want a strong hand / Those who fear a tyrant in the making / Those who will serve whoever wins
- matched: none

**frame-calm-village-0** (village) — FAILS
- legitimacy: publicLegitimacy.score 44 (Contested), ledger 44; coup: incumbent Headman's Authority amplified 20.8, gated true; challengers Religious Authorities 25, Merchant Guilds 24.7, Craft Guilds 15.2
- conflicts: Headman's Authority vs Craft Guilds (moderate); rival-or-worse rels: Merchant Guilds / Craft Guilds [tense]
- food: Secure; creditor powers: none; impaired chains: none
- strains held: W1b45,W2c,W2r; tensions: #0 tyranny: Those who want a strong hand / Those who fear a tyrant in the making / Those who will serve whoever wins | #1 wild_magic: Those touched by the flares / Those who fear them / Those who would study the flares
- matched: none

**frame-calm-town-3** (town) — FAILS
- legitimacy: publicLegitimacy.score 64 (Approved), ledger 64; coup: incumbent Guild Council amplified 35.65, gated true; challengers Merchant Guilds 17.1, Religious Authorities 17, Military/Guard 16.25
- conflicts: none; rival-or-worse rels: Merchant Guilds / Craft Guilds [tense]
- food: Secure; creditor powers: none; impaired chains: food_processing
- strains held: W2r,W3c; tensions: #0 crime_wave: Military/Guard / Those who would take the law into their own hands / the criminal network
- matched: none

**frame-calm-metropolis-3** (metropolis) — FAILS
- legitimacy: publicLegitimacy.score 75 (Endorsed), ledger 75; coup: incumbent Royal Authority amplified 36.4, gated true; challengers Noble Houses 17.6, Military/Guard 15, Merchant Guilds 11.4
- conflicts: Merchant Guilds vs Thieves' Guild (high); Military/Guard vs Thieves' Guild (high); rival-or-worse rels: Royal Authority / Thieves' Guild [competitive]; Merchant Guilds / Craft Guilds [tense]; Thieves' Guild / Military/Guard [competitive]
- food: Secure; creditor powers: none; impaired chains: textiles, textile_finishing, leather_goods
- strains held: W2c,W2r,W3c; tensions: #0 guild_conflict: Guild members / Those who would trade outside the guild / Non-guild workers | #1 heresy_trial: The accusers / The accused and their sympathizers / Those in authority who would exploit the rift | #2 plague_years: Quarantine hardliners / The bereaved and the blamed / Healers and charlatans alike
- matched: none

## Findings (what the definition cannot read as written)

1. **W3a never fires on a calm town**: `foodSecurity.label` is Secure on 329 and Surplus on 1; no label below Secure occurs on the 330.
2. **W3b never fires on a calm town, by construction**: the only creditor power the record marks is the faction the `indebted` STRESS pushes (`stressFactions.js:122-131`), and a calm town has no stress. 0 of 330.
3. **No relationship grade is called "rival"**: the grades are subordinate, dependent, tense, competitive, symbiotic, corrupted. "Rival or worse" had to be read (I took tense, competitive, corrupted). With tense left out: W2 relationship rows 114 (not 218), UNION 260, UNION ∧ (b) 113.
4. **W2 is near-universal from the village up**: W2 holds on 52, 55, 55, 55 of 55 villages, towns, cities, metropolises (the tense/competitive rows alone cover 218 towns); the conflicts list is present on all 330 and empty on 121.
5. **W3c's `impaired` is common and structural**: 145 of 330 calm towns hold an impaired chain (53 of 55 metropolises); 160 hold a chain with a depleted input; 282 hold a `vulnerable` chain. There is no "broken" status.
6. **W1b sits only in the three small tiers**: 72 towns below 45 (thorp 2, hamlet 25, village 45), none in town, city or metropolis; below 30: 3 (the 3 "Legitimacy Crisis" labels). The two legitimacy fields agree on 330 of 330 (one is the other's read).
7. **W1a is rare and adds nothing**: 4 towns (all villages), and all 4 already below 45. A field of fewer than three challengers always reads gated (most thorps).
8. **Tension sides seldom name a power**: 227 of 1665 sides (13.6%) equal a power's name; the rest are descriptive ("Those who want a strong hand"). The (b) side test can only pass through those 227, and Military/Guard (76 sides) and Thieves' Guild (53) are most of them; so W2 ∧ (b) is mostly the crime_wave template (64 of its matched tensions).
9. `severity` is not read (FRAME-1 measured it is the template's list).

## The scripts (re-run: the FRAME-1 pool script, then these two, from the repo root)

`node cf11.mjs <pool.json> [src/] <rows.json>` prints the count table and a RAW line; `node fmt.mjs <rows.json>` prints the passing list and the samples.

```js
// CF11's count (FRAME-2 · B1): over the cached calm pool, the chair's "trouble of weight" (a) strains and (b) tensions about them.
// argv: the cached pool (from the FRAME-1 pool script), optionally a tree's src/ path. Prints markdown.
import fs from 'node:fs';
const R = process.argv[3] || '/home/user/settlement-engine/src/';
const { coupContenders } = await import(R + 'domain/rulingPowerCoup.js');
const { governanceLedger } = await import(R + 'domain/governanceLedger.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const norm = (x) => String(x || '').toLowerCase().replace(/^the\s+/, '').trim();
// "rival or worse" among factionRelationships grades: the frictional kinds (powerStrata.js RELATIONSHIP_KIND_ORDER's head)
const RIVAL = new Set(['corrupted', 'competitive', 'tense']);
const RIVAL_NARROW = new Set(['corrupted', 'competitive']);
const FOOD_OK = new Set(['Surplus', 'Secure']); // bandLadders.js FOOD_SECURITY_LEVELS: below Secure = Pressured, Import-Dependent, Deficit, Active Famine
// The matter test (b for W3): tension types about food, debt, or trade/supply.
const MATTER = {
  food: new Set(['resource_scarcity']),
  debt: new Set(['outside_debt', 'market_crash']),
  supply: new Set(['trade_collapse', 'trade_dispute', 'resource_scarcity']),
};
const KEYS = ['W1a', 'W1b45', 'W1b30', 'W1', 'W2c', 'W2r', 'W2rN', 'W2', 'W3a', 'W3b', 'W3c', 'W3', 'U',
  'UB', 'W1B', 'W2B', 'W3B', 'W2B_c', 'W2B_r', 'W2BN', 'UN', 'UBN', 'legDisagree', 'chainDepleted', 'chainVulnerable'];
const tally = Object.fromEntries(TIERS.map((t) => [t, Object.fromEntries(KEYS.map((k) => [k, 0]))]));
const raw = { relGrade: {}, relGradeTowns: {}, food: {}, chain: {}, confRows: {}, tensionTypes: {}, matchedTypes: { W1: {}, W2: {}, W3: {} }, legLabel: {}, gatedFalseNoW1b: 0, creditorTowns: 0, sidesTotal: 0, sidesNamingAPower: 0 };
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
const rows = [];
for (const { seed, tier, s } of towns) {
  const ps = s.powerStructure || {}, T = tally[tier];
  const cc = coupContenders(s);
  const W1a = cc.incumbent.gated === false;
  const legPS = ps.publicLegitimacy?.score, legGL = governanceLedger(s).legitimacyScore;
  if (legPS !== legGL) T.legDisagree++;
  c(raw.legLabel, ps.publicLegitimacy?.label);
  const W1b45 = legGL < 45, W1b30 = legGL < 30, W1 = W1a || W1b45;
  if (W1a && !W1b45) raw.gatedFalseNoW1b++;
  const w1Powers = W1 ? [cc.incumbent.name || ps.governingName, ...(W1a ? cc.challengers.map((x) => x.name) : [])].filter(Boolean) : [];
  const conflicts = ps.conflicts || [];
  c(raw.confRows, conflicts.length);
  const rels = (ps.factionRelationships || []).filter((r) => RIVAL.has(r.type));
  const grades = new Set();
  for (const r of ps.factionRelationships || []) { c(raw.relGrade, r.type); grades.add(r.type); }
  for (const g of grades) c(raw.relGradeTowns, g);
  const W2c = conflicts.length > 0, W2r = rels.length > 0, W2 = W2c || W2r;
  const W2rN = (ps.factionRelationships || []).some((r) => RIVAL_NARROW.has(r.type));
  const w2PairsC = conflicts.map((x) => x.parties || []), w2PairsR = rels.map((x) => x.pair || []);
  const food = s.economicState?.foodSecurity?.label; c(raw.food, food);
  const W3a = !!food && !FOOD_OK.has(food);
  const creditors = (ps.factions || []).filter((f) => /creditor/i.test(f.faction || ''));
  const W3b = creditors.length > 0; if (W3b) raw.creditorTowns++;
  const chains = s.economicState?.activeChains || [];
  for (const ch of chains) c(raw.chain, ch.status);
  const impaired = chains.filter((ch) => ch.status === 'impaired');
  const W3c = impaired.length > 0, W3 = W3a || W3b || W3c;
  if (chains.some((ch) => ch.resourceInputCondition === 'depleted')) T.chainDepleted++;
  if (chains.some((ch) => ch.status === 'vulnerable')) T.chainVulnerable++;
  const tensions = s.history?.currentTensions || [];
  const names = new Set((ps.factions || []).map((f) => norm(f.faction)));
  const match = { W1: [], W2: [], W3: [] }; let b2c = false, b2r = false, b2n = false;
  const w2PairsN = [...w2PairsC, ...(ps.factionRelationships || []).filter((r) => RIVAL_NARROW.has(r.type)).map((x) => x.pair || [])];
  tensions.forEach((t, i) => {
    c(raw.tensionTypes, t.type);
    const sides = (t.factions || []).map(norm);
    for (const sd of sides) { raw.sidesTotal++; if (names.has(sd)) raw.sidesNamingAPower++; }
    const names_ = (arr) => arr.some((p) => sides.includes(norm(p)));
    if (W1 && names_(w1Powers)) match.W1.push(i);
    const hitC = w2PairsC.some(names_), hitR = w2PairsR.some(names_);
    if (hitC) b2c = true; if (hitR) b2r = true; if (w2PairsN.some(names_)) b2n = true;
    if (hitC || hitR) match.W2.push(i);
    if ((W3a && MATTER.food.has(t.type)) || (W3b && MATTER.debt.has(t.type)) || (W3c && MATTER.supply.has(t.type))) match.W3.push(i);
  });
  const flags = { W1a, W1b45, W1b30, W1, W2c, W2r, W2rN, W2, W3a, W3b, W3c, W3, U: W1 || W2 || W3 };
  flags.W1B = match.W1.length > 0; flags.W2B = match.W2.length > 0; flags.W3B = match.W3.length > 0;
  flags.W2B_c = b2c; flags.W2B_r = b2r;
  flags.UB = flags.W1B || flags.W2B || flags.W3B;
  flags.W2BN = b2n; flags.UN = W1 || W2c || W2rN || W3; flags.UBN = flags.W1B || b2n || flags.W3B;
  for (const [k, v] of Object.entries(flags)) if (v) T[k]++;
  for (const k of ['W1', 'W2', 'W3']) for (const i of match[k]) c(raw.matchedTypes[k], tensions[i].type);
  rows.push({ seed, tier, flags, match, leg: { score: legPS, label: ps.publicLegitimacy?.label, ledger: legGL },
    coup: { incumbent: cc.incumbent.name, amplified: cc.incumbent.amplifiedWeight, gated: cc.incumbent.gated, challengers: cc.challengers.map((x) => `${x.name} ${x.weight}`) },
    conflicts: conflicts.map((x) => `${(x.parties || []).join(' vs ')} (${x.intensity})`),
    rels: rels.map((x) => `${(x.pair || []).join(' / ')} [${x.type}]`), food, creditors: creditors.map((f) => f.faction),
    impaired: impaired.map((ch) => ch.chainId || ch.name),
    tensions: tensions.map((t) => `${t.type}: ${(t.factions || []).join(' / ')}`) });
}
const LBL = { W1a: 'W1a gated=false', W1b45: 'W1b leg<45', W1b30: 'W1b leg<30', W1: 'W1 (either)', W2c: 'W2 conflicts rows', W2r: 'W2 rel. rival-or-worse', W2rN: '(W2 rel. narrow: competitive/corrupted)', W2: 'W2 (either)', W3a: 'W3a food<Secure', W3b: 'W3b creditor power', W3c: 'W3c impaired chain', W3: 'W3 (any)', U: '**UNION W1∪W2∪W3**', UB: '**UNION ∧ (b)**', W1B: 'W1 ∧ b(W1)', W2B: 'W2 ∧ b(W2)', W2B_c: '(W2 ∧ b via conflicts row)', W2B_r: '(W2 ∧ b via rel. row)', W3B: 'W3 ∧ b(W3)', legDisagree: 'legitimacy fields disagree', W2BN: '(W2 narrow ∧ b)', UN: '(UNION, W2 narrow)', UBN: '(UNION ∧ b, W2 narrow)', chainDepleted: '(chain with depleted input)', chainVulnerable: '(chain vulnerable)' };
const order = ['W1a', 'W1b45', 'W1b30', 'W1', 'W2c', 'W2r', 'W2rN', 'W2', 'W3a', 'W3b', 'W3c', 'W3', 'U', 'W1B', 'W2B', 'W2B_c', 'W2B_r', 'W3B', 'UB', 'W2BN', 'UN', 'UBN', 'legDisagree', 'chainDepleted', 'chainVulnerable'];
const per = Object.fromEntries(TIERS.map((t) => [t, towns.filter((x) => x.tier === t).length]));
console.log(`| measure | ${TIERS.join(' | ')} | total (of ${towns.length}) |`);
console.log(`|---|${TIERS.map(() => '---:').join('|')}|---:|`);
console.log(`| towns | ${TIERS.map((t) => per[t]).join(' | ')} | ${towns.length} |`);
for (const k of order) console.log(`| ${LBL[k]} | ${TIERS.map((t) => tally[t][k]).join(' | ')} | ${TIERS.reduce((a, t) => a + tally[t][k], 0)} |`);
console.log('\nRAW ' + JSON.stringify(raw));
fs.writeFileSync(process.argv[4] || '/dev/null', JSON.stringify(rows));
```

```js
// Formats the per-town rows the measure wrote (argv[2]): the passing towns' list, multi-strain counts, samples.
import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const held = (f) => ['W1a', 'W1b45', 'W1b30', 'W2c', 'W2r', 'W3a', 'W3b', 'W3c'].filter((k) => f[k]).join(',') || '—';
const pass = rows.filter((r) => r.flags.UB);
const m = (r) => ['W1', 'W2', 'W3'].filter((k) => r.match[k].length).map((k) => `${k}→${r.match[k].map((i) => `#${i} ${r.tensions[i].split(':')[0]}`).join('; ')}`).join(' · ');
const multi = {}; for (const r of pass) { const k = ['W1', 'W2', 'W3'].filter((x) => r.match[x].length).join('+'); multi[k] = (multi[k] || 0) + 1; }
console.log('MULTI', JSON.stringify(multi));
const firstIsMatch = pass.filter((r) => ['W1', 'W2', 'W3'].some((k) => r.match[k].includes(0))).length;
console.log('PASSING towns whose tension #0 is a matched one:', firstIsMatch, 'of', pass.length);
console.log('\n| seed | tier | strains held | matched tensions (strain → #index type) |\n|---|---|---|---|');
for (const r of pass) console.log(`| ${r.seed} | ${r.tier} | ${held(r.flags)} | ${m(r)} |`);
const show = (r) => { console.log(`\n**${r.seed}** (${r.tier}) — ${r.flags.UB ? 'PASSES' : 'FAILS'}`);
  console.log(`- legitimacy: publicLegitimacy.score ${r.leg.score} (${r.leg.label}), ledger ${r.leg.ledger}; coup: incumbent ${r.coup.incumbent} amplified ${r.coup.amplified}, gated ${r.coup.gated}; challengers ${r.coup.challengers.join(', ') || 'none'}`);
  console.log(`- conflicts: ${r.conflicts.join('; ') || 'none'}; rival-or-worse rels: ${r.rels.join('; ') || 'none'}`);
  console.log(`- food: ${r.food}; creditor powers: ${r.creditors.join(', ') || 'none'}; impaired chains: ${r.impaired.join(', ') || 'none'}`);
  console.log(`- strains held: ${held(r.flags)}; tensions: ${r.tensions.map((t, i) => `#${i} ${t}`).join(' | ')}`);
  console.log(`- matched: ${m(r) || 'none'}`); };
const pick = (pred, n) => rows.filter(pred).slice(0, n);
const P = [...pick((r) => r.flags.UB && r.flags.W1B, 1), ...pick((r) => r.flags.UB && r.flags.W3B, 1), ...pick((r) => r.flags.UB && r.flags.W2B_c && !r.flags.W1B && !r.flags.W3B && r.tier === 'city', 1), ...pick((r) => r.flags.UB && r.flags.W2B_r && !r.flags.W2B_c && r.tier === 'metropolis', 1), ...pick((r) => r.flags.UB && r.tier === 'thorp', 1)];
const F = [...pick((r) => !r.flags.U && r.tier === 'thorp', 1), ...pick((r) => !r.flags.U && r.tier === 'hamlet', 1), ...pick((r) => r.flags.U && !r.flags.UB && r.tier === 'village' && r.flags.W1, 1), ...pick((r) => r.flags.U && !r.flags.UB && r.tier === 'town' && r.flags.W3c, 1), ...pick((r) => r.flags.U && !r.flags.UB && r.tier === 'metropolis', 1)];
// which side names carry the W2 matches (the sides that are a party of a conflicts row or a rival-or-worse rel. row)
const sideHits = {};
for (const r of pass) { const parties = new Set([...r.conflicts.map((x) => x.replace(/ \((?:high|moderate)\)$/, '').split(' vs ')), ...r.rels.map((x) => x.replace(/ \[\w+\]$/, '').split(' / '))].flat().map((x) => x.toLowerCase()));
  for (const i of r.match.W2) for (const sd of r.tensions[i].split(': ').slice(1).join(': ').split(' / ')) if (parties.has(sd.toLowerCase())) sideHits[sd] = (sideHits[sd] || 0) + 1; }
console.log('\nW2 MATCHING SIDES', JSON.stringify(Object.entries(sideHits).sort((a, b) => b[1] - a[1])));
console.log('\n### Five passing'); P.forEach(show);
console.log('\n### Five failing'); F.forEach(show);
```

## Sensitivity: W2 from conflicts rows alone

Added 2026-11-20T05:53Z (`date -u`) at the coordinator's follow-up, on the same cached pool (330 calm towns). W2 is read from `powerStructure.conflicts` rows only; no relationship rows count. W1 is unchanged (W1a, or W1b below 45; (b) through a side that names the governing power, or a challenger where W1a holds). W3 is W3c (an impaired chain), and its matter types are trade_collapse, trade_dispute, resource_scarcity, outside_debt and market_crash. The "first-opened" tension is the lowest-index tension that matches any strain the town holds. Conflicts `intensity` has two grades on the pool, moderate and high, so the "highest grade only" variant counts `high` rows. The third variant is the first with a matter test added for W1: a tension also counts as about W1 when the town holds W1 and the tension's type is legitimacy_crisis, succession_crisis, leadership_vacuum, tyranny or popular_uprising.

**Variant: every conflicts row**

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| UNION W1∪W2c∪W3c | 6 | 37 | 53 | 54 | 55 | 55 | 260 |
| UNION ∧ (b) | 1 | 8 | 11 | 17 | 29 | 35 | 101 |
| W2c ∧ b(W2c) | 1 | 4 | 4 | 13 | 24 | 25 | 71 |
| W1 ∧ b(W1) | 0 | 3 | 9 | 0 | 0 | 0 | 12 |
| passing towns whose first-opened tension is crime_wave | 0 | 2 | 1 | 8 | 18 | 18 | 47 |

Conflicts rows' intensity on the pool: {"moderate":174,"high":197}; rows matched by a (b) side: {"moderate":33,"high":63}.
First-opened tension types of the passing towns: [["crime_wave",47],["succession_crisis",15],["trade_dispute",9],["corruption_scandal",6],["trade_collapse",5],["resource_scarcity",5],["religious_tension",5],["economic_disparity",4],["outside_debt",4],["market_crash",1]].

**Variant: a conflicts row only at intensity 'high'**

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| UNION W1∪W2c∪W3c | 4 | 29 | 46 | 43 | 51 | 55 | 228 |
| UNION ∧ (b) | 0 | 7 | 10 | 9 | 29 | 31 | 86 |
| W2c ∧ b(W2c) | 0 | 2 | 0 | 4 | 24 | 21 | 51 |
| W1 ∧ b(W1) | 0 | 3 | 9 | 0 | 0 | 0 | 12 |
| passing towns whose first-opened tension is crime_wave | 0 | 1 | 0 | 2 | 18 | 16 | 37 |

Rows counted (high) matched by a (b) side: {"high":63}.
First-opened tension types of the passing towns: [["crime_wave",37],["succession_crisis",15],["trade_dispute",9],["trade_collapse",5],["resource_scarcity",5],["outside_debt",5],["religious_tension",4],["corruption_scandal",3],["economic_disparity",2],["market_crash",1]].

**Variant: every conflicts row, plus the W1 matter test**

| measure | thorp | hamlet | village | town | city | metropolis | total |
|---|---:|---:|---:|---:|---:|---:|---:|
| UNION W1∪W2c∪W3c | 6 | 37 | 53 | 54 | 55 | 55 | 260 |
| UNION ∧ (b) | 1 | 10 | 17 | 17 | 29 | 35 | 109 |
| W2c ∧ b(W2c) | 1 | 4 | 4 | 13 | 24 | 25 | 71 |
| W1 ∧ b(W1) | 0 | 5 | 15 | 0 | 0 | 0 | 20 |
| passing towns whose first-opened tension is crime_wave | 0 | 2 | 1 | 8 | 18 | 18 | 47 |

Tensions newly matching W1 by the matter test (not by a side): [["popular_uprising",3],["tyranny",3],["legitimacy_crisis",3]].
First-opened tension types of the passing towns: [["crime_wave",47],["succession_crisis",15],["trade_dispute",9],["corruption_scandal",6],["trade_collapse",5],["resource_scarcity",5],["religious_tension",5],["economic_disparity",4],["outside_debt",4],["tyranny",3],["legitimacy_crisis",3],["popular_uprising",2],["market_crash",1]].

The script change: a separate script, run as `node cf11c.mjs <pool.json> [src/]` from the repo root. `cf11.mjs` above is unchanged.

```js
// CF11 sensitivity (FRAME-2 · B1 follow-up): W2 from powerStructure.conflicts rows ALONE (no relationship rows).
// W1 = W1a or W1b<45 (as cf11.mjs). W3 = W3c (an impaired chain) with matter types trade_collapse, trade_dispute,
// resource_scarcity, outside_debt, market_crash. Variant "high": a conflicts row counts only at intensity 'high'.
// Variant "w1matter": as "all", plus a W1 matter test (the town holds W1 and the tension's type is in W1_MATTER).
// "First-opened" tension = the lowest-index tension matching any strain the town holds. argv: the cached pool, [src/].
import fs from 'node:fs';
const R = process.argv[3] || '/home/user/settlement-engine/src/';
const { coupContenders } = await import(R + 'domain/rulingPowerCoup.js');
const { governanceLedger } = await import(R + 'domain/governanceLedger.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const norm = (x) => String(x || '').toLowerCase().replace(/^the\s+/, '').trim();
const MATTER = new Set(['trade_collapse', 'trade_dispute', 'resource_scarcity', 'outside_debt', 'market_crash']);
const W1_MATTER = new Set(['legitimacy_crisis', 'succession_crisis', 'leadership_vacuum', 'tyranny', 'popular_uprising']);
const c = (m, k) => { m[k] = (m[k] || 0) + 1; };
for (const variant of ['all', 'high', 'w1matter']) {
  const T = Object.fromEntries(TIERS.map((t) => [t, { U: 0, UB: 0, W2cB: 0, W1B: 0, firstCrime: 0 }]));
  const inten = {}, intenMatched = {}, firstTypes = {}, newW1 = {};
  for (const { tier, s } of towns) {
    const ps = s.powerStructure || {}, cc = coupContenders(s);
    const W1a = cc.incumbent.gated === false, W1 = W1a || governanceLedger(s).legitimacyScore < 45;
    const w1Powers = W1 ? [cc.incumbent.name || ps.governingName, ...(W1a ? cc.challengers.map((x) => x.name) : [])].filter(Boolean) : [];
    const all = ps.conflicts || [];
    if (variant === 'all') for (const r of all) c(inten, r.intensity);
    const rows = variant === 'high' ? all.filter((r) => r.intensity === 'high') : all;
    const W2 = rows.length > 0;
    const W3 = (s.economicState?.activeChains || []).some((ch) => ch.status === 'impaired');
    const tensions = s.history?.currentTensions || [];
    let first = -1, w2b = false, w1b = false; const hitRows = new Set();
    tensions.forEach((t, i) => {
      const sides = (t.factions || []).map(norm), names = (arr) => arr.some((p) => sides.includes(norm(p)));
      const bySide = W1 && names(w1Powers), byMatter = variant === 'w1matter' && W1 && W1_MATTER.has(t.type);
      if (byMatter && !bySide) c(newW1, t.type);
      const m1 = bySide || byMatter; if (m1) w1b = true;
      const m2rows = rows.filter((r) => names(r.parties || []));
      for (const r of m2rows) hitRows.add(r);
      const m3 = W3 && MATTER.has(t.type);
      if (m2rows.length) w2b = true;
      if ((m1 || m2rows.length || m3) && first < 0) first = i;
    });
    for (const r of hitRows) c(intenMatched, r.intensity);
    const X = T[tier];
    if (W1 || W2 || W3) X.U++;
    if (first >= 0) { X.UB++; c(firstTypes, tensions[first].type); if (tensions[first].type === 'crime_wave') X.firstCrime++; }
    if (w2b) X.W2cB++;
    if (w1b) X.W1B++;
  }
  const tot = (k) => TIERS.reduce((a, t) => a + T[t][k], 0);
  console.log(`\n**Variant: ${{ all: 'every conflicts row', high: "a conflicts row only at intensity 'high'", w1matter: 'every conflicts row, plus the W1 matter test' }[variant]}**\n`);
  console.log(`| measure | ${TIERS.join(' | ')} | total |\n|---|${TIERS.map(() => '---:').join('|')}|---:|`);
  for (const [k, l] of [['U', 'UNION W1∪W2c∪W3c'], ['UB', 'UNION ∧ (b)'], ['W2cB', 'W2c ∧ b(W2c)'], ['W1B', 'W1 ∧ b(W1)'], ['firstCrime', 'passing towns whose first-opened tension is crime_wave']])
    console.log(`| ${l} | ${TIERS.map((t) => T[t][k]).join(' | ')} | ${tot(k)} |`);
  if (variant === 'all') console.log(`\nConflicts rows' intensity on the pool: ${JSON.stringify(inten)}; rows matched by a (b) side: ${JSON.stringify(intenMatched)}.`);
  else if (variant === 'w1matter') console.log(`\nTensions newly matching W1 by the matter test (not by a side): ${JSON.stringify(Object.entries(newW1).sort((a, b) => b[1] - a[1]))}.`);
  else console.log(`\nRows counted (high) matched by a (b) side: ${JSON.stringify(intenMatched)}.`);
  console.log(`First-opened tension types of the passing towns: ${JSON.stringify(Object.entries(firstTypes).sort((a, b) => b[1] - a[1]))}.`);
}
```
