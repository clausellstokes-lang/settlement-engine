import re,sys,html,glob,os
for f in sorted(glob.glob("*.html")):
    s=open(f,encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?is)<!--.*?-->',' ',s)
    s=re.sub(r'(?is)</(p|div|br|li|h[1-6]|tr|blockquote)>','\n',s)
    s=re.sub(r'(?is)<br[^>]*>','\n',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=re.sub(r'[ \t\xa0]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n\n',s)
    out=os.path.splitext(f)[0]+".txt"
    open(out,"w",encoding="utf-8").write(s.strip())
    print(f, len(s))
