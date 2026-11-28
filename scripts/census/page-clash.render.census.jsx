/** @vitest-environment jsdom */
/**
 * page-clash.render.census.jsx — THE PAGE CLASH CENSUS'S RENDERER (SURVEY S-C), run ONLY by scripts/page-clash-census.mjs through
 * its own vitest config (named `*.census.jsx` so the repository's test glob never picks it up), and by the walker
 * (`tests/lint/pageClashCensus.walker.test.js`) on its fixed sample. Built at run time by vitest from the tree itself (no
 * bundle is checked in). Each plan row is born and stamped with its public prose with the presumption ledger open (the birth's
 * and the stamp's notes), rendered through the real OutputContainer as the owner sees it with a tap on the ledger open across the
 * render and the whole walk (the owner's notes), walked (tests/components/pageCensusWalk.shared.mjs), and read by the census
 * (`page-clash.shared.mjs`) against the table (`src/domain/facts/claimExclusions.js`) on the final record's desk facts
 * (`facts/factsAnswered.js :: deskFactsOf`); and, beside the clashes, the four solvency slots left EMPTY (SURVEY S-B2). Writes
 * `<out>/<seed>.json`.
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
// `activePresumptionLedger` answers the tap there too, since a draw notes only where a ledger is open (`drawDeclared.js :: note`).
vi.mock('../../src/domain/facts/presumptionLedger.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  return {
    ...real,
    activePresumptionLedger: () => real.activePresumptionLedger() ?? mocks.tap,
    notePresumption: (/** @type {any} */ e) => { if (mocks.tap && real.activePresumptionLedger() === null) mocks.tap.push(e); real.notePresumption(e); },
  };
});
// THE TEXT OF A NOTE: a note carries its pool and line id, not its words. Each draw of `drawDeclared.js` is wrapped: the notes it
// adds to the open ledger (or the tap) gain the TEXT of the line they name (the pool's line by id or index, else what the draw
// returned), so the census can tell whether that line is on the page (`page-clash.shared.mjs :: noteClaims`). Nothing drawn moves.
vi.mock('../../src/domain/facts/drawDeclared.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  const L = /** @type {any} */ (await import('../../src/domain/facts/presumptionLedger.js'));
  const textOf = (/** @type {unknown} */ l) => { if (l == null) return undefined; try { const t = real.lineText(l); return typeof t === 'string' ? t : undefined; } catch { return undefined; } };
  /** @param {(...a: any[]) => any} fn */
  const wrap = (fn) => (/** @type {any[]} */ ...args) => {
    const ledger = L.activePresumptionLedger();
    const from = Array.isArray(ledger) ? ledger.length : 0;
    const out = fn(...args);
    if (Array.isArray(ledger)) {
      const pool = Array.isArray(args[0]) ? args[0] : null;
      const returned = typeof out === 'string' ? out : out && typeof out === 'object' && 'line' in out ? textOf(out.line) : typeof args[0] === 'string' ? args[0] : undefined;
      for (let i = from; i < ledger.length; i += 1) {
        const n = ledger[i]; if (!n || typeof n.text === 'string') continue;
        const own = pool ? (typeof n.lineId === 'number' && n.lineId >= 0 ? pool[n.lineId] : pool.find((l) => l && typeof l === 'object' && l.id === n.lineId)) : undefined;
        const text = textOf(own) ?? returned;
        if (typeof text === 'string') ledger[i] = { ...n, text };
      }
    }
    return out;
  };
  return Object.fromEntries(Object.entries(real).map(([k, v]) => [k, typeof v === 'function' && k !== 'lineText' ? wrap(v) : v]));
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
// SURVEY S-B2 (the chair's 06:05 message, (c)): THE FOUR SOLVENCY SLOTS, read at the function level on the same record: the
// header (DS-ECO-1 C3), the standing-of-living and treasury tiles' one draw (DS-ECO-8 COMFORTABLE, MODERATE) and the Defense
// desk's Economic Survival row (DS-DEF-2 STRONG). A slot is EMPTY when its desk asks that pool and draws no line of it.
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { defenseDeskRead } from '../../src/components/new/defenseDeskRead.js';
import { prosperityHeaderPoolKey } from '../../src/domain/display/stateProse/economyStateProse.js';
import { prosperityRank } from '../../src/data/constants.js';
import { economicSurvivalBandOf } from '../../src/domain/display/defenseScoreBands.js';

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
    const asked = {
      header: prosperityHeaderPoolKey(prosperityRank(town.economicState?.prosperity), String(town.economicState?.tradeAccess ?? town.economicViability?.metrics?.tradeAccess ?? '')),
      rung: String(town.economicState?.prosperity ?? '').toUpperCase(),
      survival: `Economic Survival: ${economicSurvivalBandOf(town)}`,
    };
    const drew = withPresumptionLedger(() => { economyDeskRead(town); defenseDeskRead(town); }).ledger.filter((n) => n.drawKind === 'K').map((n) => n.pool);
    const empty = [
      asked.header === 'COMBINATION C3: the middle rungs' && !drew.includes(`DS-ECO-1::${asked.header}`) ? 'header (DS-ECO-1 C3)' : null,
      ['COMFORTABLE', 'MODERATE'].includes(asked.rung) && !drew.includes(`DS-ECO-8::${asked.rung}`) ? `the standing and treasury tiles (DS-ECO-8 ${asked.rung})` : null,
      asked.survival === 'Economic Survival: STRONG' && !drew.includes(`DS-DEF-2::${asked.survival}`) ? 'the Economic Survival row (DS-DEF-2 STRONG)' : null,
    ].filter(Boolean);
    const facts = deskFactsOf(town);
    const noted = noteClaims([...birth, ...stamp, ...owner], pageText, TEXTS, V);
    const clashes = pageClashes(CLAIM_EXCLUSIONS, noted, (atom) => V.atomHolds(atom.replace(/^no\s+/i, ''), facts) === undefined ? undefined
      : /^no\s+/i.test(atom) ? !V.atomHolds(atom.replace(/^no\s+/i, ''), facts) : V.atomHolds(atom, facts), V);
    writeFileSync(`${OUT}/${row.corpus}-${row.seed}.json`, JSON.stringify({ corpus: row.corpus, seed: row.seed, size: row.size, recordHash, pageHash: sha(views), notes: noted.length, clashes, empty }));
  }, 600000);
}
