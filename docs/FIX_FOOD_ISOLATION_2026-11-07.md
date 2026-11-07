# FIX-FOOD-ISOLATION — the isolation-support receipt and the food record made to agree (2026-11-07)

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
