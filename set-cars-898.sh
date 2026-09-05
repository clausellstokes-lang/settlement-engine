#!/bin/sh
# set-cars-898.sh <n> — write the consist's true car count into after-cas-898.sh and run-gate-898.sh (guards, not defaults).
set -e
SC=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad
n=$1; echo "$n" | grep -qE '^[0-9]+$' || { echo "usage: <n>"; exit 9; }
python3 - "$n" <<'PY'
import io,sys,re
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad'; n=sys.argv[1]
for f,pats in (('after-cas-898.sh',[(r"grep -q '\^GATE_CARS=\d+\$'","grep -q '^GATE_CARS=%s$'"%n),(r'did not run over \d+ cars','did not run over %s cars'%n),(r'"\$LOG" \d+ >','"$LOG" %s >'%n)]),
               ('run-gate-898.sh',[(r'\[ "\$CARS" = "\d+" \]','[ "$CARS" = "%s" ]'%n),(r'expected \d+ cars over','expected %s cars over'%n)])):
    p=SC+'/'+f; s=io.open(p,encoding='utf-8').read()
    for pat,rep in pats:
        s2,k=re.subn(pat,rep,s); assert k>=1,(f,pat); s=s2
    io.open(p,'w',encoding='utf-8').write(s); print('  ',f,'-> cars',n)
PY
sh -n $SC/after-cas-898.sh && sh -n $SC/run-gate-898.sh && echo "both parse"
