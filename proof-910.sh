#!/bin/sh
# proof-910.sh — the §910 whole-suite PROOF at the SOAK-HONEST-909 tip (EXPECT_CARS cars over 6ebe0ef3b: the lane cars) IN laneB6
# itself (the lane is done): typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole suite under the mutex with NO filter (PROOF_EXIT=).
# Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-910.log` after. Drafted 2026-09-07 03:08 from proof-908.sh by substitution (chair, session b43943b4); a QUIET-WINDOW probe precedes the suite (two research runs are alive).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneB6; cd "$D" || exit 9
[ -f $SC/HOLD-VITEST ] || { echo "REFUSED: write $SC/HOLD-VITEST first (no lane vitest during the proof)"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count after the SOAK-HONEST-909 lane reports}
[ "$(git rev-list --count 6ebe0ef3bd2e7fa0f5d0ede5c93780ecfbf3aada..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 6ebe0ef3b, found $(git rev-list --count 6ebe0ef3bd2e7fa0f5d0ede5c93780ecfbf3aada..HEAD)"; exit 8; }
[ "$(git merge-base HEAD 6ebe0ef3bd2e7fa0f5d0ede5c93780ecfbf3aada)" = "6ebe0ef3bd2e7fa0f5d0ede5c93780ecfbf3aada" ] || { echo "REFUSED: HEAD does not descend from 6ebe0ef3b"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do
  L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')
  OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi
  echo "  probe: load=$L workers=$V streak=$STREAK waited=${WAITED}s"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }
done
echo "QUIET CONFIRMED after ${WAITED}s"
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-910.log
npm run typecheck:ratchet >> $SC/typecheck-910.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-910.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-910.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-910.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-910.log
