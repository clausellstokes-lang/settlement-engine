import re,sys,html
t=open(sys.argv[1],encoding="utf-8",errors="ignore").read()
seen=set()
for m in re.finditer(r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>',t,re.S|re.I):
    u=html.unescape(m.group(1)); txt=re.sub(r'\s+',' ',re.sub('<[^>]+>','',html.unescape(m.group(2)))).strip()
    if u in seen or 'brave.com' in u or 'hackerone' in u or len(txt)<10: continue
    seen.add(u); print(' -',txt[:110],'|',u)
