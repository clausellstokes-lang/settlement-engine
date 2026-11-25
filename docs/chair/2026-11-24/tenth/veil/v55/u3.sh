#!/bin/sh
# VEIL-55: unit 3 (IMPORT-DOOR 2f849aa53) red and green on a slice: galleryMapCovert (the unit's own arm) RED on the tip dbd4cd9e5's
# 212 (the -wip's test file in a scratch worktree of the tip, /home/user/wt/u3red) and GREEN on 2f849aa53 (/home/user/wt/u3).
O=/var/tmp/v55/out/u3; L=/var/tmp/v55/u3.log; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
for w in u3red u3; do
  mx sh -c "cd /home/user/wt/$w && sh scripts/gate-tail.sh npx vitest run tests/security/galleryMapCovert.pglite.test.js tests/security/galleryServerVeil.pglite.test.js --maxWorkers=1" > $O/$w.txt 2>&1
  echo "$w rc=$? $(grep -E 'Test Files|Tests ' $O/$w.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
done
echo "u3 END $(date -u +%FT%TZ)" >> $L
