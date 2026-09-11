#!/bin/sh
# proof-912.sh — the §912 whole-suite PROOF at the L-MAT tip (EXPECT_CARS cars over 3b1c0eaa5: the lane cars) IN laneLMAT
# itself (the lane is done): typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole suite under the mutex with NO filter (PROOF_EXIT=).
# Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-912.log` after. Drafted 2026-09-07 03:08 from proof-908.sh by substitution (chair, session b43943b4); a QUIET-WINDOW probe precedes the suite (S12 runs no vitest; the skeptic pass must be COMPLETE first).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLMAT; cd "$D" || exit 9
[ -f $SC/HOLD-VITEST ] || { echo "REFUSED: write $SC/HOLD-VITEST first (no lane vitest during the proof)"; exit 8; }
EXPECT_CARS=${EXPECT_CARS:?set EXPECT_CARS to the dock car count after the L-MAT lane reports}
[ "$(git rev-list --count 3b1c0eaa51f77561a036ae7ec54682c39856192c..HEAD)" = "$EXPECT_CARS" ] || { echo "REFUSED: expected $EXPECT_CARS cars over 3b1c0eaa5, found $(git rev-list --count 3b1c0eaa51f77561a036ae7ec54682c39856192c..HEAD)"; exit 8; }
[ "$(git merge-base HEAD 3b1c0eaa51f77561a036ae7ec54682c39856192c)" = "3b1c0eaa51f77561a036ae7ec54682c39856192c" ] || { echo "REFUSED: HEAD does not descend from 3b1c0eaa5"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do
  L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')
  OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi
  echo "  probe: load=$L workers=$V streak=$STREAK waited=${WAITED}s"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }
done
echo "QUIET CONFIRMED after ${WAITED}s"
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-912.log
npm run typecheck:ratchet >> $SC/typecheck-912.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-912.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-912.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-912.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-912.log
