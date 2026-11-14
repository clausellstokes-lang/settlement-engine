import json,glob,sys
S=sys.argv[1]; keys=sys.argv[2].split(',')
M={};B={}
for f in glob.glob(f'{S}/out/meas.*.ndjson'):
    for l in open(f): r=json.loads(l); M[r['key']]=r
for f in glob.glob(f'{S}/out/base.*.ndjson'):
    for l in open(f): r=json.loads(l); B[r['key']]=r
SRC={'Walls':'roster','Garrison':'roster','Militia':'roster','Watch':'roster','Court':'roster','Prison':'roster','Wardens':'roster','Hired company':'roster + contract chain','Adventurers\' charter':'roster','Arcane practitioners':'roster + magic dial','Clergy (divine)':'roster + religion dial','Druids':'roster + magic dial','Martial strength (the military dial)':'military dial (config)','The purse':'standing label','Market':'roster','Healing (hospital)':'roster','Alchemists preserving the grain':'roster','Magic (wards, healing, countermagic)':'magic presence (roster, magic dial)','Crime':'criminal reading','Armed households':'tier','Parish as rallying point':'roster','Elders and reeve':'roster','Close-knit self-policing':'tier + roster','Remoteness (alarm and flight)':'route','Sea supply':'route','Many roads in':'route','Folk used to beasts':'threat','Plagued country':'threat'}
def src(n):
    if n.startswith(('Masons','Walls going','Food processing','Garrison prov','Garrison unprov')): return 'supply chains'
    for k,v in SRC.items():
        if n.startswith(k): return v
    if n.startswith('Stores'): return 'stores months (food record)'
    if n.startswith('Terrain'): return 'terrain'
    if 'chain' in n.lower() or n.startswith(('Masons','Walls going','Food processing','Garrison prov','Garrison unprov')): return 'supply chains'
    return '?'
def f1(x):
    x=round(x,1); return str(int(x)) if x==int(x) else str(x)
for k in keys:
    r=M[k]; b=B[k]; v=r['V3']; n=v['n']
    print(f"### {k}: {r['tier']}, label {r['prosperity']} (standing {r['pre']}), crises {', '.join(r['stresses']) or 'none'}")
    print(f"**Base {b['score']} {b['readiness']} · today {r['score']} {r['readiness']} · V1 {r['V1']['score']} · V2 {r['V2']['score']} · V3 {v['score']} {v['band']}**")
    rows=[]
    for p in v['parts']:
        full=sum(val for d,val in p['raw'].items() if d!='mag' or n==5)/n
        cr=p.get('crisis') or {}
        crs=', '.join(f"{c} −{f1(x/n)}" for c,x in cr.items())
        rows.append(f"{p['n']} [{src(p['n'])}] {f1(full)}→{f1(p['pts'])}" + (f" ({crs})" if crs else ''))
    print('- '+' · '.join(rows))
    print(f"- size {v['size']:+d}, threat −{v['danger']}; scores {v['dims']}; full at 100, reserve {v['reserve'] or 'none'}" + (f"; limit 1: sustains {f1(v['sustainsLimited']['from'])}→{f1(v['sustainsLimited']['to'])}" if v['sustainsLimited'] else '') + (f"; hired held to a watch's worth (−{f1(v['hiredCapped']/n)})" if v['hiredCapped'] else ''))
    print()
