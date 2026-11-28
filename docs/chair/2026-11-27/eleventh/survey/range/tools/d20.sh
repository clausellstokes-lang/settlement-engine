#!/bin/sh
# for each line of the twenty keys: the first commit (and its date) that added its text to its file
cd /home/user/settlement-engine
node -e "const j=require('/home/user/scratch-range/d20.json').jobs;for(const x of j)console.log([x.ki,x.li,x.file,x.frag].join('\t'))" | while IFS="$(printf '\t')" read ki li file frag; do
  first=$(git log --reverse --format='%h %ad' --date=short -S"$frag" -- "$file" | head -1)
  n=$(git log --format='%h' -S"$frag" -- "$file" | wc -l)
  echo "$ki	$li	$file	$first	$n"
done
