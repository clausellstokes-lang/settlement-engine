import re,sys
ansi=re.compile(r'\x1b\[[0-9;]*m'); ts=re.compile(r'^\d{4}-\d\d-\d\dT[\d:.]+Z ?')
def lines(j): return [ts.sub('',ansi.sub('',l.rstrip('\n'))) for l in open("logs/"+j+'.log',errors='replace')]
rows=[];seen=set()
def add(j,f,t,m):
    if (j,f,t) not in seen: seen.add((j,f,t)); rows.append((j,f,t,m))
# summary-style jobs: "    file :: title" then "      msg: ..."
def summ(jid,name,stop=None):
    L=lines(jid)
    for i,l in enumerate(L):
        m=re.match(r'^    (tests/\S+) :: (.*?)(  \[[\d.]+ ms\])?$',l)
        if m:
            msg=''
            for k in L[i+1:i+6]:
                mm=re.match(r'^\s+msg: (.*)$',k)
                if mm: msg=mm.group(1);break
                if re.match(r'^    tests/',k): break
            add(name,m.group(1),m.group(2),msg)
summ('140722861879','Gate / build and dist')
summ('140740502845','Gate / test ratchet')
for j,n in (('140722861637','Coverage floors'),('140722862010','Golden master tr_TR')):
    L=lines(j)
    for i,l in enumerate(L):
        m=re.match(r'^ FAIL  (tests/\S+) > (.*)$',l)
        if m: add(n,m.group(1),m.group(2).replace(' > ',' '),L[i+1] if i+1<len(L) else '')
open('run-682667fe2.tsv','w').write('')
norm=lambda s: re.sub(r'\s+','',s.replace(' > ',' '))
known=[l.rstrip('\n').split('\t') for l in open('/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv') if not l.startswith('#')]
hit=set();out=[]
for r in rows:
    ok=False
    for i,k in enumerate(known):
        if k[1]==r[1] and (norm(k[2]) in norm(r[2]) or norm(r[2]) in norm(k[2])): ok=True;hit.add(i)
    out.append(r+('ON-LIST' if ok else 'NEW',))
open('run-682667fe2.tsv','w').write(''.join('\t'.join(x.replace('\t',' ') for x in r)+'\n' for r in out))
from collections import Counter
print(len(rows),len(known),Counter(r[0] for r in rows))
print('ON',sum(1 for r in out if r[4]=='ON-LIST'),'NEW',sum(1 for r in out if r[4]=='NEW'))
for r in out:
    if r[4]=='NEW': print('NEW\t'+'\t'.join(r[:4]))
print('--unfailed')
for i,k in enumerate(known):
    if i not in hit: print(k[0],'|',k[1],'::',k[2])
