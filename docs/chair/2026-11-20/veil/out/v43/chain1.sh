#!/bin/sh
# VEIL-43 unit (1)(c) REDS and (d) HOOKS on the joined tree. Each vitest run writes a JSON report (failing tests by name).
# Run as: sh scripts/gate-mutex.sh --run -- sh <this>   (from /home/user/join43), AFTER chain0 has ended.
W=/home/user/join43; D=/home/user/settlement-engine/docs/chair/2026-11-20/veil/out/v43; O=/var/tmp/v18/out/v43/c1; L=$O/done.txt
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
export PGHOST=/var/tmp/rv7 PGUSER=postgres
mkdir -p $O; cd $W; echo "start $(date -u +%H:%M:%S) at $(git rev-parse --short HEAD)" > $L
git grep -l -E "galleryPayloadFor|applyVeil|projectShareVeil|get_gallery_dossier|get_unlisted_dossier" -- tests ':!tests/security' > $O/named-files.txt
$E sh scripts/gate-tail.sh npx vitest run tests/lint --reporter=default --reporter=json --outputFile=$O/lint.json > $O/lint.txt 2>&1; echo "lint rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run $(cat $O/named-files.txt) --reporter=default --reporter=json --outputFile=$O/named.json > $O/named.txt 2>&1; echo "named rc=$? $(date -u +%H:%M:%S)" >> $L
$E sh scripts/gate-tail.sh npx vitest run tests/security --maxWorkers=2 --reporter=default --reporter=json --outputFile=$O/security.json > $O/security.txt 2>&1; echo "security rc=$? $(date -u +%H:%M:%S)" >> $L
sh $D/hookgap/hookgap.sh $W $O/hookgap v28tpl 40 > $O/hookgap-run.txt 2>&1; echo "hookgap rc=$? $(tail -1 $O/hookgap-run.txt)" >> $L
echo "END $(date -u +%H:%M:%S)" >> $L
