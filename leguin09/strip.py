import re,sys,html
f=sys.argv[1]
s=open(f,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<script.*?</script>',' ',s)
s=re.sub(r'(?is)<style.*?</style>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|h1|h2|h3|h4|li|blockquote|tr|td)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
sys.stdout.write(s.strip())
