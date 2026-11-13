// REVIEW-VEIL-5: run a probe of this folder inside a worktree of the side under test.
//   RV5_SRC=<worktree> RV5_PROBE=<file in this folder> npx vitest run --config <this file>
const SRC = process.env.RV5_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
const here = new URL('.', import.meta.url).pathname;
export default {
  root: SRC,
  plugins: [react()],
  server: { fs: { strict: false } },
  test: { environment: 'node', include: [`${here}${process.env.RV5_PROBE || 'attack.probe.jsx'}`], testTimeout: 14400000, pool: 'forks' },
};
