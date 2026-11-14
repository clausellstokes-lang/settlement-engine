#!/bin/sh
# gen.sh <tree> <out>: four shards of gen.mjs
T=$1; O=$2; D=$(dirname $0); mkdir -p $O; rm -f $O.done
for i in 00 01 02 03; do TREE=$T node $D/gen.mjs $D/shard.$i $O > $O.log.$i 2>&1 & done; wait; echo done > $O.done
