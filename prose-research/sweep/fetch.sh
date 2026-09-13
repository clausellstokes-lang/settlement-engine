#!/bin/zsh
# usage: fetch.sh <url> <outname>
U="$1"; N="$2"
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/prose-research/sweep/raw
mkdir -p "$D"
curl -sSL --compressed -m 60 -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' "$U" -o "$D/$N.html"
python3 - "$D/$N.html" "$D/$N.txt" <<'PY'
import sys,re,html
src,dst=sys.argv[1],sys.argv[2]
t=open(src,encoding='utf-8',errors='replace').read()
t=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',t)
t=re.sub(r'(?is)<br\s*/?>','\n',t)
t=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t)
t=html.unescape(t)
t=re.sub(r'[ \t\xa0]+',' ',t)
t=re.sub(r'\n\s*\n\s*\n+','\n\n',t)
open(dst,'w',encoding='utf-8').write(t.strip())
print(dst, len(t))
PY
