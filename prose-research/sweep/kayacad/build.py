import json,re,html,os,sys
D=os.path.dirname(os.path.abspath(__file__))
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-kay-academic-routes.json'
def norm(p):
    s=open(os.path.join(D,p),encoding='utf-8',errors='replace').read()
    if p.endswith('.html'):
        s=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',s); s=re.sub(r'(?s)<[^>]+>',' ',s); s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
    return re.sub(r'\s+',' ',s)
CACHE={}
def has(p,q):
    if p not in CACHE: CACHE[p]=norm(p)
    qn=q.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
    return qn in CACHE[p]

sources=json.load(open(os.path.join(D,'sources.json')))
claims=json.load(open(os.path.join(D,'claims.json')))
bad=[]
for i,c in enumerate(claims):
    f=c.pop('_file',None)
    q=c.get('quote','')
    if q:
        if not f or not has(f,q):
            bad.append((i,c['feature'],q[:60])); c['quote']=''
    if len(q.split())>12: bad.append((i,'TOOLONG',q))
cov=open(os.path.join(D,'coverage.txt')).read().strip()
res={'complete':json.load(open(os.path.join(D,'complete.json'))),'coverage':cov,'sourcesRead':sources,'claims':claims}
json.dump(res,open(OUT,'w'),indent=1,ensure_ascii=False)
print('claims',len(claims),'sources',len(sources),'blanked/bad',bad)
print('wrote',OUT)
