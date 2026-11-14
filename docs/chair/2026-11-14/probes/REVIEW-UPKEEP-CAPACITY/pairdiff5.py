# REVIEW-UPKEEP-CAPACITY: per-seed line diff base->tip on every rendered surface (pairdiff.py of REVIEW-UPKEEP-3, gz input).
# Aggregated by masked line (town name -> <T>, digits -> #). usage: python3 pairdiff5.py <base_dir> <tip_dir> <out> [seedlist]
import sys,os,re,collections,gzip
B,T,OUT=sys.argv[1:4]; only=set(open(sys.argv[4]).read().split()) if len(sys.argv)>4 else None
def parse(p):
    d={};cur=None
    for l in gzip.open(p,'rt'):
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
agg=collections.defaultdict(lambda:[set(),set()]); moved=collections.Counter(); n=0; nmoved=set()
files=sorted(f for f in set(os.listdir(B))&set(os.listdir(T)) if f.endswith('.txt.gz'))
for f in files:
    seed=f[:-7]
    if only and seed not in only: continue
    n+=1; b=parse(os.path.join(B,f)); t=parse(os.path.join(T,f)); nm=town(t)
    for v in set(b)|set(t):
        bl,tl=b.get(v,[]),t.get(v,[])
        if bl==tl: continue
        nmoved.add(seed)
        bs,ts=collections.Counter(bl),collections.Counter(tl)
        vv='world-export' if v.startswith('world-export') else v
        for l in (ts-bs): agg[('+',vv,mask(l,nm))][0].add(seed); agg[('+',vv,mask(l,nm))][1].add(v)
        for l in (bs-ts): agg[('-',vv,mask(l,nm))][0].add(seed); agg[('-',vv,mask(l,nm))][1].add(v)
        moved[vv]+=1
with open(OUT,'w') as o:
    o.write(f'births compared {n}; births with any surface moved {len(nmoved)}\nsurfaces moved (births): {dict(moved)}\n')
    for (sg,v,m),(ss,vs) in sorted(agg.items(),key=lambda x:(x[0][1],-len(x[1][0]))):
        o.write(f'{sg} {len(ss):4d} | {v} | e.g. {sorted(ss)[0]} | {m[:500]}\n')
print(n, len(nmoved), dict(moved), len(agg))
