import sys, re, html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br[^>]*>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h1|h2|h3|h4|h5|h6|tr|section|blockquote)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(sys.argv[2],'w',encoding='utf-8').write(s)
print(p, len(s))
