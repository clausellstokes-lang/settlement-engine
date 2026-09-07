import re,sys,html
f,dom=sys.argv[1],sys.argv[2]
t=open(f,encoding="utf-8",errors="ignore").read()
seen=set()
for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',t,re.S|re.I):
    u=html.unescape(m.group(1)); txt=re.sub(r'\s+',' ',re.sub('<[^>]+>','',html.unescape(m.group(2)))).strip()
    if dom not in u or u in seen or len(txt)<10: continue
    if any(x in u for x in ['#comment','/feed','?share','replytocom','/author/','#respond']): continue
    seen.add(u); print(' -',txt[:100],'|',u)
