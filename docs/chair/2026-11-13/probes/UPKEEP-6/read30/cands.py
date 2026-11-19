import re,sys,os,json,collections
D=sys.argv[1]; READER=re.compile(r'^== (tab:\w+|tonight|pdf|foundry) ==$')
EASE=re.compile(r"\b(pa(y|ys|id|ying) (its|their|for its|for their) (own )?way|pays? well|well[- ]paid|kept paid|paid (hands|men|guards|soldiers|garrison|watch)|paid\b|afford|money enough|enough money|enough coin|well[- ]funded|fund(s|ed|ing)?\b|comfortabl[ey]|prosper\w*|wealth\w*|rich(es|er|est)?\b|flush|coffers?|treasury|surplus|untroubled|at ease|easy|easily|intact|plent\w+|thriv\w+|boom\w*|solvent|purse|wages?|salar\w+|well[- ]fed|abundan\w+|healthy|stable|secure[sd]?\b|strong|in hand|can pay|could pay|pays\b|spare)",re.I)
out=[]
for f in sorted(os.listdir(D+'/dumps')):
  seed=f[:-4]; sec=None
  for ln,line in enumerate(open(D+'/dumps/'+f),1):
    m=re.match(r'^== (.+) ==$',line.strip())
    if m: sec=m.group(1) if READER.match(line.strip()) else None; continue
    if not sec: continue
    for s in re.split(r'(?<=[.!?;])\s+',line.strip()):
      if EASE.search(s): out.append(dict(seed=seed,sec=sec,ln=ln,s=s[:500],hits=sorted({h[0].lower() for h in EASE.findall(s)})))
json.dump(out,open(D+'/cands.json','w'))
c=collections.Counter(); seeds=collections.defaultdict(set)
for o in out:
  t=re.sub(r'\d[\d,]*','#',o['s']); c[t]+=1; seeds[t].add(o['seed'])
print(len(out),len(c))
for t,n in c.most_common(): print(n,len(seeds[t]),t[:260])
