import re,json
D='/Users/cstokes/Desktop/settlement-engine/docs/'
F=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read()
FL=F.split('\n')
S5='\n'.join(FL[699:917]); S34='\n'.join(FL[499:679])
miss=json.load(open('vtok-miss.json'))
reg=set(l.split()[0] for l in open('kinds.txt'))
def has(t,txt):
    last=t.split('.')[-1]
    return re.search(r'(?<![A-Za-z0-9_])'+re.escape(last)+r'(?![A-Za-z0-9_])',txt) is not None
out=[]
for v,lst in miss.items():
    L=open(D+f'DESIGN_FP_ARCH_{v}.md').read().split('\n')
    for t,l,s in lst:
        row=L[l-1]
        first=row.strip().strip('|').split('|')[0].strip()
        consts=[c for c in re.findall(r'`([A-Za-z_][A-Za-z0-9_]*)`',row) if c!=t]
        constIn=[c for c in consts if has(c,S5)]
        cat=('KIND' if t in reg else 'S34' if has(t,S34) else 'FOLD' if has(t,F) else 'SIBLING-IN-S5' if constIn else 'ABSENT')
        out.append((v,t,l,s,cat,first[:70],constIn[:3]))
for o in out:
    if o[4] not in ('KIND',):
        print(o[0],o[1],'@'+str(o[2]),o[3],o[4],'| row:',o[5],'| sib:',o[6])
json.dump(out,open('vtok-miss2.json','w'))
