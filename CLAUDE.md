# Claude continuation note

> **THE OPERATING STANDARD (the owner, 2026-09-20: "the standard no matter which claude account i use"): read [`docs/OPERATING_STANDARD.md`](docs/OPERATING_STANDARD.md) FIRST** — seats, batching, the intake rule, measure-first, the report diet, what stays the owner's. It binds every session on every account and model. Then `docs/HANDOFF_CURRENT.md`.

This checkout is a live, heavily modified integration worktree. Before changing
code, read [`CONTRIBUTING.md`](CONTRIBUTING.md),
[`docs/implementation/INDEX.md`](docs/implementation/INDEX.md), and the one
implementation packet linked there. Only a packet marked **READY** may be
dispatched; design files, queues, old briefs, and progress notes are not coding
assignments.

Do not reset, clean, checkout, stash, stage, commit, or overwrite the worktree
without explicit authority. Unrelated changes belong to concurrent product
programs. Stay inside the packet's exact file manifest and scope budget; stop
on a mismatch instead of inventing behavior, chasing adjacent edge cases, or
repairing unrelated gate failures.

When changing generation-remediation ownership or persistence, also read
[`docs/GENERATION_REMEDIATION_HANDOFF.md`](docs/GENERATION_REMEDIATION_HANDOFF.md)
and [`docs/GENERATION_CONTRACTS.md`](docs/GENERATION_CONTRACTS.md). That lane's
handoff is not the global open-work queue.

Gate reading: never read a gate through a pipe — `npm run check | tail`
reports the PIPE's exit status, not the gate's, and has greenwashed red gates
twice. Use `npm run check:tail`, or `sh scripts/gate-tail.sh <command...>`
for any other gate command; both print the tail and exit with the gate's own
code.
