import re,sys
# GFM-strict: a pipe inside a code span still splits a table cell unless escaped (\|).
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
def cells(l): return len(re.findall(r'(?<!\\)\|', l))
bad=[];tables=0;i=0
while i<len(lines)-1:
    if lines[i].startswith('|') and re.match(r'^\|(\s*:?-+:?\s*\|)+\s*$',lines[i+1]):
        tables+=1;n=cells(lines[i]);j=i+2
        while j<len(lines) and lines[j].startswith('|'):
            c=cells(lines[j])
            if c!=n: bad.append((j+1,n,c))
            j+=1
        i=j
    else: i+=1
print('tables',tables,'strict mismatches',len(bad)); [print(b) for b in bad[:40]]
