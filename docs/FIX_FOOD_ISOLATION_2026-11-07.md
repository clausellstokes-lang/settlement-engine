# FIX-FOOD-ISOLATION — the isolation-support receipt and the food record made to agree (2026-11-07)

> **STATE: DONE.** The ruling applied as the chair wrote it, with one reading named (the receipt's `hinterland` path counts as import-bearing, §0 end) and one form changed (no persisted `foodImportBound` field: writer reach refused it as a new dark identity, §1). Untenable/precarious isolated towns reading Secure on imports the receipt does not carry: **31 → 0** on the 1,000. Commits: `4b9de82f` (step 0), `bf718398` (the cause, UNSIGNED), `dfdd06ed` (two registers through their doors), and this record. Goldens NOT re-recorded (the merge seat's).

Seat: FIX-FOOD-ISOLATION (Opus 5.5), child of the cloud chair, brief `docs/chair/2026-11-07/BRIEF-FIX-FOOD-ISOLATION-2026-11-07.md`. Branch `lane/fix-food-isolation-2026-11-07`, cut from `origin/lane/integration-2026-11-07` at `a3d3c31b`.

## §0 The measurement (step 0, at the base `a3d3c31b`, before any code)

**Corpus.** The soak 1,000: settlement *i* is `scripts/audit/soak-review/corpus.mjs :: birth(i)` (seed `soak1k-<i>`, the soak's own cell). Per settlement the probe reads the persisted `isolationSupport` receipt and `economicState.foodSecurity` (`importPct`, `foodRecord.{band, grownPct, normalImportPct, magicPct, gapPct}`). Clean tree at the base; 4 processes × 250.

**Isolated by route: 166 of 1,000** (receipt `applicable` ⇔ `tradeRouteAccess === 'isolated'`, 166 = 166).

**The mismatch table (base):**

| status | n | surplus | secure | pressured | importDependent | deficit | famine | import % median (min–max) | n import ≥ 20% |
|---|---|---|---|---|---|---|---|---|---|
| resilient | 7 | 0 | 4 | 3 | 0 | 0 | 0 | 0 (0–5) | 0 |
| viable | 62 | 0 | 25 | 6 | 8 | 3 | 20 | 0 (0–5) | 0 |
| magic_supported | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 17 (17–17) | 0 |
| magic_dependent | 11 | 0 | 5 | 5 | 0 | 0 | 1 | 38 (20–54) | 11 |
| precarious | 19 | 0 | 5 | 2 | 2 | 0 | 10 | 0 (0–29) | 1 |
| **untenable** | **66** | 0 | **31** | 15 | 13 | 2 | 5 | **31 (0–54)** | **43** |

By tier (isolated): thorp 20 (viable 17, precarious 3) · hamlet 35 (viable 24, precarious 11) · village 29 (viable 21, resilient 7, precarious 1) · town 28 (untenable 24, precarious 3, magic_supported 1) · city 25 (untenable 20, magic_dependent 4, precarious 1) · metropolis 29 (untenable 22, magic_dependent 7). Every isolated town and larger without magical transit is `untenable` or `precarious`.

**The mismatch: 36 isolated settlements at `untenable`/`precarious` read `secure`** (31 of them `untenable`); 31 of the 36 rest on imports (`importPct` > 0), 5 grow ≥ 100% of their need (precarious hamlets/thorps — not an import mismatch). W2's finding reproduced: e.g. `soak1k-9` town untenable 24/52, grown 77%, imported 20%, Secure; `soak1k-233` metropolis untenable 61/88, grown 50%, imported 50%, Secure; `soak1k-82` city untenable 32/70, grown 63%, imported 37%, Secure.

**Where the import share comes from.** On an isolated route the writer (`foodGenerator.js :: generateFoodSecurity`) publishes `importCoverage = hinterlandSupply + channelGap × importCoverageRate`. The hinterland carts (`HINTERLAND_SHARE_PCT`: town 20%, city 38%, metropolis 52% of need) flow on every route but a siege; the channel on an isolated route is `max(magic transit rate, FOOD_IMPORT_RATES.minorRoutes 0.08 / minorRoutesVillage 0.05)`. So the 20–50% shares are almost wholly the hinterland's carts, which the isolation receipt does not credit: **0 of the 66 `untenable` receipts carry a `hinterland` path** (1 of 19 `precarious`).

**The pass order (the STOP check — no STOP).** `isolationPass` (derives the receipt; `deps: cascadePass`) → `stressConfirmPass` → `generateEconomy` (the food writer, provisional) → `generatePower` → `neighbourFactions` → `factionCorrelationPass` → `coherenceRepairPass` (re-derives the receipt from the repaired roster: "re-measures support"; sets `_rosterChangedAfterEconomy` if the roster moved) → `economyReconcilePass` (recomputes the economy, food included, when the roster moved) → … → `structuralValidationPass` (`readsVersion: { isolationSupport: 'reconciled' }`). `deriveIsolationSupport` reads tier, route, roster, resources and world law — never food. The receipt is upstream of the food record; the bound is not circular. `FOOD_IMPORT_RATES` carries no owner charter (its header is the channel ladder's design note); W0's cause 4a rules the import SHARE's definition (`importPct` the writer, `normalImportPct` reads it), not the isolated-route figure. The code's text does not contradict the default.

**The readers (the census).** `importCoverage`: `foodGenerator.js`, `economy/foodBalance.js`, `aiLayer.js`, `display/{dossierViewModel,foodBalanceBar}.js`, `edit/{recordInvariants,recordInvariantMeta}.js`, `pdf/lib/{foodCoverage,headlines,viewModelPrimitives}.js`, `EconomicsTab.jsx`. `importPct`: `foodGenerator.js`, `economy/foodBalance.js`, `resourceGenerator.js`. `normalImportPct`: `foodGenerator.js`, `economy/foodBalance.js`, `coherence/readerBattery.js`, `display/validationOnPage.js`. `isolationSupport` / `_isolationSupport`: `isolationSupport.js`, `isolationGenerator.js`, `steps/{isolationPass,coherenceRepairPass,structuralValidationPass,assembleSettlement,resolveConfig}.js`, `structuralValidator.js`, `economy/viability.js`, `generationCoherence.js`, `pipeline.js`, `edit/{recordInvariants,recordInvariantMeta,recordRegister,tracePartition}.js`, `generation/generationForkRegistry.js`, `settlement.schema.js`. Every reader reads the writer's published figures, so a bound applied at the writer reaches them all. Wiring census `--check` exit 0 (709 pools / 2,344 variants / 165 relation rows); writer reach plain run exit 0 (judged 6,730 · LIT 598 · DARK 1,272 · reviewable 488; the §12 WRW-2 HOLD debt is at the base — W2's DS-DEF-12 is not merged here).

**One reading named for the chair.** The ruling lists the receipt's import-bearing paths as `seasonal_access`, `patronage`, `magical_transit`. The writer's `hinterlandSupply` is the receipt's `hinterland` path (the countryside's harvest carted in), so the bound also counts the receipt's `hinterland` path — an isolated place whose receipt credits a hinterland keeps its carts; one whose receipt credits none gets none. On this corpus it binds nowhere it matters (0 untenable receipts carry the path); it keeps viable villages with a demonstrated hinterland from losing carts the receipt itself counts.

## §1 The ruling applied — the code path (`bf718398`, one cause, UNSIGNED)

- **`src/generators/isolationSupport.js :: isolationFoodImportShareOf(support)`** (new, pure, zero draws): for an `applicable` receipt, the capacity of its import-bearing paths (`FOOD_IMPORT_PATH_TYPES`: `hinterland`, `seasonal_access`, `patronage`, `magical_transit`) over `requiredCapacity`, capped at 1; `null` for a connected receipt. The local foodshed (the harvest the writer grows) and the reserves (its stores) are not imports. No tuning dial: the share is the receipt's own ratio, so no register row was needed (tuning walker 76/76 green).
- **`src/generators/foodGenerator.js :: generateFoodSecurity`**: `importCoverage = min(hinterlandSupply + channel, dailyNeed × share)` where the share is read from `deriveIsolationSupport({ tier, tradeRoute: route, institutions, config })` — the same roster, route and resources the persisted receipt is derived from. Everything downstream reads the writer's published figures (`importPct` → `normalImportPct`, the band, the flags, the prosperity modifier, `deficit`/`deficitPct`, the viability view's canonical reconcile), so the band and the couplings follow with no new prose. Magic stays the last substitution: the druid/divine/arcane offset still works on what remains after imports, unchanged.
- **Proof the writer and the persisted receipt agree:** over the 166 isolated towns of the 1,000, published `importCoverage` ≤ `dailyNeed × isolationFoodImportShareOf(settlement.isolationSupport)` on **166 of 166** (CONFIRMED by measurement).
- **What changed against the brief's text, and why.** The brief asked for "the receipt's `evidence` extended with the food bound". The first cut persisted `isolationSupport.foodImportBound = { sharePct, evidence }`; writer reach refused it (DARK and unregistered: `foodImportBound on isolationSupport`, `… on _isolationSupport`, `sharePct on foodImportBound`; ceiling 0) — the same refusal W0 took for its `asOf` field, withdrawn the same way. Lighting it would need a display reader (new prose, forbidden here); banking it would grow the dark debt. The receipt's existing `paths` (type, capacity, evidence each) ARE the why, and the bound is a pure function of them. **For the chair:** if the DM must see the bound itself, that is a DS-DEF-12 line (W2's block), not this lane.
- **Untouched:** `foodBalance.js` (its canonical path reads the writer's split; the legacy direct-caller path is not a pipeline path; its channel label "minor routes and sanctioned caravans" still shows wherever the bounded channel carries anything, and the display gate `importCoverageFinal > 0` hides it where it carries nothing); `foodImportRates.js`; `importDependency` (the advance loop's dial — the simulation untouched); the pipeline order (no step moved).

## The generator moves, for the merge's record

Measured by the stage instruments over the parent at `a3d3c31b` (a clean worktree), each a fresh run at the tip; none re-recorded.

| surface | moved | where |
|---|---|---|
| generator golden master (`golden-master-stage.mjs --against`) | **37 / 525** | all isolated: town 13, city 12, metropolis 12 |
| espionage fence (`refence.mjs --against`) | **39 / 360** | all isolated: town 12, city 15, metropolis 12 |
| herald desk (`herald-stage.mjs`) | **0 / 434** | byte-identical |
| prose manifest rows (`prose-manifest-cells.mjs --out`, base and tip) | **74 / 1,050** | 37 towns × both audiences, all isolated; cells: REPLACED 796 (37 towns), WORDING-ONLY 38 (19 towns), ADDED 76, REMOVED 10, RE-INDEXED 0, ADDITIVE 0; 68,060 unchanged |

The 37 golden rows, by band (base → tip), every one `untenable` by its receipt:

- **12 town** `pressured → importDependent`, VIABLE → **NOT VIABLE** ("Uncovered Local Food Deficit … no dependable trade route", the viability writer's own critical issue), prosperity Struggling → Poor: `town|{arabic, celtic, east_asian, germanic, greek, latin, mediterranean, mesoamerican, norse, slavic, south_asian, steppe}|forest|isolated`.
- **12 city** `pressured → importDependent`, VIABLE → NOT VIABLE, Comfortable → Poor: `city|{the same twelve cultures}|forest|isolated`.
- **7 metropolis** `pressured → importDependent`, VIABLE → NOT VIABLE, Comfortable → Poor: `metropolis|{arabic, east_asian, germanic, greek, mesoamerican, norse, south_asian}|forest|isolated`.
- **5 metropolis** `secure → pressured`, Prosperous → Comfortable: `metropolis|{celtic, latin, mediterranean, slavic, steppe}|forest|isolated`.
- **1 town** band unmoved (`secure`), its import figures bounded: `town|germanic|plains|isolated`.

The other 36 of the 73 golden isolated rows, and every connected row, are byte-identical. The edge-shared bundle (`supabase/functions/_shared/engineBundle.js`) is stale by exactly these rows (`engineBundleReplay`: 37/525 and 39/360) — re-emitted by the merge seat at the final tip, as every merge has done (`build:edge-shared`).

## §2 The referee — the 1,000, base `a3d3c31b` → tip `dfdd06ed`

**The mismatch table (tip; §0 has the base):**

| status | n | surplus | secure | pressured | importDependent | deficit | famine | import % median (min–max) | n import ≥ 20% |
|---|---|---|---|---|---|---|---|---|---|
| resilient | 7 | 0 | 4 | 3 | 0 | 0 | 0 | 0 (0–5) | 0 |
| viable | 62 | 0 | 25 | 6 | 8 | 3 | 20 | 0 (0–5) | 0 |
| magic_supported | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 17 (17–17) | 0 |
| magic_dependent | 11 | 0 | 5 | 5 | 0 | 0 | 1 | 38 (20–54) | 11 |
| precarious | 19 | 0 | 5 | 2 | 2 | 0 | 10 | 0 (0–24) | 1 |
| **untenable** | **66** | 0 | **31 → 10** | 15 → 5 | 13 → **38** | 2 → **8** | 5 | **31 (0–54) → 13 (0–26)** | **43 → 17** |

**The target: no `untenable`/`precarious` isolated town reads `secure`/`surplus` on imports it cannot receive — 31 → 0.** 36 → 15 read Secure at all; each of the 15 receives no more than its receipt carries (import ≤ bound on 15 of 15):

| seed | tier | receipt | grown % | import % | bound % | gap % |
|---|---|---|---|---|---|---|
| soak1k-182 | village | precarious 36/38 | 105 | 0 | 47 | 0 |
| soak1k-274 | city | precarious 55/70 | 71 | 24 | 24 | 4 |
| soak1k-315 | town | untenable 21/52 | 99 | 1 | 8 | 0 |
| soak1k-321 | town | untenable 27/52 | 88 | 8 | 8 | 4 |
| soak1k-351 | town | untenable 27/52 | 88 | 12 | 17 | 0 |
| soak1k-357 | town | untenable 16/52 | 101 | 0 | 8 | 0 |
| soak1k-385 | hamlet | precarious 27/28 | 104 | 0 | 14 | 0 |
| soak1k-399 | town | untenable 16/52 | 92 | 8 | 8 | 1 |
| soak1k-405 | town | precarious 39/52 | 101 | 0 | 25 | 0 |
| soak1k-465 | town | untenable 34/52 | 86 | 14 | 15 | 0 |
| soak1k-555 | town | untenable 20/52 | 104 | 0 | 15 | 0 |
| soak1k-591 | town | untenable 16/52 | 93 | 7 | 8 | 0 |
| soak1k-633 | town | untenable 34/52 | 91 | 9 | 15 | 0 |
| soak1k-651 | town | untenable 20/52 | 85 | 15 | 15 | 0 |
| soak1k-867 | town | precarious 38/52 | 84 | 16 | 27 | 0 |

Five grow ≥ 100% of their need; ten grow 84–99% and close the rest within what the receipt carries (gap under the 5% Pressured cut). **For the chair (PLAUSIBLE, not acted on — outside the ruling):** these ten are where the two models still differ on the HARVEST, not the imports: the receipt scores the local foodshed low (e.g. 6/52) while the writer grows 85–99% of need on the land's `agricultureCapacity`. The ruling bounds imports only; whether the foodshed path should also bound the grown share is a separate question.

Band moves on the 1,000 (all isolated, 41): metropolis secure → importDependent 11, pressured → importDependent 4, importDependent → deficit 3, pressured → deficit 1; city secure → importDependent 4, pressured → importDependent 6, importDependent → deficit 2, secure → pressured 1; town secure → importDependent 1, pressured → importDependent 4, secure → pressured 4. Prosperity: Moderate → Struggling 11, Poor → Struggling 5, Comfortable → Poor 2, Comfortable → Struggling 2, Comfortable → Moderate 1.

**The soak battery** (`soak-review.mjs --count 1000 --workers 4`, base in a clean worktree, both 0 errors, 683 findings each in the run line): `cert:*` 0 → 0, `coh:*` 0 → 0. Finding kinds: `A-09:behaviour-line-share` 8 → 8, `info:battery-would-not-vouch` 675 → 675, `reader:tension-memory` 61 → 61, `reader:faction-role-fit` 519 → 514, `reader:relation-types` 230 → 225. The two reader moves are 28 changed findings (19 gone, 9 new), **all 28 on isolated settlements** (12 seeds: soak1k-82, 233, 275, 317, 359, 365, 400, 413, 611, 670, 899, 976) — the cast redrawn on economies that moved; no finding kind is new. **The top twenty frames: unchanged** (same twenty, same order; counts shift by single digits). Settlement lines moved: 56 of 1,000, **0 connected**.

## §3 The doors' receipts (each from its own run, at the tip unless named)

| door | result |
|---|---|
| `tests/generators tests/lint tests/scripts` whole, tip `dfdd06ed` | 434 files, 4,827 tests: **15 red, the base's exact 15** (same test names; the base run in the clean worktree at `a3d3c31b`); 0 mine |
| the four goldens (`generatorGoldenMaster`, `espionageDormancyFence`, `heraldKnowledgeDeskGolden`, `dossierProseManifest`) | 5 red at the tip, **the same 5 red at the base** (the integration tip awaits the merge seat's re-record); my deltas are the stage measurements above |
| the food/isolation suites inside that run (`foodBaseNumbers`, `foodModelSingleWriter`, `isolationSupport`, `isolatedTrade`, `foodImportChannels`, `w0WriterAgreement`, `powerEconomyFreshness` but its A4, red at the base) | green |
| writer reach plain run | **exit 0**, judged 6,730 · LIT 598 · DARK 1,272 · reviewable 488 — **identical to the base** (no identity added) |
| wiring census `--check` | **exit 0**, 709 pools / 2,344 variants / 165 relation rows (base identical) |
| observed-shape readers (plain) | **exit 0**; no `--write` (no read moved: the new read is of `paths`, already observed) |
| tuning register walker | **76/76**; no dial registered (none needed) |
| lighting census | refrozen through its door (`LIGHTING_CENSUS_REFREEZE=FIX-FOOD-ISOLATION`): titles 28,535 → 28,537 (the two new test titles), every other figure unmoved; the plain re-run green |
| source-citation roster | `dated` 136 → 137 (this record, born dated, 0 past-EOF); walker green |
| `npm run build` | exit 0 |
| `npm run verify:dist` | **exit 1**. At the base: exit 1 on SKIPPED rows only (`engineAbsentWhenRemote` ×4, `engineBundleReplay` ×2 known-stale). At the tip three rows FAIL besides: `engineBundleReplay` (the edge bundle stale by exactly the 37/525 and 39/360 above — the merge seat re-emits it), `generationWorkerLazy` (worker **1,695,569 → 1,695,939 B, +370**, ceiling 1,695,569), `vendorPdfLazy` (engine chunk **707,702 → 708,072 B, +370**, bound < 707,703). Both +370 B are this cause's code (`isolationFoodImportShareOf` and the writer's bound). **Ceilings not touched**; the merge seat re-records at the final tip. |

Pins re-keyed in `bf718398`, each with its cause in the file: `foodBaseNumbers` (the FOOD-2 hinterland law pinned on a road, where the carts run; a new anchored isolated arm: a bare isolated town imports 8% = seasonal access 4/52, band Pressured, the same town on a road 20%); `foodModelSingleWriter` non-vacuity floor 300 → 250 by measurement (305 at the base → 274: the 31 golden towns now NOT VIABLE no longer print the VIABLE verdict's "has N operational dependencies" sentence); `powerEconomyFreshness` A3 32 → 31 and A6 29 → 28 (one row, `town|germanic|forest|isolated`, bisected base vs tip with the row named: its forest world already reads the deficit the desert change used to open); `isolationSupport` gains the bound arm (hinterland 14 + seasonal 8 of 52; the foodshed's 42 and the reserves' 6 excluded; a connected receipt bounds nothing).

## CONFIRMED vs PLAUSIBLE

- CONFIRMED (measured): the mismatch 31 → 0; imports ≤ the persisted receipt's bound on 166/166; every golden/fence/prose movement isolated; herald 0; no connected settlement moved in the 1,000; `cert:*`/`coh:*` 0; the suite reds the base's; the +370 B in both bundles.
- PLAUSIBLE (reasoned, not measured further): that the ten remaining Secure untenable towns are a harvest-side disagreement (foodshed path vs `agricultureCapacity`), for the chair to rule on or leave.

**Tip:** the commit carrying this record on `lane/fix-food-isolation-2026-11-07` (its parent `dfdd06ed`).

---

# SECOND SEAT — the harvest side (2026-11-08)

> **STATE: COMPLETE (the chair, 2026-11-08). One register admission is owed at the merge (§S4): the observed-shape row, red on this lane by the chair's ruling because no lane door can bank it.** The chair's ruling of 2026-11-07 (relayed on hand-back of `ff260abb`): *one source for how much the land grows* — the receipt's `local_foodshed` (and `hinterland`) capacity is derived from the same production figure the food writer computes, as a pure function of pre-economy inputs. Applied as ruled. Untenable/precarious isolated towns reading Secure: **15 → 0** on the 1,000 (the import side was 31 → 0 at `bf718398`), **0 on either side**. Commits: `89f947526` (refactor, 0 moved), `ddf0da3f4` (refactor kept in the writer's file, 0 moved), `46459cb16` (the cause, UNSIGNED), `4f9ee1844` (tuning inventory), `52800917a` (lighting census), and this record.

## §S0 The measurement (at `ff260abb`, before the cause)

The 10 untenable towns that read Secure (all `town`, all isolated, no food stress):

| seed | receipt | receipt foodshed | its evidence | writer grows (land) | terrain (agri) | food sources |
|---|---|---|---|---|---|---|
| soak1k-315 | 21/52 | 11 (21% of 52) | marshlands, Mills | 99% | plains 1.5 | none |
| soak1k-321 | 27/52 | 17 (33%) | marshlands, Mills, Fish market | 86% | hills 0.9 | none |
| soak1k-351 | 27/52 | 12 (23%) | Mills, Sawmill | 95% | riverside 1.3 | none |
| soak1k-357 | 16/52 | 6 (12%) | Mills | 99% | plains 1.5 | none |
| soak1k-399 | 16/52 | 6 (12%) | Mills | 95% | riverside 1.3 | none |
| soak1k-465 | 34/52 | 14 (27%) | hunting grounds, Mills | 84% | coastal 0.8 | none |
| soak1k-555 | 20/52 | 6 (12%) | Mills | 99% | plains 1.5 | none |
| soak1k-591 | 16/52 | 6 (12%) | Mills | 99% | plains 1.5 | none |
| soak1k-633 | 34/52 | 20 (38%) | hunting grounds, foraging, Mills | 95% | riverside 1.3 | none |
| soak1k-651 | 20/52 | 6 (12%) | Mills | 95% | riverside 1.3 | none |

Every isolated place, receipt foodshed as % of required vs the writer's land harvest (median, range): thorp 91 (55–123) vs 107 (91–124); hamlet 93 (64–121) vs 105 (91–124); village 63 (47–105) vs 102 (86–118); **town 27 (12–42) vs 95 (73–99); city 26 (9–46) vs 65 (56–77); metropolis 20 (7–35) vs 51 (44–59)**.

**Where and why they diverge.** The receipt scored a fixed point per named food resource (`FOOD_RESOURCE_CAPACITY`, 5–14 each, capped 38) plus 6 per food-named institution (capped 24), all capped at 48 absolute points — points that do not scale with the tier's `REQUIRED_CAPACITY` (22 → 88). The writer's FOOD-2 arithmetic (chair ruling 2, 2026-11-03) grows a household's need on ordinary land: `(1 − hinterlandShare) × grownShareOf(effectiveAgri)`, with `effectiveAgri` the terrain's `agricultureCapacity` plus the food-source pairings' bonuses — so a plains town with **no** food-source pairing still grows 99%. **123 of the 166 isolated places have no food-source pairing at all.** The gap therefore opens with tier: small places roughly agree, towns and larger diverge by 30–70 points of required.

**The dependency check (no STOP).** The writer's land arithmetic reads the tier, the roster's names, the terrain, the route (for water access), the resources with their depletion, and custom content. None of it is written by the economy pass. The year's stresses and the seeded crop fortune are NOT in it (the writer applies them on top). The receipt stays upstream.

## §S1 The ruling applied — the code path

- **`foodGenerator.js :: foodLandOf(tier, institutions, config, route)`** (exported, pure, zero draws): the writer's own land arithmetic — the institution flags, the five food sources, `TERRAIN_DATA.agricultureCapacity`, the resource and custom-producer bonuses, the custom-consumer need bonus — extracted unchanged out of `generateFoodSecurity`, which now calls it. It also returns `grownShareOfNeed = (1 − hinterlandShare) × grownShareOf(effectiveAgri) / (1 + customConsumerNeedBonus)`. Extraction moved **0/525 golden and 0/360 fence rows** (`89f947526` measured, `ddf0da3f4` re-measured). It first lived in a new `foodLand.js`; it was moved back into `foodGenerator.js` because writer reach's dark register, the observed-shape readers, the tuning inventory and the prose wiring census all key those reads and dials to `foodGenerator.js`. Cost: a function-level import cycle `foodGenerator.js ↔ isolationSupport.js` (both use the other's functions only inside function bodies; no module-evaluation dependency; no cycle rule exists on the tree).
- **`isolationSupport.js :: deriveIsolationSupport`**: `local_foodshed.capacity = round(grownShareOfNeed × requiredCapacity)`, with evidence `land:<terrain>`, `source:<kind>` for each food source, `custom-producers:<n>` where present, and `grown:<N>% of need`. `hinterland.capacity = round(hinterlandShareOf(tier) × requiredCapacity)` (village 2, town 10, city 27, metropolis 46; none for thorp/hamlet) where the evidence holds (two or more hinterland institutions, or three or more food resources), with evidence `share:<N>% of need`. The fixed-point `FOOD_RESOURCE_CAPACITY` scores and the food-institution count are retired; the food-resource list stays as hinterland evidence. Reserves, seasonal access, patronage and magical transit are unchanged. The first seat's import bound now reads the re-derived hinterland path.
- **What did NOT move:** the food record. On the 1,000, **0 food bands and 0 import shares moved** (the receipts move, the food record does not); the first seat's bound binds where it did.

## The generator moves, second seat, for the merge's record

Measured over the parent output (`ff260abb` = `ddf0da3f4` by bytes), none re-recorded:

| surface | moved | where |
|---|---|---|
| generator golden master | **73 / 525** | every isolated row (thorp 12, hamlet 12, village 12, town 13, city 12, metropolis 12): the receipt's paths, capacity, status |
| espionage fence | **90 / 360** | every isolated row (15 per tier) |
| herald desk | **0 / 434** | byte-identical |
| prose manifest | **2 / 1,050 rows** | `town|germanic|plains|isolated` × both audiences, `overview.warnings` (2 cells REPLACED; 68,968 unchanged) |

Golden statuses (parent → tip): town ×12 forest `untenable → precarious`; city ×12 forest `untenable → precarious`; metropolis ×12 forest `untenable` (unchanged status, receipt figures moved); thorp, hamlet, village ×12 each forest `viable` (figures moved); `town|germanic|plains|isolated` `untenable → viable`, and its viability verdict reads "△ VIABLE WITH PROVISIONING STRAIN: 1% of daily food need remains uncovered" in place of "✓ VIABLE … has 1 operational dependency" (the viability writer's own coupling; band Secure and prosperity Poor unchanged). No golden food band moved.

## §S2 The referee — the 1,000, `ff260abb` → `52800917a`

| status | n (before → after) | secure | pressured | importDependent | deficit | famine |
|---|---|---|---|---|---|---|
| resilient | 7 → 16 | 11 | 1 | 1 | 2 | 1 |
| viable | 62 → 91 | 33 | 12 | 14 | 1 | 31 |
| magic_supported | 1 → 11 | 5 | 5 | 0 | 0 | 1 |
| magic_dependent | 11 → 0 | — | — | — | — | — |
| precarious | 19 → 35 | **0** | 4 | 24 | 4 | 3 |
| untenable | 66 → 13 | **0** | 0 | 9 | 4 | 0 |

Status moves: untenable → precarious 35, untenable → viable 18, untenable stays 13 (12 metropolises, 1 city); precarious → viable 16, → resilient 3; magic_dependent → magic_supported 11 (the mundane paths now carry the required capacity, magic is the margin); viable → resilient 8; resilient → viable 3; magic_supported → resilient 1. By tier: thorp viable 18 / resilient 2; hamlet viable 34 / resilient 1; village viable 19 / resilient 10; town precarious 8 / viable 17 / resilient 3; city precarious 17 / viable 3 / magic_supported 4 / untenable 1; metropolis precarious 10 / untenable 12 / magic_supported 7.

**The target: no untenable or precarious isolated town reads Secure on either side — 0** (15 at the parent, 36 at the integration base). Imports ≤ the receipt's bound: 166/166.

**The residue, by name — the reverse direction (for the chair; not acted on).** 18 places the receipt calls viable or resilient read Import-Dependent or Deficit. **Every one carries a stress that cuts this year's harvest or adds mouths**, which the receipt (the land's ordinary year) deliberately does not read: plague — soak1k-333, 374, 789, 913; war — 350, 764; mass migration (arrivals) — 98, 354, 637, 670; slave revolt — 486, 757, 897; occupation — 507, 628; siege — 704, 872, 984 (deficit, 67–70% gap). Whether the receipt should read the year's stresses is a separate question; the ruling made it read the land.

**The soak battery** (`soak-review.mjs --count 1000 --workers 4`): 0 errors both; **every finding identical** to the parent (A-09 8, info 675, faction-role-fit 514, relation-types 225, tension-memory 61; 0 changed findings); `cert:*`/`coh:*` 0; top twenty frames unchanged; 166 settlement lines moved (the receipts), **0 connected**.

## §S3 The doors' receipts, second seat (each from its own run at `52800917a` unless named)

| door | result |
|---|---|
| `tests/generators tests/lint tests/scripts` whole | 434 files, 4,828 tests: **16 red** — the base's 15 (same test names) **less** `domainAnyCastBaseline`'s overrun arm (red at the base, green here; not investigated, not claimed), **plus** the 2 observed-shape arms of §S4 |
| writer reach plain | exit 0, judged 6,730 · LIT 598 · DARK 1,272 · reviewable 488 — identical to the base |
| wiring census `--check` | exit 0, 709 pools / 2,344 variants / 165 rows |
| tuning inventory | refrozen through its door (`TUNING_INVENTORY_REFREEZE=FIX-FOOD-ISOLATION-2`, `4f9ee1844`): no value moved; the three famine dials gain `isolationSupport.js` as a dependent and sit one line lower; 270 tables / 535 named / 6,944 bare; walker green |
| lighting census | refrozen through its door (`52800917a`): titles 28,537 → 28,538 (the new arm); walker green |
| `npm run build` | exit 0 |
| `npm run verify:dist` | exit 1, the same three rows as the first seat: the edge bundle stale by exactly 73/525 and 90/360 (the merge seat re-emits); worker **1,695,939 → 1,696,719 B (+780; +1,150 over the integration base)**; engine chunk **708,072 → 708,851 B (+779; +1,149 over the base)** — `foodLandOf`'s returned land object and the receipt's evidence strings. Ceilings untouched. |

Pins re-keyed in `46459cb16`, cause beside each: `isolationSupport` — the transit-scaling arm moved city/plains → metropolis/desert (a bare plains city now grows 77% and its gap, 12, sits under the 42 floor; a desert metropolis's gap is 46), the first seat's bound arm's hinterland 14 → 10 (share 22/52 → 18/52), and a new arm (the foodshed IS the writer's share; anchored by a mountain town scoring lower); `resolveConfigReceipts` — seed `receipts-iso-town` → `receipts-iso-town-2` (the first seed's town is now viable, 56/52, with no gap to label; the second is precarious, 51/52, and still carries the `by_design` isolation violation).

## §S4 HELD FOR THE CHAIR — the observed-shape register

`check-observed-shape-readers.mjs` (plain) exits 1 with one NEW row: **`nearbyResourcesState on config` in `src/generators/foodGenerator.js`, 1 read** — the land arithmetic's depletion arm (`Object.entries(config.nearbyResourcesState || {})`). The read is not new code: it sat in `generateFoodSecurity` unflagged at the parent and at both refactor commits (measured: exit 0 at `ddf0da3f4`). It becomes visible because the receipt now calls `foodLandOf` with the effective config, a shape the scanner judges, and the generator never writes `nearbyResourcesState` (it is the advance-time depletion sidecar the event layer maintains; the same identity stands banked in five other rows of the baseline). The governed `--write` refuses to ADD an identity, so no door of mine can take it. Options: (a) the chair banks the row (the same standing as `resolveResources.js`'s four); (b) the land arithmetic reads depletion through `domain/resourceSemantics.js :: availableNativeResourceKeys` alone — its custom-resource arm would then change, which moves output and is a writer question; (c) leave it red for the merge seat. I took none of them.

**THE CHAIR'S RULING (2026-11-08) AND WHAT IT FOUND.** The chair ruled the row is foodGenerator's own existing read, newly observed on the receipt's call path — not new code and not a new fact — and that it be banked in this lane if the register's bank is an attributed move through its door, else left red with the admission written here. **It is not a lane door.** Measured against the instrument: the ordinary `--write` refuses to add an identity; `--raise-explained-writer` is the explained-writer exemption (ruled out: nothing declared, nothing exempted); `--migrate-schema=30 --migration-review=<bundle>` refuses at the live schema ("a migration review cannot authorize ordinary maintenance") — admitting a row takes a new schema rung of the instrument (`migrate-observed-shape-readers.mjs`), and the rungs compose in order at the merge. So the two arms (`observedShapeReaders.walker.test.js` › the live scan › A1/A7 and SHRINK-ONLY) **stay red on this lane**, and this is the admission the merge seat makes at this lane's merge point, in the rung it cuts there:

> **FIX-FOOD-ISOLATION: the receipt reads the land through foodLandOf; the depletion arm's read of the effective config is foodGenerator's own, observed on the receipt's call path.** — `nearbyResourcesState on config`, `src/generators/foodGenerator.js`, 1 read, admitted with that attribution; none declared, nothing exempted.

Not done, by the ruling: depletion is NOT routed through `availableNativeResourceKeys` (that moves custom-resource output, a writer question outside the owner's word).

**THE IMPORT CYCLE — ACCEPTED (the chair, 2026-11-08).** `foodGenerator.js ↔ isolationSupport.js` import each other's functions, used only inside function bodies. It is kept because writer reach's dark register, the observed-shape readers, the tuning inventory and the prose wiring census key the land arithmetic's reads and dials to `foodGenerator.js`; a separate module moved all four registers for no change of fact.

**THE REVERSE RESIDUE — COHERENT BY DESIGN (the chair, 2026-11-08). DO NOT "FIX" IT.** 18 places the receipt calls viable or resilient read Import-Dependent or Deficit on the 1,000: plague — soak1k-333, soak1k-374, soak1k-789, soak1k-913; war — soak1k-350, soak1k-764; mass migration — soak1k-98, soak1k-354, soak1k-637, soak1k-670; slave revolt — soak1k-486, soak1k-757, soak1k-897; occupation — soak1k-507, soak1k-628; siege — soak1k-704, soak1k-872, soak1k-984. The receipt is the land's ordinary year; the food record is this year under its stress. A well-supported place in a bad year is a true sentence, not a contradiction. A later seat that makes the receipt read the year's stresses, or the food band ignore them, breaks one of the two facts to make them match.

## CONFIRMED vs PLAUSIBLE, second seat

- CONFIRMED: 15 → 0 (and 0 on the import side); 0 food bands / import shares moved on the 1,000; all golden/fence/prose movement isolated; herald 0; soak findings identical; extraction byte-neutral (0/525, 0/360 twice); +780 B in both bundles.
- PLAUSIBLE: that the 18 reverse-direction places are the receipt's deliberate ordinary-year reading against this year's stresses (every one carries a harvest-cutting or mouth-adding stress; not tested further).

**Tip:** the commit carrying this section on `lane/fix-food-isolation-2026-11-07` (parent `52800917a`).
