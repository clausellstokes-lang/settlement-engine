#!/bin/sh
# b14.sh <tree> <outdir> [seeds file] [n=4]
T=$1; O=$2; S=${3:-}; N=${4:-4}; mkdir -p $O; rm -f $O/b.*; i=0
while [ $i -lt $N ]; do ( TREE=$T OUT=$O/b.$i.ndjson.gz SEEDS=$S SHARD=$i NSHARD=$N node /home/user/probes/b14.mjs > $O/b.$i.log 2>&1; echo "EXIT $?" >> $O/b.$i.log ) & i=$((i+1)); done; wait
grep -h "births\|EXIT" $O/b.*.log
