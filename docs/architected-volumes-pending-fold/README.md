# Architected volumes awaiting their integration fold

**Why this directory exists (read this first).** These volumes were architected
in the 2026-08-05/06 sessions and lived ONLY in the session scratchpad under
`/private/tmp/`. That directory is session-scoped and is destroyed by a reboot
or a tmp sweep. Roughly 1 MB of architecture — three programs, **33 build
waves** — had no copy in git. This directory is the durability copy, landed on
the LEDGER branch (`review-fixes-2026-07-08`) because it is the branch a
successor bootstraps from and because `claude/composite-r4`'s tree was held by a
concurrent build lane at the time.

**⚠ EVERY COUNT BELOW WAS RE-DERIVED FROM THE VOLUMES THEMSELVES ON
2026-08-06** and each is stated WITH THE ADDRESS THAT DECLARES IT, so a reader
can re-derive it in one step instead of trusting this file. That discipline is
not decoration: **the first version of this README was stale on two of its three
wave counts within two days of being written** — it claimed EP had 16 waves
(the volume declares 6) and WC "~12 waves est." (the volume declares 17), and
its aggregate "~38 build waves" was internally consistent with its own two wrong
figures, which is exactly why nobody caught it. Its closing paragraph warned
against precisely this hazard while committing it. **If you change a count here,
change it by re-reading the volume, and move the address with it.**

**These are SNAPSHOTS, not the canonical home.** Each volume's canonical home is
`docs/DESIGN_FP_ARCH_<PREFIX>.md` on `claude/composite-r4`, landed at an
integration fold. Do NOT simply copy these files across — read THE FOLD RECIPE
below first.

## Contents

| File | Program | Waves / flags, and where the volume declares them | State |
|---|---|---|---|
| `EPOCH_living-futures_SEALED.md` | EP — advance-epoch / living futures | **6 waves** (EP-0..EP-5), declared at `## §4 THE WAVES` and restated in §5 as "EP adds **six waves**". **1 flag** `advanceEpochEnabled` (§2); 4 of 6 waves carry it. | ⚠ **THE FILENAME AND THE CONTENT DISAGREE.** The filename says SEALED; the volume's own line 3 says `## DRAFT for the validation chair, 2026-08-05.` There is NO §9 and no attestation block — it runs §0–§8. It carries six revision rounds and thirteen refuted premises. Treat it as a DRAFT that survived six rounds, not as sealed. Open: 5 chair questions (Q5 partly superseded), 4 owner-gated parked rows (count pinned at four by chair ruling P4), 2 chair-owed dispositions, 1 recorded deferral. ⚠ Its §5 already carries an executed banner: the VERIFY-AT-FOLD re-derivation **HAS COME DUE**. |
| `HABIT_conditioning_round4-snapshot.md` | HB — habit conditioning | **10 waves** (HB-0..HB-9) and **4 flags** in one strict ladder (`habitConditioningEnabled` HB-2 · `believedDoctrineEnabled` HB-6 · `habitAnticipationEnabled` HB-7 · `doctrineTapEnabled` HB-8); 4 of 10 waves land a flag. Both figures are SELF-ASSERTED by the executed census in `## §9`. | **ARCHITECTED THROUGH ROUND 4, WITH NO RECORDED CLOSE.** Round 4 is the volume's SIXTH pass, not its fourth — its own chronology was corrected to COMPILE → AMENDMENT → POLISH → ATTESTATION → ROUND THREE → round four. §9 is machine output, not prose: `countsweep.py`, **exit code 0, 52 quantities swept, 0 FAIL / 52 PASS**, 131 prose homes diffed, 42 signature phrases scanned, zero diffs. ⚠ But NO seal or attestation verdict closes the round — the file ends on a lesson paragraph. Do NOT upgrade it to "sealed"; that distinction is load-bearing. Open: 5 chair questions and a **43-row deferral book**; Q1 is the blocker (two owner-gated persisted fields, plus a third ruled deferred-and-visible). |
| `HABIT_countsweep.py` | HB instrument | — | The COUNT LEDGER (J-HB-27): derives every counted quantity from the volume's own tables and diffs each against its declared prose homes. Round 4 adds the STRUCK-PREMISE SCAN family (J-HB-28). Re-run at EVERY revision; re-paste its census into §9. ⚠ Round 4 found a defect in this instrument itself — `coverage()` indexed `c[3]` on a three-cell row and died of an `IndexError` BEFORE the malformed-row scan ever ran. Cured, but treat the instrument as fallible and read its exit code. |
| `HABIT_VERIFY_oddsratio.py` | HB instrument | — | The preserved sweep proving the ODDS-RATIO LAW (pairwise odds ratios are bounded under renormalization; the per-probability claim is FALSE and was deleted, not narrowed). |
| `WC_war-circulation_in-progress-snapshot.md` | WC — war circulation, the (a)–(p) directive | **17 waves** (WC-0..WC-16) in four arcs, declared "Seventeen waves, four arcs, honoring K6's CORE/EPIC split". **6 flags**, all virtual (`warCirculationEnabled` root conjunct + `contributionLedgerEnabled` · `compositeArmiesEnabled` · `freeCompaniesEnabled` · `moverAbsorptionEnabled` · `veteranCohortsEnabled`); five flag-landing commits must serialize under CQ5. Budget: 26 leaves, ~5,290 effective lines, ~5,090 of it genuinely new code. | ⚠ **THE FILENAME SAYS "in-progress" AND IT IS NO LONGER TRUE.** The lane finished after this file was named: the volume's own PROGRESS blockquote reads **"ARCHITECTED, NOT STARTED. No wave has landed."**, it carries three amendment rounds (round 3 closing with ZERO parked findings), and it terminates `END OF VOLUME.` ⛔ **BUT IT IS UNRULED:** 22 chair questions CR-WC-1..CR-WC-22 await rulings, six of them directive-vs-law collisions parked rather than resolved (CR-WC-2/3/4/5/21/22). **CR-WC-21 blocks WC-15 outright** — §6 records "BOTH POSITIONS, NEITHER TAKEN" and "the wave does not land". Only WC-0 is buildable without a ruling. |
| `DIAGNOSTIC_SOAK_DESIGN.md` | The diagnostic-soak harness | — | Design for the composition soak scheduled at build-complete-dark per `START_HERE.md` §3h. ⛔ FINDINGS ONLY — it may never sign, apply, or adjust a band. |
| `THE_FULL_ONTOLOGY.md` | The ontology | — | Present in this directory but absent from the original index. Not folded; not part of the 33-wave figure. |

**Aggregate, measured 2026-08-06: 33 waves and 11 flags across the three
programs.** None has folded; `git log --all -- docs/DESIGN_FP_ARCH_{EP,HB,WC}.md`
is EMPTY, so no canonical home exists for any of them yet.

## THE FOLD RECIPE — corrected against the worked precedent

The ES + WY fold of 2026-08-05 is the precedent, and reading it corrected two
things this README previously told you wrong.

**⚠ IT WAS FOUR COMMITS, NOT THREE — and the fourth exists because the
three-commit version LEAKED.** `d789f9f5` (fold 1/3, 8 files) · `51283abe`
(fold 2/3, the prefix admission, 1 file) · `7794cb4a` (fold 3/3, queue rows +
ledger row + executed census, 2 files) · **`edea9b1f` (the sweep, 5 files, 25
minutes later)** — which cured four one-line misses and one hand-keyed line
range that had rotted by +17 during the fold itself. Budget the sweep as part
of the procedure, not as a mistake you will avoid.

**⚠ "FOLDING RENUMBERS SECTIONS" WAS FALSE AND IS DELETED.** The precedent
states the opposite: the promotion carries the volume in "unchanged in
substance: header provenance, the §7 ruling record's promotion note, and the
self-reference are the ONLY transformations — no wave spec, no section number,
no ruling text, and no seam row moved." Waves keep their prefixed ids because
"renumbering would rot every live cross-reference to a numbered wave." What DOES
renumber is the PARENT volume's global sequence (its flag numbers and seam-row
numbers), never the incoming volume's own sections. The fold is also NOT purely
additive to the parent: fold 1 was **+517 / −44** on `DESIGN_FP_ARCHITECTURE.md`.

**The concrete obligations**, from the precedent's own §5b queue-insertion list
(ten numbered target sites) — every one of these is real work:

1. The parent's §3 flag rows, §4 canonical-model entry, §5 wave blocks, §9 seam
   rows and §11 pointer.
2. **The parent's header counts, which are spelled at MULTIPLE sites** (header +
   §2b digest + closing summary + §9 prose). The precedent moved "eight programs
   → ten", "43 flags → 52", "60 waves → 75", "45 seams → 66", and declared the
   negative control in the commit body: the stale spellings must all be at zero.
3. A `SOL_QUEUE.md` row. ⚠ Integers are NEVER renumbered — folds add LETTERED
   sub-rows (the precedent added `18b` and `21b`), and every row repeats the
   anti-drift clause naming FP §5 as the ordering authority.
4. **The prefix admission — FOUR edit sites in ONE file**,
   `tests/domain/couplingRegistry.test.js`. It pins the closed set TWICE and
   both move together: the `CHARTERED_VOLUME_PREFIXES` const that the id-shape
   regex is BUILT FROM, and the literal `toEqual([...])` list. Editing only the
   const leaves the `toEqual` red; editing only the `toEqual` leaves the regex
   rejecting the new ids. Two further legibility sites — the enclosing test's
   count-bearing title and the CLOSED-alternation comment — are repaired in the
   same commit so the file never carries a count it has outgrown. The set is
   currently eleven: `['WR','TR','GR','WF','POP','IN','INT','SP','CW','ES','WY']`.
5. Cross-volume reconciliation. ⚠ This is where the precedent LEAKED. A
   contradiction found in a third volume became a REPORTED ERRATUM with the
   struck text preserved verbatim; a law amended landed in BOTH homes (doc and
   the `src/` header comment) in one commit.
6. The `FABLE_VALIDATION_QUEUE.md` ledger row (+263/−1 in the precedent, the
   heaviest non-volume edit). ⚠ Its discipline: append at the LIVE tail,
   **re-derived immediately before applying** — the precedent's old anchor was
   still UNIQUE and had stopped being the TAIL, and uniqueness is not position.
   The `−1` was a supersession note appended to the prior row; the historical
   row stands unedited. Rows are never rewritten.
7. **Record the fold's own discharge by hand.** The precedent's queue item #34
   appears NOWHERE in the fold commits — it lives as prose in `START_HERE.md`
   and its discharge was recorded out-of-band. A future fold must do the same
   deliberately or the discharge is simply lost.
8. **DELETE the snapshot from this directory — an obligation the precedent
   never had to discharge.** The ES/WY drafts never existed in git, so there was
   nothing to delete. These three DO exist here, on a different branch, so the
   deletion is a second commit on a second branch with NO precedent to copy.

## The owner directives these volumes serve

Each volume is the architecture of an owner directive recorded verbatim in the
memory estate (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/`):
`advance-epoch-living-futures-directive.md`,
`habit-conditioning-directive.md`, and
`war-auxiliary-contribution-directive.md` (331 lines, sections (a)–(p) plus
chair refinements K1–K8 and numbered refinements R1–R9).
**If the memory estate is unavailable to you** — a different Claude account, a
different machine — the owner's intent is quoted verbatim inside each volume's
own opening section. The volumes are self-contained by construction, for exactly
this reason.

⚠ **WC AND THE "WAR AUXILIARY-CONTRIBUTION DIRECTIVE" ARE THE SAME PROGRAM.**
This has confused at least one session, because the memory index carried two
entries describing it in OPPOSITE states — one calling it attested and
architected whole, one calling it NOT YET ARCHITECTED. The second is REFUTED:
the WC volume names the directive by filename, line count and section span in
its own opening, and quotes its spine word-identical modulo declared ASCII
typography normalization. If you meet a claim that this directive is
unarchitected, it is stale — check the volume, not the claim.

## Standing obligation

Refresh these snapshots whenever their source volumes change, and DELETE a file
here once its program has folded into `docs/DESIGN_FP_ARCH_*.md` on
`claude/composite-r4` — a stale snapshot beside a landed volume is the
derive-don't-restate hazard this program has been bitten by repeatedly, and
which this very file demonstrated within two days of being written.
