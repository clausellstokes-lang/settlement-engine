#!/bin/sh
# f.sh <name> <url>
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
curl -sL --compressed -A "$UA" -m 60 "$2" -o "$1.html" -w "%{http_code} %{size_download} %{url_effective}\n"
python3 - "$1" <<'PY'
import sys,re,html
n=sys.argv[1]
try:
    s=open(n+'.html',encoding='utf-8',errors='replace').read()
except Exception as e:
    print('ERR',e); sys.exit()
s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|section|article)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(n+'.txt','w',encoding='utf-8').write(s)
print(n,'txt chars',len(s))
PY
