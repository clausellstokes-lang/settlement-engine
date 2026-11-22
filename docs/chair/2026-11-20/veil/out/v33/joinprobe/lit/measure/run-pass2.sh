#!/bin/sh
# V33-JOINPROBE PASS 2: the heavy steps after the gates, ONE AT A TIME, each inside the mutex; each exit to run-pass2.log.
M=/home/user/wt/jp; L=$M/docs/chair/2026-11-20/veil/out/v33/joinprobe/lit; G="sh $M/scripts/gate-mutex.sh --run --"
cd $M
echo "start $(date -u +%H:%M:%S)" >> $L/run-pass2.log
$G sh $L/measure/birthdiff.sh $M /var/tmp/v18/t2/pool-jp2 $L/pool/birthdiff > $L/pool/birthdiff-run.log 2>&1; echo "birthdiff rc=$? $(date -u +%H:%M:%S)" >> $L/run-pass2.log
$G sh $L/measure/hookgap2.sh $M $L/measure/out jp2tpl 40 > $L/measure/hookgap-run.log 2>&1; echo "hookgap rc=$? $(date -u +%H:%M:%S)" >> $L/run-pass2.log
$G sh $L/measure/litsurf.sh $M $L/measure/litsurf jp2tpl 10 > $L/measure/litsurf-run.log 2>&1; echo "litsurf rc=$? $(date -u +%H:%M:%S)" >> $L/run-pass2.log
$G sh $L/measure/chain-jp2.sh > $L/chain-run.log 2>&1; echo "chain rc=$? $(date -u +%H:%M:%S)" >> $L/run-pass2.log
echo "END $(date -u +%H:%M:%S)" >> $L/run-pass2.log
