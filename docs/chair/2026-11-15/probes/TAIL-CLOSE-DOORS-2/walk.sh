#!/bin/sh
# usage: walk.sh <worker> <commitsFile> <outDir>
W=$1; LIST=$2; OUT=$3; WT=/home/user/gmw/$W
mkdir -p $OUT /home/user/gmw
[ -d $WT ] || (cd /home/user/doors2 && git worktree add -q --detach $WT HEAD && ln -s /home/user/doors2/node_modules $WT/node_modules)
while read c; do
  [ -s $OUT/$c.json ] && continue
  (cd $WT && git checkout -q --detach -f $c) || { echo "{\"_error\":\"checkout\"}" > $OUT/$c.json; continue; }
  (cd $WT && timeout 600 node /home/user/doors2-probe/gm-proj.mjs $WT /home/user/doors2-probe/keys.json > $OUT/$c.tmp 2> $OUT/$c.err) && mv $OUT/$c.tmp $OUT/$c.json || echo "{\"_error\":\"gen\"}" > $OUT/$c.json
done < $LIST
