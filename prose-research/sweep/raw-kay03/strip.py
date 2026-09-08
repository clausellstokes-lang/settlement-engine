import re,sys,html
for f in ["clarkesworld","bw_patrick","rowanwood","larb","bw_tigana","reactor","steelypips","speculiction"]:
    s=open(f+".html",encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?s)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)</(p|div|h[1-6]|li|br|tr|blockquote)>','\n',s)
    s=re.sub(r'(?i)<br\s*/?>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    open(f+".txt","w",encoding="utf-8").write(s)
    print(f,len(s))
