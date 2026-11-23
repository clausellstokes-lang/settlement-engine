// VEIL-V102's probes: root = this checkout (the veil, the switch, the screen); the generator from V102_GEN (default: this
// checkout; master's stored shape = a git archive of origin/master). The probe is named by V102_PROBE.
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const SRC = fileURLToPath(new URL('../../../../../../', import.meta.url));
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default {
  root: SRC, plugins: [react()], server: { fs: { strict: false } },
  test: { environment: 'node', include: [`${here}${process.env.V102_PROBE}`], testTimeout: 14400000, hookTimeout: 1800000, pool: 'forks' },
};
