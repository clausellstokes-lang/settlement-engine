#!/bin/sh
# v8245-cost.sh <x211> <base chain> <tree chain> [R] [lib]   VEIL-18's builder (V8-2, V8-4, V8-5): THE COST, native cluster
# only (PGHOST, unix socket). v89-cost.sh's runner (the same rounds and medians), its cost8 rows the brief names
# ("5 10000 0 1": the V8-3 row; "50 500 500 1") and deep-cost's two 300 KB rows, with the reader's library at <lib>
# (default /var/tmp/v18/lib/docs/chair). R rounds (default 5), the three chains in turn each round.
set -u
A=$1; B=$2; C=$3; R=${4:-5}; LIB=${5:-/var/tmp/v18/lib/docs/chair}
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
for spec in "5 10000 0 1" "50 500 500 1"; do set -- $spec; rounds "h=$1 hit=$2 cold=$3 nl=$4" c8 $1 $2 $3 $4; done
echo "== deep-cost.sql (depth, houses, strings, Reveal DM), $R rounds: $A | $B | $C"
for spec in "10 200 5000 false" "10 600 10000 false"; do set -- $spec; rounds "depth=$1 houses=$2 strings=$3 dm=$4" dc $1 $2 $3 $4; done
