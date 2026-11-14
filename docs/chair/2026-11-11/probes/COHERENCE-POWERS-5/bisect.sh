#!/bin/sh
# bisect.sh <test-file> <commit...> — run one test file at each commit in a scratch worktree; per commit, the mismatch lines
SP=/tmp/claude-0/-home-user-settlement-engine/2c9c36b3-4f07-553f-9d7c-74f45bdf3360/scratchpad
T=$1; shift
[ -d $SP/bis ] || { cd /home/user/settlement-engine && git worktree add --detach $SP/bis HEAD >/dev/null 2>&1; ln -s $SP/lane/node_modules $SP/bis/node_modules; }
for c in "$@"; do
  cd $SP/bis && git checkout -q --detach $c && npx vitest run $T --maxWorkers=1 > $SP/out/bis.$c.log 2>&1
  echo "== $c $(git log --oneline -1 --format=%s | cut -c1-70)"; grep -E "^\s+[-+]\s+\"(prose|chrome|sub12|sub14)\"|^@@|Tests " $SP/out/bis.$c.log | head -30
done
