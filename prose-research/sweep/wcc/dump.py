import re,html,sys,glob
def body(p):
    s=open(p,encoding='utf-8',errors='replace').read()
    t=re.search(r'<TITLE>(.*?)</TITLE>',s,re.S|re.I)
    a=re.search(r'<B>(.*?)</B>',s,re.S)
    d=re.search(r'<I>(.*?)</I>',s,re.S)
    pre=re.search(r'<PRE>(.*?)</PRE>',s,re.S|re.I)
    return (html.unescape(re.sub(r'\s+',' ',t.group(1))).strip() if t else '',
            html.unescape(a.group(1)).strip() if a else '',
            html.unescape(d.group(1)).strip() if d else '',
            html.unescape(re.sub(r'<[^>]+>','',pre.group(1))) if pre else '')
for p in sorted(sys.argv[1:]):
    t,a,d,b=body(p)
    print('='*100); print('FILE',p); print('SUBJ',t); print('FROM',a,'|',d); print(b)
