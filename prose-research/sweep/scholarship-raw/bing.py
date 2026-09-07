import sys,re,html,urllib.parse,subprocess
q=sys.argv[1]
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
url="https://www.bing.com/search?setlang=en&count=15&q="+urllib.parse.quote(q)
s=subprocess.run(["curl","-sL","-A",UA,url],capture_output=True,text=True).stdout
seen=set()
for m in re.finditer(r'<h2[^>]*>\s*<a[^>]*href="(http[^"]+)"[^>]*>(.*?)</a>', s, re.S):
    u=m.group(1); t=re.sub(r'<[^>]+>','',html.unescape(m.group(2))).strip()
    if 'bing.com' in u or u in seen: continue
    seen.add(u); print(t[:100],' | ',u)
if not seen:
    # fallback: any cite/anchor
    for m in re.finditer(r'<a[^>]*href="(https?://[^"]+)"[^>]*h="ID=SERP', s):
        u=m.group(1)
        if 'bing.com' in u or u in seen: continue
        seen.add(u); print('?',' | ',u)
