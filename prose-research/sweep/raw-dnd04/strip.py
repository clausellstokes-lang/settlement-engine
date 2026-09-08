import re,html,sys,glob
for f in sorted(glob.glob("p*.html")):
    s=open(f,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','--').replace('\xa0',' ')
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(f.replace('.html','.txt'),'w',encoding='utf-8').write(s)
    print(f, len(s))
