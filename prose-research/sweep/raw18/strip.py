import re,sys,html
for n in ["gladstone","holland","alex","sini"]:
    s=open(n+".html",encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<script.*?</script>','',s)
    s=re.sub(r'(?is)<style.*?</style>','',s)
    s=re.sub(r'(?is)<(p|div|br|h[1-6]|li|blockquote)[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    open(n+".txt","w",encoding="utf-8").write(s)
    print(n,len(s))
