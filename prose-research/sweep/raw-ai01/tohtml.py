import re,html,sys,os,glob,unicodedata
for f in sorted(glob.glob('raw-ai01/*.html')):
    s=open(f,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<noscript.*?</noscript>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr|/blockquote)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace(' ',' ')
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    out=f[:-5]+'.txt'
    open(out,'w',encoding='utf-8').write(s)
    print(os.path.basename(out), len(s))
