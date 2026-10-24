#!/bin/bash
# SEAL THE KIT as a preserve ref in the ledger repo (the recipe of the 10-18/10-19 seals): a commit object over the kit's
# tree, parented on the previous seal, written to refs/preserve/<name>. The agent transcripts (logs/subagents-*) are
# EXCLUDED (130+ MB; they stay on disk), and so are the probes' byte copies of the code of record (`*-probe/cor/`, `*-probe/mcr/`:
# master's src/ copied for a probe to import, re-creatable from the sha the probe names). Usage: bash tools/seal-kit.sh <name> "<message>" [parent-ref]
# Never pushes. Never touches the working tree or the real index (a temporary index file is used).
set -u
# KIT and REPO may be set in the environment (a cloud session: KIT=<the kit folder> REPO=<a checkout of the repo>).
KIT="${KIT:-/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17}"
REPO="${REPO:-/Users/cstokes/Desktop/settlement-engine}"
NAME="${1:?name}"; MSG="${2:?message}"; PARENT="${3:-refs/preserve/fp-final-kit-a73343ed-2026-10-19}"
GITDIR=$(git -C "$REPO" rev-parse --git-common-dir) || { echo "not a repo: $REPO"; exit 8; }
case "$GITDIR" in /*) ;; *) GITDIR="$REPO/$GITDIR";; esac
IDX=$(mktemp "${TMPDIR:-/tmp}/seal-idx.XXXXXX")
rm -f "$IDX"
export GIT_INDEX_FILE="$IDX"
cd "$KIT" || exit 9
git --git-dir="$GITDIR" --work-tree="$KIT" add -A -- . ':(exclude)logs/subagents-*' ':(exclude)**/node_modules' ':(exclude,glob)**/*-probe/cor/**' ':(exclude,glob)**/*-probe/mcr/**' >/dev/null 2>&1 || { echo "add failed"; exit 2; }
TREE=$(git --git-dir="$GITDIR" write-tree) || { echo "write-tree failed"; exit 3; }
PARENT_SHA=$(git --git-dir="$GITDIR" rev-parse --verify "$PARENT^{commit}") || { echo "parent not found: $PARENT"; exit 4; }
COMMIT=$(git --git-dir="$GITDIR" commit-tree "$TREE" -p "$PARENT_SHA" -m "$MSG") || { echo "commit-tree failed"; exit 5; }
git --git-dir="$GITDIR" update-ref "refs/preserve/$NAME" "$COMMIT" || { echo "update-ref failed"; exit 6; }
N=$(git --git-dir="$GITDIR" ls-tree -r --name-only "$COMMIT" | wc -l | tr -d ' ')
unset GIT_INDEX_FILE; rm -f "$IDX"
echo "sealed refs/preserve/$NAME -> $COMMIT ($N files; parent $PARENT_SHA)"
