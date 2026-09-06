import re,sys,html
s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<script.*?</script>',' ',s)
s=re.sub(r'(?is)<style.*?</style>',' ',s)
s=re.sub(r'(?s)<[^>]+>','\n',s)
s=html.unescape(s)
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
open(sys.argv[2],'w',encoding='utf-8').write(s.strip())
