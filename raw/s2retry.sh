#!/bin/sh
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/raw
U='https://api.semanticscholar.org/graph/v1/paper/ef4bbee7b8993086ff7315388bece6038fa6241d?fields=title,abstract,year,venue,openAccessPdf,externalIds'
i=1
while [ $i -le 12 ]; do
  code=$(curl -sSL --compressed -A 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36' -o s2.json -w '%{http_code}' "$U")
  echo "attempt $i -> $code"
  if [ "$code" = "200" ]; then cat s2.json; exit 0; fi
  sleep 25
  i=$((i+1))
done
echo "EXHAUSTED"; cat s2.json
