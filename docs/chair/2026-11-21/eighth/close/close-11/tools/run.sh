#!/bin/sh
H=/tmp/claude-0/-home-user-settlement-engine/011d3ac5-e59f-5285-9e4b-6ba55a7f95bf/scratchpad/via; TREE=$1; TAG=$2
cat > $H/vt.$TAG.config.mjs <<EOC
import react from '$TREE/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$TREE', plugins: [react()], server: { fs: { allow: ['$TREE', '$H', '/home/user/settlement-engine/node_modules'] } }, test: { environment: 'jsdom', include: ['$TREE/tests/zzDebtHomes.census.jsx'], testTimeout: 7200000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\//] } } } };
EOC
until sh /home/user/settlement-engine/scripts/gate-mutex.sh --run -- sh $H/forks.sh $TREE $TAG >> $H/$TAG.log 2>&1; rc=$?; [ $rc -ne 3 ]; do echo retry >> $H/$TAG.log; done
echo "EXIT $rc" >> $H/$TAG.log
