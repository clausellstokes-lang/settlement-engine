#!/bin/sh
# enc4-proofs-899.sh — ENC-4's OWED vitest registration proofs, run by the chair at the composed tip under the quiet-window law
# and the gate mutex. Every exit captured; the last line is exit $TRUE_EXIT.
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneCLAMP3; cd "$D" || exit 9
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers'); OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi; echo "  probe: load=$L workers=$V streak=$STREAK waited=${WAITED}s"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 5400 ] && { echo "GAVE UP"; exit 8; }; done
echo "QUIET CONFIRMED after ${WAITED}s"; echo "PROOFS_HEAD=$(git rev-parse HEAD)"
FILES=$(ls tests/lint/*hance*eeting* tests/lint/kindPoolFloors.walker.test.js tests/lint/chooserTotality.walker.test.js tests/domain/*envoyChanceMeeting* tests/domain/*chanceMeeting* 2>/dev/null | sort -u | tr '\n' ' ')
echo "FILES: $FILES"
sh scripts/gate-mutex.sh --run -- npx vitest run $FILES > "$SC/enc4-proofs-1.log" 2>&1; E1=$?; echo "ENC4_SUITES_EXIT=$E1"; grep -E 'Test Files|Tests ' "$SC/enc4-proofs-1.log" | cut -c1-80
sh scripts/gate-mutex.sh --run -- npx vitest run tests/copy/ > "$SC/enc4-proofs-2.log" 2>&1; E2=$?; echo "COPY_EXIT=$E2"; grep -E 'Test Files|Tests ' "$SC/enc4-proofs-2.log" | cut -c1-80
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/ > "$SC/enc4-proofs-3.log" 2>&1; E3=$?; echo "LINT_EXIT=$E3"; grep -E 'Test Files|Tests ' "$SC/enc4-proofs-3.log" | cut -c1-80
echo "--- failing arms in tests/lint (expect only banked rows: enforcement-claims; NOT clampPrimitiveBaseline any more; NOT voice):"; grep -E '^ FAIL|✗|×' "$SC/enc4-proofs-3.log" | head -12 | cut -c1-160
TRUE_EXIT=$(( E1 != 0 ? E1 : 0 )); echo "TRUE_EXIT=$TRUE_EXIT (the ENC-4 suites; tests/copy and tests/lint verdicts read from their lines)"
exit $TRUE_EXIT
