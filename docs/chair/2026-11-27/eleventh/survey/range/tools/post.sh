#!/bin/sh
# post.sh <C|V> : the analysis of one corpus (match, names, aggregate), niced, one at a time
S=/home/user/scratch-range; X=$1
cd $S && nice -n 10 node an/match.mjs keys2.json $X.jsonl $X.m.jsonl && nice -n 10 node an/names.mjs $X.jsonl $X.names.json && nice -n 10 node an/agg.mjs $X $X.m.jsonl $X.stats.json
