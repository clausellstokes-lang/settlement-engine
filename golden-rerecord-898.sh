#!/bin/sh
# golden-rerecord-898.sh — re-record the generator golden master for the PROSE landing's DECLARED same-seed text shift.
# Quiet window → the door (UPDATE_GOLDEN=1) under the gate mutex → count the rows that moved → NO commit (the chair commits
# with the count in the declaration). The golden-freeze register is UNFROZEN, so the env door is the form (LIGHT-PLAN §4).
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
D=$SC/lanePROSE2; cd "$D" || exit 9
[ -z "$(git status --porcelain -uall)" ] || { echo "REFUSED: dock dirty"; exit 8; }
STREAK=0; WAITED=0
while [ $STREAK -lt 3 ]; do L=$(uptime | sed 's/.*averages: //' | awk '{print $1}'); V=$(ps -ax -o command | grep -c '[v]itest/dist/workers'); OK=$(awk -v l="$L" 'BEGIN{print (l<4.0)?1:0}'); if [ "$OK" = "1" ] && [ "$V" -eq 0 ]; then STREAK=$((STREAK+1)); else STREAK=0; fi; echo "  probe: load=$L workers=$V streak=$STREAK"; [ $STREAK -lt 3 ] && sleep 60 && WAITED=$((WAITED+60)); [ $WAITED -gt 3600 ] && { echo "GAVE UP"; exit 8; }; done
echo "QUIET CONFIRMED after ${WAITED}s"; echo "GOLDEN_HEAD=$(git rev-parse HEAD)"
cp tests/fixtures/generator-golden-master.json "$SC/golden-master.before.json"
sh scripts/gate-mutex.sh --run -- env UPDATE_GOLDEN=1 npx vitest run tests/property/generatorGoldenMaster.test.js > "$SC/golden-rerecord-898.log" 2>&1
TRUE_EXIT=$?; echo "TRUE_EXIT=$TRUE_EXIT"; grep -E 'Test Files|Tests ' "$SC/golden-rerecord-898.log" | cut -c1-80
echo "changed: [$(git status --porcelain -uall | awk '{print $2}' | tr '\n' ' ')]"
python3 - <<PY
import json
b=json.load(open('$SC/golden-master.before.json')); a=json.load(open('tests/fixtures/generator-golden-master.json'))
def rows(d):
    if isinstance(d,dict):
        for k in ('rows','entries','manifest','goldens'):
            if k in d and isinstance(d[k],(list,dict)): return d[k]
        return d
    return d
rb,ra=rows(b),rows(a)
if isinstance(rb,dict) and isinstance(ra,dict):
    keys=set(rb)|set(ra); moved=[k for k in keys if rb.get(k)!=ra.get(k)]; print('GOLDEN_ROWS: total=%d moved=%d added=%d removed=%d'%(len(keys),len(moved),len(set(ra)-set(rb)),len(set(rb)-set(ra))))
elif isinstance(rb,list) and isinstance(ra,list):
    n=max(len(rb),len(ra)); moved=sum(1 for i in range(min(len(rb),len(ra))) if rb[i]!=ra[i]); print('GOLDEN_ROWS: total=%d moved=%d lenBefore=%d lenAfter=%d'%(n,moved,len(rb),len(ra)))
else: print('GOLDEN_ROWS: shape mismatch', type(rb).__name__, type(ra).__name__)
PY
exit $TRUE_EXIT
