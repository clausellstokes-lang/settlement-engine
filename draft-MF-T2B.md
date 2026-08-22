# Town cartography / MF-T2B — the versioned integer ABI and the exact-geometry core

> **DRAFT compiled by lane TC-D3A (OPUS COMPILE seat, ODQ §291.5) for the FABLE chair.**
> Not dispatchable. Promotion, the INDEX row, the `PACKET_MANIFEST.json` row and the landing are
> chair acts. This lane made no git write, no gate run and no repo edit.

- **Status:** `DRAFT`
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `9d851fae`
- **Last revalidated:** 2026-08-21 at `9d851fae`
- **Depends on:** `MF-T2A` (the fabric single-declaration law must land first — this member is the
  first to bring a `clipHalfPlane` into the app tree)
- **Collision group:** `d3a-port` — shares `src/domain/townMap/fabric/index.js` and
  `tests/lint/sovereigntyLightingContract.walker.test.js` with every later D3a member.
  ⛔ **Staged promotion, never simultaneous** (plan §9.3)
- **Commit authority:** edits only; the coordinator commits
- **Baseline posture:** measured at `9d851fae`, not inherited — `foundation.js` **143** effective
  lines under `max-lines {skipBlankLines, skipComments}` against the `src/domain/**` ceiling of
  **800**; no `townMap` path carries a `scripts/.size-baseline.json` entry and none is on the
  hot-file list; test census `2484 / 364 / 2120 / 20598 / 5767`; `BASE_STATE.json` stamped
  `b8946403`, **NOT citable at this base**

> **Family preamble:** as MF-T2A — `draft-MF-PREAMBLE.md` awaits a chair signature; this packet is
> complete on its own structured fields and gains the SHA-256 citation line when the preamble
> lands.

> **`censusAuthorization`:** moves the test census. Authorizing decision: **ODQ §310.4**, "THE PORT
> WAVE (D3a) COMPILE DISPATCHES", under §299.4's binding-forward rule.

> ⛔ **PORT SOURCE PROVENANCE.** The sandbox is **not a git repository** (verified:
> `git rev-parse` → `fatal: not a git repository`), so there is no commit to cite. This packet
> names its sources by path **and SHA-256 at compile time**. The implementer re-hashes before
> editing; **a mismatch is a STOP, not a merge.**
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
   core-first slice.
4. **Live code decides.** Measured at `9d851fae` and at the sealed tip:

```
$ node laneTCD3A-measure-eff.mjs 9d851fae src/domain/townMap/fabric/foundation.js
src/domain/townMap/fabric/foundation.js   143

$ git show 9d851fae:src/domain/townMap/fabric/foundation.js | sed -n '17,29p'
export const FABRIC_COORDINATE_ABI = 'plan-q1-0-1000-v1';
export function requireCanonicalInt(value, label, min = 0, max = 1000) {

$ node laneTCD3A-geomcore.mjs <sealed tip fabricGeometry.js> TOPOLOGY_PLACES TRIG_N q6 absArea \
      bounds polygonIntersectionArea triangulateSimple triangulationIsSound offsetLine \
      pointLocateRing properCross segIntersect
module total effective : 681
CLOSURE                : 19 declarations, 167 effective lines
```

**Resolved contradictions:**

- *"D1's versioned ABI wins"* vs *the 157 frozen digest pins.* `FABRIC_COORDINATE_ABI =
  'plan-q1-0-1000-v1'` is stamped into artifacts by **eight** fabric modules and pinned by
  **157 literal digest pins (118 distinct values) across 12 test files** (`townMapPlanarDcel` 69, `townMapBoundaryArrangement`
  35, `townMapFabricRoot` 14, `townMapParcelRegistry` 13, `townMapFantasyConstruction` 7,
  `townMapSettlementFabric` 5, `townMapMassingRoster` 4, `townMapMassingPersistence` 4,
  `townMapStreetGeometry` 2, `townMapMassingProjection` 2, `townMapLandform` 1,
  `townMapStreetGraph` 1). Changing the version string moves every one of them.
  ⛔ **Twelve test files alone exceed the twelve-handwritten-file cap**, so the string cutover
  **cannot fit in any single packet** and is a STOP-and-split by the standard's own arithmetic.
  **RESOLUTION: this member widens the ABI's ACCEPTANCE ENVELOPE and does NOT move the version
  string.** Widening is proved byte-neutral below; the string cutover is its own declared-shift
  micro-wave, D0-pattern, and is named as a carry, not dropped.
- *"the ported record shapes re-parameterize onto the ABI"* → the wall is a **default parameter**,
  not a constant, so re-parameterisation is argument threading at the call sites. **This is the
  single measurement that makes the member affordable.**
- *`coordinateAbi.js`'s `angleTableSize: TRIG_N`* → `TRIG_N = 1024` lives in the sandbox's
  `trigTable.js` (**270** effective lines, two 1024-entry tables) which nothing in this tranche
  reads. **The port declares `ANGLE_TABLE_SIZE = 1024` locally with an equality pin**; the table
  ports with the geometry that reads it. **JUDGMENT, vetoable** — the alternative costs a third
  leaf and 270 effective lines for one integer.
- *`heightQ()` throws* → **preserved verbatim.** The sandbox's door is held shut on purpose
  (*"no height artifact exists in the plan era"*). ⛔ **MF-T2B does not open it**; MF-T2E's
  `MassPartQ` is the member that owns height's first publication. An unexercised path that
  silently starts working is how a lane reads a stub as a working feature.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the app-side fabric gains D1's versioned integer coordinate ABI as a
published record and the ~170-effective-line exact-geometry core it rests on, and
`requireCanonicalInt`'s acceptance envelope widens from the fixture-era `0..1000` to the ABI's
`±MAX_WORLD_UNITS` — **without moving one artifact byte.**

**Definition of done:** `coordinateAbi.js` publishes `COORDINATE_ABI`, its version constants, the
rounding rule as data, `worldQ`/`pointQ`/`ringQ`/`withinAbiBounds`/`canonicalBytes`/`ringText` and
the refusing `heightQ`; `exactGeometry.js` publishes the 19-declaration core with its two
half-plane clippers **distinctly named**; `foundation.js`'s validator defaults are sourced from
the ABI; the barrel exports both; and every one of the **157** existing digest pins is
**untouched and green**.

**In scope:**

1. **One primary behavior** — the versioned integer ABI as the app fabric's coordinate authority.
2. **One necessary integration path** — the exact-geometry core, because the ABI's
   `reconcilesToTopologyText` proof and every later member's predicate need it, and it is the
   ABI's only import.
3. **One prevention guard** — the reconciliation pin: **every ABI integer is read out of `q6`'s own
   text and never re-rounded**, asserted against the tie-rule record rather than against a comment.

**Explicit non-goals:**

- ⛔ **The `FABRIC_COORDINATE_ABI` string does not move**, and no artifact digest moves. 157 pins
  stay frozen.
- ⛔ **No consumer is wired.** No existing fabric module is changed to call the new leaves;
  `foundation.js` is modified only to source its own defaults.
- ⛔ **No height.** `heightQ()` ports still refusing.
- ⛔ **No BigInt conversion of `orient`/`compareRay`** — that is MF-T2C's, and it ships with the
  four divergences because they are one behavior (see §11's third STOP).
- ⛔ **No arrangement-quantum rung is chosen.** `ARRANGEMENT_QUANTUM_LADDER = [1000, 5000, 25000]`
  is on the owner's TUNING-SIGNATURE docket (ODQ §310.3(9)); it is not in this manifest at all.
- ⛔ **No y-axis flip.** `viewToWorldYFlipApplied: false` ports as-is; the flip stays owed by the
  first wave that publishes a world-framed artifact, and the ABI records it honestly.
- ⛔ **No `trigTable.js`.**
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
| New/changed effective production lines | **`≈290`** | ≤400 |
| Effective lines per new leaf | `exactGeometry ≈175` · `coordinateAbi ≈95` | ≤250 |
| Delta in a shared/hot file | `0` — **no manifest path is on the hot-file list**, measured | ≤15 |
| Acceptance cases | `7` | ≤8 |

Overrides approved before dispatch: `NONE`.

⚠ **`foundation.js` at 143 effective has 657 lines of ceiling headroom**, so the binding
constraint is the 400-line packet cap, never the ratchet. Re-measure at dispatch with eslint's own
`Linter` — never `wc -l`, never an inherited figure.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- MF-T2B
```

Then, before any edit — every one of these is a row this manifest touches, so §P8's re-execution
law binds and the capsule (stamped `b8946403`) cannot cover any of them:

```sh
# the port sources are unchanged
shasum -a 256 <tip>/coordinateAbi.js <tip>/fabricGeometry.js      # MUST match the header table

# MF-T2A's law is in force and holds
npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js ; echo TRUE_EXIT=$?

# the effective-line base, with eslint's own Linter (never wc -l)
node laneTCD3A-measure-eff.mjs <HEAD> src/domain/townMap/fabric/foundation.js   # expect 143

# the digest pins that must NOT move
sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/townMapPlanarDcel.test.js \
  tests/domain/townMapBoundaryArrangement.test.js tests/domain/townMapFabricRoot.test.js
```

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at `9d851fae` | Required use |
|---|---|---|---|---|
| The wall being widened | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt` | `(value, label, min = 0, max = 1000)` at `:29` — **a default parameter, not a constant** | change ONLY the defaults' source; the body is untouched |
| The frozen version string | same | `FABRIC_COORDINATE_ABI` | `'plan-q1-0-1000-v1'` at `:17`; stamped by 8 modules, pinned by 157 digest literals | ⛔ **DO NOT MOVE** |
| The tradition stamp | same | `CURRENT_MAP_TRADITION_ID` | `'EUROPEAN_FANTASY_BASE'` at `:18`, declared exactly once in the directory | preserve; assert equality in the new leaves as every other compiler does |
| Barrel | `src/domain/townMap/fabric/index.js` | the export blocks | 101 effective; one named block per module | append two blocks in the established shape |
| The standing law | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | the single-declaration law | landed by MF-T2A at zero | ⛔ **binds this member: the arriving clipper takes a distinct name** |
| Digest pins | `tests/domain/townMapPlanarDcel.test.js` (+11 files) | 157 literal digest pins, 118 distinct values | frozen | must stay green untouched — the member's own no-op control |
| Test precedent | `tests/domain/townMapParcelRegistry.test.js` + `tests/property/townMapParcelRegistryDeterminism.test.js` | the A1–A6 matrix + the replay companion | the family's two-file shape | **copy this proof shape** |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | `CENSUS` | `2484 / 364 / 2120 / 20598 / 5767` | re-record with the cause; never re-serialise |

**Forbidden alternatives:**

- no second ABI record, no second rounding rule, no second `q6` spelling;
- no change to `FABRIC_COORDINATE_ABI` or `SHAPE_COORDINATE_ABI`;
- no import of the sandbox tree from any app file, ever;
- no `trigTable.js`, no `groundLaw.js`, no `fabricDcel.js` in this member;
- no new top-level `worldState` key;
- no files outside the manifest.

## 6. Exact contracts

### ⭐ The two half-plane clippers — the §310.3(7) discharge

`clipHalfPlane` is inside this member's geometry core (`laneTCD3A-geomcore.mjs`: 15 effective
lines of the 167). Its sandbox twin in `groundLaw.js` keeps **the opposite half-plane**, and the
sealed tip says so at `groundLaw.js:701`:

> *"Re-spelling the clip against `fabricGeometry.clipHalfPlane` would have used the **opposite**
> half-plane convention — this file's copy keeps `(p−q)·n ≥ 0` and the geometry module's keeps
> `(p−o)·n ≤ 0` — so the 'obvious' reuse silently keeps the complement of the ground it was asked
> for."*

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
NEVER computes `Math.round(v * 1e6)`,** and A3 convicts the alternative by counterexample.

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
- ⚠ `canonicalBytes` produces a **128-bit FINGERPRINT**, declared as such — never cryptography and
  never an authorization decision. The docstring says so and A4 asserts the declaration.

### Alignment and edit story

- Alignment: `DECLARED EMPTY: a coordinate ABI has no alignment surface.`
- Edit story: `ENGINE-ONLY: constants and pure functions; nothing is DM-editable and nothing is proposed.`

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/townMap/fabric/coordinateAbi.js` | the 16 exports of §6 | `95` | Port from the sealed tip's `coordinateAbi.js` (SHA in the header). Replace `import { TOPOLOGY_PLACES, TRIG_N, q6 } from './fabricGeometry.js'` with `TOPOLOGY_PLACES, q6` from `./exactGeometry.js` plus a local `ANGLE_TABLE_SIZE = 1024`. Preserve `heightQ`'s throw verbatim and the y-flip caveat fields verbatim |
| `CREATE` | `src/domain/townMap/fabric/exactGeometry.js` | the 19-declaration core | `175` | Port exactly the measured closure: `triangulateSimple` `polygonIntersectionArea` **`clipHalfPlaneAgainstNormal`** `offsetLine` `pointInPolygon` `triPairArea` `bounds` `segIntersect` `area` `crossParams` `distToSegment` `pointLocateRing` `triangulationIsSound` `inTriangleStrict` `properCross` `TOPOLOGY_PLACES` `CROSS_EPS` `absArea` `q6`. ⛔ Nothing outside the closure; ⛔ the bare name `clipHalfPlane` is never declared |
| `MODIFY` | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt` signature only | `+6` | Import `MAX_WORLD_UNITS` from `./coordinateAbi.js`; change the defaults to `min = -MAX_WORLD_UNITS, max = MAX_WORLD_UNITS`. ⛔ The body, `FABRIC_COORDINATE_ABI`, and every other export are untouched |
| `REGISTER` | `src/domain/townMap/fabric/index.js` | two named export blocks | `+14` | Append one block per new leaf in the file's established shape. ⛔ No `export *` |
| `TEST` | `tests/domain/townMapCoordinateAbi.test.js` | A1–A4, A6, A7 | `n/a` | The domain matrix: one `describe`, straight-line `test()` calls, string-literal titles |
| `TEST` | `tests/property/townMapCoordinateAbiDeterminism.test.js` | A5 | `n/a` | The replay companion, matching `townMapParcelRegistryDeterminism.test.js`'s shape |
| `MODIFY` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+10` | One re-record block naming its cause and citing **ODQ §310.4**; then the tuple |

Generated artifacts: `NONE`. No other file may be edited.

## 8. Ordered coding sequence

0. Dispatch and seal; run every §4 preflight. Stop on any mismatch, **including a source SHA
   mismatch**.
1. **Capture the golden/dormancy evidence BEFORE the first edit:** run the three digest-pin suites
   of §4 and record their pass counts; run `tests/build/townMapLazy.test.js`; run the anchor
   walker focusedly. ⛔ *"The agent must not start by changing a golden, baseline, budget, or
   persisted shape."*
2. Add the failing tests for A1–A7.
3. Implement the pure leaves, `exactGeometry.js` first (it has no imports), then
   `coordinateAbi.js`.
4. — (no writer, no lifecycle seam)
5. — (no consumer; `foundation.js`'s edit is the ABI sourcing its own defaults, not a wiring)
6. `foundation.js`'s default change, then the barrel blocks.
7. Focused verification (§10), **including the untouched-pin control**.
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

⛔ **Step 4 is the whole point.** `Math.round(v * 1e6)` is wrong twice and both are measurable:
the tie rule diverges on negative coordinates (`toFixed` is half-away-from-zero; `Math.round` is
toward `+∞`, and on `x = -1/128` they give `-0.007813` and `-7812`), and `v * 1e6` is one more
rounded IEEE operation before the rounding that was supposed to be canonical. A3 executes both.

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| **A1** | Main behavior — the widened envelope accepts an ABI quantum | `requireCanonicalInt(1286630000, 'q')` | returns `1286630000`; at base it threw `must be an integer in 0..1000` | domain |
| **A2** | Dormancy — nothing consumes it | a source scan of `src/` outside `src/domain/townMap/fabric/` | **zero** importers of either new leaf; `tests/build/townMapLazy.test.js` green | domain |
| **A3** | Counterforce — the obvious spelling is convicted by counterexample | `v = -1/128`, an exactly representable double whose sixth decimal is an exact tie | `worldQ(v)` returns **`-7813`** (from `q6`'s `-0.007813`) while `Math.round(v * 1e6)` returns **`-7812`** — the two rules disagree, and `ROUNDING_RULE.tieBreak === 'HALF_AWAY_FROM_ZERO'` names which one is canonical | domain |
| **A4** | Boundary / refusal | `worldQ(Infinity)`, `worldQ(NaN)`, `withinAbiBounds(MAX_WORLD_UNITS + 1)`, `heightQ()`, `pointQ(null)` | `null`, `null`, `false`, **throws** naming SPEC §10.16's status override, `null` — and `COORDINATE_ABI.contentHash === null`, named **ABSENT rather than stubbed** | domain |
| **A5** | Idempotency / replay | every function called twice on the same input; `canonicalBytes` over a fixed roster | byte-identical both times; **no `Date`, `Math.random`, `Intl`, `toLocale`, `performance` or `crypto` reachable** from either leaf, proved by source scan | property |
| **A6** | Real integration — the reconciliation is an identity, not an approximation | a fixed table of coordinates spanning negatives, zeros, ties and the envelope edge | `reconcilesToTopologyText(v)` true for every one; `topologyTextOf(worldQ(v)) === q6(v)` exactly; and `ANGLE_TABLE_SIZE === 1024` | domain |
| **A7** | ⭐ **The named historical regression — WIDENING MOVES NO BYTE** | the three digest-pin suites, unmodified | all **157** literal digest pins green and **untouched**; `FABRIC_COORDINATE_ABI` still `'plan-q1-0-1000-v1'` | domain + the §10 control |

⭐⭐ **A7 IS THIS PACKET'S CENTRAL CLAIM AND IT IS ALREADY MEASURED.** Executed by lane TC-D3A
against the codex blobs at `9d851fae` in an isolated probe tree, comparing the landed validator
against a widened one over identical in-range fixtures:

```
$ node byteneutral.mjs
k=4   narrow=df69ff17773cf394  wide=df69ff17773cf394  IDENTICAL
k=8   narrow=7e2983f2aaff3ffb  wide=7e2983f2aaff3ffb  IDENTICAL
k=16  narrow=b5df9e5e47cb9762  wide=b5df9e5e47cb9762  IDENTICAL
k=32  narrow=5c6e7e5da71340a4  wide=5c6e7e5da71340a4  IDENTICAL
```

Widening an acceptance range changes which inputs THROW; it cannot change the representation of an
input that was already accepted. ⛔ **A moved digest is therefore a STOP, not a re-record.**

⚠ ⭐ **AND THE SAME RUN FORESHADOWS MF-T2C, which is why the two members must not be merged.**
With the wall widened, an ABI-scale single boundary no longer hits the wall — it hits the next
gate:

```
narrow: THROWS "boundaries[0].geometry[1][0] must be an integer in 0..1000"
wide:   THROWS "DCEL face must have nonzero signed area"
```

That second message is **divergence 4** — the open-chain throw that kills **8 of 17 real leaves**.
The two refusals are sequential gates on one input. **MF-T2B opens the first; MF-T2C owns the
second**, and a member that tried to do both would be carrying the BigInt conversion, the four
divergences and the ABI in one 400-line budget.

⛔ **Anchor law:** A2, A4 and A5 assert absences. Each carries a
`tests/helpers/anchoredNegatives.js` call **by name on the same line**, or
`// anchored: <why this cannot go vacuous>` on the assertion line or the line immediately above
it. ⚠ For a multi-line comment only the **LAST** line counts.

**Predicted census motion — the family's domain-matrix + determinism-companion shape:**

```
2484 / 364 / 2120 / 20598 / 5767   →   2486 / 364 / 2122 / 20604 / 5769
                                       +2 files · +0 parked · +2 credited · +6 titles · +2 suites
```

⛔ **`parked` MUST stay at 364.** One literal `describe` per file, straight-line `test()` calls,
string-literal titles. No `.each`, no `runIf`, no nesting, no loop-generated tests. A5's source
scan loops **inside** one named test — the recorded SP-D idiom.

⚠ **NAMED INTERIOR RED**: the census arm is an exact equality against a recorded constant, so this
member reds at its own implementation commit until the tuple is re-recorded. Figures above.

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
     src/domain/townMap/fabric/exactGeometry.js src/domain/townMap/fabric/foundation.js

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

# Dormancy: the fabric stays out of the entry closure
sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/townMapLazy.test.js

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

In addition to `PACKET_STANDARD.md`:

- **any of the 157 digest pins moves** — A7 says it cannot, so a move means the member did
  something other than widen a range. ⛔ **Re-record nothing; STOP and report the moved digest.**
- `FABRIC_COORDINATE_ABI` or `SHAPE_COORDINATE_ABI` would need to change;
- a port source's SHA-256 does not match the header table;
- the bare name `clipHalfPlane` would be declared, or `townMapFabricSingleDeclaration.walker` reds;
- ⛔ **the four DCEL divergences or the BigInt conversion would be needed to make a test pass** —
  that is MF-T2C, and pulling it forward merges two members past the 400-line budget;
- `heightQ()` would need to return a value;
- `trigTable.js`, `groundLaw.js` or `fabricDcel.js` would need to be ported;
- an arrangement-quantum rung or any tuning constant would be touched;
- the census moves by other than `+2 / +0 / +2 / +6 / +2`, **or `parked` leaves 364**. ⚠ A delta
  **smaller** than the titles added is not arithmetic to accept — a parked file swallows its
  titles and nothing reds; attribute by reverting one test file at a time;
- `tests/build/townMapLazy.test.js` reds — the dormancy boundary breached;
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
- Anchor-walker preflight exit:
- Focused commands, exits, and counts:
- Census before → after, and `parked`:
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations, named with their windows:
- Wave-end gate stages actually executed (17-step `&&` chain — say which ran):
- Base-versus-wave failure identity diff:
- Dormancy result (`townMapLazy`, and the zero-importer scan):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, without investigation:
- Judgment calls: `NONE`
