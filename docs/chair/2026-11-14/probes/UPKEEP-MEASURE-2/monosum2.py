# UPKEEP-MEASURE-2: the monotonicity tables from mono2.mjs: by set (the reader's / the widened), kind, house, score.
#   python3 monosum2.py <mono2.ndjson> [top-N] [--reader-only]
import json, sys, collections as C
rows=[json.loads(l) for l in open(sys.argv[1])]
N=int(sys.argv[2]) if len(sys.argv)>2 and sys.argv[2].isdigit() else 40
SC=['military','monster','internal','economic','magical','readiness']
def table(rs, title):
    by=C.defaultdict(C.Counter); seeds=C.defaultdict(set); tot=C.Counter(); worst=C.defaultdict(int)
    for r in rs:
        key=(r['kind'], r['house'] or '', r['to'])
        for k,(a,b) in r['falls'].items(): by[key][k]+=1; tot[(r['kind'],k)]+=1; worst[key]=min(worst[key], b-a)
        seeds[key].add(r['seed'])
    print(f'### {title}: changes with a fall {len(rs)}; births with a fall {len({r["seed"] for r in rs})}')
    for kind in ('add','enlarge'):
        ks=sorted([k for k in by if k[0]==kind], key=lambda k:(-len(seeds[k]),k))
        print(f'  {kind}: houses/renames with a fall {len(ks)}; score-falls by score', {k: tot[(kind,k)] for k in SC if tot[(kind,k)]})
        for k in ks[:N]:
            print(f'    {(k[1]+" -> " if k[1] else "")+k[2]:52s} births {len(seeds[k]):4d}  ' + ' '.join(f'{s[:4]}:{by[k][s]}' for s in SC if by[k][s]) + f'  worst {worst[k]}')
        if len(ks)>N: print(f'    ... {len(ks)-N} more')
table([r for r in rows if r['r']], "THE READER'S SET (mono.mjs's houses and pairs)")
if '--reader-only' not in sys.argv: table(rows, 'THE WIDENED SET (every catalogue house at the tier or one around; every ladder pair)')
