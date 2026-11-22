#!/bin/sh
# safepush.sh <worktree> <branch> <log>: the chair's ONE way to push a lane branch (written 2026-11-22 after the fixture incident).
# It refuses while any git push runs here; refuses a ref outside lane/; pushes ONLY if the remote differs from the local tip
# (an empty push makes the pre-push hook run the whole check); and kills the push if its log shows the whole check starting.
set -u
WT="$1"; BR="$2"; LOG="$3"
case "$BR" in lane/*) ;; *) echo "REFUSED: not a lane branch: $BR"; exit 2;; esac
if pgrep -f "git push" >/dev/null 2>&1; then echo "REFUSED: a git push is already running here"; pgrep -af "git push" | cut -c1-120; exit 3; fi
cd "$WT" || exit 4
if [ -n "$(git status --short | head -n 1)" ]; then echo "REFUSED: the worktree is not clean"; git status --short | head -n 5; exit 5; fi
L=$(git rev-parse "refs/heads/$BR") || exit 6
R=$(git ls-remote origin "refs/heads/$BR" | cut -c1-40)
if [ "$L" = "$R" ]; then echo "NOTHING TO PUSH: origin already holds $L"; exit 0; fi
if [ -n "$R" ] && ! git merge-base --is-ancestor "$R" "$L" 2>/dev/null; then echo "REFUSED: origin's tip $R is not an ancestor of the local tip (fetch and merge first; never force)"; exit 7; fi
( nohup sh -c "cd '$WT' && nice -n 19 timeout 2400 git push -u origin '$BR' > '$LOG' 2>&1; echo \"exit=\$?\" >> '$LOG'; date -u +'%H:%M:%S UTC' >> '$LOG'" >/dev/null 2>&1 & )
sleep 25
if grep -q "settlementforge@1.0.0 check\$\|npm run check\b" "$LOG" 2>/dev/null && ! grep -q "typecheck:ratchet" "$LOG" 2>/dev/null; then
  echo "THE WHOLE CHECK STARTED: KILLING THE PUSH"; pkill -TERM -f "git push -u origin $BR"; pkill -TERM -f "npm run check"; pkill -TERM -f "check-test-ratchet"; exit 8
fi
echo "PUSH STARTED on the lane path: $R -> $L"; head -n 4 "$LOG" | cut -c1-100
