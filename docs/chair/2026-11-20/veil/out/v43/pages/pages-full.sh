#!/bin/sh
# V43-PAGES, THE FULL RUN AS THE CHAIR RULED IT (N103: the ~55-minute split), one mutex hold:
#   sh scripts/gate-mutex.sh --run -- sh pages-full.sh <worktree> <outdir> <tpl>
# 1. (F) the 720 on four shards, the restore loop on every 4th birth (PG_RESTORE_EVERY=4); 2. (N) the 92 hiding towns on four
# shards; 3. the tables, which write <outdir>/needs.txt: up to three births of each kind (tab + label) the sampled births did
# not key; 4. (F) those births again with the loop (PG_ONLY), over their rows; 5. the tables again (<outdir>/PAGES-table.txt).
# The analyzer's exit 1 is a STOP (it says which).
W=$1; O=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd)
PG_RESTORE_EVERY=4 sh $P/pages.sh $W $O $T F 4; f=$?
sh $P/pages.sh $W $O $T N 4; n=$?
node $P/pages-an.mjs $O/rows > $O/PAGES-table-pass1.txt; a1=$?
NEED=$(cat $O/needs.txt 2>/dev/null); k=0
if [ -n "$NEED" ]; then PG_ONLY=$NEED sh $P/pages.sh $W $O $T F 4; k=$?; fi
node $P/pages-an.mjs $O/rows > $O/PAGES-table.txt; a=$?
echo "F rc=$f N rc=$n an1 rc=$a1 keyfill rc=$k ($(echo $NEED | tr ',' '\n' | grep -c .) births) an rc=$a" >> $O/window.txt; tail -3 $O/PAGES-table.txt
[ $f = 0 ] && [ $n = 0 ] && [ $k = 0 ]
