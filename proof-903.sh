#!/bin/sh
# proof-902.sh — the §902 whole-suite PROOF at the OSR rung-18 tip 6ff3249b9 (2 cars over b0cbc67a1, laneOSR18) in the fresh dock
# laneLDEFPROOF: typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole suite under the mutex with NO filter (PROOF_EXIT=).
# Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-903.log` after. Launched 2026-09-06 08:15.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLDEFPROOF; cd "$D" || exit 9
[ "$(git rev-parse --short HEAD)" = "6ff3249b9" ] || { echo "REFUSED: dock not at 6ff3249b9"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-903.log
npm run typecheck:ratchet >> $SC/typecheck-903.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-903.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-903.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-903.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-903.log
