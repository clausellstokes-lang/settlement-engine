/** @vitest-environment jsdom */
/**
 * R2-CODE-B item 4 — A MARKET TRADITION PRINTS ONLY WHERE A MARKET STANDS (the cold list
 * REVIEW-W2A-3, f385d487b: MEDIUM #536 "The Market Contest" on the Traditions tab of a village whose
 * Overview reads "No market or fair stands in Amarabad"; `compound.inst.hasMarket` false).
 * The Market element declares `market` (traditionCorpus.js), the tab's filterDeclared reads it, as
 * the water elements already do. Display only: genesis reads no declaration, the record is untouched.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

afterEach(cleanup);

const BASE = { name: 'Amarabad', _seed: 'tab-market-1', tier: 'village', population: 105, config: { culture: 'south_asian', terrainType: 'plains', tradeRouteAccess: 'road' } };
const recs = deriveFoundingTraditions(BASE);
const withElement = (rec, element, name) => ({ ...rec, name, coreMotif: { ...rec.coreMotif, element } });
const MIRROR = [withElement(recs[0], 'market', 'The Market Contest'), withElement(recs[1] || recs[0], 'hearth', 'The Hearth Night')];
const NO_MARKET = { ...BASE, institutions: [{ name: 'Dwellings (20-60)' }], economicState: { compound: { inst: { hasMarket: false } } } };
const MARKET = { ...BASE, institutions: [{ name: 'Weekly market' }], economicState: { compound: { inst: { hasMarket: true } } } };

describe('the Market row and the market fact', () => {
  it('the fixtures read as the market home reads them', () => {
    expect(factsOf(NO_MARKET).market).toBe(false);
    expect(factsOf(MARKET).market).toBe(true);
  });
  it('no market: the Market Contest is not printed; the Hearth stands', () => {
    render(<TraditionsTab settlement={{ ...NO_MARKET, traditions: MIRROR }} />);
    const text = screen.getByTestId('traditions-tab').textContent;
    expect(text).toMatch(/The Hearth Night/);
    expect(text).not.toMatch(/The Market Contest/); // anchored: The Hearth Night is matched in this same tab text above
  });
  it('a market: the Market Contest stands', () => {
    render(<TraditionsTab settlement={{ ...MARKET, traditions: MIRROR }} />);
    expect(screen.getByTestId('traditions-tab').textContent).toMatch(/The Market Contest/);
  });
});
