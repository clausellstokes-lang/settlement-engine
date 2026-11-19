#!/bin/sh
# gates.sh <worktree> <sha> <label>: both type ratchets at a committed sha (detached), into gates-<label>.txt
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
cd $1 && git checkout -q --detach $2 && sh scripts/gate-tail.sh npm run typecheck:domain:strict > $S/tds-$3.log 2>&1; a=$?; sh scripts/gate-tail.sh npm run typecheck:ratchet > $S/tr-$3.log 2>&1; b=$?
echo "gates $3 tds $a $(grep -o 'no strict-type regressions ([^)]*)' $S/tds-$3.log) tr $b $(grep -o 'no type regressions ([^)]*)' $S/tr-$3.log)" >> $S/runs/done.txt
