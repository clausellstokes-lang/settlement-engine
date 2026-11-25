// V53-FAILCLOSED's exploration probe config (not a suite): RV6_SRC=<worktree>
const SRC = process.env.RV6_SRC || '/home/user/pages53';
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: SRC, plugins: [react()], server: { fs: { strict: false }, deps: { inline: [/@testing-library\//] } },
  test: { environment: 'jsdom', include: [process.env.FC_PROBE], testTimeout: 1800000, pool: 'forks', setupFiles: [],
    server: { deps: { inline: [/@testing-library\//] } } } };
