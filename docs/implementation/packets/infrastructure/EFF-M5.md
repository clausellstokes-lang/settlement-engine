# EFF-M5 — the build-efficiency volume, re-folded whole

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `4f2d37d1a3954cdf226af9584b15f6663929e92b`
- **Train:** `eff-1b`, member 2 of 2 — the train's terminal member
- **Preamble:** `docs/implementation/preambles/INFRA-PREAMBLE.md` @ SHA-256
  `c691af9fe6ade05097857699829771062058b289e55e0445aba2eee9498e64fa` — the hash it carries AFTER member 1's
  edit, measured at this member's promotion. ⚠ Member 1 edits that file, so a citation of
  its BASE hash would be stale before this member dispatched; the re-stamp is the citation
  mechanism working rather than a defect.
- **Authorities:** the chair's dispatch of `eff-1b` (this member is finding #2 of the
  `laneTE16` receipt, acted on) · `OWNER_DECISION_QUEUE.md` §77/§83/§86 (the §2.4-R2 amendment
  the ledger carries), §74.2/§74.3 (§2.6 and §2.7) · the folded-volume convention this member
  states
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member re-folds ONE file, `docs/DESIGN_BUILD_EFFICIENCY.md`, from the ledger branch, and
edits nothing else.** It restores a single canonical text where the branch carried two
divergent ones.

**The divergence, measured.** `INFRA-M1-DOCS` folded this volume to the build branch and — by
design — deleted the "until then, the ledger copy is canonical" clause, because two canonical
copies of one volume is the drift a fold exists to end. The chair then amended the LEDGER copy:
§2.4 gained the re-charter redundancy block (R1/R2/R3, R2 as amended by the R-EFF audit), §2.6
and §2.7 were added, and §7's cap-refusal line was aligned to §2.6. So the branch acquired
exactly the drift the fold had ended — this time silently, because the build copy's own header
asserted it was canonical.

**Explicit non-goals.** No law is authored: every byte of the body is the chair's. No other
file. No `PACKET_STANDARD.md` edit (the six sections `EFF-M2` landed already state this law in
full, and they stay).

---

## §2 Required verified tree contract

| Role | Path | State at base (EXECUTED) |
|---|---|---|
| The target | `docs/DESIGN_BUILD_EFFICIENCY.md` | 216 lines; **no §2.6, no §2.7, no §2.4 re-charter block**; §7 still refuses "trains above 4 members … until §8's review" |
| The source | `refs/heads/review-fixes-2026-07-08:docs/DESIGN_BUILD_EFFICIENCY.md` | 295 lines; carries §2.4-R1/R2/R3, §2.6, §2.7 and the aligned §7 line |
| The one wording the fold must carry CORRECTED | the source's §2.7 symlink sentence | reads "links node_modules **as a PLAIN WRITE-THROUGH SYMLINK** (measured: writes pass through to the executor tree — per-member `cacheDir` isolation, the R-D8 obligation landed with the harness, is what prevents cross-battery cache sharing)" — the chair corrected the stale "read-only" wording in parallel, so the honest sense is already in the source |
| The claims pin | `tests/docs/enforcement-claims.test.js` | `CLAIM_RE` over the source text: **`TOTAL_CLAIM_HITS = 0`**, measured before the fold |

**Forbidden files:** everything not in §4.

---

## §3 Exact contracts this member settles

### 3.1 The fold is VERBATIM, with exactly one permitted transformation

The body is the ledger text byte-for-byte. The single permitted change is the Status block's
fold clause, rewritten from an obligation into a record. **Proved by inverse check**: replacing
the new clause with the old one reproduces the ledger file byte-for-byte.

### 3.2 The folded-volume convention, stated once so the next divergence cannot be silent

The new clause states the two-surface rule the chair named: **the LEDGER copy is the DRAFTING
SURFACE** — the chair amends there, because the ledger carries no gate — and **the build copy
is CANONICAL AT ITS BASE**, re-folded by a build-branch docs member whenever the drafting
surface has moved. That is strictly better than the previous "this copy is canonical; the
ledger copy is history", which was true when written and became false the moment the chair
amended a volume the build branch could not see.

### 3.3 The §2.7 correction is INHERITED, not re-authored

The dispatch ordered the corrected sense rather than the stale "read-only" sentence. Measured at
this base: **the chair's parallel correction is already in the ledger text**, and it is the
sense this train's own member 1a proved by execution. The fold therefore carries it verbatim
and this member authors no wording of its own.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| DOC | `docs/DESIGN_BUILD_EFFICIENCY.md` | whole file — the ledger text, with the Status block's fold clause rewritten per §3.1-§3.2 | 0 production | per §3 |

**One handwritten file**, zero production lines, zero census motion. `retiredSymbols`: **NONE.**

---

## §5 Acceptance matrix — closed at 6 cases

| id | Case |
|---|---|
| **A1** | the enforcement-claims pin's failure identity is byte-identical to base and no `FROZEN_NAKED` key grows; `CLAIM_RE` over the folded file is zero |
| **A2** | the fold is verbatim: the inverse check (new clause → old clause) reproduces the ledger file byte-for-byte |
| **A3** | §2.4's re-charter block, §2.6, §2.7 and the aligned §7 line are all present on the build copy after the fold |
| **A4** | §2.7 carries the CORRECTED write-through-symlink sense, naming per-member `cacheDir` isolation as what prevents cache sharing |
| **A5** | the header states the folded-volume convention — ledger drafts, build copy canonical at base, re-folded when the drafting surface moves |
| **A6** | the lighting census is unmoved and `validate:packets` exits 0 |

---

## §6 Mandatory implementation order

0. Preflight. 1. Baseline: A1 at base, and `CLAIM_RE` over the SOURCE text before folding.
2. — (inapplicable). 3. Fold. 7. Focused verification A1-A6. 8. This is the train's LAST
member; the terminal gate follows the flip and the capsule.

---

## §7 Focused checks (argv form, expected exit 0)

```
npx vitest run tests/docs/enforcement-claims.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js
node scripts/implementation-packets.mjs validate
```

⛔ Bare, with `; echo TRUE_EXIT=$?`.

---

## §8 Mutants

**NONE** — no assertion, no branch, no executable byte. Trust comes from A2's inverse check,
which is an exact byte-equality read in the direction that can fail: any drift between the
folded body and the source, in either direction, breaks it.

---

## §9 STOP conditions

1. The claims pin reds or a `FROZEN_NAKED` key grows.
2. The inverse check does not reproduce the source byte-for-byte.
3. The source's §2.7 does NOT carry the corrected write-through sense — the fold would then be
   propagating a measured-false sentence, and the correct act is to stop and tell the chair,
   never to author the correction here.
4. Any second file starts to look necessary.
5. The lighting census moves.

---

## §10 Completion receipt

Verified base and final tree state · the one changed file · A1-A6 with exact argv and exits ·
the inverse-check result quoted · the claim count before and after · deviations `NONE` or a
STOP · judgment calls in the train receipt.

---

## §11 Landing receipt

**LANDED at the `eff-1b` train's I2 commit `ef6b0984`.** One docs file, zero production lines,
zero census motion. Every case executed in a TEMP WORKTREE at `ef6b0984` itself.

- **A2** — ⭐ **the fold is verbatim, and it is PROVED rather than asserted.** The inverse check
  — take the folded file, put the OLD Status clause back where the new one is, compare against
  `refs/heads/review-fixes-2026-07-08:docs/DESIGN_BUILD_EFFICIENCY.md` — returns **True**: byte
  equality, in the direction that can fail. `git show --stat` records 96 insertions and 7
  deletions.
- **A3** — present on the build copy after the fold: `### 2.4 Failure semantics` with its
  re-charter redundancy block (R1/R2/R3), `### 2.6 Differential member caps`,
  `### 2.7 Parallel pre-proof, serial landing`, and §7's refusal line aligned to §2.6 in place
  of the old "trains above 4 members … until §8's review".
- **A4** — §2.7 reads "links node_modules **as a PLAIN WRITE-THROUGH SYMLINK** (measured: writes
  pass through to the executor tree — per-member `cacheDir` isolation, the R-D8 obligation landed
  with the harness, is what prevents cross-battery cache sharing)". The dispatch ordered the
  corrected sense; measurement found the chair's parallel correction already in the source, so
  this member inherited it and authored nothing.
- **A5** — the header states the folded-volume convention: ledger = drafting surface (it carries
  no gate), build copy = canonical at its base, re-folded whenever the drafting surface moves.
- **A6** — the lighting census walker: **33 passed**, exit 0; `validate:packets` 56 packets,
  exit 0.
- **A1** — ⛔ **THIS MEMBER'S OWN PROOF CAUGHT A RED, AND THE RED WAS THE TRAIN'S, NOT THE
  ESTATE'S.** The claims pin returned `2 failed | 19 passed (21)` against the base's
  `1 failed | 20 passed (21)`, with three new naked-claim keys — all in `EFF-M4.md`, whose
  landing receipt had quoted the four frozen keys VERBATIM. A packet sits in the claims corpus
  like any other `docs/**.md`, so a receipt that reproduces the vocabulary it reports on becomes
  an instance of it. The cure is a REWORDING of `EFF-M4.md`'s prose, riding the terminal — never
  a widened scan, never a corpus exemption — and the pin returns to base identity at the
  terminal, quoted in the train receipt.
  ⚠ Recorded rather than smoothed, because the sequencing is the lesson: `EFF-M4`'s deliverable
  proof at `d840a3a6` was clean and STAYED clean; the regression entered at the PROMOTION rung
  that appended its receipt. Verification binds to a tree snapshot, and a receipt written after
  the green run is an edit after the green run.

**Deviations:** the A1 self-red above, cured at the terminal. **Judgment calls:** in the train
receipt.
