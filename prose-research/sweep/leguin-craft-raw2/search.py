import sys,re,html,urllib.parse,subprocess,json
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url):
    r=subprocess.run(['curl','-sL','--max-time','25','-A',UA,url],capture_output=True)
    return r.stdout.decode('utf-8','ignore')
def ddg(q):
    s=get('https://html.duckduckgo.com/html/?q='+urllib.parse.quote(q))
    out=[]
    for m in re.finditer(r'<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>(.*?)</a>',s,re.S):
        u=m.group(1)
        mm=re.search(r'uddg=([^&]+)',u)
        if mm: u=urllib.parse.unquote(mm.group(1))
        out.append((html.unescape(re.sub('<[^>]+>','',m.group(2))).strip(),u))
    return out
def bing(q):
    s=get('https://www.bing.com/search?q='+urllib.parse.quote(q)+'&setlang=en')
    out=[]
    for m in re.finditer(r'<li class="b_algo".*?<h2><a href="([^"]+)"[^>]*>(.*?)</a>',s,re.S):
        out.append((html.unescape(re.sub('<[^>]+>','',m.group(2))).strip(),m.group(1)))
    return out
for q in sys.argv[1:]:
    print('\n### QUERY:',q)
    seen=set()
    for name,fn in (('ddg',ddg),('bing',bing)):
        try: res=fn(q)
        except Exception as e: res=[]; print(name,'ERR',e)
        for t,u in res[:12]:
            if u in seen: continue
            seen.add(u); print(f'[{name}] {t[:90]} | {u}')
