import re,sys,html
for n in ["arxiv2305","pmc272","crow","arxiv2402","wpguide","ioc","historica","arxiv2410"]:
    s=open("raw/%s.html"%n,encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|noscript|svg)\b.*?</\1>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<(p|div|br|li|h[1-6]|tr|section|blockquote)\b[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace(' ',' ').replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"')
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open("raw/%s.txt"%n,"w",encoding="utf-8").write(s)
    print(n, len(s))
