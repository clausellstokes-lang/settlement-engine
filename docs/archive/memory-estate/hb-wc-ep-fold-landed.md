---
name: ""
metadata: 
  node_type: memory
  title: HB + WC + EP INTEGRATION FOLD LANDED — 33 waves unblocked
  date: 2026-08-07
  tags: 
    - fold
    - build-era
    - hazard
    - counts
    - seams
    - prefix
  status: landed
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-10T18:11:39.201Z
---

# The HB + WC + EP fold landed — and the count-mutant law it produced

**Four commits on `claude/composite-r4` from `eca65c8a`:** `dd0cc340` (volumes +
every parent site + cross-volume reconciliation) → `6ee83e3e` (prefix admission) →
`5a44b5db` (queue rows + ledger row) → `bdb647f8` (the sweep). Discharge recorded by
hand on the ledger branch at `3a396337` (`docs/START_HERE.md`).

## The measured state, post-fold

`docs/DESIGN_FP_ARCHITECTURE.md` is **THIRTEEN programs · 63 flags · 108 waves · 112
logical seams over 50 PHYSICAL §9 rows.** Pre-fold was 52/75/66 over 47, EXECUTED
against the committed blob before any row was placed — EP's VERIFY-AT-FOLD banner
came due and its STOP did not fire. Incoming: HB 10 waves/4 flags/13 seams · WC
17/6/23 · EP 6/1/10. **Flag rows: HB 53-56, WC 57-62, EP 63. Seam ranges: HB 67-79,
WC 80-102, EP 103-112.** EP composes LAST in every table (binding condition C3).

## ⚠⚠ THE COUNT-MUTANT VACUITY LAW — the sharpest thing this fold found

`DESIGN_FP_ARCH_WY.md` §4 closes the encounter-pairs table at FIFTEEN and WY-6's
reddenability proof is a **SIXTEENTH-ARM PLANT**. WC claims E16 and E17. **A count
mutant tests a LITERAL, and a literal designed to grow cannot be tested that way
twice** — the mutant does not red, it goes VACUOUS. Cure: DERIVE the count (table
length pinned equal to the source-scanned resolver set, both directions) and make
the reddenability proof an **UNTABLED-RESOLVER PLANT**, which is growth-proof.
⚠ And the CR-ES-6 admit-at-the-fold shape does NOT transfer when the claiming wave
lands AFTER the walker: a resolver-less row reds the walker's own
`a table row without a resolver reds` arm. Rows land WITH their resolvers.

## How to apply

- **Volumes move UNCHANGED in substance.** Only header provenance, the promotion
  note and the self-reference transform. What renumbers is the PARENT's global
  sequence. WC additionally took its `WC_SEAM_TABLE.md` §8 spliced in, at that
  document's own instruction, because the parent's §9 pointer must resolve.
- **`seams()` is the estate's fold ruler:** `HABIT_countsweep.py:327`,
  `table_by_header(text, ["#","Neighbour","The contract","The tripwire"])`. ⛔ The
  header spelling **`Neighbour`** is LOAD-BEARING — `Neighbor` returns `LookupError`
  and the count reads as ABSENT rather than zero. HB/EP/WC spell it British; ES/WY
  spell it American, so their counts are NOT re-derivable with this parser.
- **`HB` is the TWELFTH chartered coupling prefix** (HB Q4). **EP and WC DECLINED,
  reasoned:** EP explicitly (§5 item 7 — an epoch is SUBSTRATE and its files sit
  outside `couplingInclusion`'s scope), WC because it mints zero `CPL-` ids. Both
  abstentions are recorded in the enforcer's docstring so neither reads as a missed
  edit. **FOUR edit sites in `tests/domain/couplingRegistry.test.js`** move together
  — proved by two executed mutants, each 1 failed | 11 passed.
- **The fold is FOUR commits, not three.** The sweep is procedure, not a mistake you
  will avoid. This one cured: §9 seam row 7 omitting WC-5; `DESIGN_FP_ARCH_CW.md`
  SC-7 still saying nine-prefix (an inherited miss the 2026-08-05 fold left); the
  war volume not knowing WC existed (zero occurrences, against six contracted
  surfaces); and **"the frozen 812-line settlementStrategy surface" — 812 is
  EFFECTIVE, the file is 1,360 RAW, and the two are not comparable.**

## ⛔ Still owed / still gated

- ✅ **The snapshots ARE deleted — DONE @ `cd6bccc6` (2026-08-07, ledger branch**
  review-fixes-2026-07-08, "The three folded snapshots leave the ledger, and the cp
  lines that would have resurrected them"). This bullet previously read "**The
  snapshots are NOT deleted**" and was still saying so on 2026-08-10, three days
  after the work landed — corrected then. All THREE parts shipped in that ONE commit
  (`git show --stat cd6bccc6`): `git rm` of `EPOCH_living-futures_round7-snapshot.md`
  (−4,005) · `HABIT_conditioning_round4-snapshot.md` (−4,426) ·
  `WC_war-circulation_in-progress-snapshot.md` (−6,492); `scripts/refresh-archive.sh`
  (±53); `docs/architected-volumes-pending-fold/README.md` (±69). Verified at ledger
  HEAD: `git ls-tree -r --name-only review-fixes-2026-07-08 -- docs/architected-volumes-pending-fold/`
  lists NO `*-snapshot.md`. ⚠⚠ **Part 2 is the one that mattered and it was PROVEN,
  not assumed** — the `cp` lines are unconditional on the source existing and the
  script's step 6 `git add`s the whole directory, so a `git rm` ALONE is reverted by
  the next `refresh-archive.sh` run. Never delete an archived artefact without
  deleting the line that recopies it. ⚠ `HABIT_countsweep.py` and
  `HABIT_VERIFY_oddsratio.py` are INSTRUMENTS, not snapshots — they correctly SURVIVE
  at ledger HEAD; deleting the countsweep takes the ruler away.
- **Owner-gated, none of which blocked the fold:** CR-WC-9 (WC's persisted field
  batch, blocks WC-6 onward) · WY F9 `supplyCargo` UNSIGNED (WC-10 HARD-GATES on it)
  · EP's four §7a parked rows · HB Q1's two persisted fields.
- **LANDING IS NOT SEALING.** EP = DRAFT AT ROUND SEVEN; HB round four has NO
  RECORDED CLOSE; WC = ARCHITECTED, NOT STARTED. Each says so in its own header.
- **J-FP-13 (vetoable):** WC's PHASE 4 TAIL position is the ONE derived placement —
  WC is the only amendment volume with no queue-insertion clause.
