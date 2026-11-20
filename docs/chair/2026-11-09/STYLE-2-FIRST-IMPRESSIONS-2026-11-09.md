# STYLE-2 FIRST-IMPRESSIONS — the lane record (SW-B2, 2026-11-09)

**Seat:** SW-B2 · FIRST-IMPRESSIONS (Claude Opus 5.5), session `session_01FbPLbd5cdXFca6ZZpkx8ET`, child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`). **Branch:** `lane/style-2-first-impressions-2026-11-09`, cut at `0c93f0ca0` (the integration tip `lane/integration-2026-11-07`; `a7bc2e4ce` is its parent). **Law:** WIRING-RULINGS-2026-11-07 §5–§8, STYLE-RULINGS-2 B1, B2 (and A0, A12, B0), BRIEF-STYLE-2-WAVE §0 and §2 (SW-B2). **Worklist:** STYLE-AUDIT-2-SURFACES §5 worst blocks 1, 13, 14, 15; ledger rows D·P5, D·F1, A·O2, A·O16, B·#28. Every line below is **for the owner's veto**. This seat signs nothing; every moved golden cell is listed for STYLE-2-MERGE.

## 1. The commits (one cause each; a fix-up names its cause)

| sha | cause | row |
|---|---|---|
| `0d4d2c435` | The Overview lead reads the crisis as a thing seen, never its key; its clauses agree | D·P5, D·F1 |
| `966709f9c` | The identity line reads tier, terrain and route before it speaks; five vantage frames | A·O2 |
| `443cf4051` | A port with no docks founds on the ground the record names (the `ground` arm) — UNSIGNED generator cause | A·O16 |
| `b661f8a01` | fix-up of `966709f9c`: the official frame keeps the phrase lower-case after its colon | A·O2 |
| `7b026eb01` | The wiring census re-taken through its door (MERGE-WAVE's `140b8f333` moved `economyStateProse.js` without re-taking it; the annex door threw at the base) — one line, the chair's ruling of 01:24 | door |
| `3e9de356e` | DS-GEN-11's vouching zero pool leaves through the annex door | B·#28 |
| `befbd82f9` | fix-up of `966709f9c`: the Overview identity-strip pin re-keyed | A·O2 |
| `b6d48ec0e` | #10's gate reads the docks at last — `getInstFlags(...).inst.hasPort` (the chair's widening, STOP 3) — UNSIGNED generator cause | A·O16 |

## 2. The STOPs and the chair's rulings

1. **B·#28 has no read of the by-design items.** The zero pool was already gated on the battery's verdict (`criticalIssuePoolKey(count, recordClean)`). Shangjin prints it because by-design items are not battery findings, and no `factsOf` atom names a by-design item. The default was RULED (vetoable): the zero pool **leaves** and the contradiction pool stays. The "by-design present → a different sentence" read arm goes to SW-B1 (What stays).
2. **The annex door was red at the base.** The census was stale against `economyStateProse.js`. RULED: the one-line re-stamp through `node scripts/wiring-census.mjs` is the lane's own commit (`7b026eb01`; the identical blob SW-B5, SW-B6 and MERGE-WAVE `f6356919a` carry). Then the edit goes through the door.
3. **#10's gate never read the docks.** See §5. RULED: the manifest is widened to the one token in `src/generators/steps/generateNarratives.js:59`, taken into the A·O16 cause, so that the ground arm never lands alone over real docks.

## 3. Every line, old → new (for the owner's veto)

### 3a. D·P5 / D·F1 — the Overview lead (`src/pdf/lib/headlines.js :: overviewHeadline`; PDF chapter lead and Foundry overview lede)

**The frames.** Old (the crisis label after a colon):
- [traveller] "You reach {where} in a hard season, with one trouble on it: {label}"
- [local] "In {where} the talk in every house is of one thing: {label}"
- [official] "{Where} has one crisis to manage this season: {label}"
- [newcomer] "Ask in {where} what is wrong and you hear of one thing: {label}"

New:
- [traveller] "You reach {where} and it shows at once: {seen}" (with several crises: "You reach {where} in the middle of {nouns}. {Seen}")
- [local] "In {where} the talk is all of {noun}: {seen}"
- [official] "Those in charge of {where} have {noun} on their hands: {seen}"
- [newcomer] "Ask in {where} what is wrong and you hear of {noun}: {seen}"

The season judgment is struck: "Comfortable … in a hard season" set the lead against its own label.

**The crisis table `CRISIS_SEEN`** (new). Each entry is label → noun · seen. Every clause states only what the crisis kind guarantees: no walls, gates, garrison or market; no hunger outside a famine; the war line holds for a town that gains by the war and for one that pays; the migration line holds for arrivals and for departures.

| label | noun | seen |
|---|---|---|
| Under Siege | the siege | nothing comes in by road without the besiegers' leave |
| Famine | the famine | people queue for what food is handed out, and every meal is smaller than the last |
| Under Occupation | the occupation | foreign officials give the orders, and the locals say as little as they can |
| Politically Fractured | the quarrel over who rules | no order is obeyed by everyone, and each side has its own following |
| Indebted to Outside Power | the debt to outsiders | what is owed abroad is paid before anything the people here need |
| Recently Betrayed | the betrayal | someone they trusted sold them out, and neighbours watch each other |
| Infiltrated | the spies among them | people lower their voices and wonder who is listening |
| Disease Outbreak | the sickness | the sick are kept indoors, and people keep their distance from each other |
| Succession Void | the empty seat | no one holds the seat of power, and those who want it are counting their friends |
| Beast & Raider Threat | the beasts and raiders | no one travels the roads alone or after dark |
| Insurgency | the rising | armed bands defy those in charge, and people are careful whom they are seen with |
| Religious Conversion | the change of faith | more people take up the new gods every week, and families argue over which to keep |
| Slave Revolt | the revolt | the enslaved have risen against their masters, and no one knows how far it will spread |
| Wartime | the war | everyone has a view on what the fighting costs and who gains by it |
| Mass Migration | the families on the move | carts piled with bundles crowd the roads |
| (an authored crisis the table does not know) | the crisis | — |

**Census law, struck from the audit's composition:** "and Guild Council still does not know who" (Shangjin) and "and Elected Reeve does as it is told" (Copanucan). The headline does not read the ruler.

### 3b. A·O2 — the identity line (`src/domain/summary/settlementQuickGuide.js :: cultureScopeLine`)

**The record is read before the line speaks** (`scopeAgainstRecord`). A record with no config is legacy and reads as it always did.

| clause (old) | read | new |
|---|---|---|
| "the agora and the harbour" | the sea (`waterAccessKind` = maritime) | on a river or inland: "the agora" |
| "on hillside ground and civic association" | the ONE terrain read | "{ground}, and run by civic association". The ground is "on the open plain" / "on hillside ground" / "in forest country" / "on riverside ground" / "on the coast" / "on mountain ground" / "on desert ground"; with no terrain it is omitted. |
| "built for a pastoral life half-settled and half-moving" | tier | town and above: "built on clan lines" |
| ", on pasture and earthwork" (Celtic) | tier; walls | town and above: struck. Small tiers with a roster and no walls: "on pasture". |
| "run by guild and estate" | a guild on the roster | without one: "run by its estates" |
| "on assembly and what the season allows" | the season has no record field | "on kin, oath and the assembly" |
| "between river and forest" | water and terrain | river + forest: kept. River only: "by the river". Sea + forest: "between the sea and the forest". Sea only: "by the sea". |
| "and the caravan road" | the route | isolated: struck. Sea port: "and the sea trade". River or river port: "and the river trade". Otherwise kept. |

**The frames** `SCOPE_LINE_FRAMES` (new; five, so the pool is not a power of two; the seed `_seed` chooses; frame 0 for an unseeded caller):
- [plain] "{Label}, {phrase}." (the line as it always read)
- [traveller] "{Label}, and it shows: {phrase}."
- [local] "{Label}; people here live in a place {phrase}."
- [newcomer] "{Label}. Ask about the place and you are told it is {phrase}."
- [official] "{Label}: {phrase}."

`composeIdentity` (the DM Summary identity sentence) is untouched. No reader in `src` prints it.

### 3c. A·O16 — Settlement Origin (`settlementOriginProse.js`, `narrativeGenerator.js :: generateSettlementReason`, `steps/generateNarratives.js:59`)

**The gate.** For a port route, the port reason prints only when the roster holds docks or a wharf (`.inst.hasPort`, §5). Otherwise the terrain's arm: riverside → the river arm (as before); coastal / mountain / hills / forest / plains / desert → the new `ground` arm; no terrain → the road arm. History's origin draws from the same terrain-first key (`genArrivalDetail`), so the two agree.

**The `ground` arm** (new; `{ground}` = "on the shore", "on the mountainside", "in the hills", "in the forest", "out on the open plain", "in the desert"):
1. "Built {ground}. It has no wharf of its own."
2. "The first families built {ground}, and no one has ever built a wharf here."
3. "It stands {ground}; ask for the docks and you are told there are none."
4. "Founded {ground}; the place has no wharf."
5. "It was built {ground} and has never had a wharf."

**In the same pools (the style law; the walker's tics):**

| arm | old | new |
|---|---|---|
| crossroads [0] | Positioned at a major crossroads. Trade flows through here by geography, not by choice. | Built at a major crossroads, and trade comes in on every road. |
| port.generic [4] | Built around a landing. Trade arrives by hull rather than by axle, and the whole economy is shaped to that difference. | Built around a landing: what it trades comes in by boat, and the place is laid out around the unloading. |
| port.riverside [1] | An inland river port: barges rather than hulls, and a working season that closes when the channel does. | An inland river port: barges, not ships, and a working season that closes when the channel does. |
| isolated.sustained [3] | Isolated by geography rather than by preference. The place feeds itself, and that is both its security and its ceiling. | Isolated by the lie of the land. The place feeds itself, and it cannot grow past what its own fields give. |
| isolated.deficit [4] | …The shortfall is met through {channels}, and the arrangement is renegotiated every season. | …The shortfall is met through {channels}, and every season the terms are bargained again. |
| {channels}, magic | magical transport, sanctioned caravans, seasonal access, or patronage | carriage by magic, the caravans that still come, the roads in a good season, or the favour of a patron |
| {channels}, none | sanctioned caravans, seasonal access, patronage, or emergency rationing | the caravans that still come, the roads in a good season, or the favour of a patron |

### 3d. B·#28 — the Viability coherence line (DS-GEN-11, `criticalIssueCount zero`) — LEAVES

These three lines are gone: on a clean record the header already says ✓ COHERENT, and beside a by-design list they were false (the ruling of STOP 1).
- "Everything you hear about {settlement} holds up; its story is clean, with nothing contradicting anything else." → (gone)
- "Look as closely as you like at {settlement}: nothing about it fails to add up." → (gone)
- "{settlement} is under real pressure, yet its account of itself stays clean." → (gone)

The annex keeps an editorial note in the pool's place, quoting them.

## 4. The twelve, before (`0c93f0ca0`) and after (`b6d48ec0e`)

`node scripts/audit/soak-review.mjs --count 12`, in clean worktrees. The Foundry lede is the PDF lead in italics, byte for byte (`&amp;` escaped), on both sides.

| # | town | line | before | after |
|---|---|---|---|---|
| 0 | Albamunicipium | Overview lead (PDF + Foundry) | Struggling. Ask in Albamunicipium, a thorpe of 24, what is wrong and you hear of one thing: mass migration. | Struggling. Ask in Albamunicipium, a thorpe of 24, what is wrong and you hear of the families on the move: carts piled with bundles crowd the roads. |
| 0 | Albamunicipium | identity line | Latin-inspired, built in masonry around a civic square, and run by patronage and law. | Latin-inspired: built in masonry around a civic square, and run by patronage and law. |
| 0 | Albamunicipium | Settlement Origin | Founded roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night. | Founded on the mountainside; the place has no wharf. |
| 1 | Lundey | Overview lead (PDF + Foundry) | Poor. Lundey, a hamlet of 78, has one crisis to manage this season: slave revolt. | Poor. Those in charge of Lundey, a hamlet of 78, have the revolt on their hands: the enslaved have risen against their masters, and no one knows how far it will spread. |
| 1 | Lundey | identity line | Norse-inspired, built around the hall, on kin, oath and the assembly. | Norse-inspired, and it shows: built around the hall, on kin, oath and the assembly. |
| 1 | Lundey | Settlement Origin | The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else's cart. | The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else's cart. |
| 2 | Copanucan | Overview lead (PDF + Foundry) | Struggling. In Copanucan, a village of 323, the talk in every house is of one thing: under occupation. | Struggling. In Copanucan, a village of 323, the talk is all of the occupation: foreign officials give the orders, and the locals say as little as they can. |
| 2 | Copanucan | identity line | Mesoamerican-inspired, built around a civic-ritual plaza, on tribute and the ritual calendar. | Mesoamerican-inspired: built around a civic-ritual plaza, on tribute and the ritual calendar. |
| 2 | Copanucan | Settlement Origin | A crossroads settlement: every road brings it trade, and any of them can bring it trouble. | A crossroads settlement: every road brings it trade, and any of them can bring it trouble. |
| 3 | Al-karez | Overview lead (PDF + Foundry) | Struggling. You reach Al-karez, a town of 1,327, in a hard season, with one trouble on it: famine. It may not survive as it stands. | Struggling. You reach Al-karez, a town of 1,327, and it shows at once: people queue for what food is handed out, and every meal is smaller than the last. It may not survive as it stands. |
| 3 | Al-karez | identity line | Arabic-inspired, built around courtyards and waterworks, on endowed institutions and the caravan road. | Arabic-inspired, built around courtyards and waterworks, on endowed institutions and the river trade. |
| 3 | Al-karez | Settlement Origin | Founded on the bank, where the current does the hauling; every trade here is priced against what the water carries for nothing. | An inland river port: cargo moves from barges to carts here, and the handling is its living. |
| 4 | Portaminus | Overview lead (PDF + Foundry) | Poor. Ask in Portaminus, a city of 3,597, what is wrong and you hear of two things: beast & raider threat and mass migration. | Poor. Ask in Portaminus, a city of 3,597, what is wrong and you hear of the beasts and raiders and the families on the move. No one travels the roads alone or after dark. |
| 4 | Portaminus | identity line | Latin-inspired, built in masonry around a civic square, and run by patronage and law. | Latin-inspired: built in masonry around a civic square, and run by patronage and law. |
| 4 | Portaminus | Settlement Origin | Positioned at a major crossroads. Trade flows through here by geography, not by choice. | Built at a major crossroads, and trade comes in on every road. |
| 5 | Suryanagar | Overview lead (PDF + Foundry) | Comfortable. You reach Suryanagar, a metropolis of 119,108, in a hard season, with one trouble on it: wartime. | Comfortable. You reach Suryanagar, a metropolis of 119,108, and it shows at once: everyone has a view on what the fighting costs and who gains by it. |
| 5 | Suryanagar | identity line | South-Asian-inspired, built around the tank and the bazaar, in quarters by trade, under temple and guild. | South-Asian-inspired; people here live in a place built around the tank and the bazaar, in quarters by trade, under temple and guild. |
| 5 | Suryanagar | Settlement Origin | Founded roadside, where the day is measured in traffic: what arrives before noon, what leaves before dusk, and what stops for the night. | A port: the wharves are why the place exists, and everything else grew up behind them. |
| 6 | Becanchihua | Overview lead (PDF + Foundry) | Struggling. Becanchihua, a thorpe of 5, has one crisis to manage this season: recently betrayed. | Struggling. Those in charge of Becanchihua, a thorpe of 5, have the betrayal on their hands: someone they trusted sold them out, and neighbours watch each other. |
| 6 | Becanchihua | identity line | Mesoamerican-inspired, built around a civic-ritual plaza, on tribute and the ritual calendar. | Mesoamerican-inspired: built around a civic-ritual plaza, on tribute and the ritual calendar. |
| 6 | Becanchihua | Settlement Origin | A river settlement. The channel sets the calendar: what floods, what freezes, and what can be moved between the two. | A river settlement. The channel sets the calendar: what floods, what freezes, and what can be moved between the two. |
| 7 | Haifeng | Overview lead (PDF + Foundry) | Comfortable. Ask in Haifeng, a hamlet of 91, what is wrong and you hear of one thing: politically fractured. | Comfortable. Ask in Haifeng, a hamlet of 91, what is wrong and you hear of the quarrel over who rules: no order is obeyed by everyone, and each side has its own following. |
| 7 | Haifeng | identity line | East-Asian-inspired, built in wards and courtyards, ordered by bureau and lineage. | East-Asian-inspired; people here live in a place built in wards and courtyards, ordered by bureau and lineage. |
| 7 | Haifeng | Settlement Origin | A road settlement: it makes its living from other people's journeys, in stabling and meals and small repairs. | Founded in the desert; the place has no wharf. |
| 8 | Achileia | Overview lead (PDF + Foundry) | Struggling. Ask in Achileia, a village of 369, what is wrong and you hear of one thing: succession void. | Struggling. Ask in Achileia, a village of 369, what is wrong and you hear of the empty seat: no one holds the seat of power, and those who want it are counting their friends. |
| 8 | Achileia | identity line | Greek-inspired, built around the agora and the harbour, on hillside ground and civic association. | Greek-inspired, and it shows: built around the agora and the harbour, on the coast, and run by civic association. |
| 8 | Achileia | Settlement Origin | A road settlement: it makes its living from other people's journeys, in stabling and meals and small repairs. | A road settlement: it makes its living from other people's journeys, in stabling and meals and small repairs. |
| 9 | Shangjin | Overview lead (PDF + Foundry) | Struggling. Ask in Shangjin, a town of 1,867, what is wrong and you hear of one thing: recently betrayed. | Struggling. Ask in Shangjin, a town of 1,867, what is wrong and you hear of the betrayal: someone they trusted sold them out, and neighbours watch each other. |
| 9 | Shangjin | identity line | East-Asian-inspired, built in wards and courtyards, ordered by bureau and lineage. | East-Asian-inspired. Ask about the place and you are told it is built in wards and courtyards, ordered by bureau and lineage. |
| 9 | Shangjin | Settlement Origin | Isolated from major trade routes. The settlement cannot fully feed itself; what the land does not give arrives expensively — through sanctioned caravans, seasonal access, patronage, or emergency rationing — or not at all. | Isolated from major trade routes. The settlement cannot fully feed itself; what the land does not give arrives expensively — through the caravans that still come, the roads in a good season, or the favour of a patron — or not at all. |
| 10 | Olympambelos | Overview lead (PDF + Foundry) | Moderate. Ask in Olympambelos, a city of 14,566, what is wrong and you hear of one thing: mass migration. | Moderate. Ask in Olympambelos, a city of 14,566, what is wrong and you hear of the families on the move: carts piled with bundles crowd the roads. |
| 10 | Olympambelos | identity line | Greek-inspired, built around the agora and the harbour, on hillside ground and civic association. | Greek-inspired, built around the agora, on riverside ground, and run by civic association. |
| 10 | Olympambelos | Settlement Origin | Established along a road route. Trade flows in, goods flow out, people pass through. | Established along a road route. Trade flows in, goods flow out, people pass through. |
| 11 | Gankhuushari | Overview lead (PDF + Foundry) | Wealthy. Gankhuushari, a metropolis of 93,360, has no crisis on its hands this season. | Wealthy. Gankhuushari, a metropolis of 93,360, has no crisis on its hands this season. |
| 11 | Gankhuushari | identity line | Steppe-inspired, built for a pastoral life half-settled and half-moving, held by clan and caravan. | Steppe-inspired; people here live in a place built on clan lines, held by clan and caravan. |
| 11 | Gankhuushari | Settlement Origin | The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else's cart. | The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else's cart. |

**The coherence line (Viability):** before, the vouching line printed in six of the twelve (0 Albamunicipium, 1 Lundey, 2 Copanucan, 6 Becanchihua, 8 Achileia, 9 Shangjin — Shangjin above its own "By-Design Contradictions (1)"). After: in none.

## 5. `hasDocks` was false on every birth — the first wave's #10 gate never read the docks

`src/generators/steps/generateNarratives.js` computed `hasDocks = Boolean(getInstFlags(effectiveConfig, institutions).hasPort)`. `priorityHelpers.js :: getInstFlags` returns `{ criminalEffective, …, raw, inst }`, and the flag lives at `.inst.hasPort`. The top-level read was `undefined`, so `hasDocks` was **false on every birth since the CENSUS wiring**, and W5 HIS's #10 gate (STYLE-RULINGS §1, 2026-11-07) never read the docks.

The proof: coastal port towns, cities and metropolises whose rosters hold "Docks/port facilities", "Shipyard" and "Harbour master's office" all printed the road arm — Suryanagar's "Founded roadside" is one of them. The red-first case through the real pipeline (`tests/generators/settlementReason.test.js`) fails at `443cf4051` with "town 0 has docks: It stands on the shore; ask for the docks and you are told there are none." It passes at `b6d48ec0e`: every port with docks prints a port reason, and every port without one does not. The chair records this against the first wave.

## 6. The deltas (unsigned; measured in clean worktrees, base `0c93f0ca0` and tip `b6d48ec0e`), for STYLE-2-MERGE's signing

Generator causes: `443cf4051` and `b6d48ec0e` (A·O16). The other causes move no generated byte.

| surface | moved | how measured |
|---|---|---|
| generator golden master (/525) | **147/525** — 73 port, 73 isolated, 1 crossroads. Twelve rows each of `{thorp…metropolis}\|*\|coastal\|port` and `{thorp…metropolis}\|*\|forest\|isolated`, plus `town\|plains\|port`, `town\|plains\|isolated` and `town\|plains\|crossroads` (the corpus' plains rows) | `tests/property/generatorGoldenMaster.test.js` at `b6d48ec0e` in a clean worktree; the row list is below |
| dormancy fence (/360) | **184/360** — port 90, isolated 76, crossroads 18. Every moved row moves in `settlementReason` alone: with that field nulled, all 360 digests equal the base's. The corpus sha goes `fe0dde0e…` (= the committed `PRE_COUPLING_CORPUS_SHA` at the base) → `af90a776d86eb8aa927b1a7f6639ccf84ed89edc4f3e4b18b3326b6461e99b3d` | the fence's own corpus re-driven row by row in clean worktrees at base and tip (the scratch tool hashes each row, and each row with `settlementReason` nulled) |
| herald desk | **0** | `tests/property/heraldKnowledgeDeskGolden.test.js` green at the tip |
| composed prose (/1,050) | **0 cells of 74,482** (REPLACED 0, RE-INDEXED 0, ADDITIVE 0, WORDING-ONLY 0). DS-GEN-11's zero pool never drew in the drift corpus. `dossierProseManifest`'s five reds are the base's own (identical at `0c93f0ca0`) | `node scripts/prose-manifest-cells.mjs --out` at base and tip → `node scripts/prose-manifest-diff.mjs` |
| witness (/8) | **0** | `tests/simulation/presetLightingWitness.test.js` green at the tip |
| PDF snapshot | **0** (the snapshot fixture carries no crisis lead) | `tests/pdf/goldenViewModel.test.js` green at the tip |

**The reds that move with the golden master** (each compares the same 525-row fixture, and each turns green with the merge seat's gm re-record): `tests/property/dmLayerGoldenIsolation.test.js` A7; `tests/domain/worldFactRederive.test.js` A7 (2 rows of its stride); `tests/generators/nameHeldThroughAssembly.test.js` A1, `pipelinePinnedChoosers.test.js` A1, `pipelinePinnedMode.test.js` A1/A2 (3), `powerEconomyFreshness.test.js` A4 and `rosterFinalUnderHeldRoster.test.js` A1 (12 moved rows each, the stride's share of the 147); and `tests/property/espionageDormancyFence.test.js`, the fence above. **The reds that are the base's own** (identical at `0c93f0ca0`, not touched): `dossierProseManifest` (5), `editCorpusRatchet` (4), `composeStateProse` cell arm 72 → 60 (1), and 22 tests in 12 domain/generator files (`clergyTraitPlane`, `deityStanceLane`, `editWorldFactResources`, `killNpcDoubleImpair`, `characterConsumers`, `religionLegitimacyFactionKey`, `worldPulseFactionSeating`, `densityLaw`, `institutionBudgetPromise`, `regenNpcEnrichment`, `x46NpcBand` and the composeStateProse one).

**The 147 gm rows** (`tier\|culture\|terrain\|route\|profile\|v3`):

```
city|arabic|coastal|port|civilized|golden-master-v3
city|arabic|forest|isolated|civilized|golden-master-v3
city|celtic|coastal|port|civilized|golden-master-v3
city|celtic|forest|isolated|civilized|golden-master-v3
city|east_asian|coastal|port|civilized|golden-master-v3
city|east_asian|forest|isolated|civilized|golden-master-v3
city|germanic|coastal|port|civilized|golden-master-v3
city|germanic|forest|isolated|civilized|golden-master-v3
city|greek|coastal|port|civilized|golden-master-v3
city|greek|forest|isolated|civilized|golden-master-v3
city|latin|coastal|port|civilized|golden-master-v3
city|latin|forest|isolated|civilized|golden-master-v3
city|mediterranean|coastal|port|civilized|golden-master-v3
city|mediterranean|forest|isolated|civilized|golden-master-v3
city|mesoamerican|coastal|port|civilized|golden-master-v3
city|mesoamerican|forest|isolated|civilized|golden-master-v3
city|norse|coastal|port|civilized|golden-master-v3
city|norse|forest|isolated|civilized|golden-master-v3
city|slavic|coastal|port|civilized|golden-master-v3
city|slavic|forest|isolated|civilized|golden-master-v3
city|south_asian|coastal|port|civilized|golden-master-v3
city|south_asian|forest|isolated|civilized|golden-master-v3
city|steppe|coastal|port|civilized|golden-master-v3
city|steppe|forest|isolated|civilized|golden-master-v3
hamlet|arabic|coastal|port|civilized|golden-master-v3
hamlet|arabic|forest|isolated|civilized|golden-master-v3
hamlet|celtic|coastal|port|civilized|golden-master-v3
hamlet|celtic|forest|isolated|civilized|golden-master-v3
hamlet|east_asian|coastal|port|civilized|golden-master-v3
hamlet|east_asian|forest|isolated|civilized|golden-master-v3
hamlet|germanic|coastal|port|civilized|golden-master-v3
hamlet|germanic|forest|isolated|civilized|golden-master-v3
hamlet|greek|coastal|port|civilized|golden-master-v3
hamlet|greek|forest|isolated|civilized|golden-master-v3
hamlet|latin|coastal|port|civilized|golden-master-v3
hamlet|latin|forest|isolated|civilized|golden-master-v3
hamlet|mediterranean|coastal|port|civilized|golden-master-v3
hamlet|mediterranean|forest|isolated|civilized|golden-master-v3
hamlet|mesoamerican|coastal|port|civilized|golden-master-v3
hamlet|mesoamerican|forest|isolated|civilized|golden-master-v3
hamlet|norse|coastal|port|civilized|golden-master-v3
hamlet|norse|forest|isolated|civilized|golden-master-v3
hamlet|slavic|coastal|port|civilized|golden-master-v3
hamlet|slavic|forest|isolated|civilized|golden-master-v3
hamlet|south_asian|coastal|port|civilized|golden-master-v3
hamlet|south_asian|forest|isolated|civilized|golden-master-v3
hamlet|steppe|coastal|port|civilized|golden-master-v3
hamlet|steppe|forest|isolated|civilized|golden-master-v3
metropolis|arabic|coastal|port|civilized|golden-master-v3
metropolis|arabic|forest|isolated|civilized|golden-master-v3
metropolis|celtic|coastal|port|civilized|golden-master-v3
metropolis|celtic|forest|isolated|civilized|golden-master-v3
metropolis|east_asian|coastal|port|civilized|golden-master-v3
metropolis|east_asian|forest|isolated|civilized|golden-master-v3
metropolis|germanic|coastal|port|civilized|golden-master-v3
metropolis|germanic|forest|isolated|civilized|golden-master-v3
metropolis|greek|coastal|port|civilized|golden-master-v3
metropolis|greek|forest|isolated|civilized|golden-master-v3
metropolis|latin|coastal|port|civilized|golden-master-v3
metropolis|latin|forest|isolated|civilized|golden-master-v3
metropolis|mediterranean|coastal|port|civilized|golden-master-v3
metropolis|mediterranean|forest|isolated|civilized|golden-master-v3
metropolis|mesoamerican|coastal|port|civilized|golden-master-v3
metropolis|mesoamerican|forest|isolated|civilized|golden-master-v3
metropolis|norse|coastal|port|civilized|golden-master-v3
metropolis|norse|forest|isolated|civilized|golden-master-v3
metropolis|slavic|coastal|port|civilized|golden-master-v3
metropolis|slavic|forest|isolated|civilized|golden-master-v3
metropolis|south_asian|coastal|port|civilized|golden-master-v3
metropolis|south_asian|forest|isolated|civilized|golden-master-v3
metropolis|steppe|coastal|port|civilized|golden-master-v3
metropolis|steppe|forest|isolated|civilized|golden-master-v3
thorp|arabic|coastal|port|civilized|golden-master-v3
thorp|arabic|forest|isolated|civilized|golden-master-v3
thorp|celtic|coastal|port|civilized|golden-master-v3
thorp|celtic|forest|isolated|civilized|golden-master-v3
thorp|east_asian|coastal|port|civilized|golden-master-v3
thorp|east_asian|forest|isolated|civilized|golden-master-v3
thorp|germanic|coastal|port|civilized|golden-master-v3
thorp|germanic|forest|isolated|civilized|golden-master-v3
thorp|greek|coastal|port|civilized|golden-master-v3
thorp|greek|forest|isolated|civilized|golden-master-v3
thorp|latin|coastal|port|civilized|golden-master-v3
thorp|latin|forest|isolated|civilized|golden-master-v3
thorp|mediterranean|coastal|port|civilized|golden-master-v3
thorp|mediterranean|forest|isolated|civilized|golden-master-v3
thorp|mesoamerican|coastal|port|civilized|golden-master-v3
thorp|mesoamerican|forest|isolated|civilized|golden-master-v3
thorp|norse|coastal|port|civilized|golden-master-v3
thorp|norse|forest|isolated|civilized|golden-master-v3
thorp|slavic|coastal|port|civilized|golden-master-v3
thorp|slavic|forest|isolated|civilized|golden-master-v3
thorp|south_asian|coastal|port|civilized|golden-master-v3
thorp|south_asian|forest|isolated|civilized|golden-master-v3
thorp|steppe|coastal|port|civilized|golden-master-v3
thorp|steppe|forest|isolated|civilized|golden-master-v3
town|arabic|coastal|port|civilized|golden-master-v3
town|arabic|forest|isolated|civilized|golden-master-v3
town|celtic|coastal|port|civilized|golden-master-v3
town|celtic|forest|isolated|civilized|golden-master-v3
town|east_asian|coastal|port|civilized|golden-master-v3
town|east_asian|forest|isolated|civilized|golden-master-v3
town|germanic|coastal|port|civilized|golden-master-v3
town|germanic|forest|isolated|civilized|golden-master-v3
town|germanic|plains|crossroads|civilized|golden-master-v3
town|germanic|plains|isolated|civilized|golden-master-v3
town|germanic|plains|port|civilized|golden-master-v3
town|greek|coastal|port|civilized|golden-master-v3
town|greek|forest|isolated|civilized|golden-master-v3
town|latin|coastal|port|civilized|golden-master-v3
town|latin|forest|isolated|civilized|golden-master-v3
town|mediterranean|coastal|port|civilized|golden-master-v3
town|mediterranean|forest|isolated|civilized|golden-master-v3
town|mesoamerican|coastal|port|civilized|golden-master-v3
town|mesoamerican|forest|isolated|civilized|golden-master-v3
town|norse|coastal|port|civilized|golden-master-v3
town|norse|forest|isolated|civilized|golden-master-v3
town|slavic|coastal|port|civilized|golden-master-v3
town|slavic|forest|isolated|civilized|golden-master-v3
town|south_asian|coastal|port|civilized|golden-master-v3
town|south_asian|forest|isolated|civilized|golden-master-v3
town|steppe|coastal|port|civilized|golden-master-v3
town|steppe|forest|isolated|civilized|golden-master-v3
village|arabic|coastal|port|civilized|golden-master-v3
village|arabic|forest|isolated|civilized|golden-master-v3
village|celtic|coastal|port|civilized|golden-master-v3
village|celtic|forest|isolated|civilized|golden-master-v3
village|east_asian|coastal|port|civilized|golden-master-v3
village|east_asian|forest|isolated|civilized|golden-master-v3
village|germanic|coastal|port|civilized|golden-master-v3
village|germanic|forest|isolated|civilized|golden-master-v3
village|greek|coastal|port|civilized|golden-master-v3
village|greek|forest|isolated|civilized|golden-master-v3
village|latin|coastal|port|civilized|golden-master-v3
village|latin|forest|isolated|civilized|golden-master-v3
village|mediterranean|coastal|port|civilized|golden-master-v3
village|mediterranean|forest|isolated|civilized|golden-master-v3
village|mesoamerican|coastal|port|civilized|golden-master-v3
village|mesoamerican|forest|isolated|civilized|golden-master-v3
village|norse|coastal|port|civilized|golden-master-v3
village|norse|forest|isolated|civilized|golden-master-v3
village|slavic|coastal|port|civilized|golden-master-v3
village|slavic|forest|isolated|civilized|golden-master-v3
village|south_asian|coastal|port|civilized|golden-master-v3
village|south_asian|forest|isolated|civilized|golden-master-v3
village|steppe|coastal|port|civilized|golden-master-v3
village|steppe|forest|isolated|civilized|golden-master-v3
```

**The 184 fence rows** (`tier · route · seed · base digest → tip digest`, first twelve hex):

```
thorp · isolated · SUBw4-fence1-thorp-isolated-000 · f9a0e4f45846 → b38d4d042a74
thorp · isolated · SUBw4-fence1-thorp-isolated-002 · 8194b927c06f → ee5994f1d476
thorp · isolated · SUBw4-fence1-thorp-isolated-004 · 842e8c91b803 → a25425f6e328
thorp · isolated · SUBw4-fence1-thorp-isolated-006 · a86aed37e18a → b173c0cbe48c
thorp · isolated · SUBw4-fence1-thorp-isolated-007 · 981fc5bccb98 → 437afd457da5
thorp · isolated · SUBw4-fence1-thorp-isolated-008 · eb0e80067596 → 96364466349e
thorp · isolated · SUBw4-fence1-thorp-isolated-009 · 776d663e9e00 → 3722aa112620
thorp · isolated · SUBw4-fence1-thorp-isolated-010 · 7042ec3e9080 → 25638a9d8275
thorp · isolated · SUBw4-fence1-thorp-isolated-012 · 7244a9127600 → b2eb9a7853a2
thorp · isolated · SUBw4-fence1-thorp-isolated-013 · 406cd6e363d8 → f7d53b282c45
thorp · isolated · SUBw4-fence1-thorp-isolated-014 · f9387fabbc69 → 972e1c592e67
thorp · port · SUBw4-fence1-thorp-port-000 · 3a2595951a47 → b696169ad96f
thorp · port · SUBw4-fence1-thorp-port-001 · 26aeefeb01a2 → 74d5afaf8ef9
thorp · port · SUBw4-fence1-thorp-port-002 · c7fcb1fbb2c0 → abcc09c9c51b
thorp · port · SUBw4-fence1-thorp-port-003 · ed8c11c2f8f2 → 99c407fb995e
thorp · port · SUBw4-fence1-thorp-port-004 · aacabd9086f3 → 15ffdb9dae2b
thorp · port · SUBw4-fence1-thorp-port-005 · 0b075d502e5b → fa76b625fa35
thorp · port · SUBw4-fence1-thorp-port-006 · 8d24ef4affee → af727bb15ded
thorp · port · SUBw4-fence1-thorp-port-007 · a9436ca82f32 → b83c29b0803a
thorp · port · SUBw4-fence1-thorp-port-008 · 024bbba526c5 → 347075be714d
thorp · port · SUBw4-fence1-thorp-port-009 · d2d4d3ae9574 → 3036300bdb60
thorp · port · SUBw4-fence1-thorp-port-010 · 0866220897f0 → 34e2c3cbcc9c
thorp · port · SUBw4-fence1-thorp-port-011 · c8afd188f676 → e414412f2e2e
thorp · port · SUBw4-fence1-thorp-port-012 · 42e79745b48f → ed499691f185
thorp · port · SUBw4-fence1-thorp-port-013 · f8d4694bbbbc → 30f635281e20
thorp · port · SUBw4-fence1-thorp-port-014 · 1772ebafa94e → 63e3aad6aee5
thorp · crossroads · SUBw4-fence1-thorp-crossroads-010 · 57783b17c799 → df0dd9fbb42a
hamlet · isolated · SUBw4-fence1-hamlet-isolated-000 · 5cd348ce2243 → d5f5368c4db8
hamlet · isolated · SUBw4-fence1-hamlet-isolated-001 · bd2ea7fec717 → 88534cdb224d
hamlet · isolated · SUBw4-fence1-hamlet-isolated-002 · 193ad6b4d958 → ba4aadbb6eed
hamlet · isolated · SUBw4-fence1-hamlet-isolated-003 · 4180047f72a3 → 62a47882783c
hamlet · isolated · SUBw4-fence1-hamlet-isolated-004 · 4a3f96c4ec41 → a52ad96cf637
hamlet · isolated · SUBw4-fence1-hamlet-isolated-005 · f8f250ddb13f → 897f6e80d5c7
hamlet · isolated · SUBw4-fence1-hamlet-isolated-006 · d91fcaa24271 → a1806a4babab
hamlet · isolated · SUBw4-fence1-hamlet-isolated-007 · b848dc42ff44 → 7f6fce40f097
hamlet · isolated · SUBw4-fence1-hamlet-isolated-008 · 99620f8d449c → 85d77350f803
hamlet · isolated · SUBw4-fence1-hamlet-isolated-009 · c571c66f3c31 → 45b4170668f9
hamlet · isolated · SUBw4-fence1-hamlet-isolated-010 · 737f6a7e7ffd → 0661315d1465
hamlet · isolated · SUBw4-fence1-hamlet-isolated-012 · ba224b1d0b3a → 00d046951655
hamlet · port · SUBw4-fence1-hamlet-port-000 · 0e28064d7c95 → 58c8b52da2c5
hamlet · port · SUBw4-fence1-hamlet-port-001 · 5757cac620b2 → 63736f45e9d1
hamlet · port · SUBw4-fence1-hamlet-port-002 · 01d0a2a77d26 → 97194d373e68
hamlet · port · SUBw4-fence1-hamlet-port-003 · 3b226013d7b4 → f6f3dce11c67
hamlet · port · SUBw4-fence1-hamlet-port-004 · 016e838642bd → e7e881a824dc
hamlet · port · SUBw4-fence1-hamlet-port-005 · 746900b7f6e1 → 5e9e6303b1b1
hamlet · port · SUBw4-fence1-hamlet-port-006 · d937a577f0eb → 5cd46fefbda0
hamlet · port · SUBw4-fence1-hamlet-port-007 · ba662aff5b3b → b502dffb1ccb
hamlet · port · SUBw4-fence1-hamlet-port-008 · 4b4dd289982e → fbfc79afded4
hamlet · port · SUBw4-fence1-hamlet-port-009 · dba36f80e127 → bc53e1a5cfbe
hamlet · port · SUBw4-fence1-hamlet-port-010 · 370bc9a4ddd6 → e2d7e3565803
hamlet · port · SUBw4-fence1-hamlet-port-011 · 13d110b240c7 → e3e135cd9354
hamlet · port · SUBw4-fence1-hamlet-port-012 · 68e0ab08149b → 10cc1a09b839
hamlet · port · SUBw4-fence1-hamlet-port-013 · d1218d85a030 → 824383d285d9
hamlet · port · SUBw4-fence1-hamlet-port-014 · 20fb3b7c411a → d3c1b576859c
hamlet · crossroads · SUBw4-fence1-hamlet-crossroads-004 · 3a5dc04bbe4c → 412b7a444666
hamlet · crossroads · SUBw4-fence1-hamlet-crossroads-006 · e7e55094b79d → 09108f449faf
hamlet · crossroads · SUBw4-fence1-hamlet-crossroads-014 · 02c7d9f60c22 → bf935461381b
village · isolated · SUBw4-fence1-village-isolated-000 · 56534b2d8ce6 → 8e961466f24b
village · isolated · SUBw4-fence1-village-isolated-001 · 88d59f0e3597 → 0a88a5218ba4
village · isolated · SUBw4-fence1-village-isolated-004 · 8d4934416a12 → 8e04f0643d4f
village · isolated · SUBw4-fence1-village-isolated-005 · 33074eb97a65 → 774c5d38d4d7
village · isolated · SUBw4-fence1-village-isolated-006 · 4f48933dc86a → aee54c4ee9bd
village · isolated · SUBw4-fence1-village-isolated-007 · e3c021591024 → 93688ca918e1
village · isolated · SUBw4-fence1-village-isolated-009 · 08f5ced70bdf → f1e82dab55f0
village · isolated · SUBw4-fence1-village-isolated-010 · 998e4f4eb889 → 6c98ec557947
village · port · SUBw4-fence1-village-port-000 · 5372377ab3e1 → c097f030aee6
village · port · SUBw4-fence1-village-port-001 · 4b4f2cc0738d → 900376744a04
village · port · SUBw4-fence1-village-port-002 · 4206e45a2461 → 1262da6176ca
village · port · SUBw4-fence1-village-port-003 · c0150e0706b3 → b07e612a47fa
village · port · SUBw4-fence1-village-port-004 · cac3fd10fcd1 → e8a535f4891e
village · port · SUBw4-fence1-village-port-005 · afc70d55783e → 35b1cad2e782
village · port · SUBw4-fence1-village-port-006 · 514e5a5078ec → be82874624b5
village · port · SUBw4-fence1-village-port-007 · 61014782eb38 → dedebcb32dc3
village · port · SUBw4-fence1-village-port-008 · 9cd85a7fc9cf → 6e0915642eaf
village · port · SUBw4-fence1-village-port-009 · 6d87c3d91198 → e37e54ff84ed
village · port · SUBw4-fence1-village-port-010 · 428468db08a4 → 87b787eb6000
village · port · SUBw4-fence1-village-port-011 · 72150e6e6671 → 2412065da911
village · port · SUBw4-fence1-village-port-012 · 7c9377d8b57d → 2a7a73435ca8
village · port · SUBw4-fence1-village-port-013 · df55e66ebed8 → 474d50bac768
village · port · SUBw4-fence1-village-port-014 · c390861f5dd9 → de2b0ccab887
village · crossroads · SUBw4-fence1-village-crossroads-001 · 21a5da368e98 → a1eb582ee04e
village · crossroads · SUBw4-fence1-village-crossroads-003 · a567473981e4 → 5baa1dd62b8b
village · crossroads · SUBw4-fence1-village-crossroads-006 · 9839e8f869d2 → 998336896cf2
village · crossroads · SUBw4-fence1-village-crossroads-007 · 0fa333718851 → 920f6c9948ca
village · crossroads · SUBw4-fence1-village-crossroads-010 · b6f9f93e202c → 7ee12b9be39c
village · crossroads · SUBw4-fence1-village-crossroads-013 · 4b66c268255c → c97c733eb7dc
town · isolated · SUBw4-fence1-town-isolated-000 · 18d4c82743c8 → 80c5b99d4cf2
town · isolated · SUBw4-fence1-town-isolated-001 · 22a2f50733cb → 4965c20d62f1
town · isolated · SUBw4-fence1-town-isolated-002 · bd1af417d919 → 01747ea8f427
town · isolated · SUBw4-fence1-town-isolated-003 · 23fce50ba0c2 → 069fdb022145
town · isolated · SUBw4-fence1-town-isolated-004 · e0dcf845c9b6 → a2eb6bca49f2
town · isolated · SUBw4-fence1-town-isolated-005 · 2ec09497772e → 52d4297c593b
town · isolated · SUBw4-fence1-town-isolated-006 · 66bd1bbb688d → d97713c8e028
town · isolated · SUBw4-fence1-town-isolated-007 · 2a9f2bb053f0 → b5a4e435ad83
town · isolated · SUBw4-fence1-town-isolated-008 · da0384ff1422 → 92404d4c5abf
town · isolated · SUBw4-fence1-town-isolated-009 · 46565ac5761b → 329048e23710
town · isolated · SUBw4-fence1-town-isolated-010 · 9e75bad4fcfb → 747b1496f20b
town · isolated · SUBw4-fence1-town-isolated-011 · 43e1aa71b6cb → c22b37e8ab4d
town · isolated · SUBw4-fence1-town-isolated-012 · bbbcc30e86d4 → 0f68f6b8b806
town · isolated · SUBw4-fence1-town-isolated-013 · 563141b859d4 → 5e01a5d5206a
town · isolated · SUBw4-fence1-town-isolated-014 · e4a2c8dff84f → c96ab44e4b63
town · port · SUBw4-fence1-town-port-000 · 2e21af584633 → 61b5aba78341
town · port · SUBw4-fence1-town-port-001 · d789fafe411c → 424e7aa39829
town · port · SUBw4-fence1-town-port-002 · bacdf0df6963 → a289b183da3d
town · port · SUBw4-fence1-town-port-003 · 6211e22935c3 → 92a63b585cc0
town · port · SUBw4-fence1-town-port-004 · d5c048f5ed52 → 97aaf432f0a3
town · port · SUBw4-fence1-town-port-005 · 3b10e2649fe9 → 6afb0e7c7009
town · port · SUBw4-fence1-town-port-006 · 56999e63d730 → becbd63e57c0
town · port · SUBw4-fence1-town-port-007 · b64f94e20e2b → 22682224d9a2
town · port · SUBw4-fence1-town-port-008 · 6764a8ac9546 → f033e0f9831c
town · port · SUBw4-fence1-town-port-009 · e7689e58b321 → 50abec196f0d
town · port · SUBw4-fence1-town-port-010 · aad05e04f3ca → e6cd7005d5ed
town · port · SUBw4-fence1-town-port-011 · 1ff77a820788 → a878b0e6fb3d
town · port · SUBw4-fence1-town-port-012 · 49481cea6b7c → 110c2417ebb9
town · port · SUBw4-fence1-town-port-013 · c0b300de05b8 → ae053e78aef0
town · port · SUBw4-fence1-town-port-014 · 04595ca5f6dc → 94e63b2c95bb
town · crossroads · SUBw4-fence1-town-crossroads-008 · f79a5be88968 → 1fa263917e63
town · crossroads · SUBw4-fence1-town-crossroads-009 · a4938e783c2f → 7e993d2b1103
town · crossroads · SUBw4-fence1-town-crossroads-010 · 666b3f5a0169 → 245503a53ce2
city · isolated · SUBw4-fence1-city-isolated-000 · 184bdabe7f18 → f3a2a0120bbd
city · isolated · SUBw4-fence1-city-isolated-001 · a5ef683d9c68 → c2e4be7b3257
city · isolated · SUBw4-fence1-city-isolated-002 · 0cf4db4dea03 → 1003683e1d38
city · isolated · SUBw4-fence1-city-isolated-003 · 66e2d3d82cf1 → df387bb6119d
city · isolated · SUBw4-fence1-city-isolated-004 · 5c44f4582bf8 → d18457c79810
city · isolated · SUBw4-fence1-city-isolated-005 · 6e4895930a8c → 4853ee72e6f2
city · isolated · SUBw4-fence1-city-isolated-006 · 6c390b83144b → 15d26f28dfe4
city · isolated · SUBw4-fence1-city-isolated-007 · 19976bfce03e → 99468583d7e3
city · isolated · SUBw4-fence1-city-isolated-008 · 0b2eb89d51cd → 12bca05d6abd
city · isolated · SUBw4-fence1-city-isolated-009 · e15450ae7ed3 → d798827ed5c1
city · isolated · SUBw4-fence1-city-isolated-010 · 95d74d6190eb → 4d9e8a2c3d89
city · isolated · SUBw4-fence1-city-isolated-011 · 160100e35fb8 → fc23f8fb4eae
city · isolated · SUBw4-fence1-city-isolated-012 · 81f47f0bcaa3 → 0f946106ec70
city · isolated · SUBw4-fence1-city-isolated-013 · 820b3080af29 → 516c3b3be34d
city · isolated · SUBw4-fence1-city-isolated-014 · 70d3efe879ad → 9efac86d08a1
city · port · SUBw4-fence1-city-port-000 · 9ae5fbbb024e → 01fd8aa34274
city · port · SUBw4-fence1-city-port-001 · f20398093240 → 7478dc1c7d6a
city · port · SUBw4-fence1-city-port-002 · aefec02ad80f → 1e7a598703a8
city · port · SUBw4-fence1-city-port-003 · 7c4143461a85 → 10748920de69
city · port · SUBw4-fence1-city-port-004 · 4af29766d658 → 0135382e21c6
city · port · SUBw4-fence1-city-port-005 · 39e77ddd0363 → 20c14db0cdca
city · port · SUBw4-fence1-city-port-006 · 1bec90ed5487 → 9f955cf15399
city · port · SUBw4-fence1-city-port-007 · ca1e993a13b8 → 545fde3a1c09
city · port · SUBw4-fence1-city-port-008 · 5fe899296dd7 → f44e4ecd25fb
city · port · SUBw4-fence1-city-port-009 · fc3b6693f244 → 9888215031ac
city · port · SUBw4-fence1-city-port-010 · 2dc6b0e1bec2 → 549c81979e07
city · port · SUBw4-fence1-city-port-011 · 9b4e7daf4ee6 → 429f1a9f0122
city · port · SUBw4-fence1-city-port-012 · e397297095d5 → c5d97c6fa8cc
city · port · SUBw4-fence1-city-port-013 · f1ddfea397b6 → 32551e050fe8
city · port · SUBw4-fence1-city-port-014 · c356de849fa1 → ce75e907d518
city · crossroads · SUBw4-fence1-city-crossroads-009 · 299e7886fe34 → df71f52e60a5
metropolis · isolated · SUBw4-fence1-metropolis-isolated-000 · d4919ca1d001 → 995599beb65f
metropolis · isolated · SUBw4-fence1-metropolis-isolated-001 · 1310543e461b → c157aa60cf27
metropolis · isolated · SUBw4-fence1-metropolis-isolated-002 · 80694024c25f → 94a342c177d3
metropolis · isolated · SUBw4-fence1-metropolis-isolated-003 · d69bf3ab84a0 → 471992db4005
metropolis · isolated · SUBw4-fence1-metropolis-isolated-004 · 73f1a4458bfe → cd5c99693d70
metropolis · isolated · SUBw4-fence1-metropolis-isolated-005 · e028ab3d38ff → 90eb1152d951
metropolis · isolated · SUBw4-fence1-metropolis-isolated-006 · 7e7723bf543d → cfe4f4d06473
metropolis · isolated · SUBw4-fence1-metropolis-isolated-007 · 64a2e2822d75 → abe79bff7c5d
metropolis · isolated · SUBw4-fence1-metropolis-isolated-008 · 0da09e873c69 → 8567bc241863
metropolis · isolated · SUBw4-fence1-metropolis-isolated-009 · 29e52e05a655 → 5de769880705
metropolis · isolated · SUBw4-fence1-metropolis-isolated-010 · 238ddcb0ccc1 → 101d20022243
metropolis · isolated · SUBw4-fence1-metropolis-isolated-011 · c154564574cc → eea9c0927e4f
metropolis · isolated · SUBw4-fence1-metropolis-isolated-012 · a04009c9377e → da0b029c69cd
metropolis · isolated · SUBw4-fence1-metropolis-isolated-013 · 9dba9436f559 → feb5f85d8ac5
metropolis · isolated · SUBw4-fence1-metropolis-isolated-014 · c42a9356a8e6 → 970a0e29d3eb
metropolis · port · SUBw4-fence1-metropolis-port-000 · 21cdd83d1886 → 74a256c0e0bd
metropolis · port · SUBw4-fence1-metropolis-port-001 · 7cfc3547fded → 1516666f01ea
metropolis · port · SUBw4-fence1-metropolis-port-002 · 4c9ce54c139c → e91661353dda
metropolis · port · SUBw4-fence1-metropolis-port-003 · e9fb9565223d → d3e43bae1220
metropolis · port · SUBw4-fence1-metropolis-port-004 · fc0c067480aa → a119779e1cf3
metropolis · port · SUBw4-fence1-metropolis-port-005 · fab489d7ff46 → d186d2197451
metropolis · port · SUBw4-fence1-metropolis-port-006 · 6266ed23234f → cc32fce5ac29
metropolis · port · SUBw4-fence1-metropolis-port-007 · 26b85f305e63 → 274faaa4216a
metropolis · port · SUBw4-fence1-metropolis-port-008 · ccad3db616ba → 92ef26cde5f8
metropolis · port · SUBw4-fence1-metropolis-port-009 · a996531947f7 → d9e13d54bc71
metropolis · port · SUBw4-fence1-metropolis-port-010 · 69231f830452 → 6f40c550da06
metropolis · port · SUBw4-fence1-metropolis-port-011 · 07bae7bdba81 → 5d1c0525285b
metropolis · port · SUBw4-fence1-metropolis-port-012 · a882c239498e → 9a65d2430f9e
metropolis · port · SUBw4-fence1-metropolis-port-013 · 9f4598afd2d0 → 9b1d36bcfc1d
metropolis · port · SUBw4-fence1-metropolis-port-014 · b222c0cdc740 → 4ea97dbe0bdf
metropolis · crossroads · SUBw4-fence1-metropolis-crossroads-000 · 3f3fc530e3d8 → d7c38665bd61
metropolis · crossroads · SUBw4-fence1-metropolis-crossroads-001 · f28676e856fa → e9463d599c23
metropolis · crossroads · SUBw4-fence1-metropolis-crossroads-004 · a807d8e531ed → 0f89273c755f
metropolis · crossroads · SUBw4-fence1-metropolis-crossroads-005 · 5d1c4799c2b4 → 223d6ea50185
```

## 7. The referee (the 1,000, before and after)

`node scripts/audit/soak-review.mjs --count 1000`, base `0c93f0ca0` (196 s) and tip `b6d48ec0e` (322 s, under a parallel suite), each in a clean worktree: 1,000 settlements, 0 errors, 702 findings, CLIMB on both sides. **The findings file is identical, line for line.**

**The twenty most-repeated frames** (`aggregates/repetition-prose.json :: top`, non-chrome): none raised; all twenty equal.

| # | tab | frame (first 90 characters) | towns before | towns after |
|---|---|---|---|---|
| 1 | history | generations of patching and rebuilding have nearly hidden the plan {town} was laid out to. | 439 | 439 |
| 2 | defense | the old families keep the peace, and anyone who breaks it answers to all the neighbours at | 367 | 367 |
| 3 | defense | one criminal ring decides what crime is allowed here. | 306 | 306 |
| 4 | defense | its rules are predictable and it can be bargained with; it puts down random violence becau | 306 | 306 |
| 5 | power | anything official at {town} goes to {town}, and people say little more than that. | 297 | 297 |
| 6 | defense | a functioning court and prison mean crimes carry real consequences. | 293 | 293 |
| 7 | defense | everyone comes and goes by the gates, so smugglers have to get past the garrison and city  | 263 | 263 |
| 8 | defense | effective against opportunistic crime; less effective against organized operations that ca | 260 | 260 |
| 9 | economics | {town} buys in what it cannot make, and the trading keeps as many people busy as the making wou | 232 | 232 |
| 10 | daily_life | {town} is short more often than not. | 225 | 225 |
| 11 | daily_life | some needs are met and some are postponed, and which is which changes month to month. | 225 | 225 |
| 12 | daily_life | every month something it needs waits for money that does not come. | 208 | 208 |
| 13 | defense | a court exists, though the prison system is limited. | 206 | 206 |
| 14 | overview | few in {town} hold an office. | 203 | 203 |
| 15 | economics | it is not a subject anyone raises unprompted. | 203 | 203 |
| 16 | economics | there is always something going out. | 199 | 199 |
| 17 | economics | if one trade is quiet, another is not. | 199 | 199 |
| 18 | defense | the defensive arrangements at {town} are thin. | 195 | 195 |
| 19 | defense | something is in place against most pressures and nothing is in place in depth. | 195 | 195 |
| 20 | economics | the yards here are full of goods bound out and no two of them are the same. | 194 | 194 |

**`coh:tier-noun`:** 0 → 0 (my lines carry no tier noun in a slot of their own; the headline's tier word is the identity's tier label).

**My lines' own frames on the 1,000** (written straight from their writers over the soak's 1,000 births; the town's name → @, numbers → #, the tier noun → T):

| line | distinct frames before → after | most-repeated frame before → after | the record faults before → after |
|---|---|---|---|
| Overview lead (PDF + Foundry) | 400 → 400 | 21 towns ("Poor. @ … has no crisis on its hands this season.", unchanged) → 21; the most-repeated CRISIS frame 18 → 18 | the crisis label as a noun **916 → 0**; "hard season" **247 → 0** |
| identity line | **22 → 181** | **96 → 27** towns | the harbour off the sea **27 → 0**; a herding life at town and above **35 → 0** |
| Settlement Origin | **30 → 72** | 105 → 74 towns | a road reason under a port route **127 → 0** (a port with docks now prints its port reason, and a port without them prints its ground) |

**The walker's phrases (A10) in my files, printed text** (comments excluded), base → tip: `settlementOriginProse.js` "rather than" **3 → 0**, "the arrangement" **1 → 0**. `headlines.js`, `settlementQuickGuide.js` and `narrativeGenerator.js`: unchanged in my lines; their "faction" counts are other symbols' (SW-8). The DS-GEN-11 lines that left carried none.

## 8. Red-first (each record read)

- **D·P5:** `tests/pdf/headlines.test.js` #1 and #1b. Red at the base: the label is printed and "hard season" sits under Comfortable. Green at the tip.
- **A·O2:** the A·O2 case in `tests/domain/settlementQuickGuide.test.js` (planted: a steppe metropolis, an Arabic river port, a Greek road city on riverside ground, five frames over forty seeds), plus the five re-keyed pins. Six red at the base, green at the tip.
- **A·O16:** "a port route without docks founds on the ground the record names" (planted: mountain, plains, desert and coastal ports, five seeds each) and "THROUGH THE PIPELINE …" (planted: ports with and without docks, both directions). The corpus pins are red at the base. The pipeline case is red at `443cf4051`, green at `b6d48ec0e`.
- **B·#28:** `tests/generators/selfVouchReceipt.test.js` "soak1k-6: a record the battery finds clean prints no vouching line" (a planted clean record: no "adds up"). Red at the base, green at the tip.

## 9. The record walkers

`sh scripts/gate-tail.sh npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/ledgerCitationIntegrity.test.js tests/lint/testRatchet.test.js` (after `git fetch origin review-fixes-2026-07-08`): 100 of 101 pass. The roster's `dated` arm grew 168 → 169 by this record, born dated (`_rosterGrowth2026-11-09-style-2-first-impressions`, and the walker's header line). The one red is the roster's `tree` arm, 139 → 147, which is red at the base by MERGE-WAVE's in-flight records and is not touched here. `ledgerCitationIntegrity` and `testRatchet`: green (no new test file).

## 10. CONFIRMED against PLAUSIBLE

**CONFIRMED** (measured or read by this seat):
- the twelve before and after (§4), quoted from the soak's own exports;
- the deltas of §6: the gm row list from the test's own output at the tip; the fence row by row, with the settlementReason-only proof; prose cells 0 by the diff tool; herald, witness and PDF green at the tip;
- every red-first of §8, red at its parent and green at the tip;
- §5's defect: the flag's home read in `priorityHelpers.js`; the rosters with docks printing road reasons at the base, and the pipeline case red at `443cf4051`;
- the referee's figures of §7, and the base/tip red split by running the same files in both worktrees.

**PLAUSIBLE:**
- that every one of the 147 gm rows moves in `settlementReason` alone. The fence's 184 do, by measurement, and the gm's port, isolated and crossroads distribution is the same arms'; but the gm rows were not field-diffed.
- the census law's reading of each new line: every clause was checked against the writer's reads by this seat, one reader.
- that the first-survey and composeIdentity paths print nowhere (grep over `src`).


## What stays

- **SW-B1 · `src/domain/display/stateProse/generalStateProse.js` + `src/components/new/generalDeskRead.js`:** a by-design read arm for DS-GEN-11. It needs a fact atom for `economicViability.issues[severity=by_design]` ∪ `structuralViolations[by_design]`, so that a line can name the oddity a visitor would notice. Until then no line prints on a clean record.
- **SW-B1 · `generalStateProse.js :: originRoutePoolKey` (DS-GEN-6):** the annex's Settlement-origin pools fold on `config.tradeRouteAccess` alone, so a port with no docks draws the `port` pool. That is the same unread docks fact at a second writer. The cure is to read `.inst.hasPort` (or the `ground` arm) there, as `generateNarratives.js` now does.
- **`src/data/narrativeData.js :: TERRAIN_NARRATIVE_HOOKS` (History's origin):** a desert hamlet on a port route draws "grew from a fishing village into a maritime hub". That is lawful by the world law (a port route on non-riverside terrain is maritime) but reads oddly beside "Founded in the desert; the place has no wharf". The pool does not read the docks.
- **`src/domain/summary/settlementQuickGuide.js :: composeIdentity`:** the DM Summary sentence still reads `scopePhrase` raw. No `src` reader prints it today, so the cure is owed only if a reader returns.
