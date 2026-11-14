# read30 classifier: every reader-surface sentence matching a RULE gets (home, class, contradicts). Rules encode the by-eye rulings.
import re,os,sys,json,collections
D=sys.argv[1]; READER=re.compile(r'^== (tab:\w+|tonight|pdf|foundry) ==$')
info={l.split('\t')[0]:l.rstrip('\n').split('\t') for l in open(D+'/select.log')}
preb={l.split('\t')[0]:l.rstrip('\n').split('\t') for l in open(D+'/preb.tsv')}
HARD=('famine','under_siege')
def crisis(s): return re.match(r'rv2-([a-z_]+)-',s).group(1)
C='CORPUS';K='CODE';T='TRUE'
DEF2='src/data/dossierStateProse/defense.generated.js (corpus document, docs/content/RECEIPT_POOLS_DOSSIER_STATE.md) :: DS-DEF-2'
GEN13='src/data/dossierStateProse/general.generated.js (corpus document) :: DS-GEN-13'
RULES=[
 (r"accounts have money in hand", DEF2+' "Economic Survival: STRONG" vid1', lambda s,c,p: C if c in HARD or p=='Poor' else T),
 (r"with its arrangements intact", DEF2+' "Economic Survival: STRONG" vid2', lambda s,c,p: C if c in HARD else T),
 (r"has not turned into a collapse, because", DEF2+' "Economic Survival: STRONG" vid3', lambda s,c,p: C if c in HARD else T),
 (r"supply book for .* defenders balances|busy and well stocked, and the defenders|defence at .* is kept supplied", DEF2+' "CHAIN: defence supplied"', lambda s,c,p: C if c in HARD else T),
 (r"tally of salted and preserved food .* kept up|working steadily, which matters", DEF2+' "CHAIN: food trades working"', lambda s,c,p: C if c in HARD else T),
 (r"garrison roll puts paid soldiers", DEF2+' "Invasion & War: walls AND professional garrison" vid1', lambda s,c,p: C if c=='under_siege' else T),
 (r"present peace asks nothing", 'src/data/dossierStateProse/defense.generated.js (corpus document) :: DS-DEF-11 "WALLED-QUIET" vid1', lambda s,c,p: C if c in HARD else T),
 (r"does not spend much time thinking about being attacked", 'corpus document :: DS-DEF-1 "readiness STRONG" vid3', lambda s,c,p: T),
 (r"can field and what .* has built are both in good order", 'corpus document :: DS-DEF-1 "readiness STRONG" vid2', lambda s,c,p: T),
 (r"market without asking|can rent warehouse space|warehouses between the road and the buyer|change coin, borrow or settle", GEN13+' (MARKET-OPEN / WAREHOUSES / COMMERCE: a bank)', lambda s,c,p: C+'-commerce' if c=='under_siege' else T),
 (r"Plenty passes through|Traffic moves along .* every day|market sells little, though the", 'src/data/dossierStateProse/economy.generated.js (corpus document) :: DS-ECO-1 "COMBINATION C4"', lambda s,c,p: C+'-commerce' if c=='under_siege' else T),
 (r"has been short of money for years", DEF2+' "Economic Survival: WEAK" vid3', lambda s,c,p: C+'-aNEW' if info[s][3] in('Prosperous','Wealthy','Comfortable') else T),
 (r"Paid hands keep|pays wages for its defense", 'src/data/dossierStateProse/general.generated.js (corpus document) :: DS-GEN-17 "GARRISONED"', lambda s,c,p: T),
 (r"can fund a short crisis|can pay for its own emergencies|can pay for a crisis of the ordinary length", DEF2+' "Economic Survival: ADEQUATE"', lambda s,c,p: T),
 (r"closes every year ahead", 'src/data/dossierStateProse/economy.generated.js (corpus document) :: DS-ECO-8 "COMFORTABLE" vid1', lambda s,c,p: T),
 (r"comfortably over-provided against beasts|ordinary rather than anxious", 'corpus document :: DS-DEF-2 Beasts & Monsters pools', lambda s,c,p: T),
 (r"doing the job they were paid for", 'corpus document :: DS-DEF-5 "mercenary / contracted forces PRESENT" vid3', lambda s,c,p: T),
 (r"Money enough to ride out a long crisis", 'src/domain/display/threatAssessment.js :: buildThreatAssessment (econA, via moneyRungOf)', lambda s,c,p: (K+('-bNEW' if preb[s][6].startswith('Money enough for a short') or not preb[s][6].startswith('Money enough') else '')) if (c in HARD or c=='occupied') else T),
 (r"Money enough for a short crisis", 'src/domain/display/threatAssessment.js :: buildThreatAssessment (econA, via moneyRungOf)', lambda s,c,p: K+'-bNEW' if not preb[s][6].startswith('Money enough') else T),
 (r"A thriving alchemical trade", 'src/generators/economy/economicState.js :: generateEconomicState (incomeBuild desc, Apothecary & Alchemy)', lambda s,c,p: K if c in HARD else T),
 (r"Well-funded city watch", 'src/generators/power/rulingStructure.js :: generatePowerStructure (militaryDesc, militaryPower > 18)', lambda s,c,p: K if c in HARD else T),
 (r"well paid, well equipped and patrols properly", 'src/generators/safetyProfile.js :: generateSafetyProfile (guardEffectivenessDesc)', lambda s,c,p: K if c in HARD else T),
 (r"Hired swords back the garrison when the purse allows", 'src/generators/safetyProfile.js :: generateSafetyProfile (purse clause, declared prosperity <= comfortable)', lambda s,c,p: T),
 (r"in a kingdom at war and doing well out of it", 'src/generators/stressNarrative.js :: RENDERERS.wartime (roll.profit branch)', lambda s,c,p: K+'-aSHARP'),
 (r"is prosperous in a way that feels wrong", 'src/data/narrativeData.js :: STRESS_DESCS.wartime (arrival vignette)', lambda s,c,p: K+'-aSHARP'),
 (r"keeps order and pays its way", 'src/domain/display/dossierViewModel.js :: deriveViability (strained/covered pick)', lambda s,c,p: K if c=='indebted' else T),
 (r"feeds itself and pays its own way", 'src/domain/display/dossierViewModel.js :: deriveViability (self_sufficient pick)', lambda s,c,p: T),
 (r"looks prosperous in the merchant quarter", 'src/data/narrativeData.js :: STRESS_DESCS.famine vid1', lambda s,c,p: T),
 (r"Rich farmland: the fields yield well over", 'src/pdf/sections/EconomicsTrade.jsx :: farmlandWords', lambda s,c,p: T),
 (r"keeps more in reserve than its size explains", 'src/generators/narrativeText.js (history hook)', lambda s,c,p: T),
 (r"wealth it once carried drained away", 'src/data/historyData.js (Trade collapse tension)', lambda s,c,p: K+'-aNEW' if info[s][3] in('Prosperous','Wealthy','Comfortable') and s=='rv2-famine-metropolis-1' else T),
]
R=[(re.compile(a,re.I),h,f) for a,h,f in RULES]
CTX=re.compile(r"(\w+ before the [a-z ]+; \w+ while (it lasts|they last)\.|No one can earn a normal living[^.]*\.|[^.]*may not come through this crisis[^.]*\.|It may not survive as it stands\.|As things stand, [^.]+ will not survive\.|The occupiers take the revenue[^.]*\.|The guards' rations[^.]*\.|nothing comes in by road without the besiegers' leave|The place earns less than it spends\.|what is owed abroad is paid before anything the people here need|The war takes most of the money[^.]*\.|Those who keep order in \S+ spend their days guarding the stores[^.]*\.)")
rows=[]
for f in sorted(os.listdir(D+'/dumps')):
  s=f[:-4]; c=crisis(s); p=info[s][2]; sec=None; ctx=collections.defaultdict(list); hits=[]
  for ln,line in enumerate(open(D+'/dumps/'+f),1):
    t=line.strip(); m=re.match(r'^== (.+) ==$',t)
    if m: sec=m.group(1) if READER.match(t) else None; continue
    if not sec: continue
    g='screen' if sec.startswith('tab:') else sec
    for mm in CTX.finditer(t):
      x=mm.group(0).strip()
      if x not in ctx[g]: ctx[g].append(x)
    for sent in re.split(r'(?<=[.!?])\s+',t):
      for rx,h,fn in R:
        if rx.search(sent): hits.append((g,sec,ln,sent.lstrip('-* ').strip()[:300],h,fn(s,c,p))); break
  seen=set()
  for g,sec,ln,sent,h,cl in hits:
    key=(g,re.sub(r'\*','',sent))
    if key in seen: continue
    seen.add(key)
    rows.append(dict(seed=s,name=info[s][1],printed=p,standing=info[s][3],surface=g,tab=sec,ln=ln,sentence=sent,home=h,cls=cl,contradicts=' / '.join(ctx[g][:4]) if not cl.startswith('TRUE') else ''))
json.dump(rows,open(D+'/classified.json','w'),ensure_ascii=False,indent=0)
cnt=collections.Counter(r['cls'] for r in rows); print(cnt)
by=collections.Counter((r['cls'],r['home'].split(' :: ')[-1][:70]) for r in rows)
for (cl,h),n in sorted(by.items()): print(cl,n,h)
