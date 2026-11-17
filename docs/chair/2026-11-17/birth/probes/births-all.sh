#!/bin/sh
# BIRTH-AUDIT: births of the 720, the 150 and the 525 reference configurations for each named rule set, in a tree.
#   sh births-all.sh <tree> <out-root> <page-copy-dir> <label>=<BIRTH_RULE> ...   (four at a time; each job's exit in its log)
TREE=$1; OUT=$2; PC=$3; shift 3; HERE=$(cd "$(dirname "$0")" && pwd)
jobs=""
run() { # label rule pop
  d="$OUT/$1-$3"; mkdir -p "$d"
  if [ "$3" = ref ]; then ( BIRTH_RULE="$2" TREE="$TREE" OUT="$d" node "$HERE/birthsRef.mjs" > "$d/births.log" 2>&1; echo "EXIT $?" >> "$d/births.log" )
  else f=seeds.txt; [ "$3" = 150 ] && f=seeds.w150.txt; [ "$3" = 300 ] && f=seeds.fresh300.txt
    ( BIRTH_RULE="$2" TREE="$TREE" OUT="$d" SEEDS="$PC/$f" node "$PC/births.mjs" > "$d/births.log" 2>&1; echo "EXIT $?" >> "$d/births.log" ); fi
}
n=0
for spec in "$@"; do label=${spec%%=*}; rule=${spec#*=}
  for pop in 720 150 ref; do run "$label" "$rule" "$pop" & n=$((n+1)); if [ $((n % 4)) -eq 0 ]; then wait; fi; done
done
wait; grep -H EXIT "$OUT"/*/births.log
