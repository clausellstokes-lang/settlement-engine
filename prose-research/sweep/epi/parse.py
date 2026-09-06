import json,re,html,sys
posts=json.load(open("reread_posts.json"))
def txt(h):
    h=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',h)
    h=re.sub(r'(?i)<br\s*/?>','\n',h)
    h=re.sub(r'(?i)</(p|div|li|h1|h2|h3|blockquote)>','\n\n',h)
    h=re.sub(r'(?s)<[^>]+>',' ',h)
    h=html.unescape(h)
    h=re.sub(r'[ \t\xa0]+',' ',h)
    h=re.sub(r'\n\s*\n\s*\n+','\n\n',h)
    return h.strip()
recs=[]
for p in posts:
    t=html.unescape(re.sub(r'<[^>]+>','',p["title"])).replace('\xa0',' ')
    m=re.search(r'Entry[ ,:]*(\d+)',t)
    n=int(m.group(1)) if m else None
    body=txt(p["content"])
    # book/chapter from title after entry number
    tail=t.split(':',1)[1] if ':' in t else t
    recs.append({"n":n,"title":t,"url":p["URL"],"date":p["date"][:10],"body":body})
recs.sort(key=lambda r:(r["n"] is None, r["n"] or 0))
json.dump(recs,open("recs.json","w"))
nums=[r["n"] for r in recs if r["n"]]
print("recs",len(recs),"numbered",len(nums),"min",min(nums),"max",max(nums))
missing=[i for i in range(1,max(nums)+1) if i not in set(nums)]
print("missing",missing)
# titles sample
for r in recs[:3]+recs[-2:]: print(r["n"],"|",r["title"],"|",len(r["body"]))
