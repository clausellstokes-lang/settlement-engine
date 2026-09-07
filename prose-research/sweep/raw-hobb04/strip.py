import re,sys,html,glob,os
for f in glob.glob("*.html"):
    s=open(f,encoding="utf-8",errors="replace").read()
    s=re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>',' ',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—',' -- ').replace('–','-').replace('\xa0',' ')
    s=re.sub(r'\s+',' ',s)
    open(f.replace('.html','.txt'),'w',encoding='utf-8').write(s)
    print(f, len(s))
