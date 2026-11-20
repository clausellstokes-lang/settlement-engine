# The register's clause against the town's own crisis: a row DISAGREES where it says "at peace" of a town whose own
# record holds a fighting crisis (siege, war, occupation, insurgency, revolt, raids), or names a war the town's
# record and the map do not hold.
import sys,json,collections
FIGHT={'under_siege','wartime','occupied','insurgency','slave_revolt','monster_pressure'}
rows=[json.loads(l) for l in open(sys.argv[1])]
dis=collections.Counter(); tot=collections.Counter(); ex={}
clauses=collections.Counter()
for r in rows:
    kinds=set(r['crises'])
    for camp in ('peace','besieged'):
        w=r[camp]['war']; clauses[(camp,r['kind'],w)]+=1; tot[camp]+=1
        bad=False
        if w=='at peace' and kinds & FIGHT: bad=True
        if camp=='peace' and w=='under siege' and 'under_siege' not in kinds: bad=True
        if camp=='peace' and w=='at war' and 'wartime' not in kinds: bad=True
        if bad:
            dis[(camp,r['kind'])]+=1; ex.setdefault((camp,r['kind']),(r['seed'],r[camp]['line']))
print('disagree',sum(dis.values()),'of',sum(tot.values()))
for k,v in sorted(dis.items()): print(' ',v,k,ex[k])
print('clauses by kind (peace campaign):')
for k in sorted({r['kind'] for r in rows}):
    print('  ',k,{w:clauses[('peace',k,w)] for (c,kk,w) in clauses if c=='peace' and kk==k}, '| besieged:', {w:clauses[('besieged',k,w)] for (c,kk,w) in clauses if c=='besieged' and kk==k})
