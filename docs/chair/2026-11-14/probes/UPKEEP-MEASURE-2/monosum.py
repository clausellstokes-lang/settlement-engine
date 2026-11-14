# UPKEEP-MEASURE-2: the monotonicity table (by house and score): births in which each score and readiness FALL.
#   python3 monosum.py <mono.ndjson> [births-tried-file]
import json, sys, collections as C
rows=[json.loads(l) for l in open(sys.argv[1])]
SC=['military','monster','internal','economic','magical','readiness']
by=C.defaultdict(lambda: C.Counter()); seeds=C.defaultdict(set); tot=C.Counter(); worst=C.defaultdict(int)
for r in rows:
    key=(r['kind'], r['house'] or '', r['to'])
    for k,(a,b) in r['falls'].items():
        by[key][k]+=1; tot[(r['kind'],k)]+=1; worst[key]=min(worst[key], b-a)
    seeds[key].add(r['seed'])
print('falls (rows)', len(rows), 'births with a fall', len({r['seed'] for r in rows}))
for kind in ('add','enlarge'):
    print(f'== {kind}: births falling per score:', {k: tot[(kind,k)] for k in SC if tot[(kind,k)]})
    ks=sorted([k for k in by if k[0]==kind], key=lambda k:-len(seeds[k]))
    for k in ks:
        print(f'  {(k[1]+" -> " if k[1] else "")+k[2]:55s} births {len(seeds[k]):4d}  ' + ' '.join(f'{s}:{by[k][s]}' for s in SC if by[k][s]) + f'  worst {worst[k]}')
