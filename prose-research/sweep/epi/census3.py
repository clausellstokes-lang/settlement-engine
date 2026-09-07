import json,re,collections
rows=json.load(open("all.json"))
D={r["n"]:r for r in rows if r["n"] is not None}
TGT=[n for n in sorted(D) if 1<=n<=100 or 221<=n<=314 or 390<=n<=509]
BOOKS=[(1,24,"Assassin's Apprentice"),(25,58,"Royal Assassin"),(59,100,"Assassin's Quest"),
       (221,249,"Fool's Errand"),(250,277,"Golden Fool"),(278,314,"Fool's Fate"),
       (390,422,"Fool's Assassin"),(423,458,"Fool's Quest"),(459,509,"Assassin's Fate")]
def book(n):
    for a,b,t in BOOKS:
        if a<=n<=b: return t
    return "?"
LEAD=[
 r'(?:^|(?<=\.\s))Following\s+(.{4,200}?),\s*[“"]',
 r'(?:^|(?<=\.\s))After\s+(.{4,200}?),\s*[“"]',
 r'(?:^|(?<=\.\s))Once\s+(.{4,200}?)\s+(?:concludes|ends|finishes),',
 r'(.{4,200}?)\s+(?:precedes|prefaces|prefigures|introduces|opens|heads)\s+[“"]',
 r'(.{4,200}?)\s+serves as (?:a|the) (?:prologue|preface|epigraph)',
 r'(?:is|are)\s+(?:introduced|prefaced|prefixed|headed|preceded|prefigured)\s+(?:with|by)\s+(.{4,200}?)[\.,;]',
 r'(?:opens?|opening|begins?|starts?)\s+with\s+(.{4,200}?)\s+(?:before|prior to)\b',
 r'(?:opens?|opening|begins?|starts?)\s+with\s+(.{4,200}?)[\.;]',
]
def clean(b):
    b=re.sub(r'(?i)read the (previous|next) entry in the series (here|soon)\s*\.?','',b).replace("\n"," ")
    b=re.sub(r'^\s*([A-Z]) ([a-z])',r'\1\2',b); return re.sub(r'\s+',' ',b).strip()
NARR=re.compile(r'^(?:the\s+)?(?:Fitz|Bee|Nettle|Chade|Molly|Burrich|Kettricken|Dutiful|Fool|Althea|Wintrow|Malta|Shun|Lant|Perseverance|Spark|Amber|Riddle|Starling|Hap|Nighteyes|Verity|Regal|Patience|Kettle|Thick|Brashen|Capra|arrival|return|shift|chapter)\b',re.I)
res=[]
for n in TGT:
    b=clean(D[n]["body"])[:3000]
    cands=[]
    for i,p in enumerate(LEAD):
        m=re.search(p,b)
        if m:
            g=m.group(1).strip()
            if i==3: g=re.split(r'(?:^|\.\s)',g)[-1].strip()
            cands.append((i,g))
    pick=None;pi=None
    for i,g in cands:
        if not NARR.match(g): pick=g;pi=i;break
    if pick is None and cands: pick=cands[0][1];pi=cands[0][0]
    res.append({"n":n,"book":book(n),"url":D[n]["url"],"date":D[n]["date"],"desc":pick or "","pat":pi})
json.dump(res,open("census_raw.json","w"))
KIND=[
 ("letter", r'\bletter|missive|correspondence|\bmessage from|\breply from'),
 ("journal/diary", r'\bjournals?\b|\bdiary'),
 ("song/verse", r'\bsongs?\b|\bverses?\b|\bstanzas?\b|\bballad|\bminstrel|\bpoem|\brhyme|Birdsong'),
 ("prophecy/dream record", r'\bprophec|\bdream|\bvision'),
 ("riddle", r'\briddle'),
 ("treatise", r'\btreatise'),
 ("scroll", r'\bscroll'),
 ("translation", r'\btranslat'),
 ("tale/story/legend/creation narrative", r'\btales?\b|\bstory\b|\bstories\b|\blegend|\bmyth\b|creation narrative|\bvignette'),
 ("report/account/testimony", r'\breport|\baccount\b|\bdispatch|\btestimony|\bcomplaint'),
 ("encyclopedia/reference entry", r'\bencyclopedia|reference (?:text|work)|\bglossar'),
 ("recipe", r'\brecipe'),
 ("history/annal/chronicle", r'\bhistor|\bannal|\bchronicle'),
 ("instruction/directive/pedagogy", r'\bpedagog|\binstruction|\bteaching|\bdirective|\badmonish|\bcorrective'),
 ("proverb/saying", r'\bfolk sayings?|\bproverb|\bsaying'),
 ("commentary/musing/note (form unnamed)", r'\bcommentar|\brumination|\bmusing|\breflection|\bnotes?\b|\bgloss|\bdiscussion|\bdiscourse|\bpassage|\bblurb|\bcomments?\b|\bstatement|\bexcerpt|\bpiece\b|\bdescription|\bassessment|\boverview|\bsummar|\bmeditation|\bobservation|\banecdote|\bwritings?\b|\bremark|\btext\b|\bdocument|\bselection|\bwords\b|\brecollection|\breminiscen|\bconsideration'),
]
c=collections.Counter();bybook=collections.defaultdict(collections.Counter);asg={}
for r in res:
    d=r["desc"]
    if not d: k="[no opening description extracted]"
    else:
        k=None
        for name,pat in KIND:
            if re.search(pat,d,re.I): k=name;break
        if k is None: k="[narrative action, no document named]" if NARR.match(d) else "[other/unclassified]"
    asg[str(r["n"])]=k;c[k]+=1;bybook[r["book"]][k]+=1
json.dump(asg,open("assigned.json","w"))
for k,v in c.most_common(): print(v,k)
print()
for a,b,t in BOOKS:
    tot=sum(bybook[t].values()); print(t,tot,dict(bybook[t].most_common(7)))
