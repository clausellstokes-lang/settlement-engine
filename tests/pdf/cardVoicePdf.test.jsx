/** @vitest-environment jsdom */
/**
 * tests/pdf/cardVoicePdf.test.jsx — THE PRINT TWIN: ONE QUOTE, EVERY SURFACE (S-G1; VOICES-CARDS' F, "PDF (5)"; the
 * chair's rulings E28 points 5 and 11).
 *
 * Over two born towns of C, each PDF chapter that prints a card kind is walked as the PDF's own tests walk a chapter (every
 * function component executed): every card the PDF prints carries the SAME quote the screen's plan gives it (the line and
 * the speaker), the slot sits on the card itself, and the liar's line is never printed.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => data;
  return { useStore, default: useStore };
});

import CardVoicePdf, { printedQuoteOf } from '../../src/pdf/primitives/CardVoice.jsx';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { HistoryFounding } from '../../src/pdf/sections/HistoryFounding.jsx';
import { CrisisSections } from '../../src/pdf/sections/CrisisSections.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { quoteFor, voicePlanOf } from '../../src/domain/voices/voicePlan.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

/** Every element under a react(-pdf) tree, function components executed. @param {any} node @param {(n: any) => boolean} pred @param {any[]} acc */
const find = (node, pred, acc = []) => {
  if (node == null || typeof node !== 'object') return acc;
  if (Array.isArray(node)) { for (const n of node) find(n, pred, acc); return acc; }
  if (pred(node)) acc.push(node);
  if (typeof node.type === 'function') return find(node.type(node.props), pred, acc);
  return find(node.props?.children, pred, acc);
};

/** @type {Map<string, any>} */ const towns = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const [seed, settType] of [['dp-city-59', 'city'], ['dp-village-5', 'village']]) {
    towns.set(seed, generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} }));
  }
}, 120_000);

const CHAPTERS = /** @type {const} */ ([
  ['Institutions', (/** @type {any} */ s, /** @type {any} */ vm) => <Institutions settlement={s} narrativeMode={false} vm={vm} />],
  ['PowerStructure', (/** @type {any} */ s, /** @type {any} */ vm) => <PowerStructure settlement={s} narrativeMode={false} vm={vm} />],
  ['HistoryFounding', (/** @type {any} */ s, /** @type {any} */ vm) => <HistoryFounding settlement={s} narrativeMode={false} vm={vm} />],
  ['CrisisSections', (/** @type {any} */ s) => <CrisisSections settlement={s} />],
  ['NotableNPCs', (/** @type {any} */ s, /** @type {any} */ vm) => <NotableNPCs settlement={s} narrativeMode={false} vm={vm} />],
]);

describe('the print twin carries the screen\'s quote, card for card', () => {
  it('prints on every card it holds the quote the plan gives that card, never the liar\'s, and prints some', () => {
    let printed = 0; let slots = 0;
    for (const [seed, s] of towns) {
      const vm = buildViewModel({ settlement: s, dmView: true });
      const plan = voicePlanOf(s, { audience: 'owner' });
      for (const [name, el] of CHAPTERS) {
        for (const node of find(el(s, vm), (n) => n.type === CardVoicePdf)) {
          slots += 1;
          const { town, kind, id } = node.props;
          expect(town, `${seed} ${name}: the slot is handed the record`).toBe(s);
          const want = quoteFor(plan, kind, id);
          const got = printedQuoteOf(town, kind, id);
          if (want && !want.liar) {
            printed += 1;
            expect([got?.lineId, got?.speaker.id], `${seed} ${name} ${kind}:${id}`).toEqual([want.lineId, want.speaker.id]);
          } else {
            expect(got, `${seed} ${name} ${kind}:${id}`).toBeNull();
          }
        }
      }
      for (const q of plan.quotes.values()) if (q.liar) expect(printedQuoteOf(s, q.kind, q.id)).toBeNull();
    }
    expect(slots).toBeGreaterThan(20);
    expect(printed).toBeGreaterThan(3);
  }, 120_000);
});
