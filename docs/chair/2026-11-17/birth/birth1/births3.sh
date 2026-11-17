#!/bin/sh
# births of the 720, the 150 and the 525 in a tree: sh births3.sh <tree> <outroot>
TREE=$1; OUT=$2; S=/tmp/claude-0/-home-user-settlement-engine/5055c99b-8231-592b-92f6-f61dec944beb/scratchpad
for pop in 720 150 ref; do d="$OUT/$pop"; mkdir -p "$d"
  if [ "$pop" = ref ]; then ( TREE="$TREE" OUT="$d" node "$S/probes/birthsRef.mjs" > "$d/births.log" 2>&1; echo "EXIT $?" >> "$d/births.log" ) &
  else f=seeds.txt; [ "$pop" = 150 ] && f=seeds.w150.txt
    ( TREE="$TREE" OUT="$d" SEEDS="$S/pc/$f" node "$S/pc/births.mjs" > "$d/births.log" 2>&1; echo "EXIT $?" >> "$d/births.log" ) & fi
done; wait; grep -H EXIT "$OUT"/*/births.log
