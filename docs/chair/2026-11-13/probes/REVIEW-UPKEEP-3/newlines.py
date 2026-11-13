# Every line a tip page prints that NO page at the base prints, masked for the town's name and numbers.
# usage: python3 newlines.py <base_dir> <tip_dir> <out.txt>
import sys,os,re,json,collections
B,T,OUT=sys.argv[1:4]
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
    return None
def mask(l,name):
    if name: l=l.replace(name,'<T>')
    l=re.sub(r'\d+(\.\d+)?','#',l)
    return l.strip()
base=set(); 
for f in os.listdir(B):
    d=parse(os.path.join(B,f)); n=town(d)
    for v,ls in d.items():
        for l in ls: base.add((v.split('-')[0] if v.startswith(('world-export','register')) else 'page', mask(l,n)))
print('base masked lines',len(base))
new=collections.defaultdict(list)
for f in sorted(os.listdir(T)):
    d=parse(os.path.join(T,f)); n=town(d); seed=f[:-4]
    for v,ls in d.items():
        k='world' if v.startswith('world-export') else ('register' if v.startswith('register') else 'page')
        for l in ls:
            m=mask(l,n)
            if (k if k!='world' else 'world',m) not in base and m: new[(k,m)].append((seed,v))
with open(OUT,'w') as o:
    o.write(f'distinct new {len(new)}\n')
    for (k,m),occ in sorted(new.items(),key=lambda x:-len(x[1])):
        views=sorted(set(v for _,v in occ)); seeds=sorted(set(s for s,_ in occ))
        o.write(f'{len(seeds)} births | {k} | {",".join(views)} | e.g. {seeds[0]} | {m[:600]}\n')
print('distinct new',len(new))
