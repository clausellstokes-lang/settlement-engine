import sys
p=sys.argv[1]
L=open(p,encoding='utf-8').read().split('\n')
def cols(line):
    n=0;inb=False;i=0
    while i<len(line):
        c=line[i]
        if c=='`': inb=not inb
        elif c=='\\' and i+1<len(line) and line[i+1]=='|': i+=2; continue
        elif c=='|' and not inb: n+=1
        i+=1
    return n
bad=0;tables=0;i=0
while i<len(L):
    if L[i].startswith('|'):
        tables+=1;h=cols(L[i]);j=i
        while j<len(L) and L[j].startswith('|'):
            if cols(L[j])!=h:
                bad+=1;print(f'line {j+1}: {cols(L[j])} vs header {h}: {L[j][:120]}')
            j+=1
        i=j
    else: i+=1
print(f'tables {tables}, mismatched rows {bad}')
