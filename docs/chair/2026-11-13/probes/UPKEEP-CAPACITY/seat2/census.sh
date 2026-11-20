#!/bin/sh
# census.sh <sha> <label>: the pin census at a committed sha in the census worktree; refs and config compared
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
R=/home/user/settlement-engine
cd $R && git for-each-ref > $S/snap/refs-c-$2-pre.txt; git config --local -l > $S/snap/cfg-c-$2-pre.txt
cd $S/wtc && git checkout -q --detach $1 && git status --short | head -3
sh $S/tools/suites.sh $S/wtc $S/census-$2.log
cd $R && git for-each-ref > $S/snap/refs-c-$2-post.txt; git config --local -l > $S/snap/cfg-c-$2-post.txt
if diff -q $S/snap/refs-c-$2-pre.txt $S/snap/refs-c-$2-post.txt >/dev/null && diff -q $S/snap/cfg-c-$2-pre.txt $S/snap/cfg-c-$2-post.txt >/dev/null; then H=same; else H=CHANGED; fi
grep '^ FAIL ' $S/census-$2.log | sort -u > $S/reds-$2.txt
echo "census $2 $(tail -1 $S/census-$2.log) reds $(wc -l < $S/reds-$2.txt) refs/config $H" >> $S/runs/done.txt
