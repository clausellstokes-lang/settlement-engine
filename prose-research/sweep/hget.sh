#!/bin/sh
# hget.sh <outbase> <url>   -> writes <outbase>.html and <outbase>.txt
OUT="$1"; URL="$2"
curl -sL --compressed -m 90 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" "$URL" -o "$OUT.html" -w "HTTP %{http_code} bytes %{size_download}\n"
python3 - "$OUT.html" "$OUT.txt" <<'PY'
import sys,re,html
p,o=sys.argv[1],sys.argv[2]
s=open(p,'rb').read().decode('utf-8','replace')
s=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<!--.*?-->',' ',s)
s=re.sub(r'(?i)</(p|div|li|h[1-6]|br|tr|blockquote)>','\n',s)
s=re.sub(r'(?i)<br\s*/?>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(o,'w').write(s.strip())
print("TXT chars",len(s))
PY
