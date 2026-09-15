#!/bin/sh
P=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f86a239c-ba8e-464d-a904-e4b70a0c4b2e/scratchpad
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
sh $P/c930/run-registers-930.sh
echo "=== 8. WIRING CENSUS — dry (three lanes regenerated the stamp; the merge must be CURRENT) ==="
cd $SC/kit/laneCONSIST-930 && node scripts/wiring-census.mjs --dry 2>&1 | tail -3 | cut -c1-200; echo "WIRING_DRY_EXIT=$?"
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/proseWiringCensus.walker.test.js 2>&1 | grep -E 'Test Files|Tests |FAIL|×' | head -6; echo "WIRING_WALKER_DONE"
echo "REGISTERS_931_DONE $(uptime) porcelain=[$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
