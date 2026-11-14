import json,re,sys,collections
D=sys.argv[1]; J=json.load(open(D+'/ease.json'))
NOISE=re.compile(r"neither is comfortable|not comfortably|less comfortably|cannot grow richer|founded on rich farmland|getting richer and the labourers|merchant class prospers|yield well under|grow rich enough that|^\*?\-? ?\**(Comfortable|Prosperous|Moderate)\b|Prosperity:\*\* |feeds itself, with nothing spare|small margin",re.I)
by=collections.defaultdict(list)
for r in J['rows']:
  if NOISE.search(r['s']): continue
  by[r['seed']].append(r)
for seed in sorted(by):
  print('#####',seed)
  seen=set()
  for r in by[seed]:
    k=(r['sec'].split(':')[0] if r['sec'] in('pdf','foundry','tonight') else r['sec'], r['s'])
    srf=r['sec']; key=r['s']
    if (srf,key) in seen: continue
    seen.add((srf,key)); print(f"  {srf}:{r['ln']}\t{r['s'][:210]}")
