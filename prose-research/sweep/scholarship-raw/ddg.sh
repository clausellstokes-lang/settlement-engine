#!/bin/zsh
# usage: ddg.sh "query"  -> prints title | url lines from DuckDuckGo HTML endpoint
q="$1"
enc=$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1]))' "$q")
curl -sL -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" "https://html.duckduckgo.com/html/?q=$enc" \
 | python3 -c '
import sys,re,html,urllib.parse
s=sys.stdin.read()
for m in re.finditer(r"<a rel=\"nofollow\" class=\"result__a\" href=\"([^\"]+)\"[^>]*>(.*?)</a>", s, re.S):
    u=m.group(1); t=re.sub(r"<[^>]+>","",m.group(2))
    if "uddg=" in u:
        u=urllib.parse.unquote(re.search(r"uddg=([^&]+)",u).group(1))
    print(html.unescape(t).strip()," | ",u)
'
