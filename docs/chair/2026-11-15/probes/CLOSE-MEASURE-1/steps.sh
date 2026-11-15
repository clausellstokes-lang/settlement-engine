#!/bin/sh
# run every step of `check` separately, record exit + wall time
cd /home/user/cmwt
OUT=/home/user/cmout/${1:-r1}
mkdir -p $OUT
: > $OUT/summary.txt
for s in validate:hazard-registry validate:premortem validate:packets validate:data validate:custom-content-manifest validate:migration-head validate:edge validate:map validate:tuning-bands validate:foundry-module validate:mcp-server typecheck:ratchet typecheck:domain:strict lint test:ratchet build verify:dist; do
  t0=$(date +%s)
  npm run $s > $OUT/$s.log 2>&1
  rc=$?
  t1=$(date +%s)
  echo "$s rc=$rc secs=$((t1-t0))" >> $OUT/summary.txt
done
echo DONE >> $OUT/summary.txt
