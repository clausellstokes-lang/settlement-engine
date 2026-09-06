#!/bin/zsh
# usage: fetch.sh <url> <outname>
U="$1"; N="$2"
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/raw
mkdir -p "$D"
curl -sL --compressed -m 60 -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" "$U" -o "$D/$N.html"
python3 - "$D/$N.html" "$D/$N.txt" <<'PY'
import sys,re,html
src,dst=sys.argv[1],sys.argv[2]
s=open(src,encoding='utf-8',errors='replace').read()
s=re.sub(r'(?is)<(script|style|noscript|svg|head)[^>]*>.*?</\1>',' ',s)
s=re.sub(r'(?is)<br[^>]*>','\n',s)
s=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',s)
s=re.sub(r'(?s)<[^>]+>',' ',s)
s=html.unescape(s)
s=re.sub(r'[ \t\xa0]+',' ',s)
s=re.sub(r'\n\s*\n+','\n\n',s)
open(dst,'w',encoding='utf-8').write(s.strip())
print(dst, len(s))
PY
