#!/bin/sh
# FORTUNE U5a: the prototype's late step re-measured AT THE RULED PLACE (its own pipeline step after `assembleSettlement`,
# before `resolveCrisisCast`; the chair's census ruling (1) of 2026-11-20 16:45 UTC) against the prototype's own place
# (the end of birth) on THE SAME TIP, in one command. It copies the checkout twice under the scratch directory
# (`u5-place.mjs tree`: late, end), births the seed sets on each and on the checkout itself (today: law 1; ruled: law 2,
# the fixture arm), and writes its outputs beside the other measures. It changes no source file of the checkout.
#   sh scripts/gate-mutex.sh --run -- sh docs/chair/2026-11-20/content/fortune/instruments/u5-place-run.sh <checkout> <scratch-dir>
# Outputs (docs/chair/2026-11-20/content/fortune/measures/): u5-place-untouched.txt, u5-place-every-dial.txt,
# u5-place-confirm.txt (the tables at the ruled place: standing, FS4, reasons, the contest, the capture rung),
# u5-place-end-*.txt (the same at the end of birth, this tip), u5-place-compare.txt (the two places town by town),
# u5-place-stale.txt (the census's stale column at each place), u5-place-fs5.txt (law 1 byte for byte, and the
# law-2 towns the step did not move, byte for byte).
set -e
LINE=$(cd "$1" && pwd); S=$2; HERE=$(cd "$(dirname "$0")" && pwd); OUT="$HERE/../measures"
mkdir -p "$S" "$OUT"
DIALS='{"tradeRouteAccess":"random_trade","culture":"random_culture","monsterThreat":"random_threat","nearbyResourcesRandom":true,"selectedStressesRandom":true,"_randomizePriorities":true,"magicExists":true,"contentProfile":"grounded"}'
M="$HERE/u5-measure.mjs"; P="$HERE/u5-place.mjs"; R="$HERE/u5-report.mjs"
node "$P" tree "$LINE" "$S/late" late
node "$P" tree "$LINE" "$S/end" end
node "$M" "$LINE" "$S/today-hxd.jsonl" 100 hxd & node "$M" "$LINE" "$S/today-hxr.jsonl" 100 hxr "$DIALS" &
U5_LAW=2 node "$M" "$LINE" "$S/ruled-hxd.jsonl" 100 hxd & U5_LAW=2 node "$M" "$LINE" "$S/ruled-hxr.jsonl" 100 hxr "$DIALS" &
wait
U5_LAW=2 node "$M" "$S/late" "$S/late-hxd.jsonl" 100 hxd & U5_LAW=2 node "$M" "$S/late" "$S/late-hxr.jsonl" 100 hxr "$DIALS" &
U5_LAW=2 node "$M" "$S/end" "$S/end-hxd.jsonl" 100 hxd & U5_LAW=2 node "$M" "$S/end" "$S/end-hxr.jsonl" 100 hxr "$DIALS" &
wait
U5_LAW=2 node "$M" "$LINE" "$S/ruled-hxu.jsonl" 200 hxu & U5_LAW=2 node "$M" "$S/late" "$S/late-hxu.jsonl" 200 hxu &
U5_LAW=2 node "$M" "$S/end" "$S/end-hxu.jsonl" 200 hxu &
wait
node "$P" stale "$S/late" "$S/stale-late-hxd.json" 100 hxd & node "$P" stale "$S/late" "$S/stale-late-hxr.json" 100 hxr "$DIALS" &
node "$P" stale "$S/end" "$S/stale-end-hxd.json" 100 hxd & node "$P" stale "$S/end" "$S/stale-end-hxr.json" 100 hxr "$DIALS" &
wait
node "$P" fs5 "$LINE" "$S/late" "$S/fs5-late-hxd.json" 100 hxd
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/late-hxd.jsonl" > "$OUT/u5-place-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/late-hxr.jsonl" > "$OUT/u5-place-every-dial.txt"
node "$R" tables "$S/ruled-hxu.jsonl" "$S/ruled-hxu.jsonl" "$S/late-hxu.jsonl" > "$OUT/u5-place-confirm.txt"
node "$R" tables "$S/today-hxd.jsonl" "$S/ruled-hxd.jsonl" "$S/end-hxd.jsonl" > "$OUT/u5-place-end-untouched.txt"
node "$R" tables "$S/today-hxr.jsonl" "$S/ruled-hxr.jsonl" "$S/end-hxr.jsonl" > "$OUT/u5-place-end-every-dial.txt"
node "$R" tables "$S/ruled-hxu.jsonl" "$S/ruled-hxu.jsonl" "$S/end-hxu.jsonl" > "$OUT/u5-place-end-confirm.txt"
{ for x in hxd hxr hxu; do node "$P" compare "$S/ruled-$x.jsonl" "$S/late-$x.jsonl" "$S/end-$x.jsonl"; done; } > "$OUT/u5-place-compare.txt"
{ for f in stale-late-hxd stale-late-hxr stale-end-hxd stale-end-hxr; do echo "== $f"; sed "s#$S#<scratch>#g" "$S/$f.json"; done; } > "$OUT/u5-place-stale.txt"
sed -e "s#$S#<scratch>#g" -e "s#$LINE#<checkout>#g" "$S/fs5-late-hxd.json" > "$OUT/u5-place-fs5.txt"
echo "done: $OUT"
