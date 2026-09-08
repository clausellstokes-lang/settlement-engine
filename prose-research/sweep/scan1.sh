#!/bin/sh
url="$1"
n=$(echo "$url" | sed 's|https://www.legalgenealogist.com/||; s|/|_|g')
curl -s -L --compressed -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" "$url" -o "lgscan/$n.html"
if grep -qiE "chatgpt|artificial intelligence|generative ai|large language" "lgscan/$n.html"; then echo "HIT $url"; fi
