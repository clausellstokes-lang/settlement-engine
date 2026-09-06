import json,re,os,unicodedata
RAW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/rescue-raw'
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','--')
    return re.sub(r'\s+',' ',s).strip()
CACHE={}
def txt(f):
    if f not in CACHE:
        CACHE[f]=norm(open(os.path.join(RAW,f+'.txt'),encoding='utf-8',errors='replace').read())
    return CACHE[f]

sources=[]
claims=[]
def S(**kw): sources.append(kw)
def C(file=None,**kw):
    q=kw.get('quote','')
    if q:
        if norm(q) not in txt(file):
            print('!! QUOTE MISS in',file,'::',q)
            kw['quote']=''
        elif len(q.split())>12:
            print('!! TOO LONG', q)
    claims.append(kw)

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'rescue-claims.py')).read())

out={"complete":COMPLETE,"coverage":COVERAGE,"sourcesRead":sources,"claims":claims}
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'found-kay-rescue-unread.json')
json.dump(out,open(p,'w',encoding='utf-8'),indent=1,ensure_ascii=False)
print('wrote',p,'sources',len(sources),'claims',len(claims))
