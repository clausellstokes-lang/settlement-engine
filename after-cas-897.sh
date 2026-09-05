#!/bin/sh
# after-cas-897.sh — ONE command from a green ANCHORS gate log to the §897 ledger act. POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneANCH2; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=df7cdd37e11bde8365c0322f0c882f61988865d5; LOG=$SC/gate-anch.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=4$' "$LOG" || { echo "⛔ gate did not run over 4 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 4 > $SC/chair-verify-897.out 2>&1 || { tail -6 $SC/chair-verify-897.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-897.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-anchors-2026-09-05 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-897.sha
echo "CAS OK: product=$SHORT · sealed landing-anchors-2026-09-05 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-897.template.json > $SC/payload-897.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-897.json; then echo "⛔ unfilled placeholder in payload-897"; exit 1; fi
sh $SC/collect-897.sh > $SC/collect-897.out 2>&1 || { tail -15 $SC/collect-897.out; echo "⛔ collect-897 failed — stop"; exit 1; }
tail -8 $SC/collect-897.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§897:' || { echo "⛔ §897 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
