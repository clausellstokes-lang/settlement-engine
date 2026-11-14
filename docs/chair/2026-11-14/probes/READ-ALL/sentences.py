# The whole-corpus inventory: every distinct SENTENCE the tabs print across the census towns (names, figures and number words folded),
# with the towns that print it. usage: python3 sentences.py <census out-dir> <out.json> ; prints the scale.
import io,re,collections,glob,os,json,gzip,sys
out=sys.argv[1]
rec={}
for l in gzip.open(out+'/corpus.ndjson.gz','rt',encoding='utf-8'):
    o=json.loads(l); rec[o['seed']]=o['s']
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
def fold(t):
    t=re.sub(r'\d[\d,.]*','#',t)
    t=numw.sub('#',t)
    return re.sub(r'\s+',' ',t).strip()
TABS=('World','Systems','Summary','Table','Notes')
sent=collections.defaultdict(lambda: collections.defaultdict(set))   # section -> sentence -> seeds
for f in glob.glob(out+'/dumps/*.txt'):
    seed=os.path.basename(f)[:-4]; s=rec.get(seed,{})
    ns=names_of(s)
    pat=re.compile('|'.join(re.escape(n) for n in ns)) if ns else None
    cur=None
    for line in io.open(f,encoding='utf-8'):
        line=line.rstrip('\n')
        if line.startswith('== '): cur=line.strip('= ').strip(); continue
        if not line or line.startswith('[STYLE]') or not cur: continue
        if cur.split('/')[0] not in TABS: continue
        t=pat.sub('<N>',line) if pat else line
        for part in SPLIT.split(t):
            part=fold(part)
            if part: sent[cur][part].add(seed)
allS=collections.defaultdict(set); where=collections.defaultdict(set)
for sec,v in sent.items():
    for t,ss in v.items(): allS[t]|=ss; where[t].add(sec)
n=len(allS); w=sum(len(t.split()) for t in allS)
print('TABS distinct sentences',n,'words',w,'once',sum(1 for x in allS.values() if len(x)==1),'words-once',sum(len(t.split()) for t,x in allS.items() if len(x)==1))
for sec,v in sorted(sent.items(),key=lambda kv:-sum(len(t.split()) for t in kv[1])):
    print('  %-28s distinct %6d once %6d words %7d' % (sec,len(v),sum(1 for x in v.values() if len(x)==1),sum(len(t.split()) for t in v)))
json.dump({'sentences':{t:{'towns':sorted(ss),'sections':sorted(where[t])} for t,ss in allS.items()}},io.open(sys.argv[2],'w',encoding='utf-8'),ensure_ascii=False)
