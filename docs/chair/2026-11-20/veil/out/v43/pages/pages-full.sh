#!/bin/sh
# V43-PAGES, THE FULL RUN, one mutex hold (sh scripts/gate-mutex.sh --run -- sh pages-full.sh <worktree> <outdir> <tpl>)
# (F) the 720 on four shards (PG_RESTORE_EVERY=k: the restore loop on every k-th birth only; the seat's split is 4), then (N)
# the 92 hiding towns on four shards, then the tables (<outdir>/PAGES-table.txt). The analyzer's exit 1 is a STOP (it says which).
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd)
sh $P/pages.sh $W $O $T F 4; f=$?
sh $P/pages.sh $W $O $T N 4; n=$?
node $P/pages-an.mjs $O/rows > $O/PAGES-table.txt; a=$?
echo "F rc=$f N rc=$n an rc=$a" >> $O/window.txt; tail -3 $O/PAGES-table.txt
[ $f = 0 ] && [ $n = 0 ]
