#!/bin/sh
# births3.sh <tree> <outroot>: the 720, the 150 and the 525 of a tree, three at once; each job's exit in its log
S=${S:?set S to a scratch directory holding pc/ (PAGE-COPY: births.mjs, seedcfg.mjs, seeds.txt, seeds.w150.txt) and m/}
TREE=$1; OUT=$2; mkdir -p $OUT/720 $OUT/150 $OUT/ref
( TREE=$TREE OUT=$OUT/720 SEEDS=$S/pc/seeds.txt node $S/pc/births.mjs > $OUT/720/births.log 2>&1; echo "EXIT $?" >> $OUT/720/births.log ) &
( TREE=$TREE OUT=$OUT/150 SEEDS=$S/pc/seeds.w150.txt node $S/pc/births.mjs > $OUT/150/births.log 2>&1; echo "EXIT $?" >> $OUT/150/births.log ) &
( TREE=$TREE OUT=$OUT/ref node $TREE/docs/chair/2026-11-17/birth/probes/birthsRef.mjs > $OUT/ref/births.log 2>&1; echo "EXIT $?" >> $OUT/ref/births.log ) &
wait; grep -H EXIT $OUT/*/births.log
