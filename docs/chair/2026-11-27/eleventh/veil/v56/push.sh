#!/bin/sh
# VEIL-56: the one way I push. sh push.sh <worktree> <local lane branch>. cd first, compare origin with the local tip, push only when
# they differ, by the branch's OWN NAME (lane/veil-56-2026-11-27*), scan the log for the whole check (COMMON-EIGHTH 15).
W=$1; B=$2; case "$B" in lane/veil-56-2026-11-27*) ;; *) echo "REFUSED: not my branch name: $B"; exit 2;; esac
cd "$W" || exit 2; L=$(git rev-parse "refs/heads/$B") || exit 2
R=$(git ls-remote origin "refs/heads/$B" | cut -f1)
[ "$R" = "$L" ] && { echo "origin already at $L: nothing pushed"; exit 0; }
G=/var/tmp/v56/push-$(echo "$B" | tr '/' '_').log
n=0; rc=1; while [ $n -lt 4 ]; do timeout 900 git push -q -u origin "$B" > $G 2>&1; rc=$?; [ $rc -eq 0 ] && break
  grep -q -E 'npm run check|test:ratchet|check-test-ratchet' $G && break; n=$((n+1)); sleep $((2*n*n)); done
grep -q -E 'npm run check|test:ratchet|check-test-ratchet' $G && echo "PUSH LOG SHOWS THE CHECK: report it"
echo "push rc=$rc $B $L $(date -u +%FT%TZ)"; exit $rc
