import json, statistics as st
S='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
d=json.load(open(S+'/capacity-horizon/artifacts/horizon-600y-4s-lit.json'))
v=d['yearlyMs']; yp=d['yearlyPopulations']
pop=[sum(r) for r in yp]
print('realm pop y1 %d y100 %d y300 %d y500 %d y600 %d'%(pop[0],pop[99],pop[299],pop[499],pop[599]))
print('--- per century: mean ms/y, mean pop, ms per 1000 souls ---')
for i in range(6):
    m=st.mean(v[i*100:(i+1)*100]); p=st.mean(pop[i*100:(i+1)*100])
    print(' c%d ms %7.1f  pop %8.1f  ms/ksouls %6.3f'%(i+1,m,p,m/p*1000))
# noise: century 5 vs 6 by decade
print('--- decade means, centuries 4-6 ---')
for dd in range(30,60):
    print('  y%3d-%3d  %7.1f'%(dd*10+1,dd*10+10, st.mean(v[dd*10:dd*10+10])), end='\n' if dd%3==2 else '')
print()
c5=v[400:500]; c6=v[500:600]
print('c5 mean %.1f sd %.1f ; c6 mean %.1f sd %.1f'%(st.mean(c5),st.pstdev(c5),st.mean(c6),st.pstdev(c6)))
se=(st.pstdev(c5)**2/100+st.pstdev(c6)**2/100)**0.5
print('diff %.1f ms, se of diff %.1f ms -> t=%.2f'%(st.mean(c6)-st.mean(c5), se, (st.mean(c6)-st.mean(c5))/se))
# regression ms ~ pop
n=len(v); mx=st.mean(pop); my=st.mean(v)
b=sum((pop[i]-mx)*(v[i]-my) for i in range(n))/sum((pop[i]-mx)**2 for i in range(n)); a=my-b*mx
ss=sum((v[i]-my)**2 for i in range(n)); rss=sum((v[i]-(a+b*pop[i]))**2 for i in range(n))
print('ms = %.1f + %.5f*pop ; R2=%.4f'%(a,b,1-rss/ss))
# same for the 300y world
d3=json.load(open(S+'/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json'))
v3=d3['yearlyMs']; p3=[sum(r) for r in d3['yearlyPopulations']] if d3.get('yearlyPopulations') else None
print('300y world has yearlyPopulations:', p3 is not None)
if p3:
    for i in range(3):
        print(' 300w c%d ms %7.1f pop %8.1f ms/ksouls %6.3f'%(i+1,st.mean(v3[i*100:(i+1)*100]),st.mean(p3[i*100:(i+1)*100]),st.mean(v3[i*100:(i+1)*100])/st.mean(p3[i*100:(i+1)*100])*1000))
# 12s probe: ms per ksouls
for n2,f in (('12s lit','/capacity-horizon/artifacts/probe-30y-12s-lit.json'),('12s dark','/capacity-horizon/artifacts/probe-30y-12s-dark.json'),('4s lit w0','/soak909/fresh-30y-4s-lit.json'),('4s dark w0','/soak909/fresh-30y-4s.json')):
    dd=json.load(open(S+f)); vv=dd['yearlyMs']; pp=[sum(r) for r in dd['yearlyPopulations']]
    print('%-10s meanms %8.1f meanpop %8.1f ms/ksouls %6.3f  pop0 %d'%(n2,st.mean(vv),st.mean(pp),st.mean(vv)/st.mean(pp)*1000,pp[0]))
