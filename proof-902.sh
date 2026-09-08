#!/bin/sh
# proof-902.sh — the §902 whole-suite PROOF at the OSR rung-18 tip a05a4646e (2 cars over b0cbc67a1, laneOSR18) in the fresh dock
# laneOSR18PROOF: typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole suite under the mutex with NO filter (PROOF_EXIT=).
# Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-902.log` after. Launched 2026-09-05 21:36.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneOSR18PROOF; cd "$D" || exit 9
[ "$(git rev-parse --short HEAD)" = "a05a4646e" ] || { echo "REFUSED: dock not at a05a4646e"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-902.log
npm run typecheck:ratchet >> $SC/typecheck-902.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-902.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-902.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-902.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-902.log
