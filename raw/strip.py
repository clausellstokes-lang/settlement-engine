import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<script.*?</script>',' ',s)
s=re.sub(r'(?is)<style.*?</style>',' ',s)
s=re.sub(r'(?is)<!--.*?-->',' ',s)
s=re.sub(r'(?i)<br\s*/?>','\n',s)
s=re.sub(r'(?i)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
s=re.sub(r'<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
print(s.strip())
