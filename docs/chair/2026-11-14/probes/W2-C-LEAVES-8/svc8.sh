#!/bin/sh
# usage: svc8.sh <tree> <corpus.ndjson.gz> <out.ndjson> <scratch dir> ; the Services tab's need rows per town; exits with vitest's code
TREE=$(cd "$1" && pwd); P=$(cd "$(dirname "$0")" && pwd); W=$(mktemp -d "$4/run.XXXX")
ln -sfn "$TREE/node_modules" "$W/node_modules"
sed "s#__TREE__#$TREE#g" "$P/svc8.census.jsx" > "$W/svc8.census.jsx"
cat > "$W/vt.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$W/svc8.census.jsx'], testTimeout: 3600000, pool: 'forks' } };
CFG
cd "$TREE" && CORPUS="$2" OUT="$3" npx vitest run --config "$W/vt.config.mjs" > "$W/log" 2>&1; rc=$?; tail -5 "$W/log"; exit $rc
