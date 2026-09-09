import sys,re,html,urllib.parse,subprocess,time
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url):
    r=subprocess.run(['curl','-sL','--max-time','30','-A',UA,'-H','Accept-Language: en-US,en;q=0.9',url],capture_output=True)
    return r.stdout.decode('utf-8','ignore')
skip=('brave.com','mojeek.com','yahoo.com','bing.com','duckduckgo','wikipedia.org','amazon.','goodreads.com','youtube.com','facebook.com','twitter.com','x.com/','instagram.com','apple.com','google.com','torproject','microsoft.com','yimg.com')
def links(s,n=12):
    out=[]
    for m in re.finditer(r'<a [^>]*href="(https?://[^"]+)"[^>]*>(.*?)</a>',s,re.S):
        u=html.unescape(m.group(1))
        if 'r.search.yahoo.com' in u:
            mm=re.search(r'/RU=([^/]+)/',u)
            if mm: u=urllib.parse.unquote(mm.group(1))
        if any(k in u for k in skip) or u in [x[1] for x in out]: continue
        t=re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',m.group(2)))).strip()
        if len(t)<8: continue
        out.append((t[:100],u))
        if len(out)>=n: break
    return out
engines={
 'mojeek': lambda q:'https://www.mojeek.com/search?q='+urllib.parse.quote(q),
 'yahoo':  lambda q:'https://search.yahoo.com/search?p='+urllib.parse.quote(q),
 'brave':  lambda q:'https://search.brave.com/search?q='+urllib.parse.quote(q)+'&source=web',
}
for q in sys.argv[1:]:
    print('\n### QUERY:',q,flush=True)
    for name,fn in engines.items():
        s=get(fn(q)); res=links(s)
        print(f'  [{name}] bytes={len(s)} results={len(res)}',flush=True)
        for t,u in res: print(f'  - {t} | {u}',flush=True)
        time.sleep(6)
    time.sleep(14)
