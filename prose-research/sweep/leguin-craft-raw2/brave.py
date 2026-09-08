import sys,re,html,urllib.parse,subprocess,time
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
def get(url):
    r=subprocess.run(['curl','-sL','--max-time','30','-A',UA,'-H','Accept-Language: en-US,en;q=0.9',url],capture_output=True)
    return r.stdout.decode('utf-8','ignore')
skip=('brave.com','bravesoftware','wikipedia.org','amazon.com','goodreads.com','youtube.com','facebook.com','twitter.com','x.com','instagram.com','apple.com','google.com','archive.org')
for q in sys.argv[1:]:
    s=get('https://search.brave.com/search?q='+urllib.parse.quote(q)+'&source=web')
    print('\n### QUERY:',q,'| bytes',len(s))
    seen=[]; 
    for m in re.finditer(r'<a href="(https?://[^"]+)"[^>]*>(.*?)</a>',s,re.S):
        u=m.group(1)
        if any(k in u for k in skip): continue
        if u in seen: continue
        title=html.unescape(re.sub(r'<[^>]+>',' ',m.group(2))); title=re.sub(r'\s+',' ',title).strip()
        seen.append(u); print(f'- {title[:100]} | {u}')
        if len(seen)>=14: break
    time.sleep(2.5)
