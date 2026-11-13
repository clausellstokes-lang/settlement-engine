# A compact eye-read of one birth's defence and money story at TIP, with '+' for lines the base did not print.
import sys,re,json
D,BD,seed=sys.argv[1],sys.argv[2],sys.argv[3]
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
t=parse(f'{D}/{seed}.txt'); b=parse(f'{BD}/{seed}.txt')
def mk(v,l): return '+' if l not in set(b.get(v,[])) else ' '
dt=t['tab:defense']; end=next((i for i,l in enumerate(dt) if l.startswith('Criminal Architecture')),len(dt))
arm=next((i for i,l in enumerate(dt) if l.startswith('Armed Forces')),None)
out=[]
for l in dt[:end]:
    if l.startswith('Each bar shows') or l in ('Threat Assessment','Guard assessment','Defensive posture'): continue
    out.append(mk('tab:defense',l)+'D '+l[:420])
if arm is not None:
    for l in dt[arm:arm+40]:
        if l.startswith('Supporting Capabilities'): break
        out.append(mk('tab:defense',l)+'F '+l[:300])
ov=t['tab:overview']
for i,l in enumerate(ov):
    if l in ('Prosperity','Safety','Defense','Stability') and i+1<len(ov): out.append(mk('tab:overview',ov[i+1])+'O '+l+': '+ov[i+1])
    if re.search(r' before the |Active crisis|Capability|Monster Defense|Food Security',l): out.append(mk('tab:overview',l)+'O '+l[:200])
for l in t['tab:economics'][:6]: out.append(mk('tab:economics',l)+'E '+l[:260])
for l in t.get('tonight',[]):
    if re.search(r'Defen|Food|crisis|Siege|Famine|Money|pay',l): out.append(mk('tonight',l)+'N '+l[:200])
pdf=t['pdf']
for i,l in enumerate(pdf):
    if re.search(r'^Prosperity: |^(Readiness|Score avg)$|leans on magic|: (town|city|palisade|no walls|massive)|/100$',l) or (l in ('Economic Survival','Invasion & War','Beasts & Monsters') and i+2<len(pdf)):
        nxt=(' | '+pdf[i+1]+' | '+pdf[i+2][:160]) if l in ('Economic Survival','Invasion & War','Beasts & Monsters','Readiness','Score avg') else ''
        out.append(mk('pdf',l)+'P '+l[:200]+nxt)
for l in t.get('register-player',[]):
    if '"line"' in l: out.append(mk('register-player',l)+'R '+l.strip()[:300])
print('\n'.join(out))
