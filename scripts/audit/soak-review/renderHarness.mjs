/**
 * scripts/audit/soak-review/renderHarness.mjs — the RENDERED surfaces of one settlement, as text.
 *
 * The soak's word-readings run over what a DM reads, never over the record: the Table View's
 * dossier tabs (the same props `src/components/OutputContainer.jsx` passes), the one Tonight
 * sheet (`src/domain/summary/tonightSheet.js :: composeTonightSheet` painted by
 * `src/components/TonightSheet.jsx`), the PDF's text (`src/pdf/SettlementPDF.jsx :: SettlementPDF`,
 * its element tree walked to the text leaves, the way tests/domain/foodEnduranceLine.test.js
 * reads the defence chapter) and the Foundry journal (`src/foundry/moduleBuilder.js ::
 * buildFoundryModuleFiles`, the pages it writes).
 *
 * Booted the way the repo's review probes boot (scripts/review/reader-corpus.mjs :: bootRunner):
 * Vite in middleware mode, `ssrLoadModule`, the store aliased to scripts/review/readerStoreStub.mjs,
 * `import.meta.env` frozen so no operator flag reaches a render. react and react-dom/server are
 * imported NORMALLY (the reader corpus's own ⚠: two React copies break hooks).
 *
 * A surface that throws is recorded as `{ error }`, never dropped: a render error is a finding.
 */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(HERE, '../../..');
const STUB = resolve(REPO_ROOT, 'scripts/review/readerStoreStub.mjs');

/** The dossier tabs read here, in the dossier's order, with OutputContainer's props. */
export const TAB_IDS = Object.freeze([
  'overview', 'economics', 'services', 'institutions', 'power', 'defense', 'npcs', 'relationships',
  'history', 'resources', 'viability', 'daily_life', 'magic', 'faith', 'war', 'rumors',
  'traditions', 'plot_hooks', 'dm_compass', 'substrate',
]);

export async function bootHarness() {
  const { createServer } = await import('vite');
  const server = await createServer({
    configFile: false,
    root: REPO_ROOT,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    oxc: { jsx: 'automatic' },
    esbuild: { jsx: 'automatic' },
    define: {
      'import.meta.env': JSON.stringify({ MODE: 'production', DEV: false, PROD: true, SSR: true, BASE_URL: '/' }),
    },
    resolve: { alias: [{ find: /^(.*)\/store\/index\.js$/, replacement: STUB }] },
  });
  const load = (rel) => server.ssrLoadModule(`/${rel}`);
  const [React, RDS] = await Promise.all([import('react'), import('react-dom/server')]);
  const m = Object.fromEntries(await Promise.all(Object.entries({
    stub: 'scripts/review/readerStoreStub.mjs',
    norm: 'src/domain/normalizeSettlement.js',
    overview: 'src/components/new/tabs/OverviewTab.jsx',
    economics: 'src/components/new/tabs/EconomicsTab.jsx',
    services: 'src/components/new/tabs/ServicesTab.jsx',
    institutions: 'src/components/new/tabs/InstitutionsTab.jsx',
    power: 'src/components/new/tabs/PowerTab.jsx',
    defense: 'src/components/new/tabs/DefenseTab.jsx',
    npcs: 'src/components/new/tabs/NPCsTab.jsx',
    relationships: 'src/components/new/tabs/RelationshipsTab.jsx',
    history: 'src/components/new/tabs/HistoryTab.jsx',
    resources: 'src/components/new/tabs/ResourcesTab.jsx',
    viability: 'src/components/new/tabs/ViabilityTab.jsx',
    daily_life: 'src/components/new/tabs/DailyLifeTab.jsx',
    magic: 'src/components/new/tabs/MagicTab.jsx',
    faith: 'src/components/new/tabs/FaithTab.jsx',
    war: 'src/components/new/tabs/WarTab.jsx',
    rumors: 'src/components/new/tabs/RumorsTab.jsx',
    traditions: 'src/components/new/tabs/TraditionsTab.jsx',
    plot_hooks: 'src/components/new/tabs/PlotHooksTab.jsx',
    dm_compass: 'src/components/new/tabs/DMCompassTab.jsx',
    substrate: 'src/components/new/tabs/SubstrateTab.jsx',
    tonightModel: 'src/domain/summary/tonightSheet.js',
    tonight: 'src/components/TonightSheet.jsx',
    vm: 'src/pdf/lib/viewModel.js',
    pdf: 'src/pdf/SettlementPDF.jsx',
    foundry: 'src/foundry/moduleBuilder.js',
  }).map(async ([k, p]) => [k, await load(p)])));
  return { server, load, React: React.default ?? React, RDS, m };
}

/** @param {string} html */
export function htmlToText(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<\/?(?:p|div|section|article|li|ul|ol|h\d|tr|td|th|table|br|header|footer|aside|dt|dd|dl)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;|&#160;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n[\n ]*/g, '\n')
    .trim();
}

/** Text leaves of a @react-pdf element tree, calling each function component as it goes. */
function pdfLeaves(node, out, depth = 0) {
  if (node == null || typeof node === 'boolean' || depth > 400) return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfLeaves(n, out, depth + 1); return out; }
  if (typeof node === 'object') {
    const t = node.type;
    if (typeof t === 'function') {
      const rendered = t.prototype?.isReactComponent ? new t(node.props).render() : t(node.props);
      return pdfLeaves(rendered, out, depth + 1);
    }
    if (t && typeof t === 'object' && typeof t.type === 'function') return pdfLeaves(t.type(node.props), out, depth + 1); // memo
    if (t === 'TEXT' || t === 'LINK') { const seg = []; pdfLeaves(node.props?.children, seg, depth + 1); out.push(`${seg.join('')}\n`); return out; }
    if (typeof node.props?.render === 'function') return out; // page-number callbacks
    return pdfLeaves(node.props?.children, out, depth + 1);
  }
  return out;
}

/**
 * Every rendered surface of one settlement.
 * @returns {{ tabs: Record<string,string>, tonight: string, tonightSheet: any, pdf: string, foundry: string, errors: Record<string,string> }}
 */
export function renderSurfaces(h, settlement) {
  const { React, RDS, m } = h;
  const errors = {};
  const s = m.norm.normalizeSettlement(settlement);
  m.stub.setReaderStoreState({});
  const el = (mod, props) => React.createElement(mod.default, props);
  const P = { publicDossier: false, playerView: false, narrativeNote: null };
  const props = {
    overview: { settlement: s, ...P, onNavigateTab: () => {}, worldState: null },
    economics: { settlement: s, economicState: s.economicState, ...P },
    services: { services: s.availableServices, settlement: s, ...P },
    institutions: { settlement: s, canAuthor: false },
    power: { powerStructure: s.powerStructure, settlement: s, ...P, worldState: null },
    defense: { settlement: s, ...P },
    npcs: { npcs: s.npcs, settlement: s, ...P },
    relationships: { settlement: s, ...P, viewerIsPremium: false },
    history: { settlement: s, ...P, recentEvents: [] },
    resources: { settlement: s, ...P },
    viability: { settlement: s, ...P },
    daily_life: { settlement: s, ...P },
    magic: { settlement: s, ...P },
    faith: { settlement: s, ...P },
    war: { settlement: s, ...P },
    rumors: { settlement: s, ...P },
    traditions: { settlement: s },
    plot_hooks: { settlement: s, ...P },
    dm_compass: { settlement: s },
    substrate: { settlement: s },
  };
  const tabs = {};
  for (const id of TAB_IDS) {
    try { tabs[id] = htmlToText(RDS.renderToStaticMarkup(el(m[id], props[id]))); } catch (e) { errors[`tab:${id}`] = String(e?.message ?? e).slice(0, 300); tabs[id] = ''; }
  }
  let tonight = ''; let tonightSheet = null;
  try {
    tonightSheet = m.tonightModel.composeTonightSheet(s);
    tonight = htmlToText(RDS.renderToStaticMarkup(React.createElement(m.tonight.default, { sheet: tonightSheet, palette: {} })));
  } catch (e) { errors.tonight = String(e?.message ?? e).slice(0, 300); }
  let pdf = ''; let vm = null;
  try {
    vm = m.vm.buildViewModel({ settlement: s, phase: 'canon' });
    const tree = React.createElement(m.pdf.SettlementPDF, { settlement: s, phase: 'canon', variant: 'canon_dossier', faithUnlocked: true, isFounder: true, isAnonymous: true });
    pdf = pdfLeaves(tree, []).join('').replace(/[ \t]+/g, ' ').replace(/ *\n[\n ]*/g, '\n').trim();
  } catch (e) { errors.pdf = String(e?.message ?? e).slice(0, 300); }
  let foundry = '';
  try {
    const { pages } = m.foundry.buildFoundryModuleFiles({ settlement: s, vm: vm ?? m.vm.buildViewModel({ settlement: s }), variant: 'canon_dossier', faithUnlocked: true });
    foundry = pages.map((p) => `# ${p.name}\n${String(p.markdown ?? p.text?.markdown ?? p.text?.content ?? '').trim()}`).join('\n');
  } catch (e) { errors.foundry = String(e?.message ?? e).slice(0, 300); }
  return { tabs, tonight, tonightSheet, pdf, foundry, errors };
}
