#!/bin/sh
# after-cas-920.sh — ONE command from a green gate log to the §920 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=$SC/laneRW-DEFW; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=f73bdbf16d3f7a57c18d7fd57b0478b953043a73; LOG=$SC/gate-920.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=11$' "$LOG" || { echo "⛔ gate did not run over 11 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 11 > $SC/chair-verify-920.out 2>&1 || { tail -6 $SC/chair-verify-920.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-920.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-rewrite-8b-defense-2026-09-09 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-920.sha
echo "CAS OK: product=$SHORT · sealed landing-rewrite-8b-defense-2026-09-09 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-920.template.json > $SC/payload-920.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-920.json; then echo "⛔ unfilled placeholder in payload-920"; exit 1; fi
sh $SC/collect-920.sh > $SC/collect-920.out 2>&1 || { tail -15 $SC/collect-920.out; echo "⛔ collect-920 failed — stop"; exit 1; }
tail -8 $SC/collect-920.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§920:' || { echo "⛔ §920 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
