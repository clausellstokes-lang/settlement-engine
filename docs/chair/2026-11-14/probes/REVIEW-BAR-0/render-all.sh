#!/bin/sh
# REVIEW-BAR-0: the cut's twenty (rr2s, the reader's render), the increment's sixty (rww: render.rww.jsx; rpf: render.rw3.jsx)
# at the joined tree, the line's tip and the control aac79b808; the ten fresh bar0 towns at the joined tree.
S=/tmp/claude-0/-home-user-settlement-engine/548943c2-67f6-5faa-b0e5-db75a45dcb74/scratchpad; P=$S/probes
for t in join line ctl; do
  echo "== $t rr2s $(date -u +%T)"; sh $P/render2.sh $S/wt/$t $S/r/$t-rr2s $P/seeds20.txt 4 $P/render.rr2s.jsx
  echo "== $t rww $(date -u +%T)"; sh $P/render2.sh $S/wt/$t $S/r/$t-rww $P/seeds.ww.txt 4 $P/render.rww.jsx
  echo "== $t rpf $(date -u +%T)"; sh $P/render2.sh $S/wt/$t $S/r/$t-rpf $P/seeds.pf.txt 4 $P/render.rw3.jsx
  if [ $t = join ]; then echo "== join bar0 $(date -u +%T)"; sh $P/render2.sh $S/wt/join $S/r/join-bar0 $P/seeds.bar0.txt 4 $P/render.bar0.jsx; fi
done
echo RENDER-DONE $(date -u +%T)
