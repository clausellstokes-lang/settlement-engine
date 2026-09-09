#!/bin/zsh
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1")
curl -s --max-time 45 -A "$UA" "https://html.duckduckgo.com/html/?q=$q" | python3 -c "
import sys,re,html,urllib.parse
t=sys.stdin.read()
for m in re.finditer(r'class=\"result__a\"[^>]*href=\"([^\"]+)\"[^>]*>(.*?)</a>',t,re.S):
    u=html.unescape(m.group(1)); ti=re.sub(r'<[^>]+>','',m.group(2)); ti=html.unescape(ti)
    if 'uddg=' in u:
        u=urllib.parse.unquote(u.split('uddg=')[1].split('&')[0])
    print(u,'||',ti.strip())
"
