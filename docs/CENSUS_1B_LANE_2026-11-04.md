# CENSUS-1b — the declared-move unit, the power step, wave 1 (lane record, 2026-11-04)

> A build seat's record for the chair. Branch `lane/census-1b-2026-11-04`, cut from CENSUS-1's tip `ee3b9c7`; the window branch merged once (`82e2a54`, its `ebb5136`: rung 2D units 1–3), the census re-taken after it (`6d6a87d`). Transport push only; no pull request.
>
> **Where this seat stopped (the boundary rule, context budget).** Units A and B are done. Wave 1 items 1 (the vocabulary) and 2's projection half are done and pushed; item 3's function, item 4's function and item 6 are done. **The next seat starts at wave 1 item 2's second half — dissolving the walls twins of `defenceTwinLines.js` and the inland twins of `inlandHookLines.js` into their tables — then item 3's wiring of the 23 draw functions, item 5 (the registers), and the render harness's ledger (below).**

## The byte-identity method

CENSUS-1's: a scratch hasher over the 525 golden configurations' records and soak1k-0..59's records and rendered pages (all tabs + Tonight), sha-256, before and after every unit; soak1k-0..1999's records where a move was expected. Red-firsts were run red in a clean worktree of the base.

## Unit A — the declared-move unit (the home's truth over the retired reader)

| | re-point | births moved, by cause |
|---|---|---|
| (a) `890ecc0` | `safetyProfile` militia → `defenceOf(record).militia` | golden 0/525 · soak 1/60 (soak1k-18) · pages 0/60 · **records 23 of soak1k-0..1999** |
| (b) `f326926` (+ `427f7b1`) | DS-GEN-17 PROVISIONED's hospital → the hospital atom, inside `institutionsPoolKey(inst, record)` | 0 / 0 / 0; the key moves PROVISIONED → BARE on **4 of 2,000** (524, 728, 998, 1970) |
| (c) `f4f765b` | `viability.deriveWaterDependencyAnalysis` → `waterOf` (`waterAccessKind`) | **golden 4/525** (town·germanic·plains·river·v3, town·germanic·plains·port·v3, town·germanic·mountain·random_trade·gm-seed-a, town·germanic·auto·random_trade·gm-seed-c) · soak 5/60 (5, 16, 38, 40, 59) · pages 0/60 · **records 294 of 2,000** |
| (d) `427f7b1` | `arrivalScene.holdsMarket` and DS-GEN-13's `marketPoolKey` → `marketOf`, together | 0 / 0 / 0; born rosters agree 2,000 of 2,000 (only authored or legacy names move) |

(a) + (c) together: 317 of soak1k-0..1999's records. Not re-pointed, by ruling: `foodBalance.hasImportProcessor`, the government pattern sites, the Economy stores row.

## Unit B — the power step reads the entries (`3bed695`)

`generatePower` reads `ctx.stress` and hands the entries (`{ type, direction? }`) to the power intent; `generatePowerStructure` takes the kinds from them and hands them to `stressFactions` and `governanceNarrative`, which call `migrationDirectionOf(<the entry>)`. A held intent written before the field reads `null` and falls back. **Births: 0/525 golden, 0/60 soak, 0/60 pages.** Red-first `powerStepStressEntries.test.js` 3/3 red at `ee3b9c7`.

## Wave 1

1. **The vocabulary** (`c84bd6a`, `src/domain/facts/factVocabulary.js`, import-free). Presence (`needs` / `excludes`; the tag form `X` / `no X`): walls palisade gate watch militia garrison hospital healer market navigable coast river magic temple docks famine starving `other npc`, keyed `institution: <kind>` `ruler:` `war:` `migration:` `terrain:` `route:`; named, no home (refused): soldiers guard lake priest `organised crime` fish grain game livestock imports exports. Bands (one comparator, ≥ > ≤ < =): tier, population, `magic level`, food, stores (months); prosperity unhomed. Crisis: the 15 kinds, the groups threat / hunger / succession / unrest, `calm`, `any`. The kernel's `STATE_MARK_DIMENSIONS` is a re-export of the mark half.
2. **The projection** (`bbfc335`). The STATE annex's tag slot is closed (a mark word, `dm-only`, or a declarable atom, else the projector refuses by name); a pool label's `{…}` brace group projects to `poolMeta.declares` / `crisisScoped` / `colour`. The kernel pre-filters declared atoms against `facts` (law 5 generalised, fail-closed) and every desk entry hands `factsAnswered(settlement, …)`. **Not yet done:** the twin dissolution; the data-table consumers do not yet accept `{ text, … }` lines (they are wired in item 3).
3. **`drawDeclared`** (`8d5b704`): one draw over the full pool, then twin → hash argmax → none; `filterDeclared` (A), `resolveDeclared` (T); the §3.3 walls proof re-run as a test. **Not yet wired** to the 23 functions; the kernel families (the composer) note through `noteDrawnVariant`.
4. **The self-check** (`1718dad`): `presumptionFindings(record, ledger)`; the birth-local ledger `presumptionLedger.js`. Cost: **2.9 ms for 900 declared lines on a metropolis record** (soak1k-5, 119,108 people).
5. **The registers: not started.**
6. **The soak** (`cc1e75c`): `KIND_OF` learns `cert:false-presumption` (−1, STOP); the worker births inside a ledger; `aggregates/declared-share.json`, `run.json`'s `declaredShare` / `falsePresumptions`. ⚠ The render runs in the harness's vite SSR graph, whose ledger module is another instance: display-time K notes are not carried yet (`renderHarness.mjs` must open the ledger through its own `ssrLoadModule` of `presumptionLedger.js`).

## Judgments (vetoable)

- `crisis: any` means **every condition** (the design's §3.2 sentence), not F12's fifth family (any *active* crisis); an annotator's "sayable everywhere" line is never silenced under calm. A line that presumes "some crisis is on" has no group word yet.
- The kernel reads fact atoms only from **vid-bearing** variants: the causal register's open arm names include `market` (JF-CPL-9b).
- Wave 1 routes only `walls` of the kernel's mark dimensions through the one channel (ledger, self-check); the five crisis families keep `crisisAnswered`.
- Unit A (b) moved into `institutionsPoolKey(inst, record)` so the census still sees DS-GEN-17's `readings.inst.*` reads.

## Rows moved, by cause (never re-recorded)

- **Golden:** 4 of 525 rows (unit A (c), water). The committed manifest was already red 525/525 at the base.
- **Wiring census** (re-taken through the door at every change; both `--check`s green): 709 pools / 2,323 variants unchanged; DS-GEN-17's five pool rows gain the `settlement` read (`readPaths` 787 → 792; A (b)); stamps of the six desks, the kernel's composer, `dossierMounts.js` (the merge); `producerIndexFiles` 1275 → 1279.
- **Test pins re-keyed by cause:** `generalStateProseDesk.test.js` (the ruin falsifier's row; the name-class arm → the market home; A (d)); `arrivalScene.test.js` T1-12 (each reader equals `marketOf`; A (d)); the projection contract's T1 (a declarable atom is classified; item 1).

## The 60 and the 1,000

At the merged tip both base (ee3b9c7 + ebb5136) and lane read **STOP on one class, `coh:crisis-blind-prose` in 24** of 60 — the window's rung 2D unit 3 widened that instrument; it is the window's, identical on both sides (0 classes moved). Before the merge (ee3b9c7 → 8d5b704): CLIMB → CLIMB, 102 → 102, 0 classes moved. `declared-share`: no surface yet (nothing wired draws through the ledger at birth); `cert:false-presumption`: 0. At 1,000 (base ee3b9c7 + ebb5136 → lane tip f7e1861): 1,000 → 1,000 settlements, 2,596 → 2,596 findings, 0 → 0 errors, **STOP → STOP on the same two reasons, both the window's** (`coh:crisis-blind-prose` in 278; `A-12:self-vouch-false` at 0.018); 0 classes moved; `declared-share` {}; `cert:false-presumption` 0.

**The vocabulary rulings** (the chair, ~23:35, merged at `5f5ada5`) were applied in `f7e1861`: §1 (bare `crisis`, `excludes: crisis[: family]`, the conjunction, short aliases), §3 (`guardPresence`), §4 (`port`; `lake` dropped). §2's delegated getters, §6's reader faults and tradition water weights, and §7 are the next seat's.

## CENSUS-1c (the second seat, 2026-11-05)

> Continues this branch from `358b0a8`. Transport push only; no pull request. **Where this seat stopped (the boundary rule, context budget):** units 1, 4, 5, 6 and 7 are done; unit 2 is three of the 23 sites; unit 3 (the registers) and unit 8 (wave 2) are not started. **CENSUS-1d starts at unit 2's remaining sites** (Appendix B rows 1–2 generic `pick`/`drawUnique` callers outside npcGenerator, 6–23 — the arrival scene's ⚠ redraw-once, `narrativeGenerator`'s pressure / arrival / settlement-reason draws, `historyCoherence`'s POLITICAL_FLAVOR cascade, the ⚠ per-relationship rumour roll, the ⚠ trapping shuffle, the ⚠ faction-name retry, the service roll, the H display pools (rows 89–111: these are what PDF, Tonight and Foundry draw at render time), and the T branches of `safetyProfile`, `rulingStructure`, `governanceNarrative`, `stressFactions`, `economicState`, `spatialGenerator`, `npcStructure`, `crisisHooks`, `dailyLifeLogic :: DEFENSE_CONTEXT`), plus `NPC_PRESENTATION_MODES` (its site holds no record to answer a declaration), **then unit 3, then unit 8.**

Byte method: CENSUS-1b's — a scratch hasher over the 525 golden records, soak1k-0..59's records and their rendered pages (all tabs + Tonight + PDF + Foundry), sha-256, before (`358b0a8`) and after every unit; soak1k-60..999's records where a move was possible. Red-firsts run red in a clean worktree of `358b0a8`.

| unit | commit | what | golden / soak / pages / records 60–999 moved |
|---|---|---|---|
| 5 | `a073c87` | `factsOf` gains `soldiers` (garrison ∨ hired company), `commander`, `faith` (`faithReadingOf`); the vocabulary names `soldiers`, `commander`, `mercenary`, `priest` (a senior cleric stands). Named-but-refused shrinks by soldiers and priest: exports fish game grain imports livestock `organised crime` prosperity remain (CENSUS-3b's). `factVocabulary.js` strict errors 42 → 0 (one typed `dim()` helper) | 0 / 0 / 0 / — |
| 1 | `11f938b` | the 13 twins dissolve: `defenceTwinLines.js` and `inlandHookLines.js` deleted; each twin a declared sibling set in its original's file (`SERVICE_DESC_SIBLINGS` 2 and `DESC_VARIANT_SIBLINGS` 1 — CENSUS-4's tables; `NPC_HOOK_SIBLINGS` 2 — CENSUS-3's hook table; `NPC_GOAL_SIBLINGS` 3; `CAST_REASON_SIBLINGS` 2; `MILITARY_MODIFIER_SIBLINGS` 1; `BASELINE_CONFLICT_SIBLINGS` 1; `POLITICAL_FLAVOR_SIBLINGS` 1, by sentence), resolved by `drawDeclared.js :: resolveSibling` | 0 / 0 / 0 / 0 of 940 |
| 2 site 3 | `fbba809` | `generateNPCGoal`'s three pools (⚠ the 0.4 stress-goal roll kept on the full pool); `factsOf.js :: birthFactsOf` for a birth in progress | 0 / 0 / 0 / — |
| 2 site 4 | `1d64e08` | the stress-secret draw (⚠ the food pre-filter and the 0.45 roll untouched) | 0 / 0 / 0 / — |
| 2 site 5 | `e57ccfd` | `drawLoyalty` (one `drawUnique`, HK-LAW-6), `pickTitle`, the crime-knowledge pool | 0 / 0 / 0 / — |
| 4 | `9a6e048` | the render harness opens its own graph's ledger per surface; `readStateProse`, the causal register and the decree draw note their draws | 0 / 0 / 0 / — |
| 6a | `d2c73d6` | `hasInstitution`: an `Access to …` row is not the institution (mill; also the parish church, so the institution and faith homes agree); `Ale house` is a tavern | 0 / 0 / 0 / 0 of 940 |
| 6b | `d355328` | `genesis.js`: first-landing, river and tide weigh 0 where `waterAccessKind` is `none` | records 0 / 0 / 0 of 940; **pages 11 of 60** (soak1k-4, 9, 11, 17, 23, 28, 39, 41, 49, 52, 58 — every one landlocked; the Traditions tab's weighted draw) |
| 6c | `f82fc62` | `reader:daily-life-placeholder` reads `factsOf` market and watch; `reader:hook-pools` reads `guardPresence` and `water.navigable`, with the `the old guard` idiom exclusion | an instrument: 0 / 0 / 0 |

**Unit 4's finding.** On soak1k-3 the render ledger carries 229 entries, all `tab:dossier`. The PDF view model and the Tonight sheet make **no** kernel draw at render time (0 entries each, run first on a fresh record): their prose is stored birth-time text plus the display-time H pools of Appendix B rows 89–111. Those count the moment unit 2 wires them; the harness side is done.

**Unit 7, measured (R-F 2 and 5; no cure made — the site is outside CENSUS-1's homes).** On soak1k-1205, -31, -53 and -168 the food record DOES carry the influx: `foodGenerator.js` multiplies consumption by 1.15 under `mass_migration` before `deriveFoodRecord`. The band reads `secure` because the place covers the extra mouths (31 and 168 still grow 12–13 % over need; 53 and 1205 import to a 2 % and 5 % gap), so `familyActiveIn` correctly leaves `hunger` off and "Food Secure" is the record's honest answer. The contradiction is the crisis narrative: `stressNarrative.js :: RENDERERS.mass_migration` prints "New arrivals come faster than housing, food, and employment can absorb them" unconditionally (and `STRESS_TYPE_MAP.mass_migration.viabilityNote`, "food balance stressed"). On soak1k-0..999: 71 influx births, **32 with the band secure or surplus** (the claim false there), hunger on in 6. The cure is a declaration on that renderer's line (`crisis: hunger` / `needs: food: ≤ pressured`), the declaring lane's.

**Sibling "waiting on <atom>" lists:** none exist on origin at 2026-11-05 ~02:00 (the 2b / 3b / 4 / 5 branches are not pushed; census-2, -3 and -4 carry none).

### The 60 and the 1,000 (R-B: BEFORE = `358b0a8`, AFTER = `f82fc62`)

| | 60 before → after | 1,000 before → after |
|---|---|---|
| verdict | STOP → STOP (the base's own) | STOP → STOP, the same two reasons (`coh:crisis-blind-prose` in 278; `A-12:self-vouch-false` 0.018) — the window's, not this lane's |
| findings | 176 → 176 | 2,596 → 2,596 |
| every `coh:*` and `cert:*` class | unchanged | unchanged (`coh:crisis-blind-prose` 278 / 902 → 278 / 902) |
| `cert:false-presumption` | 0 → 0 | 0 → 0 |
| `reader:traditions-water` | 3 → **0** | 40 → **0** (unit 6b) |
| `reader:hook-pools` | 9 → 9 | 113 → **109** (unit 6c) |
| other `reader:*` | unchanged | unchanged (daily-life-placeholder 495 → 495: its `[no-market]` arm dominates) |
| `declared-share` (1,000) | — | tab:dossier 1,764 / 213,783 (now counting render draws); npcs 543 / 39,351; crisis 301 / 301; services 115 / 115; power 114 / 114 |

### Rows moved, by cause (never re-recorded)

Golden 0 of 525 (every unit). Manifest, wiring census (709 pools / 2,323 variants; both `--check`s green after units 1 and 4) and pins: none moved. Tests re-keyed by cause: `tests/generators/defenceTwinLines.test.js` and `terrainPoolsHookLines.test.js` (unit 1: they walk the sibling sets); `factVocabulary.test.js`'s unhomed example `soldiers` → `organised crime` (unit 5). Base-red and not this lane's: `dossierStateProseProjection.contract.test.js` 6 (the 708 → 709 census pins), the strict files `crisisFactFindings.js` and `composeStateProse.js`.

### Judgments (vetoable) and open questions

- Unit 1: a twin sits as a sibling set in its original's FILE, keyed by the original's text, while the original string stays where string consumers read it (services' `desc` is spread into roll results; the desc-variant pairs are shared arrays under the worker's signed byte ceiling). An in-row conversion waits on each owning lane's `textOf` tolerance at those consumers.
- `resolveSibling` keeps the original when NO facts are handed (the retired lookups' rule, for byte identity); `drawDeclared` itself stays fail-closed.
- Unit 6a extended the ruled mill fault to its class (`Access to parish church` was a `temple`).
- Unit 6c kept the hook-pools instrument's people half (a guard-like role) — no home for roles exists.

## CENSUS-1d (the third seat, 2026-11-05)

> Continues this branch from CENSUS-1c's tip `d6f8456be`. Transport push only; no pull request; no sibling merged (they merge this tip). **Where this seat stopped (the boundary rule, context budget):** unit 1 (R-H) done; unit 2 is the ten H display rows of Appendix B rows 89–111 plus row 94 (T); unit 3's two registers are done, but not the wiring census's declared columns; unit 8 (wave 2) is not started. **CENSUS-1e starts at unit 2's remaining sites** (below), then the census columns (unit 3c), then unit 8.

Byte method: CENSUS-1b's hasher (rebuilt as a scratch script: the earlier one was never committed): the 525 golden records, soak1k-0..59's records, and their rendered pages (20 tabs, Tonight, PDF, Foundry), sha-256, base `d6f8456be` against every commit. Red-firsts: unit 1 run red at the base; each site by plant-and-restore of its parent file, with the arm in `tests/domain/facts/displayDrawSites.test.js` (one arm per site, holding the ledger entry and the unchanged text).

| unit | commit | what | golden / soak / pages moved |
|---|---|---|---|
| 1 (R-H) | `d44fe7437` | `crisisAdmits` is the disjunction: one declared kind or family active (`c.has`; hunger by deficit kept). `excludes: crisis: F` is unchanged (checked per active crisis). `calm` and scoped silence admit only with no crisis active; `any` admits everywhere. Rulings doc §1 corrected (dated, struck through) + R-I's sentence. Red-first `crisisDisjunction.test.js` (a)(b)(c). `factVocabulary.test.js`'s conjunction arm re-keyed by cause. | 0 / 0 / 0 on the 60; **pages 0 of 1,000** (soak1k-0..999, every surface). At this base no pool declares a crisis line that a co-active second crisis refused; the pages R-H moves accrue where 2b's / 5's declarations land |
| 2 · 89 | `696461066` | `traditions/prose.js :: pickLine`: TRAD_HOOKS.<cond> (answered by `factsOf` from `collectPlotHooks`), TRAD_OUTCOME_PHRASE.<o>, TRAD_HELD/CANCELLED_SUMMARY | 0 / 0 / 0 |
| 2 · 90 | `a8a9c0dc6` | `hookLines.js`: the conflict walk (HOOK_LINE_POOLS.conflict.<family>; `used` advances as before) and HOOK_LINE_POOLS.foodGap | 0 / 0 / 0 |
| 2 · 111 | `c456d1b4c` | `foodways.js`: FOODWAYS.FRAMES.<n>, FOODWAYS.SOURCE_PHRASES.<src>. ⚠ The probe walk is content-dependent; it walks the same library comparing texts, so its roll count is unchanged | 0 / 0 / 0 |
| 2 · 97–100 | `d1a7b38ea` | `settlementRumors.js`: WHAT_PHRASE_POOLS.<kind> (canonical + variants), HEADLINE_FRAMES.<band>. No facts are handed (world news; ruling 7) | 0 / 0 / 0. The harness renders with no world, so the 1,702 rumour pins hold the text |
| 2 · 101–102 | `b987fc6e2` | `causeConjunctionContent.js`, `causeLifecycleVocabulary.js`: CAUSE_CONJUNCTION.<tier>.<key>, CAUSE_LIFECYCLE.<stage> | 0 / 0 / 0 |
| 2 · 103 | `c74017519` | `warAndRoadNames.js`: WAR_NAME_POOLS / UNTYPED_WAR_NAME_MOLDS / ROUTE_NAME_POOLS through a local declared `pickLine`. The shared world-pulse `pickLine` is untouched (ruling 7) | 0 / 0 / 0 |
| 2 · 110 | `fc38e115c` | `marketPrices.js`: MOVEMENTS.<m> (T, `resolveDeclared`), CRIER_FRAMES.<tag> (H) | 0 / 0 / 0 |
| 2 · 94 | `678a15cbc` | `crisisHooks.js`: LINE_ROLE_CLAUSE.<role> (T; answered by `factsOf`) | 0 / 0 / 0 |
| 3 | `ca1412563` | `declarationRegisters.js` (one reading of the 709 pools); `tests/lint/undeclaredLines.register.json` (shrink-only: **704 pools / 2,201 undeclared lines; 122 of 2,323 declare**; `needsAField` lists technology ×2, season, climate); `tests/lint/crisisScopedPools.register.json` (grow-only, **empty at this base**); walker `declarationRegisters.test.js`, 8 arms, mutant-proven | 0 / 0 / 0 |

**Every site's draw is noted in the ledger, so PDF, Tonight and Foundry now count** (the 60: `pdf:crisis` 228, `pdf:plot_hooks` 203, `tonight:crisis` 57, `tonight:plot_hooks` 51, `foundry:crisis` 114, `foundry:plot_hooks` 101, `tab:economics` 688, `economics` 79 at birth). None declares yet: these are the share's denominators, waiting for the owning lanes' declarations. Sites with no record in scope (rumours, war and road names, market quotes, the tradition beat, the NPC card's conjunction) hand no facts. A declared line there would be refused fail-closed. Each is named in its commit.

**Pure-colour rulings at pool level are now possible:** a `{colour}` brace on a pool's heading removes its row from the undeclared register by name. That is the chair's ruling to make, pool by pool.

**The compose owes a re-take.** Every declaration on 2b / 3b / 4b / 5 lowers a count in `undeclaredLines.register.json`, and 2b's 45 and 5's 14 `{crisis-scoped}` pools are not yet pinned. The walker reds by name at the compose until `RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js` is run there. That is the design's "re-pinned in the same commit", applied to the composed tip.

### Where CENSUS-1e starts

1. **Unit 2's remaining sites.** Display T/A rows: 91 (ECHO_PREFIXES, A), 92 (ALIGNED_BASIS, T; UI labels, a likely `{colour}`), 93 (crisisCast's CAST_REASONS / ABSENCES / STAKE_REASONS outside the sibling sets), 95 (`settlementQuickGuide.js`, CENSUS-4b edits this file; wire after their merge), 96 (hookEscalation), 104–106 (treaty, remembrance, army bands), 107 (`engagementNarrative.js`, no importer: dead?), 108 (faithPanelModel, A), 109 (deityEffects, A). Then the generator sites 1c listed: the generic `pick` / `drawUnique` callers (rows 1–2), the arrival scene's ⚠ redraw-once, `narrativeGenerator`'s three draws, POLITICAL_FLAVOR's cascade, the ⚠ per-relationship rumour roll, the ⚠ trapping shuffle, the ⚠ faction-name retry, the service roll, and the T branches (`safetyProfile`, `rulingStructure`, `governanceNarrative`, `stressFactions`, `economicState`, `spatialGenerator`, `npcStructure`, `crisisHooks`' others, `dailyLifeLogic :: DEFENSE_CONTEXT`). CENSUS-4b also edits `dailyLifeLogic.js` and `npcStructure.js`.
2. **Unit 3c:** the wiring census's `declares` / `lineDeclares` / `undeclared` / `crisisScoped` columns and its `tablePools` table, re-taken through `scripts/wiring-census.mjs`. The table half of the undeclared register (the R/H/T pools) needs that manifest.
3. **Unit 8 (wave 2, R-O):** F12's five crisis-family marks and the `walls` mark become reads of the vocabulary's dimensions; the mount rows' marks go through the census channel. CENSUS-5's DS-DEF-1 WEAK v2 is waiting on this.

### Waiting lists and the named-but-refused list (step 5)

At this tip, `reader: null` covers **organised crime, fish, grain, game, livestock, imports, exports, prosperity**. All are homed by CENSUS-3b (and `guild` by 4b) on their branches, which this lane does not merge, so at the compose the list reads empty. The siblings' waiting lists:
- CENSUS-5: `soldiers` (homed by 1c, on this base); `crime` (3b); DS-DEF-1 WEAK v2's perimeter → unit 8. Its "mute question" rows are ruled by R-L.
- CENSUS-4b: famine#1, indebted#1 and slave_revolt#2 goals declare `no ruler: lord / occupier`, but the ruler is decided after the NPC goal draw. Those lines wait on a draw after the power step, which is a pipeline-order question for the chair.

### The 60 and the 1,000 (R-B: BEFORE = `d6f8456be`, AFTER = `ca1412563`)

| | 60 before → after | 1,000 before → after |
|---|---|---|
| verdict | STOP → STOP (the base's: `coh:crisis-blind-prose` in 24) | STOP → STOP, the same two reasons (`coh:crisis-blind-prose` in 278; `A-12:self-vouch-false` 0.018). Both are the window's / the compose's (R-B), not this lane's |
| settlements · findings · errors | 60 · 176 → 176 · 0 → 0 | 1,000 · 2,596 → 2,596 · 0 → 0 |
| every `coh:*`, `reader:*`, `cert:*` class | 3 of 3 unchanged | 5 of 5 unchanged (`coh:crisis-blind-prose` 278 / 902 → 278 / 902) |
| `cert:false-presumption` | 0 → 0 | 0 → 0 |
| `declared-share` (drawn / declared) | new surfaces: pdf:crisis 228, pdf:plot_hooks 203, foundry:crisis 114, foundry:plot_hooks 101, tonight:crisis 57, tonight:plot_hooks 51, tab:crisis 57, tab:plot_hooks 51, tab:economics 688, economics 79, each 0 declared; the base's rows unchanged | new: pdf:crisis 3,952 · pdf:plot_hooks 3,883 · foundry:crisis 1,976 · foundry:plot_hooks 1,899 · tonight:crisis 988 · tonight:plot_hooks 992 · tab:crisis 988 · tab:plot_hooks 992 · tab:economics 10,845 · economics 1,383 (0 declared each). Unchanged: tab:dossier 1,764 / 213,783 · npcs 543 / 39,351 · crisis 301/301 · services 115/115 · power 114/114 |

### Rows moved, by cause (never re-recorded)

Golden: 0 of 525 at every commit. Pages: 0 of 60 at every commit; 0 of 1,000 for R-H. Manifest, wiring census (709 pools / 2,323 variants) and pins: none moved. Test re-keyed by cause: `factVocabulary.test.js`'s conjunction arm (R-H). New registers: `tests/lint/undeclaredLines.register.json`, `tests/lint/crisisScopedPools.register.json`. Base-red and not this lane's (identical at `d6f8456be`): the projection contract 6, dossierProseManifest 3, crisisBlindDossierProse 1, tonightSheetOnce, hookThemeDraws pin:no-hook-is-lost, generalDeskTabFlow, generationContracts 1, generationForkCensus 4, espionageDormancyFence 1, generatorGoldenMaster 1, sovereigntyLightingContract 2, tuningRegister 8, the negative-assertion and seed-loop walkers' pre-existing offenders, and domain-strict on `crisisFactFindings.js` / `composeStateProse.js`.

### Judgments (vetoable)

- R-H's arm (b) is held in BOTH channels: the kernel's pre-filter (`poolDeclares`) and `drawDeclared`.
- Row 103 is wired at its site with a local declared `pickLine`, never in the shared `proseSelection.js :: pickLine`. Wiring the shared one would have pulled every world-pulse pool into the ledger ahead of ruling 7's second wave.
- The registers read the six leaves directly, not the wiring census. The census columns are a door re-take that moves its pins, so they are left to the next seat (3c).
- The retake spelling is `RETAKE_DECLARATION_REGISTERS`, not `UPDATE_…`: goldenFreeze's roster claims every `UPDATE_*` env as a golden instrument.

### Addendum — the chair's R-A ruling of 2026-11-05 02:30 (read after the boundary report; acted on)

The ruling reordered unit 2: merge CENSUS-4b's tip and wire the registry goal lookup. It reached this seat after its 1,000 had run; it was acted on at once.
- `a3a383ae5` — merge of `origin/lane/census-4-2026-11-04` at `11baceee4`; `gen:dossier-prose --check` green.
- `e267287e7` — `npcStructure.js :: enrichNPCsWithStructure` resolves its registry entry through `resolveDeclared` (tagged; NPC_STRUCTURE.<key>). A refused CALM_ONLY entry is not applied, and the NPC keeps its role goal. **Moves, one cause, against the merge:** golden **409/525** (every golden row carries an active crisis: 120 of 120 checked), soak records 19/60, pages 18/60. Counted, never re-recorded. **The 60:** `coh:crisis-blind-prose` 22 → **7** settlements; the three goal claims fall to 0 (current stability 11 → 0, competent administration 1 → 0, stable institutional competition 4 → 0). What remains is "nobody stops a stranger" 5 (2b) and "food secure" 2 (2c). `cert:false-presumption` 0 → 0. Re-keyed by cause: `regenNpcEnrichment`'s anchor now reads a calm city.
- `40e26d249` — the undeclared register re-taken after the merge: 2,201 → 2,198 lines (DS-ECO-8, -10, -12).
- The 1,000 was NOT re-run after this site. The chair's figure (713 of 791 births on the three claims) is the expectation; the compose's 1,000 is the measurement.
