import json, urllib.request, urllib.parse, re, sys
html_file, vid = sys.argv[1], sys.argv[2]
t=open(html_file,encoding='utf8',errors='replace').read()
p=re.search(r'"getTranscriptEndpoint":\{"params":"([^"]+)"',t).group(1)
p=urllib.parse.unquote(p)
cv=re.search(r'"INNERTUBE_CLIENT_VERSION":"([^"]+)"',t)
key=re.search(r'"INNERTUBE_API_KEY":"([^"]+)"',t)
cv=cv.group(1) if cv else "2.20240726.00.00"
key=key.group(1) if key else "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"
body={"context":{"client":{"clientName":"WEB","clientVersion":cv,"hl":"en","gl":"US"}},"params":p}
req=urllib.request.Request("https://www.youtube.com/youtubei/v1/get_transcript?key="+key,
 data=json.dumps(body).encode(),
 headers={"Content-Type":"application/json","User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36","Origin":"https://www.youtube.com","Referer":"https://www.youtube.com/watch?v="+vid,"X-Youtube-Client-Name":"1","X-Youtube-Client-Version":cv})
try:
    d=urllib.request.urlopen(req,timeout=60).read().decode()
    open('tr_%s.json'%vid,'w').write(d); print('OK',len(d))
except Exception as e:
    print('ERR',e)
