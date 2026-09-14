#!/bin/sh
# after-cas-919.sh — ONE command from a green gate log to the §919 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=$SC/laneREWRITE; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=29ec62425faa8e4c4e61b34e38ff871cc8e599a9; LOG=$SC/gate-919.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=27$' "$LOG" || { echo "⛔ gate did not run over 27 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 27 > $SC/chair-verify-919.out 2>&1 || { tail -6 $SC/chair-verify-919.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-919.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-rewrite-8a-2026-09-09 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-919.sha
echo "CAS OK: product=$SHORT · sealed landing-rewrite-8a-2026-09-09 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-919.template.json > $SC/payload-919.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-919.json; then echo "⛔ unfilled placeholder in payload-919"; exit 1; fi
sh $SC/collect-919.sh > $SC/collect-919.out 2>&1 || { tail -15 $SC/collect-919.out; echo "⛔ collect-919 failed — stop"; exit 1; }
tail -8 $SC/collect-919.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§919:' || { echo "⛔ §919 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
