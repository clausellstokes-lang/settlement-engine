#!/bin/sh
# REVIEW-BAR-6: thirty FRESH towns (the bar's ten shapes, three new seeds each: rand-42, -43, -44) born and rendered at the tree
# /home/user/landed stands at, WITH THE MENDED READING COPY (2026-11-16: /home/user/rec/bar5/probe: rows whole with their cells and
# marks; every opened part read from the page itself under an "[opened]" head; nothing de-duplicated), and packed for cold readers
# by build_packets5.py (a row is one item; the bar's pages are read as printed). usage: bar5_at.sh <tip>
T=$1; P=/home/user/rec/bar5/probe; R=/home/user/rec/rbar6; O=/home/user/c3out/rbar6-$T
X=$R/rbar6-$T.exit; : > $X
test "$(git -C /home/user/landed rev-parse --short=9 HEAD)" = "$(echo $T | cut -c1-9)" || { echo "tree-not-at-tip" >> $X; exit 3; }
HOLDERS=$P/holders.tipA.json sh $P/census3.sh /home/user/landed $O 4 --seeds $R/seeds.bar6.txt --count-only > $R/census-rbar6-$T.log 2>&1; echo "census-exit=$?" >> $X
rm -rf $R/packets-$T; mkdir -p $R/packets-$T
(cd /home/user/rec/readall && python3 /home/user/rec/bar5/build_packets5.py /home/user/c3out/5d1e3096b2 $O $R/packets-$T 16000 > $R/packets-$T.out 2>&1); echo "packets-exit=$?" >> $X
wc -l $R/packets-$T/cal-*.txt >> $X 2>&1
date -u '+%H:%M:%S UTC' >> $X
