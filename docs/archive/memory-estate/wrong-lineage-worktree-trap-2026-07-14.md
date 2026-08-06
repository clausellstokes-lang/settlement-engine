---
name: wrong-lineage-worktree-trap-2026-07-14
description: "A launched task can land on the wrong lineage/tree — verify worktree lineage + symbol existence BEFORE building. 9 recurrences by 2026-07-17. THE HARD-GATE RECIPE: an echoed branch check does NOT gate — compound commands run on past it; use [ \"$(git branch --show-current)\" = \"<expected>\" ] || exit 1 as the FIRST clause of every state-mutating compound command. Silent-no-op hazard: python s.replace() with an absent anchor writes cleanly and prints success — assert the anchor exists before writing."
metadata: 
  node_type: memory
  type: project
  originSessionId: bcbd5aa4-4b56-4db7-96b9-e26c2cf7e466
  modified: 2026-07-27T21:52:17.914Z
---

On 2026-07-14 a Lane-2 drain-path-parity brief (canon relationship ripple, [[spatial-engine-direction]]) was
launched in worktree `brave-babbage-67b994` on branch `claude/upbeat-babbage-bf1f98` @ d024286e — the
**master / PR-47 fix-remediation lineage**. But every symbol the brief depends on
(`canonRelationshipLinkage.js`, `recordCanonRelationshipRipple`, `canonRelationshipTargetFor`, test
`settlementSlice.canonRelationshipRipple.test.js`) lives ONLY on the **review-fixes-2026-07-08 lineage**,
and only as **uncommitted WIP** in the main worktree `/Users/cstokes/Desktop/settlement-engine` @ 659d0dbd
("Lane-2 (final wave) running" — a parallel session is actively building it).

The two lineages are badly divergent: merge-base acf59a00, then **299 commits on review-fixes not in
upbeat-babbage, 308 the other way**; even base `drainQueuedEvents.js` differs. This is a concrete instance
of the [[third-lineage-mystifying-ride]] master-vs-review-fixes collision.

**Why:** with parallel worktrees, the worktree launcher can put a task on a branch that lacks the code the
brief assumes. Building anyway means either forking foreign uncommitted WIP (violates
[[agent-stash-incident-2026-07-14]] / preserve-foreign-WIP) or writing untestable code against
non-existent imports.

**How to apply:** FIRST action for any Lane-2 / spatial / review-fixes-flavored brief — run
`git worktree list` and grep the referenced symbol across branches. If the current branch is upbeat-babbage /
master-remediation lineage and the symbols aren't there, STOP: the task belongs on a branch cut from
review-fixes-2026-07-08 AFTER the parallel session commits its Lane-2 WIP. Do not copy the foreign WIP over.

**Recurrence 2026-07-14 (dead-code follow-up):** the trap fired again — worktree `brave-babbage-67b994`,
this time branch `claude/stoic-haslett-1b5e68` @ d024286e (same master lineage). Brief assumed the
DEAD_CODE_DISPOSITION.md wave state (importers deleted), which exists only as unstaged WIP on
review-fixes-2026-07-08 in the main worktree. STOP-and-fork is NOT the only resolution: when the task is a
**targeted, low-collision op** (here: verify-zero-importers + `rm` two confirmed-dead files + one doc-line
ledger edit), the right move is to execute **directly against the main worktree via absolute paths**
(`git -C /Users/cstokes/Desktop/settlement-engine …`, plain `rm`, Edit on the absolute path). Guardrails
that made it safe: (a) `git status --short -- <exact paths>` first to confirm no foreign mid-edit on the
targets, (b) touch ONLY those paths, (c) never `git add`/`git rm`/stage — leave deletions unstaged
alongside the wave's own WIP, (d) re-check blast radius after (unstaged count moved exactly +1). Ruling
recorded in the repo (DEAD_CODE_DISPOSITION.md), so not duplicated here.

## RECURRENCE #2 (2026-07-14, same day): chip-spawned sessions hit the same trap
A spawn_task chip session (hover/mapChains investigation) provisioned worktree
`confident-leavitt-5b2441` on the master/PR-47 lineage (d024286e) even though the chip PROMPT
explicitly named "branch review-fixes-2026-07-08". Its commit (ccd0d670, docs-only) landed on the
wrong lineage — harmless this time, but the lesson hardens: **stating the branch in the brief does
NOT control worktree provisioning.** Any launched/chip session must run `git log --oneline -3` and
verify a KNOWN review-fixes commit hash (e.g. the current tip stated in the brief) before building;
symbol-existence checks alone are not enough for docs-only work. Sibling evidence the same day: the
persist-gap chip provisioned CORRECTLY (loving-kapitsa @ 1ccf84a9) — provisioning is nondeterministic,
so every brief needs the verify step, not just briefs following a failure.

## RECURRENCE #3 (2026-07-14): SAME worktree mis-provisioned twice; in-brief guard WORKS
The map-hover fix relaunch landed in the SAME worktree `confident-leavitt-5b2441` (new branch
`claude/jovial-nash-b5a39a`), STILL rooted at d024286e master/PR-47 lineage — 5a78af5a not in history.
This time the brief opened with an explicit lineage guard ("verify 5a78af5a in history, else STOP");
the session stopped before building. Two lessons: (a) the in-brief guard pattern (name the expected
tip HASH + verify + STOP) is the working countermeasure — keep it in every launched brief; (b) a
worktree that mis-provisioned once apparently re-provisions on the same wrong base for later chips —
treat `confident-leavitt-5b2441` (and any previously-wrong worktree) as presumed-wrong-lineage.

## RECURRENCE #4 (2026-07-14): E0 pacing-governor wave; provisioning-from-master is the DEFAULT, not a glitch
The E0 NARRATIVE TEMPO GOVERNOR brief launched in `brave-babbage-67b994` (the ORIGINAL incident's
worktree) on fresh branch `claude/zealous-driscoll-f74588` @ d024286e — master/PR-47 lineage again;
5a78af5a not an ancestor; docs/DESIGN_PACING_GOVERNOR.md (the wave's frozen design) absent at HEAD but
committed on 5a78af5a. In-brief guard caught it pre-build; session stopped and reported. New evidence:
at that moment 3 of 4 freshly provisioned `.claude/worktrees/*` sat at d024286e — the launcher branches
from the repo DEFAULT branch (master), never from the main tree's checked-out branch. So every
review-fixes-lineage brief WILL mis-provision until re-pointed. Known-safe remedy (zero unique commits
on the fresh branch, clean tree): `git checkout -B <branch> 5a78af5a` INSIDE the worktree — does not
touch the main tree's checkout — then re-run the guard and proceed.

## RECURRENCE #5 (2026-07-14): map-hover wiring commission; NEW worktree, same default-branch trap
The commissioned QuickInspector map-hover wiring brief ([[quickinspector-hover-never-wired]]) launched in
a FRESH worktree `hungry-driscoll-e12282` on branch `claude/hungry-driscoll-e12282` @ d024286e — master/
PR-47 lineage again; `git merge-base --is-ancestor 5a78af5a HEAD` returned NOT-ancestor. The in-brief
lineage guard caught it pre-build; session STOPPED and reported without building (matching the #3/#4
norm). Confirms the launcher branches from the repo default (master) even for brand-new worktrees, and
that the guard is the reliable countermeasure. Preconditions for the known-safe remedy all held here
(clean tree; d024286e shared by ~20 branches = zero unique commits on my branch; 5a78af5a = live
review-fixes tip), so `git checkout -B claude/hungry-driscoll-e12282 5a78af5a` was the recommended
recovery — surfaced to the owner for go-ahead per the brief's explicit "STOP and report; do not build."
Owner replied "use your best judgement"; session self-applied the remedy (branch re-pointed d024286e→
5a78af5a, guard re-run PASS, tree clean) and proceeded to build the wiring. Confirms the delegated-
authority path: when the guard fires, report + recommend the known-safe `checkout -B`, and self-recover
on owner go-ahead.

## RECURRENCE #6 (2026-07-14): master-merge-plan session; brief-authorized self-recovery works
Worktree `keen-hellman-30673c` (branch `claude/keen-hellman-30673c`) provisioned @ d024286e again for
the MASTER_MERGE_PLAN survey. The in-brief guard caught it pre-work. New wrinkle: the brief itself
pre-authorized the fix ("your working base must be review-fixes"), so the session self-recovered
immediately (`git reset --hard 5a78af5a` — equivalent to the checkout -B remedy; verified clean tree +
0 unique commits first) without an owner round-trip. Pattern for future briefs: state the expected base
hash AND pre-authorize the re-point, and the trap costs one command instead of a session.

## RECURRENCE #7 (2026-07-14): SM-2 Settlement Map viewer; SAME worktree re-provisions wrong (confirms #3)
The SETTLEMENT MAP wave SM-2 brief (docs/DESIGN_SETTLEMENT_MAP.md §4, builds on the landed SM-1 model
layer src/domain/townMap/) launched in worktree `hungry-driscoll-e12282` — the SAME worktree as #5 —
but on a NEW branch `claude/musing-jepsen-13a6ff` @ d024286e, master/PR-47 lineage AGAIN. Both the frozen
design doc AND src/domain/townMap/ are ABSENT at HEAD; both are committed on review-fixes-2026-07-08.
Confirms #3's rule hard: a once-wrong worktree re-provisions on the same wrong base for every later
branch — `hungry-driscoll-e12282` is now presumed-wrong-lineage for good. NEW nuance: the review-fixes
tip has DRIFTED forward 5a78af5a→**ac7ba4ba** ("owed-work ledger empty; expansion begins" — Track K
c6fba3a3 + drain-parity landed), so the known-safe remedy target is now ac7ba4ba, not the 5a78af5a used
in #4/#5/#6. This brief said "STOP and report" (NOT pre-authorized like #6), so: reported + recommended
`git checkout -B claude/musing-jepsen-13a6ff ac7ba4ba` (preconditions verified: clean tree, 0 unique
commits, no branch-name collision with the main tree's review-fixes checkout) and awaited owner go-ahead
rather than self-applying. ac7ba4ba carries townMap model + design doc as COMMITTED state, so SM-2 has no
dependency on any uncommitted main-tree WIP.

## RECURRENCE #3 (2026-07-14, late night): the Agent tool's isolation:'worktree' hits it too
The orchestrator's own worktree-isolated agent (W-COMPOSER-1) was provisioned on d024286e —
the master/PR-47 lineage — same as the chip sessions. CONFIRMED mechanism detail from the
agent's diagnosis: the two lineages fork at acf59a00 ("Phase 3 seal"); master carries ~308
commits review-fixes lacks, review-fixes ~373 master lacks; and `git checkout
review-fixes-2026-07-08` inside a provisioned worktree FAILS (branch already checked out in the
main tree). THE STANDARD REMEDIATION (proven this round): the agent runs
`git checkout -b <fresh-branch> <expected-tip-hash>` in place (fresh branch avoids the
collision), then verifies the authority docs + substrate symbols exist before building.
STANDING RULE: every worktree/chip brief carries (a) the expected tip hash, (b) the d024286e
STOP signal, (c) the checkout -b remediation pre-authorized with a named branch. The guard has
now converted three trap firings into zero contaminated commits.
**Recurrence #6 (2026-07-16, W-R2-DEPTH worktree)** — landed on d024286e master lineage again;
the brief's pre-authorized `git checkout -b <branch> <expected-hash>` + symbol check corrected it
immediately. The guard works; keep it in every brief.

**Recurrence (2026-07-17, gallery opt-in data-loss fix):** `brave-babbage-67b994` (the original
incident's worktree) provisioned branch `claude/priceless-meninsky-a58c07` @ d024286e master lineage
AGAIN, for a brief targeting the w7-prep→gallery-p2 lineage. Detected pre-build (master's saves.js
already had the fix — the bug only exists on the w7-prep lineage); self-recovered via the standard
`git checkout -b claude/fix-gallery-list-importable claude/w7-prep` (62bc04da). Note the w7-prep tip
is the current remedy target for engine-lineage briefs, and blob-hash comparison
(`git rev-parse <branch>:<file>`) is a cheap way to prove a fix applies identically across candidate
base branches.

**NEW VARIANT (2026-07-16, map-title-tranche agent): the ABSOLUTE-PATH READ trap.** With multiple
worktrees on different lineages, Read/grep against the MAIN-TREE absolute path
(`/Users/cstokes/Desktop/settlement-engine/src/...`) silently returns the MAIN TREE's lineage
(now the ledger-only review-fixes branch), not the worktree's. The agent nearly verified against
baseline-471 content while its worktree held 485. ALSO the manager's own shell cwd RESETS between
tool calls (hit twice 2026-07-16: a verify:dist ran in the main tree; a commit failed on a
worktree-only file) — always `cd <worktree> && git rev-parse HEAD` (or `git -C`) before trusting
file content or running git mutations. Note: review-fixes-2026-07-08 is now LEDGER-ONLY; code
truth lives on claude/w7-prep.

**Recurrence (2026-07-27, epistemic-prevention manager session): the SILENT-EXIT-1 signature.**
The cwd reset fired ~5× in one session, reproducibly RIGHT AFTER a background task completed
(and once mid-turn). New sharpened tells: (a) a compound whose FIRST clause is the bare branch
hard-gate `[ "$(git branch --show-current)" = "<expected>" ] || exit 1` fails as **exit 1 with
ZERO output** — that emptiness IS the trap's signature, not a tool malfunction; (b) a bare-path
`vitest run` / `sed` / `grep` silently runs against the LEDGER tree's stale lineage and can
return a plausible-but-wrong green (a 5-test pass where the real file has 6 — nearly ratified a
fixture decision from stale src). Cure unchanged but now absolute: `cd <worktree> && guard &&
…` as ONE compound, EVERY time, including background-task command strings; never trust a green
that arrived without the cd.
