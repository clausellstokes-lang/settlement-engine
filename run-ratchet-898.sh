#!/bin/sh
# run-ratchet-898.sh — census totals at the §898 consist tip (stamped). Quiet-window law; exits captured.
# ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/lanePROSE2
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
echo "PREDICTED: totalFiles 2468 UNCHANGED (the 3 prose cars add no test file; the register car adds none) · totalTests REFUSED as a figure — this run IS the derivation (expect a small move from the re-recorded fence and the voice arms turning green) · entries 6 -> 4 (the voiceMechanics Tier-2 TOTAL and per-file rows RETIRE after the refreeze; the two JSX rows, enforcement-claims and clampPrimitiveBaseline stay) · lighting: probe == register expected (no titles moved; the farmed probe re-checks at the tip) (derive EVERY figure before this runs — E4; totalTests is REFUSED in advance, this run is the derivation)"
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print('MEASURED: totalTests=%s totalFiles=%s entries=%s'%(d.get('totalTests'),d.get('totalFiles'),len(d.get('entries',{}))))"
echo "RATCHET_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
