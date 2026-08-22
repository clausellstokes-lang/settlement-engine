# laneTCT2C-receipt.md — compile receipt for draft-MF-T2C (D3a member 3)

Lane **TC-T2C**, COMPILE seat. Read-only against the repo; every output lives in this scratchpad.
No git ref moved, no worktree touched, no repo file written.

- **Compile tip (pinned):** `refs/heads/claude/composite-r4` = `b25907f94c5581969fe169fed553b23b1293516b`,
  captured by `git rev-parse` at the start of the compile and used for EVERY `git show`/`git grep`
  below, so a mid-compile landing cannot shear the reads. ⚠ Three landings are in flight today;
  the DISPATCH base is unknowable from here, and the draft marks every base figure
  `STOP: RE-DERIVE AT BASE` rather than carrying one.
- **Inputs read in full:** `draft-D3A-PLAN.md` (this scratchpad) · landed `MF-T2A.md` + `MF-T2B.md`
  at the pinned tip · `PACKET_STANDARD.md` at the pinned tip · `MF-PREAMBLE.md` at the pinned tip ·
  the port boundary law as quoted in the plan (§303.5).
- **Outputs:** `draft-MF-T2C.md` (this scratchpad) · this receipt. **No `laneTCT2C-T2D-seed.md`** —
  member 3's scope fits one packet (§2 below), so no split was needed.

## §1 · Executed evidence (command → result)

1. **Preamble live hash, computed not quoted.**
   `git show b25907f9…:docs/implementation/preambles/MF-PREAMBLE.md | shasum -a 256` →
   `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`. Matches the hash both
   landed packets cite post-§324.5; computed here independently per the task's instruction. The
   draft instructs the executor to re-compute at ITS base (the file was re-stamped twice today;
   a third re-stamp is possible).
2. **The two target files are byte-identical across the whole T2A/T2B window.**
   `git diff --stat 9d851fae b25907f9 -- …/dcelEmbedding.js …/dcel.js` → empty, exit 0. So the
   preamble §P9 effective-line figures (`dcelEmbedding` **169**, `dcel` **89**, measured with
   eslint's Linter at `9d851fae`) transfer to the pinned tip. The executor still re-measures at
   its base.
3. **Manifest rows at the tip:** MF-T2A `LANDED` (terminal `37fb6916`), MF-T2B `LANDED`
   (compiled at `2cdb87fa`, CAS-landed at `cdfe5a96` after WF-1C moved `titles` by +7). Both
   packets read in full; their shapes (censusAuthorization block, port-source SHA table, CREATE
   vs TEST rows, the untouched-pin control, post-build dormancy discharge) are copied by the
   draft.
4. **The sweep plant 28a anchors on a literal line of the file this member edits.**
   `scripts/mutation-sweep.sh` entry 28a plants via
   `perl -0pi -e "s/^export function derivePlanarDcelEmbedding\(input\) \{/…/m"` into
   `dcelEmbedding.js`, and `MUTATED_FILES` carries that host. ⛔ If T2C's edit changes that
   column-zero signature line, the plant silently stops applying and the sweep's
   `check_caught` cannot red the walker. The draft pins the line's survival as a required
   symbol AND a STOP condition, and forbids importing/declaring `CURRENT_MAP_TRADITION_ID`
   in the host (the J-TET2A-1 parse precondition).
5. **The sealed PLANAR_DCEL face shape is pinned by exact keys.**
   `tests/domain/townMapPlanarDcel.test.js` asserts
   `Object.keys(face).sort() === ['boundaryHalfEdgeId','faceId','faceKind']` and pins the sealed
   dcel's key list including singular `outerFaceId`. ⇒ the sealed artifact CANNOT carry the
   extended fields; the draft's design seals a legacy projection in `dcel.js` and keeps the
   extended contract on the in-memory embedding only. (Also verified: NO test imports
   `derivePlanarDcelEmbedding` directly — `git grep` at the tip finds only `dcel.js` — so the
   in-memory contract extension is invisible to every existing test except through the seal.)
6. **Port-source hashes (sandbox is not in git — path + SHA-256 per §P1 R-MF-4):**
   `…/laneMFW3F-tip/src/domain/townMap/fabric/fabricDcel.js` =
   `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b` (618 lines; the
   extended-contract reference, read in full). `fabricGeometry.js` re-hashed =
   `c40c75b1fff4dd7393677f18e5b755dfb2a7fe17f4bc94a2a30f97621c78ed6e` — identical to MF-T2B's
   header table (nothing consumed from it here beyond what T2B already ported).
7. **The four load-bearing fixtures were EXECUTED against the LANDED kernel** (probe tree
   `t2c-probe/` assembled from `git show` blobs at the pinned tip; driver `t2c-probe/driver.mjs`):
   - control small triangle → `faces=2 kinds=[BOUNDED,EXTERIOR]` — harness proven live;
   - **ABI-scale triangle `a=[0,0] b=[m−1,m] c=[m,m+1]`, `m=1286630001` →
     `THROW 'DCEL vertex has an angular tie'`**, with `Number cross = 0`, `BigInt cross = −1n`.
     ⭐⭐ R-MF-2 is now REACHABLE END-TO-END through the landed kernel: MF-T2B's widened wall
     admits these coordinates and the kernel then throws falsely on valid ground. This is the
     draft's named historical regression, executed before any pin was written (preamble §P2.9);
   - open chain (2 segments) → `THROW 'DCEL face must have nonzero signed area'` (divergence 4);
   - two disjoint squares → 4 faces, **2 typed EXTERIOR**, singular `outerFaceId` = the
     discovery-order-first of the two (hash-order arbitrary; divergence 3 executed). ⚠ On the
     nested-squares fixture the discovery order HAPPENED to pick the true outer — so the draft
     pins the structural fact (two exteriors, one field) and never the fixture-lucky "names the
     hole" claim.
8. **The same fixtures EXECUTED against the sandbox reference** (`fabricDcel.js` imported
   directly from the sealed tip, read-only — the tip carries its own `package.json` and
   `node_modules`):
   - ABI triangle → embeds cleanly (`faces=2`, one outer) — same geometry, exact arithmetic;
   - open chain → `kinds=[DEGENERATE] degenerate=1 outerFaceIds=[]` — typed, reported, never
     thrown; ⚠ a degenerate-only component contributes NO outer entry, captured in the contract;
   - two squares → `outerFaceIds` length 2, one per component, `holes=0`;
   - nested squares → 2 components, `outerFaceIds=['f3','f1']` (component order), **`holes=0`**;
     locate: inner point → `INSIDE` the inner BOUNDED face with hits `[f0,f1,f2,f3]` (the
     at-equal-|area| BOUNDED-wins tie rule executed), annulus point → `INSIDE` the outer BOUNDED
     face, on-edge point → `BOUNDARY`, far point → `OUTER` naming `outerFaceIds[0]`.
9. ⭐ **`HOLE_CYCLE` never fired, and the mechanism says it cannot on lawful input.** The
   sandbox reclassifies a negative cycle to `HOLE_CYCLE` only when its component carries a
   second, more-negative cycle — but a CONNECTED noded planar subdivision has exactly ONE
   unbounded-face walk, so each component has exactly one negative cycle and the reclassifying
   branch is defensive dead code. Executed support: `holes=0` on every probe including nested
   rings (a hole is a SEPARATE component whose negative cycle is its own component's outer;
   containment is resolved by point location's smallest-containing-cycle rule, and the sandbox
   leaves `innerBoundaryHalfEdgeIds` empty everywhere — verified over the whole 618-line file).
   CONFIRMED for every executed fixture; the "cannot ever" generalisation is stated as reasoning
   (PLAUSIBLE) in the draft, which pins only the executed direction and forbids any pin that
   claims the kind fires. RAISED-3 puts the port-or-strip choice to the chair.
10. **`pointLocateRing(poly, px, py, eps = CROSS_EPS)`** confirmed in the landed
    `exactGeometry.js` returning `'INSIDE'|'BOUNDARY'|'OUTSIDE'`; the sandbox locate passes
    `eps = 0.5` (half an ABI quantum) — ported as an internal structural constant, argued in the
    draft as rounding-radius (ABI-structural), not tuning surface.
11. **Name-collision sweep at the tip:** `locateFace`, `PLANAR_EMBEDDING_FACE_KINDS`,
    `outerFaceIds`, `holeCycles`, `degenerateFaces`, `innerBoundaryHalfEdgeIds` — ZERO hits
    anywhere in `src/` or `tests/` (the `faceIndex`/`componentCount` grep hits are unrelated
    non-fabric property names; the single-declaration law scans only the fabric directory).
    The arriving export names cannot red MF-T2A's walker.
12. **`COORDINATE_ABI.boundaryRule === 'CLOSED'`** read from the landed record (with
    `canonicalRingOrientation: 'CCW_OUTER_CW_HOLE'`, `viewToWorldYFlipApplied: false`) — the
    authority pin for the locate contract's BOUNDARY verdict.
13. **`sealCanonicalArtifact` = `sceneDigest(value)` over the whole record** (foundation.js) —
    why one added face key would move every PLANAR_DCEL digest, and why the legacy projection
    at the seal is the only byte-neutral shape.

## §2 · Scope fits one packet — no member-4 seed

Estimate: `dcelEmbedding.js` 169 → ≈265 effective (BigInt sign fn ~4 · compareRay/area2
conversions ~5 changed · cursor repair ~6 · component DFS ~14 · per-component outer +
kind extension ~20 · faceIndex ~8 · locateFace ~28 · vocabulary export ~1), `dcel.js`
89 → ≈101 (+BigInt-safe census compares, extended-invariant asserts, the seal projection).
**Total new/changed effective ≈ 120–160 of 400**, with the packet budget set at a hard 220.
Basis: the landed files' measured 169/89 (receipt §1.2) plus per-feature line counts read off
the 618-line sandbox reference. Nothing here approaches the cap, so the plan's member list
stands and **no `laneTCT2C-T2D-seed.md` was written** (MF-T2D is already the plan's own member 4).

## §3 · Plan staleness ledger (draft follows the landed tree; each named, none silent)

1. **The preamble is LANDED and chair-signed** (§314, amended §315 + §324.5); the plan compiled
   it as a draft awaiting signature. RAISED-1 of the plan is discharged.
2. **The family is STAMPED** (§312.2b) — the plan's train topology at the un-stamped cap of 4 is
   stale; `town-cartography` sits in the eight-member engine column. Scheduling is the chair's;
   the draft only records the stamp.
3. **`censusAuthorization` citations:** the plan predicted §310.4; the landed members cite
   §312/§314 and §312/§315. The draft cites **§312** plus a slot for the executing seat's own
   dispatch §, per the landed precedent.
4. **The §310.3(7) discharge is no longer pending:** `clipHalfPlaneAgainstNormal` landed at
   MF-T2B exactly as plan §7 proposed; the draft inherits the law (bare `clipHalfPlane` is never
   declared) rather than re-arguing it.
5. **The plan's census delta for T2C (`+2/0/+2/+6/+2`) is superseded by the draft's own case
   count:** 7 titles in the domain matrix + 1 in the determinism companion → **+2/+0/+2/+8/+2**.
   Same lesson as T2B's +6→+7 correction: the delta is derived from the actual `test()` calls,
   never copied from the plan. The BASE tuple is `STOP: RE-DERIVE AT BASE`.
6. **Fabric denominators moved:** the plan's 18 files / 94 names became 20 / 128 at T2B's
   landing; any floor the draft states is written as re-derive-at-base.
7. **Plan §4's T2C row otherwise holds:** 0 new leaves, 2 modified files, BigInt + divergences
   2/3/4 + point location + the 12.7× repair, ≈150 effective — confirmed by this compile's own
   estimate.
8. **Plan §3.2(a)'s A5 wall-clock settle run:** the draft deliberately keeps wall-clock OUT of
   the credited acceptance file (flake law) — A8 pins correctness-at-scale (Euler identity on a
   ~2k-boundary synthetic grid) and the receipt records the measured time. Named divergence
   from the plan's letter, keeping its intent.

## §4 · Judgment calls (all recorded in the draft; each vetoable)

- **J-TCT2C-1 · Extend-in-place with a legacy projection at the seal** (over a parallel
  "extendedFaces" second truth, and over sealing the extended shape). The exact-key pin and the
  157-digest freeze force the sealed artifact to stay v1; a second face list would be the
  second-vocabulary defect class. The artifact-schema shift is named as a carry, not taken.
- **J-TCT2C-2 · App face-kind spelling keeps `EXTERIOR`** (codex/live-artifact vocabulary) for
  the sandbox's `OUTER_CYCLE`, adding `HOLE_CYCLE`/`DEGENERATE` unchanged; the locate verdict
  `ENCLOSED_BY_OUTER_CYCLE` is spelled `ENCLOSED_BY_EXTERIOR` for coherence. Renaming the live
  kind would move sealed bytes and validateCensus; renaming the port's new tokens is free now
  and never again.
- **J-TCT2C-3 · `locateFace` takes ABI integer quanta** (`[xQ, zQ]`), not map units — the
  embedder's own published coordinate space; unit conversion stays the caller's via `worldQ`.
  Divergence from the sandbox signature, under the "ABI wins" boundary law.
- **J-TCT2C-4 · No barrel registration.** The kernel is directory-internal today (only
  `dcel.js` imports it; the barrel exports the compiler, not the kernel) and stays so; T2C
  therefore reserves NO shared path on `fabric/index.js`, shrinking the staged-promotion
  surface. §P4's "reason none exists" arm carries it.
- **J-TCT2C-5 · The compareRay tie THROW is preserved, converted to exact arithmetic.** The
  throw is the collinear-overlap detector for the one shape the pairwise atomic check
  structurally passes (two collinear segments sharing one endpoint); BigInt makes it fire only
  on TRUE ties. Adopting the sandbox's canonical tie-break would silently accept an overlap the
  codex contract refuses, and the tie rule is not one of §303.5's four divergences.
- **J-TCT2C-6 · Wall-clock is receipt evidence, never a credited assertion** (§3.8 above).

## §5 · RAISED for the chair (carried into the draft's §11)

1. **HOLE_CYCLE / ENCLOSED_BY_EXTERIOR are defensive dead vocabulary** under the kernel's own
   preconditions (receipt §1.9). Recommendation: port them faithfully (fidelity; they become
   reachable only if a later wave relaxes the noding precondition) with the reachability finding
   in the module docblock and NO pin claiming they fire. Alternative: strip to the executed
   vocabulary. The draft is written for the recommendation.
2. **`innerBoundaryHalfEdgeIds` ports as the sandbox publishes it — declared, always empty.**
   Filling it needs face-containment machinery neither source has (§290.4 forbids the
   enlargement). Deferred and documented in the draft; the locate rule is the working
   containment story.
3. **The census `titles` delta is +8, not the plan's +6** (receipt §3.5) — flagged since the
   plan is a chair-reviewed document.
4. **`BOUNDARY_EPS_Q = 0.5`** is argued ABI-structural (half-quantum rounding radius), not a
   tuning constant. If the chair reads it as tuning surface instead, the member is BLOCKED on
   the tuning-signature docket and the draft says where the line sits.

## §6 · Skeptic pass over the draft's own mutant table (three corrections applied before delivery)

- M4's first spelling ("eps forced 0") would NOT convict — with integer coordinates an exactly
  on-edge point has distance 0 ≤ 0 and still reads BOUNDARY. Re-speeled to collapse the BOUNDARY
  branch into INSIDE.
- M5's first spelling ("skip one unvisited start") is OUTPUT-INVARIANT — a cycle discovered from
  a different start normalizes identically under rotate-to-minimum, which is also WHY the 12.7×
  cursor repair is output-identical. Re-speeled to delete the advance-past-visited guard, which
  the disjoint-cycle throw convicts on the first fixture.
- M8's first spelling ("delete the equal-area tie") could pass by iteration-order luck.
  Re-speeled to INVERT the tie, which flips A5's INSIDE verdict deterministically.
- A2 additionally gained the TRUE-tie positive control (two collinear boundaries from one
  origin still throw), so the "no false tie" negative sits beside a throw that fires.
- Both outputs scanned for the naked-claim phrase families and the three anchor-walker matcher
  spellings: zero hits.
