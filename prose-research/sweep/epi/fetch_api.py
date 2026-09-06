import json,urllib.request,urllib.parse,time,sys,os
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
base="https://public-api.wordpress.com/rest/v1.1/sites/elliottrwi.com/posts/"
out=[]
page=None
n=0
while True:
    q={"number":"100","fields":"ID,title,URL,date,content","tag":"hobb-reread","order_by":"date","order":"ASC"}
    if page: 
        for kv in page.split("&"):
            k,v=kv.split("=",1); q[k]=urllib.parse.unquote(v)
    url=base+"?"+urllib.parse.urlencode(q)
    req=urllib.request.Request(url,headers={"User-Agent":UA})
    with urllib.request.urlopen(req,timeout=60) as r:
        d=json.load(r)
    posts=d.get("posts",[])
    if not posts: break
    out.extend(posts); n+=len(posts)
    print("fetched",n,"found",d.get("found"),file=sys.stderr)
    nxt=d.get("meta",{}).get("links",{}).get("next_page") or d.get("meta",{}).get("next_page")
    if not nxt: break
    page=nxt
    time.sleep(0.4)
json.dump(out,open("reread_posts.json","w"))
print("total",len(out))
