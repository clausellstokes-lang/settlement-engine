import json,glob,collections,sys,statistics as st
S=sys.argv[1]
def load(t):
    d={}
    for f in glob.glob(f'{S}/out/{t}.*.ndjson'):
        for l in open(f):
            r=json.loads(l); d[r['key']]=r
    return d
M,B=load('meas'),load('base')
BANDS=['Undefended','Vulnerable','Lightly Defended','Defensible','Well-Defended','Fortress']
bi=lambda b:BANDS.index(b)
TIERS=['thorp','hamlet','village','town','city','metropolis']
def cohort(r):
    f=r['forced'];
    return 'calm' if not f else f
rows=[]
for k,r in M.items():
    b=B[k]
    rows.append(dict(key=k,tier=r['tier'],coh=cohort(r),base=b['score'],baseB=b['readiness'],today=r['score'],todayB=r['readiness'],v1=r['V1']['score'],v1B=r['V1']['band'],v2=r['V2']['score'],v2B=r['V2']['band'],pros=r['prosperity'],pre=r['pre']))
def summ(sel,title):
    print('##',title,'n',len(sel))
    print('| | base | today | V1 | V2 |'); 
    for col in ['base','today','v1','v2']: pass
    m=lambda c: round(st.mean(x[c] for x in sel),1) if sel else '-'
    print('mean score |',m('base'),'|',m('today'),'|',m('v1'),'|',m('v2'))
    for c in ['todayB','v1B','v2B']:
        d=collections.Counter(bi(x[c])-bi(x['baseB']) for x in sel)
        print(c,'vs base: down2+',sum(v for k,v in d.items() if k<=-2),'down1',d[-1],'same',d[0],'up1',d[1],'up2+',sum(v for k,v in d.items() if k>=2))
    for c in ['baseB','todayB','v1B','v2B']:
        d=collections.Counter(x[c] for x in sel); print(c,[d[b] for b in BANDS])
for t in TIERS: summ([x for x in rows if x['tier']==t and x['coh']=='calm'],'calm '+t)
for coh in ['famine','under_siege','wartime','occupied','plague_onset','monster_pressure','indebted','succession_void','infiltrated']:
    summ([x for x in rows if x['coh']==coh],'forced '+coh)
print('over100', {c:sum(1 for x in rows if x[c]>100) for c in ['v1','v2']}, 'below0',{c:sum(1 for x in rows if x[c]<0) for c in ['v1','v2']}, 'max',max(x['v1'] for x in rows),'min',min(x['v1'] for x in rows))
json.dump(rows,open(f'{S}/out/rows.json','w'))
