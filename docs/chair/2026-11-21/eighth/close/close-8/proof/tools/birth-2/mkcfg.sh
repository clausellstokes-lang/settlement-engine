#!/bin/sh
# mkcfg.sh <tree> <census file> <out config>: a vitest config rooted at the tree, including the census, react plugin on.
cat > "$3" <<CFG
import react from '$1/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '$1', plugins: [react()], server: { fs: { allow: ['$1', '$(dirname "$2")', '/home/user/settlement-engine/node_modules'] } }, test: { environment: 'jsdom', include: ['$2'], testTimeout: 7200000, pool: 'forks', server: { deps: { inline: [/@testing-library\\//] } } } };
CFG
