import sys,re
t=open(sys.argv[1],encoding='utf-8').read().split('\n')
def cells(l):
    # count unescaped pipes outside backticks
    s=re.sub(r'`[^`]*`','X',l); s=s.replace('\\|','')
    return s.count('|')
tables=0; bad=[]
i=0
while i<len(t):
    if t[i].startswith('|') and i+1<len(t) and re.match(r'^\|[-| :]+\|\s*$',t[i+1]):
        tables+=1; n=cells(t[i]); j=i+1
        while j<len(t) and t[j].startswith('|'):
            if cells(t[j])!=n: bad.append(j+1)
            j+=1
        i=j
    else: i+=1
print('tables',tables,'mismatched rows',len(bad),bad[:20])
