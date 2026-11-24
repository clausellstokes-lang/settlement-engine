#!/bin/sh
# VEIL-53 unit (1) REDS-CAUSE: the six red files on the trial join, by name (JSON report).
# Run: sh scripts/gate-mutex.sh --run -- sh <this> <worktree> <outdir>
W=${1:-/home/user/join53}; O=${2:-/var/tmp/v53/six}; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
cd $W; echo "start $(date -u +%H:%M:%S) at $(git rev-parse --short HEAD)" > $O/done.txt
$E sh scripts/gate-tail.sh npx vitest run tests/generators/fortuneLawMerits.test.js tests/domain/fortuneLastingSentence.test.js tests/domain/display/tensionCause.test.js tests/security/traditionDescriptionSharedPage.test.js tests/lint/recentConflictReaders.walker.test.js tests/security/rosterChoiceInversion.pglite.test.js --reporter=default --reporter=json --outputFile=$O/six.json > $O/six.txt 2>&1
echo "six rc=$? $(date -u +%H:%M:%S)" >> $O/done.txt
