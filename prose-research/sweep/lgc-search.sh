#!/bin/zsh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/lgc
Q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote_plus(sys.argv[1]))" "$1")
curl -s --compressed -A "$UA" -m 30 "https://www.bing.com/search?q=$Q&count=30" -o $D/_s.html
python3 - <<'PY'
import re,html
s=open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/lgc/_s.html",encoding='utf-8',errors='replace').read()
out=[];seen=set()
for m in re.finditer(r'<h2><a[^>]+href="([^"]+)"[^>]*>(.*?)</a></h2>',s,re.S):
    u=m.group(1); t=re.sub('<[^>]+>','',m.group(2)); t=html.unescape(t).strip()
    if u.startswith('http') and u not in seen and 'bing.com' not in u:
        seen.add(u); out.append((u,t))
for u,t in out[:25]: print(u[:120],'|',t[:95])
print("(",len(out),"results )")
PY
