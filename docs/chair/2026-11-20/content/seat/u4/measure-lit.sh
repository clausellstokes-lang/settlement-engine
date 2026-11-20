#!/bin/sh
# measure-lit.sh [<seat tip>] [--fortune <fortune commit>]
# MEASURE-LIT (brief docs/chair/2026-11-20/content/seat/briefs/MEASURE-LIT.md): the contest measured LIT. A MEASURE ONLY.
# Defaults: the seat tip is this checkout's HEAD; the fortune commit is c167b5f11.
#   Tree S  = `git archive <seat tip>`.
#   Tree SF = <seat tip> merged (`--no-commit --no-ff`) with <fortune> in a DETACHED scratch worktree under the temporary
#             directory; the six conflicts per the chair's joint reading (a) (measure-lit.mjs resolve), then copied out and
#             the worktree removed.
#   Each tree x three plant variants, each in its own copy: D (as committed), L1 (SEAT_CONTEST_LIT lit), LP (L1 + every
#   factor at its PROPOSED figure, read from the module's own declaration). The plant stops if its text is absent.
#   THE CALIBRATION RUNS FIRST (Arm 0 and seat+fortune D on the chair's 600 places); on a FAIL the run stops (exit 1)
#   and writes both tables to measure-lit.{md,json}. Otherwise seven arms x three pools, then measure-lit.{md,json}.
# It reads the repository only through `git archive`, `git rev-parse` and its own scratch worktree: never the checkout's
# working tree, index or branches. Every temporary (the worktree included) is removed at the end.
# Exit: 0 done, 1 the calibration failed, 2 a failure.
set -eu
usage() { echo "usage: measure-lit.sh [<seat tip>] [--fortune <fortune commit>]" >&2; exit 2; }
SEAT=; FORTUNE=c167b5f11
while [ $# -gt 0 ]; do
  case $1 in
    --fortune) [ $# -ge 2 ] || usage; FORTUNE=$2; shift 2 ;;
    -*) usage ;;
    *) [ -z "$SEAT" ] || usage; SEAT=$1; shift ;;
  esac
done
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY GIT_PREFIX; do
  eval "x=\${$v:-}"; [ -z "$x" ] || { echo "$v is set; unset it first" >&2; exit 2; }
done

ROOT=$(git rev-parse --show-toplevel)
HERE="$ROOT/docs/chair/2026-11-20/content/seat/u4"
MJS="$HERE/measure-lit.mjs"
[ -f "$MJS" ] || { echo "no $MJS" >&2; exit 2; }
[ -d "$ROOT/node_modules" ] || { echo "no node_modules in $ROOT" >&2; exit 2; }
SEAT_SHA=$(git -C "$ROOT" rev-parse --verify "${SEAT:-HEAD}^{commit}")
FORTUNE_SHA=$(git -C "$ROOT" rev-parse --verify "$FORTUNE^{commit}")

TMP=$(mktemp -d "${TMPDIR:-/tmp}/measure-lit.XXXXXX")
WT="$TMP/sf-worktree"
cleanup() {
  if [ -e "$WT" ]; then git -C "$ROOT" worktree remove --force "$WT" > /dev/null 2>&1 || echo "could not remove the scratch worktree $WT" >&2; fi
  rm -rf "$TMP"
}
trap cleanup EXIT
trap 'exit 2' INT TERM
ROWS="$TMP/rows"; mkdir "$ROWS"
echo "temporary directory: $TMP"
echo "seat tip (S): $SEAT_SHA; fortune: $FORTUNE_SHA"

# ── tree S ──
git -C "$ROOT" archive --format=tar -o "$TMP/S.tar" "$SEAT_SHA"
mkdir "$TMP/S-D"; tar -xf "$TMP/S.tar" -C "$TMP/S-D"; rm -f "$TMP/S.tar"
ln -s "$ROOT/node_modules" "$TMP/S-D/node_modules"

# ── tree SF: the scratch merge in a detached worktree ──
git -C "$ROOT" worktree add --detach "$WT" "$SEAT_SHA" > "$ROWS/worktree.log" 2>&1
set +e
git -C "$WT" -c merge.conflictStyle=merge merge --no-commit --no-ff "$FORTUNE_SHA" > "$ROWS/merge.log" 2>&1
MERGE_RC=$?
set -e
[ "$MERGE_RC" -eq 1 ] || { echo "the merge exited $MERGE_RC, expected 1 (the six conflicts)" >&2; cat "$ROWS/merge.log" >&2; exit 2; }
git -C "$WT" diff --name-only --diff-filter=U > "$ROWS/conflicts.txt"
printf '%s\n' docs/content/wiring-census.json src/domain/density/densityCreateBoundary.js \
  tests/lint/.lighting-census-baseline.json tests/lint/.tuning-inventory.json tests/lint/.tuning-register.json \
  tests/lint/densityCreateBoundary.walker.test.js > "$ROWS/conflicts.expected"
cmp -s "$ROWS/conflicts.txt" "$ROWS/conflicts.expected" || {
  echo "the conflicts are not the chair's six:" >&2; cat "$ROWS/conflicts.txt" >&2; exit 2; }
echo "merge: the chair's six conflicts"
node "$MJS" resolve "$WT"
node --check "$WT/src/domain/density/densityCreateBoundary.js"
node --check "$WT/tests/lint/densityCreateBoundary.walker.test.js"
if grep -n '^<<<<<<< \|^>>>>>>> ' "$WT/src/domain/density/densityCreateBoundary.js" "$WT/tests/lint/densityCreateBoundary.walker.test.js" > "$ROWS/left.txt"; then
  echo "markers left in a resolved file" >&2; exit 2; fi
echo "registers left with their markers (the chair's (a) 3-6; no src/ module reads them)"
mkdir "$TMP/SF-D"; cp -a "$WT/." "$TMP/SF-D/"; rm -f "$TMP/SF-D/.git"
git -C "$ROOT" worktree remove --force "$WT"
ln -s "$ROOT/node_modules" "$TMP/SF-D/node_modules"

# ── births: one arm per process, at most four at once ──
SEAT_LAW='{"_seatLawVersion":2}'
BOTH_LAWS='{"_seatLawVersion":2,"_fortuneLawVersion":2}'
PIDS=; FAILED=0
launch() { # <arm> <tree> <force json> <pools>
  (cd "$TMP/$2" && node "$MJS" birth . "$1" "$3" "$4" "$ROWS/$1.$4.jsonl") > "$ROWS/$1.$4.log" 2>&1 &
  PIDS="$PIDS $!"
}
waitall() { for p in $PIDS; do wait "$p" || FAILED=1; done; PIDS=; [ "$FAILED" -eq 0 ] || { echo "a birth run failed; logs:" >&2; cat "$ROWS"/*.log >&2; exit 2; }; }

# ── THE CALIBRATION FIRST ──
launch arm0 S-D '{}' chair600
launch both-D SF-D "$BOTH_LAWS" chair600
launch sfoff SF-D '{}' chair600
waitall
cat "$ROWS"/arm0.chair600.log "$ROWS"/both-D.chair600.log "$ROWS"/sfoff.chair600.log
set +e
node "$MJS" report "$ROWS" "$HERE" "$SEAT_SHA" "$FORTUNE_SHA" --calibration
CAL=$?
set -e
[ "$CAL" -eq 0 ] || { echo "CALIBRATION FAILED: STOPPED (both tables in $HERE/measure-lit.md)" >&2; exit 1; }

# ── the plants (each in its own copy) ──
for T in S SF; do for V in L1 LP; do
  cp -a "$TMP/$T-D" "$TMP/$T-$V"
  node "$MJS" plant "$TMP/$T-$V" "$V" > "$ROWS/plant-$T-$V.json"
  echo "plant $T-$V: $(cat "$ROWS/plant-$T-$V.json")"
done; done

# ── the seven arms over the three pools (arm 0 and both-D already hold chair600) ──
ALL=default,presets,chair600
launch arm0 S-D '{}' default,presets
launch both-D SF-D "$BOTH_LAWS" default,presets
launch seat-D S-D "$SEAT_LAW" "$ALL"
launch seat-L1 S-L1 "$SEAT_LAW" "$ALL"
waitall
launch seat-LP S-LP "$SEAT_LAW" "$ALL"
launch both-L1 SF-L1 "$BOTH_LAWS" "$ALL"
launch both-LP SF-LP "$BOTH_LAWS" "$ALL"
waitall
cat "$ROWS"/*.log
node "$MJS" report "$ROWS" "$HERE" "$SEAT_SHA" "$FORTUNE_SHA"
