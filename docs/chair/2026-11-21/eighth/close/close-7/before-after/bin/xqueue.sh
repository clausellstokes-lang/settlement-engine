#!/bin/sh
S=/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad; O=/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-7/before-after
for c in C V; do for pair in line:line line:cures line:batch cures:cures cures:batch batch:batch; do
  src=${pair%%:*}; rd=${pair##*:}
  until [ -f $S/runs/$src-$c-small/table.txt ] && [ -f $S/runs/$src-$c-large/table.txt ]; do sleep 20; done
  if [ ! -d $S/runs/$src-$c/rows ] || [ $(ls $S/runs/$src-$c/rows | wc -l) -ne 900 ]; then rm -rf $S/runs/$src-$c; mkdir -p $S/runs/$src-$c/rows; ln -s $S/runs/$src-$c-small/rows/*.json $S/runs/$src-$c-large/rows/*.json $S/runs/$src-$c/rows/; fi
  $S/run-node.sh xcount-$src-$c-by-$rd node --import $S/bin/jsx-register.mjs $S/bin/xcount.mjs /home/user/wt/ba-$src /home/user/wt/ba-$rd $O/plans/plan-$c.json $S/runs/$src-$c $O/xcount/$src-$c-by-$rd.json
  echo "xcount $src-$c-by-$rd rc=$? $(date +%T) $(grep xcount: $O/logs/xcount-$src-$c-by-$rd.log)"
done; done
echo XQUEUE-DONE
