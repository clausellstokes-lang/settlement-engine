# F3: each sentence's bands (the bands it can be true under, read from its own words), against the band its row prints.
import json,collections,re,sys
OK={ # prefix -> bands the sentence is true under
 'Active frontier. Walls and garrison provide credible deterrence':{'STRONG','ADEQUATE'},
 'A palisade and a militia, as most frontier':{'ADEQUATE'}, 'Walls and a militia, as most frontier':{'ADEQUATE'},
 'Active frontier with a':{'ADEQUATE','WEAK'},
 'Wild country all round and nobody organised':{'WEAK','CRITICAL'},
 'Quiet country and no organised defence':{'ADEQUATE','STRONG'},
 'Quiet country, and far more defences':{'STRONG'},
 'Safe heartland with minimal creature activity':{'ADEQUATE','STRONG'},
 'Embattled region: constant creature pressure. Walls and garrison':{'ADEQUATE','STRONG'},
 'Palisade and citizen militia provide a viable but demanding':{'ADEQUATE','WEAK'}, 'Walls and citizen militia provide a viable but demanding':{'ADEQUATE','WEAK'},
 'No perimeter, but the charter hall':{'ADEQUATE','WEAK'},
 'Walls exist but no organized force':{'WEAK','CRITICAL'}, 'A palisade stands but no organized force':{'WEAK','CRITICAL'},
 'Military force present but no perimeter walls':{'ADEQUATE','WEAK'},
 'embattled region with no organized defense':{'CRITICAL'},
 'Walls and professional garrison provide':{'STRONG','ADEQUATE'}, 'A palisade and a professional garrison provide':{'STRONG','ADEQUATE'},
 'A palisade and armed townsfolk':{'ADEQUATE','WEAK'}, 'Walls and armed townsfolk':{'ADEQUATE','WEAK'},
 'Walls present but no organized military force':{'WEAK','CRITICAL'}, 'A palisade but no organized military force':{'WEAK','CRITICAL'},
 'Professional garrison without perimeter walls':{'ADEQUATE','WEAK'},
 'Armed citizens who know their ground':{'ADEQUATE','WEAK'},
 'No walls or garrison. Cannot resist':{'WEAK','CRITICAL'},
}
rows=[json.loads(l) for l in open(sys.argv[1])]
mis=collections.defaultdict(list); tot=collections.Counter(); births=set(); unk=set()
for o in rows:
    for r in o['rows']:
        k=next((p for p in OK if r['assess'].startswith(p)),None)
        if not k: unk.add(r['assess'][:60]); continue
        tot[r['label']]+=1
        if r['status'] not in OK[k]: mis[(r['label'],k,r['status'])].append((o['seed'],r['score'])); births.add(o['seed'])
print('unclassed sentences',unk)
print('rows',dict(tot),'mismatched rows',sum(len(v) for v in mis.values()),'births',len(births))
for (lab,k,st),v in sorted(mis.items(),key=lambda x:-len(x[1])):
    print(f'{len(v):4d} {lab[:7]} {st:9s} "{k}" e.g. {v[:3]}')
