import re,sys
p=sys.argv[1]
lines=open(p,encoding='utf-8').read().split('\n')
def cells(l):
    # count pipes not escaped and not inside backticks
    n=0; intick=False; i=0
    while i<len(l):
        c=l[i]
        if c=='`': intick=not intick
        elif c=='\\' and i+1<len(l) and l[i+1]=='|': i+=2; continue
        elif c=='|' and not intick: n+=1
        i+=1
    return n
bad=0; i=0; tables=0
while i<len(lines):
    if lines[i].startswith('|') and i+1<len(lines) and re.match(r'^\|[\s:|-]+\|\s*$',lines[i+1]):
        tables+=1
        h=cells(lines[i]); j=i+2
        while j<len(lines) and lines[j].startswith('|'):
            c=cells(lines[j])
            if c!=h:
                bad+=1; print(f"line {j+1}: {c} pipes vs header {h}: {lines[j][:90]}")
            j+=1
        i=j
    else: i+=1
print(f"tables={tables} mismatches={bad}")
