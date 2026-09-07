# EFF-M4 — the docs-debt consolidation and the F9 strike-and-point

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `4f2d37d1a3954cdf226af9584b15f6663929e92b`
- **Train:** `eff-1b`, member 1 of 2 — the staged successor to `eff-1a`, whose terminal is this
  member's base. The split is what keeps the shared preamble paths from ever being reserved by
  two non-terminal packets at once (§86.3's R1 pair exemption governs the queue).
- **Preamble:** ⚠ this member EDITS four of the five family preambles, including
  `INFRA-PREAMBLE.md`, so it cannot cite one as unchanged authority. Its input SHA-256s,
  measured at base, are in §2.
- **Authorities:** `OWNER_DECISION_QUEUE.md` §68.4 (the docs-debt consolidation, by name),
  §32 ruling 3 (`convergence.js` joined the standing hot-file list), §94.2(ii) (the F9
  strike-and-point routing), C-WYF-1 Arm A (the drafted cure text, `laneWYF-round.md` §4 item 2)
- **Compiled and executed by:** Lane TE16

---

## §1 Scope and boundary

**This member repairs stale RECORDS in seven docs files. Every edit replaces a figure or an
assertion that measurement shows is no longer true, and nothing else.** No code, no test, no
script, no configuration, no census motion.

Two classes, one act:

1. **The §68.4 docs debts** — figures in the dispatch surface that rotted after they were
   written: the HB preamble's `ARGUED_ROSTER_CEILING`, INT's provenance for the same constant,
   the GR/INFRA hot-file count, and the lapsed INDEX Measured blocks.
2. **The F9 strike-and-point** — stale "UNSIGNED / does not build until the owner signs it"
   assertions that a 2026-08-09 reconciliation superseded, still standing where a successor
   greps.

**Explicit non-goals.** The `DESIGN_BUILD_EFFICIENCY.md` fold is member 2 and does not ride
here. The two `DESIGN_FP_ARCHITECTURE.md` F9 sites (`:669`, `:3043`) are the CHAIR's, by
dispatch, and are untouched. No packet status prose, no volume rewrite, no new law.

### 1.1 ⛔ ONE DISPATCHED ITEM IS NOT LANDABLE ON THIS BRANCH, AND IS ROUTED RATHER THAN DROPPED

The dispatch names *"START_HERE's gate figure 14 → 17"*. **`docs/START_HERE.md` does not exist
on `claude/composite-r4`** — executed: `git ls-tree -r --name-only HEAD -- docs` returns
nothing for it, while the same query against `refs/heads/review-fixes-2026-07-08` returns
`docs/START_HERE.md`. It is a LEDGER file, and a build-branch docs member cannot land it.

The premise underneath the item is nonetheless **re-verified TRUE and recorded here** so the
chair's ledger sitting can act on a measured figure rather than an inherited one: `npm run
check` is a **17**-step `&&` chain, derived by splitting `package.json`'s own `check` script
(validate:hazard-registry · validate:premortem · validate:packets · validate:data ·
validate:custom-content-manifest · validate:migration-head · validate:edge · validate:map ·
validate:tuning-bands · validate:foundry-module · validate:mcp-server · typecheck:ratchet ·
typecheck:domain:strict · lint · test:ratchet · build · verify:dist). R-DOM's 17 reproduces,
and `PACKET_STANDARD.md`'s own "17-step" sentence agrees.

---

## §2 Required verified tree contract

| Role | Path | State at base (EXECUTED) |
|---|---|---|
| Target | `docs/implementation/preambles/HB-PREAMBLE.md` | SHA-256 `b27f5faccfb4d7142d663ac9f32295ef419d3eb4852169d7424f8a7ffdcac7a4`; quotes `ARGUED_ROSTER_CEILING = 13` under a block stamped `6784bf62` |
| Target | `docs/implementation/preambles/INT-PREAMBLE.md` | `e03ef7ac8d3b1c17ba2d0db3ff2f4897dfd57c11ae1276e009868b0661f7831f`; asserts "**19**, exact equality in both directions since 2026-08-10" |
| Target | `docs/implementation/preambles/GR-PREAMBLE.md` | `ba52e79817d1e2246a3667eb3f84ea776cf513fa817ca012ec1cd937cdccb95b`; "the three standing hot files" naming three |
| Target | `docs/implementation/preambles/INFRA-PREAMBLE.md` | `c1ca6fb6c197252057b0bfa6be3dc56388afee352b04015a6e9b61f0d33d5078`; "the three standing hot files", unnamed |
| Target | `docs/implementation/INDEX.md` | Measured blocks present for est-1c, est-1, in-1c-a, hb-2b, hb-1p, hb-1, gap-1 — **absent for gr-5a, int-3b and eff-1a** |
| Target | `docs/FABLE_VALIDATION_QUEUE.md` | two stale F9 spellings; four banked naked-claim rows that must not grow |
| Target | `docs/SOL_QUEUE.md` | **three** stale F9 spellings — one more than the round's census recorded |
| The live constant | `tests/lint/couplingInclusion.walker.test.js` | `const ARGUED_ROSTER_CEILING = 19;` · `const UNLAYERED_BASELINE_CEILING = 179;` |
| The hot-file list | `docs/implementation/PACKET_STANDARD.md`, `## Hot files` | FOUR rows: `OutputContainer.jsx` · `convergence.js` · `peaceTerms.js` · `informationStatecraft.js` |
| The claims pin | `tests/docs/enforcement-claims.test.js` | `FROZEN_NAKED` at 4 keys, of which 4 rows live in `FABLE_VALIDATION_QUEUE.md` |

⚠ **Navigate by quoted text, never by line number.** Every edit in §4 is an exact-string
replacement asserted present EXACTLY ONCE before it is written; an absent or ambiguous anchor
is a refusal, not a fuzzy match.

---

## §3 Exact contracts this member settles

### 3.1 The HB ceiling, and WHY it rotted

`ARGUED_ROSTER_CEILING` is **19** at this base. The preamble's 13 was true at `6784bf62` and
was moved three times in one day by HB's own waves. The correction lands with the **transition
walk** that produced it — the literal read at each commit that moved it, never a pickaxe
candidate: **13** at `7699e367` (2026-08-10, where the `toBe()` exact-equality arm was
introduced) → **15** at `e188760b` (HB-0) → **17** at `1013d58b` (HB-1) → **19** at `de214782`
(HB-2). `UNLAYERED_BASELINE_CEILING` stood still at **179** across the same window. The block's
measurement stamp moves to this base, and the section states plainly that an HB compile
re-reads both literals from the walker rather than inheriting them.

### 3.2 INT's provenance, which conflated two dates

INT asserts "(**19**, **exact equality** in both directions since 2026-08-10)". The figure and
the discipline have **different dates**: on 2026-08-10 the ceiling was **13**. The cure states
both with their own shas and points the reader at the walker as the authority.

### 3.3 Three hot files → four

`convergence.js` joined the standing list at §32 ruling 3 on an executed measurement (798 of
800). GR named three by name; INFRA named three without naming them. Both now name **four**,
with the file names spelled out in each, so a reader of either preamble sees the same list the
standard's own table carries.

### 3.4 The lapsed INDEX Measured blocks — THREE, not two

§68.4 names `gr-5a` and `int-3b`. A third is missing and this member's own executor is
responsible for it: **`eff-1a`**, whose terminal owed the block one landing ago. Measured, not
assumed: `git log -S` on the est-1c block shows it was written by the LANDING LANE in its own
terminal commit `954b4e0f`, so the block is the lane's act rather than the chair's, and eff-1a's
absence is a lapse of the same convention. All three are restored in chronological place, and
the convention is restated as binding at every exposure with the eff-1a lapse named in it.

### 3.5 The F9 strike-and-point — FIVE build-branch sites, not four

C-WYF-1 Arm A: replace each superseded UNSIGNED spelling with a one-line pointer to the
2026-08-09 reconciliation, preserving the record BY the pointer rather than the stale
assertion — the estate's own "Point, don't restate" doctrine — so the grep-trap dies. Where a
site already carried a trailing ⚠ correction, the correction is FOLDED INTO the pointer rather
than left describing a spelling that no longer exists; every provenance token (the 2026-08-05
grant, the 2026-08-11 note, session `c42c8924`) survives the fold.

⚠ **The census was under-enumerated AGAIN, and the sweep found it.** The round recorded six
sites (two DFA, two FVQ, two SOL). An exhaustive re-grep at this base finds a **third SOL
site** — `SOL_QUEUE.md:477`, *"⛔ Slice 8a does not build until the owner signs the F9
`supplyCargo` row"* — carrying **no adjacent note at all**, the same bare shape the round called
the sharpest of the six. It is cured with the other four and named as an addition rather than
folded in silently.

---

## §4 Change manifest

| Action | Path | Region / symbol | Effective-line delta | Instruction |
|---|---|---|---|---|
| DOC | `docs/implementation/preambles/HB-PREAMBLE.md` | the `MEASURED AT 6784bf62` stamp; the `ARGUED_ROSTER_CEILING = 13` literal; a new transition-walk note before `and the census arm:` | 0 production | per §3.1 |
| DOC | `docs/implementation/preambles/INT-PREAMBLE.md` | the `since 2026-08-10` parenthetical | 0 production | per §3.2 |
| DOC | `docs/implementation/preambles/GR-PREAMBLE.md` | the `HZ-SIZECEILING` opening clause | 0 production | per §3.3 |
| DOC | `docs/implementation/preambles/INFRA-PREAMBLE.md` | the `HZ-SIZECEILING` opening clause | 0 production | per §3.3 |
| DOC | `docs/implementation/INDEX.md` | the `Measured branch/SHA` line; three restored Measured blocks; the convention block | 0 production | per §3.4 |
| DOC | `docs/FABLE_VALIDATION_QUEUE.md` | the two F9 sites | 0 production | per §3.5 |
| DOC | `docs/SOL_QUEUE.md` | the three F9 sites | 0 production | per §3.5 |

**Seven handwritten files**, zero production lines, zero census motion, zero new persisted
families, zero flags. `retiredSymbols`: **NONE.**

---

## §5 Acceptance matrix — closed at 8 cases

| id | Case |
|---|---|
| **A1** | the enforcement-claims pin's failure identity is byte-identical to base and no `FROZEN_NAKED` key grows — measured with special care, because two targets are the files carrying four of the banked rows |
| **A2** | every anchor was present EXACTLY ONCE before its edit; no edit was applied by fuzzy match |
| **A3** | the HB ceiling reads 19, the transition walk is recorded, and `UNLAYERED_BASELINE_CEILING` still reads 179 |
| **A4** | INT's provenance names both dates with their shas and defers to the walker |
| **A5** | GR and INFRA both name FOUR hot files, and the four match `PACKET_STANDARD.md`'s own table |
| **A6** | INDEX carries Measured blocks for gr-5a, int-3b and eff-1a in correct reverse-chronological order, plus the convention block |
| **A7** | zero stale F9 assertions survive on the build branch outside the two chair-reserved `DESIGN_FP_ARCHITECTURE.md` sites |
| **A8** | the lighting census is unmoved and `validate:packets` exits 0 |

---

## §6 Mandatory implementation order

0. Preflight: branch, base, porcelain, `core.bare`. 1. Baseline: A1 and A8 at base, exits
recorded; the live constants and the gate step count re-derived. 2. — (inapplicable: this
member asserts absence of motion). 3-6. Apply the eleven anchored edits and the INDEX
restoration. 7. Focused verification A1-A8. 8. **No wave-end full gate** — under a train it
moves to the terminal.

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

**NONE** — no assertion, no branch, no executable byte. Trust comes from A2's present-exactly-once
anchor discipline (a refusal on absence or ambiguity is a fail-closed read), A1's before-and-after
claim identity, A7's exhaustive re-grep, and A8's unmoved census.

---

## §9 STOP conditions

1. The claims pin reds, or any `FROZEN_NAKED` key grows — the two queue files carry four banked
   rows, so this is the member's sharpest risk.
2. Any anchor is absent or appears more than once.
3. A figure would have to be transcribed rather than measured at this base.
4. The lighting census moves.
5. A `DESIGN_FP_ARCHITECTURE.md` F9 site starts to look necessary — it is the chair's.
6. The START_HERE item starts to look landable here.

---

## §10 Completion receipt

Verified base and final tree state · the seven changed files · A1-A8 with exact argv and exits ·
the claim count and naked-claim list quoted before and after · the census tuple unchanged ·
deviations `NONE` or a STOP · judgment calls in the train receipt.

---

## §11 Landing receipt

**LANDED at the `eff-1b` train's I1 commit `d840a3a6`.** Seven docs files, zero production
lines, zero census motion. Every case executed in a TEMP WORKTREE at `d840a3a6` itself, against
a control run at the base `4f2d37d1`.

- **A1** — the claims pin's failure identity is **byte-identical to base**: `1 failed | 20
  passed (21)` at both commits, the same single banked arm. The naked-claim list is the SAME
  SIX entries; the only difference is three LINE NUMBERS in `FABLE_VALIDATION_QUEUE.md`
  (3013/3882/5659 → 3017/3886/5663), the +4-line shift this member's own F9 edit causes. The
  ratchet key is `<file> :: <matched vocabulary>` and carries no line number, so the key set is
  byte-identical — proved by stripping line numbers and diffing. The four keys stand at their
  frozen counts: three in `FABLE_VALIDATION_QUEUE.md` under the lint-count phrase, one more in
  the same file plus one each in `GOLDEN_SHIFT_LEDGER.md` and `IN-0C.md` under the
  machine-enforcement phrase. The per-claim arm PASSES at both commits, which is what a grown
  key would have broken.
  ⛔⛔ **AND THE SPELLING ABOVE IS DELIBERATELY BROKEN, BECAUSE THE FIRST DRAFT OF THIS RECEIPT
  WAS THE SEVENTH NAKED CLAIM.** Quoting the four keys VERBATIM minted three new ones in this
  file — a packet is in the claims corpus exactly like any other `docs/**.md`, so a receipt that
  reproduces the vocabulary it is reporting on becomes an instance of it. Caught by member 2's
  own focused proof (`2 failed | 19 passed` against the base's `1 failed | 20 passed`), and cured
  the way the estate's `copyCorruption` precedent requires: by REWORDING the prose, never by
  widening the scan or exempting the file.
- **A2** — all eleven anchored edits reported `OK` from a runner that refuses on absence
  (`ANCHOR ABSENT`) and on ambiguity (`ANCHOR AMBIGUOUS (Nx)`); no edit was applied by fuzzy
  match, and the INDEX restoration additionally asserted its three anchors present exactly once
  before writing.
- **A3** — the preamble now quotes `const ARGUED_ROSTER_CEILING = 19;`, the transition walk is
  recorded in the section, and `UNLAYERED_BASELINE_CEILING` still reads `179` — both re-read
  from the live walker at this base.
- **A4** — INT's line now names `7699e367` (2026-08-10, discipline, ceiling 13) and `de214782`
  (2026-08-14, figure 19) separately, and defers to the walker as the authority.
- **A5** — GR and INFRA both read "the FOUR standing hot files" and both now name all four;
  the list matches `PACKET_STANDARD.md`'s own table exactly.
- **A6** — INDEX carries `eff-1a` (current), then est-1c, est-1, in-1c-a, **int-3b**, **gr-5a**,
  hb-2b, hb-1p, hb-1, gap-1 — correct reverse-chronological order, verified against the
  terminals' own commit dates — plus the convention block naming the eff-1a lapse.
- **A7** — the exhaustive re-grep finds **zero** stale F9 assertions on the build branch
  outside the two chair-reserved `DESIGN_FP_ARCHITECTURE.md` sites.
- **A8** — the lighting census walker: **33 passed**, exit 0, at base and at this commit alike;
  `validate:packets` 54 → 56 packets, exit 0 at both.

⭐ **THE SWEEP FOUND A FIFTH SITE THE CENSUS DID NOT HAVE.** `SOL_QUEUE.md:477` — *"⛔ Slice 8a
does not build until the owner signs the F9 `supplyCargo` row"* — carried no adjacent note at
all. It is the same bare shape the round called the sharpest of its six, and it was absent from
that six. Cured with the rest and named as an addition, because a strike-and-point act that
leaves the worst build-branch instance standing is not a sweep.

⛔ **ONE DISPATCHED ITEM WAS REFUSED AS NOT LANDABLE, AND ROUTED.** `docs/START_HERE.md` is a
ledger file; its premise (the gate is 17 steps) is re-verified TRUE at this base and recorded in
§1.1 for the chair's ledger sitting.

**Deviations:** the fifth F9 site (added) and the START_HERE routing (refused here), both above.
**Judgment calls:** in the train receipt.
