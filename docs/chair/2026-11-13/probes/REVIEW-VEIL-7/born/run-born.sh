#!/bin/sh
# born/run-born.sh <worktree of the bytes under test> <worktree of origin/master> [outdir]     REVIEW-VEIL-7
# THE BORN-TOWN RUN, both stored shapes, every read, reveal off and on, live, frozen and narrated: the earlier
# reader's cold.probe.jsx (its planted markers) on x212 (001..212, the new shape) and on xp212 (203 + 211 + 212,
# master's shape), then every census of this folder. LOCAL scratch PostgreSQL only. `npm ci` in the first worktree,
# node_modules linked into the second; RV6_PGMOD as run-all.sh. About 75 minutes on four cores (the births and reads
# about 15 a shape, the any-form name search about 12 a shape, the rest under 5 each). Each part was run and timed
# apart at 6692efdda; this file strings them together and was not itself run end to end.
# EXPECTED (green), per shape:
#   summary: raised 0, births that threw 0, a marker in a list that takes no slug 0
#   table: only the classes A (notes; Reveal DM), B, C, D of REVIEW-VEIL-212-28f52b1e4 section 1.4
#   names-anyform: only the two schema KEY rows (compound.inst.<key>, safetyProfile.flags.<key>)
#   text-anyform: no row but a goal's reference to an open person's id and class D. NOTE: its legacy-annotation row
#     is the marker acting as an edit made after the birth (V7-2): green only once that home follows its event's eye
#   flags-census, roles-census: no row under the header;  stub-census: the last three numbers 0
#   sweep-removes: only strings that name a hidden house;  edited-after-birth: the two lines of a database equal,
#     and `annotations sent` 0 on both
set -u
WT=$(cd "$1" && pwd); MASTER=$(cd "$2" && pwd); HERE=$(cd "$(dirname "$0")/.." && pwd); OUT=${3:-/var/tmp/rv7-born}; P6=$HERE/../REVIEW-VEIL-6
export PGHOST=${PGHOST:-/var/tmp/rv7} PGUSER=postgres; PGMOD=${RV6_PGMOD:-/home/user/wt/pgmod}; mkdir -p $OUT
sh $P6/native/chain.sh x212 212 $WT/supabase/migrations | grep -v NOTICE
sh $P6/native/chain.sh xp212 203+211+212 $WT/supabase/migrations | grep -v NOTICE
for n in 0 1 2 3; do
  (cd $WT && RV6_SIDE=tip RV6_SRC=$WT RV6_PGMOD=$PGMOD RV6_CHAINS=ct:x212 RV6_PREFIX=t RV6_SEEDS=2 RV6_SHARD=$n/4 RV6_OUT=$OUT/cold-tip-$n.json npx vitest run --config $P6/vitest.config.mjs > $OUT/cold-tip-$n.log 2>&1) &
done; wait
for n in 0 1 2 3; do
  (cd $MASTER && RV6_SIDE=master RV6_SRC=$MASTER RV6_PGMOD=$PGMOD RV6_CHAINS=cm:xp212 RV6_PREFIX=m RV6_SEEDS=2 RV6_SHARD=$n/4 RV6_OUT=$OUT/cold-master-$n.json npx vitest run --config $P6/vitest.config.mjs > $OUT/cold-master-$n.log 2>&1) &
done; wait
for side in tip:ct master:cm; do s=${side%:*}; c=${side#*:}; DBS="${c}_0 ${c}_1 ${c}_2 ${c}_3"
  node $P6/cold-summary.mjs $OUT/cold-$s-?.json > $OUT/summary-$s.txt 2>&1
  node $P6/cold-table.mjs $c $OUT/cold-$s-?.json > $OUT/table-$s.txt 2>&1
  node $P6/names-anyform.mjs $PGMOD $DBS > $OUT/names-anyform-$s.txt 2>&1
  node $P6/text-anyform.mjs $PGMOD $DBS > $OUT/text-anyform-$s.txt 2>&1
  node $HERE/flags-census.mjs $WT $PGMOD $DBS > $OUT/flags-census-$s.txt 2>&1
  node $HERE/roles-census.mjs $PGMOD $DBS > $OUT/roles-census-$s.txt 2>&1
  node $HERE/born/sweep-removes.mjs $PGMOD $DBS > $OUT/sweep-removes-$s.txt 2>&1
  for d in $DBS; do psql -qd $d -f $HERE/born/stub-census.sql; psql -qd $d -f $HERE/born/edited-after-birth.sql; done 2>&1 | grep -v '^$' > $OUT/stub-and-edited-$s.txt
  echo "== $s"; head -c 200 $OUT/summary-$s.txt; echo; grep -E '^(marker|house)' $OUT/table-$s.txt | cut -c1-140
  grep -E "^$c" $OUT/names-anyform-$s.txt | cut -c1-150; grep -E "^$c" $OUT/text-anyform-$s.txt | cut -c1-150
  cut -c1-200 $OUT/flags-census-$s.txt $OUT/roles-census-$s.txt $OUT/sweep-removes-$s.txt $OUT/stub-and-edited-$s.txt
done
