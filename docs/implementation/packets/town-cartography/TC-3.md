# Town Cartography / TC-3 — wards and parcels implementation contract

- **Status:** `READY`
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `2c810d167d016302e641fc9cfe74fff57475b14e`
- **Last revalidated:** `2026-08-09`
- **Depends on:** TC-0..TC-2 at `6e96e259`, repaired by `0dcc3b9d`
- **Collision group:** `town-cartography-contract-and-compiler`; serialize against every other TC wave
- **Commit authority:** edits only; manager commits
- **Baseline posture:** at the verified base, the three existing focused files below passed
  `44/44` (exit `0`, 2026-08-09). The full gate was not rerun for packet authoring.

## 1. Reconciled authority

1. The owner's external-implementer order in `docs/DESIGN_TOWN_CARTOGRAPHY.md`
   authorizes TC implementation while keeping soak, promotion, and owner-eye gates held.
2. Design section 1 is controlling: cartography is a synthesis stage inside the existing
   `TownSceneManifest`, never a parallel town generator.
3. `src/domain/townScene/cartographyContract.js` is the live schema authority; a ward is
   already defined as a district drawn in ink, and TC-1 already reserved wards/parcels.
4. `compileTownCartography` is the sole transient block writer. TC-2 deliberately emits
   empty `wards`, `parcels`, and `buildings`.

Resolved contradictions and slice boundaries:

- “Partition enclosed regions” does **not** authorize a second street-face topology.
  `buildDistricts` already lowers canonical `TownMapModel` districts to validated scene
  polygons. TC-3 makes exactly one ward per scene district and carves inside it.
- A-5 requires names although schema v1 has none. TC-3 bumps only the nested cartography
  schema to `2` and makes `name` required on street and ward rows. The TownScene schema,
  dark manifest, and dormant golden do not move.
- `institutionAssignment` has already been consumed by `townMapModel` before the scene
  compiler runs; its result is present in canonical `base.buildings[].districtId`.
  TC-3 binds those projected building rows to parcels. It must not rerun or replace the
  assigner and must not edit `institutionAssignment.js`.
- A-8 multiplicity and per-institution-class cohesion need building-instance/count
  carriers that TC-3's manifest schema does not have. TC-3 binds the canonical institution
  instances that exist now and consumes the existing settlement-level placement reading.
  `resolveInstitutionMultiplicity`, new count state, and class-specific placement are
  TC-4 prerequisites, not hidden additions to this packet.
- TC-3 proves `parcel ⊂ ward`. `footprint ⊂ parcel`, building persistence of the
  binding, label placement, and prominence-driven footprint packing begin at TC-4/TC-5.

The implementer does not reopen these rulings by rereading design prose.

## 2. Outcome and non-goals

**Observable result:** a lit TownScene compile emits schema-v2 named streets plus
non-empty, deterministic wards and parcels derived from the same manifest's districts;
`cartography.buildings` remains `[]`.

**Definition of done:** the real compiler emits one ward per canonical district, bounded
contained parcels per ward, and a pure total institution-to-parcel binding receipt for
TC-4; the block validates, replays byte-identically, stays audience-projected, and leaves
the absent/false path byte-identical to the measured golden.

In scope:

1. Named street and ward records, ward lowering, and bounded parcel carving.
2. A pure binding seam from canonical scene institution buildings to generated parcels.
3. Contract, determinism, containment, budget, and dormancy prevention guards.

Explicit non-goals: TC-4 buildings or multiplicity; TC-5 painter, labels, palette, or
PNG; TC-6 joins; TC-7 reactivity; TC-8 exports/promotion; user-authored ward geometry;
map-edit verbs; persistence/migrations; general polygon clipping; visual tuning/soak;
new UI; adjacent cleanup; full-gate repairs unrelated to these eight acceptance cases.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families / writers | `0 / 0` |
| Existing transient writer | `1` (`compileTownCartography`) |
| Feature flags / user-facing surfaces | `1 existing / 0` |
| Direct production consumers | `2` (compiler return and validator) |
| New logic-bearing production leaves | `1` |
| Existing logic-bearing production files | `3` |
| Registration-only files | `0` |
| Handwritten files total | `8` |
| Effective production-line delta | `<=355` |
| New leaf size | `<=250` |
| Acceptance cases | `8` |

Approved shared-file overrides: `cartographyContract.js <=+30` and
`cartographySynthesis.js <=+45`; each exceeds the default 15-line hot-file allowance
because schema-v2 validation and the sole compiler mount cannot live elsewhere.
Exceeding any number is a STOP and a TC-3a/TC-3b split.

## 4. Preflight

Run before editing:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 2c810d167d016302e641fc9cfe74fff57475b14e HEAD
git diff --quiet -- src/domain/townScene/cartographyContract.js \
  src/domain/townCartography/cartographySynthesis.js \
  src/domain/townCartography/cartographyTuning.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js
test ! -e src/domain/townCartography/cartographyWardsParcels.js
test ! -e tests/domain/townCartographyWardsParcels.test.js
rg -n 'TOWN_CARTOGRAPHY_SCHEMA_VERSION|validateStreetRows|validateTownCartography' \
  src/domain/townScene/cartographyContract.js
rg -n 'synthesizeTownSkeleton|manifestStreet|compileTownCartography' \
  src/domain/townCartography/cartographySynthesis.js
rg -n 'TOWN_CARTOGRAPHY_TUNING|cartographyBand' \
  src/domain/townCartography/cartographyTuning.js
```

Expected: the verified base is an ancestor; all six existing targets are clean; both new
files are absent; named symbols exist. Foreign dirt is reserved and untouched. Any target
collision or material symbol drift makes this packet `STALE`.

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| Canonical district authority | `src/domain/townScene/compileTownSceneManifest.js` | `buildDistricts` | Read its `id/name/category/footprint/centroid/densityPermille`; do not repartition streets. |
| Upstream assignment | `src/domain/townMap/institutionAssignment.js` | `assignInstitutionsToDistricts` | Already consumed upstream; forbidden edit and forbidden second call. |
| Canonical projected instances | `src/domain/townScene/sceneBuildingFabric.js` | `buildCompleteSceneBuildings` | Bind only rows with `generatedFabric !== true`; use `districtId`, `semanticId`, `anchorKey`, `footprint`. |
| Sole block writer | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | Mount names/wards/parcels once and keep `buildings: []`. |
| State/cohesion reader | `src/domain/townCartography/cartographyMorphology.js` | `readTownMorphology` | Reuse its closed `placement`; create no class-specific resolver. |
| Schema/absence | `src/domain/townScene/cartographyContract.js` | `validateTownCartography`, `townCartographyActive`, `attachTownCartographyLayers` | Extend nested rows; preserve strict-true gate and by-reference dark path. |
| Naming authority | `src/data/namingData.js` | `NAMING_DATA` | Import the canonical pools; never copy them into cartography. |
| Naming entropy | `src/kernel/prng.js` | `createPRNG`, `fork`, `pick` | Root once at the manifest digest; use only the two named per-feature forks/draws. |
| Stable geometry/digest | `src/domain/townScene/sceneCompilePrimitives.js`, `stableScene.js` | `scenePointInPolygon`, `scenePolygonArea`, `sceneDigest`, `stableSceneStringify` | Reuse exact integer predicates, ordering, and byte measurement. |
| Proof precedents | `tests/domain/townSceneCartography.test.js`, `tests/domain/townCartographyDeterminism.test.js` | existing TC-1/2 suites | Preserve negative-control, seed-family, purity-scan, and draw-ledger shapes. |

Forbidden production edits: `compileTownSceneManifest.js`, `manifestContract.js`,
`institutionAssignment.js`, `townMapModel.js`, `sceneBuildingFabric.js`, simulation rules,
state/store/UI/export/painter files, design docs, and every file outside section 7.

## 6. Exact contracts

### Schema v2 and absence

- Set `TOWN_CARTOGRAPHY_SCHEMA_VERSION = 2`. Do not change
  `TOWN_SCENE_SCHEMA_VERSION`, block keys, street-container keys, or the flag spelling.
- Add required `name` to `CartographyStreet` and `CartographyWard`. A valid name is a
  string equal to its trim, 1..120 UTF-16 code units, with no C0/DEL control character.
  Existing recursive raw-colour rejection still applies. Add no name to parcels.
- Validator v2 rejects a missing/blank/control/overlong name and rejects schema v1.
- Absent/false flag: no `cartography` key and no naming draws. True: the complete v2
  block. `null` cartography remains invalid. A lit valid base with zero districts emits
  `wards: []`, `parcels: []`, and an empty binding receipt. `buildings` stays `[]`.
- There is no migration: TownScene manifests are derived artifacts. Do not add v1
  compatibility, saved state, import handling, or a second schema key.

### New leaf API

Create `cartographyWardsParcels.js` with exactly these public functions:

```js
compileTownWardParcelLayers({ districts, buildings, streets, settlement,
  digest, tier, placement }) -> {
    streets, wards, parcels, institutionBindings,
    receipts: { wardCount, parcelCount, bindingCount, candidateCount,
                bytes, byteBudget, withinBudget }
  }

bindCanonicalInstitutionsToParcels({ buildings, wards, parcels,
  digest, placement }) -> Array<{
    institutionRef, anchorKey, parcelId, placement, decidedBy: 'prominence'
  }>
```

Both functions are pure. They read no store, clock, party, host global, raw seed, map
edits, or settlement institution roster. The binding array is synthesis-local and is
**not** persisted in the TC-3 manifest; TC-4 will consume the same function.

### Exact tuning additions

Add only these frozen values to `TOWN_CARTOGRAPHY_TUNING`:

```js
MAXIMUM_WARDS: { thorp:8, hamlet:10, village:12, town:16, city:24, metropolis:48 }
MAXIMUM_WARD_VERTICES: 8
PARCEL_EDGE_DIVISIONS: 3
PARCELS_PER_WARD: { thorp:2, hamlet:3, village:4, town:6, city:8, metropolis:12 }
MAXIMUM_INSTITUTION_BINDINGS: { thorp:8, hamlet:12, village:20, town:32, city:64, metropolis:96 }
INSTITUTION_PROMINENCE_AREA_PLAN2: { medium:150, large:400 }
TC3_LAYER_MAX_BYTES: { thorp:8000, hamlet:12000, village:18000,
  town:32000, city:52000, metropolis:80000 }
```

Do not alter TC-2 tuning or any existing budget. Exceeding a count/vertex cap, receiving
a non-convex ward source, finding its centroid outside its polygon, or leaving a canonical
institution unbound throws `RangeError` beginning `townCartography TC-3 premise:`.
Never truncate canonical rows and never raise a cap to make a test pass.

### Naming

1. Resolve culture from `settlement.culturalIdentity.key`, then
   `settlement.config.culture`; absent means `germanic`.
2. A known key uses that `NAMING_DATA` entry. `mixed` or an unknown explicit key uses
   prefixes/suffixes flattened in codepoint-sorted culture-key order. Empty/non-string
   entries are ignored; the Germanic non-empty pools are the final fallback.
3. Root at `createPRNG(String(digest))`. Each feature gets an independent fork:
   `carto:names:street:<street-id>` or `carto:names:ward:<ward-id>`; `::` is forbidden.
   Each non-empty feature consumes exactly two draws: one prefix and one suffix.
4. Compose `<prefix><suffix> Way` for arterials, `<prefix><suffix> Lane` for lanes,
   and `<prefix><suffix> Ward` for wards. Process each family by codepoint-sorted id.
   Within a family, duplicate display names receive ` 2`, ` 3`, ... in that order.
   Names never participate in ids or geometry.

### Ward lowering and node assignment

1. Sort source districts by raw-codepoint `id`. Emit exactly one ward per district:
   `id = ward:<district.id>`, generated name, copied integer `footprint`,
   `districtId = district.id`, generated/null provenance, and
   `tonePermille = clamp(integer densityPermille, 0, 1000)` (missing -> `500`).
2. `kind` is the identical district category when present in
   `TOWN_CARTOGRAPHY_WARD_KINDS`, otherwise `other`; add no duplicate kind table.
3. Compute the rounded mean of the final vertex of every arterial. The codepoint-first
   ward containing it is the sole `lynchElement: 'node'`, `decidedBy: 'lynch'`.
   If none contains it, choose minimum squared centroid distance, then id. With no
   arterial or no ward, there is no node. Every other ward is
   `lynchElement: 'district'`, `decidedBy: 'state'`.

### Parcel carving

1. For each convex ward, use its canonical district centroid and every polygon edge.
   Split each edge into exactly three integer segments with
   `round((a*(3-k)+b*k)/3)` for `k=0..3` on each axis.
2. Each non-zero-area candidate is triangle `[centroid, segmentStart, segmentEnd]` with
   anchor equal to the component-wise rounded mean of its three points and id
   `parcel:<ward-id>:e<zero-padded-edge>:s<segment>`.
3. Candidate order is: `district` = edge then segment; `dispersed_orderly` = segment
   then edge; `clustered` = natural order rotated by the digest-derived ward offset;
   `dispersed_chaotic` = `sceneDigest({ digest, wardId, parcelId })`, then id.
   Unknown placement falls back to `dispersed_orderly`.
4. Take the first `PARCELS_PER_WARD[tier]` candidates, never more than available. Emit
   sorted by id with generated/null provenance and `decidedBy: 'state'`. No clipping,
   retries, jitter, overlap repair, or street-face search is allowed.

### Institution binding, order, and budget

1. Eligible source rows are `generatedFabric !== true` with string `semanticId`,
   `anchorKey`, and `districtId`. The matching ward is the one with that `districtId`.
2. Sort that ward's parcels by area descending, then id. Building footprint area
   `>=400` may choose only the largest third; area `>=150` may choose the largest two
   thirds; smaller rows may choose all. Round eligible counts up, minimum one.
3. Choose the eligible parcel with the lexicographically smallest
   `sceneDigest({ domain:'carto:institution-parcel', digest, anchorKey,
   institutionRef:semanticId, parcelId })`, then parcel id. Collisions are allowed;
   TC-4 owns footprint packing. This per-anchor choice is roster-order independent and
   adding an institution cannot reassign an existing one.
4. Return bindings sorted by `institutionRef`, then `anchorKey`. Persist none of them.
5. Measure TC-3 bytes over `{ streetNames:[{id,name}], wards, parcels }` using
   `stableSceneStringify` + `TextEncoder`. `withinBudget` is `bytes <=` the exact tier
   band. Compiler output over budget is a premise error; do not raise the band.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/townCartography/cartographyWardsParcels.js` | two exports in section 6 | `250` | Own naming, lowering, carving, binding, and TC-3 receipts only. |
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `TOWN_CARTOGRAPHY_TUNING` | `+30` | Add exactly the frozen values above. |
| `MODIFY` | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography`, `manifestStreet` vicinity | `+45` | Build TC-2 street container, call the new leaf once, emit its named streets/wards/parcels, keep buildings empty. |
| `MODIFY` | `src/domain/townScene/cartographyContract.js` | version, typedefs, street/ward validation | `+30` | Require bounded names and schema v2; change no outer key set. |
| `CREATE` | `tests/domain/townCartographyWardsParcels.test.js` | A1, A3-A6, A8 | `n/a` | Real compiler corpus, containment, binding, bounds, bytes. |
| `TEST` | `tests/domain/townSceneCartography.test.js` | schema block and compiler mount | `n/a` | Add names/v2 negatives; replace empty TC-3 expectations. |
| `TEST` | `tests/domain/townCartographyDeterminism.test.js` | fork and purity scans | `n/a` | Pin both `carto:names:*` families and the new leaf in package scans. |
| `TEST` | `tests/property/townCartographyDormancyGolden.test.js` | lit assertion only | `n/a` | Expect wards/parcels when lit; preserve every dark/base assertion. |

Generated artifacts: `NONE`. Do not edit
`tests/fixtures/town-cartography-dormancy-golden.json`.

## 8. Ordered coding sequence

0. Run preflight; stop on mismatch.
1. Re-run the 44-test baseline command from section 10 and record its result.
2. Add failing A1/A2 contract/compiler tests; do not touch the golden.
3. Add exact tuning values, then implement the new pure leaf.
4. Extend schema validation to v2 names.
5. Wire `compileTownCartography` once; do not edit its caller.
6. Add A3-A8 and the updated determinism/purity guards.
7. Run focused checks, then the wave-end gate.
8. Report exact deltas, counts, dark-golden result, and `deviations: NONE` or STOP.

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| A1 | Real lit compile | v2 validates; named streets; one ward/district; parcels non-empty; buildings empty | `townSceneCartography.test.js` |
| A2 | Schema/name negatives | v1 and missing/blank/control/overlong street or ward names red with named errors | `townSceneCartography.test.js` |
| A3 | Replay/order independence | repeated compiles and reversed leaf inputs are byte-identical; a changed digest moves names/chaotic selection | `townCartographyWardsParcels.test.js` |
| A4 | One-law/audience | ward ids, kinds, polygons, district refs equal projected canonical districts; player ids are a subset of DM ids | `townCartographyWardsParcels.test.js` |
| A5 | Geometry/bounds | 20 existing map fixtures: convex sources, positive parcel area, anchor/vertices inside ward, sorted unique ids, caps honored; one concave negative throws premise error | `townCartographyWardsParcels.test.js` |
| A6 | Binding | every eligible canonical institution binds once to its district's ward; prominence bands, sorting, and reversed-roster stability hold; bindings are absent from manifest | `townCartographyWardsParcels.test.js` |
| A7 | Dormancy regression | absent/false has no block and unchanged golden/base bytes; true changes only additive cartography | `townCartographyDormancyGolden.test.js` |
| A8 | Budget/purity | seed corpus stays under exact TC-3 byte bands; no ambient entropy, clock, mutable module state, forbidden import, unbounded retry, or `::` fork | `townCartographyDeterminism.test.js`, `townCartographyWardsParcels.test.js` |

Do not add a ninth case or a speculative cross-product.

## 10. Verification commands

```sh
# Baseline and focused behavior; test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyWardsParcels.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npx eslint src/domain/townCartography/cartographyWardsParcels.js \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townCartography/cartographySynthesis.js \
  src/domain/townScene/cartographyContract.js \
  tests/domain/townCartographyWardsParcels.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict
npm run check:tail
```

Expected exit: `0` for every command. Report actual test counts. A red full gate requires
base-versus-wave failure attribution; it does not authorize adjacent repair.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- the index and packet statuses disagree at dispatch, a production target is dirty, or
  a required live symbol differs materially;
- any solution needs a second district graph, a street-face partitioner, general polygon
  clipping, retries, float/transcendental geometry, or more than three edge divisions;
- any solution edits/reinvokes `institutionAssignment`, reads `settlement.institutions`,
  persists the binding, adds cartography buildings, or introduces multiplicity/count state;
- a schema field other than street/ward `name`, another flag, writer, persisted family,
  consumer, production leaf, or file outside section 7 becomes necessary;
- a canonical fixture exceeds a cap, is non-convex, has an outside centroid, leaves an
  institution unbound, or exceeds the byte band; do not truncate or raise a ceiling;
- importing canonical `NAMING_DATA` moves an eager-entry budget; do not copy the pools;
- dark manifest bytes or the dormancy JSON move, existing TC-2 geometry/draw counts move,
  or the base TownScene portion changes;
- the 355-line, eight-file, or eight-case budget would be exceeded;
- work reaches TC-4..TC-8, UI, export, painter, pulse, persistence, promotion, tuning,
  soak, or an unrelated gate failure.

The STOP report names the smallest measured contradiction and proposes only the smallest
split. It does not edit this packet, weaken a test, raise a budget, or repair around it.
