// MEASURE-GEN11-FIELDS's vitest config: vitest.map.config.mjs copied, rooted at the worktree named by GEN11F_ROOT,
// with a longer timeout. GEN11F_FILE names the one census file to run. Lives outside tests/: never part of the suite.
const ROOT = String(process.env.GEN11F_ROOT);
const { default: react } = await import(`${ROOT}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: ROOT, plugins: [react()], test: { environment: 'node', include: [String(process.env.GEN11F_FILE)], testTimeout: 1800000, pool: 'forks', fileParallelism: false } };
