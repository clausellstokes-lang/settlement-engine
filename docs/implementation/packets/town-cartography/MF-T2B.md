# Town cartography / MF-T2B — the versioned integer ABI and the exact-geometry core

- **Status:** READY
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e`
- **Last revalidated:** 2026-08-21 at `7cb2c730` (the DRAFT tip) by lane TE-T2B — the whole §4
  preflight re-executed there and identical in every figure: both port-source SHA-256 values, the
  preamble's SHA-256, `foundation.js` **143** / `fabric/index.js` **101** effective, **157** digest
  pins across 12 files, and the census tuple `2485 / 364 / 2121 / 20611 / 5768`
- **Depends on:** `MF-T2A` — LANDED and terminal at `37fb6916`. Its single-declaration law binds
  this member: the arriving clipper takes a distinct name
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `6670a0465bc2b82eb1b23bbad4b60b847bf3398b1e20f6f64ecfa5cfac68192b` (the ODQ §315 re-stamp;
  re-hashed by this lane at `2cdb87fa` and matching). Its §P1 refutations, §P2 hazard
  dispositions, §P3 anchor preflight, §P4 registration template, §P5 census law, §P6 mutant
  hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated here.
- **Collision group:** `d3a-port` — shares
  `tests/lint/sovereigntyLightingContract.walker.test.js` and
  `src/domain/townMap/fabric/index.js` with every later D3a member. Staged promotion, never
  simultaneous (`CR-HB2B-SPLITP`; plan §9.3, preamble §P7.11). MF-T2A is terminal, so this member
  is the ONE non-terminal holder of both paths while it runs
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the branch
- **Baseline posture:** measured at `2cdb87fa`, inherited from nothing —
  `src/domain/townMap/fabric/foundation.js` **143** effective lines and
  `src/domain/townMap/fabric/index.js` **101**, under `max-lines {skipBlankLines, skipComments}`
  against the plain `src/domain/**` ceiling of **800**; no `townMap` path carries a
  `scripts/.size-baseline.json` entry and none is on the hot-file list; the fabric directory
  carries **0 duplicated export names of 94 distinct names across 18 files**; test census
  `2485 / 364 / 2121 / 20611 / 5768`; `BASE_STATE.json` is stamped `b8946403` and is **NOT
  citable at this base** by its own `consumptionLaw` (preamble §P8)

> **`censusAuthorization`:** this packet moves the test census by two credited files, seven titles
> and two suite titles. Its authorizing decisions are **ODQ §312** (the D3a port dispatch that
> commissions this member) and **ODQ §315** (this seat's dispatch under the §291.5 seat model),
> under the wave charter at **§310.4** and §299.4's binding-forward rule that *"a packet that moves
> any census/ratchet NAMES ITS AUTHORIZING DECISION in the packet body."* The family's stamp is
> **GRANTED** at ODQ §312.2b, so `town-cartography` sits in the eight-member engine-train column.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository, so
> there is no commit to cite. This packet names its sources by path **and SHA-256**, re-hashed by
> the implementing lane before any edit; **a mismatch is a STOP, not a merge.**
>
> | source module (sealed W3 tip, `…/laneMFW3F-tip/src/domain/townMap/fabric/`) | SHA-256 |
> |---|---|
> | `coordinateAbi.js` | `123f3c17ebd42da5223216f0029617706db49b3de7ab602acd6edcf72a2c8404` |
> | `fabricGeometry.js` | `c40c75b1fff4dd7393677f18e5b755dfb2a7fe17f4bc94a2a30f97621c78ed6e` |

---

## 1. Reconciled authority

1. **ODQ §303.5** rules the port's split and this member's core question: *"adopt the codex slice's
   RECORD SHAPES and its embedder's algorithm… On the integer wall: **D1's versioned ABI wins** —
   §299.2 said D1 rules on disagreement, and the codex 0..1000 wall is a fixture-era constraint;
   the ported record shapes re-parameterize onto the ABI. This binds the D3a-era port packets."*
2. **ODQ §287.5 / SPEC §10.4** — *"published canonical coordinates and heights live on a versioned
   integer ABI"*; *"Any raw floating result that decides topology, legality, ordering, identity or
   a content hash is nondeterministic authority."*
3. **ODQ §287.16 / §290.1** — dormant explicit-input foundations, live seeds byte-identical, the
   core-first slice; *"the existence of a conceivable edge case is not by itself authority to
   enlarge the first tranche."*
4. **ODQ §310.3(7)** — the `clipHalfPlane` rename micro-item, discharged here at the port.
5. **Live code decides.** Measured at `2cdb87fa` by this lane, with eslint's own `Linter` and with
   the compile lane's closure walker re-run against the sealed tip:

```
$ node laneTCD3A-measure-eff.mjs 2cdb87fa src/domain/townMap/fabric/foundation.js
src/domain/townMap/fabric/foundation.js   143

$ sed -n '29p' src/domain/townMap/fabric/foundation.js
export function requireCanonicalInt(value, label, min = 0, max = 1000) {

$ node laneTCD3A-geomcore.mjs <sealed tip fabricGeometry.js> TOPOLOGY_PLACES TRIG_N q6 absArea \
      bounds polygonIntersectionArea triangulateSimple triangulationIsSound offsetLine \
      pointLocateRing properCross segIntersect
module total effective : 681
top-level declarations : 57
CLOSURE                : 19 declarations, 167 effective lines
```

**Resolved contradictions:**

- *"D1's versioned ABI wins"* vs *the frozen digest pins.* `FABRIC_COORDINATE_ABI =
  'plan-q1-0-1000-v1'` is stamped into artifacts by eight fabric modules and pinned by **157
  literal digest pins (118 distinct values) across 12 test files**, re-counted at this base.
  Twelve test files alone exceed the twelve-handwritten-file cap, so a version-string cutover
  **fits in no single packet** and is a STOP-and-split by the standard's own arithmetic.
  **RESOLUTION: this member widens the ABI's ACCEPTANCE ENVELOPE and does NOT move the version
  string.** The string cutover is named as a carry — its own declared-shift micro-wave — not
  dropped.
- *"the ported record shapes re-parameterize onto the ABI"* → the wall is a **default parameter,
  not a constant**, so re-parameterisation is argument threading at the call sites and every
  explicit-range caller is untouched. **This is the single measurement that makes the member
  affordable.**
- *`coordinateAbi.js`'s `angleTableSize: TRIG_N`* → `TRIG_N = 1024` lives in the sandbox's
  `trigTable.js` (**270** effective lines, two 1024-entry tables), which is not in this member's
  closure and which nothing in this tranche reads. **The port declares `ANGLE_TABLE_SIZE = 1024`
  locally with an equality pin**; the table ports with the geometry that reads it. **JUDGMENT,
  vetoable** — the alternative costs a third leaf and 270 effective lines for one integer.
- *`heightQ()` throws* → **preserved.** The sandbox's door is held shut on purpose (*"no height
  artifact exists in the plan era"*). ⛔ **MF-T2B does not open it**; the massing member owns
  height's first publication. An unexercised path that silently starts working is how a lane reads
  a stub as a working feature.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the app-side fabric gains D1's versioned integer coordinate ABI as a
published record and the 19-declaration exact-geometry core it rests on, and
`requireCanonicalInt`'s acceptance envelope widens from the fixture-era `0..1000` to the ABI's
`±MAX_WORLD_UNITS` (**9,007,199,254**) — **without moving one artifact byte.**

**Definition of done:** `coordinateAbi.js` publishes `COORDINATE_ABI`, its version constants, the
rounding rule as data, `worldQ`/`pointQ`/`ringQ`/`withinAbiBounds`/`canonicalBytes`/`ringText` and
the refusing `heightQ`; `exactGeometry.js` carries the 19-declaration core with its half-plane
clipper named for its convention; `foundation.js`'s validator defaults are sourced from the ABI;
the barrel re-exports both; and every one of the **157** existing digest pins is **untouched and
green**.

**In scope:**

1. **One primary behavior** — the versioned integer ABI as the app fabric's coordinate authority.
2. **One necessary integration path** — the exact-geometry core, because the ABI's
   `reconcilesToTopologyText` proof and every later member's predicate need it, and it is the
   ABI's only import.
3. **One prevention guard** — the reconciliation pin: **every ABI integer is read out of `q6`'s own
   text and never re-rounded**, asserted against the tie-rule record rather than against a comment,
   with the one place the legacy text is not canonical COUNTED rather than argued about.

**Explicit non-goals:**

- ⛔ **The `FABRIC_COORDINATE_ABI` string does not move**, and no artifact digest moves. The 157
  pins stay frozen.
- ⛔ **No consumer is wired.** No existing fabric module is changed to call the new leaves;
  `foundation.js` is modified only to source its own defaults.
- ⛔ **No height.** `heightQ()` ports still refusing.
- ⛔ **No BigInt conversion of `orient`/`compareRay`** — that is the next member's, and it ships
  with the four DCEL divergences because they are one behavior.
- ⛔ **No arrangement-quantum rung is chosen.** `[1000, 5000, 25000]` is on the owner's
  TUNING-SIGNATURE docket (ODQ §310.3(9)); it is not in this manifest at all.
- ⛔ **No y-axis flip.** `viewToWorldYFlipApplied: false` ports as-is; the flip stays owed by the
  first wave that publishes a world-framed artifact, and the ABI records it honestly.
- ⛔ **No `trigTable.js`, no `groundLaw.js`, no `fabricDcel.js`.**
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` — the ABI is a published constant record, not persisted state | ≤1 |
| Named state writers | `0` | ≤1 |
| Feature flags | `0` | ≤1 |
| User-facing surfaces | `0` | ≤1 |
| Direct consumers | `0` | ≤2 |
| New logic-bearing production leaves | `2` | ≤2 |
| Existing logic-bearing production files modified | `1` (`foundation.js`) | ≤3 |
| Additional registration-only files | `1` (`fabric/index.js`) | ≤3 |
| Handwritten files total | `7` | ≤12 |
| New/changed effective production lines | **`276`** | ≤400 |
| Effective lines per new leaf | `exactGeometry 169` · `coordinateAbi 95` | ≤250 |
| Delta in a shared/hot file | `0` — **no manifest path is on the hot-file list**, measured | ≤15 |
| Acceptance cases | `7` | ≤8 |

Overrides approved before dispatch: `NONE`.

⚠ **`foundation.js` at 143 effective has 657 lines of ceiling headroom**, so the binding constraint
is the 400-line packet cap, never the ratchet. Re-measure at dispatch with eslint's own `Linter` —
never `wc -l`, never an inherited figure.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- MF-T2B
```

Then, before any edit — every one of these is a row this manifest touches, so preamble §P8's
re-execution law binds and the capsule (stamped `b8946403`) cannot cover any of them:

```sh
# the port sources are unchanged
shasum -a 256 <tip>/coordinateAbi.js <tip>/fabricGeometry.js      # MUST match the header table

# MF-T2A's law is in force and holds, and the arriving names do not collide with the live 94
npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js ; echo TRUE_EXIT=$?

# the effective-line base, with eslint's own Linter (never wc -l)
node laneTCD3A-measure-eff.mjs <HEAD> src/domain/townMap/fabric/foundation.js \
     src/domain/townMap/fabric/index.js                            # expect 143 and 101

# the digest pins that must NOT move — the member's own no-op control, captured BEFORE the edit
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapPlanarDcel.test.js tests/domain/townMapBoundaryArrangement.test.js \
  tests/domain/townMapFabricRoot.test.js tests/domain/townMapParcelRegistry.test.js \
  tests/domain/townMapFantasyConstruction.test.js tests/domain/townMapSettlementFabric.test.js \
  tests/domain/townMapMassingRoster.test.js tests/domain/townMapMassingPersistence.test.js \
  tests/domain/townMapStreetGeometry.test.js tests/domain/townMapMassingProjection.test.js \
  tests/domain/townMapLandform.test.js tests/domain/townMapStreetGraph.test.js
```

⚠ **The full fabric-touching surface is captured before AND after**, not only the pin suites: the
widening changes which inputs a shared validator REFUSES, and a refusal pin lives wherever a
fixture is out of range. A before/after equality over every test file that reads
`src/domain/townMap/fabric` is what turns "widening is byte-neutral" from an argument into a
measurement.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at `2cdb87fa` | Required use |
|---|---|---|---|---|
| The wall being widened | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt` | `(value, label, min = 0, max = 1000)` at `:29` — **a default parameter, not a constant** | change ONLY the defaults' source; the body is untouched |
| The frozen version string | same | `FABRIC_COORDINATE_ABI` | `'plan-q1-0-1000-v1'` at `:17`; stamped by 8 modules, pinned by 157 digest literals | ⛔ **DO NOT MOVE** |
| The tradition stamp | same | `CURRENT_MAP_TRADITION_ID` | `'EUROPEAN_FANTASY_BASE'` at `:18`, declared exactly once in the directory | preserve untouched |
| Barrel | `src/domain/townMap/fabric/index.js` | the export blocks | 101 effective; one named block per module | append two blocks in the established shape; ⛔ no `export *` |
| The standing law | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | the single-declaration law | landed by MF-T2A, green at zero over 18 files / 94 names | ⛔ **binds this member: the arriving clipper takes a distinct name** |
| Digest pins | `tests/domain/townMapPlanarDcel.test.js` (+11 files) | 157 literal digest pins, 118 distinct values | frozen | must stay green untouched — the member's own no-op control |
| Test precedent | `tests/domain/townMapParcelRegistry.test.js` + `tests/property/townMapParcelRegistryDeterminism.test.js` | the acceptance matrix + the replay companion | the family's two-file shape | **copy this proof shape** |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | `CENSUS` | `2485 / 364 / 2121 / 20611 / 5768` | re-record all five together with the cause; never re-serialise |

**Forbidden alternatives:**

- no second ABI record, no second rounding rule, no second `q6` spelling;
- no change to `FABRIC_COORDINATE_ABI` or `SHAPE_COORDINATE_ABI`;
- no import of the sandbox tree from any app file, ever;
- no `trigTable.js`, no `groundLaw.js`, no `fabricDcel.js` in this member;
- no new top-level `worldState` key;
- no files outside the manifest.

## 6. Exact contracts

### ⭐ The half-plane clipper's name — the §310.3(7) discharge

`clipHalfPlane` is inside this member's geometry closure (15 effective lines of the 167). Its
sandbox twin in `groundLaw.js` keeps **the opposite half-plane**, and the sealed tip says so in
that file's own comment: re-spelling the clip against `fabricGeometry.clipHalfPlane` would have
used the **opposite** half-plane convention — one copy keeps `(p−q)·n ≥ 0` and the other keeps
`(p−o)·n ≤ 0` — so the "obvious" reuse silently keeps the complement of the ground it was asked
for.

⭐⭐ **THE ARRIVING CLIPPER IS NAMED FOR ITS CONVENTION, AND THAT IS THE RENAME ODQ §310.3(7)
ORDERED**, executed at the port rather than in a tree that is retiring:

| sandbox origin | convention | **app-side name** |
|---|---|---|
| `fabricGeometry.clipHalfPlane` | keeps `(p−o)·n ≤ 0` | **`clipHalfPlaneAgainstNormal`** |
| `groundLaw.clipHalfPlane` (arrives in a later tranche) | keeps `(p−q)·n ≥ 0` | **`clipHalfPlaneAlongNormal`** |

⛔ **The bare name `clipHalfPlane` is never declared app-side.** MF-T2A's law would permit one
declaration of it; this packet forbids even that, because the whole defect is that the bare name
carries no convention. **JUDGMENT, vetoable** — the alternative is to keep the bare name here and
rename only when the collision arrives, which reintroduces exactly the ambiguity the order struck.

### Inputs and outputs — `coordinateAbi.js`

```js
export const COORDINATE_ABI_VERSION = 1;
export const COORDINATE_ABI_SCHEMA_VERSION = 1;
export const GEOMETRY_QUANTUM = Object.freeze({ numerator: 1, denominator: 1000000 });
export const HEIGHT_QUANTUM  = Object.freeze({ numerator: 1, denominator: 1000000 });
export const MAX_WORLD_UNITS = Math.floor(Number.MAX_SAFE_INTEGER / GEOMETRY_QUANTUM.denominator);
export const ANGLE_TABLE_SIZE = 1024;          // == the sandbox's TRIG_N; pinned by A6
export const COORDINATE_ABI = Object.freeze({ /* the record, ported field-for-field */ });
export const ROUNDING_RULE = Object.freeze({
  source: 'Number.prototype.toFixed', places: 6, tieBreak: 'HALF_AWAY_FROM_ZERO', reRounded: false,
});
export function worldQ(v)            // number -> safe-integer quanta, or null for non-finite
export function heightQ()            // ⛔ THROWS, always — declared and UNEXERCISED
export function withinAbiBounds(v)   // boolean
export function pointQ(p)            // [number,number] -> [int,int] | null
export function ringQ(poly)          // polyline -> int polyline | null
export function topologyTextOf(n)    // quanta -> the six-decimal text
export function isNegativeZeroText(v)
export function reconcilesToTopologyText(v)
export function canonicalBytes(artifactKind, schemaVersion, orderedDependencyRefs, bodyText)
export function ringText(poly)
```

⛔ **`worldQ` reads the integer out of `q6`'s own text — sign, digits, decimal point removed. It
NEVER computes `Math.round(v * 1e6)`,** and A3 convicts the alternative by counterexample with a
same-magnitude positive control that AGREES, so the conviction is about the sign rule rather than
about an arbitrary disagreement.

### Absence rules

- **absent / non-finite input**: `worldQ` and `pointQ` return **`null`**, never `NaN` — `NaN`
  compares unequal to itself and would make an identity unstable against its own value.
- **empty ring**: `ringQ([])` returns `[]`; `ringText([])` returns the empty string.
- **`heightQ()`**: **throws**, unconditionally. Not `null`, not `0`.
- **out-of-envelope coordinate**: `withinAbiBounds` returns `false`; `requireCanonicalInt` throws
  with the range in the message.

### Determinism

- Hash/fork key: `NONE` — every function is pure over its arguments.
- Stable enumeration: ring order is the caller's vertex order, preserved exactly.
- Rounding: **`Number.prototype.toFixed(6)`, tie-break HALF-AWAY-FROM-ZERO, never re-rounded.**
  The rule is published as `ROUNDING_RULE` **data so a test can assert it rather than a comment
  claim it.**
- No-draw behavior: n/a — no RNG exists in this member or anywhere in the fabric.

### Flag and dormancy

- Flag: `NONE`. Golden posture: ⭐ **unchanged, and PROVEN unchanged** — see A7.

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| module-scope frozen constants | pure functions | ⛔ nothing persisted | n/a | n/a | n/a | ⚠ a v1 artifact is not readable as v2 without a declared migration — that is `COORDINATE_ABI_VERSION`'s whole job | n/a — no runtime surface |

### Receipts and privacy

- Closed kinds: `NONE`. DM-only fields: `NONE`. Public projection: unaffected.
- ⚠ `canonicalBytes` produces a **FINGERPRINT input**, declared as such in the module's own
  docstring — never cryptography and never an authorization decision.

### Alignment and edit story

- Alignment: `DECLARED EMPTY: a coordinate ABI has no alignment surface.`
- Edit story: `ENGINE-ONLY: constants and pure functions; nothing is DM-editable and nothing is proposed.`

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/townMap/fabric/coordinateAbi.js` | the 18 exports of §6 | `95` | Port from the sealed tip's `coordinateAbi.js` (SHA in the header). Replace `import { TOPOLOGY_PLACES, TRIG_N, q6 } from './fabricGeometry.js'` with `TOPOLOGY_PLACES, q6` from `./exactGeometry.js` plus a local `ANGLE_TABLE_SIZE = 1024`. Preserve `heightQ`'s throw and the y-flip caveat fields |
| `CREATE` | `src/domain/townMap/fabric/exactGeometry.js` | the 19-declaration closure | `175` | Port exactly the measured closure: `triangulateSimple` `polygonIntersectionArea` **`clipHalfPlaneAgainstNormal`** `offsetLine` `pointInPolygon` `triPairArea` `bounds` `segIntersect` `area` `crossParams` `distToSegment` `pointLocateRing` `triangulationIsSound` `inTriangleStrict` `properCross` `TOPOLOGY_PLACES` `CROSS_EPS` `absArea` `q6`, preserving the sandbox's own export posture (`crossParams`, `inTriangleStrict`, `triPairArea` stay module-private). ⛔ Nothing outside the closure; ⛔ the bare name `clipHalfPlane` is never declared |
| `MODIFY` | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt` signature only | `+6` | Import `MAX_WORLD_UNITS` from `./coordinateAbi.js`; change the defaults to `min = -MAX_WORLD_UNITS, max = MAX_WORLD_UNITS`. ⛔ The body, `FABRIC_COORDINATE_ABI`, and every other export are untouched |
| `REGISTER` | `src/domain/townMap/fabric/index.js` | two named export blocks | `+14` | Append one block per new leaf in the file's established shape. ⛔ No `export *` |
| `CREATE` | `tests/domain/townMapCoordinateAbi.test.js` | A1–A4, A6, A7 | `n/a` | The domain matrix: one literal `describe`, straight-line `test()` calls, string-literal titles |
| `CREATE` | `tests/property/townMapCoordinateAbiDeterminism.test.js` | A5 | `n/a` | The replay companion, matching `townMapParcelRegistryDeterminism.test.js`'s shape |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+12` | One re-record block naming its cause and citing **ODQ §312 / §315**; then the tuple, all five figures together |

Generated artifacts: `NONE`. No other file may be edited.

⚠ **The two arriving acceptance files are `CREATE` rows, not `TEST` rows**, and the distinction is
the validator's rather than cosmetic: a `TEST` row's path must exist at **every** status, while a
`CREATE` row's existence is asserted only at `LANDED` — which is the one status under which a
fictional creation is catchable. Measured, not assumed: spelling them `TEST` reds `validate:packets`
at `DRAFT` with `path does not exist for TEST`.

### §P4 registration template, at full strength

| Element | This member |
|---|---|
| THE ROW | two named export blocks in `src/domain/townMap/fabric/index.js`, one per new leaf |
| THE HEAD RE-EXPORT | the same barrel — `src/domain/townMap/index.js` re-exports it unchanged, so no edit is owed there |
| THE EXACT-LIST / EXACT-COUNT PIN | `tests/lint/townMapFabricSingleDeclaration.walker.test.js`'s zero-duplicates totality plus its `guard-the-guard` floor (≥18 files, ≥94 names), which the arriving 34 names must not breach; and A2's zero-importer scan, which is the exact-count pin for this member's dormancy |
| THE REGISTRY TEST PATH | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` and `tests/build/townMapLazy.test.js` |

⭐ **No `tests/lint/**` file is minted here**, so preamble §P3b's mutation-coverage row is **NOT
INCURRED** by this member — the obligation attaches to new files in an enumerated enforcer
directory, and this member's two acceptance files live in `tests/domain/` and `tests/property/`.

## 8. Ordered coding sequence

0. Dispatch and seal; run every §4 preflight. Stop on any mismatch, **including a source SHA
   mismatch**.
1. **Capture the golden/dormancy evidence BEFORE the first edit:** run the 12 digest-pin suites AND
   every other fabric-touching test file, and record their counts; run the single-declaration
   walker, the census walker and the anchor walker. ⛔ *"The agent must not start by changing a
   golden, baseline, budget, or persisted shape."*
2. **Run every acceptance fixture and print what the engine actually did**, before a pin is
   written (preamble §P2.9). A pin written from a predicted answer is a pin that documents the
   prediction.
3. Add the acceptance tests for A1–A7.
4. Implement the pure leaves, `exactGeometry.js` first (it has no imports), then `coordinateAbi.js`.
5. — (no writer, no lifecycle seam; no consumer)
6. `foundation.js`'s default change, then the barrel blocks.
7. Focused verification (§10), **including the untouched-pin control and the post-build dormancy
   fence**.
8. Wave-end gate and the completion receipt.

**Bounded algorithm — `worldQ`, the one function whose spelling is load-bearing:**

```text
1. t := q6(v)                                   // Number.prototype.toFixed(6)
2. if t === 'na' return null                    // non-finite; never NaN
3. neg := t starts with '-'; body := t without the sign
4. digits := body with its '.' removed          // NOT a multiply — no second rounding
5. n := Number(digits)
6. if !Number.isSafeInteger(n) return null
7. return (neg && n !== 0) ? -n : n             // -0 collapses to 0 by construction
```

⛔ **Step 4 is the whole point.** `Math.round(v * 1e6)` is wrong twice and both are measurable: the
tie rule diverges on negative coordinates (`toFixed` is half-away-from-zero; `Math.round` is toward
`+∞`), and `v * 1e6` is one more rounded IEEE operation before the rounding that was supposed to be
canonical. A3 executes both.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | Main behavior — the widened envelope accepts an ABI-scale quantum, and still refuses past the envelope | `requireCanonicalInt(1286630000, 'q')`, `requireCanonicalInt(-1286630000, 'q')`, `requireCanonicalInt(MAX_WORLD_UNITS + 1, 'q')` | the first two return their value; the third still throws, naming the new range — so the widening is a re-parameterisation and not the removal of a wall | domain |
| **A2** | Dormancy — nothing consumes it | a source scan of `src/` for importers of either new leaf, outside `src/domain/townMap/fabric/` | **zero** importers; and `tests/build/townMapLazy.test.js` green POST-BUILD under `VERIFY_DIST=1` | domain |
| **A3** | Counterforce — the obvious spelling is convicted by counterexample, with a positive control | `v = -1/128`, an exactly representable double whose sixth decimal is an exact tie, AND its positive twin `+1/128` | `worldQ(-1/128)` is **−7813** (from `q6`'s `-0.007813`) while `Math.round(v * 1e6)` is **−7812** — they DISAGREE; on `+1/128` both are **7813** — they AGREE. The divergence is the SIGN RULE, and `ROUNDING_RULE.tieBreak === 'HALF_AWAY_FROM_ZERO'` names which one is canonical | domain |
| **A4** | Boundary / refusal | `worldQ(Infinity)`, `worldQ(NaN)`, `withinAbiBounds(MAX_WORLD_UNITS + 1)`, `heightQ()`, `pointQ(null)` | `null`, `null`, `false`, **throws** naming SPEC §10.16's status override, `null` — and `COORDINATE_ABI.contentHash` / `provenanceRef` / `unitRegistryRef` are `null`, named **ABSENT rather than stubbed** | domain |
| **A5** | Idempotency / replay | every function called twice on the same input; `canonicalBytes` over a fixed roster | byte-identical both times; **no `Date`, `Math.random`, `Intl`, `toLocale`, `performance` or `crypto` reachable** from either leaf, proved by source scan with a positive control | property |
| **A6** | ⭐ Real integration — the reconciliation is an identity, AND its one exception is COUNTED, not hidden | a fixed 17-row table spanning negatives, zeros, ties, both signs of round-to-zero and both envelope edges | `reconcilesToTopologyText(v)` is true for **all 17**; `topologyTextOf(worldQ(v)) === q6(v)` holds on **15**, and the exactly **2** rows where it does not are exactly the rows `isNegativeZeroText(v)` names — the ABI has one zero and the legacy text has two. And `ANGLE_TABLE_SIZE === 1024` | domain |
| **A7** | ⭐ **The named historical regression — WIDENING MOVES NO BYTE** | the version string plus the 12 digest-pin suites, unmodified | `FABRIC_COORDINATE_ABI` still `'plan-q1-0-1000-v1'`; all **157** literal digest pins green and **untouched** in the §10 control | domain + the §10 control |

⭐⭐ **A6 IS WHERE THE COMPILED DRAFT WAS WRONG, AND THE CORRECTION IS THE STRONGER PIN.** The
draft asked for `topologyTextOf(worldQ(v)) === q6(v)` *exactly*, over a table that spans zeros.
Executed, that identity holds on 15 of 17 rows: a coordinate that rounds to zero from BELOW is
published by `toFixed` as `"-0.000000"` while the ABI's integer has one zero. Asserting the
unqualified identity would have forced the table to omit the negative-zero rows — a fixture built
to agree with its deriver, which is the recorded vacuity class. **A6 therefore asserts the identity
AND its exception set, both as positives**, so neither can be discovered later as a surprise.

⭐⭐ **A7 IS THIS PACKET'S CENTRAL CLAIM.** Widening an acceptance range changes which inputs
THROW; it cannot change the representation of an input that was already accepted. ⛔ **A moved
digest is therefore a STOP, not a re-record.**

⛔ **Anchor law:** A2, A4 and A5 assert absences. Each carries a `tests/helpers/anchoredNegatives.js`
call **by name on the same line**, or `// anchored: <why this cannot go vacuous>` on the assertion
line or the line immediately above it. ⚠ For a multi-line comment only the **LAST** line counts.

**Predicted census motion — the family's domain-matrix + determinism-companion shape:**

```
2485 / 364 / 2121 / 20611 / 5768   →   2487 / 364 / 2123 / 20618 / 5770
                                       +2 files · +0 parked · +2 credited · +7 titles · +2 suites
```

⚠ **The titles delta is SEVEN, not six.** Six acceptance cases live in the domain file (A1, A2, A3,
A4, A6, A7) and one in the property companion (A5); `6 + 1 = 7`. The compiled draft's §9 predicted
`+6` while its own §7 assigned six cases to the domain file and one to the property file — an
internal arithmetic error, corrected here before it became a STOP at the census arm.

⛔ **`parked` MUST stay at 364.** One literal `describe` per file, straight-line `test()` calls,
string-literal titles. No `.each`, no `runIf`, no nesting, no loop-generated tests. A5's source scan
loops **inside** one named test — the recorded SP-D idiom.

⚠ **NAMED INTERIOR RED**: the census arm is an exact equality against a recorded constant, so this
member reds at its own implementation commit until the tuple is re-recorded. Figures above. The
census is SEQUENCED, so a red at `files` is itself the proof that the four later figures had not
yet been read.

## 10. Verification commands

```sh
# Anchor preflight — MANDATORY per new test file, BEFORE the member proof is declared green
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# Focused static
npx eslint src/domain/townMap/fabric/coordinateAbi.js src/domain/townMap/fabric/exactGeometry.js \
           src/domain/townMap/fabric/foundation.js src/domain/townMap/fabric/index.js \
           tests/domain/townMapCoordinateAbi.test.js tests/property/townMapCoordinateAbiDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Effective-line ledger against the §3 budget — eslint's own Linter, never wc -l
node laneTCD3A-measure-eff.mjs <HEAD> src/domain/townMap/fabric/coordinateAbi.js \
     src/domain/townMap/fabric/exactGeometry.js src/domain/townMap/fabric/foundation.js \
     src/domain/townMap/fabric/index.js

# Focused tests — one slot, one command
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapCoordinateAbi.test.js \
  tests/property/townMapCoordinateAbiDeterminism.test.js \
  tests/lint/townMapFabricSingleDeclaration.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# ⭐ THE UNTOUCHED-PIN CONTROL — A7. All 157 digest pins, unmodified, green.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapPlanarDcel.test.js tests/domain/townMapBoundaryArrangement.test.js \
  tests/domain/townMapFabricRoot.test.js tests/domain/townMapParcelRegistry.test.js \
  tests/domain/townMapFantasyConstruction.test.js tests/domain/townMapSettlementFabric.test.js \
  tests/domain/townMapMassingRoster.test.js tests/domain/townMapMassingPersistence.test.js \
  tests/domain/townMapStreetGeometry.test.js tests/domain/townMapMassingProjection.test.js \
  tests/domain/townMapLandform.test.js tests/domain/townMapStreetGraph.test.js

# ⛔ Dormancy: POST-BUILD ONLY. tests/build/townMapLazy.test.js is describe.runIf(distExists),
# so on a fresh worktree it SKIPS and reports exit 0 on ZERO executed tests. Build first, then:
VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js ; echo TRUE_EXIT=$?

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- MF-T2B
npm run implementation:resume -- MF-T2B

# Wave-end — BARE, fresh shell, never piped, and OUTLAST it in your own turn
npm run check:tail ; echo TRUE_EXIT=$?
```

⛔⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; **exit 3 is the mutex giving up, not a red.**
⚠ **Trust no exit status you did not capture.**
⚠ **Report both typecheck configurations by name and window**: `typecheck:ratchet`
(`tsconfig.full.json`) and `typecheck:domain:strict` (`tsconfig.domain-strict.json`). A ratchet
being green is evidence only about that ratchet.

Expected: every command exits `0`. Report actual counts; **do not copy this packet's historical
counts.**

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P7:

- **any of the 157 digest pins moves** — A7 says it cannot, so a move means the member did
  something other than widen a range. ⛔ **Re-record nothing; STOP and report the moved digest.**
- **any fabric-touching test file changes its result between the before and after capture** — the
  widening is proved neutral by that equality, not by argument;
- `FABRIC_COORDINATE_ABI` or `SHAPE_COORDINATE_ABI` would need to change;
- a port source's SHA-256 does not match the header table;
- the bare name `clipHalfPlane` would be declared, or `townMapFabricSingleDeclaration.walker` reds,
  or an arriving export name collides with one of the live 94;
- ⛔ **the four DCEL divergences or the BigInt conversion would be needed to make a test pass** —
  that is the next member, and pulling it forward merges two members past the 400-line budget;
- `heightQ()` would need to return a value;
- `trigTable.js`, `groundLaw.js` or `fabricDcel.js` would need to be ported;
- an arrangement-quantum rung or any tuning constant would be touched;
- the census moves by other than `+2 / +0 / +2 / +7 / +2`, **or `parked` leaves 364**. ⚠ A delta
  **smaller** than the titles added is not arithmetic to accept — a parked file swallows its titles
  and nothing reds; attribute by reverting one test file at a time;
- `tests/build/townMapLazy.test.js` reds POST-BUILD — the dormancy boundary breached. ⛔ A
  pre-build SKIP is not a discharge and may not be reported as one;
- another D3a member is simultaneously non-terminal on `fabric/index.js` or
  `sovereigntyLightingContract.walker.test.js`;
- any ratchet, baseline, budget or ceiling would need raising.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the
next wave.

## 12. Completion receipt

- Base SHA:
- Dispatch bundle and seal identity:
- Port-source SHA-256 re-check, verbatim:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas against the §3 budget:
- Acceptance cases A1–A7:
- ⭐ **A7 untouched-pin control**: the 12 suites, their pass counts, and the statement that no
  digest literal was edited:
- ⭐ **The before/after equality over every fabric-touching test file**:
- Anchor-walker preflight exit:
- Focused commands, exits, and counts:
- Census before → after, and `parked`:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations, named with their windows:
- Wave-end gate stages actually executed (17-step `&&` chain — say which ran):
- Base-versus-wave failure identity diff:
- Dormancy result (`townMapLazy` POST-BUILD under `VERIFY_DIST=1`, and the zero-importer scan):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls:
