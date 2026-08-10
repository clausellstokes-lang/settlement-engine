# Town Cartography / TC-4 — buildings, multiplicity, and the footprint packing

- **Status:** READY
- **Status note:** flipped DRAFT→READY by the chair 2026-08-10; the author lane could execute
  no test or gate command (a long run held the gate mutex), so every normally-measured
  baseline below is **AUTHOR-TIME-UNMEASURED** with the exact command the implementer runs
  at preflight
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `7699e367d9fc2fb87bfd5f8b72142969ec52c36e`
- **Base note:** authored at `9df7e428`; chair-revalidated at `7699e367` (both ancestors
  verified, substrate log `9df7e428..HEAD` over every §4 path EMPTY, all five targets
  clean, all three new files absent, every §4 symbol live). TC-3b's landing `a45c969d`
  is an ancestor (verified 2026-08-10,
  `git merge-base --is-ancestor a45c969d HEAD` exit 0). Eleven commits landed since;
  `git log a45c969d..HEAD -- src/domain/townCartography/ src/domain/townScene/ src/workers/
  src/lib/townScene/ src/data/namingData.js src/domain/townMap/` is **empty** — none touches
  this packet's substrate. All target paths were clean at authoring
  (`git status --porcelain` over the cartography paths: empty).
- **Last revalidated:** `2026-08-10` (chair READY-flip revalidation at `7699e367`)
- **Depends on:** TC-3a at `5066c34b`, TC-3b at `a45c969d`; TC-0..TC-2 at `6e96e259` + `0dcc3b9d`
- **Collision group:** `town-cartography-contract-and-compiler`; serialize against every other TC wave
- **Commit authority:** edits only; manager commits

> Inherited rulings this packet builds on, none reopened:
> **CR-TC3A-1** (pools by injection; the bounded chunk pair never carries foreign tables);
> **CR-TC3B-BYTES** (the byte STOP is IMPORT-EDGE-TRACKED: a packet's own mandated leaf may carry
> its bytes into the compiler chunk; no foreign payload may enter the bounded closure);
> the TC-3b landing observations carried to this compile — **metropolis
> `candidateCount === parcelCount`** (the parcel cap does not bind at a 4-gon fan, so density
> control must come from a cap that DOES bind — §6.4's per-parcel occupancy and per-tier total),
> and the **zero-padded index** convention (defensive-cosmetic; instance ordinals here are padded
> for the same reason, recorded as non-architectural spelling).

## 0. Why this packet exists, and what it starts from

`TC-3.md` §1 explicitly deferred **A-8 multiplicity and `resolveInstitutionMultiplicity` to
TC-4**, and ruled `footprint ⊂ parcel` begins here. TC-3b landed the parcels and, deliberately,
left two hooks pointing at this wave:

1. `bindCanonicalInstitutionsToParcels` **kept its exact TC-3 signature FOR TC-4** — its return
   (`institutionRef`, `anchorKey`, `parcelId`, `placement`, `decidedBy: 'prominence'`) is this
   packet's entry point, consumed as the receipt `compileTownParcelLayers` already emits.
   TC-4 consumes the SAME decision; it never re-derives a second binder.
2. `compileTownCartography` still emits `buildings: []`, and the v2 contract **already validates
   complete building rows** (see §6.1 — this is why no schema change happens here).

**Observable result:** a lit TownScene compile emits a non-empty, deterministic
`cartography.buildings` layer — institutions first (one flagship footprint per TC-3b binding,
plus resolved-multiplicity instances), population-derived dwelling fill after — with every
footprint packed **inside** its parcel in integer geometry, every `institutionRef` resolving
through the manifest's own semantics table, and the dark path byte-identical to the recorded
dormancy golden.

## 1. Reconciled authority

1. `docs/DESIGN_TOWN_CARTOGRAPHY.md` §1 is controlling: cartography is a synthesis stage inside
   the existing `TownSceneManifest`, never a parallel generator. The buildings layer is a
   PROJECTION of canonical facts (§0.2): every institution row traces to a canonical scene
   building the manifest already publishes; dwellings are population-derived filler with NO
   parallel identity (design §3).
2. `TC-3.md` §1's rulings carry over verbatim: `institutionAssignment` is consumed upstream and
   is a forbidden edit; the binding receipt is synthesis-local, never persisted; no second
   district graph, clipping, or street-face partitioner.
3. **A-8 (design §11b) is now IN scope**: `resolveInstitutionMultiplicity` turns each catalog
   range into THE canonical count from population-within-tier × economic profile (+ prosperity),
   seeded jitter, clamped to the authored range; instance identity is deterministic and
   APPEND-STABLE; **v1 is presentation-canonical, engine-inert** — resolved counts never feed
   economy/services math, zero golden shift, dormancy intact.
4. **CR-TC3B-BYTES governs the bundle posture** (§6.6): the two new leaves are this packet's own
   mandated modules and may carry their bytes into the compiler chunk; any NEW transitive edge
   from outside the already-in-closure module families is the violation.
5. **Schema ruling (this packet, from the validator's own shape): v2 stands; there is NO v3
   bump and NO edit to `cartographyContract.js`.** Evidence in §6.1.
6. Design prose this packet deviates from, each recorded in §11 for the chair: per-institution-
   class cohesion (11b's second bullet) is deferred — v1 stamps the settlement-level placement;
   age/condition derivation uses the canonical rows' existing `conditionProfile` facts plus the
   morphology evidence rather than a new stressor reader.

The implementer does not reopen these rulings by rereading design prose.

## 2. Outcome and non-goals

**Definition of done:** the real compiler emits a validating buildings layer for every lit
corpus row; every footprint's vertices and anchor pass `scenePointInPolygon` against its own
parcel; every eligible canonical institution has exactly one flagship row; multiplicity resolves
deterministically, monotonically, and append-stably; the layer measures under the exact per-tier
byte band; the dark path is byte-identical to the recorded golden; and
`workerBytes + manifestCompilerBytes` stays under `400,000` with zero new transitive
closure edges.

In scope:

1. `resolveInstitutionMultiplicity` — the pure canonical-count derivation (A-8).
2. Footprint packing inside parcels: flagships, instances, and dwelling fill, integer only.
3. Height/age/condition/style derivation from existing typed facts (design §4.5).
4. The TC-4 byte band and its receipt; determinism, dormancy, and bundle prevention guards.

Explicit non-goals: any schema/version/contract change; per-institution-class cohesion (recorded
deviation, §11); projecting resolved counts into dossier prose, exports, or Herald items (later
waves consume the receipt); TC-5 painter/labels/palette/PNG; TC-6 joins/hit-map; TC-7
reactivity; TC-8 exports/promotion; persistence of any receipt; overlap/adjacency aesthetics
beyond containment; map-edit verbs; new UI; tuning/soak; adjacent cleanup; full-gate repairs
unrelated to the eight acceptance cases.

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | buildings layer |
| New persisted record families / writers | `0 / 0` | `1 / —` | nothing here persists |
| Existing transient writer | `1` (`compileTownCartography`) | `1` | |
| Feature flags / user-facing surfaces | `1 existing / 0` | `1 / 1` | |
| Direct production consumers | `2` (compiler return, validator) | `2` | |
| New logic-bearing production leaves | `2` | `2` | at cap |
| Existing logic-bearing production files | `2` | `3` | tuning, synthesis |
| Registration-only files | `0` | `3` | |
| Handwritten files total | `8` | `12` | |
| Effective production-line delta | `<=355` | `400` | projected `~323` |
| New leaf — `cartographyMultiplicity.js` | `<=90` | `250` | projected `~70` |
| New leaf — `cartographyBuildings.js` | `<=230` | `250` | projected `~200` |
| `cartographyTuning.js` delta | **`<=48`** | `15` | **OVERRIDE — §12 O-6** |
| `cartographySynthesis.js` delta | `<=18` | `15` | **OVERRIDE — §12 O-6** |
| Acceptance cases | `8` | `8` | at cap |

Per-file caps use ESLint's own counting (`max-lines`, `skipBlankLines` + `skipComments`) — the
method that reproduced TC-3's `408` exactly. The two leaf projections are author estimates and
are **AUTHOR-TIME-UNMEASURED** until the implementation exists; exceeding any cap is a STOP and
a split, never a renegotiation.

## 4. Preflight

Run before editing:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor a45c969d HEAD
git merge-base --is-ancestor 9df7e428 HEAD   # authoring base; an unchanged descendant is
                                             # admissible only per PACKET_STANDARD rule 4

# Targets clean, new files absent.
git diff --quiet -- \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townCartography/cartographySynthesis.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js
test ! -e src/domain/townCartography/cartographyMultiplicity.js
test ! -e src/domain/townCartography/cartographyBuildings.js
test ! -e tests/domain/townCartographyBuildings.test.js

# Live symbols this packet consumes.
rg -n 'export function compileTownParcelLayers|export function bindCanonicalInstitutionsToParcels' \
  src/domain/townCartography/cartographyParcels.js
rg -n 'institutionBindings|buildings: \[\]' src/domain/townCartography/cartographySynthesis.js
rg -n 'requireMember\(building\.role|institutionRef must resolve|TOWN_CARTOGRAPHY_CONDITIONS' \
  src/domain/townScene/cartographyContract.js
rg -n 'export function slugify' src/domain/townMap/anchors.js
rg -n 'label: isFabric' src/domain/townScene/sceneSemantics.js
rg -n 'generatedFabric|conditionProfile' src/domain/townScene/sceneBuildingFabric.js src/domain/townScene/buildingProfiles.js
rg -n 'placement' src/domain/townCartography/cartographyMorphology.js
```

Expected: both ancestors hold; the five existing targets are clean; the three new files are
absent; every named symbol exists. Foreign dirt anywhere else is reserved and untouched — the
status commands are path-scoped for that reason. Any target collision or material symbol drift
makes this packet `STALE`.

**Baselines — every figure here is AUTHOR-TIME-UNMEASURED (the author lane held no test slot).
The implementer executes each and records the result BEFORE the first edit:**

| # | Premise | Exact command | Expected |
|---|---|---|---|
| B1 | Focused base is green | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/townCartographyWards.test.js tests/domain/townCartographyParcels.test.js tests/domain/townSceneCartography.test.js tests/domain/townCartographyDeterminism.test.js tests/property/townCartographyDormancyGolden.test.js` | exit 0; record counts |
| B2 | Bounded pair at base | `npm run build && npm run verify:dist` | pair `= 377,247 B` (TC-3b's landed receipt); a different number is recorded, not repaired |
| B3 | Dormancy golden green at base | included in B1 (`townCartographyDormancyGolden`) | green, `buildings` still `[]` lit |
| B4 | Typecheck posture | `npm run typecheck:ratchet && npm run typecheck:domain:strict` | exit 0 both configs, named separately |

A red B1/B3 at base means the substrate drifted: STOP, this packet is `STALE`.

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| Sole block writer | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | Calls the building leaf **once**, after the parcel leaf; replaces `buildings: []` with its rows; passes `parcelLayers.institutionBindings` through. |
| Binding receipt (TC-4's input) | `src/domain/townCartography/cartographyParcels.js` | `compileTownParcelLayers`, `bindCanonicalInstitutionsToParcels` | Consume `institutionBindings` from the compile result. **Forbidden edit; forbidden second call to the binder.** |
| Ward/parcel substrate | `src/domain/townCartography/cartographyWards.js`, `cartographyParcels.js` | `CartographyWardRow`, `CartographyParcelRow` | Read-only rows. **Forbidden edits.** |
| Shared narrowing kernel | `src/domain/townCartography/cartographyPlan.js` | `record`, `list`, `byCodepoint`, `planPolygon`, `roundedMean`, `generatedProvenance`, `premise` | **Import; never redeclare.** `premise` prefix stays `townCartography TC-3 premise:` — TC-4 is the same behavior family's next slice and the prefix is pinned by existing tests (a `TC-4` respelling is a STOP). |
| Canonical projected instances | `src/domain/townScene/sceneBuildingFabric.js` | `buildCompleteSceneBuildings` output = `base.buildings` | Rows carry `semanticId`, `anchorKey`, `districtId`, `footprint`, `heightCm`, `landmark`, `shapeFamily`, `skinId`, `generatedFabric`, `conditionProfile`. **Forbidden edit.** |
| Canonical row facts | `src/domain/townScene/buildingProfiles.js` | `buildSceneBuildingProfile` (shape only) | `conditionProfile` fields (`warScar`, `occupation`, `abandonment`, `neglect`, `repair`, `construction`, `historyMark`) feed §6.5. **Forbidden edit.** |
| Multiplicity range source | `src/domain/townScene/sceneSemantics.js` | building semantics rows: `sceneId`, `entityKind: 'building'`, `label` | The catalog display name (e.g. `Craft guilds (5-15)`) is already projected as the institution row's `label`, keyed by `sceneId === base.buildings[].semanticId`. Read from `base.semantics`. **Forbidden edit.** |
| Identity law | `src/domain/townMap/anchors.js` | `slugify` | The ONE ASCII slug spelling; already inside the compiler closure with zero imports of its own (§6.6). **Forbidden edit.** |
| Placement + evidence | `src/domain/townCartography/cartographyMorphology.js` | `readTownMorphology` → `placement`, `evidence.fabricAccumulation01` | Already computed by `synthesizeTownSkeleton`; threaded, never recomputed per class. **Forbidden edit.** |
| Schema/absence | `src/domain/townScene/cartographyContract.js` | `validateTownCartography` buildings block, `TOWN_CARTOGRAPHY_BUILDING_ROLES`, `TOWN_CARTOGRAPHY_CONDITIONS` | Already accepts complete building rows at v2. **Forbidden edit** (§6.1). |
| Stable geometry/digest | `src/domain/townScene/sceneCompilePrimitives.js`, `stableScene.js` | `scenePolygonArea`, `scenePointInPolygon`, `sceneDigest`, `stableSceneStringify` | Exact integer predicates, digests, byte measurement. |
| Tuning home | `src/domain/townCartography/cartographyTuning.js` | `TOWN_CARTOGRAPHY_TUNING`, `cartographyBand` | Gains §6.4's frozen TC-4 block only. |
| Dormancy fence | `tests/property/townCartographyDormancyGolden.test.js` + `tests/fixtures/town-cartography-dormancy-golden.json` | dark corpus | The JSON golden must not move. The single lit assertion `expect(lit.cartography.buildings).toEqual([])` is this packet's C7 edit. |
| Bundle posture guard | `tests/build/townScene3dLazy.test.js` | the bounded-payload `it` | **Run, never edit.** Owns `400,000` (pair), `300,000` (worker), `350,000` (compiler). |
| Proof precedents | `tests/domain/townCartographyParcels.test.js` | `compileLeaves`, `leafInputFor`, the `120_000` per-test timeouts | Copy the harness shape; per-test timeouts stay per-test. |

Forbidden production edits: everything above marked forbidden, plus
`compileTownSceneManifest.js`, `manifestContract.js`, `sceneCompileInput.js`,
`institutionAssignment.js`, `townMapModel.js`, `townScene.worker.js`, `townSceneExport.js`,
`vite.config.js`, `eslint.config.js`, `scripts/.size-baseline.json`, simulation rules,
state/store/UI/painter/export files, design docs, and every file outside §7.

## 6. Exact contracts

### 6.1 Schema ruling — v2 stands; no bump, no contract edit

Ruled from the validator's own shape, not from preference. `cartographyContract.js` v2 already:

- declares the complete `CartographyBuilding` typedef (id, parcelId, role, footprint,
  heightPermille, agePermille, condition, styleToken, provenance, decidedBy, and the three
  conditional keys `institutionRef` / `placement` / `lynchElement`);
- **validates every building row today**: sorted unique SAFE_TOKEN ids; `parcelId` must name a
  parcel in the same block; `role` ∈ {dwelling, institution}; footprint ≥ 3 integer points
  within `planExtent`; both permilles integer 0..1000; `condition` on the ordered ladder;
  `styleToken` a bounded lowercase token; `institutionRef` present **iff** institution and
  resolving through `context.semanticIds`; `placement` present **iff** institution;
  `lynchElement` only ever `'landmark'`;
- and `tests/domain/townSceneCartography.test.js` already validates a fixture block carrying
  populated building rows at `schemaVersion: 2` (both roles, both conditional-key polarities).

The version doc bumps "only on a breaking change to the block's shape". Filling a
reserved-and-validated empty layer is additive within v2. **`TOWN_CARTOGRAPHY_SCHEMA_VERSION`
stays `2`; `cartographyContract.js` is a forbidden edit; a discovered need for any new field,
key, or vocabulary member is a STOP,** not a v3 bump decided by a coding agent.

### 6.2 New leaf — `cartographyMultiplicity.js` (A-8's resolver)

Create `src/domain/townCartography/cartographyMultiplicity.js` with exactly these exports:

```js
parseCatalogRange(label: unknown) -> { min: number, max: number }
resolveInstitutionMultiplicity({ label, population, tier, prosperity, digest, anchorKey })
  -> { min, max, resolved }
```

Pure and total; no PRNG, no imports outside `cartographyPlan.js` and
`../townScene/stableScene.js` (for `sceneDigest`) and `./cartographyTuning.js`.

**Range parse.** `parseCatalogRange` reads the FIRST `\((\d+)-(\d+)\)` match in the label
(the catalog's own count spelling: `Craft guilds (5-15)`, `Taverns (5-20)`, …19 such entries).
No match, a non-string, or an empty label → `{ min: 1, max: 1 }` (the declared-else-generic
fall — custom content without a range resolves to one instance, A-2's grammar). A parsed
`min > max` or `min < 1` throws `premise('institution label <label> carries a malformed count range')`
— malformed canonical data is named, never repaired.

**The count.** With `M = TOWN_CARTOGRAPHY_TUNING.MULTIPLICITY` (§6.4):

```js
const span = M.POPULATION_SPAN[tierKey];                       // [lo, hi], total over tiers
const popWithin01 = clamp((population - span[0]) / (span[1] - span[0]), 0, 1);
// prosperity: the settlement's own economicState.prosperity label through M.PROSPERITY_RANK;
// unknown or absent label reads rank 3 (the ladder's modest midpoint), matching the
// townScene spelling asserted by C2's producer-binding check.
const prosperity01 = rank / M.PROSPERITY_RANK_SPAN;
const mix = clamp(
  M.POPULATION_WEIGHT * popWithin01 + M.PROSPERITY_WEIGHT * prosperity01, 0, 1);
const base = min + Math.round((max - min) * mix);
const stamp = Number.parseInt(
  sceneDigest({ domain: 'carto:multiplicity', digest, anchorKey }).slice(-8), 16);
const jitter = (Number.isFinite(stamp) ? stamp : 0) % M.JITTER_STEPS - 1;   // -1 | 0 | +1
const resolved = Math.min(max, Math.max(min, base + jitter));
```

Division and floats are permitted (the morphology precedent: `+ - * /` only, no
transcendental); the JITTER stamp spelling mirrors TC-3b's `clustered` offset and is a recorded
non-architectural spelling — do not change the `-8` slice, the radix, or the key set.

**Properties this construction guarantees (pinned by C2):** monotone non-decreasing in
`population` and in prosperity rank at fixed `digest`/`anchorKey` (jitter depends on neither);
always within `[min, max]`; `{min:1, max:1}` resolves to exactly `1`; independent of roster
order and of every other institution (per-anchor digest, the TC-3b lesson applied to counts —
**adding an institution can never change another's count**).

`'carto:multiplicity'` is a **digest DOMAIN, not a fork label** — single-colon, never `::`.

### 6.3 New leaf — `cartographyBuildings.js` (packing, fill, dress)

Create `src/domain/townCartography/cartographyBuildings.js` with exactly one public function:

```js
compileTownBuildingLayers({ buildings, semantics, wards, parcels, institutionBindings,
  settlement, digest, tier, placement, fabricAccumulation01 }) -> {
  buildings,                       // CartographyBuilding[] sorted by id
  receipts: Readonly<{ buildingCount, institutionCount, instanceCount, dwellingCount,
    multiplicity,                  // Array<{ institutionRef, min, max, resolved, emitted }>
    overflowCount, bytes, byteBudget, withinBudget }>
}
```

Pure and total. No store, clock, party, host global, raw seed, map edit, or settlement
institution roster; no module-scope mutable state; **no PRNG draw of any kind** — every choice
is a `sceneDigest` of named inputs (the TC-3b discipline). Bounded `for` loops only.

**Inputs.** `buildings` = `base.buildings` (canonical rows); `semantics` = `base.semantics`
(labels); `wards`/`parcels` = the same-manifest TC-3a/3b rows; `institutionBindings` = the
TC-3b receipt, consumed verbatim; `placement` and `fabricAccumulation01` from the one
morphology reading the synthesis already made.

**(a) Institutions first — one flagship per binding.** For each binding (already sorted by
`institutionRef`, then `anchorKey`):

1. The canonical row is the `buildings` row whose `semanticId === binding.institutionRef`; its
   ward is the parcel's `wardId`; its prominence class is the TC-3b band of
   `scenePolygonArea(planPolygon(row.footprint))` against
   `INSTITUTION_PROMINENCE_AREA_PLAN2` (`large` / `medium` / `small`).
2. `resolved` count comes from `resolveInstitutionMultiplicity` with the semantics `label` for
   that `sceneId` (absent semantics row → label `''` → count 1).
3. The **flagship** (instance `01`) packs into the bound parcel. Flagships are **exempt** from
   the per-parcel occupancy cap — a canonical institution always appears (the TC-3 law: a
   silently dropped institution forks the map from the dossier). When several flagships share a
   parcel, subcell index = flagship arrival ordinal mod 4; overlap between institution
   footprints is explicitly allowed (TC-3b: "collisions are allowed; TC-4 owns footprint
   packing" — packing here means *containment and slots*, not exclusion).
4. **Instances `02..resolved`** distribute round-robin: one instance per binding per round over
   the sorted bindings, so no single high-count institution starves the rest. Instance `k` of an
   anchor probes the ward's id-sorted parcels starting at `(boundIndex + k − 1) mod n`,
   taking the first parcel whose non-flagship occupancy is below
   `cartographyBand(BUILDINGS_PER_PARCEL, tier)`; a full ward ends that anchor's emission with
   the shortfall recorded (never an error). Emission also stops at
   `cartographyBand(MAXIMUM_CARTOGRAPHY_BUILDINGS, tier)` total.
5. The **canonical count is never silently lost**: `receipts.multiplicity` carries
   `{ institutionRef, min, max, resolved, emitted }` for every binding, and `overflowCount`
   sums `resolved − emitted`. The RESOLVED number is the canonical fact later surfaces project
   (§11 D-2); the map draws what fits.

**(b) Dwelling fill after.** Per ward, in ward id order:
`dwellingTarget = min(freeSlots(ward), round(cartographyBand(DWELLING_TARGET, tier) * (500 + 500 * popWithin01) / 1000 * ward.tonePermille / 1000))`
where `popWithin01` is §6.2's population position and `freeSlots` counts remaining non-flagship
occupancy. Dwellings take parcels in id order, subcells in index order. Dwellings carry **no
institutionRef, no placement, no lynchElement** (the conditional-key law) and NO parallel
identity — their ids resolve to nothing outside this block, by design.

**(c) Footprint construction — containment by construction, checked by the exact predicate.**
A parcel is a TC-3b integer triangle. Its four **subcells** are the medial subdivision: with
rounded midpoints `m01, m12, m20` of its edges, subcells are `[v0,m01,m20]`, `[v1,m12,m01]`,
`[v2,m20,m12]`, `[m01,m12,m20]` (this is why `BUILDINGS_PER_PARCEL` never exceeds 4). A row in
subcell `s` with shrink permille `p` has footprint vertices

```js
f_i = [ c[0] + Math.round((v_i[0] - c[0]) * p / 1000),
        c[1] + Math.round((v_i[1] - c[1]) * p / 1000) ]   // c = rounded subcell centroid
```

and `anchor = c`. `p` starts at the class value in `FOOTPRINT_SHRINK_PERMILLE`
(`large`/`medium`/`small`/`dwelling`) and walks the fixed ladder
`[p, p − 160, p − 320]` (floor `120`) — a bounded 3-entry `for`, **not** a retry loop. A step is
accepted when `scenePolygonArea(footprint) > 0` **and every vertex plus the anchor passes
`scenePointInPolygon` against the PARCEL polygon**. If no step passes: a dwelling row is
**skipped** (fill is best-effort); an institution row throws
`premise('institution <ref> cannot pack inside parcel <id>')` — a canonical fact that cannot be
drawn is named, never dropped. (Author expectation: the premise never fires on the twenty-row
corpus; that is exactly what C3 measures — AUTHOR-TIME-UNMEASURED.)

**(d) Identity — append-stable, bounded.**

```
institution instance:  carto:building:<slug>:i<NN>     // NN zero-padded 2, from 01
dwelling:              carto:dwelling:<ward.id>:<NNN>  // NNN zero-padded 3, from 001
```

`slug = slugify(anchorKey).slice(0, 90)` through `src/domain/townMap/anchors.js`'s `slugify` —
the ONE identity-slug spelling, already a zero-import leaf inside the compiler closure (§6.6).
Growth appends instance `N+1` and never reindexes `1..N` (A-8's NPC positional-id lesson):
instance ids are a pure function of `(anchorKey, k)`, dwelling ids of `(ward.id, slot)`. The
zero-padding is the TC-3b defensive-cosmetic convention, recorded as non-architectural
spelling. Before returning, the leaf asserts id uniqueness and throws
`premise('duplicate building id <id>')` on a truncation collision — deterministic, no repair.

**(e) Dress — exact derivations from existing typed facts (design §4.5).**
All stamps use the single digest domain `'carto:building-dress'` with keys
`{ digest, subject, instance }` (`subject` = anchorKey for institutions, ward id for
dwellings; `instance` = the ordinal). `jitterOf(stamp) = stamp % 3 − 1` as in §6.2.

- `heightPermille`: institutions —
  `clamp(round(1000 * (heightCm / base planUnitCm) / HEIGHT_PLAN_CEILING), 0, 1000)` from the
  canonical row (`HEIGHT_PLAN_CEILING: 60`, the `buildingProfiles` clamp maximum, asserted
  equal by C5's producer-binding check). Dwellings —
  `clamp(cartographyBand(DWELLING_HEIGHT_PERMILLE, tier) + 20 * jitter, 0, 1000)`.
- `agePermille`: institutions —
  `clamp(round(1000 * (0.5 * historyMark / 15 + 0.5 * (fabricAccumulation01 ?? historyMark / 15))) + 50 * jitter, 0, 1000)`
  where `historyMark` is the canonical row's `conditionProfile.historyMark`. Dwellings —
  `clamp(round(1000 * (fabricAccumulation01 ?? 0.5)) + 50 * jitter, 0, 1000)`. A dark fabric
  layer contributes no term (the fabricRead law): `?? `, never a coalesce to 0.5 for
  institutions, whose history term always exists.
- `condition` — a FIRST-MATCH chain over the canonical row's `conditionProfile` (dwellings use
  the ward-share row absent per-row facts: the profile of the flagship-free path reads all
  zeros except the settlement-level terms, which `sceneBuildingFabric` already stamped on every
  generated row — dwellings here reuse the values of the canonical row **nearest by parcel
  ward**, i.e. the ward's first bound institution, else all-zero). Order is load-bearing
  (the first-match-chain hazard class) and is exactly:

  ```
  1. abandonment >= RUINED_ABANDONMENT_FLOOR/1000            -> 'ruined'
  2. max(warScar, occupation) >= BURNED_WAR_FLOOR/1000       -> 'burned'
  3. max(warScar, occupation) >= DAMAGED_WAR_FLOOR/1000      -> 'damaged'
  4. neglect >= WORN_NEGLECT_FLOOR/1000
     or agePermille >= WORN_AGE_FLOOR                        -> 'worn'
  5. max(repair, construction) >= PRISTINE_RENEWAL_FLOOR/1000
     and neglect < PRISTINE_NEGLECT_CEILING/1000             -> 'pristine'
  6. otherwise                                               -> 'sound'
  ```

- `styleToken`: institutions — `` `${slugify(shapeFamily)}.${slugify(skinId)}` `` from the
  canonical row; dwellings — `` `dwelling.${slugify(ward.kind)}` ``. Both pass SAFE_TOKEN by
  construction (slugify emits `[a-z0-9-]`).
- `role`/`decidedBy`/`provenance`: institutions `'institution'` / `'prominence'`; dwellings
  `'dwelling'` / `'feel'` (A-10: prominence decides institutional space, feel decides dwelling
  grain); `provenance = generatedProvenance()` on every row.
- `placement`: institution rows carry the binding's placement verbatim (the settlement-level
  reading — §11 D-1). Dwellings carry none.
- `lynchElement: 'landmark'` on flagship rows whose canonical footprint area
  `>= INSTITUTION_PROMINENCE_AREA_PLAN2.large`, and on no other row (A-10.3: landmarks are the
  PROMINENT institutions).

**(f) Byte receipt.** `bytes` = `TextEncoder().encode(stableSceneStringify({ buildings })).byteLength`;
`byteBudget = cartographyBand(TC4_LAYER_MAX_BYTES, tier)`; over budget throws
`premise('the TC-4 layer measures <n> bytes against the <tier> band of <m>')`. The band is
never raised to fit output.

### 6.4 Exact tuning additions — TC-4 block only

Add only this frozen block to `TOWN_CARTOGRAPHY_TUNING` (values authored by this packet,
vetoable per §12 O-3; the byte band additionally AUTHOR-TIME-UNMEASURED per §12 O-4):

```js
// ── TC-4 BUILDINGS (design §3, §4.5, A-8 §11b) ──────────────────────────────
MULTIPLICITY: Object.freeze({
  POPULATION_WEIGHT: 0.6,
  PROSPERITY_WEIGHT: 0.4,
  JITTER_STEPS: 3,                      // stamp % 3 − 1  ->  −1 | 0 | +1 count steps
  PROSPERITY_RANK: Object.freeze({      // the townScene ladder, re-declared (see note)
    subsistence: 0, struggling: 1, poor: 2, moderate: 3, modest: 3,
    comfortable: 4, prosperous: 5, wealthy: 6, opulent: 6,
  }),
  PROSPERITY_RANK_SPAN: 6,
  POPULATION_SPAN: Object.freeze({      // POPULATION_RANGES, re-declared (see note)
    thorp: Object.freeze([8, 60]), hamlet: Object.freeze([61, 400]),
    village: Object.freeze([401, 900]), town: Object.freeze([901, 5000]),
    city: Object.freeze([5001, 25000]), metropolis: Object.freeze([25001, 100000]),
  }),
}),
BUILDINGS_PER_PARCEL: Object.freeze({   // <= 4 ALWAYS: one medial subcell each (§6.3c)
  thorp: 1, hamlet: 2, village: 2, town: 3, city: 4, metropolis: 4,
}),
MAXIMUM_CARTOGRAPHY_BUILDINGS: Object.freeze({
  thorp: 12, hamlet: 24, village: 48, town: 96, city: 176, metropolis: 240,
}),
DWELLING_TARGET: Object.freeze({
  thorp: 8, hamlet: 16, village: 32, town: 64, city: 120, metropolis: 160,
}),
DWELLING_HEIGHT_PERMILLE: Object.freeze({
  thorp: 100, hamlet: 120, village: 140, town: 180, city: 220, metropolis: 260,
}),
FOOTPRINT_SHRINK_PERMILLE: Object.freeze({ large: 660, medium: 540, small: 420, dwelling: 300 }),
FOOTPRINT_SHRINK_STEP: 160,             // the fixed 3-entry ladder: p, p−160, p−320 (floor 120)
FOOTPRINT_SHRINK_FLOOR: 120,
HEIGHT_PLAN_CEILING: 60,                // buildingProfiles' heightPlan clamp maximum
CONDITION_THRESHOLDS: Object.freeze({
  RUINED_ABANDONMENT_FLOOR: 720, BURNED_WAR_FLOOR: 720, DAMAGED_WAR_FLOOR: 450,
  WORN_NEGLECT_FLOOR: 500, WORN_AGE_FLOOR: 700,
  PRISTINE_RENEWAL_FLOOR: 600, PRISTINE_NEGLECT_CEILING: 250,
}),
TC4_LAYER_MAX_BYTES: Object.freeze({    // AUTHOR-TIME-UNMEASURED — implementer measures (§12 O-4)
  thorp: 6000, hamlet: 10000, village: 18000,
  town: 32000, city: 52000, metropolis: 72000,
}),
```

**Re-declaration note (the CARTOGRAPHY_TIERS precedent, applied twice):** `POPULATION_SPAN`
mirrors `src/data/constants.js` `POPULATION_RANGES` and `MULTIPLICITY.PROSPERITY_RANK` mirrors
`buildingProfiles.js`'s unexported ladder. Importing either source into this leaf is a
STOP — `data/constants.js` is a foreign payload into the bounded closure (CR-TC3B-BYTES) and
the profile ladder is unexported townScene internals. Drift is prevented the way the ward-kind
vocabulary already is: **C2 asserts both tables equal their producers, exact-set-both-ways, in
the test file** (tests may import anything). Two static invariants also pinned by C2:
`MAXIMUM_INSTITUTION_BINDINGS[t] <= MAXIMUM_CARTOGRAPHY_BUILDINGS[t]` for every tier (flagships
always fit the total cap), and `BUILDINGS_PER_PARCEL[t] <= 4` (the subcell theorem's bound).

Do not alter any TC-2/TC-3 tuning row or existing budget. Never raise a cap to make a test pass.

### 6.5 Compiler mount

`compileTownCartography` gains one call after the parcel leaf and emits its rows:

```js
const buildingLayers = compileTownBuildingLayers({
  buildings: base.buildings,
  semantics: base.semantics,
  wards: layers.wards,
  parcels: parcelLayers.parcels,
  institutionBindings: parcelLayers.institutionBindings,
  settlement,
  digest,
  tier,
  placement: synthesis.morphology.placement,
  fabricAccumulation01: synthesis.morphology.evidence.fabricAccumulation01,
});

return {
  schemaVersion: TOWN_CARTOGRAPHY_SCHEMA_VERSION,   // 2, unchanged
  streets: layers.streets,
  wards: layers.wards,
  parcels: parcelLayers.parcels,
  buildings: buildingLayers.buildings,              // was []
};
```

`receipts` and `multiplicity` stay synthesis-local. **No new key reaches the block**;
`TOWN_CARTOGRAPHY_BLOCK_KEYS` does not change. The dark path is untouched.

### 6.6 Bundle posture under CR-TC3B-BYTES

The invariant is **import-edge-tracked**, not byte-tracked: the two new leaves are this
packet's own mandated modules and lawfully carry their bytes into the compiler chunk (the
TC-3b precedent: 104→105 closure members, +3,926 B). What is forbidden is a NEW TRANSITIVE
EDGE from outside the already-in-closure families.

The complete permitted import set for both new leaves — **anything else is a STOP**:

```
./cartographyPlan.js          (in closure, zero imports)
./cartographyTuning.js        (in closure, zero imports)
../townScene/sceneCompilePrimitives.js   (in closure)
../townScene/stableScene.js              (in closure)
../townMap/anchors.js         (in closure via townMapModel; ZERO imports of its own —
                               verified at authoring; the cut-one-edge check below re-proves it)
```

Named forbidden imports, each individually a STOP: `src/data/institutionalCatalog.js` (a
multi-thousand-line table — the exact foreign-payload class CR-TC3B-BYTES exists to block),
`src/data/constants.js`, `src/data/namingData.js` (CR-TC3A-1 — the pools never re-enter),
any `src/store/`, `src/lib/flags`, React, `cartographyWards.js`/`cartographyParcels.js`
(the substrate rows arrive as inputs, never as imports — importing either would create the
coupling back-edge the family trap names), and any new module outside the
`townCartography`/`townScene`/`townMap`-already-in-closure/`kernel` families.

Expected posture after this packet (**AUTHOR-TIME-UNMEASURED**): pair
`377,247 B + (the two leaves' own rendered bytes, projected < 8,000 B) < 400,000`; worker
`< 300,000`; compiler `< 350,000`; closure member count grows by exactly 2 with **zero** new
transitive edges. Measured by C8's command; sizes cure in RENDERED bytes from the build, never
`wc -c`. A pair at or above `400,000` is a STOP — no literal moves, no `manualChunks` rule.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Projected | Instruction |
|---|---|---|---:|---:|---|
| `CREATE` | `src/domain/townCartography/cartographyMultiplicity.js` | the two §6.2 exports | `90` | `~70` | The pure resolver: range parse, mix, digest jitter, clamp; imports per §6.6 only. |
| `CREATE` | `src/domain/townCartography/cartographyBuildings.js` | `compileTownBuildingLayers` | `230` | `~200` | Packing, instances, dwelling fill, dress, byte receipt per §6.3; consumes the binding receipt; never re-binds. |
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `TOWN_CARTOGRAPHY_TUNING` | `+48` | `~+40` | Add exactly the §6.4 block. **Override — §12 O-6.** |
| `MODIFY` | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | `+18` | `~+13` | Call the building leaf once after the parcel leaf; emit its rows; keep receipts local. **Override — §12 O-6.** |
| `CREATE` | `tests/domain/townCartographyBuildings.test.js` | C2, C3, C4, C5 | `n/a` | | Copy the `compileLeaves`/`leafInputFor` harness shape from the parcels suite; per-test `120_000` timeouts on the two corpus cases. |
| `TEST` | `tests/domain/townSceneCartography.test.js` | the compiler-mount block | `n/a` | | C1 — replace the single `expect(block.buildings).toEqual([])` with the lit building assertions; every other assertion preserved. |
| `TEST` | `tests/property/townCartographyDormancyGolden.test.js` | lit assertion only | `n/a` | | C7 — replace `expect(lit.cartography.buildings).toEqual([])` with non-empty + additive-only; every dark/base assertion preserved; the JSON golden untouched. |
| `TEST` | `tests/domain/townCartographyDeterminism.test.js` | package pins and scans | `n/a` | | C6 — add both new leaves to the SOURCES pin and to the bounded-loop scan list; add one label-scan row: `cartographyMultiplicity.js` labels `=== ['carto:multiplicity']`, `cartographyBuildings.js` labels `=== ['carto:building-dress']`, neither spells `::`, neither file matches `createPRNG` or `.fork(`. |

Generated artifacts: `NONE`. Do not edit `tests/fixtures/town-cartography-dormancy-golden.json`,
`tests/fixtures/townMapFixtures.js`, `tests/build/townScene3dLazy.test.js`, or
`scripts/.size-baseline.json`.

## 8. Ordered coding sequence

0. Run §4 preflight and record all four AUTHOR-TIME-UNMEASURED baselines. Stop on mismatch.
1. Add the §6.4 tuning block.
2. Add the smallest failing focused test rows (C2's resolver cases) — before the leaves exist.
3. Implement `cartographyMultiplicity.js`; make C2 green.
4. Implement `cartographyBuildings.js` (packing → instances → dwellings → dress → receipt).
5. Wire `compileTownCartography` (§6.5).
6. Complete C1/C3/C4/C5 in the new suite and the two existing-file edits (C1, C7).
7. Extend the determinism pins (C6).
8. Run §10 focused checks; then `npm run build && npm run verify:dist` for C8; then the
   wave-end gate.
9. Report exact deltas, counts, the per-tier byte figures, the pair measurement against B2,
   the dark-golden result, and `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| C1 | Real lit compile | `cartography.buildings` non-empty; whole-manifest validation green at schemaVersion `2`; every `parcelId` names a block parcel; every `institutionRef` resolves through the same manifest's semantics; exactly one flagship per TC-3b binding; streets/wards/parcels keep their TC-3a/3b bytes | `townSceneCartography.test.js` |
| C2 | Multiplicity resolution | rangeless label → 1; `(5-15)`-style labels resolve within range; monotone in population and prosperity at fixed digest/anchor; jitter ∈ {−1,0,+1} and clamped; reversed roster and an APPENDED institution change no existing count, id, or footprint (append-stability); `POPULATION_SPAN` ≡ `POPULATION_RANGES` and `PROSPERITY_RANK` ≡ the buildingProfiles ladder, exact-set-both-ways; the two §6.4 static invariants hold for all six tiers | `townCartographyBuildings.test.js` |
| C3 | Footprint geometry (the A-7 chain) | across the twenty-row corpus: every footprint vertex AND anchor passes `scenePointInPolygon` against its own parcel; integer vertices; positive area on every emitted row; per-parcel non-flagship occupancy `<=` band; total `<=` `MAXIMUM_CARTOGRAPHY_BUILDINGS`; the institution pack-failure premise throws on a crafted degenerate parcel, with a restore control | `townCartographyBuildings.test.js` (120_000 per-test) |
| C4 | Dwelling fill | dwelling counts respond to population (higher pop ⇒ `>=` dwellings at fixed digest); dwellings carry no `institutionRef`/`placement`/`lynchElement`; ids `carto:dwelling:<ward>:<NNN>` sorted unique; a zero-parcel compile emits zero dwellings and does not throw | `townCartographyBuildings.test.js` |
| C5 | Dress derivations | the §6.3e condition chain: a high-warScar fixture reads `burned`, high-abandonment `ruined`, renewal `pristine`, default `sound` — each with a restore control; `HEIGHT_PLAN_CEILING === 60` producer-binding check; every styleToken matches SAFE_TOKEN; both permilles integer 0..1000 | `townCartographyBuildings.test.js` |
| C6 | Determinism and purity | two compiles byte-identical; reversed leaf inputs byte-identical; a changed digest moves dress stamps while ids stay put; the package SOURCES pin names both new leaves; label scans as §7; no `createPRNG`/`.fork(`/`while`/`do` in either leaf | `townCartographyDeterminism.test.js`, `townCartographyBuildings.test.js` |
| C7 | Dormancy regression | absent/false: no block, golden JSON byte-identical, base manifest unchanged; lit: ONLY the buildings layer newly non-empty — stripping `cartography` still recovers the dark bytes exactly | `townCartographyDormancyGolden.test.js` |
| C8 | Bundle posture (CR-TC3B-BYTES) | with `VERIFY_DIST=1`: pair `< 400,000` (report the number against B2's `377,247`), worker `< 300,000`, compiler `< 350,000`; the two new leaves are the ONLY closure additions — zero new transitive edges (compare the closure inventory against base); every TC-4 corpus row under its exact `TC4_LAYER_MAX_BYTES` band | `tests/build/townScene3dLazy.test.js` (**run, not edited**) + `townCartographyBuildings.test.js` |

Do not add a ninth case or a speculative cross-product. Note for C2/C3 honesty: the twenty-row
corpus uses synthetic institution names WITHOUT count ranges, so corpus rows resolve to count 1;
multi-instance behavior is proven at leaf level with ranged-label fixtures. The corpus cannot
prove multiplicity `> 1` end-to-end and the matrix does not pretend it can.

## 10. Verification commands

```sh
# Baseline (B1) and focused behavior; the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townCartographyParcels.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyBuildings.test.js \
  tests/domain/townCartographyParcels.test.js \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npx eslint src/domain/townCartography/cartographyMultiplicity.js \
  src/domain/townCartography/cartographyBuildings.js \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townCartography/cartographySynthesis.js \
  tests/domain/townCartographyBuildings.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npm run typecheck:ratchet
npm run typecheck:domain:strict

# C8 — build FIRST; verify:dist reads dist/ and skips without it.
npm run build
npm run verify:dist

npm run check:tail
```

Expected exit `0` everywhere. Report actual counts, the measured pair, and every per-tier TC-4
byte figure — a green run without the numbers is not a receipt. A red full gate requires
base-versus-wave failure attribution and authorizes no adjacent repair. The author lane ran
NONE of these (gate mutex held by a long test run at authoring time); nothing in this packet
asserts an executed result.

## 11. Recorded deviations from design prose (each vetoable)

1. **D-1 — Per-institution-class cohesion (design §11b bullet 2) is NOT implemented.** v1
   stamps the settlement-level `readTownMorphology().placement` on every institution row — the
   same value TC-3b already stamped on every binding. A per-class cohesion resolver is a new
   derivation surface in `cartographyMorphology.js` (a forbidden edit here) and belongs to its
   own slice. Deliberately deferred, documented, not a bug to re-find. **Chair must ratify
   (§12 O-1)** since A-8 is BINDING on TC-4.
2. **D-2 — "Every surface projects it" is satisfied by the RECEIPT, not by new surfaces.** The
   canonical resolved count lives in `receipts.multiplicity`; dossier prose, exports, and
   Herald items are TC-5+/dossier-lane consumers. The map draws `emitted <= resolved` rows when
   capacity binds, with the shortfall in `overflowCount` (§12 O-5 rules the acceptability).
3. **D-3 — The catalog range is read from the manifest's own semantics labels**, not from
   `institutionalCatalog.js`. The label IS the canonical projection of the catalog identity
   (sceneSemantics: same name → same slug; the range is part of the name) and the catalog
   module is a forbidden closure import (§6.6). A future structured `countRange` field on
   semantics rows would be a `sceneSemantics.js` change — out of this packet's scope, flagged
   §12 O-2.
4. **D-4 — Age/condition derive from the canonical rows' existing `conditionProfile` plus
   morphology evidence**, not from a new stressor reader — no new state, the A-8 constraint
   honored with zero new derivation homes.
5. **D-5 — Dwelling fill is slot-bounded and ward-local** (no cross-ward largest-remainder
   pass): parcels are few and the total cap binds first; the sceneBuildingFabric reallocation
   dance would add lines for no observable difference at these bands.
6. **D-6 — Two new leaves instead of one** (the TC-3a precedent): the resolver is its own
   module so later surfaces (dossier prose at TC-5+) can consume the SAME count without
   importing the packing machinery.

## 12. Open items for the chair — the author could not settle these from code

- **O-1 — Ratify D-1** (settlement-level placement in v1; per-class cohesion deferred to a
  named later slice) or BLOCK this packet until a class-cohesion design lands. The packet is
  written assuming ratification.
- **O-2 — Ratify D-3's ruling** (range parsed from semantics labels) or commission the
  structured-field alternative first (a `sceneSemantics.js` edit + walker; bigger scope, one
  more file family). The packet is written on the label ruling.
- **O-3 — The §6.4 authored numbers** (weights, jitter, caps, shrink permilles, condition
  thresholds, dwelling bands) are packet-authored tuning for a dark-flagged feature, per the
  MAXIMUM_WARDS / PARCELS_PER_WARD precedent. Each is individually vetoable; none is
  owner-physical tuning of a lit surface.
- **O-4 — `TC4_LAYER_MAX_BYTES` is AUTHOR-TIME-UNMEASURED.** The implementer measures every
  corpus row at step 8 and reports the per-tier maxima. If any measured row exceeds its band
  the implementer STOPs and the chair re-authors the band from the measurement — the band is
  never raised by the coding agent to fit output.
- **O-5 — Overflow semantics**: when ward capacity binds, instances are clamped with
  `resolved` preserved in the receipt (D-2). Alternative rejected without authority to choose:
  premise-erroring on any shortfall would make large-count institutions a compile hazard at
  small tiers. Confirm the clamp.
- **O-6 — Budget overrides**: `cartographyTuning.js` `+48` and `cartographySynthesis.js` `+18`
  against the 15-line hot-file default (precedent: TC-3's `+30`/`+45`, TC-3b's `+18`/`+15`).
  Named here before dispatch per the standard.
- **O-7 — PACKET_MANIFEST.json**: three of this packet's TEST paths and both MODIFY paths
  appear in TC-3A/TC-3B's LANDED manifest entries. Whether the validator releases LANDED
  packets' paths (the TC-3b C-1 note's duplicate-path rule) is a coordinator question; the
  JSON entry is added at the READY flip, and this document §7 is the manifest of record until
  then.

## 12b. Chair rulings at the READY flip (2026-08-10, revalidated at `7699e367`)

Every §12 item is CLOSED; the implementer reopens none of them.

- **O-1 RATIFIED.** D-1 stands: v1 stamps the settlement-level placement; per-institution-class
  cohesion is deferred to its own named later slice (compiled no earlier than the TC-5 lane).
  Deliberately deferred, documented, not a bug to re-find.
- **O-2 RATIFIED on the label ruling (D-3).** The range parses from the manifest's own
  semantics labels — the label IS the canonical projection of the catalog identity, and the
  catalog module stays a forbidden closure import. The structured `countRange` field on
  semantics rows is recorded as possible LATER work (a `sceneSemantics.js` change + walker,
  its own packet), not commissioned now.
- **O-3 APPROVED AS AUTHORED.** The §6.4 numbers are packet-authored tuning for a dark-flagged,
  presentation-canonical, engine-inert surface, per the MAXIMUM_WARDS / PARCELS_PER_WARD
  precedent; C2's producer-equality assertions guard the two mirrored tables against drift.
  Each value remains individually owner-vetoable; none is lit-surface tuning, so none needs
  the tuning signature.
- **O-4 RATIFIED AS PROCEDURE.** The implementer measures every corpus row and reports the
  per-tier maxima; any measured row over its band is a STOP and the chair re-authors the band
  from the measurement. The coding agent never raises a band.
- **O-5 THE CLAMP IS CONFIRMED.** Instances clamp with `resolved` preserved in the receipt and
  the shortfall in `overflowCount`. The premise-error alternative is REJECTED — it would make
  large-count institutions a compile hazard at small tiers, and the canonical fact is already
  preserved losslessly in the receipt.
- **O-6 APPROVED.** `cartographyTuning.js` `+48` and `cartographySynthesis.js` `+18` against
  the 15-line hot-file default, on the cited TC-3/TC-3b precedent.
- **O-7 RESOLVED.** The manifest validator reserves change paths exclusively across
  NON-TERMINAL packets only; TC-3A/TC-3B are LANDED (terminal), so their paths are released
  and TC-4's entry lists them without a deferred-row mechanism. The validate run at this flip
  is the receipt; if it refuses, the flip reverts to the deferred-shared-rows pattern rather
  than weakening the validator.

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- **THE COUPLING-PAIR TRAP (five bites this era): a new module is ALWAYS a new importer.**
  Either new leaf needing ANY import outside §6.6's enumerated set — `institutionalCatalog.js`,
  `data/constants.js`, `namingData.js`, a store, flags, React, `cartographyWards.js`,
  `cartographyParcels.js`, or any module not already in the worker/compiler closure — is a
  STOP, not a convenience. Verify by the cut-one-edge rule: for each import added, name the
  chain that already put the target in the closure; a target with no such chain is the
  violation.
- `workerBytes + manifestCompilerBytes >= 400,000`, `workerBytes >= 300,000`,
  `manifestCompilerBytes >= 350,000`, or the closure inventory shows ANY new transitive edge
  beyond the two mandated leaves — do not raise a literal, do not edit
  `townScene3dLazy.test.js`, do not add a `manualChunks` rule (CR-TC3B-BYTES);
- any solution needs a schema field, key, vocabulary member, or version bump — **including any
  edit to `cartographyContract.js`** (§6.1 ruled v2 sufficient; contrary evidence returns the
  packet, it does not authorize a bump);
- any solution needs a PRNG draw, a fork label, a `while`/`do` loop, polygon clipping, overlap
  repair, float or transcendental geometry, a second binder call, or a re-derived placement;
- an edit to `sceneBuildingFabric.js`, `buildingProfiles.js`, `sceneSemantics.js`,
  `anchors.js`, `cartographyMorphology.js`, `cartographyPlan.js`, `cartographyWards.js`,
  `cartographyParcels.js`, `compileTownSceneManifest.js`, or any worker/export/UI file
  becomes necessary;
- the dormancy JSON golden, dark manifest bytes, TC-2/TC-3 geometry, names, draw counts, or
  the base TownScene portion move at all;
- a corpus row's institution cannot pack (the §6.3c premise fires) — report the row, do not
  weaken the ladder, do not skip an institution;
- a `TC4_LAYER_MAX_BYTES` band is exceeded by real corpus output (O-4's re-author path, never
  a raise);
- any §3/§7 cap — the `355` total, either leaf cap, the eight files, the eight cases — would
  be exceeded;
- the `premise` prefix would need to change, a receipt key would need to reach the manifest
  block, or a resolved count would need to feed any engine/economy/services math (A-8 v1 is
  presentation-canonical, engine-inert);
- work reaches TC-5..TC-8, dossier prose surfaces, persistence, promotion, tuning of lit
  surfaces, soak, or an unrelated gate failure.

The STOP report names the smallest measured contradiction and proposes only the smallest
split. It does not edit this packet, weaken a test, raise a budget, or repair around it.
