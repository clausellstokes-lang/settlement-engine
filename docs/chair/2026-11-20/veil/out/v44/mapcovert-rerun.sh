#!/bin/sh
# VEIL-44: the seat's re-run of MAPCOVERT-RED's red (the test file at the builder's tip). sh mapcovert-rerun.sh <tree> <log>
cd "$1" && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
  npx vitest run tests/security/galleryMapCovert.pglite.test.js > "$2" 2>&1
echo "EXIT $? tree $(git -C "$1" rev-parse --short HEAD) $(date -u +%H:%M:%S)" >> "$2"
