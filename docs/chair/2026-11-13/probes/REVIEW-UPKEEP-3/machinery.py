# Item 4: search every surface of every render for the defence machinery: a part's label or source, a rule line,
# a point/sum/share/weight/limit word, a slider's name. usage: python3 machinery.py <dir> <labels.json>
import sys,os,re,json,collections
D=sys.argv[1]; labels=[l for l in json.load(open(sys.argv[2])) if len(l)>=8 and l not in ('Garrison','Militia','Hired company','Terrain','Defences going unmended')]
GENERIC=[r'\bpoints?\b(?! of (the )?(compass|entry|view|contact|order|honour|light))',r'\bweights?\b',r'\bshare of (the )?(pay|purse|score)',r'\blimit [12]\b',r'\bR1[0-9]\b',r'\bdial\b',r'\bslider',r'priority(Military|Magic|Economy|Religion|Crime)',r'militaryPriority|magicPriority',r'readiness score',r'\bscore\b',r'/100\b',r'Score avg',r'\bsum of\b',r'paid at the standing',r'standing label',r'neighbour factor',r'fundedGate|keepOf|boughtShare']
pats=[('LABEL:'+l,re.compile(re.escape(l))) for l in labels]+[('GEN:'+g,re.compile(g)) for g in GENERIC]
hits=collections.defaultdict(lambda:collections.defaultdict(set)); ex={}
for f in sorted(os.listdir(D)):
    cur=None
    for l in open(os.path.join(D,f)):
        m=re.match(r'^== (.*) ==$',l.rstrip('\n'))
        if m: cur=m.group(1); continue
        for k,p in pats:
            if p.search(l):
                hits[k][cur].add(f[:-4]); ex.setdefault((k,cur),l.strip()[:200])
for k in sorted(hits):
    for v,ss in sorted(hits[k].items()): print(f'{k[:60]:60s} {v:22s} {len(ss):5d}  e.g. {ex[(k,v)][:150]}')
