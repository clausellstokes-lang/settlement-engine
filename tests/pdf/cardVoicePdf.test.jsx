/** @vitest-environment jsdom */
/**
 * tests/pdf/cardVoicePdf.test.jsx — THE PRINT TWIN: ONE QUOTE, EVERY SURFACE (S-G1; VOICES-CARDS' F, "PDF (5)"; the
 * chair's rulings E28 points 5 and 11).
 *
 * Over two born towns of C, each PDF chapter that prints a card kind is walked as the PDF's own tests walk a chapter (every
 * function component executed): every card the PDF prints carries the SAME quote the screen's plan gives it (the line and
 * the speaker), the slot sits on the card itself, and the liar's line is never printed.
 *
 * THE TONIGHT SHEET HOLDS NO QUOTE, IN PRINT AS ON SCREEN (ruling 5; the chair's G1-7 of 2026-11-28): the PDF's crisis
 * block lives only in chapter 02, the one Tonight sheet, so the print has no crisis card that may speak. The crisis
 * card's quote lives on the screen's Summary/Crisis card alone, so it is by design that the print has fewer quotes.
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
import { TonightAtTheTable } from '../../src/pdf/sections/TonightAtTheTable.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { printedQuotesOf, quoteFor, voicePlanOf } from '../../src/domain/voices/voicePlan.js';
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
  ['Institutions', (/** @type {any} */ s, /** @type {any} */ vm, /** @type {any} */ v) => <Institutions settlement={s} narrativeMode={false} vm={vm} voices={v} />],
  ['PowerStructure', (/** @type {any} */ s, /** @type {any} */ vm, /** @type {any} */ v) => <PowerStructure settlement={s} narrativeMode={false} vm={vm} voices={v} />],
  ['HistoryFounding', (/** @type {any} */ s, /** @type {any} */ vm, /** @type {any} */ v) => <HistoryFounding settlement={s} narrativeMode={false} vm={vm} voices={v} />],
  ['CrisisSections', (/** @type {any} */ s) => <CrisisSections settlement={s} />],
  ['NotableNPCs', (/** @type {any} */ s, /** @type {any} */ vm, /** @type {any} */ v) => <NotableNPCs settlement={s} narrativeMode={false} vm={vm} voices={v} />],
]);

describe('the print twin carries the screen\'s quote, card for card', () => {
  it('prints on every card it holds the quote the plan gives that card, never the liar\'s, and prints some', () => {
    let printed = 0; let slots = 0;
    for (const [seed, s] of towns) {
      const vm = buildViewModel({ settlement: s, dmView: true });
      const plan = voicePlanOf(s, { audience: 'owner' });
      const voices = printedQuotesOf(s); // built on the caller's thread, as generateSettlementPDF builds it (G1-5)
      for (const [name, el] of CHAPTERS) {
        for (const node of find(el(s, vm, voices), (n) => n.type === CardVoicePdf)) {
          slots += 1;
          const { quotes, kind, id } = node.props;
          expect(quotes, `${seed} ${name}: the slot is handed the caller's quotes`).toBe(voices);
          const want = quoteFor(plan, kind, id);
          const got = printedQuoteOf(quotes, kind, id);
          if (want && !want.liar) {
            printed += 1;
            expect(got, `${seed} ${name} ${kind}:${id}`).toEqual({ text: want.text, name: want.speaker.name, role: want.speaker.role });
          } else {
            expect(got, `${seed} ${name} ${kind}:${id}`).toBeNull();
          }
        }
      }
      for (const q of plan.quotes.values()) if (q.liar) expect(printedQuoteOf(voices, q.kind, q.id)).toBeNull();
    }
    expect(slots).toBeGreaterThan(20);
    expect(printed).toBeGreaterThan(3);
  }, 120_000);
});

/** Every string under a react(-pdf) tree, function components executed. @param {any} n @param {string[]} acc */
const textsOf = (n, acc = []) => {
  if (n == null || typeof n === 'boolean') return acc;
  if (typeof n === 'string' || typeof n === 'number') { acc.push(String(n)); return acc; }
  if (Array.isArray(n)) { for (const x of n) textsOf(x, acc); return acc; }
  if (typeof n.type === 'function') return textsOf(n.type(n.props), acc);
  return textsOf(n.props?.children, acc);
};

describe('the Tonight sheet holds no quote in print (ruling 5, G1-7)', () => {
  it('a town in crisis whose screen crisis card speaks (dp-village-2): chapter 02 holds no slot and no quote text', () => {
    const s = generateSettlementPipeline(birthConfig({ settType: 'village' }), null, { seed: 'dp-village-2', customContent: {} });
    const said = [...voicePlanOf(s, { audience: 'owner' }).quotes.values()].find((q) => q.kind === 'crisis');
    expect(said, 'the screen\'s crisis card speaks (the plant)').toBeTruthy();
    const el = <TonightAtTheTable settlement={s} narrativeMode={false} vm={buildViewModel({ settlement: s, dmView: true })} />;
    expect(find(el, (n) => n.type === CardVoicePdf)).toEqual([]);
    const page = textsOf(el).join('');
    expect(page.includes(`“${said.text}”`)).toBe(false);
    expect(page).not.toMatch(/” — /);
  }, 120_000);
});

describe('the quotes handed to the worker (G1-5: the PDF worker carries no lines)', () => {
  it('PARITY: the map holds the screen plan\'s every quote but the liar\'s, as text and signature, and nothing else', () => {
    for (const [seed, s] of towns) {
      const plan = voicePlanOf(s, { audience: 'owner' });
      const want = Object.fromEntries([...plan.quotes.values()].filter((q) => !q.liar).map((q) => [`${q.kind}:${q.id}`, { text: q.text, name: q.speaker.name, role: q.speaker.role }]));
      const got = printedQuotesOf(s);
      expect(got, seed).toEqual(want);
      expect(JSON.stringify(got), `${seed}: no DM note`).not.toMatch(/inTruth|liar/);
      expect(structuredClone(got), `${seed}: plain data, as a worker message`).toEqual(got);
    }
    expect([...towns.values()].some((s) => [...voicePlanOf(s, { audience: 'owner' }).quotes.values()].some((q) => q.liar)), 'a liar stands in the towns').toBe(true);
    expect(printedQuotesOf(null)).toEqual({});
  });

  it('a document built without the map prints no quote', () => {
    const s = towns.get('dp-village-5');
    const vm = buildViewModel({ settlement: s, dmView: true });
    for (const [, el] of CHAPTERS) for (const node of find(el(s, vm, null), (n) => n.type === CardVoicePdf)) expect(printedQuoteOf(node.props.quotes, node.props.kind, node.props.id)).toBeNull();
  });
});
