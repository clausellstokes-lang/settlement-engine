#!/bin/sh
C=/home/user/settlement-engine; V=$C/docs/chair/2026-11-20/veil/out
echo "start $(date -u +%H:%M:%S)" > /var/tmp/v18/out/v30/chain0.log
sh $V/v28/seated/make-instruments.sh $C /var/tmp/v18/out/v30/seated >> /var/tmp/v18/out/v30/chain0.log 2>&1; echo "instruments rc=$? $(date -u +%H:%M:%S)" >> /var/tmp/v18/out/v30/chain0.log
sh $V/v27/tell2/measure/pool.sh $C /var/tmp/v18/t2/pool-t2sig-2 v28tpl >> /var/tmp/v18/out/v30/chain0.log 2>&1; echo "pool rc=$? $(date -u +%H:%M:%S)" >> /var/tmp/v18/out/v30/chain0.log
TELL_DB=v30tip sh $V/v27/tell2/measure/tell2.sh $C /var/tmp/v18/out/v30/tip v28tpl /var/tmp/v18/t2/pool-t2sig-2 >> /var/tmp/v18/out/v30/chain0.log 2>&1; echo "tell2 rc=$? $(date -u +%H:%M:%S)" >> /var/tmp/v18/out/v30/chain0.log
