#!/usr/bin/env python3
# READ-ALL, THE THIRD BUILDER (SURFACES=PDF,Journal reads the exports; SKIP_INV=<inventory.json> leaves out every sentence of that inventory;
# the header's lines wrapped; the food word read off the page; a person's memberships beside the first title).
# READ-ALL, THE SECOND READ (a richer header: the food record, the land, the quarrels, the past, the roster; the first read's HIGH and MED
# sentences left out by SKIP_FOLDS=<flagged.sentences.json>).
# READ-ALL: every distinct sentence the tabs print across the census towns, shown ONCE, as printed, under the facts of the
# hardest town that prints it (smallest tier first; inside a tier a siege, a famine, an occupation, a plague, any other
# stress, then calm; then the fewest houses). Then THE CRISIS READ: a sentence that prints both under a crisis and in a
# calm town, shown once more under each further crisis it prints in. Then THE CALIBRATION PACKET: ten whole pages.
# usage: build_packets.py <census out-dir (720)> <bar out-dir (10)> <out-dir> [words per packet]
import io,re,collections,glob,os,json,gzip,sys
OUT720,OUTBAR,DEST=sys.argv[1],sys.argv[2],sys.argv[3]
PACK=int(sys.argv[4]) if len(sys.argv)>4 else 34000
os.makedirs(DEST,exist_ok=True)
TIERS=['thorp','hamlet','village','town','city','metropolis']; TAB={'thorp':'th','hamlet':'ha','village':'vi','town':'to','city':'ci','metropolis':'me'}
HARD={'under_siege':'S','siege':'S','famine':'F','occupied':'O','occupation':'O','plague_onset':'P','plague':'P'}
TABS=tuple((os.environ.get('SURFACES') or 'World,Systems,Summary,Table').split(','))   # SURFACES=PDF,Journal reads the exports
def load(out):
    rec={}
    for l in gzip.open(out+'/corpus.ndjson.gz','rt',encoding='utf-8'):
        o=json.loads(l); rec[o['seed']]=o['s']
    return rec
def names_of(s):
    ns=set()
    def add(v):
        if isinstance(v,str) and 3<len(v)<60 and v[:1].isupper(): ns.add(v)
    add(s.get('name'))
    for n in s.get('npcs') or []:
        if isinstance(n,dict):
            add(n.get('name'))
            for t in str(n.get('name') or '').split():
                if len(t)>3 and t[:1].isupper(): ns.add(t)
    def walk(x,depth=0):
        if depth>6: return
        if isinstance(x,dict):
            for k,v in x.items():
                if k in('name','founder','founderName','rulerName','neighborName','settlementName','partnerName','rival','ally') and isinstance(v,str): add(v)
                else: walk(v,depth+1)
        elif isinstance(x,list):
            for v in x: walk(v,depth+1)
    for k in ('history','neighborRelationship','relationships','conflicts','prominentRelationship','stress','stressors','arrivalScene'):
        walk(s.get(k))
    return sorted(ns,key=len,reverse=True)
NUMW=r'(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|dozen|half|third|thirds|quarter|quarters|fifth|fifths|tenth|tenths)'
numw=re.compile(r'\b'+NUMW+r'(?:[- ]'+NUMW+r')*\b',re.I)
SPLIT=re.compile(r'(?<=[.!?])["”]?\s+(?=["“<A-Z])| · ')
RUN=re.compile(r'(?<!\bMac)(?<!\bMc)(?<=[a-z\)])(?=[A-Z])')   # a pill run's seams; never inside a Mac- or Mc- surname (the first read's artifact)
def fold(t,pat):
    if pat: t=pat.sub('<N>',t)
    t=re.sub(r'\d[\d,.]*','#',t); t=numw.sub('#',t)
    return re.sub(r'\s+',' ',t).strip()
def parts_of(line):
    if len(RUN.findall(line))>=2: line=RUN.sub(' · ',line)       # a run of pills printed with no space between them
    return [p.strip() for p in SPLIT.split(line) if p and p.strip()]
def stress_types(s):
    ts=[]
    for k in ('stress','stressors'):
        v=s.get(k)
        for x in (v if isinstance(v,list) else [v]):
            if isinstance(x,dict) and x.get('type') and x['type'] not in ts: ts.append(x['type'])
    return ts
def hard_of(s): return sorted({HARD[t] for t in stress_types(s) if t in HARD})
def g(d,*ks):
    for k in ks:
        if not isinstance(d,dict): return None
        d=d.get(k)
    return d
PAGEFOOD={}
def page_food(out,seed):
    k=(out,seed)
    if k not in PAGEFOOD:
        w=None
        try:
            for line in io.open('%s/dumps/%s.txt'%(out,seed),encoding='utf-8'):
                m=re.match(r'^Food Security\s*([A-Z][A-Za-z -]{2,30})$',line.strip())
                if m: w=m.group(1); break
        except OSError: pass
        PAGEFOOD[k]=w
    return PAGEFOOD[k]
def wrap(line,width=560):
    out=[]; cur=''
    for part in line.split('; '):
        if cur and len(cur)+len(part)+2>width: out.append(cur+';'); cur='   '+part
        else: cur=(cur+'; '+part) if cur else part
    out.append(cur); return '\n'.join(out)
HDR_OUT=[None]
def header(seed,s):
    inst=[i.get('name') for i in (s.get('institutions') or []) if isinstance(i,dict)]
    dp=g(s,'defenseProfile','institutions') or {}
    def dn(k): return ', '.join(i.get('name','?') for i in (dp.get(k) or []) if isinstance(i,dict)) or 'none'
    es=s.get('economicState') or {}; ps=s.get('powerStructure') or {}; hi=s.get('history') or {}; fb=g(s,'economicViability','metrics','foodBalance') or {}
    st=[]
    for k in ('stress','stressors'):
        v=s.get(k)
        for x in (v if isinstance(v,list) else [v]):
            if isinstance(x,dict) and x.get('label') and x['label'] not in st: st.append(x['label'])
    cond=[c.get('label') for c in (s.get('activeConditions') or []) if isinstance(c,dict)]
    food=''
    if fb:
        dpct=fb.get('deficitPercent'); sur=fb.get('surplus')
        food='food: daily need %s, grown %s, deficit %s%%, imports cover %s' % (fb.get('dailyNeed'),fb.get('dailyProduction'),dpct,fb.get('importCoverage'))
    L=[]
    L.append('TOWN %s · "%s" · %s · population %s · %s years old · terrain %s · trade access %s · culture %s · magic %s · monsters %s' % (seed,s.get('name'),s.get('tier'),s.get('population'),hi.get('age'),g(s,'resourceAnalysis','terrain'),es.get('tradeAccess'),g(s,'culturalIdentity','label'),g(s,'config','magicLevel'),g(s,'config','monsterThreat')))
    L.append('CRISIS: %s%s' % (', '.join(st) or 'none', (' · conditions: '+', '.join(c for c in cond if c)) if cond else ''))
    L.append('GOVERNMENT: %s · stability: %s · legitimacy: %s · powers: %s' % (ps.get('government'),ps.get('stability'),g(ps,'publicLegitimacy','label'),'; '.join('%s (%s)'%(f.get('faction'),f.get('powerLabel') or f.get('power')) for f in (ps.get('factions') or []) if isinstance(f,dict))))
    L.append('STATE: prosperity %s · safety %s · defence %s · viable %s · %s' % (es.get('prosperity'),g(es,'safetyProfile','safetyLabel'),g(s,'defenseProfile','readiness','label'),g(s,'economicViability','viable'),food))
    L.append('DEFENCE: walls: %s · garrison: %s · militia: %s · watch: %s · mercenary company (by the defence record; a house on HOUSES such as Hired blades is not one unless it is named here): %s · charter: %s · magic: %s' % (dn('walls'),dn('garrison'),dn('militia'),dn('watch'),dn('mercenary'),dn('charter'),dn('magicDef')))
    L.append('HOUSES (%d, the whole list): %s' % (len(inst),'; '.join(str(i) for i in inst)))
    L.append('TRADE: exports: %s · imports: %s · made here: %s' % (', '.join(map(str,es.get('primaryExports') or [])) or 'none',', '.join(map(str,es.get('primaryImports') or [])) or 'none',', '.join(map(str,es.get('localProduction') or [])) or 'none'))
    # ADDED 2026-11-15 01:56 UTC: the town's income sources (economicState.incomeSources). READ-ALL-4 flagged "money made outside the law"
    # in 119 towns and "back rooms and after dark" in 18 as naming a crime the header lacks: every one of those towns holds a criminal income
    # source in the record (measure4.py): the header's limit, the chair's own, a third time.
    inc=', '.join('%s %s%%'%(x.get('source'),x.get('percentage') if x.get('percentage') is not None else x.get('share')) for x in (es.get('incomeSources') or []) if isinstance(x,dict)) or 'none'
    L.append('INCOME (the sources of the town\'s money, by the record): %s' % inc)
    L.append('FOUNDING: by %s · reason: %s' % (g(hi,'founding','foundedBy'),g(hi,'founding','reason')))
    fsec=es.get('foodSecurity') or {}; fr=fsec.get('foodRecord') or {}
    L.append('FOOD: the word the page prints %s · band %s · grown %s%% · brought in %s%% · by magic %s%% · gap %s%% · surplus %s%% · stores %s months (granary %s) · failed source %s · famine cut %s%%' % (page_food(HDR_OUT[0],seed) or fsec.get('label'),fr.get('band'),fr.get('grownPct'),fr.get('normalImportPct'),fr.get('magicPct'),fr.get('gapPct'),fr.get('surplusPct'),fr.get('storageMonths'),fr.get('hasGranary'),fr.get('failedSource'),fr.get('famineCutPct')))
    ra=s.get('resourceAnalysis') or {}
    res='; '.join('%s (%s)'%(c.get('label'),c.get('condition')) for c in (ra.get('resourceConditions') or []) if isinstance(c,dict)) or 'none'
    ch=[]
    for c in (es.get('activeChains') or []):
        if isinstance(c,dict):
            x='%s [%s; its resource %s%s]'%(c.get('label'),c.get('status') or ('running' if c.get('resourceActive') else 'not running'),c.get('resource'),(' '+str(c.get('resourceCondition'))) if c.get('resourceCondition') else '')
            if x not in ch: ch.append(x)
    gaps='; '.join('%s: %s'%(x.get('institution') or x.get('chain'),x.get('impact')) for x in (ra.get('gaps') or []) if isinstance(x,dict)) or 'none'
    L.append('LAND: resources: %s · chains: %s · gaps: %s' % (res,'; '.join(ch) or 'none',gaps))
    q='; '.join('%s vs %s: %s (%s)'%((c.get('parties') or ['?','?'])[0],(c.get('parties') or ['?','?'])[-1],c.get('intensity'),c.get('issue')) for c in (ps.get('conflicts') or []) if isinstance(c,dict)) or 'none'
    rel='; '.join('%s ~ %s: %s, %s'%((r.get('pair') or ['?','?'])[0],(r.get('pair') or ['?','?'])[-1],r.get('type'),r.get('direction')) for r in (ps.get('factionRelationships') or []) if isinstance(r,dict)) or 'none'
    L.append('QUARRELS: %s · relations between powers: %s · legitimacy score %s' % (q,rel,g(ps,'publicLegitimacy','score')))
    # ADDED 2026-11-14 23:52 UTC: the town's live tensions (history.currentTensions: type, parties). The exports' read flagged about two
    # hundred lines for naming an event or a party "the header lacks" that this field of the record holds (set apart by verify3.py).
    ten=[]
    for t in (hi.get('currentTensions') or []):
        if isinstance(t,dict): ten.append('%s%s'%(str(t.get('type') or t.get('name') or '?').replace('_',' '),(' (parties: '+', '.join(str(x) for x in (t.get('factions') or []))+')') if t.get('factions') else ''))
    L.append('TENSIONS (the town\'s live quarrels, each with its own back-story and parties; a line may name these): %s' % ('; '.join(ten) or 'none'))
    L.append('PAST: %s' % ('; '.join('%s (%s years ago, %s, %s)'%(e.get('name'),e.get('yearsAgo'),e.get('type'),e.get('severity')) for e in (hi.get('historicalEvents') or []) if isinstance(e,dict)) or 'none recorded'))
    ppl=[]
    for n in (s.get('npcs') or []):
        if isinstance(n,dict):
            inst=n.get('institution'); ik=(inst.get('key') if isinstance(inst,dict) else inst) or ''
            # FIXED 2026-11-14 23:50 UTC: a membership is {power, rank, share, veiled}; the first build read a key that does not exist, so the
            # exports' read saw NO seat on anyone and flagged every true seat claim (struck at the merge by verify3.py, by the record)
            ms=['%s (%s%s)'%(m.get('power'),('rank %s'%m.get('rank')) if m.get('rank') is not None else 'a member, no rank',', veiled' if m.get('veiled') else '') for m in (n.get('memberships') or []) if isinstance(m,dict) and m.get('power')]
            ppl.append('%s (%s), %s%s%s'%(n.get('name'),str(n.get('gender') or '?')[:1],n.get('title') or n.get('role'),(' @ '+str(ik)) if ik else '',(' [sits on: '+'; '.join(ms)+']') if ms else ''))
    L.append('PEOPLE (%d, the whole roster): %s' % (len(ppl),'; '.join(ppl)))
    return '\n'.join(wrap(x) for x in L)
NODEDUPE={'Summary/Plot Hooks','Systems/Power','World/NPCs','World/Relationships'}
MARKP=re.compile(r'^(Stopped by [^.]*\.|Curtailed by [^.]*\.|Scarce in [^.]*\.|Short of [^.]*\.)$')
def read_town(out,seed,s):
    ns=names_of(s); pat=re.compile('|'.join(re.escape(n) for n in ns)) if ns else None
    cur=None; rows=[]; seen=set()
    for line in io.open('%s/dumps/%s.txt'%(out,seed),encoding='utf-8'):
        line=line.rstrip('\n')
        if line.startswith('== '): cur=line.strip('= ').strip(); continue
        if not line or line.startswith('[STYLE]') or not cur or cur.split('/')[0] not in TABS: continue
        # MENDED 2026-11-15 03:58 UTC (the chair's own fault, found by the bar's read): the crisis leaf's mark opens a row's description
        # ("Stopped by the siege. Rent horses for single journeys…") and the sentence splitter made it a line of its own, WHICH THE
        # PER-SECTION DEDUPE THEN SHOWED ONCE: every later marked row of the section was shown to the readers WITHOUT its mark
        # (nineteen flags of one town). A mark now stays joined to the part it opens and a marked showing is never deduped away.
        parts=list(parts_of(line)); j=0
        while j<len(parts):
            p=parts[j]
            if MARKP.match(p.strip()) and j+1<len(parts):
                f=fold(parts[j+1],pat); p=p.strip()+' '+parts[j+1]; j+=2; key=(cur,'M|'+str(f))
            else:
                f=fold(p,pat); j+=1; key=(cur,f)
            # MENDED 2026-11-15 20:00 UTC (two artifacts the bar's third read and the wide read paid for: seventeen plot-hook flags and a
            # power's "1 member" row read under another power's name): in a section that is a LIST OF CARDS (a name or a power, then its
            # own rows) the per-section dedupe showed a repeated head ONCE, so every later card's rows read as the first card's.
            # In those sections nothing is deduped; elsewhere a row that is only a name (a card's head) is always shown.
            if not f: continue
            if cur in NODEDUPE or f=='<N>': rows.append((cur,f,p)); seen.add(key); continue
            if key in seen: continue
            seen.add(key); rows.append((cur,f,p))
    return rows
# ---------- the 720
rec=load(OUT720)
pages={seed:read_town(OUT720,seed,s) for seed,s in rec.items()}
towns_of=collections.defaultdict(set); secs_of=collections.defaultdict(set)
for seed,rows in pages.items():
    for sec,f,p in rows: towns_of[f].add(seed); secs_of[f].add(sec)
hard={seed:hard_of(s) for seed,s in rec.items()}
anyst={seed:bool(stress_types(s)) for seed,s in rec.items()}
def rank(seed):
    s=rec[seed]; h=hard[seed]
    c=('SFOP'.index(h[0]) if h else (4 if anyst[seed] else 5))
    return (TIERS.index(s.get('tier')) if s.get('tier') in TIERS else 9, c, len(s.get('institutions') or []), seed)
order=sorted(rec,key=rank)
ids={f:'%05d'%i for i,f in enumerate(sorted(towns_of),1)}
def tag(f):
    ts=towns_of[f]; n=len(ts)
    if n==1: return ''
    tr=sorted({TIERS.index(rec[t]['tier']) for t in ts if rec[t].get('tier') in TIERS})
    cr=''.join(sorted({c for t in ts for c in hard[t]},key='SFOP'.index))
    rng=TAB[TIERS[tr[0]]]+('-'+TAB[TIERS[tr[-1]]] if tr[-1]!=tr[0] else '')
    return '[x%d %s%s] ' % (n,rng,(' '+cr) if cr else '')
SKIP=set()
if os.environ.get('SKIP_FOLDS'):
    SKIP={r['fold'] for r in json.load(io.open(os.environ['SKIP_FOLDS'],encoding='utf-8')) if r.get('sev') in ('HIGH','MED')}
if os.environ.get('SKIP_INV'):
    SKIP|=set(json.load(io.open(os.environ['SKIP_INV'],encoding='utf-8')).keys())
shown=set(SKIP); blocks=[]      # (kind, seed, text, words)
for seed in order:
    lines=[]; cur=None; w=0
    for sec,f,p in pages[seed]:
        if f in shown: continue
        shown.add(f)
        if sec!=cur: lines.append('## '+sec); cur=sec
        lines.append('%s %s%s' % (ids[f],tag(f),p)); w+=len(p.split())
    HDR_OUT[0]=OUT720
    if lines: blocks.append(('main',seed,header(seed,rec[seed])+'\n'+'\n'.join(lines),w+120))
# ---------- the crisis read
shown_under=collections.defaultdict(set)   # crisis letter -> folded sentences already read under a town of that crisis
def prints_outside(f,c): return any(c not in hard[t] for t in towns_of[f])   # it also prints in a town that is not under crisis c
main_town={}
sh=set()
for seed in order:
    for sec,f,p in pages[seed]:
        if f not in sh: sh.add(f); main_town[f]=seed
for f,seed in main_town.items():
    for c in hard[seed]: shown_under[c].add(f)
cblocks=[]
for c in 'SFOP':
    for seed in [t for t in order if c in hard[t]]:
        lines=[]; cur=None; w=0
        for sec,f,p in pages[seed]:
            if f in shown_under[c] or f in SKIP or len(p.split())<5 or not prints_outside(f,c): continue
            shown_under[c].add(f)
            if sec!=cur: lines.append('## '+sec); cur=sec
            lines.append('%s %s%s' % (ids[f],tag(f),p)); w+=len(p.split())
        HDR_OUT[0]=OUT720
        if lines: cblocks.append(('crisis-'+c,seed,header(seed,rec[seed])+'\n'+'\n'.join(lines),w+120))
# ---------- packets
def pack(blocks,prefix):
    packs=[]; cur=[]; w=0
    for b in blocks:
        if cur and w+b[3]>PACK: packs.append(cur); cur=[]; w=0
        cur.append(b); w+=b[3]
    if cur: packs.append(cur)
    names=[]
    for i,pk in enumerate(packs,1):
        name='%s-%02d.txt'%(prefix,i); names.append((name,sum(b[3] for b in pk),len(pk)))
        io.open(os.path.join(DEST,name),'w',encoding='utf-8').write('\n\n'.join('==== '+b[2] for b in pk)+'\n')
    return names
man={'main':pack(blocks,'main'),'crisis':pack(cblocks,'crisis')}
# ---------- the calibration packet: ten whole pages
brec=load(OUTBAR); cal=[]; cidx={}
n=0
for seed in sorted(brec):
    rows=read_town(OUTBAR,seed,brec[seed]); lines=[]; cur=None; w=0
    for sec,f,p in rows:
        n+=1; cid='C%04d'%n; cidx[cid]={'town':seed,'section':sec,'text':p}
        if sec!=cur: lines.append('## '+sec); cur=sec
        lines.append('%s %s'%(cid,p)); w+=len(p.split())
    HDR_OUT[0]=OUTBAR
    cal.append(('cal',seed,header(seed,brec[seed])+'\n'+'\n'.join(lines),w+120))
man['cal']=pack(cal,'cal')
json.dump({'ids':{ids[f]:{'fold':f,'towns':sorted(ts),'sections':sorted(secs_of[f]),'main_town':main_town.get(f)} for f,ts in towns_of.items()},'cal':cidx},io.open(os.path.join(DEST,'index.json'),'w',encoding='utf-8'),ensure_ascii=False)
for k,v in man.items():
    print(k,len(v),'packets; words',sum(x[1] for x in v),'; towns',sum(x[2] for x in v))
    print('   ',' '.join('%s:%d'%(a.split('.')[0],b) for a,b,c in v))
print('distinct sentences',len(towns_of),'crisis-read showings',sum(len(b[2].split('\n'))-9 for b in cblocks))
