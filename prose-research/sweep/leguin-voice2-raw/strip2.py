import sys, re, html
p=sys.argv[1]
b=open(p,'rb').read()
for enc in ('utf-8','cp1252','latin-1'):
    try:
        s=b.decode(enc); break
    except UnicodeDecodeError:
        continue
s=re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|h[1-6]|li|tr|blockquote)>','\n\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
sys.stdout.write(s)
