import re,json
D='/Users/cstokes/Desktop/settlement-engine/docs/'
F=open(D+'DESIGN_FP_COHERENCE_FOLD.md').read().split('\n')
fold={}
for i in range(503,641):
    l=F[i]
    if not l.startswith('|'): continue
    cells=[c.strip() for c in l.strip().strip('|').split('|')]
    ks=re.findall(r'`([a-z_]+)`',cells[0].split('[')[0])
    cl=cells[-1]
    for k in ks:
        fold.setdefault(k,[]).append((i+1,'↳' in cells[0], cl[:60]))
heads={'PL':361,'MN':400,'CH':697,'PT':389,'PS':408,'ST':476,'PR':483,'BD':722}
for v,h in heads.items():
    L=open(D+f'DESIGN_FP_ARCH_{v}.md').read().split('\n')
    hdr=[c.strip() for c in L[h-1].strip().strip('|').split('|')]
    ci=[i for i,c in enumerate(hdr) if c.startswith('Class')][0]
    i=h+1
    while i<len(L) and L[i].startswith('|'):
        cells=[c.strip() for c in L[i].strip().strip('|').split('|')]
        ks=re.findall(r'`([a-z_]+)`',cells[0].split('[')[0])
        vc=cells[ci] if ci<len(cells) else '?'
        for k in ks:
            fc=fold.get(k)
            vstand='STANDING' in vc.upper(); 
            fstand=any('STANDING' in x[2].upper() for x in (fc or []) if not x[1]) if fc else None
            flag='' if fc and vstand==fstand else '  <<< DIFF'
            print(f'{v}:{i+1} {k} | vol: {vc[:50]} | fold base: {[x[2][:40] for x in (fc or []) if not x[1]]}{flag}')
        i+=1
