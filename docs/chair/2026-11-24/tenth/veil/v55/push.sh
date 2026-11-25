#!/bin/sh
# VEIL-55: the one way I push the documents branch: cd first, compare origin with the local tip, push only when they differ.
cd /home/user/wt/docs || exit 2
B=lane/veil-55-2026-11-24; L=$(git rev-parse "refs/heads/$B") || exit 2
R=$(git ls-remote origin "refs/heads/$B" | cut -f1)
[ "$R" = "$L" ] && { echo "origin already at $L: nothing pushed"; exit 0; }
timeout 900 git push -q origin "$B" > /var/tmp/v55/push.log 2>&1; rc=$?
grep -q -E 'npm run check|test:ratchet|check-test-ratchet' /var/tmp/v55/push.log && echo "PUSH LOG SHOWS THE CHECK: report it"
echo "push rc=$rc $L $(date -u +%FT%TZ)"; exit $rc
