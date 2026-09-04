#!/bin/sh
# run-pregate-891b.sh — the pre-gate (cheap stages) at the §891 tip; the two instruments are copied in from
# the lane branch's extraction at /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/pregate and DELETED after (untracked files fail the seal's porcelain).
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree
cd $D || exit 9
cp /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/pregate/pre-gate.mjs /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/pregate/pre-gate.sh $D/scripts/ || exit 9
echo "PREGATE_HEAD=$(git rev-parse HEAD)"
sh scripts/pre-gate.sh
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
rm -f $D/scripts/pre-gate.mjs $D/scripts/pre-gate.sh
echo "PORCELAIN_AFTER_CLEANUP=[$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
