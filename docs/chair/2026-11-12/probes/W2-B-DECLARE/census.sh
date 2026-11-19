#!/bin/sh
# SECOND-WAVE-CENSUS — count the shared dossier patterns on any tree, one command.
#   sh docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/census.sh <tree-root> <out-dir> [workers=4]
# <tree-root>: a checkout with node_modules installed (npm ci there first). <out-dir>: anywhere outside the
# repository. Births the 720 seeds of seeds.txt in that tree, renders every dossier through its own OutputContainer
# as the owner (vitest + jsdom, <workers> processes), counts every pattern, and writes
#   <out-dir>/counts.txt (one row per pattern) · counts.json (examples) · counts.perseed.json (for compare.mjs).
# Compare two trees: node docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/compare.mjs <base-out>/counts.perseed.json <tip-out>/counts.perseed.json
# Writes nothing in either tree. Measured: 15–20 minutes per tree on a 4-core container (births ~1, render ~12–18, count ~1).
set -eu
P=$(cd "$(dirname "$0")" && pwd)
TREE=$(cd "$1" && pwd)
mkdir -p "$2/dumps"; OUT=$(cd "$2" && pwd)
W=${3:-4}
[ -d "$TREE/node_modules" ] || { echo "census: no node_modules in $TREE (run npm ci there first)"; exit 2; }
ln -sfn "$TREE/node_modules" "$OUT/node_modules"     # bare imports in the render file resolve to the tree's own React
echo "census: births in $TREE"
TREE=$TREE OUT=$OUT node "$P/births.mjs"
sed "s#__TREE__#$TREE#g" "$P/render.census.jsx" > "$OUT/render.census.jsx"
[ -f "$TREE/src/domain/display/publicProse.js" ] || sed -i '/@stamp/d' "$OUT/render.census.jsx"   # older trees: no stamp
cat > "$OUT/vitest.census.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$OUT/render.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
CFG
i=0; while [ "$i" -lt "$W" ]; do awk -v w="$W" -v j="$i" '(NR-1)%w==j' "$P/seeds.txt" > "$OUT/seeds.$i"; i=$((i+1)); done
echo "census: rendering 720 dossiers ($W workers)"
i=0; while [ "$i" -lt "$W" ]; do
  ( cd "$TREE" && CENSUS_OUT="$OUT/dumps" CENSUS_SEEDS="$OUT/seeds.$i" npx vitest run --config "$OUT/vitest.census.config.mjs" > "$OUT/render.$i.log" 2>&1; echo "EXIT $?" >> "$OUT/render.$i.log" ) &
  i=$((i+1)); done
wait
n=$(ls "$OUT/dumps" | wc -l); grep -h "Tests \|EXIT" "$OUT"/render.*.log
[ "$n" -eq 720 ] || { echo "census: only $n of 720 dumps — read $OUT/render.*.log"; exit 1; }
echo "census: counting"
TREE=$TREE OUT=$OUT DUMPS="$OUT/dumps" CORPUS="$OUT/corpus.ndjson.gz" node "$P/count.mjs" | sort > "$OUT/counts.txt"
cat "$OUT/counts.txt"
