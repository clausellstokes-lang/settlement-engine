#!/bin/sh
# gold.sh <sha> <label>
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
T=$(sh $S/tools/tree.sh $1); mkdir -p $S/gold; cd $S/tools && node goldens.mjs $T $S/gold/$2.ndjson > $S/gold/$2.log 2>&1; echo "gold $2 exit $? $(wc -l < $S/gold/$2.ndjson)" >> $S/runs/done.txt
