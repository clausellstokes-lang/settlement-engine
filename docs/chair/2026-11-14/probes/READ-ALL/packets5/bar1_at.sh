#!/bin/sh
# REVIEW-BAR-1: ten FRESH towns (the bar's ten shapes, a new seed each) born and rendered at the tree /home/user/landed stands at,
# and packed whole (every sentence of every tab under the town's facts) for cold readers. usage: bar1_at.sh <tip> (after census_at.sh <tip> has ended)
T=$1; P=/home/user/c3/docs/chair/2026-11-14/probes/CENSUS-3; R=/home/user/rec/bar1; O=/home/user/c3out/bar1-$T
X=$R/bar1-$T.exit; : > $X
test "$(git -C /home/user/landed rev-parse --short=9 HEAD)" = "$(echo $T | cut -c1-9)" || { echo "tree-not-at-tip" >> $X; exit 3; }
HOLDERS=$P/holders.tipA.json sh $P/census3.sh /home/user/landed $O 4 --seeds $R/seeds.bar1.txt > $R/census-bar1-$T.log 2>&1; echo "census-exit=$?" >> $X
rm -rf $R/packets-$T; mkdir -p $R/packets-$T
(cd /home/user/rec/readall && python3 build_packets3.py /home/user/c3out/$T $O $R/packets-$T 16000 > $R/packets-$T.out 2>&1); echo "packets-exit=$?" >> $X
wc -l $R/packets-$T/cal-*.txt >> $X 2>&1
date -u '+%H:%M:%S UTC' >> $X
