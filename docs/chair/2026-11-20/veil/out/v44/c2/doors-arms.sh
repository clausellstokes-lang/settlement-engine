#!/bin/sh
# VEIL-44 (c2): THE DOORS' OWN ARMS (the five test files doors-3 adds or changes, 04704a660^..3e1115c81) on a tree.
#   sh doors-arms.sh <tree> <log>    (run through scripts/gate-mutex.sh --run; read the log's summary and its EXIT line)
T=$1; L=$2
cd "$T" && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
  npx vitest run --maxWorkers=2 tests/security/galleryDoors.pglite.test.js tests/security/galleryDoors.walker.test.js \
  tests/security/galleryMapMemberCount.pglite.test.js tests/security/galleryServerVeil.pglite.test.js \
  tests/security/galleryWorldShare.pglite.test.jsx > "$L" 2>&1
echo "EXIT $? tree $(git -C "$T" rev-parse --short HEAD) $(date -u +%H:%M:%S)" >> "$L"
