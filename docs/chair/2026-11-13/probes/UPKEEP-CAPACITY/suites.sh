#!/bin/sh
# run the defence-adjacent suites in tree $1, log to $2
cd "$1" && GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/generators tests/lint tests/pdf tests/domain/display tests/domain/defense tests/domain/institutions > "$2" 2>&1
echo "exit $?" >> "$2"
