#!/bin/zsh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
D="/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kaywork"
curl -sL --compressed -A "$UA" -H "Accept-Language: en-US,en;q=0.9" --max-time 60 "$1" -o "$D/$2.html"
python3 - "$D/$2.html" "$D/$2.txt" <<'PY'
import sys,re,html
raw=open(sys.argv[1],encoding='utf-8',errors='replace').read()
raw=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',raw)
raw=re.sub(r'(?is)<br\s*/?>','\n',raw)
raw=re.sub(r'(?is)</(p|div|li|h[1-6]|tr|blockquote)>','\n',raw)
txt=re.sub(r'(?s)<[^>]+>',' ',raw)
txt=html.unescape(txt)
txt=re.sub(r'[ \t\xa0]+',' ',txt)
txt=re.sub(r'\n\s*\n\s*\n+','\n\n',txt)
open(sys.argv[2],'w',encoding='utf-8').write(txt)
print(sys.argv[2].split('/')[-1], len(txt))
PY
