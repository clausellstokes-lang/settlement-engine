import re,sys,json,html,urllib.request,gzip,io
vid=sys.argv[1]
s=open('watch_%s.html'%vid,encoding='utf-8',errors='replace').read()
m=re.findall(r'"captionTracks":(\[.*?\])',s)
print("blocks",len(m),file=sys.stderr)
tracks=json.loads(m[0])
for t in tracks:
    print(t.get('languageCode'), t.get('kind'), t.get('name',{}).get('simpleText') or t.get('name',{}).get('runs'), file=sys.stderr)
url=tracks[0]['baseUrl'].encode().decode('unicode_escape')
print("URL",url[:150],file=sys.stderr)
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
for suffix in ["", "&fmt=json3"]:
    req=urllib.request.Request(url+suffix, headers={'User-Agent':UA,'Accept-Language':'en-US,en;q=0.9'})
    try:
        d=urllib.request.urlopen(req, timeout=40).read()
    except Exception as e:
        print("fetchfail",suffix,e,file=sys.stderr); continue
    print("len",suffix,len(d),file=sys.stderr)
    if not d: continue
    open('cap_%s%s.raw'%(vid,'j' if suffix else ''),'wb').write(d)
