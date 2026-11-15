# CLOSE-MEASURE-1 — the whole check on the joined line, measured (2026-11-15)

> A measuring seat: nothing built, nothing re-taken, nothing committed under `src/`, `tests/`, `scripts/` or `supabase/`. Pushed part by part. **Part 1 (this push): the tip and the raw reds.** The classification, the rehearsal, the owner's list and `close.sh` follow in later parts.

## 1. The tip

`lane/join-2026-11-14` at **`d817736d8999114919e8af331f990f8dc16a4aff`** (JOIN-7 · 14, the tail-exports-journal merge), read 2026-11-15 02:07 UTC. Scratch worktree `/home/user/cmwt` (detached at the tip, its own `npm ci`). The line forks from master `db832c892` (PR #73). The test census `scripts/.test-ratchet-baseline.json` banks **zero** failures, so every failing test at this tip is a regression to the ratchet.

## 2. The whole check, step by step (run 1)

Each of `check`'s 17 steps run separately (`/home/user/cmout/steps.sh`), exit and wall time:

| step | exit | seconds |
|---|---|---|
| validate:hazard-registry … validate:mcp-server (11 steps) | 0 | ≤ 1 each |
| typecheck:ratchet | 0 | 37 |
| typecheck:domain:strict | 0 | 30 |
| lint | 0 | 140 |
| **test:ratchet** | **1** | **4682** (78 min) |
| build | (run 1 continues) | |
| verify:dist | (run 1 continues) | |

**test:ratchet:** 40,215 tests; **198 failed** in **124 files**; 69 skipped (ceiling 1); 9 suites failed with no measurable test, so the ratchet stops at its SCOPE SENTINEL before it prints a regression list. Every red file, with its first message: [`probes/CLOSE-MEASURE-1/r1-red-files.md`](probes/CLOSE-MEASURE-1/r1-red-files.md).

The 9 suites the sentinel names: `ledgerCitationIntegrity`, `provenanceMap` (the checkout lacked the local ref `refs/heads/review-fixes-2026-07-08`: env, created for the re-run); `newsHeadlineContract.walker`, `newsVoiceContract.walker` (8 skips each, no message); `writerReach.walker` (52 skips: a dark-register row is now LIT, bank the win); `crisisCast`, `crisisCastDefenceHome`, `crisisCastEdit`, `people/dualHatReaders` (collection: `Cannot read properties of undefined (reading 'face')`).

The shared `.git/config` (`core.bare=false`) and the local refs did not move during run 1: compared before and after the test step.
