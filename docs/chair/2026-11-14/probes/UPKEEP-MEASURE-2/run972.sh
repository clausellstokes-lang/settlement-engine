# sh run972.sh <label>: births of the reader's 972 at wt/<label>, then mono2 over them. Outputs under out/<label>972, out/mono2.<label>.*
L=$1; SCR=/tmp/claude-0/-home-user-settlement-engine/957f1a26-c08d-5601-a50f-d1918b9621a5/scratchpad; I=$SCR/inst; T=$SCR/wt/$L; O=$SCR/out
rm -rf $O/${L}972; for i in 0 1 2 3; do TREE=$T node $I/born.mjs $I/all.seeds $O/${L}972 $i 4 > $O/born.$L.$i.log 2>&1 & done; wait
grep -L "done" $O/born.$L.?.log
sh $I/runmono2.sh $T $O/${L}972/rec $I/all.seeds $O/mono2.$L
