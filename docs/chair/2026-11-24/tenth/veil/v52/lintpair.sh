#!/bin/sh
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
cd /home/user/settlement-engine
for t in base75 mcsql; do
  $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- sh -c "cd /home/user/wt/$t && $E sh scripts/gate-tail.sh npx vitest run tests/lint" > /var/tmp/v52/out/lint-$t.log 2>&1; echo "lint $t rc=$? $(date -u +%H:%M:%S) $(git -C /home/user/wt/$t rev-parse --short HEAD)" >> /var/tmp/v52/log/q52.log
done
