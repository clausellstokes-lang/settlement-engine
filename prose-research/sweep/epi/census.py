import json,re,collections
rows=json.load(open("all.json"))
D={r["n"]:r for r in rows if r["n"] is not None}
TGT=[n for n in sorted(D) if 1<=n<=100 or 221<=n<=314 or 390<=n<=509]
def book(n):
    if 1<=n<=24: return "Assassin's Apprentice"
    if 25<=n<=58: return "Royal Assassin"
    if 59<=n<=100: return "Assassin's Quest"
    if 221<=n<=249: return "Fool's Errand"
    if 250<=n<=277: return "Golden Fool"
    if 278<=n<=314: return "Fool's Fate"
    if 390<=n<=422: return "Fool's Assassin"
    if 423<=n<=458: return "Fool's Quest"
    if 459<=n<=509: return "Assassin's Fate"
    return "?"
PATS=[
 (r'(?:opens?|opening|begins?|beginning|starts?|starting|open|begin)\s+with\s+(.{3,180}?)\s+(?:before|prior to)\b',1),
 (r'(?:Following|following)\s+(.{3,180}?),\s*[“"]',2),
 (r'(?:After|after)\s+(.{3,180}?),\s*[“"]',3),
 (r'(?:is|are)\s+(?:introduced|prefaced|prefixed|headed)\s+(?:with|by)\s+(.{3,180}?)[\.,;]',4),
 (r'(.{3,180}?)\s+prefaces\s+[“"]',5),
 (r'(.{3,180}?)\s+serves as a prologue',6),
 (r'(?:opens?|opening|begins?|starts?)\s+with\s+(.{3,180}?)[\.;]',7),
]
def clean(b):
    b=re.sub(r'(?i)read the (previous|next) entry in the series (here|soon)\s*\.?','',b)
    b=b.replace("\n"," ")
    b=re.sub(r'^\s*([A-Z]) ([a-z])',r'\1\2',b)
    b=re.sub(r'\s+',' ',b)
    return b
res=[]
for n in TGT:
    b=clean(D[n]["body"])[:2500]
    got=None;pi=None
    for p,idx in PATS:
        m=re.search(p,b)
        if m:
            got=m.group(1).strip(); pi=idx; break
    res.append({"n":n,"book":book(n),"url":D[n]["url"],"date":D[n]["date"],"desc":got or "","pat":pi})
json.dump(res,open("census_raw.json","w"))
print("rows",len(res),"nodesc",sum(1 for r in res if not r["desc"]))
with open("census_raw.txt","w") as f:
    for r in res: f.write("%d\t%s\tP%s\t%s\n"%(r["n"],r["book"],r["pat"],r["desc"][:160]))
