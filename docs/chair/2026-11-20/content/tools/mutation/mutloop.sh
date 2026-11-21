#!/bin/sh
# NAMES-4 (2026-11-20): swap each two-form site (a power's agreeing pair) one at a time in a SCRATCH tree and run the given
# tests; a mutant no test reds is a SURVIVOR. Never run it on the checkout: it writes the tree's src.
# usage: sh mutloop.sh <scratch-tree (a git archive with node_modules linked)> <results-file> <test file>...
# The tree's pristine src is restored from <tree>/.pristine-src (made on the first run) after every mutant and at the end.
HERE=$(cd "$(dirname "$0")" && pwd); TREE=$1; OUT=$2; shift 2
[ -d "$TREE/.pristine-src" ] || cp -r "$TREE/src" "$TREE/.pristine-src"
N=$(node "$HERE/mutate.mjs" "$TREE" list | wc -l); : > "$OUT"; cd "$TREE" || exit 2
for id in $(seq 0 $((N-1))); do
  rm -rf "$TREE/src" && cp -r "$TREE/.pristine-src" "$TREE/src"
  site=$(node "$HERE/mutate.mjs" "$TREE" list | sed -n "$((id+1))p")
  node "$HERE/mutate.mjs" "$TREE" apply "$id" > /dev/null
  npx vitest run "$@" > "$OUT.last.log" 2>&1; rc=$?
  if [ $rc -eq 0 ]; then echo "SURVIVED $site" >> "$OUT"; else echo "killed $site" >> "$OUT"; fi
done
rm -rf "$TREE/src" && cp -r "$TREE/.pristine-src" "$TREE/src"
echo "DONE $(grep -c '^killed' "$OUT") killed, $(grep -c '^SURVIVED' "$OUT") survived of $N" >> "$OUT"
