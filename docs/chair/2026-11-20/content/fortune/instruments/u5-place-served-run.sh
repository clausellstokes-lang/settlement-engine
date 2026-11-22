#!/bin/sh
# FORTUNE U5a: the late step at the ruled place RE-MEASURED UNDER THE CHAIR'S RULINGS of 2026-11-20 19:33 and 19:38 UTC
# (a merit reads only what every shared read serves): the weathered catastrophe alone (the principled ruler barred),
# the condition without the capture rung and without the seat-match. Reuses the ruled arms `u5-place-run.sh` left in
# <scratch-dir> (today-*, ruled-*), so run that first with the same scratch directory.
#   sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/content/fortune/instruments/u5-place-served-run.sh <checkout> <scratch-dir>
# Outputs (measures/): u5-place-served-{untouched,every-dial,confirm}.txt (the tables), u5-place-served-compare.txt
# (against the first placement, late), u5-place-served-stale.txt (W1 to W5), u5-place-served-fs5.txt.
set -e
LINE=$(cd "$1" && pwd); S=$2; HERE=$(cd "$(dirname "$0")" && pwd); OUT="$HERE/../measures"
DIALS='{"tradeRouteAccess":"random_trade","culture":"random_culture","monsterThreat":"random_threat","nearbyResourcesRandom":true,"selectedStressesRandom":true,"_randomizePriorities":true,"magicExists":true,"contentProfile":"grounded"}'
M="$HERE/u5-measure.mjs"; P="$HERE/u5-place.mjs"; R="$HERE/u5-report.mjs"
U5_MERITS=weathered U5_RUNG=off U5_SEAT=off node "$P" tree "$LINE" "$S/served" late
U5_LAW=2 node "$M" "$S/served" "$S/served-hxd.jsonl" 100 hxd & U5_LAW=2 node "$M" "$S/served" "$S/served-hxr.jsonl" 100 hxr "$DIALS" &
U5_LAW=2 node "$M" "$S/served" "$S/served-hxu.jsonl" 200 hxu &
wait
node "$P" stale "$S/served" "$S/stale-served-hxd.json" 100 hxd & node "$P" stale "$S/served" "$S/stale-served-hxr.json" 100 hxr "$DIALS" &
node "$P" fs5 "$LINE" "$S/served" "$S/fs5-served-hxd.json" 100 hxd &
wait
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/served-hxd.jsonl" > "$OUT/u5-place-served-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/served-hxr.jsonl" > "$OUT/u5-place-served-every-dial.txt"
node "$R" tables "$S/ruled-hxu.jsonl" "$S/ruled-hxu.jsonl" "$S/served-hxu.jsonl" > "$OUT/u5-place-served-confirm.txt"
{ for x in hxd hxr hxu; do node "$P" compare "$S/ruled-$x.jsonl" "$S/served-$x.jsonl" "$S/late-$x.jsonl"; done; } > "$OUT/u5-place-served-compare.txt"
{ for f in stale-served-hxd stale-served-hxr; do echo "== $f"; sed "s#$S#<scratch>#g" "$S/$f.json"; done; } > "$OUT/u5-place-served-stale.txt"
sed -e "s#$S#<scratch>#g" -e "s#$LINE#<checkout>#g" "$S/fs5-served-hxd.json" > "$OUT/u5-place-served-fs5.txt"
echo "done: $OUT"
