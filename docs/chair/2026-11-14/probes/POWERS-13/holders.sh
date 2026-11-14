#!/bin/sh
# holders.sh <file>...: a lane (tip on/after 2026-11-13) HOLDS a file when it carries a non-merge commit touching it that is
# neither on the line nor on this lane, AND its copy differs from the line's and from this lane's.
cd /home/user/p13
L=origin/lane/integration-2026-11-07; P=origin/lane/powers-follow-up-2026-11-13
for b in $(git for-each-ref --format='%(refname:short) %(committerdate:short)' refs/remotes/origin/lane/ | awk '$2>="2026-11-13"{print $1}'); do
  case $b in $P|$L) continue;; esac
  for f in "$@"; do
    git diff --quiet $L $b -- "$f" 2>/dev/null && continue
    git diff --quiet $P $b -- "$f" 2>/dev/null && continue
    c=$(git log --no-merges --format=%h $b ^$L ^$P -- "$f" 2>/dev/null | wc -l)
    [ "$c" -gt 0 ] && echo "HOLDER $b $f ($c own commits)" || echo "stale-copy $b $f"
  done
done
