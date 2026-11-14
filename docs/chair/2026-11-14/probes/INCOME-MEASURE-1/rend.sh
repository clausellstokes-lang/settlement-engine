#!/bin/sh
# rend.sh <tree> <out>: four shards of render5.mjs, logs beside out
T=$1; O=$2; D=$(dirname $0); mkdir -p $O
for i in 00 01 02 03; do TREE=$T node $D/render5.mjs $D/shard.$i $O > $O.log.$i 2>&1 & done; wait; echo done > $O.done
