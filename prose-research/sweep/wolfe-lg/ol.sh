#!/bin/sh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"
Q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$2")
curl -sL --compressed -A "$UA" -m 90 "https://openlibrary.org/search/inside?q=$Q" -o "$1.html" -w "%{http_code} %{size_download}\n"
python3 - "$1" <<'PY'
import sys,re,html
n=sys.argv[1]
s=open(n+'.html',encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?s)<[^>]+>',' ',s); s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s); s=re.sub(r'\n\s*\n+','\n',s)
open(n+'.txt','w').write(s)
i=s.find('results found')
print(s[max(0,i-40):i+30])
# print blocks
for m in re.finditer(r'❝(.*?)❞', s, re.S):
    print('QUOTE:', ' '.join(m.group(1).split()))
PY
