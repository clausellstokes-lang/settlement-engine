#!/bin/sh
# gates.sh <tag> <tests-file> <src files...>: strict-domain, type ratchet, eslint, grid, the named tests; each through gate-tail
S=<scratchpad>; tag=$1; tf=$2; shift 2; cd $S/wt
R=$S/m/gates.$tag; : > $R
sh scripts/gate-tail.sh npm run typecheck:domain:strict > $R.strict 2>&1; echo "strict $?" >> $R
sh scripts/gate-tail.sh npm run typecheck:ratchet > $R.ratchet 2>&1; echo "ratchet $?" >> $R
sh scripts/gate-tail.sh npx eslint "$@" $(cat $tf) > $R.eslint 2>&1; echo "eslint $?" >> $R
sh scripts/gate-tail.sh node scripts/census/page-census.mjs --grid > $R.grid 2>&1; echo "grid $?" >> $R
GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 $(cat $tf) > $R.tests 2>&1; echo "tests $?" >> $R
echo DONE >> $R
