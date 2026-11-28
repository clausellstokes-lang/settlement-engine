#!/bin/sh
# usage: views9.sh <tree> <plan dir: page-census --out's plan.N.json> <out dir> ; W2-C-LEAVES-9 item 3: the dossier views' word count
TREE=$(cd "$1" && pwd); P=$(cd "$(dirname "$0")" && pwd); mkdir -p "$3/rows"; ln -sfn "$TREE/node_modules" "$3/node_modules"
sed "s#__TREE__#$TREE#g" "$P/views9.census.jsx" > "$3/views9.census.jsx"
cat > "$3/vt.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$3/views9.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
CFG
cd "$TREE"; for w in 0 1 2 3; do PAGE_CENSUS_OUT="$3/rows" PAGE_CENSUS_PLAN="$2/plan.$w.json" npx vitest run --config "$3/vt.config.mjs" > "$3/render.$w.log" 2>&1 & done; wait
ls "$3/rows" | wc -l
