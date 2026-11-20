#!/bin/sh
# count.sh <tree>/src/ <outdir> [ENV=VAL ...] : births the calm pool at the tree and prints CF11's count by size.
# Wraps B2's pool.mjs and cf11weight.mjs, extracted verbatim from frame2/B2-WEIGHT-RESULTS.md ("The scripts").
set -e
D=$(cd "$(dirname "$0")" && pwd); SRC="$1"; OUT="$2"; shift 2
mkdir -p "$OUT"
env "$@" node "$D/pool.mjs" 55 "$OUT/pool.json" "$SRC" > "$OUT/pool.log" 2>&1
env "$@" node "$D/cf11weight.mjs" "$OUT/pool.json" "$SRC" > "$OUT/count.md" 2>"$OUT/count.err"
cat "$OUT/pool.log"
