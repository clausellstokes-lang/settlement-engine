#!/bin/sh
# read.sh <tree> <out> <seedsfile> : render the listed census seeds through the tree's own dossier, dumps in <out>/dumps
set -eu
P=/tmp/claude-0/-home-user-settlement-engine/99a7e03c-e0c6-54e0-b9cc-150e60507723/scratchpad/probe-census/docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS
TREE=$(cd "$1" && pwd); mkdir -p "$2/dumps"; OUT=$(cd "$2" && pwd)
ln -sfn "$TREE/node_modules" "$OUT/node_modules"
sed "s#__TREE__#$TREE#g" "$P/render.census.jsx" > "$OUT/render.census.jsx"
cat > "$OUT/vitest.census.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/render.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
cp "$3" "$OUT/seeds.0"
cd "$TREE" && CENSUS_OUT="$OUT/dumps" CENSUS_SEEDS="$OUT/seeds.0" npx vitest run --config "$OUT/vitest.census.config.mjs" > "$OUT/render.log" 2>&1; echo EXIT $?
