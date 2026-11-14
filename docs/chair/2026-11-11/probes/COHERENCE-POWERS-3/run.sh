#!/bin/sh
# sh run.sh <tree> <label> — the whole corpus (R, G, S) in four shards, into dumps/<label>.jsonl
S=/tmp/claude-0/-home-user-settlement-engine/2e03cf9c-b2bb-5223-bf3b-aa2451a37213/scratchpad
mkdir -p $S/dumps
for i in 0 1 2 3; do node $S/probes/dump.mjs $1 RGS $i 4 $S/dumps/$2.$i.jsonl > $S/dumps/$2.$i.log 2>&1 & done
wait
cat $S/dumps/$2.0.jsonl $S/dumps/$2.1.jsonl $S/dumps/$2.2.jsonl $S/dumps/$2.3.jsonl > $S/dumps/$2.jsonl
rm $S/dumps/$2.[0-3].jsonl
wc -l $S/dumps/$2.jsonl; cat $S/dumps/$2.[0-3].log | grep -v births
