#!/bin/sh
# after-cas-896.sh — ONE command from a green gate log to the §896 AND §896.1 ledger acts.
# POSIX sh only (no process substitution). The guard and the consequence live together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/laneCLAMPINT-tree; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=90702c3e93afe7bd40f9d2aa6316777f3ca72aa3; LOG=$SC/gate-clamp2.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 14 > $SC/chair-verify-896.out 2>&1 || { tail -5 $SC/chair-verify-896.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-896.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-clamp-2026-09-05 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-896.sha
echo "CAS OK: product=$SHORT · sealed landing-clamp-2026-09-05 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-896.template.json > $SC/payload-896.json
if grep -q '__' $SC/payload-896.json; then echo "⛔ unfilled placeholder in payload-896"; exit 1; fi
sh $SC/collect-896.sh > $SC/collect-896.out 2>&1 || { tail -15 $SC/collect-896.out; echo "⛔ collect-896 failed — stop"; exit 1; }
tail -8 $SC/collect-896.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§896:' || { echo "⛔ §896 did not land"; exit 1; }
sed -e "s/__CAS_SHA__/$SHORT/g" $SC/payload-8961.template.json > $SC/payload-8961.json
if grep -q '__' $SC/payload-8961.json; then echo "⛔ unfilled placeholder in payload-8961"; exit 1; fi
sh $SC/collect-8961.sh > $SC/collect-8961.out 2>&1 || { tail -15 $SC/collect-8961.out; echo "⛔ collect-8961 failed — stop"; exit 1; }
tail -8 $SC/collect-8961.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§896.1:' || { echo "⛔ §896.1 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -2 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
