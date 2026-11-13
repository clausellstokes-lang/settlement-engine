/** @vitest-environment jsdom */
/**
 * traditionsTabWaterRows.test.jsx — CENSUS-3b unit 5 (R6): the Traditions tab prints only the
 * ADMISSIBLE rows. The three water-keyed motif elements declare the water they presume
 * (`traditionCorpus.js :: TRADITION_ELEMENTS` `needs`: First Landing `navigable`, River `river`,
 * Tide `coast`), and the tab filters its list through `filterDeclared` against `factsOf`. No
 * weight moves (genesis is CENSUS-1c's): the record is untouched, only the printed list.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { TRADITION_ELEMENTS } from '../../src/data/traditionCorpus.js';

afterEach(cleanup);

const BASE = { name: 'Drywell', _seed: 'tab-water-1', tier: 'town', population: 2400, config: { culture: 'germanic', terrainType: 'plains', tradeRouteAccess: 'road' } };
const recs = deriveFoundingTraditions({ ...BASE, config: { ...BASE.config, terrainType: 'riverside', tradeRouteAccess: 'river' } });
const withElement = (rec, element, name) => ({ ...rec, name, coreMotif: { ...rec.coreMotif, element } });
const MIRROR = [withElement(recs[0], 'tide', 'The Fair of the Tide'), withElement(recs[1] || recs[0], 'hearth', 'The Hearth Night'), withElement(recs[0], 'river', 'The River Blessing')];

describe('the water-keyed rows print only where the water is', () => {
  // RE-KEYED (R2-CODE-B item 4, the cold list REVIEW-W2A-3 #536): the Market element declares its market too.
  it('declares exactly the three water elements, and the market', () => {
    const declared = Object.fromEntries(TRADITION_ELEMENTS.filter((e) => e.needs).map((e) => [e.id, e.needs]));
    expect(declared).toEqual({ 'first-landing': ['navigable'], river: ['river'], tide: ['coast'], market: ['market'] });
  });
  it('a plains road prints neither the Tide nor the River; the Hearth stands', () => {
    render(<TraditionsTab settlement={{ ...BASE, traditions: MIRROR }} />);
    const text = screen.getByTestId('traditions-tab').textContent;
    expect(text).toMatch(/The Hearth Night/);
    expect(text).not.toMatch(/The Fair of the Tide/); // anchored: The Hearth Night is matched in this same tab text above
    expect(text).not.toMatch(/The River Blessing/); // anchored: same tab text as the Hearth Night match above
  });
  it('a coast prints the Tide; a river prints the River', () => {
    render(<TraditionsTab settlement={{ ...BASE, config: { ...BASE.config, terrainType: 'coastal', tradeRouteAccess: 'port' }, traditions: MIRROR }} />);
    expect(screen.getByTestId('traditions-tab').textContent).toMatch(/The Fair of the Tide/);
    cleanup();
    render(<TraditionsTab settlement={{ ...BASE, config: { ...BASE.config, terrainType: 'riverside', tradeRouteAccess: 'river' }, traditions: MIRROR }} />);
    const t = screen.getByTestId('traditions-tab').textContent;
    expect(t).toMatch(/The River Blessing/);
    expect(t).not.toMatch(/The Fair of the Tide/); // anchored: The River Blessing is matched in this same tab text on the line above
  });
});
