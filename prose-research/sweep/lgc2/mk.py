import json,os,re,sys
D=os.path.dirname(os.path.abspath(__file__))
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close-2.json'
prev=json.load(open(os.path.join(D,'prev-found.json')))
sources=json.load(open(os.path.join(D,'sources.json')))
claims=json.load(open(os.path.join(D,'claims.json')))
files=json.load(open(os.path.join(D,'filemap.json')))
flag=json.load(open(os.path.join(D,'flag.json')))
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','-').replace('–','-').replace('\xa0',' ')
    return re.sub(r'\s+',' ',s)
cache={}; bad=0
for c in claims:
    q=c.get('quote','')
    if not q: continue
    f=files.get(c['url'])
    if not f: print('NOFILE',c['url']); c['quote']=''; bad+=1; continue
    if f not in cache: cache[f]=norm(open(os.path.join(D,f),errors='ignore').read())
    if norm(q) not in cache[f]:
        print('BLANKED (no exact match):',repr(q),'in',f); c['quote']=''; bad+=1
obj={'complete':flag['complete'],'coverage':flag['coverage'],
     'sourcesRead':prev['sourcesRead']+sources,
     'claims':prev['claims']+claims}
json.dump(obj,open(OUT,'w'),indent=1,ensure_ascii=False)
print('WROTE',OUT,len(obj['sourcesRead']),'sources',len(obj['claims']),'claims; blanked',bad)
