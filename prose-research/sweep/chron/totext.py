import re,html,sys
p=sys.argv[1]; s=open(p,encoding='utf-8',errors='ignore').read()
m=re.search(r'<article.*?</article>',s,re.S) or re.search(r'<main.*?</main>',s,re.S)
body=m.group(0) if m else s
body=re.sub(r'<(script|style|noscript|svg|header|footer|nav).*?</\1>','',body,flags=re.S)
t=re.sub(r'<[^>]+>','\n',body); t=html.unescape(t); t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
open(p.rsplit('.',1)[0]+'.txt','w').write(t); print(len(t))
