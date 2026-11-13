#!/bin/sh
# gates at a tip: strict-domain, type ratchet, eslint on the touched files (each via gate-tail, exit captured)
run(){ t=$1; L=$2; cd /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/wt/$t || exit 1
  for g in "npm run typecheck:domain:strict" "npm run typecheck:ratchet" "npx eslint $(cat /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/gates/$L.files | tr '\n' ' ')"; do
    echo "== $t :: $g" ; TMPDIR=/tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/gates sh scripts/gate-tail.sh -n 15 $g; echo "EXIT=$?"; done; }
run a-tip A > /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/gates/a-tip.log 2>&1
run b-tip B > /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/gates/b-tip.log 2>&1
run c-tip C > /tmp/claude-0/-home-user-settlement-engine/ed9a7fac-3574-5fcd-a762-3429f90b7a9d/scratchpad/gates/c-tip.log 2>&1
echo GATES-DONE
