#!/bin/sh
# proof-904.sh — the §904 whole-suite PROOF at the L-UI-MAT tip (2 cars over dd5f13218: the L-UI car c2337220a + the CHAIR-904 car) IN laneLUIMAT
# itself (the lane is done): typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole suite under the mutex with NO filter (PROOF_EXIT=).
# Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-904.log` after. Drafted 2026-09-06 18:00 from proof-903.sh; a QUIET-WINDOW probe precedes the suite (two research runs are alive).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLUIMAT; cd "$D" || exit 9
[ -f $SC/HOLD-VITEST ] || { echo "REFUSED: write $SC/HOLD-VITEST first (no lane vitest during the proof)"; exit 8; }
[ "$(git rev-list --count dd5f1321825b58fed2db54e9473440a310195eed..HEAD)" = "2" ] || { echo "REFUSED: expected 2 cars over dd5f13218, found $(git rev-list --count dd5f1321825b58fed2db54e9473440a310195eed..HEAD)"; exit 8; }
[ "$(git merge-base HEAD dd5f1321825b58fed2db54e9473440a310195eed)" = "dd5f1321825b58fed2db54e9473440a310195eed" ] || { echo "REFUSED: HEAD does not descend from dd5f13218"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do
  L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers')
  OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi
  echo "  probe: load=$L workers=$V streak=$STREAK waited=${WAITED}s"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }
done
echo "QUIET CONFIRMED after ${WAITED}s"
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-904.log
npm run typecheck:ratchet >> $SC/typecheck-904.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-904.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-904.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-904.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-904.log
