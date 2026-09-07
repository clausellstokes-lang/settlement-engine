import re,sys,html,unicodedata
for name in sys.argv[1:]:
    p=f"raw/{name}.html"
    s=open(p,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<noscript.*?</noscript>',' ',s)
    s=re.sub(r'(?s)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=unicodedata.normalize('NFKC',s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','--').replace('–','-').replace('\xa0',' ')
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(f"raw/{name}.txt2",'w',encoding='utf-8').write(s)
    print(name, len(s))
