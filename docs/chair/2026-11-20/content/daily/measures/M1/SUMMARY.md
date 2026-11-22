# DAILY-1 · M1 — the measure of the eight Daily Life slots (SUMMARY)

Written 2026-11-20 18:07 UTC from `m1.out.txt` (`node docs/chair/2026-11-20/content/daily/measures/M1/measure.m1.mjs`, exit 0, 199 s). 900 births: 150 a size, seeds `hxd-<size>-0..149`, PAGE-9's THIN recipe copied. Slots: `deriveDailyLife(record)` on the born record (what `regenerationDelta.js` reads). Each branch is mirrored from `dailyLife.js` over the same derivers; the mirror agrees with the printed text on all 900 (`MIRROR mismatches: 0`). Columns: thorp / hamlet / village / town / city / metropolis. EXECUTED = the run measured it; READ = code read only.

## 1. BRANCHES (share of 150, %; `top` = the slot's top single text share; `n` = distinct texts)
| slot (branch codes; never taken) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| dawn_work (W defense-critical, F food-critical, M merchant-power>=30, B default bakers; never: craft-power>=25, merchant>=30+siege) | W94 F6 · top 94 · n2 | W81 B13 F5 M2 · top 81 · n4 | W81 B14 M3 F1 · top 81 · n4 | W42 B37 M18 F3 · top 42 · n4 | B77 F12 M11 · top 77 · n3 | B80 F19 M1 · top 80 · n3 |
| gathering_places (R named religious, T named trade, I named inn/hall, X fallback well/bridge/square; additive R/T/I) | X81 R19 · top 81 · n2 | X65 I21 R17 T6 · top 65 · n10 | X53 T31 I25 R7 · top 53 · n14 | T100 I100 R21 · top 45 · n4 | T100 I100 R17 · top 70 · n4 | T100 I100 R97 · top 96 · n3 |
| child_warnings (U unrest, E economic_collapse, P monster_pressure, L plague, S siege, A famine, X no threat; never: bandit_raids, rival_neighbor, corruption, arcane_instability, cult, label default) | U100 E85 P66 L3 S1 A1 · top 36 · n15 | U99 E89 P59 L5 A2 · top 32 · n17 | U99 E76 P60 L5 · top 29 · n17 | U91 P67 E3 L3 X1 · top 35 · n11 | P67 X29 U7 L2 S1 · top 61 · n7 | P68 X27 U7 S3 L1 · top 63 · n7 |
| food_culture (Ss surplus+stable chain, S surplus, A adequate, Rd/R strained ±disrupted chain, Cd/C critical ±disrupted, X collapsed; never: surplus+famine/siege) | A65 Ss20 Rd6 R3 Cd3 C3 · top 65 · n9 | A46 Ss31 Rd14 Cd4 S2 R2 C1 · top 46 · n17 | A45 Ss39 S7 Rd5 R2 Cd1 · top 45 · n14 | A51 Rd25 Ss13 R8 Cd3 · top 51 · n24 | Rd35 A33 R13 Cd12 Ss8 · top 33 · n29 | Rd49 A28 Cd19 R2 Ss1 X1 · top 28 · n21 |
| commoner_resentments (G legitimacy-strained+, Fd food-strained+, K crim>=55, K7 crim>=70, X fallback "any town"; additive; never: corruption_exposed) | G80 X20 Fd15 K7 · top 65 · n5 | G91 Fd21 X8 K7 · top 69 · n6 | G91 Fd8 X8 K2 · top 83 · n6 | G46 Fd36 X35 K7 (≥70: 1) · top 35 · n8 | Fd59 X34 K17 G15 · top 43 · n8 | Fd71 X25 K17 G13 · top 55 · n8 |
| outsider_impressions (D dominant power, T top threat > low, C >=3 strained capacities; additive; never: fallback "ordinary") | D100 T100 C99 · top 43 · n16 | D100 T100 C97 · top 38 · n23 | D100 T100 C100 · top 44 · n17 | D100 T95 C99 · top 13 · n33 | D100 T69 C36 · top 9 · n48 | D100 T69 C19 · top 11 · n42 |
| unspoken_topics (W unresolvedWound; never: hidden/rumored threat, corruption_exposed, fallback) | W100 · top 100 · n1 | W100 · top 100 · n1 | W100 · top 100 · n1 | W100 · top 100 · n1 | W100 · top 100 · n1 | W100 · top 100 · n1 |
| recent_changes (H recentDisruption, N new condition <2 ticks, A acute threat, X fallback; additive) | A98 H63 N35 · top 17 · n108 | A99 H81 N34 · top 8 · n131 | A99 H81 N31 X1 · top 5 · n135 | H79 N29 A29 X14 · top 14 · n126 | H66 N27 A24 X19 · top 19 · n109 | H73 N32 A17 X16 · top 16 · n119 |

Top texts: dawn_work "The walls claim the first hours…" (thorp→town), "Bakers light their ovens first…" (city, metropolis); gathering_places "People gather where they can: the well, the bridge, the open square." (thorp→village); food_culture "Hearty grain bread… the wealthier streets." (every size); commoner_resentments "…the council's indifference…" (thorp→village); unspoken_topics `Locals will not openly discuss the matter referenced as "the wound".` on 900/900; recent_changes "Civic stability at risk has come to a head." is top at thorp (25/150).

## 2. FALSE LINES (places of 150 printing the clause while the record test says false; one example id)
| slot:branch "clause" — record test (home) | thorp | hamlet | village | town | city | metropolis | e.g. |
|---|---:|---:|---:|---:|---:|---:|---|
| dawn_work:W "The walls claim" — `defenceOf(r).walls` false | 103 | 106 | 114 | 42 | 0 | 0 | hxd-thorp-0 |
| dawn_work:W "the watch musters" — `factsOf(r).guardPresence` false | 112 | 105 | 112 | 0 | 0 | 0 | hxd-thorp-0 |
| dawn_work:F "the granary queue" — `hasInstitution(r,'granary')` false | 9 | 7 | 2 | 0 | 0 | 0 | hxd-thorp-7 |
| dawn_work:M "queue at the warehouses" — no live row /warehouse\|storehouse/ (no home) | 0 | 3 | 5 | 21 | 0 | 0 | hxd-hamlet-0 |
| dawn_work:B "Bakers light their ovens" — no live row /baker(y)\|bakehouse/ (no home) | 0 | 19 | 21 | 28 | 17 | 9 | hxd-hamlet-7 |
| dawn_work:B "then the smiths" — `hasInstitution(r,'smith')` false | 0 | 15 | 13 | 28 | 12 | 3 | hxd-hamlet-7 |
| dawn_work:B "the watch changes" — `guardPresence` false | 0 | 2 | 3 | 0 | 0 | 0 | hxd-hamlet-74 |
| dawn_work:B "as the gates open" — `defenceOf(r).gate` false | 0 | 19 | 21 | 7 | 0 | 0 | hxd-hamlet-7 |
| gathering_places:X "the bridge" — no live row or quarter landmark /bridge/ (no home) | 122 | 97 | 71 | 0 | 0 | 0 | hxd-thorp-0 |
| gathering_places:X "the open square" — no live row, quarter or landmark /square\|plaza\|green/ (no home) | 122 | 97 | 80 | 0 | 0 | 0 | hxd-thorp-0 |
| child_warnings:E "the trade quarter" — no quarter named /market\|trade\|merchant\|bazaar\|commerc/ (`spatialLayout.quarters`) | 128 | 133 | 102 | 0 | 0 | 0 | hxd-thorp-0 |
| child_warnings:E "the trade quarter" — no quarters at all | 13 | 0 | 0 | 0 | 0 | 0 | hxd-thorp-6 |
| child_warnings:E "the empty stalls" — `marketOf(r)` false | 128 | 128 | 93 | 0 | 0 | 0 | hxd-thorp-0 |
| child_warnings:L "the sick-house" — `defenceOf(r).hospital`/`.healer` false | 5 | 8 | 7 | 2 | 0 | 0 | hxd-thorp-17 |
| child_warnings:S "when the bells ring" — `factsOf(r).sacredHouse` false (nearest for a bell) | 1 | 0 | 0 | 0 | 0 | 0 | hxd-thorp-103 |
| child_warnings:X "the woods at twilight" — `factsOf(r).timberAtHand` false (nearest; no woodland home) | 0 | 0 | 0 | 2 | 26 | 25 | hxd-town-21 |
| food_culture:Ss "markets close their stalls" — `marketOf(r)` false | 30 | 44 | 37 | 0 | 0 | 0 | hxd-thorp-5 |
| food_culture:A "the wealthier streets" — `record.tier` thorp or hamlet | 98 | 69 | 0 | 0 | 0 | 0 | hxd-thorp-0 |
| commoner_resentments:Fd "merchants who claim" — `marketOf(r)` false | 22 | 28 | 10 | 0 | 0 | 0 | hxd-thorp-7 |
| commoner_resentments:G "the council's indifference" — `rulingBodyOf(r) !== true` | 10 | 46 | 39 | 34 | 3 | 5 | hxd-thorp-52 |
| commoner_resentments:X "of any town" — `factsOf(r).populationBand === 'small'` | 30 | 12 | 7 | 4 | 0 | 0 | hxd-thorp-0 |
| commoner_resentments:X "the gate fee" — `defenceOf(r).gate` false | 30 | 12 | 12 | 18 | 0 | 0 | hxd-thorp-0 |
| commoner_resentments:X "market day" — `marketOf(r)` false | 30 | 10 | 4 | 0 | 0 | 0 | hxd-thorp-0 |
| commoner_resentments:X "the council's favorite" — `rulingBodyOf(r) !== true` | 5 | 2 | 3 | 24 | 8 | 10 | hxd-thorp-78 |
| commoner_resentments:X "favorite tavern" — `hasInstitution(r,'tavern')` false | 30 | 2 | 6 | 0 | 0 | 0 | hxd-thorp-0 |
| ANY false clause, by slot (dawn / gathering / child / food / commoner; outsider, unspoken, recent = 0) | 130/122/128/128/61 | 136/97/133/113/76 | 144/80/111/37/58 | 108/0/4/0/70 | 27/0/26/0/11 | 12/0/25/0/15 | |

Tested and 0 at every size: "the well" / "the deep well" (a "Water source" or well row stands on 900/900: the nearest record, names and landmarks); a named gathering house not live or access-only; "Smithy fires", "guild-callers", "Merchant caravans roll" (no merchant place is isolated), "linger at the gates", "the neighbour", "officials" (`appointedPost`), "temple kitchens", "caravans that never arrived", "the watch turning a blind eye", "officials who keep their posts", "Quiet streets", "predictable bells", "market stalls" (most of these branches are taken by 0–1 places).
UNTESTABLE (no record answers): "before the ovens are warm" (household hearths); "the bell", "porters" (no record); "the strangers' road", "the road past sundown" (no home answers a road); "crowds", "masked strangers", "shimmering air", "bread is short" (the threat is the fact); "smugglers … honest carts queue" (a crime score; no carts or tax record); "missing watch, slow service, or shuttered shops" (says what is absent); "mark is on every door that matters" (a power's reach); "the wound" and every recent_changes clause (the beat's own text, a condition's or a threat's label; "has come to a head" fits both the imminent and the realized stage).

## 3. FACT REACH (share of 150, %). H = a hideable house can satisfy it (`cardVeil.js :: isHideableHouse`); C = about crime
| fact (home) | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| walls / watch / guard force / gates (`defenceOf`, `factsOf.guardPresence`) | 27/0/21/0 | 25/0/26/0 | 18/3/21/0 | 63/100/100/63 | 100/100/100/100 | 100/100/100/100 |
| sacred house (`hasInstitution temple` = `factsOf.sacredHouse`) / dailyLife's RELIGIOUS pattern | 19/19 | 17/17 | 100/7 | 100/21 | 100/17 | 100/97 |
| market (`marketOf`) / kinds: any "market" row, market square, fish, fair, trading house | 0 / 0,0,0,0,0 | 6 / 6,0,0,0,0 | 31 / 31,0,17,0,0 | 100 / 100,100,44,36,82 | 100 / 100,100,90,81,97 | 100 / 100,100,100,97,100 |
| dailyLife TRADE pattern (H: "Black market", "Black market bazaar", "Whisper market" match it) / INN pattern | 0/0 | 6/21 | 31/25 | 100/100 | 100/100 | 100/100 |
| inn-tavern (`hasInstitution tavern`) / guild (`factsOf.guild`; a hideable "Thieves' guild" may stand beside) | 0/0 | 31/3 | 31/25 | 100/100 | 100/100 | 100/100 |
| well or water source / navigable water (`waterOf`) / mill / bridge / square (names, quarters, landmarks: no home) | 100/37/0/0/0 | 100/34/0/0/0 | 100/46/100/15/0 | 100/36/100/78/100 | 100/47/100/99/100 | 100/43/100/100/100 |
| bakery (names, no home) / smithy / granary / hospital-or-healer / warehouse (names) | 0/0/0/0/0 | 0/17/0/0/0 | 0/27/0/2/0 | 39/41/100/33/44 | 84/89/100/71/100 | 92/97/100/99/100 |
| quarters (`spatialLayout.quarters`) / trade-kind quarter | 90/0 | 100/0 | 100/10 | 100/100 | 100/98 | 100/100 |
| food source (`factsOf.foodSources`): fish/game/grain/livestock/mill | 35/15/16/11/0 | 30/19/11/13/0 | 38/18/13/18/5 | 23/0/25/23/4 | 43/0/26/21/9 | 43/0/14/11/9 |
| imports listed (`factsOf.imports`) / trade route isolated (`tradeRouteOf`) | 55/14 | 82/18 | 99/11 | 100/0 | 100/0 | 100/0 |
| food band (`capacity.food_production`): surplus/adequate/strained/critical/collapsed | 20/65/9/6/0 | 33/46/16/5/0 | 47/45/7/1/0 | 13/51/33/3/0 | 8/33/47/12/0 | 1/28/51/19/1 |
| prosperity (`factsOf.prosperity`): prosperous/comfortable/moderate/poor/struggling | 3/21/31/27/17 | 0/9/29/41/22 | 1/9/24/48/19 | 25/37/28/9/1 | 78/19/2/1/1 | 77/19/1/0/3 |
| ruler kind (`rulerKindOf`) elder/lord/mayor/council · body of >1 (`rulingBodyOf`) · `appointedPost` | 90/10/0/0 · 90 · 76 | 87/13/0/0 · 68 · 100 | 79/7/14/0 · 71 · 100 | 0/9/37/53 · 53 · 100 | 0/15/0/85 · 85 · 100 | 0/23/0/77 · 77 · 100 |
| threats (`deriveAllThreatProfiles`) unrest/econ-collapse/monster/plague/famine/siege/none; visibility hidden-or-rumored | 100/85/69/3/7/3/0; 0 | 100/90/64/5/5/1/0; 0 | 100/77/63/5/1/1/0; 0 | 91/3/67/3/1/0/1; 0 | 7/0/67/2/0/1/29; 0 | 7/0/68/1/0/3/27; 0 |
| `history.recentDisruption` / `history.unresolvedWound` (`deriveHistoryBeats`) | 63/100 | 81/100 | 81/100 | 79/100 | 66/100 | 73/100 |
| legitimacy (`deriveCausalState().bands.public_legitimacy`) surplus/adequate/strained/critical/collapsed | 0/20/44/17/19 | 0/9/51/20/20 | 0/9/59/7/25 | 0/54/31/10/5 | 29/55/14/1/1 | 65/22/10/0/3 |
| C: corruption_exposed / criminal_opportunity ≥55 / ≥70 / a crime structure (`factsOf.crime`) | 0/7/0/10 | 0/7/0/15 | 0/2/0/8 | 0/8/1/69 | 0/17/0/99 | 0/17/0/100 |

## 4. WHO READS THE SLOTS TODAY (grep, EXECUTED at run time; roles READ)
- `src/domain/regenerationDelta.js :: deriveRegenerationDelta` (L209) — DIFF (`compareDailyLife`); the delta is kept in the in-memory store (`settlementRegenAction.js:259`, `lastRegenerationDelta`) and PRINTED by `components/primitives/RegenerationDeltaCard.jsx` (L181-185) and counted by `components/settlement/VersionDiffView.jsx` (L145, L160). The card's row reads `d.slot` / `d.summary`, keys a `DailyLifeDelta` lacks (it has `key`, `label`, `before`, `after`): READ, not rendered, so PLAUSIBLE that it prints the count and empty rows.
- `src/domain/counterfactual.js :: counterfactual` (L207, L240, L254) — DIFF; no caller in `src/`.
- `src/domain/causalViews.js :: viewNarrative` (L59, via `deriveCausalView`) — returns slots + summary; no caller in `src/`.
- `src/domain/aiGrounding.js :: buildAiGroundingPayload` (L456) — puts `dailyLife` in the payload; bundled into `supabase/functions/_shared/aiGroundingBundle.js`; its one caller `supabase/functions/generate-narrative/prompts.ts :: augmentSummaryWithGrounding` (L304) reads only `payload.constraints.lockedEntities` and `payload.userEdits`: derived, NOT sent to the model.
- `src/lib/ai.js` sends the record (`body = { type, settlement, … }`), never a slot; `src/lib/structuralFingerprint.js` hashes only `has_daily_life: !!ai.aiDailyLife` (the AI result) and copies no prose; `src/generators/steps/assembleSettlement.js` writes no `dailyLife` (L153 names `dailyLifeLogic`); `src/components/` call none of the four (the Daily Life tab prints `dailyLifeLogic.js` + `aiDailyLife`). `deriveDailyLifeSlot`, `summarizeDailyLife`: no caller.
- STORED AT BIRTH: NO — 0/900 born records carry a `dailyLife` field (EXECUTED); derived at read only. (`publicSafe.js` L61 still lists `'dailyLife'` on `PUBLIC_TOPLEVEL_KEYS`.)
- What moves if a slot's text moves: `tests/lint/presumptionClasses.register.json` (text + hash rows under `"src/domain/dailyLife.js"`, L885-895) and `tests/lint/presumedThings.widened.register.json` (L11647+); `tests/domain/dailyLife.test.js` regex pins (e.g. L113 `/(forager|granary queue|search for food)/`, L126 `/(walls|watch musters|rounds)/`); the edge bundle's `Source hash: 75588c2bee4c0f74` (`tests/edgeFunctions/aiGroundingBundle.freshness.test.js`) moves on any `dailyLife.js` edit.

## 5. THE KEY (name + slot)
- (a) There is no `src/domain/veil/`; the share projection is `src/domain/display/publicSafe.js :: toPublicSafe`. Name kept: L63 `'institutions', 'interSettlementRelationships', 'name', 'neighborRelationship', 'neighbourNetwork',` (on `PUBLIC_TOPLEVEL_KEYS`, copied by L621 `for (const key of PUBLIC_TOPLEVEL_KEYS) {`, so a key off the list, `_seed`, is dropped); full mode L542 `delete clone._seed;`. EXECUTED: name kept 900/900, `_seed` gone 900/900 (default) and 900/900 (full).
- (b) No caller runs `deriveDailyLife` on a shared read's document (section 4: the owner's store record, or the request's record at the edge). EXECUTED what-if: on `toPublicSafe(record)` all 8 texts equal the owner's on 900/900.
- (c) No slot needs a person's id: no deriver reads `ctx.npcs`; slot references of type `npc`: 0/900. The name + slot key HOLDS for all eight slots.

## 6. THE PEOPLE
- Slot text depending on `ctx.npcs`: none. Its one use is `dailyLife.js:541 npcs: deriveAllNpcProfiles(settlement),` (built, read by no deriver).
- `src/domain/npcProfile.js :: deriveAllNpcProfiles` (L648) → `deriveNpcProfile` (L564) reads `npc.secret` (L623 `const secretStakes = firstNonEmpty(npc.secret?.stakes);`), `npc.plotHooks` (L631), `npc.goal`, `compromiseLifecycle`, `timesExposed`, `ousted`, `influence`, `power`, `structuralRank`, `role`, `category`, `name`, `id`.
- A parity arm would pin: for every place, the 8 texts of `deriveDailyLife(record)` equal those with every NPC's `secret`, `plotHooks`, `goal` removed (and with `npcs: []`), and that `buildContext` no longer calls `deriveAllNpcProfiles`. (The what-if in 5(b) strips those fields and moves no text, 900/900: evidence, not the arm.)

## 7. THE HIDEABLE READS TODAY (lines READ; counts EXECUTED, places of 150)
- `dailyLife.js:340 const crimScore = causalState.scores.criminal_opportunity ?? 50;` (crime) → commoner_resentments: 10 / 11 / 3 / 12 / 25 / 25, e.g. hxd-thorp-18.
- `:363` and `:435 const corruption = ctx.conditions.find(c => c.archetype === 'corruption_exposed');` (crime) → commoner, unspoken: 0 places.
- `:257 const TRADE_PATTERN = /(market|bazaar|forum|exchange|quay|wharf)/i;` / `:258 INN_PATTERN` over the WHOLE roster (not the live roster, no veil): TRADE matches the hideable "Black market", "Black market bazaar", "Whisper market"; picked first on 0 places (a legal market sorts before them — PLAUSIBLE luck of roster order).
- `:386 .sort((a, b) => (b.power || 0) - (a.power || 0))[0];` → outsider_impressions names a veiled power (`isVeiledPower`): 0/0/0/1/0/0, hxd-town-105.
- `:421 const hidden = ctx.threats.filter(t => t.visibility === 'hidden' || …)`, `:397`/`:477` (a threat label printed), `:319 case 'corruption'`, `:322 case 'cult'`: 0 places (no born threat is hidden or rumored; every threat is `open`).

## 8. THE COHERENCE BATTERY (added on DAILY-1's word)
`src/generators/recordBatteryFindings.js :: recordBatteryJudgment` (the receipt's `record_coherence_battery` judgment; `generationCoherenceReceipt.status` stays `coherent`) runs `domain/coherence/recordBattery.js :: recordBattery` over `recordTextSurfaces(record)`: every STORED string with a space, keys `_*`, `config`, `generationCoherenceReceipt`, `simulationTrace` skipped. It reads no derived text, and the slots are not stored, so no slot can be the cause.
| row | thorp | hamlet | village | town | city | metropolis |
|---|---:|---:|---:|---:|---:|---:|
| marked needs_review (of 150; 295/900 = 33%) | 65 | 99 | 38 | 83 | 5 | 5 |
| flagged BECAUSE OF any slot's text (quote in a slot and in no stored string), each of the 8 slots | 0 | 0 | 0 | 0 | 0 | 0 |
| a slot's text CONTAINS a flagged stored quote (recent_changes, the history beat's text; cause = the stored string) | 0 | 0 | 0 | 2 | 0 | 0 |
| finding rows: defense-words | 77 | 114 | 63 | 142 | 0 | 0 |
| finding rows: tier-noun ("town" for another size) | 8 | 13 | 8 | 0 | 8 | 13 |
- Causes (finding rows, 900 places): walls without walls/palisade/earthworks 222; soldiers without garrison or hired company 126; hospital without a hospital 28; garrison without a garrison 20; "town" for another size 50. Stored fields holding the quote: `institutions[].desc` 164, `culturalIdentity.builtForm` 52, `culturalNotes` 52, `history.founding.foundedBy` 47, `culturalIdentity.defensePattern` 38, `npcs[].physical.clothes` 33, `spatialLayout.layout` 19, others ≤13 (m1.out.txt). 12 finding rows quote across two joined strings (in no single stored string); the stored judgment's finding count equals a fresh recompute on 888/900.
- HYPOTHETICAL (the battery's word checks over each slot's own text, as if stored; findings quoting the slot): dawn_work 103/106/114/42/0/0 (walls; the same counts as table 2's walls test); food_culture 98/69/68/73/47/42 (food-words `source_not_held`: "grain bread"/"meat" where the record has no grain or livestock source — a false clause table 2 did not test); commoner_resentments 30/12/12/0/51/37 ("any town" for another size); recent_changes 0/0/0/2/0/0; the others 0.
