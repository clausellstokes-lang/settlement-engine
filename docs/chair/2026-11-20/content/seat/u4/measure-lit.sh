#!/bin/sh
# measure-lit.sh [<seat tip>] [--fortune <fortune commit>] [--cal-seat <commit>] [--cal-fortune <commit>]
# MEASURE-LIT (brief docs/chair/2026-11-20/content/seat/briefs/MEASURE-LIT.md): the contest measured LIT. A MEASURE ONLY.
# Extended by MEASURE-VISITOR (brief ../briefs/MEASURE-VISITOR.md, builder BMV, SEAT-6): the visitor's pool (the
# headline), the fortune tree at 1cd2e6d93, the cause arm (pool A with random road and threat), the calibration kept
# first at MEASURE-LIT's own commits.
# Defaults: the seat tip is this checkout's HEAD; the fortune commit is 1cd2e6d93; the calibration's commits are
# MEASURE-LIT's own, c4df8a027 (seat) and c167b5f11 (fortune).
#   Tree S     = `git archive <seat tip>`.          Tree Scal  = `git archive <cal seat>`.
#   Tree SF    = <seat tip> merged (`--no-commit --no-ff`) with <fortune>, and tree SFcal = <cal seat> merged with
#                <cal fortune>, each in a DETACHED scratch worktree under the temporary directory; the six conflicts
#                per the chair's joint reading (a) (measure-lit.mjs resolve; any other conflict set STOPS the run),
#                then copied out and the worktree removed.
#   S and SF x three plant variants, each in its own copy: D (as committed), L1 (SEAT_CONTEST_LIT lit), LP (L1 + every
#   factor at its PROPOSED figure, read from the module's own declaration). The plant stops if its text is absent.
#   THE CALIBRATION RUNS FIRST (Arm 0 on Scal and seat+fortune D on SFcal, the chair's 600 places); on a FAIL the run
#   stops (exit 1) and writes both tables to measure-lit.{md,json}. Otherwise seven arms x four pools (visitor,
#   chair600, default, cause), the fortune-off sanity (SF with no law forced), then measure-lit.{md,json}.
# It reads the repository only through `git archive`, `git rev-parse`, `git diff --quiet` and its own scratch worktrees:
# never the checkout's working tree, index or branches. Every temporary (the worktrees included) is removed at the end.
# Exit: 0 done, 1 the calibration failed, 2 a failure.
set -eu
usage() { echo "usage: measure-lit.sh [<seat tip>] [--fortune <fortune commit>] [--cal-seat <commit>] [--cal-fortune <commit>]" >&2; exit 2; }
SEAT=; FORTUNE=1cd2e6d93; CAL_SEAT=c4df8a027; CAL_FORTUNE=c167b5f11
while [ $# -gt 0 ]; do
  case $1 in
    --fortune) [ $# -ge 2 ] || usage; FORTUNE=$2; shift 2 ;;
    --cal-seat) [ $# -ge 2 ] || usage; CAL_SEAT=$2; shift 2 ;;
    --cal-fortune) [ $# -ge 2 ] || usage; CAL_FORTUNE=$2; shift 2 ;;
    -*) usage ;;
    *) [ -z "$SEAT" ] || usage; SEAT=$1; shift ;;
  esac
done
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY GIT_PREFIX; do
  eval "x=\${$v:-}"; [ -z "$x" ] || { echo "$v is set; unset it first" >&2; exit 2; }
done

T0=$(date +%s)
ROOT=$(git rev-parse --show-toplevel)
HERE="$ROOT/docs/chair/2026-11-20/content/seat/u4"
MJS="$HERE/measure-lit.mjs"
[ -f "$MJS" ] || { echo "no $MJS" >&2; exit 2; }
[ -d "$ROOT/node_modules" ] || { echo "no node_modules in $ROOT" >&2; exit 2; }
SEAT_SHA=$(git -C "$ROOT" rev-parse --verify "${SEAT:-HEAD}^{commit}")
FORTUNE_SHA=$(git -C "$ROOT" rev-parse --verify "$FORTUNE^{commit}")
CAL_SEAT_SHA=$(git -C "$ROOT" rev-parse --verify "$CAL_SEAT^{commit}")
CAL_FORTUNE_SHA=$(git -C "$ROOT" rev-parse --verify "$CAL_FORTUNE^{commit}")

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
echo "seat tip (S): $SEAT_SHA; fortune: $FORTUNE_SHA; calibration at $CAL_SEAT_SHA + $CAL_FORTUNE_SHA"

# ── trees S and Scal ──
archive_tree() { # <commit> <dir>
  git -C "$ROOT" archive --format=tar -o "$TMP/a.tar" "$1"
  mkdir "$TMP/$2"; tar -xf "$TMP/a.tar" -C "$TMP/$2"; rm -f "$TMP/a.tar"
  ln -s "$ROOT/node_modules" "$TMP/$2/node_modules"
}
archive_tree "$SEAT_SHA" S-D
archive_tree "$CAL_SEAT_SHA" Scal-D
if git -C "$ROOT" diff --quiet "$CAL_SEAT_SHA" "$SEAT_SHA" -- src; then echo "src/ at the calibration's seat = src/ at the seat tip"; else echo "src/ at the calibration's seat DIFFERS from the seat tip's (the calibration still reads its own tree)"; fi

# ── trees SF and SFcal: the scratch merges in a detached worktree ──
merge_tree() { # <seat sha> <fortune sha> <dir>
  git -C "$ROOT" worktree add --detach "$WT" "$1" > "$ROWS/worktree-$3.log" 2>&1
  set +e
  git -C "$WT" -c merge.conflictStyle=merge merge --no-commit --no-ff "$2" > "$ROWS/merge-$3.log" 2>&1
  MERGE_RC=$?
  set -e
  [ "$MERGE_RC" -eq 1 ] || { echo "$3: the merge exited $MERGE_RC, expected 1 (the six conflicts)" >&2; cat "$ROWS/merge-$3.log" >&2; exit 2; }
  git -C "$WT" diff --name-only --diff-filter=U > "$ROWS/conflicts-$3.txt"
  printf '%s\n' docs/content/wiring-census.json src/domain/density/densityCreateBoundary.js \
    tests/lint/.lighting-census-baseline.json tests/lint/.tuning-inventory.json tests/lint/.tuning-register.json \
    tests/lint/densityCreateBoundary.walker.test.js > "$ROWS/conflicts.expected"
  cmp -s "$ROWS/conflicts-$3.txt" "$ROWS/conflicts.expected" || {
    echo "$3: the conflicts are not the chair's six (MEASURE-LIT's recipe does not cover them): STOPPED" >&2; cat "$ROWS/conflicts-$3.txt" >&2; exit 2; }
  echo "merge $3: the chair's six conflicts"
  node "$MJS" resolve "$WT"
  node --check "$WT/src/domain/density/densityCreateBoundary.js"
  node --check "$WT/tests/lint/densityCreateBoundary.walker.test.js"
  if grep -n '^<<<<<<< \|^>>>>>>> ' "$WT/src/domain/density/densityCreateBoundary.js" "$WT/tests/lint/densityCreateBoundary.walker.test.js" > "$ROWS/left-$3.txt"; then
    echo "$3: markers left in a resolved file" >&2; exit 2; fi
  if grep -rln '^<<<<<<< ' "$WT/src" > "$ROWS/src-markers-$3.txt"; then echo "$3: conflict markers under src/" >&2; cat "$ROWS/src-markers-$3.txt" >&2; exit 2; fi
  echo "merge $3: registers left with their markers (the chair's (a) 3-6; no src/ module reads them)"
  mkdir "$TMP/$3"; cp -a "$WT/." "$TMP/$3/"; rm -f "$TMP/$3/.git"
  git -C "$ROOT" worktree remove --force "$WT"
  ln -s "$ROOT/node_modules" "$TMP/$3/node_modules"
}
merge_tree "$CAL_SEAT_SHA" "$CAL_FORTUNE_SHA" SFcal-D
merge_tree "$SEAT_SHA" "$FORTUNE_SHA" SF-D

# ── births: one job per line (<arm> <tree> <force json> <pools>), at most four at once ──
SEAT_LAW='{"_seatLawVersion":2}'
BOTH_LAWS='{"_seatLawVersion":2,"_fortuneLawVersion":2}'
JOBS="$TMP/jobs"
job() { printf '%s\t%s\t%s\t%s\n' "$1" "$2" "$3" "$4" >> "$JOBS"; }
runjobs() {
  set +e
  # each job's four fields follow the three fixed arguments: $0 temp dir, $1 the .mjs, $2 rows dir; $3 arm, $4 tree,
  # $5 force json, $6 pools.  shellcheck disable=SC2016
  tr '\t' '\n' < "$JOBS" | xargs -d '\n' -n 4 -P 4 sh -c 'cd "$0/$4" && node "$1" birth . "$3" "$5" "$6" "$2/$3.$6.jsonl" > "$2/$3.$6.log" 2>&1' "$TMP" "$MJS" "$ROWS"
  RC=$?
  set -e
  rm -f "$JOBS"
  [ "$RC" -eq 0 ] || { echo "a birth run failed (xargs $RC); logs:" >&2; tail -n 5 "$ROWS"/*.log >&2; exit 2; }
}

# ── THE CALIBRATION FIRST (at MEASURE-LIT's commits) ──
job arm0-cal Scal-D '{}' chair600
job both-D-cal SFcal-D "$BOTH_LAWS" chair600
job sfoff-cal SFcal-D '{}' chair600
runjobs
cat "$ROWS"/arm0-cal.chair600.log "$ROWS"/both-D-cal.chair600.log "$ROWS"/sfoff-cal.chair600.log
set +e
node "$MJS" report "$ROWS" "$HERE" "$SEAT_SHA" "$FORTUNE_SHA" "$CAL_SEAT_SHA" "$CAL_FORTUNE_SHA" --calibration
CAL=$?
set -e
[ "$CAL" -eq 0 ] || { echo "CALIBRATION FAILED: STOPPED (both tables in $HERE/measure-lit.md)" >&2; exit 1; }
rm -rf "$TMP/Scal-D" "$TMP/SFcal-D"

# ── the plants (each in its own copy) ──
for T in S SF; do for V in L1 LP; do
  cp -a "$TMP/$T-D" "$TMP/$T-$V"
  node "$MJS" plant "$TMP/$T-$V" "$V" > "$ROWS/plant-$T-$V.json"
  echo "plant $T-$V: $(cat "$ROWS/plant-$T-$V.json")"
done; done

# ── the seven arms over the four pools (one job an arm a pool), and the fortune-off sanity ──
for P in visitor chair600 default cause; do
  job arm0 S-D '{}' "$P"
  for V in D L1 LP; do
    job "seat-$V" "S-$V" "$SEAT_LAW" "$P"
    job "both-$V" "SF-$V" "$BOTH_LAWS" "$P"
  done
done
job sfoff SF-D '{}' chair600
job sfoff SF-D '{}' visitor
runjobs
grep -h ' places, lit ' "$ROWS"/*.log
node "$MJS" report "$ROWS" "$HERE" "$SEAT_SHA" "$FORTUNE_SHA" "$CAL_SEAT_SHA" "$CAL_FORTUNE_SHA"
echo "run time: $(( $(date +%s) - T0 )) s"
