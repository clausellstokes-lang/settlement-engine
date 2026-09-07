# -*- coding: utf-8 -*-
import json, os, re, sys, unicodedata
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(D), 'found-kay-close.json')
def norm(s):
    s = unicodedata.normalize('NFKC', s)
    for a,b in [('’',"'"),('‘',"'"),('“','"'),('”','"'),('—','--'),('–','-'),('…','...')]:
        s = s.replace(a,b)
    return re.sub(r'\s+',' ',s).lower().strip()
CACHE={}
def text(f):
    if f not in CACHE:
        CACHE[f]=norm(open(os.path.join(D,f+'.txt'),encoding='utf-8',errors='replace').read())
    return CACHE[f]
ns={}
exec(open(os.path.join(D,'data-kay-close.py'),encoding='utf-8').read(), ns)
SOURCES, CLAIMS = ns['SOURCES'], ns['CLAIMS']
bad=[]
for c in CLAIMS:
    f=c.pop('_file',None); q=c.get('quote','')
    if not q: continue
    if len(q.split())>12: bad.append(('TOO LONG',q)); c['quote']=''
    elif f and norm(q) not in text(f): bad.append(('NOT FOUND in '+f,q)); c['quote']=''
json.dump({"complete":ns['COMPLETE'],"coverage":ns['COVERAGE'],"sourcesRead":SOURCES,"claims":CLAIMS},
          open(OUT,'w',encoding='utf-8'), ensure_ascii=False, indent=1)
print("claims:",len(CLAIMS),"sources:",len(SOURCES),"blanked:",len(bad))
for b in bad: print("  ",b[0],"::",b[1])
