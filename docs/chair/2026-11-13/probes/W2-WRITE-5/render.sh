#!/bin/sh
# render.sh <tree> <out> <seedsfile> <workers>
set -eu
P=$(dirname "$0"); TREE=$(cd "$1" && pwd); mkdir -p "$2/dumps" "$2/records"; OUT=$(cd "$2" && pwd); SEEDF=$3; W=$4
ln -sfn "$TREE/node_modules" "$OUT/node_modules"
sed "s#__TREE__#$TREE#g" "$P/render.w5.jsx" > "$OUT/render.census.jsx"
cat > "$OUT/vitest.census.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/render.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" '(NR-1)%w==j' "$SEEDF" > "$OUT/seeds.$i"; i=$((i+1)); done
i=0; while [ "$i" -lt "$W" ]; do
  ( cd "$TREE" && RECORD_OUT="$OUT/records" CENSUS_OUT="$OUT/dumps" CENSUS_SEEDS="$OUT/seeds.$i" npx vitest run --config "$OUT/vitest.census.config.mjs" > "$OUT/render.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/render.$i.log" ) &
  i=$((i+1)); done
wait; ls "$OUT/dumps" | wc -l; grep -h "Tests \|EXIT" "$OUT"/render.*.log
