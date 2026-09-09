#!/bin/sh
# $1 = name, $2 = url
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
curl -sL --max-time 60 -A "$UA" "$2" -o "$1.raw"
python3 - "$1" <<'PY'
import re,html,sys
n=sys.argv[1]
t=open(n+'.raw',encoding='utf-8',errors='replace').read()
t=re.sub(r'<script.*?</script>|<style.*?</style>|<!--.*?-->','',t,flags=re.S)
t=re.sub(r'<(br|/p|/div|/li|/h[1-6]|/tr)[^>]*>','\n',t)
t=re.sub(r'<[^>]+>',' ',t); t=html.unescape(t)
t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
open(n+'.txt','w').write(t)
print(n, len(t))
PY
