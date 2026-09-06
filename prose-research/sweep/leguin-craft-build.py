import json,os,re,sys,unicodedata
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
RAW=os.path.join(BASE,"raw")
def norm(s):
    s=unicodedata.normalize("NFKC",s)
    s=s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"')
    s=s.replace("—","--").replace("–","-").replace("…","...")
    return re.sub(r"\s+"," ",s).lower().strip()
CACHE={}
def text(f):
    if f not in CACHE:
        p=os.path.join(RAW,f)
        if not os.path.exists(p): p=os.path.join(BASE,f)
        CACHE[f]=norm(open(p,encoding='utf-8',errors='replace').read())
    return CACHE[f]
src=json.load(open(os.path.join(BASE,"leguin-craft-draft.json")))
bad=[]
claims=[]
for i,c in enumerate(src["claims"]):
    c=dict(c); f=c.pop("_file",None); q=c.get("quote","")
    if q:
        if len(q.split())>12: bad.append((i,"TOO LONG",q))
        elif not f or norm(q) not in text(f): bad.append((i,"NOT FOUND",f,q))
    claims.append(c)
for b in bad: print("PROBLEM",b)
if bad: sys.exit(1)
out={"complete":src.get("complete",False),"coverage":src["coverage"],"sourcesRead":src["sourcesRead"],"claims":claims}
json.dump(out,open(os.path.join(BASE,"found-leguin-craft.json"),"w"),indent=1,ensure_ascii=False)
print("OK claims=",len(claims),"sources=",len(out["sourcesRead"]),"complete=",out["complete"])
