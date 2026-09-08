import re,sys,html
t=open(sys.argv[1],encoding="utf-8",errors="ignore").read()
t=re.sub(r'(?is)<(script|style|noscript|svg|header|footer|nav)[^>]*>.*?</\1>','',t)
t=re.sub(r'(?i)<br\s*/?>','\n',t); t=re.sub(r'(?i)</(p|div|li|h[1-6]|blockquote|tr)>','\n',t)
t=re.sub(r'<[^>]+>','',t); t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t); t=re.sub(r'\n\s*\n+','\n\n',t)
open(sys.argv[2],'w').write(t.strip())
