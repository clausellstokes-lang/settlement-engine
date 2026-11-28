import json,glob,sys,collections,statistics as st
S=sys.argv[1]; M={}
for f in glob.glob(f'{S}/out/meas.*.ndjson'):
    for l in open(f): r=json.loads(l); M[r['key']]=r
V=list(M.values())
BANDS=['Undefended','Vulnerable','Lightly Defended','Defensible','Well-Defended','Fortress']; bi=BANDS.index
print('| size (calm births) | n | today: distinct readiness / share at the commonest | V3 (+R13/R14), no conditions | V3 with the proposed conditions |')
print('|---|---|---|---|---|')
for t in ['thorp','hamlet','village','town','city','metropolis']:
    sel=[r for r in V if r['tier']==t and not r['forced']]
    def same(f):
        c=collections.Counter(f(r) for r in sel); return f"{len(c)} / {round(100*c.most_common(1)[0][1]/len(sel),1)}%"
    print(f"| {t} | {len(sel)} | {same(lambda r:r['score'])} | {same(lambda r:r['V4']['score'])} | {same(lambda r:r['V4C']['score'])} |")
d=[r['V4C']['total']-r['V4']['total'] for r in V]
print('spread by conditions: mean |move|',round(st.mean(abs(x) for x in d),2),'p95 |move|',round(sorted(abs(x) for x in d)[int(.95*len(d))],2),'max',round(max(abs(x) for x in d),2), 'share over 3 points', round(100*sum(1 for x in d if abs(x)>3)/len(d),1),'%')
bc=collections.Counter(bi(r['V4C']['band'])-bi(r['V4']['band']) for r in V); print('band changes by condition alone', dict(bc), 'of', len(V))
cc=collections.Counter((c['part'],c['c']) for r in V for c in r['V4C']['conditions']); cl=sum(1 for r in V for c in r['V4C']['conditions'] if c['closed'])
print('conditions drawn', sum(cc.values()), 'above closed by a fact', cl); print(sorted(cc.items())[:24])
for t in ['thorp','hamlet','town','city']:
    sel=[x for r,x in zip(V,d) if r['tier']==t]; print(t,'mean |move|',round(st.mean(abs(x) for x in sel),2),'max',round(max(abs(x) for x in sel),2))
