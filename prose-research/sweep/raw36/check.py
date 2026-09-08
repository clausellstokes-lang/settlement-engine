import json,re,unicodedata
chunk=json.load(open('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/chunks/dnd-36.json'))
urlmap={'beyondfomalhaut.blogspot.com/2017':'u1','beyondfomalhaut.blogspot.com/2018':'u2','arsphantasia':'u3','theladyandtiger':'u4','thealexandrian':'u5'}
texts={}
for k in ['u1','u2','u3','u4','u5']:
    texts[k]=open(k+'.txt',encoding='utf-8').read()
def norm(s):
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
    s=re.sub(r'\s+',' ',s)
    return s.lower()
for c in chunk['claims']:
    f=None
    for k,v in urlmap.items():
        if k in c['url']: f=v
    t=norm(texts[f])
    q=norm(c['quote'])
    print(c['index'], f, 'EXACT' if q in t else 'MISS', '|', c['quote'][:60])
