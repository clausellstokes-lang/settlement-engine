import re,json,collections,os,subprocess
D='/Users/cstokes/Desktop/settlement-engine/docs/'
FL=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
IDRE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')
NINE=['PL','MN','RN','CH','PT','PS','ST','PR','BD']
vol={v:open(D+f'DESIGN_FP_ARCH_{v}.md').read() for v in NINE}
others={}
for f in os.listdir(D):
    if f.startswith('DESIGN_FP_') and f.endswith('.md') and f!='DESIGN_FP_COHERENCE_FOLD.md':
        k=f[len('DESIGN_FP_'):-3].replace('ARCH_','')
        if k not in NINE: others[k]=open(D+f).read()
def toks(text):
    out=[]
    for span in re.findall(r'`([^`]+)`',text):
        if '/' in span and ('.md' in span or '.js' in span): continue
        for w in re.split(r'[\s·,/()\[\]{}:;=<>|\\\'"+]+',span):
            w=w.strip('.')
            if len(w)>=3 and IDRE.match(w): out.append(w)
    return out
rows=[]
for i in range(703,917):
    l=FL[i]
    if not l.startswith('|'): continue
    cells=[c.strip() for c in l.strip().strip('|').split('|')]
    if cells[0].startswith('**—'): continue
    ts=toks(cells[0]+' '+(cells[1] if len(cells)>1 else ''))
    rows.append((i+1,cells[0][:60],ts))
tok=collections.OrderedDict()
for ln,name,ts in rows:
    for t in ts:
        tok.setdefault(t,[]).append(ln)
print('S5 rows',len(rows),'unique tokens',len(tok))
def cnt(t,txt):
    return len(re.findall(r'(?<![A-Za-z0-9_])'+re.escape(t)+r'(?![A-Za-z0-9_])',txt))
res={}
for t,lns in tok.items():
    vc={v:cnt(t,vol[v]) for v in NINE}
    vc={k:c for k,c in vc.items() if c}
    oc={k:cnt(t,o) for k,o in others.items()}
    oc={k:c for k,c in oc.items() if c}
    res[t]=dict(lines=lns,nine=vc,others=oc,fp=min(lns)>=763)
json.dump(res,open('s5tok.json','w'))
fp=[t for t,r in res.items() if r['fp']]
print('tokens first registered in fp-final rows:',len(fp))
print('cited by nine (any row):',sum(1 for r in res.values() if r['nine']))
dead=[t for t in fp if not res[t]['nine'] and not res[t]['others']]
print('fp-final tokens used by NO FP volume:',len(dead)); print(' '.join(dead))
