#!/bin/sh
# usage: get.sh <name> <url>
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/raw-wolfe-editors
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
curl -sSL --compressed -m 60 -A "$UA" -H 'Accept: text/html,application/xhtml+xml' -o "$D/$1.html" -w "%{http_code} %{url_effective}\n" "$2"
python3 - "$D/$1.html" "$D/$1.txt" <<'PY'
import sys,re,html
raw=open(sys.argv[1],'rb').read().decode('utf-8','replace')
raw=re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>',' ',raw)
raw=re.sub(r'(?is)<br\s*/?>','\n',raw)
raw=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',raw)
raw=re.sub(r'(?s)<[^>]+>',' ',raw)
raw=html.unescape(raw)
raw=re.sub(r'[ \t\xa0]+',' ',raw)
raw=re.sub(r'\n\s*\n+','\n',raw)
open(sys.argv[2],'w').write(raw)
print(sys.argv[2], len(raw))
PY
