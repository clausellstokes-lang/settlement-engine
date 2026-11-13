import json,collections
B={o['seed']:o for o in map(json.loads,open('scan.base.ndjson'))}
T={o['seed']:o for o in map(json.loads,open('scan.tip.ndjson'))}
LAD=['Undefended','Vulnerable','Lightly Defended','Defensible','Well-Defended','Fortress']
rows=[]
for k,t in T.items():
    b=B[k]; c,sz=k.split('-')[1],k.split('-')[2]
    rows.append(dict(k=k,c=c,sz=sz,d=t['rs']-b['rs'],bd=LAD.index(t['rl'])-LAD.index(b['rl']),w=bool(t['walls']),g=bool(t['gar']),t=t,b=b))
pick=[]
def add(r):
    if r['k'] not in [p['k'] for p in pick]: pick.append(r)
# biggest movers each crisis (up and down)
for c in ['calm','famine','under_siege','wartime','succession_void']:
    rs=sorted([r for r in rows if r['c']==c],key=lambda r:r['d'])
    add(rs[0]); add(rs[-1])
# every two-band move
for r in rows:
    if abs(r['bd'])>=2: add(r)
# coverage: each size x walled x garrison, prefer band movers
for sz in ['thorp','hamlet','village','town','city','metropolis']:
    for w in (True,False):
        for g in (True,False):
            cand=[r for r in rows if r['sz']==sz and r['w']==w and r['g']==g and r['k'] not in [p['k'] for p in pick]]
            cand.sort(key=lambda r:(-abs(r['bd']),-abs(r['d'])))
            if cand: add(cand[0])
print(len(pick))
for r in pick:
    t,b=r['t'],r['b']
    print(f"{r['k']:32s} {b['rs']:5} {b['rl'][:10]:10s} -> {t['rs']:5} {t['rl'][:10]:10s} d={r['d']:+.1f} pros={t['pros']}/{t['stand']} W={t['walls'][:14]} G={t['gar'][:14]} watch={t['watch'][:12]} mil={t['mili'][:12]} merc={t['merc'][:10]}")
open('cold.seeds.txt','w').write('\n'.join(r['k'] for r in pick)+'\n')
