#!/bin/sh
# fetch, check fast-forward, push the lane, compare config
cd /home/user/p13 || exit 9
git fetch -q origin lane/powers-follow-up-2026-11-13 || exit 8
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/lane/powers-follow-up-2026-11-13)" ] && { echo "NOTHING TO SEND: no push"; exit 6; }
git log --format=%an origin/lane/powers-follow-up-2026-11-13..HEAD | grep -qv "^Claude$" && { echo "A COMMIT NOT MINE: no push"; exit 5; }
git merge-base --is-ancestor origin/lane/powers-follow-up-2026-11-13 HEAD || { echo "NOT-FF: the lane moved"; git log --oneline HEAD..origin/lane/powers-follow-up-2026-11-13; exit 7; }
git config --local --list > /home/user/runs/cfg.pre
git push origin p13:refs/heads/lane/powers-follow-up-2026-11-13 > /home/user/runs/push.log 2>&1; c=$?
tail -2 /home/user/runs/push.log
git config --local --list | diff -q /home/user/runs/cfg.pre - >/dev/null && echo CFG-SAME || echo CFG-CHANGED
echo "PUSH EXIT $c"; exit $c
