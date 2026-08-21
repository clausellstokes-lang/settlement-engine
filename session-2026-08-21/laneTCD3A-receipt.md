# lane TC-D3A · THE PORT WAVE (D3a) COMPILE — verification receipt

**Seat:** OPUS COMPILE (ODQ §291.5). This lane compiles and prices. It made **no git write, no
gate run, and no repo edit**. Every deliverable is a DRAFT in the session scratchpad for the
FABLE chair to rule and land.

**Charter read:** ODQ §287 (esp. .4–.9, .16), §288, §289, §290, §299.3, §303.5, §304.4,
§306.4a, §310.4 — all read in the ledger working tree at
`/Users/cstokes/Desktop/settlement-engine/docs/OWNER_DECISION_QUEUE.md`.

**Bases:**
- BUILD branch `claude/composite-r4` @ `9d851fae` — read exclusively through `git show` /
  `git ls-tree` / `git grep <sha>`. Never checked out, never diffed against the working tree
  (§300.2a: `git diff HEAD` is POISONED here by the staged `map-corpus/` deletions).
- LEDGER working tree HEAD `c5ba15e4` (branch `review-fixes-2026-07-08`) — read-only.
- SANDBOX code of record: `…/a244e7a3-…/scratchpad/laneMFW3F-tip` — the sealed W3 tree.
  **It is NOT a git repository** (`git rev-parse` → `fatal: not a git repository`); it is a
  plain directory. This is load-bearing and is carried into the plan (§3.1 below).

**Deliverables produced (all in this session's scratchpad):**
- `draft-D3A-PLAN.md` — the wave plan, priced.
- `draft-MF-PREAMBLE.md` — the town-cartography family preamble (WC-shape), compiled because
  none exists; see RAISED-1.
- `draft-MF-T2A.md` — member 1, the §310.3(7) first act.
- `draft-MF-T2B.md` — member 2, the ABI / record-shape reconciliation.
- helpers: `laneTCD3A-probe/` (isolated codex-kernel probe tree), `laneTCD3A-measure-eff.mjs`,
  `laneTCD3A-dupexports.mjs`, `laneTCD3A-sandbox-modules.txt`, `laneTCD3A-codex-modules.txt`,
  `laneTCD3A-src-*.md` (blob extracts).

---

## §1 · WHAT WAS EXECUTED — CONFIRMED, with the command that produced it

Every figure in the plan and the packets traces to one of the runs below. Nothing in this
receipt is inherited from another lane's document without being re-executed here.

### 1.1 The two fabrics, and the collision question — CONFIRMED

```
$ ls  laneMFW3F-tip/src/domain/townMap/fabric            | sort  > laneTCD3A-sandbox-modules.txt
$ git ls-tree --name-only 9d851fae -- src/domain/townMap/fabric/ | xargs -n1 basename | sort
                                                                 > laneTCD3A-codex-modules.txt
sandbox modules:  54
codex modules:    18
$ comm -12 laneTCD3A-sandbox-modules.txt laneTCD3A-codex-modules.txt
(empty)
```

**ZERO basename overlap**, re-derived independently of CX-1's claim (which said 47 sandbox
modules; the sealed W3 tip now carries **54**, so CX-1's figure is stale, not wrong — W3F added
modules after CX-1 measured). Both fabrics live at the **same path**,
`src/domain/townMap/fabric/`, so the port ADDS files into an occupied directory with no filename
collision. `validate:packets` path reservation is therefore not triggered by the port's CREATE
rows against the codex slice's LANDED rows.

### 1.2 The codex kernel is QUADRATIC, and the dominant term is one line — CONFIRMED

An isolated probe tree (`laneTCD3A-probe/`) was built from the 18 codex fabric blobs at
`9d851fae` plus `src/domain/deterministicSort.js` and `src/domain/townScene/stableScene.js`.
`derivePlanarDcelEmbedding` was run against a `k×k` lattice of unit cells (the shape a real
leaf's kerb web most resembles), `boundaries = 2k(k+1)`, coordinates inside the codex 0..1000
wall.

```
$ node --max-old-space-size=4096 scale.mjs 4 8 12 16 24 32 48 64
k    boundaries   halfEdges     ms
4        40           80        4.3
8       144          288       10.2
12      312          624       29.1
16      544         1088       53.8
24     1200         2400      242.2
32     2112         4224      759.4
48     4704         9408     4258.6
64     8320        16640    13634.9
```

Fitted exponents on the last three points: `log(5.61)/log(2.23) = 1.99` and
`log(3.20)/log(1.77) = 2.04`. **Clean quadratic.**

Extrapolated to the real leaves whose arrangement sizes `laneMFD1-receipt.md` §6.3 publishes
(town 11,603 noded boundaries; metropolis 17,417), from the `n=8320 → 13.63 s` point:

| leaf | boundaries | predicted | basis |
|---|---:|---:|---|
| town | 11,603 | **≈ 26.5 s** | `(11603/8320)² × 13.63` |
| metropolis | 17,417 | **≈ 59.7 s** | `(17417/8320)² × 13.63` |

⚠ **The extrapolation is PLAUSIBLE, not CONFIRMED** — it is arithmetic over a measured
exponent, not an executed run at 11,603 boundaries. The measured points up to 8,320 are
CONFIRMED. The experiment that would settle it is naming itself in the plan: MF-T2B's A5 runs
the ported kernel against the sealed tip's own town arrangement.

**COST ATTRIBUTION — three builds, each output-checked.** Two obvious suspects were cured first
and did **not** move the needle:

```
                                                          k=32     k=48      k=64
BASE (landed kernel)                                      759.4   4258.6   13634.9
BUILD A  twin lookup made O(E) by a key map               699.3   3666.1   12180.3
BUILD B  BUILD A + pairwise noding check skipped          645.9   3493.8   11398.3
BUILD C  BUILD A + noding ON + face-start scan amortised  123.4    409.2    1070.8
```

⭐ **The dominant term is a single line** — `const start = [...unvisited].sort(compareCodepoint)[0]`
inside the face-traversal `while` loop, which materialises and sorts the whole unvisited
half-edge set once **per face**: `O(F · E log E)`. Replacing it with a pre-sorted cursor gives
**12.7× at k=64** with the `O(B²)` noding check still in place.

**AND BUILD C IS OUTPUT-IDENTICAL — proved, not assumed:**

```
$ node equiv.mjs
k=4   boundaries=40    base=df69ff17773cf394  buildC=df69ff17773cf394  IDENTICAL
k=8   boundaries=144   base=7e2983f2aaff3ffb  buildC=7e2983f2aaff3ffb  IDENTICAL
k=16  boundaries=544   base=b5df9e5e47cb9762  buildC=b5df9e5e47cb9762  IDENTICAL
k=32  boundaries=2112  base=5c6e7e5da71340a4  buildC=5c6e7e5da71340a4  IDENTICAL
```

SHA-256 over `JSON.stringify` of the whole returned artifact, four sizes. The speedup carries
**zero behaviour shift**, so it is a repair and not a declared shift.

### 1.3 The ABI wall bites TWICE, and the second bite is silent — CONFIRMED

`§303.5` rules that D1's versioned integer ABI WINS over the codex 0..1000 wall. Two executed
convictions establish what that costs:

**CONVICTION 1 — the wall refuses an ABI quantum.**

```
$ node abiwall.mjs
requireCanonicalInt(1286630000, 'abiQuantum')
  THROWS: abiQuantum must be an integer in 0..1000
derivePlanarDcelEmbedding({... geometry: [[0,0],[1286630000,0]] })
  embedder THROWS: boundaries[0].geometry[1][0] must be an integer in 0..1000
```

⭐ **And the wall is a DEFAULT PARAMETER, not a constant**:
`foundation.js:29` is `export function requireCanonicalInt(value, label, min = 0, max = 1000)`.
The re-parameterisation is therefore an argument-threading job at the call sites, not a rewrite
of the validator — which is why MF-T2B is a MODIFY packet and not a CREATE one.

**CONVICTION 2 — Number orientation LOSES ITS SIGN at ABI scale, and the loss presents as a
false angular tie.** The codex `orient` and `compareRay` multiply coordinate differences in
`Number`. At D1 ABI quanta (~1.3e9 per `laneMFD1-receipt.md` §6.2 divergence 1) each product
reaches ~1.66e18, **184× past `MAX_SAFE_INTEGER`**. Constructed counterexample
`a=[0,0] b=[m-1, m] c=[m, m+1]` with `m = 1286630001` (true cross `(m-1)(m+1) − m² = −1`):

```
$ node abiwall2.mjs
MAX_SAFE_INTEGER      = 9007199254740991
one product magnitude = 1655416759473260000  (exceeds MAX_SAFE by 183.8 x)
Number orient = 0    sign 0
BigInt orient = -1   sign -   <- the TRUE sign
*** DISAGREE — Number is wrong by -1, and the SIGN FLIPPED ***
compareRay would THROW 'DCEL vertex has an angular tie' on a NON-tie;
the exact answer is right-first.
```

⛔ **This is the sharpest single finding of the compile.** Porting the codex embedder onto D1's
ABI *without* converting its arithmetic to BigInt does not produce a wrong map — it produces a
**THROW on valid geometry**, wearing the message of a condition that did not occur. The sandbox
already knows this and says so in `fabricDcel.js:121`: *"⚠ IT MUST BE BigInt: ABI quanta reach
~1.3e9."* MF-T2B carries it as a named acceptance case with this exact triple.

### 1.4 The §310.3(7) rename micro-item — the defect is SANDBOX-ONLY — CONFIRMED

```
$ grep -rn 'clipHalfPlane' laneMFW3F-tip/src laneMFW3F-tip/tests
  fabric/groundLaw.js:88       export function clipHalfPlane(poly, qx, qy, nx, ny)
  fabric/fabricGeometry.js:116 export function clipHalfPlane(poly, ox, oy, nx, ny)
  (+ 17 call/comment sites, incl. groundLaw.js:701 naming the opposite convention)

$ git grep -n 'clipHalfPlane' 9d851fae -- src tests scripts
(empty)
```

**Zero occurrences on the build branch.** The two same-named opposite-convention exports live
only in the sealed sandbox tip. This is the fact that reshapes the order; see RAISED-2 and
plan §7.

### 1.5 The source-scan baseline — the scope decision is MEASURED, not chosen — CONFIRMED

`laneTCD3A-dupexports.mjs` scans `export function|const|let|class <name>` declarations across
git blobs at a sha and reports names declared in more than one file.

```
$ node laneTCD3A-dupexports.mjs 9d851fae src
files scanned: 2149 · distinct exported names: 8716
names exported from MORE THAN ONE file: 92 · total offending (name,file) pairs: 199

$ node laneTCD3A-dupexports.mjs 9d851fae src/domain/townMap
files scanned: 79 · distinct exported names: 410
names exported from MORE THAN ONE file: 1 · pairs: 2
   TOWN_MAP_OVERLAY_VERSION  →  townLayoutV2.js:62 · townMapModel.js:50

$ node laneTCD3A-dupexports.mjs 9d851fae src/domain/townMap/fabric
files scanned: 18 · distinct exported names: 94
names exported from MORE THAN ONE file: 0 · pairs: 0
```

⭐⭐ **`src/domain/townMap/fabric/**` is at EXACTLY ZERO of 94.** That is the rarest and best
shape a guard can have: the `PACKET_STANDARD` census-burn law's *victory assertion* — the
population is exactly zero, and **any future member reds on arrival** rather than being banked.
A whole-`src/` scan is un-landable at 92 offenders; a `src/domain/townMap/**` scan needs a
one-row baseline. The fabric scope needs neither.

⚠ **The one wider-scope offender, reported and NOT cured by this wave**: `townLayoutV2.js:62`
and `townMapModel.js:50` each declare `export const TOWN_MAP_OVERLAY_VERSION = 1;`
independently. Same name, same value **today** — a fork waiting to drift, not a live defect.
Out-of-scope observation per the edge-case budget; recorded, not investigated.

### 1.6 The estate registers this family actually fires — MEASURED at `9d851fae`

| register | instrument | what it costs a D3a member |
|---|---|---|
| test census | `tests/lint/sovereigntyLightingContract.walker.test.js` | the five-figure tuple, re-recorded per member |
| coupling / layer census | `tests/lint/couplingInclusion.walker.test.js` | ⭐ **NOTHING** for `src/domain/townMap/**` |
| mutation coverage | `tests/lint/mutationCoverageManifest.test.js` | one row per new `tests/lint/**` file |
| anchor walker | `tests/lint/negativeAssertionAnchor.walker.test.js` | per new test file, ceiling zero |
| size ratchet | eslint `max-lines` + `scripts/.size-baseline.json` | ⭐ **NOTHING** — see below |
| hot files | `PACKET_STANDARD` standing list | ⭐ **NOTHING** — no townMap file is on it |

**The coupling census is FREE here, quoted from its own source at `9d851fae`:**

> *"ANYTHING OUTSIDE THE CENSUS SCOPE. The census is total over `src/domain/worldPulse` and
> `src/domain/spatial` only; a layer leaf that lands in a third directory is unclaimed and
> uncounted until the scope widens."*
> — `tests/lint/couplingInclusion.walker.test.js`, standing cannot-catch list

⛔ **AND THAT FREENESS ENDS EXACTLY AT THE §306.4a MEMBERS**, which are engine-side by
construction: a `worldPulse` leaf is inside the census, owes a `LAYER_PATTERNS` family home or
an `ARGUED_UNLAYERED` entry **in the same commit as the leaf**, and `ARGUED_ROSTER_CEILING` is
an exact `.toBe(20)` in both directions. The plan prices that separately (plan §5).

**The size ratchet is free and the reason is measured:**

```
$ git show 9d851fae:scripts/.size-baseline.json | grep townMap
(empty)
$ eslint.config.js:556   files: ['src/domain/**/*.js']
                         'max-lines': ['error', { max: 800, skipBlankLines: true, skipComments: true }]
```

No townMap file carries a baseline entry, so every one is under the plain 800-effective-line
domain ceiling, and none is on the hot-file list. **Effective lines, executed with the repo's own
eslint `Linter` under `max-lines {skipBlankLines, skipComments}` at `9d851fae`:**

```
$ node laneTCD3A-measure-eff.mjs 9d851fae <paths>
src/domain/townMap/fabric/dcelEmbedding.js         169
src/domain/townMap/fabric/dcel.js                   89
src/domain/townMap/fabric/foundation.js            143
src/domain/townMap/fabric/boundaryArrangement.js   247
src/domain/townMap/fabric/parcelRegistry.js        216
src/domain/townMap/fabric/index.js                 101
src/domain/townMap/fabric/operations.js            278
src/domain/townMap/fabric/projection.js            374
src/domain/townMap/index.js                        133
src/store/operationRegistry.js                     244
src/store/operations.js                             25
tests/fixtures/townMapSettlementFabricFixtures.js  266
```

`dcelEmbedding.js` at **169 effective** has 631 lines of ceiling headroom; the binding
constraint on MF-T2B is therefore the `PACKET_STANDARD` per-packet cap of 400 new/changed
effective production lines, never the ratchet.

### 1.7 The test census, and the per-member cost precedent — CONFIRMED

```
$ git show 9d851fae:tests/lint/sovereigntyLightingContract.walker.test.js | sed -n '4848p'
    files: 2484, parked: 364, credited: 2120, titles: 20598, suiteTitles: 5767,
```

The thirteen codex packets each re-recorded this tuple in place, each naming its cause. Read as
a price list, the map-family member costs **exactly two shapes**:

| shape | delta | who paid it |
|---|---|---|
| domain matrix + determinism companion | **+2 files / +0 parked / +2 credited / +6 titles / +2 suites** | MF-T1G, MF-T1N, MF-T1A, MF-T1D, MF-T1P, MF-T1F |
| single credited A1–A6 file | **+1 / +0 / +1 / +6 / +1** | MF-T1M, MF-T1V, MF-T1S |

Every one of the thirteen kept `parked` **unchanged at 364** by spelling titles as literals in
one straight-line `describe` — the SP-D idiom. The plan holds D3a to the same discipline and
prices each member against one of these two shapes rather than inventing a third.

### 1.8 The dossier-surface batch's targets — MEASURED, and one is not where it looks

```
$ grep -rn 'deriveHighWater' laneMFW3F-tip/src
  fabric/tierGrammar.js:574   export function deriveHighWater(settlement)
  fabric/tierGrammar.js:660 · fabric/measure.js:198
$ git grep -l 'deriveHighWater' 9d851fae
(empty)
```

⛔ **`deriveHighWater` is SANDBOX-ONLY.** §306.2a's finding — *"deriveHighWater's three evidence
channels are empty on 16 of 17 leaves"* — is therefore **not a defect in the reader**; it is a
statement that the app-side engine never produces the facts the sandbox reader looks for. That
splits §306.4a's batch cleanly into a **producer** half (engine-side, inside the coupling
census, `worldPulse`) and a **consumer** half (which arrives with the port, free). The plan
prices them separately and orders the producer first; see plan §5 and RAISED-4.

The §287.7 domain door, located: `src/store/operationRegistry.js` (244 eff),
`src/store/operations.js` (25 eff), `src/store/actionResult.js`, `src/store/outbox.js`. The
second operation vocabulary §299.3c orders merged is
`src/domain/townMap/fabric/operations.js` (278 eff). ⚠ **The merge crosses a layer boundary
(`src/domain/**` → `src/store/**`) in the direction the estate normally forbids**, which is why
plan §6 refuses to compile it now and states the two candidate shapes instead.

### 1.9 The family, the volume, and the preamble — MEASURED

```
$ git ls-tree -r --name-only 9d851fae -- docs/implementation/ | grep -i preamble
docs/implementation/preambles/{GR,HB,IN,INFRA,INT,WC,WF}-PREAMBLE.md          (seven; no MF, no TC)

$ git ls-tree -r --name-only 9d851fae -- docs/implementation/packets/town-cartography/
MF-SH1 MF-T1A MF-T1D MF-T1F MF-T1G MF-T1M MF-T1N MF-T1P MF-T1S MF-T1V MF-T1X MF-VS1 MF-W3S1
TC-3 TC-3A TC-3B TC-4 TC-5A TC-5B-I TC-5B-II                                  (twenty rows)
```

The family exists and is `town-cartography`. **No preamble exists for it**, and MF-T1X says so
in its own body:

> *"Family-preamble ruling: town-cartography has no family preamble … That measured local
> precedent controls MF-T1X. The absent family preamble is not a dispatch blocker and this
> packet does not invent a fourth governance file."*

The volume is `map-corpus/docs/GENERATION-SPEC.md`, **ledger branch only** — absent from
`9d851fae` entirely. 12,667 lines. ⚠ **And the working-tree copy is DIRTY relative to ledger
HEAD**, established by the §300.2a cmp method rather than by a diff listing:

```
$ git show HEAD:map-corpus/docs/GENERATION-SPEC.md | cmp - map-corpus/docs/GENERATION-SPEC.md
stdin map-corpus/docs/GENERATION-SPEC.md differ: char 360486, line 4084
worktree blob aa613cb8d9ea8b895236304e9e72b08940ba1698
ledger HEAD  7dcd70abe85c85851cd3f381736c7a5fee59c8f6
```

The compiled preamble cites the **worktree blob it actually read** and says so; see RAISED-3.

### 1.10 The base-state capsule is NOT citable at this base — CONFIRMED

```
$ git show 9d851fae:docs/implementation/BASE_STATE.json
"stampedAt": "b8946403",  "stampedDate": "2026-08-16"
```

The capsule is stamped at `b8946403`; the base is `9d851fae`, and the window is emphatically not
docs-only (D0, D1, CB1, I1 and the WF work all landed across it). Per the capsule's own
`consumptionLaw`, **a capsule stamped at any other sha is worthless for citation.** This lane
therefore measured every figure above from scratch and cited none of the capsule's. The plan
records the same obligation for each member.

### 1.11 · The digest-pin surface — MEASURED, and this lane convicted its own first figure

The pins that MF-T2B must leave untouched:

```
$ node laneTCD3A-digestpins.mjs 9d851fae
  69  tests/domain/townMapPlanarDcel.test.js          4  tests/domain/townMapMassingRoster.test.js
  35  tests/domain/townMapBoundaryArrangement.test.js 2  tests/domain/townMapMassingProjection.test.js
  14  tests/domain/townMapFabricRoot.test.js          2  tests/domain/townMapStreetGeometry.test.js
  13  tests/domain/townMapParcelRegistry.test.js      1  tests/domain/townMapLandform.test.js
   7  tests/domain/townMapFantasyConstruction.test.js 1  tests/domain/townMapStreetGraph.test.js
   5  tests/domain/townMapSettlementFabric.test.js
   4  tests/domain/townMapMassingPersistence.test.js
----
 157  TOTAL literal digest pins across 12 files
 118  DISTINCT digest values
```

⛔ **A SELF-CAUGHT DEFECT, RECORDED RATHER THAN QUIETLY FIXED.** This lane's first count used
`grep -coE "[0-9a-f]{32}"` and reported **158**. That regex matches a 32-character run *inside* a
longer hex string, so it can double-count. A tightened quoted-literal regex then reported **32 in
one file**, which contradicted it in the other direction — because the real pins are prefixed
(`'scene-v1-b90080500e9e0a99b6ee469444832743'`), so the quote is not adjacent to the hex. The
correct instrument (`laneTCD3A-digestpins.mjs`) tokenises string literals and tests each for a
`[0-9a-f]{32,}` run: **157 pins, 118 distinct values, 12 files.**

The three drafts were corrected from 158 → 157 before this receipt was written. The lesson is
`townMapLandform.test.js`, which the loose count read as 2 and the literal-aware count reads as 1 —
**a one-line arithmetic error in a figure that the packet then makes load-bearing in a STOP
condition.** Two instruments disagreeing is what caught it; one instrument's exit 0 would not have.

---

## §2 · WHAT IS PLAUSIBLE, NOT CONFIRMED — with the experiment that would settle each

1. **The real-leaf timings.** Town ≈ 26.5 s and metropolis ≈ 59.7 s are **arithmetic over a
   measured exponent**, extrapolated from `n=8320 → 13.63 s`. The measured points up to 8,320
   boundaries are CONFIRMED; the two extrapolations are not. **Settling experiment:** MF-T2C's A5
   runs the ported kernel against the sealed tip's own town arrangement (11,603 noded boundaries)
   and reports wall clock. Named in the packet rather than left as a plan assertion.
2. **The ported effective-line figures.** `coordinateAbi ≈95`, `exactGeometry ≈175`,
   `spatialReceipt ≈130`, `stageManifest ≈220` are the *sandbox* modules' measured counts adjusted
   for the import rewiring each port performs. The sandbox counts are CONFIRMED
   (`laneTCD3A-measure-files.mjs`); the post-port counts are estimates. **Settling experiment:**
   each member's own implementation-order step re-measures with eslint's `Linter` and reports the
   ledger against its §3 budget. A member that overruns STOPs and splits — which is the standard's
   own mechanism, not a gap in this compile.
3. **The `LAYER_PATTERNS`-not-`ARGUED_UNLAYERED` prediction for the four §306.4a producers**
   (plan §5.2, RAISED-9). The reasoning is the roster's own stated criterion — the argued door is
   for *"modules that own NO subject"* — applied to four leaves that each own one. But the exact
   regex and the roster's live state are per-member facts. **Settling experiment:** each producer
   member re-reads `couplingInclusion.walker.test.js`'s live roster at its own base before
   compiling its registration rows.
4. **That MF-T2G's strip is the *only* D3a member whose artifact bytes move.** CONFIRMED for the
   port members by the dormancy argument (§1 / plan §2.4); PLAUSIBLE for MF-T2E/K/L/M, which mint
   new record families that no existing artifact embeds. **Settling experiment:** each of those
   members runs the 12-file digest-pin control that MF-T2B's A7 establishes.
5. **That the §306.4a producers owe RS-5.** §305.4's rule is quoted exactly and the four members
   plainly change engine behaviour, so the inference is strong — but whether the chair reads a
   dormant-consumer producer as "engine behaviour" for soak purposes is a chair call, which is why
   it is RAISED-4 rather than asserted.

---

## §3 · WHAT THIS LANE DID NOT DO — stated affirmatively

- **No git write of any kind.** No `add`, `commit`, `checkout`, `stash`, `worktree`, `restore`, or
  ref move. The only git commands run were `show`, `ls-tree`, `grep <sha>`, `rev-parse`,
  `hash-object`, `branch -a`, `log`, `worktree list` and one `show HEAD:… | cmp`.
- **No gate run.** No `npm run check`, `check:tail`, `check:quick`, `check:packet`, `validate:packets`,
  `vitest`, or `eslint` CLI invocation against the repo. The eslint **`Linter` API** was used
  in-process, read-only, over git blobs and sandbox files — it executes no project config and
  writes nothing.
- **No repo edit.** Nothing under `/Users/cstokes/Desktop/settlement-engine` was created, modified
  or deleted. Every artifact this lane produced is in the session scratchpad.
- **No edit to the sealed W3 sandbox tip.** It was read only. Its files were hashed and copied
  nowhere except that `laneTCD3A-probe/` contains **build-branch blobs**, not sandbox files.
- **No `git diff HEAD` in the ledger tree**, deliberately — §300.2a records it as POISONED there by
  the staged `map-corpus/` deletions. The one attribution this lane needed was done by
  `git show HEAD:path | cmp`.
- **No packet promoted, no INDEX row written, no `PACKET_MANIFEST.json` row written.** All four
  deliverables are `DRAFT` in the scratchpad and are chair acts to land.
- **No preamble landed.** `draft-MF-PREAMBLE.md` is a compiled draft carrying its own §299.5
  warning that a lane may not author governance.
- **Not compiled: MF-T2C through MF-T2S.** Their shapes are fixed in the plan; their packets are
  deliberately deferred under `PACKET_STANDARD`'s primary scope-control rule — *"Compile the next
  packet only when its dependencies are landed and its live substrate is measurable. Do not
  pre-author the entire program."*
- **Not investigated: the wider duplicate-export surface.** 92 names / 199 pairs across `src/`, and
  the `TOWN_MAP_OVERLAY_VERSION` fork in `src/domain/townMap/**`. Recorded as out-of-scope
  observations per the edge-case budget; not investigated, not repaired.
- **Not measured: the sandbox's own DCEL timings.** The 12.7× figure compares two builds of the
  *codex* kernel against each other. A sandbox-vs-codex speed comparison would need the sandbox's
  full arrangement pipeline stood up, which is out of a compile lane's scope and is not claimed
  anywhere in the deliverables.

---

## §4 · JUDGMENT CALLS THIS LANE MADE — each vetoable

`JUDGMENT` entries are decisions between defensible alternatives that sat inside this lane's
compile scope. Anything owner- or chair-gated went to §5 instead.

1. **Chose to compile a family preamble over following MF-T1X's three-file precedent.** MF-T1X's
   precedent was right for one packet and does not scale to a sixteen-member wave whose members
   share a census law, a dormancy proof, a hazard set and a STOP set. *Vetoable:* drop
   `draft-MF-PREAMBLE.md` and duplicate its content into each member.
2. **Chose the fabric-directory scope for MF-T2A over `src/domain/townMap/**` or `src/`.** Measured:
   0 / 1 / 92 offenders respectively. Only the fabric scope lands at zero with no baseline, and a
   baseline is the one shape this law must not have. *Vetoable:* the wider scope, at the cost of a
   frozen row.
3. **Chose to split §310.3(7) into guard-now / rename-on-arrival rather than editing the sealed
   sandbox tip.** Reasons in plan §7: the tip is not in git, is the program's only copy of the W3
   evidence, and retires. *Vetoable* — and flagged separately as RAISED-2 because it diverges from
   the order's literal wording, which is a chair-visible act rather than a private preference.
4. **Chose to name the arriving clipper `clipHalfPlaneAgainstNormal` and reserve
   `clipHalfPlaneAlongNormal`, forbidding the bare name entirely.** MF-T2A's law would permit one
   bare declaration; MF-T2B forbids it, because the defect is that the bare name carries no
   convention. *Vetoable:* keep the bare name and rename only when the collision arrives.
5. **Chose to widen the ABI acceptance envelope rather than move the version string** (MF-T2B).
   Proved byte-neutral; the alternative is a 157-pin, 12-file shift that exceeds the
   twelve-handwritten-file cap and therefore fits no packet. *Vetoable:* schedule the string
   cutover as its own declared-shift micro-wave sooner rather than later.
6. **Chose to declare `ANGLE_TABLE_SIZE = 1024` locally rather than port `trigTable.js`** (270
   effective lines, two 1024-entry tables, for one integer this tranche reads once). *Vetoable.*
7. **Chose to keep the BigInt conversion and the four divergences together in MF-T2C rather than
   splitting them.** Without BigInt the extended kernel throws a false angular tie on real ground,
   so a member landing the divergences alone lands a kernel that cannot run. *Vetoable:* split, at
   the cost of an interior member that is provably broken.
8. **Chose to size D3a at ~16 members and name the generator tranches as later work** rather than
   charter the whole 14,230-effective-line port. §290.4 forbids enlarging the tranche and the
   standard requires a split when the work does not fit. *Vetoable* — and its consequence for the
   twin-life boundary is RAISED-5, because that consequence is a chair call, not mine.
9. **Chose to order MF-T2F (solid legality) before MF-T2K (support surfaces)** because
   MF-T2F ships the `DIFFERENT_SUPPORT_SURFACE` refusal that MF-T2K is the consumer of. *Vetoable.*
10. **Chose to recommend staged promotion over serial single-member dispatch** for the shared-path
    problem (plan §9.3). Serial dispatch is the measured codex precedent and is certainly correct;
    it pays the full gate sixteen times. *Vetoable.*

---

## §5 · ⛔ RAISED — every judgment-dense call the chair must make at signing

The full docket with recommendations is `draft-D3A-PLAN.md` §11. Summarised here so the receipt
stands alone:

| # | the call | why it is the chair's and not mine |
|---|---|---|
| **1** | **Sign the preamble; rule the family's stamp.** The compiled draft records `STAMP: NONE` ⇒ **the train cap is 4, not 8.** | §299.5 struck a lane authoring governance; and the standard says explicitly that **no compiler may read a light wave class as a stamp**. A grant would halve this wave's terminal-gate count. |
| **2** | **The §310.3(7) rename's target tree.** This plan splits the order: the guard lands now, the rename discharges when the geometry ports, and the sandbox is not edited. | It is a **deliberate divergence from the literal wording of a chair ruling**. Divergence is a compile's job to propose and a chair's to accept. |
| **3** | **The volume's dirty blob.** `GENERATION-SPEC.md` differs from ledger HEAD at line 4084; the preamble cites the worktree blob `aa613cb8…`. | Which copy is the code of record is a governance fact, not a measurement. |
| **4** | **The §306.4a members owe a soak (§305.4's RS-5).** Recommend exposing them on their own train so the port's seal is not held by a 162-cell soak. | A soak is a program act with a real cost. Also: §306.4a's own words route the batch to *"D3a/A0–A5"*, so deferring to a successor wave is inside the ruling. |
| **5** | **What "the port's seal" means in §304.4.** The full port is 14,230 effective lines / ≥36 members; D3a as chartered is ~16. | If the twin-life retirement fires at D3a's seal, the sandbox retires while ~9,900 lines of generator have not ported and the program loses its geometry code of record. |
| **6** | **§299.3c's operation-vocabulary merge.** Refused-to-compile; Shape A and Shape B stated. MF-T2M and MF-T2P are BLOCKED behind it. | The merge crosses `src/domain/**` → `src/store/**`. `PACKET_STANDARD`: *"If two higher authorities still disagree, the packet is BLOCKED. A coding agent never adjudicates the disagreement."* |
| **7** | **MF-T2G strips the light profile rather than conforming it.** | Conforming means building §288.2–§288.5's whole contract, which is D4 scope and would breach §290.4's stop — a scope-boundary call. |
| **8** | **`ANGLE_TABLE_SIZE` declared locally** rather than porting `trigTable.js`. | Listed here as well as at §4.6 because it sets a precedent for every later "port the constant, not the module" decision. |
| **9** | **The four §306.4a producers predict `LAYER_PATTERNS` family homes, not argued rows.** | It commits four estate-wide registration rows, and the roster's own comment makes the family-vs-argued choice a subject-ownership judgment rather than a cost one. |
| **10** | **Scheduling: R1's dual-family ready queue cannot be satisfied inside `town-cartography`.** Every D3a train must be queued against a WF train. | It binds the coordinator's queue, not any packet. |

---

## §6 · WHAT LANDING THESE DELIVERABLES UNBLOCKS, AND WHAT IT DOES NOT

**Unblocks on a chair signature:**

- `MF-T2A` promotion and dispatch at `9d851fae` — it depends on nothing, moves zero production
  lines, and closes the habitat before the port pours 54 modules into that directory.
- `MF-T2B` on the same base, once MF-T2A lands.
- The shape of MF-T2C…MF-T2L, each compiling when its substrate lands.
- The §306.4a batch priced, with its soak obligation surfaced **before** an exposure discovers it.
- The family's law, if the preamble is signed — after which every later MF packet is shorter by
  the sections it stops duplicating.

**Does NOT unblock:** MF-T2M, MF-T2P and MF-T2S (chair ruling, §5.6); the generator tranches
(~9,900 effective lines); D3b activation; D4 light; the parity vertical slice; A0–A5; S9
frontage/parcel equivalence (carried, not dropped); the arrangement-quantum ladder (owner tuning
signature); the y-axis flip; and the twin-life retirement itself, which §5.5 asks the chair to
place.

**One thing a successor must not re-derive:** the codex embedder's `O(F · E log E)` face-start
scan, its 12.7× output-identical cure, and the ABI-scale sign flip that presents as a false angular
tie. All three are executed in `laneTCD3A-probe/` (`scale.mjs`, `scaleA.mjs`, `scaleC.mjs`,
`equiv.mjs`, `abiwall.mjs`, `abiwall2.mjs`, `byteneutral.mjs`) and re-run in seconds.

---

## §7 · ⚠ THE LEDGER HEAD MOVED MID-COMPILE — checked, not assumed

The ledger working tree's HEAD moved **twice while this lane was compiling**, by a sibling writer.
Caught by a closing re-check rather than by a notification, which is the shared-tree condition
working as documented:

```
$ git rev-parse HEAD          # at lane start: c5ba15e4 · at lane end: c64bf4b2
$ git log --oneline c5ba15e4..HEAD
c64bf4b2 §311: owner directive — the undercity is seeded, causal, and proportional …
18b1ca8c §310: fresh W3 seals … TC-D3A port compile dispatched
$ git diff --name-only c5ba15e4..HEAD
docs/OWNER_DECISION_QUEUE.md
docs/RESUME_STATE.md
```

**Impact assessment, executed:**

1. ⭐ **The BUILD base is untouched.** `git rev-parse 9d851fae^{commit}` →
   `9d851faeb7cac73217d508f621d1d9ee29f2c145`. Every measurement in §1 reads the build branch **by
   sha**, never through HEAD, so nothing in the plan or the packets is stale. This is why the
   read-by-sha discipline is worth its keystrokes.
2. **`18b1ca8c` committed §310** — the very row that dispatched this lane. §310 was a working-tree
   edit when this lane read it and is now committed. **Re-verified at the new HEAD:**
   `git show HEAD:docs/OWNER_DECISION_QUEUE.md | grep 'THE PORT WAVE (D3a) COMPILE'` resolves at
   line 13098. Every §310 quotation in the deliverables stands.
3. **The volume claim re-verified against the NEW HEAD**, not the old one:
   `git show HEAD:map-corpus/docs/GENERATION-SPEC.md | cmp -` still reports
   `differ: char 360486, line 4084`, and the ledger-HEAD blob is still
   `7dcd70abe85c85851cd3f381736c7a5fee59c8f6`. §P9's row and RAISED-3 are unchanged.
4. ⛔ **`c64bf4b2` is a NEW OWNER DIRECTIVE that postdates this lane's charter: §311, THE
   UNDERCITY.** It was read in full before this receipt closed. **Assessment: it does NOT change
   D3a's scope, and this lane deliberately did not expand to meet it.** §311.5 routes itself:
   *"this row is the design of record; the GENERATION-SPEC §13/§168 fold rides the next spec touch
   as one edit; implementation remains post-parity-slice content under §290.4 unless the owner
   promotes it."* §290.4's stop law is explicit that a conceivable adjacent case is not authority
   to enlarge the first tranche.

   **Three forward-compatibility notes recorded so a successor does not have to re-read §311 to
   find them** — none is a D3a scope change:

   - §311.3 runs **the high-water law underground** (*"dug is forever… abandoned galleries, sealed
     doors and flooded sections: the fossil vocabulary below ground"*). That makes MF-T2R's
     high-water evidence channels a **future vertical consumer**. ⚠ MF-T2R should not shape those
     channels in a way that forecloses a vertical axis — recorded as a design constraint on that
     member, not as extra scope.
   - §311.2 makes **every surface↔underground access a §287.5 two-endpoint portal with a surface
     cause.** §287.5's portal clause is *not* in §287.16's D3a massing list and this plan contains
     no portal member — correctly. §311 now names a downstream consumer for that record shape, so
     the member that eventually mints it has a stated requirement.
   - §311.1 names the licensing rule for **§287.4's fact-licensed `StrataExistencePlan`**, which
     §287.12 places at **D5/D6**, well past this tranche.

⛔ **Nothing in the deliverables was edited in response to §311**, and that is the point: a
directive routed by its own text to post-parity-slice implementation is not authority to widen a
wave that §290.4 has already fenced. If the owner promotes it, the plan's member roster is the
place that changes, and this note is where a successor will find the reason it did not change
today.
