import re,sys,html
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<script.*?</script>',' ',s)
s=re.sub(r'(?is)<style.*?</style>',' ',s)
s=re.sub(r'(?is)<!--.*?-->',' ',s)
s=re.sub(r'(?i)<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>','\n',s)
s=re.sub(r'<[^>]+>',' ',s)
s=html.unescape(s)
s=s.replace(' ',' ').replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','--')
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(sys.argv[2],'w',encoding='utf-8').write(s)
print(p,'->',sys.argv[2],len(s))
