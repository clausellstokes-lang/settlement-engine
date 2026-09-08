import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|h1|h2|h3|li|blockquote)>','\n\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('—','--').replace('–','-').replace('\xa0',' ')
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n{3,}','\n\n',s)
open(p.replace('.html','.txt'),'w',encoding='utf-8').write(s)
print(p, len(s))
