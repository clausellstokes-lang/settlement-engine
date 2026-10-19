#!/bin/sh
# D-PR-r2 token census: rg -w on master src/tests/docs and the ledger docs (excluding PR's own volume)
M="$1"; L="$2"
for t in watchOf placementOf fireLevel watchedFireLevel riders_seen threat_seen crossing_seen nothing_found fortWill CAMPAIGN_SHARE JOINT_FLOOR CADENCE_DWELL K_CORRIDOR fundingBandOfSettlement slowShare patrolPhase PEACE_POSTURE_W PEACE_ALIGN_W placement; do
  s=$(rg -l -w "$t" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  te=$(rg -l -w "$t" "$M/tests" 2>/dev/null | wc -l | tr -d ' ')
  d=$(rg -l -w "$t" "$L" --glob '!DESIGN_FP_ARCH_PR.md' 2>/dev/null | wc -l | tr -d ' ')
  lit=$(rg -l "['\"]$t['\"]" "$M/src" 2>/dev/null | wc -l | tr -d ' ')
  echo "$t	src=$s	tests=$te	ledgerDocs=$d	srcLiteral=$lit"
done
