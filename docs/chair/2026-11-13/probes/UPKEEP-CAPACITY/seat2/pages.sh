#!/bin/sh
# pages.sh <sha> <keys> <label>
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
T=$(sh $S/tools/tree.sh $1); cd $S/tools && TREE=$T node pages.mjs $2 $S/pages/$3 > $S/pages/$3.log 2>&1; echo "pages $3 exit $?" >> $S/runs/done.txt
