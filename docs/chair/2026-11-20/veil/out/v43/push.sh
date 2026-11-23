#!/bin/sh
# VEIL-43: push a local lane branch BY ITS OWN NAME only when origin lacks its tip (COMMON-EIGHTH 15 (a)-(b)); kill and report if the whole check starts.
#   sh push.sh <worktree> <lane branch> <log>
W=$1; B=$2; L=$3
case $B in lane/veil-43-2026-11-23*) ;; *) echo "REFUSED: $B is not a veil-43 lane branch"; exit 9;; esac
R=$(git -C $W ls-remote origin refs/heads/$B | cut -f1); H=$(git -C $W rev-parse $B)
[ "$R" = "$H" ] && { echo "SKIP: origin already at $H"; exit 0; }
setsid git -C $W push -q -u origin $B > $L 2>&1 & P=$!
while kill -0 $P 2>/dev/null; do
  if grep -q -E "npm run check|test:ratchet|check-test-ratchet|settlementforge@1.0.0 check" $L; then kill -TERM -- -$P 2>/dev/null; echo "KILLED: the whole check started"; exit 8; fi
  sleep 3
done
wait $P; rc=$?; echo "push rc=$rc origin now $(git -C $W ls-remote origin refs/heads/$B | cut -f1)"; exit $rc
