// MEASURE-WORDING's vitest config: ../gen11-fields/vitest.gen11f.config.mjs copied, rooted at the worktree named by
// WORD_ROOT, with a longer timeout. WORD_FILE names the one census file to run. Lives outside tests/: never part of the suite.
const ROOT = String(process.env.WORD_ROOT);
const { default: react } = await import(`${ROOT}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: ROOT, plugins: [react()], test: { environment: 'node', include: [String(process.env.WORD_FILE)], testTimeout: 1800000, pool: 'forks', fileParallelism: false } };
