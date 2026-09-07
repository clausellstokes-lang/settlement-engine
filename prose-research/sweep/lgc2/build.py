import json,os,re,sys
D=os.path.dirname(os.path.abspath(__file__))
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-leguin-close-2.json'
def norm(t):
    t=t.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    t=t.replace('—','-').replace('–','-').replace('‑','-').replace('\xa0',' ')
    return re.sub(r'\s+',' ',t).strip()
CACHE={}
def text(f):
    if f not in CACHE:
        CACHE[f]=norm(open(os.path.join(D,f),encoding='utf-8',errors='replace').read())
    return CACHE[f]
def build(claims, sources, coverage, complete):
    bad=[]
    for c in claims:
        q=c.get('quote','')
        f=c.pop('_file',None)
        if q:
            if f is None or norm(q) not in text(f):
                bad.append((c['feature'],q,f)); c['quote']=''
        if len(q.split())>12: bad.append(('TOOLONG',q,f)); c['quote']=''
    json.dump({'complete':complete,'coverage':coverage,'sourcesRead':sources,'claims':claims},open(OUT,'w'),indent=1)
    print('claims',len(claims),'sources',len(sources),'blanked',len(bad))
    for b in bad: print('  BLANKED:',b)
