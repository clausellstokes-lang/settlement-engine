# REVIEW-UPKEEP-CAPACITY (g): the readiness label and the four score bands, every surface against the record, per birth.
# usage: python3 agree.py <dir> <out>   (dir holds <seed>.txt.gz and <seed>.json.gz)
import sys,os,re,gzip,json,collections
D,OUT=sys.argv[1:3]; LABELS={'fortress','well-defended','defensible','lightly defended','vulnerable','undefended'}; bad=[]; n=0; seen=collections.Counter()
for f in sorted(os.listdir(D)):
    if not f.endswith('.txt.gz'): continue
    seed=f[:-7]; jf=os.path.join(D,seed+'.json.gz')
    if not os.path.exists(jf): continue
    s=json.load(gzip.open(jf)); d=s.get('defenseProfile') or {}; lab=(d.get('readiness') or {}).get('label'); sc=d.get('readiness',{}).get('score')
    t=gzip.open(os.path.join(D,f),'rt').read(); n+=1
    got={}
    for k,rx in [('pdf',r'^Defense: (.+)$'),('foundry',r'^- \*\*Readiness:\*\* (.+)$'),('ai',r'^Defense posture: ([^,]+), military score'),('why',r'^\*?([A-Z][a-z-]+(?: [a-z-]+)?): (?:no walls|a palisade|palisade|walls|town walls|city walls|the walls|stone)')]:
        for m in re.finditer(rx,t,re.M):
            v=m.group(1).strip().lower()
            if v in LABELS: got.setdefault(k,set()).add(v)
    m=re.search(r'"military score (\d+)/100',t)
    for k,v in got.items():
        seen[k]+=1
        if v!={lab.lower()}: bad.append((seed,k,sorted(v),lab,sc))
    mm=re.search(r'Defense posture: [^,]+, military score (\d+)/100',t)
    if mm and int(mm.group(1))!=d.get('scores',{}).get('military'): bad.append((seed,'ai-military',mm.group(1),d['scores'].get('military'),None))
with open(OUT,'w') as o:
    o.write(f'births {n}; surfaces found {dict(seen)}; disagreements {len(bad)}\n')
    for b in bad: o.write(json.dumps(b)+'\n')
print(n,dict(seen),len(bad))
