#!/bin/sh
# UPKEEP-11: the whole suite in six vitest shards, two at a time, each to its own file outside the tree.
cd "$1" || exit 2; O="$2"; mkdir -p "$O"
run() { npx vitest run --shard=$1/6 --reporter=default > "$O/shard-$1.txt" 2>&1; echo "shard $1 exit $?" >> "$O/exits.txt"; }
run 1 & run 2 & wait
run 3 & run 4 & wait
run 5 & run 6 & wait
echo ALLDONE >> "$O/exits.txt"
