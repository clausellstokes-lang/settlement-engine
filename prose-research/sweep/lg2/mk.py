import json, re, os, sys

SW = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
HERE = os.path.dirname(os.path.abspath(__file__))

def norm(s):
    s = s.replace('—','—').replace('–','–')
    s = re.sub(r'\s+',' ', s)
    return s.strip()

def check(claims):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get('quote','')
        f=c.get('_file')
        if not q: continue
        if not f or not os.path.exists(os.path.join(HERE,f)):
            bad.append((i,'NOFILE',q)); continue
        t=norm(open(os.path.join(HERE,f),encoding='utf-8',errors='replace').read())
        if norm(q) not in t:
            bad.append((i,'NOMATCH',q))
    return bad

def write(claims, sources, coverage, complete):
    out={'complete':complete,'coverage':coverage,
         'sourcesRead':sources,
         'claims':[{k:v for k,v in c.items() if not k.startswith('_')} for c in claims]}
    p=os.path.join(SW,'found-leguin-academic-2.json')
    json.dump(out, open(p,'w'), indent=1, ensure_ascii=False)
    print('wrote',p,'claims',len(claims),'sources',len(sources))
