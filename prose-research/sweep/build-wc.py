# -*- coding: utf-8 -*-
import json,os,re,unicodedata

RAW='wc-raw'
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','--').replace('–','-').replace('…','...')
    s=re.sub(r'\s+',' ',s)
    return s.lower()

FILES={}
for f in os.listdir(RAW):
    if f.endswith('.txt'):
        FILES[f[:-4]]=norm(open(os.path.join(RAW,f),encoding='utf-8',errors='replace').read())

def check(local,quote):
    if not quote: return True,'empty'
    if local not in FILES: return False,'NOFILE:'+local
    return (norm(quote) in FILES[local]), 'ok' if norm(quote) in FILES[local] else 'MISS'

sources=[]
claims=[]
def S(**kw): sources.append(kw)
def C(local=None,**kw):
    kw.setdefault('quote','')
    ok,why=check(local,kw['quote'])
    if not ok:
        print('QUOTE FAIL:',kw['feature'],'|',repr(kw['quote']),why)
        kw['quote']=''
    claims.append(kw)

exec(open('claims-wc.py',encoding='utf-8').read())

out={'complete':COMPLETE,'coverage':COVERAGE,'sourcesRead':sources,'claims':claims}
json.dump(out,open('found-wolfe-counter.json','w',encoding='utf-8'),ensure_ascii=False,indent=1)
print('sources',len(sources),'claims',len(claims))
