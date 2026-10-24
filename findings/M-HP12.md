# M-HP12 — one crisis, two migration services? (measure-only)

Code of record: `/home/user/master-code-of-record` @ `81f1cd963` (read-only). Probe: `KIT/hp/M-HP12-probe/` (`mcr/` = copy of master `src/` + `package.json` + `tests/fixtures/spatialPackFixtures.js`; `node_modules` → `/home/user/settlement-engine/node_modules`). Scripts: `probe.mjs`, `census.mjs`, `summ.py`. Receipts: `R1…R6 *.out`, `census.out`.

## Verdict

**CONFIRMED BY EXECUTION.** On a canonized world (`spatialCanonVersion: 1` + frozen digest), one crisis at source `a` gets served both ways in the same tick. `population_emigration` sheds `abs` and dispatches 3 spatial columns into `spatialLedgers.migration`. In the same tick, an auto-applied `flow_migration` debits `a` again and credits the destination at once (a teleport). The source's population is subtracted twice, by two independent lanes.

**REACHABLE in shipped play.** Four shipped presets light both rules gates: realistic_regional (the default), living_realm, dramatic_campaign and full_simulation. The spatial half is gated only by world state (the canonize store action), not by a preset. The probe reproduced the double service at the shipped one-week cadence under realistic_regional, dramatic_campaign and full_simulation, with every outcome auto-applied and no override.

## 1. The seams (by symbol)

| Path | Gate | How it subtracts at the source | Does it see the other path? |
|---|---|---|---|
| `flows.js :: populationFlows` (via `deriveFlowCandidates`, flows.js:173) | `candidateEvents.js:600-602`: propagationMode ∉ {off, local} AND `migrationFlowsEnabled`. Reads the **stressor record**: type ∈ DISPLACEMENT_STRESSORS and severity ≥ 0.6 (flows.js:62), plus a confirmed migration_pressure / trade_route / political_authority channel. | A paired `populationDeltas` (flows.js:107: `{saveId: source, delta: -refugees}` plus a destination credit of the same size), applied this tick by `applyPopulationOutcomeToSettlement` (populationDynamics.js:583). It carries no `spatialEmigration` marker, so it never reaches the column ledger or the conservation invariant. | No. flows.js imports and reads nothing from `migrationActive` or the migration ledger. It is rolled in `rollCandidates` (p ≤ 0.45). |
| `populationDynamics.js :: populationCandidate` → `population_emigration` | `migrationLive = migrationFlowsEnabled && propagationMode ∉ {off, local}` (populationDynamics.js:449), AND a mass-emigration delta (≥ 2.5%·mag of pop, with a severe rate or a CRISIS_FLIGHT condition). Reads **conditions and the pressure index**, not stressor records. | `populationDeltas[0] = {source, delta}` (populationDynamics.js:451). Under spatial it sets `spatialEmigration = {loss: abs}` (467) and distributes nothing (the header reconciliation, migration.js:37-43: "we NEVER apply abs*0.45"). Off spatial it distributes `abs*0.45` (470). | No. Admitted on the deterministic lane (pulseKernel.js:1552), outside the stochastic conflict resolution. Its conflict tag `population:<id>` (522) is not an exclusive pattern. The flow's exclusive `population_transfer:<id>` (flows.js:111, candidateEvents.js:392) therefore never meets it. |
| `migrationKernel.js :: dispatchMigrations` (pulseKernel.js:2410-2416) | `migrationActive` (migration.js:175: spatialCanonVersion is an integer > 0) | Plans the already-debited `abs` with `planMigration` (migration.js:362). The invariant (migration.js:440) covers **that shed pool only**. | Collects only `population_emigration` / `settlement_terminal_death` (migrationKernel.js:409). `flow_migration` is invisible to it. |
| `demographicsMigration.js :: advanceDemographicMigration` | `demographicsActive` (`demographicsEnabled === true`, line 388): virtual, false or absent in every preset | Homeostat columns (travelClass-stamped) | It does not read `flow_migration`. It is dark in shipped play, so it is not a third service. |

Neither path suppresses the other. Nothing in pulseKernel, migrationKernel or migration.js names `flow_migration`.

## 2. Census (executed: `census.mjs` → `census.out`)

| Preset | migrationFlows | propagation | popDynamics | proposals | intensity | both rules gates |
|---|---|---|---|---|---|---|
| realistic_regional (default) | true | first_order | true | true | conservative | **LIT** |
| living_realm | true | first_order | true | true | conservative | **LIT** |
| dramatic_campaign | true | full | true | false | dramatic | **LIT** |
| full_simulation | true | full | true | false | normal | **LIT** |
| quiet_local / narrative_campaign | false | local | true | true | conservative | dark |
| static_campaign | false | off | false | true | conservative | dark |

`migrationActive` is not a rule: canonizing the map (`campaignSpatialCanonize.js:186`) lights it in any preset. Shipped advances run one-week kernel ticks (`advanceInterval.js:511`).

## 3. Execution

Fixture: the `worldpulseSpatialGolden` shape. Four towns a–d, a frozen grid digest, `spatialCanonVersion: 1`, migration_pressure channels a→b/c/d, and a famine at `a` seeded as the stressor record plus its condition.

| Receipt | Tick | Emigration shed | Columns (count / arrivals) | Flow teleported | Δ pop at a |
|---|---|---|---|---|---|
| R1 override, one_year, famine only, pop 1600, seed s3 | 1 | 148 | 3 / 111 | 156 → b | **−304** (= −148 −156) |
| R1b same, aspatial control | 1 | 148 (45% distributed) | 0 | 156 | −304 |
| R2 dramatic_campaign, one_week, famine+war_pressure, pop 10k | 4 (also 5, 6) | 116 | 3 / 85 | 856 → b | **−972** |
| R3 full_simulation, same | 4 (also 5, 6) | 81 | 3 / 58 | 866 → b | **−947** |
| R4 realistic_regional (default), one_week, famine+war+plague, pop 10k | 8 (also 9) | 91 | 3 / 64 | 726 → c | **−817** |
| R5/R6 realistic / dramatic, one_week, famine only, pop 10k | — | none (rate below the mass bar) | 0 | yes, on 2–3 ticks | flow only |

The flow candidate is derived every tick (1 per source after exclusive-tag resolution) and applies when its roll lands. In R1, the 37 origin and road deaths and the lagged 111 arrivals are booked in the ledger. The flow's 156 bypass it.

## Caveat (not a doubt about the verdict)

At the shipped weekly cadence, famine alone did not cross the mass-emigration bar in this bare fixture, so the columns never formed (R5, R6). A compound crisis did: famine plus war or plague. At one_year, famine alone was enough (R1). In either case both lanes read the same crisis, through different inputs. The flow reads the stressor record; emigration reads the condition and pressure index.
