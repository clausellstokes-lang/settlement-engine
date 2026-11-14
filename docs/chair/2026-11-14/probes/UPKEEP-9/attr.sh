#!/bin/sh
# UPKEEP-9: run the merge's failing files at each named commit in the scratch worktree /home/user/up9run, one log each.
S=/tmp/claude-0/-home-user-settlement-engine/64a8cd6e-cf6d-50a8-b76c-1a846d1a1ff5/scratchpad
cd /home/user/up9run || exit 2
for c in "$@"; do
  git checkout -q --detach "$c" || { echo "checkout $c failed"; exit 2; }
  GATE_MUTEX_TIER=shared sh scripts/gate-tail.sh -n 6 sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=2 $(cat $S/fails-files.txt) > $S/attr-$c.log 2>&1
  echo "EXIT $?" >> $S/attr-$c.log
done
git checkout -q --detach 33acecd6d
