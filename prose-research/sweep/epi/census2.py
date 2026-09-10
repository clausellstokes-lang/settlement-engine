import json,re,collections
rows=json.load(open("all.json"))
D={r["n"]:r for r in rows if r["n"] is not None}
TGT=[n for n in sorted(D) if 1<=n<=100 or 221<=n<=314 or 390<=n<=509]
def book(n):
    for a,b,t in [(1,24,"Assassin's Apprentice"),(25,58,"Royal Assassin"),(59,100,"Assassin's Quest"),
                  (221,249,"Fool's Errand"),(250,277,"Golden Fool"),(278,314,"Fool's Fate"),
                  (390,422,"Fool's Assassin"),(423,458,"Fool's Quest"),(459,509,"Assassin's Fate")]:
        if a<=n<=b: return t
    return "?"
LEAD=[
 r'(?:^|\.\s|\s)(?:Following|following)\s+(.{4,200}?),\s*[“"]',
 r'(?:^|\.\s|\s)(?:After|after)\s+(.{4,200}?),\s*[“"]',
 r'(?:^|\.\s|\s)(?:Once|once)\s+(.{4,200}?)\s+(?:concludes|ends|finishes),',
 r'(.{4,200}?)\s+(?:prefaces|preface|prefaced)\s+[“"]',
 r'(.{4,200}?)\s+serves as (?:a|the) prologue',
 r'(?:is|are)\s+(?:introduced|prefaced|prefixed|headed|preceded)\s+(?:with|by)\s+(.{4,200}?)[\.,;]',
 r'(?:opens?|opening|begins?|starts?)\s+with\s+(.{4,200}?)\s+(?:before|prior to)\b',
 r'(?:opens?|opening|begins?|starts?)\s+with\s+(.{4,200}?)[\.;]',
]
def clean(b):
    b=re.sub(r'(?i)read the (previous|next) entry in the series (here|soon)\s*\.?','',b)
    b=b.replace("\n"," ")
    b=re.sub(r'^\s*([A-Z]) ([a-z])',r'\1\2',b)
    return re.sub(r'\s+',' ',b)
NARR=re.compile(r'^(?:the\s+)?(?:Fitz|Bee|Nettle|Chade|Molly|Burrich|Kettricken|Dutiful|Fool|Althea|Wintrow|Malta|Shun|Lant|Perseverance|Spark|Amber|Riddle|Starling|Hap|Nighteyes|Verity|Regal|Patience|Kettle|Thick|arrival|return|shift)\b',re.I)
res=[]
for n in TGT:
    b=clean(D[n]["body"])[:3000]
    cands=[]
    for i,p in enumerate(LEAD):
        m=re.search(p,b)
        if m: cands.append((i,m.group(1).strip()))
    pick=None;pi=None
    # prefer a candidate that is NOT narrative
    for i,g in cands:
        if not NARR.match(g): pick=g;pi=i;break
    if pick is None and cands: pick=cands[0][1];pi=cands[0][0]
    res.append({"n":n,"book":book(n),"url":D[n]["url"],"date":D[n]["date"],"desc":pick or "","pat":pi})
json.dump(res,open("census_raw.json","w"))
print("rows",len(res),"nodesc",sum(1 for r in res if not r["desc"]))
