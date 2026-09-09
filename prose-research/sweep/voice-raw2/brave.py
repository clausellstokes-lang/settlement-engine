import sys, subprocess, re, html, urllib.parse
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
for q in sys.argv[1:]:
    url="https://search.brave.com/search?q="+urllib.parse.quote(q)+"&source=web"
    r=subprocess.run(["curl","-sL","--max-time","40","-A",UA,"-H","Accept-Language: en-US,en;q=0.9",url],capture_output=True,text=True)
    h=r.stdout
    print(f"\n### {q}  (html {len(h)})")
    seen=[]
    for m in re.finditer(r'href="(https?://[^"]+)"',h):
        u=html.unescape(m.group(1))
        if any(x in u for x in ['brave.com','bravesoftware','w3.org','schema.org','google.com/recaptcha']): continue
        if u not in seen: seen.append(u)
    for u in seen[:12]: print("  -",u)
    if not seen: print("  (none)", h[:300].replace('\n',' '))
