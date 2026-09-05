#!/bin/sh
# after-cas-898.sh — ONE command from a green gate log to the §898 ledger act (stamped by mk-landing-kit.py). POSIX sh. Guard + consequence together.
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; REPO=/Users/cstokes/Desktop/settlement-engine
BASE=fd8b6df0013b749e24435450931618fbe78a3f13; LOG=$SC/gate-898.log
TE=$(grep -oE '^TRUE_EXIT=[0-9]+' "$LOG" | tail -1 | cut -d= -f2)
[ "$TE" = "0" ] || { echo "⛔ gate TRUE_EXIT=$TE (from the LOG) — stop"; exit 1; }
[ "$(grep -c 'SCOPE SENTINEL' "$LOG")" = "0" ] || { echo "⛔ sentinel in the log — stop"; exit 1; }
[ "$(grep -c 'update REFUSED' "$LOG")" = "0" ] || { echo "⛔ refusal in the log — stop"; exit 1; }
grep -q '^GATE_CARS=5$' "$LOG" || { echo "⛔ gate did not run over 5 cars: $(grep '^GATE_CARS=' "$LOG")"; exit 1; }
TESTS=$(grep -oE 'known failure\(s\) of [0-9]+' "$LOG" | tail -1 | grep -oE '[0-9]+$')
[ -n "$TESTS" ] || { echo "⛔ could not derive totalTests from the log — stop"; exit 1; }
echo "gate green · tests=$TESTS"
python3 $SC/chair-verify.py "$D" "$BASE" "$LOG" 5 > $SC/chair-verify-898.out 2>&1 || { tail -6 $SC/chair-verify-898.out; echo "⛔ chair-verify RED — stop"; exit 1; }
tail -3 $SC/chair-verify-898.out
cd "$REPO"; NEW=$(git -C "$D" rev-parse HEAD)
[ "$(git rev-parse claude/composite-r4)" = "$BASE" ] || { echo "⛔ product tip is not the declared base $BASE — stop"; exit 1; }
git update-ref refs/heads/claude/composite-r4 "$NEW" "$BASE"
[ "$(git rev-parse claude/composite-r4)" = "$NEW" ] || { echo "⛔ CAS did not land"; exit 1; }
git update-ref refs/preserve/landing-prose-2026-09-05 "$NEW"
SHORT=$(git rev-parse --short "$NEW"); printf '%s' "$SHORT" > $SC/cas-898.sha
echo "CAS OK: product=$SHORT · sealed landing-prose-2026-09-05 · cars since ca651d54b=$(git rev-list --count ca651d54b..claude/composite-r4)"
GR=525; GT=525   # measured by chair-tools/golden-count.mjs at the prose tip (control 0/525 at the base); the fixture is BANKED, not re-recorded
GC=$(git -C "$D" log --format=%h --grep='movement is BANKED until the freeze act' -1); [ -n "$GC" ] || { echo "⛔ the banked golden car is not in the dock"; exit 1; }
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TESTS__/$TESTS/g" -e "s/__GOLDEN_ROWS__/$GR/g" -e "s/__GOLDEN_UNMOVED__/$((GT-GR))/g" -e "s/__GOLDEN_CAR__/\`$GC\`/g" $SC/payload-898.template.json > $SC/payload-898.json
# the declared-shift entry: fill the tip figures and append it to HEAD's GOLDEN_SHIFT_LEDGER.md (ledger branch) for the collect to map
LT=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print('/'.join(str(d[k]) for k in ('files','parked','credited','titles','suiteTitles')))")
sed -e "s/__CAS_SHA__/$SHORT/g" -e "s/__TT_AFTER__/$TESTS/g" -e "s|__LIGHTING_TUPLE__|$LT|g" -e "s/__GOLDEN_ROWS__/$GR/g" -e "s/__GOLDEN_UNMOVED__/$((GT-GR))/g" -e "s/__GOLDEN_CAR__/\`$GC\`/g" $SC/golden-shift-prose.draft.md > $SC/golden-shift-prose.final.md
if grep -q '__[A-Z_]*__' $SC/golden-shift-prose.final.md; then echo "⛔ unfilled placeholder in the shift entry: $(grep -oE '__[A-Z_]+__' $SC/golden-shift-prose.final.md | sort -u | tr '\n' ' ')"; exit 1; fi
{ git -C "$REPO" show review-fixes-2026-07-08:docs/GOLDEN_SHIFT_LEDGER.md; printf '\n\n---\n\n'; cat $SC/golden-shift-prose.final.md; } > $SC/golden-shift.ledger.898.md
echo "golden shift ledger: $(git -C "$REPO" cat-file -s review-fixes-2026-07-08:docs/GOLDEN_SHIFT_LEDGER.md)B -> $(wc -c < $SC/golden-shift.ledger.898.md | tr -d ' ')B (the entry appended)"
if grep -q '__' $SC/payload-898.json; then echo "⛔ unfilled placeholder in payload-898"; exit 1; fi
sh $SC/collect-898.sh > $SC/collect-898.out 2>&1 || { tail -15 $SC/collect-898.out; echo "⛔ collect-898 failed — stop"; exit 1; }
tail -8 $SC/collect-898.out
git -C "$REPO" log -1 --format=%s review-fixes-2026-07-08 | grep -q '^§898:' || { echo "⛔ §898 did not land"; exit 1; }
echo "DONE:"; git -C "$REPO" log -1 --format='  %h %s' review-fixes-2026-07-08 | cut -c1-110
