# Town Cartography / TC-3a — names, wards, and the naming-pool injection

- **Status:** `LANDED`
- **Landed:** `5066c34b` (2026-08-10; implementing lane + manager re-earned greens — focused 60/60, verify:dist 50/50 files / 396/396 tests, bounded pair 373,321 B < 400,000, ratchets 175/175 + 1140/1140)
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `6da84cfdf9eb533986d34e9a0f18a32b7d592736`
- **Base note:** `2c810d167d016302e641fc9cfe74fff57475b14e` — the parent packet's base — is
  still an ancestor (verified 2026-08-09); 17 commits landed since, none of them in
  `src/domain/townCartography/`, `src/domain/townScene/`, `src/workers/`, or
  `src/lib/townScene/`.
- **Last revalidated:** `2026-08-10` (chair promotion; §12 items resolved below)
- **Depends on:** TC-0..TC-2 at `6e96e259`, repaired by `0dcc3b9d`; supersedes the wards/names half of `TC-3.md`
- **Collision group:** `town-cartography-contract-and-compiler`; serialize against every other TC wave
- **Commit authority:** edits only; manager commits
- **Baseline posture:** the parent TC-3 implementation is **green** in the working tree
  (`63/63` focused, 2026-08-09) and is **preserved as the raw material for this packet**.
  It STOPped on three measured budget breaches, not on behavior. See §0.

> Chair promotion 2026-08-10: every §12 item is RESOLVED inline below (rulings in the
> session's pa-chair-rulings.md and the F-SURVEY-1 row). The coordinator, not the coding
> agent, changes status.

## 0. Why this packet exists, and what it starts from

`TC-3.md` was dispatched, implemented, and reached green — then STOPped on three
measured contradictions, all of them size, none of them behavior:

| Breach | Measured | Limit |
|---|---:|---:|
| New leaf `cartographyWardsParcels.js` | `408` effective lines | `250` |
| Effective production-line delta | `+454` | `355` |
| `townScene.worker-*.js` + `compileTownSceneManifest-*.js` | `416,577 B` | `400,000 B` |

The third breach has a single cause: `cartographyWardsParcels.js` statically imports
`NAMING_DATA`, and the worker build has no `manualChunks` rule, so the 68,656-byte naming
table landed **inside** the bounded manifest-compiler chunk. Measured at the dist tree
built from the preserved work (`dist/` built 2026-08-09 21:52, after the leaf was written
21:51):

```
dist/assets/townScene.worker-DQjn0DD2.js          77,289 B
dist/assets/compileTownSceneManifest-NWy1ervo.js 339,288 B   (contains `femaleNames`)
                                                 ---------
                                    measured sum 416,577 B   against < 400,000
```

`416,577 − 40,241 = 376,336`, which is exactly the implementing lane's A/B base. The
budget does not move; the naming edge does.

**THE PRESERVED WORK IS THIS PACKET'S STARTING MATERIAL.** The implementing lane
**splits and rewires** the existing green files. It does not rewrite them from scratch,
and it does not re-derive behavior the preserved code already settled. Every contract in
§6 is either verbatim from that code or a named, reasoned change to it.

## 1. Reconciled authority

1. `docs/DESIGN_TOWN_CARTOGRAPHY.md` §1 is controlling: cartography is a synthesis stage
   inside the existing `TownSceneManifest`, never a parallel town generator.
2. `TC-3.md` §1's five resolved contradictions carry over **verbatim and unreopened**:
   no second street-face topology; schema v2 bumps only the nested cartography version;
   `institutionAssignment` is already consumed upstream and is a forbidden edit; A-8
   multiplicity is TC-4; `footprint ⊂ parcel` begins at TC-4/TC-5.
3. **CR-TC3A-1 (chair ruling, 2026-08-09)** decides the naming-pool substrate: the pools
   reach the synchronous compiler by **injection across the existing lazy/async boundary
   above it**, on the **lit path only**; the `400,000 B` budget does not move; copying the
   pools is forbidden and `src/data/namingData.js` stays their canonical home.
4. The parcel half of `TC-3.md` — carving, ordering, prominence binding, the byte band —
   is **not in this packet**. It is `TC-3b.md`, which depends on this packet landing.

The implementer does not reopen these rulings by rereading design prose.

## 2. Outcome and non-goals

**Observable result:** a lit TownScene compile emits a schema-v2 cartography block whose
streets and wards all carry display names, with exactly one ward per canonical district;
`parcels` stays `[]` for one more wave; `buildings` stays `[]`. The naming pools are
loaded by a dynamic import above the compiler and never enter the bounded chunk pair.

**Definition of done:** the real compiler emits named streets and lowered wards; the block
validates at v2; the lit path replays byte-identically; the dark path is byte-identical to
the measured golden **and performs zero naming work and loads no pools**; and
`workerBytes + manifestCompilerBytes` measures under `400,000` with `VERIFY_DIST=1`.

In scope:

1. Named street and ward records, and ward lowering from canonical districts.
2. Schema v2 with required `name` on streets and wards.
3. The naming-pool injection seam across the two existing async edges above the compiler.
4. Contract, determinism, dormancy, and bundle-posture prevention guards.

Explicit non-goals: parcels, carving, candidate ordering, institution binding, and the
TC-3 byte band (all `TC-3b`); TC-4 buildings or multiplicity; TC-5 painter/labels/PNG;
TC-6 joins; TC-7 reactivity; TC-8 exports/promotion; user-authored ward geometry; map-edit
verbs; persistence/migrations; polygon clipping; visual tuning/soak; new UI; adjacent
cleanup; full-gate repairs unrelated to these eight acceptance cases.

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | |
| New persisted record families / writers | `0 / 0` | `1 / —` | |
| Existing transient writer | `1` (`compileTownCartography`) | `1` | |
| Feature flags / user-facing surfaces | `1 existing / 0` | `1 / 1` | |
| Direct production consumers | `2` (compiler return, validator) | `2` | |
| New logic-bearing production leaves | `2` | `2` | at cap |
| Existing logic-bearing production files | **`4`** | `3` | **OVERRIDE — §12 O-1** |
| Injection-only wiring files | `2` | `3` | worker + export menu path |
| Handwritten files total | **`12`** | `12` | at cap — **§12 O-2** |
| Effective production-line delta | `<=356` | `400` | projected `~302` |
| New leaf size — `cartographyPlan.js` | `<=75` | `250` | projected `~58` |
| New leaf size — `cartographyWards.js` | `<=205` | `250` | projected `~187` |
| Acceptance cases | `8` | `8` | at cap |

Every per-file cap in §7 is derived by measuring the preserved implementation with
ESLint's own counting rule (`max-lines` with `skipBlankLines` + `skipComments`); the
method reproduces the lane's `408` figure exactly on the preserved leaf. Projections and
headroom are stated per row in §7. Exceeding any number is a STOP and a further split.

## 4. Preflight — **DEVIATES from the parent packet: targets are EXPECTED DIRTY**

`TC-3.md` §4 demanded clean targets and absent new files. **This packet inverts that**,
because the preserved TC-3 implementation is this packet's raw material. A clean tree here
means the raw material was destroyed and the packet is `STALE`.

Run before editing:

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 6da84cfdc0 HEAD

# EXPECT exactly these eight preserved paths, in exactly these states.
git status --porcelain -- \
  src/domain/townCartography/cartographySynthesis.js \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townScene/cartographyContract.js \
  src/domain/townCartography/cartographyWardsParcels.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyWardsParcels.test.js \
  tests/property/townCartographyDormancyGolden.test.js
```

Expected, exactly:

```
 M src/domain/townCartography/cartographySynthesis.js
 M src/domain/townCartography/cartographyTuning.js
 M src/domain/townScene/cartographyContract.js
?? src/domain/townCartography/cartographyWardsParcels.js
 M tests/domain/townCartographyDeterminism.test.js
 M tests/domain/townSceneCartography.test.js
?? tests/domain/townCartographyWardsParcels.test.js
 M tests/property/townCartographyDormancyGolden.test.js
```

**The two `??` files are untracked green work. `git` cannot restore them.** Before the
first edit, prove the preservation snapshot is byte-identical, and stop if it is not:

```sh
SNAP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/resume-snapshots/20260809T215509/build
cmp "$SNAP/src/domain/townCartography/cartographyWardsParcels.js" \
    src/domain/townCartography/cartographyWardsParcels.js
cmp "$SNAP/tests/domain/townCartographyWardsParcels.test.js" \
    tests/domain/townCartographyWardsParcels.test.js
```

Both `cmp` calls were verified identical by the packet author on 2026-08-09. If either
fails or the snapshot is gone, the DURABLE fallback is the preservation ref
`refs/preserved/tc3-original-stop-work` (`789b3770`): restore a file's bytes with
`git show refs/preserved/tc3-original-stop-work:<path> > <path>` (plain redirection —
never `git checkout`), re-run the `cmp` against what the ref holds, and proceed. If the
ref is also gone, **STOP** — do not delete or rename the untracked files.

Then prove the live symbols:

```sh
rg -n 'TOWN_CARTOGRAPHY_SCHEMA_VERSION|validateStreetRows|validateTownCartography|townCartographyActive' \
  src/domain/townScene/cartographyContract.js
rg -n 'compileTownSceneManifestFromAuthorizedInput|compileTownSceneManifest|compileTownCartography' \
  src/domain/townScene/compileTownSceneManifest.js
rg -n 'loadManifestCompiler|manifestCompilerPromise|self.onmessage' src/workers/townScene.worker.js
rg -n 'downloadTownSceneArtifact|compileTownSceneManifest' src/lib/townScene/townSceneExport.js
rg -n 'NAMING_DATA' src/domain/ src/lib/ src/workers/
```

The last command must report **exactly one** hit today —
`src/domain/townCartography/cartographyWardsParcels.js` — and **zero** when this packet is
done.

**Foreign dirt is expected and is reserved.** This is a live shared tree. During packet
authoring alone (about twenty minutes on 2026-08-09) a concurrent lane dirtied four more
files — `scripts/check-observed-shape-readers.mjs`, `scripts/lib/reader-shape-scan.mjs`,
`tests/lint/observedShapeSentinel.test.js`, `tests/lint/readerShapeResolver.test.js` —
none of them this packet's substrate. **This is why the status command above is
path-scoped: run it exactly as written.** A bare `git status --porcelain` will show other
lanes' work and must not be read as a preflight failure. Never stage, restore, revert, or
attribute a file outside §7. Any collision *within* the eight paths, or material symbol
drift, makes this packet `STALE`.

## 5. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| Canonical district authority | `src/domain/townScene/compileTownSceneManifest.js` | `buildDistricts` | Read `id/name/category/footprint/centroid/densityPermille`; do not repartition. |
| Compiler entry (authorized) | `src/domain/townScene/compileTownSceneManifest.js` | `compileTownSceneManifestFromAuthorizedInput` | Gains a second `options` parameter; stays synchronous. |
| Compiler entry (compat) | `src/domain/townScene/compileTownSceneManifest.js` | `compileTownSceneManifest` | Gains a second `options` parameter; stays synchronous. |
| Cartography mount | `src/domain/townScene/compileTownSceneManifest.js` | the `input.cartography?.enabled === true` ternary | The sole seam; keep the by-reference dark path. |
| Sole block writer | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | Only caller is the mount above; gains a third **options-object** parameter. |
| Schema/absence | `src/domain/townScene/cartographyContract.js` | `TOWN_CARTOGRAPHY_SCHEMA_VERSION`, `validateStreetRows`, `validateTownCartography`, `townCartographyActive`, `attachTownCartographyLayers` | Extend nested rows; preserve the strict-true gate and by-reference dark path. |
| Live async edge (viewer) | `src/workers/townScene.worker.js` | `loadManifestCompiler`, `self.onmessage` | Already `async` and already `await import(...)`s the compiler. The injection site. |
| Live async edge (export) | `src/lib/townScene/townSceneExport.js` | `downloadTownSceneArtifact` | Already `async`. The second injection site. |
| Naming authority | `src/data/namingData.js` | `NAMING_DATA` | Dynamically imported by the two edges above. **Never** statically imported under `src/domain/`. |
| Naming entropy | `src/kernel/prng.js` | `createPRNG`, `fork`, `pick` | Root once at the manifest digest; two named per-feature forks, two draws each. |
| Stable geometry/digest | `src/domain/townScene/sceneCompilePrimitives.js`, `stableScene.js` | `scenePointInPolygon`, `sceneDigest`, `stableSceneStringify` | Reuse the exact integer predicates and ordering. |
| Envelope (read-only here) | `src/domain/townScene/sceneCompileInput.js` | `TownSceneCompileInput`, `TOP_LEVEL_KEYS`, `prepareTownSceneCompileInputForSynchronousCompiler` | **Forbidden edit.** See §6 "why not the envelope". |
| Bundle posture guard | `tests/build/townScene3dLazy.test.js` | the bounded-payload `it` | **Run, never edit.** Owns the `400,000` assertion. |
| Proof precedents | `tests/domain/townSceneCartography.test.js`, `tests/domain/townCartographyDeterminism.test.js` | existing TC-1/2 suites | Preserve negative-control, seed-family, purity-scan, draw-ledger shapes. |

Forbidden production edits: `sceneCompileInput.js`, `manifestContract.js`,
`institutionAssignment.js`, `townMapModel.js`, `sceneBuildingFabric.js`,
`buildDistricts`' partitioning, `vite.config.js`, `eslint.config.js`,
`scripts/.size-baseline.json`, simulation rules, state/store/UI/painter/export-format
files, design docs, and every file outside §7.

## 6. Exact contracts

### 6.1 CR-TC3A-1 — the naming-pool injection

**The boundary, as measured.** Two production call chains reach the synchronous compiler,
and each already crosses an async edge immediately above it:

```
LIVE VIEWER
  src/components/townMap/SettlementMapPresentation.jsx
    lazy(() => import('./scene3d/SettlementScene3D.jsx'))          [React.lazy chunk]
  → src/lib/townScene/townSceneWorkerClient.js
    new Worker(new URL('../../workers/townScene.worker.js', import.meta.url))
  → src/workers/townScene.worker.js  ::  self.onmessage (async)
    await import('../domain/townScene/compileTownSceneManifest.js')   ◄── INJECT HERE
  → compileTownSceneManifestFromAuthorizedInput(packet.compileInput)   [synchronous]

EXPORT
  src/components/townMap/SettlementMapExportMenu.jsx
    await import('../../lib/townScene/townSceneExport.js')
  → src/lib/townScene/townSceneExport.js :: downloadTownSceneArtifact (async) ◄── INJECT HERE
  → compileTownSceneManifest({...})                                    [synchronous]
```

Both injection points already exist, are already `async`, and already sit directly above a
synchronous compile call. Nothing new is created; a second `await import(...)` joins one
that is already there.

**Compiler signature.** Both entries gain a second parameter. Both stay synchronous.

```js
compileTownSceneManifestFromAuthorizedInput(input, options = {}) -> TownSceneManifest
compileTownSceneManifest(input = {}, options = {})               -> TownSceneManifest

// options
{ namingPools?: unknown }
```

- `namingPools` is the canonical `NAMING_DATA` object, passed **by reference**. It is
  never cloned, never mutated, never serialized, never digested, and never stored.
- **REQUIRED when lit.** When `input.cartography?.enabled === true` and `options.namingPools`
  is `null` or `undefined`, throw, before any cartography work:

  ```js
  throw new TypeError(
    'townScene compile premise: cartography is lit but namingPools was not injected; '
    + 'the caller above the lazy boundary must supply NAMING_DATA from src/data/namingData.js',
  );
  ```

  The string is exact and is pinned by A5. `TypeError` (not the leaf's `RangeError`)
  because this is a caller-contract breach at the compiler seam, not a domain range breach.
- **IGNORED when dark.** When the `cartography` key is absent or not strictly `true`,
  `options.namingPools` is not read, not validated, and not touched. The dark path returns
  `baseManifest` by reference exactly as today and is byte-identical to the golden.
- `options` is an object, never a positional scalar, at every hop.

**Threading.** The mount passes it down through one options object:

```js
const cartography = input.cartography?.enabled === true
  ? compileTownCartography(baseManifest, settlement, { namingPools: options.namingPools })
  : null;
```

`compileTownCartography(manifest, settlement, options = {})` — the third parameter is an
**options object**, never a bare value. It forwards `options.namingPools` into
`compileTownWardLayers`. It adds no other key and reads no other key.

**Injection site 1 — `src/workers/townScene.worker.js`.** Memoize exactly as
`manifestCompilerPromise` is memoized, and gate on the already-authorized bit:

```js
let namingPoolsPromise = null;

/** Lit-path only: the pools are a separate chunk and the dark path never fetches it. */
function loadNamingPools() {
  namingPoolsPromise ||= import('../data/namingData.js');
  return namingPoolsPromise;
}
```

and inside the existing `try`, after `loadManifestCompiler()` resolves and before the
compile call:

```js
const namingPools = packet.compileInput?.cartography?.enabled === true
  ? (await loadNamingPools()).NAMING_DATA
  : null;
if (!current(generationId)) return;
const manifest = compileTownSceneManifestFromAuthorizedInput(
  packet.compileInput,
  { namingPools },
);
```

The specifier is a **bare string literal** — no template, no variable, no computed path —
so Rollup can split it. The module-scope promise is worker-entry memoization, not domain
state; it lives outside every `src/domain/townCartography/` purity scan's package.

**Injection site 2 — `src/lib/townScene/townSceneExport.js`.** Read the flag through the
**same** predicate the prepare seam uses, so the two cannot disagree:

```js
import { townCartographyActive } from '../../domain/townScene/cartographyContract.js';
// …inside downloadTownSceneArtifact, before the compile:
const namingPools = townCartographyActive(worldState?.simulationRules)
  ? (await import('../../data/namingData.js')).NAMING_DATA
  : null;
const manifest = compileTownSceneManifest(
  { settlement, mapEdits, worldState, regionalGraph, audience },
  { namingPools },
);
```

Both sites are lit-gated. Neither loads the pools on the dark path.

**Why not the compile-input envelope.** Refuted by live code, not by preference:
`sceneCompileInput.js` validates `sameKeys(Object.keys(value), TOP_LEVEL_KEYS)` and seals
the envelope with `inputDigest = sceneDigest(compileInputCore(value))`. A `namingPools`
field would (a) require changing the frozen top-level key set, (b) enter the digest seal,
(c) push 68,656 bytes of table across every lit `postMessage`, and (d) still need a
synchronous loader inside `prepareTownSceneCompileInput*`, which is exactly the static
import this packet exists to remove. **Editing `sceneCompileInput.js` is forbidden.**

**Bundle claim, and why it is achievable.** All four legs verified against the live tree
and the built artifact:

1. `src/data/namingData.js` has **zero** imports of its own — a pure leaf table
   (`68,656` raw bytes). Removing one edge removes its whole cost.
2. It reaches the measured pair by **exactly one** edge:
   `compileTownSceneManifest.js` → `cartographySynthesis.js` →
   `cartographyWardsParcels.js` → `namingData.js`. The only other production importers
   (`src/generators/npcGenerator.js`, `src/domain/worldPulse/settlementLifecycleKernel.js`)
   are in the `engine`/main graphs, not the worker graph.
3. A dynamic import inside the worker graph **already** produces its own chunk: the
   measured `compileTownSceneManifest-*.js` chunk exists precisely because
   `loadManifestCompiler()` does `await import(...)`. `vite.config.js` states the mechanism
   ("ES output lets the TownScene worker code-split its canonical-map vocabulary"). The new
   `namingData-*.js` chunk matches neither `SCENE_WORKER_RE` nor `MANIFEST_COMPILER_RE` and
   is therefore **uncounted** by the budget assertion.
4. On the main graph the export site costs nothing new: `vite.config.js` `manualChunks`
   routes every `/src/data/` module to `data`/`data-lazy`, and
   `dist/assets/data-lazy-*.js` **already contains** the naming pools.

CONFIRMED by artifact inspection: `dist/assets/compileTownSceneManifest-NWy1ervo.js`
contains `femaleNames`; `dist/assets/townScene.worker-DQjn0DD2.js` does not.

**Posture.** `workerBytes + manifestCompilerBytes` must measure `< 400,000`. Expected
after this packet: `376,336 B` (`416,577 − 40,241`). The budget literal in
`tests/build/townScene3dLazy.test.js` **does not move**, and that file is not edited.
A measurement at or above `400,000` is a STOP, never a raised ceiling.

### 6.2 Schema v2 and absence

Carried over verbatim from `TC-3.md` §6, with parcels removed:

- Set `TOWN_CARTOGRAPHY_SCHEMA_VERSION = 2`. Do not change `TOWN_SCENE_SCHEMA_VERSION`,
  block keys, street-container keys, or the flag spelling.
- Add required `name` to `CartographyStreet` and `CartographyWard`. A valid name is a
  string equal to its trim, `1..120` UTF-16 code units, with no C0 control character and
  no DEL (`charCodeAt < 32 || === 127`). Existing recursive raw-colour rejection still
  applies. **Parcels get no name**, in this packet or in TC-3b.
- Validator v2 rejects a missing, blank, whitespace-only, untrimmed, control-bearing,
  overlong, or non-string name, and rejects schema `1`.
- Absent/false flag: no `cartography` key, no naming draws, no pool load. True: the
  complete v2 block. `null` cartography remains invalid. A lit valid base with zero
  districts emits `wards: []`. `parcels` and `buildings` stay `[]`.
- There is no migration: TownScene manifests are derived artifacts. Do not add v1
  compatibility, saved state, import handling, or a second schema key.

### 6.3 New leaf — `cartographyPlan.js` (the shared narrowing kernel)

Create `src/domain/townCartography/cartographyPlan.js` exporting exactly these pure
functions, lifted **verbatim** from the preserved leaf's helper block:

```js
generatedProvenance() -> { kind: 'generated', ref: null }
premise(message: string) -> RangeError          // message: `townCartography TC-3 premise: ${message}`
record(value: unknown) -> Record<string, unknown>
list(value: unknown) -> unknown[]
byCodepoint(a: string, b: string) -> -1 | 0 | 1
planPoint(value: unknown) -> [number, number] | null      // integer pairs only
planPolygon(value: unknown) -> Array<[number, number]>
roundedMean(values: number[]) -> number
sourceDistricts(districts: unknown) -> SourceDistrict[]   // narrowed + sorted by raw-codepoint id
```

`SourceDistrict` is `{ id, category, footprint, centroid, densityPermille }`, with
`densityPermille` clamped to `0..1000` and defaulted to `500` when absent or non-integer,
exactly as the preserved code does. Rows without a string id or a valid integer centroid
are dropped.

**The `premise` prefix stays `townCartography TC-3 premise:`** — not `TC-3a`. TC-3a and
TC-3b are one behavior family split for budget, the preserved tests pin this exact
prefix, and TC-3b reuses it. Do not "correct" it.

This module imports nothing from the repository. It exists so TC-3b can reuse the same
narrowing without importing from `cartographyWards.js` and without redeclaring it.

### 6.4 New leaf — `cartographyWards.js`

Create `src/domain/townCartography/cartographyWards.js` with exactly one public function:

```js
compileTownWardLayers({ districts, streets, settlement, digest, tier, namingPools }) -> {
  streets,                       // the TC-2 container with `name` added to every row
  wards,                         // CartographyWardRow[]
  receipts: { wardCount, streetNameCount, wardNameCount }
}
```

Pure and total. It reads no store, clock, party, host global, raw seed, map edit, or
settlement institution roster, and holds no module-scope mutable state.

**Naming (verbatim from `TC-3.md` §6, with the pools injected and one hole closed).**

1. Resolve culture from `settlement.culturalIdentity.key`, then `settlement.config.culture`;
   absent means `germanic`.
2. A known key uses that entry of the **injected** `namingPools`. `mixed` or an unknown
   explicit key uses prefixes/suffixes flattened in codepoint-sorted culture-key order.
   Empty/non-string entries are ignored; the Germanic non-empty pools are the final
   fallback.
3. **NEW — the empty-pool hole the preserved code leaves open.** If, after culture,
   flatten, and Germanic fallback, either resolved list is still empty, throw

   ```
   townCartography TC-3 premise: the injected naming pools carry no usable prefixes or suffixes
   ```

   Rationale, and a deliberate change from the preserved implementation: with empty pools
   the preserved `drawName` composes `' Way'` — a leading-space stem — which the v2
   validator then rejects as untrimmed. That turns a bad injection into an obscure
   validation failure three layers away. A premise error names the real cause. This is a
   recorded deviation (§11).
4. Root at `createPRNG(String(digest))`. Each feature gets an independent fork:
   `carto:names:street:<street-id>` or `carto:names:ward:<ward-id>`. `::` is forbidden in
   any label. Each non-empty feature consumes **exactly two** draws: one prefix, one suffix.
5. Compose `<prefix><suffix> Way` for arterials, `<prefix><suffix> Lane` for lanes,
   `<prefix><suffix> Ward` for wards. Process each family by codepoint-sorted id. Within a
   family, duplicate display names receive ` 2`, ` 3`, … in that order. Names never
   participate in ids or geometry.

**Ward lowering and node assignment (verbatim from `TC-3.md` §6).**

1. Emit exactly one ward per `sourceDistricts` row, in that order:
   `id = ward:<district.id>`, generated name, integer `footprint` copied verbatim,
   `districtId = district.id`, `provenance = { kind: 'generated', ref: null }`, and
   `tonePermille` = the narrowed `densityPermille`.
2. `kind` is the identical district category when present in
   `TOWN_CARTOGRAPHY_WARD_KINDS`, otherwise `other`. Add no duplicate kind table.
3. Premise checks, each throwing `premise(...)` and never repairing: more than
   `MAXIMUM_WARD_VERTICES` footprint vertices; a non-convex footprint (integer cross-product
   sign test only — no float predicate); a centroid outside its own polygon; more source
   districts than `cartographyBand(MAXIMUM_WARDS, tier)`.
4. Compute the rounded mean of the final vertex of every arterial polyline. The
   codepoint-first ward containing it is the sole `lynchElement: 'node'`,
   `decidedBy: 'lynch'`. If none contains it, choose minimum squared centroid distance,
   then id. With no arterial or no ward, there is no node. Every other ward is
   `lynchElement: 'district'`, `decidedBy: 'state'`.

**What this leaf does NOT do:** no carving, no candidate ordering, no parcel row, no
institution binding, no byte measurement, no `sceneDigest` call, no `scenePolygonArea`
call. Those are TC-3b. It must not import `sceneDigest` or `scenePolygonArea`.

### 6.5 Exact tuning additions — ward side only

Add only these frozen values to `TOWN_CARTOGRAPHY_TUNING`:

```js
MAXIMUM_WARDS: { thorp:8, hamlet:10, village:12, town:16, city:24, metropolis:48 }
MAXIMUM_WARD_VERTICES: 8
```

`PARCEL_EDGE_DIVISIONS`, `PARCELS_PER_WARD`, `MAXIMUM_INSTITUTION_BINDINGS`,
`INSTITUTION_PROMINENCE_AREA_PLAN2`, and `TC3_LAYER_MAX_BYTES` are **TC-3b's rows** and
must not be added here — a constant with no reader is dead tuning. Do not alter TC-2
tuning or any existing budget. Never raise a cap to make a test pass.

### 6.6 Compiler mount

`compileTownCartography` calls `compileTownWardLayers` **once** and emits:

```js
{
  schemaVersion: TOWN_CARTOGRAPHY_SCHEMA_VERSION,   // 2
  streets: layers.streets,                          // named
  wards: layers.wards,
  parcels: [],                                      // TC-3b fills this
  buildings: [],                                    // TC-4 fills this
}
```

The TC-2 street container is built exactly as today (arterials/lanes mapped through
`manifestStreet` and sorted by id, plus `gateRefs`/`bridgeRefs`) and handed to the leaf,
which returns the same container with `name` added to each arterial and lane row. Street
row order is decided by the existing sort, not by the naming pass.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Projected | Head­room | Instruction |
|---|---|---|---:|---:|---:|---|
| `CREATE` | `src/domain/townCartography/cartographyPlan.js` | the nine exports in §6.3 | `75` | `~58` | `17` | Lift the preserved leaf's helper block and `sourceDistricts` verbatim; export them; import nothing. |
| `CREATE` | `src/domain/townCartography/cartographyWards.js` | `compileTownWardLayers` | `205` | `~187` | `18` | Move the preserved naming, convexity, lowering, and node-marking code here; take `namingPools` as input; drop every parcel concern. |
| `MODIFY` | `src/domain/townCartography/cartographyTuning.js` | `TOWN_CARTOGRAPHY_TUNING` | `+8` | `+4` | `4` | Add exactly the two ward-side values in §6.5. |
| `MODIFY` | `src/domain/townCartography/cartographySynthesis.js` | `compileTownCartography` | `+20` | `+15` | `5` | Hoist the street container, take the options object, call the ward leaf once, keep `parcels`/`buildings` empty. |
| `MODIFY` | `src/domain/townScene/cartographyContract.js` | version, typedefs, `validateStreetRows`, `validateTownCartography` | `+20` | `+18` | `2` | Require bounded names and schema v2; change no outer key set. |
| `MODIFY` | `src/domain/townScene/compileTownSceneManifest.js` | both exported entries, the S-CARTO mount | `+12` | `+8` | `4` | Add the `options` parameter, the lit-but-absent premise, and the one threading hop. **Un-forbidden by §12 O-1.** |
| `MODIFY` | `src/workers/townScene.worker.js` | `loadNamingPools`, `self.onmessage` | `+8` | `+6` | `2` | Add the memoized lit-gated dynamic import and pass `{ namingPools }`. |
| `MODIFY` | `src/lib/townScene/townSceneExport.js` | `downloadTownSceneArtifact` | `+8` | `+6` | `2` | Add the lit-gated dynamic import and pass `{ namingPools }`. |
| `CREATE` | `tests/domain/townCartographyWards.test.js` | A3, A4, A5 | `n/a` | | | Rename the preserved untracked test here and keep only its ward/naming cases; add the injection case. |
| `TEST` | `tests/domain/townSceneCartography.test.js` | schema block, compiler mount | `n/a` | | | A1/A2 — names and v2 negatives; keep `parcels`/`buildings` empty. |
| `TEST` | `tests/domain/townCartographyDeterminism.test.js` | fork and purity scans | `n/a` | | | A7 — pin both `carto:names:*` families and both new leaves in the package scans. |
| `TEST` | `tests/property/townCartographyDormancyGolden.test.js` | lit assertion only | `n/a` | | | A6 — expect wards when lit; preserve every dark/base assertion. |

**Deletions.** `src/domain/townCartography/cartographyWardsParcels.js` and
`tests/domain/townCartographyWardsParcels.test.js` are consumed by this packet: their ward
half becomes the two new leaves and the renamed test, and their parcel half is fully
specified in `TC-3b.md` §6 and preserved at the §4 snapshot. Remove them **only after**
both §4 `cmp` calls pass.

Generated artifacts: `NONE`. Do not edit `tests/fixtures/town-cartography-dormancy-golden.json`,
`tests/build/townScene3dLazy.test.js`, `vite.config.js`, or `scripts/.size-baseline.json`.

## 8. Ordered coding sequence

0. Run §4 preflight, including both `cmp` calls. Stop on any mismatch.
1. Record the baseline: run the §10 focused command against the preserved tree and record
   its result. Then run `npm run build && npm run verify:dist` and record the measured
   `workerBytes + manifestCompilerBytes`. **Expect it RED at `416,577`.** This red is the
   packet's premise; a green here means the preserved work is not present and the packet is
   `STALE`.
2. Create `cartographyPlan.js` from the preserved helper block.
3. Create `cartographyWards.js`; take `namingPools` as input; add the empty-pool premise.
4. Add the two ward-side tuning values.
5. Extend `cartographyContract.js` to v2 names.
6. Wire `compileTownCartography` to the ward leaf; emit `parcels: []`.
7. Add the `options` parameter and the lit-but-absent premise to both compiler entries.
8. Wire the two injection sites; delete the preserved leaf and its test.
9. Split and extend the tests (A1–A7).
10. Run the §10 focused checks, then `npm run build && npm run verify:dist` for A8, then
    the wave-end gate.
11. Report exact deltas, counts, both byte measurements, the dark-golden result, and
    `deviations: NONE` or a STOP.

Do not start by changing a golden, baseline, budget, or persisted shape.

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| A1 | Real lit compile | v2 validates; every street and ward carries a trimmed name matching ` Way`/` Lane`/` Ward`(` N`)?; one ward per canonical district in district order; no name appears inside an id; `parcels` and `buildings` are `[]` | `townSceneCartography.test.js` |
| A2 | Schema/name negatives | schemaVersion `1`, `3`, `'2'`, `null` red with `must be 2`; missing, blank, whitespace-only, untrimmed, C0, newline, DEL, overlong, and non-string names red on **both** streets and wards; the untouched v2 block passes as the restore control | `townSceneCartography.test.js` |
| A3 | Replay and order independence | two compiles byte-identical; reversed district and street inputs byte-identical; a changed digest **moves** the names while ward ids stay put | `townCartographyWards.test.js` |
| A4 | One law and audience | ward id, kind, polygon, tone, and district ref all equal the same manifest's projected districts; exactly one `lynchElement: 'node'` when arterials exist; player ward ids are a subset of DM ward ids | `townCartographyWards.test.js` |
| A5 | **Injection (CR-TC3A-1)** | lit with no pools throws the exact §6.1 `TypeError`; lit with pools names everything; **dark ignores the pools entirely** (passing them changes nothing, omitting them throws nothing); both edge sources carry a lit-gated `await import` of `namingData.js`; **no module under `src/domain/` or `src/lib/` statically imports `NAMING_DATA`** | `townCartographyWards.test.js` |
| A6 | Dormancy regression | absent/false: no block, golden byte-identical, base manifest unchanged; lit: only the additive block moves, wards non-empty, `parcels`/`buildings` still `[]` | `townCartographyDormancyGolden.test.js` |
| A7 | Purity and draw ledger | exactly two `carto:names:*` fork families, both single-colon, none spelling `::`; no ambient entropy, clock, mutable module state, forbidden import, or unbounded retry; the package scan names `cartographyPlan.js` and `cartographyWards.js` so a rename reds here | `townCartographyDeterminism.test.js` |
| A8 | Bundle posture | with `VERIFY_DIST=1`, `workerBytes + manifestCompilerBytes < 400_000`; report the measured number against the `416,577` baseline from step 1 | `tests/build/townScene3dLazy.test.js` (**run, not edited**) |

Do not add a ninth case or a speculative cross-product.

## 10. Verification commands

```sh
# Baseline and focused behavior; the test slot is acquired in the same chain.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npx eslint src/domain/townCartography/cartographyPlan.js \
  src/domain/townCartography/cartographyWards.js \
  src/domain/townCartography/cartographyTuning.js \
  src/domain/townCartography/cartographySynthesis.js \
  src/domain/townScene/cartographyContract.js \
  src/domain/townScene/compileTownSceneManifest.js \
  src/workers/townScene.worker.js \
  src/lib/townScene/townSceneExport.js \
  tests/domain/townCartographyWards.test.js \
  tests/domain/townSceneCartography.test.js \
  tests/domain/townCartographyDeterminism.test.js \
  tests/property/townCartographyDormancyGolden.test.js

npm run typecheck:ratchet
npm run typecheck:domain:strict

# A8 — the bundle posture. Build FIRST; verify:dist reads dist/ and skips without it.
npm run build
npm run verify:dist

npm run check:tail
```

Expected exit `0` for every command. Report actual test counts, and report the measured
`workerBytes + manifestCompilerBytes` explicitly — a green `verify:dist` without the
number is not a receipt. A red full gate requires base-versus-wave failure attribution; it
does not authorize adjacent repair.

## 11. Recorded deviations from `TC-3.md`

Stated so the chair can veto each one individually:

1. **Preflight expects dirty targets** (§4). The parent demanded clean targets and absent
   new files. Reason: the preserved TC-3 implementation is this packet's raw material.
2. **`compileTownSceneManifest.js` is un-forbidden** (§7). The parent listed it as a
   forbidden production edit. Reason: CR-TC3A-1 puts the injected `options` parameter on
   its two exported entries; there is no other home for the lit-but-absent premise.
3. **Two new leaves instead of one** (§6.3, §6.4). Reason: measured. The preserved leaf is
   `408` effective lines; its ward half alone is `~245` against a `250` cap. Splitting the
   shared narrowing kernel out buys `~18` lines of real headroom and gives TC-3b a reuse
   home that is not `cartographyWards.js`.
4. **Two injection-only wiring files** (`townScene.worker.js`, `townSceneExport.js`). The
   parent named neither. Reason: both production chains reach the synchronous compiler and
   both can be lit; wiring only one ships a live break on the other.
5. **The byte band moves to TC-3b.** `TC3_LAYER_MAX_BYTES` and the layer byte receipt are
   parcel-side. Reason: TC-3a's growth is already bounded structurally by `MAXIMUM_WARDS`,
   `MAXIMUM_WARD_VERTICES`, and the 120-character name bound; parcels multiply per ward and
   are what the band exists to bound. Splitting the band would need an invented sub-band.
6. **A new empty-pool premise error** (§6.4.3). Not in the preserved code. Reason: with
   empty pools the preserved composer emits a leading-space stem that fails v2 validation
   three layers from the cause.
7. **Acceptance A5 and A8 are new**; the parent's A5/A6 (geometry, binding) and the
   parcel half of its A3/A8 move to TC-3b.

## 12. Open items — RESOLVED by the chair, 2026-08-10 (each vetoable)

- **O-1 — APPROVED.** This packet modifies **four** existing logic-bearing
  production files (`cartographyTuning`, `cartographySynthesis`, `cartographyContract`,
  `compileTownSceneManifest`) against a default of three, plus two injection-only wiring
  files against an allowance of three. The fourth is forced by CR-TC3A-1 itself; recorded as the standard's explicitly-approved
  larger budget, named file, before dispatch.
- **O-2 — ACCEPTED at the cap.** Twelve of twelve, zero headroom. If the
  chair wants slack, the only removable row is the dormancy-golden test edit — which would
  leave A6 unproven — not taken. A discovered thirteenth file is a STOP and a split.
- **O-3 — CONFIRMED: both alternatives stay rejected.** Wiring `townSceneExport.js` is what makes the file
  count tight. Two alternatives were considered and **rejected without authority to
  choose**: (a) leave it unwired and accept that a lit export throws — rejected, ships a
  live break; (b) have the export compile dark unconditionally — rejected, that is a
  silent product-behavior change (exports would carry no cartography) and would need
  reverting at TC-5. Both-path wiring stands.
- **O-4 — DISCHARGED.** The work is durable at `refs/preserved/tc3-original-stop-work`
  (`789b3770`, all eight files verified 8/8 against HEAD). The scratch snapshot remains a
  convenience copy. Original concern, kept for the record: the snapshot lives at
  (`/private/tmp/claude-502/…/resume-snapshots/20260809T215509`), which may not survive a
  reboot. Its four production files were verified byte-identical on 2026-08-09. Recommend
  the operator copy it somewhere durable before dispatch.
- **O-5 — ACCEPTED (`TypeError`), the chair revising its own earlier `RangeError` call** for the lit-but-absent premise (§6.1). Chosen:
  `TypeError`, because it is a caller-contract breach at the compiler seam rather than a
  domain range breach, and the leaf's `RangeError` family stays inside
  `src/domain/townCartography/`. Vetoable.

## 13. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md`, stop if:

- the eight preserved paths are not in the exact §4 state, or either `cmp` fails;
- `npm run verify:dist` measures `workerBytes + manifestCompilerBytes` at or above
  `400,000` after the change — **do not raise the literal, do not edit
  `townScene3dLazy.test.js`, do not add a `manualChunks` rule**;
- the naming pools would need to be copied, re-homed, statically imported under
  `src/domain/`, placed on `TownSceneCompileInput`, or loaded on the dark path;
- `sceneCompileInput.js`, `TOP_LEVEL_KEYS`, or `inputDigest` would need to change;
- any solution needs a second district graph, a street-face partitioner, polygon clipping,
  retries, or float/transcendental geometry;
- a schema field other than street/ward `name`, another flag, writer, persisted family,
  consumer, production leaf, or file outside §7 becomes necessary;
- a canonical fixture exceeds a cap, is non-convex, or has an outside centroid — do not
  truncate and do not raise a ceiling;
- dark manifest bytes or the dormancy JSON move, existing TC-2 geometry or draw counts
  move, or the base TownScene portion changes;
- any §7 per-file cap, the `356`-line total, the twelve-file, or the eight-case budget
  would be exceeded;
- work reaches parcels, carving, or institution binding — that is TC-3b;
- work reaches TC-4..TC-8, UI, export formats, painter, pulse, persistence, promotion,
  tuning, soak, or an unrelated gate failure.

The STOP report names the smallest measured contradiction and proposes only the smallest
split. It does not edit this packet, weaken a test, raise a budget, or repair around it.
