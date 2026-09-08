#!/bin/sh
# after-cas-913.sh — ONE command from a green gate log to the §913 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneLMAT; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=3b1c0eaa51f77561a036ae7ec54682c39856192c; LOG=$SC/gate-913.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=9$' "$LOG" || { echo "⛔ gate did not run over 9 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 9 > $SC/chair-verify-913.out 2>&1 || { tail -6 $SC/chair-verify-913.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-913.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-lmat-2026-09-07 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-913.sha
echo "CAS OK: product=$SHORT · sealed landing-lmat-2026-09-07 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-913.template.json > $SC/payload-913.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-913.json; then echo "⛔ unfilled placeholder in payload-913"; exit 1; fi
sh $SC/collect-913.sh > $SC/collect-913.out 2>&1 || { tail -15 $SC/collect-913.out; echo "⛔ collect-913 failed — stop"; exit 1; }
tail -8 $SC/collect-913.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§913:' || { echo "⛔ §913 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
