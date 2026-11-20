#!/bin/sh
# sh hashrun.sh <tree> <label> — hashonly over R, G and S in four shards, into dumps/<label>.hash.jsonl
S=/tmp/claude-0/-home-user-settlement-engine/af36b3be-c713-5bc4-9179-581d679d45cb/scratchpad
cd $S && for i in 0 1 2 3; do node probes/hashonly.mjs $1 RGS $i 4 dumps/$2.h$i.jsonl & done; wait
cat dumps/$2.h[0-3].jsonl > dumps/$2.hash.jsonl && rm dumps/$2.h[0-3].jsonl && wc -l dumps/$2.hash.jsonl
