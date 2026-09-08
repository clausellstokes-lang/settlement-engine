#!/bin/zsh
# usage: get.sh <name> <url>
D=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/dndplace
curl -sSL -m 60 --compressed -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" "$2" -o "$D/$1.html" -w "HTTP %{http_code} bytes %{size_download} final %{url_effective}\n"
python3 "$D/totext.py" "$D/$1.html" > "$D/$1.txt" 2>/dev/null
wc -c "$D/$1.txt"
