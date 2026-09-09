import re,sys,html
src,dst=sys.argv[1],sys.argv[2]
t=open(src,encoding='utf-8',errors='replace').read()
t=re.sub(r'(?is)<script.*?</script>',' ',t)
t=re.sub(r'(?is)<style.*?</style>',' ',t)
t=re.sub(r'(?is)<noscript.*?</noscript>',' ',t)
t=re.sub(r'(?is)<(p|div|br|h[1-6]|li|blockquote|figcaption)[^>]*>','\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n+','\n',t)
open(dst,'w',encoding='utf-8').write(t)
print(dst,len(t))
