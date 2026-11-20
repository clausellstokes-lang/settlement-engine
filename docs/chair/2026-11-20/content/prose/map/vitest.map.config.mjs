// MAP-1's own vitest config (SAME-1's census config, copied): MAP_FILE names the one test file to run.
import react from '/home/user/settlement-engine/node_modules/@vitejs/plugin-react/dist/index.js';
export default { root: '/home/user/settlement-engine', plugins: [react()], test: { environment: 'node', include: [String(process.env.MAP_FILE)], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
