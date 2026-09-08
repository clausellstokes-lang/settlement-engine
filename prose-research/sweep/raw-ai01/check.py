import json,re,os,unicodedata
d=json.load(open('chunks/ai-01.json'))
def norm(s):
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=s.replace('—','-').replace('–','-').replace('−','-')
    s=re.sub(r'\s+',' ',s)
    return s.lower()
for c in d['claims']:
    i=c['index']; q=c['quote']
    p='raw-ai01/%d.txt'%i
    t=norm(open(p,encoding='utf-8').read())
    if not q:
        print(i,'NO-QUOTE-GIVEN'); continue
    nq=norm(q)
    pos=t.find(nq)
    print(i, 'VERBATIM-HIT' if pos>=0 else 'MISS', repr(q))
    if pos>=0:
        print('    ...'+t[max(0,pos-220):pos+len(nq)+220].replace('\n',' ')+'...')
