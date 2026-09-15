#!/bin/sh
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
D=$SC/kit/lane-LT41-voice; OUT=$MY/c931/declared
for R in c351fdb44 919c37da5; do
  W=$MY/nc-dump-$R; git -C $D worktree add --detach $W $R >/dev/null 2>&1; ln -s $D/node_modules $W/node_modules 2>/dev/null
  cp $OUT/__chair_dump.test.js $W/tests/property/__chair_dump.test.js
  ( cd $W && CHAIR_DUMP_OUT=$OUT/dump-$R.json sh $D/scripts/gate-mutex.sh --run -- npx vitest run tests/property/__chair_dump.test.js 2>&1 | grep -E 'Tests |Test Files|Error' | head -3 )
  echo "dump $R: $(wc -c < $OUT/dump-$R.json 2>/dev/null) bytes $(uptime | sed 's/.*averages: //')"
  git -C $D worktree remove --force $W 2>/dev/null
done
git -C $D worktree prune
echo "DUMPS_DONE"
