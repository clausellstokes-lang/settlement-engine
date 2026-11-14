#!/bin/sh
# UPKEEP-11: re-run the suite's red files in each named tree, one log each: attr11.sh <list> <outdir> <tree>...
L="$1"; O="$2"; shift 2
for t in "$@"; do
  n=$(basename "$t")
  (cd "$t" && npx vitest run --maxWorkers=2 $(cat "$L") > "$O/attr-$n.log" 2>&1; echo "EXIT $?" >> "$O/attr-$n.log")
done
echo ALLDONE > "$O/attr.done"
