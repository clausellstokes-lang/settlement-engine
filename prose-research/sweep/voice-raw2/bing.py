import sys, subprocess, re, html, urllib.parse
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15"
for q in sys.argv[1:]:
    url="https://www.bing.com/search?q="+urllib.parse.quote(q)+"&setlang=en&count=15"
    r=subprocess.run(["curl","-sL","--max-time","40","-A",UA,url],capture_output=True,text=True)
    h=r.stdout
    print(f"\n### {q}")
    seen=set()
    for m in re.finditer(r'<h2><a href="(http[^"]+)"[^>]*>(.*?)</a></h2>',h):
        u=html.unescape(m.group(1)); t=re.sub('<[^>]+>','',html.unescape(m.group(2)))
        if u in seen or 'bing.com' in u: continue
        seen.add(u); print(f"  - {t[:90]} :: {u}")
    if not seen: print("  (no results parsed; len html", len(h), ")")
