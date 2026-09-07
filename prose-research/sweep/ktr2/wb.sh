#!/bin/zsh
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
N=$1; TS=$2; U=$3
curl -sL --max-time 90 -A "$UA" --compressed "https://web.archive.org/web/${TS}id_/${U}" -o "$N.html" -w "$N %{http_code} %{size_download}\n"
python3 - "$N" <<'PY'
import re,html,sys
n=sys.argv[1]
t=open(n+'.html',encoding='utf8',errors='replace').read()
t=re.sub(r'<script.*?</script>','',t,flags=re.S); t=re.sub(r'<style.*?</style>','',t,flags=re.S)
x=html.unescape(re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',t)))
open(n+'.txt','w').write(x); print('  txt',len(x))
PY
