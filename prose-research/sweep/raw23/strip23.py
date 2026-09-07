import re,sys,html
for f in ["pon.html","dos.html","idle.html","sly.html","merric.html"]:
    s=open(f,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<(p|br|div|li|h[1-6]|tr|blockquote)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    open(f.replace('.html','.txt'),'w',encoding='utf-8').write(s)
    print(f, len(s))
