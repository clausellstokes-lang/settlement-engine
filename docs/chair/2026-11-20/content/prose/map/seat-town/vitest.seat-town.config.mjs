// SEAT-TOWN's own vitest config (MAP-1's vitest.map.config.mjs, with the root taken from THIS file's place instead of a
// hard-coded checkout): SEAT_FILE names the one test file to run.
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';

const ROOT = fileURLToPath(new URL('../../../../../../../', import.meta.url)).replace(/\/$/, '');
export default { root: ROOT, plugins: [react()], test: { environment: 'node', include: [String(process.env.SEAT_FILE)], testTimeout: 300000, pool: 'forks', fileParallelism: false } };
