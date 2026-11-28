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

    const fsx = require('node:fs');
    const XF = {
      'src/domain/facts/drawDeclared.js': (s) => s.replace("  notePresumption({\n    pool: options.poolId || '(unnamed)',", "  notePresumption({\n    __text: __txt(lineText(line)), __decl: line && typeof line === 'object' ? [declarationOf(line, { tagged: options.tagged === true })] : null,\n    pool: options.poolId || '(unnamed)',") + "\nfunction __txt(t) { return typeof t === 'string' ? t : typeof t === 'function' ? '[fn]' : null; }\n",
      'src/domain/display/stateProse/stateProseKernel.js': (s) => s.replace("  notePresumption({\n    pool: `${where.blockId}::${where.poolKey}`,", "  notePresumption({\n    __text: variant.text, __decl: [marked, facts],\n    pool: `${where.blockId}::${where.poolKey}`,"),
      'src/domain/facts/factVocabulary.js': (s) => s.replace('export function declarationAdmits(', 'function __declarationAdmits0(') + `
export function declarationAdmits(decl, facts, options) {
  const r = __declarationAdmits0(decl, facts, options);
  const L = globalThis.__DA_LOG;
  if (L) { const o = {}; Error.captureStackTrace(o, declarationAdmits); L.push({ decl, ctx: options && options.ctx, crisisScoped: options && options.crisisScoped, admitted: r.admitted, stack: o.stack }); }
  return r;
}
`,
    };
    const XABS = new Map(Object.entries(XF).map(([rel, f]) => [join(TREE, rel), [rel, f]]));
    b.onLoad({ filter: /\.js$/, namespace: 'file' }, (a) => {
      const hit = XABS.get(a.path); if (!hit) return undefined;
      const [rel, f] = hit; const s0 = fsx.readFileSync(a.path, 'utf8'); const s1 = f(s0);
      if (s1 === s0 || !s1.includes(rel.includes('factVocabulary') ? '__declarationAdmits0' : '__text')) throw new Error('transform did not apply: ' + rel);
      return { contents: s1, loader: 'jsx', resolveDir: dirname(a.path) };
    });
    b.onLoad({ filter: /.*/, namespace: 'mock' }, (a) => ({ contents: MOCK_SRC[a.path], loader: 'js', resolveDir: HERE }));
  },
};
const env = { DEV: false, PROD: true, MODE: 'test', SSR: false, BASE_URL: '/' };
await esbuild.build({
  entryPoints: [join(HERE, process.argv[4] || 'harness.jsx')],
  bundle: true, platform: 'node', format: 'esm', target: 'node20', outfile: OUT,
  jsx: 'automatic', loader: { '.js': 'jsx', '.mjs': 'jsx', '.json': 'json', '.svg': 'text', '.css': 'empty', '.png': 'empty', '.woff2': 'empty', '.ttf': 'empty' },
  nodePaths: [join(TREE, 'node_modules')],
  external: ['jsdom', 'canvas'],
  define: { 'import.meta.env': JSON.stringify(env), 'process.env.NODE_ENV': '"test"' },
  plugins: [plugin], logLevel: 'warning', sourcemap: false,
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
});
console.log('built', OUT);
