#!/bin/sh
# assemble.sh: rebuild C5 and M2 with final messages on the pushed C4b, then C6 with its docs and probes, in wt
set -e
S=/tmp/claude-0/-home-user-settlement-engine/65bd7da1-976a-52ec-8929-258543e63092/scratchpad
cd $S/wt
read A B < $S/c4-final.txt
C5=$(git commit-tree e61b012bb^{tree} -p $B -F $S/msg/C5.final)
M2=$(git commit-tree 5f833a646^{tree} -p $C5 -p fbc4a0080 -F $S/m2-msg.txt)
git checkout -q -B cap2 $M2
git checkout 8118184be -- src tests && python3 $S/tools/c6home.py $S/wt
P=docs/chair/2026-11-13/probes/UPKEEP-CAPACITY/seat2
cp $S/runs/move-M2.txt $S/runs/move-M2-995293e81.txt $S/runs/move-C6.txt $S/arcsup-C6.ndjson $P/
cp $S/pages/c6-side.txt $S/pages/keys-c6.txt $P/pages/
cp $S/tools/arcsup.mjs $S/tools/magicside.py $S/tools/beasts.py $P/
cat $S/doc-c6.md >> docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md
git add src tests docs
git commit -q -F $S/msg/C6.final
echo "C5 $C5 M2 $M2 C6 $(git rev-parse HEAD)"
echo "C6 src differs from the measured tree only by the home reading; re-measured next"
