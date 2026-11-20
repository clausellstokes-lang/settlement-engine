#!/bin/sh
# food.sh <tree> <records dir> <out> <seedsfile>
set -eu
K=$(dirname "$0"); TREE=$(cd "$1" && pwd); mkdir -p "$3"; OUT=$(cd "$3" && pwd)
ln -sfn "$TREE/node_modules" "$OUT/node_modules"
sed "s#__TREE__#$TREE#g" "$K/food.census.jsx" > "$OUT/food.census.jsx"
cat > "$OUT/vitest.f.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/food.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
cd "$TREE" && RECORDS="$2" OUT="$OUT" SEEDS="$4" npx vitest run --config "$OUT/vitest.f.config.mjs" > "$OUT/f.log" 2>&1; echo "EXIT $?" >> "$OUT/f.log"; grep -h "Tests \|EXIT" "$OUT/f.log"; true
