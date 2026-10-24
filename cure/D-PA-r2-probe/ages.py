# D-PA-r2 probe: over the volume's own executed birth outputs (findings/R-PA2-probe/out-*.json, written by birth.mjs),
# the realm's two oldest members, whether a genesis tie joins them, and the span of founding ages. Reads JSON only.
import json, sys
base = sys.argv[1]
allAges = []
for size in ('small', 'medium', 'large'):
    d = json.load(open(f'{base}/out-{size}.json'))
    by = sorted(d['members'], key=lambda m: -m['founding']['age'])
    a, b = by[0], by[1]
    allAges += [m['founding']['age'] for m in d['members']]
    ties = [r['type'] for r in d['planRelations'] if {r['a'], r['b']} == {a['slot'], b['slot']}]
    print(f"{size:6s} members {len(by):2d} · oldest {a['tier']} {a['founding']['age']}y · second {b['tier']} {b['founding']['age']}y · tie between them: {ties[0] if ties else 'none'}")
print(f"founding ages over the three realms: {min(allAges)} to {max(allAges)} years")
