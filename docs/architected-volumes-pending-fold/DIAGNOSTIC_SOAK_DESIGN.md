# THE DIAGNOSTIC-SOAK HARNESS — recon and design (LANE 3)

**Read at:** build worktree `.claude/worktrees/minifold`, branch `claude/composite-r4`,
HEAD **`3e2bd3092a7cc2d57e34b6f8ba0b7bc8d8b7196c`**, with the build lane's dirty WIP
present (10 modified, 5 untracked — including `src/domain/worldPulse/strategicPosture.js`
and a +9-line `simulationRules.js` adding `strategicPostureEnabled` to the virtual
manifest). Ledger branch `review-fixes-2026-07-08` read at HEAD **`8339f47ec78854e1c6d23a36be49eaf4bcef2dc3`**
for §3h. **This lane wrote nothing to either tree and ran no test/npm/vitest/build
command there.** Every numeral below is EXECUTED (computed in the scratchpad from a
copy of the dependency-free rules module, or read out of committed receipts), not
remembered. LIVE CODE OUTRANKS EVERY TABLE — re-read anything that surprises you,
because the build lane moves HEAD.

**The mandate (docs/START_HERE.md §3h, chair-ruled, owner-constrained 2026-08-06):**
step 2 of the endgame tail. Disposable tree, flags FORCED LIT, concurrent with tail
work, **⛔ FINDINGS ONLY — it may not sign, apply or adjust one band**; anything it
suggests rides to step 7 (the terminal tuning signature) as a PROPOSAL. Its purpose
is the program's largest open risk: **no layer has ever been lit alongside the others
— every dormancy proof to date is per-flag.**

---

## 1. EXISTING MACHINERY — the inventory (extend these; fork none of them)

### 1.1 The maintained composed-engine soak

| Path | Symbol | Contract |
|---|---|---|
| `scripts/audit/whole-world-soak.mjs` (741 ln) | top-level script; `buildFixture()`, `runYears()` | Generates an N-settlement region with the SEEDED generator, drives `simulateCampaignWorldInterval` year by year at `interval:'one_year'` threading state as the store does, under `SIMULATION_RULE_PRESETS.full_simulation.rules` **verbatim**. Proves: (1) no NaN/Infinity (deep scan, fail-fast, every year); (2) byte-identical re-run (run A vs run B, EVERY year's composite hash); (3) story-mix divergence on a different seed; (4) population bounded (`ratio > 0.05 && < 20`, every settlement finite and >0 with the remnant-law exception); (5) behavioral observation; (5b) WR-9d war-convergence arithmetic totality; (6) isolated Node `worker_threads` execution with output-hash equality. Emits a schema-v5 receipt. CLI: `--years --seed --settlements (1..30) --divergence-years --seasons on\|off --neighbor-control-years --dark-control --receipt --case-id --json`. `NOW` pinned `2026-07-12T00:00:00.000Z`. |
| `scripts/audit/realm-scale-certification.mjs` (696 ln) | `REALM_SCALE_PROFILES`, `REALM_SCALE_SOURCE_PATHS` | Runs the whole-world soak across an explicit horizon×realm-size×seed matrix, hashes the attributable source, and emits ONE aggregate receipt. **Never writes the certification manifest** — a complete pass only flips `claimBoundary.manifestEntryEligible`. Profiles: `smoke` (1y×4s, 1y×30s), `weekly` (30y×12s), `release` (7 cells incl. 100y×4s and 100y×12s), `research` (300y×12s). npm: `soak:smoke\|weekly\|release\|research`. |
| `scripts/audit/behavioral-observation.mjs` (1094 ln) | `observeBehavioralYear`, `buildBehavioralObservation`, `censusWorldStateKeys`, `foldStateKeyCensus`, `buildSubsystemConfiguration`, `buildDarkControl`, `buildNeighborControl`, `observeBeliefDivergence`, `moverFamilyOf`, `settlementStateVector` | The pure audit adapter. Per year it records event counts, the ten mover families (selected / post-apply split), event-type mix, arc polarity, motion (population/prosperity/power transitions), attention, succession + **integrity failures**, causal cross-family edges read from the provenance ledger, a bounded Chronicle sample, phrase repetition, belief-vs-ground-truth divergence, realm self-sufficiency and realm demography (both null-dropped when dark). `censusWorldStateKeys` is **TOTAL** over top-level worldState keys plus one level into `spatialLedgers` — this totality is what lets an ABSENT key be read as evidence rather than as a gap. |
| `scripts/audit/whole-world-soak-spatial-fixture.mjs` (67 ln) | `buildWholeWorldSoakSpatialCanon(saves,{enabled})`, `WHOLE_WORLD_SOAK_SPATIAL_FIXTURE_PATH` | **THE SPATIAL CANON soak fixture.** Authors a real, deterministic FMG-shaped capture through the production `buildSpatialDigest` seam; `{enabled:false}` strips BOTH `spatialCanonVersion` and `spatialDigest` for the dark control. Pinned by `tests/ops/wholeWorldSoakSpatialFixture.test.js` (43 ln) against `activeSpatialDigest` and `beliefsActive` — i.e. it proves the canon really activates the belief engine, and really deactivates it when stripped. |
| `scripts/audit/war-convergence-collector.mjs` (538 ln) | `observeWarConvergenceYear`, `buildWarConvergenceObservation`, `WAR_CONVERGENCE_SAMPLING` | WR-9d. Walks the deployment ledger year over year as a war census, classifies each close through `warEndingClassifier`, bands through `warDurationBandFor`. Only the instrument's own ARITHMETIC is asserted in the soak (every counted war in exactly one duration cell; every close in exactly one ending cell); the envelopes are graded by the behavioral oracle. |
| `scripts/audit/story-mix-divergence.mjs` (290 ln) | `compareStoryMixDistributions`, `buildStoryMixDivergenceEvidence`, `isPassingStoryMixDivergenceEvidence` | Total-variation + shifted-event-equivalents instrument for seed divergence. Replaced the weaker composite-hash test (one altered draw used to satisfy it). |
| `scripts/audit/advance-worker-evidence.mjs` | `measureIsolatedAdvanceWorker` | Real Node `worker_threads` isolate importing the product Web Worker module; output hash must equal the direct domain path. Timings explicitly NOT represented as browser measurements. |

### 1.2 The certification contracts (the graders)

| Path | Symbol | Contract |
|---|---|---|
| `src/domain/certification/subsystemCertification.js` (562 ln) | `simulationRuleKeys()`, `SUBSYSTEM_CERTIFICATION_REGISTRY`, `SUBSYSTEM_CERTIFICATION_PENDING_KEYS`, `auditSubsystemCoverage()`, `evaluateSubsystemCertification()`, `TEMPO_MIN_YEAR_SHARE` | **THE per-flag aliveness grader.** One row per boolean rule key; four verdicts — `ALIVE` / `DORMANT_BY_CONFIG` / `SILENT` / `UNOBSERVED`. `eventTypes` and `stateKeys` are DISPOSITIVE; `moverFamilies` are CORROBORATING ONLY (a row that declares a dispositive channel cannot grade ALIVE off a mover family — it grades SILENT and flags `corroboratingOnlyEvidence`). `simulationRuleKeys()` unions THREE surfaces: `DEFAULT_SIMULATION_RULES` booleans, every preset override spread's booleans, and `ENGINE_GATED_VIRTUAL_RULE_KEYS`. |
| `src/domain/certification/behavioralContract.js` (1100 ln) | `BEHAVIORAL_MOVER_FAMILIES` (10), `BEHAVIORAL_THRESHOLDS`, `CERTIFICATION_HORIZONS`, `SOAK_RECEIPT_SCHEMA_VERSION = 5`, `SUPPORTED_SOAK_RECEIPT_SCHEMA_VERSIONS = [4,5]`, `evaluateBehavioralCertification()` | The whole-world oracle. Predeclared bands for mover/tempo/arcs/motion/neighbor/succession/attention/darkControls/**interactions**/humanChronicle. Horizons: useful 30y (not a product gate), **release 100y (the ONLY product gate)**, research 300y (never a gate). `darkControls.maxConditionalStateLeaks: 0`, `succession.maxIntegrityFailures: 0`, `interactions.minDistinctFamilyPairs: 3`. |
| `src/domain/certification/certificationManifest.js` (35 ln) | `WORLD_CERTIFICATION_MANIFEST` | **INERT-HONEST: `bands: []`, `generatedAt: null`.** No soak has ever written a band. Every surface reads PENDING. ⛔ The diagnostic soak must leave it exactly so. |
| `src/domain/certification/couplingRegistry.js` (119 ln) + `couplingRegistryWar.js` (527), `couplingRegistryTrade.js` (70), `couplingRegistrySchema.js` (75) | `COUPLING_REGISTRY`, `couplingRowsFor(pairId, direction)` | **The declared cross-layer read registry** — each row records the foreign read, the receipt field that makes it reviewable, and the counterforce. Today: WR-3 lineage, WR-4 war-cost (4), WR-5 war-ruling (5), WR-6 coalition (7), WR-7 envoy (9), TR-1 casus commercii. **This is the evidence base for choosing pair cells instead of guessing them.** |
| `src/domain/certification/subsystemRows{Baseline,People,Place,Waves,War,Regen,Growth,Virtual}.js` | `*_SUBSYSTEM_ROWS`, `*_PENDING_RULE_KEYS` | The 70 authored rows + the shrink-only pending partition. **Measured: only ONE pending key remains estate-wide — `majorChangesRequireProposal` (Baseline). Every other lane's pending list is empty.** |
| `src/domain/certification/warConvergenceContract.js` (953 ln) | `SOVEREIGNTY_LIGHTING_EVIDENCE` | The lighting instrument. Reads `UNSATISFIED_TRACKED missing=[ES-4]` today. |
| `scripts/audit/certify-subsystems.mjs` (106 ln) | — | `npm run certify:subsystems -- <receipt.json> [--json]`. Prints the per-subsystem table for ONE receipt. Read-only; writes nothing. |

### 1.3 The dormancy / composition estate in tests

| Path | Contract |
|---|---|
| **THE PER-FLAG PROOF ESTATE — 49 files, MEASURED** (`find tests -name '*Dormanc*' -o -name '*byteIdentity*'`): **32 `*DormancyGolden` + 7 `*DormancyFence`** in `tests/property/` (72 files total), plus 9 `*.byteIdentity` siblings and `sovereigntyWaveMultiYearDormancy` / `routeNetworkDormancy` | **Precisely the thing that is per-flag.** Each proves ONE flag byte-identical when dark. The FOUR-FENCE shape (`espionageDormancyFence.test.js` header is the canonical statement): F1 import-closure census / driven byte-identity golden · F2 differential ABSENT vs EXPLICIT FALSE · F3 call-path dormancy via a pass-through spy · F4 gate-polarity census over source (`=== true` by construction) · plus per-door conjunction pins and a LIT MUTANT control. |
| `tests/helpers/dormancyOracle.js` | `normalizeForDormancy` — the structural normalized deep-equal the whole byte-identity estate compares through (absent === `{}` === `[]`, empty containers dropped, keys sorted). |
| `tests/property/moverCompositionSmoke.test.js` (232 ln) | **THE ONLY EXISTING EVERYTHING-ON RUN.** ONE spatial fixture under `SIMULATION_RULE_PRESETS.full_simulation.rules` literally, 24 real pulse ticks. Envelope-style, not a golden: alive (no throw), bounded, deterministic. Its own header names itself the *cheap interim guard* the Living-Realm checkpoint deferral left open, and says the full mover-interaction matrix is deferred. **The diagnostic soak IS that deferred matrix, and this file is its 24-tick ancestor.** |
| `tests/property/sovereigntyWaveMultiYearDormancy.test.js` (312 ln) | The one multi-year dormancy proof: 110 ticks, self-comparison + absent-vs-false differential + a LIT control. Its header states the law the diagnostic soak inherits: *a single tick cannot see a cooldown that flaps, a `sinceTick` clock that only diverges once carried, an episode gate that fires the second time a band is crossed, or a term that expires — those all need a calendar.* |
| `tests/property/mechanismLitCoverage.test.js` (354 ln) | The lit-walkthrough ratchet. Axis 1: every flat module under `src/domain/worldPulse` (~156) needs a lit proof. Axis 2: every `<x>Enabled` key needs a LITERAL / DEFAULT-TRUE / REGISTRY lit credit. Baseline `tests/fixtures/mechanism-lit-coverage-baseline.json`, shrink-only. |
| `tests/simulation/worldTickCostEnvelope.test.js` (147 ln) | 12 settlements × **120 WEEKLY kernel ticks**. Deterministic size assertions (`SIZE_CEILING_AT_60 = 6,000,000`, `MAX_SIZE_CEILING = 8,000,000`) plus a deceleration requirement once the bounded ledgers engage. **The only instrument in the estate that runs at weekly granularity long enough to saturate the pulseHistory ring.** |
| `tests/domain/worldPulseSoak.test.js` (707 ln) | The long-horizon feel/balance soak on a small region: alive but bounded, never all-crisis. |
| `tests/lint/engineGatedRuleKeys.walker.test.js` | Source-scans `src/` for the strict gate idiom (comments AND strings blanked) and proves `ENGINE_GATED_VIRTUAL_RULE_KEYS` both ways, plus `EXEMPT_RULE_KEYS` (1) and `BACKLOG_RULE_KEYS` (17, shrink-only, asserted EXACT, ≤17). **This walker is where the true flag inventory lives.** |
| `tests/lint/subsystemCertificationTotality.walker.test.js`, `tests/domain/subsystemRowsVirtual.test.js` | The row/pending partition guards. |
| `scripts/audit/{religion,cause-lifecycle,institution-ecology,religion-coup,religion-plane,conquest-market,war-cluster}-soak.mjs` (130–215 ln each) | **Per-subsystem soaks — the per-flag estate again, in script form.** Useful as ablation cross-checks; none of them composes. |
| `scripts/audit/generation-certification-soak.mjs` (713 ln) | The GENERATOR-side certification soak. A separate axis; the diagnostic soak does not subsume it. |

### 1.4 Receipts on disk — MEASURED, and two of them are RED

| receipt | schema | passed | failures | primary / replay |
|---|---|---|---|---|
| `release-1y-4s-seed1` | 4 | ✅ | — | — |
| `release-1y-12s-seed1` | 4 | ✅ | — | — |
| `release-1y-24s-seed1` | 4 | ✅ | — | — |
| `release-1y-30s-seed1` | 4 | ✅ | — | 409 s / 362 s |
| `release-30y-12s-seed1` | 4 | ✅ | — | 3,276 s / 3,324 s |
| `release-30y-12s-seed2` | 4 | ✅ | — | — |
| `release-100y-4s-seed1` | 4 | ❌ | `every settlement population finite and > 0, every year` | 2,637 s / 2,626 s |
| `research-300y-12s-seed1` | 4 | ❌ | `realm population bounded` | 26,875 s / 35,356 s |
| `smoke-1y-30s-seed1` | 3 | ✅ | — | — |

Two findings fall out of this table and both are load-bearing for the design:

**⚠⚠ FINDING R-1 — the per-subsystem certification instrument has NEVER been executed
against a real receipt.** Every receipt on disk is schema **v4** (one is v3). The
`subsystems` section arrived with v5. `evaluateSubsystemCertification` therefore has
never had a `stateKeysComplete:true` census to read, has never resolved rules with
`source:'receipt'`, and its 70 authored rows have never produced a verdict from
executed evidence. 562 lines of grader plus ~4,260 lines of authored rows are, today,
**unexercised against reality.** The diagnostic soak's receipts are v5 and carry the
section — running `certify:subsystems` on them is the first execution of this contract.

**⚠ FINDING R-2 — the two RED receipts are the composition questions in advance.**
`research-300y-12s` fails `realm population bounded`: the x1.07/year compounding that
`demographicsEnabled` was built to cure — and `demographicsEnabled` is **declared FALSE
in `full_simulation`**, so the cure has never run in a soak. `release-100y-4s` fails
the population floor with the PRE-remnant-law assertion text (HEAD's assertion now
excepts a properly-died settlement), so that red may be superseded — **re-measure, do
not inherit.**

---

## 2. THE FLAG INVENTORY — MEASURED at HEAD `3e2bd309`

Computed by replicating `subsystemCertification.simulationRuleKeys()` over a scratchpad
copy of `simulationRules.js` (the module has no imports, so the copy is exact).

**THE CENSUS: 70 boolean keys.** `DEFAULT_SIMULATION_RULES` booleans ∪ every preset
spread's booleans ∪ `ENGINE_GATED_VIRTUAL_RULE_KEYS` (13 at dirty HEAD; 12 committed —
`strategicPostureEnabled` is the build lane's in-flight SP-C addition).

### 2.1 LIT at `full_simulation` today — **45**

`allyDefenseEnabled · allyIntelSharingEnabled · commodityFlowEnabled ·
constructiveFlowsEnabled · defenderAttritionEnabled · defenderResolveEnabled ·
disastersEnabled · distancePricedNewsEnabled · emergentEventsEnabled ·
factionCompetitionEnabled · faithSpreadEnabled · institutionLifecycleEnabled ·
interventionEnabled · migrationFlowsEnabled · momentumEnabled · navalEnabled ·
npcAgencyEnabled · npcGrowthEnabled · npcLadderEnabled · peaceEngineEnabled ·
populationDynamicsEnabled · provenanceLedgerEnabled · reframeEnabled ·
relationshipDynamicsEnabled · religionDynamicsEnabled · resourceDriftEnabled ·
resourceDynamicsEnabled · roadsEnabled · seasonsEnabled · settlementLifecycleEnabled ·
settlementStrategyEnabled · spatialConsequenceEnabled · stressorsEnabled ·
supplyWebWarfareEnabled · tierDriftEnabled · tradeFlowsEnabled · traditionsEnabled ·
upswingArcsEnabled · urbanFabricEnabled · warDispositionEnabled ·
warEconomyDrainEnabled · warForageEnabled · warLayerEnabled · warLevyEnabled ·
warSupplyQualityEnabled`

*Per-preset true-boolean counts, MEASURED: `full_simulation` 45 · `dramatic_campaign` 35
· `living_realm` 31 · `realistic_regional` 12 · `narrative_campaign` 11 · `quiet_local` 9
· `static_campaign` 1. (living_realm's count includes `majorChangesRequireProposal:true`,
which the two OPEN presets set false — see §3.2 landmine 1.)*

### 2.2 DARK at `full_simulation`, IN the census — **24 subsystem layers + 1 non-subsystem**

**A. Engine-gated VIRTUAL (in `ENGINE_GATED_VIRTUAL_RULE_KEYS`, in NO preset, 13):**
`beliefAxesEnabled · believedConditionsEnabled · believedDevotionEnabled ·
believedScarcityEnabled · casusCommerciiEnabled · conquestDoctrineEnabled ·
espionageEnabled · infoStatecraftEnabled · migrationRumorsEnabled · oathHolderEnabled ·
sovereigntyTradeEnabled · strategicPostureEnabled¹ · treatyLifecycleVoiceEnabled`
¹ dirty-WIP only at this HEAD.

**B. DECLARED FALSE on the `full_simulation` ceiling (11)** — declared precisely so the
totality walker can see them:
`coalitionLedgerEnabled · demographicsEnabled · dispositionChannelsEnabled ·
envoyDiplomacyEnabled · informationBrokeragesEnabled · lineageClaimEnabled ·
magicEconomyEnabled · npcConsequencesEnabled · routeLifecycleEnabled ·
townCartographyEnabled · warTerminationEnabled`

**C. NOT A SUBSYSTEM — ⛔ MUST NOT BE FORCE-LIT (1):** `majorChangesRequireProposal`
(false at the OPEN presets). See §3.2 — lighting it silently destroys the run.

### 2.3 DARK and **INVISIBLE TO THE CENSUS** — the measured BACKLOG, **17**

Real engine gates on real dark subsystem layers, read with the strict `=== true` idiom
in `src/`, present in NEITHER the defaults NOR any preset NOR the virtual manifest —
therefore carrying **no certification row and no aliveness grader**. Recorded
shrink-only in `tests/lint/engineGatedRuleKeys.walker.test.js` `BACKLOG_RULE_KEYS`:

`assizeEnabled · commonsVoiceEnabled · contestedGoalsEnabled · corruptionWebEnabled ·
discourseProseEnabled · economicCoupReadEnabled · heirsEnabled ·
heraldCausalVoiceEnabled · intelTradeEnabled · ladderPoliticalWindowsEnabled ·
memoryWeaveEnabled · migrationCorruptionPushEnabled · neutralNeighborsEnabled ·
npcCredibilityEnabled · seaRoadsEnabled · thirdPartyRansomEnabled ·
upswingHazardReadEnabled`

**EXEMPT (1, by recorded rationale):** `routineMajorApproval` — a campaign routing
policy, not a subsystem.

### 2.4 The arithmetic that defines the risk

> **88 engine-gated boolean keys** = 70 census + 17 backlog + 1 exempt.
> **45 have ever been lit together.** **41 dark subsystem layers (24 + 17) have never
> been lit alongside them, or alongside each other.**

Two of the 41 carry standing caveats that must ride as separate cells, not be buried:

- **`neutralNeighborsEnabled`** — deliberately lit in NO preset, and the blocker is
  ASYMPTOTIC, not a golden re-record. Measured 2026-07-31: lighting it REDS
  `tests/perf/tickScanBudget.test.js` (`scanOps` ratio 3.891 at 4→8 against a 2.6
  ceiling) even with the k-nearest fix (k=3, linear edge population). It raises
  cross-settlement interaction density BY DESIGN. **Owner-gated performance-architecture
  decision.**
- **`demographicsEnabled`** — lighting it hands population GROWTH to
  `demographicsKernel.js` and simultaneously stops `populationDynamics` emitting its raw
  proportional growth candidate. Its own comment calls this "a deliberate, measurable
  behaviour change" and reserves it for "the owner-signed soak redo". It is the declared
  cure for `research-300y-12s`'s red. **Measuring it is a headline job of this soak;
  signing it is not.**

---

## 3. THE DESIGN

### 3.1 The extension point — one seam, zero `src/` edits

`whole-world-soak.mjs` `buildFixture()` composes its rules in exactly one place
(≈ line 204):

```js
const fullRules = {
  ...SIMULATION_RULE_PRESETS.full_simulation.rules,
  ...(SEASONS === 'on' ? { seasonsEnabled: true } : SEASONS === 'off' ? { seasonsEnabled: false } : {}),
};
```

The `--seasons` flag is the precedent and the license: its own header says **"One soak,
flag-varied — never a second soak script."** The diagnostic harness is that same idiom,
generalized.

**Changes, all inside `scripts/audit/` in the disposable tree:**

1. **NEW `scripts/audit/diagnostic-lighting.mjs`** — pure, no I/O, no clock. Exports
   `LIGHTING_PROFILES`, `EXCLUDED_FROM_FORCE_LIT` (key → rationale string, the
   `EXEMPT_RULE_KEYS` idiom), `BACKLOG_FORCE_LIT_KEYS`, and
   `resolveLightingOverlay(name) → Record<string, boolean>`.
   **It builds the overlay from `simulationRuleKeys()` itself, never from a hand-typed
   list**, so it cannot drift from the census — the one lesson the census-invisible
   class already taught this estate.
2. **`whole-world-soak.mjs`** — add `--lighting <profile>` and `--rules-json <path>`;
   apply the overlay AFTER the seasons override; record `lightingProfile` on the receipt
   beside the existing `subsystems` section.
3. **NEW `scripts/audit/composition-observation.mjs`** — pure, mirrors
   `behavioral-observation.mjs`'s shape so it is reviewed the same way. Exports
   `diffStateKeyCensus(baseline, composed)`, `observeConservation(...)`,
   `observeBandHistograms(...)`, `foldCompositionFindings(...)`.
4. **`realm-scale-certification.mjs`** — add a `diagnostic` entry to
   `REALM_SCALE_PROFILES` carrying the cells below, threading `--lighting` per cell.
   This inherits the source hashing, aggregation, receipt plumbing and the
   `certificationWritten: false` guarantee **for free** — the "extend, never fork" clause
   discharged in one edit.

**Why an overlay and not a preset edit:** the presets ARE the shipped defaults. Adding
a key to `full_simulation` costs every NEW campaign serialized bytes and moves its state
hash — the exact cost `CR-WR10-C` refused. The overlay lives in an audit script that is
on no world path and in a tree that is deleted afterward.

**The receipt self-describes.** `runYears` already returns
`simulationRules: fixture.campaign.worldState.simulationRules`, and
`buildSubsystemConfiguration` writes it to `subsystems.rules`. So
`resolveReceiptRules` reads `source:'receipt'`, `complete:true` — which is exactly what
makes `DORMANT_BY_CONFIG` separable from `SILENT` per row. No caller-supplied rules, no
inference, no `harness_default` fallback.

### 3.2 ⛔ THE EXCLUSION SET — three landmines, stated before the matrix

1. **`majorChangesRequireProposal: true` MUST NOT be force-lit.** It is not a subsystem;
   it is the legacy mirror of the political-autonomy axis. `politicalAutonomyOf` maps
   `true → 'routine'`, which parks every major as a PROPOSAL instead of applying it.
   `successionObservationOf` credits ONLY `autoApplied` receipts ("selected is not
   applied"), so the entire behavioral observation would collapse to a study of the
   approval queue and every aliveness row would read SILENT for a reason that has
   nothing to do with composition. **Excluded with rationale, never by silence.**
2. **`realmMagicDefault` is a string** (`'magical'`), not a boolean — invisible to the
   boolean census and not overlaid. Its own comment states it is NOT an engine gate
   (MG-LAW-1).
3. **`faithSpreadEnabled` / `religionDynamicsEnabled` are in normalizer LOCKSTEP** and
   the LEGACY key wins when explicitly set. Both are already true at `full_simulation`;
   the overlay must set both or neither. (Note the soak passes rules **raw** into
   `worldState.simulationRules` without re-normalizing, so the overlay itself must hold
   the lockstep. Verify at build time.)

### 3.3 THE LIGHTING PROFILES

| id | contents | lit count | purpose |
|---|---|---|---|
| **L0 BASELINE** | `full_simulation` verbatim | 45 | **THE CONTROL.** Mandatory at every shape. No receipt on disk was produced by THIS tree, so without L0 every L1/L2 number is uninterpretable. |
| **L1 CENSUS-LIT** | 70 census keys minus the exclusion set | 69 | **The program's open risk, answered in one cell.** 24 layers newly lit alongside the 45. |
| **L2 EVERYTHING-ON** | L1 + the 17 BACKLOG keys, minus `neutralNeighborsEnabled` | 85 | The true composed world. The backlog layers carry no certification row, so they are graded by container diff (M4), not by the aliveness table. |
| **L3 ABLATION** | L2 minus ONE key | 84 | **Run only for keys an L1/L2 finding implicates.** Never speculatively — one cell is hours. |
| **L4 NEUTRAL-CONNECTED** | L2 + `neutralNeighborsEnabled` | 86 | Its own cell because it is a declared, measured, owner-gated COST-AXIS change. Bundling it into L2 would misattribute every cost finding. |
| **L5 COUPLED PAIRS** | L0 + exactly two dark layers | 47 | **Evidence-selected, NOT combinatorial** — see §3.5. |

### 3.4 SIZING — from measured cost, not from hope

Derived from the receipts in §1.4: **≈ 7–14 seconds per settlement-year**, superlinear
in settlements (1y×30s = 409 s ⇒ 13.6 s/settlement-year; 30y×12s = 109 s/yr ⇒ 9.1;
100y×4s = 26 s/yr ⇒ 6.6). Peak heap 189 MB → 603 MB. **Budget 1.5–2× on top for L2**,
because 41 more layers are doing work.

Two hard consequences:

- **A full pairwise matrix is impossible.** C(41,2) = 820 cells at ~1–2 h each. The
  design refuses it explicitly (§4, limit 10) rather than pretending to sample it.
- **The A/B/C triple must be trimmed.** The stock soak runs primary + replay +
  divergent (30y×12s = 3,276 + 3,324 + 715 s ≈ 2 h). **Determinism is the one property
  composition breaks, so keep primary + replay; run the divergent (story-mix) leg ONCE
  per lighting profile at the cheapest shape.** Add `--divergence-years 0` semantics or
  a `--skip-divergence` switch.

**THE GRID (findings-only, concurrent, ~12–20 machine-hours, cell-parallel):**

| cell | profile | shape | est. primary | why this shape |
|---|---|---|---|---|
| **D-1** | L0 | 30y × 12s | ~55 min | control for D-2/D-3 |
| **D-2** | L1 | 30y × 12s | ~1.5 h | **the headline composition run** |
| **D-3** | L2 | 30y × 12s | ~1.5–2 h | everything-on incl. backlog |
| **D-4** | L0 | 100y × 4s | ~45 min | control for D-5; re-measures the RED receipt at HEAD |
| **D-5** | L2 | 100y × 4s | ~1–1.5 h | **the ENDURANCE axis** — the 100y release horizon; where conservation drift and unbounded growth surface |
| **D-6** | L0 | 1y × 30s | ~7 min | control for D-7 |
| **D-7** | L2 | 1y × 30s | ~10–15 min | **the DENSITY axis** — 30s is the product's headline scale; interaction count peaks here |
| **D-8** | L4 | 1y × 30s | ~15 min | the neutral-edge cost probe, isolated |
| **D-9..n** | L3 | 30y × 12s | ~1.5 h each | ablation, **only** for implicated keys |
| **D-P1..n** | L5 | 30y × 12s | ~1.5 h each | coupled pairs, **only** for registry-declared couplings that D-2/D-3 could not attribute |

Every cell gets `--dark-control` and, at 30y, `--neighbor-control-years 30`: the
behavioral oracle requires ≥3 release probes across ≥2 scale bands and ≥2 seed families,
and the dark control's `maxConditionalStateLeaks: 0` over
`DARK_CONDITIONAL_WORLD_KEYS` (10 containers) is a free composition leak detector
already built.

**Why 30y is the floor and 1y cells may never be quoted as endurance.** The whole-world
soak advances at `interval:'one_year'`, whose orchestrator collapses each year to a
single `pulseHistory` record — the soak's own comment says the history ring "never
saturates here". The bounded-ledger saturation behaviour is measured ONLY by
`worldTickCostEnvelope.test.js` at WEEKLY granularity. And per
`sovereigntyWaveMultiYearDormancy`'s header, the failures that matter — a cooldown that
flaps, a `sinceTick` clock that diverges once carried, an episode gate that fires the
second time a band is crossed, a term that expires — **all need a calendar.**

**Why 300y is excluded.** 26,875 s primary + 35,356 s replay = **17.6 h per case** at
the OLD flag state, on a horizon that `CERTIFICATION_HORIZONS.research` declares "never
a launch gate". A cell that costs two working days obstructs the tail, which §3h
forbids. If the 300y attractor question must be re-asked under composition, it is a
POST-tail research run, recorded as such.

### 3.5 WHAT IT MEASURES — the composition questions

| id | class | question | instrument | new work |
|---|---|---|---|---|
| **M1** | DETERMINISM | Does the composed world still replay byte-identically? | run A vs run B, EVERY year's composite hash (existing check #2) | none |
| **M2** | CONSERVATION | Do the declared conserved transfers still balance when several conserving layers run together? | **NEW.** The war stack declares its identities in PROSE only — `warEconomyDrain`: "deployed − returned === war dead"; `warForage`: "a CONSERVED transfer with a war-dead sink"; `warLevy`: "a CONSERVED transfer" of men and grain. **Nothing executes them.** Per-year ledger: Σ population + Σ war-dead + Σ deployed against the prior year; Σ `storageMonths` against granary transfers. Where the identity cannot close from the receipt, **report the RESIDUAL, never a pass.** | `observeConservation` |
| **M3** | UNBOUNDED | Does anything grow without bound once composed? | existing `yearlyBytes` ceiling (900 KB × settlements), Q1→Q4 wall-time trend, population envelope; **plus** the `demographicsEnabled` question — does the declared cure for the 300y x1.07/yr compounding hold under composition? | report only |
| **M4** | COMPOSED_STATE | **Does any pair of lit layers produce a state the single-layer pins never saw?** | **The cheapest answer to the headline question, needing no engine surface.** `censusWorldStateKeys` is TOTAL over worldState + one level into `spatialLedgers`, and `foldStateKeyCensus` gives `{years, maxEntries, finalEntries}` per key. **Diff the folded census L0 vs L1/L2.** A container present ONLY in the composed run, or whose `maxEntries` exceeds what its owning layer could produce alone, is by construction a state no dormancy fence could see — every fence compares a world to ITSELF with one flag moved. | `diffStateKeyCensus` |
| **M5** | SILENT_LAYER | Which newly lit layer was switched on and moved nothing? | `evaluateSubsystemCertification` on each v5 receipt via `npm run certify:subsystems`. **This is its first execution against real evidence (Finding R-1).** `SILENT` = on and every instrumented channel read zero. `corroboratingOnlyEvidence` = graded off a shared mover family, i.e. "the world moved so I claim I moved". | none |
| **M6** | CONTRADICTION | Do two layers writing the same structure produce an illegal one? | existing per-year `succession.integrityFailures` + `integrityFailureKinds` — duplicate faction identity, invalid faction power, **multiple governing factions**, governing identity missing from factions. Threshold `maxIntegrityFailures: 0`. Two layers both writing `powerStructure.factions` is exactly how a duplicate governing seat ships. | none |
| **M7** | BELIEF | Does the info stack, composed, collapse to omniscience or to total error? | existing `observeBeliefDivergence` — relationship + faith belief vs ground truth, `meanConfidence01`, `meanStalenessTicks`, `maxStalenessTicks`, honest axis gaps. L1/L2 light `beliefAxes` + the three `believed*` families + `infoStatecraft` + `espionage` + `migrationRumors` + `informationBrokerages` **together for the first time**. `divergence01 → 0` or `→ 1`, or unbounded staleness, are findings. | none |
| **M8** | STREAM | Does a newly lit layer STEAL draws from a stream another layer shares? | **The sharpest question, and the one no per-flag proof can reach.** `src/kernel/prng.js` `createPRNG(seed)` is per-LABEL (seedrandom), forked on the load-bearing `::` delimiter. Stream theft is the recorded Wave-E hazard ("per-tick keyed forks hide stream theft") and it is invisible to a dormancy fence because a fence moves ONE flag — a stolen draw only shows when a THIRD layer is also lit. **In the DISPOSABLE tree only:** wrap `createPRNG` with a counting shim recording `label → drawCount` per tick, fold into the receipt, diff L0 vs L1/L2. A label whose count moves when a flag that does not own it is lit is stream theft, **named by label.** ⛔ **The shim is diagnostic-only: it never lands, never travels, and is reported as an instrument, not a change.** Fallback if the chair refuses any `src/` mutation even in a disposable tree: per-year hash each layer's OWN containers and report drift unattributed (strictly weaker — it names no label). | shim + diff |
| **M9** | VACUITY | Is a layer's aliveness evidence real, or an artefact of a shared bucket? | For each newly lit layer: does the receipt carry ≥1 candidate of its declared `eventTypes` AND ≥1 non-empty declared `stateKey`? Collect every `corroboratingOnlyEvidence:true` row. Note the estate's own warning: the `knowledge` mover family is a RESIDUAL bucket — fifteen unrelated `impactKind`s reach it through the `news` token — so "knowledge: 28" proves nothing about the belief lane. | fold |
| **M10** | DEAD_BAND | Which bands die only when two flags are lit? | Per cell, the OBSERVED band histogram for each newly lit layer whose certification row names a band ladder. A band with count 0 across all of L2 that was nonzero in its own single-flag lit test is composition-dead. **Scope strictly to bands the certification rows already name** — do not invent a band census; `bandFamilies.js` owns the ladders and the INTENSITY ladder is declared nine times under eight names (frozen, shrink-only). | `observeBandHistograms` |
| **M11** | COST | What does composition cost? | existing `yearlyBytes` / `yearlyRealmBytes` / `yearlyMs` / `peakHeapUsedBytes` / `structuredCloneMs`, L2 vs L0. **Cost findings ride to the perf lane, not to tuning** — first-paint bytes, bundle shape and `tickScanBudget` are different instruments this soak does not touch. | report only |

### 3.6 THE FINDINGS FORMAT

Per cell: the existing receipt, unchanged, at
`artifacts/soak/diagnostic.cells/<cell>.json` in the disposable tree, copied to the
session scratchpad. Plus **ONE composed findings document**, whose rows are shaped to be
picked up directly as repair waves:

```
DS-<n>  <SHORT TITLE>
  class:        DETERMINISM | CONSERVATION | CONTRADICTION | UNBOUNDED |
                COMPOSED_STATE | STREAM | SILENT_LAYER | BELIEF | DEAD_BAND |
                VACUITY | COST
  cells:        the lighting cells and shapes that exhibited it (D-2 L1@30y×12s, D-5 L2@100y×4s)
  control:      what L0 did on the SAME shape.
                ⛔ A FINDING WITH NO CONTROL ROW IS NOT A FINDING.
  measured:     numbers quoted BY RECEIPT PATH, e.g.
                behavioral.yearly[17].succession.integrityFailures = 3 (L2) vs 0 (L0)
  layers:       the flag keys implicated, and by what evidence
  verdict:      CONFIRMED  (executed differential, ablation-attributed to a layer)
                PLAUSIBLE  (observed, not yet attributed)
  disposition:  REPAIR_WAVE      → §3h step 3; it is a defect
                TUNING_PROPOSAL  → §3h step 7; it is a band, and THIS SOAK MAY NOT TOUCH IT
                INSTRUMENT_GAP   → the soak cannot see it; record, do not repair
                OWNER_GATED      → names the gated class
  ablation:     the L3/L5 cell that would attribute it — RUN or OWED
```

**⛔ THE BAND FIREWALL, made structural.** §3h's "may not sign, apply or adjust one
band" is enforced by the format itself: **there is no field for a proposed value.** A
finding whose only remedy is a number records the OBSERVATION and the DIRECTION, and
nothing else. The tuning signature (step 7) is where a number is chosen, against the
frozen shipping tree, owner-signed and versioned — per THE PROMISE.

**Ordering** by class severity:
`DETERMINISM > CONSERVATION > CONTRADICTION > UNBOUNDED > COMPOSED_STATE > STREAM >
SILENT_LAYER > BELIEF > DEAD_BAND > VACUITY > COST`.

**Two standing tables ship regardless of findings:**

1. **THE ALIVENESS TABLE** — `certify:subsystems` output for D-3 (L2 @ 30y×12s): 70
   rows, one verdict each. **The first time this contract will ever have produced a
   verdict from executed evidence.**
2. **THE UNGRADED LIST** — the 17 backlog keys, the display-only keys, and anything the
   census cannot see, **so the report states its own coverage rather than implying it.**

### 3.7 THE DISPOSABLE TREE AND CONCURRENCY

- `git worktree add` a fresh tree at the build-complete-dark commit, **with its own
  `npm ci`** — the recorded EUSAGE/node_modules-walk-up hazard means a worktree without
  its own `node_modules` silently runs against MAIN's.
- Cells invoke `node scripts/audit/...` — **no vitest** — so they never collide with a
  build lane's single vitest lane. They DO consume CPU for hours; cap parallelism to
  what the machine holds (peak heap 189–603 MB per process) and record the host in the
  receipt, which already labels timings host-sensitive.
- Nothing is committed to the build tree. Nothing touches
  `WORLD_CERTIFICATION_MANIFEST` (`bands: []`, `generatedAt: null` — it stays inert).
- The tree is disposable **precisely so M8's prng shim can exist.** It is deleted
  afterward; the shim never travels.
- ⚠ `scripts/audit/` is inside `REALM_SCALE_SOURCE_PATHS`, so adding the diagnostic
  files CHANGES the aggregate's attributable source hash. Expected and correct — but it
  means diagnostic aggregates are **not** comparable to the release aggregates on disk
  by source hash. State it in the report.

---

## 4. WHAT IT CANNOT SEE — the stated limits

1. **Sub-year granularity, and therefore ledger SATURATION.** The harness advances at
   `interval:'one_year'`; that orchestrator collapses each year to ONE `pulseHistory`
   record, so the ring never saturates and per-year growth stays broadly linear. The
   plateau/deceleration signature — `pulseHistory` ring at `MAX_HISTORY` 80,
   `queuedImpacts` retention, the roll-explanation cap — is asserted only by
   `worldTickCostEnvelope.test.js` at WEEKLY granularity. **The diagnostic soak inherits
   that blindness verbatim.** A composed ledger that only misbehaves once its ring
   saturates will not appear here.
2. **THE ENTIRE DISPLAY / UI LAYER.** `townCartographyEnabled`'s own certification row
   states plainly that no soak receipt can observe it. `discourseProseEnabled` and
   `heraldCausalVoiceEnabled` are display kernels. Lighting them moves nothing this
   instrument reads.
3. **THE 17 BACKLOG KEYS' ALIVENESS.** They carry no certification row, so
   `evaluateSubsystemCertification` cannot grade them. M4's container diff is the only
   channel, and it sees only layers that write a worldState container. Layers that
   modify existing values in place (`migrationCorruptionPushEnabled` — "a migration
   multiplier dark at x1"; `upswingHazardReadEnabled` — "a piety multiplier dark at x1";
   `economicCoupReadEnabled` — "a coup-verdict term") write **no container at all** and
   are invisible to every channel this soak has. Their only signal is an aggregate
   distribution shift, which the soak reports but cannot attribute.
4. **FIRST-PAINT BYTES, BUNDLE SHAPE, DIST BOOTABILITY.** The soak imports domain
   modules directly and never builds. `npm run smoke:boot`, the closure budget and the
   edge-shared bundle rebuild class are different instruments — a lit flag can move five
   edge bundles without moving one soak number.
5. **THE GENERATOR.** The fixture generates once at seed and then advances. Generation-
   side composition is `generation-certification-soak.mjs` + the golden master, a
   separate axis with its own receipts.
6. **⚠⚠ ANY LAYER GATED THROUGH A FROZEN-LIST CONJUNCTION.** `engineGatedRuleKeys`'s own
   header records this as an OPEN class: `REQUIRED_RULES.every(k => rules[k] === true)`
   is a COMPUTED member access, attributes to NO key, and hides the flag from the census
   the overlay is built from. Such a layer **would not be lit by L1/L2 and nothing would
   say so.** Mitigation, and it must be executed: build the L2 overlay from
   census ∪ backlog ∪ a fresh `\w+Enabled` token scan of `src/`, and **REPORT the
   difference** rather than silently lighting or not lighting. Widening the walker's
   regex is a chair decision, already queued as one.
7. **NON-DETERMINISM THAT IS SEED-STABLE.** Replay identity proves the same seed replays
   the same world; it cannot prove the world is not wrong in the same way every time.
8. **WHETHER THE WORLD IS GOOD.** §3h step 4 — the owner's walk — exists because a green
   suite is not a good world. The owner's eye outranks every number here. Nothing in
   this design substitutes for it.
9. **THE PERSISTENCE LIFECYCLE.** The soak threads state in memory as the store does,
   but never serializes through Supabase, never migrates, never reloads, never undoes,
   never regenerates. A composed state that survives the tick loop and dies on
   save/restore — this estate's most-bitten bug class — is **invisible here.** That gap
   belongs to the migration train and the ONE REGEN (§3h step 5), not to this soak.
10. **TRUE PAIRWISE INTERACTION.** C(41,2) = 820 cells is refused on measured cost
    grounds (§3.4). An interaction that appears for exactly one pair and cancels at
    all-lit is not addressed. **Accepted and recorded:** the all-lit cell answers "does
    the composed world hold", not "which pair". L5 narrows this using the
    `COUPLING_REGISTRY`'s declared cross-layer reads and the declared conjunction gates
    (`beliefAxes ∧ believed*`; espionage's three doors; `informationBrokerages ∧
    infoStatecraft`; `intervention/peaceEngine/supplyWebWarfare ∧ warLayer`) — evidence,
    not combinatorics — but it does not close the class.
11. **ANYTHING THE BEHAVIORAL ORACLE'S BANDS ALREADY MISS.** The soak reports against
    `BEHAVIORAL_THRESHOLDS`, which are predeclared v1 gates with deliberately low floors
    ("very low floors catch silence without pretending that rare events should become
    routine"). A composed world that degrades WITHIN those floors passes every band and
    is still worse. That is a tuning question — step 7 — and this soak may only observe
    it.

---

## 5. OPEN ITEMS FOR THE CHAIR (decisions this lane did not take)

1. **M8's prng shim** — does the chair authorize a `src/kernel/prng.js` instrumentation
   wrapper in the DISPOSABLE tree only (never landed, never travels)? Without it, stream
   theft is detectable but not attributable to a label. Recommended: YES; it is the only
   instrument that reaches the sharpest composition class, and the disposability is the
   containment.
2. **`neutralNeighborsEnabled` (D-8)** — it is a recorded OWNER-GATED
   performance-architecture decision with a measured red ratchet. Running it as a
   findings-only probe changes nothing and lights no flag; confirm that reading.
3. **The 300y research horizon** — excluded on cost (17.6 h/case). Confirm it stays a
   post-tail research question rather than a diagnostic cell.
4. **Limit 6's mitigation scan** — the fresh `\w+Enabled` token scan may find keys the
   17-key backlog does not contain (the backlog is asserted EXACT against the walker's
   *dot-access* regex, which by its own header cannot see the frozen-list conjunction
   spelling). If it does, that is a finding about the CENSUS, not about composition, and
   it belongs to the chair before the soak runs.
