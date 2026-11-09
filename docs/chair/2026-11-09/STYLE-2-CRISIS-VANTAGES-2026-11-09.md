# STYLE-2-CRISIS-VANTAGES — SW-5's record (2026-11-09)

Seat SW-5 · CRISIS-VANTAGES (Opus 5.5), a child of the cloud chair `session_01FbPLbejcfwX5nii12VM673`, this seat's session `session_01FbPLbbJRG3JqFJfFhH3R2A`. Lane `lane/style-2-crisis-vantages-2026-11-09`, cut at **a7bc2e4ce** (= `origin/lane/integration-2026-11-07` HEAD; 5b267578c is an ancestor). Written 2026-11-09 01:45 UTC (from `date`). The law: WIRING-RULINGS §5–§8 (§8 is this lane's charge), STYLE-RULINGS-2 A4 (and A0, A8, A9, A12), the audit's §2.7 rows. **Every line below is for the owner's veto. This seat signs nothing.**

## 1. Outcome

- **The §8 floor is met for the crisis text.** 16 crisis sets (15 kinds; migration's arrivals and departures apart) × 4 surface pools (cover · Overview · Defence · Tonight) × 4 vantages = **256 lines**, 64 kept from #29 (6 of them with the retired word swapped) and **192 new**. Each surface pool holds four different vantages of §8's six; the four pools are a Latin square, so a town's four surfaces always print four different vantages and four different lines (#29's duplicate stays cured by construction); column 0 is #29's own assignment. The seed chooses: column = `fnv1a32(name::kind) % 4` (`kernel/proseHash.js`, zero draws).
- **The other 52 rows** of §2.7: 46 applied, **6 struck** (§5), plus four small additions named in §6.
- **The referee (the 1,000 at the tip vs the base):** the crisis frames' cross-town repeat FELL (most-repeated frame 105 → 33 towns; mean share of its crisis's towns 1.000 → 0.250); the twenty most-repeated story frames did not move (0 rises; the top 20 identical); `coh:tier-noun` 0 → 0.
- **Golden deltas (clean worktrees, each cause against its parent):** gm 194/525 (npcGenerator only), fence 35/360 (stressInstitutionEffects) + 220/360 (npcGenerator), herald 0, prose 0/1,050, witness 0/8, pdf 0/18. All text-only (measured on 60 births: only `npcs[].secret.*`, `npcs[].goal.long`, `npcs[].stressNote` differ). **UNSIGNED — for STYLE-2-MERGE.**

## 2. The commits (one cause each, in order)

| # | sha | cause | files | gm /525 | fence /360 | herald | prose /1,050 | witness /8 | pdf /18 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 8f15a607d | crisis vantages: the §8 floor | `crisisSummaryVantage.js` + 2 pins | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | d52d451fe | causalState: the "why" grid without numbers | `causalState.js` + 4 pins | 0 | 0 | 0 | 0 | 0 | 0 |
| 3 | d76dd0608 | stressInstitutionEffects: 8 lines | data file + 1 pin | 0 | **35** | 0 | 0 | 0 | 0 |
| 4 | a81d0513b | priorityHelpers: craft-import notes | generator | 0 | 0 | 0 | 0 | 0 | 0 |
| 5 | e249e565f | npcGenerator: wartime notes + 3 "rather than" | generator | **194** | **220** | 0 | 0 | 0 | 0 |
| 6 | 15d5e280f | display swaps (market, Tonight red flag, neighbour, blocs) | 4 display files + 3 pins | 0 | 0 | 0 | 0 | 0 | 0 |
| 7 | (this commit) | the record, the roster `dated` 168 → 169 | record + roster + walker header | — | — | — | — | — | — |

Method: `sh scripts/audit/landing-stage.sh measure <stage> <out> <prev>` per commit, each stage a clean `git worktree` at the commit, the base measured first (gm 0 moved against its committed fixture: the base is green). Every moved cell is listed in §9.

## 3. The referee's figures (the 1,000, `soak-review.mjs --count 1000 --workers 4`; both runs 1000 settlements, 0 errors, 702 findings, CLIMB)

**The crisis frames** (scratch script `crisisFrames.mjs`: every town's `crisisSummaryForSurface` line per crisis per surface, the name replaced by `@`; the soak's `repetition-prose.json` reads only the screen tabs and its top 40 holds no crisis frame either side):

| | before (a7bc2e4ce) | after (15d5e280f) |
|---|---|---|
| crisis frames printed | 60 | 240 |
| most-repeated frame | 105 towns (every famine town) | 33 towns |
| mean towns per frame | 72.3 | 18.1 |
| mean share of its crisis's towns | **1.000** | **0.250** |

(departures is never drawn in the 1,000, so its 16 lines are proven by the unit arm only.)

**The twenty most-repeated story frames:** identical at both tips (0 rises, 0 falls). story 0.035 → 0.035; skeleton 0.108 → 0.107; exact 0.047 → 0.047; distinct skeletons 4,048 → 4,093; skeletons in ≥10% of towns 104 → 104. **`coh:tier-noun`: 0 → 0** (the findings file; the unit arm also bans every tier noun in the 256 lines).

**A10's phrase counts** (this seat's scratch matcher — string literals of ≥2 words, comments blanked, word-bounded; SW-0's walker is not on this base, so its figures may differ by the matcher):

| file | before | after |
|---|---|---|
| `crisisSummaryVantage.js` | faction 6 | 0 |
| `causalState.js` | faction 6 · legitimacy score 1 | faction 3 · legitimacy score 1 (not this lane's rows) |
| `stressInstitutionEffects.js` | faction 19 | 18 (the 13 `{faction}` slots and others stay: §5) |
| `priorityHelpers.js` | faction 1 | 1 (not a row) |
| `politicsRead.js` | faction 3 | 0 |
| `npcGenerator.js` | faction 10 · rather than 3 | faction 10 (SW-8's) · rather than 0 |
| printed in the 60 sample dossiers | faction 1,468 · rather than 300 · a stranger 16 · not merely 20 | faction 1,405 · rather than 268 · a stranger 16 · not merely 20 |

**The red-first:** the new `crisisSummaryVantage.test.js` run against the base's module fails (the pools do not exist: "no tests", exit 1); the referee's before column above is the measured defect (every frame printed by 100% of its crisis's towns).

## 4. The twelve soak towns' crisis blocks, before and after (three crises)

Eleven of the twelve carry a crisis (soak1k-11 none); three crises are shown, two with sibling towns in the twelve. soak1k-0, -4 and -10 all fall on column 0 by their names' hashes (a 1-in-16 coincidence; across the 1,000 the migration covers split 25 · 20 · 16 · 10 towns, the famine covers 33 · 28 · 22 · 22).

#### mass_migration/arrivals

| town | surface | before | after |
|---|---|---|---|
| soak1k-0 | cover | Walking into Albamunicipium, you pass tents on both sides of the road: newcomers looking for a place to call home. | Walking into Albamunicipium, you pass tents on both sides of the road: newcomers looking for a place to call home. |
| soak1k-0 | overview | Families have been arriving all season, more than Albamunicipium has roofs or work for. They camp where they can, and the old households keep their distance. | Families have been arriving all season, more than Albamunicipium has roofs or work for. They camp where they can, and the old households keep their distance. |
| soak1k-0 | defence | Newcomers keep arriving in Albamunicipium, and with them come quarrels over space and work that the old families expect someone to settle. | Newcomers keep arriving in Albamunicipium, and with them come quarrels over space and work that the old families expect someone to settle. |
| soak1k-0 | tonight | Albamunicipium's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. | Albamunicipium's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. |
| soak1k-4 | cover | Walking into Portaminus, you pass tents on both sides of the road: newcomers looking for a place to call home. | Walking into Portaminus, you pass tents on both sides of the road: newcomers looking for a place to call home. |
| soak1k-4 | overview | Families have been arriving all season, more than Portaminus has roofs or work for. They camp where they can, and the old households keep their distance. | Families have been arriving all season, more than Portaminus has roofs or work for. They camp where they can, and the old households keep their distance. |
| soak1k-4 | defence | Newcomers keep arriving in Portaminus, and with them come quarrels over space and work that the old families expect someone to settle. | Newcomers keep arriving in Portaminus, and with them come quarrels over space and work that the old families expect someone to settle. |
| soak1k-4 | tonight | Portaminus's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. | Portaminus's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. |
| soak1k-10 | cover | Walking into Olympambelos, you pass tents on both sides of the road: newcomers looking for a place to call home. | Walking into Olympambelos, you pass tents on both sides of the road: newcomers looking for a place to call home. |
| soak1k-10 | overview | Families have been arriving all season, more than Olympambelos has roofs or work for. They camp where they can, and the old households keep their distance. | Families have been arriving all season, more than Olympambelos has roofs or work for. They camp where they can, and the old households keep their distance. |
| soak1k-10 | defence | Newcomers keep arriving in Olympambelos, and with them come quarrels over space and work that the old families expect someone to settle. | Newcomers keep arriving in Olympambelos, and with them come quarrels over space and work that the old families expect someone to settle. |
| soak1k-10 | tonight | Olympambelos's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. | Olympambelos's leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. |

#### recently_betrayed

| town | surface | before | after |
|---|---|---|---|
| soak1k-6 | cover | Becanchihua is wary of new faces since someone trusted sold it out; questions come before help. | In Becanchihua every unfamiliar face is noted, and somebody always asks who let them in. |
| soak1k-6 | overview | Since the betrayal, neighbours in Becanchihua keep their own counsel and their doors shut. | Anyone who arrived in Becanchihua around the time of the betrayal is still being asked where they were. |
| soak1k-6 | defence | Becanchihua is still looking for whoever betrayed it, and every unexplained absence draws a hard look. | At Becanchihua, travellers are asked their business twice, and their answers are remembered. |
| soak1k-6 | tonight | Someone trusted in Becanchihua sold something important, and its leaders still do not know who, or how much was lost. | Whatever was sold out of Becanchihua has a buyer somewhere, and that buyer is still profiting from it. |
| soak1k-9 | cover | Shangjin is wary of new faces since someone trusted sold it out; questions come before help. | Shangjin is wary of new faces since someone trusted sold it out; questions come before help. |
| soak1k-9 | overview | Since the betrayal, neighbours in Shangjin keep their own counsel and their doors shut. | Since the betrayal, neighbours in Shangjin keep their own counsel and their doors shut. |
| soak1k-9 | defence | Shangjin is still looking for whoever betrayed it, and every unexplained absence draws a hard look. | Shangjin is still looking for whoever betrayed it, and every unexplained absence draws a hard look. |
| soak1k-9 | tonight | Someone trusted in Shangjin sold something important, and its leaders still do not know who, or how much was lost. | Someone trusted in Shangjin sold something important, and its leaders still do not know who, or how much was lost. |

#### famine

| town | surface | before | after |
|---|---|---|---|
| soak1k-3 | cover | In Al-karez you see hungry children at the doors, and long queues wherever food is handed out. | In Al-karez food costs more every week, and people spend every coin they have on it. |
| soak1k-3 | overview | Every family in Al-karez is eating less than it did, and those with stores put by are not sharing. | The harvest in Al-karez has failed, and its leaders are rationing what is left while they decide whom to feed first. |
| soak1k-3 | defence | Hunger has made Al-karez tense: what food is stored is watched day and night, and every quarrel over food turns ugly fast. | In Al-karez stealing food is the crime of the season, and neighbours who once shared now bar their doors. |
| soak1k-3 | tonight | Al-karez has lost a second harvest. Its leaders have begun rationing, while the families who can afford it hoard what they have. | Anyone who comes to Al-karez with food to sell is welcome; anyone who comes to eat is not. |
## 5. Rows struck under the census law (6), with the reason

`stressInstitutionEffects.js` 73, 131, 151, 340, 393, 515 — the audit's NEW was "(the swap: faction → power)" on `{faction}`. **Struck:** `{faction}` is a SLOT, not a printed word: `npcGenerator.js :: generateSecret` fills it through `fillSentenceSlots(effect.stakes, { faction: govFaction, … })` with the governing power's NAME, so the dossier prints a name, never the word. The swap would rename a template key that 13 rows of the file and the generator share — a code identifier, which A8 says never moves. Default: left as is; the walker (SW-0) will count `{faction}` as "faction" — the chair may allow-list the slot token by name or rule a key rename as one SW-8 cause.

## 6. Additions beyond the rows (each inside a row's own sentence or ruling)

- `politicsRead.js` :: `projectBloc` — the `who` fallback `'a faction'` → `'a power'` (it prints inside row 78's sentence).
- `tonightAtTheTable.js` — the red flag's fallback `'broken supply chain.'` (the system phrase the audit's `needs` named) no longer prints; with no recorded consequence the line ends after "when it comes up."
- `npcGenerator.js` — A9: its three "rather than" literals (lines of `STRESS_GOALS.monster_pressure`, `.mass_migration`, a debt secret) become statements; the mil note's declared twin and its sibling key in `NPC_GOAL_SIBLINGS` move with the original (the resolver keys by text; needs/excludes unchanged).
- `priorityHelpers.js` — the route word's underscore ("mountain_pass") no longer prints.
- The espionage pin (`espionageDoctrineStage.test.js` ES-5): the deriver no longer speaks raw scores, so the fixture gained a second law house (`{ name: 'The Gaol' }`) to keep one figure-bearing sentence ("2 offices of the law keep order here.") on offer to the digit screen — the anchor kept at full strength, not loosened.

## 7. Pins re-keyed by identity and cause (never loosened)

`tests/domain/crisis/crisisSummaryVantage.test.js` (rewritten for the pools: the square, 256 distinct slotted lines with the defence/digit/tier-noun/retired-word bans and the Defence tab's stored-food words, the fallback, the direction, the seed arm — one town stable, four surfaces four lines, sibling towns over every column — and the generated-town arm) · `tests/components/tableView.test.jsx` (the Tonight line read from the surface's pool) · `tests/domain/pietyCausalLifts.test.js` (exact new sentences; the amplifier asserted in the delta, never in the sentence) · `tests/domain/causalState.test.js` · `tests/domain/faithChannelWiring.test.js` · `tests/domain/espionageDoctrineStage.test.js` (§6) · `tests/generators/sentenceSlotFallback.test.js` (soak1k-312's stakes) · `tests/domain/politicsCredibilityRead.test.js` · `tests/domain/sentenceOpeningFallbacks.test.js` · `tests/domain/tonightAtTheTable.test.js`. `SUMMARY_COLUMNS` is derived from the square (the tuning register's P2 stays shrink-only).

**The governing suites** (214 test files naming a changed module): at the tip every red is either the base's own (the same tests red at a7bc2e4ce, run there: `layerBoundaries` (the foodGenerator/isolationSupport cycle), `readerValidationOnPage` (soak1k-24), `worldPulseFactionSeating` ×2, `negativeAssertionAnchor` ×2 (this lane's file is not in its list), `proseWiringCensus` ×2) or a golden surface this lane moves, UNSIGNED: `generatorGoldenMaster`, `faithFieldDormancyFence` ×2, `worldFactRederive` (A7's record digests over the stride). **The record walkers:** §10.

**Owed elsewhere (outside the manifest; named for the chair, not touched):** `docs/census/declarations/npcGenerator.STRESS_GOAL_OVERRIDES.json` rows `wartime.gov.note` and `wartime.mil.note` still carry the old note text (no test reads the text; the ledger is history of CENSUS-4b, needs/excludes unchanged); `tests/fixtures/legacy-saves/people-car-v1-2026-11-07.json` holds old stakes text as saved records (correct as history); `src/components/home/landingFixture.js` carries an old causal reason with "(piety ×1.40)" (R6's door, SW-6).

## 8. Every line, old → new

### 8.1 `crisisSummaryVantage.js` — the 256 lines (k = the column; column 0 "kept" = #29's line unchanged)

#### under_siege

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | The roads into {name} end at the besiegers' lines, and nothing goes in or out without their leave. | kept |
| cover | 1 | newcomer | Whoever was visiting {name} when the besiegers closed the roads is stuck there now, one more mouth on food that cannot be replaced. | new |
| cover | 2 | trade | No cart has come into {name} since the besiegers cut the roads, and nothing has gone out. | new |
| cover | 3 | watch | From {name} you can see the besiegers' fires on every road, and the lookouts count them each night. | new |
| overview | 0 | local | {name} is cut off. Food comes from what is already inside, and people ration it a little tighter every day. | kept |
| overview | 1 | trade | Nothing comes into {name} and nothing leaves; the fields go untended, and people make do with what they have left. | new |
| overview | 2 | official | {name}'s leaders are counting what is left in the stores and deciding who gets how much. | new |
| overview | 3 | newcomer | Visitors trapped in {name} by the siege eat the same short rations as everyone else, and are not always welcome to them. | new |
| defence | 0 | watch | {name} is surrounded. Everyone who can keep a lookout is keeping one, and nobody sleeps through the night. | kept |
| defence | 1 | official | Those who answer for {name}'s safety must choose between holding out and seeking terms, and every week makes the choice harder. | new |
| defence | 2 | local | Every able body in {name} takes a turn at the lookout, and families sleep in their clothes. | new |
| defence | 3 | traveller | To reach {name} you would have to cross the besiegers' lines first, and they let nobody through. | new |
| tonight | 0 | official | {name} is under siege and its supply roads are cut; every order its leaders give is about lasting another week. | kept |
| tonight | 1 | watch | The besiegers around {name} have not moved, and the lookouts wait for the night they do. | new |
| tonight | 2 | newcomer | Anyone new inside {name} is another mouth to feed and perhaps a spy for the besiegers, and is treated as both. | new |
| tonight | 3 | trade | With the roads cut, {name} lives on what it has stored, and whoever holds food can name their price. | new |

#### famine

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | In {name} you see hungry children at the doors, and long queues wherever food is handed out. | kept |
| cover | 1 | newcomer | Arriving in {name}, you are asked first whether you carry food, and only then what you want. | new |
| cover | 2 | trade | In {name} food costs more every week, and people spend every coin they have on it. | new |
| cover | 3 | watch | In {name} the food stores are guarded day and night, and nobody carrying a sack goes unquestioned. | new |
| overview | 0 | local | Every family in {name} is eating less than it did, and those with stores put by are not sharing. | kept |
| overview | 1 | trade | Nobody in {name} earns a normal living while the famine lasts; what money there is goes on food, and whoever sells grain names the price. | new |
| overview | 2 | official | The harvest in {name} has failed, and its leaders are rationing what is left while they decide whom to feed first. | new |
| overview | 3 | newcomer | Newcomers to {name} find doors shut and no work going; nobody has food to spare for another mouth. | new |
| defence | 0 | watch | Hunger has made {name} tense: what food is stored is watched day and night, and every quarrel over food turns ugly fast. | kept |
| defence | 1 | official | Those who keep order in {name} spend their days guarding the stores and breaking up fights in the queues. | new |
| defence | 2 | local | In {name} stealing food is the crime of the season, and neighbours who once shared now bar their doors. | new |
| defence | 3 | traveller | On the road into {name}, hungry eyes follow anyone carrying a sack or driving a cart. | new |
| tonight | 0 | official | {name} has lost a second harvest. Its leaders have begun rationing, while the families who can afford it hoard what they have. | kept |
| tonight | 1 | watch | In {name} the food stores are under guard, and the guards are as hungry as everyone else. | new |
| tonight | 2 | newcomer | Anyone who comes to {name} with food to sell is welcome; anyone who comes to eat is not. | new |
| tonight | 3 | trade | In {name} whoever holds grain decides who eats, and they know it. | new |

#### occupied

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | Foreign officials run {name} now; the locals answer their questions politely and say as little as they can. | kept |
| cover | 1 | newcomer | Newcomers to {name} are questioned by the occupiers' officials before any local will say a word to them. | new |
| cover | 2 | trade | Everything sold in {name} pays the occupiers their due first, and the merchants keep their prices and their opinions to themselves. | new |
| cover | 3 | watch | At every road into {name}, the occupiers' officials note who comes and goes. | new |
| overview | 0 | local | In {name} people answer to foreign officials now, and mind what they say in the street. | kept |
| overview | 1 | trade | The occupiers take {name}'s revenue, and the local offices work only under their eye. | new |
| overview | 2 | official | {name}'s own leaders keep their titles, but every decision they make goes to the occupiers for approval. | new |
| overview | 3 | newcomer | A newcomer in {name} is taken for the occupiers' informer until they prove otherwise. | new |
| defence | 0 | watch | The occupiers watch {name} closely, and the resistance watches them back, careful never to be caught. | kept |
| defence | 1 | official | Keeping order in {name} is the occupiers' business now, and the locals are not trusted to help. | new |
| defence | 2 | local | In {name} people keep their heads down; a careless word to the wrong neighbour can bring the occupiers to the door. | new |
| defence | 3 | traveller | Travellers through {name} are stopped and asked their business by officials who are not from here. | new |
| tonight | 0 | official | {name} is governed by an outside power. Its own leaders keep their titles and do as they are told. | kept |
| tonight | 1 | watch | The occupiers watch {name} for the resistance, and the resistance watches for its chance. | new |
| tonight | 2 | newcomer | People who are not known faces in {name} are what its quiet resistance needs most, and what the occupiers fear most. | new |
| tonight | 3 | trade | The occupiers take what {name} earns, and the people who once shared in it now fill someone else's purse. | new |

#### politically_fractured

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name} has no one in charge: each part of it answers to a different power, and each tells you a different story about who rules. | {name} has no one in charge: each part of it answers to a different faction, and each tells you a different story about who rules. |
| cover | 1 | newcomer | Newcomers to {name} are asked, sooner or later, whose side they are on. | new |
| cover | 2 | trade | Doing business in {name} means knowing whose ground you stand on, and dealing with the power that holds it. | new |
| cover | 3 | watch | The rival powers in {name} each keep an eye on their own ground and on whoever crosses it. | new |
| overview | 0 | local | In {name} even ordinary business means choosing a side, and neighbours notice who you deal with. | kept |
| overview | 1 | trade | In {name} nothing gets decided: repairs are put off, and every problem is left for later. | new |
| overview | 2 | official | No one council speaks for {name}; each power that holds part of it governs its own share and blocks the rest. | new |
| overview | 3 | newcomer | A newcomer in {name} soon finds that whom they buy from and whom they drink with is taken as a choice of side. | new |
| defence | 0 | watch | {name} is split between rival powers, and a quarrel where their ground meets can turn into a brawl. | {name} is split between rival factions, and a quarrel where their ground meets can turn into a brawl. |
| defence | 1 | official | No one in {name} can call everyone to its defence; each power guards its own ground and trusts nobody else's. | new |
| defence | 2 | local | People in {name} avoid the streets where one power's ground meets another's, most of all after dark. | new |
| defence | 3 | traveller | Crossing {name}, you pass from one power's ground to another's, and each side notes which way you came. | new |
| tonight | 0 | official | Two or three powers each hold part of {name}, and none will give way, so nothing that needs them all gets done. | Two or three factions each hold part of {name}, and none will give way, so nothing that needs them all gets done. |
| tonight | 1 | watch | Each power in {name} counts its friends and watches its rivals, waiting for one of them to slip. | new |
| tonight | 2 | newcomer | Anyone new in {name} is worth winning over, and every power will try before the week is out. | new |
| tonight | 3 | trade | Anything in {name} that needs all its powers to agree, from a repair to a ruling, waits, and the waiting costs everyone. | new |

#### indebted

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name} owes more than it can ever pay, and the creditor's agents are as much at home in its streets as its own people. | kept |
| cover | 1 | newcomer | In {name}, a newcomer is asked straight away whether they come from the creditor. | new |
| cover | 2 | trade | Much of what {name} earns goes straight to its creditor, and nothing is left over to build with. | new |
| cover | 3 | watch | The creditor's agents in {name} keep a close eye on every cart that leaves and every coin that changes hands. | new |
| overview | 0 | local | Everything {name} earns goes first to the debt, and people grumble that they now work for the creditor. | kept |
| overview | 1 | trade | Whatever {name} sells, a share is set aside for the creditor before anyone else is paid. | new |
| overview | 2 | official | {name}'s leaders spend more of their time answering the creditor than governing their own people. | new |
| overview | 3 | newcomer | A newcomer with coin is welcome in {name}, where every household is short of it. | new |
| defence | 0 | watch | The creditor keeps its own people in {name}, watching where every coin goes. | kept |
| defence | 1 | official | Those who keep order in {name} must keep it for the creditor too, and the people know it. | new |
| defence | 2 | local | People in {name} hide what little they have put by, in case the creditor's agents come asking. | new |
| defence | 3 | traveller | Passing through {name}, you meet the creditor's agents before you meet its own officials. | new |
| tonight | 0 | official | Every plan {name}'s leaders make must first pass the creditor, and most of them do not. | kept |
| tonight | 1 | watch | The creditor's people in {name} are watching for anything worth taking in place of payment. | new |
| tonight | 2 | newcomer | Someone new in {name} could be a way out of the debt or the creditor's next collector, and people will want to know which. | new |
| tonight | 3 | trade | Every coin {name} earns is spoken for before it arrives, and the creditor decides what is left. | new |

#### recently_betrayed

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name} is wary of new faces since someone trusted sold it out; questions come before help. | kept |
| cover | 1 | newcomer | A newcomer to {name} gets polite answers and no help until someone local will vouch for them. | new |
| cover | 2 | trade | In {name} deals that once ran on a handshake now want witnesses, and some have stopped altogether. | new |
| cover | 3 | watch | In {name} every unfamiliar face is noted, and somebody always asks who let them in. | new |
| overview | 0 | local | Since the betrayal, neighbours in {name} keep their own counsel and their doors shut. | kept |
| overview | 1 | trade | Since the betrayal, much of {name}'s business that ran on trust has slowed or stopped. | new |
| overview | 2 | official | People in {name} no longer trust those in charge, and its leaders are still trying to learn what was lost. | new |
| overview | 3 | newcomer | Anyone who arrived in {name} around the time of the betrayal is still being asked where they were. | new |
| defence | 0 | watch | {name} is still looking for whoever betrayed it, and every unexplained absence draws a hard look. | kept |
| defence | 1 | official | Those who keep {name} safe are questioning everyone who could have reached what was sold, and nobody is above suspicion. | new |
| defence | 2 | local | In {name} neighbours watch one another now, and an old friend's late visit draws questions. | new |
| defence | 3 | traveller | At {name}, travellers are asked their business twice, and their answers are remembered. | new |
| tonight | 0 | official | Someone trusted in {name} sold something important, and its leaders still do not know who, or how much was lost. | kept |
| tonight | 1 | watch | Whoever betrayed {name} may still be there, and those looking for them have not given up. | new |
| tonight | 2 | newcomer | People new to {name} are the only ones with no motive for the betrayal, which makes them useful to anyone hunting the traitor. | new |
| tonight | 3 | trade | Whatever was sold out of {name} has a buyer somewhere, and that buyer is still profiting from it. | new |

#### infiltrated

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | Nothing seems wrong in {name} at first; it takes a while to notice how many decisions favour the same outsiders. | kept |
| cover | 1 | newcomer | A newcomer to {name} may notice the same few faces wherever decisions are made, and nobody local finds it odd. | new |
| cover | 2 | trade | In {name} the contracts and permits keep going to the same outside hands, and nobody can say why. | new |
| cover | 3 | watch | Nobody in {name} is watching for spies, which is what the people who have got inside are counting on. | new |
| overview | 0 | local | Life in {name} goes on as usual, but odd decisions keep being made, and nobody can say who wanted them. | kept |
| overview | 1 | trade | Nothing has been taken from {name} yet; whoever has got inside wants a say in its decisions, not its money. | new |
| overview | 2 | official | {name}'s leaders believe their decisions are their own, though someone outside has a hand in most of them. | new |
| overview | 3 | newcomer | An outsider in {name} alarms nobody, which is how the real outsiders got in. | new |
| defence | 0 | watch | Agents of an outside interest move through {name} unchallenged, because nobody knows to look for them. | kept |
| defence | 1 | official | Those who answer for {name}'s safety see no threat, and nobody has told them to look. | new |
| defence | 2 | local | People in {name} feel safe, and nothing they can see tells them otherwise. | new |
| defence | 3 | traveller | A traveller who pays attention in {name} may see the same face in too many places. | new |
| tonight | 0 | official | Someone outside {name} is quietly shaping its decisions, and its leaders have not noticed. | kept |
| tonight | 1 | watch | What is said in {name}'s councils keeps reaching people who should not hear it, and nobody has worked out how. | new |
| tonight | 2 | newcomer | Fresh eyes in {name} may see what its own people have stopped noticing: decisions that serve someone else. | new |
| tonight | 3 | trade | Someone outside {name} is steering its decisions, and for now they want influence, not coin. | new |

#### plague_onset

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | A sickness is spreading in {name}: doors are shut, and people keep their distance in the street. | kept |
| cover | 1 | newcomer | Anyone arriving in {name} is asked where they came from and whether they are well before anyone will take their hand. | new |
| cover | 2 | trade | Fewer people come to market in {name} since the sickness began, and some goods have stopped arriving altogether. | new |
| cover | 3 | watch | In {name} some houses are marked and watched and others are not, and nobody seems to agree on the rules. | new |
| overview | 0 | local | The sickness in {name} is spreading, and people would rather argue over where it came from than stay indoors. | kept |
| overview | 1 | trade | Travel is discouraged in {name}, fewer come to market, and the goods the carts used to bring run short. | new |
| overview | 2 | official | {name}'s leaders argue over where the sickness came from while it spreads. | new |
| overview | 3 | newcomer | Newcomers in {name} are eyed as the likely source of the sickness, whatever the truth. | new |
| defence | 0 | watch | Those trying to keep {name}'s sick apart from the healthy are being ignored, and the quarantine holds nowhere. | kept |
| defence | 1 | official | Those in charge of {name} have ordered a quarantine they cannot make people keep. | new |
| defence | 2 | local | In {name} some families shut themselves in and some carry on as before, and the sickness passes between them. | new |
| defence | 3 | traveller | Coming into {name}, you pass shuttered doors, and nobody can tell you which houses hold the sick. | new |
| tonight | 0 | official | A sickness is spreading in {name}, and its leaders can neither agree where it came from nor get people to accept a quarantine. | kept |
| tonight | 1 | watch | The quarantine in {name} is kept in some streets and ignored in others, and the sickness goes where it likes. | new |
| tonight | 2 | newcomer | Anyone new to {name} will be asked whether they carry the sickness, and few will believe the answer. | new |
| tonight | 3 | trade | With fewer buyers and fewer carts, {name}'s trade shrinks for as long as the sickness lasts. | new |

#### succession_void

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name}'s last leader is dead and nobody has taken their place; everyone you meet has a view on who should. | kept |
| cover | 1 | newcomer | Newcomers to {name} are courted by every claimant to the empty seat, each hoping to count one more friend. | new |
| cover | 2 | trade | Big business waits in {name} until a new leader is chosen, and the merchants hold back their coin. | new |
| cover | 3 | watch | In {name} the followers of rival claimants eye each other across the street, waiting for the first push. | new |
| overview | 0 | local | With the old leader dead and no one in their place, people in {name} wait to see who comes out on top. | kept |
| overview | 1 | trade | Nothing large is decided in {name} until the seat is filled, and each office does as it sees fit meanwhile. | new |
| overview | 2 | official | Each office in {name} now runs itself, and no one has the standing to make them answer. | new |
| overview | 3 | newcomer | A newcomer in {name} is soon asked which claimant they favour, and the answer is remembered. | new |
| defence | 0 | watch | Rivals for {name}'s empty seat are gathering followers, and it may come to blows before anyone is chosen. | kept |
| defence | 1 | official | With no one in {name}'s seat, nobody can give the order that calls everyone to its defence. | new |
| defence | 2 | local | People in {name} keep clear of the claimants' followers, who grow louder and bolder each week. | new |
| defence | 3 | traveller | Travellers in {name} see the claimants' followers gathering openly, and hear talk of who will strike first. | new |
| tonight | 0 | official | No one in {name} has the standing to give an order others must obey, and every rival for the seat knows it. | kept |
| tonight | 1 | watch | The rivals for {name}'s empty seat each count their followers, and each fears the others will move first. | new |
| tonight | 2 | newcomer | Every claimant in {name} wants backing from outside, and anyone newly arrived will be asked for theirs. | new |
| tonight | 3 | trade | Until {name} has a leader again, no large bargain can be struck there, and the merchants are losing patience. | new |

#### monster_pressure

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | The roads around {name} are dangerous now: carts have gone missing, and a farmstead went up in flames last week. | kept |
| cover | 1 | newcomer | Anyone who reaches {name} by road is asked what they saw on the way, and listened to closely. | new |
| cover | 2 | trade | Fewer carts reach {name} each month, and the drivers who still come travel in company and charge more for it. | new |
| cover | 3 | watch | Lookouts around {name} watch the roads and the edges of the fields, and nobody lingers outside once the light goes. | new |
| overview | 0 | local | Nobody in {name} goes out after dark now, and every family has a story of something seen at the edge of the fields. | kept |
| overview | 1 | trade | Carts have stopped coming to {name}, more is spent on keeping the roads safe, and what does arrive costs more. | new |
| overview | 2 | official | Those in charge of {name} spend more on its safety every season, and still cannot stop the attacks. | new |
| overview | 3 | newcomer | Newcomers who reach {name} by road are greeted with relief that they made it at all. | new |
| defence | 0 | watch | Whatever is attacking around {name}, wolves, raiders or worse, is getting bolder, and the lookouts count the days between attacks. | kept |
| defence | 1 | official | Those who keep {name} safe cannot cover every road and every field, and the attackers seem to know it. | new |
| defence | 2 | local | Families in {name} bring their animals in at dusk and bar their doors, and nobody works the far fields alone. | new |
| defence | 3 | traveller | The roads to {name} are dangerous: travellers move in groups and by daylight, and some never arrive. | new |
| tonight | 0 | official | Those who answer for {name}'s safety spend more on it every season, and still the attacks come. | kept |
| tonight | 1 | watch | The attacks around {name} follow a pattern, and the lookouts are beginning to see it. | new |
| tonight | 2 | newcomer | Anyone new to {name} who knows how to fight or track will be asked to help before they have unpacked. | new |
| tonight | 3 | trade | Every cart that fails to reach {name} is food or goods it goes without, and the shortfall grows each week. | new |

#### insurgency

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name} looks calm, but its offices are half empty and orders go unanswered; one of its strongest powers has turned against those in charge. | {name} looks calm, but its offices are half empty and orders go unanswered; a powerful faction has turned against those in charge. |
| cover | 1 | newcomer | Newcomers to {name} are asked, quietly, whether they come on the government's business. | new |
| cover | 2 | trade | In {name} taxes are disputed and some offices no longer send their revenue on, and merchants are unsure whom they owe. | new |
| cover | 3 | watch | Nobody in {name} fights in the open; those watching are counting who still obeys the government and who has stopped. | new |
| overview | 0 | local | People in {name} are choosing between the government and the power that defies it, and many have stopped doing what the government asks. | People in {name} are choosing between the government and the faction that defies it, and many have stopped doing what the government asks. |
| overview | 1 | trade | Taxes in {name} are disputed, some offices keep the revenue they once sent on, and the government runs on habit. | new |
| overview | 2 | official | Those in charge of {name} still give orders, but fewer of them are carried out each week. | new |
| overview | 3 | newcomer | A newcomer in {name} soon learns that the government's word counts for less than it seems. | new |
| defence | 0 | watch | There is no fighting in {name}'s streets; the danger is quieter, officials who will not act and orders that go nowhere. | kept |
| defence | 1 | official | Those who keep order in {name} cannot be sure whose side their own people are on. | new |
| defence | 2 | local | In {name} people keep out of the quarrel between the government and the power that defies it, and away from anyone asking questions. | new |
| defence | 3 | traveller | Passing through {name}, you would see nothing amiss unless you asked who is really in charge. | new |
| tonight | 0 | official | Those in charge of {name} know one of its strongest powers is defying them, and cannot say so openly without making it stronger. | Those in charge of {name} know a powerful faction is defying them, and cannot say so openly without making it stronger. |
| tonight | 1 | watch | The power defying {name}'s government grows quietly, and those watching it cannot act in the open. | new |
| tonight | 2 | newcomer | Those in charge of {name} need something done that cannot be official, and someone new is whom they would ask. | new |
| tonight | 3 | trade | Some of {name}'s offices no longer send their revenue on, and the government runs on less each season. | new |

#### religious_conversion

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name}'s faith is in dispute: you hear two kinds of prayer in its streets, and people are careful which one they join. | kept |
| cover | 1 | newcomer | Newcomers to {name} are asked, sooner or later, which faith they keep, and the answer decides who will deal with them. | new |
| cover | 2 | trade | In {name} feast days and fairs are held twice over, once for each faith, and trade between the two grows harder. | new |
| cover | 3 | watch | In {name} each faith watches the other's gatherings closely, and a loud sermon draws a crowd from both. | new |
| overview | 0 | local | Families in {name} are divided over faith, and old friends now worship apart. | kept |
| overview | 1 | trade | The tithe in {name} is split two ways, and trade between the faithful of each grows harder. | new |
| overview | 2 | official | {name}'s leaders cannot settle which faith the place keeps, and the old house's property has no clear owner. | new |
| overview | 3 | newcomer | A newcomer in {name} is soon courted by both faiths, each hoping to count one more. | new |
| defence | 0 | watch | Arguments over faith in {name} run hot, and a feast day can end in a fight. | kept |
| defence | 1 | official | Those who keep order in {name} are kept busy by quarrels between the faiths, and are trusted by neither. | new |
| defence | 2 | local | In {name} families keep away from the other faith's feasts, and words in the street can turn to blows. | new |
| defence | 3 | traveller | Travellers in {name} do well to keep their prayers to themselves; both faiths are quick to take offence. | new |
| tonight | 0 | official | Which faith {name} keeps has split its people, and its leaders cannot settle it to everyone's satisfaction. | kept |
| tonight | 1 | watch | Each faith in {name} watches the other for an insult, and the next feast day could end in a fight. | new |
| tonight | 2 | newcomer | A newcomer in {name} is pressed to choose a faith, and whichever they choose, half the place will notice. | new |
| tonight | 3 | trade | Records, oaths and property in {name} once rested on one faith; now nobody is sure who holds them. | new |

#### slave_revolt

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | Work has stopped across {name}: the enslaved have downed their tools, and their owners stand by not knowing what to do. | kept |
| cover | 1 | newcomer | Newcomers to {name} are watched by owners and rebels alike, each wondering which side they will take. | new |
| cover | 2 | trade | Less is made in {name} since the revolt began; the owners keep their gangs only on work they can watch. | new |
| cover | 3 | watch | Everyone in {name} set to keep order is busy with the revolt, and every other duty waits. | new |
| overview | 0 | local | Whole work gangs in {name} have downed their tools, and the owners argue over whether to bargain or to crack down. | kept |
| overview | 1 | trade | Work across {name} has shrunk to what the owners can watch, and less gets made each week. | new |
| overview | 2 | official | Those in charge of {name} are pressed by the owners to crack down, and have not yet decided whether to bargain instead. | new |
| overview | 3 | newcomer | A newcomer in {name} is asked whether they keep slaves, and the answer marks them to both sides. | new |
| defence | 0 | watch | {name}'s enslaved are in open defiance, and everyone set to keep order is busy containing them. | kept |
| defence | 1 | official | Those who keep order in {name} are stretched thin containing the revolt, and have nothing left for anything else. | new |
| defence | 2 | local | Owners in {name} lock their doors at night, and the enslaved who still work do so under watch. | new |
| defence | 3 | traveller | Travellers through {name} find work stopped and owners on edge, and are asked whether they bring help. | new |
| tonight | 0 | official | Those in charge of {name} must choose between bargaining with the rebels and crushing them, and the owners press for the second. | kept |
| tonight | 1 | watch | The rebels in {name} have demands, and those keeping order wait to see whether anyone will listen. | new |
| tonight | 2 | newcomer | The rebels in {name} have demands and no one to carry them; an outsider could be that person. | new |
| tonight | 3 | trade | Every day the revolt in {name} lasts, less is made and the owners lose more, and their patience is running out. | new |

#### wartime

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | {name} is in a kingdom at war: army carts pass through, and the war is all anyone talks about. | kept |
| cover | 1 | newcomer | Newcomers to {name} are asked whether they come from the front, and what news they bring. | new |
| cover | 2 | trade | The war drives {name}'s prices: some goods grow scarce, and a few people grow rich on the army's contracts. | new |
| cover | 3 | watch | {name} watches its roads for deserters and spies, now that the kingdom is at war. | new |
| overview | 0 | local | The war is far from {name}, but it touches every household: the prices, the news, the carts going by. | kept |
| overview | 1 | trade | The war takes much of the kingdom's money, and in {name} prices move with every piece of news from the front. | new |
| overview | 2 | official | Every season the crown asks {name} for more, and its leaders must weigh what they owe the war against what the place needs. | new |
| overview | 3 | newcomer | Anyone new in {name} might be a deserter, a spy or a recruiter, and is treated warily until known. | new |
| defence | 0 | watch | In wartime {name} watches its roads for deserters, spies and the army's own requisition officers alike. | kept |
| defence | 1 | official | Those who keep {name} safe have fewer hands than before, with men called away to the war. | new |
| defence | 2 | local | In {name} the families whose men were called up wait for news, and the rest keep an eye on the road. | new |
| defence | 3 | traveller | On the roads near {name} you meet army carts and the crown's officers, and give way to both. | new |
| tonight | 0 | official | The kingdom's war makes its demands on {name}, in men, carts and supplies, and its leaders must decide how much to give. | kept |
| tonight | 1 | watch | In {name} the crown's officers come for requisitions, and people watch closely what they take. | new |
| tonight | 2 | newcomer | A crown officer wants more from {name} than it can spare, and someone new might find a way between giving in and refusing. | new |
| tonight | 3 | trade | In wartime {name}'s trade follows the army: what the war needs sells, and the rest waits. | new |

#### mass_migration · arrivals

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | Walking into {name}, you pass tents on both sides of the road: newcomers looking for a place to call home. | kept |
| cover | 1 | newcomer | The families arriving in {name} want a roof and work, and find too few of either to go round. | new |
| cover | 2 | trade | With so many new mouths in {name}, food is running short and there is not work for everyone who wants it. | new |
| cover | 3 | watch | The newcomers' camps in {name} grow every week, and the old households watch them uneasily. | new |
| overview | 0 | local | Families have been arriving all season, more than {name} has roofs or work for. They camp where they can, and the old households keep their distance. | kept |
| overview | 1 | trade | Food in {name} is running short with so many more to feed, and there is not work enough for the newcomers. | new |
| overview | 2 | official | {name}'s leaders are counting heads they have no plan for, and the newcomers keep coming. | new |
| overview | 3 | newcomer | For the newcomers, {name} is a place to call home, if they can find a roof and someone who will hire them. | new |
| defence | 0 | watch | Newcomers keep arriving in {name}, and with them come quarrels over space and work that the old families expect someone to settle. | kept |
| defence | 1 | official | Those who keep order in {name} are stretched by the newcomers, and some of the hungriest take what they cannot earn. | new |
| defence | 2 | local | Old families in {name} lock up what they once left out, and blame the newcomers for every theft. | new |
| defence | 3 | traveller | On the road into {name}, you pass families camped wherever there is room, watching every cart that goes by. | new |
| tonight | 0 | official | {name}'s leaders are caught between their duty to the newcomers and a place that cannot house or employ them all. | kept |
| tonight | 1 | watch | In {name} the quarrels between old families and newcomers come more often now, and each is harder to settle. | new |
| tonight | 2 | newcomer | Whoever takes charge of the newcomers in {name} will decide who may stay and who must go, and will want something in return. | new |
| tonight | 3 | trade | Every new family in {name} needs food and work, and the place has less of both to give each week. | new |

#### mass_migration · departures

| surface | k | vantage | line | was |
|---|---|---|---|---|
| cover | 0 | traveller | Every street in {name} has houses standing empty, their owners gone for good. | kept |
| cover | 1 | newcomer | A newcomer to {name} is welcomed eagerly: there are empty houses to fill and work nobody is left to do. | new |
| cover | 2 | trade | Fewer buyers and fewer hands: {name}'s fields go short of workers and its trade short of customers. | new |
| cover | 3 | watch | With so many gone from {name}, whole streets are dark at night and nobody watches them. | new |
| overview | 0 | local | Families keep leaving {name}, the ones who could afford to first, and those who stay do the work of the ones who went. | kept |
| overview | 1 | trade | With families leaving {name}, the fields lack hands to work them and the taxes fall short. | new |
| overview | 2 | official | Offices in {name} stand empty, the taxes fall short, and its leaders have fewer people each season to call on. | new |
| overview | 3 | newcomer | Anyone who settles in {name} now can have their pick of empty houses, and those who stayed will be glad of them. | new |
| defence | 0 | watch | With so many gone, {name}'s empty houses draw thieves and squatters, and fewer people are left to keep them out. | kept |
| defence | 1 | official | Those who keep {name} safe have fewer to call on each season, and more empty houses to watch. | new |
| defence | 2 | local | In {name} those who stay keep an eye on their neighbours' empty houses, and lock their own. | new |
| defence | 3 | traveller | Walking through {name}, you pass house after empty house, and few people about to see who goes in. | new |
| tonight | 0 | official | {name} is losing people faster than it can replace them, and its leaders have fewer hands each season to keep things running. | kept |
| tonight | 1 | watch | Thieves have learned that {name} has more empty houses than people to watch them. | new |
| tonight | 2 | newcomer | Anyone willing to stay in {name} has a say now, because the place cannot afford to lose more. | new |
| tonight | 3 | trade | Every family that leaves {name} takes its trade and its taxes with it, and the gap grows each season. | new |

### 8.2 `causalState.js` (22)

| row | old | new |
|---|---|---|
| 170 | The pantheon's {blessing/blight} on {channel} {strengthens/weakens} {label}. | The gods' {blessing/blight} falls on {channel}, and {label} {strengthens/weakens} with it. |
| 597 | Population ${pop} provides a deep labor pool. | ${pop} people give the place plenty of hands for its work. |
| 639 | Monsters plague the region and defense readiness is ${score}. The crown cannot protect its people. | Monsters plague the region, and its defences are too weak to answer them. The crown cannot protect its people. (the branch holds readiness < 40) |
| 732 | Top faction holds ${n}% of power. | The strongest power holds more than half of all the influence here. (branch: share ≥ 0.55) |
| 736 | No faction holds clear primacy (top share ${n}%). | No power clearly leads; the strongest holds less than a third of the influence here. (branch: ≤ 0.30) |
| 764 | Settlement is isolated from regional trade. | No trade route reaches the settlement. |
| 842 | ${label} sustains the war economy (capped). | ${label} keeps the war economy going. |
| 889 | Governing legitimacy ${score} underwrites the rule of law. | People accept / doubt the government ({legitimacyLabel, lower-cased, when held}), so its laws are kept / kept loosely. (the band the record holds; the sign of the contribution) |
| 918 | Internal-security score ${n} reflects how well order is kept. | Order in the streets is well / poorly kept. (the contribution's sign) |
| 929 | ${n} law-and-order institutions uphold the courts and the watch. | ${n} offices of the law keep order here. |
| 931 | A single law-and-order institution maintains the peace. | One office of the law keeps the peace here. |
| 933 | No courts or watch. Order rests on informal mechanisms. | There is no court and no watch; neighbours keep order among themselves. |
| 945 | Black-market capture at ${n}% undermines lawful order. | The black market has taken trade from lawful dealers, and the law is weaker for it. |
| 954 | ${name} (power ${n}) rivals the law. | ${name} is strong enough to rival the law. |
| 990 | {deity} ({lawAxis}) strengthens law & order / erodes order and tolerates corruption{ (piety ×n.nn)}. | {deity} ({lawAxis}) stands behind the law / turns a blind eye to crime and corruption. |
| 1035 | ${n} healing service(s) offered, but no dedicated institution. | ${n} kinds of healing are on offer, but no house of healing stands here. |
| 1153 | No religious faction in the power structure. | No priesthood holds any power here. (the audit's "temple" struck: a temple may stand where no priesthood holds power) |
| 1183 | {deity} ({rankAxis}) anchors religious authority{ (piety ×n.nn)}. | {deity} ({rankAxis}) gives the priesthood its standing. |
| 1245 | Fortification + logistics scores imply infrastructure ~${n}. | Judging by the defences and supply lines, the roads and buildings are well kept / poorly kept / in middling repair. |
| 1271 | High magic investment supports arcane stability. | Magic is practised widely here, and that keeps it steady. |
| 1272 | Low magic investment limits arcane resilience. | Little magic is practised here, so there is little to steady it when it goes wrong. |
| 1323 | No dominant figures anchor public confidence. | No one here stands out as a leader people look to. |

### 8.3 `stressInstitutionEffects.js` (8 applied; 6 struck, §5)

| row | old | new |
|---|---|---|
| 175 (secret) | …actively funding one faction's operations through a third party | …actively funding one power's operations through a third party |
| 232 | …They've been choosing themselves for six weeks | …For six weeks they have kept quiet to save themselves |
| 324 | …Sharing them would destabilise everything and serve justice simultaneously | …Telling the truth would be the just thing, and it would throw the succession open again |
| 359 | The connection is in the geographic data. Someone with the right maps will make it | The connection shows on the maps. Anyone who reads them closely will make it |
| 403 | …If the authority ever forces one, this person's own route becomes the confession | …If the authority ever has one drawn, this person's own route through it will give them away |
| 441 | …The third party's name will not survive the first honest question | …The first one to ask who the third party really is will find this person behind it |
| 449 | …The purchases will not survive their claims, or their questions | …When they do, they will want their houses back and will ask who bought them so cheaply |
| 502 | …Anyone who found it would unmake the conversion and every career built on it | …Anyone who found it could prove the miracle a fake, and every career built on the conversion would fall with it |

### 8.4 `priorityHelpers.js` :: `evaluateWaterDependency` (6) — the writer holds no band, so "(≈n/100)" leaves

| row | old | new |
|---|---|---|
| 238 | Magical trade infrastructure (teleportation) enables limited craft imports despite isolation. | No trade route reaches this place, but magic brings in a little of what its crafts need. (the audit's "teleportation circle" struck: the check also passes on planar, extradimensional or airship houses) |
| 240 | No trade pipeline: isolated settlement cannot import raw materials. | No trade route reaches this place, so its crafts get no materials from outside. |
| 245 | Economy too weak (≈n/100) to sustain craft imports at scale. | Trade here is too weak to bring in craft materials in any quantity. |
| 250 | ${label} trade at strong economy (≈n/100) sustains craft via imported materials. | ${label} trade is strong, and it brings in the materials the crafts work. |
| 254 | ${route} trade at solid economy (≈n/100) sustains craft via consistent imports. | The ${route} trade is steady, and it brings in enough for the crafts to keep working. |
| 257 | Trade route (${route}) and economy (≈n/100) insufficient to sustain craft without local resources. | The ${route} trade is too thin to keep the crafts supplied without materials of their own. |

### 8.5 `npcGenerator.js` (5 rows + A9's 3)

| site | old | new |
|---|---|---|
| wartime gov note (1142–1143) | The war has made every civic decision a military calculation. The crown's needs and the settlement's needs are not the same calculation. | Since the war began, every decision here comes back to the army, and the crown's requisition order asks for what the settlement itself needs to live. (the audit's "the council" struck: the gov role is not always a council) |
| wartime mil note + its sibling key + text (1597 ×2) | Every experienced soldier conscripted into the field army is a hole in local security that a substitute won't fill the same way. | Each experienced soldier sent to the field army is replaced by a frightened substitute who does not yet know the work. |
| its declared twin (1597) | Every experienced hand called up into the field army is a hole in local security… | Each experienced hand called up into the field army is replaced by a frightened substitute who does not yet know the work. |
| A9 · STRESS_GOALS.monster_pressure | Be the person who solved the problem rather than the person who reported it | Be the person who solves the problem, and not only the one who reports it |
| A9 · STRESS_GOALS.mass_migration | Make the changed settlement work rather than merely survive the change | Make the changed settlement work for everyone in it |
| A9 · the old-debt secret's stakes | The silence feels like patience rather than forgiveness | The silence feels like patience, and it is not forgiveness |

### 8.6 The display rows (5)

| file · row | old | new |
|---|---|---|
| `marketPrices.js` 234 (CRIER_FRAMES.dear[2]) | They're asking {phrase} for {label}: dear, {receipt}. | {label} sells at {phrase} now: dear, {receipt}. (the label word "dear" kept as the skeleton) |
| `tonightAtTheTable.js` 187 | NPCs go cold mid-sentence. Reason: ${reason} | People go quiet mid-sentence when it comes up. ${consequence} (nothing after it when none is recorded) |
| `relationshipsDeskRead.js` 139 | Generated with ${name} as neighbour (${type}). | ${name} is a neighbour (${type}). |
| `politicsRead.js` 78 | A quiet faction moves against the seat: … | A quiet power moves against the seat: … |
| `politicsRead.js` 79 | …(members[0] \|\| 'A faction') stand together as a bloc, … | …(members[0] \|\| 'A power') stand together as a bloc, … |

## 9. Every moved golden cell (for STYLE-2-MERGE's signing)

gm (c5, 194): city|arabic|coastal|port|civilized|golden-master-v3 · city|arabic|desert|road|civilized|golden-master-v3 · city|arabic|forest|isolated|civilized|golden-master-v3 · city|arabic|hills|road|civilized|golden-master-v3 · city|arabic|mountain|road|civilized|golden-master-v3 · city|arabic|plains|road|civilized|golden-master-v3 · city|arabic|riverside|river|civilized|golden-master-v3 · city|celtic|coastal|port|civilized|golden-master-v3 · city|celtic|desert|road|civilized|golden-master-v3 · city|celtic|forest|isolated|civilized|golden-master-v3 · city|celtic|hills|road|civilized|golden-master-v3 · city|celtic|mountain|road|civilized|golden-master-v3 · city|celtic|plains|road|civilized|golden-master-v3 · city|celtic|riverside|river|civilized|golden-master-v3 · city|east_asian|coastal|port|civilized|golden-master-v3 · city|east_asian|desert|road|civilized|golden-master-v3 · city|east_asian|hills|road|civilized|golden-master-v3 · city|east_asian|mountain|road|civilized|golden-master-v3 · city|east_asian|plains|road|civilized|golden-master-v3 · city|east_asian|riverside|river|civilized|golden-master-v3 · city|germanic|coastal|port|civilized|golden-master-v3 · city|germanic|desert|road|civilized|golden-master-v3 · city|germanic|forest|isolated|civilized|golden-master-v3 · city|germanic|hills|road|civilized|golden-master-v3 · city|germanic|mountain|road|civilized|golden-master-v3 · city|germanic|plains|road|civilized|golden-master-v3 · city|germanic|riverside|river|civilized|golden-master-v3 · city|greek|coastal|port|civilized|golden-master-v3 · city|greek|desert|road|civilized|golden-master-v3 · city|greek|forest|isolated|civilized|golden-master-v3 · city|greek|hills|road|civilized|golden-master-v3 · city|greek|mountain|road|civilized|golden-master-v3 · city|greek|plains|road|civilized|golden-master-v3 · city|greek|riverside|river|civilized|golden-master-v3 · city|latin|coastal|port|civilized|golden-master-v3 · city|latin|desert|road|civilized|golden-master-v3 · city|latin|forest|isolated|civilized|golden-master-v3 · city|latin|hills|road|civilized|golden-master-v3 · city|latin|mountain|road|civilized|golden-master-v3 · city|latin|plains|road|civilized|golden-master-v3 · city|latin|riverside|river|civilized|golden-master-v3 · city|mediterranean|coastal|port|civilized|golden-master-v3 · city|mediterranean|desert|road|civilized|golden-master-v3 · city|mediterranean|forest|isolated|civilized|golden-master-v3 · city|mediterranean|hills|road|civilized|golden-master-v3 · city|mediterranean|mountain|road|civilized|golden-master-v3 · city|mediterranean|plains|road|civilized|golden-master-v3 · city|mediterranean|riverside|river|civilized|golden-master-v3 · city|mesoamerican|coastal|port|civilized|golden-master-v3 · city|mesoamerican|desert|road|civilized|golden-master-v3 · city|mesoamerican|forest|isolated|civilized|golden-master-v3 · city|mesoamerican|hills|road|civilized|golden-master-v3 · city|mesoamerican|mountain|road|civilized|golden-master-v3 · city|mesoamerican|plains|road|civilized|golden-master-v3 · city|mesoamerican|riverside|river|civilized|golden-master-v3 · city|norse|coastal|port|civilized|golden-master-v3 · city|norse|desert|road|civilized|golden-master-v3 · city|norse|hills|road|civilized|golden-master-v3 · city|norse|mountain|road|civilized|golden-master-v3 · city|norse|plains|road|civilized|golden-master-v3 · city|norse|riverside|river|civilized|golden-master-v3 · city|slavic|coastal|port|civilized|golden-master-v3 · city|slavic|desert|road|civilized|golden-master-v3 · city|slavic|forest|isolated|civilized|golden-master-v3 · city|slavic|hills|road|civilized|golden-master-v3 · city|slavic|mountain|road|civilized|golden-master-v3 · city|slavic|plains|road|civilized|golden-master-v3 · city|slavic|riverside|river|civilized|golden-master-v3 · city|south_asian|coastal|port|civilized|golden-master-v3 · city|south_asian|desert|road|civilized|golden-master-v3 · city|south_asian|forest|isolated|civilized|golden-master-v3 · city|south_asian|hills|road|civilized|golden-master-v3 · city|south_asian|mountain|road|civilized|golden-master-v3 · city|south_asian|plains|road|civilized|golden-master-v3 · city|south_asian|riverside|river|civilized|golden-master-v3 · city|steppe|coastal|port|civilized|golden-master-v3 · city|steppe|desert|road|civilized|golden-master-v3 · city|steppe|forest|isolated|civilized|golden-master-v3 · city|steppe|hills|road|civilized|golden-master-v3 · city|steppe|mountain|road|civilized|golden-master-v3 · city|steppe|plains|road|civilized|golden-master-v3 · city|steppe|riverside|river|civilized|golden-master-v3 · metropolis|arabic|coastal|port|civilized|golden-master-v3 · metropolis|arabic|desert|road|civilized|golden-master-v3 · metropolis|arabic|forest|isolated|civilized|golden-master-v3 · metropolis|arabic|hills|road|civilized|golden-master-v3 · metropolis|arabic|mountain|road|civilized|golden-master-v3 · metropolis|arabic|plains|road|civilized|golden-master-v3 · metropolis|arabic|riverside|river|civilized|golden-master-v3 · metropolis|celtic|coastal|port|civilized|golden-master-v3 · metropolis|celtic|desert|road|civilized|golden-master-v3 · metropolis|celtic|forest|isolated|civilized|golden-master-v3 · metropolis|celtic|hills|road|civilized|golden-master-v3 · metropolis|celtic|mountain|road|civilized|golden-master-v3 · metropolis|celtic|plains|road|civilized|golden-master-v3 · metropolis|celtic|riverside|river|civilized|golden-master-v3 · metropolis|east_asian|coastal|port|civilized|golden-master-v3 · metropolis|east_asian|desert|road|civilized|golden-master-v3 · metropolis|east_asian|forest|isolated|civilized|golden-master-v3 · metropolis|east_asian|hills|road|civilized|golden-master-v3 · metropolis|east_asian|mountain|road|civilized|golden-master-v3 · metropolis|east_asian|plains|road|civilized|golden-master-v3 · metropolis|east_asian|riverside|river|civilized|golden-master-v3 · metropolis|germanic|coastal|port|civilized|golden-master-v3 · metropolis|germanic|desert|road|civilized|golden-master-v3 · metropolis|germanic|forest|isolated|civilized|golden-master-v3 · metropolis|germanic|hills|road|civilized|golden-master-v3 · metropolis|germanic|mountain|road|civilized|golden-master-v3 · metropolis|germanic|plains|road|civilized|golden-master-v3 · metropolis|germanic|riverside|river|civilized|golden-master-v3 · metropolis|greek|coastal|port|civilized|golden-master-v3 · metropolis|greek|desert|road|civilized|golden-master-v3 · metropolis|greek|forest|isolated|civilized|golden-master-v3 · metropolis|greek|hills|road|civilized|golden-master-v3 · metropolis|greek|mountain|road|civilized|golden-master-v3 · metropolis|greek|plains|road|civilized|golden-master-v3 · metropolis|greek|riverside|river|civilized|golden-master-v3 · metropolis|latin|coastal|port|civilized|golden-master-v3 · metropolis|latin|desert|road|civilized|golden-master-v3 · metropolis|latin|forest|isolated|civilized|golden-master-v3 · metropolis|latin|hills|road|civilized|golden-master-v3 · metropolis|latin|mountain|road|civilized|golden-master-v3 · metropolis|latin|plains|road|civilized|golden-master-v3 · metropolis|latin|riverside|river|civilized|golden-master-v3 · metropolis|mediterranean|coastal|port|civilized|golden-master-v3 · metropolis|mediterranean|desert|road|civilized|golden-master-v3 · metropolis|mediterranean|forest|isolated|civilized|golden-master-v3 · metropolis|mediterranean|hills|road|civilized|golden-master-v3 · metropolis|mediterranean|mountain|road|civilized|golden-master-v3 · metropolis|mediterranean|plains|road|civilized|golden-master-v3 · metropolis|mediterranean|riverside|river|civilized|golden-master-v3 · metropolis|mesoamerican|coastal|port|civilized|golden-master-v3 · metropolis|mesoamerican|desert|road|civilized|golden-master-v3 · metropolis|mesoamerican|forest|isolated|civilized|golden-master-v3 · metropolis|mesoamerican|hills|road|civilized|golden-master-v3 · metropolis|mesoamerican|mountain|road|civilized|golden-master-v3 · metropolis|mesoamerican|plains|road|civilized|golden-master-v3 · metropolis|mesoamerican|riverside|river|civilized|golden-master-v3 · metropolis|norse|coastal|port|civilized|golden-master-v3 · metropolis|norse|desert|road|civilized|golden-master-v3 · metropolis|norse|forest|isolated|civilized|golden-master-v3 · metropolis|norse|hills|road|civilized|golden-master-v3 · metropolis|norse|mountain|road|civilized|golden-master-v3 · metropolis|norse|plains|road|civilized|golden-master-v3 · metropolis|norse|riverside|river|civilized|golden-master-v3 · metropolis|slavic|coastal|port|civilized|golden-master-v3 · metropolis|slavic|desert|road|civilized|golden-master-v3 · metropolis|slavic|forest|isolated|civilized|golden-master-v3 · metropolis|slavic|hills|road|civilized|golden-master-v3 · metropolis|slavic|mountain|road|civilized|golden-master-v3 · metropolis|slavic|plains|road|civilized|golden-master-v3 · metropolis|slavic|riverside|river|civilized|golden-master-v3 · metropolis|south_asian|coastal|port|civilized|golden-master-v3 · metropolis|south_asian|desert|road|civilized|golden-master-v3 · metropolis|south_asian|forest|isolated|civilized|golden-master-v3 · metropolis|south_asian|hills|road|civilized|golden-master-v3 · metropolis|south_asian|mountain|road|civilized|golden-master-v3 · metropolis|south_asian|plains|road|civilized|golden-master-v3 · metropolis|south_asian|riverside|river|civilized|golden-master-v3 · metropolis|steppe|coastal|port|civilized|golden-master-v3 · metropolis|steppe|desert|road|civilized|golden-master-v3 · metropolis|steppe|forest|isolated|civilized|golden-master-v3 · metropolis|steppe|hills|road|civilized|golden-master-v3 · metropolis|steppe|mountain|road|civilized|golden-master-v3 · metropolis|steppe|plains|road|civilized|golden-master-v3 · metropolis|steppe|riverside|river|civilized|golden-master-v3 · town|arabic|forest|isolated|civilized|golden-master-v3 · town|arabic|hills|road|civilized|golden-master-v3 · town|celtic|forest|isolated|civilized|golden-master-v3 · town|celtic|hills|road|civilized|golden-master-v3 · town|east_asian|hills|road|civilized|golden-master-v3 · town|germanic|auto|random_trade|civilized|gm-seed-a · town|germanic|auto|random_trade|civilized|gm-seed-b · town|germanic|auto|random_trade|civilized|gm-seed-c · town|germanic|auto|random_trade|civilized|golden-master-v3 · town|germanic|hills|road|civilized|golden-master-v3 · town|germanic|mountain|random_trade|civilized|gm-seed-a · town|germanic|mountain|random_trade|civilized|gm-seed-b · town|germanic|plains|isolated|civilized|golden-master-v3 · town|germanic|plains|road|civilized|gm-seed-a · town|greek|forest|isolated|civilized|golden-master-v3 · town|greek|hills|road|civilized|golden-master-v3 · town|latin|forest|isolated|civilized|golden-master-v3 · town|latin|hills|road|civilized|golden-master-v3 · town|mediterranean|forest|isolated|civilized|golden-master-v3 · town|mediterranean|hills|road|civilized|golden-master-v3 · town|mesoamerican|forest|isolated|civilized|golden-master-v3 · town|mesoamerican|hills|road|civilized|golden-master-v3 · town|norse|hills|road|civilized|golden-master-v3 · town|slavic|forest|isolated|civilized|golden-master-v3 · town|slavic|hills|road|civilized|golden-master-v3 · town|south_asian|hills|road|civilized|golden-master-v3 · town|steppe|forest|isolated|civilized|golden-master-v3 · town|steppe|hills|road|civilized|golden-master-v3

fence (c3, 35): SUBw4-fence1-thorp-port-008 · SUBw4-fence1-thorp-port-012 · SUBw4-fence1-hamlet-crossroads-006 · SUBw4-fence1-village-road-000 · SUBw4-fence1-village-road-002 · SUBw4-fence1-village-road-003 · SUBw4-fence1-village-isolated-002 · SUBw4-fence1-village-isolated-005 · SUBw4-fence1-village-isolated-010 · SUBw4-fence1-village-isolated-014 · SUBw4-fence1-village-port-009 · SUBw4-fence1-village-port-014 · SUBw4-fence1-village-crossroads-011 · SUBw4-fence1-village-crossroads-013 · SUBw4-fence1-town-road-005 · SUBw4-fence1-town-road-011 · SUBw4-fence1-town-isolated-004 · SUBw4-fence1-town-isolated-006 · SUBw4-fence1-town-port-003 · SUBw4-fence1-town-port-007 · SUBw4-fence1-town-crossroads-003 · SUBw4-fence1-town-crossroads-007 · SUBw4-fence1-city-port-002 · SUBw4-fence1-city-port-013 · SUBw4-fence1-city-crossroads-001 · SUBw4-fence1-city-crossroads-006 · SUBw4-fence1-metropolis-road-008 · SUBw4-fence1-metropolis-road-009 · SUBw4-fence1-metropolis-road-011 · SUBw4-fence1-metropolis-road-012 · SUBw4-fence1-metropolis-isolated-005 · SUBw4-fence1-metropolis-isolated-012 · SUBw4-fence1-metropolis-isolated-014 · SUBw4-fence1-metropolis-port-000 · SUBw4-fence1-metropolis-crossroads-007

fence (c5, 220): SUBw4-fence1-thorp-road-003 · SUBw4-fence1-thorp-road-007 · SUBw4-fence1-thorp-road-012 · SUBw4-fence1-thorp-road-014 · SUBw4-fence1-thorp-isolated-014 · SUBw4-fence1-thorp-port-002 · SUBw4-fence1-thorp-port-003 · SUBw4-fence1-thorp-port-007 · SUBw4-fence1-thorp-port-011 · SUBw4-fence1-thorp-port-012 · SUBw4-fence1-thorp-port-013 · SUBw4-fence1-thorp-crossroads-003 · SUBw4-fence1-thorp-crossroads-006 · SUBw4-fence1-thorp-crossroads-009 · SUBw4-fence1-thorp-crossroads-013 · SUBw4-fence1-hamlet-road-000 · SUBw4-fence1-hamlet-road-001 · SUBw4-fence1-hamlet-port-011 · SUBw4-fence1-hamlet-port-012 · SUBw4-fence1-hamlet-crossroads-004 · SUBw4-fence1-hamlet-crossroads-005 · SUBw4-fence1-village-road-001 · SUBw4-fence1-village-road-002 · SUBw4-fence1-village-road-009 · SUBw4-fence1-village-road-011 · SUBw4-fence1-village-road-013 · SUBw4-fence1-village-isolated-000 · SUBw4-fence1-village-isolated-002 · SUBw4-fence1-village-isolated-004 · SUBw4-fence1-village-isolated-006 · SUBw4-fence1-village-isolated-009 · SUBw4-fence1-village-isolated-010 · SUBw4-fence1-village-port-000 · SUBw4-fence1-village-port-003 · SUBw4-fence1-village-port-006 · SUBw4-fence1-village-port-008 · SUBw4-fence1-village-port-009 · SUBw4-fence1-village-port-010 · SUBw4-fence1-village-port-012 · SUBw4-fence1-village-port-013 · SUBw4-fence1-village-crossroads-001 · SUBw4-fence1-village-crossroads-004 · SUBw4-fence1-village-crossroads-005 · SUBw4-fence1-village-crossroads-006 · SUBw4-fence1-village-crossroads-007 · SUBw4-fence1-village-crossroads-009 · SUBw4-fence1-village-crossroads-010 · SUBw4-fence1-village-crossroads-011 · SUBw4-fence1-village-crossroads-013 · SUBw4-fence1-village-crossroads-014 · SUBw4-fence1-town-road-001 · SUBw4-fence1-town-road-002 · SUBw4-fence1-town-road-003 · SUBw4-fence1-town-road-004 · SUBw4-fence1-town-road-005 · SUBw4-fence1-town-road-006 · SUBw4-fence1-town-road-008 · SUBw4-fence1-town-road-009 · SUBw4-fence1-town-road-010 · SUBw4-fence1-town-road-011 · SUBw4-fence1-town-road-012 · SUBw4-fence1-town-road-013 · SUBw4-fence1-town-road-014 · SUBw4-fence1-town-isolated-000 · SUBw4-fence1-town-isolated-001 · SUBw4-fence1-town-isolated-002 · SUBw4-fence1-town-isolated-004 · SUBw4-fence1-town-isolated-005 · SUBw4-fence1-town-isolated-006 · SUBw4-fence1-town-isolated-007 · SUBw4-fence1-town-isolated-008 · SUBw4-fence1-town-isolated-009 · SUBw4-fence1-town-isolated-010 · SUBw4-fence1-town-isolated-011 · SUBw4-fence1-town-isolated-012 · SUBw4-fence1-town-isolated-013 · SUBw4-fence1-town-port-000 · SUBw4-fence1-town-port-001 · SUBw4-fence1-town-port-002 · SUBw4-fence1-town-port-003 · SUBw4-fence1-town-port-004 · SUBw4-fence1-town-port-005 · SUBw4-fence1-town-port-007 · SUBw4-fence1-town-port-008 · SUBw4-fence1-town-port-009 · SUBw4-fence1-town-port-010 · SUBw4-fence1-town-port-011 · SUBw4-fence1-town-port-013 · SUBw4-fence1-town-port-014 · SUBw4-fence1-town-crossroads-000 · SUBw4-fence1-town-crossroads-002 · SUBw4-fence1-town-crossroads-004 · SUBw4-fence1-town-crossroads-005 · SUBw4-fence1-town-crossroads-006 · SUBw4-fence1-town-crossroads-007 · SUBw4-fence1-town-crossroads-009 · SUBw4-fence1-town-crossroads-010 · SUBw4-fence1-town-crossroads-011 · SUBw4-fence1-town-crossroads-012 · SUBw4-fence1-town-crossroads-013 · SUBw4-fence1-town-crossroads-014 · SUBw4-fence1-city-road-000 · SUBw4-fence1-city-road-001 · SUBw4-fence1-city-road-002 · SUBw4-fence1-city-road-003 · SUBw4-fence1-city-road-004 · SUBw4-fence1-city-road-005 · SUBw4-fence1-city-road-006 · SUBw4-fence1-city-road-007 · SUBw4-fence1-city-road-008 · SUBw4-fence1-city-road-009 · SUBw4-fence1-city-road-010 · SUBw4-fence1-city-road-011 · SUBw4-fence1-city-road-012 · SUBw4-fence1-city-road-013 · SUBw4-fence1-city-road-014 · SUBw4-fence1-city-isolated-000 · SUBw4-fence1-city-isolated-001 · SUBw4-fence1-city-isolated-002 · SUBw4-fence1-city-isolated-003 · SUBw4-fence1-city-isolated-004 · SUBw4-fence1-city-isolated-005 · SUBw4-fence1-city-isolated-006 · SUBw4-fence1-city-isolated-007 · SUBw4-fence1-city-isolated-008 · SUBw4-fence1-city-isolated-009 · SUBw4-fence1-city-isolated-010 · SUBw4-fence1-city-isolated-011 · SUBw4-fence1-city-isolated-012 · SUBw4-fence1-city-isolated-013 · SUBw4-fence1-city-isolated-014 · SUBw4-fence1-city-port-001 · SUBw4-fence1-city-port-002 · SUBw4-fence1-city-port-003 · SUBw4-fence1-city-port-004 · SUBw4-fence1-city-port-005 · SUBw4-fence1-city-port-006 · SUBw4-fence1-city-port-007 · SUBw4-fence1-city-port-008 · SUBw4-fence1-city-port-009 · SUBw4-fence1-city-port-010 · SUBw4-fence1-city-port-011 · SUBw4-fence1-city-port-012 · SUBw4-fence1-city-port-013 · SUBw4-fence1-city-port-014 · SUBw4-fence1-city-crossroads-000 · SUBw4-fence1-city-crossroads-001 · SUBw4-fence1-city-crossroads-002 · SUBw4-fence1-city-crossroads-003 · SUBw4-fence1-city-crossroads-004 · SUBw4-fence1-city-crossroads-005 · SUBw4-fence1-city-crossroads-006 · SUBw4-fence1-city-crossroads-007 · SUBw4-fence1-city-crossroads-008 · SUBw4-fence1-city-crossroads-009 · SUBw4-fence1-city-crossroads-010 · SUBw4-fence1-city-crossroads-011 · SUBw4-fence1-city-crossroads-012 · SUBw4-fence1-city-crossroads-013 · SUBw4-fence1-city-crossroads-014 · SUBw4-fence1-metropolis-road-000 · SUBw4-fence1-metropolis-road-001 · SUBw4-fence1-metropolis-road-002 · SUBw4-fence1-metropolis-road-003 · SUBw4-fence1-metropolis-road-004 · SUBw4-fence1-metropolis-road-005 · SUBw4-fence1-metropolis-road-006 · SUBw4-fence1-metropolis-road-007 · SUBw4-fence1-metropolis-road-008 · SUBw4-fence1-metropolis-road-009 · SUBw4-fence1-metropolis-road-010 · SUBw4-fence1-metropolis-road-011 · SUBw4-fence1-metropolis-road-012 · SUBw4-fence1-metropolis-road-013 · SUBw4-fence1-metropolis-road-014 · SUBw4-fence1-metropolis-isolated-000 · SUBw4-fence1-metropolis-isolated-001 · SUBw4-fence1-metropolis-isolated-002 · SUBw4-fence1-metropolis-isolated-003 · SUBw4-fence1-metropolis-isolated-004 · SUBw4-fence1-metropolis-isolated-005 · SUBw4-fence1-metropolis-isolated-006 · SUBw4-fence1-metropolis-isolated-007 · SUBw4-fence1-metropolis-isolated-008 · SUBw4-fence1-metropolis-isolated-009 · SUBw4-fence1-metropolis-isolated-010 · SUBw4-fence1-metropolis-isolated-011 · SUBw4-fence1-metropolis-isolated-012 · SUBw4-fence1-metropolis-isolated-013 · SUBw4-fence1-metropolis-isolated-014 · SUBw4-fence1-metropolis-port-000 · SUBw4-fence1-metropolis-port-001 · SUBw4-fence1-metropolis-port-002 · SUBw4-fence1-metropolis-port-003 · SUBw4-fence1-metropolis-port-004 · SUBw4-fence1-metropolis-port-005 · SUBw4-fence1-metropolis-port-006 · SUBw4-fence1-metropolis-port-007 · SUBw4-fence1-metropolis-port-008 · SUBw4-fence1-metropolis-port-009 · SUBw4-fence1-metropolis-port-010 · SUBw4-fence1-metropolis-port-011 · SUBw4-fence1-metropolis-port-012 · SUBw4-fence1-metropolis-port-013 · SUBw4-fence1-metropolis-port-014 · SUBw4-fence1-metropolis-crossroads-000 · SUBw4-fence1-metropolis-crossroads-001 · SUBw4-fence1-metropolis-crossroads-002 · SUBw4-fence1-metropolis-crossroads-003 · SUBw4-fence1-metropolis-crossroads-004 · SUBw4-fence1-metropolis-crossroads-005 · SUBw4-fence1-metropolis-crossroads-006 · SUBw4-fence1-metropolis-crossroads-007 · SUBw4-fence1-metropolis-crossroads-008 · SUBw4-fence1-metropolis-crossroads-009 · SUBw4-fence1-metropolis-crossroads-010 · SUBw4-fence1-metropolis-crossroads-011 · SUBw4-fence1-metropolis-crossroads-012 · SUBw4-fence1-metropolis-crossroads-013 · SUBw4-fence1-metropolis-crossroads-014

## 10. The record walkers, and CONFIRMED against PLAUSIBLE

The three record walkers at the record's commit (`sh scripts/gate-tail.sh npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/ledgerCitationIntegrity.test.js tests/lint/testRatchet.test.js`, `review-fixes-2026-07-08` fetched): see the hand-back; the roster's `tree` arm is red at the base by MERGE-WAVE's 9288badee (140 vs 139), recorded and not touched.

**CONFIRMED** (executed here): the 256 lines' static bans and distinctness; the square; the seed's stability and spread; the referee's before/after figures; the golden deltas per cause in clean worktrees; the moves text-only (60 births diffed per generator cause); the governing suites' reds attributed to the base by running the same files at a7bc2e4ce. **PLAUSIBLE** (judged, not measured): that each new line states only what its crisis kind guarantees (read against `stressTypes.js`'s catalogue text and the kept lines — the census law, by this seat's hand; the owner's veto is the check); the A10 phrase counts by this seat's matcher rather than SW-0's walker.

## What stays

Nothing of this lane's rows. For the chair: §5's six `{faction}` slot rows (a key rename is SW-8's or an allow-list entry for SW-0); §7's three out-of-manifest stale texts; the seed is the town's name because the four callers (outside the manifest) hand no `_seed` — a later lane may thread `config._seed` through `DefenseTab.jsx`, `tonightSheet.js`, `viewModel.js`, `viewModelBodySlices.js`.
