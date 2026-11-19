#!/bin/sh
# push.sh <local-branch> <lane-branch> : plain push with retries; refs and local config of the MAIN checkout compared
# before and after (MAIN = the primary clone, whose .git the worktree shares). Run the three lane gates first.
: "${LANE:?set LANE}"; : "${OUT:?set OUT}"; : "${MAIN:?set MAIN}"; L=${1:?local branch}; R=${2:?lane branch}
cd "$LANE" || exit 1
git -C "$MAIN" config --local --list > "$OUT/cfg.pre"; git -C "$MAIN" for-each-ref | grep -v "refs/remotes/origin/$R\|refs/heads/$L" > "$OUT/refs.pre"
for i in 1 2 3 4; do git push origin "$L:refs/heads/$R" && break; sleep $((i*4)); done
git fetch -q origin "$R"; echo "origin: $(git rev-parse "origin/$R") local: $(git rev-parse "$L")"
git -C "$MAIN" config --local --list | diff "$OUT/cfg.pre" - && echo cfg-same
git -C "$MAIN" for-each-ref | grep -v "refs/remotes/origin/$R\|refs/heads/$L" | diff "$OUT/refs.pre" - && echo refs-same
git -C "$MAIN" status --short | head -3
