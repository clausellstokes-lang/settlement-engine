# -*- coding: utf-8 -*-
import json, os, re, unicodedata
RAW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/hobb-raw/'
ACD='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/hobb-acad/'
OUT='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/found-hobb-academic.json'

def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','--').replace('–','-').replace('‐','-').replace(' ',' ')
    s=re.sub(r'\s+',' ',s)
    return s.lower()

CACHE={}
def text(f):
    if f not in CACHE:
        p=ACD+f if os.path.exists(ACD+f) else RAW+f
        CACHE[f]=norm(open(p,encoding='utf-8',errors='replace').read())
    return CACHE[f]

def check(claims):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get('quote','')
        f=c.pop('_file',None)
        if not q: continue
        if f is None: bad.append((i,'NO FILE',q)); continue
        if norm(q) not in text(f): bad.append((i,f,q))
        n=len(q.split())
        if n>12: bad.append((i,'TOO LONG %d'%n,q))
    return bad
