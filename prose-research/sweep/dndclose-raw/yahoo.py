import re,html,urllib.parse,sys
t=open(sys.argv[1],encoding='utf-8',errors='ignore').read(); seen=set()
for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',t,re.S):
    u=html.unescape(m.group(1)); txt=re.sub(r'\s+',' ',re.sub('<[^>]+>','',html.unescape(m.group(2)))).strip()
    if 'RU=' in u: u=urllib.parse.unquote(u.split('RU=')[1].split('/RK=')[0])
    if u.startswith('http') and 'yahoo' not in u and 'yimg' not in u and u not in seen:
        seen.add(u); print(' -',txt[:80],'|',u)
