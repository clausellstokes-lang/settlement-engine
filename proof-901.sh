#!/bin/sh
# proof-901.sh — the §901 whole-suite PROOF at the composed tip d75e807a6 in laneLIGHTPROOF, re-run after the 2026-09-05 19:12 reboot
# killed the first run (pid 6776, its log lost with the old scratchpad). typecheck:ratchet FIRST (TYPECHECK_EXIT=), then the whole
# suite under the mutex with NO filter (PROOF_EXIT=). Every exit captured in-shell. Read `python3 chair-tools/reds-by-block.py whole-901.log` after.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLIGHTPROOF; cd "$D" || exit 9
[ "$(git rev-parse --short HEAD)" = "d75e807a6" ] || { echo "REFUSED: dock not at d75e807a6"; exit 8; }
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/typecheck-901.log
npm run typecheck:ratchet >> $SC/typecheck-901.log 2>&1; echo "TYPECHECK_EXIT=$? $(date '+%H:%M:%S')" >> $SC/typecheck-901.log
echo "PROOF_HEAD=$(git rev-parse HEAD) start $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" > $SC/whole-901.log
sh scripts/gate-mutex.sh --run -- npx vitest run >> $SC/whole-901.log 2>&1; E=$?
echo "PROOF_EXIT=$E $(date '+%H:%M:%S') load=$(uptime | sed 's/.*averages: //')" >> $SC/whole-901.log
