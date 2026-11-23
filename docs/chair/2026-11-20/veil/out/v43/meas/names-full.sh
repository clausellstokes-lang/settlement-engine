#!/bin/sh
# V43-MEASURE NAMES, THE FULL RUN, one mutex hold (sh scripts/gate-mutex.sh --run -- sh names-full.sh <worktree> <outroot> <tpl>)
# 1. the stored round trip (the lane's dump, out/v33/legacy at veil-42's 9f9b819f7, extracted unchanged to <outroot>/lp-src;
#    LP_A=0 LP_B=0, an empty pool: the 140 towns only); 2. wd.sh born (4 shards); 3. wd.sh stored (4 shards, the dump's documents).
W=$1; R=$2; T=$3; P=$(cd "$(dirname "$0")" && pwd)
LP_A=0 LP_B=0 sh $R/lp-src/dump.sh $W $R/stored-docs $R/emptypool > $R/dump.log 2>&1; d=$?; echo "dump rc=$d" > $R/names-done.txt
sh $P/wd.sh $W $R/full-born $T born; b=$?; echo "born rc=$b" >> $R/names-done.txt
[ $d = 0 ] && { sh $P/wd.sh $W $R/full-stored $T stored $R/stored-docs; s=$?; echo "stored rc=$s" >> $R/names-done.txt; }
cat $R/names-done.txt
