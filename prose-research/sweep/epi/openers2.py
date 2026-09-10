import json,re
rows=json.load(open("all.json"))
PAT=re.compile(r'(?i)(opens? with|opening with|prefac|begins with|begin with|serves as a prologue|preface[sd]?\b|following (a|an|front matter|the)|after (a|an) )')
def clean(b):
    b=re.sub(r'(?i)read the (previous|next) entry in the series (here|soon)\s*\.?','',b)
    return b
def sents(b):
    # crude sentence split
    parts=re.split(r'(?<=[.!?”"])\s+',b.replace("\n"," "))
    return [p.strip() for p in parts if p.strip()]
out=[]
for r in rows:
    b=clean(r["body"])
    ss=sents(b)
    hit=""
    for s in ss[:14]:
        if PAT.search(s): hit=s; break
    out.append({"n":r["n"],"title":r["title"],"url":r["url"],"date":r["date"],"hit":hit,"first":" ".join(ss[:3])[:600]})
json.dump(out,open("openers2.json","w"))
tgt=[x for x in out if x["n"] is not None and (1<=x["n"]<=100 or 221<=x["n"]<=314 or 390<=x["n"]<=509)]
print("target",len(tgt),"withhit",sum(1 for x in tgt if x["hit"]))
with open("hits.txt","w") as f:
    for x in tgt: f.write("### %d\n%s\n\n"%(x["n"], x["hit"] or ("[NOHIT] "+x["first"])))
