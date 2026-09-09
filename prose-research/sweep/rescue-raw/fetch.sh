#!/bin/zsh
# usage: fetch.sh <name> <url>
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
n="$1"; u="$2"
code=$(curl -sL --max-time 60 --compressed -A "$UA" -H 'Accept-Language: en-US,en;q=0.9' "$u" -o "$n.html" -w "%{http_code}")
sz=$(wc -c < "$n.html" | tr -d ' ')
python3 - "$n" <<'PY'
import sys,re,html
n=sys.argv[1]
t=open(n+'.html',encoding='utf-8',errors='replace').read()
t=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',t)
t=re.sub(r'(?is)<!--.*?-->',' ',t)
t=re.sub(r'(?i)<(br|/p|/div|/h[1-6]|/li|/tr)[^>]*>','\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n+','\n\n',t)
open(n+'.txt','w',encoding='utf-8').write(t.strip())
print(n, 'txtchars', len(t))
PY
echo "$n http=$code html=$sz"
