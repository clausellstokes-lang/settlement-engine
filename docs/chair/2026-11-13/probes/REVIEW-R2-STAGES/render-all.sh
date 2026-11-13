#!/bin/sh
for t in a-tip ab-base b-tip c-tip c-base; do
  echo "== $t $(date -u +%T)"; sh /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/probes/render.sh /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/wt/$t /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/r20/$t /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/probes/seeds20.txt 4
done
echo DONE $(date -u +%T)
