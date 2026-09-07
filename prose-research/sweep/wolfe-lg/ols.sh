#!/bin/sh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126.0 Safari/537.36"
Q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$2")
curl -sL --compressed -A "$UA" -m 90 "https://openlibrary.org/search/inside?q=$Q" -o "$1.html" -w "%{http_code}\n" >/dev/null
python3 - "$1" <<'PY'
import sys,re,html
n=sys.argv[1]
s=open(n+'.html',encoding='utf-8',errors='replace').read()
blocks=re.split(r'(?i)<div class="sri__main"', s)
def cl(x):
    x=re.sub(r'(?s)<[^>]+>',' ',x); x=html.unescape(x); return ' '.join(x.split())
tot=re.search(r'About ([\d,]+) results',s)
print('TOTAL', tot.group(1) if tot else '?')
for b in blocks[1:]:
    t=re.search(r'(?is)<h3[^>]*>(.*?)</h3>',b); q=re.search(r'(?is)❝(.*?)❞',b)
    if q: print('-',(cl(t.group(1))[:70] if t else '?'),'||',cl(q.group(1))[:300])
PY
