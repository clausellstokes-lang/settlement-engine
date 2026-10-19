import re,sys
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
def cells(l):
    s=re.sub(r'\\\|','',l)            # escaped pipes
    s=re.sub(r'`[^`]*`',lambda m:m.group(0).replace('|',''),s)  # pipes inside code spans
    return s.count('|')
bad=[];tables=0;i=0
while i<len(lines)-1:
    if lines[i].startswith('|') and re.match(r'^\|(\s*:?-+:?\s*\|)+\s*$',lines[i+1]):
        tables+=1;n=cells(lines[i]);j=i+2
        while j<len(lines) and lines[j].startswith('|'):
            if cells(lines[j])!=n: bad.append((j+1,n,cells(lines[j])))
            j+=1
        i=j
    else: i+=1
print('tables',tables,'mismatches',len(bad)); [print(b) for b in bad[:20]]
