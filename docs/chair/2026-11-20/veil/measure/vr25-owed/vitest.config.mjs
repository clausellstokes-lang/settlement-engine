// REVIEW-VEIL-9: run a probe inside a worktree of the side under test. RV6_SRC=<worktree> RV9_PROBE=<absolute file>
const SRC = process.env.RV6_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: SRC, plugins: [react()], server: { fs: { strict: false } },
  test: { environment: 'node', include: [process.env.RV9_PROBE], testTimeout: 14400000, pool: 'forks', setupFiles: [] } };
