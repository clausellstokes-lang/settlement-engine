import re,json,collections
D='/Users/cstokes/Desktop/settlement-engine/docs/'
heads={'PL':140,'MN':206,'RN':202,'CH':266,'PT':175,'PS':624,'ST':197,'PR':613,'BD':289}
F=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
S5='\n'.join(F[699:917])
IDRE=re.compile(r'^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z0-9_]+)*$')
def toks(cell):
    out=[]
    for span in re.findall(r'`([^`]+)`',cell):
        for w in re.split(r'\s*·\s*|\s*,\s*|\s+/\s+|\s+',span):
            w=w.strip().strip('()[]{}:;')
            if len(w)>=3 and IDRE.match(w) and not w.endswith(('.md','.js','.json','.jsx','.mjs','.tsv','.out','.txt')):
                out.append(w)
    return out
res={}
for v,h in heads.items():
    L=open(D+f'DESIGN_FP_ARCH_{v}.md').read().split('\n')
    i=h+1; rows=[]
    while i<len(L) and L[i].startswith('|'):
        cells=[c.strip() for c in L[i].strip().strip('|').split('|')]
        tk=toks(cells[0])+(toks(cells[1]) if len(cells)>1 and v in('MN','RN','PT','BD','PL','CH') else [])
        if v in ('PS','PR','ST'): tk=toks(cells[0])
        status=' '.join(cells[1:])
        minted=bool(re.search(r'FREE|minted|MINTED|\bNEW\b|new token|0 · 0',status))
        landed_only=('LANDED' in status or 'landed' in status) and not minted
        for t in tk:
            rows.append((t,i+1,minted,landed_only))
        i+=1
    res[v]=rows
    print(v,'table rows end',i,'tokens',len(rows),'unique',len(set(r[0] for r in rows)))
json.dump(res,open('vtok.json','w'))
# presence in S5
miss=collections.defaultdict(list)
for v,rows in res.items():
    seen=set()
    for t,l,m,lo in rows:
        if t in seen: continue
        seen.add(t)
        last=t.split('.')[-1]
        if not re.search(r'(?<![A-Za-z0-9_])'+re.escape(last)+r'(?![A-Za-z0-9_])',S5):
            miss[v].append((t,l,'minted' if m else ('landed' if lo else '?')))
for v in heads:
    print('==',v,'absent from §5:',len(miss[v]))
    print('   ',' '.join(f'{t}@{l}[{s}]' for t,l,s in miss[v][:80]))
json.dump(miss,open('vtok-miss.json','w'))
