#!/bin/sh
# WORDS-2: dump the born records of a plan on a tree. sh records-dump.sh <tree> <plan.json> <outdir> <workdir>
TREE=$1; PLAN=$2; OUT=$3; W=$4; HERE=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$W"
cat > "$W/vitest.records.config.mjs" <<CFG
export default { root: '$TREE', server: { fs: { allow: ['$TREE', '$HERE', '$(realpath "$TREE/node_modules")'] } }, test: { environment: 'node', include: ['$HERE/records-dump.census.jsx'], testTimeout: 7200000, pool: 'forks' } };
CFG
cd "$TREE" && W2_TREE="$TREE" W2_PLAN="$PLAN" W2_OUT="$OUT" npx vitest run --config "$W/vitest.records.config.mjs"
