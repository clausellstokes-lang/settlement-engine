#!/bin/sh
# whole.sh — THE WHOLE CHECK IN STEPS, RESUMABLE, EVERY EXIT CODE KEPT (the sixth chair, 2026-11-17).
#
# Why: `npm run check` is one && chain, so the first red hides every step behind it, and the working line carries
# stored-figure reds by design until the close. This runs every step of that chain on its own, keeps each step's log
# and exit code, and writes the failing tests BY NAME so two trees can be compared by name (never by count).
#
# Usage:  sh whole.sh <worktree> <outdir> [vitest shard count, default 1]
#   A step whose <outdir>/<step>.exit exists is skipped (after a restart, run the same line again).
#   Run it DIRECTLY as a background command. One run at a time on a machine.
#
# Reads:  <outdir>/summary.tsv (step, exit, seconds) · <outdir>/names.txt (every failing test and every file that
#         failed to load, one per line, sorted) · <outdir>/counts.txt
set -u
WT="$1"; OUT="$2"; SHARDS="${3:-1}"
HERE="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$OUT"
cd "$WT" || exit 2
git rev-parse HEAD > "$OUT/head.txt"; git rev-parse HEAD:src > "$OUT/tree.src.txt"; git rev-parse HEAD:tests > "$OUT/tree.tests.txt"
step() { # step <name> <command...>
  name="$1"; shift
  if [ -f "$OUT/$name.exit" ]; then return 0; fi
  t0=$(date +%s)
  "$@" > "$OUT/$name.log" 2>&1
  code=$?
  echo "$code" > "$OUT/$name.exit"
  printf '%s\t%s\t%s\n' "$name" "$code" "$(( $(date +%s) - t0 ))" >> "$OUT/summary.tsv"
}
for v in hazard-registry premortem packets data custom-content-manifest migration-head edge map tuning-bands foundry-module mcp-server; do
  step "validate-$v" npm run "validate:$v"
done
step typecheck-ratchet npm run typecheck:ratchet
step typecheck-strict npm run typecheck:domain:strict
step lint npx eslint src/ tests/ scripts/
step door-classes node scripts/presumption-classes-door.mjs --check
step door-things node scripts/presumed-things-door.mjs --check
i=1
while [ "$i" -le "$SHARDS" ]; do
  step "vitest-$i-of-$SHARDS" npx vitest run --exclude='tests/build/**' --shard="$i/$SHARDS" --reporter=json --outputFile="$OUT/vitest-$i-of-$SHARDS.json"
  i=$((i + 1))
done
step build npm run build
step vitest-build npx vitest run tests/build/ --reporter=json --outputFile="$OUT/vitest-build.json"
node "$HERE/failnames.mjs" "$OUT"/vitest-*.json > "$OUT/names.txt" 2> "$OUT/counts.txt"
echo "DONE $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$OUT/summary.tsv"
