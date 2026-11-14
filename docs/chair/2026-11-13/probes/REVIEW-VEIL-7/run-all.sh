#!/bin/sh
# run-all.sh <worktree of the bytes under test> [outdir]        REVIEW-VEIL-7 — THE PLANT LIBRARY AS ONE COMMAND.
# LOCAL scratch PostgreSQL only (PGHOST, default /var/tmp/rv7: unix socket, trust auth). Never a hosted database.
# Needs: `npm ci` done in the worktree; RV6_PGMOD (default /home/user/wt/pgmod: a folder with `npm i pg@8.13.1`).
#   1. builds two chains from the worktree's migrations: x212 (001..212) and x211 (001..211, the frozen 211 alone)
#   2. stores every hand town (hand/town-<a..e>.json with its veil) three times on x212 (no veil record; the veil;
#      the veil with Reveal DM) and reads each by gallery, link and import; then the client's twin over the same rows
#   3. prints the table of EXPECTED results (hand/expected.json, expect.mjs): what must not arrive, what must stay
#   4. the deep document and the large row, timed on x211 and x212 (hand/deep-cost.sql)
# About 2 minutes in all on four cores (the born-town run is separate and long: born/run-born.sh).
set -u
WT=$(cd "$1" && pwd); HERE=$(cd "$(dirname "$0")" && pwd); OUT=${2:-/var/tmp/rv7-plants}; P6=$HERE/../REVIEW-VEIL-6
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres; PGMOD=${RV6_PGMOD:-/home/user/wt/pgmod}
T0=$(date +%s); mkdir -p $OUT; rm -f $OUT/rv7*.json
echo "bytes: 212 $(sha256sum < $WT/supabase/migrations/212_share_veil_later_cures.sql | cut -c1-16)… 211 $(sha256sum < $WT/supabase/migrations/211_server_side_share_veil.sql | cut -c1-16)… at $(git -C $WT rev-parse --short HEAD)"
sh $P6/native/chain.sh x212 212 $WT/supabase/migrations 2>&1 | grep -v NOTICE
sh $P6/native/chain.sh x211 211 $WT/supabase/migrations 2>&1 | grep -v NOTICE
for t in a b c d e; do sh $HERE/hand/run.sh x212 $HERE/hand/town-$t.json $HERE/hand/veil-$t.json rv7$t $OUT >/dev/null; done
(cd $WT && RV6_SRC=$WT RV6_PROBE=../REVIEW-VEIL-7/twin.probe.jsx RV6_PGMOD=$PGMOD RV7_DB=x212 RV7_LIKE='rv7%' RV7_OUT=$OUT npx vitest run --config $P6/vitest.config.mjs > $OUT/twin.log 2>&1) || echo "THE TWIN PROBE FAILED: see $OUT/twin.log"
echo "== the hand towns: expected results (server: gallery, link, import; client: the twin)"
node $HERE/expect.mjs $HERE/hand/expected.json $OUT; RC=$?
echo "== server against twin, paths that differ (0 wanted on every row)"
for t in a b c d e; do for s in base veil dm; do echo "rv7$t-$s: $(node $HERE/jdiff.mjs $OUT/rv7$t-$s-gallery.json $OUT/rv7$t-$s-client.json 0 | tail -1)"; done; done | grep -v 'differ: 0$' || echo "(all 15 equal)"
echo "== the deep document and the large row (V7-10, V7-6): the frozen 211 alone against 212"
run() { psql -qd $1 -v depth=$2 -v houses=$3 -v strings=$4 -v dm=$5 -f $HERE/hand/deep-cost.sql 2>&1 | grep NOTICE | sed 's/.*NOTICE: *//'; }
ms() { echo "$1" | sed -n 's/.* \([0-9]*\) ms$/\1/p'; }
A=$(run x211 3000 5 100 true); B=$(run x212 3000 5 100 true); echo "3,000 deep, Reveal DM | $A | $B"
case "$B" in *"| ok |"*) echo "PASS | V7-10 | a document 211 serves is served";; *) case "$A" in *"| ok |"*) echo "FAIL | V7-10 | 212 raises where 211 serves"; RC=1;; *) echo "PASS | V7-10 | (211 raises too)";; esac;; esac
for spec in "200 5000" "600 10000"; do set -- $spec; A=$(run x211 10 $1 $2 false); B=$(run x212 10 $1 $2 false); echo "$1 hidden houses, $2 strings | $A | $B"
  if [ "$(ms "$B")" -le $(( $(ms "$A") * 3 + 250 )) ] 2>/dev/null; then echo "PASS | V7-6 | within three times 211's cost"; else echo "FAIL | V7-6 | more than three times 211's cost on the same row"; RC=1; fi; done
echo "run-all: $(( $(date +%s) - T0 )) s; responses in $OUT; exit $RC"
exit $RC
