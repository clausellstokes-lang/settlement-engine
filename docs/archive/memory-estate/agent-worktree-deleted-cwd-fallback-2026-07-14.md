---
name: agent-worktree-deleted-cwd-fallback-2026-07-14
description: "An agent's provisioned worktree can be deleted BETWEEN TURNS, silently re-pointing its cwd at the MAIN tree — every subsequent bash command (including git mutations) hits the main tree unless explicitly cd-prefixed. Re-verify `git branch --show-current` before ANY git mutation after a pause."
metadata: 
  node_type: memory
  originDate: 2026-07-14
  type: project
  originSessionId: 049d4c82-58c0-4be1-956a-d47c628ee704
---

On 2026-07-14, during W-COMPOSER-1 (the composer-foundation implementer), the agent's provisioned
worktree (`.claude/worktrees/agent-a8457bc0307464a40`) was **deleted by the harness between turns**
(after a coordinator message + date rollover). The session's cwd then **fell back to the MAIN tree**
(`/Users/cstokes/Desktop/settlement-engine`) without any error. The very next git command —
`git checkout -b claude/w-composer-1 fde17424`, issued believing it ran in the worktree — **switched
the MAIN tree off `review-fixes-2026-07-08`**. Caught one command later (a Read error revealed the
cwd), recovered by `git checkout review-fixes-2026-07-08` (pointer-only, same commit, untracked WIP
verified intact) and re-provisioning a fresh worktree via `git worktree add`.

Two compounding facts: (1) "Agent threads always have their cwd reset between bash calls" — the reset
target is the SESSION cwd, which silently changes when the launch directory vanishes; (2) EnterWorktree
refuses both `path` and `name` from a subagent with a cwd override, so a deleted-worktree agent cannot
re-pin itself — it must fall back to explicit `cd <worktree> && …` prefixes on EVERY bash command plus
absolute paths for all file tools.

**Why:** the main tree is shared with parallel sessions and the owner; a stray branch switch or build
there is exactly the class of cross-session contamination the isolated-worktree policy exists to prevent.
The failure is silent — no error fires when the cwd falls back.

**How to apply:** in any worktree-briefed agent, after EVERY pause/notification boundary (coordinator
message, background-task completion, date rollover), re-run `git branch --show-current` (or `pwd`) and
compare against the expected worktree branch BEFORE the next state-mutating command. If the worktree
vanished: do NOT retry EnterWorktree; recreate via `git worktree add <path> <branch>` and prefix every
subsequent bash command with `cd <worktree-path> && `. Recovery from an accidental main-tree branch
switch at the same commit is a plain `git checkout <original-branch>` (verify untracked files after).
