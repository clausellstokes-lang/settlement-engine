# UPKEEP-CAPACITY: the six example towns (ratings only). python3 ex.py <dir> key1 key2 ...  (no keys: lists candidates)
import json, sys, glob
d = sys.argv[1]; keys = sys.argv[2:]
rows = {json.loads(l)['key']: json.loads(l) for f in sorted(glob.glob(f'{d}/corpus-*.ndjson')) for l in open(f)}
SK = ['military', 'beasts', 'order', 'supply', 'magic']
if not keys:
    for t, want in [('town', 'Alchemist shop'), ('city', 'Alchemist quarter'), ('thorp', None), ('village', None), ('metropolis', None)]:
        c = [r for r in rows.values() if r['tier'] == t and not r['forced'] and (want is None or any(h[0] == want for h in r['houses'].get('alchemists', [])))]
        c.sort(key=lambda r: r['B']['score'] - r['base']['score'])
        mid = c[len(c) // 2]; print(t, want, len(c), 'median-move key', mid['key'], [ (r['key'], r['B']['score'] - r['base']['score']) for r in c[:: max(1, len(c)//6)]][:7])
    sys.exit()
for k in keys:
    r = rows[k]
    hs = sorted({h[0] for v in r['houses'].values() for h in v})
    print(f'### {k} ({r["tier"]}{", " + r["forced"] if r["forced"] else ""}) holds: {", ".join(hs)}')
    for v in ['base', 'A', 'B']:
        x = r[v]; print(f'  {v:4s} readiness {x["score"]:3d} {x["band"]:16s} ' + ' '.join(f'{SK[i]} {x["scores"][i]}' for i in range(5)))
