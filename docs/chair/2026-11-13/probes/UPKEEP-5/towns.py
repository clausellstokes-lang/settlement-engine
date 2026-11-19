import json,glob,sys
S=sys.argv[1]; keys=sys.argv[2].split(',')
M={};B={}
for f in glob.glob(f'{S}/out/meas.*.ndjson'):
    for l in open(f): r=json.loads(l); M[r['key']]=r
for f in glob.glob(f'{S}/out/base.*.ndjson'):
    for l in open(f): r=json.loads(l); B[r['key']]=r
G={'BUILT':'Built','STANDS':'Stands','SUSTAINS':'Sustains','GROUND':'The ground','AGAINST':'Against'}
def fmt(x): 
    x=round(x,1); return ('+' if x>0 else '')+(str(int(x)) if x==int(x) else str(x))
for k in keys:
    r=M[k]; b=B[k]; v1=r['V1']; v2=r['V2']; n=v1['n']
    print(f"KEY {k} | {r['tier']} | label {r['prosperity']} (before any crisis: {r['pre']}) | stresses {','.join(r['stresses']) or 'none'} | route {r['route']} | terrain {r['terrain']} | threat {r['threat']} | months {r['months']} (at the pre-crisis share {r['monthsPre']}, full {r['monthsFull']})")
    print(f"RATING base {b['score']} {b['readiness']} | today {r['score']} {r['readiness']} | V1 {v1['score']} {v1['band']} ({v1['total']}) | V2 {v2['score']} {v2['band']} ({v2['total']})")
    print('TODAY DIMS', r['scores'], 'BASE DIMS', b['scores'])
    for p in v1['parts']:
        full=sum(p['raw'].values())/n if n==5 else sum(v for d,v in p['raw'].items() if d!='mag')/n
        cr=p.get('crisis') or {}
        crt=sum(cr.values())/n
        before=p['pts']+crt
        sc=''
        if p['scale']=='funded': sc=f"paid: kept {round(100*before/full) if full else 0}%"
        elif p['scale']=='bought': sc=f"bought: kept {round(100*before/full) if full else 0}%"
        elif p['scale']=='magic': sc=f"magic's health {round(100*(p['share'] or 1))}%"
        elif p['scale']=='stores': sc='stores laid by at the place\'s share'
        crs='; '.join(f"{c} takes {fmt(-x/n)}" for c,x in cr.items())
        print(f"  [{G[p['g']]}] {p['n']}: full {fmt(full)}" + (f" | {sc}" if sc else '') + (f" | {crs}" if crs else '') + f" | counts {fmt(p['pts'])}" + (f" ({p['note']})" if p.get('note') else ''))
    print(f"  [The ground] Size: {fmt(v1['size'])} | Threat ({r['threat']}): {fmt(-v1['danger'])}")
    print('  CRISES', v1['crises'])
    print('  V2 groups', v2['groups'], 'limited', v2['sustainsLimited'], [p['n']+':'+str(p['pts']) for p in v2['parts'] if p['n']=='Walls'])
    print()
