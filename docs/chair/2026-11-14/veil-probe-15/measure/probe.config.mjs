// VEIL-15: run one probe of this folder against a tree (the worktree, or the base's archive).
//   RV6_SRC=<tree> V15_PROBE=<absolute path of a probe> npx vitest run --config <this file>
// The same shape as REVIEW-VEIL-6's vitest.config.mjs, with the probe named by its own path.
const SRC = process.env.RV6_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default {
  root: SRC,
  plugins: [react()],
  server: { fs: { strict: false } },
  test: { environment: 'node', include: [process.env.V15_PROBE], testTimeout: 14400000, pool: 'forks' },
};
