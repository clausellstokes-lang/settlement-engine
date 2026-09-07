import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|svg|head)\b.*?</\1>',' ',s)
s=re.sub(r'(?is)<!--.*?-->',' ',s)
s=re.sub(r'(?is)<(p|div|br|li|h[1-6]|tr|td|section)\b[^>]*>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=s.replace(' ',' ').replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','—')
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
open(sys.argv[2],'w',encoding='utf-8').write(s)
print(p,len(s))
