import json, os, re, sys
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
LGC=os.path.join(BASE,"lgc")
RAW=os.path.join(BASE,"raw")
def load(name):
    for d in (LGC,RAW):
        p=os.path.join(d,name+".txt")
        if os.path.exists(p): return open(p,encoding='utf-8',errors='replace').read()
    return None
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','--').replace('–','-').replace(' ',' ')
    return re.sub(r'\s+',' ',s).strip().lower()
def check(claims):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get('quote','')
        f=c.pop('_file',None)
        if not q: continue
        t=load(f)
        if t is None:
            bad.append((i,f,'NOFILE',q)); continue
        if norm(q) not in norm(t):
            bad.append((i,f,'NOMATCH',q))
    return bad
