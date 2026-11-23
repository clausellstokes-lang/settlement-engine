#!/bin/sh
# v83-cost.sh <x211> <base chain> <tree chain> <tree> [R]   VEIL-16 (V8-3): THE COST TABLE, native cluster only (PGHOST, unix socket).
#   1. the reader's cost8.sql rows of PART 17 section 2 (gallery read as anon): R rounds (default 5), the chains in turn
#      each round, every run's line kept and the median of each chain's milliseconds
#   2. run-all's deep and large rows (REVIEW-VEIL-7/hand/deep-cost.sql), the same way
#   3. Langengrund (/var/tmp/v16/out/big0.json) by cost.mjs, 15 rounds, the chains alternated: no veil record, and the
#      default veil record ({"$veil":{"v":1,"mode":"live","deltas":[]}}), the link and the gallery read
#   4. the client's twin on the V8-3 row (twin8.probe.jsx)
set -u
A=$1; B=$2; C=$3; WT=$4; R=${5:-5}
HERE=$(cd "$(dirname "$0")" && pwd); LIB=/var/tmp/v16/lib/docs/chair
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres
c8() { psql -qd $1 -v houses=$2 -v hitrows=$3 -v coldrows=$4 -v namelen=1 -f $LIB/2026-11-14/probes/REVIEW-VEIL-8/hand/cost8.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//'; }
dc() { psql -qd $1 -v depth=$2 -v houses=$3 -v strings=$4 -v dm=$5 -f $LIB/2026-11-13/probes/REVIEW-VEIL-7/hand/deep-cost.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//'; }
ms() { sed -n 's/.* \([0-9]*\) ms$/\1/p'; }
med() { sort -n | awk '{ a[NR] = $1 } END { print a[int((NR + 1) / 2)] }'; }
rounds() { # <label> <fn> <args...>: R rounds, the three chains in turn; each run's line, then the medians
  label=$1; fn=$2; shift 2; T=$(mktemp -d)
  for i in $(seq 1 $R); do for db in $A $B $C; do line=$($fn $db "$@"); echo "  $label round $i :: $line"; echo "$line" | ms >> $T/$db; done; done
  echo "$label :: MEDIAN ms $A $(med < $T/$A) | $B $(med < $T/$B) | $C $(med < $T/$C)"; rm -rf $T; }
echo "== cost8.sql (houses, hit rows, cold rows), $R rounds: $A | $B | $C"
for spec in "5 10000 0" "5 5000 5000" "200 2000 2000" "50 500 500"; do set -- $spec; rounds "h=$1 hit=$2 cold=$3" c8 $1 $2 $3; done
echo "== deep-cost.sql (depth, houses, strings, Reveal DM), $R rounds: $A | $B | $C"
for spec in "3000 5 100 true" "10 200 5000 false" "10 600 10000 false"; do set -- $spec; rounds "depth=$1 houses=$2 strings=$3 dm=$4" dc $1 $2 $3 $4; done
echo "== Langengrund, no veil record, Reveal DM off (cost.mjs, 15 rounds)"
VEIL='{}' node $HERE/cost.mjs /var/tmp/v16/pgmod /var/tmp/v16/out/big0.json 15 $A $B $C
echo "== Langengrund, the default veil record, Reveal DM off (cost.mjs, 15 rounds)"
VEIL='{"$veil":{"v":1,"mode":"live","deltas":[]}}' node $HERE/cost.mjs /var/tmp/v16/pgmod /var/tmp/v16/out/big0.json 15 $A $B $C
echo "== the client's twin on the V8-3 row"
rm -f /var/tmp/v16/out/v83/twin8.txt; (cd $WT && RV6_SRC=$WT RV6_PROBE=twin8.probe.jsx R8_OUT=/var/tmp/v16/out/v83/twin8.txt GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 --config $HERE/vitest.config.mjs > /dev/null 2>&1); cat /var/tmp/v16/out/v83/twin8.txt
