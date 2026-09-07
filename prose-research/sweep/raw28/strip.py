import html, re, sys
for name in ["sloan","clarke1","clarke2","chiang","tnps"]:
    s = open(name+".html", encoding="utf-8", errors="replace").read()
    s = re.sub(r'(?is)<script.*?</script>', ' ', s)
    s = re.sub(r'(?is)<style.*?</style>', ' ', s)
    s = re.sub(r'(?is)<!--.*?-->', ' ', s)
    s = re.sub(r'(?is)<(p|div|br|li|h[1-6]|tr|blockquote)[^>]*>', '\n', s)
    s = re.sub(r'(?is)<[^>]+>', ' ', s)
    s = html.unescape(s)
    s = re.sub(r'[ \t\xa0]+', ' ', s)
    s = re.sub(r'\n\s*\n+', '\n\n', s)
    open(name+".txt","w",encoding="utf-8").write(s)
    print(name, len(s))
