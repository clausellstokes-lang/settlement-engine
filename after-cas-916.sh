#!/bin/sh
# after-cas-916.sh — ONE command from a green gate log to the §916 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit
D=$SC/laneSEAM; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=3b22b5c569e5c93f709f2a6057e3a0c280ff18ac; LOG=$SC/gate-916.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=38$' "$LOG" || { echo "⛔ gate did not run over 38 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 38 > $SC/chair-verify-916.out 2>&1 || { tail -6 $SC/chair-verify-916.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-916.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-seam-2026-09-08 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-916.sha
echo "CAS OK: product=$SHORT · sealed landing-seam-2026-09-08 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-916.template.json > $SC/payload-916.json
if grep -qE '__[A-Z0-9_]+__' $SC/payload-916.json; then echo "⛔ unfilled placeholder in payload-916"; exit 1; fi
sh $SC/collect-916.sh > $SC/collect-916.out 2>&1 || { tail -15 $SC/collect-916.out; echo "⛔ collect-916 failed — stop"; exit 1; }
tail -8 $SC/collect-916.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§916:' || { echo "⛔ §916 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
