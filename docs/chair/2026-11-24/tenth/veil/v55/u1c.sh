#!/bin/sh
# VEIL-55: unit 1's slice, the two pieces u1.sh missed: (a) galleryVeilIds on the merged tip (its path was mangled in u1.sh);
# (b) tests/lint whole at the PRE-MERGE tip 8430edf5c (the main checkout), for a title-for-title comparison with the merged tip.
O=/var/tmp/v55/out/u1; L=/var/tmp/v55/u1.log; W=/home/user/wt/tipm
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
mx sh -c "cd $W && sh scripts/gate-tail.sh npx vitest run tests/security/galleryVeilIds.pglite.test.js --maxWorkers=1" > $O/ids.txt 2>&1
echo "ids rc=$? $(grep -E 'Test Files|Tests ' $O/ids.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
mx sh -c "cd /home/user/settlement-engine && sh scripts/gate-tail.sh npx vitest run tests/lint --reporter=default --reporter=json --outputFile=$O/lint-base.json" > $O/lint-base.txt 2>&1
echo "lint-base rc=$? $(grep -E 'Test Files|Tests ' $O/lint-base.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
echo "u1c END $(date -u +%FT%TZ)" >> $L
