#!/bin/sh
# SEAT-TOWN's runner (MAP-1's run-map.sh, with ROOT an argument instead of a hard-coded checkout).
# usage: sh run-seat-town.sh <ROOT> <outdir> <workers> <seed-prefix> <n> [sizes...]
# Splits the plan (seeds <prefix>-<size>-<i>) round-robin over <workers> vitest processes; each log to <outdir>/seat.<w>.log.
ROOT=$1; OUT=$2; W=$3; PFX=$4; N=$5; shift 5
SIZES=${*:-thorp hamlet village town city metropolis}
DIR=$ROOT/docs/chair/2026-11-20/content/prose/map/seat-town
mkdir -p "$OUT"
{ echo "ROOT=$ROOT"; echo "HEAD=$(git -C "$ROOT" rev-parse HEAD)"; } > "$OUT/HEAD.txt"
node -e '
const [out, w, pfx, n, ...sizes] = process.argv.slice(1);
const plan = sizes.flatMap((size) => Array.from({ length: Number(n) }, (_, i) => ({ seed: `${pfx}-${size}-${i}`, size })));
for (let k = 0; k < Number(w); k++) require("fs").writeFileSync(`${out}/plan.seat.${k}.json`, JSON.stringify(plan.filter((_, i) => i % Number(w) === k)));
' "$OUT" "$W" "$PFX" "$N" $SIZES
k=0
while [ $k -lt "$W" ]; do
  ( cd "$ROOT" && SEAT_FILE=$DIR/seat-town.census.mjs MAP_PLAN=$OUT/plan.seat.$k.json MAP_OUT=$OUT MAP_WORKER=$k \
    npx vitest run --config "$DIR/vitest.seat-town.config.mjs" > "$OUT/seat.$k.log" 2>&1; echo "exit $?" >> "$OUT/seat.$k.log" ) &
  k=$((k+1))
done
wait
