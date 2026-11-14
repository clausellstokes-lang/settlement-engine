import json,sys,glob,collections as C
rows=[json.loads(l) for f in glob.glob(f'{sys.argv[1]}/o-*.ndjson') for l in open(f)]
print('births',len(rows))
for arm in ('stat','drop'):
    c=C.Counter(); b=C.Counter(); tiers=C.defaultdict(C.Counter); ex={}
    for r in rows:
        seen=set()
        for e in r[arm]:
            k=(e[0], ' ; '.join(e[-1])); c[k]+=1; tiers[k][r['tier']]+=1; ex.setdefault(k,r['key'])
            if e[0] not in seen: b[e[0]]+=1; seen.add(e[0])
    print(f'== {arm}: births with any {sum(1 for r in rows if r[arm])}')
    for k,v in c.most_common(): print(f'  {v:5d} {k[0]} | {k[1]} | {dict(tiers[k])} e.g. {ex[k]}')
cc=C.Counter(e[0] for r in rows for e in r['cap'])
print('== cap side effects (classed apart):', sum(1 for r in rows if r['cap']), dict(cc.most_common(8)))
