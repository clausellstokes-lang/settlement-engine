import sys,re
path=sys.argv[1]; diffp=sys.argv[2]
lines=open(path,encoding='utf-8').read().split('\n')
# inserted line numbers from diff (new-file numbering)
ins=set()
for l in open(diffp,encoding='utf-8'):
    m=re.match(r'^\d+a(\d+)(?:,(\d+))?$',l.strip())
    if m:
        a=int(m.group(1)); b=int(m.group(2) or a)
        ins.update(range(a,b+1))
def cells(row):
    # strip code spans then count unescaped pipes
    s=re.sub(r'`[^`]*`','X',row)
    s=s.replace('\\|','')
    return s.count('|')
bad=0;checked=0
for n in sorted(ins):
    row=lines[n-1]
    if not row.startswith('|'): continue
    # find header above: walk up to first line starting '|' followed by separator
    k=n-1
    while k>0 and lines[k-1].startswith('|'): k-=1
    header=lines[k]  # first table line
    checked+=1
    if cells(row)!=cells(header):
        bad+=1; print('MISMATCH',n,cells(row),cells(header),row[:120])
print('checked',checked,'bad',bad,'inserted',len(ins))
