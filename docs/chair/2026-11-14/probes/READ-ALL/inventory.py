#!/usr/bin/env python3
# READ-ALL: the inventory of a census run: every distinct sentence the tabs print (names, figures and number words folded,
# exactly as build_packets.py folds them), with the towns that print it.
# usage: inventory.py <census out-dir (corpus.ndjson.gz, dumps/)> <out.json>
import io,re,collections,os,json,gzip,sys
OUT,DEST=sys.argv[1],sys.argv[2]
TABS=('World','Systems','Summary','Table')
rec={}
for l in gzip.open(OUT+'/corpus.ndjson.gz','rt',encoding='utf-8'):
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
RUN=re.compile(r'(?<!\bMac)(?<!\bMc)(?<=[a-z\)])(?=[A-Z])')   # a pill run's seams; never inside a Mac- or Mc- surname (the first read's artifact)
def fold(t,pat):
    if pat: t=pat.sub('<N>',t)
    t=re.sub(r'\d[\d,.]*','#',t); t=numw.sub('#',t)
    return re.sub(r'\s+',' ',t).strip()
def parts_of(line):
    if len(RUN.findall(line))>=2: line=RUN.sub(' · ',line)
    return [p.strip() for p in SPLIT.split(line) if p and p.strip()]
inv=collections.defaultdict(set); ex={}
for seed,s in rec.items():
    ns=names_of(s); pat=re.compile('|'.join(re.escape(n) for n in ns)) if ns else None
    cur=None
    try: fh=io.open('%s/dumps/%s.txt'%(OUT,seed),encoding='utf-8')
    except OSError: continue
    for line in fh:
        line=line.rstrip('\n')
        if line.startswith('== '): cur=line.strip('= ').strip(); continue
        if not line or line.startswith('[STYLE]') or not cur or cur.split('/')[0] not in TABS: continue
        for p in parts_of(line):
            f=fold(p,pat)
            if f: inv[f].add(seed); ex.setdefault(f,(seed,cur,p))
json.dump({f:{'towns':sorted(ts),'example':ex[f]} for f,ts in inv.items()},io.open(DEST,'w',encoding='utf-8'),ensure_ascii=False)
print('towns',len(rec),'distinct sentences',len(inv))
