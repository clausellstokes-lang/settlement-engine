import sys,re
f=sys.argv[1]; cap=int(sys.argv[2]) if len(sys.argv)>2 else 14000
kw=re.compile(r'narrat|unreliab|memor|reader|prose|sentence|style|diction|word|clue|\blie|liar|omi[st]|withh|detail|infer|translat|Proust|Borges|Nabokov|Chesterton|Kipling|Dickens|plain|archaic|Latin|puzzle|reread|re-read|first person|first-person|evidence|record|belie|tell|show',re.I)
t=open(f,encoding='utf-8',errors='ignore').read()
paras=[p.strip() for p in re.split(r'\n\s*\n',t) if p.strip()]
out=[];n=0
for p in paras:
    if kw.search(p) and len(p)>80:
        p=re.sub(r'\s+',' ',p)
        if n+len(p)>cap: break
        out.append(p); n+=len(p)
print(f, 'paras',len(paras),'kept',len(out)); print('\n\n'.join(out))
