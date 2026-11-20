/** @vitest-environment jsdom */
/**
 * npcCardStanding.test.jsx — A PERSON'S STANDING PRINTS THE RECORD'S FACT, NOT THE MACHINE'S BAND (PAGE-1 CARD, F4;
 * docs/chair/2026-11-20/content/page/briefs/BUILD.md §CARD, on the chair's order of 11:15, 2026-11-20).
 *
 * The stored `influence` is a keyword match on the pool role (npcGenerator.js:59-76), misread at birth (PAGE-2's fault):
 * 88.6% of the chair's 300 towns' cards printed one dot and "Standing marginal", and so did a third of the firsts of a
 * power and every thorp elder (measures/C/f4.out.txt §1, §3). Every surface that printed it as a word or a mark now
 * prints the FACT instead, or nothing:
 *
 *   1. THE CARD: no dots in its header; its "Standing" row says the powers it stands FIRST of (`memberships[].rank 1`)
 *      and each one's weight HERE, read from the record's own figure (`powerStructure.factions[].power`); a card first
 *      of none prints no Standing row. No standing word ("commanding", "established", "marginal") anywhere on it.
 *   2. THE TIES: a tie another person holds toward this one reads in plain words, "<name> holds a tie to them: <kind>",
 *      never the "CALLED BY" header.
 *   3. THE NPCs TAB: no "N high influence · M moderate" tally, no "●●● High / ●● Moderate / ● Low" filter.
 *   4. THE PDF: the person's card prints the same Standing line, never "Influence: <band>".
 *   5. THE FOUNDRY JOURNAL: the person's page prints the same fact, never "Influence: <band>".
 *
 * THE ORACLE IS THE TEST'S OWN (a cure gone wrong cannot certify itself): the expected weight is computed here from the
 * town's figures, not by the leaf. Over census births (the SECOND-WAVE-CENSUS dials) of every size. Display only: the
 * record's `influence` does not move.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/lib/saves.js', () => ({ saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false } }));

import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';
import { NotableNPCs } from '../../src/pdf/sections/NotableNPCs.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages, esc } from '../../src/foundry/journalPages.js';
import { useStore } from '../../src/store/index.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

const STANDING_WORDS = ['commanding', 'established', 'marginal'];
const ORD = { 1: '', 2: 'second ', 3: 'third ' };

/** THE TEST'S OWN ORACLE: a power's weight here from the town's figures. @param {any} t @param {string} P @returns {string | null} */
function weightOf(t, P) {
  const rows = (t?.powerStructure?.factions || [])
    .map((/** @type {any} */ f) => ({ name: String(f?.faction || f?.name || ''), v: Number(f?.power) }))
    .filter((/** @type {any} */ r) => r.name && Number.isFinite(r.v));
  const me = rows.find((/** @type {any} */ r) => r.name === P);
  if (!me) return null;
  const above = rows.filter((/** @type {any} */ r) => r.v > me.v).length;
  const below = rows.filter((/** @type {any} */ r) => r.v < me.v).length;
  const tie = rows.some((/** @type {any} */ r) => r !== me && r.v === me.v);
  if (rows.length === 1) return 'the only power here';
  if (rows.length === 2) return tie ? 'as strong as the other power here' : above ? 'the weaker power here' : 'the stronger power here';
  const joint = tie ? 'joint ' : '';
  if (above < 3) return `the ${joint}${/** @type {any} */ (ORD)[above + 1]}strongest power here`;
  if (below === 0) return `the ${joint}weakest power here`;
  return 'one of the lesser powers here';
}
/** The powers a card stands first of, in the card line's order: the governing power, then the roster's order. @param {any} n @param {any} t */
const firstsOf = (n, t) => {
  const fs = t?.powerStructure?.factions || [];
  const gov = fs.find((/** @type {any} */ f) => f?.isGoverning)?.faction;
  const order = [...(gov ? [gov] : []), ...fs.map((/** @type {any} */ f) => f?.faction).filter((/** @type {any} */ x) => x && x !== gov)];
  const at = (/** @type {string} */ P) => { const i = order.indexOf(P); return i < 0 ? order.length : i; };
  return (Array.isArray(n?.memberships) ? n.memberships : []).filter((/** @type {any} */ m) => m?.rank === 1)
    .map((/** @type {any} */ m) => String(m.power)).sort((/** @type {string} */ a, /** @type {string} */ b) => at(a) - at(b));
};

/** @param {any} n @param {any} t */
function openCard(n, t) {
  act(() => { useStore.setState({ settlement: t, savedSettlements: [], editMode: false }); });
  const r = render(<NPCInlineCard npc={n} settlement={t} />);
  const header = r.container.querySelector('button[aria-expanded]')?.textContent || '';
  fireEvent.click(r.getByRole('button', { expanded: false }));
  const text = r.container.textContent || '';
  const standingRow = [...r.container.querySelectorAll('div')].map((d) => d.textContent || '').find((s) => s.startsWith('Standing ')) ?? null;
  const tieRows = [...r.container.querySelectorAll('[data-tie-direction]')].map((d) => ({ dir: d.getAttribute('data-tie-direction'), text: d.textContent || '' }));
  r.unmount();
  return { header, text, standingRow, tieRows };
}

const town = (/** @type {Array<[string, number]>} */ rows, /** @type {any[]} */ npcs, /** @type {any[]} */ relationships = []) => ({
  id: 'town-1', name: 'Testford', npcs, relationships,
  powerStructure: { factions: rows.map(([faction, power]) => ({ faction, power, category: 'civic' })), conflicts: [] },
  history: { age: 140, founding: null, historicalCharacter: '', eventsTimeline: [], currentTensions: [], historicalEvents: [] },
});

describe('1-2. THE CARD (fixtures): no dots, the fact under Standing, plain words for a tie held toward the card', () => {
  const ada = { id: 'npc_0', name: 'Ada Reeve', title: 'the reeve', role: 'the reeve', influence: 'high', memberships: [{ power: 'Council', rank: 1 }] };
  const bran = { id: 'npc_1', name: 'Bran Smith', title: 'the smith', role: 'the smith', influence: 'low', memberships: [{ power: 'Guilds', rank: 1 }, { power: 'Council', rank: 2 }] };
  const cole = { id: 'npc_2', name: 'Cole Ward', title: 'the warden', role: 'the warden', influence: 'moderate', memberships: [{ power: 'Council', rank: 2 }] };
  const dara = { id: 'npc_3', name: 'Dara Moss', title: 'the herbalist', role: 'the herbalist', influence: 'low' };
  const tie = { from: 'npc_1', to: 'npc_0', typeName: 'Outstanding Debt', npc1Name: 'Bran Smith', npc2Name: 'Ada Reeve', description: 'Bran owes Ada.' };
  const t = town([['Council', 60], ['Guilds', 25], ['Temple', 15]], [ada, bran, cole, dara], [tie]);

  it('the header prints no dot, whatever the stored influence', () => {
    for (const n of [ada, bran, cole, dara]) expectAbsentWithAnchor(openCard(n, t).header, '●', n.name, `${n.name}'s header dots`);
  });
  it('first of a power: "Standing first of <power>, <its weight here>"', () => {
    expect(openCard(ada, t).standingRow).toBe('Standing first of Council, the strongest power here');
    expect(openCard(bran, t).standingRow).toBe('Standing first of Guilds, the second strongest power here');
  });
  it('first of none, or in no power: no Standing row, and no standing word anywhere', () => {
    for (const n of [cole, dara]) {
      const { standingRow, text } = openCard(n, t);
      expect(standingRow, n.name).toBeNull();
      for (const w of STANDING_WORDS) expectAbsentWithAnchor(text, w, n.name, `the band word "${w}" on ${n.name}'s card`);
    }
  });
  it('a tie another holds toward the card reads in plain words; the card\'s own tie keeps its kind as its head', () => {
    const onAda = openCard(ada, t).tieRows;
    expect(onAda).toEqual([{ dir: 'calledBy', text: 'Bran Smith holds a tie to them: Outstanding Debt' }]);
    const onBran = openCard(bran, t).tieRows;
    expect(onBran.map((r) => r.dir)).toEqual(['own']);
    expect(onBran[0].text.startsWith('Outstanding Debt')).toBe(true);
    for (const n of [ada, bran]) expect(/called by/i.test(openCard(n, t).text), n.name).toBe(false);
  });

  it('3. THE NPCs TAB prints no influence tally and no influence filter', () => {
    act(() => { useStore.setState({ settlement: t, savedSettlements: [], editMode: false }); });
    const { container } = render(<NPCsTab npcs={t.npcs} settlement={t} narrativeNote={null} pinnedIds={new Set()} />);
    const text = container.textContent || '';
    const anchor = '4 Key Figures';
    expect(text).toContain(anchor);
    expectAbsentWithAnchor(text, 'high influence', anchor, 'the influence tally');
    expectAbsentWithAnchor(text, 'moderate', anchor, 'the influence tally\'s second count');
    for (const label of ['●●● High', '●● Moderate', '● Low']) expectAbsentWithAnchor(text, label, anchor, `the influence filter "${label}"`);
    expectAbsentWithAnchor(text, '●', anchor, 'any influence dot on the tab');
  });
});

describe('births: every surface prints the fact, never the band', () => {
  const SEEDS = [['r2r-thorp-0', 'thorp'], ['r2r-hamlet-3', 'hamlet'], ['r2r-village-31', 'village'], ['r2r-town-2', 'town'], ['r2r-city-0', 'city']];
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
    selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** @type {Map<string, any>} */ const born = new Map();
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    if (typeof window !== 'undefined' && !window.matchMedia) {
      // @ts-ignore jsdom has no matchMedia
      window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
    }
    for (const [seed, settType] of SEEDS) born.set(seed, generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType }), null, { seed, customContent: {} }));
  }, 300000);

  it('1. THE CARD: no dot, the oracle\'s fact under Standing or no Standing row, no band word', () => {
    let firsts = 0; let none = 0;
    expectNoSeedFailures(collectSeedFailures(SEEDS.map(([s]) => s), (seed) => {
      const t = born.get(seed);
      for (const n of t.npcs || []) {
        const { header, standingRow, text } = openCard(n, t);
        expectAbsentWithAnchor(header, '●', n.name, `${seed} ${n.name}: no dot in the header`);
        const want = firstsOf(n, t).map((P) => [P, weightOf(t, P)]).filter(([, w]) => w).map(([P, w]) => `first of ${P}, ${w}`);
        if (want.length) {
          firsts += 1;
          for (const line of want) expect(standingRow, `${seed} ${n.name}: the Standing row carries "${line}"`).toContain(line);
        } else {
          none += 1;
          expect(standingRow, `${seed} ${n.name}: first of no power, no Standing row`).toBeNull();
        }
        for (const w of STANDING_WORDS) expect(new RegExp(`Standing ${w}\\b`).test(text), `${seed} ${n.name}: no "Standing ${w}"`).toBe(false);
      }
    }), 'every card prints the fact, never the band');
    expect(firsts, 'anchored: the births hold firsts of a power').toBeGreaterThan(10);
    expect(none, 'anchored: the births hold people first of none').toBeGreaterThan(10);
  }, 600000);

  it('4-5. THE PDF and THE FOUNDRY JOURNAL: the same fact, never "Influence"', () => {
    let pdfLines = 0; let journalLines = 0;
    expectNoSeedFailures(collectSeedFailures(SEEDS.map(([s]) => s), (seed) => {
      const t = born.get(seed);
      const vm = buildViewModel({ settlement: t });
      const rows = vm.npcs?.sorted || [];
      // every person as a FULL card (the PDF's card that prints the person's key-value row) and a notable page of the
      // journal's: power raised to the major tier
      const vmFull = { ...vm, npcs: { ...vm.npcs, sorted: rows.map((/** @type {any} */ r) => ({ ...r, power: 100 })) } };
      /** @param {any} node @param {string[]} acc @returns {string[]} */
      const leaves = (node, acc = []) => {
        if (node == null || typeof node === 'boolean') return acc;
        if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
        if (Array.isArray(node)) { for (const x of node) leaves(x, acc); return acc; }
        if (typeof node.type === 'function') return leaves(node.type(node.props), acc);
        return leaves(node.props?.children, acc);
      };
      const pdf = leaves(NotableNPCs({ settlement: t, narrativeMode: false, vm: vmFull })).join('\n');
      expect(/\bInfluence\b/.test(pdf), `${seed}: the PDF prints no "Influence"`).toBe(false);
      const journal = buildJournalPages(vmFull).map((/** @type {any} */ p) => String(p.markdown)).join('\n');
      expect(/\*\*Influence:\*\*/.test(journal), `${seed}: the journal prints no "Influence"`).toBe(false);
      for (const n of t.npcs || []) {
        const want = firstsOf(n, t).map((P) => [P, weightOf(t, P)]).filter(([, w]) => w);
        for (const [P, w] of want) {
          expect(pdf, `${seed} ${n.name}: the PDF's card says first of ${P}, ${w}`).toContain(`first of ${P}, ${w}`);
          pdfLines += 1;
        }
        if (want.length) {
          const line = `- **First of:** ${esc(want.map(([P, w]) => `${P}, ${w}`).join('; '))}`;
          expect(journal.split('\n'), `${seed} ${n.name}: the journal's line "${line}"`).toContain(line);
          journalLines += 1;
        }
        for (const w of STANDING_WORDS) expect(new RegExp(`Standing:? ${w}\\b`).test(pdf + journal), `${seed}: no "Standing ${w}"`).toBe(false);
      }
    }), 'the PDF and the journal print the fact, never the band');
    expect(pdfLines, 'anchored: the PDF prints firsts').toBeGreaterThan(10);
    expect(journalLines, 'anchored: the journal prints firsts').toBeGreaterThan(10);
  }, 600000);
});
