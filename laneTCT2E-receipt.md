# laneTCT2E-receipt.md — compile receipt for draft-MF-T2E (D3a member 5, the mass-part vocabulary)

Lane **TC-T2E**, chair-tier COMPILE seat (ODQ §344.1; the §343.1(a) criterion is named in the
dispatching row itself: *"scope determination between the fabric-extraction producer and the
§312.2c dual-run retirement is itself a boundary argument"*). Read-only against the repo; every
output lives in this scratchpad. No git ref moved, no worktree touched, no repo file written.

- **Compile tip (pinned):** `refs/heads/claude/composite-r4` = `3ac279db4232cc65abb57c4fa016578efd0f695d`
  — verified by `git log -1` as the WF-1E landing commit and the branch tip at compile start; used
  for EVERY `git show`/`git grep`/`git ls-tree` below so TE-T2D's in-flight landing cannot shear
  the reads. The DISPATCH base is unknowable from here (T2D lands first, and the §290 stop's
  §337.2 repositioning still leaves the chair's review between this compile and any executor);
  the draft marks every base figure `STOP: RE-DERIVE AT BASE`.
- ⚠ **One deviation from the pin, unavoidable and recorded (the same class TC-T2D's receipt §1.3
  recorded and §334 sanctioned):** `docs/OWNER_DECISION_QUEUE.md` does not exist on
  `claude/composite-r4`; it was read on the ledger checkout `review-fixes-2026-07-08` at HEAD
  `83227384273b559efd7e7e37768671983915bdb5` (the §344 tip — which contains this lane's own
  commission). Sections read in full: §287 (whole), §290, §303 (whole, incl. §303.5 verbatim),
  §312 (whole), §334–§344. The `map-corpus/docs/GENERATION-SPEC.md` volume is likewise
  ledger-only; read from the ledger WORKTREE and hash-verified against the landed preamble's own
  citation (§1.7 below).
- **Inputs read in full:** `draft-D3A-PLAN.md` · `draft-MF-T2D.md` (640L) + `laneTCT2D-receipt.md`
  (T2D's landed content, per the pinning instruction — its commit may not be on the branch) ·
  `MF-PREAMBLE.md` at the pinned tip (468 lines, hash §1.1) · `PACKET_STANDARD.md` at the pinned
  tip (701 lines) · the sealed sandbox `solidLegality.js` in full (hash §1.6) · landed
  `foundation.js` / `coordinateAbi.js` / `exactGeometry.js` at the pinned tip (the T2B substrate)
  · the codex massing modules' export surfaces (`shapes.js`, `building.js`, `massingRoster.js`) ·
  GENERATION-SPEC §7.1.2 (interfaces), §10.5, §10.16 regions · the T2A/T2B landed-packet
  existence and precedent rows via the T2D draft's verified-tree table.
- **Outputs:** `draft-MF-T2E.md` (this scratchpad, 654 lines) · this receipt · probe tree
  `laneTCT2E-probe/` (driver `driver.mjs`, log `driver.log`, pinned-blob module copies under
  `app/` and `sandbox/`). **No split-member seed** — the member fits its caps (§3 of the draft),
  and MF-T2F already exists as the plan's next member.

## §1 · Executed evidence (command → result)

1. **Preamble live hash, computed not quoted.**
   `git show 3ac279db…:docs/implementation/preambles/MF-PREAMBLE.md | shasum -a 256` →
   `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — identical to the value
   TC-T2D computed at `f5332cf7`, so no third re-stamp occurred between T2C's landing and this
   tip. The draft orders the executor to recompute at ITS base.
2. **The probe battery, executed to completion before any pin was written** (`node driver.mjs`,
   `TRUE_EXIT=0`, full log `laneTCT2E-probe/driver.log`; app modules extracted by `git show` from
   the pinned tip, sandbox module from the hash-verified preserve blob):
   - **P1 (R-MF-2 at the ring-area decision):** on `a=[0,0] b=[m−1,m] c=[m,m+1]`,
     `m=1286630001`: Number shoelace `2A = 0`; BigInt `2A = −1`; the landed float
     `area()`/`absArea()` read `0`. Ordinary-triangle control agrees in both spellings
     (`12000000`). ⇒ a Number-based degeneracy check refuses valid ground at ABI scale; the
     leaf's check is BigInt, internal, reasoned in the file.
   - **P2 (landed validator refusal shapes):** non-integer and past-wall both
     `TypeError: <label> must be an integer in -9007199254..9007199254`; empty id
     `must be a canonical id`; non-record `must be an object`; a negative in-wall coordinate is
     ACCEPTED (a keel below its support datum is legal).
   - **P2b (canonical-id grammar, measured):** `/^[a-z0-9][a-z0-9:._-]{0,95}$/` — lowercase
     only. Found by execution: the probe's own first fixture id `support:wallTop:w9` was REFUSED;
     re-spelled `support:wall-top:w9` admitted, and the uppercase refusal kept as its own probe
     line. Packet fixtures must fit the grammar.
   - **P3 (prototype constructors driven through the landed validators):** records frozen;
     `vertical` = `{kind:'INTERVAL', baseQ, topQ}`; `abiVersion` 1; replay JSON-identical;
     typed refusals on `[5000,5000)` empty, `[9000,5000)` inverted, float `baseQ`, non-member
     KNOWN value, non-member UNKNOWN reason; the wall-scale sliver CONSTRUCTS.
   - **P4 (the D1 predicate on the published discriminant — the sealed `solidOverlap` driven
     READ-ONLY; adaptation by KEY, never by position, per the T2C/T2D differently-ordered-lists
     lesson):** stacked `[0,5000)×[5000,9000)` same support/footprint →
     `VOLUME {sharedAreaQ:100000000, sharedHeightQ:0, sharedVolumeQ:0, verdict:
     DISJOINT_OR_ABUTTING}` (⭐ the half-open law as executed behavior); overlapping
     intervals+footprints → `VOLUME {sharedVolumeQ:75000000000, OVERLAPPING}`; different support
     → `REFUSED/DIFFERENT_SUPPORT_SURFACE`; plan-era `ABSENT` vs `INTERVAL` → `PLANAR_ONLY`;
     same id → `REFUSED/SAME_SOLID_ID`. ⇒ the record T2E publishes is admitted by MF-T2F's port
     source verbatim, with zero adaptation.
3. **Name-collision scan at the pin:** `git grep -cE 'FUNCTIONAL_VOLUME_KINDS|MORPHOLOGY_ROLE_KINDS|
   MASSING_UNKNOWN_REASONS|knownMassingFact|unknownMassingFact|verticalIntervalQ|solidPartQ|
   massPartQ|townMapMassPart' 3ac279db… -- src tests` → **grep exit 1, zero hits**; the
   `\bMassPartQ\b|\bSolidPartQ\b` prose spellings likewise zero. ⚠ **Process note, banked:** the
   first scan attempt piped through `head` and captured the PIPE TAIL's exit (0) instead of
   grep's — the exact "trust no exit status you did not capture" trap. Caught, redone with
   grep's own exit; the draft's preflight row 2 orders the `-c`-plus-own-exit form.
4. **The census tuple at the pin** (`git show …:tests/lint/sovereigntyLightingContract.walker.test.js`,
   the live `CENSUS` line): `files: 2490, parked: 364, credited: 2126, titles: 20669,
   suiteTitles: 5778`. Recorded for shear visibility only; the draft's every use is
   `STOP: RE-DERIVE AT BASE` (T2D's landing moves it first).
5. **`MassPartQ`/`SolidPartQ` are DESIGN-ONLY — the compile's pivotal substrate fact,** measured
   not assumed: `git grep -nE 'MassPartQ|SolidPartQ|massPart|solidLegality'
   refs/preserve/map-sandbox-w3f-sealed -- src/domain/townMap/fabric` returns only prose
   references — the sandbox's own `coordinateAbi.js:65` and `solidLegality.js:30` each state
   *"§7's `MassPartQ`/`SolidPartQ` are design-only (SPEC §10.16's status override)"*, and no
   module of that name exists in either fabric (54 sandbox modules listed; 20 codex modules at
   the pin listed). ⇒ MF-T2E is a design-implementation member; there is no port region and no
   port-source hash gating the edit — the draft's provenance table says exactly that.
6. **The D1 vertical-rule source, hash-verified three ways:** `shasum -a 256` over the sealed-tip
   working copy `…/a244e7a3-…/scratchpad/laneMFW3F-tip/src/domain/townMap/fabric/solidLegality.js`
   → `b2f59501f1902cd74b470238996c5bd875a84a8934aa8124517d2159bdb7f645`; `git cat-file blob` of
   `refs/preserve/map-sandbox-w3f-sealed:src/…/solidLegality.js` (blob `0c46df0729b3…`) → the
   SAME digest; and the probe imported the preserve-blob copy and executed it (P4). The sealed
   evidence has not moved and has a durable in-repo citation.
7. **The volume blob:** `git hash-object map-corpus/docs/GENERATION-SPEC.md` (ledger worktree) →
   `aa613cb8d9ea8b895236304e9e72b08940ba1698` — **exactly the blob the landed preamble cites**
   (its §P9 row), so this compile's §7.1.2/§10.5/§10.16 reads are at the family's own cited
   text. The draft's preflight row 1 orders the executor to re-hash (a moved blob = re-read the
   vocabularies before writing pins).
8. **The landed substrate surfaces, read at the pin:** `foundation.js` exports the four
   validators + `deepFreezeCanonical` with the T2B-threaded wall
   (`min = -MAX_WORLD_UNITS, max = MAX_WORLD_UNITS`); `coordinateAbi.js` exports
   `COORDINATE_ABI_VERSION = 1`, `MAX_WORLD_UNITS = 9007199254`, and a throwing `heightQ()`;
   `exactGeometry.js` exports the float `area`/`absArea` (P1's control) and — relevant to
   MF-T2F, not this member — `polygonIntersectionArea` already public. Codex
   `shapes.js`/`building.js`/`massingRoster.js` export surfaces listed (record-shape family
   context; zero bytes moved by this member).
9. **Effective-line basis:** the prototype's constructors region (`awk` over
   `laneTCT2E-probe/driver.mjs`, `ringAreaSign2x` through the replay fixture) measures
   **52 nonblank/noncomment lines**, executed end-to-end. Draft prices the leaf at +35–65 over
   it (morphology list, `massPartQ` assembly, nested-input validation, message polish); hard
   leaf cap **160** (standard 250), packet hard **180** (standard 400).
10. **Test-precedent existence at the pin:** `tests/domain/townMapCoordinateAbi.test.js` and
    `tests/property/townMapCoordinateAbiDeterminism.test.js` exist (the copied proof shape);
    `tests/lint/townMapFabricSingleDeclaration.walker.test.js` and
    `tests/lint/townMapMassingSilhouette.walker.test.js` exist (the binding walker and the §P6
    guard-the-guard precedent); 15+ `townMap*` determinism/golden files enumerated for the
    untouched-pin control (list re-derived at base by the executor).
11. **Draft hygiene scans, executed with the LIVE regex:** the claim-scan regex re-copied from
    `tests/docs/enforcement-claims.test.js` at the pinned tip (not from the stale `f20b9faa`
    copy) and run over `draft-MF-T2E.md` and this receipt → **0 hits, exit 0** for both; the
    three anchor-walker matcher spellings (from the walker at the pinned tip) likewise **0 hits**
    over both files. Command and counts in `laneTCT2E-probe/claimscan-run.log`.

## §2 · The scope determination — the §344.1 question, argued and answered

**The dispatch frame:** *"scope determination between the fabric-extraction producer and the
§312.2c dual-run retirement."* **This compile's answer: NEITHER is the next D3a member; the
plan's own member 5 — MF-T2E, `MassPartQ`/`SolidPartQ` — is.** The full argument:

1. **The fabric-extraction producer is already placed, and not in D3a.** Three independent
   authorities agree: (a) MF-T2D's resolved contradiction 4 / J-TCT2D-3, ACCEPTED at §334.4 —
   *"the fabric-extraction half does NOT port here… those record kinds have no app-side producer
   and belong to the generator tranches"*; (b) `draft-D3A-PLAN.md` §2.2 fences the generator
   half (~9,900 effective lines) out of D3a by name and §290.4 forbids enlarging the tranche;
   (c) structurally, the extraction consumes `fabric.channels/walls/water` records that only the
   sandbox generator produces — landed now it would be a consumer of records with no producer,
   one stage FURTHER from use than the dormant spine it would feed, while costing the full
   packet machinery. A compiler choosing it would be reversing an accepted chair ruling without
   new evidence.
2. **The §312.2c dual-run retirement cannot fire and is not a member-shaped act.** §312.2c's own
   condition — *"twin-life retirement fires when the DUAL-RUN EQUIVALENCE proves the app-side
   generator subsumes the sandbox… with the port measured at ≥36 members, D3a's seal retires
   nothing"* — requires an app-side generator that will not exist until the later tranches port.
   And per the dispatch's own hypothesis, **yes: a dual-run retirement act needs a different
   packet shape than a port member.** It decomposes into (i) a read-only equivalence MEASUREMENT
   (an instrument act, RS-5/MEAS-MINKEYS class — evidence, not a packet) and (ii) a retirement
   packet later, whose deliverable is `retiredSymbols` rows plus digest-pin retirement at the
   moment equivalence is proven. Neither half is a `PACKET_STANDARD` port member with a
   production leaf, and compiling (ii) now would be a gate without its subject.
3. **What IS dispatchable now from that impulse — RAISED-2:** an ARRANGEMENT-STAGE dual-run
   instrument over `refs/preserve/map-sandbox-w3f-sealed` — harness-side extraction of the
   sealed corpus's real-leaf fixtures, fed through the landed noder+kernel, compared against the
   sandbox's own arrangement/DCEL results, aligned by key. Read-only, zero repo bytes, a free
   slot's work. It converts T2D's RAISED-6 carry into early evidence and de-risks the generator
   tranches. Recommended as a PARALLEL chair measurement lane; deliberately NOT compiled here
   (chartering a measurement is a chair act, and this seat's commission was a member compile).
4. **The affirmative case for MF-T2E as the plan wrote it:** (a) ODQ §312.1 collected the
   16-member roster with the §287.16 massing foundations as a named track, and nothing in
   §313–§344 re-scoped D3a (checked section by section — landings, the soak, WF members, the
   §336/§343 process rulings; no D3a re-charter); (b) §312.2b's stamp caps map trains at EIGHT,
   so the current engine train (A→B→C→D landed/landing) CONTINUES and its next member is E by
   the plan's own numbering; (c) E is the only unblocked next member whose substrate is fully
   landed (MF-T2B) — T2H/T2J sit behind T2D's landing in the plan's graph, T2F behind E, T2G is
   independent but discharges an obligation better sequenced after the E→F pair opens the
   massing seam (the plan's own order), and T2M/T2P/T2S are chair-blocked; (d) E is chartered
   VERBATIM by §287.16 ("typed functional volumes") and §10.16(3) ("the volume law's attachment
   vocabulary needs `MassPartQ`/`SolidPartQ`, which D3a mints"); (e) E unblocks F, which
   discharges §299.3(a) — one of the three recorded obligations the chair carries.
5. **Plan staleness found while arguing it** (full ledger draft §13): the "persisted record
   family" classification superseded by the T2D precedent; the census shape corrected by
   derivation; the ~140-line estimate replaced by a measured basis; the §9.1 E-off-D edge
   re-classified as train order, not symbol dependency.

## §3 · Judgment calls (all recorded in the draft; each vetoable)

- **J-TCT2E-1 · The member determination** (§2 above; draft RAISED-1). Chose the plan's roster
  over the dispatch's two-candidate frame, with both candidates' dispositions argued from
  standing rulings. Say "veto" to re-scope — that veto is a chair act re-chartering D3a, and the
  draft says so rather than pretending the choice was free.
- **J-TCT2E-2 · Unstamped in-memory records** over the plan's "one persisted record family"
  (draft resolved-contradiction 1; RAISED-4) — the J-TCT2D-2/§334.4 precedent extended, so the
  growing K/L/M shape never puts two shapes under one stamped name; the first persisting member
  mints once.
- **J-TCT2E-3 · Vocabulary scope** (RAISED-5): `functionalVolume` + `morphologyRole` + unknown
  reasons IN (the fields `massPartQ` itself consumes), `functionalProgram`/`floorProgram`/
  materials/roofs/origins OUT (dead vocabulary until K/M consume them).
- **J-TCT2E-4 · The degeneracy check is INTERNAL BigInt** rather than an `exactGeometry.js`
  extension (resolved-contradiction 3) — extending T2B's leaf would break the
  zero-existing-files-modified pattern for one internal predicate; the docblock carries the P1
  figures. The adjacent T2F overflow finding is carried as RAISED-6, not fixed here.
- **J-TCT2E-5 · `supportSurfaceId` is a canonical id string** (resolved-contradiction 4) — the
  D1 predicate's own comparison shape, executed at P4; SPEC §10.5's typed five-branch
  `SupportSurfaceRef` is MF-T2K's subject and types the same field without renaming it.
- **J-TCT2E-6 · MF-T2F's arriving names are RESERVED by an explicit forbidden-names list**
  (draft §5) — `PLAN_ERA_VERTICAL`, `OVERLAP_FLOOR_Q`, `planEraSolid`, `solidOverlap`,
  `intervalOverlapVerdict`, `footprintIsAnswerable`, `dualRunLegality` — so this member cannot
  mint a name the F port re-declares and red the single-declaration walker at F's landing. The
  habitat MF-T2A closed stays closed by construction.
- **J-TCT2E-7 · No overlap/intersection/volume helper is exported** — the one-predicate-home law
  (§287.12 precedent); the stacked-pair zero-volume pin is deliberately LEFT to MF-T2F's matrix
  so the predicate and its pin land together.
- **J-TCT2E-8 · The census shape is the two-file domain-matrix + determinism-companion**
  (+2/0/+2/+7/+2) over the plan's single-file +6 — derived from the actual case count, the same
  correction every landed member of this wave recorded.

## §4 · RAISED for the chair (carried in draft §13)

1. The member determination itself — adopt MF-T2E per the standing roster; veto = D3a re-scope.
2. The arrangement-stage dual-run INSTRUMENT as a parallel measurement lane (the §344.1
   candidates' real value, in its lawful shape).
3. The §P2.7 height door: the interval CONTRACT is minted deliberately; `heightQ()` untouched;
   height's first publication stays owed.
4. No kind/version stamp on the records (the first persisting member mints once).
5. Vocabulary scope (three lists in, the rest named OUT with owners).
6. The T2F carry: the D1 VOLUME arm's `Number` arithmetic (`areaQ * h` over a float area) is an
   R-MF-2 conviction waiting at F's port; carried with its executed fixture.
7. `SolidPartQ` omits the shell machinery (K's subject); field names upward-compatible.

## §5 · Skeptic pass over this compile's own output (corrections applied before delivery)

- **The exit-capture trap fired on this lane's own first scan** (§1.3) — the collision scan's
  "exit 0" belonged to `head`, not `git grep`. Caught by re-derivation, redone with the grep's
  own exit; the draft's preflight orders the corrected form. Banked here because the estate law
  ("trust no exit status you did not capture") convicted its own enforcer mid-compile.
- **A fixture defect found only by execution:** the probe's `support:wallTop:w9` id was refused
  by the landed grammar (lowercase-only). A compile that had written A-case fixtures from the
  SPEC's prose (which uses camel-case names throughout) without executing would have shipped six
  broken fixtures. P2b now pins the grammar and the draft instructs fixture spelling.
- **A6 gained its second arm during the mutant design:** M1 (BigInt→Number) is convicted by the
  sliver's refusal — but a matrix with ONLY the sliver arm could go vacuous if the degeneracy
  check were deleted outright (both spellings then accept everything). The genuinely-collinear
  refusal arm (BigInt `2A = 0` exactly) was added so the check's presence AND its arithmetic are
  separately witnessed.
- **The first API sketch passed the vocabulary as a caller argument everywhere;** refined so
  `massPartQ` routes `functionalVolume` internally against `FUNCTIONAL_VOLUME_KINDS` and the
  generic pair stays exported for K/M reuse — otherwise every caller could pass its own list,
  which is an open vocabulary wearing a closed one's name. The prototype executed the refined
  branches.
- **Checked and NOT taken:** seeding an MF-T2F draft (F's shape is already fixed in the plan and
  its compile owes its own base measurements post-E); porting `PLAN_ERA_VERTICAL`'s ABSENT arm
  here (it is F's export; T2E records always carry INTERVAL verticals and the interop with
  ABSENT-era records was executed at P4 from the D1 side).

## §6 · Line budgets (measured basis)

- `draft-MF-T2E.md`: 654 physical lines (measured by `wc -l` after the final edit) — the
  packet's PRODUCTION budget is ≤180 effective
  lines (leaf ≤160), basis §1.9; the packet document itself carries no effective-line cap and
  matches the T2D draft's form and length class.
- This receipt: written after the draft; both claim-scanned (§1.11) before delivery.
