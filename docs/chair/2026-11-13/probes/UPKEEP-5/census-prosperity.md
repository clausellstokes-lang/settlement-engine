# Census: how the prosperity label is made (read-only)

Tree: `scratchpad/lane`. Call site: `src/generators/economy/economicState.js:823-832`.
`computeBaseProsperity` = `src/generators/economy/prosperity.js:230-346`; `deriveProsperityLabel` = `prosperity.js:176-227`.
Both run inside `generateEconomicState`, first in `generateEconomy` (provisional, `steps/generateEconomy.js:365`) and again in
`economyReconcilePass` (via `computeEconomyState`, on the post-faction roster). File paths below are under `src/`.

Abbreviations: P = `generators/economy/prosperity.js`; ES = `generators/economy/economicState.js`;
FG = `generators/foodGenerator.js`; PH = `generators/priorityHelpers.js`.
`idx` is the running index: 0 Struggling/Subsistence, 1 Poor, 2 Moderate, 3 Comfortable, 4 Prosperous, 5 Wealthy.

## A. computeBaseProsperity (P:230-346): a sum of terms, rounded, then capped

| # | Term (values) | file:line | CLASS | SOURCE (fact -> home) | KIND |
|---|---|---|---|---|---|
| 1 | **Route base**: crossroads/port 3; road/river/mountain_pass/other connected 2; disconnected + thorp/hamlet 0; disconnected + teleport infra + magic on 2; disconnected otherwise 1 | P:238-247 | CONTRIBUTION (trade route) | `tradeRoute` arg (ctx.tradeRoute); `hasTeleportationInfra` (PH:199: roster names, `config._magicTradeOnly`, `config.magicExists`); `isTradeRouteDisconnected` (domain/tradeRouteSemantics.js:118) | DERIVED |
| 2 | **Tier bonus**: thorp/hamlet/village 0, town/city 1, metropolis 2 | P:250 | CONTRIBUTION (size, "division of labour"; not one of the owner's four named kinds) | `tier` (ctx.tier) | DERIVED |
| 3 | **Economy slider**: (priorityEconomy − 50)/40, from −1.25 to +1.25 (default 50) | P:253-254 | SET (the economy dial, raw) | `config.priorityEconomy` (the browser dial; rolled upstream in random mode) | DERIVED |
| 4 | **Magic bonus**: if magicExists and priorityMagic > 25: (pm−25)/75 × {village .3, town .6, city 1.0, metro 1.4}; 0..1.4. Default priorityMagic **0** here vs **50** in `getPriorities` (PH:22) | P:257-260 | SET (magic dial × tier; no magic institution is read) | `config.priorityMagic`, `config.magicExists`, tier | DERIVED |
| 5 | **Threat penalty**: plagued −1, frontier −0.5 (**also the default when unset**), heartland 0 | P:263-264 | PENALTY on the whole (monster threat, a dial, not a stress) | `config.monsterThreat` | DERIVED |
| 6 | **_milDrain**: priorityMilitary > 75 → −0.3. Reads **only the military slider**: no walls, no garrison | P:267-268 | PENALTY on the whole (slider threshold, no crisis) | `config.priorityMilitary` | DERIVED |
| 7 | **_defPremium**: +0.3 if roster has a wall (`/wall\|palisade\|citadel/i`) AND a garrison (`/garrison\|barracks/i`) AND route crossroads/port | P:269-275 | CONTRIBUTION (security on a trade route) | `settlement.institutions` through `institutionMatchesRegex` (domain/institutionClassify.js:88: catalogId set, or name regex). Its own regex, **not** `defenseFactsOf` and **not** the defence profile (e.g. "earthwork" counts as walls in defenseFacts but not here) | DERIVED |
| 8 | **Institutional depth**: count of non-custom Economy+Crafts rows vs a tier expectation {thorp 3, hamlet 8, village 13, town 22, city 13, metro 14; default 8}: ≥1.3× → +1, ≥0.75× → 0, else −1 (note town 22 > city 13) | P:285-291 | CONTRIBUTION (institution count) | `institutions[].category` (the roster) | DERIVED |
| 9 | **Income diversity**: number of income rows ≥7 → +0.5, ≥5 → +0.25, else 0. **Only the count is read**, not the percentages | P:294-295 | CONTRIBUTION (income sources, counted) | `incomeNormalized.length` = `incomeBuild.length` (ES:68-375, normalized ES:542-559; nothing later adds or removes rows, ES:698 changes only one row's text). See §C | DERIVED |
| 10 | **Combine**: `Math.min(4, Math.max(0, Math.round(1+2+…+9)))`: Prosperous is the most this stage can give | P:298-314 | CAP/FLOOR on the whole (0..4) | — | WEIGHT |
| 11a | **Food: famine cap** `{cap,0}` → min(idx,0) | P:316-317; FG:498-500 | CAP (famine) | `stressTypes` includes famine (FG:73) → `foodSecurity.prosperityMod` (FG.js::generateFoodSecurity → `foodProsperityModOf` FG:497) | DERIVED |
| 11b | **Food: deficit cap**: deficitPct > 40 → cap 1 (or cap 2 if magic-mitigated); 15 < deficitPct ≤ 40 → cap 1 | P:317; FG:501-511 | CAP (food deficit) | `foodSecurity.deficitPct` (FG:322) and `hasMagicTradeImport` (FG:254); cut points `FOOD_SECURITY_CUTS` (data/bandLadders.js:58: 40/15/5/40) | DERIVED (deficitPct includes the crop-fortune draw, FG:232) |
| 11c | **Food: penalty −1**: terrain-structural (mountain/desert/hills connected) deficit > 40; magic-mitigated 15–40; any 5 < deficitPct ≤ 15 | P:318; FG:503,509,513-515 | PENALTY on the whole (food pressure) | as 11b + `config.terrainType`, `effectiveRoute` | DERIVED |
| 11d | **Food: bonus**: surplusPct > 40 AND ≥3 food chains AND a granary → value 0.4, applied as `Math.round(0.4)` = **0**. **This term never has an effect.** | P:319; FG:516-518 | CONTRIBUTION (what the land gives), but its value is always 0 | `surplusPct` (FG:323), `activeChainsCount` (FG:113-121, from `foodLandOf` sources), granary flags | DERIVED |
| 12 | **Required-economy floor**: any tier, roster matches `/subsistence farming\|access to external mill\|farmland\|town granary\|weekly market\|city granari\|market square\|district markets\|state granary\|inns and taverns \(district\)/i`, AND `config.stressTypes` is empty → max(idx,1) (ignores the singular `config.stressType`) | P:324-336 | FLOOR (Poor) | roster + `config.stressTypes` | DERIVED |
| 13 | **Subsistence override**: disconnected route + thorp/hamlet → the label becomes `'Subsistence'` whatever idx was; the sum is thrown away | P:338-344 | CAP (replaces the whole; the label stage then draws a value, #15) | `tradeRoute`, `tier` | DERIVED |

The function also returns `foodSecurity`, but the caller keeps only `label`. `_instNames` is passed in and never used.

## B. deriveProsperityLabel (P:176-227): steps applied to the label

| # | Term (values) | file:line | CLASS | SOURCE | KIND |
|---|---|---|---|---|---|
| 14 | Label → idx {Subsistence 0, Poor 1, Moderate 2, Comfortable 3, Prosperous 4, Wealthy 5}; an unknown label → 2 | P:181-182 | (carry-over, not counted) | #13 output | — |
| 15 | **Subsistence draw**: `_rng()<0.4 ? 0 : _rng()<0.5 ? 1 : 2`, then `min(1,…)` → 40% Struggling, 60% Poor (the code comment says "30% luckier", but the clamp makes those Poor too) | P:184-187 | CAP (at Poor), with the value DRAWN | main RNG stream (`kernel/rngContext.js::random`) | DRAWN |
| 16 | **Economy output step**: economyOutput ≥70 → +1 (max 5); <15 → −1. **The only way to reach Wealthy.** | P:190-192 | SET (the economy dial, adjusted by `getInstFlags`) | `getInstFlags(config,institutions).economyOutput` (PH:286, 401-418) = clamp(priorityEconomy × crime degrade × magic boost (priorityMagic) × market ×1/0.75 (`hasMarketInstitution`) × **stress multiplier** (siege .45, famine .6, occupied .7, plague .75, indebted/fractured .85, insurgency/wartime .88, migration .9, conversion .92, slave revolt .72) × neighbour multiplier (`config.neighborRelationship`)) | DERIVED |
| 17 | **Isolated small cap**: thorp/hamlet + disconnected → min(idx,1) | P:198-204 | CAP (Poor) | `config.tier\|\|config.settType`, `config.tradeRouteAccess` (config values, not the `tier`/`tradeRoute` args that #1 and #13 use) | DERIVED |
| 18 | **Connected small floor**: thorp/hamlet + major/standard/seasonal route → max(idx,1) | P:202-205 | FLOOR (Poor) | same | DERIVED |
| 19 | **Crime**: criminalEffective ≥65 → −1 | P:207 | PENALTY (crime) | `getInstFlags().criminalEffective` (PH:356-371) = max(2, clamp(priorityCriminal × military/economy/religion slider modifiers × (criminal institution ? 1 : .55) × crime stress multiplier)) | DERIVED |
| 20 | under_siege → min(idx,0) | P:210 | CAP (siege) | `config.stressTypes \|\| [config.stressType]` (resolveStress step) | DERIVED |
| 21 | famine → min(idx,0) | P:211 | CAP (famine) | same | DERIVED |
| 22 | occupied → min(idx,1) | P:212 | CAP (occupation) | same | DERIVED |
| 23–32 | −1 each for: indebted, politically_fractured, plague_onset, recently_betrayed, monster_pressure, insurgency, wartime, mass_migration, religious_conversion, slave_revolt (succession_void and infiltrated have no row) | P:213-225 | PENALTY ×10 (one per crisis named) | same | DERIVED |
| 33 | Final `LABELS[min(5,max(0,idx))]` | P:226 | CAP/FLOOR (0..5) | — | WEIGHT |

## C. How `incomeNormalized` is built (it reaches prosperity only through its length, #9)
Rows are pushed into `incomeBuild` in ES:69-375. Each push is gated on a town fact:
- tier: Agricultural Rents ES:69-80
- route and market: Market Taxes / Magical Trade Revenue ES:94-110
- guilds: ES:119-130
- port/river: Port Duties ES:141, River Tolls ES:150
- bank: ES:159-170
- Property Rents (tier) ES:173
- Court Fees: `defenseFactsOf().hasCourthouse` ES:182-189
- Toll Revenue (crossroads) ES:192, Gate Tolls (`defenceHome.hasTollGate`) ES:198
- Military Levy/Extraction: roster garrison AND military > 55 ES:207-219
- church/pilgrims ES:236-250, magic ES:278-317
- trade bonuses: Entrepôt, International Commerce (economy/tradeGoods.js:139-156)
- Security Contracts (`merchantArmy` stress flag) ES:330
- a **criminal row** when `safetyProfile.blackMarketCapture` > 10 (ES:337-367; safetyProfile.js:671-690, which rises with siege +20, famine +15, insurgency +18, slave revolt +22 …)
- commodity rows (grain, wool, iron, timber, fish, stone, toggled goods ES:376-540), gated on `tradeStreams.exports`/`localProduction`.

Normalization (ES:542-559) rescales the percentages by `priorityToMultiplier(economyOutput)` and does not change the count.
Two things follow:
- **Crises add income rows.** A crisis can push a criminal row, which raises the diversity bonus (#9).
- **The export draws upstream change the row count.** `getGoodsModifiers` (tradeGoods.js:189) draws `_rng() < spec.p`.

## D. Answers

**(a) Random draws.**
- Inside the prosperity code there is one site: P:185, the Subsistence branch.
  - It makes one `_rng()` call, plus a second only when the first is ≥ 0.4.
  - Both come from the **main** stream.
  - They decide Struggling (40%) vs Poor (60%) for a disconnected thorp/hamlet.
- Upstream draws that change prosperity's inputs:
  - FG:231-232 crop fortune: ±8% on production, on a fork `food.cropFortune`. It moves deficitPct/surplusPct, so #11a-d.
  - tradeGoods.js:189 export draws: they move the income row count, so #9.

**(b) Rounding and clamps.**
- P:298-314: `Math.round` of the sum, then `min(4, max(0, …))` (0..4).
- P:317: food cap `min(idx, value)`.
- P:318: food penalty `max(0, idx−1)`.
- P:319: `min(4, idx + Math.round(0.4))`. The bonus rounds to 0.
- P:335: `max(idx, 1)`.
- P:186: `max(0, min(1, idx))`.
- P:191 `min(5, idx+1)`; P:192 `max(0, idx−1)`.
- P:204 `max(0, min(idx,1))`; P:205 `max(1, idx)`.
- P:207, 213-225: `max(0, idx−1)`.
- P:210-212: `max(0, min(idx, 0|0|1))`.
- P:226: final `min(5, max(0, idx))`.
- Inside the inputs:
  - `clamp` 0..100 on economyOutput and criminalEffective; criminalEffective also has a floor of 2 (PH:364, 412).
  - deficitPct is a ratio of rounded pounds (FG:322).

Index bounds:
- **0..4** after the base stage.
- **0..5** only through #16 in the label stage.
- Subsistence is held at **0..1**.

**(c) Defence.**
- No. Prosperity reads nothing from `defenseGenerator.js` or `settlement.defenseProfile`.
- The defence profile is built **after** prosperity and from it: `steps/assembleSettlement.js:233`, `generateDefenseProfile(settlement, keepOf(economicState.prosperity))`. `domain/facts/keep.js:12-15` states "Nothing feeds back".
- What prosperity does read that is defence-shaped:
  - `_milDrain`: `config.priorityMilitary` > 75 only (the slider).
  - `_defPremium`: name/catalog regex over the **roster**, both a wall/palisade/citadel row and a garrison/barracks row, gated on the route.
  - Through #9 only, the income row count reads:
    - `defenseFactsOf` (`domain/defense/defenseFacts.js`, pure over the live roster) for Court Fees and Gate Tolls;
    - roster garrison + military dial for Military Levy;
    - `generateSafetyProfile` (computed inside `generateEconomicState`, before prosperity) for the criminal row.
- `getInstFlags` takes some flags from `defenseFactsOf`: gates, prison, court, mercenary, hospital. economyOutput and criminalEffective read none of them; they read `hasMarket` and `hasCriminalInst` only.

**(d) Main readers of the label.**
- ES:834 `keptGuardLine` (safety guard line).
- ES:840 `boughtShare('stores', keepOf(prosperity))` (food stores).
- ES:850 `deriveEconomicSituationDesc` (the trade line).
- `economyReconcilePass.js:203` (upkeep roll).
- `assembleSettlement.js:233` (defence profile via `keepOf`).
- `domain/facts/keep.js` (upkeep for service roll, magic profile).
- `domain/prosperityRank.js` (rank for coherence and prose).
- Other readers: neighbourGenerator, historyGenerator, npcGenerator, factionDynamics, density/densityRoll, generationCoherence, power/rulingStructure, narrative/arrivalScene, the stateProse displays.

## E. Where one crisis acts more than once (relevant to "a crisis acts once")
- **famine** acts four times:
  - econOut ×0.60 (→ #16);
  - food production cut → the food cap at 0 (#11a);
  - the label cap at 0 (#21);
  - blackMarketCapture +15 → possibly +1 income row (#9, the upward direction).
- **siege** acts in econOut ×0.45, the label cap (#20), and food (route forced isolated, production cut).
- **occupied, plague_onset, indebted, politically_fractured, insurgency, wartime, mass_migration, religious_conversion, slave_revolt** each act twice: through econOut and through the −1/cap in #22-32. Most also act on crime multipliers (#19) and food production (#11).
- **monster threat** acts through the dial (#5, default −0.5) and separately as the `monster_pressure` stress (#30).
- **The economy dial** is read raw (#3) and again through economyOutput (#16). **The magic dial** is read in #4 and in economyOutput.

## Counts (rows 1-13, 15-33, with 23-32 counted individually = 35 terms)
- CLASS:
  - CONTRIBUTION 6 (#1, 2, 7, 8, 9, 11d; 11d always 0);
  - MULTIPLIER 0 (the multipliers live inside economyOutput/criminalEffective);
  - CAP/FLOOR 12 (#10, 11a, 11b, 12, 13, 15, 17, 18, 20, 21, 22, 33);
  - PENALTY 14 (#5, 6, 11c, 19, 23-32);
  - SET 3 (#3, 4, 16).
- KIND: DERIVED 32, DRAWN 1 (#15), WEIGHT 2 (#10, 33), STORED-ONLY 0. Every DERIVED term's size is a constant weight; `prosperityMod` is a prosperity-shaped object, also echoed by `domain/display/stateProse/economyStateProse.js:695`.
