#!/bin/sh
# run-gate-914.sh — the §914 consist's bare gate (npm run check), stamped by mk-landing-kit.py;
# base f3ab08f51. Quiet-window law. ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT:
# a background task reports its LAST command's exit, and a trailing printf once reported 0 over a red gate.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR2
BASE=f3ab08f5194201d19f99f8905068783b62fbfaf8   # the declared base; the guards below refuse to run unless the product tip IS this sha
cd $D || exit 9
[ "$(git rev-parse claude/composite-r4)" = "$(git rev-parse f3ab08f5194201d19f99f8905068783b62fbfaf8)" ] || { echo "REFUSED: product tip $(git rev-parse --short claude/composite-r4) is not the declared base f3ab08f51 — land the previous consist first"; exit 7; }
[ "$(git merge-base HEAD claude/composite-r4)" = "$(git rev-parse claude/composite-r4)" ] || { echo "REFUSED: dock HEAD does not descend from the product tip"; exit 7; }
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do
  L=$(uptime | sed 's/.*averages: //' | awk '{print $1}')
  V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')
  OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}')
  if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi
  echo "  probe: load=$L workers=$V streak=$STREAK waited=${WAITED}s"
  [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60))
  [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }
done
echo "QUIET CONFIRMED after ${WAITED}s"
echo "GATE_HEAD=$(git rev-parse HEAD)"
CARS=$(git rev-list --count $BASE..HEAD); echo "GATE_CARS=$CARS"
[ "$CARS" = "18" ] || { echo "REFUSED: expected 18 cars over $BASE, found $CARS"; exit 7; }
echo "GATE_PORCELAIN_PRE=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
echo "GATE_LOAD_PRE=$(uptime | sed 's/.*averages: //')"
echo "GATE_START=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
npm run check
TRUE_EXIT=$?
echo "GATE_END=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "TRUE_EXIT=$TRUE_EXIT"
echo "GATE_LOAD_POST=$(uptime | sed 's/.*averages: //')"
echo "GATE_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
echo "GATE_HEAD_POST=$(git rev-parse HEAD)"
exit $TRUE_EXIT
