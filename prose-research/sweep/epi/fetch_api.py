import json,urllib.request,urllib.parse,time,sys
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
base="https://public-api.wordpress.com/rest/v1.1/sites/elliottrwi.com/posts/"
out=[];seen=set();handle=None
while True:
    q={"number":"100","fields":"ID,title,URL,date,content","tag":"hobb-reread","order_by":"date","order":"ASC"}
    if handle: q["page_handle"]=handle
    req=urllib.request.Request(base+"?"+urllib.parse.urlencode(q),headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=90) as r: d=json.load(r)
    posts=d.get("posts",[])
    new=[p for p in posts if p["ID"] not in seen]
    if not new: break
    for p in new: seen.add(p["ID"])
    out.extend(new)
    print("total",len(out),"found",d.get("found"),file=sys.stderr)
    handle=d.get("meta",{}).get("next_page")
    if not handle: break
    time.sleep(0.3)
json.dump(out,open("reread_posts.json","w"))
print("DONE",len(out))
