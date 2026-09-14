#!/bin/sh
# run-ratchet-920.sh — census totals at the §920 consist tip (stamped). Quiet-window law; exits captured.
# ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW
cd $D || exit 9
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
echo "RATCHET_HEAD=$(git rev-parse HEAD)"
echo "RATCHET_PORCELAIN_PRE=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
echo "PREDICTED: __PREDICTION__ (derive EVERY figure before this runs — E4; totalTests is REFUSED in advance, this run is the derivation)"
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print('MEASURED: totalTests=%s totalFiles=%s entries=%s'%(d.get('totalTests'),d.get('totalFiles'),len(d.get('entries',{}))))"
echo "RATCHET_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
