/** @vitest-environment jsdom */
/**
 * render.d4c.census.jsx — D4C TABLE 3, THE REST OF THE PAGE (brief: ../../briefs/D4C-MEASURE.md). MEASURE ONLY.
 *
 * Why a vitest file: the dossier is JSX mounted in a DOM (OutputContainer under jsdom), which a node script cannot run.
 * Named `*.census.jsx` so the repository's test glob (vitest's default `*.test.*` / `*.spec.*`) never picks it up.
 * THE MOUNT is the dossier harness's (tests/components/dossierPhoneFloorAllViews.test.jsx and the census renderer
 * scripts/census/sameness-census.render.census.jsx): the store mocked as those files mock it (storeFor of
 * tests/components/pageCensusWalk.shared.mjs), the town stamped with its public prose (withPublicProse(composePublicProse)),
 * `<OutputContainer settlement={town} />` (the owner's page), every group, every sub-tab and every disclosure walked by
 * pageCensusWalk.shared.mjs :: walkDossier (imported, unchanged), one discarded warm-up render first (the census's own).
 * Births: 30, five a size, seeds d4c-<size>-0..4, M1's recipe (DEFAULT_CONFIG at the size, no dials).
 *
 * RUN (from the repository root), with a config holding only this file (written to a scratch directory, not the tree):
 *   printf "import react from '%s/node_modules/@vitejs/plugin-react/dist/index.js';\nexport default { root: '%s', plugins: [react()], test: { environment: 'node', include: ['%s/docs/chair/2026-11-20/content/daily/measures/D4C/render.d4c.census.jsx'], testTimeout: 600000, pool: 'forks', fileParallelism: false, server: { deps: { inline: [/@testing-library\\\\//] } } } };\n" "$PWD" "$PWD" "$PWD" > <scratch>/vitest.d4c.config.mjs
 *   D4C_RENDER_OUT=docs/chair/2026-11-20/content/daily/measures/D4C/d4c.render.out.txt sh scripts/gate-mutex.sh --run -- npx vitest run --config <scratch>/vitest.d4c.config.mjs
 *
 * Counts, per tab, in the rendered text (each rendered line once per tab): (a) a POWER's name that itself holds "'s"
 * followed by another "'s" (the record's government and faction names, by `powerNameAfterArticle`); (b) any
 * "<power name>'s" (the possessive on any of those names); (c) any "X's Y['s]" double possessive by shape, no name list.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync } from 'node:fs';
import { storeFor, walkDossier } from '../../../../../../../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../../../../../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../../../../../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../../../../../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../../../../../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../../../../../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../../../../../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../../../../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../../../../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../../../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../../../../../src/store/configSlice.js';
import { powerNameAfterArticle } from '../../../../../../../src/domain/display/powerSentenceName.js';

const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
afterEach(cleanup);

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const PLAN = SIZES.flatMap((size) => Array.from({ length: 5 }, (_, i) => ({ seed: `d4c-${size}-${i}`, size })));
const OUT = process.env.D4C_RENDER_OUT;
const esc = (v) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const birth = (row) => withPublicProse(...((t) => [t, composePublicProse(t)])(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: row.size }), null, { seed: row.seed, customContent: {} })));
const walkT = { fireEvent, waitFor, expect };

/** per tab: { double: {n, ex}, poss: {n, ex}, shape: {n, ex}, lines } */
const perTab = {};
const places = [];
const bump = (tab, kind, ex) => { const t = (perTab[tab] ||= { lines: 0, double: { n: 0, ex: [] }, poss: { n: 0, ex: [] }, shape: { n: 0, ex: [] } }); t[kind].n++; if (t[kind].ex.length < 2) t[kind].ex.push(ex); };

test('warm-up (discarded)', async () => {
  await loadGenerationLawPayloads();
  const town = birth(PLAN[0]);
  mocks.store = storeFor(town, vi.fn);
  const { container } = render(<OutputContainer settlement={town} />);
  await walkDossier(container, walkT);
}, 600000);

for (const row of PLAN) {
  test(row.seed, async () => {
    const t0 = Date.now();
    const town = birth(row);
    const ps = town?.powerStructure || {};
    const names = [...new Set([String(ps.government ?? ''), ...(Array.isArray(ps.factions) ? ps.factions : []).map((f) => String(f?.faction ?? ''))].filter(Boolean))]
      .map((raw) => powerNameAfterArticle(raw)).filter(Boolean);
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, walkT);
    cleanup();
    let lines = 0;
    for (const [tab, ls] of Object.entries(views)) {
      (perTab[tab] ||= { lines: 0, double: { n: 0, ex: [] }, poss: { n: 0, ex: [] }, shape: { n: 0, ex: [] } }).lines += ls.length;
      lines += ls.length;
      for (const l of ls) {
        for (const nm of names) {
          for (const m of l.matchAll(new RegExp(`${esc(nm)}'s?(?![A-Za-z])`, 'g'))) {
            if (m[0].length === nm.length) continue;
            bump(tab, 'poss', `${row.seed}: "${l.slice(0, 200)}"`);
            if (/'s/.test(nm)) bump(tab, 'double', `${row.seed}: "${l.slice(0, 200)}"`);
          }
        }
        for (const m of l.matchAll(/\b[\w-]+'s\s+[\w-]+(?:\s+[\w-]+)?'s?(?![A-Za-z])/g)) bump(tab, 'shape', `${row.seed}: "${m[0]}" in "${l.slice(0, 200)}"`);
      }
    }
    places.push({ seed: row.seed, size: row.size, ms: Date.now() - t0, tabs: Object.keys(views).length, lines, sNames: names.filter((n) => /'s/.test(n)) });
  }, 600000);
}

test('write', () => {
  const out = [];
  out.push(`D4C TABLE 3 — THE REST OF THE PAGE: ${places.length} births rendered (d4c-<size>-0..4), every group, sub-tab and disclosure (walkDossier).`);
  out.push(`births whose government or a faction name itself holds "'s": ${places.filter((p) => p.sNames.length).length} (${places.filter((p) => p.sNames.length).map((p) => `${p.seed}: ${p.sNames.join(', ')}`).join('; ') || 'none'})`);
  out.push(`tabs walked a place: ${[...new Set(places.map((p) => p.tabs))].join(', ')}; ms a place: ${places.map((p) => p.ms).join(' ')}`);
  out.push('');
  out.push('tab | rendered lines (30 places) | (a) DOUBLE power-name possessive | (b) any <power name>\'s | (c) X\'s Y\'s by shape');
  for (const [tab, t] of Object.entries(perTab).sort((a, b) => b[1].double.n - a[1].double.n || b[1].poss.n - a[1].poss.n || b[1].shape.n - a[1].shape.n)) {
    out.push(`${tab} | ${t.lines} | ${t.double.n} | ${t.poss.n} | ${t.shape.n}`);
    for (const k of ['double', 'poss', 'shape']) for (const e of t[k].ex) out.push(`    ${k}: ${e}`);
  }
  const tot = (k) => Object.values(perTab).reduce((a, t) => a + t[k].n, 0);
  out.push('');
  out.push(`TOTAL: (a) ${tot('double')}  (b) ${tot('poss')}  (c) ${tot('shape')}`);
  if (OUT) writeFileSync(OUT, `${out.join('\n')}\n`);
  else console.log(out.join('\n'));
  expect(places.length).toBe(PLAN.length);
});
