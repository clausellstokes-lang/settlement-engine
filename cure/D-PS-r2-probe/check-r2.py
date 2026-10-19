import re,sys
p=sys.argv[1]
s=open(p).read()
body=s[:s.index('## §18 THE CURE RECORD')]
ids=[f'PS-r2-{i}' for i in range(1,26)]+['SEAMS-r2-1','SEAMS-r2-6','SEAMS-r2-7','SEAMS-r2-8','SEAMS-r2-10','SEAMS-r2-13','SEAMS-r2-18','SEAMS-r2-21','HOST-r2-2','HOST-r2-3','HOST-r2-14','HOST-r2-16','HOST-r2-17','HOST-r2-18']
brackets=re.findall(r'\[CURED 2026-10-18 \(fp-final r2\)[^\]]*\]',body)
missing=[]
for i in ids:
    pat=re.compile(re.escape(i)+r'(?!\d)')
    if not any(pat.search(b) for b in brackets): missing.append(i)
print('r2 brackets in body:',len(brackets))
print('ids without a body bracket:',missing)
for key in ['PR question 1','PR question 2','PR question 4','SEAMS-r2-2','HOST-r2-1']:
    print(key, 'bracketed' if any(key in b for b in brackets) else 'MISSING')
# tables: consistent column counts within contiguous table blocks
lines=s.split('\n'); bad=[]
def cells(l):
    # remove escaped pipes and pipes inside code spans
    t=re.sub(r'\\\|','',l)
    t=re.sub(r'`[^`]*`','X',t)
    return t.count('|')
i=0
while i<len(lines):
    if lines[i].startswith('|'):
        j=i; n=cells(lines[i])
        while j<len(lines) and lines[j].startswith('|'):
            if cells(lines[j])!=n: bad.append((j+1,cells(lines[j]),n))
            j+=1
        i=j
    else: i+=1
print('table rows with column mismatch:',bad[:20])
# raw pipes inside code spans in table rows
raw=[]
for k,l in enumerate(lines):
    if l.startswith('|'):
        for m in re.finditer(r'`([^`]*)`',l):
            if '|' in m.group(1).replace('\\|',''): raw.append(k+1)
print('raw pipes in table code spans at lines:',sorted(set(raw)))
# odd backtick counts per line (possible broken code spans)
odd=[k+1 for k,l in enumerate(lines) if l.count('`')%2==1]
print('lines with odd backtick count:',odd[:30])
print('stale words:', {w: len(re.findall(w,body)) for w in ['scant','SET_PASSAGE_STANCE','one of eight','no_halt_at_seat']})
