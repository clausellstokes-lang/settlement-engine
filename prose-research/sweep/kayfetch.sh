#!/bin/zsh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
url="$1"; out="$2"
code=$(curl -sL --compressed -A "$UA" -H "Accept-Language: fr,en;q=0.8" -m 90 "$url" -o "$out.html" -w "%{http_code}")
echo "$code $url -> $out.html"
python3 - "$out.html" "$out.txt" <<'EOF'
import re,html,sys
t=open(sys.argv[1],encoding='utf-8',errors='replace').read()
t=re.sub(r'(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>',' ',t)
t=re.sub(r'(?i)<br\s*/?>','\n',t)
t=re.sub(r'(?i)</(p|div|h1|h2|h3|h4|li|blockquote)>','\n\n',t)
t=re.sub(r'(?s)<[^>]+>',' ',t); t=html.unescape(t)
t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n\n',t)
open(sys.argv[2],'w').write(t); print("  chars:",len(t))
EOF
