import json,glob,sys,collections,statistics as st
S=sys.argv[1]
M={};B={}
for f in glob.glob(f'{S}/out/meas.*.ndjson'):
    for l in open(f): r=json.loads(l); M[r['key']]=r
for f in glob.glob(f'{S}/out/base.*.ndjson'):
    for l in open(f): r=json.loads(l); B[r['key']]=r
BANDS=['Undefended','Vulnerable','Lightly Defended','Defensible','Well-Defended','Fortress']; bi=BANDS.index
def grp(r):
    if r['forced']: return r['forced'] if r['forced'] in ('famine','under_siege','wartime') else 'other crises'
    return 'calm '+r['tier']
order=['calm thorp','calm hamlet','calm village','calm town','calm city','calm metropolis','famine','under_siege','wartime','other crises']
G=collections.defaultdict(list)
for k,r in M.items(): G[grp(r)].append((B[k],r))
print('| births | n | base | today | V2 | V3 | V3 vs today: down 2+ / down 1 / up 1 / up 2+ | V3 vs base: down 2+ / down 1 / up 1 / up 2+ |')
print('|---|---|---|---|---|---|---|---|')
for g in order:
    v=G[g]
    m=lambda f: round(st.mean(f(b,r) for b,r in v),1)
    def c(ref):
        d=collections.Counter(bi(r['V3']['band'])-bi(ref(b,r)) for b,r in v)
        return f"{sum(n for k,n in d.items() if k<=-2)} / {d[-1]} / {d[1]} / {sum(n for k,n in d.items() if k>=2)}"
    print(f"| {g} | {len(v)} | {m(lambda b,r:b['score'])} | {m(lambda b,r:r['score'])} | {m(lambda b,r:r['V2']['total'])} | {m(lambda b,r:r['V3']['total'])} | {c(lambda b,r:r['readiness'])} | {c(lambda b,r:b['readiness'])} |")
V=[r for r in M.values()]
print('band distribution today', [sum(1 for r in V if r['readiness']==b) for b in BANDS], 'V3', [sum(1 for r in V if r['V3']['band']==b) for b in BANDS])
print('R1 order changes band', sum(1 for r in V if r['V3']['altBand']!=r['V3']['band']), 'score', sum(1 for r in V if r['V3']['altScore']!=r['V3']['score']))
print('scale ends: above 100 raw', sum(1 for r in V if r['V3']['scaleEnd']>0), 'max', max(r['V3']['scaleEnd'] for r in V), 'below 0', sum(1 for r in V if r['V3']['scaleEnd']<0), 'min', min(r['V3']['scaleEnd'] for r in V))
print('scores at 100 (any dim)', sum(1 for r in V if any(x>0 for x in r['V3']['reserve'].values())), 'dims below 0', sum(1 for r in V if any(x<0 for x in r['V3']['reserve'].values())))
print('limit1 bites', collections.Counter(r['tier'] for r in V if r['V3']['sustainsLimited']))
print('hired cap bites', sum(1 for r in V if r['V3']['hiredCapped']), [r['key'] for r in V if r['V3']['hiredCapped']][:5])
tr=sum(1 for r in V if any(p['n'] in ('Arcane practitioners','Clergy (divine)','Druids') for p in r['V3']['parts']) and sum((p['raw'].get('mon',0)) for p in r['V3']['parts'] if p['n'] in ('Arcane practitioners','Clergy (divine)','Druids'))<sum((p['raw'].get('mon',0)) for p in r['V1']['parts'] if p['n'] in ('Arcane practitioners','Clergy (divine)','Druids'))-0.01)
print('traditions cap binds', tr)
wl=[r for r in V if any(p['n']=='Walls' and p.get('note') for p in r['V3']['parts'])]
print('walls unmanned V3', collections.Counter(r['tier'] for r in wl), [(r['key'],r['score'],r['V3']['score']) for r in wl[:3]])
ARMED={'Garrison','Militia','Watch','Hired company',"Adventurers' charter",'Armed households','Wardens'}
noarm=[r for r in V if not any(p['n'] in ARMED for p in r['V3']['parts'])]
print('no armed body: walled', collections.Counter(r['tier'] for r in noarm if any(p['n']=='Walls' for p in r['V3']['parts'])), 'wealthy(Prosperous/Wealthy)', collections.Counter(r['tier'] for r in noarm if r['pre'] in ('Prosperous','Wealthy')), 'all', collections.Counter(r['tier'] for r in noarm))
# R5 magic by size
for t in ['town','city','metropolis']:
    mg=lambda v: st.mean(sum(p['pts'] for p in r[v]['parts'] if p['n'].startswith('Magic')) for r in V if r['tier']==t)
    print('magic part mean',t,'V2',round(mg('V2'),2),'V3',round(mg('V3'),2))
# R9 dial vs armed houses
by=collections.defaultdict(list)
for r in V:
    mp=r.get('milPri'); 
    if mp is None: continue
    b=0 if mp<34 else 1 if mp<67 else 2
    by[(r['tier'],b)].append(sum(1 for p in r['V3']['parts'] if p['n'] in ARMED - {'Armed households'}))
print('armed houses by military dial (low<34 / mid / high>=67):', {t:[round(st.mean(by[(t,b)]),2) if by[(t,b)] else None for b in range(3)] for t in ['village','town','city','metropolis']})
mv=[(r['key'],r['readiness'],r['score'],r['V3']['band'],r['V3']['score']) for r in V if abs(bi(r['V3']['band'])-bi(r['readiness']))>=2]
print('two-band movers vs today', len(mv)); 
json.dump([r['key'] for r in V if abs(bi(r['V3']['band'])-bi(r['readiness']))>=2], open(f'{S}/out/mv2.json','w'))
