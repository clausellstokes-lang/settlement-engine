#!/bin/sh
# elig.sh <tree> <outdir> <seedsfile> <workers>
set -eu
TREE=$(cd "$1" && pwd); mkdir -p "$2"; OUT=$(cd "$2" && pwd); SEEDF=$3; W=$4; T=$(dirname "$0")
sed "s#__TREE__#$TREE#g" "$T/elig.census.jsx" > "$OUT/elig.census.jsx"
cat > "$OUT/vitest.elig.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/elig.census.jsx'], testTimeout: 36000000, pool: 'forks', fileParallelism: false } };
CFG
i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" '(NR-1)%w==j' "$SEEDF" > "$OUT/seeds.$i"; i=$((i+1)); done
i=0; while [ "$i" -lt "$W" ]; do
  ( cd "$TREE" && EXTRACT="${EXTRACT:-}" ELIG_OUT="$OUT/elig.$i.ndjson" ELIG_SEEDS="$OUT/seeds.$i" npx vitest run --config "$OUT/vitest.elig.config.mjs" > "$OUT/elig.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/elig.$i.log" ) &
  i=$((i+1)); done
wait; cat "$OUT"/elig.*.ndjson > "$OUT/elig.ndjson"; wc -l < "$OUT/elig.ndjson"; grep -c '"err"' "$OUT/elig.ndjson" || true; grep -h "EXIT" "$OUT"/elig.*.log
