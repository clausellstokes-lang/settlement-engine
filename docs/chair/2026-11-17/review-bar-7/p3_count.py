import io,os,re,sys,json,gzip,collections
DUMPS,PUB,ROWS,CORPUS=sys.argv[1:5]
rec={}
for l in gzip.open(CORPUS,'rt',encoding='utf-8'):
    o=json.loads(l); rec[o['seed']]=o['s']
MARK=r'(?:Stopped by|Curtailed by|Short of|Scarce in)[^.]*\.|Abandoned: [^.]*\.|Failing: [^.]*\.'
PATS=[('Abandoned: a failed venture.',re.compile(re.escape('Abandoned: a failed venture.'))),
 ('Failing: a failed venture.',re.compile(re.escape('Failing: a failed venture.'))),
 ('Curtailed by the siege.',re.compile(re.escape('Curtailed by the siege.'))),
 ('Stopped by the siege.',re.compile(re.escape('Stopped by the siege.'))),
 ('Short of (as a mark)',re.compile(r'(?:^|[:·.] )Short of [^.]*\.')),
 (' is worked out: its own ground is depleted',re.compile(re.escape(' is worked out: its own ground is depleted'))),
 ('^No .+ reach(es)? (a gap line)',re.compile(r'^No .+ reach(es)? ')),
 (' stands abandoned, a venture of an earlier time',re.compile(re.escape(' stands abandoned, a venture of an earlier time'))),
 (' failing: no ',re.compile(re.escape(' failing: no '))),
 ('Curtailed by the war.',re.compile(re.escape('Curtailed by the war.')))]
CARDMARK=re.compile(r'^(?:%s)$'%MARK)
def sections(path):
    cur=None
    for i,line in enumerate(io.open(path,encoding='utf-8'),1):
        line=line.rstrip('\n')
        if line.startswith('== '): cur=line.strip('= ').strip(); continue
        yield i,cur,line
seeds=sorted(f[:-4] for f in os.listdir(DUMPS) if f.endswith('.txt'))
dump={s:list(sections('%s/%s.txt'%(DUMPS,s))) for s in seeds}
# the packets' own lines (what the readers read)
pk=[]
for f in sorted(x for x in os.listdir(PUB) if re.match(r'^bar7-\d+\.txt\.gz$',x)):
    pk+=gzip.open(os.path.join(PUB,f),'rt',encoding='utf-8').read().split('\n')
pktext=[re.sub(r'^C\d+ ','',l) for l in pk if re.match(r'^C\d+ ',l)]
print('P3 · WHAT THE PAGE NOW PRINTS BY DESIGN, COUNTED (thirty dumps: every surface of the dump; and the packets: the lines the readers read)')
print('%-50s %14s %8s %14s'%('pattern','dump lines','towns','packet lines'))
for name,p in PATS:
    ls=[(s,i,sec,l) for s in seeds for i,sec,l in dump[s] if p.search(l)]
    print('%-50s %14d %8d %14d'%(name,len(ls),len({x[0] for x in ls}),sum(1 for l in pktext if p.search(l))))
# a person's card line that is only a house mark
CARDSEC=lambda sec: sec and ('NPC' in sec)
cm=[]
for s in seeds:
    d=dump[s]
    for k,(i,sec,l) in enumerate(d):
        if CARDMARK.match(l.strip()) and CARDSEC(sec): cm.append((s,i,sec,l,d[k-1][2] if k else ''))
allm=[(s,i,sec) for s in seeds for i,sec,l in dump[s] if CARDMARK.match(l.strip())]
pkm=sum(1 for l in pktext if CARDMARK.match(l.strip()))
print('%-50s %14d %8d %14d'%("a card line that is ONLY a house mark (NPC sections)",len(cm),len({x[0] for x in cm}),pkm))
print("   (the packet column of this row: packet lines that are only a mark, any section)")
print('   (by section: %s; every line of the dump that is only a mark, any section: %d, by section: %s)'%(dict(collections.Counter(x[2] for x in cm)),len(allm),dict(collections.Counter(x[2] for x in allm).most_common(8))))
print('   (by mark: %s)'%dict(collections.Counter(x[3].strip() for x in cm).most_common()))
print('   three as printed (the line above it, then the mark):')
pick=[]; seenm=set()
for x in cm:
    if x[3] not in seenm: seenm.add(x[3]); pick.append(x)
for x in (pick+cm)[:3]: print('     %s:%d [%s]  %s  /  %s'%(x[0],x[1],x[2],x[4],x[3]))
# the three towns with the most Short of marks
sp=PATS[4][1]
by=collections.Counter(); lines=collections.defaultdict(list)
for s in seeds:
    for i,sec,l in dump[s]:
        if sp.search(l): by[s]+=1; lines[s].append((i,sec,l))
print('\nTHE THREE TOWNS WITH THE MOST "Short of " MARKS (dump lines):')
for s,n in by.most_common(3):
    print('  %s · %d lines'%(s,n))
    for i,sec,l in lines[s][:5]: print('     %d [%s] %s'%(i,sec,l[:300]))
# the very rare secrets
rows=json.load(io.open(ROWS,encoding='utf-8'))
def rx(t): return re.compile(re.sub(r'\\\{(superior|target)\\\}','.+?',re.escape(t)))
rp=[(r,rx(r['what']),rx(r['stakes'])) for r in rows]
print('\nTHE VERY RARE SECRETS (src/data/rareSecrets.js, %d rows, matched by each row\'s "what" text, the holder read from the record\'s npcs[].secret; a row\'s stakes alone is not matched: "It does not" would match any prose): every line of the thirty dumps'%len(rows))
hits=[]
for s in seeds:
    npcs=[n.get('name') for n in (rec[s].get('npcs') or []) if isinstance(n,dict) and n.get('name')]
    d=dump[s]
    for k,(i,sec,l) in enumerate(d):
        for r,a,b in rp:
            if a.search(l):
                who=[n.get('name') for n in (rec[s].get('npcs') or []) if isinstance(n,dict) and isinstance(n.get('secret'),dict) and a.search(str(n['secret'].get('what') or ''))]
                who=', '.join(who) or '(no card in the record holds it)'
                hits.append((s,who,sec,i,r['fam']+'/'+r['key'],l))
for h in hits: print('  %s · %s · [%s:%d] %s · %s'%(h[0],h[1],h[2],h[3],h[4],h[5][:300]))
print('  lines %d · towns %d · rows %s'%(len(hits),len({h[0] for h in hits}),dict(collections.Counter(h[4] for h in hits))))
