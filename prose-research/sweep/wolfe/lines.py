import sys,re
f=sys.argv[1]; cap=int(sys.argv[2]) if len(sys.argv)>2 else 12000
kw=re.compile(r'narrat|unreliab|memor|reader|prose|sentence|style|diction|\bwords?\b|clue|\blie[sd]?\b|liar|omi[st]|withh|detail|infer|translat|Proust|Borges|Nabokov|Chesterton|Kipling|Dickens|plain|archaic|Latin|puzzle|reread|re-read|first person|first-person|evidence|record|belie|ghost',re.I)
t=open(f,encoding='utf-8',errors='ignore').read()
t=re.sub(r'-\n(?=[a-z])','',t)
# build sentence-ish chunks: join lines, split at sentence ends
t=re.sub(r'\s*\n\s*',' ',t)
sents=re.split(r'(?<=[.?!”"])\s+(?=[A-Z“"(])',t)
out=[];n=0
for i,s in enumerate(sents):
    if kw.search(s) and 60<len(s)<900:
        ctx=' '.join(sents[max(0,i-1):i+2])
        if n+len(ctx)>cap: break
        out.append(ctx); n+=len(ctx)
print(f,'sents',len(sents),'kept',len(out)); print('\n\n'.join(out))
