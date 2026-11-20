# PLACE-1 MEASURE — `economicViability.plotHooks[].hook` (the economy's hooks)

Measured 2026-11-20 at 0899d93e6 by a MEASURE builder for PLACE-1, under `BRIEF-MEASURE-COMMON.md` and
`BRIEF-MEASURE-viabilityHooks.md`, with the chair's added condition as corrected at 17:13 UTC (no row may need a hideable
house or a crime fact; every other house a row needs is listed, row by row: section D). No file under `src/` or
`tests/` was changed.

Every figure below is re-runnable from `docs/chair/2026-11-20/content/place/tools/viabilityHooks/`. Run each from that
directory, except where a command says the repository root.

| script | what it makes | output (committed) |
|---|---|---|
| `find-seeds.mjs <repo>` (repo root) | section 0, step 1: which r2 rows (index < 8) hold a viability hook | `out/find-seeds.txt` |
| `prove-prints.mjs <repo> <views>` (after the two renders of section 0) | section 0: each stored hook, what the one collector says of it, and every rendered surface that carries it | `out/prove-prints.dm.txt`, `out/prove-prints.player.txt` |
| `measure.mjs <repo> 100` | the 600 births (the chair's census birth line and mask copied verbatim, as `../entrepotNote/measure.mjs` copies them); the pipeline's own `onStep` observer reads the hooks and the facts as the `generateNarratives` step returned them (no loader, no draw) | JSON to scratch (not committed) |
| `templates.mjs` | the 21 hook templates, by opening words | — |
| `analyze.mjs <rows>` | sections A and C | `out/analyze.txt` |
| `composer.mjs`, `project.mjs <repo> <rows> [terrain \| ironPeace]` | sections D and E: the candidate pools on the same births (`terrain`: the terrain rows dropped; `ironPeace`: the gap pool alone) | `out/project.txt`, `out/project-noterrain.txt`, `out/project-noiron.txt` |
| `pins.mjs <repo>` | section F: what the composer would store in the pinned test towns and section 0's towns | `out/pins.txt` |
| `hideable.mjs <repo>` | section D: whether any house answering a needed atom can be a hideable house | `out/hideable.txt` |

The census's before (SAME-1's first `OFF-LIST.md`, 84ee38b63 on `origin/lane/same-1-2026-11-20`, the row the chair quoted)
was "of holders": village 6/10, town 12/25 on 50 places a size. Its re-issue (5500c21b4, ranked by the share of ALL
places) lists no row of this field: at 50 a size the field is under its cut. This measure counts both on 100 a size.

---

## 0. THE FIELD PRINTS (the chair's rule of 16:25 UTC)

**Yes. It prints on the Summary group › Plot Hooks tab (`PlotHooksTab.jsx`, the economy's cards, source = the hook's
`category`), in BOTH the DM view and the player view, as the stored string unchanged. The PDF's Plot Hooks chapter and
the session sheet print the same string from the same collector.**

Commands, from the repository root. The places are born fresh by the page census's `configOf`, rendered through the
real `OutputContainer`, and walked by the page census's `walkDossier`:

    node docs/chair/2026-11-20/content/place/tools/viabilityHooks/find-seeds.mjs <repo> > docs/chair/2026-11-20/content/place/tools/viabilityHooks/out/find-seeds.txt
    sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/tools/confinement/run.mjs <repo> <dm> render --workers=2 --seeds=r2r-town-3,r2r-town-5,r2r-village-4
    sh scripts/gate-mutex.sh --run -- node docs/chair/2026-11-20/content/place/tools/safetyDesc/render-player.mjs <repo> <pl> r2r-town-3,r2r-town-5,r2r-village-4
    (cd docs/chair/2026-11-20/content/place/tools/viabilityHooks && node prove-prints.mjs <repo> <dm>/views > out/prove-prints.dm.txt && node prove-prints.mjs <repo> <pl>/views > out/prove-prints.player.txt)

The three were chosen from `out/find-seeds.txt` so that the commonest template and the two runners-up are each held:

- **r2r-town-5** holds S1t, "The settlement grows less food than it eats, and a merchant has offered…" (stored as
  Survival Crisis / critical: G1).
- **r2r-town-3** holds S3 (the grain importer) and S4 (the dam).
- **r2r-village-4** holds I3 (the iron carts).

All four stored hooks print whole on `Summary/Plot Hooks` and on no other walked surface, in the DM view (23, 23 and 22
surfaces walked) and the player view (20 each). The collector (`domain/dossier/plotHooks.js :: collectPlotHooks`) returns
each stored string unchanged (its truth gate re-speaks none of them).

**The PDF and the session sheet.** Neither is a tab the walker reaches. Both read the same collector:
- the PDF: `pdf/lib/viewModel.js` builds `hooks.all` from `collectPlotHooks`, which `pdf/sections/PlotHooks.jsx` prints in
  the `draft_brief` and `canon_dossier` variants. `prove-prints.mjs` builds the view model for each place: all four
  stored strings are in `hooks.all` ("yes", `out/prove-prints.dm.txt`).
- the session sheet: `components/session/SessionMode.jsx` prints `collectPlotHooks` less the hooks the tonight sheet
  (`domain/summary/tonightSheet.js`, itself from `collectPlotHooks`) already shows. By reading the code, not a render.

So the stored string is the printed string, on every surface, for both views. A wording change at the birth moves all
of them at once and nothing at render.

---

## A. THE BRANCHES

**The writers.** Two functions in `src/generators/economy/foodBalance.js`, assembled by
`src/generators/economy/viability.js :: generateEconomicViability` (called once, by
`src/generators/steps/generateNarratives.js`):

- `:: deriveFoodBalanceAnalysis` pushes the F branches (the food balance's own hooks).
- `:: deriveSupplyRiskAnalysis` pushes the S, T and I branches, and resolves every one through
  `drawDeclared.js :: resolveSibling(…, OUTLOOK_HOOK_SIBLINGS, { dropRefused: true })`
  (`src/generators/economy/outlookHookSiblings.js`). A refused line with no admitted twin is dropped there.
- The moderate-gap twin's category and severity are re-graded by `foodBalance.js :: moderateGapGrade`, keyed on the
  twin's exact text (`h.hook === MODERATE_GAP_TWIN`).
- After the pipeline step, `src/generators/steps/assembleSettlement.js` stores the record through
  `domain/coherence/hookTruthRecord.js :: storeTrueHooksOnly`, which drops a hook its truth table refuses (section C).

**Every branch, its condition, and the places of 100 holding it by size** (`out/analyze.txt`, PER TEMPLATE):

| id | the branch (its condition, in one sentence) | thorp | hamlet | village | town | city | metro |
|---|---|---|---|---|---|---|---|
| F1 routeCut | deficit above the deficit cut, route connected and not a road: "The {route} trade route is cut…" | 0 | 0 | 0 | 0 | 0 | 0 |
| F2 nothingBought | gap above the import-dependent cut and no import channel carries food | 0 | 0 | 0 | 0 | 1 | 2 |
| F3 sourceFailed | the same gap, a channel, and a famine: names the failed source | 0 | 2 | 1 | 1 | 0 | 0 |
| F4 poorHarvest | the same gap, a channel, no famine | 0 | 2 | 0 | 0 | 0 | 0 |
| S1 starving | a deficit, route isolated/none/road, food band deficit or worse, a merchant can come | 1 | 0 | 1 | 0 | 0 | 0 |
| **S1t moderateGapTwin** | the same branch where the band is Import-Dependent or Pressured: "The settlement grows less food than it eats, and a merchant has offered…" | **11** | **10** | **12** | **19** | **10** | **16** |
| S1s starvingShut | the starving branch where no merchant can come (isolated) | 5 | 3 | 0 | 0 | 0 | 0 |
| S1b starvingBesieged | the same under a siege | 1 | 1 | 0 | 0 | 0 | 0 |
| S2 hoarded | a deficit off the road, a siege cuts every import | 0 | 0 | 0 | 0 | 1 | 3 |
| S3 importer | a deficit off the road, grain on the import list | 0 | 2 | 0 | 8 | 11 | 12 |
| S4 dam | the same, route river (written in 1/4/5/2/7/5; "the town" drops it outside towns at the birth) | 0 | 0 | 0 | 2 | 0 | 0 |
| S5 blockade | the same, route port and coastal (written in 1/4/1/3/6/8; "The town has…" drops it in every one) | 0 | 0 | 0 | 0 | 0 | 0 |
| S6 bandits | a deficit and route road (unreachable: the road takes the S1 branch first) | 0 | 0 | 0 | 0 | 0 | 0 |
| T2 rafts / T2t carts / T3 short | timber must be imported, processed here; `pick % 2` (population + roster size, no roll); `navigable` twin; no timber import → T3 | 0/0/0 | 0/0/0 | 1/2/1 | 3/1/1 | 7/7/4 | 9/5/4 |
| T1 forest | the same, the other pick, a stand still standing | 0 | 0 | 0 | 0 | 0 | 0 |
| I1 war | iron imported, processed here, the record holds a war | 0 | 0 | 0 | 1 | 0 | 1 |
| **I2 price** | iron imported, peace, `pick % 3 = 0` (smith original or its twin) | 0 | 2 | 1 | 4 | **17** | 11 |
| I3 carts | the same, `pick % 3 = 1` | 0 | 1 | 3 | 5 | 13 | 15 |
| I4 toll | the same, `pick % 3 = 2` | 0 | 0 | 2 | 5 | 2 | 14 |

**Top hook sentence by size, masked, places of 100 (of the size's holders)** (`out/analyze.txt`, BEFORE):

| size | holders | top | of holders | the top hook |
|---|---|---|---|---|
| thorp | 18 | 11 | 61% | S1t, the moderate-gap merchant |
| hamlet | 19 | 10 | 53% | S1t |
| village | 21 | 12 | 57% | S1t |
| town | 46 | **19** | 41% | S1t |
| city | 60 | **15** | 25% | I2, "Iron has doubled in price…" (its smith original; 17 with its twin) |
| metropolis | 74 | **16** | 22% | S1t |

Above the bar of about 15 of 100: **S1t in the town (19) and the metropolis (16)**, and **I2 in the city (15, 17 with
its twin)**. I3 stands at 15 in the metropolis and 13 in the city. Every other branch is at 12 or under. The share among
holders is high everywhere (41 to 61% in the small sizes), but few places hold a hook at all.

Each of these templates prints one fixed text: S1t holds 1 masked text in 78 places, S3 1 in 33; the iron events 2 each
(original and smith twin). Only F3 (the failed source) varies its slot.

---

## B. THE READERS

**(i) Who PRINTS it.** Every printer reads the one collector, `src/domain/dossier/plotHooks.js :: collectPlotHooks`. It
pushes each viability hook as category `economics`, source = its stored `category`, a "high/critical severity" sub-line,
priority 9/8/7 by severity. Before any surface sees a hook, its truth gate `:: speakHooks` re-speaks it
(`coherence/hookTruth.js :: speakHookTruthfully`) or refuses it (`:: hookTruthViolations`), then `dedupeHooks` folds
repeats. The readers:
- `src/components/new/tabs/PlotHooksTab.jsx` (the Plot Hooks tab, grouped by `groupPlotHooksBySourcePage`).
- `src/components/new/SummaryTab.jsx` (the hook count and categories).
- `src/components/session/SessionMode.jsx` (the session sheet: the collector less the tonight sheet's hooks) and
  `src/domain/summary/tonightSheet.js`, `src/domain/summary/tonightAtTheTable.js`.
- `src/domain/summary/settlementQuickGuide.js` (its hook line).
- The PDF: `src/pdf/lib/viewModel.js` (its hooks slice, from the collector) → `src/pdf/sections/PlotHooks.jsx`, in
  `draft_brief` and `canon_dossier` (`src/pdf/variants.js`). `src/pdf/lib/viewModelBodySlices.js` also carries
  `viabilityHooks: v?.plotHooks`, which no section reads.
- `src/utils/generateCampaignPDF.js`, `src/utils/generateWorldBook.js` (DM only: the player book takes no hooks),
  `src/foundry/journalPages.js :: plotHooksPage`, `src/domain/briefs/composers.js`, `src/domain/dossier/dossierSearch.js`,
  `src/lib/structuralFingerprint.js` (count).
All read the field, not its words: any stored sentence prints as the old one did, through the same gate.

**(ii) Who MATCHES ITS WORDS.**
- `src/generators/generationCoherence.js` (the resource arm): `/\b(?:war|armies|siege)\b/` against a peace record;
  `PEACE_IRON_TEXTS = new Set(PEACE_IRON_HOOKS.flat())`, the six peacetime iron texts by exact identity, against a war
  record; `SCARCE_MATERIAL_WORDS` against a live local material. **A new peacetime iron row must join that set** (or the
  set must read the new pool), or the F4 receipt goes blind to it (section F).
- `src/domain/coherence/hookTruth.js` (its word table: famine words, armed force, garrison, soldiers, walls, watch,
  hospital, magic, villagers, "the town", the ruler, the physician, and `STORED_DAYS`), read by the collector's gate and
  by `hookTruthRecord.js :: storeTrueHooksOnly` at the birth (45 of the 600 lose a dam or blockade line there: "the town"
  in a place that is not one). No candidate row uses any of those words (`out/project.txt`, MASK line).
- `src/domain/dossier/plotHooks.js :: speakHooks`: an `economics` hook with `/grain|food|harvest/` counts as the kept
  food hook; where a famine hook was refused and none is kept, the gate adds `foodGapHookLine`. **Every MODERATE_GAP
  row keeps one of those words**, so no gap row lets that fallback in.
- `src/domain/hookThemes.js :: themeOfText`: exact authored keys only; none of these hooks is keyed (UNTYPED before and
  after). `src/domain/facts/warReach.js` reads the iron hook's `category`, never its text.
- `src/domain/edit/recordInvariants.js` `V-SUMMARY-HOOKS` and `viabilitySummary.js :: buildViabilitySummary` count the
  hooks; the count does not move.
- `src/generators/economy/foodBalance.js :: moderateGapGrade` keys on the twin's text: the composer must run AFTER it
  (section F) or the grade is lost.
- Registers: `scripts/lib/table-pools.mjs` (OUTLOOK_HOOK_SIBLINGS, `siblings`), `scripts/census/pool-dominance.register.json`
  (`ledger:foodBalance:OUTLOOK_HOOK_SIBLINGS`, top1 0.4564, 4 lines), `tests/lint/presumedThings.widened.register.json`
  (the starving original's literal), `scripts/mutation-coverage-manifest.json` (the iron pins' rationale).

**(iii) Who COMPOSES FROM IT.** `src/generators/aiLayer.js` quotes the hooks into the AI grounding (`- ${h}`, the first
three as `hooks`). Nothing else quotes the sentence into another string.

**Test files that pin a literal of the field:** `tests/generators/outlookHooksResolved.test.js` and
`outlookHookDropRefused.test.js` (the starving set and the merchant; they call `deriveSupplyRiskAnalysis` directly or
match `/a merchant has offered/`: unmoved, section F), `tests/generators/hookTablesDeclared.test.js` (the set's keys),
`tests/generators/tailCrisisIronHooks.test.js` and `tests/generators/tailDefeconBatch3Lines.test.js` (iron texts on r2r
towns: **move**, section F), `tests/generators/projectionAgreement.test.js` (an iron text into the coherence arm: unmoved),
`tests/domain/bar3Defecon2Lines.test.js` (timber: unmoved), `tests/domain/coherence/hookTruth.test.js`,
`tests/domain/dossier/plotHookTruthGate.test.js`, `tests/generators/hookTruthAtBirth.test.js` (an old starving literal as
a planted string: unmoved).

---

## C. THE FACTS AT HAND

**The S1t holders (78 of the 600; `out/analyze.txt`).** Every one is on a **road** (the starving branch fires only on
isolated, none or road, and the twin refuses isolated). The band the page prints is Pressured in 74 and
Import-Dependent in 4. What varies, and could be said:

| fact | home (`src/domain/facts/…`) | at the call line = final | among the 78 |
|---|---|---|---|
| route `road` | `terrain.js :: tradeRouteOf` via `factsOf` (atom `route: road`) | 600 / 600 | 78 road |
| a market | `market.js` (atom `market`) | 600 / 600 | 49 yes, 29 no |
| a granary | `institutions.js` (atom `institution: granary`) | 600 / 600 | 45 / 33 |
| a mill | `institutions.js` (atom `institution: mill`) | 600 / 600 | 57 / 21 |
| a tavern or inn | `institutions.js` (atom `institution: tavern`) | 600 / 600 | 55 / 23 |
| the terrain | `factsOf().terrain` (atom `terrain: <kind>`) | 600 / 600 | mountain 31, desert 25, forest 17, hills 4, plains 1 |
| a guild | `guild.js :: guildOf` (atom `guild`) | **576 / 600** (3 of the 78 disagree: the call line's record carries no `powerStructure`) | 48 / 30 |
| the food band | `famine.js :: famineOf().shownBand` (atom `food`) | 600 / 600 | Pressured 74, Import-Dep. 4 |
| grain on the import list | `factsOf().imports` (no keyed atom) | 600 / 600 | 42 / 36 |
| the leading food source | `factsOf().foodSources` | 600 / 600 | unknown in 55 |
| stores | `storesMonths` (atom `stores`) | 600 / 600 | 6+ months 37, 1-3 33, 3-6 8 |
| war | `warState.js` (atom `war`) | 600 / 600 | peace 74, at war 4 |

**The iron holders.** The branch guarantees iron on the import list and the peace. What varies: the smith (the existing
twin's atom), the route (road, river, crossroads, port), a market.

**Does a later pass move the hooks?** The hooks the `generateNarratives` step returns equal the final record's in
553 of 600. No later pipeline step writes them; the 47 differences are drops by `assembleSettlement.js ::
storeTrueHooksOnly` (the dam 22, the blockade 23, two starving lines), none of them S1t or iron. No pass appends a hook.

**The seed.** `generateEconomicViability` and both writers are handed no seed (`config._seed` absent at the step,
0 / 600). `ctx._seed` is the birth seed at the `generateNarratives` step in 600 / 600 (the step already hands it to
`generateResourceAnalysis` and stamps it for `generateSettlementReason` and `generateHistory`). The active stream's seed
there is `<seed>::generateNarratives`.

**The key form `pickVariant` callers use:** `narrativeGenerator.js :: generateSettlementReason`
(`` `${seed}::settlement-tier-line::${tier}` ``), `settlementQuickGuide.js :: cultureScopeLine`
(`` `${seed}::culture-scope-line` ``). The proposal's key: **`` `${seed}::viabilityHooks::<poolId>` ``**, one draw a
pool (a place holds at most one gap hook and one peacetime iron hook).

---

## D. THE CANDIDATE WORDINGS (S1t and the peacetime iron events, the branches above the bar)

House idioms followed: the declared rows `{ id, text, needs, excludes }` of `drawDeclared.js`; one draw door,
`drawDeclared(pool, { facts, draw: (p) => pickVariant(p, key), key, poolId, … })`, no roll, a refused draw resolved by
the house's argmax over `hashKey(key::id)`; atoms only from `factVocabulary.js :: FACT_DIMENSIONS` (none new). Row 0 of
each pool is today's text (CANONICAL-AT-ZERO: a falsy seed keeps it). The weight stays: category and severity are not
touched; each row is one or two plain sentences of today's length, a lead with a decision in it and no new crisis (the
gap is the record's own, the iron import and its shortage are the branch's own). No row uses a word the hook-truth table
refuses. The exact table is `tools/viabilityHooks/composer.mjs`.

**The chair's 17:13 condition.** (1) No row needs a hideable house or a crime fact: the atoms used are `route`,
`terrain`, `market`, `institution: granary | mill | tavern | smith` and the war states, none of them a crime atom.
`out/hideable.txt`: of the catalogue's 519 rows (39 hideable by `cardVeil.js :: isHideableHouse`), none that answers
`market` (32 rows), `granary` (3), `mill` (4), `tavern` (11) or `smith` (5) is hideable. No row names a theft, a
smuggler, a fence or a gang. (2) The houses each row needs are in the HOUSES column below, for the later security reader.

**MODERATE_GAP** (replaces the stored text of `MODERATE_GAP_TWIN` only; the twin's own admission, `food: ≤ pressured`
and not deficit, isolated or besieged, stands over the whole pool)

| id | needs | HOUSES needed | text |
|---|---|---|---|
| gap-canon | — | — | The settlement grows less food than it eats, and a merchant has offered to make up the difference for a price that is not paid in coin. |
| gap-price | — | — | The settlement grows less food than it eats, and what it buys in to make up the rest costs more each month; people are asking who sets the price. |
| gap-keep | — | — | The settlement grows less food than it eats, and the families who grow the most have started keeping it back rather than selling it here. |
| gap-buyer | — | — | The settlement grows less food than it eats, and someone must go out and buy the rest this season; nobody wants the errand, and nobody trusts whoever offers. |
| gap-carters | route: road | — | The carters who bring food up the road have raised their rates, and the settlement, which grows less than it eats, must pay them or send its own carts. |
| gap-market | market | market | A stranger bought up most of the grain in the market before the locals could get to it, and the settlement grows too little of its own to shrug it off. |
| gap-granary | institution: granary | granary | The settlement grows less food than it eats, and those who keep the granary are arguing over whether to open it now or hold it against a leaner month. |
| gap-mill | institution: mill | mill | Less grain reaches the mill each week than it did, and the miller wants to know where the rest is going; the settlement grows too little to lose any of it. |
| gap-tavern | institution: tavern, route: road | tavern (or inn) | Travellers at the tavern talk of cheap grain a few days down the road; the settlement grows less than it eats, and someone must decide whether to send for it. |
| gap-mountain | terrain: mountain, route: road | — | Little grows on the slopes around the settlement, and the mule trains that bring up the rest of its food now want paying before they load. |
| gap-desert | terrain: desert | — | Little grows in the dry country here, and the caravan that brings the rest of the settlement's food is overdue, with no word sent ahead. |
| gap-forest | terrain: forest | — | The clearings here do not grow enough food for the settlement; some want to clear more of the forest, and others will not see it cut. |

**IRON_PEACE** (replaces the stored text of any of the six `PEACE_IRON_HOOKS` texts; every row excludes `war: front`,
`war: aggressor`, `war: at war`, as the six do today; the branch guarantees an iron import)

| id | needs | excludes (beside the war states) | HOUSES needed | text |
|---|---|---|---|---|
| iron-price | institution: smith | — | smith | (today's I2 original) Iron has doubled in price this season, and tools are being mended with scrap. Work slows, and people are starting to complain. |
| iron-price-t | — | institution: smith | — | (today's I2 twin) Iron has doubled in price this season, and metal for tools and repairs is hard to come by. Work slows, and people are starting to complain. |
| iron-carts | institution: smith | — | smith | (today's I3 original) The iron carts are three weeks late and the carters will not say why. What iron there is goes out in rations, and work waits on mended tools. |
| iron-carts-t | — | institution: smith | — | (today's I3 twin) The iron carts are three weeks late and the carters will not say why. Broken tools stay broken, and work waits. |
| iron-toll | institution: smith | — | smith | (today's I4 original) A new toll on the iron road has made metal dear. People blame whoever set it, and the tools still need mending. |
| iron-toll-t | — | institution: smith | — | (today's I4 twin) A new toll on the iron road has made metal dear. Nobody will say who set it, and the tools still need mending. |
| iron-slag | — | — | — | The last iron that came in was poor, brittle and full of slag, and those who paid for it want their money back from whoever sold it. |
| iron-bidding | — | — | — | Iron is scarce this season, and two buyers here are bidding against each other for every load that arrives. |
| iron-river | route: river | — | — | The iron barges are late coming up the river, and work here waits on tools nobody can mend. |
| iron-port | route: port | — | — | The ship that carries the season's iron has not come in, and nobody will say what became of it. |
| iron-crossroads | route: crossroads | — | — | Iron that used to be sold here on its way through now goes on to a better buyer, and the place is left short. |
| iron-market | market | — | market | Iron is sold by the pound in the market now, and the price goes up every week. |
| iron-forge | institution: smith | — | smith | The forge here is down to its last good iron, and the work waiting on it grows longer every day. |

Twists kept small and inside the record: a stranger at the market, a quarrel over the granary, carters' rates, a
buyer's errand. None names a house the place lacks (each such house is declared), a crisis the record lacks, a season,
a count, a person by name, or a power.

---

## E. THE PROJECTION

The composer runs on the same 600 births, masked as the census masks (no candidate row holds a digit or a name). The
draw is simulated as the house does it (`out/project.txt`: 173 hooks re-drawn, 78 gap and 95 iron, 72 of them resolved by
argmax; 107 hooks of other branches untouched). Facts are the call line's (section C; `guild` is not used).

**Top share by size: places of 100 holding the commonest hook, before -> after:**

| size | before | after | after, without the three terrain rows | after, the gap pool alone |
|---|---|---|---|---|
| thorp | 11 | 5 | 5 | 5 |
| hamlet | 10 | 3 | 5 | 3 |
| village | 12 | 3 | 4 | 3 |
| town | **19** | 8 | 8 | 8 |
| city | **15** | 11 | 11 | 15 |
| metropolis | **16** | 12 | 12 | 14 |

**The ten commonest after-sentences in the worst size (metropolis, 12 of 100):**

    12  One importer now holds all the grain that comes in from outside and has quadrupled its price; the locals are arguing over whether to pay, find another supplier, or take the grain.
     9  A new toll on the iron road has made metal dear. People blame whoever set it, and the tools still need mending.
     9  The timber rafts stopped coming a month ago, and the shipwrights and builders are bidding against each other for what is left in the yards.
     8  The last iron that came in was poor, brittle and full of slag, and those who paid for it want their money back from whoever sold it.
     8  Iron is scarce this season, and two buyers here are bidding against each other for every load that arrives.
     7  Iron is sold by the pound in the market now, and the price goes up every week.
     5  The timber carts stopped coming a month ago, and the builders are bidding against each other for what is left in the yards.
     4  The settlement grows less food than it eats, and those who keep the granary are arguing over whether to open it now or hold it against a leaner month.
     4  Timber is short this season, and the builders are bidding against each other for what is left in the yards.
     3  No food comes in by trade now, and what is left here is in a few hands; those who hold it have quadrupled the price, and the locals are arguing over whether to pay, wait it out, or take it.

No size stays above the bar. The new top in town, city and metropolis is S3, the grain importer (8, 11, 12), which the
proposal does not touch; it is next if the bar tightens (its facts: grain imported, a market in most, the route). The
terrain rows are not needed for the bar. Every gap row is used; `iron-carts-t` and `iron-port` are never drawn in the
600 (a smithless iron town is rare: 4 places).

---

## F. WHERE THE CHANGE WOULD LIVE

1. **A new data file, `src/generators/economy/viabilityHookPools.js`** (beside `outlookHookSiblings.js`), holding
   `MODERATE_GAP_POOL` and `IRON_PEACE_POOL` (section D's rows) and `viabilityHooksOf(hooks, record, seed)`. It returns
   `hooks` untouched when the seed is falsy. Otherwise, for a hook whose text is `MODERATE_GAP_TWIN`, or one of
   `PEACE_IRON_HOOKS.flat()`, it draws through `drawDeclared` with
   `pickVariant(p, `${seed}::viabilityHooks::${poolId}`)` over `factsOf(record)` and writes back the text only
   (`{ ...h, hook }`: category and severity kept). It imports `domain/facts/drawDeclared.js`,
   `domain/facts/factsOf.js`, `kernel/proseHash.js`, and the two texts from `outlookHookSiblings.js`. Row 0 of each pool
   reads today's text from its home (no duplicate literal).
2. **The one call line: in `src/generators/steps/generateNarratives.js`**, right after
   `const economicViability = generateEconomicViability(…)`:
   `economicViability.plotHooks = viabilityHooksOf(economicViability.plotHooks, { institutions, config: { ...effectiveConfig, tier }, tier, economicState, powerStructure }, ctx._seed);`
   - Why not at the writer: `foodBalance.js` and `viability.js` have no seed (0 / 600), and their direct callers (the
     tests above) must keep today's text. After `moderateGapGrade`, so the grade keyed on the twin's text survives.
   - `powerStructure` is in the record so the `guild` atom equals the final (no row uses it; for a later one).
   - The step already `provides: ['economicViability', …]`; `generateNarratives.js` is none of the files the common
     brief forbids. `foodBalance.js`, `viability.js` and `prosperity.js` take zero lines.
   - The summary's hook count is unchanged (same number of hooks), so `buildViabilitySummary` needs nothing.
3. **Followers the change owes.**
   - `src/generators/generationCoherence.js :: PEACE_IRON_TEXTS` must hold the new peacetime iron rows (read the pool's
     texts), or its F4 receipt ("a hook presumes the peace where the record holds a war") misses them.
   - Registration: a `TABLE_POOLS` row in `scripts/lib/table-pools.mjs` for each pool (drawKind `H`, drawSite
     `generateNarratives.js → viabilityHooksOf`); `scripts/census/pool-dominance.register.json` may re-bank
     `OUTLOOK_HOOK_SIBLINGS` (its top1 falls) and take the two new pools. The walkers that count them:
     `tests/lint/census5dTablePools.test.js`, `tests/lint/wiringCensusDeclared.walker.test.js`,
     `tests/lint/poolDominance.walker.test.js`, `tests/lint/presumedThings.walker.test.js` (green by the rows' `needs`).
4. **The proofs owed.**
   - A red-first test, e.g. `tests/generators/viabilityHookPools.test.js`, on census seeds: (a) a seeded birth stores a
     non-canonical gap or iron hook where the composer draws one; (b) a seedless call returns today's text;
     (c) every stored row's `needs` and `excludes` hold on the final record; (d) category, severity and the hook count
     are byte-identical before and after.
   - The confinement run: `docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir>` must read
     0 non-string differences (the composer adds no draw).
   - **Pinned tests that move** (`out/pins.txt`): `tests/generators/tailCrisisIronHooks.test.js`, FALSE row
     `r2r-town-20` (its `instead` "Iron has doubled…" becomes `iron-forge`), FALSE row `r2r-town-17` (the toll becomes
     `iron-carts`), KEEP row `r2r-town-26` (the carts twin becomes `iron-river`); their `gone` negatives stay true.
     Unmoved: `r2r-town-1` and `r2r-town-49` in the same file, `tests/generators/tailDefeconBatch3Lines.test.js` row
     20893 (`r2r-town-1`), `outlookHookDropRefused.test.js` (no row says "a merchant"; its towns keep their lines),
     `outlookHooksResolved.test.js` (calls the writer directly, seedless).
   - `scripts/mutation-coverage-manifest.json`'s iron-pin rationale names the literals; it moves with the pins.

---

## G. OPEN QUESTIONS for the chair

1. The moderate-gap twin prints as "Survival Crisis / critical" (accented, "critical severity" on the tab) in 56 of its
   78 places, because `moderateGapGrade` reads the ledger's raw band (`secure` there) while the twin is admitted on the
   band the page prints (`pressured`): a named survivor for the food lane, not this field's to cure?
2. Should row 0 (today's text) stay drawable, or be the seedless fallback only? Leaving it in, it still holds 12 of the
   78 gap places.
3. Are the small twists acceptable under THE RULE FOR A HOOK (a stranger buying the market's grain, an overdue caravan in
   desert country, a quarrel over opening the granary), or should the gap rows be plainer?
4. The grain importer (S3, 8 / 11 / 12 in town, city, metropolis) becomes the top hook after the cure: measure it next if
   the bar tightens?
5. Is the iron pool in scope? With the gap pool alone (`out/project-noiron.txt`) the town falls to 8 but the city stays at
   15 (I2's original) and the metropolis reads 14 (I4's original): at the bar, not under it.
6. No ATOM is asked. A wording about the grain import itself ("a load of grain bought for the settlement is overdue")
   would need one: "ATOM imported: grain : src/domain/facts/factsOf.js (imports) : A load of grain bought for the
   settlement is overdue on the road, and those who paid for it want to know where it went." It is not needed for the
   bar.
