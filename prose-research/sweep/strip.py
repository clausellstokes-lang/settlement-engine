import re,sys,html,os
for f in sorted(os.listdir('raw03')):
    if not f.endswith('.html'): continue
    s=open('raw03/'+f,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<(script|style|noscript)\b.*?</\1>',' ',s)
    s=re.sub(r'(?s)<!--.*?-->',' ',s)
    s=re.sub(r'(?s)<[^>]+>',' ',s)
    s=html.unescape(s)
    s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','--').replace(' ',' ')
    s=re.sub(r'[ \t\r\f\v]+',' ',s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open('raw03/'+f.replace('.html','.txt'),'w',encoding='utf-8').write(s)
    print(f, len(s))
