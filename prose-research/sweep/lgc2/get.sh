#!/bin/sh
# usage: get.sh <name> <url>
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/lgc2
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
curl -sSL --compressed -m 60 -A "$UA" -H 'Accept: text/html,application/xhtml+xml' "$2" -o "$D/$1.html" -w "%{http_code} %{url_effective}\n"
python3 - "$D/$1.html" "$D/$1.txt" <<'PY'
import sys,re,html
p,o=sys.argv[1],sys.argv[2]
s=open(p,'rb').read().decode('utf-8','replace')
s=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br[^>]*>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
open(o,'w').write(s.strip())
print(o, len(s))
PY
