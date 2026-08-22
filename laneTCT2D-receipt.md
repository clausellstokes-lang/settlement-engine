# laneTCT2D-receipt.md — compile receipt for draft-MF-T2D (D3a member 4, the boundary noder)

Lane **TC-T2D**, COMPILE seat (ODQ §332.4). Read-only against the repo; every output lives in this
scratchpad. No git ref moved, no worktree touched, no repo file written.

- **Compile tip (pinned):** `refs/heads/claude/composite-r4` = `f5332cf70520a1cdef6cc326ae000acec118da85`
  — verified by `git cat-file -t` + `git log -1` as the MF-T2C landing commit and the branch tip at
  compile start; used for EVERY `git show`/`git grep` below so an in-flight landing cannot shear
  the reads. The DISPATCH base is unknowable from here (the §290 review stop sits between this
  compile and any executor); the draft marks every base figure `STOP: RE-DERIVE AT BASE`.
- **Inputs read in full:** `draft-D3A-PLAN.md` (this scratchpad) · landed `MF-T2A.md` + `MF-T2B.md`
  + `MF-T2C.md` at the pinned tip (located via `INDEX.md` + `PACKET_MANIFEST.json` rows, all three
  LANDED) · `PACKET_STANDARD.md` at the pinned tip (700 lines) · `MF-PREAMBLE.md` at the pinned tip
  (468 lines, hash computed §1.1) · the codex fabric sources at the pinned tip
  (`boundaryArrangement.js`, `dcelEmbedding.js`, `dcel.js`, `exactGeometry.js`) · the sealed
  sandbox `fabricDcel.js` in full (618 lines, hash §1.2) · ODQ §290/§303/§304/§310/§312/§328/
  §330–§332 (see the deviation note §1.3).
- **Outputs:** `draft-MF-T2D.md` (this scratchpad, 640 lines) · this receipt · probe tree
  `laneTCT2D-probe/` (drivers `driver.mjs`, `p5b.mjs`, `p8.mjs`, `p9.mjs` + pinned-blob kernel
  copies) · pinned source extracts `laneTCT2D-src-*`. **No `laneTCT2D-T2E-seed.md`** — member 4's
  scope fits one packet (§2), so no split was needed.

## §1 · Executed evidence (command → result)

1. **Preamble live hash, computed not quoted.**
   `git show f5332cf7…:docs/implementation/preambles/MF-PREAMBLE.md | shasum -a 256` →
   `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — matches the post-§324.5
   stamp MF-T2C's landed packet records. The draft orders the executor to recompute at ITS base
   (the file was re-stamped twice on 2026-08-21; a third re-stamp is possible).
2. **Port-source hash, verified THREE ways.** `shasum -a 256` over the sealed-tip
   `…/laneMFW3F-tip/src/domain/townMap/fabric/fabricDcel.js` →
   `01da024a8655ce9e468a75a53ffc49a4e28508d2d7a9400cbe2dbf1b6d81197b`; the preserved-ref copy
   (`refs/preserve/map-sandbox-w3f-sealed` = `ee0db96d`, blob `bc1880a2` at the same relative
   path) hashes to the SAME digest via `git cat-file blob`; and the value equals MF-T2C's landed
   header table. The sealed evidence has not moved and now has a durable in-repo citation, which
   the draft's provenance block records. `fabricGeometry.js` re-hashed `c40c75b1…8ed6e`, matching
   MF-T2B's table (nothing is consumed from it here beyond the already-landed `segIntersect`).
3. ⚠ **One deviation from the pin, unavoidable and recorded:** `OWNER_DECISION_QUEUE.md` does not
   exist on `claude/composite-r4` at any commit — it lives on the ledger branch. §303.5's own
   text (and §290/§304/§310/§312/§328/§330–§332) was read at ledger
   `review-fixes-2026-07-08` @ `51fb347850c0aebeb2e72abf96e69be5d48c6560` (the §332 tip, HEAD of
   the current checkout at compile time). §303.5 quoted verbatim in the draft §1.1; §332.4 is
   this lane's own commission ("TC-T2D (the noder/arrangement member the T2C draft explicitly
   excludes)"; drafts only; nothing lands before the §290 stop).
4. **The codex jig's consumer census at the pin** (`git grep boundaryArrangement`):
   `compileOrthogonalCrossCadastralArrangement` is REPLAYED as an input validator by `dcel.js`,
   `fabricRoot.js` and `parcelRegistry.js`, referenced by `content.js` and `massingRoster.js`,
   re-exported by the barrel, and digest-pinned by `tests/domain/townMapBoundaryArrangement.test.js`
   (one of the twelve frozen suites). ⇒ the plan's "retire to a thin adapter or delete" order for
   MF-T2D is refuted at the landed tree; the draft edits zero existing files (staleness §3.1).
5. **The landed kernel's input contract, read at the pin** (`dcelEmbedding.js`, 386 lines):
   unique boundary ids, canonical endpoint direction (`comparePoint(line[0], line[1]) < 0`), a
   single `{kind:'PLANAR_SURFACE', leafIndex: 0}` support, and an exact BigInt pairwise
   atomic-noding check that THROWS on crossings, endpoint touches and collinear overlaps. The
   landed `properCross` (exactGeometry.js:119) is float-PARAMETRIC with `CROSS_EPS = 1e-9`;
   `segIntersect` returns a float estimate.
6. **The sealed noder, executed read-only** (probe `driver.mjs`; the tip carries its own
   `node_modules`): on two crossing square wall rings `buildBoundaryArrangement` returns
   `raw=8 noded=12 quantum=1000 passes=2 residual=0 splits=8 dups=0`, all coordinates on-grid.
   ⚠ **Row shape measured:** keys `[boundaryId, geometry, lineKey, role, sourceId]` — NO
   `support`, and canonical direction on only **6 of 12** rows ⇒ the draft's §6 adaptation is
   load-bearing by measurement, not taste.
7. **The adapted sealed-noder output EMBEDS in the landed kernel:** `V=10 E=12 F=4 C=1`,
   `V−E+F = 2 = 1+C`, kinds `{BOUNDED: 3, EXTERIOR: 1}`. The same fixture UN-noded →
   `THROW 'DCEL boundaries must be atomically noded without crossings or overlaps'`. Both
   captured before any pin was written (§P2.9).
8. ⭐⭐ **THE COMPILE'S SHARPEST FINDING — the sealed noder's `residual = 0` does NOT imply the
   landed kernel's precondition.** Three witness classes, all executed at the pinned tip:
   - **T-junction** (`p8.mjs`): a stub wall ending ON a square's edge → sealed noder reports
     `residual=0 splits=0` and leaves the edge WHOLE (`[[0,0],[4000000,0]]` published intact);
     the landed kernel THROWS on that output. A kerb ending at a wall is exactly this shape.
   - **Collinear overlap:** landed `properCross` returns `false` on an overlapping collinear
     on-grid pair (no split, no count); the landed kernel THROWS on it.
   - **The eps-band crossing** (`p5b.mjs`): on
     `a=[0,0] b=[9007199000,1000]` × `c=[1000,−1000] d=[−9007189000,9007198000]` the exact
     crossing parameter is `t = 1.109e−13` — strictly interior, but inside `CROSS_EPS = 1e-9` —
     so the landed predicate answers not-proper while the landed kernel refuses the un-split
     pair. ⚠ **Characterized honestly: float den EQUALS exact den** (`81129642832791000000`
     both) — the executed divergence is the EPSILON BAND, not a float sign flip. On the rung
     grid (differences are multiples of ≥1000, so cross products are multiples of ≥1e6 against
     a float error ≤ ~4×2048) a sign misread was NOT constructible; the draft's BigInt
     requirement therefore rests on the R-MF-2 family law, the wall-margin fragility (the rungs
     are owner-tunable and the safety argument dies below rung ~64), and predicate ALIGNMENT
     with the kernel's own exact check — and the draft's docblock instruction says exactly that
     rather than claiming an overflow that was not executed.
9. ⭐ **The §6 design, PROTOTYPED AND EXECUTED before the draft pinned it** (`p9.mjs` — the
   kernel's admission predicate inverted into cuts: exact strict-interior crossings + the
   endpoint-on-interior arm + ported snap/passes/dedupe):
   - squares: parity with the sealed noder (12 rows, residual 0) and the kernel EMBEDS;
   - T-junction: cut at the touch (6 rows), kernel EMBEDS (`V=6 E=6 F=2`, Euler holds);
   - collinear overlap: decomposed to three runs + 1 duplicate dropped, kernel EMBEDS;
   - the eps-band pair: split (the snapped cut merges into the shared endpoint), kernel EMBEDS;
   - idempotence: re-noding the output is a fixed point (`passes=1 splits=0 residual=0`, count
     preserved). All CONFIRMED; each acceptance pin in draft §9 is written from these captures.
10. **Snap-past-wall (P6):** `MAX_WORLD_UNITS = 9007199254` snapped at rung 25000 lands at
    `9007200000`, 746 past the wall; the landed `requireCanonicalInt` refuses, naming the range.
    ⚠ The skeptic pass then proved the arm UNREACHABLE at the finest rung (any in-wall input
    snaps in-wall at rung 1000), so the draft keeps the re-validation as defense and pins
    nothing over it (§6 below; draft RAISED-5).
11. **Split-point float error at wall scale (P7):** ~1 quantum against a half-rung tolerance of
    500 — the ported float-estimate-then-snap survives, and the residual loop remains the honest
    backstop the sandbox designed.
12. **Name-collision scan at the pin:** `git grep -cE 'ARRANGEMENT_QUANTUM|nodeBoundaries|
    boundaryNoder|NODED_BOUNDARY|buildBoundaryArrangement|nodeSegments|residualProperCrossings'`
    over `src` and `tests` → **zero hits** (grep exit 1). The arriving export names collide with
    nothing and cannot red MF-T2A's walker.
13. **Effective-line basis:** the port region of the hash-named source — `nodeSegments` 75 +
    ladder walk 21 + `gridCell` 6 + `key2` 1 + the orientation-sign shape 4 = **107**
    nonblank/noncomment lines (per-range count). With the §6 adaptations priced at +60–80 the
    leaf estimate is 160–190 effective; the draft sets a hard 210 (cap 250) and a packet hard
    230 (cap 400).
14. **Draft hygiene scans, executed:** the exact `CLAIM_RE` from `laneTET2A-claimscan.mjs`
    (copied from the live enforcement test) → **0 hits** over `draft-MF-T2D.md`; the three
    anchor-walker matcher spellings → **0 hits**. This receipt was scanned the same way before
    delivery.

## §2 · Scope fits one packet — no member split, no MF-T2E seed

One new leaf (`boundaryNoder.js`, ≤210 eff measured basis §1.13), zero existing production files
modified, five handwritten files, eight acceptance cases, one shared change path (the census
walker only). Every cap has room; the task's split trigger did not fire.

## §3 · Plan staleness ledger (each named in draft §13; none silently deviated)

1. **Plan §4 MF-T2D row REFUTED in its central instruction** — "boundaryArrangement.js retired
   to a thin adapter or deleted" + a `retiredSymbols` row. The jig is sealed-chain load-bearing
   (§1.4) and §312.2c places twin-life retirement at dual-run equivalence, not D3a. The draft
   touches zero existing files; `retiredSymbols` is EMPTY.
2. **Plan §1's codex-`dcel.js`→T2D mapping is stale** — MF-T2C already extended `dcel.js` and
   kept its census as the seal guard.
3. **Plan §2.5's "carries rung 0 unchanged" is imprecise** — the sealed source's own sweep shows
   rung 0 alone leaves two real leaves un-noded; the ported value is the LADDER + the
   first-zero-residual walk, verbatim.
4. **Census delta +6 → derived +8** (7 domain + 1 property titles) — the same
   count-the-actual-tests correction T2B (+7) and T2C (+8) each recorded.
5. **The plan's shared-path list ("every member touches `fabric/index.js`") does not bind this
   member** — no barrel edit (T2C precedent), so only the census walker is reserved.
6. **The plan's ~180-eff leaf estimate replaced by the measured basis** (§1.13).
7. **Stamp/preamble rows already discharged** (stamp §312.2b; preamble landed + twice
   re-stamped; live hash cited, recompute ordered).
8. **A dependency the plan did not price:** A2's kernel-refusal control exists only because
   MF-T2C made the kernel's atomic check exact; the pre-T2C float check would MISS the eps-band
   pair. MF-T2C is therefore a hard dependency of this member's acceptance design.

## §4 · Judgment calls (all recorded in the draft; each vetoable)

- **J-TCT2D-1 · The cut predicate is the kernel's own admission predicate, exact** (strict
  interior, no eps band, plus the endpoint-on-interior arm), over the sandbox letter's float
  `properCross`. Three executed witness classes show the letter's output refused by the landed
  kernel; the prototype of the divergent design cures all three (§1.8–1.9). Fallback stated
  (draft RAISED-1).
- **J-TCT2D-2 · No `artifactKind`/`schemaVersion` on the published record.** The sandbox stamps
  `'CADASTRAL_BOUNDARY_ARRANGEMENT'` schema 1 on a shape DIFFERENT from the landed sealed
  artifact of the same kind and version; adopting that stamp would put two shapes under one
  name. The record is an in-memory derivation result.
- **J-TCT2D-3 · Explicit ABI-quanta input** (`{settlementId, segments}` with integer quanta
  refused through the landed validators) rather than the sandbox's fabric-consuming, `worldQ`-
  quantizing entry — §287.16 dormant-explicit-input + the J-TCT2C-3 "ABI wins" precedent; the
  fabric-extraction half ports with the generator tranches.
- **J-TCT2D-4 · The codex digest id shape adopted verbatim**
  (`cadastral-boundary:<sceneDigest({coordinateAbiVersion, settlementId, geometry})>`) over the
  sandbox's `b0…bn` ordinals — record-shapes-in, and it makes re-noding id-stable (A5).
- **J-TCT2D-5 · No barrel registration** (T2C's J-TCT2C-4 precedent) — the noder stays
  directory-internal; shared-path surface shrinks to the census walker alone.
- **J-TCT2D-6 · The post-snap wall re-validation stays but is unpinned and unmutated** — the
  skeptic pass proved it defensive at the finest rung (§1.10); §328.1's defensive-vocabulary
  pattern applied while writing.
- **J-TCT2D-7 · `ARRANGEMENT_QUANTUM` (the sandbox's second export, = ladder[0]) is NOT
  exported**, and the role vocabulary is validated as a canonical string but not closed — the
  codex's two-role and the sandbox's four-role vocabularies disagree, the kernel reads neither,
  and closing it belongs to the tranche that ports the extraction. Deferred and recorded.

## §5 · RAISED for the chair (carried in draft §13)

1. The kernel-admission cut predicate as a named divergence from the sandbox letter —
   recommendation: adopt (executed necessity); fallback stated.
2. The ladder + walk ported verbatim classified as "carrying the ported value", not a rung
   choice — the §328.4 BOUNDARY_EPS_Q pattern; if read as tuning, the member BLOCKS on that
   docket.
3. No kind/version stamp on the in-memory record (second-truth avoidance).
4. No barrel registration (confirm the T2C precedent extends).
5. The defensive, unpinnable wall re-validation (keep-unpinned vs delete; recommendation:
   keep-unpinned).
6. Real-leaf noding claims stay out of scope; the dual-run equivalence gate is where the ported
   noder meets real leaves (§312.2c carry).

## §6 · Skeptic pass over the draft's own tables (corrections applied before delivery)

- **M7's first spelling ("post-snap wall re-validation removed") was VACUOUS** — the arm is
  unreachable at rung 1000 (any in-wall input snaps in-wall; P6's overflow needs a coarse-rung
  path only an at-fine-rungs-un-nodable fixture can force, and no deterministic construction is
  known). Re-targeted to input-validation removal, which A6 convicts (a non-integer input would
  snap quietly; an out-of-wall input would be emitted; both expected throws vanish). A6's
  near-wall arm was dropped for the same reason and the finding moved to the docblock.
- **M8's conviction needed an off-grid crossing** — axis-parallel fixtures cross exactly on-grid,
  so an un-snapped split point would be invisible there. A8 gained a long diagonal whose
  crossings fall off the rung grid, plus the every-coordinate-is-a-rung-multiple assertion.
- **A BigInt-vs-Number mutant was deliberately NOT chartered** — on rung-grid inputs a float
  sign misread was not constructible (§1.8), so such a mutant could not be convicted and would
  be the vacuity class §P6 forbids. The BigInt requirement is carried by law, margin and
  alignment argument, stated as such.
- The leaf's import list gained `compareCodepoint` (the codepoint row sort) after a
  closure re-check.
