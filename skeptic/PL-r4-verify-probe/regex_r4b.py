import re,sys
M=sys.argv[1]
h=open(M+'/src/domain/worldPulse/relationshipRuleHelpers.js',encoding='utf-8').read()
g=open(M+'/src/domain/worldPulse/grievanceRead.js',encoding='utf-8').read()
def pick(src,name):
    m=re.search(r'const '+name+r' = /(.*)/([a-z]*);',src); return re.compile(m.group(1), re.I if 'i' in m.group(2) else 0)
RX={'ESCALATION_HINT':pick(h,'ESCALATION_HINT'),'DEESCALATION_HINT':pick(h,'DEESCALATION_HINT'),'WOUND_TYPE_RE':pick(g,'WOUND_TYPE_RE')}
for w in ['riders_lent','riders_quartered','peace_unkept']:
    print(w,{k:bool(r.search(w)) for k,r in RX.items()})
