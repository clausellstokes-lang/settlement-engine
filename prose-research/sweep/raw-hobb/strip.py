import re,sys,html,glob,os
for f in sorted(glob.glob("*.html")):
    s=open(f,encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s)
    s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)<br\s*/?>','\n',s)
    s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','--').replace('–','-').replace('\xa0',' ')
    s=re.sub(r'[ \t]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    out=os.path.splitext(f)[0]+".txt"
    open(out,"w",encoding="utf-8").write(s)
    print(f,len(s),"->",out)
