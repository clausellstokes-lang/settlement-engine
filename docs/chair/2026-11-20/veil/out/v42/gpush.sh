#!/bin/sh
# VEIL-42: THE GUARDED PUSH (the chair's 44.8 (1)): push <branch> from <worktree> by its own name ONLY when origin lacks the local tip.
W=$1; B=$2; L=/var/tmp/v18/out/v42/push-$(echo $B | tr / _)-$(date -u +%H%M%S).txt
H=$(git -C $W rev-parse $B); R=$(git -C $W ls-remote origin refs/heads/$B | cut -f1)
[ "$H" = "$R" ] && { echo "SKIP $B: origin already at $H"; exit 0; }
cd $W && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE git push -u origin $B > $L 2>&1; rc=$?
grep -q '> settlementforge@1.0.0 check$' $L && echo "WARNING: the whole check started (see $L)"
echo "push $B rc=$rc $(tail -1 $L)"; exit $rc
