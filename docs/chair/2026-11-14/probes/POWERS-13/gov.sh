#!/bin/sh
# gov.sh <tree> <outdir> <which> [n]
T=$1; O=$2; W=$3; N=${4:-2}; mkdir -p $O; i=0
while [ $i -lt $N ]; do ( TREE=$T OUT=$O/g.$i.ndjson.gz WHICH=$W SHARD=$i NSHARD=$N node /home/user/probes/gov.mjs > $O/g.$i.log 2>&1; echo "EXIT $?" >> $O/g.$i.log ) & i=$((i+1)); done; wait
grep -h "births\|EXIT" $O/g.*.log
