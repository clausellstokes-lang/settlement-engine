import json,collections
L=lambda f:{json.loads(l)['seed']:json.loads(l) for l in open(f)}
V=L('scan.tip.ndjson'); A=L('scan.A.ndjson'); B=L('scan.B.ndjson'); C=L('scan.C.ndjson')
LAD=['Undefended','Vulnerable','Lightly Defended','Defensible','Well-Defended','Fortress']
cuts=[(76,'Fortress'),(55,'Well-Defended'),(38,'Defensible'),(24,'Lightly Defended'),(12,'Vulnerable')]
band=lambda x:next((l for c,l in cuts if x>=c),'Undefended')
def summ(X,name):
    s=collections.Counter()
    for k,t in X.items():
        ps=round(sum(p for _,p in t['parts'])*10)
        s['sum==score(tenths)']+= ps==round(t['rs']*10)
        s['score integer']+= t['rs']==int(t['rs'])
        s['band==ladder(score)']+= band(t['rs'])==t['rl']
    print(name,dict(s))
summ(A,'A'); summ(B,'B'); summ(C,'C')
# A vs V
bm=collections.Counter(); ex=[]
for k in V:
    if V[k]['rl']!=A[k]['rl']: bm[(V[k]['rl'],A[k]['rl'])]+=1; ex.append((k,V[k]['rs'],A[k]['rs']))
print('A: band moves vs 73b1304de',sum(bm.values()),dict(bm),ex[:6])
print('A: max |score move|',max(abs(A[k]['rs']-V[k]['rs']) for k in V))
# B vs A
stone=lambda w: any(x in w for x in ['Town walls','City walls','Massive walls','Stone wall','Citadel']) 
mv=[(k,A[k]['rs'],B[k]['rs'],A[k]['rl'],B[k]['rl'],B[k]['walls']) for k in A if A[k]['rs']!=B[k]['rs']]
print('B: births moved',len(mv),'walls kinds of movers',collections.Counter(x[5] for x in mv).most_common(8))
print('B: stone-walled movers',[x for x in mv if stone(x[5]) and not any(y in x[5] for y in ['Palisade','earthwork','Earthwork'])][:5])
bb=[x for x in mv if x[3]!=x[4]]; print('B: band changes',len(bb),bb[:12])
print('B: mean move by size',{sz:round(sum(B[k]['rs']-A[k]['rs'] for k in A if k.split('-')[2]==sz and A[k]['rs']!=B[k]['rs'])/max(1,sum(1 for k in A if k.split('-')[2]==sz and A[k]['rs']!=B[k]['rs'])),2) for sz in ['thorp','hamlet','village','town','city','metropolis']})
# C vs B
mvc=[(k,B[k]['rs'],C[k]['rs'],B[k]['rl'],C[k]['rl']) for k in B if B[k]['rs']!=C[k]['rs']]
print('C: births moved',len(mvc),'by crisis',collections.Counter(x[0].split('-')[1] for x in mvc))
print('C: wartime mean',round(sum(x[2]-x[1] for x in mvc)/max(1,len(mvc)),2),'min',min((x[2]-x[1] for x in mvc),default=0),'max',max((x[2]-x[1] for x in mvc),default=0))
cb=[x for x in mvc if x[3]!=x[4]]; print('C: band changes',len(cb),cb[:12])
SUST={'stores','alchemists','hospital','market','purse','foodWorking','foodBroken','provisioned','unprovisioned','magic'}
pc=collections.Counter()
for k,_,_,_,_ in mvc:
    a=dict(B[k]['parts']); c=dict(C[k]['parts'])
    for i in set(a)|set(c):
        if abs(a.get(i,0)-c.get(i,0))>0.05: pc['SUSTAINS:'+i if i in SUST else 'OTHER:'+i]+=1
print('C: parts that moved',pc.most_common(20))
