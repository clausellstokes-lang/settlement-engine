# -*- coding: utf-8 -*-
"""split-chunks.py [names...] — (re)split every UNVERIFIED claim of each state-<name>.json into 15-claim chunk files
(sweep/chunks/<name>-NN.json) and write sweep/chunk-manifests.json; then `mk-args.py <name> --chunks` builds the launch args.
Run it after `node ../sweep-state.mjs summary` (which merges every verdict file into the states) — never before."""
import json,glob,os,sys
SC=os.path.dirname(os.path.abspath(__file__)); CH=15
names=sys.argv[1:] or [os.path.basename(f)[6:-5] for f in sorted(glob.glob(os.path.join(SC,'state-*.json'))) if 'misaligned' not in f]
os.makedirs(os.path.join(SC,'chunks'),exist_ok=True)
man=json.load(open(os.path.join(SC,'chunk-manifests.json'))) if os.path.exists(os.path.join(SC,'chunk-manifests.json')) else {}
for name in names:
    d=json.load(open(os.path.join(SC,'state-%s.json'%name))); claims=d['claims']; verd=d.get('verdicts') or {}
    todo=[i for i in range(len(claims)) if claims[i] and str(i) not in verd]
    for f in glob.glob(os.path.join(SC,'chunks','%s-[0-9][0-9].json'%name)): os.remove(f)
    chunks=[todo[i:i+CH] for i in range(0,len(todo),CH)]; rows=[]
    for k,idx in enumerate(chunks):
        f=os.path.join(SC,'chunks','%s-%02d.json'%(name,k))
        json.dump({'name':name,'chunk':k,'indices':idx,'claims':[{'index':i,**{fld:claims[i].get(fld,'') for fld in ('feature','claim','source','url','quote','page')}} for i in idx]},open(f,'w'),ensure_ascii=False,indent=1)
        rows.append({'file':f,'indices':idx})
    man[name]={'verifiedCount':len(verd),'chunks':rows}
    print('%s: claims=%d verified=%d todo=%d chunks=%d'%(name,len(claims),len(verd),len(todo),len(chunks)))
json.dump(man,open(os.path.join(SC,'chunk-manifests.json'),'w'),indent=0); print('chunk-manifests.json written')
