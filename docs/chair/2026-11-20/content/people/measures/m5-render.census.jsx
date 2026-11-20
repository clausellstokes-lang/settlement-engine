/** @vitest-environment jsdom */
/**
 * PEOPLE-2 seat M5 (2026-11-20): THE RENDERED ARM of the founding measure. Run ONLY by m5-render.mjs, which copies it
 * into the tree under measure as `.m5-run/m5-render.census.jsx` (NAMES-3's pattern: docs/chair/2026-11-20/content/tools/
 * confinement/render.census.jsx). For each seed of its plan it:
 *   - births the place EXACTLY as the chair's instrument does (stored-census/census.mjs): seed hxd-<size>-<i>,
 *     generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} })
 *     after loadGenerationLawPayloads();
 *   - stamps the public prose (withPublicProse(composePublicProse)) as the page census does, renders the real
 *     OutputContainer and walks it whole (pageCensusWalk.shared.mjs :: walkDossier: every group, sub-tab, disclosure);
 *   - renders the PDF's element tree (SettlementPDF, the canon_dossier variant, no AI) to static markup and reads its text
 *     (the tree the PDF lays out, not the laid-out bytes);
 *   - builds the Foundry journal (foundry/journalPages.js :: buildJournalPages over pdf/lib/viewModel.js :: buildViewModel);
 *   - where the tree holds the traditions description (TRAD-1's `domain/traditions/traditionDescription.js`), composes each
 *     shown rite (shownTraditions.js :: shownTraditionsOf) for the OWNER and for a READER, the writer the card prints;
 * and writes `<out>/<seed>.json`: the stored founding fields, the place's names (for the mask), every rendered line that
 * CONTAINS the stored foundedBy or overcoming (by surface), the traditions view's lines, and the composed rites.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { walkDossier, storeFor } from '../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../src/domain/display/publicProse.js';
import { composePublicProse } from '../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../src/store/configSlice.js';
import { SettlementPDF } from '../src/pdf/SettlementPDF.jsx';
import { buildViewModel } from '../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../src/foundry/journalPages.js';

const OUT = process.env.M5_OUT;
const PLAN = JSON.parse(readFileSync(process.env.M5_PLAN, 'utf8'));
const HAS_DESC = existsSync(`${process.cwd()}/src/domain/traditions/traditionDescription.js`); // the driver runs vitest with cwd = the tree
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const decode = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const textOfMarkup = (html) => decode(html.replace(/<[^>]+>/g, '\n')).split('\n').map(norm).filter(Boolean);
const containsCI = (line, needle) => !!needle && line.toLowerCase().includes(needle.toLowerCase());

afterEach(cleanup);
let ready = false;
let desc = null;
for (const row of PLAN) {
  test(row.seed, async () => {
    if (!ready) {
      await loadGenerationLawPayloads();
      if (HAS_DESC) {
        const D = await import(/* @vite-ignore */ `${process.cwd()}/src/domain/traditions/traditionDescription.js`);
        const S = await import(/* @vite-ignore */ `${process.cwd()}/src/domain/traditions/shownTraditions.js`);
        desc = { describeTradition: D.describeTradition, shownTraditionsOf: S.shownTraditionsOf };
      }
      ready = true;
    }
    let town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: row.size }), null, { seed: row.seed, customContent: {} });
    const f = town.history?.founding || {};
    const by = typeof f.foundedBy === 'string' ? f.foundedBy : '';
    const ov = typeof f.overcoming === 'string' ? f.overcoming : '';
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(town.name);
    for (const p of town.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const fa of town.powerStructure?.factions || []) { add(fa.name); add(fa.faction); }
    // the writer: the composed rites (the record as born, before the public-prose stamp)
    let rites = null;
    if (desc) {
      rites = [];
      for (const rec of desc.shownTraditionsOf(town, undefined)?.recs || []) {
        const o = desc.describeTradition(rec, town, { audience: 'owner' });
        const r = desc.describeTradition(rec, town, { audience: 'reader' });
        rites.push({ id: rec.id, name: rec.name, element: rec.coreMotif?.element, foundedYear: rec.foundedYear, owner: o?.text ?? null, reader: r?.text ?? null });
      }
    }
    town = withPublicProse(town, composePublicProse(town));
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, { fireEvent, waitFor, expect });
    const web = {}; const webOv = {}; const trad = {};
    for (const [name, lines] of Object.entries(views)) {
      const a = lines.filter((l) => containsCI(l, by)); if (a.length) web[name] = a;
      const b = lines.filter((l) => containsCI(l, ov)); if (b.length) webOv[name] = b;
      if (/tradition/i.test(name)) trad[name] = lines;
    }
    let pdf = null;
    try {
      const lines = textOfMarkup(renderToStaticMarkup(<SettlementPDF settlement={town} />));
      pdf = { lines: lines.length, by: lines.filter((l) => containsCI(l, by)), ov: lines.filter((l) => containsCI(l, ov)) };
    } catch (e) { pdf = { error: String(e?.message || e).slice(0, 200) }; }
    let foundry = null;
    try {
      const pages = buildJournalPages(buildViewModel({ settlement: town, dmView: true }), { settlement: town });
      const text = JSON.stringify(pages);
      foundry = { by: containsCI(text, by), ov: containsCI(text, ov) };
    } catch (e) { foundry = { error: String(e?.message || e).slice(0, 200) }; }
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({
      seed: row.seed, size: row.size, tier: town.tier, recordSeed: town._seed ?? null,
      founding: { foundedBy: by, overcoming: ov, initialChallenge: f.initialChallenge ?? null, age: f.age ?? null },
      names: [...names], viewNames: Object.keys(views), web, webOv, trad, rites, pdf, foundry,
    }));
  }, 300000);
}
