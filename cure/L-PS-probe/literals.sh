#!/bin/bash
cd "$1"
shift
for w in "$@"; do
  echo "== '$w' literals:"
  grep -rnE "['\"]${w}['\"]" src | cut -c1-170 | head -6
done
