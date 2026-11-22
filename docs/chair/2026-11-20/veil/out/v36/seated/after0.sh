#!/bin/sh
while ! grep -q '^END' /var/tmp/v18/out/v36/chain0.log; do sleep 30; done
if grep -q 'pool rc=0' /var/tmp/v18/out/v36/chain0.log && grep -q 'instruments rc=0' /var/tmp/v18/out/v36/chain0.log; then sh /var/tmp/v18/out/v36/chain1.sh; else echo "chain0 not clean: chain1 NOT started" > /var/tmp/v18/out/v36/after0.txt; fi
