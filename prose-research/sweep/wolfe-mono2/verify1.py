# -*- coding: utf-8 -*-
import json,re,unicodedata,os
d=json.load(open('claims2.json'))
U,LOC,C=d['U'],d['LOC'],d['claims']
rev={v:k for k,v in U.items()}
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    for a,b in [('‘',"'"),('’',"'"),('“','"'),('”','"'),('–','-'),('—','-'),('…','...')]:
        s=s.replace(a,b)
    s=re.sub(r'\s+',' ',s)
    return s.lower()
cache={}
bad=[]
for i,cl in enumerate(C):
    k=rev[cl['url']]; p=LOC[k]
    if p not in cache: cache[p]=norm(open(p,encoding='utf-8',errors='replace').read())
    q=norm(cl['quote'])
    ok = q in cache[p]
    n=len(cl['quote'].split())
    if not ok or n>12:
        bad.append((i,k,n,ok,cl['quote']))
print('total',len(C),'bad',len(bad))
for b in bad: print(b)
