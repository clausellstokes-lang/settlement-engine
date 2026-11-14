# Base against tip, every moved leaf path with its row count and kind (arrays compared by index).
#   python3 fielddiff.py <base-dir> <tip-dir> <corpus> <out.json> [old-field-diff.json old-section]
import gzip, glob, json, sys, collections
base, tip, corpus, out = sys.argv[1:5]
old = json.load(open(sys.argv[5]))[sys.argv[6]]['paths'] if len(sys.argv) > 6 else None
def load(d):
    m = {}
    for f in sorted(glob.glob(f'{d}/{corpus}.records.*.ndjson.gz')):
        for l in gzip.open(f, 'rt'):
            o = json.loads(l); m[o['key']] = o['record']
    return m
B, T = load(base), load(tip)
def walk(a, b, p, acc):
    if isinstance(a, dict) and isinstance(b, dict):
        for k in set(a) | set(b):
            walk(a.get(k, '<absent>'), b.get(k, '<absent>'), f'{p}.{k}' if p else k, acc)
    elif isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b): acc.add((f'{p}#len', 'non-string'))
        for i in range(min(len(a), len(b))): walk(a[i], b[i], f'{p}[]', acc)
    elif a != b:
        acc.add((p, 'string' if isinstance(a, str) or isinstance(b, str) else 'non-string'))
paths = collections.Counter(); kinds = {}; moved = 0; byTier = collections.Counter(); rowsOf = collections.defaultdict(list)
for k, t in T.items():
    acc = set(); walk(B[k], t, '', acc)
    if acc: moved += 1; byTier[t.get('tier')] += 1
    for p, kind in acc: paths[p] += 1; kinds[p] = kind; rowsOf[p].append(k)
fam = collections.Counter()
for p, n in paths.items():
    root = p.split('.')[0]; fam[root] += 0
fams = collections.defaultdict(lambda: [0, set()])
for k, t in T.items():
    acc = set(); walk(B[k], t, '', acc)
    for root in {p.split('.')[0].split('#')[0] for p, _ in acc}: fams[root][0] += 1
res = {'rows': len(T), 'moved': moved, 'byTier': dict(byTier),
       'families': {r: v[0] for r, v in sorted(fams.items(), key=lambda x: -x[1][0])},
       'paths': {p: {'rows': n, 'kind': kinds[p]} for p, n in paths.most_common()}}
if old is not None:
    res['undeclared'] = sorted(p for p in paths if p not in old)
json.dump(res, open(out, 'w'), indent=1)
print(json.dumps({'rows': res['rows'], 'moved': moved, 'paths': len(paths), 'families': res['families'], 'undeclared': res.get('undeclared')}, indent=1))
