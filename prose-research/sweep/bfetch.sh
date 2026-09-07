#!/bin/sh
# usage: bfetch.sh <url> <outbase>
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
curl -sL --compressed -A "$UA" -H "Accept: text/html,application/xhtml+xml" "$1" -o "$2.html" -w "HTTP %{http_code} bytes %{size_download} -> $2.html\n"
python3 - "$2" <<'PY'
import sys,re,html
b=sys.argv[1]
t=open(b+".html",encoding="utf-8",errors="replace").read()
t=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',t)
t=re.sub(r'(?is)<br[^>]*>','\n',t)
t=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n+','\n\n',t)
open(b+".txt","w",encoding="utf-8").write(t)
print("TEXT chars",len(t))
PY
