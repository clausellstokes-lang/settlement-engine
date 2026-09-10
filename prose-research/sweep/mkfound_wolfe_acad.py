import json, re, os, sys
BASE=os.path.dirname(os.path.abspath(__file__))
def norm(s): return re.sub(r'\s+',' ',s)
FILES={}
def reg(url, path):
    FILES[url]=norm(open(os.path.join(BASE,path),encoding='utf-8',errors='replace').read())
def build(sources, claims, complete, coverage, out):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get('quote','')
        if q:
            t=FILES.get(c['url'])
            if t is None: bad.append((i,'NOFILE',c['url']))
            elif norm(q) not in t: bad.append((i,'NOQUOTE',q))
    if bad:
        for b in bad: print('QUOTE FAIL',b)
        sys.exit(1)
    obj={"complete":complete,"coverage":coverage,"sourcesRead":sources,"claims":claims}
    json.dump(obj, open(os.path.join(BASE,out),'w',encoding='utf-8'), indent=1, ensure_ascii=False)
    print('wrote',out,'claims',len(claims),'sources',len(sources))
