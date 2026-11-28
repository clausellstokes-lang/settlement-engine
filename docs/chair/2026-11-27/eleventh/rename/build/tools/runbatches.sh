#!/bin/sh
# runbatches.sh <tree> <list> <outdir> <size> : run the list's test files in batches; each batch's full log kept; failing files listed
TREE=$1; LIST=$2; OUT=$3; N=$4; mkdir -p $OUT; rm -f $OUT/fail.txt; i=0
split -l $N $LIST $OUT/part.
for p in $OUT/part.*; do
  i=$((i+1)); cd $TREE
  NODE_OPTIONS=--max-old-space-size=6144 nice -n 5 npx vitest run $(cat $p) > $OUT/b$i.log 2>&1; echo "batch $i exit $?" >> $OUT/progress.txt
  grep -E "^ (FAIL|❯) " $OUT/b$i.log | grep -oE "tests/[^ >]+\.test\.(js|jsx|mjs)" | sort -u >> $OUT/fail.txt
  grep -E "Test Files|Tests " $OUT/b$i.log | tail -2 >> $OUT/progress.txt
done
echo "ALL DONE" >> $OUT/progress.txt
