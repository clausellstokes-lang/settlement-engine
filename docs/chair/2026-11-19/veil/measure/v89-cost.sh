#!/bin/sh
# v89-cost.sh <x211> <base chain> <tree chain> <base tree> <tree> [R]   VEIL-17's builder (V8-9): THE COST TABLE, native
# cluster only (PGHOST, unix socket). veil-probe-16/measure/v83-cost.sh's runner, with the name's length a parameter:
#   1. the reader's cost8.sql rows (gallery read as anon): the V8-3 rows of PART 17 section 2, the reader's V8-9 rows
#      (600 x 145, 1,000 x 80, 1,500 x 145; served: 300 x 145, 1,000 x 45) and the bound's neighbourhood (85 and 86
#      houses of 145 characters: 16,200 and 16,385 code points), R rounds (default 5), the chains in turn each round,
#      every run's line kept and the median of each chain's milliseconds
#   2. run-all's deep and large rows (REVIEW-VEIL-7/hand/deep-cost.sql), the same way
#   3. Langengrund (/var/tmp/v17/out/big0.json) by veil-probe-16's cost.mjs, 15 rounds, the chains alternated: no veil
#      record, and the default veil record, the link and the gallery read
#   4. the client's twin on the reader's rows, the base's tree against this tree (twin.mjs)
set -u
A=$1; B=$2; C=$3; BT=$4; WT=$5; R=${6:-5}
HERE=$(cd "$(dirname "$0")" && pwd); LIB=/var/tmp/v17/lib/docs/chair; V16=$WT/docs/chair/2026-11-14/veil-probe-16/measure
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres
c8() { psql -qd $1 -v houses=$2 -v hitrows=$3 -v coldrows=$4 -v namelen=$5 -f $LIB/2026-11-14/probes/REVIEW-VEIL-8/hand/cost8.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//'; }
dc() { psql -qd $1 -v depth=$2 -v houses=$3 -v strings=$4 -v dm=$5 -f $LIB/2026-11-13/probes/REVIEW-VEIL-7/hand/deep-cost.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//'; }
ms() { sed -n 's/.* \([0-9]*\) ms$/\1/p'; }
med() { sort -n | awk '{ a[NR] = $1 } END { print a[int((NR + 1) / 2)] }'; }
rounds() { # <label> <fn> <args...>: R rounds, the three chains in turn; each run's line, then the medians
  label=$1; fn=$2; shift 2; T=$(mktemp -d)
  for i in $(seq 1 $R); do for db in $A $B $C; do line=$($fn $db "$@"); echo "  $label round $i :: $line"; echo "$line" | ms >> $T/$db; done; done
  echo "$label :: MEDIAN ms $A $(med < $T/$A) | $B $(med < $T/$B) | $C $(med < $T/$C)"; rm -rf $T; }
echo "== cost8.sql (houses, hit rows, cold rows, name repeats), $R rounds: $A | $B | $C"
for spec in "5 10000 0 1" "5 5000 5000 1" "200 2000 2000 1" "50 500 500 1" \
            "600 0 0 8" "1000 0 0 4" "1500 0 0 8" "300 0 0 8" "1000 0 0 2" "85 0 0 8" "86 0 0 8"; do
  set -- $spec; rounds "h=$1 hit=$2 cold=$3 nl=$4" c8 $1 $2 $3 $4; done
echo "== deep-cost.sql (depth, houses, strings, Reveal DM), $R rounds: $A | $B | $C"
for spec in "3000 5 100 true" "10 200 5000 false" "10 600 10000 false"; do set -- $spec; rounds "depth=$1 houses=$2 strings=$3 dm=$4" dc $1 $2 $3 $4; done
echo "== Langengrund, no veil record, Reveal DM off (cost.mjs, 15 rounds)"
VEIL='{}' node $V16/cost.mjs /var/tmp/v17/pgmod /var/tmp/v17/out/big0.json 15 $A $B $C
echo "== Langengrund, the default veil record, Reveal DM off (cost.mjs, 15 rounds)"
VEIL='{"$veil":{"v":1,"mode":"live","deltas":[]}}' node $V16/cost.mjs /var/tmp/v17/pgmod /var/tmp/v17/out/big0.json 15 $A $B $C
echo "== the client's twin on the reader's rows (twin.mjs): the base's tree, then this tree"
for t in $BT $WT; do echo "  $t"; node $HERE/twin.mjs $t latin:600:8 latin:1000:4 latin:1500:8 latin:85:8 latin:86:8 2>&1 | sed 's/^/    /'; done
