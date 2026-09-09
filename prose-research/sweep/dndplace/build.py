import json,os,copy
D=os.path.dirname(os.path.abspath(__file__))
OUT=os.path.abspath(os.path.join(D,'..','found-dnd-place-register.json'))
sources=json.load(open(os.path.join(D,'sources.json')))
claims=json.load(open(os.path.join(D,'claims.json')))
meta=json.load(open(os.path.join(D,'meta.json')))
missing=[]
for i,c in enumerate(claims):
    q=c.get('quote','')
    f=c.get('_file')
    if not q: continue
    if not f: missing.append((i,'NOFILE',q)); continue
    p=os.path.join(D,f+'.txt')
    if not os.path.exists(p): missing.append((i,'NOTXT',f)); continue
    t=open(p,encoding='utf-8').read()
    if q not in t: missing.append((i,f,q))
clean=[{k:v for k,v in c.items() if not k.startswith('_')} for c in claims]
obj={"complete":meta["complete"],"coverage":meta["coverage"],"sourcesRead":sources,"claims":clean}
json.dump(obj,open(OUT,'w'),indent=1,ensure_ascii=False)
print("claims",len(clean),"sources",len(sources),"quotefail",missing)
print("wrote",OUT)
