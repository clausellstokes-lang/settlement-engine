/** @vitest-environment jsdom */
/**
 * NOLANE-2, BAR-169/170 — A FAIR IS PRINTED ONLY WHERE A MARKET STANDS. 65 of the 278 births that kept a "… Fair" printed
 * it on the Traditions tab beside the Overview's own "No market or fair stands". The ACT `fair` presumes the market the
 * Overview's market line reads (`market`, the vocabulary's market atom, facts/market.js), as the Market ELEMENT already
 * does (traditionsTabMarketRow.test.jsx). Display only: genesis reads no declaration, the record is untouched.
 *
 * Arms: a fixture pair (no market / a market: the guard), and a collected arm over census births (SECOND-WAVE-CENSUS
 * dials): every birth whose founding set holds a fair prints it exactly where `factsOf(...).market` is true.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

afterEach(cleanup);

const BASE = { name: 'Amarabad', _seed: 'tab-fair-1', tier: 'village', population: 105, config: { culture: 'south_asian', terrainType: 'plains', tradeRouteAccess: 'road' } };
const recs = deriveFoundingTraditions(BASE);
const asMotif = (rec, element, act, name) => ({ ...rec, name, coreMotif: { ...rec.coreMotif, element, act } });
const MIRROR = [asMotif(recs[0], 'harvest', 'fair', 'The Harvest Fair'), asMotif(recs[1] || recs[0], 'hearth', 'feast', 'The Hearth Night')];
const NO_MARKET = { ...BASE, institutions: [{ name: 'Dwellings (20-60)' }], economicState: { compound: { inst: { hasMarket: false } } } };
const MARKET = { ...BASE, institutions: [{ name: 'Weekly market' }], economicState: { compound: { inst: { hasMarket: true } } } };

describe('the fair act and the market fact', () => {
  it('no market: the Harvest Fair is not printed; the Hearth Night stands', () => {
    expect(factsOf(NO_MARKET).market).toBe(false);
    render(<TraditionsTab settlement={{ ...NO_MARKET, traditions: MIRROR }} />);
    const text = screen.getByTestId('traditions-tab').textContent;
    expect(text).toMatch(/The Hearth Night/);
    expect(text).not.toMatch(/The Harvest Fair/); // anchored: The Hearth Night is matched in this same tab text above
  });
  it('a market: the same Harvest Fair stands (the guard town)', () => {
    expect(factsOf(MARKET).market).toBe(true);
    render(<TraditionsTab settlement={{ ...MARKET, traditions: MIRROR }} />);
    expect(screen.getByTestId('traditions-tab').textContent).toMatch(/The Harvest Fair/);
  });
});

describe('births: a fair prints exactly where a market stands', () => {
  it('every birth whose founding set holds a fair', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    await loadGenerationLawPayloads();
    const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true,
      selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    let withFair = 0; let withFairNoMarket = 0; let withFairMarket = 0;
    for (let i = 0; i < 40 && (withFairNoMarket < 3 || withFairMarket < 2); i++) {
      for (const settType of ['thorp', 'village', 'city']) {
        const seed = `r2r-${settType}-${i}`;
        const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType }), null, { seed, customContent: {} });
        const fairs = deriveFoundingTraditions(town).filter((r) => r?.coreMotif?.act === 'fair');
        if (!fairs.length) continue;
        withFair++;
        const market = factsOf(town).market === true;
        market ? withFairMarket++ : withFairNoMarket++;
        render(<TraditionsTab settlement={town} />);
        const text = screen.queryByTestId('traditions-tab')?.textContent || '';
        cleanup();
        for (const f of fairs) expect(text.includes(f.name), `${seed} (${market ? 'a market' : 'no market'}): "${f.name}"`).toBe(market);
      }
    }
    expect(withFair, 'anchored: the births keep fairs').toBeGreaterThan(2);
    expect(withFairMarket, 'the guard: a fair in a town with a market still prints').toBeGreaterThan(0);
    expect(withFairNoMarket, 'the arm: a fair in a town with no market').toBeGreaterThan(0);
  }, 240000);
});
