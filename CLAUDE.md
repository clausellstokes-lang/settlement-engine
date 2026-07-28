# Claude continuation note

This checkout is a live, heavily modified integration worktree. Before changing
anything, read [`docs/GENERATION_REMEDIATION_HANDOFF.md`](docs/GENERATION_REMEDIATION_HANDOFF.md)
and [`docs/GENERATION_CONTRACTS.md`](docs/GENERATION_CONTRACTS.md).

Do not reset, clean, checkout, stash, or overwrite the worktree. Unrelated
changes belong to concurrent product programs. Continue the generation
remediation from the recorded validation checkpoint, preserve deterministic
behavior unless an intentional golden shift is documented, and keep all new
code legible to both human and AI maintainers.

Gate reading: never read a gate through a pipe — `npm run check | tail`
reports the PIPE's exit status, not the gate's, and has greenwashed red gates
twice. Use `npm run check:tail`, or `sh scripts/gate-tail.sh <command...>`
for any other gate command; both print the tail and exit with the gate's own
code.

