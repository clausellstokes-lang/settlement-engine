#!/bin/sh
O=/var/tmp/v18/out/v31/m
while ! grep -q '^END' $O/done.txt 2>/dev/null; do [ -f /var/tmp/v18/out/v31/after0.txt ] && exit 0; sleep 30; done
cd /home/user/settlement-engine && env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE sh scripts/gate-tail.sh npx vitest run tests/lint > $O/lint-whole.txt 2>&1; echo "lint-whole rc=$? $(date -u +%H:%M:%S)" >> $O/done-after.txt
