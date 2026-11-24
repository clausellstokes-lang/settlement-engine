#!/bin/sh
# VEIL-53 unit (2), J1 (N107): tests/copy WHOLE on a tree, by name (JSON report), classed after by fails.mjs-style match against RED-AT-LINE.
# Run: cd <worktree> && sh scripts/gate-mutex.sh --run -- sh <this> <worktree> <outdir> <label>
W=$1; O=$2; T=$3; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
cd $W; echo "$T start $(date -u +%H:%M:%S) at $(git rev-parse --short HEAD)" >> $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/copy --reporter=default --reporter=json --outputFile=$O/$T.json > $O/$T.txt 2>&1
echo "$T rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
