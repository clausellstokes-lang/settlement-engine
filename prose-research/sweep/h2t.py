import sys, re, html
p=sys.argv[1]
s=open(p,'rb').read().decode('utf-8','replace')
s=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|section|article|blockquote)>','\n\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
print(s.strip())
