#!/bin/sh
# bisect criterion: a fresh build's first-paint static closure (tests/build/vendorPdfLazy.test.js)
cd /home/user/cmbis || exit 125
rm -rf dist
n=$(git rev-parse --short HEAD)
node --max-old-space-size=4096 node_modules/vite/bin/vite.js build > /home/user/cmout/bis/build.$n.log 2>&1 || { echo "$n build-fail" >> /home/user/cmout/bis/trail.txt; exit 125; }
GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run --maxWorkers=1 tests/build/vendorPdfLazy.test.js > /home/user/cmout/bis/vpl.$n.log 2>&1
rc=$?
echo "$n vendorPdfLazy rc=$rc" >> /home/user/cmout/bis/trail.txt
[ $rc -eq 0 ] && exit 0; [ $rc -eq 1 ] && exit 1; exit 125
