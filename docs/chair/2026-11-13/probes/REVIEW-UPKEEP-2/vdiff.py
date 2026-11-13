import sys,os,re
B,T=sys.argv[1],sys.argv[2]; seeds=sys.argv[3].split(',') if len(sys.argv)>3 and sys.argv[3] else None
skip=set((sys.argv[4] if len(sys.argv)>4 else 'world-export-player,world-export-dm').split(','))
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
for f in sorted(os.listdir(T)):
    if seeds and f[:-4] not in seeds: continue
    b=parse(os.path.join(B,f)); t=parse(os.path.join(T,f)); out=[]
    for v in t:
        if v in skip: continue
        bl,tl=b.get(v,[]),t.get(v,[]); bs,ts=set(bl),set(tl)
        gone=[l for l in bl if l not in ts]; new=[l for l in tl if l not in bs]
        if gone or new: out.append(f'  -- {v}'); out+=['    - '+l[:400] for l in gone]+['    + '+l[:400] for l in new]
    print(f'## {f[:-4]}'); print('\n'.join(out))
