#!/bin/sh
# run-ratchet-902.sh — census totals at the §902 consist tip (stamped). Quiet-window law; exits captured.
# ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneOSR18
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
echo "PREDICTED: derived 2026-09-06 at the rung-18 tip (4 cars over b0cbc67a1: the rung, the genesis, two provenance-only register cars): totalFiles 2489 UNCHANGED (0 test files added or deleted — git diff --diff-filter=AD b0cbc67a1..HEAD -- tests is empty; the lighting census measured the same); entries 5 → 3 — the two writerReach rows (corpusMeta / shapesDigest vs OSR) are GREEN at this tip (both registers carry simulationFlagsLit 81; 0 writerReach FAIL lines in whole-902.log) and a remove-only --update RETIRES them; the voice per-file row (magnitude 2 ≤ 2), enforcement-claims and the golden master persist (the proof's three reds); skippedCeiling unchanged (111 skipped, as at §901); totalTests REFUSED in advance — this run derives it (the proof counted 32,429 incl. 111 skipped, the same as §901: no test was added) (derive EVERY figure before this runs — E4; totalTests is REFUSED in advance, this run is the derivation)"
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print('MEASURED: totalTests=%s totalFiles=%s entries=%s'%(d.get('totalTests'),d.get('totalFiles'),len(d.get('entries',{}))))"
echo "RATCHET_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
