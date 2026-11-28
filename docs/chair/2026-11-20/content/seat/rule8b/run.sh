#!/bin/sh
S=/tmp/claude-0/-home-user-settlement-engine/063b430e-c1e9-57b8-bc28-1d71aefb0933/scratchpad
K=$1; N=$2; cd /home/user/settlement-engine || exit 9
echo "start $(date -u +%H:%M:%SZ) $(git rev-parse --short HEAD) shard $K/$N files $(wc -l < $S/r8b/files.txt)"
TMPDIR=$S/gt sh scripts/gate-tail.sh -n 40 env TMPDIR=/tmp GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=400 sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 --shard="$K/$N" --reporter=default --reporter=json --outputFile.json="$S/r8b/r8-$K-of-$N.json" $(cat $S/r8b/files.txt) > $S/r8b/r8-$K-of-$N.tail.txt 2>&1
echo "exit $? $(date -u +%H:%M:%SZ)"
