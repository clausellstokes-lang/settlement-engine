#!/bin/zsh
q="$1"
curl -s --compressed -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" -G "https://www.bing.com/search" --data-urlencode "q=$q" --data-urlencode "count=30" --max-time 60 | python3 -c "
import re,html,sys
t=sys.stdin.read()
seen=set()
for m in re.finditer(r'<h2><a href=\"(http[^\"]+)\"[^>]*>(.*?)</a>', t, re.S):
    u=html.unescape(m.group(1)); ti=html.unescape(re.sub(r'<[^>]+>','',m.group(2))).strip()
    if u in seen: continue
    seen.add(u); print('-',ti,'|',u)
"
