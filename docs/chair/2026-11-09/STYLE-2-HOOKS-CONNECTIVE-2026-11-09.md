# STYLE-2 · SW-4 HOOKS-FAITHWAR-CONNECTIVE — the lane's record (2026-11-09)

Seat: SW-4, a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`); this seat's session `session_01FbPLbf9hG6WievwZqTcasg`. Ruling A7 of the chair's STYLE-RULINGS-2 (A0, A9, A12 binding); the brief BRIEF-STYLE-2-WAVE §0 and §1 SW-4; the worklist STYLE-AUDIT-2-SOURCES §2.6, §2.8, §2.9, §2.10 and §1c rows 7, 8, 10; the owner's style law (WIRING-RULINGS-2026-11-07 §5–§8).

**Base:** `lane/integration-2026-11-07` at `a7bc2e4ce` (`5b267578c` is an ancestor). **Lane:** `lane/style-2-hooks-connective-2026-11-09`. **Nothing here is signed:** every moved cell is listed for STYLE-2-MERGE.

## 1. The counts

| | rows |
|---|---|
| the audit's rows in this manifest (§2.6 35 · §2.8 9 · §2.9 7 · §2.10 6 less `InstitutionsTab.jsx:221`) | **56** |
| cured | **53** |
| deferred by STOP or by a surface pair (§6 What stays) | **3** — `powerSiblings.js` :85, :89; `FaithWar.jsx` :54 |
| the nature map (one cause, beside the rows) | **58 keys**, every one mapped |
| the record faults cured red-first | **2** (`FaithWar.jsx` :145, :208) |
| lines the census law (or the tier-noun and fallback reads) changed from the audit's NEW | 16 (marked † below) |
| the retired word, printed, outside the rows and taken with them | 1 (`hookEscalation.js` the `{governing}` fallback "the governing faction") |

## 2. The causes (one per commit)

| commit | cause | files |
|---|---|---|
| `b8492f3e7` | FaithWar: the two record faults red-first, and its wording rows | `src/pdf/sections/FaithWar.jsx`, `tests/pdf/faithWarRecordFaults.test.jsx` (new) |
| `f83f2fc76` | the hook clocks and consequences: system talk and the retired word out | `src/domain/hookEscalation.js`; pins `tests/domain/hookEscalationDeclared.test.js`, `tests/domain/modeSpeedsWy1.test.js` |
| `79f3434dd` | the cross-settlement conflicts: the `${nature}` plain-words map at its owner, and the 11 lines | `src/generators/crossSettlementConflicts.js`, `tests/generators/crossSettlementConflicts.test.js` |
| `461b04bcf` | the pit boss's dog hook | `src/data/personHooksByTitle.js` |
| `909783378` | the connective copy: tabs, the state chapter, the gallery alt | the nine tab/PDF/copy files; eight pins re-keyed |
| (this commit) | the lane's record and its roster row | this file, `tests/lint/.source-citation-baseline.json`, `tests/lint/sourceCitationIntegrity.walker.test.js` |

## 3. Every line, old → new (for the owner's veto)

† = the audit's NEW re-read against the writer's READS and changed; the reason follows the row.

### 3.1 `src/domain/hookEscalation.js` (21 rows + the fallback)

| line | OLD | NEW |
|---|---|---|
| 198 | Smuggling fills the gap; criminal faction gains leverage. | Smugglers fill the gap, and the local criminals grow stronger on it. † (the audit's "the town's criminals" prints the tier noun in a thorp) |
| 199 (a sibling KEY, `ruler: council`) | Public legitimacy erodes as the council fails to stabilize supply. | People lose faith in the council as it fails to keep goods coming in. |
| 292 (its twin) | Public legitimacy erodes as the seat fails to stabilize supply. | People lose faith in those who rule as they fail to keep goods coming in. |
| 203 (a sibling KEY, `stores: > 0`) | Expose hoarding and force the controller to release reserves. | Expose the hoarding and force whoever holds the stores to release them. |
| 204 | Subsidize the chain through temple charity or council intervention. | Pay to keep the trade going, through temple charity or the council's purse. |
| 209 | One faction makes a unilateral move; the others retaliate. | One power acts alone; the others strike back. † ("unilateral" and "retaliate" are the mechanism words the row was taken for) |
| 221 | The institution becomes impaired. Services it provides degrade. | The institution stops working properly, and the people who rely on it go without. |
| 222 | Dependent factions / chains lose their anchor. | The powers and trades that depend on it are left without support. |
| 228 | Accept the loss and let the dependent systems reorganize. | Accept the loss and let those who depended on it find other ways. |
| 234 | Their faction or institution loses leadership and capacity. | Their power or institution loses its leader and much of its strength. † ("leadership and capacity" kept as system talk in the audit's NEW) |
| 257 | The pressure boils over into a discrete crisis (riot, strike, abandonment). | The pressure boils over into open trouble: a riot, a strike, or people leaving. |
| 258 | Stress markers propagate to adjacent subsystems. | The trouble spreads to the trades and offices around it. |
| 259 | Public legitimacy strains; faction realignment becomes likely. | People lose faith in their rulers, and the powers start changing sides. † (tier noun "the town's" struck) |
| 442 | Food supply chain is strained or worse. | The food supply is under strain, or failing. † (the audit's "under strain" dropped the trigger's "or worse") |
| 454 | Trade chain is strained or worse. | Trade is under strain, or failing. † (same) |
| 457 | {controller} loses revenue; tax base shrinks. | {controller} takes in less, and so does the tax collector. |
| 460 | A criminal faction consolidates the new routes. | A criminal power takes over the new routes. |
| 461 | Public legitimacy of the governing faction collapses. | People stop accepting the ruling power's right to govern. † (tier noun "The town" struck) |
| 466 | Governing faction has Contested or worse public legitimacy. | The ruling power's standing with the people is Contested or worse. |
| 469 | A rival faction publicly questions {governing}. | A rival power publicly questions {governing}. |
| 478 | Two factions with overlapping power and conflicting wants. | Two powers of near-equal strength want different things. |
| 564 (not a row; the retired word printed) | `{governing}` fallback "the governing faction" | "the ruling power" |

The three sibling keys move with their text and their twin; the `needs` and the key count (9) are untouched.

### 3.2 `src/generators/crossSettlementConflicts.js` (11 rows)

| line | OLD | NEW |
|---|---|---|
| 82 | … locked in a ${nature}. Both claim the right to set terms for the shared corridor. | … locked in a ${nature}. Both claim the right to set the terms of trade between them. |
| 87 | The ${nature} between … risks destabilizing the mutual defense pact. | The ${nature} between … could break the pact that binds the two places to defend each other. |
| 90 | … is pressing ${npcA.name} on a ${nature}, invoking the patronage agreement to compel compliance. | … is pressing ${npcA.name} on a ${nature}, and holding them to the patronage between the two places. † (the audit's "reminding them who is the patron here" asserts a direction; the description is built for both sides with the same `relType`, so the record does not hold who is patron) |
| 95 | … consider breaking with ${npcB.name}'s faction in ${settB.name}. | … consider breaking with ${npcB.name} and those they speak for in ${settB.name}. † ("their backers" names a party the row does not read) |
| 107 | … an active ${nature}. Formal violence is a matter of timing. | … an active ${nature}. Fighting between them is only a matter of time. |
| 130 | The ${facA.name} of … and the ${facB.name} of … are in direct competition for the same economic territory. Both are escalating. | … are competing for the same trade, and neither will back down. |
| 134 | … are running parallel intelligence operations, and each knows the other knows. | … are spying on each other, and each knows the other knows. |
| 135 | The ${facA.name} has placed assets inside ${facB.name} of ${settB.name}. The infiltration goes both ways. | The ${facA.name} has agents inside ${facB.name} of ${settB.name}, and it has agents of theirs inside it in turn. † ("has found agents" asserts a discovery the line does not hold) |
| 138 | … are in open conflict. Casualties have occurred on both sides. | … are in open conflict. People have died on both sides. |
| 141 | … maintain a formal cooperation agreement, though it strains under individual interests. | … have a formal agreement to work together, though each keeps putting its own interests first. |
| 144 | ${facB.name} of ${settB.name} exercises de facto oversight of ${facA.name}'s operations through the patronage arrangement. | ${facB.name} of ${settB.name} keeps a close watch on everything ${facA.name} does, through the patronage between the two places. † (the audit's "as its patron" dropped for the reason at :90; "arrangement", the struck house word, gone) |

**THE NATURE MAP (one cause, the keys untouched).** `CONFLICT_NATURE_PLAIN` is exported beside `CONFLICT_NATURE`; `plainConflictNature(key)` gives the plain words or the key itself. The description prints the plain words; the stored `conflictNature` stays the key (the Relationships tab and desk read it). Every phrase starts on a consonant so the templates' "a …" holds (pinned).

| key | plain words |
|---|---|
| market boundary dispute | quarrel over where one market ends and the other begins |
| pricing agreement breakdown | broken agreement on prices |
| export quota conflict | dispute over how much each side may sell abroad |
| merchant route rivalry | rivalry between merchants over the same road |
| command hierarchy dispute | dispute over who gives the orders |
| troop deployment disagreement | disagreement over where the soldiers are sent |
| border patrol overlap | dispute over who patrols the border |
| trade preference dispute | dispute over whose goods come first |
| supply priority conflict | dispute over who is supplied first |
| garrison obligation dispute | dispute over who must man the garrison |
| tribute enforcement standoff | standoff over collecting the tribute |
| tribute levy disagreement | disagreement over how much tribute is owed |
| resource extraction claim | dispute over who may take what the land yields |
| administrative jurisdiction conflict | dispute over whose officials have the say |
| policy enforcement dispute | dispute over whose rules are enforced |
| debt renegotiation | dispute over the terms of a debt |
| supply chain dependency tension | grievance over how much one side depends on the other for its goods |
| political autonomy dispute | dispute over how far each side may run its own affairs |
| representation grievance | grievance over who speaks for whom |
| market domination contest | contest over who controls the market |
| trade route blockade | blockade of a trade road |
| price war | price war |
| export undercutting | contest to sell cheaper than the other abroad |
| border incursion | border crossing by armed men |
| arms buildup standoff | standoff as both sides arm themselves |
| mercenary recruitment competition | contest to hire the same sellswords |
| smuggling territory dispute | dispute over who smuggles where |
| protection racket boundary war | fight over who collects protection money where |
| intelligence operation exposure | spying operation that was found out |
| proxy force skirmish | skirmish fought by hired hands |
| defection incident | defection to the other side |
| spy network compromise | betrayal of a spy ring |
| asset elimination contract | contract to kill an agent |
| double-agent suspicion | suspicion that a spy serves both sides |
| diplomatic envoy incident | quarrel over the treatment of an envoy |
| propaganda escalation | campaign of slander |
| treaty violation allegation | charge that a treaty was broken |
| open border skirmish | skirmish on the border |
| raid and reprisal cycle | run of raids and reprisals |
| siege posture standoff | standoff with soldiers ready for a siege |
| sabotage operation | campaign of sabotage |
| assassination contract | contract for a killing |
| destabilization campaign | campaign to stir up trouble |
| levy obligation dispute | dispute over how many fighters must be sent |
| garrison quartering grievance | grievance over soldiers quartered in homes |
| muster quota standoff | standoff over how many must answer the muster |
| tribute assessment dispute | dispute over how the tribute is reckoned |
| harvest levy conflict | dispute over the share of the harvest owed |
| charter rights dispute | dispute over the rights the charter grants |
| homage renewal grievance | grievance over renewing the oath of homage |
| contraband route dispute | dispute over a smuggling road |
| fence territory disagreement | dispute over who sells stolen goods where |
| exposed informant incident | paid informer who was found out |
| smuggled goods pricing conflict | quarrel over the price of smuggled goods |
| front operation ownership dispute | dispute over who owns a business that fronts for them |
| tariff dispute | dispute over tolls and duties |
| waypoint access disagreement | dispute over the use of a stopping place on the road |
| jurisdictional dispute (the fallback) | dispute over whose say it is |

### 3.3 `src/data/personHooksByTitle.js` (1 row)

| line | OLD | NEW |
|---|---|---|
| 79 | A fighting dog that never loses has been seen being fed by a stranger's hand the night before. | A fighting dog that never loses has been seen being fed by someone nobody knows, the night before a bout. † (the audit's "before each bout" turns one sighting into a habit) |

### 3.4 `src/pdf/sections/FaithWar.jsx` (6 of 7 rows, the two faults among them)

| line | OLD | NEW |
|---|---|---|
| 145 at war, `deity` present | This settlement is at war. The live front, the strategy posture, and the patron god. | This settlement is at war. Below: where the fighting stands, how hard it means to press it, and the god it keeps. |
| 145 at war, no `deity` (**FAULT 1**) | (the same line: a god named for a town that keeps none) | This settlement is at war. Below: where the fighting stands and how hard it means to press it. |
| 147 | The patron god and the live geopolitical standing of the settlement. | The god this settlement keeps, and where it stands with its neighbours. |
| 148 | The live geopolitical standing of the settlement. | Where this settlement stands with its neighbours. |
| 208 (**FAULT 2**) | A coalition of ${besiegedBy.join(', ')} holds the walls. | A coalition of ${besiegedBy.join(', ')} surrounds the walls. |
| 251 | Dependent on ${tie.partnerName}. ${cap(tie.phrase)}; losing it would bite hard. | Depends on ${tie.partnerName}. ${cap(tie.phrase)}; losing it would hurt badly. † (the audit's "hurt the town badly" prints the tier noun) |
| 266 | Its ${prize.commodityLabel} market is a contested prize. ${prize.winner} now supplies it. | Rival suppliers competed for its ${prize.commodityLabel} market; ${prize.winner} now supplies it. |
| 54 | The scar is healing; this realm leans toward peace. | **LEFT** (§6): the PDF adopted the screen's own sentence (`WarTab.jsx:187`) so the two surfaces agree; changing one splits them |

**THE FAULTS' RED-FIRST PROOF.** `tests/pdf/faithWarRecordFaults.test.jsx`, three arms on planted live-world slices (no deity at war; a deity at war — the control; a two-power coalition besieging). Run at the parent `a7bc2e4ce` in a clean worktree: **2 failed | 1 passed (3)** — "an at-war town with NO deity names no god in its headline" × and "a coalition besieging the town surrounds the walls; it never holds them" ×, the deity control ✓. At the tip: 3 passed. The negatives are anchored (`expectAbsentWithAnchor`), so neither passes on an empty page. The headline's line count is kept so the line-keyed prose-numerics baseline does not move.

### 3.5 The connective copy (14 rows)

`DailyLifeTab.jsx`'s local narrative **prints only in local mode** (`generate()` calls the backend whenever `isConfigured`; `buildLocalDailyLifeNarrative` runs only on the offline path — CONFIRMED by reading `DailyLifeTab.jsx:93–117`). Cured all the same.

| file:line | OLD | NEW |
|---|---|---|
| DailyLifeTab 341 | The talk of the day keeps returning to ${…}. | Most talk in the street comes back to the same trouble: ${…}. (the slot is unchanged: the plain-noun map the audit's `needs` names, `STRESSOR_SPINE_PHRASES`, carries declared siblings — its council line presumes a council — so reading it raw would print a false fact; `needs` not written in) |
| DailyLifeTab 342 | The place is not peaceful so much as practiced: people know its routines and work around its frictions. | No single trouble hangs over the place just now. People keep to their routines and work around the small ones. |
| DailyLifeTab 345 | Morning starts around ${anchors}. ${terrain} and ${trade} shape the pace: carts, tools, and gossip move where the ground and roads allow, while ${culture} gives even routine bargains a recognizable local rhythm. | Morning starts around ${anchors}. ${terrain} and ${trade} set the pace: carts, tools and news move only as fast as the ground and the roads allow, and ${culture} shapes even the smallest bargain. † (the audit's "follow ${culture} custom" prints "local custom custom" on the fallback) |
| DailyLifeTab 346 | ${food}. Work is divided by habit more than proclamation. Farmers, haulers, priests, guards, and tradespeople all know which shortages can be endured and which ones will turn into arguments before sundown. | ${food}. Everyone knows their work without being told. Farmers, haulers, priests, guards, and tradespeople know which shortages they can live with and which will start a quarrel before sundown. (declaration `guardPresence`, `priest` untouched) |
| DailyLifeTab 347 | Power is felt through ${govFaction ‖ 'whoever can make orders stick this week'}. ${stability<45 ? "Promises are weighed carefully because yesterday's bargain may not survive tomorrow." : 'Most residents know where authority lives and how to petition it without making themselves memorable.'} ${order}. | Orders come from ${govFaction ‖ 'whoever can make them stick this week'}. ${stability<45 ? "People weigh every promise, since yesterday's bargain may not hold tomorrow." : 'Most residents know whom to petition, and how to do it without drawing notice.'} ${order}. † (the fallback no longer repeats "orders"; the audit's "trust no promise past the week" invented a horizon) |
| DailyLifeTab 348 | ${stress} By evening, daily life narrows to lamplight, shared meals, debts remembered, and news carried from door to door. The settlement feels less like a map marker than a set of bargains people keep renewing because leaving would cost more than staying. | ${stress} By evening the lamps are lit, families eat together, debts are remembered, and news goes from door to door. People stay because leaving would cost them more. |
| NPCsTab 57 | No NPCs generated. Generate a settlement to see key figures. | No key figures are recorded for this settlement. |
| PlotHooksTab 152 | No structural plot hooks surfaced yet. | This settlement has no plot hooks yet. |
| MagicTab 168 | This settlement's resilience relies on active magical infrastructure. One or more supply chains are magically sustained, or stress conditions are being offset by arcane, divine, or druidic intervention. Losing those practitioners through conflict, plague, or political disruption would immediately expose critical vulnerabilities. | This place leans on its spellcasters: some of what it eats or makes, or some of the trouble it keeps at bay, depends on their work. Lose them to war, plague or politics and the gap would show at once. † (the audit's "and" asserted both; the writer holds either) |
| MarketPricesSection 118 | Reckoned against this settlement's own usual prices, off the founding trade profile and the live scarcity of the roads. The coin itself is yours to set at the table. | Dear or cheap against what things usually cost here, given what the roads are bringing in now. What a coin is worth is yours to set at the table. |
| SteadingsSection 78 | The relic ruin of {name} stands nearby, a city fallen {n} years ago, superstition-attracting. | The ruin of {name} stands nearby, a city that fell {n} years ago, and the locals have plenty of superstitions about it. |
| UnaffiliatesSection 130 | Nobody is sheltering here who does not belong to something here. | Everyone here belongs to one house or another. |
| SystemStateSnapshot 66 | State snapshot unavailable for this settlement (load and re-save to populate). | No picture of how this settlement stands was saved with it; save it again to add one. |
| en.js 1029 (`stockImageAlt`) | A {tier} of the kind {name} is: the tier's painting, not a picture of this settlement. | A painting of a typical {tier}, not of {name} itself. |

## 4. The deltas (measured in clean worktrees at the parent `a7bc2e4ce` and the tip `909783378`)

| surface | parent | tip | moved |
|---|---|---|---|
| generator golden master /525 | green | green | **0** |
| espionage fence /360 | green | green | **0** |
| herald knowledge desk | green | green | **0** |
| composed-prose manifest /1,050 | red, 5 arms (the merge wave's, signed once at the final tip) | the same 5 arms | **0 cells**: `prose-manifest-cells` at both trees, `prose-manifest-diff` 74,482 cells UNCHANGED, 0 of every other class |
| witness (`presetLightingWitness`) | green | green | **0** |
| PDF view-model snapshot | green | green | **0** |
| phone floors (`tests/components/dossierPhoneFloorAllViews*`) | green | green | **0** (no re-key needed) |

**The one moved pin**, re-keyed by cause, unsigned for STYLE-2-MERGE: `tests/domain/modeSpeedsWy1.test.js` `BASE_PULSE_HASH` `5b6a1e51…` → `d798e730…`, TEXT ONLY, leaf-diffed on dumps of the arm's pulse records at both trees: **12 leaves**, every one the same summary string, `Legitimacy Crisis Clock advanced to stage 2/6: "A rival faction publicly questions the governing faction."` → `"A rival power publicly questions the ruling power."`. No id, tick or number moved. (So the clock stages print after a world pulse: these rows are lit there.)

**Pins re-keyed by identity** (text only, never loosened): `hookEscalationDeclared` (its planted no-stores line), `census2eTables` and `census2gDailyLifePriest` (the Daily Life cells, declarations unchanged), `generalDeskTabFlow`, `magicTab`, `defenseTabFlow`, `heraldWanderersRegister`, `labelLadderParity`, `tierStockImageCards`. New pins: `faithWarRecordFaults` (3) and the nature map (3, in `crossSettlementConflicts.test.js`).

## 5. The referee (the 1,000, `soak-review.mjs --count 1000 --workers 4`, parent and tip)

Both runs exit 0 (parent in a clean worktree at `a7bc2e4ce`, tip at `909783378`; the code tip, which this record does not move). CONFIRMED:

- **The twenty most-repeated frames** (`aggregates/repetition-prose.json` `top`): every one has the same town count at the parent and the tip (1000, 1000, 1000, 439, 367, 306, 306, 297, 293, 263, 260, 232, 225, 225, 208, 206, 203, 203, 199, 199). None is sourced from this lane's files, at the parent or the tip: **not raised**.
- distinct skeletons 4,048 → 4,048; skeletons in ten per cent of towns 104 → 104; the median town's share in them 0.255 → 0.255.
- **`coh:tier-noun`**: 1 mention in `finding-classes.json` at the parent and the tip (soak1k-16's record battery, not a line of this lane); **0 on this lane's lines**. The four audit drafts that would have printed "the town" in a thorp were struck (†).
- In the 60 sampled dossiers this lane's rewritten lines are dark at both trees (as the audit found: 0 lit of these rows). The clock stages print after a world pulse, which is the WY-1 arm's leaf in §4.

**The family's walker phrases** (this lane's 14 files; string literals and JSX text, comments blanked; a scratch scan with the §3 list, word-bounded):

| phrase | parent | tip |
|---|---|---|
| `faction(s)` | 20 (`hookEscalation` 12 · `crossSettlementConflicts` 1 · `en.js` 5 · `NPCsTab` 2) | **8** (`hookEscalation` 1 — the label "Faction Split Clock" · `en.js` 5 · `NPCsTab` 2 — app chrome and labels, A8's map) |
| `a stranger` | 1 (`personHooksByTitle`) | **0** |
| `the engine / the simulator / the simulation` | 25 (`en.js` 23 app chrome · `DailyLifeTab` 2, the AI button's help) | 25 (not rows of this lane) |
| `the record` | 1 (`en.js`) | 1 (app chrome) |
| `rather than`, `arithmetic`, `per cent`, `the ledger`, roster, `not merely`, `legitimacy score` | 0 | 0 |

## 6. What stays (BY FILE)

- **`src/data/powerSiblings.js` :85, :89** — STOP 1 to the chair (default taken): both lines are KEYS of `FACTION_DESC_SIBLINGS`, keyed by the text `src/generators/power/rulingStructure.js` writes (:472, :563); the cure needs that file, outside this manifest. For the lane that owns `rulingStructure.js`, the audit's NEW re-read: :85 "Well-funded city watch; it keeps order reliably and is growing more sure of its own authority." (holds); :89 "A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them." (holds). Both files and the key move together; the gm delta measured there.
- **`src/pdf/sections/FaithWar.jsx` :54** with **`src/components/new/tabs/WarTab.jsx` :187** — one sentence on two surfaces; the audit's NEW "The worst of the fighting is over; this realm leans toward peace." holds for the `near peace` band (the recovering tail, `warStatus.js:348`) and moves both files at once.
- **`src/domain/hookEscalation.js`** — the clock LABELS ("Faction Split Clock") are labels (law §4): A8's map for the owner's veto, SW-8.
- **`src/components/new/tabs/RelationshipsTab.jsx` :193** — prints the raw `conflictNature` key as a chip; it can read `plainConflictNature` from its owner. `src/domain/display/stateProse/relationshipsDeskRead.js` :117 reads the key only to dedupe (no print).
- **`docs/census/declarations/HOOK_ESCALATION.json`** and **`DAILY_LIFE_TAB.json`** carry the old texts of the rewritten lines in their `text` fields; no test compares them to source for these lines (census4Ledger checks vocabulary; census2eTables reads the food, order and LOAD lines only). A ledger refresh through its own door, not this lane's.
- **The edge bundles** `supabase/functions/_shared/aiGroundingBundle.js` (bundles `hookEscalation.js`) and `engineBundle.js` were ALREADY stale at the parent (freshness and replay red at `a7bc2e4ce` before any edit); rebuilt by `npm run build:edge-shared` at the deploy step, never here.
- `src/components/new/tabs/NPCsTab.jsx` "Filter by name, role, or faction" (a label, SW-8); `src/components/new/SummaryTab.jsx` carries a second "No NPCs generated." (not this manifest).

## 7. Reds that are not this lane's (named by cause, measured at the parent)

- `tests/lint/sourceCitationIntegrity.walker.test.js` roster arm: `tree` **147** against 139 frozen, the same at the parent `a7bc2e4ce` and at this tip (the audit read 140 at its own base; MERGE-WAVE's records from `9288badee` on) — `tree` untouched here; `dated` 169 green with this record. `ledgerCitationIntegrity` and `testRatchet` green (the first with `review-fixes-2026-07-08` fetched).
- `tests/property/dossierProseManifest.test.js` 5 arms — the manifest the merge wave signs once at its final tip.
- `tests/lint/negativeAssertionAnchor.walker.test.js` 2 arms — five base files (`stressTypesMeta`, `generationWorldLaw`, `representatives`, `gallerySanitizeAllowlist`, `gallerySanitizer.pglite`); this lane's new test is anchored and absent from the list.
- `tests/components/readerValidationOnPage.test.js` 1 arm (soak1k-24's critical-issue count).
- the edge-bundle freshness and replay tests (§6).

## 8. CONFIRMED against PLAUSIBLE

- **CONFIRMED** (executed): the two faults' red-first (2 failed | 1 passed at the parent, 3 passed at the tip); every surface delta in §4 (both trees run); the pulse hash's 12 leaves; the nature map's coverage (58 keys, none unmapped, none vowel-led, pinned); the Daily Life block's local-mode-only print (read); the phrase counts in §5; the reds in §7 present at the parent.
- **PLAUSIBLE** (read, not executed against a reader): each NEW line's reading under the style law, and that no NEW states a fact its writer does not hold — read against each writer's slots and branches line by line, sixteen audit drafts changed for it (†). The patron lines' mirror (the same template built for both sides) is a pre-existing ambiguity of the generator; the new words assert no more than the old.
