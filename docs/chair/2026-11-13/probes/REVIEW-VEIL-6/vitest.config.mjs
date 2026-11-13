// REVIEW-VEIL-6: run a probe of this folder inside a worktree of the side under test.
//   RV6_SRC=<worktree> RV6_PROBE=<file in this folder> npx vitest run --config <this file>
const SRC = process.env.RV6_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
const here = new URL('.', import.meta.url).pathname;
export default {
  root: SRC,
  plugins: [react()],
  server: { fs: { strict: false } },
  test: { environment: 'node', include: [`${here}${process.env.RV6_PROBE || 'cold.probe.jsx'}`], testTimeout: 14400000, pool: 'forks' },
};
