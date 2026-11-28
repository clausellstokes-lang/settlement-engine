#!/bin/sh
# run4.sh <tree> <probe> <outprefix> <seedsfile> : 4 parts in parallel, each to <outprefix>.<k>.jsonl
S=<scratchpad>
for k in 0 1 2 3; do rm -f $3.$k.jsonl; ( SEEDS=$4 PART=$k/4 sh $S/pr/run.sh $1 $2 $3.$k.jsonl > $3.$k.runlog 2>&1 ) & done; wait; cat $3.*.runlog; cat $3.[0-3].jsonl > $3.jsonl; wc -l < $3.jsonl
