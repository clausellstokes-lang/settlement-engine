#!/bin/bash
M="$1"; shift
for t in "$@"; do
  n=$(rg -c "['\"\`]$t['\"\`]" "$M/src" 2>/dev/null | awk -F: '{a+=$2} END{print a+0}')
  echo "$t quoted-in-src=$n"
done
