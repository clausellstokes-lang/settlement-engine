#!/bin/sh
# MEASURE-WORDING's holder scan. usage: sh holders.sh <worktree> <file>...
# Run `git fetch -q origin '+refs/heads/lane/*:refs/remotes/origin/lane/*'` first.
# For each origin/lane/* branch: the files named whose diff from the branch's merge-base with HEAD touches them,
# with the branch's last commit subject. Prints "HOLD <file> <branch> :: <subject>" and a COUNT line.
W=$1; shift
n=0; hits=0
for b in $(git -C "$W" for-each-ref --format='%(refname:short)' 'refs/remotes/origin/lane/'); do
  n=$((n+1))
  mb=$(git -C "$W" merge-base HEAD "$b" 2>/dev/null) || { echo "NOMB $b"; continue; }
  changed=$(git -C "$W" diff --name-only "$mb" "$b" -- "$@")
  [ -z "$changed" ] && continue
  subj=$(git -C "$W" log -1 --format=%s "$b")
  for f in $changed; do hits=$((hits+1)); echo "HOLD $f $b :: $subj"; done
done
echo "COUNT branches $n holds $hits"
