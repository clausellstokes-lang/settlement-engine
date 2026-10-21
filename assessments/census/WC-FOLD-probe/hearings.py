import re,sys,json
D='/Users/cstokes/Desktop/settlement-engine/docs/'
heads={'PL':361,'MN':400,'CH':697,'PT':389,'PS':408,'ST':476,'PR':483,'BD':722}
out={}
for v,h in heads.items():
    L=open(D+f'DESIGN_FP_ARCH_{v}.md').read().split('\n')
    hdr=[c.strip() for c in L[h-1].strip().strip('|').split('|')]
    wi=[i for i,c in enumerate(hdr) if 'WHERE' in c][0]
    di=[i for i,c in enumerate(hdr) if 'DEFAULT' in c.upper()]
    di=di[0] if di else None
    i=h+1
    rows=[]
    while i<len(L) and L[i].startswith('|'):
        cells=[c.strip() for c in L[i].strip().strip('|').split('|')]
        first=cells[0]
        kinds=re.findall(r'`([a-z_]+)`',first)
        arrow=first.startswith('↳')
        w=cells[wi] if wi<len(cells) else ''
        d=cells[di] if di is not None and di<len(cells) else ''
        rows.append(dict(line=i+1,arrow=arrow,kinds=kinds,where=w[:160],default=d[:160],ncells=len(cells),nh=len(hdr)))
        i+=1
    out[v]=dict(header=hdr,rows=rows,end=i)
json.dump(out,open(sys.argv[1],'w'),indent=1)
for v,o in out.items():
    print('==',v,'header cols',len(o['header']),'rows',len(o['rows']),'end line',o['end'])
    for r in o['rows']:
        if not r['arrow']:
            print(' ',r['line'],r['kinds'][:4],'| W:',r['where'][:70],'| D:',r['default'][:60], '' if r['ncells']==r['nh'] else f"CELLS {r['ncells']}/{r['nh']}")
