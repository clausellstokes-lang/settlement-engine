#!/bin/sh
# holders.sh <file...>: lanes (recent) whose copy differs from integration's AND that changed the file since their merge-base with integration
cd /home/user/settlement-engine
for f in "$@"; do
 for L in $(cat <scratchpad>/lanes-recent.txt); do
  case $L in lane/w2-c-leaves-2026-11-13) continue;; esac
  git rev-parse -q --verify origin/$L >/dev/null || continue
  if ! git diff --quiet origin/lane/integration-2026-11-07 origin/$L -- "$f" 2>/dev/null; then
    mb=$(git merge-base origin/lane/integration-2026-11-07 origin/$L 2>/dev/null)
    if [ -n "$mb" ]; then c=$(git rev-list --count --no-merges $mb..origin/$L -- "$f"); else c="?"; fi
    [ "$c" != "0" ] && echo "$f  $L  own-commits:$c"
  fi
 done
done
