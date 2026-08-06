---
name: ""
metadata: 
  node_type: memory
  title: The session scratchpad is SHARED between concurrent lanes — name files per lane
  date: 2026-08-03
  severity: medium
  sibling: "minifold-tree-is-live, concurrent-lane-silent-edit-revert"
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T23:04:22.696Z
---

# The session scratchpad is shared between concurrent lanes

## What bit (2026-08-03, lane PS)

A probe script written to
`/private/tmp/claude-502/.../<session-uuid>/scratchpad/probe.mjs` was
**silently overwritten by a concurrent lane** between writing it and running it.
The run exited 0 and printed a different lane's output
(`self-entry=true: ownStrengthBand=...` from a WR-8 conquest probe) with none of
my own logging. Nothing errored; the file had simply become someone else's.

The scratchpad path contains a session UUID and *looks* private. When the
orchestrator fans out multiple lanes under one session, they share it.

## How to apply

- **Prefix every scratchpad filename with the lane id**: `lanePS-spine-probe.mjs`,
  `lanePS-spine-BACKUP.js`. Generic names (`probe.mjs`, `tmp.js`, `out.txt`) will
  collide.
- Treat a scratchpad file the same way as the working tree: **re-read before
  trusting it**, especially backups used to restore after a mutation test.
- A backup copy used for mutant revert is safety-critical. If it is clobbered by
  a twin, `cp backup src` restores the WRONG file. Verify with
  `cmp -s src backup && echo restored clean` after every restore.

## Same session, same day, the tree-side twin

`tests/lint/.domain-any-baseline.json` was edited by this lane, and a concurrent
lane rewrote the whole file wholesale minutes later — my row silently reverted
(11 instead of 9) and the file's `total` changed 2248 → 2226, proving a twin had
regenerated it. The edit had to be re-applied against the CURRENT file
immediately before committing.

**Rule: for shared baseline/manifest JSON, apply the edit as late as possible —
immediately before `git commit` — and re-verify the value is still yours in the
same command block.** See also `concurrent-lane-silent-edit-revert.md`.

## Bonus: never reformat a shared JSON on edit

Rewriting `scripts/mutation-coverage-manifest.json` with `json.dump(indent=2)`
produced a **3,633-line diff** on a 5-line change (the file is `indent=1`, and
`ensure_ascii` differs). Do a surgical text insertion against the file's own
formatting, then `json.load` it to prove it is still valid. Final diff: 5 lines.
