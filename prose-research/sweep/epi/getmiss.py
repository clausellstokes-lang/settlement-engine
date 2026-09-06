import json,urllib.request,urllib.parse,re,html
UA="Mozilla/5.0"
def search(q):
    u="https://public-api.wordpress.com/rest/v1.1/sites/elliottrwi.com/posts/?"+urllib.parse.urlencode({"search":q,"number":"10","fields":"ID,title,URL,date,content"})
    r=urllib.request.Request(u,headers={"User-Agent":UA})
    return json.load(urllib.request.urlopen(r,timeout=60)).get("posts",[])
found={}
for n in [126,127,136,229,291]:
    for p in search("Rereading Series Entry %d"%n):
        t=html.unescape(re.sub(r'<[^>]+>','',p["title"])).replace('\xa0',' ')
        m=re.search(r'Entry[ ,:]*(\d+)',t)
        if m and int(m.group(1))==n and n not in found:
            found[n]=p; print(n,"OK",p["URL"])
json.dump(list(found.values()),open("missing_posts.json","w"))
print("got",sorted(found))
