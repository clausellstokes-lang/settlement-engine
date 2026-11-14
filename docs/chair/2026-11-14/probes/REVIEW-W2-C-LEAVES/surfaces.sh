#!/bin/sh
# surfaces.sh <tree> <records dir> <out> <seedsfile>
set -eu
P=$(dirname "$0"); TREE=$(cd "$1" && pwd); mkdir -p "$3"; OUT=$(cd "$3" && pwd)
ln -sfn "$TREE/node_modules" "$OUT/node_modules"
sed "s#__TREE__#$TREE#g" "$P/surfaces.census.jsx" > "$OUT/surfaces.census.jsx"
cat > "$OUT/vitest.surf.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/surfaces.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
cd "$TREE" && RECORDS="$2" OUT="$OUT" SEEDS="$4" npx vitest run --config "$OUT/vitest.surf.config.mjs" > "$OUT/surf.log" 2>&1; echo "EXIT $?" >> "$OUT/surf.log"; grep -h "Tests \|EXIT" "$OUT/surf.log"
