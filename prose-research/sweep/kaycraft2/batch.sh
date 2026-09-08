#!/bin/zsh
while read -r name url; do
  [[ -z "$name" ]] && continue
  [[ -s "$name.txt" ]] && { echo "skip $name"; continue; }
  ./fetch.sh "$name" "$url" >/dev/null 2>&1
  echo "$name $(wc -c < $name.txt)"
done
