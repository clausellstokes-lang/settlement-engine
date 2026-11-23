#!/bin/sh
# VEIL-44: tests/lint WHOLE on a tree (COMMON-EIGHTH 11: re-run at every merge). sh lint-whole.sh <tree> <log>
cd "$1" && git fetch -q origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 FETCH_HEAD >/dev/null 2>&1
env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE \
  npx vitest run tests/lint > "$2" 2>&1
echo "EXIT $? tree $(git -C "$1" rev-parse --short HEAD) $(date -u +%H:%M:%S)" >> "$2"
