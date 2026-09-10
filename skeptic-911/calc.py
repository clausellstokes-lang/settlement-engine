import json, math
S='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
d600=json.load(open(S+'/capacity-horizon/artifacts/horizon-600y-4s-lit.json'))
d300=json.load(open(S+'/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json'))
ym600=d600['yearlyMs']; ym300=d300['yearlyMs']
print('type ym600[0]:',type(ym600[0]).__name__, str(ym600[0])[:120])
def tolist(ym):
    if isinstance(ym[0],(int,float)): return [float(x) for x in ym]
    # dict form
    k=[k for k in ym[0].keys()]
    print('keys',k)
    return None
v600=tolist(ym600); v300=tolist(ym300)
if v600 is None: raise SystemExit
print('len',len(v600),len(v300))
print('sum600 all  = %.1f s'%(sum(v600)/1000))
print('sum600 1..300 = %.1f s -> %.4f s/sy'%(sum(v600[:300])/1000, sum(v600[:300])/1000/1200))
print('sum300 all  = %.1f s -> %.4f s/sy'%(sum(v300)/1000, sum(v300)/1000/1200))
print('primary600',d600['runDurationsMs']['primary'],'-> %.4f s/sy'%(d600['runDurationsMs']['primary']/1000/2400))
print('primary300',d300['runDurationsMs']['primary'],'-> %.4f s/sy'%(d300['runDurationsMs']['primary']/1000/1200))
print()
print('--- through-yN table (600y world) ---')
for n in (100,200,300,400,500,600):
    tot=sum(v600[:n])/1000
    print(' y%-4d %8.1f s  %.4f s/sy'%(n,tot,tot/(n*4)))
print('--- century means (600y world) ---')
base=None
for i in range(6):
    m=sum(v600[i*100:(i+1)*100])/100
    if base is None: base=m
    print(' c%d %8.1f ms/y  x%.4f'%(i+1,m,m/base))
print('--- century means (300y world) ---')
b2=None
for i in range(3):
    m=sum(v300[i*100:(i+1)*100])/100
    if b2 is None: b2=m
    print(' c%d %8.1f ms/y  x%.4f'%(i+1,m,m/b2))
print()
print('--- cost model ---')
lit4=(55243+54790)/2
print('mean lit 30y4s ms %.1f -> %.5f s/sy'%(lit4, lit4/1000/120))
r4_30=lit4/1000/120
r12_30=244623/1000/360
print('r12_30 %.5f'%r12_30)
print('f_S(12) = %.5f'%(r12_30/r4_30))
print('cost ratio x3 settlements = %.5f (rate ratio*3)'%(r12_30/r4_30*3))
print('raw cost ratio 244623/mean = %.5f ; 244623/55243 = %.5f'%(244623/lit4, 244623/55243))
for cr in (4.446, r12_30/r4_30*3, 244623/lit4, 244623/55243):
    print('  k = ln(%.5f)/ln3 = %.5f'%(cr, math.log(cr)/math.log(3)))
r4_300a=762290/1000/1200
print('f_Y(300) = %.5f / %.5f = %.5f'%(r4_300a, r4_30, r4_300a/r4_30))
print()
print('--- dark/lit ---')
print('4s: 66679/55243 = %.5f ; 66679/mean = %.5f'%(66679/55243, 66679/lit4))
print('12s: 271395/244623 = %.5f'%(271395/244623))
print()
print('--- terminal cell ---')
for lbl,rA in (('seedA 0.6352',r4_300a),('seedB 0.8051',0.8051),('seedB measured', sum(v600[:300])/1000/1200)):
    r12_300=rA*(r12_30/r4_30)
    runA=r12_300*3600
    print(' %s -> rate(12,300)=%.4f  runA=%.0f s  A+B=%.0f s = %.2f h  dark=%.2f h'%(lbl,r12_300,runA,2*runA,2*runA/3600,2*runA*1.1094/3600))
print()
print('--- prediction integral ---')
q1,q4=2139.2,2890.2; y1,y4=38,263
slope=(q4-q1)/(y4-y1); inter=q1-slope*y1
print('slope %.4f intercept %.2f'%(slope,inter))
for N in (300,600):
    tot=sum(2012.4+3.338*y for y in range(1,N+1))/1000
    tot2=sum(inter+slope*y for y in range(1,N+1))/1000
    print(' N=%d  receipt-coeffs %.1f s | exact-coeffs %.1f s'%(N,tot,tot2))
print('miss: 2239.561/1809.28 = %.4f ; (2239.561-1809.28)/2239.561 = %.4f'%(2239.561/1809.281, (2239.561-1809.281)/2239.561))
print('300y self-check: 754.4 vs measured 762.29 -> err %.4f'%((754.43-762.29)/762.29))
