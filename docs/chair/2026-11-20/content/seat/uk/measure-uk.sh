#!/bin/sh
# measure-uk.sh [<seat tip>] [--fold <commit>] [--cal-base <commit>] [--trial-scripts <commit>]
# MEASURE-UK (brief docs/chair/2026-11-20/content/seat/briefs/MEASURE-UK.md, builder BUK, SEAT-6): the corrected keyword
# of `npcGenerator.js :: powerBandOfRole` MEASURED before any build. A MEASURE ONLY.
# Defaults: the seat tip is this checkout's HEAD; the fold is f4a434660 (origin/lane/page-3-2026-11-20-k-wip); the
# calibration's base is the trial's, 6b82c8e4a; the trial scripts (k300.mjs, kRoles.mjs) are read from b2f8fe25e.
#   Tree S    = `git archive <seat tip>`.
#   Tree SK   = S with `git diff <fold>^ <fold> -- src/generators/npcGenerator.js` applied (verbatim: the two lines).
#   Tree SKW  = SK with the Wealthiest Merchant arm planted (measure-uk.mjs plant: the stem 'wealthiest merchant' in
#               MID_POWER beside 'wealthy_merchant'; a SEPARATE proposal).
#   THE CALIBRATION RUNS FIRST: k300.mjs (verbatim) on `git archive <cal base>`, on `git archive <fold>` and on the
#   fold + the arm (PAGE-2's 300 towns each); kRoles.mjs (verbatim) on the fold with the base's census; measure-uk.mjs
#   calibrate pairs the cards by id and checks the trial's role counts. On a FAIL the run stops (exit 1) and writes the
#   calibration's table to uk.{md,json}. Then 3 trees x 2 pools (visitor, chair600) x 6 sizes, every birth with
#   `_seatLawVersion: 2` forced, at most four at once; then uk.{md,json}.
# It reads the repository only through `git archive`, `git diff`, `git show` and `git rev-parse`: never the checkout's
# working tree, index or branches. Every temporary is removed at the end. Exit: 0 done, 1 the calibration failed, 2 a failure.
set -eu
usage() { echo "usage: measure-uk.sh [<seat tip>] [--fold <commit>] [--cal-base <commit>] [--trial-scripts <commit>]" >&2; exit 2; }
SEAT=; FOLD=f4a434660; CAL_BASE=6b82c8e4a; TRIAL=b2f8fe25e
while [ $# -gt 0 ]; do
  case $1 in
    --fold) [ $# -ge 2 ] || usage; FOLD=$2; shift 2 ;;
    --cal-base) [ $# -ge 2 ] || usage; CAL_BASE=$2; shift 2 ;;
    --trial-scripts) [ $# -ge 2 ] || usage; TRIAL=$2; shift 2 ;;
    -*) usage ;;
    *) [ -z "$SEAT" ] || usage; SEAT=$1; shift ;;
  esac
done
for v in GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_OBJECT_DIRECTORY GIT_PREFIX; do
  eval "x=\${$v:-}"; [ -z "$x" ] || { echo "$v is set; unset it first" >&2; exit 2; }
done

T0=$(date +%s)
ROOT=$(git rev-parse --show-toplevel)
HERE="$ROOT/docs/chair/2026-11-20/content/seat/uk"
MJS="$HERE/measure-uk.mjs"
[ -f "$MJS" ] || { echo "no $MJS" >&2; exit 2; }
[ -d "$ROOT/node_modules" ] || { echo "no node_modules in $ROOT" >&2; exit 2; }
SEAT_SHA=$(git -C "$ROOT" rev-parse --verify "${SEAT:-HEAD}^{commit}")
FOLD_SHA=$(git -C "$ROOT" rev-parse --verify "$FOLD^{commit}")
CAL_SHA=$(git -C "$ROOT" rev-parse --verify "$CAL_BASE^{commit}")
TRIAL_SHA=$(git -C "$ROOT" rev-parse --verify "$TRIAL^{commit}")

TMP=$(mktemp -d "${TMPDIR:-/tmp}/measure-uk.XXXXXX")
trap 'rm -rf "$TMP"' EXIT
trap 'exit 2' INT TERM
ROWS="$TMP/rows"; mkdir "$ROWS"
echo "temporary directory: $TMP"
echo "seat tip (S): $SEAT_SHA; fold: $FOLD_SHA; calibration base: $CAL_SHA; trial scripts: $TRIAL_SHA"

archive_tree() { # <commit> <dir>
  git -C "$ROOT" archive --format=tar -o "$TMP/a.tar" "$1"
  mkdir "$TMP/$2"; tar -xf "$TMP/a.tar" -C "$TMP/$2"; rm -f "$TMP/a.tar"
  ln -s "$ROOT/node_modules" "$TMP/$2/node_modules"
}

# ── THE CALIBRATION FIRST (the trial's own corpus, its own scripts) ──
archive_tree "$CAL_SHA" CALB
archive_tree "$FOLD_SHA" CALK
cp -a "$TMP/CALK" "$TMP/CALKW"
node "$MJS" plant "$TMP/CALKW" > "$ROWS/plant-CALKW.json"
mkdir "$TMP/trial"
P=docs/chair/2026-11-20/content/page/measures/page-3
git -C "$ROOT" show "$TRIAL_SHA:$P/k300.mjs" > "$TMP/trial/k300.mjs"
git -C "$ROOT" show "$TRIAL_SHA:$P/kRoles.mjs" > "$TMP/trial/kRoles.mjs"
set +e
for T in CALB CALK CALKW; do node "$TMP/trial/k300.mjs" "$TMP/$T" "$TMP/k300-$T.json" > "$ROWS/k300-$T.log" 2>&1 & done
wait
set -e
for T in CALB CALK CALKW; do echo "k300 on $T: $(cat "$ROWS/k300-$T.log")"; [ -s "$TMP/k300-$T.json" ] || { echo "k300 on $T failed" >&2; exit 2; }; done
node "$TMP/trial/kRoles.mjs" "$TMP/CALK" "$TMP/k300-CALB.json" > "$TMP/kroles-cal.txt"
cat "$TMP/kroles-cal.txt"
set +e
node "$MJS" calibrate "$TMP/k300-CALB.json" "$TMP/k300-CALK.json" "$TMP/k300-CALKW.json" "$TMP/kroles-cal.txt" "$HERE" "$T0" > "$ROWS/calibration.json"
CAL=$?
set -e
cat "$ROWS/calibration.json"
[ "$CAL" -eq 0 ] || { echo "CALIBRATION FAILED: STOPPED (the trial's role counts do not reproduce on its own corpus; the table in $HERE/uk.md)" >&2; exit 1; }
echo "CALIBRATION PASSES"
cp "$TMP/k300-CALB.json" "$TMP/k300.json"
rm -rf "$TMP/CALB" "$TMP/CALK" "$TMP/CALKW"

# ── trees S, SK, SKW ──
archive_tree "$SEAT_SHA" S
if git -C "$ROOT" diff --quiet "$CAL_SHA" "$SEAT_SHA" -- src/generators/npcGenerator.js; then echo "npcGenerator.js at S = at the trial's base"; else echo "npcGenerator.js at S differs from the trial's base (the fold's hunk is applied by git apply, which refuses a hunk that does not fit)"; fi
cp -a "$TMP/S" "$TMP/SK"
git -C "$ROOT" diff "$FOLD_SHA^" "$FOLD_SHA" -- src/generators/npcGenerator.js > "$TMP/fold.patch"
(cd "$TMP/SK" && git apply --whitespace=nowarn "$TMP/fold.patch")
FOLD_LINES=$(grep -c "fold(kw)\|const fold = s => String(s || '').toLowerCase().replace(/_/g, ' ')" "$TMP/SK/src/generators/npcGenerator.js")
[ "$FOLD_LINES" -eq 2 ] || { echo "SK: the fold's two lines are not in the tree ($FOLD_LINES)" >&2; exit 2; }
git -C "$ROOT" show "$FOLD_SHA:src/generators/npcGenerator.js" | grep "const fold = s =>\|fold(kw)" > "$TMP/fold-want.txt"
grep "const fold = s =>\|fold(kw)" "$TMP/SK/src/generators/npcGenerator.js" > "$TMP/fold-got.txt"
cmp -s "$TMP/fold-want.txt" "$TMP/fold-got.txt" || { echo "SK: the fold's lines differ from $FOLD_SHA's" >&2; exit 2; }
echo "SK: the fold's two lines equal $FOLD_SHA's, byte for byte; diff S..SK: $(diff "$TMP/S/src/generators/npcGenerator.js" "$TMP/SK/src/generators/npcGenerator.js" | grep -c '^[<>]') lines" > "$ROWS/fold-SK.txt"
cat "$ROWS/fold-SK.txt"
cp -a "$TMP/SK" "$TMP/SKW"
node "$MJS" plant "$TMP/SKW" > "$ROWS/plant-SKW.json"
echo "plant SKW: $(cat "$ROWS/plant-SKW.json")"
for T in S SK SKW; do echo "bands $T: $(cd "$TMP/$T" && node "$MJS" bands .)"; done
for T in SK SKW; do node "$TMP/trial/kRoles.mjs" "$TMP/$T" "$TMP/k300.json" > "$ROWS/kroles-$T.txt"; echo "kRoles $T:"; cat "$ROWS/kroles-$T.txt"; done

# ── births: one job per (tree, pool, size), at most four at once ──
JOBS="$TMP/jobs"
for T in S SK SKW; do for P in visitor chair600; do for Z in thorp hamlet village town city metropolis; do
  printf '%s\t%s\t%s\n' "$T" "$P" "$Z" >> "$JOBS"
done; done; done
set +e
# shellcheck disable=SC2016
tr '\t' '\n' < "$JOBS" | xargs -d '\n' -n 3 -P 4 sh -c 'cd "$0/$3" && node "$1" birth . "$3" "$4" "$5" "$2/$3.$4.$5.jsonl" > "$2/$3.$4.$5.log" 2>&1' "$TMP" "$MJS" "$ROWS"
RC=$?
set -e
[ "$RC" -eq 0 ] || { echo "a birth run failed (xargs $RC); logs:" >&2; tail -n 5 "$ROWS"/*.log >&2; exit 2; }
cat "$ROWS"/*.log
node "$MJS" report "$ROWS" "$HERE" "$SEAT_SHA" "$FOLD_SHA" "$T0" "$ROWS/calibration.json"
echo "run time: $(( $(date +%s) - T0 )) s"
