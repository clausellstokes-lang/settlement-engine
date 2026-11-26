import react from '/home/user/settlement-engine/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: process.env.TREE, plugins: [react()], server: { fs: { allow: ['/'] } }, test: { environment: 'node', include: ['/tmp/claude-0/-home-user-settlement-engine/bff0939b-b9d9-597c-b9f6-09cd446d16bf/scratchpad/*.test.mjs'], testTimeout: 3600000, pool: 'forks' } };
