#!/bin/sh
# usage: run.sh <tree> <probe.test.js template> <out file>  (env passes through)
TREE=$(cd "$1" && pwd); D=$(mktemp -d <scratchpad>/probe/run.XXXX)
ln -sfn "$TREE/node_modules" "$D/node_modules"; sed "s#__TREE__#$TREE#g" "$2" > "$D/p.census.test.jsx"
cat > "$D/vt.config.mjs" <<CFG
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], test: { environment: 'node', include: ['$D/p.census.test.jsx'], testTimeout: 600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
CFG
cd "$TREE"; PROBE_OUT="$3" npx vitest run --config "$D/vt.config.mjs" > "$D/log" 2>&1; echo "exit $? log $D/log"
