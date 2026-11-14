#!/bin/sh
# usage: holders.sh <file>... : which active lanes' copies differ from the line's, and whether the lane changed the file since its merge base
S=<scratchpad>
cd /home/user/settlement-engine
LINE=origin/lane/integration-2026-11-07
for f in "$@"; do
  lb=$(git rev-parse -q --verify "$LINE:$f" 2>/dev/null || echo none); me=$(git rev-parse -q --verify "origin/lane/w2-c-leaves-2026-11-13:$f" 2>/dev/null || echo none)
  echo "== $f  line=$(echo $lb|cut -c1-8) this-lane=$(echo $me|cut -c1-8)"
  for l in $(cat $S/active.txt); do
    b=$(git rev-parse -q --verify "origin/$l:$f" 2>/dev/null || echo none)
    [ "$b" = "$lb" ] && continue
    mb=$(git merge-base $LINE origin/$l 2>/dev/null); mbb=$( [ -n "$mb" ] && (git rev-parse -q --verify "$mb:$f" 2>/dev/null || echo none) || echo nomb)
    if [ "$b" = "$me" ]; then tag="= this lane's copy"; elif [ "$mbb" = "$b" ]; then tag="unchanged since merge-base (stale)"; else tag="CHANGED by the lane"; fi
    echo "   $l $(echo $b|cut -c1-8): $tag"
  done
done
