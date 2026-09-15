#!/bin/sh
# after-cas-931.sh <expected-cars> — from a green gate log to the CAS of claude/composite-r4 and the landing seal. The §931 ledger
# act is a SEPARATE chair step (chair-commit.sh --require-ref). Guard + consequence together. POSIX sh.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
MY=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/f6ac0d98-bb14-48ae-88d1-c6887f1e2704/scratchpad
D=$SC/laneCONSIST-930; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=f73bdbf16d3f7a57c18d7fd57b0478b953043a73; LOG=$MY/c931/gate-931.log; N=${1:?expected cars}
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q "^GATE_CARS=$N\$" "$LOG" || { echo "⛔ gate did not run over $N cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
[ "$(grep -oE '^GATE_HEAD=[0-9a-f]+' "$LOG" | cut -d= -f2)" = "$(git -C "$D" rev-parse HEAD)" ] || { echo "⛔ the gate ran at a different head than the dock's — stop"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" "$N" > $MY/c931/chair-verify-931.out 2>&1 || { tail -8 $MY/c931/chair-verify-931.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $MY/c931/chair-verify-931.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-longtail-2026-09-15 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $MY/c931/cas-931.sha
echo "CAS OK: product=$SHORT · sealed landing-longtail-2026-09-15 · cars over f73bdbf16=$N · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4) · tests=$TESTS"
echo "NEXT: rm $SC/../HOLD-VITEST is NOT yet — first the §931 ledger act via chair-commit.sh --require-ref refs/preserve/landing-longtail-2026-09-15 $NEW, then rm HOLD."
