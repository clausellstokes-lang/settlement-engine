import json,os,re,sys,unicodedata
BASE="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep"
RAW=os.path.join(BASE,"raw")
def norm(s):
    s=unicodedata.normalize("NFKC",s)
    s=s.replace("’","'").replace("‘","'").replace("“",'"').replace("”",'"')
    s=s.replace("—","--").replace("–","-").replace("…","...")
    s=re.sub(r"\s+"," ",s)
    return s.lower().strip()
CACHE={}
def text(f):
    if f not in CACHE:
        p=os.path.join(RAW,f) if os.path.exists(os.path.join(RAW,f)) else os.path.join(BASE,f)
        CACHE[f]=norm(open(p,encoding='utf-8',errors='replace').read())
    return CACHE[f]
def check(claims):
    bad=[]
    for i,c in enumerate(claims):
        q=c.get("quote","")
        f=c.pop("_file",None)
        if not q: continue
        if len(q.split())>12: bad.append((i,"TOO LONG",q))
        elif norm(q) not in text(f): bad.append((i,"NOT FOUND in "+f,q))
    return bad
if __name__=="__main__":
    src=json.load(open(os.path.join(BASE,"claims-draft.json")))
    bad=check(src["claims"])
    for b in bad: print("BAD:",b)
    if bad: sys.exit(1)
    out={"complete":src.get("complete",False),"coverage":src["coverage"],"sourcesRead":src["sourcesRead"],"claims":src["claims"]}
    json.dump(out,open(os.path.join(BASE,"found-leguin-craft.json"),"w"),indent=1,ensure_ascii=False)
    print("OK claims:",len(src["claims"]),"sources:",len(src["sourcesRead"]))
