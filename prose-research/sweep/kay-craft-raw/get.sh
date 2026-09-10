#!/bin/zsh
# usage: get.sh <name> <url>
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/kay-craft-raw
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
code=$(curl -sL --max-time 45 -A "$UA" -H "Accept: text/html,application/xhtml+xml" "$2" -o "$D/$1.html" -w "%{http_code}")
sz=$(wc -c < "$D/$1.html" | tr -d ' ')
if [ "$code" = "200" ]; then python3 "$D/h2t.py" "$D/$1.html" > "$D/$1.txt" 2>/dev/null; tx=$(wc -c < "$D/$1.txt" | tr -d ' '); else tx=0; fi
echo "$1 http=$code html=$sz txt=$tx"
