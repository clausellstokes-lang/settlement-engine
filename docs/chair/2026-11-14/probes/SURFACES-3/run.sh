#!/bin/sh
# run.sh <tree> <census.jsx> <out> <seedsfile> <workers> [env assignments...]: runs a *.census.jsx under vitest in shards, logs to <out>
set -eu
K=$(cd "$(dirname "$2")" && pwd)/$(basename "$2"); TREE=$(cd "$1" && pwd); mkdir -p "$3"; OUT=$(cd "$3" && pwd); SEEDF=$4; W=$5; shift 5
N=$(basename "$K" .census.jsx); ln -sfn "$TREE/node_modules" "$OUT/node_modules"
sed "s#__TREE__#$TREE#g" "$K" > "$OUT/$N.census.jsx"
cat > "$OUT/vitest.$N.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/$N.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" '(NR-1)%w==j' "$SEEDF" > "$OUT/seeds.$N.$i"; i=$((i+1)); done
i=0; while [ "$i" -lt "$W" ]; do
  ( cd "$TREE" && env "$@" SHARD=$i OUT="$OUT" SEEDS="$OUT/seeds.$N.$i" npx vitest run --config "$OUT/vitest.$N.config.mjs" > "$OUT/$N.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/$N.$i.log" ) &
  i=$((i+1)); done
wait; grep -h "Tests \|EXIT" "$OUT"/$N.*.log
