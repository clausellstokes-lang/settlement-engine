#!/bin/zsh
# usage: fetch.sh <name> <url>
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
curl -sL --compressed -A "$UA" -H "Accept-Language: en-US,en;q=0.9" --max-time 60 "$2" -o "$1.html"
python3 - "$1" <<'PY'
import sys,re,html
n=sys.argv[1]
s=open(n+'.html',encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br[^>]*>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(n+'.txt','w',encoding='utf-8').write(s.strip())
print(n, len(s))
PY
