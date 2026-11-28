# Merge the E/BE run (r3) onto the first run's base (r2), by seed: python3 merge3.py <r2> <r3> <out-dir>
import json, sys, glob, os
r2, r3, out = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
base = {json.loads(l)['key']: json.loads(l) for f in glob.glob(f'{r2}/c2-*.ndjson') for l in open(f)}
with open(f'{out}/c2-merged.ndjson', 'w') as o:
    for f in sorted(glob.glob(f'{r3}/c2-*.ndjson')):
        for l in open(f):
            r = json.loads(l); b = base[r['key']]
            o.write(json.dumps({'key': r['key'], 'tier': r['tier'], 'forced': r['forced'], 'base': b['base'], 'A': b['A'], 'B': b['B'], 'E': r['E'], 'BE': r['BE']}) + '\n')
