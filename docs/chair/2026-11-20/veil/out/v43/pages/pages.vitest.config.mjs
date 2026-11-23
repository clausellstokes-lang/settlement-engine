// V43-PAGES: the probe's own vitest config (a copy of /var/tmp/v18/rv9/vitest.config.mjs with the census renderer's
// jsdom needs: scripts/census/page-census.mjs inlines @testing-library). RV6_SRC=<worktree> RV9_PROBE=<absolute file>
const SRC = process.env.RV6_SRC;
const { default: react } = await import(`${SRC}/node_modules/@vitejs/plugin-react/dist/index.js`);
export default { root: SRC, plugins: [react()], server: { fs: { strict: false }, deps: { inline: [/@testing-library\//] } },
  test: { environment: 'jsdom', include: [process.env.RV9_PROBE], testTimeout: 14400000, pool: 'forks', setupFiles: [],
    server: { deps: { inline: [/@testing-library\//] } } } };
