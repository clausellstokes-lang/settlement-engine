# strict GFM check: a table row's raw (unescaped) pipe count must equal its header's — GFM ignores backticks when splitting cells
import re,sys
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
def n(line): return len(re.findall(r'(?<!\\)\|', line))
cur=None; bad=[]
for i,l in enumerate(lines,1):
    if l.startswith('|'):
        if cur is None: cur=n(l); h=i
        elif n(l)!=cur: bad.append((i,n(l),cur,h))
    else: cur=None
print('strict mismatches',len(bad)); [print(b) for b in bad[:30]]
