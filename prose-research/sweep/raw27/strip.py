import re,sys,html
for f in ['ultan','horton','tree','lit']:
    s=open(f+'.html',encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<(p|div|br|li|h[1-6]|blockquote|tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    open(f+'.txt','w',encoding='utf-8').write(s)
    print(f, len(s))
