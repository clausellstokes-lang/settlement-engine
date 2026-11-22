# Repository agent instructions

This is a live integration worktree. Preserve every pre-existing or concurrent
change. Do not reset, clean, checkout, stash, stage, commit, or overwrite work
unless the current user request explicitly grants that authority.

Before changing code, read:

1. [`CONTRIBUTING.md`](CONTRIBUTING.md) for repository and gate law;
2. [`docs/implementation/INDEX.md`](docs/implementation/INDEX.md) for the
   current dispatch surface; and
3. the one packet linked by that index.

Only an implementation packet marked **READY** is a coding assignment. A
`DESIGN_*.md` file, queue row, old brief, progress note, or commit subject is
not permission to implement. If the index and packet disagree, use the less
permissive status and stop.

Follow the packet's exact file manifest, scope budget, acceptance denominator,
verification commands, and STOP rules. Do not solve adjacent edge cases,
repair unrelated gate failures, add unlisted files, invent missing behavior,
raise baselines, or regenerate goldens without explicit packet authority.

When touching generation-remediation ownership or persistence, also read
[`docs/GENERATION_REMEDIATION_HANDOFF.md`](docs/GENERATION_REMEDIATION_HANDOFF.md)
and [`docs/GENERATION_CONTRACTS.md`](docs/GENERATION_CONTRACTS.md).

Never read a gate through a shell pipe. Use `npm run check:tail`, or
`sh scripts/gate-tail.sh <command...>`. Run focused Vitest commands while holding
the atomic slot: `sh scripts/gate-mutex.sh --run -- npx vitest ...`.
