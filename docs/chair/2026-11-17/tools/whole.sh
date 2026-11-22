#!/bin/sh
# whole.sh — THE WHOLE CHECK IN STEPS, RESUMABLE, EVERY EXIT CODE KEPT (the sixth chair, 2026-11-17).
#
# Why: `npm run check` is one && chain, so the first red hides every step behind it, and the working line carries
# stored-figure reds by design until the close. This runs every step of that chain on its own, keeps each step's log
# and exit code, and writes the failing tests BY NAME so two trees can be compared by name (never by count).
#
# Usage:  sh whole.sh <worktree> <outdir> [vitest shard count, default 1] [parts, default all]
#   A step whose <outdir>/<step>.exit exists is skipped (after a restart, run the same line again).
#   Run it DIRECTLY as a background command. One run at a time on a machine.
#   PARTS (so that several machines share ONE whole check; the union of their names.txt is the check's): a quoted,
#   space-separated list of `pre` (the validators, both type gates, lint, the two doors), `s:<i>` (vitest shard i of
#   the count) and `build` (the build and tests/build), e.g.  sh whole.sh <wt> <out> 6 "pre s:1 s:2".
#   The shard COUNT must be the same on every machine of one check.
#
# Reads:  <outdir>/summary.tsv (step, exit, seconds) · <outdir>/names.txt (every failing test and every file that
#         failed to load, one per line, sorted) · <outdir>/counts.txt
set -u
WT="$1"; OUT="$2"; SHARDS="${3:-1}"; PARTS="${4:-all}"
want() { [ "$PARTS" = all ] && return 0; case " $PARTS " in *" $1 "*) return 0 ;; esac; return 1; }
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
if want pre; then
  for v in hazard-registry premortem packets data custom-content-manifest migration-head edge map tuning-bands foundry-module mcp-server; do
    step "validate-$v" npm run "validate:$v"
  done
  step typecheck-ratchet npm run typecheck:ratchet
  step typecheck-strict npm run typecheck:domain:strict
  step lint npx eslint src/ tests/ scripts/
  step door-classes node scripts/presumption-classes-door.mjs --check
  step door-things node scripts/presumed-things-door.mjs --check
fi
i=1
while [ "$i" -le "$SHARDS" ]; do
  if want "s:$i"; then
    step "vitest-$i-of-$SHARDS" npx vitest run --exclude='tests/build/**' --shard="$i/$SHARDS" --reporter=json --outputFile="$OUT/vitest-$i-of-$SHARDS.json"
  fi
  i=$((i + 1))
done
if want build; then
  # THE DIST PHASE AS `npm run verify:dist` RUNS IT (scripts/check-test-ratchet.mjs --verify-dist: remoteDistBuildCommandOf and
  # the runner's env): the plain build, THE FLAGGED BUILD (the artifact that ships), then tests/build with VERIFY_DIST=1
  # and VERIFY_ENGINE_REMOTE_DIST=1, so the arms that read the built files (the size ceilings among them) RUN instead of
  # skipping. Until 2026-11-17 19:10 UTC this step ran tests/build with neither variable: a check made before that hour
  # did not read the dist (its vitest-build names are the source-only arms).
  step build npm run build
  step build-remote env VITE_ENGINE_REMOTE=true NODE_OPTIONS=--max-old-space-size=4096 npx vite build --outDir node_modules/.cache/engine-remote-dist --emptyOutDir
  step vitest-dist env VERIFY_DIST=1 VERIFY_ENGINE_REMOTE_DIST=1 npx vitest run tests/build/ --reporter=json --outputFile="$OUT/vitest-dist.json"
fi
if ls "$OUT"/vitest-*.json >/dev/null 2>&1; then
  node "$HERE/failnames.mjs" "$OUT"/vitest-*.json > "$OUT/names.txt" 2> "$OUT/counts.txt"
else
  : > "$OUT/names.txt"; echo "no vitest step in this part" > "$OUT/counts.txt"
fi
echo "DONE $(date -u +%Y-%m-%dT%H:%M:%SZ) parts=$PARTS" >> "$OUT/summary.tsv"
