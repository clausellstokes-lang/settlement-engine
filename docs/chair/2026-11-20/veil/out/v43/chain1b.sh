#!/bin/sh
# VEIL-43 unit (1)(c)/(d), the part of chain1 its queue's time limit killed (2026-11-23, in tests/security): tests/security whole, then the hook gap, on the JOINED tree.
W=/home/user/join43; D=/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v43; O=/var/tmp/v18/out/v43/c1; L=$O/done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
cd $W; echo "restart (chain1b) $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2 --reporter=default --reporter=json --outputFile=$O/security.json > $O/security.txt 2>&1; echo "security rc=$? $(date -u +%H:%M:%S)" >> $L
sh $D/hookgap/hookgap.sh $W $O/hookgap v28tpl 40 > $O/hookgap-run.txt 2>&1; echo "hookgap rc=$? $(tail -1 $O/hookgap-run.txt)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
