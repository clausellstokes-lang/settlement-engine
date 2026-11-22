#!/bin/sh
# R5C6: the full pool's DIFFERENTIAL and COUNT arms in K shards side by side (one gate hold); each shard to its own log.
# usage (under the gate mutex and gate-tail): sh R5C6-shards.sh <k> <vitest -t pattern>
cd /home/user/wt/r5c || exit 2
O=docs/chair/2026-11-20/veil/out/v33/r5recent
K="$1"; PAT="$2"; i=0; pids=""
while [ "$i" -lt "$K" ]; do
  R5C6_POOL=full R5C6_SHARD="$i/$K" R5R_MEASURES="$PWD/$O/R5C6-pool.measures.txt" npx vitest run --maxWorkers=1 -t "$PAT" tests/security/galleryVeilRecent.pglite.test.js > "$O/R5C6-shard$i.log" 2>&1 &
  pids="$pids $!"; i=$((i + 1))
done
rc=0; for p in $pids; do wait "$p" || rc=1; done
for f in "$O"/R5C6-shard*.log; do echo "== $f"; grep -E "Tests |Test Files|×" "$f"; done
exit $rc
