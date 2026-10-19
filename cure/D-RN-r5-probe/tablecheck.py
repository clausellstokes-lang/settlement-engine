import re,sys
p=sys.argv[1]
lines=open(p,encoding='utf-8').read().split('\n')
def cells(l):
    s=re.sub(r'\\\|','',l)           # escaped pipes
    s=re.sub(r'`[^`]*`', lambda m: m.group(0).replace('|',''), s)  # pipes inside code spans
    return s.strip().strip('|').count('|')+1
bad=0; tables=0; i=0
while i<len(lines):
    if lines[i].startswith('|') and i+1<len(lines) and re.match(r'^\|[-| :]+\|$',lines[i+1].strip()):
        tables+=1; n=cells(lines[i]); j=i+2
        while j<len(lines) and lines[j].startswith('|'):
            if cells(lines[j])!=n: bad+=1; print(f"l.{j+1}: {cells(lines[j])} cells vs {n}: {lines[j][:110]}")
            j+=1
        i=j
    else: i+=1
print(f"tables {tables} · mismatched rows {bad}")
# the r5 block's dispositions
t='\n'.join(lines); blk=t[t.find('### Round r5'):]
rows=[l for l in blk.split('\n') if l.startswith('| ') and not l.startswith('| Finding') ]
import collections
c=collections.Counter()
for r in rows:
    d=r.split('|')[3].strip() if len(r.split('|'))>3 else ''
    c['CURED' if d.startswith('CURED') else ('NOTED' if d.startswith('NOTED') else d[:12])]+=1
print('r5 rows', len(rows), dict(c))
