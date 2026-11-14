# usage (in the out dir): python3 -I table.py > table.md : each line's prints at tip (base), surfaces, smallest/largest town, crisis towns, scripted verdicts
import json,collections,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__))); import lines
fa={json.loads(l)['seed']:json.loads(l) for l in open('facts.tip.ndjson')}
T=collections.defaultdict(set); secs=collections.defaultdict(set)
for l in open('scan.tip.ndjson'):
    r=json.loads(l)
    if 'id' in r: T[r['id']].add(r['seed']); secs[r['id']].add(r['sec'].split(':')[0].split('-')[0])
B=collections.defaultdict(set)
for l in open('scan.base.ndjson'):
    r=json.loads(l)
    if 'id' in r: B[r['id']].add(r['seed'])
ck=collections.defaultdict(collections.Counter)
for l in open('checks.tip.ndjson'):
    r=json.loads(l); ck[r['id']][r['v']]+=1
order={'thorp':0,'hamlet':1,'village':2,'town':3,'city':4,'metropolis':5}
print('| id | line | towns at tip (base) | surfaces | smallest .. largest town | siege/famine/occupation towns | scripted checks at tip |')
print('|---|---|---|---|---|---|---|')
for i,d,_ in lines.C:
    ss=sorted(T[i], key=lambda s:(order.get(fa[s]['tier'],9),s))
    sizes=f"{ss[0]} .. {ss[-1]}" if ss else '-'
    cr=[s for s in ss if set(fa[s]['stress'])&{'under_siege','famine','occupied'}]
    cks='; '.join(f'{k}: {dict(v)}' for k,v in sorted(ck.items()) if k==i or k.startswith(i+'-'))
    print(f"| {i} | {d} | {len(T[i])} ({len(B[i])}) | {','.join(sorted(secs[i]))} | {sizes} | {len(cr)}{' e.g. '+cr[0] if cr else ''} | {cks} |")
