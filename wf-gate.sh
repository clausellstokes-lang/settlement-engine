#!/bin/sh
# wf-gate.sh <batchN> <prev-packet-basename>  — THE GATE for the warFaith clarity lane.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad
D=$SC/kit/lane-clarity-WARFAITH
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f86a239c-ba8e-464d-a904-e4b70a0c4b2e/scratchpad
N=$1; PREV=$2
cd "$D"
echo "===== (0) REGENERATE + CHECK ====="
node scripts/generate-dossier-state-prose.mjs
node scripts/generate-dossier-state-prose.mjs --check
echo "===== (1) WIRING CENSUS --check ====="
node scripts/wiring-census.mjs --check
echo "===== (2) SWEEP vs $3 ====="
node $SC/kit/rewrite/clarity-sweep.mjs "$D" '### DS-WAR-' "$3" > .packets/sweep-war-$N.txt 2>&1 || true
node $SC/kit/rewrite/clarity-sweep.mjs "$D" '### DS-FTH-' "$3" > .packets/sweep-fth-$N.txt 2>&1 || true
node $SC/kit/rewrite/clarity-sweep.mjs "$D" '### DS-REL-' "$3" > .packets/sweep-rel-$N.txt 2>&1 || true
tail -1 .packets/sweep-war-$N.txt; tail -1 .packets/sweep-fth-$N.txt; tail -1 .packets/sweep-rel-$N.txt
echo "--- STOP CONDITIONS ---"
/usr/bin/grep -c 'LEVEL1 ORDER .* LOST ON A SPINE' .packets/sweep-*-$N.txt || true
/usr/bin/grep -h 'PROVENANCE ADDED\|HISTORY ADDED\|⛔' .packets/sweep-*-$N.txt || echo "(none)"
echo "===== (3) THE FIVE SUITES ====="
sh scripts/gate-mutex.sh --run -- npx vitest run tests/data/dossierStateProseProjection.contract.test.js tests/lint/proseComposed.walker.test.js tests/lint/proseMoveGrammar.walker.test.js tests/domain/stateProseKernel.test.js tests/domain/composeStateProse.test.js 2>&1 | tail -25
echo "===== (4) WAVE GATE ====="
node scripts/prose-wave-gate.mjs --section warFaith --out .packets/wave-warfaith-batch$N.json > .packets/wave-warfaith-batch$N.log 2>&1
echo "wave rc=$?"
python3 $MY/gatediff.py .packets/$PREV.json .packets/wave-warfaith-batch$N.json
