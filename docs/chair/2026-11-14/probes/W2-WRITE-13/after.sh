#!/bin/sh
# after.sh <tag> <touched files...> : the doors after a cure, NO register re-taken (the chair's ruling: re-derived once, at the close).
# gen + gen --check; presumed --check; the pool guard; the grid; the three fast gates on touched files; the fast set (reds listed).
: "${LANE:?}"; : "${OUT:?}"; T=$1; shift; cd "$LANE" || exit 1
node scripts/generate-dossier-state-prose.mjs > "$OUT/$T.gen.log" 2>&1; e0=$?
node scripts/generate-dossier-state-prose.mjs --check > "$OUT/$T.genc.log" 2>&1; e1=$?
node scripts/presumed-things-door.mjs --check > "$OUT/$T.presumed.log" 2>&1; e2=$?
GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 tests/lint/poolDominance.walker.test.js > "$OUT/$T.poolguard.log" 2>&1; e3=$?
sh scripts/gate-tail.sh node scripts/census/page-census.mjs --grid > "$OUT/$T.grid.log" 2>&1; e4=$?
echo "gen=$e0 genc=$e1 presumed=$e2 poolguard=$e3 grid=$e4"
grep -iE "fresh|presum" "$OUT/$T.presumed.log" | tail -2
grep -E "Tests " "$OUT/$T.poolguard.log"
tail -4 "$OUT/$T.grid.log"
if [ $# -gt 0 ]; then sh /home/user/probes/gates.sh "$@"; fi
GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 $(cat /home/user/probes/fastset.txt) > "$OUT/$T.fast.log" 2>&1; echo "fast=$?"
grep -E "^ FAIL " "$OUT/$T.fast.log" | sort -u | cut -c1-230
grep -E "Tests  " "$OUT/$T.fast.log"
