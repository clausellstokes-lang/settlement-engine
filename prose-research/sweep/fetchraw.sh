#!/bin/zsh
# usage: fetchraw.sh <url> <outfile>
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
curl -sL --compressed -A "$UA" -H "Accept-Language: en-US,en;q=0.9" --max-time 60 "$1" -o "$2.html"
python3 - "$2.html" "$2.txt" <<'PY'
import sys,re,html
raw=open(sys.argv[1],encoding='utf-8',errors='replace').read()
raw=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',raw)
raw=re.sub(r'(?i)<br\s*/?>','\n',raw)
raw=re.sub(r'(?i)</(p|div|li|h1|h2|h3|h4|blockquote|tr)>','\n\n',raw)
raw=re.sub(r'(?s)<[^>]+>',' ',raw)
raw=html.unescape(raw)
raw=re.sub(r'[ \t\xa0]+',' ',raw)
raw=re.sub(r'\n\s*\n\s*\n+','\n\n',raw)
open(sys.argv[2],'w',encoding='utf-8').write(raw.strip())
print(sys.argv[2], len(raw))
PY
