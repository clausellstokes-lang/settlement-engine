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

const PH = join(S, 'kernel/proseHash.js');
const instrument = {
  name: 'pickLog',
  setup(b) {
    b.onLoad({ filter: /kernel[\\/]proseHash\.js$/ }, async (a) => {
      const fs = await import('node:fs');
      let src = fs.readFileSync(a.path, 'utf8');
      for (const f of ['pickVariant', 'pickVariantMixed', 'pickRendezvous', 'rankRendezvous', 'fnv1a32']) {
        src = src.replace(new RegExp(`export function ${f}\\(`), `function __o_${f}(`);
      }
      src = src.replace(/\b(pickVariant|pickVariantMixed|pickRendezvous|rankRendezvous|fnv1a32)\(/g, (m, f, off, s) => (s.slice(off - 4, off) === '__o_' ? m : `__o_${f}(`));
      src += `
const __site = () => { const st = new Error().stack.split('\\n'); const out = []; for (let i = 4; i < st.length && out.length < 3; i++) { const m = /:(\\d+):\\d+\\)?$/.exec(st[i]); if (m) out.push(m[1]); } return out.join(','); };
const __idOf = (v, idOf) => { try { return idOf ? String(idOf(v)) : (v && typeof v === 'object' ? (v.id ?? JSON.stringify(v).slice(0, 60)) : String(v).slice(0, 60)); } catch { return '?'; } };
const __log = (kind, key, chosen) => { const L = globalThis.__picks; if (L) L.push(kind + '\\t' + __site() + '\\t' + String(key) + '\\t' + chosen); };
export function pickVariant(pool, seed) { const r = __o_pickVariant(pool, seed); __log('PV', seed, Array.isArray(pool) ? pool.indexOf(r) + '/' + pool.length : '-'); return r; }
export function pickVariantMixed(pool, seed) { const r = __o_pickVariantMixed(pool, seed); __log('PVM', seed, Array.isArray(pool) ? pool.indexOf(r) + '/' + pool.length : '-'); return r; }
export function pickRendezvous(lines, key, idOf) { const r = __o_pickRendezvous(lines, key, idOf); __log('RZ', key, r === undefined ? '-' : __idOf(r, idOf)); return r; }
export function rankRendezvous(lines, key, idOf) { const r = __o_rankRendezvous(lines, key, idOf); __log('RK', key, r.slice(0, 3).map((x) => __idOf(x, idOf)).join(',')); return r; }
export function fnv1a32(str) { const r = __o_fnv1a32(str); __log('FNV', str, r); return r; }
`;
      return { contents: src, loader: 'js' };
    });
  },
};


const K3 = {
  'domain/factionArchetypes.js': ['factionArchetype'], 'generators/power/factionCategories.js': ['inferFactionCategory'],
  'domain/people/allegiance.js': ['isCriminalPower'], 'domain/facts/rulerKindLabel.js': ['rulerKindOfLabel'],
  'domain/people/stressPowerFaces.js': ['stressPowerRowOf'], 'lib/entities.js': ['factionIdFromName'],
  'domain/npcProfile.js': ['factionIdFromName'], 'domain/display/guardLineUnderTheLaw.js': ['familiesHeldOf'],
};
const kindLog = {
  name: 'kindLog',
  setup(b) {
    b.onLoad({ filter: /src[\\/](domain|generators|data)[\\/].*\.js$/ }, async (a) => {
      const rel = Object.keys(K3).find((k) => a.path.replace(/\\/g, '/').endsWith(`src/${k}`));
      if (!rel) return undefined;
      const fs = await import('node:fs');
      let s = fs.readFileSync(a.path, 'utf8');
      for (const f of K3[rel]) {
        const exported = new RegExp(`export function ${f}\\(`).test(s) || new RegExp(`export const ${f} = `).test(s);
        s = s.replace(new RegExp(`(export )?function ${f}\\(`), `function __k_${f}(`).replace(new RegExp(`export const ${f} = `), `const __k_${f} = `);
        s += `\n${exported ? 'export ' : ''}function ${f}(...a) { const r = __k_${f}(...a); const L = globalThis.__kinds; if (L) { const x = a[0]; const nm = typeof x === 'string' ? x : (x && (x.faction || x.name)) || ''; const ph = globalThis.__phase || '-'; const st = new Error().stack.split('\\n').slice(2, 6).map((l) => (/:(\\d+):\\d+\\)?$/.exec(l) || [])[1]).filter(Boolean).join(','); L.push([ph, '${f}' + '@' + '${rel}', String(nm), JSON.stringify(r === undefined ? null : r)].join('\\t')); } return r; }\n`;
      }
      return { contents: s, loader: 'js' };
    });
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
  plugins: [plugin, kindLog, instrument], logLevel: 'warning', sourcemap: false,
  banner: { js: "import { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
});
console.log('built', OUT);
