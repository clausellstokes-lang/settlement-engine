import re,html,json,sys,os
def body(f):
    t=open(f,encoding='utf-8',errors='replace').read()
    b=re.search(r'<PRE>(.*?)</PRE>',t,re.S)
    return html.unescape(re.sub(r'<.*?>','',b.group(1))) if b else html.unescape(re.sub(r'<.*?>','',t))
def check(pairs):
    for f,q in pairs:
        if not q: print('BLANK', f); continue
        t=body(f)
        print(('OK  ' if q in t else 'MISS'), f, '|', q, '|', len(q.split()),'w')
