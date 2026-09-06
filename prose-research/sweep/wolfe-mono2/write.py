# -*- coding: utf-8 -*-
import json,sys,os
B=os.path.dirname(os.path.abspath(__file__))
prior=json.load(open(B+'/PRIOR-found.json'))
mine=json.load(open(B+'/claims2.json' if os.path.exists(B+'/claims2.json') else B+'/claims1.json'))
srcs=json.load(open(B+'/sources.json'))
complete = (sys.argv[1]=='true') if len(sys.argv)>1 else False
cov = open(B+'/coverage.txt').read().strip() if os.path.exists(B+'/coverage.txt') else 'CHECKPOINT (in progress).'
seen=set(); allc=[]
for c in prior.get('claims',[])+mine['claims']:
    k=(c.get('url'),c.get('quote'),c.get('claim'))
    if k in seen: continue
    seen.add(k); allc.append(c)
seenu=set(); alls=[]
for s in prior.get('sourcesRead',[])+srcs:
    if s['url'] in seenu: continue
    seenu.add(s['url']); alls.append(s)
out={'complete':complete,'coverage':cov,'sourcesRead':alls,'claims':allc}
json.dump(out,open(B+'/../found-wolfe-monographs.json','w'),ensure_ascii=False,indent=1)
print('sources',len(alls),'claims',len(allc),'complete',complete)
