#!/bin/sh
# VEIL-43 unit (1)(c): the LANE TIP's own reds by name (23bb8b8ae, scratch worktree /home/user/lanetip), for the class "the lane's own at its tip".
# Run as: sh scripts/gate-mutex.sh --run -- sh <this>   (from /home/user/join43)
T=/home/user/lanetip; O=/var/tmp/v18/out/v43/c1lane; L=$O/done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mkdir -p $O; cd $T; echo "start $(date -u +%H:%M:%S) at $(git rev-parse --short HEAD)" > $L
$E sh scripts/gate-tail.sh npx vitest run tests/lint --reporter=default --reporter=json --outputFile=$O/lint.json > $O/lint.txt 2>&1; echo "lint rc=$? $(date -u +%H:%M:%S)" >> $L
for f in $(cat /var/tmp/v18/out/v43/c1/named-files.txt); do [ -f $f ] && echo $f; done > $O/named-files.txt
$E sh scripts/gate-tail.sh npx vitest run $(cat $O/named-files.txt) --reporter=default --reporter=json --outputFile=$O/named.json > $O/named.txt 2>&1; echo "named rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2 --reporter=default --reporter=json --outputFile=$O/security.json > $O/security.txt 2>&1; echo "security rc=$? $(date -u +%H:%M:%S)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
