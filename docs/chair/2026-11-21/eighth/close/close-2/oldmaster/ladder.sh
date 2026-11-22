#!/bin/sh
OUT=/tmp/claude-0/-home-user-settlement-engine/42f6469f-2193-55ee-b1bb-cd23b1d653f1/scratchpad/oldmaster
for pc in $LADDER; do
  p=${pc%%:*}; c=${pc#*:}
  [ -s $OUT/fp/$p.json ] && continue
  d=$OUT/bisect/$p; rm -rf $d; mkdir -p $d
  git -C /home/user/settlement-engine archive $c src tests/helpers tests/fixtures/generator-golden-master.json package.json | tar -x -C $d
  ln -s /home/user/settlement-engine/node_modules $d/node_modules
  GATE_MUTEX_MAX_POLLS=400 sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- node $OUT/fingerprint.mjs $d $OUT/fp/$p.json > $OUT/fp/$p.log 2>&1
  echo "exit=$?" >> $OUT/fp/$p.log
  echo "$p $c $(tail -2 $OUT/fp/$p.log | tr '\n' ' ')" >> $OUT/ladder.log
  rm -rf $d
done
echo LADDER-DONE >> $OUT/ladder.log
