# Cure A: every sentence that says what a town can pay, on every surface, against the Economic Survival band.
# usage: python3 payclasses.py <dir> <scan.ndjson> <out.json>
import sys,re,json,os,collections
D=sys.argv[1]; scan={o['seed']:o for o in map(json.loads,open(sys.argv[2]))}
def parse(p):
    d={};cur=None
    for l in open(p):
        l=l.rstrip('\n'); m=re.match(r'^== (.*) ==$',l)
        if m: cur=m.group(1); d[cur]=[]; continue
        d.setdefault(cur,[]).append(l)
    return d
def town(d):
    for l in d.get('register-player',[]):
        m=re.match(r'\s*"name": "(.*)",?$',l)
        if m: return m.group(1)
def band_of(score): return 'Strong' if score>=65 else 'Adequate' if score>=40 else 'Weak' if score>=20 else 'Critical'
PDFRUNG={'Money enough to ride out a long crisis':'Strong','Money enough for a short crisis':'Adequate','The defenders are already paid late':'Weak','There is no money to meet a crisis':'Critical'}
# the guard's purse clauses and the band each is true under (purse word: Strong->Prosperous, Adequate->Moderate, Weak/Critical->Poor)
GUARD=[('Hired swords back the garrison when the purse allows',{'Adequate'}),
       ('Hired swords back the garrison, paid from what the',None),
       ('Hired swords back the garrison.',{'Strong'}),
       ("charter hall takes bounty work against threats, as far as the purse runs",{'Adequate'}),
       ("coin for bounties",{'Weak','Critical'}),('coin to keep it runs short',{'Weak','Critical'})]
SHORT=re.compile(r'when the purse allows|as far as the purse runs|coin to keep it runs short|coin for bounties|what the [a-z]+ leaves')
CANPAY=re.compile(r'can pay its way through it|accounts have money in hand|could go through a bad season with its arrangements intact|Money enough to ride out a long crisis')
C=collections.defaultdict(list); pool=collections.defaultdict(collections.Counter)
for f in sorted(os.listdir(D)):
    seed=f[:-4]; s=scan[seed]; p=parse(os.path.join(D,f)); n=town(p) or '@@'
    sb=band_of(s['eco']) if s.get('eco') is not None else None
    tab=p.get('tab:defense',[]); pdf=p.get('pdf',[])
    tb=ts=pb=ps=None
    if 'Economic Survival' in tab: j=tab.index('Economic Survival'); tb=tab[j+1].replace(' ▼','').strip(); ts=tab[j+2]
    if 'Economic Survival' in pdf: j=pdf.index('Economic Survival'); pb=pdf[j+1].strip(); ps=pdf[j+2]
    if ts: pool[re.sub(r'\b(thorp|hamlet|village|town|city|metropolis)\b','<size>',ts.replace(n,'<T>'))][tb]+=1
    if tb!=sb: C['A0 tab band word != band of stored economic score'].append((seed,tb,sb))
    if pb!=tb: C['A1 PDF band word != tab band word'].append((seed,pb,tb))
    rung=next((v for k,v in PDFRUNG.items() if ps and ps.startswith(k)),None)
    if rung!=pb: C['A2 PDF money sentence rung != PDF band word'].append((seed,pb,rung,(ps or '')[:60]))
    allt='\n'.join(l for v,ls in p.items() if not v.startswith(('world-export','ai-','register')) for l in ls)
    for k,ok in GUARD:
        if k in allt:
            C['G* guard clause seen: '+k].append(seed)
            if ok is not None and tb not in ok: C['A4 guard clause beside a band it is not true under: '+k].append((seed,tb))
    tabt='\n'.join(tab)
    if SHORT.search(tabt) and (CANPAY.search(tabt) or CANPAY.search('\n'.join(pdf))): C['J short-purse guard line beside a can-pay line'].append((seed,tb))
    if 'when the purse allows' in allt and 'money in hand' in allt: C['L1 when-the-purse-allows beside money-in-hand'].append((seed,tb))
    if 'Hired swords' in allt and not s['merc']: C['B hired swords with no contracted company'].append((seed,s['charter'][:40],s['gar'][:30]))
    # export / AI grounding carry the guard line too: same clause as the page?
    ex='\n'.join(p.get('world-export-dm',[]))
    m=re.search(r'"guardEffectivenessDesc": "(.*)"',ex)
    if m and m.group(1) not in allt.replace('\n',' ') and m.group(1).split('. ')[-1] not in allt: C['X export guard line differs from the page'].append(seed)
bad={k:dict(v) for k,v in pool.items() if len(v)>1}
out={k:v for k,v in C.items()}; out['_tab_sentence_under_two_bands']=bad
json.dump(out,open(sys.argv[3],'w'),indent=0)
for k in sorted(C): print(f'{k[:95]:95s} {len(C[k]):5d}  e.g. {C[k][:2]}')
print('tab sentences printed under more than one band:',len(bad)); [print('  ',k[:120],v) for k,v in list(bad.items())[:10]]
