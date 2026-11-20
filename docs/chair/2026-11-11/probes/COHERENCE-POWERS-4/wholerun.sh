#!/bin/sh
# sh wholerun.sh <tree> <label> — whole.mjs over R, G and S in four shards: dumps/<label>.w<i>.ndjson.gz
S=/tmp/claude-0/-home-user-settlement-engine/af36b3be-c713-5bc4-9179-581d679d45cb/scratchpad
cd $S && for i in 0 1 2 3; do node --max-old-space-size=3000 probes/whole.mjs $1 RGS $i 4 dumps/$2.w$i.ndjson.gz & done; wait; ls -la dumps/$2.w*.ndjson.gz
