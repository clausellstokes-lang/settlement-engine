import re,sys,html
for n in range(1,6):
    s=open(f'u{n}.html',encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<(p|br|div|li|h[1-6]|tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(f'u{n}.txt','w',encoding='utf-8').write(s)
    print(n,len(s))
