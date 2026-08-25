# THE FULL ARCHIVE — everything that was not already in git

**Written 2026-08-06 on the owner's instruction to pause all work until the
archive is complete, ahead of a possible weekly-usage exhaustion and a
transition to a different Claude account.**

## Why this exists

The program's knowledge lived in three places, and only one of them was
durable:

1. **The repository** — durable. Code, tests, design volumes, the ledger.
2. **The session scratchpad** (`/private/tmp/...`) — NOT durable. Destroyed by
   a reboot or a tmp sweep. It held three architected volumes and two
   verification instruments. Rescued into `docs/architected-volumes-pending-fold/`
   at commit `82f06898` and refreshed here.
3. **The memory estate** (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/`)
   — NOT durable across an account change, and outside the repo entirely. 384
   files, 2.7 MB of accumulated program knowledge: owner directives quoted
   verbatim, hazard classes that each cost a real incident to learn, judgment
   calls, and program state. **That is what this directory rescues.**

## Contents

| Directory | What it is | Count |
|---|---|---|
| `memory-estate/` | The complete memory estate, verbatim. `MEMORY.md` is its index — **start there**. Each file is one durable fact: an owner directive, a hazard class, a judgment call, or program state. | 384 files |
| `workflow-scripts/` | Every multi-agent workflow script this session dispatched. These are the reproducible dispatch record — each one shows exactly how a build cycle, architecture pass, or review round was staffed and briefed. **Suffixed `.js.txt` deliberately:** they use top-level `return`, which the workflow runtime accepts and eslint rejects as a parse error, so an archived copy ending in `.js` fails the pre-commit hook forever. Strip the `.txt` to re-run one. | 18 files |
| `ORPHANED-STASH-analytics-intelligence-layer.patch` | ⚠ A git stash found during this archive, sitting on the `analytics-intelligence-layer` branch and titled "generation-tuning fixes" — 26 files, +519/−254, touching the generators, the condition-promotion path, and the generator golden master. **It is not this session's work and its provenance is unknown.** A stash belongs to no branch and is the easiest git object to lose permanently, so it is exported here as a patch. THE STASH ITSELF WAS NOT DROPPED OR APPLIED — it is still `stash@{0}`. Someone should decide what it is. | 1 patch |
| `../architected-volumes-pending-fold/` | The three architected-but-unbuilt volumes plus two verification instruments and the diagnostic-soak design. See that directory's own README. | 7 files |

## How a successor should read this

- **Do not read all 384 memory files.** Read `memory-estate/MEMORY.md` — it is
  the index, organized by importance, and it points at what matters.
- **The repo is authoritative.** These memories are POINT-IN-TIME observations.
  Where a memory names a file, function, or flag, VERIFY IT STILL EXISTS
  before acting on it. Several memories record their own corrections for
  exactly this reason.
- **`docs/START_HERE.md` §3i is the bootstrap.** It is written for a successor
  with no memory estate at all, and it is sufficient on its own. This archive
  supplements it; it does not replace it.

## What is NOT in this archive, and cannot be

- **The conversation transcripts.** The reasoning behind each decision lives in
  session transcripts under `~/.claude/projects/`. The DECISIONS themselves are
  all recorded — in the ledger, in the memory estate, and in commit messages
  written to be read years later — but the deliberation is not.
- **Workflow journals.** Each dispatch's per-agent return values live beside
  the session. The scripts are archived; their outputs are not. Where a lane's
  finding mattered, it was banked into memory or the ledger at the time.

## State at archive time

- Ledger branch `review-fixes-2026-07-08`; build branch `claude/composite-r4`
  in `.claude/worktrees/minifold` at `cbd348a5` (SP-C landed), **tree CLEAN**.
- **NOTHING HAS BEEN PUSHED.** Every commit is local. This archive protects
  against session loss and account transition; it does NOT protect against
  loss of the machine. A backup push to origin is the owner's call and is the
  single highest-value remaining durability act.
- All build and review lanes were STOPPED at a clean boundary to take this
  archive. Nothing was interrupted mid-wave.
