#!/bin/sh
# readat.sh <name> <seedsfile> : freeze wt (src+tests) into $S/fz-<name>, render the seeds' tab dumps, records, PDF and journal
set -eu
S=<scratchpad>; P=<scratchpad>/probes/docs/chair/2026-11-14/probes/REVIEW-W2-C-LEAVES; N=$1; SEEDF=$2
rm -rf $S/fz-$N; mkdir -p $S/fz-$N; (cd $S/wt && tar --exclude=./node_modules --exclude=./.git -cf - .) | tar -xf - -C $S/fz-$N; ln -s $S/wt/node_modules $S/fz-$N/node_modules
sh $P/render.sh $S/fz-$N $S/rd-$N $SEEDF 1 > $S/rd-$N.render.log 2>&1 || true
sh $P/surfaces.sh $S/fz-$N $S/rd-$N/records $S/rd-$N/surf $SEEDF > $S/rd-$N.surf.log 2>&1 || true
tail -2 $S/rd-$N.render.log; tail -1 $S/rd-$N.surf.log
