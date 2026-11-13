# Per-seed line diff base->tip on every surface but the export JSON; aggregated by masked line (town name, digits).
# usage: python3 pairdiff.py <base_dir> <tip_dir> <out> [seedlist-file]
import sys,os,re,collections
B,T,OUT=sys.argv[1:4]; only=set(open(sys.argv[4]).read().split()) if len(sys.argv)>4 else None
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
def town(d):
    for l in d.get('register-player',[]):
        m=re.match(r'\s*"name": "(.*)",?$',l)
        if m: return m.group(1)
def mask(l,n):
    if n: l=l.replace(n,'<T>')
    return re.sub(r'\d+(\.\d+)?','#',l).strip()
agg=collections.defaultdict(lambda:[set(),set()]); moved=collections.Counter(); n=0
files=sorted(set(os.listdir(B))&set(os.listdir(T)))
for f in files:
    seed=f[:-4]
    if only and seed not in only: continue
    n+=1; b=parse(os.path.join(B,f)); t=parse(os.path.join(T,f)); nm=town(t)
    for v in set(b)|set(t):
        bl,tl=b.get(v,[]),t.get(v,[])
        if bl==tl: continue
        bs,ts=collections.Counter(bl),collections.Counter(tl)
        vv='world-export' if v.startswith('world-export') else v
        for l in (ts-bs): agg[('+',vv,mask(l,nm))][0].add(seed); agg[('+',vv,mask(l,nm))][1].add(v)
        for l in (bs-ts): agg[('-',vv,mask(l,nm))][0].add(seed); agg[('-',vv,mask(l,nm))][1].add(v)
        moved[vv]+=1
with open(OUT,'w') as o:
    o.write(f'births compared {n}\nsurfaces moved (births): {dict(moved)}\n')
    for (sg,v,m),(ss,vs) in sorted(agg.items(),key=lambda x:(x[0][1],-len(x[1][0]))):
        o.write(f'{sg} {len(ss):4d} | {v} | e.g. {sorted(ss)[0]} | {m[:500]}\n')
print(n, dict(moved), len(agg))
