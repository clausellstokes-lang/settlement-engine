import re,sys
t=open(sys.argv[1]).read().split('\n')
def cells(l):
    s=l.strip()
    s=re.sub(r'`[^`]*`', lambda m: m.group(0).replace('|','¦'), s)
    s=s.replace('\\|','¦')
    return len(s.strip('|').split('|'))
tables=0; bad=[]; cur=None
for i,l in enumerate(t,1):
    if l.startswith('|'):
        n=cells(l)
        if cur is None: cur=n; tables+=1; start=i
        elif n!=cur: bad.append((i,n,cur,start))
    else: cur=None
print('tables',tables,'mismatches',len(bad))
for b in bad[:20]: print(b)
