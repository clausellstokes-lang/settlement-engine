# verify.py <before.json> <facts.json> <worklist.json> <ids comma> <python-expr predicate of F (facts dict) that says FALSE> [fields]
import json,sys,collections
B=json.load(open(sys.argv[1])); F=json.load(open(sys.argv[2])); W={r['id']:r for r in json.load(open(sys.argv[3]))}
ids=sys.argv[4].split(','); pred=sys.argv[5]; fields=(sys.argv[6].split(',') if len(sys.argv)>6 else [])
for i in ids:
    r=W[i]; e=B.get(r['fold'])
    if not e: print(f"{i}: GONE AT BASE (fold not in before) | {r['fold'][:90]}"); continue
    ts=e['towns']; bad=[t for t in ts if eval(pred,{},{'F':F[t],'t':t})]
    print(f"{i}: prints {len(ts)} (read in {r['town']}: {'yes' if r['town'] in ts else 'NO'}) · FALSE {len(bad)} | {r['fold'][:80]}")
    for t in bad[:6]: print('   ',t, {k:F[t].get(k) for k in fields})
    if fields:
        c=collections.Counter(tuple(str(F[t].get(k)) for k in fields) for t in ts); print('    dist', c.most_common(8))
