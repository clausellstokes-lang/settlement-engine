import json,re,html
recs=json.load(open("recs.json"))
def txt(h):
    h=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',h)
    h=re.sub(r'(?i)<br\s*/?>','\n',h)
    h=re.sub(r'(?i)</(p|div|li|h1|h2|h3|blockquote)>','\n\n',h)
    h=re.sub(r'(?s)<[^>]+>',' ',h); h=html.unescape(h)
    h=re.sub(r'[ \t\xa0]+',' ',h); h=re.sub(r'\n\s*\n\s*\n+','\n\n',h)
    return h.strip()
extra=json.load(open("missing_posts.json"))
d={r["n"]:r for r in recs if r["n"] is not None}
for p in extra:
    t=html.unescape(re.sub(r'<[^>]+>','',p["title"])).replace('\xa0',' ')
    n=int(re.search(r'Entry[ ,:]*(\d+)',t).group(1))
    d[n]={"n":n,"title":t,"url":p["URL"],"date":p["date"][:10],"body":txt(p["content"])}
json.dump([d[k] for k in sorted(d)],open("all.json","w"))

def opener(b):
    b=re.sub(r'(?i)read the (previous|next) entry in the series (here|soon)\s*\.?','',b)
    paras=[p.strip() for p in b.split("\n") if p.strip()]
    # drop short warning/nav lines
    out=[]
    for p in paras:
        if len(p)<160 and re.search(r'(?i)(content warning|discussion of|will need a|note that|CW\b)',p): continue
        out.append(p)
    if not out: return ""
    first=out[0]
    first=re.sub(r'^([A-Z]) ([a-z])',r'\1\2',first)
    return first
rows=[]
for n in sorted(d):
    r=d[n]
    rows.append({"n":n,"title":r["title"],"url":r["url"],"date":r["date"],"open":opener(r["body"])})
json.dump(rows,open("openers.json","w"))
tgt=[x for x in rows if 1<=x["n"]<=100 or 221<=x["n"]<=314 or 390<=x["n"]<=509]
print("target",len(tgt))
with open("openers-target.txt","w") as f:
    for x in tgt:
        f.write("### %d | %s\n%s\n\n"%(x["n"],x["title"],x["open"][:700]))
print("written")
