// Bundles harness.jsx against TREE with esbuild (plain node). Writes nothing into the tree.
// node build.mjs <tree> <outfile>
import { createRequire } from 'node:module';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const TREE = resolve(process.argv[2]);
const OUT = resolve(process.argv[3]);
const HERE = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(TREE, 'package.json'));
const esbuild = require('esbuild');
const S = join(TREE, 'src');
const MOCKS = new Map([
  [join(S, 'store/index.js'), 'store'],
  [join(S, 'lib/supabase.js'), 'supabase'],
  [join(S, 'generators/aiLayer.js'), 'aiLayer'],
  [join(S, 'lib/analytics.js'), 'analytics'],
]);
const MOCK_SRC = {
  state: 'export const mocks = { store: {} };',
  store: `import { mocks } from 'mock:state';
const useStore = (selector) => (selector ? selector(mocks.store) : mocks.store);
useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; useStore.setState = () => {};
export { useStore }; export default useStore;`,
  supabase: 'export const supabase = {}; export const isConfigured = false;',
  aiLayer: 'export const runTemplateNarrative = () => undefined;',
  analytics: `export const track = () => {}; export const Funnel = { track: () => {} };
export const EVENTS = new Proxy({}, { get: (_t, k) => String(k) });`,
};
const plugin = {
  name: 'rmeasure',
  setup(b) {
    b.onResolve({ filter: /^TREE\// }, (a) => ({ path: join(TREE, a.path.slice(5)) }));
    b.onResolve({ filter: /^mock:/ }, (a) => ({ path: a.path.slice(5), namespace: 'mock' }));
    b.onResolve({ filter: /^\./ }, (a) => {
      if (!a.resolveDir) return undefined;
      const abs = resolve(a.resolveDir, a.path);
      for (const c of [abs, `${abs}.js`, join(abs, 'index.js')]) if (MOCKS.has(c)) return { path: MOCKS.get(c), namespace: 'mock' };
      return undefined;
    });
    b.onLoad({ filter: /.*/, namespace: 'mock' }, (a) => ({ contents: MOCK_SRC[a.path], loader: 'js', resolveDir: HERE }));
  },
};
const env = { DEV: false, PROD: true, MODE: 'test', SSR: false, BASE_URL: '/' };
await esbuild.build({
  entryPoints: [join(HERE, 'harness.jsx')],
  bundle: true, platform: 'node', format: 'esm', target: 'node20', outfile: OUT,
  jsx: 'automatic', loader: { '.js': 'jsx', '.mjs': 'jsx', '.json': 'json', '.svg': 'text', '.css': 'empty', '.png': 'empty', '.woff2': 'empty', '.ttf': 'empty' },
  nodePaths: [join(TREE, 'node_modules')],
  external: ['jsdom', 'canvas'],
  define: { 'import.meta.env': JSON.stringify(env), 'process.env.NODE_ENV': '"test"' },
  plugins: [plugin], logLevel: 'warning', sourcemap: false,
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
});
console.log('built', OUT);
