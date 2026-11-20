#!/bin/sh
# usage: run.sh <tree> <plan file> <out dir>  — DUMP views of each plan row (views10.census.jsx, W2-C-LEAVES-9)
S=<scratchpad>
TREE=$(cd "$1" && pwd); mkdir -p "$3/rows"; ln -sfn "$TREE/node_modules" "$3/node_modules"
sed "s#__TREE__#$TREE#g" "<scratchpad>/vb/views10.census.jsx" > "$3/views10.census.jsx"
cat > "$3/vt.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$3/views10.census.jsx'], testTimeout: 300000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
CFG
cd "$TREE"; DUMP=1 PAGE_CENSUS_OUT="$3/rows" PAGE_CENSUS_PLAN="$2" npx vitest run --config "$3/vt.config.mjs" > "$3/render.log" 2>&1; echo "exit $?"
