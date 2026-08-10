# Town Cartography / TC-3b — parcel carving and the institution binding

- **Status:** `BLOCKED`
- **Chair promotion (2026-08-10):** promoted BLOCKED; full chair validation deliberately
  deferred to the C-1 unblock revalidation, when TC-3a's landing SHA is recorded here.
- **Blocked on:** TC-3a landing. This packet's verified base is TC-3a's landing SHA, which
  does not exist yet. The chair records it and moves this packet to `READY`.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `5066c34bf6dd3a1982f92d22b0687ab4f204f17c`
- **Base note:** TC-3a's landing SHA, recorded by the chair 2026-08-10; the C-1 unblock
  revalidation (symbol re-verification + shared manifest rows re-entry + status flip)
  remains the next coordinator act
- **Base note:** the TRUE dispatch base is TC-3a's landing SHA, which does not exist yet —
  the chair replaces the line above with it at the C-1 unblock revalidation. Authored
  against `6da84cfd` and the preserved TC-3 implementation. The parent packet's base `2c810d16` is still an ancestor; of the 17
  commits landed since, **none** touches `src/domain/townCartography/`,
  `src/domain/townScene/`, `src/workers/`, `src/lib/townScene/`, or
  `src/data/namingData.js` (verified by `git log 2c810d16..HEAD -- <those paths>`,
  empty).
- **Last revalidated:** `2026-08-09`
- **Depends on:** TC-3a (names, wards, schema v2, the naming injection)
- **Collision group:** `town-cartography-contract-and-compiler`; serialize against every other TC wave
- **Commit authority:** edits only; manager commits

> The coordinator, not the coding agent, sets status. This packet stays `BLOCKED` until
> TC-3a lands and the chair pins the real base SHA into the header and §4.

## 0. Why this packet exists, and what it starts from

`TC-3.md` reached green and then STOPped on three measured size breaches (see `TC-3a.md`
§0). TC-3a took the names, the wards, and the naming-pool injection. **This packet takes
the rest, unchanged in behavior:** carving, candidate ordering, prominence binding, and
the layer byte band.

**THE PRESERVED WORK IS THIS PACKET'S STARTING MATERIAL.** The parcel half of the
preserved implementation was green (`63/63` focused) before TC-3a consumed the file. Its
byte-identical copy is preserved at:

```
/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/resume-snapshots/20260809T215509/build/
  src/domain/townCartography/cartographyWardsParcels.js
  tests/domain/townCartographyWardsParcels.test.js
```

verified `cmp`-identical to the working tree on 2026-08-09. The implementing lane
**relocates and rewires** that code; it does not re-derive the carving theorem. Every
contract in §6 is verbatim from it unless marked otherwise, and §6 is complete enough to
implement from **without** the snapshot if the scratch directory is gone.

## 1. Reconciled authority

1. `docs/DESIGN_TOWN_CARTOGRAPHY.md` §1 is controlling: cartography is a synthesis stage
   inside the existing `TownSceneManifest`.
2. `TC-3.md` §1's resolved contradictions carry over verbatim: no second street-face
   topology; TC-3 makes exactly one ward per scene district and carves **inside** it;
   `institutionAssignment` is already consumed upstream and is a forbidden edit; the
   binding is a synthesis-local receipt for TC-4, never a persisted record; A-8
   multiplicity and per-class cohesion are TC-4 prerequisites, not hidden additions here.
3. TC-3a owns schema v2, names, ward lowering, and the naming injection. This packet
   **adds no schema field**, bumps no version, and performs **no naming draw**.
4. `parcel ⊂ ward` is proven here. `footprint ⊂ parcel`, persistence of the binding, label
   placement, and prominence-driven footprint packing begin at TC-4/TC-5.

## 2. Outcome and non-goals

**Observable result:** a lit TownScene compile emits non-empty, deterministic, contained
parcels derived from the same manifest's wards, plus a pure total institution-to-parcel
binding receipt for TC-4. `cartography.buildings` remains `[]`.

**Definition of done:** the real compiler emits bounded contained parcels per ward and a
pure binding for every eligible canonical institution; the block validates, replays
byte-identically, stays audience-projected, measures under the exact per-tier byte band,
and leaves the absent/false path byte-identical to the measured golden.

In scope:

1. Bounded parcel carving inside each already-validated ward.
2. Candidate ordering driven by the settlement's own derived cohesion placement.
3. A pure binding seam from canonical scene institution buildings to generated parcels.
4. The TC-3 layer byte band and its receipt.

Explicit non-goals: any naming or schema change (TC-3a); TC-4 buildings, multiplicity, or
persistence of the binding; TC-5 painter/labels/palette/PNG; TC-6 joins; TC-7 reactivity;
TC-8 exports/promotion; user-authored ward geometry; map-edit verbs; migrations; general
polygon clipping; visual tuning/soak; new UI; adjacent cleanup; full-gate repairs
unrelated to these six acceptance cases.

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | |
| New persisted record families / writers | `0 / 0` | `1 / —` | the binding is **not** persisted |
| Existing transient writer | `1` (`compileTownCartography`) | `1` | |
| Feature flags / user-facing surfaces | `1 existing / 0` | `1 / 1` | |
| Direct production consumers | `2` (compiler return, validator) | `2` | |
| New logic-bearing production leaves | `1` | `2` | |
| Existing logic-bearing production files | `2` | `3` | |
| Registration-only files | `0` | `3` | |
| Handwritten files total | `7` | `12` | |
| Effective production-line delta | `<=228` | `400` | projected `~197` |
| New leaf size — `cartographyParcels.js` | `<=195` | `250` | projected `~178` |
| Acceptance cases | `6` | `8` | |

Per-file caps are derived by measuring the preserved implementation with ESLint's own
counting (`max-lines`, `skipBlankLines` + `skipComments`); the method reproduces the
lane's `408` figure exactly on the preserved leaf. No cap is copied from `TC-3.md`.

## 4. Preflight — **DEVIATES from the parent packet: TC-3a's landing is the substrate**

`TC-3.md` §4 demanded that `cartographyWardsParcels.js` be absent and that the cartography
files be clean. Both expectations are obsolete: TC-3a consumed that file and modified
those. This preflight proves TC-3a's landing instead.

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor <TC-3a landing SHA> HEAD

# TC-3a's leaves exist with the exact symbols this packet consumes.
rg -n 'export function (generatedProvenance|premise|record|list|byCodepoint|planPoint|planPolygon|roundedMean|sourceDistricts)' \
  src/domain/townCartography/cartographyPlan.js
rg -n 'export function compileTownWardLayers' src/domain/townCartography/cartographyWards.js
rg -n 'MAXIMUM_WARDS|MAXIMUM_WARD_VERTICES' src/domain/townCartography/cartographyTuning.js
rg -n "parcels: \[\]" src/domain/townCartography/cartographySynthesis.js

# The parent's combined leaf is GONE — TC-3a consumed it.
test ! -e src/domain/townCartography/cartographyWardsParcels.js
test ! -e tests/domain/townCartographyWardsParcels.test.js
test ! -e src/domain/townCartography/cartographyParcels.js
test ! -e tests/domain/townCartographyParcels.test.js

# TC-3a's own targets are clean — this packet is not a repair of TC-3a.
git diff --quiet -- \
  src/domain/townCartography/cartographyPlan.js \
  src/domain/townCartography/cartographyWards.js \
  src/domain/townScene/cartographyContract.js \
  src/domain/townScene/compileTownSceneManifest.js \
  src/workers/townScene.worker.js \
  src/lib/townScene/townSceneExport.js
```

Expected: TC-3a's landing SHA is an ancestor; both TC-3a leaves exist with the named
exports; the parent's combined leaf and this packet's new files are absent; TC-3a's
non-shared targets are clean. **`cartographyTuning.js` and `cartographySynthesis.js` are
this packet's own targets and must also be clean** — they are shared with TC-3a and a
dirty one means TC-3a did not land cleanly. Foreign dirt elsewhere is reserved and
untouched. Any collision or material symbol drift makes this packet `STALE`.

Optional, and not a dependency: if the §0 snapshot still exists, diff the parcel half
against it to shorten the work. If it is gone, §6 is sufficient.

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| Shared narrowing kernel | `src/domain/townCartography/cartographyPlan.js` | `record`, `list`, `byCodepoint`, `planPoint`, `planPolygon`, `roundedMean`, `generatedProvenance`, `premise`, `sourceDistricts` | **Import these. Do not redeclare any of them.** |
| Ward authority | `src/domain/townCartography/cartographyWards.js` | `compileTownWardLayers` | Consume its `wards`; **forbidden edit** — its wards are already premise-checked convex with interior centroids. |
| Sole block writer | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | Call the parcel leaf once, after the ward leaf; keep `buildings: []`. |
| Canonical projected instances | `src/domain/townScene/sceneBuildingFabric.js` | `buildCompleteSceneBuildings` | Bind only rows with `generatedFabric !== true`; use `districtId`, `semanticId`, `anchorKey`, `footprint`. **Forbidden edit.** |
| Upstream assignment | `src/domain/townMap/institutionAssignment.js` | `assignInstitutionsToDistricts` | Already consumed upstream. **Forbidden edit and forbidden second call.** |
| State/cohesion reader | `src/domain/townCartography/cartographyMorphology.js` | `readTownMorphology` | Reuse its closed `placement`; create no class-specific resolver. |
| Schema/absence | `src/domain/townScene/cartographyContract.js` | `validateTownCartography` | Already accepts parcels at v2. **Forbidden edit** — this packet changes no schema. |
| Stable geometry/digest | `src/domain/townScene/sceneCompilePrimitives.js`, `stableScene.js` | `scenePolygonArea`, `scenePointInPolygon`, `sceneDigest`, `stableSceneStringify` | Reuse the exact integer predicates, ordering, and byte measurement. |
| Proof precedents | `tests/domain/townCartographyWards.test.js`, `tests/domain/townCartographyDeterminism.test.js` | TC-3a suites | Preserve the negative-control, restore-control, and draw-ledger shapes. |
| Corpus | `tests/fixtures/townMapFixtures.js` | `V2_GOLDEN_CONFIGS` | The twenty-row map corpus A5 runs against. |

Forbidden production edits: everything in `TC-3a.md` §5's forbidden list, plus
`cartographyPlan.js`, `cartographyWards.js`, `cartographyContract.js`,
`compileTownSceneManifest.js`, `townScene.worker.js`, `townSceneExport.js`, and every file
outside §7.

## 6. Exact contracts

### 6.1 New leaf — `cartographyParcels.js`

Create `src/domain/townCartography/cartographyParcels.js` with exactly these two public
functions:

```js
compileTownParcelLayers({ districts, wards, streets, buildings, digest, tier, placement }) -> {
  parcels,                 // CartographyParcelRow[], sorted by id
  institutionBindings,     // InstitutionParcelBinding[], synthesis-local, NOT persisted
  receipts: { parcelCount, bindingCount, candidateCount, bytes, byteBudget, withinBudget }
}

bindCanonicalInstitutionsToParcels({ buildings, wards, parcels, digest, placement }) -> Array<{
  institutionRef, anchorKey, parcelId, placement, decidedBy: 'prominence'
}>
```

Both functions are pure and total. They read no store, clock, party, host global, raw
seed, map edit, or settlement institution roster, hold no module-scope mutable state, and
perform **no PRNG draw of any kind** — every choice here is a digest, not a stream.

`streets` is TC-3a's **named** container; it is read only to build the byte receipt's
`streetNames` projection. `wards` are TC-3a's ward rows. `districts` are the raw canonical
districts, narrowed here through the shared `sourceDistricts` so the ward-to-centroid map
is derived by **the same total function** TC-3a used and cannot disagree with it:

```js
const centroids = new Map(
  sourceDistricts(districts).map((district) => [`ward:${district.id}`, district.centroid]),
);
```

A ward whose id is absent from that map is skipped for carving, exactly as the preserved
code does.

### 6.2 Parcel carving — verbatim

1. For each ward, use its canonical district centroid and every polygon edge. Split each
   edge into exactly `PARCEL_EDGE_DIVISIONS` integer segments with
   `round((a*(D-k)+b*k)/D)` for `k = 0..D` on each axis. Integer arithmetic only.
2. Each candidate is the triangle `[centroid, segmentStart, segmentEnd]`. Candidates whose
   `scenePolygonArea` is `0` are skipped. The anchor is the component-wise `roundedMean` of
   the three points.
3. The id is **exactly**:

   ```js
   `parcel:${ward.id}:e${String(edge).padStart(2, '0')}:s${segment}`
   ```

   **The two-digit zero-padded edge index is load-bearing and is a recorded
   non-architectural spelling.** It keeps codepoint id order equal to numeric edge order up
   to `MAXIMUM_WARD_VERTICES`. Do not "simplify" it to `e${edge}`, and do not pad the
   segment index.
4. The edge and segment indices ride **alongside** the row, not inside it, so the emitted
   parcel keeps exactly the contract's key set and the ordering rules never re-parse an id.

`CartographyParcelRow` is `{ id, wardId, polygon, anchor, provenance, decidedBy }` with
`provenance = generatedProvenance()` and `decidedBy = 'state'`. Parcels carry **no name**.

### 6.3 Candidate ordering — verbatim

Natural order is edge, then segment. Then, by `placement`:

- `district` — natural order, unchanged.
- `dispersed_orderly` — sort by segment, then edge.
- `clustered` — natural order **rotated** by the digest-derived ward offset. The offset is
  a recorded non-architectural spelling and must be exactly:

  ```js
  const stamp = Number.parseInt(sceneDigest({ digest, wardId }).slice(-8), 16);
  const offset = (Number.isFinite(stamp) ? stamp : 0) % candidates.length;
  return candidates.slice(offset).concat(candidates.slice(0, offset));
  ```

  Guard `candidates.length === 0` before the modulo. Do not change the `-8` slice width,
  the radix, or the key set `{ digest, wardId }`.
- `dispersed_chaotic` — sort by `sceneDigest({ digest, wardId, parcelId })`, then by id.
- **Any unknown placement falls back to `dispersed_orderly`.** The fallback is total: it is
  the default arm, not an enumerated case, so a placement vocabulary that grows later
  cannot fail open.

Take the first `cartographyBand(PARCELS_PER_WARD, tier)` candidates, never more than
available. Emit sorted by id. **No clipping, retries, jitter, overlap repair, or
street-face search is allowed** — containment is a theorem about a convex fan, not the
output of a rejection loop.

### 6.4 Institution binding, order, and budget — verbatim

1. Eligible source rows are `generatedFabric !== true` with string `semanticId`,
   `anchorKey`, and `districtId`. The matching ward is the one carrying that `districtId`.
   A row missing any of the three strings is skipped, not an error.
2. An eligible row whose district lowered to no ward, or whose ward carved no parcel, is a
   premise error — never a silent drop:

   ```
   townCartography TC-3 premise: canonical institution <ref> names district <id>, which lowered to no ward
   townCartography TC-3 premise: canonical institution <ref> lands in <wardId>, which carved no parcel
   ```

   **The `townCartography TC-3 premise:` prefix is shared with TC-3a and is pinned by
   existing tests. Do not re-prefix it to `TC-3b`.**
3. Sort that ward's parcels by area descending, then id. Building footprint area
   `>= INSTITUTION_PROMINENCE_AREA_PLAN2.large` may choose only the largest third; area
   `>= .medium` may choose the largest two thirds; smaller rows may choose all. Eligible
   counts round **up**, minimum one, so a ward with a single parcel still houses its
   cathedral.
4. Choose the eligible parcel with the lexicographically smallest

   ```js
   sceneDigest({ domain: 'carto:institution-parcel', digest, anchorKey,
                 institutionRef: semanticId, parcelId })
   ```

   then by parcel id. Collisions between institutions are allowed; TC-4 owns footprint
   packing. The choice is made **per anchor**, from a digest of the anchor itself, so it is
   independent of roster order and of how many other institutions exist: adding an
   institution can never reassign one already placed.
5. Return bindings sorted by `institutionRef`, then `anchorKey`. **Persist none of them**
   and let none of them reach the manifest block.
6. Exceeding `cartographyBand(MAXIMUM_INSTITUTION_BINDINGS, tier)` is a premise error.
7. Measure TC-3 bytes over `{ streetNames: [{id, name}], wards, parcels }` using
   `stableSceneStringify` + `TextEncoder`, where `streetNames` is `[...arterials, ...lanes]`
   projected to `{ id, name }`. `withinBudget` is `bytes <=` the exact tier band from
   `TC3_LAYER_MAX_BYTES`. Output over budget is a premise error; **do not raise the band.**

`'carto:institution-parcel'` is a digest **domain**, not a PRNG fork label. It is
single-colon-separated and must never spell `::`.

### 6.5 Exact tuning additions — parcel side only

Add only these frozen values to `TOWN_CARTOGRAPHY_TUNING`:

```js
PARCEL_EDGE_DIVISIONS: 3
PARCELS_PER_WARD: { thorp:2, hamlet:3, village:4, town:6, city:8, metropolis:12 }
MAXIMUM_INSTITUTION_BINDINGS: { thorp:8, hamlet:12, village:20, town:32, city:64, metropolis:96 }
INSTITUTION_PROMINENCE_AREA_PLAN2: { medium:150, large:400 }
TC3_LAYER_MAX_BYTES: { thorp:8000, hamlet:12000, village:18000,
                       town:32000, city:52000, metropolis:80000 }
```

`MAXIMUM_WARDS` and `MAXIMUM_WARD_VERTICES` are TC-3a's rows and already exist. A fourth
edge division is a **STOP**, not a tuning choice: it would need the general polygon
clipping this program does not own. Do not alter TC-2 or TC-3a tuning or any existing
budget. Never raise a cap to make a test pass.

### 6.6 Compiler mount

`compileTownCartography` calls the ward leaf first, then the parcel leaf **once**, and
emits:

```js
{
  schemaVersion: TOWN_CARTOGRAPHY_SCHEMA_VERSION,   // 2, unchanged by this packet
  streets: wardLayers.streets,
  wards: wardLayers.wards,
  parcels: parcelLayers.parcels,                    // was []
  buildings: [],                                    // TC-4 fills this
}
```

`institutionBindings` and every `receipts` field stay synthesis-local. **No new key
reaches the block**, and `TOWN_CARTOGRAPHY_BLOCK_KEYS` does not change.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Projected | Head­room | Instruction |
|---|---|---|---:|---:|---:|---|
| `CREATE` | `src/domain/townCartography/cartographyParcels.js` | the two exports in §6.1 | `195` | `~178` | `17` | Relocate the preserved carving, ordering, prominence, binding, and byte-receipt code; import the shared kernel from `cartographyPlan.js`; declare no helper it already exports. |
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `TOWN_CARTOGRAPHY_TUNING` | `+18` | `+12` | `6` | Add exactly the five parcel-side values in §6.5. |
| `MODIFY` | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | `+15` | `+10` | `5` | Call the parcel leaf once after the ward leaf; replace `parcels: []` with its rows; keep `buildings: []`. |
| `CREATE` | `tests/domain/townCartographyParcels.test.js` | B2, B3, B4, B5 | `n/a` | | | Rebuild the parcel half of the preserved test against the real compiler corpus; keep every restore control. |
| `TEST` | `tests/domain/townSceneCartography.test.js` | compiler-mount block | `n/a` | | | B1 — replace the `parcels: []` expectation with the containment and ward-reference assertions. |
| `TEST` | `tests/property/townCartographyDormancyGolden.test.js` | lit assertion only | `n/a` | | | B6 — expect non-empty parcels when lit; preserve every dark/base assertion. |
| `TEST` | `tests/domain/townCartographyDeterminism.test.js` | package and purity scans | `n/a` | | | B6 — name `cartographyParcels.js` in the package scan; pin the digest domain and the no-retry scan. |

Generated artifacts: `NONE`. Do not edit `tests/fixtures/town-cartography-dormancy-golden.json`,
`tests/fixtures/townMapFixtures.js`, `tests/build/townScene3dLazy.test.js`, or
`scripts/.size-baseline.json`.

## 8. Ordered coding sequence

0. Run §4 preflight. Stop on mismatch.
1. Re-run the §10 baseline command against TC-3a's landed tree and record its result.
2. Add the five parcel-side tuning values.
3. Implement the pure parcel leaf: carving, ordering, prominence, binding, byte receipt.
4. Wire `compileTownCartography` to call it once; emit its parcels.
5. Add B2–B5 in the new test file, then B1 and B6 in the three existing ones.
6. Run the §10 focused checks, then the wave-end gate.
7. Report exact deltas, counts, the per-tier byte figures, the dark-golden result, and
   `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| B1 | Real lit compile | the lit block now carries non-empty parcels, each naming a ward that exists in the same block; schemaVersion stays `2`; streets and wards keep their TC-3a names; `buildings` is still `[]` | `townSceneCartography.test.js` |
| B2 | Replay, order independence, placement | two compiles and reversed leaf inputs byte-identical; the five placement modes yield **four** distinct bounded selections (the unknown mode collapsing onto `dispersed_orderly` is the fourth-not-fifth proof); a changed digest moves the chaotic selection while ward ids stay put; `candidateCount > parcelCount` so the selection is not vacuous | `townCartographyParcels.test.js` |
| B3 | Geometry and bounds | across the twenty-row corpus: positive area, three vertices, anchor inside its ward, every vertex inside or on the ward boundary, sorted unique ids, per-ward cap honoured, nothing carved nothing; concave, outside-centroid, over-vertex-cap and over-ward-cap sources each throw the named premise error, each with a restore control proving the red measured the premise | `townCartographyParcels.test.js` |
| B4 | Binding | every eligible canonical institution binds exactly once into its own district's ward; prominence bands bite, with an anti-vacuity check that the band is narrower than the ward; a reversed roster binds identically and an added institution moves no existing one; an orphan district throws; no binding key appears in the serialized block | `townCartographyParcels.test.js` |
| B5 | Byte budget and domain separation | every corpus row measures under its exact per-tier `TC3_LAYER_MAX_BYTES`; the receipt is a real recomputable measurement of the emitted layers; the `carto:institution-parcel` domain yields distinct stamps and the chosen parcel is among the eligible ones | `townCartographyParcels.test.js` |
| B6 | Dormancy and purity | absent/false: no block, golden byte-identical, base manifest unchanged; lit: only parcels newly appear and `buildings` stays `[]`; the leaf carries no `while`/`do` retry loop; the package scan names `cartographyParcels.js`; no label spells `::` | `townCartographyDormancyGolden.test.js`, `townCartographyDeterminism.test.js` |

Do not add a seventh case or a speculative cross-product. Two acceptance slots are
deliberately unspent — spending them is a scope increase.

## 10. Verification commands

```sh
# Baseline and focused behavior; the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyParcels.test.js \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npx eslint src/domain/townCartography/cartographyParcels.js \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townCartography/cartographySynthesis.js \
  tests/domain/townCartographyParcels.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npm run typecheck:ratchet
npm run typecheck:domain:strict

# The bundle posture is TC-3a's guarantee; this packet must not move it.
npm run build
npm run verify:dist

npm run check:tail
```

Expected exit `0` for every command. Report actual test counts, and report the measured
`workerBytes + manifestCompilerBytes` — this packet adds no import to the bounded closure,
so the figure must be unchanged from TC-3a's receipt. The two corpus cases carry a
`120_000` ms per-test timeout in the preserved tests; keep it explicit on those tests
rather than raising any global timeout.

## 11. Recorded deviations from `TC-3.md`

1. **Preflight proves TC-3a's landing** instead of demanding clean cartography targets and
   an absent `cartographyWardsParcels.js` (§4).
2. **The leaf is `cartographyParcels.js`, not `cartographyWardsParcels.js`**, and it
   imports a shared narrowing kernel it does not own (§6.1).
3. **`compileTownWardParcelLayers` is gone**, replaced by TC-3a's `compileTownWardLayers`
   plus this packet's `compileTownParcelLayers`. `bindCanonicalInstitutionsToParcels`
   keeps its exact parent signature so TC-4 consumes the same decision.
4. **The leaf performs no PRNG draw.** The parent's leaf rooted a PRNG for naming; naming
   left with TC-3a, so this leaf uses `sceneDigest` only. The determinism suite's fork-label
   pin therefore names `carto:institution-parcel` as a **domain**, not a fork.
5. **Six acceptance cases, not eight** — the parent's A1/A2/A4/A7 and the naming halves of
   A3/A8 landed with TC-3a.
6. **Per-file caps are re-derived**, not inherited: the parent's `+45` allowance for
   `cartographySynthesis.js` and `+30` for `cartographyContract.js` covered work that is
   now split across two packets, and `cartographyContract.js` is not a target here at all.

## 12. Open items for the chair

- **C-1 — the verified base is unresolved.** The header and §4 carry
  `<TC-3a landing SHA>`. The chair pins the real SHA and only then moves this packet from
  `BLOCKED` to `READY`. Dispatching with the placeholder is invalid.
- **C-2 — snapshot durability.** §0's snapshot lives under `/private/tmp/claude-502/…`. §6
  is written to be sufficient without it, but the lane's work is materially shorter with
  it. Same recommendation as `TC-3a.md` O-4: copy it somewhere durable before dispatch.
- **C-3 — TC-3a may shift a §6 detail.** If TC-3a's implementation changes any shared
  spelling — the `premise` prefix, `sourceDistricts`' return shape, or `compileTownWardLayers`'
  return keys — this packet becomes `STALE` and needs revalidation against the landed code,
  not a coding-time adaptation.

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- the verified base is still the `<TC-3a landing SHA>` placeholder, or TC-3a's landing is
  not an ancestor of HEAD;
- a shared symbol from `cartographyPlan.js` or `cartographyWards.js` is missing or
  materially different from §5;
- any solution needs a second district graph, a street-face partitioner, general polygon
  clipping, retries, float or transcendental geometry, more than three edge divisions, or a
  PRNG draw;
- any solution edits or reinvokes `institutionAssignment`, reads `settlement.institutions`,
  persists the binding, adds cartography buildings, or introduces multiplicity or count
  state;
- a schema field, another flag, writer, persisted family, consumer, production leaf, or
  file outside §7 becomes necessary — **including any edit to `cartographyContract.js`**;
- a canonical fixture exceeds a cap, is non-convex, has an outside centroid, leaves an
  institution unbound, or exceeds the byte band — do not truncate and do not raise a
  ceiling;
- `workerBytes + manifestCompilerBytes` moves at all from TC-3a's receipt;
- dark manifest bytes or the dormancy JSON move, existing TC-2/TC-3a geometry, names, or
  draw counts move, or the base TownScene portion changes;
- any §7 per-file cap, the `228`-line total, the seven-file, or the six-case budget would
  be exceeded;
- work reaches TC-4..TC-8, UI, export, painter, pulse, persistence, promotion, tuning,
  soak, or an unrelated gate failure.

The STOP report names the smallest measured contradiction and proposes only the smallest
split. It does not edit this packet, weaken a test, raise a budget, or repair around it.

- **Manifest note (chair, 2026-08-10):** the shared-file rows (tuning, synthesis, the
  three TEST files) are omitted from PACKET_MANIFEST.json while TC-3a holds those paths —
  the validator forbids duplicate change paths across packets. They re-enter the JSON
  entry at the C-1 unblock revalidation. This packet document §7 remains the complete
  manifest of record.
