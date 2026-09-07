import json, urllib.request, urllib.parse, re, sys
hf, vid = sys.argv[1], sys.argv[2]
t=open(hf,encoding='utf8',errors='replace').read()
p=urllib.parse.unquote(re.search(r'"getTranscriptEndpoint":\{"params":"([^"]+)"',t).group(1))
cv=re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"',t).group(1)
key=re.search(r'"INNERTUBE_API_KEY":"([^"]+)"',t).group(1)
vd=re.search(r'"visitorData":"([^"]+)"',t)
vd=urllib.parse.unquote(vd.group(1)) if vd else None
print('visitorData', (vd or '')[:20])
ctx={"client":{"clientName":"WEB","clientVersion":cv,"hl":"en","gl":"US","userAgent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36,gzip(gfe)"}}
if vd: ctx["client"]["visitorData"]=vd
body={"context":ctx,"params":p}
h={"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","Origin":"https://www.youtube.com","Referer":"https://www.youtube.com/watch?v="+vid,"X-Youtube-Client-Name":"1","X-Youtube-Client-Version":cv,"Accept-Language":"en-US,en;q=0.9"}
if vd: h["X-Goog-Visitor-Id"]=vd
req=urllib.request.Request("https://www.youtube.com/youtubei/v1/get_transcript?key="+key+"&prettyPrint=false", data=json.dumps(body).encode(), headers=h)
try:
    d=urllib.request.urlopen(req,timeout=60).read().decode()
    open('tr_%s.json'%vid,'w').write(d); print('OK',len(d))
except urllib.error.HTTPError as e:
    print('ERR',e.code, e.read().decode()[:400])
