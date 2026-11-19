# read30 ease scan: reader surfaces only (20 tabs, tonight, pdf, foundry). One row per (seed, surface, sentence).
import re,sys,os,json,collections
D=sys.argv[1]; READER=re.compile(r'^== (tab:\w+|tonight|pdf|foundry) ==$')
CLS=[
 ('money-in-hand', r"money in hand|pays? (its|their) (own )?way|without going begging|closes every year ahead|little in hand|money enough|can pay for (its|a) |can fund a |accounts? (are|is) (healthy|sound)|solvent|in funds"),
 ('kept-paid', r"kept paid|well[- ]funded|well paid|puts paid soldiers|pays wages for its defen|doing the job they were paid for|purse allows|Paid hands keep|pays? (for )?(its|the) (garrison|watch|soldiers|defenders)"),
 ('intact', r"arrangements intact|not turned into a collapse|kept supplied|supply book[^.]*balances|would not run short|keeps more in reserve|rent warehouse|market without asking|Goods wait in|until the price is right|busy and well stocked|in good order|change coin, borrow|ordinary rather than anxious|works as it always|as usual|goes on as"),
 ('prospering', r"looks prosperous|prosperous in a way|doing well out of|getting rich|warehouses are full|coin is moving|Plenty passes through|thriving|Rich farmland|yield well|prosper(s|ing|ous)\b(?! before)|wealthy (town|city|place)|grow(s|ing)? rich"),
 ('comfortable', r"comfortabl[ey](?! before| while)|thinking about being attacked|present peace|untroubled|nothing presses|Things are fine|condition asks to be remarked|at ease|feeds itself|supports itself|nothing to worry|well[- ]fed|eats well|plenty\b"),
]
CR=[(k,re.compile(v,re.I)) for k,v in CLS]
rows=[]; anchors={}
for f in sorted(os.listdir(D+'/dumps')):
  seed=f[:-4]; sec=None; anc=[]
  for ln,line in enumerate(open(D+'/dumps/'+f),1):
    t=line.strip(); m=re.match(r'^== (.+) ==$',t)
    if m: sec=m.group(1) if READER.match(t) else None; continue
    if not sec: continue
    if sec in('tab:overview','tab:defense') and re.search(r"while (it lasts|they last)|famine lasts|siege|Governed by|No one can earn|may not come through|rations|surrounded",t) and len(anc)<8: anc.append(f"[{sec}] {t[:220]}")
    for s in re.split(r'(?<=[.!?;])\s+',t):
      ks=[k for k,r in CR if r.search(s)]
      if ks: rows.append(dict(seed=seed,sec=sec,ln=ln,cls=ks,s=s[:400]))
  anchors[seed]=anc
json.dump(dict(rows=rows,anchors=anchors),open(D+'/ease.json','w'),ensure_ascii=False)
c=collections.defaultdict(set); n=collections.Counter()
for r in rows:
  t=re.sub(r"\b[A-Z][\w'ðÞþßäöüéíáóúÆæ-]+(?:'s)?\b","X",r['s']) ; t=re.sub(r'\d[\d,]*','#',t).lstrip('-* ')
  key=(r['cls'][0],t); c[key].add(r['seed']); n[key]+=1
for (k,t),ss in sorted(c.items(),key=lambda x:(x[0][0],-len(x[1]))): print(f"{k}\t{len(ss)}\t{n[(k,t)]}\t{t[:230]}")
