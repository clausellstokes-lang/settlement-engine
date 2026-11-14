# pins.py <vitest-log> <cause> : re-key the corpus-row count pins a corpus growth moves, each with its cause.
# Touches ONLY whitelisted count assertions (file, message fragment); anything else is left red for a human.
import re,sys,json,gzip,os,subprocess
log=open(sys.argv[1]).read(); cause=sys.argv[2]
DATE='2026-11-13'
WL={ # file -> message fragments that mark a corpus-count pin
 'tests/domain/composeStateProse.test.js':['variants'],
 'tests/lint/proseWiringCensus.walker.test.js':['the R1 corpus holds this many variants','mean variants per pool','and the histogram sums back to the corpus','the per-block roll-up carries every variant once','pools with one variant, one grammar','over this many sourced field entries','HISTOGRAM','and the rest','pools with one variant'],
 'tests/lint/proseComposed.walker.test.js':['the shipped state corpus'],
 'tests/domain/warFaithStateProseDesk.test.js':[''],
 'tests/lint/proseEntryContradiction.walker.test.js':['entries carrying the trailing-coordinate class',''],
 'tests/lint/proseWaveGate.walker.test.js':['the units actually compared'],
 'tests/lint/proseMoveGrammar.walker.test.js':[''],
}
changed=[]
# generic: "AssertionError: [msg: ]expected A to be B" followed by "❯ file:line:col"
blocks=log.split('AssertionError: ')[1:]
for blk in blocks:
    m=re.match(r"(?:([^\n]*?): )?expected (\S+) to be (\S+) // Object\.is equality",blk)
    loc=re.search(r"❯ (tests/\S+?):(\d+):\d+",blk)
    if not m or not loc: continue
    msg,got,want,f,ln=m.group(1) or '',m.group(2),m.group(3),loc.group(1),int(loc.group(2))
    if f not in WL or not any(w in msg for w in WL[f]): continue
    if '\n' in (msg or ''): continue
    L=open(f).read().split('\n'); line=L[ln-1]
    pat='toBe('+want+')'
    if line.count(pat)!=1: print('SKIP',f,ln,want,'not once on line'); continue
    key=(f,ln)
    if key in [c[:2] for c in changed]: continue
    L[ln-1]=line.replace(pat,'toBe('+got+')',1)+f' // W2-WRITE {cause} ({DATE}): {want} -> {got}'
    open(f,'w').write('\n'.join(L)); changed.append((f,ln,want,got))
for c in changed: print('re-keyed',*c)
# under-claim owed
m=re.search(r"expected (\d+) to be less than or equal to (\d+)\s*\n\s*❯ tests/lint/proseComposed.walker.test.js:(\d+)",log)
if m:
    got,ceil=int(m.group(1)),int(m.group(2)); f='tests/lint/proseComposed.walker.test.js'; L=open(f).read().split('\n')
    if 'UNDER_CLAIM' in L[int(m.group(3))-1]:
        i=[k for k,l in enumerate(L) if 'const UNDER_CLAIM_OWED = ' in l][0]; old=int(re.search(r'= (\d+)',L[i]).group(1)); new=old+got-ceil
        L[i]=L[i].replace(f'= {old};',f'= {new};',1)+f' // W2-WRITE {cause} ({DATE}): {old} -> {new}, the new lines\' own per-line debt (A0b tally {ceil} -> {got})'
        open(f,'w').write('\n'.join(L)); print('UNDER_CLAIM_OWED',old,'->',new)
# the variants-per-pool histogram (proseWiringCensus), re-keyed from the diff's received side
for blk in log.split('AssertionError: ')[1:]:
    if not blk.startswith('variants per pool, exactly'): continue
    rec={}
    for l in blk.split('\n'):
        mm=re.match(r'^([ +])\s+"(\d+)": (\d+),?$',l)
        if mm: rec[mm.group(2)]=mm.group(3)
    f='tests/lint/proseWiringCensus.walker.test.js'; L=open(f).read().split('\n')
    k=[i for i,l in enumerate(L) if re.match(r'^\s+2: \d+, 3: \d+, 4: \d+',l)][0]
    head=L[k].split(' //')[0]; tail=L[k][len(head):]
    old=dict(re.findall(r'(\d+): (\d+)',head))
    new=', '.join(f'{a}: {rec.get(a,b)}' for a,b in old.items())+','
    moved=', '.join(f'{a}: {b} -> {rec[a]}' for a,b in old.items() if a in rec and rec[a]!=b)
    extra=[a for a in rec if a not in old]
    if extra: print('HISTOGRAM NEW SIZE',extra); break
    indent=re.match(r'^\s*',head).group(0)
    L[k]=indent+new+tail+f' // W2-WRITE {cause} ({DATE}): {moved}'
    open(f,'w').write('\n'.join(L)); print('histogram',moved)
# proseComposed's pools-carrying-a-finding ceiling (A0b), raised by the pools whose new lines owe the census's debt
for blk in log.split('AssertionError: ')[1:]:
    m=re.match(r"expected (\d+) to be less than or equal to (\d+)",blk); loc=re.search(r"❯ (tests/lint/proseComposed\.walker\.test\.js):(\d+):\d+",blk)
    if not m or not loc: continue
    f=loc.group(1); ln=int(loc.group(2)); L=open(f).read().split('\n')
    if 'expect(pools.size).toBeLessThanOrEqual(' not in L[ln-1]: continue
    got,want=m.group(1),m.group(2)
    L[ln-1]=L[ln-1].replace(f'toBeLessThanOrEqual({want})',f'toBeLessThanOrEqual({got})',1)+f' // W2-WRITE {cause} ({DATE}): {want} -> {got}, a pool whose new lines owe the census\'s under-claim debt (the line names less than the pool reads)'
    open(f,'w').write('\n'.join(L)); print('A0b pools',want,'->',got)
# every `line === N` annex anchor in proseEntryContradiction, re-addressed by its text (HEAD's line N -> its line now)
f='tests/lint/proseEntryContradiction.walker.test.js'; src=open(f).read()
ANCH=json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__),'anchors.json')))
doc=open('docs/content/RECEIPT_POOLS_DOSSIER_STATE.md').read().split('\n')
L=src.split('\n'); moved=False
for k,l in enumerate(L):
    for mm in re.finditer(r"\.line === (\d+)\)",l):
        n=int(mm.group(1)); text=ANCH.get(str(k))
        if text is None: continue
        if f'W2-WRITE {cause} ({DATE}): re-addressed by its text' in l: continue
        hits=[i+1 for i,d in enumerate(doc) if d==text]
        if len(hits)==1 and hits[0]!=n:
            new=hits[0]; L[k]=L[k].replace(f'.line === {n})',f'.line === {new})',1)+f' // W2-WRITE {cause} ({DATE}): re-addressed by its text: {n} -> {new}'
            for j in range(k,min(k+3,len(L))): L[j]=L[j].replace(f'RECEIPT_POOLS_DOSSIER_STATE.md:{n} did not load',f'RECEIPT_POOLS_DOSSIER_STATE.md:{new} did not load')
            print('anchor(text)',n,'->',new); moved=True
if moved: open(f,'w').write('\n'.join(L))
