#!/bin/sh
# after-cas-896.sh — ONE command from a green gate log to the §896 AND §896.1 ledger acts.
# The guard and the consequence live together: every step is gated on the previous one's exit.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/laneCLAMPINT-tree; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=90702c3e93afe7bd40f9d2aa6316777f3ca72aa3; LOG=$SC/gate-clamp2.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] && [ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ sentinel/refusal in the log — stop"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 14 | tail -3
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 14 >/dev/null 2>&1 || { echo "⛔ chair-verify RED — stop"; exit 1; }
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-clamp-2026-09-05 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-896.sha
echo "CAS OK: product=$SHORT · sealed landing-clamp-2026-09-05 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" $SC/payload-896.template.json > $SC/payload-896.json
grep -q '__' $SC/payload-896.json && { echo "⛔ unfilled placeholder in payload-896"; exit 1; } || true
sh $SC/collect-896.sh | tail -12
grep -q 'COLLECT_896_OK' <(sh -c "git -C $REPO log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§896:' && echo COLLECT_896_OK") || { echo "⛔ §896 did not land"; exit 1; }
sed -e "s/__CAS_SHA__/$SHORT/g" $SC/payload-8961.template.json > $SC/payload-8961.json
grep -q '__' $SC/payload-8961.json && { echo "⛔ unfilled placeholder in payload-8961"; exit 1; } || true
sh $SC/collect-8961.sh | tail -10
echo "DONE: $(git -C $REPO log -2 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-100)"
