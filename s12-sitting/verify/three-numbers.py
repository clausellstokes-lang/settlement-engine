# three-numbers.py — the BUDGET, the DEPTH and the PERFECTION CEILING measured from the fourteen exemplar fingerprints
# by LEAVE-ONE-OUT: each exemplar is scored against the band (min..max) formed by the other thirteen on every rate-like metric.
import json,glob,os,statistics as st
P='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/primary/'
files=sorted(glob.glob(P+'*.fingerprint.json'))
def leaves(o,pre=''):
    out={}
    if isinstance(o,dict):
        for k,v in o.items():
            if isinstance(v,(dict,)): out.update(leaves(v,pre+k+'.'))
            elif isinstance(v,(int,float)) and not isinstance(v,bool): out[pre+k]=float(v)
    return out
fps={os.path.basename(f).replace('.fingerprint.json',''):leaves(json.load(open(f))) for f in files}
names=list(fps)
allkeys=set().union(*[set(v) for v in fps.values()])
# rate-like metrics only: present in every exemplar, values within [0,1] for all, not a raw count/size
skip=('count','total','words','sentences','n','size','sample','tokens','paragraphs','chars','length','top','index')
keys=[]
for k in sorted(allkeys):
    if not all(k in fps[n] for n in names): continue
    vals=[fps[n][k] for n in names]
    low=k.lower()
    if any(s in low.split('.')[-1] for s in skip): continue
    if all(0.0<=v<=1.0 for v in vals) and len(set(vals))>2: keys.append(k)
print(f'exemplars {len(names)} · rate-like metrics used {len(keys)} of {len(allkeys)} numeric leaves')
rows=[]
for n in names:
    exceeded=[];depths=[]
    for k in keys:
        peers=[fps[m][k] for m in names if m!=n]; lo,hi=min(peers),max(peers); w=hi-lo; v=fps[n][k]
        if w<=0: continue
        if v<lo: d=(lo-v)/w
        elif v>hi: d=(v-hi)/w
        else: d=0.0
        if d>0: exceeded.append((k,round(d,3))); depths.append(d)
    rows.append((n,len(exceeded),max(depths) if depths else 0.0, st.median(depths) if depths else 0.0, exceeded))
rows.sort(key=lambda r:-r[1])
for n,c,mx,md,ex in rows:
    print(f'{n:28s} metrics outside the peers\' band: {c:2d} of {len(keys)}  max depth {mx:5.2f} band-widths  median depth {md:4.2f}  | ' + ', '.join(f'{k.split(".")[-1]}:{d}' for k,d in sorted(ex,key=lambda x:-x[1])[:4]))
cs=[r[1] for r in rows]; mxs=[r[2] for r in rows]
print('\nSUMMARY over the fourteen (leave-one-out):')
print(f'  metrics exceeded per exemplar: min {min(cs)} · median {st.median(cs)} · max {max(cs)} (of {len(keys)})  → share of rules a human record breaks vs its peers: {min(cs)/len(keys):.2f} … {max(cs)/len(keys):.2f}')
print(f'  max depth per exemplar (band-widths outside): min {min(mxs):.2f} · median {st.median(mxs):.2f} · max {max(mxs):.2f}')
print(f'  exemplars with ZERO metrics outside their peers\' band: {sum(1 for c in cs if c==0)} of {len(cs)}')
json.dump({'keys':keys,'rows':[{'name':n,'exceeded':c,'maxDepth':mx,'medianDepth':md,'items':ex} for n,c,mx,md,ex in rows]},open('three-numbers.json','w'),indent=1)
