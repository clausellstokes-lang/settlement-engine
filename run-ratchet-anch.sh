#!/bin/sh
# run-ratchet-anch.sh — census totals at the ANCHORS consist tip. Quiet-window law; exits captured.
# ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/laneANCH2
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
echo "PREDICTED (derived 2026-09-05 at the composed tip 272dbd2da = clamp 14 cars + ANCHORS 3 cars): totalFiles 2468 UNCHANGED (0 test files added, git diff --diff-filter=A). totalTests: baseline 31489; the lane counted 588 -> 590 in tests/domain/rumorFallbackPhrasePools.test.js, so +2 is the EXPECTATION and the figure is REFUSED IN ADVANCE — this run IS the derivation. entries 6 -> 6. Lighting: the dock register (measured ff9b7a53c) reads 2521/371/2150/23184/6214 and the probe at 272dbd2da reads 2521/371/2150/23184/6214 — ALL FIVE +0, NO lighting act is owed (the +2 tests sit under describe.each and are census-invisible)."
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print('MEASURED: totalTests=%s totalFiles=%s entries=%s'%(d.get('totalTests'),d.get('totalFiles'),len(d.get('entries',{}))))"
echo "RATCHET_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
