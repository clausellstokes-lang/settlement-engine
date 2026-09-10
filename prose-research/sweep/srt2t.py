import sys,re
t=open(sys.argv[1],encoding='utf-8',errors='replace').read()
t=t.replace('\r','')
lines=[]
for b in t.split('\n\n'):
    ls=[l for l in b.split('\n') if l.strip()]
    ls=[l for l in ls if not re.match(r'^\d+$',l.strip()) and '-->' not in l]
    if ls: lines.append(' '.join(ls))
out=' '.join(lines)
out=re.sub(r'\s+',' ',out)
print(out)
