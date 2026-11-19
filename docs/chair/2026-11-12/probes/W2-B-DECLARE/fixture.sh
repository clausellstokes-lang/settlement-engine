#!/bin/sh
# W2-B-DECLARE second seat — THE FIXTURE SCORE: the cold list's thirty towns rendered as the owner sees them (the census
# render), the page check run over them, and its RECALL against the cold list by the list's own mechanism classes.
#   sh docs/chair/2026-11-12/probes/W2-B-DECLARE/fixture.sh <tree-root> <out-dir> [cold-list.json]
# The cold list defaults to the reviewer's (lane/review-w2b-2026-11-13 :: docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json).
set -eu
P=$(cd "$(dirname "$0")" && pwd)
TREE=$(cd "$1" && pwd)
mkdir -p "$2/dumps"; OUT=$(cd "$2" && pwd)
COLD=${3:-$OUT/cold.json}
[ -f "$COLD" ] || git -C "$TREE" show origin/lane/review-w2b-2026-11-13:docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json > "$COLD"
ln -sfn "$TREE/node_modules" "$OUT/node_modules"
TREE=$TREE OUT=$OUT node "$P/fixtureBirths.mjs" "$COLD"
sed "s#__TREE__#$TREE#g" "$P/render.census.jsx" > "$OUT/render.census.jsx"
cat > "$OUT/vitest.census.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/render.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
W=3; i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" '(NR-1)%w==j' "$OUT/seeds.txt" > "$OUT/seeds.$i"; i=$((i+1)); done
i=0; while [ "$i" -lt "$W" ]; do
  ( cd "$TREE" && CENSUS_FIXTURE="$OUT/fixture.configs.json" CENSUS_OUT="$OUT/dumps" CENSUS_SEEDS="$OUT/seeds.$i" npx vitest run --config "$OUT/vitest.census.config.mjs" > "$OUT/render.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/render.$i.log" ) &
  i=$((i+1)); done
wait
n=$(ls "$OUT/dumps" | wc -l); [ "$n" -eq 30 ] || { echo "fixture: only $n of 30 dumps — read $OUT/render.*.log"; exit 1; }
TREE=$TREE node "$P/recall.mjs" "$COLD" "$OUT"
