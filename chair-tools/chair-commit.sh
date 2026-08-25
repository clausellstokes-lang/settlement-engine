#!/bin/sh
# chair-commit.sh <expected-tip> <message-file> [extra-file:repo-path ...]
# Private-index ledger commit: always includes docs/OWNER_DECISION_QUEUE.md from the
# working tree; extra args map a source file into the tree as src:repo/path.
set -e
REPO=/Users/cstokes/Desktop/settlement-engine
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad
EXPECT="$1"; MSGFILE="$2"; shift 2
cd "$REPO"
OLD=$(git rev-parse refs/heads/review-fixes-2026-07-08)
if [ "$OLD" != "$EXPECT" ]; then echo "ABORT: tip moved: $OLD (expected $EXPECT)"; exit 1; fi
export GIT_INDEX_FILE="$SP/chair-tools/commit.index"
rm -f "$GIT_INDEX_FILE"
git read-tree "$OLD"
H=$(git hash-object -w docs/OWNER_DECISION_QUEUE.md)
git update-index --cacheinfo "100644,$H,docs/OWNER_DECISION_QUEUE.md"
for PAIR in "$@"; do
  SRC="${PAIR%%:*}"; DST="${PAIR#*:}"
  HX=$(git hash-object -w "$SRC")
  git update-index --add --cacheinfo "100644,$HX,$DST"
done
TREE=$(git write-tree)
NEW=$(git commit-tree "$TREE" -p "$OLD" -F "$MSGFILE")
git update-ref refs/heads/review-fixes-2026-07-08 "$NEW" "$OLD"
unset GIT_INDEX_FILE
echo "LEDGER COMMIT: $NEW"
echo "COMMIT_OK"
