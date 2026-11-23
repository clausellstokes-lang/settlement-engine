#!/bin/sh
# V43-PAGES, THE CHAIR'S N109 SAMPLES, one short mutex hold (sh scripts/gate-mutex.sh --run -- sh pages-extra.sh <worktree> <outdir> <tpl>)
# (V) VR31 per birth on the 720 (no render); (D) the four named births at Reveal DM against the owner's own page; the views of
# r2s-infiltrated-city-2 dumped (P0 and P1, the differing tabs) to place its unpaired figure. Then vr31-an.mjs.
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd)
D4=r2r-metropolis-29,r2r-village-48,r2s-infiltrated-city-2,r2s-infiltrated-city-3
sh $P/pages.sh $W $O/v $T V 4; v=$?
PG_ONLY=$D4 sh $P/pages.sh $W $O/d $T D 4; d=$?
PG_ONLY=r2s-infiltrated-city-2,r2s-infiltrated-city-3,r2r-metropolis-29 PG_DUMP_VIEWS=1 PG_RESTORE=0 PG_SERVER_EVERY=0 sh $P/pages.sh $W $O/views $T F 3; f=$?
node $P/vr31-an.mjs $O > $O/vr31-table.txt; a=$?
echo "V rc=$v D rc=$d views rc=$f an rc=$a" >> $O/window.txt; tail -5 $O/vr31-table.txt
[ $v = 0 ] && [ $d = 0 ] && [ $f = 0 ]
