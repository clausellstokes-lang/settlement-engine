// VEIL-VR17's probes: root = the tree named by VR17_SRC (default: this checkout), the probe named by VR17_PROBE.
import { fileURLToPath } from 'node:url';
const here = fileURLToPath(new URL('.', import.meta.url));
const SRC = process.env.VR17_SRC || fileURLToPath(new URL('../../../../../../', import.meta.url));
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default {
  root: SRC, plugins: [react()], server: { fs: { strict: false } },
  test: { environment: 'node', include: [`${here}${process.env.VR17_PROBE}`], testTimeout: 14400000, hookTimeout: 1800000, pool: 'forks' },
};
