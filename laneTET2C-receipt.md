# laneTET2C-receipt.md — execution receipt for MF-T2C (D3a member 3)

Lane **TE-T2C**, EXECUTOR seat. Worktree
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/tet2c-tree`,
detached at the dispatch base. No ref moved; the main worktree untouched.

## §0 · Base and provenance

- **Dispatch base:** `fb80e32f03564e6edcbad4bf37de27694c2fe986`
  (`feat(TE-OFL): the OFL rider completes — the licence body lands verbatim`).
  `git rev-parse refs/heads/claude/composite-r4` at lane start = the same sha (executed).
- **Worktree created:** `git worktree add --detach <scratchpad>/tet2c-tree fb80e32f…` → exit 0.
- **`npm ci` in the worktree's OWN node_modules:** TRUE_EXIT=0
  (`laneTET2C-npmci.log`).

### Hash preflight (both re-computed at THIS base, neither quoted)

| Item | Computed here | Draft's value | Verdict |
|---|---|---|---|
| `docs/implementation/preambles/MF-PREAMBLE.md` (via `git show fb80e32f:… \| shasum -a 256`) | `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` | same | MATCH — the family law did not move between compile tip `b25907f9` and base `fb80e32f` |
| port source `…/laneMFW3F-tip/src/domain/townMap/fabric/fabricDcel.js` | `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` | same | MATCH — no STOP |

## §1 · The §4 preflight, executed at `fb80e32f`

| # | Check | Executed result | Draft expectation | Verdict |
|---|---|---|---|---|
| 0 | preamble SHA-256 | `0706aad6…1db4ed` | same | MATCH (no third re-stamp) |
| 1 | port source `fabricDcel.js` SHA-256 | `01da024a…1197b` | same | MATCH |
| 2a | `dcelEmbedding.js` effective (eslint `Linter`, `max-lines {skipBlankLines, skipComments}`) | **169** | 169 | MATCH |
| 2b | `dcel.js` effective | **89** | 89 | MATCH |
| 2c | sweep-plant anchor `^export function derivePlanarDcelEmbedding(input) {` | present, **line 65, column 0** | present | MATCH |
| 2d | `grep -c CURRENT_MAP_TRADITION_ID` in the host | **0** | 0 | MATCH |
| 3 | `git grep 'locateFace\|PLANAR_EMBEDDING_FACE_KINDS\|outerFaceIds\|holeCycles\|degenerateFaces\|innerBoundaryHalfEdgeIds\|BOUNDARY_EPS_Q' -- src tests` | **no hits** (grep exit 1) | empty | MATCH — no arriving name collides |
| 4 | the twelve digest-pin suites | **12 files / 74 tests passed**, TRUE_EXIT=0 | green | MATCH (per-file table below) |
| 5 | census tuple at base — the walker's own arm executed green over the live tree | `files 2488 · parked 364 · credited 2124 · titles 20655 · suiteTitles 5776` | `STOP: RE-DERIVE AT BASE` | DERIVED HERE |
| 6a | `npm run typecheck:ratchet` | `OK — no type regressions (173 error(s), ceiling 173)` TRUE_EXIT=0 | re-derive | FLOOR = **173/173** |
| 6b | `npm run typecheck:domain:strict` | `✓ no strict-type regressions (1134 errors, ceiling 1134)` TRUE_EXIT=0 | re-derive | FLOOR = **1134/1134** |
| — | the three walkers (census, single-declaration, anchor) | **3 files / 47 tests passed**, TRUE_EXIT=0 | green | MATCH |
| — | any-cast / typecheck baselines | `scripts/.domain-strict-baseline.json` and `scripts/.full-typecheck-baseline.json` carry **NO `townMap` key at all** | — | ⛔ ZERO allowance for both touched files: the edit must be typed, never widened |

**Base pin-battery per-file counts (the §10 after-capture compares against these file-for-file):**

```
tests/domain/townMapBoundaryArrangement.test.js   5   passed
tests/domain/townMapFabricRoot.test.js            5   passed
tests/domain/townMapFantasyConstruction.test.js   6   passed
tests/domain/townMapLandform.test.js             15   passed
tests/domain/townMapMassingPersistence.test.js    6   passed
tests/domain/townMapMassingProjection.test.js     6   passed
tests/domain/townMapMassingRoster.test.js         6   passed
tests/domain/townMapParcelRegistry.test.js        5   passed
tests/domain/townMapPlanarDcel.test.js            5   passed
tests/domain/townMapSettlementFabric.test.js      5   passed
tests/domain/townMapStreetGeometry.test.js        5   passed
tests/domain/townMapStreetGraph.test.js           5   passed
TOTAL 74
```

### §1.1 · The base did not move under this member — proved, not assumed

`git diff --stat b25907f9 fb80e32f -- dcelEmbedding.js dcel.js exactGeometry.js coordinateAbi.js
foundation.js` is **EMPTY** (exit 0). The eight commits in that window are WF-1D, TE-NOTICES and
TE-OFL; none touches the fabric. The compile's orientation figures therefore transfer, and the
independent re-measurement above agrees with each of them.

## §2 · §4 step 7 / §P2.9 — every acceptance fixture run against the UNEDITED kernel, verbatim

```
A2 abi-triangle              THROW "DCEL vertex has an angular tie"
A2 arithmetic                Number=0 BigInt=-1n
A2 fixture-era same shape    Number=-1 BigInt=-1n
A2 true-collinear-tie        THROW "DCEL vertex has an angular tie"
A3 open-chain                THROW "DCEL face must have nonzero signed area"
A3 closed-triangle-control   OK faces=2 kinds=["EXTERIOR","BOUNDED"] area2s=[100,-100]        [0.72ms]
A4 two-components            OK faces=4 exteriors=2 outerFaceId=…b25eee60… area2s=[200,-200,-200,200] [0.89ms]
A4 one-square-control        OK faces=2 exteriors=1 area2s=[200,-200]                          [0.32ms]
A5 nested                    OK faces=4 exteriors=2 outerFaceId=…236ef5ac… area2s=[-800,-20000,20000,800] [0.71ms]
A8 grid cells=30 boundaries=1860
A8 grid-30                   OK V=961 E=1860 F=901 V-E+F=2 exteriors=1                       [646.07ms]
```

⭐⭐ **R-MF-2 IS REACHABLE END-TO-END AT THIS BASE, CONFIRMED BY EXECUTION.** The landed kernel
throws `'DCEL vertex has an angular tie'` on the valid ABI-scale triangle, and the counterforce is
exact: `Number` cross `0` vs `BigInt` cross `−1n` at `m = 1286630001`, while the SAME shape at
fixture-era scale (`s = 1000`) gives `−1` in both spellings. The divergence is the SCALE.

⭐ The throw's positive control also fires at base: two collinear boundaries sharing one origin
throw the same message. That is a TRUE tie and must SURVIVE the edit.

### §2.1 · STOP TAKEN AND RE-DERIVED — the compile's nested-fixture note is corrected

The compile receipt (`laneTCT2C-receipt.md` §1.7) records: *"On the nested-squares fixture the
discovery order HAPPENED to pick the true outer."* **Executed here, it does not.** A second probe
resolved the face→boundary mapping directly:

```
metrics.area2s (discovery order) [-800,-20000,20000,800]
outerFaceId = dcel-face:…236ef5ac…
OUTER face is closed by ["i0","i1","i2","i3"]     <- the INNER 20x20 ring
```

The singular `outerFaceId` names the INNER ring's negative walk, i.e. the divergence-3 defect is
LIVE on this fixture, not merely latent.

**This is NOT the §11 "unedited-kernel behavior differs" STOP**, and the reason is mechanical
rather than a judgment to wave through: the base is byte-identical to the compile tip (§1.1), so
no behavior moved. The compile's probe built its face→area map with
`e.faces.forEach((f, i) => areaByFace.set(f.faceId, e.metrics.area2s[i]))` — which zips `faces[]`
(**sorted by `faceId`**) against `metrics.area2s` (**discovery order**). Those are different
orderings, so the compile read another cycle's area. The structural capture the draft actually
pins — 4 faces, 2 typed `EXTERIOR`, one singular field — is IDENTICAL in both runs, and the draft
already refuses the "names the hole" claim. Recorded, corrected, proceeding.

⚠ **AND IT IS A LIVE HAZARD FOR THIS MEMBER'S OWN CODE.** `faceIndex` is specified aligned with
`faces[]` (sorted), while `metrics.area2s` keeps discovery order. Zipping the two is exactly the
mistake that produced the wrong note. A1 asserts the alignment rather than assuming it.

## §3 · The implementation, and what the edited kernel actually does

Two production files modified, zero created. Executed against the EDITED kernel
(`laneTET2C-probe-edited.log`, `laneTET2C-probe4.log`):

```
VOCAB ["BOUNDED","EXTERIOR","HOLE_CYCLE","DEGENERATE"]
A2 abi-triangle      OK faces=2 kinds=["BOUNDED","EXTERIOR"] V=3 E=3 V-E+F=2 outerFaceIds=1 comps=1 area2s=["-1n","1n"]
A2 true-collinear    THROW "DCEL vertex has an angular tie"        <- the detector still fires
A3 open-chain        OK faces=1 kinds=["DEGENERATE"] degenerateFaces=1 outerFaceIds=[] outerFaceId=undefined
A3 closed-control    OK kinds=["EXTERIOR","BOUNDED"] degenerate=0 outerFaceIds=1
A4 two-components    OK comps=2 outerFaceIds=2 outerAreas=["-200n","-200n"] outerKinds=[EXTERIOR,EXTERIOR]
                        outerComponents=[0,1] outerFaceId===outerFaceIds[0]=true holes=0
A4 one-square        OK comps=1 outerFaceIds=1
A5 nested            comps=2 holes=0 degenerate=0 outerBoundaries=["o0..o3","i0..i3"]
                     faceIndex-aligned=true areas=["800n","-800n","-20000n","20000n"]
                     inner[50,50]   INSIDE  BOUNDED inner ring, faces listed = 4
                     annulus[20,20] INSIDE  BOUNDED outer ring, faces listed = 2
                     onEdge[40,50]  BOUNDARY
                     far[500,500]   OUTER naming outerFaceIds[0], faces = []
                     [0.5,0] / overflow / mis-shaped -> {"kind":"OUTSIDE_ABI","faceId":null}
A1 admitted fixture  sealed key list carries SINGULAR outerFaceId; sealed face keys are exactly
                     boundaryHalfEdgeId|faceId|faceKind; embedding face keys are
                     boundaryHalfEdgeId|component|faceId|faceKind|innerBoundaryHalfEdgeIds;
                     componentCount=1 outerFaceIds=1 degenerate=0 holes=0 inner-lists all empty;
                     faceIndex[7].area2 = -1620000n while metrics.area2s[0] = -1620000n
                     (the two orderings differ — the alignment hazard, pinned in A1)
A8 grid-30 (1860 b)  V=961 E=1860 F=901 V-E+F=2 comps=1 outerFaceIds=1 degenerate=0 holes=0
                     every half-edge faced=true cycleLengths sum=3720 (=2E)
```

**Wall clock, as receipt evidence only — no credited test asserts it** (§1's named divergence
from plan §3.2a): the A8 grid at 1,860 boundaries took **646.07 ms** on the unedited kernel and
**174.91 ms** on the repaired traversal at this size — **3.7×**. The ABI-triangle embed is
1.44 ms. ⚠ The compile's 12.7× figure was measured at 2,112–8,320 boundaries where the quadratic
term dominates far harder; 3.7× at 1,860 is consistent with it and is NOT presented as the same
measurement.

### §3.1 · Effective-line ledger, measured with eslint's own `Linter` (never `wc -l`)

| File | Base | After | Budget |
|---|---:|---:|---|
| `src/domain/townMap/fabric/dcelEmbedding.js` | 169 | **267** | far under the plain `src/domain/**` 800 ceiling |
| `src/domain/townMap/fabric/dcel.js` | 89 | **93** | — |

Changed effective production lines: **118 added, 23 removed** (non-blank, non-comment-only, from
`git diff -U0`), i.e. **141 touched of the packet's 220 budget** — inside the compile's 120–160
estimate. Raw `--numstat`: `dcelEmbedding 211/21`, `dcel 20/5`.

### §3.2 · Anchor preflight — it CONVICTED, and the cure was an anchor rather than a deletion

First run of `tests/lint/negativeAssertionAnchor.walker.test.js` after the acceptance files
landed: **TRUE_EXIT=1**, naming
`tests/domain/townMapDcelEmbeddingExtension.test.js: 1 un-anchored negative assertion(s) at
line(s) 124 (frozen ceiling 0)`. That is `expect(Object.keys(sealed)).not.toContain('outerFaceIds')`.
Cured by carrying the reason on the line above (the SINGULAR key is asserted present off the same
`Object.keys` call one line earlier). Re-run: **TRUE_EXIT=0**. ⭐ The ceiling-zero law bit exactly
as the preamble §P3 says it does, which is itself evidence the walker is live.

### §3.3 · The untouched-pin control — before/after, file for file

Both captures are `--reporter=json` per-file counts. **Identical, all twelve rows**, 74 tests
before and after, zero failures, and `git diff` over the twelve pin files is EMPTY (they are not
in the change set at all — `git status --porcelain tests/` lists only the census walker as
modified and the two new acceptance files as untracked). Not one literal was edited.

## §4 · The census re-record — five sequenced convictions, no arithmetic

⛔ The tuple line was set to a deliberate placeholder and the SEQUENCED walker made to convict on
each figure in turn. Five runs; each value is quoted from its own assertion message.

| # | Placeholder tuple | Convicting message (verbatim tail) | Figure |
|---|---|---|---:|
| 1 | `0,0,0,0,0` | `the estate's file count moved — re-measure, do not re-word: expected 2490 to be +0` | **2490** |
| 2 | `2490,0,0,0,0` | `the parked-file count moved from SP-C's measured 358 … expected 364 to be +0` | **364** |
| 3 | `2490,364,0,0,0` | `the credited-file count moved from SP-C's measured 1,960: expected 2126 to be +0` | **2126** |
| 4 | `2490,364,2126,0,0` | `the live TEST-title count moved … expected 20663 to be +0` | **20663** |
| 5 | `2490,364,2126,20663,0` | `the live SUITE-title count moved … expected 5778 to be +0` | **5778** |

```
BEFORE  2488 / 364 / 2124 / 20655 / 5776
AFTER   2490 / 364 / 2126 / 20663 / 5778
DELTA     +2 /  +0 /   +2 /    +8 /   +2      <- exactly the packet's predicted motion
```

⭐ **`parked` DID NOT MOVE**, and conviction 2 is the executed proof rather than an assumption.
Both new files are CREDITED.

**The interior red was observed and cleared.** The census arm is an exact equality, so the member
reds at its own implementation commit until the tuple is re-recorded — and because the census is
SEQUENCED, the `files` red at conviction 1 is itself the proof that the later four figures had not
yet been read. After the re-record: `Test Files 1 passed`, `Tests 33 passed`, TRUE_EXIT=0.

**The `suiteTitles` and `titles` deltas are proved INDEPENDENTLY of the walker**, per §P5's
multi-figure rule — counted over the whole `tests/` change set including the untracked files:

```
describe( in the two new files : 1 + 1 = 2      describe( ADDED in the tracked tests/ diff : 0
test()    in the two new files : 7 + 1 = 8      test()/it() ADDED in the tracked diff      : 0
```

⚠ A naive `grep -cE '(test|it)\('` over the tracked diff returns 3 — all three are PROSE inside
`//` comment lines of the re-record block ("straight-line test() calls…"). Counting registered
calls at their own indentation returns 0. Recorded because the naive count is the one that would
have been quoted.

## §5 · The removing-power sweep — eight mutants, eight convictions

Each mutant is planted in a host it PARSES in (`node --check` executed per plant), convicts a
NAMED arm, and is restored by BYTE COPY verified with `cmp` — never `git checkout --`, which the
shared-tree protocol forbids outright.

Pristine digests: `dcelEmbedding.js` `46f24fda…46fe` · `dcel.js` `143c6ba9…c428f`.

| # | Mutation | Planted digest | Parses | Convicted arm | Battery exit |
|---|---|---|---|---|---:|
| CONTROL 0 | none — the PRISTINE tree | — | — | must be GREEN | **0** |
| M1 | `compareRay`'s cross computed in floats before the BigInt conversion | `0fb3321a…b3d7` | yes | **A2**, at `compareRay` — the false angular tie returns at ABI scale | 1 |
| M2 | the zero-area throw restored ahead of the face id | `7dcf7edb…4a46` | yes | **A3** — the open chain throws instead of typing | 1 |
| M3 | outer selection reverted to the first negative cycle in discovery order (per-component logic deleted) | `f5dd3f78…a240` | yes | **A4 and A5** (2 failures) | 1 |
| M4 | the `BOUNDARY` verdict branch made unreachable, folding on-edge into `INSIDE` | `c20eaec5…2303` | yes | **A6** | 1 |
| M5 | the cursor's advance-past-visited guard neutralised | `1996fa4e…7bf8` | yes | **A1 first, then all 7** — the disjoint-cycle throw on the very first fixture | 1 |
| M6 | `innerBoundaryHalfEdgeIds` omitted from the face record | `79dc05d1…d862` | yes | **A1**'s existence control | 1 |
| M7 | the `dcel.js` seal projection removed (extended faces sealed whole) | `dd005209…0461` | yes | **`townMapPlanarDcel.test.js:384`** — the exact-key pin | 1 |
| M8 | the equal-\|area\| tie INVERTED to prefer the non-`BOUNDED` cycle | `a4481bf8…3388` | yes | **A5 and A6** (2 failures) — `INSIDE` flips to `ENCLOSED_BY_EXTERIOR` | 1 |
| CONTROL 9 | clean re-run; digests match pristine, `cmp` OK | `46f24fda…` / `143c6ba9…` | — | 3 files / 13 tests | **0** |

⭐ **M7 is the untouched-pin control's own conviction**: it proves a moved sealed byte is VISIBLE
to the twelve pin suites, so their green in §3.3 is a measurement rather than an absence of
measurement.

⭐ M8 also demonstrates that `ENCLOSED_BY_EXTERIOR` is code-reachable under a mutation while NO
test claims it fires on lawful input — which is exactly the posture ODQ §328 ruled.

## §6 · Packet lifecycle and the validator at every transition

| Transition | Files touched | `npm run validate:packets` |
|---|---|---|
| open at **DRAFT** | the packet `.md`, a surgically INSERTED `PACKET_MANIFEST.json` row (`--numstat` = `224/0`, a PURE insert — nothing re-serialized), and the `docs/implementation/INDEX.md` current-packet-set row | first run **TRUE_EXIT=1**, then 0 |
| **DRAFT → READY** | the three status cells | **TRUE_EXIT=0** — `valid: 135 packets (1 READY)` |

⚠ **The validator convicted twice on the first DRAFT run, and both were real:**

```
[implementation-packets] MF-T2C verifiedBase disagrees with packet Markdown: manifest=fb80e32f… packet=null
[implementation-packets] MF-T2C.packetPath is absent from index: docs/implementation/packets/town-cartography/MF-T2C.md
```

1. The header's `Verified base:` line must match `^\`branch\` at \`<40 hex>\`$` with NOTHING after
   it (`parsePacketHeader`, `scripts/implementation-packets.mjs:169`). The base prose was moved to
   its own `Base posture:` bullet.
2. Every packet path must carry a row in `docs/implementation/INDEX.md`'s current-packet-set
   table, keyed by the resolved link target.

⭐ **PATH-RESERVATION CHECK, executed rather than assumed.** `MF-T2C` is the **only non-terminal
packet in the whole manifest**, so the §P7.11 shared-path STOP cannot fire: nothing else reserves
`tests/lint/sovereigntyLightingContract.walker.test.js`, and this member deliberately reserves no
path on `src/domain/townMap/fabric/index.js` at all.

**Naked-claim scan:** both markdown files were scanned line-by-line against the live `CLAIM_RE`
from `tests/docs/enforcement-claims.test.js` before either was committed — **0 hits each**.

### §6.1 · Adjacent observation, recorded and NOT repaired (§2's instruction)

`docs/implementation/INDEX.md` is edited by every packet's landing, but only four historical
packets (`IA-1`, `IA-2`, `INFRA-M1-DOCS`, `EFF-M4`, all terminal) reserve it in a
`changeManifest`. MF-T2A and MF-T2B both added their INDEX rows without reserving the path, and
this member follows that landed family precedent rather than introducing a reservation the chair
did not ask for. Recorded here so the inconsistency is visible; not investigated, not repaired.

## §7 · Dormancy — discharged POST-BUILD, with its own skip control (§P2.2 / ODQ §324.5)

`npm run build` → TRUE_EXIT=0 (`[prerender] wrote 314 static route documents…`).

| Run | Result |
|---|---|
| `npx vitest run tests/build/townMapLazy.test.js` **without** `VERIFY_DIST` | `Tests 2 passed \| 1 skipped (3)` — ⛔ **NOT a discharge**; the skipped arm is the one that reads `dist/` |
| `VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js` | **TRUE_EXIT=0**, `Tests 3 passed (3)` — three EXECUTED, the real discharge |

The two runs are quoted side by side deliberately: the difference between them is the whole
content of §P2.2's warning, and reporting only the first would be the estate's "a green that never
ran" shape.

### §7.1 · The forensic zoom, with its denominator NAMED and a positive control

```
ENTRY CHUNK: index-DKqqFoYp.js
ENTRY STATIC CLOSURE (the denominator): 8 js chunks of 524 in dist/assets
LAZY chunks (outside the closure): 516
  'OUTSIDE_ABI'                    entry 0  |  lazy 0
  'ENCLOSED_BY_EXTERIOR'           entry 0  |  lazy 0
  'HOLE_CYCLE'                     entry 0  |  lazy 1  ["index-DMwzWvkV.js"]
  'PLANAR_EMBEDDING_FACE_KINDS'    entry 0  |  lazy 0
  'DCEL vertex has an angular tie' entry 0  |  lazy 1  ["index-DMwzWvkV.js"]
  'innerBoundaryHalfEdgeIds'       entry 0  |  lazy 1  ["index-DMwzWvkV.js"]
  CONTROL 'createElement'          entry 4
  CONTROL 'useState'               entry 2
```

The BFS uses the FENCE'S OWN import extractor, so the denominator is the instrument's rather than
a second opinion, and the two controls prove the scanner actually reads entry chunks.

⚠⚠ **AND THE HONEST READING, BECAUSE THREE OF THE SIX TOKENS PROVE NOTHING.** `OUTSIDE_ABI`,
`ENCLOSED_BY_EXTERIOR` and `PLANAR_EMBEDDING_FACE_KINDS` are absent from the **entire bundle**, not
merely from the entry closure — they belong to `locateFace`, which no module imports, so the
bundler removes them. An absence measured over a denominator that does not contain the surface
proves nothing about it (preamble §P2.12), so those three rows are reported and then set aside.

**The load-bearing evidence is the other three.** `HOLE_CYCLE`, the angular-tie message and
`innerBoundaryHalfEdgeIds` are reached through `dcel.js`, so they ARE shipped — each appears in
exactly ONE lazy chunk (`index-DMwzWvkV.js`) and in ZERO of the eight entry chunks. That is the
shape the discharge requires: present in the bundle, absent from first paint.

## §8 · Commits — four, on the lane's OWN detached ref. No branch was moved.

| # | SHA | Subject | Files |
|---|---|---|---|
| 1 | `a615cfdd` | `docs(MF-T2C): open the planar-embedding extension at DRAFT` | packet `.md` (new), `PACKET_MANIFEST.json` (pure insert), `INDEX.md` |
| 2 | `3482a063` | `docs(MF-T2C): DRAFT -> READY, with the whole section 4 preflight executed at this base` | the same three status cells |
| 3 | `0918f8d3` | `feat(MF-T2c): the planar embedder survives ABI scale — exact arithmetic, per-component outers, typed degeneracy, point location` | `dcelEmbedding.js`, `dcel.js`, the two new acceptance files, the census walker |
| 4 | `f5332cf7` | `docs(MF-T2C): READY -> LANDED, with the landing record and the four created symbols` | the three doc files (§12 + `requiredSymbols` + status) |

**TIP FOR CAS: `f5332cf70520a1cdef6cc326ae000acec118da85`.**

**Shared-tree discipline, executed rather than asserted:**

- `git config --show-origin --get core.bare` → `false` (the flip that kills every `git add` is not
  in effect).
- Every commit staged **explicit paths only** — never `-A`, `-u` or `.`. `git diff --cached
  --name-only` was read before each commit and matched the intended set exactly.
- **No foreign WIP existed to preserve**: at every point `git status --porcelain` listed only this
  member's own eight paths, and the untracked acceptance files survived commits 1 and 2 intact
  (verified after each).
- ⚠ **The pre-commit hook runs `eslint --fix` on staged JS**, so a hook could have rewritten the
  bytes the mutant sweep proved. Checked rather than assumed: `cmp` between the digest-verified
  pristine copies and the post-commit working tree reports **IDENTICAL** for both source files,
  and the committed blob still carries the anchor at line 140 column 0 with a
  `CURRENT_MAP_TRADITION_ID` count of 0.
- No `git stash`, no `git checkout --`, no ref moved, and the main worktree was never touched.

### §8.1 · MF-T2A's sweep plant still applies to the edited file — executed

The exact `perl` substitution of `scripts/mutation-sweep.sh` entry 28a was run against a scratch
COPY of the edited kernel (never against the repo — §P3b forbids a build lane running the sweep on
this tree):

```
plant applied?  1 occurrence
node --check    PARSES
140-export const CURRENT_MAP_TRADITION_ID = 'MUTSWEEP_PLANT';
141:export function derivePlanarDcelEmbedding(input) {
```

So the plant remains a live SECOND DECLARATION rather than the J-TET2A-1 parse-error class, and
`check_caught "town-map/fabric duplicate export declaration"` can still red the walker.

### §8.2 · Terminal preflight

- `git rev-parse refs/heads/claude/composite-r4` re-read immediately before the terminal:
  **`fb80e32f03564e6edcbad4bf37de27694c2fe986`** — unmoved, identical to this member's base, so
  **no cherry-pick is owed.**
- `npm run check:packet -- MF-T2C` and `npm run implementation:resume -- MF-T2C` both exit **2**
  from this posture: they shell out to `git symbolic-ref --quiet --short HEAD`, which a detached
  executor worktree has no answer for. Neither is landing authority — the tool says so in its own
  first line — and MF-T2B's lane recorded exit 2 on both for a different reason (status). Recorded
  as a lane-posture finding, not repaired.

## §9 · ⛔⛔ A FOREIGN RED EXISTS AT THE BASE — found by the pre-gate sweep, NOT this member's

Per the banked "five ratchets only the full gate runs" lesson, `vitest run tests/lint tests/build`
was swept BEFORE requesting the terminal. It came back **TRUE_EXIT=1**:

```
Test Files  3 failed | 172 passed (175)
     Tests  5 failed | 2046 passed | 63 skipped (2114)
```

**Classified against a PRISTINE baseproof worktree** — `git worktree add --detach
<scratchpad>/tet2c-baseproof fb80e32f`, empty working tree, `node_modules` linked from this lane's
own `npm ci` tree (same base, same `package-lock.json`, so identical deps). The same three files
run there give **TRUE_EXIT=1 and the SAME five failures**, and the sorted failing-title lists
`diff` to nothing:

```
× 'succession_demand_inherited' retains the five annex families without editorial cross-references
× 'trajectory_misread'          retains the five receipt-annex families verbatim
× 'war_trajectory_losing'       retains the five receipt-annex families verbatim
× 'war_trajectory_winning'      retains the five receipt-annex families verbatim
× baseline exactly matches the files that still define a local clamp/clamp01
```

**⇒ CONFIRMED PRE-EXISTING AT `fb80e32f`. Not MF-T2C's, and not repaired** — §11 and the packet's
own STOP list forbid this member repairing unrelated gate failures.

**What they are** (reported, not investigated):

| File | Shape |
|---|---|
| `tests/lint/warCostKindPools.walker.test.js` (3) · `tests/lint/warRulingKindPools.walker.test.js` (1) | annex-family walkers expecting **5** families and receiving **6** and **10** on four war-receipt kinds. The four quoted lines are war-dissolution copy, so the arriving families look like WF-1D's landing (`1a90b563` / `472b9b62`, two commits before this member's base) outrunning the walkers that pin them |
| `tests/lint/clampPrimitiveBaseline.test.js` (1) | `scripts/.clamp-primitive-baseline.json` records **62** files still defining a local `clamp`/`clamp01`; the live tree has **75**. A drifted ratchet baseline |

⚠⚠ **CONSEQUENCE FOR THE TERMINAL:** `npm run check:tail` will red at this base **regardless of
this member**, because `test:ratchet` runs these files. The chair is told BEFORE the soak is paused
rather than after, so a pause is not spent on a gate whose red is already known and foreign. This
member's own surface is green on every focused battery, both walkers it touches, both typecheck
floors, the twelve pin suites, the post-build dormancy fence and all 172 other lint/build files.

## §10 · The gate table as it stands (the ONE full terminal is HELD for the chair's GO)

| Step | Command | TRUE_EXIT | Result |
|---|---|---:|---|
| anchor preflight (1st) | `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` | **1** | CONVICTED line 124, ceiling 0 — cured with a stated reason |
| anchor preflight (2nd) | same | **0** | green |
| focused static | `npx eslint` over the four touched files | **0** | no output |
| typecheck ratchet | `npm run typecheck:ratchet` | **0** | 173 errors / ceiling 173 — floor held EXACTLY |
| typecheck domain-strict | `npm run typecheck:domain:strict` | **0** | 1134 errors / ceiling 1134 — floor held EXACTLY |
| acceptance | the two new files | **0** | 2 files / 8 tests |
| census | the census walker after the re-record | **0** | 1 file / 33 tests |
| untouched-pin control | the twelve digest-pin suites | **0** | 12 files / 74 tests, per-file IDENTICAL to the pre-edit capture |
| build | `npm run build` | **0** | 314 static route documents |
| dormancy, pre-build style | fence without `VERIFY_DIST` | 0 | `2 passed \| 1 skipped` — ⛔ NOT a discharge |
| dormancy, POST-BUILD | `VERIFY_DIST=1` fence | **0** | **3 passed** — the real discharge |
| mutants | 8 planted / 8 convicted / 8 restored + 2 controls | — | all convictions by their NAMED arm; final digests match pristine |
| validate:packets @ DRAFT | `npm run validate:packets` | **0** | `valid: 135 packets (0 READY)` |
| validate:packets @ READY | same | **0** | `valid: 135 packets (1 READY)` |
| validate:packets @ LANDED | same | **0** | `valid: 135 packets (0 READY)` |
| `check:packet` | `npm run check:packet -- MF-T2C` | 2 | needs `git symbolic-ref HEAD`; a detached executor worktree has none. Not landing authority |
| `implementation:resume` | `npm run implementation:resume -- MF-T2C` | 2 | same reason |
| ⭐ pre-gate ratchet sweep | `npx vitest run tests/lint tests/build` | **1** | 3 files / 5 tests failed of 2114 — **all five PRE-EXISTING at the base** (§9) |
| ⭐ FINAL consolidated battery @ the LANDED tip | the 2 acceptance files + 3 walkers + the 12 pin suites | **0** | **17 files / 129 tests** |
| ⛔ `npm run check:tail` | BARE, fresh shell | **HELD** | the terminal protocol requires the chair's explicit GO so the soak can be paused PID-exactly first. The chair was messaged at tip `f5332cf7` and told about §9's foreign red BEFORE the pause, so a pause is not spent on an already-known red |

## §11 · Judgment calls, in vetoable form

1. **The corrected nested-fixture note is a RE-DERIVATION, not a §11 STOP.** §11 says a STOP when
   "ANY acceptance fixture's unedited-kernel behavior differs from the §1.7 captures". The nested
   fixture's outer attribution does differ — but the base is byte-identical to the compile tip
   (executed `git diff --stat`), so no behavior moved; the compile's probe zipped two differently
   ordered arrays. The structural capture the packet actually pins is identical in both runs, and
   the draft explicitly refused the "names the hole" claim. Ruled a re-derivation, recorded, and
   turned into a pin (A1's alignment assertion) so the same mistake cannot recur inside the kernel.
2. **The INDEX.md row is added WITHOUT reserving the path**, following MF-T2A and MF-T2B exactly,
   rather than minting a reservation the chair did not ask for. Recorded in §6.1.
3. **`BOUNDARY_EPS_Q` is declared `const` and UNEXPORTED**, which is stronger than "internal" —
   a caller cannot supply a different rounding radius and make the ABI's boundary rule a
   per-caller opinion. This implements §328's ruling; the stronger reading is the lane's.
4. **The foreign red is reported, not repaired**, and the chair was told BEFORE the soak pause
   rather than after, because a pause spent on a known foreign red is a wasted pause. Three
   options were put to the chair with a recommendation; nothing was done unilaterally.
5. **Three of the six forensic-zoom tokens are reported and then SET ASIDE as vacuous**, rather
   than counted as evidence, because they are absent from the whole bundle rather than from the
   entry closure (§7.1).

## §12 · Lane artifacts

Worktrees created by this lane, both detached, neither on a branch:

- `<scratchpad>/tet2c-tree` @ `f5332cf7` — the member's own worktree with its own `npm ci`
  `node_modules`, and a built `dist/`.
- `<scratchpad>/tet2c-baseproof` @ `fb80e32f` — the pristine classification tree for §9. ⚠ Its
  `node_modules` is a SYMLINK into `tet2c-tree`; removing that tree breaks it. Remove the
  baseproof first, or re-link, if either is cleaned up.

Logs are self-named `laneTET2C-*.log` throughout; every exit quoted above was captured in-shell
with `; echo TRUE_EXIT=$?` and never inferred.

## §9a · ⛔⛔ §9's BLOCKING PREMISE WAS WRONG, AND THE ERROR IS THE LESSON

The chair refuted §9 and I verified the refutation against the artifact myself rather than
accepting it. **All five sweep reds are BANKED**, and the lookup is exact — file plus title, in
`scripts/.test-ratchet-baseline.json` at this base:

```
BANKED  tests/lint/warCostKindPools.walker.test.js   :: 'war_trajectory_winning'  …   class=debt introducedAt=unbisectable
BANKED  tests/lint/warCostKindPools.walker.test.js   :: 'war_trajectory_losing'   …   class=debt introducedAt=unbisectable
BANKED  tests/lint/warCostKindPools.walker.test.js   :: 'trajectory_misread'      …   class=debt introducedAt=unbisectable
BANKED  tests/lint/warRulingKindPools.walker.test.js :: 'succession_demand_inherited' class=debt introducedAt=unbisectable
BANKED  tests/lint/clampPrimitiveBaseline.test.js    :: baseline exactly matches …    class=debt introducedAt=unbisectable
ALL FIVE BANKED: true        (11 banked entries total; the other 6 live outside tests/lint+tests/build)
```

⭐⭐ **THE LESSON, AND IT IS A NEW TWIN OF A LAW THIS PROGRAM ALREADY CARRIES.** The estate's
standing rule is *"trust no exit status you did not capture."* I captured mine — in-shell, from a
self-named log, correctly. It was still worthless as a gate verdict, because **I read it off the
WRONG INSTRUMENT.** A bare `vitest run` reports banked debt as failure; the gate's instrument is
`test:ratchet`, which compares the LIVE failing set against the BANKED set member-for-member and
is green exactly when they are equal. So:

> ⛔ **AN EXIT STATUS YOU DID CAPTURE, FROM AN INSTRUMENT THAT IS NOT THE GATE'S, IS EQUALLY NOT A
> RECEIPT.** Before reporting a sweep red as a blocker, look the failing titles up in
> `.test-ratchet-baseline.json` — a banked title is the EXPECTED member, not a defect.

⚠ **And my baseproof control could not have caught it**, which is why it felt conclusive: the
banked reds reproduce identically at a pristine base BY CONSTRUCTION. The control proved
"pre-existing", which was true; I then inferred "therefore blocking", which does not follow. The
missing step was the baseline lookup, not another control.

⚠ **My attribution guess was also wrong.** I read the four war rows as WF-1D's landing outrunning
its walkers. Their `introducedAt` is `"unbisectable"` and they predate today; the chair notes
WF-1D's own terminal at `190895a4` held the ceiling at 11, which it could not have done had it
minted new reds. The baseline is the authority over a plausible-looking commit-window story —
another instance of the banked "`introducedAt` can be flatly wrong / re-derive rather than infer"
family, taken from the other direction.

⭐ **ONE THING THE SWEEP DID CATCH, and it is real.** The clamp entry's own `cause` prose records
**73** files defining a local `clamp`/`clamp01` when it was banked; the live tree has **75**. Debt
has grown invisibly UNDER an already-red ratchet — a red ratchet cannot see its own growth. Per
the chair I have NOT touched it; it is recorded for a chartered cure.

## §13 · THE TERMINAL GATE — EXECUTED UNDER THE CHAIR'S GO, ALL 18 STEPS GREEN

Launched at `f5332cf70520a1cdef6cc326ae000acec118da85` after the chair confirmed the RS-5 soak
was paused PID-exactly. Run **BARE and PER STEP** — `npm run check` is a 17-step `&&` chain and a
red step blacks out every later one, so each step ran separately into its own self-named log with
its exit captured in-shell. ⛔ No `npm run check*` was wrapped in `gate-mutex.sh --run`.

```
TERMINAL GATE at f5332cf70520a1cdef6cc326ae000acec118da85
started 00:00:05Z   load averages: 3.76 6.97 6.79
1   validate:hazard-registry         TRUE_EXIT=0   00:00:05Z -> 00:00:06Z
2   validate:premortem               TRUE_EXIT=0   00:00:06Z -> 00:00:07Z
3   validate:packets                 TRUE_EXIT=0   00:00:07Z -> 00:00:08Z
4   validate:data                    TRUE_EXIT=0   00:00:08Z -> 00:00:09Z
5   validate:custom-content-manifest TRUE_EXIT=0   00:00:09Z -> 00:00:10Z
6   validate:migration-head          TRUE_EXIT=0   00:00:10Z -> 00:00:10Z
7   validate:edge                    TRUE_EXIT=0   00:00:10Z -> 00:00:12Z
8   validate:map                     TRUE_EXIT=0   00:00:12Z -> 00:00:12Z
9   validate:tuning-bands            TRUE_EXIT=0   00:00:12Z -> 00:00:13Z
10  validate:foundry-module          TRUE_EXIT=0   00:00:13Z -> 00:00:13Z
11  validate:mcp-server              TRUE_EXIT=0   00:00:13Z -> 00:00:13Z
12  typecheck:ratchet                TRUE_EXIT=0   00:00:13Z -> 00:00:27Z
13  typecheck:domain:strict          TRUE_EXIT=0   00:00:27Z -> 00:00:40Z
14  lint                             TRUE_EXIT=0   00:00:40Z -> 00:01:33Z
15  test:ratchet                     TRUE_EXIT=0   00:01:33Z -> 00:14:03Z
16  build                            TRUE_EXIT=0   00:14:03Z -> 00:14:23Z
17  verify:dist                      TRUE_EXIT=0   00:14:23Z -> 00:14:53Z
18  smoke:boot                       TRUE_EXIT=0   00:14:53Z -> 00:15:00Z
finished 00:15:00Z   load averages: 13.08 19.71 15.20
```

**Every step ran; none was blacked out. The three verdicts that carry the weight:**

```
[test-ratchet] OK — no test regressions (11 known failure(s) of 28679 tests, ceiling 11).
[test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 433 test(s), zero failed/non-run/
               uncollected/missing/extra/duplicate rows.
boot-smoke: PASS — the built bundle boots.   (stage 2: 524/524 chunks initialised)
```

⭐⭐ **Step 15 is the direct refutation of §9, executed rather than argued.** `test:ratchet` is
GREEN at `11 known / ceiling 11` — the five titles my bare sweep reported as blockers are inside
that eleven, exactly as the chair said. **The census ceiling did not move and no debt was banked
by this member.**

**State after the gate, re-verified:** tip still `f5332cf7`, `git status --porcelain` EMPTY
(`dist/` is gitignored), `refs/heads/claude/composite-r4` still `fb80e32f` — unmoved across the
whole terminal, so the CAS target is unambiguous — and `cmp` confirms both source files are still
byte-identical to the digest-verified copies the mutant sweep convicted against.

**MF-T2C IS COMPLETE. TIP FOR CAS: `f5332cf70520a1cdef6cc326ae000acec118da85`.**

