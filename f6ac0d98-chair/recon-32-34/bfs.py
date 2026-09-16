import os,re,sys,json
ROOT=sys.argv[1]; ENTRY=sys.argv[2]
imp=re.compile(r"""(?:from|import)\s*\(?\s*['"](\.[^'"]+)['"]""")
def resolve(base,spec):
    p=os.path.normpath(os.path.join(os.path.dirname(base),spec))
    for c in (p,p+'.js',p+'.jsx',os.path.join(p,'index.js'),os.path.join(p,'index.jsx')):
        if os.path.isfile(os.path.join(ROOT,c)): return c
    return None
seen=set(); stack=[ENTRY]
while stack:
    f=stack.pop()
    if f in seen: continue
    seen.add(f)
    try: t=open(os.path.join(ROOT,f),encoding='utf8').read()
    except: continue
    for m in imp.findall(t):
        r=resolve(f,m)
        if r and r not in seen: stack.append(r)
total=sum(os.path.getsize(os.path.join(ROOT,f)) for f in seen)
print(len(seen),"modules,",total,"src bytes")
for pat in sys.argv[3:]:
    hits=[f for f in sorted(seen) if pat in f]
    print(f"  {pat}: {len(hits)}", hits[:6])
