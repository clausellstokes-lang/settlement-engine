#!/bin/sh
# R5C2's heavy-run wrapper: GIT_* unset, the gate mutex, gate-tail, to a log; `done` file with the exit.
# usage: sh R5C2-run.sh <name> <command...>
cd /home/user/wt/r5c || exit 2
for v in $(env | sed -n 's/^\(GIT_[A-Z_]*\)=.*/\1/p'); do unset "$v"; done
O=docs/chair/2026-11-20/veil/out/v33/r5recent
N="$1"; shift
rm -f "$O/R5C2-$N.done"
TMPDIR=/tmp/claude-0/-home-user-settlement-engine/7c0d51b5-5ce2-5824-9d4a-67ecf2c2d258/scratchpad sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 80 "$@" > "$O/R5C2-$N.log" 2>&1
rc=$?
echo "rc=$rc $(date -u +%H:%M:%S)" > "$O/R5C2-$N.done"
exit $rc
