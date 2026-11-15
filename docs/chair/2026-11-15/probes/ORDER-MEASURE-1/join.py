# ORDER-MEASURE-1 · item 4: python3 join.py <snap.ndjson.gz> <chair docs/chair/2026-11-14 dir> <order.json> <out.json>
# Each worklist row (WORKLIST-*.json, WORKLIST3-*.json) is located in its town's record by its text: a final prose
# string that contains it (or that it contains, covering >= 60% of it). The string's birth step is the row's WRITE
# STEP. In that town: which fact families the step reads moved after the birth (the record moved under the line),
# and whether the line NAMES a thing that moved (a power or house present at the birth and gone at the end).
import gzip, json, sys, glob, re, collections
snapf, chairdir, orderf, outf = sys.argv[1:5]
order = json.load(open(orderf)); READS = order['reads']
FACT = ['powers', 'houses', 'chains', 'trade', 'income', 'food', 'safety', 'defence', 'people', 'ties', 'history', 'stress', 'conditions']
norm = lambda s: re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]+', ' ', s.lower())).strip()
def val_at(ch, i):
    v = None
    for j, x in ch:
        if j <= i: v = x
        else: break
    return v
rows = []
for f in sorted(glob.glob(chairdir + '/read-all/WORKLIST-*.json')) + sorted(glob.glob(chairdir + '/read-all-3/WORKLIST3-*.json')):
    for r in json.load(open(f)): r['_list'] = f.split('/')[-1][:-5]; rows.append(r)
need = {r['town'] for r in rows}
towns = {}
for line in gzip.open(snapf):
    r = json.loads(line)
    if r['seed'] in need: towns[r['seed']] = r
out = []
for row in rows:
    t = towns.get(row['town']); rec = {k: row.get(k) for k in ('id', 'sev', 'n', 'town', 'section', '_list')}
    rec['file'] = (row.get('writer') or {}).get('file'); rec['fn'] = (row.get('writer') or {}).get('fn'); rec['why'] = row.get('why'); rec['text'] = row['text']
    if not t: rec['match'] = 'no-town'; out.append(rec); continue
    nt = norm(row['text']); best = None
    if len(nt) >= 12:
        for path, b, text in t['prose']:
            ns = norm(text)
            if nt in ns: best = (path, b, text); break
            if len(ns) >= 12 and ns in nt and len(ns) >= 0.6 * len(nt) and not best: best = (path, b, text)
    if not best: rec['match'] = 'not-stored'; out.append(rec); continue
    path, b, text = best; L = t['labels']; end = len(L) - 1; step = L[b]
    rec.update(match='stored', path=path, step=step)
    moved = []
    for fam in READS.get(step, []):
        if fam not in FACT: continue
        ch = t['fam'][fam]
        if json.dumps(val_at(ch, b)) != json.dumps(val_at(ch, end)): moved.append(fam)
    rec['moved'] = moved
    named = []
    pa, pb = val_at(t['fam']['powers'], b), val_at(t['fam']['powers'], end)
    if pa and pb:
        gone = {f[0] for f in pa['f']} - {f[0] for f in pb['f']}
        named += ['power:' + g for g in gone if g and g.lower() in text.lower()]
    ha, hb = val_at(t['fam']['houses'], b), val_at(t['fam']['houses'], end)
    if ha and hb:
        named += ['house:' + g for g in set(ha) - set(hb) if g and g.lower() in text.lower()]
    rec['named'] = named
    out.append(rec)
json.dump(out, open(outf, 'w'))
c = collections.Counter(r['match'] for r in out); print('rows', len(out), dict(c))
