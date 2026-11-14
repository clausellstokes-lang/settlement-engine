# sh runmono2.sh <tree> <recdir> <seeds> <outprefix>: mono2.mjs in 4 shards, then joined to <outprefix>.ndjson
T=$1; D=$2; S=$3; O=$4; I=$(dirname $0)
for i in 0 1 2 3; do TREE=$T node $I/mono2.mjs $D $S $O.$i.part $i 4 > $O.$i.log 2>&1 & done; wait
cat $O.0.part $O.1.part $O.2.part $O.3.part | grep -v '"done"' > $O.ndjson; grep -h '"done"' $O.?.part
