UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
cd "$(dirname "$0")"
for i in 1 2 3 4 5 6 7 8; do
  for v in jfhl1jnaAPY fIw6lHNEwcc; do
    if [ -s "good_$v.json" ]; then continue; fi
    U=$(cat capurl_$v.txt)
    code=$(curl -s --compressed -A "$UA" -H "Accept-Language: en-US,en;q=0.9" -H "Referer: https://www.youtube.com/watch?v=$v" "${U}&fmt=json3" -o try_$v.json -w "%{http_code}")
    echo "attempt $i $v -> $code $(wc -c < try_$v.json)"
    if [ "$code" = "200" ] && [ -s try_$v.json ]; then cp try_$v.json good_$v.json; fi
  done
  if [ -s good_jfhl1jnaAPY.json ] && [ -s good_fIw6lHNEwcc.json ]; then break; fi
  sleep 45
done
echo DONE
