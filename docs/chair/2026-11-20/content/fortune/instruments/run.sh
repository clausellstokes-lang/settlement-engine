#!/bin/sh
# FORTUNE-1: the whole measure in one command (about four minutes). It copies the checkout twice (a trace copy and a
# prototype copy, under the scratch directory), changes no source file of the checkout, and writes its outputs here:
#   sh docs/chair/2026-11-20/content/fortune/instruments/run.sh <checkout> <scratch-dir>
# Outputs (docs/chair/2026-11-20/content/fortune/measures/): terms.txt (the fortune sum by size, today's rule),
# fs6-untouched.txt and fs6-every-dial.txt (before -> after, FS6's tables), twenty.txt (twenty towns as plain lines),
# fs4-large.txt (every calm city and metropolis the rule reads poor or contested, with its deciding facts),
# fs7-screen.txt (the sentence screen, before and after).
set -e
LINE=$(cd "$1" && pwd); SCRATCH=$2; HERE=$(cd "$(dirname "$0")" && pwd); OUT="$HERE/../measures"
mkdir -p "$SCRATCH" "$OUT"
DIALS='{"tradeRouteAccess":"random_trade","culture":"random_culture","monsterThreat":"random_threat","nearbyResourcesRandom":true,"selectedStressesRandom":true,"_randomizePriorities":true,"magicExists":true,"contentProfile":"grounded"}'
node "$HERE/tree.mjs" "$LINE" "$SCRATCH/trace" trace
node "$HERE/tree.mjs" "$LINE" "$SCRATCH/proto" proto
node "$HERE/measure.mjs" "$SCRATCH/trace" "$SCRATCH/base-hxd.jsonl" 100 hxd &
node "$HERE/measure.mjs" "$SCRATCH/trace" "$SCRATCH/base-hxr.jsonl" 100 hxr "$DIALS" &
node "$HERE/measure.mjs" "$SCRATCH/proto" "$SCRATCH/proto-hxd.jsonl" 100 hxd &
node "$HERE/measure.mjs" "$SCRATCH/proto" "$SCRATCH/proto-hxr.jsonl" 100 hxr "$DIALS" &
wait
node "$HERE/terms.mjs" "$SCRATCH/base-hxd.jsonl" > "$OUT/terms.txt"
node "$HERE/compare.mjs" "$SCRATCH/base-hxd.jsonl" "$SCRATCH/proto-hxd.jsonl" > "$OUT/fs6-untouched.txt"
node "$HERE/compare.mjs" "$SCRATCH/base-hxr.jsonl" "$SCRATCH/proto-hxr.jsonl" > "$OUT/fs6-every-dial.txt"
node "$HERE/explain.mjs" "$SCRATCH/base-hxd.jsonl" "$SCRATCH/proto-hxd.jsonl" twenty > "$OUT/twenty.txt"
node "$HERE/explain.mjs" "$SCRATCH/base-hxd.jsonl" "$SCRATCH/proto-hxd.jsonl" large "[untouched] " > "$OUT/fs4-large.txt"
node "$HERE/explain.mjs" "$SCRATCH/base-hxr.jsonl" "$SCRATCH/proto-hxr.jsonl" large "[every dial random] " >> "$OUT/fs4-large.txt"
node "$HERE/fs7.mjs" "$SCRATCH/trace" "$SCRATCH/fs7-before.json" 20 > "$OUT/fs7-screen.txt"
node "$HERE/fs7.mjs" "$SCRATCH/proto" "$SCRATCH/fs7-after.json" 20 >> "$OUT/fs7-screen.txt"
cp "$SCRATCH/fs7-after.json" "$OUT/fs7-after-candidates.json"
echo "done: $OUT"
