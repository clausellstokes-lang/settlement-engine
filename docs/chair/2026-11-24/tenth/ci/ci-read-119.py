# CI READ BY NAME (the eighth chair's; kept as it last ran, on the line's point 105, run 45069602146).
# HOW: for the run on the new tip, fetch each failing job's log with the GitHub tools (job logs) into logs8/<job id>.log,
# put that run's job ids below (they change every run), fix the path of RED-AT-LINE.tsv, then: python3 ci-read-by-name.py
# It prints: rows found, rows ON the list, rows NEW (by CONTAINMENT: a listed row holds an `it` title without its
# `describe` prefix), and the listed rows that did not fail this time.
import re,sys
ansi=re.compile(r'\x1b\[[0-9;]*m'); ts=re.compile(r'^\d{4}-\d\d-\d\dT[\d:.]+Z ?')
def lines(j): return [ts.sub('',ansi.sub('',l.rstrip('\n'))) for l in open("logs8/"+j+'.log',errors='replace')]
rows=[];seen=set()
def add(j,f,t):
    if (j,f,t) not in seen: seen.add((j,f,t)); rows.append((j,f,t))
for l in lines('140241810308'):
    m=re.match(r'^    (tests/\S+) :: (.*)$',l)
    if m: add('Gate / build and dist',m.group(1),m.group(2))
for j,n in (('140241810278','Coverage floors'),('140241810193','Golden master tr_TR')):
    for l in lines(j):
        m=re.match(r'^ FAIL  (tests/\S+) > (.*)$',l)
        if m: add(n,m.group(1),m.group(2).replace(' > ',' '))
for l in lines('140254805112'):
    m=re.match(r'^    (tests/\S+) :: (.*?)(  \[[\d.]+ ms\])?$',l)
    if m: add('Gate / test ratchet',m.group(1),m.group(2))
open('run-1f946c43f.tsv','w').write(''.join('\t'.join(r)+'\n' for r in rows))
norm=lambda s: re.sub(r'\s+','',s.replace(' > ',' '))
known=[l.rstrip('\n').split('\t') for l in open('/home/user/wt/chair/docs/chair/2026-11-20/seventh/ci/RED-AT-LINE.tsv') if not l.startswith('#')]
print(len(rows),len(known))
hit=set();new=[]
for r in rows:
    ok=False
    for i,k in enumerate(known):
        if k[1]==r[1] and (norm(k[2]) in norm(r[2]) or norm(r[2]) in norm(k[2])): ok=True;hit.add(i)
    if not ok: new.append(r)
print('ON',len(rows)-len(new),'NEW',len(new))
from collections import Counter
print(Counter(r[0] for r in rows))
for r in new: print('NEW\t'+'\t'.join(r))
print('--unfailed')
for i,k in enumerate(known):
    if i not in hit: print(k[1],'::',k[2])
