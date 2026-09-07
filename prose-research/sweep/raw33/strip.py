import re,sys,html
for n in ['p1','p2','p3','p4']:
    s=open(n+'.html',encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/blockquote|/tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(n+'.txt','w',encoding='utf-8').write(s)
    print(n,len(s))
