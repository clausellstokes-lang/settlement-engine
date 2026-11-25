#!/bin/sh
# VEIL-53's MACHINE RESTORE (the chair's efficiency rule (5), 2026-11-25): a fresh container back to this seat's working
# state. Idempotent: what exists is kept. Run from /home/user/settlement-engine on branch lane/veil-53-2026-11-24.
#   sh docs/chair/2026-11-24/tenth/veil/out/v53/restore.sh
set -e
R=/home/user/settlement-engine; cd $R
git fetch -q origin lane/veil-53-2026-11-24-join-wip lane/veil-53-2026-11-24-grants-wip lane/veil-53-2026-11-24-j1-wip \
  lane/veil-53-2026-11-24-cures-wip lane/chair-2026-11-08
# the ledger ref BY ITS OWN NAME (a multi-branch fetch leaves FETCH_HEAD at the FIRST branch: the first version of this
# script reset the ledger ref to the trial join that way at 05:14 UTC 2026-11-25, and three ledgerCitationIntegrity tests read red)
git fetch -q origin review-fixes-2026-07-08 && git branch -f review-fixes-2026-07-08 origin/review-fixes-2026-07-08
wt() { # <dir> <branch>
  [ -d "$1" ] && return 0
  if git show-ref -q --verify refs/heads/$2; then git worktree add -q "$1" "$2"; else git worktree add -q -b "$2" "$1" "origin/$2"; fi
}
wt /home/user/join53 lane/veil-53-2026-11-24-join-wip
wt /home/user/grants53 lane/veil-53-2026-11-24-grants-wip
wt /home/user/j153 lane/veil-53-2026-11-24-j1-wip
wt /home/user/cures53 lane/veil-53-2026-11-24-cures-wip
[ -d /home/user/join53/node_modules ] || (cd /home/user/join53 && npm ci > /var/tmp/v53-npmci.log 2>&1)
for d in $R /home/user/grants53 /home/user/j153 /home/user/cures53; do
  [ -e $d/node_modules ] || ln -s /home/user/join53/node_modules $d/node_modules
  [ -e $d/.husky/_ ] || ln -s /home/user/join53/.husky/_ $d/.husky/_
done
grep -qx node_modules .git/info/exclude || printf 'node_modules\n.husky/_\n' >> .git/info/exclude
mkdir -p /var/tmp/v53
echo "restored: $(git worktree list | wc -l) worktrees; core.bare=$(git config --local --get core.bare)"
