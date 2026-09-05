#!/bin/sh
# after-cas-901.sh — ONE command from a green gate log to the §901 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLIGHTINT; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=04bb92d19735594718e61b271d5bdf4ddfd4a2cc; LOG=$SC/gate-901.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=24$' "$LOG" || { echo "⛔ gate did not run over 24 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 24 > $SC/chair-verify-901.out 2>&1 || { tail -6 $SC/chair-verify-901.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-901.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-lighting-2026-09-05 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-901.sha
echo "CAS OK: product=$SHORT · sealed landing-lighting-2026-09-05 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-901.template.json > $SC/payload-901.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-901.json; then echo "⛔ unfilled placeholder in payload-901"; exit 1; fi
sh $SC/collect-901.sh > $SC/collect-901.out 2>&1 || { tail -15 $SC/collect-901.out; echo "⛔ collect-901 failed — stop"; exit 1; }
tail -8 $SC/collect-901.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§901:' || { echo "⛔ §901 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
