import re,json,collections
D='/Users/cstokes/Desktop/settlement-engine/docs/'
FL=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
res=json.load(open('s5tok.json'))
IDRE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*$')
def toks(text):
    out=[]
    for span in re.findall(r'`([^`]+)`',text):
        if '/' in span and ('.md' in span or '.js' in span): continue
        for w in re.split(r'[\s·,/()\[\]{}:;=<>|\\\'"+]+',span):
            w=w.strip('.')
            if len(w)>=3 and IDRE.match(w): out.append(w)
    return out
out=[]
for i in range(703,917):
    l=FL[i]
    if not l.startswith('|'): continue
    cells=[c.strip() for c in l.strip().strip('|').split('|')]
    if cells[0].startswith('**—'): continue
    ts=list(dict.fromkeys(toks(cells[0]+' '+(cells[1] if len(cells)>1 else ''))))
    vols=collections.Counter(); unused=[]
    for t in ts:
        r=res.get(t)
        if not r: continue
        for v,c in r['nine'].items(): vols[v]+=1
        if not r['nine'] and not r['others']: unused.append(t)
    name=re.sub(r'\[[^\]]*\]','',cells[0]).strip()[:70].replace('|','/')
    out.append(dict(line=i+1,name=name,ntok=len(ts),vols=dict(vols),unused=unused,fp=i+1>=763,arrow=cells[0].startswith('↳')))
json.dump(out,open('s5rows.json','w'),indent=0)
for o in out:
    if not o['vols'] or o['unused']:
        print(o['line'],o['name'][:60],'ntok',o['ntok'],'vols',o['vols'],'unused',o['unused'])
print(len(out),'rows;', sum(1 for o in out if o['fp']),'fp-final rows')
