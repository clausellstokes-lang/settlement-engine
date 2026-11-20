#!/bin/sh
# runc.sh <sha> <label>: the corpus at a committed tree, 3 shards, drops off, into runs/<label>
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
T=$(sh $S/tools/tree.sh $1); O=$S/runs/$2; mkdir -p $O
cd $S/tools
for i in 0 1 2; do CAP_CANDS=base node corpus2.mjs $T census.json $O/c2-$i.ndjson $i 3 0 > $O/log-$i.txt 2>&1 & done
wait
echo "done $2 $(cat $O/c2-*.ndjson | wc -l)" >> $S/runs/done.txt
