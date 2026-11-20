#!/bin/sh
# FORTUNE U5: the whole "merits of rule" measure in one command. It copies the checkout three times under the scratch
# directory (the ruled rule, `tree.mjs` proto; the ruled rule with U5, `u5-tree.mjs`; the same with PART 1 in defence's
# points form), births the seed sets on each and on the checkout itself (read only: today's rule), and writes its
# outputs beside the other measures. It changes no source file of the checkout. On a shared machine wrap it:
#   sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/content/fortune/instruments/u5-run.sh <checkout> <scratch-dir>
# Outputs (docs/chair/2026-11-20/content/fortune/measures/): u5-usual.txt (PART 1's derivation, seeds hxe),
# u5-search.txt (the record's candidates by size), u5-untouched.txt and u5-every-dial.txt (the tables, FS4, the
# contest), u5-confirm.txt (a second untouched set, hxu, 200 a size: ruled -> U5), u5-points-*.txt (PART 1's rejected
# form, with the 60-year window), u5-window60-*.txt (the merit's 60-year window, the measured alternative),
# u5-twenty.txt (twenty calm towns as plain lines), u5-shared.txt (what a shared page carries of each fact).
set -e
LINE=$(cd "$1" && pwd); S=$2; HERE=$(cd "$(dirname "$0")" && pwd); OUT="$HERE/../measures"
mkdir -p "$S" "$OUT"
DIALS='{"tradeRouteAccess":"random_trade","culture":"random_culture","monsterThreat":"random_threat","nearbyResourcesRandom":true,"selectedStressesRandom":true,"_randomizePriorities":true,"magicExists":true,"contentProfile":"grounded"}'
M="$HERE/u5-measure.mjs"
node "$HERE/tree.mjs" "$LINE" "$S/proto" proto
node "$HERE/u5-tree.mjs" "$LINE" "$S/u5tree"
U5_SAFETY=points U5_WINDOW=60 node "$HERE/u5-tree.mjs" "$LINE" "$S/u5pts"
U5_WINDOW=60 node "$HERE/u5-tree.mjs" "$LINE" "$S/u5w60"
node "$M" "$LINE" "$S/today-hxd.jsonl" 100 hxd & node "$M" "$S/proto" "$S/ruled-hxd.jsonl" 100 hxd &
node "$M" "$LINE" "$S/today-hxr.jsonl" 100 hxr "$DIALS" & node "$M" "$S/proto" "$S/ruled-hxr.jsonl" 100 hxr "$DIALS" &
wait
node "$M" "$S/proto" "$S/ruled-hxe.jsonl" 100 hxe & node "$M" "$S/proto" "$S/ruled-hxu.jsonl" 200 hxu &
node "$M" "$S/u5tree" "$S/u5-hxd.jsonl" 100 hxd & node "$M" "$S/u5tree" "$S/u5-hxr.jsonl" 100 hxr "$DIALS" &
wait
node "$M" "$S/u5tree" "$S/u5-hxu.jsonl" 200 hxu & node "$M" "$S/u5pts" "$S/u5pts-hxd.jsonl" 100 hxd &
node "$M" "$S/u5pts" "$S/u5pts-hxr.jsonl" 100 hxr "$DIALS" &
wait
node "$M" "$S/u5w60" "$S/u5w60-hxd.jsonl" 100 hxd & node "$M" "$S/u5w60" "$S/u5w60-hxr.jsonl" 100 hxr "$DIALS" &
node "$M" "$S/u5w60" "$S/u5w60-hxu.jsonl" 200 hxu &
wait
R="$HERE/u5-report.mjs"
node "$R" usual "$S/ruled-hxe.jsonl" > "$OUT/u5-usual.txt"
node "$R" search "$S/ruled-hxd.jsonl" "$S/ruled-hxr.jsonl" "$S/ruled-hxu.jsonl" > "$OUT/u5-search.txt"
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/u5-hxd.jsonl" > "$OUT/u5-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/u5-hxr.jsonl" > "$OUT/u5-every-dial.txt"
node "$R" tables "$S/ruled-hxu.jsonl" "$S/ruled-hxu.jsonl" "$S/u5-hxu.jsonl" > "$OUT/u5-confirm.txt"
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/u5pts-hxd.jsonl" > "$OUT/u5-points-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/u5pts-hxr.jsonl" > "$OUT/u5-points-every-dial.txt"
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/u5w60-hxd.jsonl" > "$OUT/u5-window60-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/u5w60-hxr.jsonl" > "$OUT/u5-window60-every-dial.txt"
node "$R" tables "$S/ruled-hxu.jsonl" "$S/ruled-hxu.jsonl" "$S/u5w60-hxu.jsonl" > "$OUT/u5-window60-confirm.txt"
node "$R" twenty "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/u5-hxd.jsonl" > "$OUT/u5-twenty.txt"
node "$R" shared "$S/u5-hxd.jsonl" "$S/u5-hxr.jsonl" > "$OUT/u5-shared.txt"
echo "done: $OUT"
