#!/bin/sh
# VEIL-55: FAIL-CLOSED PAGES (VEIL-53, 04fa8d60e on 1ffb2328b) red and green on a slice: its component tests RED on 1ffb2328b
# (the -wip's test files in scratch worktree /home/user/wt/fcred) and GREEN with the walker on 04fa8d60e (/home/user/wt/fc).
O=/var/tmp/v55/out/fc; L=/var/tmp/v55/fc.log; mkdir -p $O
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
mx() { (cd /home/user/settlement-engine && $E GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- "$@"); }
T="tests/components/failClosedSharedPage.test.jsx tests/components/defenseRingNoteProjection.test.jsx tests/components/publicProseEquality.test.jsx"
mx sh -c "cd /home/user/wt/fcred && sh scripts/gate-tail.sh npx vitest run $T --maxWorkers=1" > $O/red.txt 2>&1
echo "red rc=$? $(grep -E 'Test Files|Tests ' $O/red.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
mx sh -c "cd /home/user/wt/fc && sh scripts/gate-tail.sh npx vitest run $T tests/lint/failClosedPages.walker.test.js --maxWorkers=1" > $O/green.txt 2>&1
echo "green rc=$? $(grep -E 'Test Files|Tests ' $O/green.txt | tr '\n' ' ') $(date -u +%FT%TZ)" >> $L
echo "fc END $(date -u +%FT%TZ)" >> $L
