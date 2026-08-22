# laneTET2E-receipt.md — executor receipt for MF-T2E (D3a member 5, the mass-part vocabulary)

Lane **TE-T2E**, executor seat (ODQ §348; Opus per §343.2). Worktree
`scratchpad/tet2e-tree` (own `node_modules` from `npm ci`, `NPMCI_TRUE_EXIT=0`); pristine
base-proof worktree `scratchpad/tet2e-baseproof` (node_modules symlinked from tet2e-tree).
No ref moved. Main worktree never written — the two reads against it
(`git hash-object`, `diff`) are pure reads.

- **Base:** `claude/composite-r4` = `27c250f94bb7c5c799693a62985c5ddecd4b6c7c` (the MF-T2D
  landing). ⚠ The draft was compiled pinned to `3ac279db`; **every `STOP: RE-DERIVE AT BASE`
  marker was re-derived at 27c250f9 and is recorded below with its instrument.**

## §1 · Preflight (§4), every row executed at MY base

| # | check | result at 27c250f9 | verdict |
|---|---|---|---|
| 0 | `shasum -a 256 docs/implementation/preambles/MF-PREAMBLE.md` | `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` | **MATCH** — no third re-stamp |
| 1a | preserved D1 `solidLegality.js`, `git cat-file blob 0c46df07… \| shasum -a 256` | `b2f59501f1902cd74b470238996c5bd875a84a8934aa8124517d2159bdb7f645` | **MATCH** |
| 1b | GENERATION-SPEC blob | ⚠ **first read DIVERGED** — see §2 | **RESOLVED, not shrugged** |
| 2 | name-collision scan over `src tests` | `GREP_EXIT=1`, zero hits | **CLEAR** |
| 3 | `npx vitest run tests/lint/townMapFabricSingleDeclaration.walker.test.js` | 5 passed, `TRUE_EXIT=0` | green; floors are `toBeGreaterThanOrEqual` (18 files / 94 names) so an arriving leaf can only strengthen them — **no exact count pin this member moves** |
| 4 | fabric-touching test battery, counts BEFORE first edit | §5 | captured |
| 5 | census tuple, placeholder-and-convict | §3 | **CONVICTED, all five** |
| 6 | `typecheck:ratchet` + `typecheck:domain:strict` floors | §4 | captured |
| 7 | §4.2 probes re-executed at base | §6 | **all reproduce** |

## §1b · Chair rulings received at the GO (ODQ §351–§353), and their effect here

| item | chair ruling | effect on this lane |
|---|---|---|
| **A** spec anchor | ✅ **ALREADY CURED at §351.1**, ~2h before this lane raised it: the whole W3F delta was verified and the spec file committed to the ledger branch | **Re-verified at landing:** `review-fixes-2026-07-08:map-corpus/docs/GENERATION-SPEC.md` now resolves to `aa613cb8d9ea8b895236304e9e72b08940ba1698`, matching the working file. The anchor is a durable committed object. Packet §4 and RAISED-A rewritten to CLOSED (commit `a09138d7`) so this member does not ship a stale finding |
| **B** gate-mutex | **J-TET2E-0 RATIFIED**; the `recover_dead_owner` reaper for ownerless locks (age-guarded, with a planted killed-mid-acquisition test) is queued in the TE-HOUSE bundle | no action owed here |
| **C** T2F overflow | carried per §348.2 with its executed fixture | correctly not this member's |
| **D** census delta | **J-TET2E-1 RATIFIED** — the row rises to the measured `+41/−1`; the precedent chain (T2C +27, T2D +36) shows the DRAFTED figure was the outlier, not the measurement | packet row already carries `+41/−1` |
| class note | scope any manifest edit to your own row **by unique key**, never a blanket sed; the validator's DRAFT-time blind spot is queued to TE-HOUSE as a validator gap | recorded in the packet body at `a09138d7` |

## §2 · ⚠ STOP row 1b, worked rather than waved through

The draft requires the spec blob to hash `aa613cb8d9ea8b895236304e9e72b08940ba1698`.

- `git rev-parse review-fixes-2026-07-08:map-corpus/docs/GENERATION-SPEC.md` → `7dcd70abe85c85851cd3f381736c7a5fee59c8f6` — **NOT the cited value.**
- Same blob at the compile's own ledger head `83227384`: also `7dcd70ab…`. So the committed object never moved; the divergence is not a shear.
- `git hash-object /Users/cstokes/Desktop/settlement-engine/map-corpus/docs/GENERATION-SPEC.md` (the main worktree's **working file**, read-only) → **`aa613cb8d9ea8b895236304e9e72b08940ba1698`** — the cited value exactly.

**Diagnosis:** the compile cited the WORKING-TREE hash (it ran `git hash-object <path>` in the
ledger worktree), and that file is **dirty relative to its branch**. My first read resolved the
committed tree entry, a different object. The pin is satisfiable, at the artifact the compile and
the landed preamble both actually cite.

**Proved harmless for this member rather than assumed:** the committed blob was extracted to
`laneTET2E-spec-committed.md` and diffed against the working file —
`laneTET2E-spec-diff.txt`, 32 lines, `DIFF_TRUE_EXIT=1`. The entire difference is one `⟦FOLD §303⟧`
progress block inserted after line 4083 and one status-table row rewritten at 10334, both about
MF-W3F. **§7.1.2, §10.5 and §10.16 are byte-identical in both**, so every vocabulary this member
pins is the same text under either reading.

⭐ **RAISED-A (new, this lane):** the family's cited spec anchor `aa613cb8…` is an **uncommitted
working-tree state**, not a committed object. It is not reproducible from git history by any later
checkout, and it evaporates if the owner commits, reverts or stashes that file. Every packet in
this family cites it. Recommend the chair either commit the spec file or re-cite the packets to
the committed blob. Not fixed here — outside this member's manifest.

## §3 · Census, placeholder-and-convict at base (log `laneTET2E-census-convict.log`)

Run in the **pristine base-proof tree**, one figure replaced by `-1` per arm so the earlier
sequenced assertions pass and the target reports its own measurement.

```
ARM 0  bare run at base                      ARM0_TRUE_EXIT=0   (green: the tuple is a true
                                                                 measurement of THIS tree)
files       -> expected 2492  to be -1       ARM_files_TRUE_EXIT=1
parked      -> expected 364   to be -1       ARM_parked_TRUE_EXIT=1
credited    -> expected 2128  to be -1       ARM_credited_TRUE_EXIT=1
titles      -> expected 20677 to be -1       ARM_titles_TRUE_EXIT=1
suiteTitles -> expected 5780  to be -1       ARM_suiteTitles_TRUE_EXIT=1
RESTORE_CMP_TRUE_EXIT=0   (walker restored byte-exact by cp+cmp, never `git checkout --`)
```

**BASE TUPLE (convicted): `2492 / 364 / 2128 / 20677 / 5780`.**

⚠ The draft's compile-tip tuple was `2490/364/2126/20669/5778`. **Not carried** — re-derived. The
shear is T2D's landing (+2 files, +2 credited, +8 titles, +2 suites), which is exactly why the
tuple is convicted rather than inherited.

## §4 · Typecheck floors at base

```
[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).   RATCHET_TRUE_EXIT=0
[domain-strict] ✓ no strict-type regressions (1134 errors, ceiling 1134).   STRICT_TRUE_EXIT=0
```

⛔ **BOTH SIT EXACTLY AT THEIR CEILINGS**, so this member's allowance is ZERO new type errors in
either configuration — there is no headroom to spend and no `townMap/fabric` key in either
baseline to spend it against. Re-run after the leaf landed: **173/173 and 1134/1134, unchanged.**

## §5 · Untouched-pin control, BEFORE arm

Denominator: 57 fabric-touching files, enumerated at base into `laneTET2E-control-set.txt` (the
digest-pin, golden and determinism suites included) and used as an EXPLICIT list at both ends, so
the two readings share a denominator that my own two new files cannot change.

```
CONTROL_BEFORE_TRUE_EXIT=0   FILES=57  TOTAL_TESTS=387  NON_PASSED_FILES=0
per-file counts: laneTET2E-control-before.txt
```

## §5b · ⚠⚠ ORPHANED GATE LOCK — diagnosed, cleared, and a real defect in `gate-mutex.sh`

**Symptom:** the focused run queued for ~13 minutes; `gate-mutex.sh` reported *"HELD by atomic lock
with an unreadable owner"*.

**Diagnosis, measured rather than assumed:**

- the lock dir existed but was **EMPTY** — no `pid` file (created 22:35:45, last touched 22:44:21);
- **BOTH** `gate-mutex --run` processes present (mine, and sibling lane WF-1F's
  `check-test-ratchet.mjs`) had a `sleep 30` child — i.e. both were POLLING, neither holding;
- `REAL_RUNNERS=0` — no `vitest run` and no `check-test-ratchet` process existed at all, once the
  count excluded the waiting `gate-mutex.sh` wrappers, whose own command lines contain the string
  `vitest run`. ⚠ My first guard convicted on that substring and aborted correctly-but-wrongly;
  the refined guard printed every match in full before deciding.

⛔ **THE DEFECT, worth banking:** `recover_dead_owner` reads the owner pid and bails at
`[ -n "$_stale_owner" ] || return 1` — so it can only reclaim a lock whose pid file names a DEAD
process. A lock dir with **no pid file at all** — exactly what a process killed between its
`mkdir` and its `printf '%s\n' "$$" > "$OWNER_FILE"` leaves behind — is structurally
**unreclaimable**, and every later lane polls to exhaustion and exits 3. Two lanes were already
deadlocked on it.

**J-TET2E-0 (judgment call, vetoable):** cleared the orphan with `rmdir` (not `rm -rf`, so the
removal fails safely if a pid file appears), behind two re-checked guards. Rationale: no live
process owned it, the script cannot reclaim it, and it was blocking a sibling lane as well as this
one. This is an operational unblock of a shared resource, not a gated class. **RAISED-B:** give
`gate-mutex.sh` a reaper for the owner-less case, or write the pid before the dir is observable.

## §6 · The §4.2 probes, RE-EXECUTED at base (log `laneTET2E-probe/driver.log`, `PROBE_TRUE_EXIT=0`)

Sandbox modules extracted fresh from `refs/preserve/map-sandbox-w3f-sealed` into the scratchpad —
never into the app or test tree. Hashes verified at extraction:

```
solidLegality.js  b2f59501f1902cd74b470238996c5bd875a84a8934aa8124517d2159bdb7f645  (= the packet's required hash)
coordinateAbi.js  123f3c17ebd42da5223216f0029617706db49b3de7ab602acd6edcf72a2c8404  (= the hash the LANDED coordinateAbi.js docblock cites as its port source — cross-verified)
fabricGeometry.js c40c75b1fff4dd7393677f18e5b755dfb2a7fe17f4bc94a2a30f97621c78ed6e
trigTable.js      cf519556fda38a7df12bf161647b8ad2ff71418f4a7be7edc31d6a8851d76da3
```

Every compile figure reproduced at this base:

```
P1  m=1286630001, MAX_WORLD_UNITS=9007199254
    Number 2A = 0 · BigInt 2A = -1 · landed float area() = 0, absArea = 0
    control triangle: Number 2A = 12000000, BigInt 2A = 12000000  (agree)
    NEW ARM (for A6's second half): collinear [[0,0],[1000,1000],[2000,2000]]
      Number 2A = 0 AND BigInt 2A = 0  — a genuinely collapsed ring, zero in BOTH spellings
P2  non-integer / past-wall -> TypeError: <label> must be an integer in -9007199254..9007199254
    empty id -> '<label> must be a canonical id' · non-record -> '<label> must be an object'
    negative in-wall coordinate ACCEPTED (a keel below its support datum is legal)
    heightQ() -> Error: 'COORDINATE_ABI: heightQ is declared and UNEXERCISED…'  (door still shut)
P2b canonical-id grammar: 'support:wallTop:w9' REFUSED, 'support:wall-top:w9' admitted
    -> LOWERCASE ONLY, as the chair ruled; fixtures built to the grammar
P3  records deep-frozen (record AND footprint); vertical {"kind":"INTERVAL","baseQ":0,"topQ":5000};
    abiVersion 1; replay JSON-identical = true
    the wall-scale sliver CONSTRUCTS (BigInt) while absArea(tri) reads 0 (Number control)
    the collinear ring is REFUSED 'zero signed area (degenerate ring)'
    typed refusals on [5000,5000) empty, [9000,5000) inverted, float baseQ
P4  the sealed D1 solidOverlap, READ-ONLY, adapted BY KEY:
    stacked [0,5000)x[5000,9000) same support/footprint ->
      {"kind":"VOLUME","sharedAreaQ":100000000,"sharedHeightQ":0,"sharedVolumeQ":0,
       "verdict":"DISJOINT_OR_ABUTTING"}          ⭐ the half-open law as executed behavior
    overlapping -> sharedVolumeQ 75000000000, OVERLAPPING
    different support -> REFUSED / DIFFERENT_SUPPORT_SURFACE
    plan-era ABSENT vs INTERVAL -> PLANAR_ONLY, verticalStatus ABSENT
    same id -> REFUSED / SAME_SOLID_ID
```

⭐ **P4 is the charter executed at MY base:** the record this member publishes is admitted by
MF-T2F's port source verbatim, with zero adaptation.

## §6b · The implemented leaf, measured

```
effective lines (eslint's own Linter, {skipBlankLines, skipComments}):  118   cap 160   EFFLINES_TRUE_EXIT=0
exported declarations (the single-declaration walker's own regex):        8   as promised
MF-T2F reserved names present:                                            0   (grep exit 1)
CURRENT_MAP_TRADITION_ID in any created file:                             0   (grep exit 1)
dcelEmbedding.js plant anchor at column zero:                       PRESENT   byte-identical, host never opened
barrel src/domain/townMap/fabric/index.js:                        UNTOUCHED   (empty git diff --stat)
npx eslint <leaf>:                                     ESLINT_TRUE_EXIT=0
npx eslint <both test files>:                    ESLINT_TESTS_TRUE_EXIT=0
typecheck:ratchet / typecheck:domain:strict WITH the leaf:   173/173 and 1134/1134, both TRUE_EXIT=0
enforcement-claim scan over the packet doc, using the LIVE regex extracted from
  tests/docs/enforcement-claims.test.js rather than transcribed:  CLAIM_HITS=0, TRUE_EXIT=0
anchor-walker static precheck, both new files:      unanchored=0 / unanchored=0 (new-file ceiling is 0)
npm run validate:packets at DRAFT:               VALIDATE_DRAFT_TRUE_EXIT=0, 138 packets (0 READY)
```

**Member acceptance battery, first full run:** `Test Files 2 passed (2) · Tests 7 passed (7)`,
`MEMBER_R1_TRUE_EXIT=0` (log `laneTET2E-member-r1.log`; the mutex line records
`acquired atomic lock as PID 24563 after 28 poll(s)` — the 28 polls are the orphaned-lock episode
of §5b, not a test problem).

## §6c · Commits — ⚠ SUPERSEDED BY THE REBASE, kept for the audit trail

These four were built on `27c250f9` and are **no longer the deliverable** (see §6i). The live
commit list is in §6L.

| sha | transition | validator |
|---|---|---|
| `77f03446` | `docs(MF-T2E): open the mass-part vocabulary at DRAFT` | `VALIDATE_DRAFT_TRUE_EXIT=0`, 138 packets (0 READY) |
| `b389a73d` | `docs(MF-T2E): DRAFT -> READY, with the whole section 4 preflight executed at this base` | `VALIDATE_READY_TRUE_EXIT=0`, 138 packets (1 READY) |

Untracked leaf and test files confirmed surviving the pre-commit hook after BOTH commits
(`git status --porcelain` printed all three each time). Staging was explicit, three named paths
per commit; no `git add -A/-u/.` was used at any point.

## §6d · A matrix gap found by designing the mutants, and closed before the sweep ran

⭐ Planning M7 (footprint coordinate validation bypassed) exposed a real hole: A2 exercised a bad
INTERVAL quantum and a degenerate ring, but never a bad footprint **coordinate** — so a mutant that
replaced `requireCanonicalInt(point[0], …)` with a bare `Number(…)` would have gone UNCONVICTED and
the matrix would have looked complete. Two arms were added to the existing A2 (a float coordinate
and an out-of-wall coordinate, each asserted at its own indexed label). ⚠ They were added to an
EXISTING `test()`, so the census delta is unaffected — no title and no suite title moves.

This is the removing-power sweep doing its job at design time rather than at run time, and it is
recorded because the gap was in MY matrix, not in the draft's.

## §6e · Post-build dormancy: the forensic zoom (`laneTET2E-zoom.log`, `ZOOM_TRUE_EXIT=0`)

`npm run build` → `BUILD_TRUE_EXIT=0`, 524 emitted chunks, 314 prerendered route documents.

⭐ **THE HONEST SHAPE, per the §331.3 / MF-T2D precedent.** This leaf is imported by NOTHING — not
the barrel, not any production module, only its own two test files. So it does not merely sit
OUTSIDE the entry closure; it is in **no emitted chunk at all**, because a module with no importer
never enters the graph. The zoom asserts that, and says so, rather than dressing it up as a
lazy-chunk arm it cannot support.

```
DENOM_all_dist_chunks=524
DENOM_entry_static_closure_chunks=8   (entry=index-B_cUZpC0.js, walked the way the landed fence walks it)

SCANNER CONTROLS, asserted PRESENT before any absence is believed:
  C1 '::town-map:v1'   in 3 of 524 chunks   -> the scanner really reads chunk bytes, and the
                                               town-map surface really IS emitted (lazily)
  C2 'createElement'   in 4 of 8 closure chunks -> the closure walk is populated, so scanning
                                               the closure subset can find things

MEMBER-UNIQUE LITERALS (string literals survive minification, so they are stable fingerprints):
  'the half-open interval law'                       entry_closure=0   all_dist=0
  'has no closed vocabulary to be checked against'   entry_closure=0   all_dist=0
  'the part/solid identity law'                      entry_closure=0   all_dist=0
  'zero exact signed area (degenerate ring)'         entry_closure=0   all_dist=0

TOTAL_entry_closure_hits=0    ZOOM_VERDICT=PASS
```

⚠ Both denominators are NAMED, because an absence measured over a set that never contained the
surface proves nothing (§P2.12). The C1 control is what makes the 0 meaningful: the same scanner,
over the same 524 files, finds the landed town-map fingerprint three times.

## §6f · ⚠⚠ MY OWN CENSUS INSTRUMENT LIED — caught by its confirming run, banked here

**What I built first:** a loop that ran the walker with the BASE tuple in place and attributed the
Nth assertion failure to the Nth census key, patching each figure from the message it read.

**Why that is wrong, and it fired immediately:** `parked` is UNCHANGED by this member (364 → 364),
so the parked assertion **passed** and the next failure belonged to `credited`. The loop read a
TRUE figure — `expected 2130 to be 2128` — and wrote it under the WRONG NAME. Every later arm then
inherited the corruption, and the walker ended up carrying a garbage line:

```
    files: 2494, parked: 2130, credited: 364, titles: 364, suiteTitles: 364,     ⛔ NONSENSE
```

**What caught it:** the script's own CONFIRMING RUN — `CONFIRM_TRUE_EXIT=1`. A conviction sweep
that ends without re-running the walker green would have banked this. ⭐ The confirming run is not
ceremony; it is the only thing standing between a plausible-looking tuple and a landed lie.

**The recovery, done by the estate's own rules:** restored the walker with
`git show HEAD:<path> > <path>` — deliberately NOT the `git checkout --` family, which discards
uncommitted work in a shared tree — then proved the restoration two ways: `cmp` against the
base-proof pristine copy (`CMP_TRUE_EXIT=0`) and an empty `git status --porcelain` for that path.

**The corrected instrument** (`laneTET2E-census-after2.sh`) uses a **-1 SENTINEL**, which makes
each arm self-identifying: exactly one key is set to -1 per run, every earlier key already carries
its resolved value so its assertion passes, and the arm **ABORTS rather than guessing** unless the
message reads literally `expected <N> to be -1`. This is the same shape the BASE conviction used —
the base run was correct precisely because the sentinel removed the attribution question.

⭐ **THE LESSON, and it is the estate's own law in a new hat:** "never carry a tuple" is usually
read as a warning about STALE figures. This was a FRESH figure attributed to the wrong NAME. A
measurement is not trustworthy because its number is real; it is trustworthy when the instrument
can say WHICH question the number answers.

## §6g · The AFTER census, convicted with the corrected instrument

```
ARM files       'expected 2494  to be -1'   MEASURED=2494
ARM parked      'expected 364   to be -1'   MEASURED=364
ARM credited    'expected 2130  to be -1'   MEASURED=2130
ARM titles      'expected 20684 to be -1'   MEASURED=20684
ARM suiteTitles 'expected 5782  to be -1'   MEASURED=5782
CONFIRMING RUN: CONFIRM_TRUE_EXIT=0, Tests 33 passed (33)
```

**BASE `2492/364/2128/20677/5780` → AFTER `2494/364/2130/20684/5782`; DELTA `+2/+0/+2/+7/+2`.**
Decomposed and closing exactly: the domain matrix contributes 6 titles + 1 suite title, the
determinism companion 1 title + 1 suite title. `parked` unchanged at 364, earned by the SP-D idiom.
The delta equals the titles added, so the §11 "a delta smaller than the titles added" attribution
walk is not triggered.

## §6h · §10 focused verification (one held slot, `laneTET2E-verify.log`)

```
1 · anchor preflight        ANCHOR_TRUE_EXIT=0        Tests 9 passed
2 · member battery + the two binding walkers
                            MEMBER_TRUE_EXIT=0        Test Files 4 passed, Tests 45 passed
3 · untouched-pin control, AFTER arm
                            CONTROL_AFTER_TRUE_EXIT=0
4 · dormancy fence, POST-BUILD, VERIFY_DIST=1 against the fresh dist
                            LAZY_TRUE_EXIT=0          Tests 3 passed
```

⭐ **THE UNTOUCHED-PIN CONTROL IS EXACT, compared PER FILE rather than by a summary line:**

```
FILES  before=57   after=57
TESTS  before=387  after=387
FILES_WITH_ANY_MOVEMENT=0
```

Every one of the 57 fabric-touching files — the digest-pin, golden and determinism suites included
— reports the identical test count AND the identical status at both ends. This member adds a leaf
and moves nothing that already existed.

## §6i · ⚠ THE BRANCH MOVED — the slot-aware rebase, executed

TE-WF1F took the CAS slot first: `claude/composite-r4` advanced `27c250f9` → **`5d18b4a0`**
(`feat(WF-1F): the last altar names the whole creed, not its last syllable`). The protocol was
followed rather than improvised:

1. **Cherry-pick attempted first** — it conflicted immediately on `PACKET_MANIFEST.json` (both
   members append at the tail). Aborted rather than hand-merged, because the protocol's own remedy
   is byte-restore-and-re-append, not conflict surgery on a shared file.
2. **The three shared meta files were byte-restored from the NEW base** and this lane's appends
   re-run on top by a scripted restate (`laneTET2E-restate.mjs`), so WF-1F's manifest and index
   rows are carried forward untouched and in landing order.
3. **Preflight re-executed at `5d18b4a0`:** preamble `0706aad6…` MATCH; preserved `solidLegality`
   `b2f59501…` MATCH; collision scan `GREP_EXIT=1`, zero hits; the census walker verified untouched
   by WF-1F (`git diff` empty, and this lane's pristine snapshot still `cmp`-matches).
4. **The untouched-pin denominator transfers WITH PROOF, not by assumption:** `git diff 27c250f9
   5d18b4a0` over the explicit 57-path list is EMPTY, so the before-arm (57 files / 387 tests)
   measured at the old base is a valid before-arm at the new one.
5. **The census was re-measured at BOTH ends at the new base** rather than carried — see §6j.
6. Static re-verified at the new base: `ESLINT_NB_TRUE_EXIT=0`, leaf still **118** effective lines,
   `typecheck:ratchet` 173/173 `TRUE_EXIT=0`, `typecheck:domain:strict` 1134/1134 `TRUE_EXIT=0`.

## §6j · ⚠⚠ A SECOND NEAR-MISS: a blanket `sed` rewrote a SIBLING's landed row

Repointing this packet's `verifiedBase` at the new base, I ran a blanket substitution across
`PACKET_MANIFEST.json` — which also rewrote **WF-1F's** `verifiedBase` from `27c250f9` to
`5d18b4a0`. That is editing another lane's landed row in a shared file.

**What caught it:** `npm run validate:packets` at the READY transition —
`WF-1F verifiedBase disagrees with packet Markdown: manifest=5d18b4a0… packet=27c250f9…`.
⚠ It did **not** fire at the DRAFT transition, so a member that only ever validated at DRAFT would
have carried the corruption into its landing.

**Worse, the bad state had already been committed.** The first DRAFT commit on the new base
(`7e67f88b`) contained it. That commit was discarded — `git reset --mixed` back to `5d18b4a0`, the
meta files rebuilt from the base, and **only this member's own entry repointed**, verified by
reading the manifest diff line by line: the sole `verifiedBase` line in the diff is a `+` belonging
to my new entry, with no `-` line anywhere.

⭐ **THE LESSON:** the estate law is "verify every staged hunk is yours". A blanket `sed` across a
SHARED manifest cannot satisfy that law by construction — it edits by pattern, and a sibling's row
matches the same pattern. Target the edit at the entry, then prove the diff.

## §6k · The census at the NEW base, both ends (`laneTET2E-census-newbase.log`)

```
(a) BASE ARM — the walker run BARE in the pristine base-proof tree at 5d18b4a0
    BASE_ARM_TRUE_EXIT=0   Tests 33 passed (33)
    recorded tuple there:  2492 / 364 / 2128 / 20677 / 5780
    ⇒ WF-1F genuinely moved nothing. Its commit message says so; this lane EXECUTED it
      rather than taking the message's word, which is the whole point of the arm.

(b) AFTER ARM — the -1 sentinel conviction in the working tree
    files 'expected 2494 to be -1'   parked 'expected 364 to be -1'
    credited 'expected 2130 to be -1'  titles 'expected 20684 to be -1'
    suiteTitles 'expected 5782 to be -1'
    CONFIRM_TRUE_EXIT=0   Tests 33 passed (33)
```

**BASE `2492/364/2128/20677/5780` → AFTER `2494/364/2130/20684/5782` at the new base.** The tuple
is numerically identical to the one derived at the old base — which is precisely the shape of carry
that feels safe and is forbidden. It was re-derived, not reused.

## §6L · THE LIVE DELIVERABLE — four commits on the new base, tip for CAS

**Base `5d18b4a0` (the WF-1F landing) · TIP FOR CAS `a09138d7`**

| sha | transition | validator |
|---|---|---|
| `14cc6b4e` | DRAFT | `TRUE_EXIT=0`, 139 packets (0 READY) |
| `6f306ed9` | DRAFT → READY, §4 preflight re-executed at this base | `TRUE_EXIT=0`, 139 packets (1 READY) |
| `bfa5709e` | the implementation + the census re-record | — |
| `70fd4946` | READY → LANDED, the landing record and the ten created symbols | `TRUE_EXIT=0`, 139 packets (0 READY) |
| `a09138d7` | RAISED-A closed as cured (§351.1, re-verified) + the manifest-edit class rule | `TRUE_EXIT=0`, 139 packets (0 READY) |

**Sibling-safety proof, executed rather than asserted:** WF-1F's manifest entry is byte-identical
at `5d18b4a0` and at my tip; **`pre-existing packet entries altered by me: 0`**; the manifest grows
138 → 139, a pure addition. The MF-T2A plant line is present exactly once at column zero and
`git diff 5d18b4a0 HEAD -- dcelEmbedding.js` is EMPTY — the host was never opened.

⚠ The pre-commit hook ran `eslint --fix` over the four staged `.js` files at `bfa5709e`. Verified
it changed nothing: the COMMITTED leaf and the WORKING-TREE leaf both `cmp`-match the snapshot the
mutant sweep validated (`TRUE_EXIT=0` both). The hook's own transient stash was cleaned up; the one
stash remaining in the list (`On analytics-intelligence-layer: generation-tuning fixes`) is FOREIGN
— a different branch, predating this lane — and was left untouched.

## §6m · Full verification at the new base, every exit captured in-shell

```
eslint (leaf + both test files) ..... ESLINT_NB_TRUE_EXIT=0
effective lines (eslint Linter) ..... 118   cap 160 (leaf) / 180 (packet)
typecheck:ratchet ................... TRUE_EXIT=0   173 errors, ceiling 173   (AT ceiling, unmoved)
typecheck:domain:strict ............. TRUE_EXIT=0   1134 errors, ceiling 1134 (AT ceiling, unmoved)
anchor preflight .................... ANCHOR_TRUE_EXIT=0     9 passed
member + both binding walkers ....... MEMBER_TRUE_EXIT=0     4 files, 45 passed
untouched-pin control, after arm .... CONTROL_AFTER_TRUE_EXIT=0
   -> FILES before=57 after=57 · TESTS before=387 after=387 · FILES_WITH_ANY_MOVEMENT=0
   -> denominator validity across the move PROVED: git diff 27c250f9..5d18b4a0 over the 57
      explicit paths is EMPTY, so the before-arm transfers rather than being assumed
npm run build ....................... BUILD_NB_TRUE_EXIT=0   524 chunks, 314 route documents
dormancy fence VERIFY_DIST=1 ........ LAZY_TRUE_EXIT=0       3 passed
forensic zoom ....................... ZOOM_NB_TRUE_EXIT=0    ZOOM_VERDICT=PASS
   -> 0 of 8 entry-closure chunks, 0 of 524 dist chunks; controls C1 3/524, C2 4/8
validate:packets .................... TRUE_EXIT=0            139 packets
enforcement-claim scan (live regex) . CLAIM_HITS=0, TRUE_EXIT=0
seven-mutant sweep .................. M0=0 · M1→A6 · M2→A2 · M3→A3+A7 · M4→A4 · M5→A3+A5 ·
                                      M6→A1 · M7→A2 · RESTORE_CMP=0 · M8=0
```

## §6n · THE TERMINAL GATE — RED, and the red is being CLASSIFIED, not rerun

```
npm run check:tail   (bare, fresh shell, never piped, never wrapped)
CHECKTAIL_TRUE_EXIT=1
[gate-tail] exit: 1 (the gate's own status, not a pipe's)
```

Everything upstream of `test:ratchet` passed — eslint reports `29 problems (0 errors, 29 warnings)`,
which is warnings-only and not a gate failure. The single blocking line:

```
[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
  1 failing test(s) NOT in the frozen census:
    tests/domain/distribution.test.js :: trade-route gating isolated settlements
      never bypass trade-route requirements
Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.
```

### Baseline lookup FIRST, before treating the red as blocking

The frozen 11 were read out of `scripts/.test-ratchet-baseline.json` rather than recalled. They are
the six the chair named — `warCostKindPools` ×3, `warRulingKindPools` ×1, `clampPrimitiveBaseline`,
`enforcement-claims @enforced-by` — plus `voiceMechanics` ×4 and `metronomeCooldownLint`.
**`distribution.test.js` is NOT among them.** So this is a genuine non-census red and may not be
waved through.

### Four-leg classification (`laneTET2E-classify.log`)

```
LEG 2 · PRISTINE base-proof tree at 5d18b4a0, massPart.js confirmed ABSENT
        run1/2/3 -> TRUE_EXIT=0, Tests 32 passed   (all three)
LEG 1+3 · MY tree at a09138d7
        run1/2/3 -> TRUE_EXIT=0, Tests 32 passed   (all three)
```

⭐ **The test passes 32/32 in ISOLATION in BOTH trees, three times each.** It fails only inside the
full suite. Isolation therefore does not discriminate, and a "rerun until green" would have been
the wrong move — the file is green on demand.

### What the test is, measured

`tests/domain/distribution.test.js` is **seed-deterministic**: `generateMany` walks fixed seeds
`dist-town-0…N` through `generateSettlementPipeline` with `customContent: {}`. No clock, no RNG, no
locale. A deterministic test that passes alone and fails in the suite is the signature of
**cross-file module-state contamination** (a shared catalog/registry another file mutates), not of
its own logic.

### Provenance

The ratchet baseline was frozen at `4deb4f02`, **182 commits** before this member's base, and
`git diff 4deb4f02..5d18b4a0 -- tests/domain/distribution.test.js` is **EMPTY** — the test file has
not changed since the census was frozen.

### ⭐⭐ CHAIR EVIDENCE THIS LANE DID NOT HOLD (received mid-classification)

**TE-WF1F's full terminal ran `test:ratchet` AT `5d18b4a0` — the very tree this lane's base-proof
mirrors — roughly two hours earlier, and reported `11 known failures of 28,693, ceiling 11`.**
`distribution.test.js` **PASSED** there, in full-suite context, at that exact tree.

That single fact converts the deciding arm from "is it pre-existing?" into a two-branch
classification, because a green already exists at the base:

| deciding arm result | what it means | this lane's action |
|---|---|---|
| base-proof ratchet **REDs** | two full-suite runs at the SAME tree disagree ⇒ **INTERMITTENT** order/scheduling-dependent contamination, pre-existing and latent, surfacing nondeterministically | classification: **pre-existing, not this member's**. Record it as INTERMITTENT — it will strike future gates at random until its source is found |
| base-proof ratchet **GREENs** | the contamination is latent at base and this member's two new test files' **scheduling change reliably TRIGGERS** it. The member's CONTENT is innocent; its PRESENCE reveals a pre-existing cross-file state leak | ⛔ do NOT attempt the cure here (§11 forbids it). Run one cheap narrowing experiment — `distribution.test.js` + ONLY my two new files, then the suite MINUS my two files — to separate "my files are the trigger" from "any reshuffle is the trigger". Report both and **STOP** |

⛔ In BOTH branches the frozen census stays untouched, and this member neither widens it nor banks
a new row. The chair charters the contamination hunt as its own lane and decides whether MF-T2E
lands with a known intermittent or waits.

### ⭐⭐ THE DECIDING ARM RETURNED — AND IT IS **NEITHER** BRANCH

```
npm run test:ratchet   in the PRISTINE base-proof tree at 5d18b4a0 (massPart.js confirmed ABSENT)
BASERATCHET_TRUE_EXIT=1
[test-ratchet] TEST REGRESSIONS: 2 failing test(s) NOT in the frozen census:
  tests/components/npcAuthoringScope.test.jsx :: OutputContainer NPC authoring scope
    a public dossier denies writers even when editMode and the caller capability are stale
  tests/lint/lawBandTable.walker.test.js :: WC-0C · the law-band curve table stays singular
    (the cured C3 fence) reds on a SECOND exporting module and stays green on one, counting by module
```

⛔ **It RED — but on two entirely DIFFERENT tests, and `distribution.test.js` PASSED there.** The
chair's decision tree offered "reds on distribution ⇒ intermittent" or "greens ⇒ my files trigger
it". Neither describes this. What actually exists now is **three full-suite runs at or one commit
above the same tree, producing three DISJOINT non-census failure sets:**

| run | tree | non-census failures |
|---|---|---|
| TE-WF1F's terminal, ~2h earlier | `5d18b4a0` | **NONE** — 11 known of 28,693, ceiling 11 |
| this lane's `check:tail` | `a09138d7` (base + MF-T2E) | `distribution.test.js` |
| this lane's base-proof ratchet | `5d18b4a0`, pristine | `npcAuthoringScope.test.jsx`, `lawBandTable.walker.test.js` |

⭐ **The set of extra failures is itself unstable, and no member of it repeats across runs.** That
is a far stronger result than the chair's intermittent branch: the instability is not localised to
`distribution.test.js` at all — the base tree ALONE, with none of this member's files present,
produces non-census reds on a varying cast.

⚠ **`lawBandTable.walker.test.js` deserves the chair's attention independently.** Traced at this
base: it arrived at `cf7e6466` (*"WC-0C I3: the law-band table's shape, and the fence that keeps it
singular"*), **existed BEFORE the frozen census was measured**, and has not been touched since.
So it was PASSING when the census was frozen — it is not a banked row, and it cannot be dismissed
as "new and unbanked". It is a structural walker (it counts exporting modules), which is the shape
of test that ought to be perfectly deterministic at a fixed commit — yet WF-1F's run at this exact
tree was green and this lane's was red. A deterministic structural test giving two answers at one
commit is itself evidence of order- or resolution-dependent pollution rather than of a real second
exporting module.

⭐ **One of the two base failures is the chair's own named known flake.** The dispatch brief lists
`npcAuthoringScope` as a known flake requiring four-leg classification. Its appearance in a
pristine tree is independent confirmation that this suite's full-run context flakes, and it did so
without MF-T2E existing.

**Therefore `distribution.test.js` cannot be attributed to MF-T2E:** the member's leaf is imported
by nothing, the test passes 32/32 in isolation in both trees, it is byte-unchanged for 182 commits,
it PASSED in the pristine-base full run, and the pristine base produced two different reds of its
own in the same run.

### ⭐⭐ MACHINE CONTEXT — H2 EVIDENCE for the contamination hunt (chair-forwarded)

*(The chair has adopted the figures below into the hunt's founding set as its strongest H2
— load-correlation — evidence, and independently `ps`'d the box to confirm the reading: the
current load IS this lane's confirming ratchet, seven workers at 50–115%, stacked earlier with
TE-WF8's build and sweep.)*

Captured at `00:16` on 2026-08-22, immediately after the base-proof arm and during the confirming
run, on an **8-core** box:

```
load averages:  46.59 (1 min)   75.90 (5 min)   82.28 (15 min)      cores: 8
```

⛔ **That is roughly TEN TIMES oversubscription**, and the 15-minute average of `82.28` covers
exactly the window in which this lane's red gate and the base-proof arm ran. Run end times:

```
08-21 23:54:39   laneTET2E-checktail.log     (RED: distribution)
08-22 00:13:21   laneTET2E-baseratchet.log   (RED: npcAuthoringScope + lawBandTable)
08-22 00:15:39   laneTET2E-repeat-mine.log   (the confirming run, still executing)
```

Both of this lane's non-census reds were drawn under sustained extreme load, while TE-WF1F's clean
`11 of 28,693` was drawn on a quiet box. ⭐ **This is the strongest single support for the
load-correlation hypothesis in the evidence set**, and it is consistent with the varying-cast
signature: a worker-pool suite under ~10× oversubscription reorders and re-times work between
runs, so a latent cross-file state leak lands on whichever victim the scheduler happens to expose.
It also predicts the observed asymmetry — the CAST varies, the COUNT stays small, and no member
repeats.

**Load trend, sampled three minutes later at `00:19`:** `34.13 / 59.76 / 74.36`, down from
`46.59 / 75.90 / 82.28`. By that sample the ONLY competing work on the box was this lane's own
confirming ratchet (7 vitest workers plus its runner) — the sibling lanes' build and sweep traffic
had drained. ⭐ This matters for the terminal draw: the box is quieting on its own, so the final
`check:tail` will run under materially better conditions than the two runs that produced strays,
without anyone having to schedule a wait.

⚠ **Caveat this lane records against its OWN confirming run:** that run is itself executing under
load `46+`, i.e. under the adverse condition rather than a controlled one. A red from it is
therefore weak evidence of anything except that the condition persists; a green under this load is
the stronger of the two outcomes.

### ⭐⭐ THE CONFIRMING CAST — the reliable-trigger hypothesis is REFUTED BY EXECUTION

```
npm run test:ratchet   at THIS lane's own tree a09138d7, unchanged, second draw
REPEAT_MINE_TRUE_EXIT=1
  1 failing test(s) NOT in the frozen census:
    tests/components/npcAuthoringScope.test.jsx :: OutputContainer NPC authoring scope
      a public dossier denies writers even when editMode and the caller capability are stale
load at completion: 19.96 / 52.33 / 65.90
```

⛔ **`distribution.test.js` DID NOT RECUR.** Same tree, same commit, same files, second draw — and
the victim changed. **FOUR full-suite runs now exist, with FOUR different casts:**

| # | run | tree | non-census cast |
|---|---|---|---|
| 1 | TE-WF1F terminal, ~2h earlier | `5d18b4a0` | **NONE** — 11 known of 28,693 |
| 2 | this lane's `check:tail` | `a09138d7` | `distribution.test.js` |
| 3 | this lane's base-proof ratchet | `5d18b4a0` pristine | `npcAuthoringScope`, `lawBandTable` |
| 4 | this lane's confirming ratchet | `a09138d7` unchanged | `npcAuthoringScope` |

**What run 4 settles, and it is the question the chair actually asked:** the green-branch worry was
that this member's two new test files might **RELIABLY** trigger a latent leak. Reliability is a
claim about repetition; repetition was performed; the claim is **FALSE**. The same tree drew a
different victim on the second attempt, and the original victim vanished.

⭐ **Both trees now draw from the same pool.** `npcAuthoringScope` — the chair's own named known
flake — appears in runs 3 AND 4, i.e. in the PRISTINE tree and in this member's tree alike. A
victim common to both trees, with the tree-specific victims (`distribution`, `lawBandTable`) each
appearing exactly once, is the signature of one shared underlying defect sampling a rotating
victim — not of two tree-specific defects.

**Combined verdict, on execution rather than argument:** MF-T2E neither causes nor reliably
triggers any non-census failure. The contamination is pre-existing, load/schedule-sensitive, and
indifferent to whether this member exists.

### The method, recorded because it is reusable

The chair's green-branch worry was a claim about **reliability**, and reliability is a claim about
repetition — so it was tested by repetition rather than by argument: a second `test:ratchet` at
this lane's own unchanged tree. That single cheap run refuted it. ⭐ The generalisable rule: when
an accusation against a change is "it TRIGGERS X", the discriminating experiment is not a narrowing
of X's neighbourhood but a re-draw at the accused tree — if the victim moves, the accused is not a
trigger, and no amount of narrowing around X would have shown that.

⛔ No cure attempted (§11). Frozen census untouched. Nothing banked. The `E1/E2` narrowing script
(`laneTET2E-narrow.sh`) was written but deliberately NEVER RUN: its premise is a clean base, and
the base-proof arm refuted that premise before it could be fired.

### §6n.1 · The chair's charter and the QUIET-TRACK condition (ruling received)

1. **ATTRIBUTION ACCEPTED — `distribution.test.js` is NOT this member's.** The chair's five legs:
   no importer; 32/32 isolated ×3 in both trees; byte-unchanged across 182 commits; PASSED in the
   pristine full run; and that pristine run minted its own disjoint strays. Classification:
   **VARYING-CAST SUITE CONTAMINATION** — pre-existing, load/schedule-sensitive, striking a
   rotating victim. This lane's three-run/three-disjoint-cast table is the finding, and is the
   founding evidence of a contamination hunt now chartered as its own lane.
2. **`lawBandTable` is NOT to be chased by this lane.** Recorded as hunt evidence (a NEW stray
   name of module-counting shape, consistent with worker-level module-state leakage whose victim
   depends on scheduling). This lane stays §11-bounded.
3. ⭐⭐ **THE TERMINAL GATE IS DRAWN ONLY ON A CHAIR-DECLARED QUIET TRACK.** The tension this lane
   raised — that the stop-criterion would otherwise be applied to a draw taken under ~10×
   oversubscription — was accepted rather than absorbed. TE-WF8 is stood down entirely until its
   slot and the hunt is confined to zero-compute analysis; the chair verifies **load < ~6 with
   nothing heavy running** and then issues the GO. ⛔ **The stop-criterion itself is UNCHANGED:**
   any non-census stray on that draw ⇒ STOP immediately, no third run, and the train holds.
   The chair's reasoning, recorded because it is the principle rather than the concession:
   *under quiet, a stray is signal; under 10× oversubscription it is a coin flip, and holding the
   train on a coin flip serves nobody.*
4. This lane does **not** fire `check:tail` until that GO arrives.

`npm run test:ratchet` **in the pristine base-proof tree at `5d18b4a0`**, which contains none of
this member's files — the same instrument that flagged the red, against a tree this member never
touched. If it reports the same non-census regression, the red is pre-existing and not this
member's. ⛔ This lane will not claim the gate green, and will not re-record or widen any census,
until that arm reports.

## §7 · Vocabulary sources, read at the cited text

`GENERATION-SPEC.md` §7.1.2, lines 5987–6002 — all three lists verbatim and in SPEC order:

- `MorphologyRole` **17**: MAIN_RANGE, CROSS_WING, REAR_RANGE, ANNEX, STAIR_TOWER, GALLERY,
  PASSAGE, LEAN_TO, CURTAIN_RUN, WALL_TOWER, GATEHOUSE, KEEP, BELFRY, SPIRE, COVERED_PASSAGE,
  LAND_CAP, LAND_KEEL
- `FunctionalVolume` **6**: OPEN_CLEAR, DOMESTIC_STACK, STORAGE_STACK, PARTIAL_LOFT,
  OCCUPIED_ATTIC, UNINHABITED_ATTIC
- `MassingUnknownReason` **4**: NOT_OBSERVED, OUTSIDE_COVERAGE, CONFLICTING_EVIDENCE, WITHHELD

The identity law, §10.5 line 8668 verbatim: *"`part.solid.partId === part.partId`"*.
The no-inference law, §7.1.2 tail: *"Every MassingKnowledge axis is total. UNKNOWN carries its own
reason/coverage/provenance and no value; it cannot trigger a function-, floor-, volume- or
origin-conditioned resolver."*

⚠ Recorded divergence from the SPEC's full shape, already ruled at compile (RAISED-5/RAISED-7 and
ratified at §348): the SPEC's `MassingKnowledge<T>` carries a REQUIRED `provenanceRef` and an
optional `coverageRef`; this member's knowledge axis carries neither, because no
`ProvenanceRef`/`EvidenceCoverageRef` substrate exists in this era — the same
"named ABSENT rather than faked" posture the landed `coordinateAbi.js` takes for its own null
refs. Named here so it is a recorded slice, not a silent omission.
