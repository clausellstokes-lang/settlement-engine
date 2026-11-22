# The chair's cut of JOIN-ROWS.json into one file of OPEN rows for each holder (2026-11-14).
# usage: python3 cut_joinrows.py <JOIN-ROWS.json> <out-dir>
import json, io, collections, re, sys
rows = json.load(open(sys.argv[1])); out = sys.argv[2]
def w(r):
    try: return int(r.get('width') or 0)
    except Exception: return 0
def holders(r):
    o = []
    for x in (r.get('holding') or []):
        for y in str(x).split(','):
            y = y.strip()
            if y: o.append(y)
    return o or ['(none)']
by = collections.defaultdict(list)
for r in rows:
    if r['state'] != 'OPEN': continue
    hs = holders(r)
    by[hs[0] if len(hs) == 1 else 'SHARED'].append(r)
rank = {'HIGH': 0, 'HIGH?': 1, 'MEDIUM': 2, 'MEDIUM?': 3, 'LOW': 4}
for k, rs in sorted(by.items()):
    rs.sort(key=lambda r: (rank.get(r['severity'], 9), -w(r)))
    name = re.sub(r"[^A-Za-z0-9]+", '-', k).strip('-').lower() or 'none'
    L = ["# OPEN rows of the join's table held by: %s\n" % k,
         "Cut by the chair from `docs/chair/2026-11-14/JOIN-ROWS.json` on origin/lane/join-rows-2026-11-14 (JOIN-ROWS-1's table: counts AS NAMED by each row's source, none re-taken; a row is a CANDIDATE until it is measured at the lane's tip). One row a bullet: id, severity, width as named, the sentence, the writer on the joined tree (file, enclosing unit, holder), the count as named, the sources.\n"]
    for r in rs:
        ws = r.get('writer_on_join') or []
        wt = '; '.join("%s, in %s [%s]" % (x.get('file'), str(x.get('unit'))[:70].replace('`', "'"), x.get('holder')) for x in ws) or '(no writer traced)'
        src = '; '.join("%s, under \"%s\"" % (s.get('path'), str(s.get('heading'))[:90]) for s in (r.get('sources') or []))
        L.append("- **%s** · %s · width %s · holders: %s\n  - SENTENCE: %s\n  - WRITER: %s\n  - COUNT AS NAMED: %s\n  - SOURCES: %s\n" % (
            r['id'], r['severity'], r.get('width'), ', '.join(holders(r)), str(r.get('sentence')).replace('\n', ' ')[:700], wt,
            str(r.get('count')).replace('\n', ' ')[:300], src[:700]))
    io.open('%s/OPEN-%s.md' % (out, name), 'w', encoding='utf-8').write('\n'.join(L))
