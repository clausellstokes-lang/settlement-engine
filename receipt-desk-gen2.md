# RECEIPT — lane DESK-GEN2 — **COMPLETE**
⟦Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 · Dock: $SC/laneGEN2 detached at 940d161ca⟧

STATUS: COMPLETE. Four cars landed on `940d161ca`; porcelain 0; every claim below is labelled
CONFIRMED (executed evidence quoted) or PLAUSIBLE (reasoning only).

    c68d245af  car 1  the general desk's one caller, and the history chapter
    b8241a652  car 2  the viability verdict and the plot-hook framing
    0693496f2  car 3  the gate answers, and five of its answers were mine
    a4ce9f80f  car 4  the notable connection — and a dead lens that was not dead

**Six of my fifteen blocks are lit. `UNMOUNTED_BLOCKS` falls 36 → 30.** Nine remain dark, each with
a measured written reason in the RESIDUE section; two of those nine cannot be mounted at all.

## Arrival receipts (CONFIRMED)
- `git rev-parse HEAD` = `940d161ca155ab2be76c9d15b9a8207d9c2f7c2f` — matches the brief.
- `git status --porcelain | wc -l` = `0`.
- `node_modules`: 453 top-level entries, ALL symlinks into the main repo, 0 real dirs. Not materialised. Untouched.
- Gate state at arrival: `uptime` load-1 = **26.42**; `ps | grep -c '[v]itest/dist/workers'` = **7**;
  a `test-ratchet` run is live out of sibling dock `laneANCH2`. **Quiet window NOT open — no vitest run yet.**


## Re-derived premises (the brief is a claim; these are measurements)
| premise | chair's claim | measured at 940d161ca | verdict |
|---|---|---|---|
| general desk mounts 8 blocks, all `sentence` on `overview` | yes (DS-GEN-2,5,6,3,7,12,13,17) | `dossierMounts.js` L239–262: exactly those 8, all `rung:'sentence'`, all `tab:'overview'` | **CONFIRMED** |
| DS-GEN-6 carries `dimensions:['deficit']` | yes | L246 | **CONFIRMED** |
| 15 blocks remain dark in this leaf | yes | `UNMOUNTED_BLOCKS` L299–303 holds exactly my 15 ids and nothing else | **CONFIRMED** |
| the three dimension-bearing blocks are all in this leaf | yes | kernel `STATE_MARK_DIMENSIONS` + measured `poolDimensions`: DS-GEN-1=[severity], DS-GEN-6=[deficit], DS-GEN-9=[anchor]. No other leaf block carries one | **CONFIRMED** |
| router tab vocabulary = 20 tabs | `summary chronicle versions traditions overview economics services power substrate magic war faith rumors defense npcs history resources viability neighbours relationships` | **25** case labels. The chair's list OMITS `plot_hooks`, `daily_life`, `dm_compass`, `dm_notes`, `ai_notes` | ⛔ **BRIEF INCOMPLETE — corrected.** `plot_hooks` is a real tab and is the honest home for DS-HK-1 |
| OverviewTab is "already 673 wc-lines — measure EFFECTIVE against 600" | 673 | **500 effective** / 674 physical (eslint Linter, skipBlankLines+skipComments) | **CONFIRMED the caution, corrected the figure** — 100 effective lines of headroom, no Glance extraction forced |
| `OutputContainer.jsx` must be physical-line-neutral | at 600/600 | **600 effective exactly** / 1050 physical | **CONFIRMED** — any effective-line addition reds `max-lines` |

Host-tab headroom (effective/600): HistoryTab 287 · ViabilityTab 262 · RelationshipsTab 251 · PlotHooksTab 57.

## THE PRODUCER CENSUS — 48 generated settlements (6 seeds × 8 configs), measured not reasoned
Probe: `$SC/gen2work/producers2.mjs` (generateSettlementPipeline + collectPlotHooks + deriveEscalationClocks).
⚠ My FIRST probe was wrong on two blocks in the same way the leaf's own label-trap note predicts — I read the
corpus title's ABBREVIATED path. Recorded because the correction is the finding:
- `criticalIssueCount` is at **`economicViability.metrics.criticalIssueCount`** (48/48), not `economicViability.*` (0/48).
- plot hooks are **derived by `collectPlotHooks(settlement)`**, not stored at `settlement.plotHooks` (0/48).
Both were "0/48 dark" on the first pass and are fully live on the corrected path. Same shape as DS-GEN-17's
`economicState.compound.inst` trap. **CONFIRMED.**

### LIVE at generation — mountable (CONFIRMED by measurement)
| block | producer evidence over 48 |
|---|---|
| DS-GEN-9 | `history.founding` 48/48 · `historicalCharacter` 48/48 · `historicalEvents[]` 48/48 · the 8 event types seen are EXACTLY the corpus's 8 `event type:` pools · `anchored` true 45/48, false 7/48, undefined 47/48 (mixed within one town) |
| DS-GEN-11 | `economicViability.viable` 48/48 both values · `metrics.criticalIssueCount` 48/48 (0,1,2 seen) |
| DS-GEN-14 | `history.founding` + numeric `history.age` 48/48 |
| DS-GEN-16 | events carry `anchored` + `lastingEffects` 46/48 |
| DS-GEN-18 | `activeChains[]` 48/48 (3–31) · `resourceAnalysis.exploitation` 48/48 · `primaryImports` · `isEntrepot` both values |
| DS-HK-1 | `collectPlotHooks` 18–68 hooks 48/48; the 7 categories seen are EXACTLY `PLOT_HOOK_CATEGORIES`. `deriveEscalationClocks` 45/48; the 4 clock kinds seen are EXACTLY the corpus's 4 clock pools. **11-for-11 closed** |
| DS-REL-2 | `prominentRelationship` 16/48 (real, conditional) · `relationships[]` 48/48 |

### DORMANT-AT-BIRTH — a real writer exists, off the generation path (the DS-STR-2 precedent)
`lifecycleStatus`, `populationHistory`, `urbanFabric` are written by **worldPulse simulation kernels**
(`settlementLifecycleFirstClass.js`, `migrationKernel.js`/`calamityKernel.js`, `urbanFabricKernel.js`);
`neighbourNetwork` is written by **`SettlementsPanel.jsx`** when a user links settlements in a campaign;
`history.ancientRuin` is written by `historyGenerator.js:868` but is **strictly opt-in** on
`config.ancientRuinsEnabled` (2/48 with the flag on, 0/48 without). These are measurements of an absence,
not defaults — mountable in principle, dark on a freshly generated town.

### NOT MOUNTABLE — findings (see the residue section at the end)
- **DS-GEN-1** — the dimension has no producer. Re-derived at my tip: `history.currentTensions[].severity` is an
  **ARRAY on 48/48 settlements, 0 scalars** (`["minor","major"]`, `["major"]`, `["minor"]`). The value is a property
  of the tension TYPE, not a reading of this town. Confirms the leaf's own standing finding. Cure is generation-side
  and moves same-seed output ⇒ **owner-signed, not a lane's**.
- **DS-GEN-10** — PDF chapter openers. `tab` must be a router `case` label and the PDF is not one. Structurally
  unmountable in this registry.
- **DS-REL-2's `flagDriven count > 0` pool** — `flagDriven` has **exactly one site in all of `src/`**, and it is a
  READ (`RelationshipsTab.jsx:100`). No writer anywhere. 0/48. A reader with no writer.

## CAR 1 — LANDED `c68d245af` (parent `940d161ca`)
"the general desk's one caller, and the history chapter". 8 files, +999/−89. Porcelain 0 after; the
pre-commit `lint-staged` altered NOTHING (md5 identical before and after on all three files checked).

**ACT 1 — the one caller.** New `src/components/new/generalDeskRead.js` (92 effective / 800 ceiling) holds the
desk call, the §885.3 gate and every reading. OverviewTab loses the desk import and keeps its layout.
This is the act `generalStateProse.js`'s own docblock costed out and named as its own.
**ACT 2 — three blocks lit.** Mount rows appended at the END of `DOSSIER_MOUNTS`, ids struck from
`UNMOUNTED_BLOCKS` in the SAME commit, only my leaf's lines touched, one id per line:

| position | block | rung | tab | why this tab |
|---|---|---|---|---|
| `history.identity` | DS-GEN-9 | `sentence`, `dimensions: ['anchor']` | `history` | the block's own `sectionTarget` is `["history"]`; its subject is the town's founding, character and the one event it is still explained by |
| `history.founded` | DS-GEN-14 | `sentence` | `history` | `sectionTarget ["history","overview"]`; it bands `history.age`, which the tab's identity header already prints |
| `history.record` | DS-GEN-16 | `sentence` | `history` | `sectionTarget ["history","tensions"]`; it is the verdict on `history.historicalEvents[]`, the tab's own record |

**CONFIRMED (executed):** eslint exit 0 on all 8 files · `OutputContainer.jsx` **600 effective / 1050 physical
before AND after** (line-neutral against the 600/600 ceiling) · OverviewTab 500→452, HistoryTab 287→303,
generalStateProse 416/800 · static walker replay: **reachability 0 faults** over 568 files / 35,475 literals,
**ARM 2 general = 1 site (generalDeskRead.js), GATED**, **ARM 1 history = publicDossier present** · all three
positions draw on **24/24** generated towns with **no unfilled seam**, and a public dossier draws **0** ·
every new fill through the annex's own `fillShapeViolation`: **19/19 ok**.
**PLAUSIBLE (not yet executed):** the vitest suites — a sibling gate held the machine at load 26–112 for the
whole car. See the proof section below.

### Two defects found in RENDERED OUTPUT (not in reasoning) and cured in this car
1. ⛔ **"The The Economic Divide"** — `{calamity}` is `bare-common` and its seams supply their own article.
   Filling it with the event `name` printed a doubled article. `calamityFill` strips the article and REFUSES a
   name carrying an embedded proper noun (the opt-in ancient-ruin event is "The Fall of <Ruin>", and
   lowercasing it would print "the fall of ecserys"). Driven in the DOM, not described.
2. ⛔ **`{founder}`: the annex and the only producer disagree.** The annex declares it `proper` (a NAME);
   `history.founding.foundedBy` writes *"a miller who built a mill and found customers before they found
   customers"*. Left UNFILLED rather than declaring one shape and supplying another. **RAISED FOR THE CHAIR.**

### Two standing claims corrected at this tip
- `powerStateProse.js:900` and `stressorsStateProse.js:78` both decline `{timeband_age}` for want of
  "a duration former in the tree". **`heraldCausalGrammar.js`'s `timeBandOf`/`timeBandWord` ARE that former**,
  and it is a ZERO-IMPORT leaf. Stale, not wrong when written. Both sibling desks may now be able to fill it.
- The chair's 20-tab vocabulary is 25 (see the premises table).

### Judgment calls (vetoable, one line each)
- **DS-GEN-9 speaks about the town and ONE selected event, not one line per event.** DS-GEN-16 owns the
  record's verdict. Two blocks narrating every event row in turn is the page repeating itself about one fact,
  which is the C3 law's own reasoning. The marker event is a SELECTION (nearest anchored, else nearest),
  stated in code, the `worldStressorFor` precedent.
- **`{calamity}` is routed from the event's `name`, not its `type`.** The annex says `type`; at this tip that
  field is the COARSE eight-value category and every value is an ADJECTIVE that cannot be a bare common noun
  without inventing a head noun — which the same annex sentence forbids. The row's `name` is
  `EVENT_TYPE_NAMES[arcType]`, the estate's own type-to-word table one layer finer. **Annex deviation raised.**
- **`{reason}` decided at wiring: NOT FILLED.** The annex left it open ("decidable at wiring and not before").
  Its only candidate is a PREDICATE CLAUSE where every seam wants a bare noun.

## CARS 2–4 — positions, rungs, tabs and why
All rows appended at the END of `DOSSIER_MOUNTS`; ids struck from `UNMOUNTED_BLOCKS` in the SAME commit;
only my leaf's lines touched; the remainder left ONE ID PER LINE for the sibling lane's resolver.

| position | block | rung | tab | why this tab, and what it sits beside |
|---|---|---|---|---|
| `history.identity` | DS-GEN-9 | `sentence` + `dimensions:['anchor']` | `history` | `sectionTarget ["history"]`. Four pools at one position (the DS-GEN-6 precedent): founding, character, the one event the town is still explained by, and how far back it sits |
| `history.founded` | DS-GEN-14 | `sentence` | `history` | bands `history.age`, which the identity header already prints |
| `history.record` | DS-GEN-16 | `sentence` | `history` | the verdict on `historicalEvents[]` as a WHOLE record — a different question from DS-GEN-9's, which is why two blocks may read one record |
| `viability.verdict` | DS-GEN-11 | `sentence` | `viability` | three lenses in the order ViabilityTab already prints them: verdict, contradiction count, first-survey caveat |
| `plot_hooks.framing` | DS-HK-1 | `sentence` | `plot_hooks` | ⛔ a tab the chair's brief omitted. The block IS the framing hooks are read FROM; the hooks keep their own words below |
| `overview.notableConnection` | DS-REL-2 | `sentence` | `overview` | the DATUM (`prominentRelationship.phrasing`) is rendered on OVERVIEW, not on `relationships` — the band belongs beside the datum |

⭐ **NO MOUNT ID LITERAL LIVES IN A TAB.** All eleven general-desk ids are bound once in
`generalDeskRead.js`; the tabs consume drawn sentences. The reachability arm sees exactly one site each.

## THE ARCHITECTURAL ACT — the general desk's ONE CALLER
`generalStateProse.js`'s own docblock costed this out and named it as its own act rather than smuggling it
into a desk car. ARM 2 admits EXACTLY ONE caller per desk; this leaf's blocks live on seven tabs; so the
tabs cannot call it. `src/components/new/generalDeskRead.js` (110 effective / 800 ceiling) now holds the
desk call, the §885.3 paid-surface gate and every reading, and hands each tab the lines for its positions.
NOT in `OutputContainer.jsx` — that would drag the 182 KB leaf into the eager dossier chunk.
**CONFIRMED:** ARM 2 measures `general → 1 site, GATED` after every car.

## PROOF — every exit captured in-shell, under the mutex, in the quiet window
The quiet-window law was applied: the machine sat at load 26–112 with 5–8 vitest workers for cars 1 and 2,
so **not one vitest ran until three consecutive 60-second probes read load < 4.0 AND workers == 0**
(`05:36:48 streak=1 · 05:37:48 streak=2 · 05:38:48 streak=3 → QUIET WINDOW OPEN`). Every run below went
through `sh scripts/gate-mutex.sh --run --`.

| gate | exit | result |
|---|---|---|
| `tests/domain/generalStateProseDesk.test.js` + `tests/ui/generalDeskTabFlow.test.js` | **0** | **57 passed** |
| the three required walkers (mountRegistry, couplingDesk, autoresolveTwoMount) | **0** | **35 passed** |
| `npx vitest run tests/lint/` (WHOLE) | **1** | 8 files / 15 tests red → **5 files / 6 tests**, all triaged below |
| `npm run typecheck:domain:strict` (the REAL script) | **0** | "no strict-type regressions (1121 errors, ceiling 1121)" — ceiling unmoved |
| `npx eslint` on every touched file | **0** | clean |

### PLANT-OUT (the citation law, proven in both directions) — CONFIRMED
Broke the `history.identity` literal in the one caller. **Walker RED:** `history.identity: 0 sites under
src/components`. **UI test RED** on its LIVENESS ANCHOR — the corpus sentence is absent from the rendered
DOM. Restored by **INVERSE EDIT**, verified **`cmp`-identical** to a backup taken BEFORE the plant (md5
`1affd24b9cd3ca126dc4aee7180c0d03` both sides); both suites green again, 34 passed.

### The five reds cured at cause (car 3)
1. `negativeAssertionAnchor` — 4 un-anchored negatives of mine; each now carries `// anchored: <reason>` on
   its matcher line. Only the NEW sites (that walker is a two-sided trap). → green 9/9.
2. `domainAnyCastBaseline` — 1 any-hole of mine (a `reduce` seed). Replaced with a typed `nearestEvent` loop
   and a `HistoricalEventRow` typedef. No baseline widened. → green 19/19.
3. `tuningRegister` — my `TIMEBAND_YEARS_PER_TICK = 52` was a NEW unregistered named constant
   (`P2 0→1`, `UNREGISTERED_NAMED_CEILING 535→536`). ⛔ Raising a ceiling is not a lane's act, so the
   CONSTANT went, not the ceiling: a year in weeks is a calendar fact, now a call argument inside one
   private `yearBand` helper. → 3 arms red → 1.
4. `economyReadModelCoverage` — the new reader was unclassified; FROZEN_DEFERRED with its written reason
   (it RENDERS NOTHING, so it owns no freshness claim). → green 15/15.
5. `observedShapeReaders` — 3 NEW rows against my reader, **all three FALSE**. `prose.history.identity` was
   graded "a key no writer produces on the settlement's history" because the scan grounds an ungrounded
   receiver by the SINGLE-HOME rule. `prose` is the desk's own frozen return value. It is the scan's own
   documented `window.history.replaceState` defect with `prose` in the receiver slot — and its exclusion is
   a host-global list this name cannot join, while the baseline refuses to absorb a NEW identity. Cured at
   the read (the group is destructured once). → violations 2 → 1.
6. Plus a **STALE CONTROL in the walker itself**: `mountsForTab('history')` was pinned `[]` when the table
   was empty, and car 1 mounted three positions on that tab. Now DERIVED from a tab unmounted BY
   CONSTRUCTION, with a non-vacuity arm. **Third instance of this exact staleness in that one file.**

### The six reds that remain, all triaged — CONFIRMED
| file | mine? | disposition |
|---|---|---|
| `clampPrimitiveBaseline` (1) | **no** | named in `_DESK-LAW.md` as the one permitted red |
| `observedShapeReaders` (2) | **no** | the survivor is `economyStateProse.js: isCriminal on incomeSources`, last touched by **sibling car `0e78576d4` DESK-ECONFAITH C3**; `git log 940d161ca..HEAD` shows my cars never touched that file |
| `sovereigntyLightingContract` (1) | **yes** | the lighting census file count `2522 → 2523` — my ONE new `src/` file. Register act |
| `tuningRegister` (1) | **yes** | `generalStateProse.js#DEFICIT_FRACTION_FROM: dependents moved`. Register act |
| `writerReach` (1) | **yes, and it is a GAIN** | see below |

## PREDICTED REGISTER DELTAS — three refreezes, all the chair's to take
1. **mounts baseline** `tests/lint/.dossier-mounts-baseline.json` (shrink-only): `UNMOUNTED_BLOCKS`
   **36 → 30**. A fall, so it banks lawfully.
2. **tuning register** `tests/lint/.tuning-inventory.json`: the row
   `src/domain/display/stateProse/generalStateProse.js#DEFICIT_FRACTION_FROM` moves
   `line 513 → 844`, its `spanDigest` changes, and its `dependents` move
   **`["src/components/new/tabs/OverviewTab.jsx"] → ["src/components/new/generalDeskRead.js"]`** — which is
   the one-caller act showing up correctly in the register. **No ceiling moves.** (I confirmed no ceiling
   moves by removing my own new named constant rather than raising `UNREGISTERED_NAMED_CEILING`.)
3. **lighting census** `sovereigntyLightingContract`: the estate file count **2522 → 2523**, from
   `src/components/new/generalDeskRead.js`. ⛔ **NEW TEST FILE NAMED FOR THE THREE CENSUSES:
   `tests/ui/generalDeskTabFlow.test.js`** — one file for the whole lane, not one per tab. It also moves
   the test-ratchet `totalFiles` and the known-failure file list.
4. **writer-reach** `scripts/.writer-reach-baseline.json`: `anchored on historicalEvents`
   **`web-display=N` → `web-display=R`**.

⭐⭐ **THE WRITER-REACH MOVEMENT IS A GAIN AND I NEARLY REPORTED IT BACKWARDS.** The assertion is
`expect(frozen[row.identity]).toBe(formatted)` — so FROZEN is *Received* and LIVE is *Expected*, which is
the opposite of the labels' first reading. I settled it by reading the frozen FILE directly:
`scripts/.writer-reach-baseline.json` carries `web-display=N` for that identity and the tree now measures
`R`. **This lane LIT `anchored on historicalEvents` on the web-display surface**; the refreeze banks a win.
Method worth keeping: read the assertion's argument order, then the frozen file — never the labels.

## RESIDUE — the nine blocks I did NOT mount, each with its measured reason
⛔ **TWO CANNOT BE MOUNTED AT ALL:**
- **DS-GEN-1** — the dimension has no producer. Re-derived at my tip:
  `history.currentTensions[].severity` is an **ARRAY on 48/48 settlements, 0 scalars**
  (`["minor","major"]`, `["major"]`, `["minor"]`). The value is a property of the tension TYPE, identical on
  every town carrying it, never a reading of THIS town — so any choice is a default in a reading's clothes
  and the kernel is right to fail closed. Confirms the leaf's own standing finding. **The one act that
  lights it is a generation-side collapse, which moves same-seed output ⇒ OWNER-SIGNED, not a lane's or a
  chair's.** A second, independent gap sits behind it: `HISTORICAL_EVENTS_DATA` can write >20 tension types
  and the corpus writes 10 pools.
- **DS-GEN-10** — PDF chapter openers. A mount's `tab` must be a router `case` label and the PDF is not
  one, so this block is **structurally unmountable in this registry**. Lighting it needs a print-side
  position concept, which is a new act, not a desk car.

⚠ **SEVEN ARE MOUNTABLE AND WERE NOT REACHED — I stopped rather than rush them.** Each is DORMANT-AT-BIRTH
(a real writer exists, off the generation path) which the DS-STR-2 precedent already blesses:
- **DS-GEN-8** — `lifecycleStatus` 0/48 (written by `settlementLifecycleFirstClass.js`, a worldPulse
  kernel); `history.ancientRuin` **2/48 and STRICTLY OPT-IN** on `config.ancientRuinsEnabled`; the steadings
  arm needs `worldState.spatialLedgers.satellites`.
- **DS-GEN-15** — `urbanFabric` 0/48; written by `urbanFabricKernel.js` and read canonically by
  `fabricRead.js`. Live in a played world.
- **DS-POP-1 / DS-POP-2 / DS-POP-3** — all three key on `populationHistory`, 0/48 at generation, written by
  three worldPulse kernels (`migrationKernel`, `calamityKernel`, `settlementLifecycleFirstClass`).
  ⚠ There is no `population` tab; the honest host is `overview`, where the population figure already renders.
- **DS-REL-1** — `neighbourNetwork` / `interSettlementRelationships` / `crossSettlementConflicts` all 0/48;
  written by **`SettlementsPanel.jsx`** when a user links settlements in a campaign. `RelationshipsTab.jsx`
  already renders the datum, and that tab already receives `publicDossier`.
- **DS-GEN-18** — ⭐ **MEASURED AND BUILDABLE; here is the route so the next car need not re-derive it.**
  All four antecedents are live over 24 towns: HOME-FED 24/24 (`activeChains[].resourceActive === true`),
  STALLED 18/24 (a non-stable chain with `resourceActive === false`), BOUGHT-IN (`isEntrepot` 12/24,
  `primaryImports` 18/24), UNWORKED 13/24 (`resourceAnalysis.exploitation.unexploited` non-empty).
  ⛔ **ONE BLOCKER, and it is why I did not force it:** STALLED's only two variants BOTH name
  `{institution}`, and the sole producer of that field is `activeChains[].processingInstitutions`, whose
  values are plural category labels carrying an embedded count range — `"Merchant guilds (3-8)"`. §0d's
  digit ban and the `proper` shape both refuse it, and stripping to `"Merchant guilds"` makes the seam
  read *"Merchant guilds at Steinmark outlived **its** feed"* — a number disagreement in front of a reader.
  So DS-GEN-18 can light 3 of 4 pools today and STALLED needs either a singular institution producer or a
  corpus variant that does not name one.

## FINDINGS RAISED FOR THE CHAIR (each needs one line back)
1. ⛔ **The brief's tab vocabulary is 20; the router's is 25.** The omissions are `plot_hooks`, `daily_life`,
   `dm_compass`, `dm_notes`, `ai_notes` — and `plot_hooks` is the honest home for DS-HK-1, which this lane
   mounted there. The chair's other figure (OverviewTab "673 lines") was `wc -l`; **effective is 500/600**.
2. ⛔ **`{founder}`: the annex and the only producer disagree.** The annex declares it `proper` (a NAME);
   `history.founding.foundedBy` writes a lowercase DESCRIPTIVE PHRASE. I left it unfilled rather than
   declare one shape and supply another. Only one of the two can move, and neither is a lane's to move.
3. ⚠ **`{calamity}` — an annex deviation, deliberate.** The annex routes it from a `historicalEvents[]`
   row's **`type`**; at this tip that field is the coarse eight-value category and every value is an
   ADJECTIVE that cannot be a bare common noun without inventing a head noun — which the same annex sentence
   forbids. I routed it from the row's **`name`**, which IS `EVENT_TYPE_NAMES[arcType]`, the estate's own
   type-to-word table one layer finer. Total over all 30 values; refuses embedded proper nouns.
4. ⚠ **Two sibling desks' `{timeband_age}` declination is STALE.** `powerStateProse.js:900` and
   `stressorsStateProse.js:78` both decline it for want of "a duration former in the tree";
   `heraldCausalGrammar.js`'s `timeBandOf`/`timeBandWord` ARE that former and it is a ZERO-IMPORT leaf.
   Both desks may now be able to fill it.
5. ⛔ **The duration ladder tops out below the history chapter's subject.** `{timeband_since}` is the
   ADVERBIAL column and the sixth band is PREDICATE-ONLY, so the slot is unfillable beyond a generation —
   while **89 of 108 generated events (82%) are older than that**. `event type: religious` therefore falls
   silent on an anchored old event: its only duration-free variants are marked for the other side of the
   anchor dimension. Cure is a corpus or ladder act. Pinned in the desk suite both ways.
6. ⚠ **A sibling car left a red in the consist**: `0e78576d4` (DESK-ECONFAITH C3) added
   `isCriminal on incomeSources` to `economyStateProse.js`, an observed-shape violation the baseline cannot
   absorb (it refuses NEW identities). Not mine to cure; flagged so the landing does not inherit it silently.
7. ⚠ **Legibility judgment, vetoable**: DS-HK-1 draws **6–10 framing lines** on a real town (one per hook
   category present, plus one per live clock). That is proportionate to a page carrying 18–68 hooks, but it
   is the largest prose block this lane adds and the chair may want it capped.

## PREDICTED, NOT MEASURED (PLAUSIBLE — no build in a lane)
- Adding `deriveEscalationClocks` to PlotHooksTab's lazy chunk should be near-free, because
  `activeConditions.js` already pulls `hookEscalation.js` into the overview closure. **The chair's build is
  the authority.** The two hook derivations are passed INTO the one caller rather than reached for, so the
  supply-chain and faction-profile leaves do not enter every tab that draws this desk.
- The shared reader is imported by five tab chunks; a bundler may hoist it into a shared lazy chunk. It is
  NOT in the eager dossier chunk, which was the constraint the desk docblock named.

## ⭐ RETROVALIDATION ROW (for the Fable chair)
| # | what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| 1 | **DS-GEN-1 stays dark** — severity is a template range, not a reading | re-run the array/scalar count at the composed tip; the cure is OWNER-SIGNED | `generalStateProse.js` DS-GEN-1 note; desk test "the general desk over the real generator" | ⭐⭐ owner-facing |
| 2 | **`{calamity}` routed from `name`, not `type`** (annex deviation) | that the coarse `type` cannot yield a bare common noun without invention | `generalStateProse.js#calamityFill`; desk test "{calamity} is BARE-COMMON…" | ⭐⭐ |
| 3 | **`{founder}` left unfilled** — annex `proper` vs a producer phrase | which side moves: the annex's shape or the producer's value | `generalStateProse.js` identitySlots note | ⭐⭐ |
| 4 | **DS-GEN-9 speaks about the town + ONE selected event**, not per event | that per-event narration by two blocks would repeat one fact | `HistoryTab.jsx` DS-GEN-9 comment; `significantEvent` | ⭐ |
| 5 | **`flagDriven` count zero is a MEASUREMENT** (I first ruled it dead and was wrong) | `npcGenerator.js:1694` is a real writer; the flag is true only under stress flags | `generalStateProse.js#flagDrivenPoolKey`; desk test "flagDriven HAS a writer" | ⭐⭐ |
| 6 | **the one-caller reader is a plain module under `src/components`** | ARM 2 = 1 site; the byte claim about the lazy chunk (needs a BUILD) | `generalDeskRead.js` docblock; `armcheck` replay | ⭐⭐ build-gated |
| 7 | **three register refreezes + one gain** (mounts 36→30, tuning dependents, lighting 2522→2523, writer-reach N→R) | each figure at the composed tip before banking | this receipt's register section | ⭐⭐ landing |
| 8 | **the walker's stale control was cured, not worked around** | that deriving the empty probe is the right cure (third instance in that file) | `dossierMountRegistry.walker.test.js` | ⭐ |
| 9 | **DS-GEN-18 route is measured but unmounted** | the `{institution}` blocker before anyone re-derives the route | this receipt's RESIDUE section | ⭐ next car |
