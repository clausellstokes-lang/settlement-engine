#!/bin/bash
# SEAL THE KIT as a preserve ref in the ledger repo (the recipe of the 10-18/10-19 seals): a commit object over the kit's
# tree, parented on the previous seal, written to refs/preserve/<name>. The agent transcripts (logs/subagents-*) are
# EXCLUDED (130+ MB; they stay on disk). Usage: bash tools/seal-kit.sh <name> "<message>" [parent-ref]
# Never pushes. Never touches the working tree or the real index (a temporary index file is used).
set -u
KIT=/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17
REPO=/Users/cstokes/Desktop/settlement-engine
NAME="${1:?name}"; MSG="${2:?message}"; PARENT="${3:-refs/preserve/fp-final-kit-a73343ed-2026-10-19}"
IDX=$(mktemp /tmp/seal-idx.XXXXXX)
rm -f "$IDX"
export GIT_INDEX_FILE="$IDX"
cd "$KIT" || exit 9
git --git-dir="$REPO/.git" --work-tree="$KIT" add -A -- . ':(exclude)logs/subagents-*' ':(exclude)**/node_modules' >/dev/null 2>&1 || { echo "add failed"; exit 2; }
TREE=$(git --git-dir="$REPO/.git" write-tree) || { echo "write-tree failed"; exit 3; }
PARENT_SHA=$(git --git-dir="$REPO/.git" rev-parse --verify "$PARENT^{commit}") || { echo "parent not found: $PARENT"; exit 4; }
COMMIT=$(git --git-dir="$REPO/.git" commit-tree "$TREE" -p "$PARENT_SHA" -m "$MSG") || { echo "commit-tree failed"; exit 5; }
git --git-dir="$REPO/.git" update-ref "refs/preserve/$NAME" "$COMMIT" || { echo "update-ref failed"; exit 6; }
N=$(git --git-dir="$REPO/.git" ls-tree -r --name-only "$COMMIT" | wc -l | tr -d ' ')
unset GIT_INDEX_FILE; rm -f "$IDX"
echo "sealed refs/preserve/$NAME -> $COMMIT ($N files; parent $PARENT_SHA)"
