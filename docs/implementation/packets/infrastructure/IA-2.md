# Implementation Acceleration / IA-2 — sealed dispatch and resumable proof

- **Status:** STALE
- **Stale (measured, 2026-08-10):** its own dispatcher refused — nine declared substrate
  files changed since the `f1895e60` base (the packet predates the sealed-sessions
  commit and tonight's INDEX/manifest churn). Coordinator revalidation required; fold
  the IA-3 docket at the same pass: the coupling walker joins layered-leaf packets'
  focused checks (sealed-loop blind spot, demonstrated live twice), and the seal learns
  expected-dirty raw-material preflights (the TC-3A waiver).
- **Verified base:** `claude/composite-r4` at `f1895e6004eb512a5c7b4c9b4caaf79604bccea6`
- **Owner authority:** 2026-08-09 request to build the bounded dispatch, seal,
  scope-guard, receipt, resume, and heartbeat follow-up
- **Commit authority:** edits only; owner separately authorizes any commit
- **Behavior posture:** implementation tooling only; no product, simulation,
  persistence, migration, tuning, golden, or release-denominator change

## 1. Outcome

Turn one READY packet into a closed, self-contained implementation session:

1. one deterministic dispatch payload carries the exact packet bytes plus the
   existing structured capsule;
2. one worktree-local seal admits the exact HEAD, target state, and existing
   foreign dirt without requiring a globally clean tree;
3. `check:packet` fails before expensive evidence when the session leaves its
   manifest and rechecks state around every child command; and
4. atomic receipts and heartbeats let another model resume an interrupted run
   only when the complete implementation state still matches.

This is the final dispatch-lifecycle layer. It is not a test optimizer, generic
workflow engine, repository indexer, or autonomous coding coordinator.

## 2. Hard scope budget

- one infrastructure behavior family: sealed packet-session lifecycle;
- exactly 12 handwritten paths including this packet and tests;
- at most 1,200 effective production/tooling line events;
- no dependency, product source, CI topology, test-ratchet, baseline, golden,
  build configuration, migration, automatic worktree creation/deletion, commit,
  merge, rollback, staging, or cleanup change;
- exactly eight acceptance cases below.

### Packet-opening bootstrap ruling

The IA-1 validator currently rejects a path reused from a LANDED packet, making
the first legitimate successor infrastructure packet impossible to validate.
The owner-authorized opening exception is limited to one paired repair in
`implementation-packets.mjs` and its existing test: LANDED/SUPERSEDED owners are
historical, while every collision among nonterminal packets remains an error.
No other implementation begins until the live IA-2 manifest validates.

## 3. Reserved foreign work

Do not edit, stage, restore, attribute, or include in IA-2 receipts as authored
work. Dispatch machinery must instead preserve their exact admitted state:

- `CLAUDE.md`
- `docs/DESIGN_AI_CHAT_SURFACE.md`
- `docs/DESIGN_FP_ARCHITECTURE.md`
- `docs/DESIGN_FP_ARCH_GR.md`
- `docs/DESIGN_FP_ARCH_IN.md`
- `docs/DESIGN_TOWN_CARTOGRAPHY.md`
- `docs/FABLE_VALIDATION_QUEUE.md`
- `docs/README.md`
- `docs/SOL_QUEUE.md`

## 4. Exact change manifest

| Action | Path | Maximum delta | Coding instruction |
|---|---|---:|---|
| MODIFY | `package.json` | +4 | Add strict dispatch/resume commands; keep existing gate names. |
| MODIFY | `scripts/implementation-packets.mjs` | +190 | Permit historical path reuse, embed exact packet bytes, and hash the deterministic capsule. |
| MODIFY | `scripts/implementation-gate.mjs` | +300 | Add async packet/resume execution with sealed scope checks, receipts, and heartbeats; keep planning pure. |
| CREATE | `scripts/implementation-session.mjs` | 650 | Own Git inspection, dispatch seals, state fingerprints, atomic receipt storage, locking, and resume projection. |
| MODIFY | `tests/scripts/implementationPackets.test.js` | +120 | Pin terminal overlap and exact packet-text capsule behavior. |
| MODIFY | `tests/scripts/implementationGate.test.js` | +180 | Pin async execution, result fidelity, fail-collect, and resume selection. |
| CREATE | `tests/scripts/implementationSession.test.js` | 500 | Exercise dispatch/scope/atomic-state/lock/heartbeat contracts in temporary repositories. |
| MODIFY | `docs/implementation/PACKET_MANIFEST.json` | +55 | Register IA-2 with the closed denominator and exact argv. |
| MODIFY | `docs/implementation/PACKET_STANDARD.md` | +35 | Make dispatch seals and resumable receipts packet law. |
| MODIFY | `docs/implementation/PACKET_TEMPLATE.md` | +25 | Replace manual model handoff with dispatch/check/resume commands. |
| MODIFY | `docs/implementation/INDEX.md` | +3 | Expose IA-2 at its verified base. |
| CREATE | `docs/implementation/packets/infrastructure/IA-2.md` | n/a | Record this contract, live handoff, and completion receipt. |

No other path is authorized. `scripts/ops/releaseEvidenceCore.mjs` is read-only
pattern evidence, not a target.

## 5. Exact contracts

### Historical ownership

- `LANDED` and `SUPERSEDED` packet manifests are immutable history and do not
  reserve their former paths forever.
- `READY`, `DRAFT`, `BLOCKED`, and `STALE` remain nonterminal. Any duplicate
  change path across two nonterminal packets fails validation.

### Self-contained capsule and dispatch

- The capsule contains the packet's exact UTF-8 Markdown text, byte length,
  SHA-256, verified branch, and a fixed notice that design files, queues,
  progress notes, commit subjects, and briefs cannot expand coding authority.
- Keep the existing structured hashes, symbol excerpts, manifest rows,
  acceptance cases, and argv checks. Add one digest over a canonical
  serialization of the complete digest-free capsule.
- `implementation:dispatch -- <ID>` is READY-only. It validates branch, proves
  `verifiedBase` is an ancestor of HEAD, and permits that descendant only when
  every pre-existing manifest target and required-symbol source is unchanged
  between the verified base and current HEAD. It then pins exact current HEAD.
- Every non-CREATE target must be Git-clean; every CREATE target must be absent.
  Dispatch performs no edit, stage, stash, commit, checkout, or cleanup.

### Worktree-local seal and scope

- Resolve storage from `git rev-parse --path-format=absolute --git-dir`; never
  assume `<root>/.git` is a directory in a linked worktree.
- Store private mode-0600 state below
  `$GIT_DIR/implementation-sessions/<ID>/`. No session file may enter Git status.
- The seal binds packet/capsule/manifest hashes, verified base, exact HEAD and
  branch, target action/existence/type/mode/content, complete index digest, and
  all initial Git-visible staged/unstaged/untracked foreign dirt. Ignored outputs
  remain outside this scope.
- Current dirty paths may equal only the sealed foreign paths plus the packet
  manifest. Sealed foreign rows must remain byte/index/status-identical. Any new
  foreign path, foreign mutation, HEAD/branch/authority drift, missing/corrupt
  seal, or seal digest mismatch is a hard STOP before a child runs.
- No filesystem tool can attribute two actors editing the same authorized path.
  One packet per isolated worktree plus the run lock is the bounded control; do
  not invent filesystem watchers or cryptographic authorship.

### Evidence, heartbeat, and resume

- Packet execution uses async non-shell child spawning so a live step can emit a
  compact heartbeat at a fixed interval. The declared argv and effective argv
  after Vitest locking are both recorded.
- Hold one atomic per-session run lock. A live owner excludes another runner; an
  explicit resume may reclaim only a definitely dead PID. Unreadable or uncertain
  ownership fails closed.
- Before and after every child, record exact HEAD/worktree fingerprint, scope
  verdict, packet diff statistics, monotonic elapsed time, exit code, signal, or
  spawn error. A child-reported zero is not banked if state moved during the step.
- Persist state with same-directory temporary file, mode `0600`, file fsync,
  atomic rename, and directory fsync. A partial/truncated/digest-mismatched state
  never reuses evidence; heartbeats never imply success.
- Validation failure blocks every later command. Ordinary evidence retains the
  IA-1 fail-collect behavior. Completed/failed/blocked/remaining are derived from
  ordered receipts, never trusted as independent assertions.
- `implementation:resume -- <ID>` always revalidates authority/scope. It reuses
  completed command evidence only when seal, plan, HEAD, and complete current
  state fingerprint match. A manifest edit between runs is permitted by scope
  but invalidates all banked evidence. The interrupted/current command and every
  unrun command remain pending.
- Forward SIGINT/SIGTERM once, durably mark interruption when possible, clear
  timers/handlers, and never convert an abandoned run into PASS.

## 6. Ordered implementation

1. Add IA-2 to packet/index/manifest and capture the expected historical-path
   validator failure.
2. Repair only terminal historical ownership and make validation green.
3. Extend deterministic capsules with exact packet bytes and digest evidence.
4. Implement Git/session/seal/scope primitives and their focused tests.
5. Convert only packet execution to async receipt-aware execution; leave quick
   and diagnostic semantics unchanged unless required by shared child spawning.
6. Add strict dispatch/resume CLIs and documentation.
7. Run the three-file focused denominator, syntax, ESLint, packet validation,
   and `git diff --check`.
8. Run `npm run check:tail`; report unrelated failures without repair.

IA-2 is the bootstrap for its own seal and is verified conventionally. It may
not claim a self-sealed pre-edit session retroactively.

## 7. Acceptance matrix — complete denominator

1. Canonical READY dispatch is deterministic and contains exact packet text,
   byte/hash evidence, capsule digest, verified branch, and the fixed authority notice.
2. Dispatch rejects non-READY status, wrong branch/non-ancestor or changed
   descendant substrate, dirty non-CREATE targets, existing CREATE targets, and
   malformed Git inspection before publishing a session.
3. A READY successor may reuse a LANDED/SUPERSEDED path, while any duplicate
   path among nonterminal packets still fails.
4. A seal records staged/unstaged/untracked foreign state outside the worktree
   and scope checking permits manifest edits but rejects HEAD, authority, new-path,
   or byte/index/status drift without mutating foreign work.
5. Atomic state updates preserve the last complete receipt on write failure and
   missing/truncated/digest-mismatched state reuses no evidence.
6. Every step records declared/effective argv, exact exit/signal/spawn result,
   elapsed time, pre/post fingerprints, and diff statistics; during-step motion
   invalidates the step and blocks later execution.
7. Exact-state resume reuses completed evidence, invalidates it after an allowed
   manifest edit, and accurately derives completed/failed/blocked/remaining.
8. Heartbeats advance only while RUNNING; live locks exclude a second runner,
   dead-owner recovery remains conservative, and interruption never mints PASS.

No additional edge case may be substituted into this denominator.

## 8. STOP conditions

Stop on any need for a dependency, CI/test-ratchet change, affected-test graph,
automatic worktree/commit/merge/cleanup, environment or child-output capture,
product file, baseline/golden change, filesystem watcher, distributed lock, or
more than the 12 manifest paths. Report unrelated gate failures only.

## 9. Verification commands

```sh
npm run validate:packets
node --check scripts/implementation-packets.mjs
node --check scripts/implementation-session.mjs
node --check scripts/implementation-gate.mjs
sh scripts/gate-mutex.sh --run -- npx vitest run tests/scripts/implementationPackets.test.js tests/scripts/implementationGate.test.js tests/scripts/implementationSession.test.js
npx eslint scripts/implementation-packets.mjs scripts/implementation-session.mjs scripts/implementation-gate.mjs tests/scripts/implementationPackets.test.js tests/scripts/implementationGate.test.js tests/scripts/implementationSession.test.js
git diff --check
npm run check:tail
```

The focused commands are development evidence. `npm run check` remains the
landing gate.

## 10. Completion receipt and live handoff

- **Final state:** IMPLEMENTATION COMPLETE — IA-2 is ready for owner review and
  commit; its bounded denominator is green. The packet remains READY until the
  owner separately authorizes landing.
- **Changed files/budget:** exact 12-path manifest only. Source/tooling deltas
  are packet `+187/-19`, gate `+300/-15`, session `647` lines, and package `+2`:
  1,170 conservative raw line events against 1,200. Focused-test deltas are
  packet `+106`, gate `+180`, and session `413` lines. Every per-file cap passes.
  The nine reserved foreign paths in section 3 remain untouched by IA-2.
- **Focused verification:** three-file Vitest is green at 3 files / 34 tests;
  all three scripts pass syntax and focused ESLint; `npm run validate:packets`
  reports 6 packets / 3 READY; `git diff --check` passes. Two independent final
  audits found no remaining acceptance-contract or budget defect.
- **Full gate:** `npm run check:tail` ran and exited 1 at the pre-existing,
  out-of-scope domain-strict check: `src/domain/worldPulse/worldState.js` has 2
  strict errors against baseline 1 (`+1`). Earlier validation and the 175/175
  full-typecheck ratchet passed; later lint/test/build/dist stages were not
  reached. The visible repo migration head 195 versus deployed 121 lag was
  reported as nonfatal.
- **Behavior/golden movement:** NONE — tooling and documentation only.
- **Deviations:** no implementation deviation. The repository gate remains red
  for the product-domain failure above; IA-2 neither touches that file nor
  widens its baseline.

If the current session ends, resume from this receipt and the live 12-path diff.
Do not add edge cases, test sharding, or automatic worktree management. Preserve
the nine foreign paths in section 3 exactly. Re-run validation only if the tree
moves; otherwise the next authorized action is owner review and commit.
