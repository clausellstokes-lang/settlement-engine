NOT CLEAR

# REVIEW-AGREE — `lane/coherence-agree-2026-11-11`, base 99bcc6944 → tip 65ce74ce6

The reviewer: an independent seat (REVIEW-AGREE), 2026-11-12. I read the lane, ran it, and fixed nothing. I reviewed HEAD 65ce74ce64f4dd9dcc484e3016605374fa3ca9df, which is the commit named in the brief. All execution ran in detached worktrees (one per commit, plus a scratch tip copy). The lane's branch was not touched.

**Seeds of my own.** Under the charter's §0 dials (every dial on random, `contentProfile: 'grounded'`, mix 60/160/100/40), I used three sets:
- `rvw12-<tier>-<i>`: 360 births.
- `rvw12b-<tier>-<i>`: 1,440 births, four times the mix.
- `rvwfam-<tier>-<i>`: 240 births, the same dials but `selectedStresses: ['famine']`.

For step 4 I also used the golden's 525 configurations, born exactly as `generatorGoldenMaster.test.js` births them. For step 8 I used ten towns `rvw-ten-0..9`.

## Verdict in one paragraph

The guard does what it claims on the facts it models. On 1,800 births it never saw, the agreement arm finds 0 instances. Every cure is red first for its stated cause. Cures 10–13 move only text.

The lane is NOT CLEAR, for three reasons:
1. **A red gate.** `typecheck:domain:strict`, a stage of `npm run check`, has been red since the court guard (fddcc13a2), and the hand-back does not mention it.
2. **Cure 6 does more than the chair's ruling allows.** Under famine it moves the grown share, the import share and the famine cut. It moves defence labels, with or without famine. Its stores follow the new sources. The commit's "no move" claims hold only on the lane's own seeds and tiers.
3. **The class still has members, some in the lane's own cured lines.** "Local ore feeds the smithy" prints beside an iron import. The war line can never print, because the hook site reads every town as at peace. The safety writer answers "gates" from the walls. The food record's foodways line names a market the market home denies, on the same page as the lane's no-market twin. "Grain Sales: Surplus from local harvest" prints in famine towns.

**Counts.** 17 findings (F1–F15, with F12a and F12b), every one CONFIRMED by execution. Two carry a PLAUSIBLE part, and each says which: F9's latent readers, and F15's cause.

**The hand-back's claims that are simply true:**
- Every cure is red first for its stated cause.
- The class sizes before → after are right on the lane's seeds, and the arm reads 0 on 1,800 fresh births.
- Cures 10–13 move text only.
- The second seat banked no register row and skipped no test.
- 38 rows are red in the six directories, every one moved by the lane.

## Findings, most serious first

### F1 — A gate of `npm run check` is red at the tip, and the hand-back does not mention it. CONFIRMED.
- **What a reader would see:** nothing in the dossier. What breaks is the release gate: `typecheck:domain:strict` fails.
- **Where:** `src/domain/defense/defenseFacts.js`. The court guard (fddcc13a2) put the `COURT_RE` docblock *between* `/** @param {unknown} inst @returns {string} */` and `const nameOf = (inst) =>`. `nameOf` lost its type, so `inst` became an implicit `any`.
- **Executed:** `sh scripts/gate-tail.sh node scripts/check-domain-strict.mjs`, at three commits:
  - base 99bcc6944: `✓ no strict-type regressions (1113 errors, ceiling 1113)`, exit 0
  - fddcc13a2: `src/domain/defense/defenseFacts.js: 1 strict errors (baseline 0) — +1`, exit 1
  - tip 65ce74ce6: the same line, exit 1
- **The cause, planted:** in a scratch worktree at fddcc13a2 I moved the one JSDoc line back above `nameOf`. The check went back to `✓ … exit 0`. The file was restored afterwards.
- **Why it is serious:** the equal-failing-set statement covers only the six vitest directories, so this red is not on its list. Charter §0.9 says a gate you did not expect going red is a STOP. Bare eslint on the lane's touched files is clean: exit 0.

### F2 — Cure 6 does more than the chair's ruling allows: the grown share, the import share, the famine cut, a defence label and the stores all follow the new sources. CONFIRMED.
The ruling says "the grown share and the import share do not move … no food band, no prosperity label and no defence label may move". The cure's commit says: "grown and import share: no move", "the defence score moves in 11 with no defence label", "no storage note crosses a printed threshold". Those statements hold on the lane's 360 seeds (villages and up, one famine town). They do not hold in general. Three readers of `foodLandOf(...).foodSources` turn a named source into a quantity:
- **(a) Famine.** `src/generators/foodGenerator.js :: generateFoodSecurity` has `famineKeeps = foodSources.length >= 2 ? 1 - 1/n : 7/20` and `failedSource = foodSources[0]`. Once a town gains a second source, its famine keeps more of the harvest.
  - Executed: 240 famine births (`rvwfam-*`), cure 6's parent f88d87af2 against 570f2c21d. Moved: grownPct in 18, importPct in 16, famineCutPct in 18, failedSource in 56, defence label in 1. Food band and prosperity did not move.
  - `rvwfam-town-8`: grown 48 → 64, import 31 → 25 (sources fish,mill → livestock,fish,mill).
  - `rvwfam-town-45`: grown 30 → 43 (sources none → grain,livestock).
  - `rvwfam-city-14`: defence label "Lightly Defended" → "Defensible".
  - What a reader sees: a famine town's own-harvest share rises because its grazing is now named, though no institution works the land. That is exactly the "production bonus" the ruling says does not follow.
- **(b) No famine: a defence label moves.**
  - The chain is: a new source → `activeChainsCount` → `resilienceScore` → `defenseProfile.scores.disaster` → readiness.
  - `rvw12-town-79`, at f88d87af2 against 570f2c21d (executed): `Vulnerable 23 | disaster 57 | sources ["fish"]` → `Lightly Defended 24 | disaster 68 | sources ["livestock","fish"]`.
  - On the golden's 525 configurations (executed, f88d87af2 → 570f2c21d): `defenseProfile.scores.disaster` moves in 157 rows (by +9 to +21), `scores.economic` in 105, and `readiness.score` in 1.
  - The draft record names defence scores only for cure 9.
- **(c) The stores.**
  - `src/generators/foodLand.js :: foodLandOf` gives `preservedSources` (livestock, fish, game), and each adds a quarter month to `storageMonthsFull`. So a new livestock source enlarges the granary.
  - On the golden (executed), 12 thorp rows cross the printed threshold: "minimal storage: vulnerable to disruption" → "seasonal buffer only" (e.g. `thorp|germanic|riverside|river|civilized|golden-master-v3`, 1.8 → 2.0 months).
  - The lane's own re-key confirms the mechanism: `tests/domain/famineStoresOneRounding.test.js` had to swap seeds because `soak1k-1846` went 5.6 → 6.8 months.
- **File and function:** `src/generators/foodLand.js :: foodLandOf` (the source list is now read by `preservedSources`), and `src/generators/foodGenerator.js :: generateFoodSecurity` (`famineKeeps`, `failedSource`, chains). The ruling's sentence keeps the production bonus paired. It does not say that the famine divisor, the stores term and the chain count may follow the new sources, and the first of those moves the grown and import shares.

### F3 — The local-ore income line still contradicts the import list, and the guard is written to accept it. CONFIRMED.
- **What a reader would see:** "Iron & Metalwork: Local ore feeds the smithy directly. Metalwork income is not trade-route dependent." in a town whose primary imports list "Iron", and whose only metal is gold or silver.
- **Seeds:** `rvw12-town-13`, `rvw12-town-37` (precious_metals only; imports `["Iron"]`); `rvw-ten-6` (city: imports "Iron", income "Local ore feeds the smithy directly").
- **Counts:** on 1,800 fresh births, 142 print "Local ore" with no iron deposit, and 119 of those import iron. On the 360 `rvw12` seeds the count was 83 at the base and 24 at the tip: cure 7 removed coal from the gate and kept `precious_metal`.
- **Where the two answers are computed:**
  - The income line: `src/generators/economy/economicState.js :: generateEconomicState`, `hasNearbyResource('iron_deposit', 'precious_metal')`.
  - The import list: `resourceGenerator.js` / `primaryTradeLists.js`.
  - The guard: `src/generators/generationCoherence.js :: LOCAL_INCOME_WORDS` lists `/^Local ore\b/ → ['iron_deposits', 'precious_metals']`, so the arm counts this contradiction as agreement.
- **Note:** cure 1's own table (`economy/localMaterials.js :: MATERIAL_RESOURCE_KEYS`) answers "metals" with iron only. So the lane gives two answers to "is precious metal ore for the smithy?" in its own code.

### F4 — The war line can never print: the hook site reads every town as at peace. CONFIRMED.
- **What a reader would see:** a besieged or wartime town gets a peacetime iron hook ("A new toll on the iron road has made metal dear…"), never "War has taken the iron…".
- **On 1,800 fresh births, 0 war lines print.** Every town the record holds at war or at the front that draws an iron hook draws a peace hook: 16 at war, 5 at the front.
- **Executed:** `rvw12-village-7`, record `at war`, the site's facts say `peace`. `rvw12-village-8`, record `front`, the site says `peace`. On the 360 seeds: `{ 'at war -> site reads peace': 17, 'front -> site reads peace': 10 }`. Also `rvw-ten-7`, a city under siege: its hook is "A new toll on the iron road…".
- **Where:** `src/generators/economy/foodBalance.js :: deriveSupplyRiskAnalysis` tests `facts().warState !== 'peace'`. Its `facts` thunk is `factsOf({ institutions, config, tier, economicState })` (`viability.js`). That partial record carries no `stress`, and `domain/facts/warState.js :: warStateOf` → `crisisOf` reads the crisis from the record, not from `config.stressTypes`. So the site is a second reader of the war fact, and it answers otherwise than `factsOf(settlement)`, which the guard reads.
- **What this does to the cure's claims:** the cure's own comment says "the war line only where the record holds a war", and the hand-back says "war in peace 94 → 0". That "0" is true only because the line is now dead everywhere. The guard checks one direction only, so it cannot see this.
- **Declaration:** the war line's twin (`outlookHookSiblings.js`, `twinOf: WAR_IRON_HOOK`) declares `excludes: ['institution: smith']` and not `war: peace`, though it asserts a war too.

### F5 — The safety writer answers "gates" from the walls, beside the gate home it already holds. CONFIRMED.
- **What a reader would see:** "Everyone comes in by the gates, where the guard sees them." and "Everyone comes and goes by the gates, so smugglers have to get past the citizen militia." in a village whose defence record (after cure 9: "a palisade has no gates of record") has no gate.
- **Seeds:** `rvw12-village-3, -19, -22, -34, -45, -50, -53` (7 of the 60 fresh villages). Each has a palisade and a militia, with `gate: false`. Also `rvw-ten-2`.
- **Where:** `src/generators/safetyProfile.js :: generateSafetyProfile`. `wallNote` (two sites) is gated on `inst.hasWalls`. The same function sets `inst.hasGates = defence.gate` at its top. This is the AGREE class, (b), in the lane's own file. The guard has no gate member. The instance was present at the base too; cure 9 made the flag bag say "no gate", which makes the disagreement explicit.

### F6 — The food record names the town's market where the market home says there is none, beside the lane's own no-market twin. CONFIRMED.
- **What a reader would see** (`rvw12-village-0`):
  - "Food is short, and those with grain hold the power. What food is sold costs more than most people can pay…" (cure 12's twin, chosen because there is no market)
  - and, from the food record, "Markets, shared waterworks, fermentation, and intensive garden production structure urban food supply."
- `rvw12-village-14`: "Commerce is sluggish; little is bought or sold…" beside "Contract, warehousing, market tolls…".
- **Counts:** on 1,800 fresh births, `economicState.foodSecurity.foodRecord.foodwaysLine` names a market in 52 of the 202 no-market towns.
- **Where:** `foodGenerator.js` writes `foodwaysLine` through `src/domain/foodways.js :: composeFoodwaysLine`. That function filters the culture's flavour line only for food-source words, never for the market. This is class (a): a culture table copied into the record without reading the town. `domain/foodways.js` is not in AGREE's file list, so it is to be REPORTED, not edited, per §0.10. The guard's market member reads `situationDesc` only.

### F7 — "Grain Sales: Surplus from local harvest" prints in famine and deficit towns. CONFIRMED, present at the base.
- **What a reader would see** (`rvw12b-town-275`): band famine, "Deficit — Active Famine", grows 29%, imports "Grain", and income "Grain Sales 7%: Surplus from local harvest sold to nearby settlements and passing merchants".
- Also `rvw12b-town-103` and `rvw12b-town-427` (deficit, grows 28–29%).
- **Counts:** on 1,800 fresh births, 251 of the 284 towns printing the surplus line do not grow more than they eat. The `rvw12` 360 give 54 of 61, the same at the base and the tip.
- **Where:** `src/generators/economy/economicState.js :: generateEconomicState` (Grain Sales: `hasNearbyResource('grain_field','fertile_flood')`) against the food record (`foodRecord.growsMoreThanEats`). The lane's cure 7 law ("every income line that names a local resource reads the town's own resources") covers this line, and the guard does not model income against the food record.

### F8 — Cure 4 exempts every bracketed grain import, so a town that grows all its grain still "imports bulk grain". CONFIRMED.
- **What a reader would see** (`rvw12-town-34`): grows 101% of its need, yet its primary imports list "Bulk grain (local fields depleted)".
  - `rvw12-town-59`: grows 102%, no food source, "Bulk grain (local fields depleted)".
  - `rvw12-town-3`: grows 100%, "Grain and produce (local floodplain unproductive)".
- **Counts:** on 1,800 fresh births, towns growing ≥90% list "Bulk grain (local fields depleted)" in 38, "Grain and produce (local floodplain unproductive)" in 3, and compound grain goods in 6. Counts are identical at the base on `rvw12`.
- **Where:** `src/generators/economy/primaryTradeLists.js :: sayHowLittleGrain` rewrites only `/^(?:bulk )?grain(?: and foodstuffs)?$/i`.
- **Against the charter:** §2 says "a town that grows 90% of its need does not list grain as a primary import without saying how little". The exemption of bracketed reasons is the lane's own choice. The import list and the food record still tell two stories: the fields are spent, yet the town feeds itself.

### F9 — The defence-reader walker misses readers of the facts the lane homed. CONFIRMED.
I planted each reader as `src/generators/zzReviewPlant.js` in a scratch tip worktree, ran `tests/lint/defenceFactReaders.walker.test.js`, and deleted the plant.

| Planted reader | Walker result |
|---|---|
| (clean control) | passed=3 failed=0 |
| `n.includes('mercenary')` | **failed=1** |
| `n.includes('hireling hall')` (the exact reader cure 9 retired) | passed |
| `n.includes('courthouse')` | passed |
| `/\bgates?\b/i.test(n)` | passed |
| `const MERC = 'mercenary'; … n.includes(MERC)` | passed |
| `n.includes('sellsword') \|\| n.includes('free company')` | passed |
| `['garrison','militia'].some(k => n.includes(k))` | **failed=1** |

- The census is real for literal walls/garrison/militia/watch/mercenar* words.
- It has no rows for the court or the gate, the two facts the lane gave a home in the flag bag.
- It does not see a hired company named any other way, or a word held in a constant.
- `scripts/mutation-coverage-manifest.json` says the arm "reds on any new reader". That overstates it.
- In the lane's own `economicState.js`, readers of the homed facts remain:
  - the court (`hasInst('courthouse','multiple court','city hall')` for Court Fees)
  - the gate (`hasInst('gate','town wall','city wall')` for Gate Tolls)
  - the market (Market Taxes; line ~852)
  - also `economy/viability.js` (`hasMarket = hasInst('market','merchant','district')`)

  These agree with the homes on my 1,800 births (Court Fees with no court 0, Gate Tolls with no gate 0, Market Taxes with no market 0). So they are latent second readers, PLAUSIBLE harm, uncounted.

### F10 — Cure 9 moves a band and three surfaces the draft record does not name. CONFIRMED.
`rvw12` 360, base → tip; attributed by `7fcc50374` → `c20042d2c`:
- `rvw12-metropolis-6`: the condition `regional_religious_pressure` severity 0.23 → 0.33, **severityBand "low" → "medium"**, and the defence label Fortress → Well-Defended.
- `rvw12-town-2` and `rvw12-town-133`: the income source "Security Contracts" leaves `economicState.incomeSources`. The safety plot hook "The merchant guild's private security force just detained someone…" leaves `safetyProfile.plotHooks` (QUARREL's surface). `flags.merchantArmy` goes true → false. In town-2, `powerStructure.stability` goes "Fragile (private security, no public law)…" → "Tense — regional monster threat".

All of these follow from the hired-company fact, so they are inside the class. None of them is in the draft record's "WHAT MOVES", and the condition band is a band. The merge seat's predicted rows should carry them.

### F11 — "Commerce is sluggish; markets meet infrequently" beside "Prosperous" and "Daily markets". CONFIRMED, present at the base, not moved by the lane.
- **What a reader would see** (`rvw-ten-6`): a city with "Daily markets", "Market Taxes 33%: … a major civic revenue stream", prosperity "Prosperous", and "Commerce is sluggish; markets meet infrequently and many crafts are in decline."
- **Counts:** on 1,800 fresh births, the sluggish line prints beside Prosperous in 79 towns and beside Comfortable in 95.
- **Where:** both answers come from `src/generators/economy/prosperity.js` (the prosperity label, and `situationDescOf` by `priorityToCategory`). That is the lane's own file, and the function cure 12 wrapped. This is one fact with two answers, a member of the class not on the lane's list.

### F12 — "…handles threats the watch cannot" in towns with no watch. CONFIRMED (small). (The chair's lead 1, found independently.)
- **Where:** `src/generators/safetyProfile.js :: generateSafetyProfile`, `charNote`. It is gated on `hasCharterHall` and names the watch.
- **Seeds:** `rvw12-village-6, -50`, `rvw12b-village-28, -174, -229` (5 of 1,800); `rvw-ten-2`.

### F12a — "Central trade hub" on a road town: the strength reads the crossroads resource, the toll income reads the route. CONFIRMED. (The chair's lead 3.)
- **What a reader would see** (`rvw12-village-19`, plains, trade access "road"): the strength "Central trade hub", the exports "Toll revenue", "Pass transit trade" and "Transit trade", and no Toll Revenue income line.
- **Counts:** on 1,800 fresh births, "Central trade hub" stands on a road-access town in 70. Every one has `crossroads_position` available; 147 more are crossroads towns.
- **Where:** cure 2's `src/generators/resourceGenerator.js :: STRENGTH_SUPPORT['Central trade hub'] = support(['crossroads_position'], ['crossroads'])` licenses the strength by the resource. `economicState.js`'s Toll Revenue and Entrepôt lines license by `tradeRoute === 'crossroads'`. Two answers to "is this a crossroads town". The cure did not create this, but its table chose one of the two answers without reconciling them.

### F12b — "Livestock and dairy (local pastures depleted)" beside a live alpine pasture. CONFIRMED (small). (The chair's lead 2.)
- **What a reader would see:** "Livestock and dairy (local pastures depleted)" in towns whose grazing land is depleted and whose alpine pasture is available.
- **Seeds:** `rvw12-city-1`, `rvw12b-city-33`, `rvw12b-city-136` (3 of 1,800).
- **Why it is a disagreement:** the reason is true of the grazing land, but the label says "pastures". The lane's own strength table counts an alpine pasture as a herd source (`HERD_KEYS`), so the import tells the reader there is no pasture while the record holds one.
- **Where:** the label is `src/domain/resourceSemantics.js` (`grazing_land.shortageImport`, not AGREE's file), pushed by `economicState.js`'s depleted-import loop. The guard's shortage check compares the same key only.
- **Not part of this finding:** the 33 towns with "(local alpine pasture depleted)" name their own resource correctly.

### F13 — Four new lines are not declared. CONFIRMED by reading (grep).
- **Where:** cure 7's "Local coal fires the forges, but the iron is bought in…" (`economicState.js`) and cure 11's three " With nowhere to hold the guilty…" lines (`safetyProfile.js`) are inline branch strings. No siblings table holds them.
- **Against the charter:** §0.8 requires every new or changed line to be declared from its birth. Cures 5 and 12 did declare theirs (`OUTLOOK_HOOK_SIBLINGS`, `PROSPERITY_LINE_SIBLINGS`, enrolled in `scripts/lib/table-pools.mjs`).

### F15 — One of the 38 red rows is the lane's own, filed as the merge seat's. CONFIRMED (the cause is PLAUSIBLE).
- **The row:** `tests/lint/sovereigntyLightingContract.walker.test.js :: THE CENSUS IS AN ASSERTION, NOT A SENTENCE — every stated figure is executed`: "the estate's file count moved — re-measure, do not re-word: expected 3202 to be 3199".
- **Executed:** red at the tip, green at the base.
- **Why it matters:** it counts files, and the lane added them. The hand-back says every one of the 38 is "a byte-identity, digest or corpus figure over generated text … the merge seat's". This one is a census figure the lane re-takes itself, with its cause.

### F14 — Minor record and standard points. CONFIRMED.
- **(a)** The hand-back credits cure 7 with "the viability note beside a live material 43 → 0". Measured with the tip's arm at each commit, those 43 rows clear at **cure 5 (72c902fb8)**, when `foodBalance.js` skips a live material. Cure 7 clears only the 50 income rows.
- **(b)** `src/domain/prose/holderTable.js`: eight drifted citations were re-cited to new LINE numbers (`economicState.js:832`, `:769`, …), where rule 32 asks a drifted cite to be re-addressed to a symbol. The table already holds symbol cites.
- **(c)** Seven edge-bundle commits, each "at the lane's final tip". §0.11 asks for one, last and alone. The last one is alone, so this is noise, not a defect.
- **(d)** Cure 8 edits `src/domain/display/stateProse/generalStateProse.js`, which is in no lane's list. The commit cites "the chair's note of 2026-11-11". I could not find that note in git (`lane/chair-2026-11-08` has no "paid hands" text), so whether it was authorised is the chair's to say.

## The eight steps: what I executed, and what it showed

### Step 1 — Red first, every cure. EXECUTED.
**Method.** I took each cure's test file(s) from the cure commit and copied them into a detached worktree at the cure's parent. I ran vitest there and at the cure, and read each failure message. I also counted the tip's arm (`projectionAgreementFindings`) on the lane's 360 `agree-*` births generated at every cure commit. The two counts table below is from that second run.

| Cure | Parent → cure | Red at the parent, for its cause | Green at the cure |
|---|---|---|---|
| guard | 99bcc6944 → c6e182e84 | arm 1 red (no arm); at c6e182e84 arm 2 red on all 14 seeds | arm 1 6/6 |
| 1 | c6e182e84 → e274891c7 | "expected [ 'timber', 'stone', 'metals', …] to not include 'metals'"; Charcoal and fuel likewise | ✓ |
| 2 | e274891c7 → 72481b477 | strengths `[ 'Grain production', …(3) ]` ≠ `[]`; "provides timber and game…" ≠ "provides game…" | ✓ |
| 3 | 72481b477 → c91789012 | "'A mercenary company provides enforcem…' not to match /mercenary compan/i" | ✓ |
| 4 | c91789012 → 9918f04e3 | agree-town-0/-3: "expected [ 'Grain' ] to deeply equal []" | ✓ |
| 5 | 9918f04e3 → 72c902fb8 | 6 seed rows red (war hook in peace; scarcity beside live iron/timber) | ✓ 14/14 |
| 5 re-spell | 56b55e4d4 → 2a59c4c2e | hookTablesDeclared "each key is a string the branch prints…" red | ✓ 11/11 |
| 6 | f88d87af2 → 570f2c21d | "expected [] to deeply equal [ 'grain', 'livestock' ]"; arm 2 red on 5 seeds | ✓ 40/40 |
| 7 | db9dcb7a4 → 7dd488928 | arm 2 red on agree-village-17, -25, agree-town-7 | ✓ 26/26 |
| 8 | 7dd488928 → 7fcc50374 | "a militia and walls are not paid hands" red | ✓ |
| 9 | 7fcc50374 (src-identical to 74caa5fd1) → c20042d2c | cure 9 pin red; walker red (register lowered 7 → 5 before its reader retired) | ✓ 22/22 |
| 10 | fddcc13a2 → 3f2e6b413 | "RED-FIRST: a ruined courthouse…" red | ✓ (arm 2 stays red until cure 11, the court member) |
| 11 | 3f2e6b413 → 3bca8758c | "RED-FIRST: a court with no prison…" red; arm 2 red | ✓ 12/12 |
| 12 | 5bea66c25 → fe3c54001 | arm 2 red (market seeds) | ✓ 13/13 |
| 13 | fe3c54001 → f61a5a5da | "RED-FIRST: the court-without-prison line names no prison" red | ✓ 14/14 |

The class, counted with the tip's arm (findings, in towns), cure by cure:
- At the base: imports 47, strengths 339 towns / 869 rows, strategic 98, safety mercenary 9, grain import 37, war hook 94, scarcity hook 43, viability note 43, worked land 105, income 50, court 48, market 9. Total 1,468 rows.
- Each cure removes exactly its member, and no count ever rises: 1,468 → 1,421 → 448 → 439 → 402 → 222 → 108 → 58 → 58 → 58 → 58 → 58 → 9 → 9 → 0 → 0.
- One attribution in the hand-back differs; see F14(a).

The hand-back's before → after figures are true on its seeds.

### Step 2 — The guard on towns the lane never saw. EXECUTED.
I ran the whole agreement arm (`projectionAgreementFindings`), and the receipt's `resource_truth` and `food_verdict`, at the tip on 360 `rvw12-*` births and 1,440 `rvw12b-*` births, all at the §0 dials and mix.

**Result: 0 findings, 0 errors, 0 receipt rows, on all 1,800.** The arm, as written, has no instance the lane missed. The instances in F3–F8 and F11–F12 are disagreements the arm does not model, or models as agreement (F3).

### Step 3 — A second reader left behind. EXECUTED (grep, a corpus scan, walker plants).
I searched `src/` for name tests of each homed fact, then scanned the 1,800 fresh births' text for each fact against its home. What I found, fact by fact:
- **Hired company:** no printed disagreement on 1,800 births. 30+ private readers remain outside the lane's files, e.g. `structuralValidator.js` and `power/governanceNarrative.js` ("the mercenary company"). The walker has them banked.
- **Court:** no printed "court sits" text in a courtless town, and no Court Fees line in one. A latent private reader sits in `economicState.js` (Court Fees).
- **Gate:** F5, printed. The private reader in `economicState.js` (Gate Tolls) is latent.
- **Market:** F6 is printed in the food record. The private readers in `economicState.js` (Market Taxes) and `viability.js` are latent: Market Taxes with no market, 0.
- **War** (the cure 5 gate): F4.
- **Food sources:** one home (`foodLandOf`), and every reader takes it: `foodGenerator.js`, `isolationSupport.js`, `fishTradeTwinLines.js`, the vocabulary. That one home is also what carries F2's moves.
- **Local resources in income and import lines:** F3 and F7.
- **The walker census:** real for literal defence words, blind to the court, the gate, other names for a hired company, and aliased words (F9, the plant table).

### Step 4 — What moved that was not meant to. EXECUTED.
I field-diffed every leaf of the record, base → tip:
- **The golden's 525 configurations** (born as the golden births them): 501 rows change, across 46 leaf patterns.
- **`rvw12`, 360 births:** 355 rows change, across 84 patterns.

I then attributed the moves cure by cure (golden: f88d87af2 → 570f2c21d, 7fcc50374 → c20042d2c, 81b942665 → tip).

Undeclared moves (F2, F10):
- `defenseProfile.scores.disaster` (golden 157, fresh 98), `.economic` (105 / 35), `readiness.score`, `readiness.label`: cure 6 in `rvw12-town-79`; cure 9 in 3 more.
- `foodSecurity.storageMonths/storageNote`: 12 golden thorps cross a threshold.
- `activeConditions[].severityBand` (`rvw12-metropolis-6`).
- `incomeSources[].source` ("Security Contracts", 2).
- `safetyProfile.plotHooks` and `flags.merchantArmy` (2).
- `powerStructure.stability` (1).
- `defenseProfile.economicGates.military` (1).

No `generationCoherenceReceipt` leaf moves base → tip on the golden.

**Cures 10–13 claim no band, label or score moves. That claim is TRUE.** 81b942665 → tip moves exactly three leaves:
- on the golden: `economicState.situationDesc` 36, `safetyProfile.crimeTypes[].desc` 21, `guardEffectivenessDesc` 6
- on `rvw12`: 14, 46 and 58

Every moved row is in its class: the situation in no-market towns, the crime and guard lines in court-without-prison towns.

### Step 5 — Twins and declarations. READ, and checked on the ten towns.
I read the twins as sentences. Each one says the same thought for the other case, and none states a thing the town lacks:
- the six market twins
- the three court-without-prison twins and the changed `COURT_NO_PRISON` line
- the three peace iron events and their smith twins
- the timber-raft line and its cart twin
- the strategic readings ("open country", the dropped mountain clauses, "provides timber/game")
- the grain top-up, and the coal income line

Exceptions:
- **The war twin** is not declared `excludes: war: peace` (F4).
- **The market twin** "Trade is what this settlement lives on. Goods change hands at all hours, and the guilds have a hand in every craft." keeps the original's undeclared "the guilds" (PRESUME's kind, inherited, not new).
- **Undeclared lines:** cures 7 and 11 added lines no table declares (F13).
- **Twins in force:** in the ten towns, `rvw-ten-1` (no market) printed the market twin, and `rvw-ten-4` and `rvw-ten-5` (court, no prison) printed the court-without-prison lines. Both were correct.

### Step 6 — The test estate. READ (every change under `tests/`, the two JSON registers, the manifest and the pool script).
- `coherenceAgreeCures.test.js`, `projectionAgreement.test.js`, `defenceFactReaders.walker.test.js` + `.register.json`: new.
  - The register was banked at the base (77, every row with its reason) and shrank once, 7 → 5, with its reader (cure 9).
  - 55a0c4a2a turns `test.each` into `collectSeedFailures` and adds anchors and planted strings. That is a re-spell to the estate's laws, and nothing is loosened.
- `famineStoresOneRounding.test.js`: cure 6's re-take, **re-keyed by identity** to new seeds with its cause stated. Honest, and it is evidence for F2(c).
- `foodDiversity.test.js`: the oracle's grain and livestock pairings are rewritten to the ruled rule. This is the cure's re-take; the test now mirrors the code it checks.
- `foodwaysOneLine.test.jsx`: one golden row swapped by identity (cause stated). `unmark` gains `&#39;` → `'`. That is a normalisation added to the test, with its cause given. Not a loosening of what is asserted, but the chair should know it is there.
- `hookTablesDeclared.test.js`: the count 3 becomes an explicit list of 7 keys. Tightened.
- `outlookHooksResolved.test.js`: re-keyed for two timber events. The same strength.
- `worldFactRederive.test.js`: `CULTURE_READERS` gains `resourceGenerator.js` (the word "Agriculture"). An exclusion list grows by one, with its reason. It is a re-take, but it is upward.
- `proseWiringCensus.walker.test.js`:
  - measured 582 → 586 and not-produced 70 → 66: a truth, re-taken by its writer
  - `docblockReports` 36 → **37**: a count raised by one of the lane's own comments. Small, and upward.
- `scripts/mutation-coverage-manifest.json`: three rationale rows. The walker's ("reds on any new reader") is overstated (F9).
- `scripts/lib/table-pools.mjs`: enrols `PROSPERITY_LINE_SIBLINGS`. `docs/content/wiring-census.json`: re-taken by its writer.

**No test is skipped. No `.skip`/`.todo` was added. The test ratchet's baseline is untouched.**

### Step 7 — The equal-failing set. EXECUTED.
**What I ran.**
- At the tip, in the foreground of a clean detached worktree: `sh scripts/gate-tail.sh npx vitest run tests/generators tests/domain tests/property tests/lint tests/build tests/architecture`.
  - Result: `Test Files 23 failed | 1772 passed | 7 skipped (1802)`, `Tests 38 failed | 24639 passed | 146 skipped (24823)`, exit 1.
- The same 23 files at the base 99bcc6944: `Tests 315 passed (315)`.
  - Only `ledgerCitationIntegrity.test.js` failed to load, at both commits, because a worktree has no local `refs/heads/review-fixes-2026-07-08`. That is the environment's, and not counted below.

**The hand-back's count holds:** 38 rows red at the tip, every one green at the base. They are all moved by the lane, and none is a skip or a timeout.

**The hand-back states them by class, not by title**, so I compared classes:

| File | Rows | What fails |
|---|---|---|
| `generatorGoldenMaster` | 1 | golden identity |
| `dossierProseManifest` | 2 | golden identity |
| `heraldKnowledgeDeskGolden` | 1 | golden identity |
| `espionageDormancyFence` | 1 | golden identity |
| `dmLayerGoldenIsolation` | 1 | byte identity |
| `pipelinePinnedMode` | 3 | byte identity |
| `pipelinePinnedChoosers` | 1 | byte identity |
| `nameHeldThroughAssembly` | 1 | byte identity |
| `rosterFinalUnderHeldRoster` | 1 | byte identity |
| `powerEconomyFreshness` | 1 | byte identity |
| `institutionBudgetPromise` | 1 | byte identity |
| `x46NpcBand` | 1 | byte identity |
| `worldFactRederive` A7 | 1 | byte identity |
| `editWorldFactResources` A2, A6 | 2 | byte identity |
| `generationForkCensus` A1 | 1 | a control-row hash |
| `editCorpusRatchet` A7, A8 | 2 | the edits that reach a reading, 2015 → 2017; the witnessed scores, 36 → 35 |
| `proseFamilyContract` | 5 | scalarRows 37067 → 36344, digests |
| `newsHeadlineContract` / `newsVoiceContract` | file-level | "Wizard News introductions drifted: expected 395, got 386" |
| `observedShapeReaders` | 2 | the executed corpus and its key set |
| `writerReach` | 9 | shapesDigest; two new DARK identities "lastTargetedBy / lastTargetedTick on osr013:npc_merchant_guilds_3_8", which are corpus-driven NPC keys and not a new record key; the mutants, which run on the same corpus |

Every row in that table is a figure over generated output, as the hand-back says.

**The one exception: F15** — `tests/lint/sovereigntyLightingContract.walker.test.js :: THE CENSUS IS AN ASSERTION, NOT A SENTENCE` fails with "the estate's file count moved — re-measure, do not re-word: expected 3202 to be 3199".
- CONFIRMED, red at the tip and green at the base.
- This is a count of the estate's FILES, not a figure over generated text. Its +3 matches the lane's new source and test files (`economy/localMaterials.js`, `coherenceAgreeCures.test.js`, `projectionAgreement.test.js`, `defenceFactReaders.walker.test.js`); that cause is PLAUSIBLE, from the count.
- It is the lane's own re-take with its cause, not the merge seat's golden act, and the hand-back files it under the wrong class.

**Not covered by the equal-failing set:** `typecheck:domain:strict` (F1) is outside the six directories, and it is red.

### Step 8 — Ten towns, read as a reader. EXECUTED.
`rvw-ten-0..9`: a thorp, a hamlet in famine, a village, a village at war, a town, a town in famine, a city, a city under siege, a metropolis, and a metropolis with plague onset. For each I read the food record against the foodways, imports and strengths; the defence record against the safety text; and the court, prison and market lines.

**Contradictions a person would see, in the lane's surfaces:**
- **`rvw-ten-6` (city):** imports "Iron", while the income says "Local ore feeds the smithy directly. Metalwork income is not trade-route dependent" (F3). It also has "Daily markets", Market Taxes 33% and "Prosperous" beside "Commerce is sluggish; markets meet infrequently" (F11).
- **`rvw-ten-7` (city under siege, war = front):** its iron hook is "A new toll on the iron road has made metal dear. Nobody will say who set it" (F4: the site reads peace).
- **`rvw-ten-2` (palisade village, no gate, no watch):** "Everyone comes and goes by the gates…" twice (F5), and "The adventurers' charter hall handles threats the watch cannot" (F12).
- **`rvw-ten-4` (town):** grows 93% with no food source, while it imports "Bulk grain (local fields depleted)" and earns "Grain Sales: Grain purchased from farming regions" (F8).
- **`rvw-ten-3` (village at war):** the roster has Farmland, Common grazing land and a Dairy farmer, yet the food record says "no established food chains" while growing 92%. This follows from the chair's variant S (a source by land, not by institution). It is a reader-visible tension, the ruling's own, not a defect of the cure.

**Seen, and not the lane's:**
- The watch's catalog description "Night patrol and gate duty" / "hold the gates" in towns with no walls and no gate (19 of the 360 `rvw12` births; `src/data/institutionalCatalog.js`, `institutionDescVariants.js`).
- "Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic." in a hamlet of 29 people (`rvw-ten-1`, culture table).
- "Markets … structure urban food supply" in villages (F6's line, with a tier error too).
- An isolated hamlet with no imports offered "spiked the price of grain… what it can still afford to import" (`rvw-ten-1`, the trade-politics hook).

**Read and found sound:**
- every strength and strategic line against its resources
- every mercenary sentence against the home
- every court, prison and no-prison line
- the market lines where a market stands
- the grain top-up in towns at 90%+
- the peace iron and timber twins against the smith and the water
