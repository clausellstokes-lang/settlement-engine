#!/bin/zsh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/lgc
mkdir -p $D
curl -sL --compressed -A "$UA" -H "Accept: text/html,application/xhtml+xml" -H "Accept-Language: en-US,en;q=0.9" --max-time 75 "$1" -o "$D/$2.html" -w "[$2] HTTP %{http_code} %{size_download}b\n"
python3 - "$D/$2.html" "$D/$2.txt" <<'PY'
import sys,re,html
p,o=sys.argv[1],sys.argv[2]
s=open(p,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br\s*/?>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote|dd|dt)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n\s*\n+','\n\n',s)
open(o,'w',encoding='utf-8').write(s.strip())
print("   chars",len(s))
PY
