/** @vitest-environment jsdom */
// RUN (from the repository root): node docs/chair/2026-11-20/content/page/measures/A/runRenderA.mjs "$PWD" 5 > docs/chair/2026-11-20/content/page/measures/A/renderA.out.txt 2>&1
// PAGE-1 helper A: does the PAGE print the record's tension texts, side names and arrival sentences verbatim? The page
// census's own walker (tests/components/pageCensusWalk.shared.mjs :: walkDossier, storeFor), as NAMES-3's render.census.jsx
// on origin/lane/names-3-2026-11-20 uses it; the towns are the chair's recipe (hxd-<size>-<i>, DEFAULT_CONFIG), i < RENDER_N.
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { appendFileSync } from 'node:fs';
import { storeFor, walkDossier, SIZES } from '../../../../../../../tests/components/pageCensusWalk.shared.mjs';

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

const OUT = process.env.MEASUREA_OUT; const N = Number(process.env.RENDER_N || 5);
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
afterEach(cleanup);
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const split = (p) => String(p || '').split(/(?<=[.?!])\s+(?=[A-Z"'‘“])/).map((s) => s.trim()).filter(Boolean);
let ready = false;
for (const size of SIZES) for (let i = 0; i < N; i++) {
  const seed = `hxd-${size}-${i}`;
  test(seed, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    const born = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const town = withPublicProse(born, composePublicProse(born));
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    const views = await walkDossier(container, { fireEvent, waitFor, expect });
    const where = (s) => Object.entries(views).filter(([, lines]) => norm(lines.join(' ')).includes(norm(s))).map(([k]) => k);
    const tensions = (born.history?.currentTensions || []).map((t) => ({ type: t.type, desc: t.description, descOn: where(t.description), sides: (t.factions || []).map((f) => ({ f, on: where(f).length > 0 })) }));
    const arrival = split(born.arrivalScene).map((s) => ({ s, on: where(s) }));
    const publicArrivalSame = town.arrivalScene === born.arrivalScene;
    appendFileSync(OUT, JSON.stringify({ seed, tensions, arrival, publicArrivalSame }) + '\n');
  }, 300000);
}
