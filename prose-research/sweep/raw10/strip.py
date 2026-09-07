import re,sys,html
for f in ["tfp4","tfp1","sf_best","sf_read","sf_tell","emshort","ubi","gamedev"]:
    s=open(f+".html",encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|noscript|svg)\b.*?</\1>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?i)<br\s*/?>','\n',s)
    s=re.sub(r'(?i)</(p|div|li|h[1-6]|tr|blockquote|article)>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
    open(f+".txt","w",encoding="utf-8").write(s)
    print(f,len(s))
