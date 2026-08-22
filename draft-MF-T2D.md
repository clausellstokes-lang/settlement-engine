# Town cartography / MF-T2D — the boundary noder (the arrangement stage the kernel's contract requires, ported onto the kernel's own admission predicate)

- **Status:** DRAFT — compiled by lane TC-T2D (COMPILE seat, ODQ §332.4) for chair review. ⛔ Nothing
  lands before the §290 mandatory review stop; compiling is preparation, not landing (§332.4).
- **Packet version:** 1
- **Compile tip (pinned):** `claude/composite-r4` at `f5332cf70520a1cdef6cc326ae000acec118da85`
  (the MF-T2C landing). Every repo read in this draft was taken by `git show` against that SHA.
  ⚠ **The DISPATCH base is unknowable from here** — the §290 review stop sits between this compile
  and any executor. Every base figure below is marked `STOP: RE-DERIVE AT BASE`.
- **Depends on:** `MF-T2A` (the single-declaration law — LANDED, terminal `37fb6916`), `MF-T2B`
  (the ABI wall + `exactGeometry.js` — LANDED at `cdfe5a96`), and `MF-T2C` (the exact kernel this
  member feeds — LANDED at `f5332cf7`). All three bind; none is re-dispatched. ⛔ MF-T2C is a hard
  dependency in a way the plan did not price: A2's kernel-refusal capture exists only because the
  kernel's atomic check is now exact — the pre-T2C float check would MISS the same pair.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — **computed from the file at
  the pinned tip by this compile** (`git show f5332cf7:… | shasum -a 256`), matching the post-§324.5
  stamp. ⛔ **The executor recomputes at ITS base before any edit** — the file was re-stamped twice
  on 2026-08-21 and a further re-stamp is possible; a mismatch is a STOP, not a shrug. Its §P1
  refutations, §P2 hazard dispositions, §P3 anchor preflight, §P4 registration template, §P5 census
  law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are not restated.
- **Collision group:** `d3a-port` — this member reserves ONE shared D3a change path,
  `tests/lint/sovereigntyLightingContract.walker.test.js`. ⭐ It deliberately reserves NO path on
  `src/domain/townMap/fabric/index.js` and NO path on any existing production file (§7). Staged
  promotion, never simultaneous with another non-terminal D3a member on the census path
  (`CR-HB2B-SPLITP`; preamble §P7.11).
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the branch.
- **Baseline posture** (all `STOP: RE-DERIVE AT BASE`; the figures below are the compile-tip
  measurements, stated so the executor can see a shear): no `townMap` path carries a
  `scripts/.size-baseline.json` entry and none is on the hot-file list; the plain `src/domain/**`
  ceiling is 800 effective under `max-lines {skipBlankLines, skipComments}`; the fabric
  single-declaration walker is green (arriving names collide with nothing — §4); the census tuple
  and both typecheck floors are re-derived at base, never inherited (`BASE_STATE.json` remains
  inadmissible per §P8 unless re-stamped at the dispatch base).

> **`censusAuthorization`:** this packet moves the test census by two credited files, eight titles
> and two suite titles (delta derived in §9; base tuple `STOP: RE-DERIVE AT BASE`). Its authorizing
> decisions are **ODQ §312** (the D3a port dispatch that commissions this member) and **ODQ §332.4**
> (the chair's spawn of this compile: *"TC-T2D (the noder/arrangement member the T2C draft
> explicitly excludes)"*), plus a slot for the executing seat's own dispatch §, under the wave
> charter at **§310.4** and §299.4's binding-forward rule that a packet moving any census or
> ratchet names its authorizing decision in the packet body. The family's stamp is **GRANTED** at
> ODQ §312.2b, so `town-cartography` sits in the eight-member engine-train column.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository, so
> there is no commit to cite. This packet names its source by path **and SHA-256**, re-hashed by
> the implementing lane before any edit; **a mismatch is a STOP, not a merge.**
>
> | source (sealed W3 tip, `…/laneMFW3F-tip/src/domain/townMap/fabric/`) | SHA-256 |
> |---|---|
> | `fabricDcel.js` — the noder: `nodeSegments` (snap/split/dedupe passes), the ladder walk inside `buildBoundaryArrangement`, `gridCell`, and the constants `ARRANGEMENT_QUANTUM_LADDER` / `ARRANGEMENT_QUANTUM` | `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` |
>
> ⭐ The same bytes are additionally preserved IN THE REPOSITORY at
> `refs/preserve/map-sandbox-w3f-sealed` (`ee0db96d`), blob `bc1880a2` at the same relative path —
> this compile verified `git cat-file blob bc1880a2 | shasum -a 256` returns the identical digest,
> so the executor may hash either copy and must match this table either way. This is the same
> source module MF-T2C's header names; the hash matching T2C's table is itself evidence the sealed
> tip has not moved.
>
> The float intersection estimate (`segIntersect`) and nothing else is consumed from THIS TREE's
> `exactGeometry.js`, landed by MF-T2B — no second port of `fabricGeometry.js` occurs here.

---

## 1. Reconciled authority

1. **ODQ §303.5, the port boundary law, verbatim:** *"adopt the codex slice's RECORD SHAPES and
   its embedder's algorithm; do NOT adopt its arrangement compiler, census, or parcel registry (a
   single-fixture jig that throws on 8 of 17 real leaves). On the integer wall: D1's versioned ABI
   wins… the ported record shapes re-parameterize onto the ABI. This binds the D3a-era port
   packets."* ⭐⭐ **This member sits ON that boundary, and the boundary resolves as follows, from
   the text itself.** The three refusals are all *codex-side* machinery — "its" is the codex
   slice's. What is refused is the codex's arrangement COMPILER (the jig), never the arrangement
   STAGE: the adopted embedder's own contract states an atomically-noded precondition and enforces
   it with a throw, so *something* must produce noded input, and §303.5's own parenthetical names
   why the codex jig cannot be that something on real ground. The noding ALGORITHM therefore comes
   from the sandbox (§310.4: *"the sandbox fabric's algorithms re-expressed into the app-side
   foundation"*), while the noded boundary RECORD wears the codex row shape — canonical unique
   digest identity, canonical endpoint direction, the surface-leaf `support` record — so the landed
   kernel admits it verbatim. §2 names each capability IN or OUT under this reading.
2. **ODQ §332.4** — this compile's commission: the noder/arrangement member the MF-T2C packet
   explicitly excludes (*"No noder, no arrangement change — that is MF-T2D. This member's kernel
   still requires the atomically-noded input the codex contract states."*).
3. **Preamble §P1 R-MF-2** — every module deciding topology, ordering or identity from a product
   of ABI quanta uses BigInt, with the reason in the file. ⭐⭐ **EXECUTED AT THE PINNED TIP with a
   sharper mechanism than a float sign flip:** the landed `properCross` is float-PARAMETRIC — it
   classifies by the crossing parameter with `CROSS_EPS = 1e-9` — and on the on-grid pair
   `a=[0,0] b=[9007199000,1000]` × `c=[1000,−1000] d=[−9007189000,9007198000]` the exact crossing
   parameter is `1.109e−13`: strictly interior, but inside the eps band, so the predicate answers
   "not proper" and the sandbox noder leaves the pair un-split — while the landed kernel's exact
   check refuses exactly that output (`THROW 'DCEL boundaries must be atomically noded without
   crossings or overlaps'`, executed). At fixture-era scale the band is unreachable (the parameter
   of any integer crossing is ≥ ~2.5e−7 there), so **the divergence is the scale** — the R-MF-2
   story shape with an epsilon as the villain instead of an overflow.
4. **Preamble §P1 R-MF-1** — a port member prices complexity against real leaf sizes (town 11,603
   boundaries, metropolis 17,417). The sandbox's uniform-grid pair bucketing is therefore ported,
   not dropped: the naive pair loop is quadratic in the boundary count.
5. **ODQ §312.2c** — *"twin-life retirement fires when the DUAL-RUN EQUIVALENCE proves the
   app-side generator subsumes the sandbox — NOT at D3a-the-wave's seal."* This is why the codex
   arrangement jig is NOT retired, adapted, or touched here (§2's OUT list; plan staleness §13.1).
6. **ODQ §287.16 / §290.1 / §290.4** — dormant explicit input; live seeds byte-identical; the
   existence of a conceivable edge case is not authority to enlarge the tranche.
7. **ODQ §310.3(9) / preamble §P2.5** — the arrangement-quantum ladder's three rungs are owner
   tuning surface. This member PORTS the ladder and its first-zero-residual walk verbatim as the
   sandbox publishes them and chooses nothing (§6; RAISED-2).
8. **Live code decides.** Every load-bearing fixture below was EXECUTED at the pinned tip before
   any pin was written (preamble §P2.9): the sealed noder itself (driven read-only through
   `buildBoundaryArrangement` on a walls fixture), the landed kernel on noded and un-noded input,
   and a prototype of §6's exact-predicate design on all four seam fixtures. Captures in §4 and
   the compile receipt `laneTCT2D-receipt.md` §1.

**Resolved contradictions:**

- *The plan's member row says `boundaryArrangement.js` is "retired to a thin adapter or deleted"
  with a `retiredSymbols` row* — vs the landed tree, where `compileOrthogonalCrossCadastralArrangement`
  is replayed as an input validator by `dcel.js`, `fabricRoot.js` and `parcelRegistry.js`, and its
  sealed artifact is frozen by the digest-pin suite `tests/domain/townMapBoundaryArrangement.test.js`
  (one of the twelve suites MF-T2B/T2C hold as a STOP-if-moved control). **RESOLUTION: the codex
  jig is NOT touched. This member edits ZERO existing production files; `retiredSymbols` is
  EMPTY.** The jig remains the sealed v1 chain's own compiler exactly as `dcel.js` remained the
  sealed seal path in MF-T2C; its retirement is the twin-life act §312.2c places at dual-run
  equivalence, recorded as a carry, not taken. (Plan staleness — §13.1.)
- *The sandbox noder's letter (float `properCross`, crossings only)* — vs *the landed kernel's
  exact admission check (crossings, endpoint touches, collinear overlaps, duplicates)*.
  **RESOLUTION: the noder's cut predicate is the KERNEL'S OWN admission predicate, exact,
  inverted into cuts** — §6. Three witness classes were executed at the pinned tip proving the
  letter cannot feed the kernel: a T-junction (the sealed noder reports residual 0 and the kernel
  refuses its output), a collinear overlap (same), and the eps-band crossing of §1.3 (same). The
  prototype of the resolved design cures all three and the kernel embeds each output with Euler's
  identity holding. **JUDGMENT + RAISED-1, vetoable** — the fallback (port the letter, count the
  refusable shapes as diagnostics) is stated at §13.
- *The sandbox record stamps `artifactKind: 'CADASTRAL_BOUNDARY_ARRANGEMENT'` with
  `schemaVersion: 1`* — vs the landed sealed artifact of the SAME kind and version with a
  DIFFERENT shape, frozen by digest pins. **RESOLUTION: the noder's published record carries NO
  `artifactKind` and NO `schemaVersion`** — it is an in-memory derivation result (nothing is
  persisted or sealed), and a second shape wearing the sealed artifact's kind-and-version name
  would be a second truth. **JUDGMENT, vetoable** (RAISED-3).
- *The sandbox noder consumes a published fabric (`fabric.channels/walls/water`) and quantizes
  world-unit floats through `worldQ`* — vs *§287.16's dormant-explicit-input scope and the
  J-TCT2C-3 precedent (ABI quanta in; unit conversion stays the caller's)*. **RESOLUTION: the
  fabric-extraction half does NOT port here** — those record kinds have no app-side producer and
  belong to the generator tranches — **and the noder takes explicit integer-quanta segments,
  refusing non-integers through the landed `requireCanonicalInt` wall.** The task's binding line
  is honored structurally: the noder feeds the kernel exactly-noded integer input or refuses in a
  typed way; no float crosses its published surface.
- *The plan's §2.5 line "the port carries rung 0 unchanged as the ported value"* — vs the sealed
  source, whose own sweep table records that rung 0 alone leaves TWO real leaves un-noded while
  the ladder walk clears the corpus. **RESOLUTION: the ported value is the LADDER plus its
  first-zero-residual walk, verbatim** — a rung-0-only port would silently change the sandbox
  algorithm and re-introduce the fixed-point defect the ladder exists to cure. (Plan staleness —
  §13.3; RAISED-2.)

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the app-side fabric gains the arrangement stage the landed kernel's
contract requires and nothing today supplies: a pure noder that takes explicit boundary segments
in ABI integer quanta and returns an atomically-noded boundary set the landed
`derivePlanarDcelEmbedding` admits — proper crossings split at snapped intersections, endpoint
touches noded, collinear overlaps decomposed and deduplicated, endpoints snapped to the first
arrangement-quantum rung that nodes clean — with the rung used, the pass count, and every
residual published as data. The sealed artifact chain, every digest, and every live byte stay
exactly where they are.

**The IN/OUT boundary, named affirmatively (§303.5 applied):**

| capability | verdict | why |
|---|---|---|
| the noding passes: snap-to-rung, exact-crossing split, bounded passes, residual counting, dedupe | **IN** | the sandbox algorithm §310.4 orders re-expressed; the kernel's stated precondition |
| the quantum-ladder walk (first rung that nodes to zero residual; finest kept otherwise) | **IN** | part of the sandbox algorithm; measured load-bearing (rung 0 alone strands two real leaves) |
| the codex boundary ROW shape: digest `boundaryId`, canonical direction, `support` `{kind:'PLANAR_SURFACE', leafIndex: 0}` | **IN** | §303.5 record-shapes-in; it is what makes the output kernel-admissible verbatim |
| the integer wall (quanta in, quanta out; typed refusals on non-integers and on snap-past-wall) | **IN** | "D1's versioned ABI wins"; executed at §4 |
| published noding diagnostics (rung, passes, residual, splits, duplicates) | **IN** | the sandbox's own honesty design: "REPORTED rather than assumed away" |
| the codex arrangement compiler (`compileOrthogonalCrossCadastralArrangement`) and its sealed artifact | **OUT — untouched** | §303.5 do-not-adopt; sealed-chain load-bearing; retirement is §312.2c's dual-run act |
| the codex census machinery (the V24/E32/C1 jig; `dcel.js`'s seal census) | **OUT** | §303.5 do-not-adopt; the seal census is MF-T2C's landed subject |
| the parcel registry | **OUT** | §303.5 do-not-adopt; a later tranche |
| the fabric-extraction half of `buildBoundaryArrangement` (channels→kerbs via `offsetLine`, wall rings, water edges) | **OUT** | consumes sandbox fabric records with no app-side producer; ports with the generator tranches |
| `derivePlanarDcel`, `locateFace`, `faceRing`, `faceAdjacency`, `deriveBlockFaces` (S8 blocks-as-faces) | **OUT** | the embedder half is MF-T2C's landed subject; S8 equivalence is later work carrying §297.2b's water ruling |
| any arrangement-quantum rung choice, any tuning constant | **OUT** | §310.3(9) owner docket; the ladder ports verbatim and is equality-pinned |
| production wiring of the noder to the kernel, barrel export, any consumer | **OUT** | the member lands DORMANT; the acceptance battery is the only caller |

**Definition of done:** `boundaryNoder.js` exports `ARRANGEMENT_QUANTUM_LADDER` (verbatim) and
`nodeBoundarySegments`; the acceptance matrix passes with the landed kernel embedding every noded
fixture and refusing every un-noded control; the census is re-recorded; every digest pin and every
fabric-touching test result is unchanged.

**In scope:**

1. **One primary behavior** — the exact boundary noder (the cut predicate, the passes, the ladder
   walk, the codex-row adaptation are ONE behavior: an output missing any of them is refused by
   the kernel, executed at §4).
2. **One necessary integration path** — none in production; the writer-to-reader proof is
   test-side: the acceptance battery feeds the noder's output to the landed kernel (§9 A2/A3/A8).
3. **One prevention guard** — the independent-oracle arm: the tests recount crossings and touches
   over the published output with their own exact predicate, so the noder's own residual figure is
   never the only witness (the guard-the-guard shape of §P6).

**Explicit non-goals, named affirmatively:**

- ⛔ **No existing production file moves.** Not `boundaryArrangement.js`, not `dcel.js`, not
  `dcelEmbedding.js`, not the barrel. The MF-T2A sweep-plant anchor line
  (`export function derivePlanarDcelEmbedding(input) {` at column zero) and the
  `CURRENT_MAP_TRADITION_ID` non-import are preserved BY CONSTRUCTION — this member does not open
  that host — and §11 still carries both as STOPs in case a later revision of this packet does.
- ⛔ **No `retiredSymbols`.** Nothing retires at D3a (§312.2c). The codex jig's eventual
  retirement is a named carry.
- ⛔ **No consumer is wired; no barrel edit.** The noder is directory-internal, exactly as the
  landed kernel is (MF-T2C's J-TCT2C-4 precedent). The tranche that ports the fabric extraction
  wires and registers the composition.
- ⛔ **No sealed-artifact change, no persisted record family, no `artifactKind` stamp.** The
  noder's record is an in-memory derivation result (§1, resolved contradiction 3).
- ⛔ **No rung choice, no tuning constant, no pass-cap change.** The ladder `[1000, 5000, 25000]`
  and the pass bound 14 port verbatim and are pinned by equality; both stay exactly the sandbox's
  published values. The rung used at runtime is selected by the SANDBOX'S OWN deterministic rule
  (first zero-residual), which is an algorithm, not a lane's tuning act (RAISED-2).
- ⛔ **No collinear-overlap MERGE machinery beyond split-and-dedupe**, no rational-exact split
  points, no multi-leaf support, no y-flip, no height, no `FABRIC_COORDINATE_ABI` motion, no
  dependency bump.
- ⛔ **No claim about real-leaf noding.** The sandbox corpus figures (residual sweeps, 18-leaf
  results) are the sealed tip's evidence; this member's claims are its executed fixtures only.
  The dual-run over real leaves is the later equivalence gate's work.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` — the noded set is in-memory | ≤1 |
| Named state writers | `0` | ≤1 |
| Feature flags | `0` | ≤1 |
| User-facing surfaces | `0` | ≤1 |
| Direct production consumers | `0` | ≤2 |
| New logic-bearing production leaves | `1` — `fabric/boundaryNoder.js` | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `0` — deliberately no barrel edit | ≤3 |
| Handwritten files total | `5` (1 src · 2 acceptance · 1 census re-record · this packet) | ≤12 |
| New/changed effective production lines | **≤ `230`** (measured basis §4.4: port region 107 + priced adaptations ≈ 160–190 estimated) | ≤400 |
| Effective lines per new leaf | **≤ `210`**, measured with eslint's own `Linter` at implementation | ≤250 |
| Delta in a shared/hot file | `0` — no manifest path is on the hot-file list (`STOP: RE-DERIVE AT BASE`) | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. The member fits its caps with room; **no MF-T2E seed
file was written** — the plan's member 4 scope closed inside one packet.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- MF-T2D
```

Then, before any edit — every row re-executed at the dispatch base; nothing inherited from this
compile, from the capsule, or from a sibling packet:

| # | Check | Compile-tip result (executor re-derives) |
|---|---|---|
| 0 | `shasum -a 256 docs/implementation/preambles/MF-PREAMBLE.md` | `0706aad6…1db4ed` at `f5332cf7`; **recompute — a third re-stamp is possible** |
| 1 | port source re-hash: the sealed-tip `fabricDcel.js` AND `git cat-file blob bc1880a2` (refs/preserve) | both `01da024a…197b` — MATCH REQUIRED, either copy |
| 2 | name-collision scan: `git grep -nE 'ARRANGEMENT_QUANTUM\|nodeBoundarySegments\|boundaryNoder\|residualProperCrossings\|duplicatesDropped\|nodingPasses\|arrangementQuantum' -- src tests` | **zero hits** at `f5332cf7`; the arriving names collide with nothing |
| 3 | `npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js ; echo TRUE_EXIT=$?` | green at the tip; `STOP: RE-DERIVE AT BASE` (fabric file/name denominators moved at every landing) |
| 4 | the twelve digest-pin suites + every other fabric-touching test file (re-derive the list at base by grep over `tests/` for `townMap`), captured BEFORE the first edit | the untouched-pin control's before-arm; per-file counts recorded in the lane receipt |
| 5 | the census tuple | `STOP: RE-DERIVE AT BASE` by placeholder-and-convict |
| 6 | `npm run typecheck:ratchet` and `npm run typecheck:domain:strict`, floors by name and window | `STOP: RE-DERIVE AT BASE`; no `townMap` key in either baseline means zero allowed debt for the new leaf |
| 7 | §P2.9 unedited-substrate captures — the four kernel-refusal controls, re-executed at base BEFORE pins are written | see §4.2 |

### 4.2 · The compile-tip captures this packet's pins are written FROM (re-execute all at base)

Executed by this compile at `f5332cf7` (probe tree assembled from `git show` blobs; sealed noder
driven read-only from the hash-verified tip; drivers and logs in the scratchpad probe directory):

```
P0  sealed noder, two crossing square walls  -> raw=8 noded=12 quantum=1000 passes=2 residual=0
                                                splits=8 dups=0, all coordinates on-grid
P0b sealed noder row shape                   -> keys [boundaryId, geometry, lineKey, role,
                                                sourceId]; NO support; canonical direction 6/12
                                                — the adaptation of §6 is load-bearing, measured
P1  P0's rows adapted (direction+support)    -> landed kernel EMBEDS: V=10 E=12 F=4 C=1,
                                                V−E+F = 1+C, kinds {BOUNDED:3, EXTERIOR:1}
P2  the SAME fixture un-noded                -> landed kernel THROW
                                                'DCEL boundaries must be atomically noded…'
P3  collinear overlap pair, on-grid          -> landed properCross = false (no split, no count);
                                                landed kernel THROW (same message)
P5  the eps-band pair (§1.3)                 -> exact parameter 1.109e−13 < CROSS_EPS 1e-9;
                                                landed properCross = false; landed kernel THROW
P8  T-junction (stub ending ON an edge)      -> sealed noder: residual=0, splits=0, edge left
                                                WHOLE; landed kernel THROW on its output
P6  snap-past-wall arithmetic                -> MAX_WORLD_UNITS snapped at rung 25000 lands 746
                                                past the wall; landed requireCanonicalInt refuses,
                                                naming the range
P9  prototype of §6's design on all four     -> squares: parity with the sealed noder (12 rows)
    fixture classes                             + kernel EMBEDS · T-junction: split, EMBEDS ·
                                                overlap: 3 runs + 1 duplicate dropped, EMBEDS ·
                                                eps-band pair: split, EMBEDS · re-noding the
                                                output: fixed point (passes=1, splits=0)
```

⭐⭐ **P8 + P3 + P5 are the compile's sharpest finding: the sealed noder's `residual = 0` does NOT
imply the landed kernel's precondition.** Three input classes the real fabric plausibly produces
(a kerb ending at a wall IS a T-junction) pass the sealed noder untouched and are refused by the
kernel. §6's design closes all three, executed at P9.

### 4.4 · The effective-line basis (compile-tip measurement; executor re-measures)

The port region of the sealed source — `nodeSegments` (75), the ladder walk (21), `gridCell` (6),
`key2` (1), the orientation-sign shape (4) — measures **107 nonblank/noncomment lines** (per-range
count over the hash-named file). The §6 adaptations price at roughly +60–80: input validation via
the landed `foundation.js` validators, the exact cut predicate (orientation signs + between + the
endpoint-on-interior arm), canonical direction + `support` + digest ids, the snap-past-wall
re-validation, and the diagnostics record. The leaf budget is a hard **210** effective, measured
with eslint's own `Linter` at implementation — never `wc -l`, never this table.

## 5. Verified tree contract

| Role | File | Symbol | Verified fact at `f5332cf7` | Required use |
|---|---|---|---|---|
| The kernel this member feeds | `src/domain/townMap/fabric/dcelEmbedding.js` | `derivePlanarDcelEmbedding` | requires unique digest-id boundaries, canonical direction (`comparePoint(line[0], line[1]) < 0`), a single `{kind:'PLANAR_SURFACE', leafIndex: 0}` support, and atomic noding enforced by an exact BigInt pairwise check | ⛔ **NOT EDITED.** The acceptance battery imports it as the reader half of the writer-to-reader proof |
| ⛔ The sweep-plant anchor | `scripts/mutation-sweep.sh` | entry 28a | plants on the kernel's exported signature line at column zero | not touched by this member; §11 keeps the guard in case a revision opens the host |
| The float estimate consumed | `src/domain/townMap/fabric/exactGeometry.js` | `segIntersect` | float intersection point; error at wall scale measured ~1 quantum (P7), far inside the half-rung snap tolerance | the split-point ESTIMATE only. ⛔ `properCross` (float-parametric, `CROSS_EPS` band) is NOT the cut predicate — §1.3's executed divergence |
| The integer wall | `src/domain/townMap/fabric/foundation.js` | `requireCanonicalInt`, `requireCanonicalId`, `requireCanonicalRecord`, `FABRIC_COORDINATE_ABI` | defaults `±MAX_WORLD_UNITS` (MF-T2B); the version string is READ for the digest-id shape, never moved | the noder's input refusals and its post-snap re-validation; no second validator spelling |
| The id digest | `src/domain/townScene/stableScene.js` | `sceneDigest` | the codex jig's own `boundaryId` shape: `cadastral-boundary:<sceneDigest({coordinateAbiVersion, settlementId, geometry})>` | adopted verbatim (record-shapes-in) |
| The untouched jig | `src/domain/townMap/fabric/boundaryArrangement.js` | `compileOrthogonalCrossCadastralArrangement` | replayed by `dcel.js`/`fabricRoot.js`/`parcelRegistry.js`; digest-pinned by `tests/domain/townMapBoundaryArrangement.test.js` | ⛔ **forbidden file** — zero bytes move |
| The standing law | `tests/lint/townMapFabricSingleDeclaration.walker.test.js` | the fabric single-declaration law | green; arriving export names collide with nothing (§4.2) | binds the two arriving exports |
| Census | `tests/lint/sovereigntyLightingContract.walker.test.js` | `const CENSUS = Object.freeze({` | the five-figure tuple, SEQUENCED | re-record all five together with cause + authorization |
| Test precedent | `tests/domain/townMapCoordinateAbi.test.js` + `tests/property/townMapCoordinateAbiDeterminism.test.js` | MF-T2B's two-file proof shape | the family's domain-matrix + determinism-companion form | **copy this proof shape** |
| Anchor helper | `tests/helpers/anchoredNegatives.js` | `expectAbsentWithAnchor`, `expectPresentThenAbsent` | the negative-assertion route | by name on the same line, per §P3 |

**Forbidden alternatives:** no edit to any existing production file; no second noder, no second
crossing predicate spelling exported, no rational-arithmetic split points; no `artifactKind` or
`schemaVersion` on the published record; no barrel edit; no `export *`; no import of the sealed
sandbox tree from any app file, ever; no `test.each`, no `describe.runIf`, no loop-generated
tests; no files outside the manifest.

## 6. Exact contracts

### The noder — `nodeBoundarySegments(input)`

```js
// src/domain/townMap/fabric/boundaryNoder.js
export const ARRANGEMENT_QUANTUM_LADDER = Object.freeze([1000, 5000, 25000]);
// ^ ported VERBATIM from the sealed source; owner tuning surface (ODQ §310.3(9)); pinned by
//   equality in A8; no rung is chosen here and no override door exists.

export function nodeBoundarySegments(input)
// input : { settlementId, segments: [{ a: [xQ, zQ], b: [xQ, zQ], role, sourceId }] }
//         coordinates are ABI integer quanta, validated through requireCanonicalInt (the landed
//         ±MAX_WORLD_UNITS wall); role and sourceId are canonical non-empty strings; a
//         zero-length segment AFTER snapping is dropped, never an error.
// returns (frozen, in-memory — nothing persisted, nothing sealed):
{
  coordinateAbiVersion,            // FABRIC_COORDINATE_ABI, read never moved
  settlementId,
  boundaries: [{                   // the codex ROW shape, kernel-admissible verbatim:
    boundaryId,                    //   `cadastral-boundary:${sceneDigest({coordinateAbiVersion,
                                   //     settlementId, geometry})}` — the jig's own id shape
    role, sourceId,                //   pass-through lineage (first occurrence wins at dedupe)
    support: { kind: 'PLANAR_SURFACE', leafIndex: 0 },   // the single-leaf era, stamped
    geometry: [a, b],              //   canonical direction: comparePoint(a, b) < 0
  }],                             // sorted by boundaryId (codepoint), stable
  rawSegmentCount,
  arrangementQuantum,              // the rung the walk selected
  arrangementQuantumLadder,        // the ladder, restated as data
  nodingPasses, residualProperCrossings, splitCount, duplicatesDropped,
}
```

### The algorithm (bounded; the port with its two named divergences)

```text
1. LADDER WALK (ported verbatim): for each rung q in ARRANGEMENT_QUANTUM_LADDER, run the noding
   pass at q; the FIRST rung reaching residualProperCrossings === 0 wins; if none does, the
   FINEST attempt is kept and its residual is published honestly.
2. NODING PASS at rung q (ported shape; pass cap 14, internal, verbatim):
   a. snap BOTH endpoints of every segment to the rung grid (Math.round(v/q)*q); drop zero-length;
      re-validate every snapped coordinate through requireCanonicalInt — a near-wall input whose
      snap leaves the wall is REFUSED with the landed range message, never emitted (P6).
   b. bucket segments on the uniform grid (gridCell = mean manhattan extent, ported) so pair work
      stays local (R-MF-1).
   c. for each bucket pair, decide with THE KERNEL'S OWN ADMISSION PREDICATE, EXACT — divergence 1:
      · orientation signs in BigInt (products of quanta leave float exactness; R-MF-2, and the
        executed eps-band divergence of §1.3);
      · a PROPER crossing is strict interior by four sign tests (no epsilon band) → split both
        segments at the snapped float-estimate intersection (segIntersect; estimate error ≪
        half-rung, measured); a null estimate leaves the pair counted in the residual;
      · an ENDPOINT-ON-INTERIOR touch (exact collinearity + strictly between) cuts the
        run-through segment at that endpoint — divergence 2, the arm that nodes T-junctions AND
        decomposes collinear overlaps into runs the dedupe then collapses (P9: all executed).
   d. apply cuts ordered along each segment's dominant axis (ported), loop until no cuts or the
      pass cap.
3. DEDUPE by unordered endpoint pair (ported): first occurrence wins; duplicatesDropped counts.
4. CANONICALIZE: endpoint order per row (comparePoint < 0), digest boundaryId, support stamp,
   codepoint sort by boundaryId. Freeze.
```

### Absence and refusal rules

- non-record input, missing `settlementId`, mis-shaped segment, non-integer or out-of-wall
  coordinate, empty `role`/`sourceId`: **typed TypeError through the landed validators**, naming
  the offending label — the family's refusal convention; never `NaN`, never a silent skip.
- `segments: []`: returns the record with `boundaries: []`, `residualProperCrossings: 0`, no throw.
- a segment zero-length after snapping: dropped; visible as `rawSegmentCount` minus surviving rows.
- a pair the passes cannot node at any rung: kept, counted in `residualProperCrossings`, published
  — the kernel remains the fail-closed judge of such output.

### Determinism

- Pure over its arguments; integer and BigInt arithmetic plus the float split ESTIMATE that is
  snapped before publication; no clock, no randomness, no locale ordering (the determinism
  companion scans the leaf's raw text with a positive control).
- Output identity is input-order-free EXCEPT the deduped survivor's `role`/`sourceId` (first
  occurrence wins — the ported rule, stated); ids are geometry digests, so re-noding the same
  geometry reproduces the same ids (A5's fixed point).
- No hash-order dependence: rows sort by `boundaryId` codepoint; cuts sort along the segment.

### Flag, dormancy, lifecycle, receipts

- Flag: `NONE`. Golden posture: **unchanged and PROVEN unchanged** — the untouched-pin control
  (§10) plus the post-build fence and forensic zoom (§P2.2, post-§324.5 form).
- Lifecycle: pure derivation, in-memory; ⛔ nothing persisted, so no reload/regen/undo/migration
  seam exists to declare. Public veil: n/a — no runtime surface.
- Receipts/privacy: closed kinds `NONE`; DM-only fields `NONE`.
- Alignment: `DECLARED EMPTY: a geometry noder has no alignment surface.`
- Edit story: `ENGINE-ONLY: pure derivation; nothing is DM-editable and nothing is proposed.`

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/townMap/fabric/boundaryNoder.js` | `ARRANGEMENT_QUANTUM_LADDER`, `nodeBoundarySegments`, internal helpers | **≤210 eff** | The §6 contract, ported against `fabricDcel.js` at the header SHA. Imports ONLY: `sceneDigest` (townScene), `segIntersect` (exactGeometry), `compareCodepoint` (deterministicSort), the foundation validators + `FABRIC_COORDINATE_ABI`. ⛔ The cut predicate is internal and exact; the module docblock carries the R-MF-2 reason and the three executed seam classes |
| `CREATE` | `tests/domain/townMapBoundaryNoder.test.js` | `describe('MF-T2D boundary noder')`, A1–A6, A8 | `n/a` | ONE literal `describe`, seven straight-line `test()` calls, string-literal titles; fixtures built inside named tests (SP-D idiom) |
| `CREATE` | `tests/property/townMapBoundaryNoderDeterminism.test.js` | `describe('MF-T2D boundary noder determinism')`, A7 | `n/a` | The replay companion, matching MF-T2B's property-file shape |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` object | `+12/−1` | ONE re-record block naming its cause and the `censusAuthorization` refs; all five figures re-derived together at the base by placeholder-and-convict |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2D.md` | this packet | `n/a` | The packet, its status transitions, and its §12 landing record |

Generated artifacts: `NONE`. No other file may be edited. ⚠ The two acceptance files are `CREATE`
rows, not `TEST` rows (a `TEST` path must exist at every status — the MF-T2B measured precedent).
⚠ No `tests/lint/**` file is minted, so §P3b's mutation-coverage row does not attach to this
member. §P4's four-name template is satisfied by its "reason none exists" arm, copied from the
MF-T2C precedent: the noder is directory-internal, the barrel deliberately does not export it, and
the registry tests that bind this member are the single-declaration walker and the entry-closure
fence. **Symbols the deliverable CREATES** (`nodeBoundarySegments`, `ARRANGEMENT_QUANTUM_LADDER`,
the two describe titles) join `requiredSymbols` **at the flip to LANDED, never at READY** — the
validator resolves rows against the live tree at every status. `retiredSymbols`: **EMPTY** (§1).

## 8. Ordered coding sequence

0. Dispatch and seal; run every §4 preflight. STOP on any mismatch, including a source-hash or
   preamble-hash mismatch.
1. **Capture the golden/dormancy evidence BEFORE the first edit:** the full fabric-touching test
   battery counts; the census tuple; and the §4.2 kernel-refusal controls re-executed at the base
   (P2, P3, P5, P8 shapes) — the pins of A1–A8 are written FROM these captures and from the
   implemented noder's own printed output, never from this packet's historical figures.
2. Add the smallest failing focused test (A1's main arm against the not-yet-existing module).
3. Implement `boundaryNoder.js` per §6 — validation first, then the exact predicate, then the
   pass/ladder machinery, then the row adaptation.
4. — (no writer, no lifecycle seam)
5. — (no production consumer; the tests are the named reader)
6. — (no registration; §7's "reason none exists" arm)
7. Focused verification (§10), including the anchor preflight, the independent-oracle arms, and
   the untouched-pin control.
8. The removing-power sweep (§10's mutants), the census re-record, the post-build dormancy
   discharge with forensic zoom, then the wave-end gate and the completion receipt (§12).

## 9. Acceptance matrix

Every negative carries a positive control in the same test. The **capture** column is behavior
executed at the pinned tip by this compile (§4.2); the executor re-captures at its base.

| ID | Case | Fixture/input | Capture | Required observation | Home |
|---|---|---|---|---|---|
| **A1** | Main behavior — a proper crossing is noded and the output wears the admissible row shape | the two crossing square rings (quanta; P0's fixture) | sealed-noder parity figures: 12 rows, quantum 1000, residual 0 | 12 boundaries; positive control FIRST: the tests' own exact recount finds 2 proper crossings in the RAW input, then 0 in the output (the independent oracle); every row: canonical direction, digest id shape, the exact `support` record, on-grid integer coordinates; `arrangementQuantum === 1000`; splits and duplicates counted | domain |
| **A2** | ⭐⭐ The named historical regression — the eps-band crossing (§1.3) | `a=[0,0] b=[9007199000,1000]` × `c=[1000,−1000] d=[−9007189000,9007198000]` | landed float predicate answers not-proper; landed kernel THROWS on the un-split pair | the counterforce with its control: the RAW pair fed to the landed kernel still throws the atomic message (re-captured at base); the NODER splits it (the snapped cut merges into the shared endpoint) and the landed kernel EMBEDS the output with `V−E+F === 1 + componentCount`; an ordinary crossing (A1's) is split by both predicate spellings — the divergence is the scale | domain |
| **A3** | ⭐ T-junction — an endpoint touching another segment's interior | the square ring + the stub ending ON the bottom edge (P8's fixture) | sealed noder leaves the edge WHOLE (residual 0, splits 0); landed kernel THROWS on that shape | positive control FIRST: the un-noded shape fed to the kernel throws the atomic message; the noder cuts the edge at the touch and the kernel EMBEDS (V=6 E=6 F=2, Euler holds); the touch point appears as a shared endpoint in exactly three rows | domain |
| **A4** | Collinear overlap + exact duplicate — decomposed, deduped, counted | `[0,0]→[2000,0]` with `[1000,0]→[3000,0]`; plus one segment supplied twice | landed kernel THROWS on the raw overlap | three collinear runs, `duplicatesDropped === 1`, kernel EMBEDS; the doubled-segment input yields ONE row with `duplicatesDropped === 1`; first-occurrence-wins on the survivor's `sourceId` asserted as the ported rule | domain |
| **A5** | Idempotence — re-noding noded output is a fixed point | A1's output rows fed back as input segments | P9: passes 1, splits 0, residual 0, count preserved | identical `boundaries` (ids stable because they digest geometry), `splitCount === 0`, `nodingPasses === 1`, `residualProperCrossings === 0` | domain |
| **A6** | Refusals — typed, never floats, never silent | a non-integer coordinate; an out-of-wall coordinate; a missing `settlementId`; an empty `role`; an empty segment list | P6 recorded the wall's refusal message shape at the landed validator | each bad input throws a TypeError naming its label (the landed validators, so the range message is the wall's own); the empty list returns the empty record with zero residual, without throwing. ⚠ The post-snap wall re-validation inside the passes is DEFENSIVE at the finest rung — §4.2's P6 shows it reachable only on the coarse-rung path, which no deterministic fixture this compile could force — so, per the §328.1 defensive-vocabulary precedent, NO test claims to reach it and NO mutant targets it; the executed P6 arithmetic lives in the module docblock as its reason | domain |
| **A7** | Determinism / replay + purity | every fixture above run twice; the leaf's raw text | P4: sealed-noder replay identical (the ported machinery is replay-stable) | byte-identical results across two runs (plain JSON — no BigInt crosses the published record); the source scan finds no clock/randomness/locale identifier, with a positive control proving the scan sees a planted occurrence | property |
| **A8** | Correctness at scale + the ported-value pins | a deterministic synthetic grid built inside the test (20 long verticals × 20 long horizontals ⇒ 400 proper crossings) PLUS one long diagonal whose crossings fall OFF the rung grid, plus the constants | P9's grid-family behavior; wall clock is receipt evidence only | noded to `residualProperCrossings === 0` at the finest rung; the independent recount over the output is 0; **every published coordinate is an integer multiple of the selected rung** (the off-grid diagonal crossings are what make this arm non-vacuous — an axis-parallel-only grid crosses exactly on-grid and could not see an un-snapped split); the landed kernel EMBEDS with `V−E+F === 1 + componentCount`; `ARRANGEMENT_QUANTUM_LADDER` deep-equals `[1000, 5000, 25000]` (the ported-value pin, MF-T2B's ANGLE_TABLE_SIZE precedent); ⛔ NO wall-clock assertion | domain |

**Anchor law (§P3):** A1, A6, A7 and A8 assert absences (no crossing remains, no override door,
no forbidden identifier, nothing outside the wall). Each routes through
`tests/helpers/anchoredNegatives.js` by name on the same line, or carries
`// anchored: <why this cannot go vacuous>` on the assertion line or the line immediately above.

**Census motion — derived from the case count, re-derived at base:**

```
DELTA: +2 files · +0 parked · +2 credited · +8 titles (7 domain + 1 property) · +2 suites
BASE and AFTER tuples: STOP: RE-DERIVE AT BASE by placeholder-and-convict, all five together
```

⛔ `parked` stays at its recorded value. One literal `describe` per file, straight-line `test()`
calls, string-literal titles; loops live INSIDE named tests. ⚠ **NAMED INTERIOR RED:** the census
arm is an exact equality against a recorded constant, so this member reds at its own
implementation commit until the tuple is re-recorded; the census is SEQUENCED, so the `files` red
is itself proof the later figures had not yet been read.

## 10. Verification commands — the gate skeleton

```sh
# Anchor preflight — MANDATORY per new test file, BEFORE the member proof is declared green
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# Focused static + both typecheck configurations, by name and window
npx eslint src/domain/townMap/fabric/boundaryNoder.js \
           tests/domain/townMapBoundaryNoder.test.js \
           tests/property/townMapBoundaryNoderDeterminism.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict

# Effective-line ledger against §3 — eslint's own Linter, never wc -l

# Focused tests — one slot, one command
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/townMapBoundaryNoder.test.js \
  tests/property/townMapBoundaryNoderDeterminism.test.js \
  tests/lint/townMapFabricSingleDeclaration.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

# ⭐ THE UNTOUCHED-PIN CONTROL — the twelve digest-pin suites PLUS every other fabric-touching
# test file (list re-derived at base), identical counts before the first edit and after the last.
# This member adds a leaf; it must move NOTHING that already exists.

# ⭐ THE REMOVING-POWER SWEEP — eight mutants, planted in a scratch copy, each convicting a NAMED
# branch, each restored by byte copy verified with cmp (never the git checkout -- family):
#   M1 cut predicate := the landed float properCross      -> A2 (the eps pair rides through and
#                                                             the in-test kernel call throws)
#   M2 endpoint-on-interior arm deleted                   -> A3 (kernel refuses the T-junction)
#   M3 dedupe deleted                                     -> A4 (kernel refuses the duplicate)
#   M4 canonical-direction sort dropped                   -> A1 (kernel refuses the direction)
#   M5 support stamp wrong                                -> A1 (kernel names the support rule)
#   M6 ladder walk keeps the coarsest attempt             -> A1/A8 (published quantum moves)
#   M7 input validation removed                           -> A6 (a non-integer input then snaps
#                                                             quietly and an out-of-wall input is
#                                                             emitted; both expected throws vanish)
#   M8 split points published un-snapped                  -> A8 (the diagonal's off-grid crossing
#                                                             publishes a non-multiple coordinate
#                                                             and the digest ids move)
# Pristine-green control before, clean re-run after; every conviction quotes its failing arm.

# ⛔ Dormancy: POST-BUILD ONLY (§P2.2 post-§324.5). Build first, then:
npm run build
VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js ; echo TRUE_EXIT=$?
# …and the forensic zoom: a string literal unique to the leaf (the refusal text or
# 'residualProperCrossings') appears in ZERO entry-closure chunks and in a lazy chunk elsewhere
# in dist/, with scanner controls asserted present. An absence over a denominator that does not
# contain the surface proves nothing (§P2.12); name the denominator.

# Sealed receipt and exact-state handoff; neither is landing authority
npm run check:packet -- MF-T2D
npm run implementation:resume -- MF-T2D

# Wave-end — BARE, fresh shell, never piped, never wrapped, and OUTLAST it in your own turn
npm run check:tail ; echo TRUE_EXIT=$?
```

⛔⛔ **NEVER wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
self-deadlocks; **exit 3 is the mutex giving up, not a red.** ⚠ Trust no exit status you did not
capture. ⚠ Report both typecheck configurations by name and window; a ratchet being green is
evidence only about that ratchet. Expected: every command exits `0`; report actual counts, never
this packet's historical ones.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and preamble §P7:

- any digest pin, exact-key pin or pinned roster in the twelve suites moves, or any
  fabric-touching test file changes its result between the §8-step-1 and §10 captures — this
  member is purely additive and a moved pin means it was not;
- any existing production file would need editing — including `boundaryArrangement.js`,
  `dcel.js`, `dcelEmbedding.js`, `exactGeometry.js`, `foundation.js` and the barrel; the cure for
  any such need is a STOP-and-report, never a manifest widening;
- the `export function derivePlanarDcelEmbedding(input) {` line changes in ANY byte, or
  `CURRENT_MAP_TRADITION_ID` becomes imported or declared in any file this member creates;
- the port source's SHA-256 does not match the header table (either copy), or the family
  preamble's hash does not match a fresh computation at the base;
- any value of `ARRANGEMENT_QUANTUM_LADDER` differs from the sandbox's published triple, a rung
  would be added or removed, a quantum override parameter would be exposed, or the pass cap would
  move — the tuning docket owns all of it;
- the eps-band pair does NOT throw through the landed kernel at the §8-step-1 capture (the base
  moved under the member — re-derive, do not adapt);
- a published coordinate would leave the ABI wall, or a non-integer would cross the published
  surface;
- the single-declaration walker reds, or an arriving export name collides with a live one;
- a wall-clock assertion would be needed to make any credited test meaningful;
- the census moves by other than the §9 delta against the tuple captured at §8 step 1, or
  `parked` moves at all; a delta smaller than the titles added is attributed by reverting one
  test file at a time, never accepted as arithmetic;
- `tests/build/townMapLazy.test.js` reds POST-BUILD, or the forensic zoom finds a member-unique
  literal in an entry chunk;
- another D3a member is simultaneously non-terminal on
  `tests/lint/sovereigntyLightingContract.walker.test.js`;
- any ratchet, baseline, budget or ceiling would need raising; any tuning constant of any kind
  would be touched.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into
the next wave.

## 12. Completion receipt

*(filled at the flip to LANDED)*

---

## 13. Plan staleness and RAISED — for the chair at review

**Plan staleness ledger** (`draft-D3A-PLAN.md` was compiled at `9d851fae`, before members 1–3
landed; each divergence named, none silent):

1. **Plan §4's MF-T2D row is REFUTED at the landed tree in its central instruction.** It orders
   `boundaryArrangement.js` "retired to a thin adapter or deleted" with a `retiredSymbols` row.
   At `f5332cf7` the codex jig is load-bearing in the sealed chain (replayed by three modules;
   digest-pinned by one of the twelve frozen suites), and §312.2c places retirement at dual-run
   equivalence, not at D3a. This packet edits zero existing files and retires nothing.
2. **Plan §1's mapping of codex `dcel.js` ("the census; superseded") to this member is stale:**
   MF-T2C already extended `dcel.js` and kept its census as the seal path's own guard. Nothing
   remains there for this member.
3. **Plan §2.5's "the port carries rung 0 unchanged as the ported value" is imprecise against the
   sealed source:** the ported value is the LADDER plus its first-zero-residual walk; the source's
   own corpus sweep shows rung 0 alone leaves two real leaves un-noded.
4. **Plan §4's census delta (+6 titles) is superseded by the derived +8** — the same
   count-from-the-actual-tests correction MF-T2B (+6→+7) and MF-T2C (+6→+8) each recorded.
5. **Plan §9.3's shared-path list ("every member touches `fabric/index.js`") does not apply:**
   like MF-T2C, this member reserves only the census walker, shrinking the staged-promotion
   surface.
6. **The plan's ~180-effective estimate for the leaf is replaced by a measured basis** (§4.4:
   port region 107 + priced adaptations; hard cap 210).
7. **Stamp/preamble rows are already discharged** (stamped at §312.2b; preamble landed and twice
   re-stamped; this draft cites the live hash and orders a recompute).

**RAISED:**

| # | the call | this lane's recommendation |
|---|---|---|
| **1** | ⭐⭐ **The cut predicate diverges from the sandbox letter**: exact strict-interior crossings (no eps band) plus the endpoint-on-interior arm, i.e. the kernel's own admission predicate inverted into cuts. Three executed witness classes at the pinned tip show the letter's output being refused by the landed kernel (T-junction, collinear overlap, eps-band crossing), and the prototype of the divergent design cures all three with Euler holding. | **Adopt.** The member's charter is producing kernel-admissible input, and the letter measurably cannot on shapes real fabric produces (a kerb ending at a wall is a T-junction). Fallback if refused: port the letter and publish per-class diagnostics — the member then feeds the kernel only crossing-free, touch-free, overlap-free input and says so. |
| **2** | **The ladder + walk ported verbatim is classified as carrying the ported value, not as a rung choice.** The rung VALUES stay on the owner's tuning docket (§310.3[9]); the walk is the sandbox's own deterministic algorithm; A8 pins the triple by equality. | Confirm the classification (the §328.4 BOUNDARY_EPS_Q pattern). If the chair reads the walk itself as tuning surface, the member BLOCKS on the tuning docket and this draft says where the line sits. |
| **3** | **The published record carries no `artifactKind`/`schemaVersion`** — an in-memory derivation result, not a second 'CADASTRAL_BOUNDARY_ARRANGEMENT' truth beside the sealed one (the sandbox stamps that exact kind-and-version pair on a different shape; adopting it would collide with the frozen artifact's name). | Adopt. Alternative: mint a distinct kind token now — refused as premature naming for a record only tests consume. |
| **4** | **No barrel registration** (MF-T2C's J-TCT2C-4 precedent): the noder stays directory-internal until the tranche that ports the fabric extraction wires the composition; shared-path surface shrinks to the census walker alone. | Confirm. |
| **5** | **The post-snap wall re-validation is DEFENSIVE and unpinnable.** This compile's skeptic pass proved the arm unreachable at the finest rung (any in-wall input snaps in-wall at rung 1000; P6's overflow needs the coarse-rung path, which only an at-fine-rungs-un-nodable fixture can force, and no deterministic construction of one is known — the sandbox found such shapes only in its real corpus). The draft therefore keeps the re-validation as cheap defense, pins nothing over it, and targets no mutant at it (§328.1's defensive-vocabulary pattern; a mutant there would be the vacuity class §P6 forbids). | Accept. Alternative — delete the defensive arm entirely — refused: the coarse-rung path is real (P6's arithmetic), just not deterministically forceable, and an emitted out-of-wall coordinate would surface as a kernel refusal far from its cause. |
| **6** | **Real-leaf noding claims are explicitly out of scope** — the sandbox corpus results stay the sealed tip's evidence; the dual-run equivalence gate (later work, §312.2c) is where the ported noder meets real leaves. | Record the carry. |
