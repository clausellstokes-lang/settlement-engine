#!/bin/zsh
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1")
curl -s --max-time 45 -A "$UA" "https://www.mojeek.com/search?q=$q" | python3 -c "
import sys,re,html
t=sys.stdin.read()
for m in re.finditer(r'<a class=\"ob\" href=\"([^\"]+)\"[^>]*>(.*?)</a>',t,re.S):
    print(html.unescape(m.group(1)),'||',re.sub(r'<[^>]+>','',html.unescape(m.group(2))).strip())
"
