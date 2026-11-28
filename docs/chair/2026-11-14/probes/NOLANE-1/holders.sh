#!/bin/sh
# usage: holders.sh file...   prints, per file, each of the nine lanes whose tip differs from integration's base for it
L="coherence-upkeep-2026-11-12 powers-follow-up-2026-11-13 r2-code-a-2026-11-13 r2-code-b-2026-11-13 r3-code-c-2026-11-13 r3-tabs-2026-11-13 w2-c-leaves-2026-11-13 w2-fix-data-2026-11-13 w2-write-2026-11-13"
for f in "$@"; do
  out=""
  for l in $L; do
    mb=$(git merge-base origin/lane/integration-2026-11-07 origin/lane/$l)
    n=$(git diff -U0 $mb origin/lane/$l -- "$f" | grep -c '^@@')
    [ "$n" -gt 0 ] && out="$out ${l%%-2026*}($n)"
  done
  j=$(git diff -U0 origin/lane/integration-2026-11-07 origin/lane/join-2026-11-14 -- "$f" | grep -c '^@@')
  echo "$f :: join-vs-int($j) ::${out:- none}"
done
