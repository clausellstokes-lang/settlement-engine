/** @vitest-environment jsdom */
/**
 * page-clash.render.census.jsx — THE PAGE CLASH CENSUS'S RENDERER (SURVEY S-C), run ONLY by scripts/page-clash-census.mjs through
 * its own vitest config (named `*.census.jsx` so the repository's test glob never picks it up), and by the walker
 * (`tests/lint/pageClashCensus.walker.test.js`) on its fixed sample. Built at run time by vitest from the tree itself (no
 * bundle is checked in). Each plan row is born and stamped with its public prose with the presumption ledger open (the birth's
 * and the stamp's notes), rendered through the real OutputContainer as the owner sees it with a tap on the ledger open across the
 * render and the whole walk (the owner's notes), walked (tests/components/pageCensusWalk.shared.mjs), and read by the census
 * (`page-clash.shared.mjs`) against the table (`src/domain/facts/claimExclusions.js`) on the final record's desk facts
 * (`facts/factsAnswered.js :: deskFactsOf`). Writes `<out>/<seed>.json`.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
import { storeFor, walkDossier } from '../../tests/components/pageCensusWalk.shared.mjs';

const mocks = vi.hoisted(() => ({ store: {}, tap: /** @type {any[] | null} */ (null) }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
// THE OWNER'S NOTES: a ledger cannot stay open across an awaited render (`withPresumptionLedger` is synchronous), so a TAP
// keeps every note made while no other ledger is open (a nested "quiet" ledger keeps its own notes, as it does in the app).
vi.mock('../../src/domain/facts/presumptionLedger.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  return { ...real, notePresumption: (/** @type {any} */ e) => { if (mocks.tap && real.activePresumptionLedger() === null) mocks.tap.push(e); real.notePresumption(e); } };
});

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import * as V from '../../src/domain/facts/factVocabulary.js';
import { deskFactsOf } from '../../src/domain/facts/factsAnswered.js';
import { CLAIM_EXCLUSIONS } from '../../src/domain/facts/claimExclusions.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { kernelTexts, noteClaims, pageClashes } from './page-clash.shared.mjs';

const OUT = process.env.PAGE_CLASH_OUT;
const PLAN = JSON.parse(readFileSync(String(process.env.PAGE_CLASH_PLAN), 'utf8'));
const TEXTS = kernelTexts([DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL, DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH]);
const sha = (/** @type {unknown} */ v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

afterEach(cleanup);
let ready = false;
for (const row of PLAN) {
  test(`${row.corpus}:${row.seed}`, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    /** @type {any[]} */ const birth = []; /** @type {any[]} */ const stamp = []; /** @type {any[]} */ const owner = [];
    let town = withPresumptionLedger(() => generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} }), birth).result;
    const recordHash = sha(town);
    town = withPresumptionLedger(() => withPublicProse(town, composePublicProse(town)), stamp).result;
    mocks.store = storeFor(town, vi.fn);
    mocks.tap = owner;
    let views;
    try {
      const { container } = render(<OutputContainer settlement={town} />);
      views = await walkDossier(container, { fireEvent, waitFor, expect });
    } finally { mocks.tap = null; }
    const pageText = Object.values(views).flat().join('\n');
    const facts = deskFactsOf(town);
    const noted = noteClaims([...birth, ...stamp, ...owner], pageText, TEXTS, V);
    const clashes = pageClashes(CLAIM_EXCLUSIONS, noted, (atom) => V.atomHolds(atom.replace(/^no\s+/i, ''), facts) === undefined ? undefined
      : /^no\s+/i.test(atom) ? !V.atomHolds(atom.replace(/^no\s+/i, ''), facts) : V.atomHolds(atom, facts), V);
    writeFileSync(`${OUT}/${row.corpus}-${row.seed}.json`, JSON.stringify({ corpus: row.corpus, seed: row.seed, size: row.size, recordHash, pageHash: sha(views), notes: noted.length, clashes }));
  }, 600000);
}
