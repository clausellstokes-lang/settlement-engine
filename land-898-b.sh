#!/bin/sh
# land-898-b.sh — after the golden door: commit the golden car → set the consist's true car count in the landing scripts →
# take the census totals → commit the totals car (LAST) → lighting check. Then the chair starts run-gate-898.sh (bg).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad
D=$SC/lanePROSE2; BASE=fd8b6df0013b749e24435450931618fbe78a3f13
echo "== 1. the golden arm is BANKED (owner-gated at the fixture) — assert the banked car is in the dock"; git -C $D log --format=%h --grep='movement is BANKED until the freeze act' -1 | grep -q . || { echo "⛔ the banked car is missing — run bank-golden-898.sh"; exit 1; }
N=$(git -C $D rev-list --count $BASE..HEAD); EXPECT=$((N+1)); echo "cars now $N; after the totals car: $EXPECT"
echo "== 2. the landing scripts take the true count ($EXPECT)"
python3 - "$EXPECT" <<'PY'
import io,sys,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'; n=sys.argv[1]
for f,pats in (('after-cas-898.sh',[(r"grep -q '\^GATE_CARS=\d+\$'","grep -q '^GATE_CARS=%s$'"%n),(r'did not run over \d+ cars','did not run over %s cars'%n),(r'"\$LOG" \d+ >','"$LOG" %s >'%n)]),
               ('run-gate-898.sh',[(r'\[ "\$CARS" = "\d+" \]','[ "$CARS" = "%s" ]'%n),(r'expected \d+ cars over','expected %s cars over'%n)])):
    p=SC+'/'+f; s=io.open(p,encoding='utf-8').read()
    for pat,rep in pats:
        s2,k=re.subn(pat,rep,s); assert k>=1,(f,pat); s=s2
    io.open(p,'w',encoding='utf-8').write(s); print('  ',f,'-> cars',n)
PY
sh -n $SC/after-cas-898.sh && sh -n $SC/run-gate-898.sh
echo "== 3. the census totals (quiet window + mutex; predicted entries 5 (6 - the two Tier-2 voice rows + the banked golden row), totalFiles 2468)"; sh $SC/run-ratchet-898.sh > $SC/ratchet-898.log 2>&1 || true
grep -E '^TRUE_EXIT=|^MEASURED:|REFUSED|regression' $SC/ratchet-898.log | head -6
echo "== 4. the totals car"; sh $SC/commit-totals.sh $D $SC/ratchet-898.log 5 2468 train-prose-2026-09-05 $BASE
echo "== 5. lighting: farmed probe vs the register at the tip"
PR=$(PROBE_FARM_ROOT=$SC/.farms node $SC/chair-tools/lighting-probe.mjs $D 2>/dev/null | tail -1)
RG=$(python3 -c "import json;d=json.load(open('$D/tests/lint/.lighting-census-baseline.json'));print(json.dumps({k:d[k] for k in ('files','parked','credited','titles','suiteTitles')}))")
echo "  probe   : $PR"; echo "  register: $RG"; python3 -c "import json,sys;a=json.loads(sys.argv[1]);b=json.loads(sys.argv[2]);sys.exit(0 if a==b else 1)" "$PR" "$RG" || { echo "⛔ lighting moved — re-take before the gate; STOP"; exit 1; }
echo "LAND-898-B OK: $(git -C $D rev-list --count $BASE..HEAD) cars over $(echo $BASE | cut -c1-9); HEAD=$(git -C $D rev-parse --short HEAD); porcelain=$(git -C $D status --porcelain -uall | wc -l | tr -d ' ')"
echo "NEXT: sh $SC/run-gate-898.sh > $SC/gate-898.log 2>&1 (background), then sh $SC/after-cas-898.sh"
