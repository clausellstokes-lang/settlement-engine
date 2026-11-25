#!/bin/sh
# VEIL-55: unit 2's quiet-box items on the lane's tip dbd4cd9e5 (worktree /home/user/wt/tipm), after the grant (the chair's 22:59):
# (1) `npm run build`, then the VERIFY_DIST build pins, every red by name; (2) writer-reach's walker, its report. Log /var/tmp/v55/qb.log.
W=/home/user/wt/tipm; O=/var/tmp/v55/out/qb; L=/var/tmp/v55/qb.log; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
mx sh -c "cd $W && npm run -s build" > $O/build.txt 2>&1; echo "build rc=$? $(date -u +%FT%TZ)" >> $L
mx sh -c "cd $W && VERIFY_DIST=1 sh scripts/gate-tail.sh npx vitest run tests/build --reporter=default --reporter=json --outputFile=$O/build-tests.json" > $O/build-tests.txt 2>&1
echo "build-tests rc=$? $(grep -E 'Test Files|Tests ' $O/build-tests.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
mx sh -c "cd $W && sh scripts/gate-tail.sh npx vitest run tests/lint/writerReach.walker.test.js" > $O/writer.txt 2>&1
echo "writer rc=$? $(grep -E 'Test Files|Tests ' $O/writer.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
echo "qb END $(date -u +%FT%TZ)" >> $L
