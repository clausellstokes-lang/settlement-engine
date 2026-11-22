#!/bin/sh
# MAP-1's runner. usage: sh run-map.sh <plain|draws> <outdir> <workers> <seed-prefix> <n> [sizes...]
# Splits the plan (seeds <prefix>-<size>-<i>) round-robin over <workers> vitest processes; each log to <outdir>/<mode>.<w>.log.
MODE=$1; OUT=$2; W=$3; PFX=$4; N=$5; shift 5
SIZES=${*:-thorp hamlet village town city metropolis}
ROOT=/home/user/settlement-engine; MAP=$ROOT/docs/chair/2026-11-20/content/prose/map
mkdir -p "$OUT"
node -e '
const [out, w, pfx, n, mode, ...sizes] = process.argv.slice(1);
const plan = sizes.flatMap((size) => Array.from({ length: Number(n) }, (_, i) => ({ seed: `${pfx}-${size}-${i}`, size })));
for (let k = 0; k < Number(w); k++) require("fs").writeFileSync(`${out}/plan.${mode}.${k}.json`, JSON.stringify(plan.filter((_, i) => i % Number(w) === k)));
' "$OUT" "$W" "$PFX" "$N" "$MODE" $SIZES
k=0
while [ $k -lt "$W" ]; do
  ( cd $ROOT && MAP_FILE=$MAP/map-$MODE.census.mjs MAP_PLAN=$OUT/plan.$MODE.$k.json MAP_OUT=$OUT MAP_WORKER=$k \
    npx vitest run --config $MAP/vitest.map.config.mjs > "$OUT/$MODE.$k.log" 2>&1; echo "exit $?" >> "$OUT/$MODE.$k.log" ) &
  k=$((k+1))
done
wait
