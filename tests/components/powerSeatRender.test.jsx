/**
 * @vitest-environment jsdom
 *
 * tests/components/powerSeatRender.test.jsx — the Power tab says who rules once
 * (lane RULERS, 2026-11-03; root-cause trace failure 5).
 *
 *   - "Holds power" is the ruler's word alone; a challenger reads "Contests the seat".
 *   - "The faction that appears to govern is not the faction that governs" prints only
 *     when a rival outranks the governing faction on the power figures, and names it.
 *   - The vacant seat's row never reads "The seat The seat".
 * Seeds are the probe's (scratchpad probes/rulers/seat120.mjs) on the app's birth path.
 */
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { derivePowerStrata } from '../../src/domain/dossier/powerStrata.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';

afterEach(cleanup);

const NOTE = 'The faction that appears to govern is not the faction that governs';
const born = (tier, i) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed: `rulers-${tier}-${i}`, customContent: {} });
const tab = (s) => render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />).container;
/** Open the governing faction's roster row (one row opens at a time) so its crisis note is on the page. */
const openGoverning = (s) => fireEvent.click(screen.getByRole('button', { name: `${nameOf(governingFactionOf(s))} faction details` }));

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('"Holds power" is the ruler\'s word alone', () => {
  it('a thorp with a ruler and contenders marks the ruler once and each contender "Contests the seat"', () => {
    const s = born('thorp', 1);
    const { powers } = derivePowerStrata(s);
    const contenders = powers.filter((p) => p.role === 'contender');
    expect(contenders.length, 'fixture premise: contenders press the seat').toBeGreaterThan(0);
    const text = tab(s).textContent;
    expect(text.split('↑ Holds power').length - 1).toBe(1);
    expect(text.split('Contests the seat').length - 1).toBe(contenders.length);
    for (const c of contenders) expect(screen.getByRole('button', { name: new RegExp(`^${c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} contests the seat`) })).toBeTruthy();
  });
});

describe('the governs note names the rival or goes', () => {
  // Fixture re-pointed thorp 1 → thorp 3 (TIPFIX, 2026-11-03): FOOD-2's base numbers (a7f13fef,
  // foodBalance.js :: grownShareOf / hinterlandShareOf) feed thorp 1, so its governance is no longer
  // fractured and the generator writes no crisis note for it (Religious Authorities 53 still outrank
  // the Elder Council 22). Thorp 3 is the first rulers-thorp-<i> whose governing faction carries the
  // note AND is outranked: People's Council 39 over the Elder Council 26.
  it('names the outranking rival when one outranks the governing faction (thorp 3: People\'s Council)', () => {
    const s = born('thorp', 3);
    const gov = governingFactionOf(s);
    expect(String(gov.crisisNote), 'fixture premise: the generator wrote the note').toContain(NOTE);
    const rival = (s.powerStructure.factions || []).find((f) => nameOf(f) === "People's Council");
    expect(rival?.power, 'fixture premise: the rival outranks the governing faction on power').toBeGreaterThan(gov.power);
    tab(s);
    openGoverning(s);
    const text = document.body.textContent;
    expect(text).toContain(`${NOTE}; the real decisions rest with People's Council.`);
  });

  it('drops the claim when no rival outranks the governing faction (thorp 13), keeping the fracture reading', () => {
    const s = born('thorp', 13);
    expect(String(governingFactionOf(s).crisisNote), 'fixture premise: the generator wrote the note').toContain(NOTE);
    tab(s);
    openGoverning(s);
    const text = document.body.textContent;
    expect(text).toContain('Governing authority is internally fractured.');
    expect(text).not.toContain('appears to govern'); // anchored: the same note's first sentence is asserted on this render
  });
});

describe('the vacant seat reads once', () => {
  it('thorp 11 (a claimant vacancy) never renders "The seat The seat"', () => {
    const s = born('thorp', 11);
    expect((s.powerStructure.factions || []).some((f) => /claimant/i.test(nameOf(f))), 'fixture premise: claimant vacancy').toBe(true);
    tab(s);
    const chain = screen.getByTestId('ruling-chain');
    const words = chain.innerText ?? chain.textContent;
    expect(screen.getByTestId('ruling-chain-absence').textContent).toMatch(/^Stands empty; 2 claimants circle: Claimant Bloc A, Claimant Bloc B\.$/);
    expect(words.replace(/\s+/g, ' ')).not.toMatch(/The seat ?The seat/); // anchored: the absence row is asserted on this render
  });

  it('thorp 11 says the vacancy once: the seat row\'s "Stands empty", no faction-row clause beside it (chair ruling b)', () => {
    const s = born('thorp', 11);
    tab(s);
    const text = screen.getByTestId('ruling-chain').textContent;
    expect(text).toContain('Stands empty;');
    expect(text.match(/stands (empty|vacant)|vacan(t|cy)/gi)).toHaveLength(1);
  });
});
