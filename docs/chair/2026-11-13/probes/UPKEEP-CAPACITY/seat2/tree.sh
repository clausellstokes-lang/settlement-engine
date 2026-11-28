#!/bin/sh
# tree.sh <sha>: archive a committed sha into trees/<sha>, node_modules symlinked; integrity counted
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
D=$S/trees/$1
[ -d "$D" ] && { echo "$D"; exit 0; }
mkdir -p "$D" && cd $S/wt && git archive "$1" | tar -x -C "$D" && ln -s $S/wt/node_modules "$D/node_modules"
n1=$(git ls-tree -r "$1" | grep -v '^160000' | wc -l); n2=$(find "$D" -path "$D/node_modules" -prune -o -type f -print -o -type l -print | grep -v "^$D/node_modules$" | wc -l)
echo "$D files $n1 / $n2" >&2
echo "$D"
