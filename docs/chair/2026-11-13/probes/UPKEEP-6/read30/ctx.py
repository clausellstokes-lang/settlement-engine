import re,os,sys,json,collections
D=sys.argv[1]; READER=re.compile(r'^== (tab:\w+|tonight|pdf|foundry) ==$')
PAT={'aline':r"before the [a-z ]+; \w+ while (it lasts|they last)",'maynot':r"may not come through|whether there will be a place left|cannot hold out|will not survive",
'coin':r"every coin goes on food|No one can earn a normal living",'notviable':r"Not viable",'cut':r"[Ss]upply lines are cut|surrounded|trade have stopped|no dependable trade route|Trade has stopped|cut off from|nothing comes in",
'earnsless':r"earns less than it spends|short of money|cannot pay"}
out={}
for f in sorted(os.listdir(D+'/dumps')):
  seed=f[:-4]; sec=None; got=collections.defaultdict(dict)
  for ln,line in enumerate(open(D+'/dumps/'+f),1):
    t=line.strip(); m=re.match(r'^== (.+) ==$',t)
    if m: sec=m.group(1) if READER.match(t) else None; continue
    if not sec: continue
    srf='screen' if sec.startswith('tab:') else sec
    for k,p in PAT.items():
      mm=re.search(p,t)
      if mm and k not in got[srf]: got[srf][k]=(sec,ln,t[:200])
  out[seed]=got
json.dump(out,open(D+'/ctx.json','w'),ensure_ascii=False)
for s,g in out.items():
  print(s, {srf:sorted(v) for srf,v in g.items()})
