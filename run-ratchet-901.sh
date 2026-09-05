#!/bin/sh
# run-ratchet-901.sh — census totals at the §901 consist tip (stamped). Quiet-window law; exits captured.
# ⚠ THE LAST LINE IS `exit $TRUE_EXIT` AND NOTHING MAY FOLLOW IT.
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLIGHTINT
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
echo "PREDICTED: derived 2026-09-05 at the lighting tip 47aed9eb4 (24 cars over 04bb92d19): totalFiles 2483 → 2489 (+6 test files ADDED, 0 deleted, 0 renamed — git diff --diff-filter=A 04bb92d19..HEAD -- tests: four property dormancy fences, presetLightingWitness, warRemembranceReader.jsx; the lighting census measured the same +6, 2537 → 2543); entries 5 → 5 (the five banked rows persist: voiceMechanics per-file debt magnitude 2 ≤ ceiling 2 — the same two files, labelBands +5 and generalStateProse +3, byte-identical to §900; enforcement-claims; writerReach corpusMeta and shapesDigest at 81 ≤ ceiling 81 — register car 2 kept simulationFlagsLit 81; the generator golden master, the declared shift); skippedCeiling unchanged (the proof skipped 111, as at §900) (derive EVERY figure before this runs — E4; totalTests is REFUSED in advance, this run is the derivation)"
sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs --update
TRUE_EXIT=$?
echo "TRUE_EXIT=$TRUE_EXIT"
python3 -c "import json;d=json.load(open('scripts/.test-ratchet-baseline.json'));print('MEASURED: totalTests=%s totalFiles=%s entries=%s'%(d.get('totalTests'),d.get('totalFiles'),len(d.get('entries',{}))))"
echo "RATCHET_PORCELAIN_POST=[$(git status --porcelain -uall | wc -l | tr -d ' ')]"
exit $TRUE_EXIT
