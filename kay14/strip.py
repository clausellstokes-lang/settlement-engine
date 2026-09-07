import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?s)<!--.*?-->',' ',s)
s=re.sub(r'(?i)</(p|div|li|h[1-6]|br|tr|blockquote)>','\n',s)
s=re.sub(r'(?i)<br\s*/?>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
print(s.strip())
