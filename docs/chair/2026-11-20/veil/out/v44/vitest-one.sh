#!/bin/sh
# VEIL-44: one test file on a tree, the seat's re-run. sh vitest-one.sh <tree> <test file> <log>
cd "$1" && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
  npx vitest run "$2" > "$3" 2>&1
echo "EXIT $? tree $(git -C "$1" rev-parse --short HEAD) $(date -u +%H:%M:%S)" >> "$3"
