#!/bin/sh
S=/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad; B=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7; O=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/before-after
for t in line cures batch; do for c in C V; do
  $S/run-node.sh record-$t-$c node $S/bin/record-of.mjs /home/user/wt/ba-$t $O/plans/plan-$c.json $O/records/record-$t-$c.tsv; echo "record-$t-$c rc=$? $(date +%T)"
  $S/run-node.sh food-$t-$c node $B/mirror/food-of.mjs /home/user/wt/ba-$t $O/plans/plan-$c.json $O/food/food-$t-$c.jsonl; echo "food-$t-$c rc=$? $(date +%T)"
done; done
for j in "line C small" "cures C large" "cures C small" "batch C large" "batch C small" "line V large" "line V small" "cures V large" "cures V small" "batch V large" "batch V small"; do
  $S/run-battery.sh $j; echo "battery $j rc=$? $(date +%T)"
done
echo QUEUE-DONE
