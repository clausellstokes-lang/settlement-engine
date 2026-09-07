import re,sys,html
for f in ['seed','expo','strange','writer','ddb']:
    s=open(f+'.html',encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)<br[^>]*>','\n',s)
    s=re.sub(r'(?i)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
    s=re.sub(r'<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(f+'.txt','w',encoding='utf-8').write(s)
    print(f, len(s))
