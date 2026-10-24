import sys,json
both=[];emigT=0;flowT=0;n=0
for l in sys.stdin:
  if l.startswith('ARM'): print(l.strip()[:330])
  if l.startswith('{'):
    r=json.loads(l); n+=1
    if r['emigApplied']: emigT+=1
    if r['flowApplied']: flowT+=1
    if r['flowApplied'] and r['cols']: both.append(r)
print(f"  ticks={n} emigApplied={emigT} flowApplied={flowT} both={len(both)}")
for r in both[:2]: print('   BOTH', r['tick'],'emigLoss',r['emigLoss'],'cols',r['cols'],'colArrivals',r['colPeople'],'flowPeople',r['flowAppliedPeople'],'dA',r['dA'],'dB',r['dB'],'dTot',r['dTotal'],'hist',r['aHistory'])
