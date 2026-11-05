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
