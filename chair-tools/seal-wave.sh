#!/bin/sh
# seal-wave.sh <lane-tree> <base-sha> <tip-sha> <ref-name>
# Validates cleanliness + ancestry, then creates the preserve ref (asserting absence).
set -e
REPO=/Users/cstokes/Desktop/settlement-engine
TREE="$1"; BASE="$2"; TIP="$3"; REF="$4"
ACTUAL=$(git -C "$TREE" rev-parse HEAD)
if [ "$ACTUAL" != "$TIP" ]; then echo "ABORT: tree at $ACTUAL, expected $TIP"; exit 1; fi
DIRTY=$(git -C "$TREE" status --porcelain | grep -cv node_modules || true)
if [ "$DIRTY" != "0" ]; then echo "ABORT: $DIRTY dirty non-node_modules paths"; git -C "$TREE" status --porcelain | grep -v node_modules | head -5; exit 1; fi
cd "$REPO"
git merge-base --is-ancestor "$BASE" "$TIP" || { echo "ABORT: base not ancestor"; exit 1; }
git update-ref "refs/preserve/$REF" "$TIP" ""
echo "SEALED: refs/preserve/$REF = $TIP"
