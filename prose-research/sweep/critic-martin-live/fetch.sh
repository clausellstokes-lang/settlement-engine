#!/bin/bash
# $1 = url, $2 = out file base
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
code=$(curl -sL -A "$UA" --max-time 25 -o "$2.html" -w "%{http_code}" "$1" 2>/dev/null)
echo "$code" > "$2.code"
