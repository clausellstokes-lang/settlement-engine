#!/bin/sh
# VEIL-43 (the chair's N107): tests/copy WHOLE on the join and on the lane's tip, by name (classed by fails.mjs against RED-AT-LINE).
E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"
O=/var/tmp/v18/out/v43/copy; mkdir -p $O; L=$O/done.txt; echo "start $(date -u +%H:%M:%S)" > $L
for t in join43 lanetip; do cd /home/user/$t
  $E sh scripts/gate-tail.sh npx vitest run tests/copy --reporter=default --reporter=json --outputFile=$O/$t.json > $O/$t.txt 2>&1; echo "$t rc=$? at $(git rev-parse --short HEAD) $(date -u +%H:%M:%S)" >> $L
done; echo "END $(date -u +%H:%M:%S)" >> $L
