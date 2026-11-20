#!/bin/sh
# runners.sh <tree> <render-dir> <label>: the auditors' runners (bar5 a, B; bar6 C-F; bar7 H, I) over one render; a summary line each
S=${S:?set S to a scratch directory holding pc/ (PAGE-COPY: births.mjs, seedcfg.mjs, seeds.txt, seeds.w150.txt) and m/}
T=$1; D=$2; L=$3; cd $T
for r in docs/chair/2026-11-16/bar5/AUDIT/run-a.mjs docs/chair/2026-11-16/bar5/AUDIT/runB.mjs docs/chair/2026-11-16/bar6/AUDIT/runC.mjs docs/chair/2026-11-16/bar6/AUDIT/runD.mjs docs/chair/2026-11-16/bar6/AUDIT/runE.mjs docs/chair/2026-11-16/bar6/AUDIT/runF.mjs docs/chair/2026-11-17/bar7/AUDIT/runH.mjs docs/chair/2026-11-17/bar7/AUDIT/runI.mjs; do
  n=$(basename $r .mjs); node $r $D $S/m/$n.$L.json > $S/m/$n.$L.log 2>&1; echo "== $n EXIT $?"; grep -m1 -E "towns|instances" $S/m/$n.$L.log | cut -c1-200
done
