#!/usr/bin/env python3
# READ-ALL, THE METER: the read's flagged sentences counted again at a later tip, by two inventories of the SAME seeds.
# usage: meter.py <before inventory.json> <after inventory.json> <flagged.sentences.json> [label]
import io, sys, json, collections
B = json.load(io.open(sys.argv[1], encoding='utf-8')); A = json.load(io.open(sys.argv[2], encoding='utf-8'))
R = json.load(io.open(sys.argv[3], encoding='utf-8')); label = sys.argv[4] if len(sys.argv) > 4 else ''
bt = {f: set(v['towns']) for f, v in B.items()}; at = {f: set(v['towns']) for f, v in A.items()}
print('THE METER %s · inventories: before %d, after %d sentences' % (label, len(bt), len(at)))
c = collections.Counter(); tb = collections.Counter(); ta = collections.Counter(); gone = []
for r in R:
    f = r.get('fold'); sev = r['sev']
    if f not in bt: c[(sev, 'not in the before inventory')] += 1; continue
    b = len(bt[f]); a = len(at.get(f, ())); here = r.get('town') in at.get(f, set())
    st = 'GONE' if a == 0 else ('fewer, not in the town read' if (a < b and not here) else 'fewer, still in the town read' if a < b else 'unchanged' if a == b else 'more')
    c[(sev, st)] += 1; tb[sev] += b; ta[sev] += a
    if a == 0: gone.append((b, sev, r['id'], f[:110]))
for sev in ('HIGH', 'MED', 'LOW'):
    tot = sum(v for (s, _), v in c.items() if s == sev)
    still = sum(v for (s, k), v in c.items() if s == sev and k not in ('GONE', 'not in the before inventory'))
    print('  %-4s rows %4d · still printing %4d · %s · towns printing (sum) %d -> %d' % (sev, tot, still, {k[1]: v for k, v in sorted(c.items()) if k[0] == sev}, tb[sev], ta[sev]))
print('  widest GONE rows:')
for b, sev, i, f in sorted(gone, reverse=True)[:12]: print('    %4d %s %s %s' % (b, sev, i, f))
