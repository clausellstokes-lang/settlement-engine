#!/bin/zsh -i
# usage: quoted.sh <worktree> <token...> — counts lines holding a quoted string literal of each token in src
W="$1"; shift
for t in "$@"; do
  n=$(rg --no-filename -e "'$t'" -e "\"$t\"" "$W/src" 2>/dev/null | wc -l | tr -d ' ')
  echo "$t quoted_src_lines=$n"
done
