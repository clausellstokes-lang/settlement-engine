import sys,re
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
s=s.replace('’',"'").replace('‘',"'").replace('“','"').replace('”','"').replace('–','-').replace('—','-')
s=re.sub(r'\s+',' ',s)
open(p.replace('.txt','.norm'),'w').write(s)
