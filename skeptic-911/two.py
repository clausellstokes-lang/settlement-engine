import json, statistics as st
S='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
d3=json.load(open(S+'/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json'))
yr=d3['behavioral']['yearly']
print('300y behavioral years',len(yr),'keys of yearly[0]',list(yr[0].keys())[:12])
sv=yr[0].get('stateVectors')
print('stateVectors sample', (sv[0] if sv else None))
pops=[]
for y in yr:
    s=y.get('stateVectors')
    pops.append(sum(x.get('population',0) for x in s) if s else None)
if pops[0] is not None:
    for i in range(3):
        print(' 300w c%d meanpop %8.1f'%(i+1, st.mean(pops[i*100:(i+1)*100])))
    print(' 300w pop y1 %s y300 %s'%(pops[0],pops[-1]))
d6=json.load(open(S+'/capacity-horizon/artifacts/horizon-600y-4s-lit.json'))
v=d6['yearlyMs']
# trend over y401..600
xs=list(range(401,601)); ys=v[400:600]
mx=st.mean(xs); my=st.mean(ys)
b=sum((xs[i]-mx)*(ys[i]-my) for i in range(200))/sum((x-mx)**2 for x in xs); a=my-b*mx
res=[ys[i]-(a+b*xs[i]) for i in range(200)]
sb=(sum(r*r for r in res)/198/sum((x-mx)**2 for x in xs))**0.5
print('y401-600 trend: %.3f ms/year  se %.3f  t=%.2f  -> per century %.1f ms (%.2f%% of mean)'%(b,sb,b/sb,b*100,b*100/my*100))
xs2=list(range(1,401)); ys2=v[:400]
mx2=st.mean(xs2); my2=st.mean(ys2)
b2=sum((xs2[i]-mx2)*(ys2[i]-my2) for i in range(400))/sum((x-mx2)**2 for x in xs2)
print('y1-400   trend: %.3f ms/year (for contrast)'%b2)
