# UPKEEP-9: W5 rebuilt from the seventh seat's description (UPKEEP-HANDBACK.md, "W5 — Inverford"): the Defense tab's
# can-pay corpus row (DS-DEF-2 Economic Survival STRONG, "... can pay its way through it") beside a doom line
# ("may not come through this crisis") or a crisis spending line (m3.py's HUN), on any surface but the exports.
import sys,re,os,collections
D=sys.argv[1]
PAY=re.compile(r'can pay its way through it')
DOOM=re.compile(r'may not come through this crisis')
HUN=re.compile(r'every coin goes on food|The war takes most of the money')
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
c=collections.Counter(); ex=collections.defaultdict(list)
for f in sorted(os.listdir(D)):
    p=parse(os.path.join(D,f)); txt={k:'\n'.join(v) for k,v in p.items() if k and not k.startswith('world-export')}
    allt='\n'.join(txt.values()); pay=PAY.search(txt.get('Systems/Defense','') or '')
    if not pay: continue
    c['canpay']+=1
    d=bool(DOOM.search(allt)); h=bool(HUN.search(allt))
    for k,v in [('doom',d),('spend',h),('either',d or h)]:
        if v: c[k]+=1; ex[k].append(f[:-4])
print(dict(c)); print(dict(ex))
