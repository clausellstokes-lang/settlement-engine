#!/bin/sh
# births.sh <tree> <outdir> <which> [nshard=4]: shards in parallel, each exit read.
T=$1; O=$2; W=$3; N=${4:-4}; mkdir -p $O; i=0
while [ $i -lt $N ]; do ( TREE=$T OUT=$O/$W.$i.ndjson.gz WHICH=$W SHARD=$i NSHARD=$N node /home/user/p9probes/births.mjs > $O/$W.$i.log 2>&1; echo "EXIT $?" >> $O/$W.$i.log ) & i=$((i+1)); done; wait
bad=0; i=0; while [ $i -lt $N ]; do tail -1 $O/$W.$i.log | grep -qx "EXIT 0" || bad=1; i=$((i+1)); done; echo "births $W bad=$bad"; grep -h births $O/$W.*.log
