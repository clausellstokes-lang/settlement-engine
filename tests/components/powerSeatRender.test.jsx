/**
 * @vitest-environment jsdom
 *
 * tests/components/powerSeatRender.test.jsx — the Power tab says who rules once
 * (lane RULERS, 2026-11-03; root-cause trace failure 5).
 *
 *   - "Holds power" is the ruler's word alone; a challenger reads "Contests the seat".
 *   - "Holds the title; the decisions that matter are made by …" prints only
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

// re-keyed by identity at W3 POW #189 (2026-11-08, the owner's style law: the crisis note says the one thing the banner does not).
const NOTE = 'Holds the title, but the decisions that matter are made elsewhere';
const born = (tier, i) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier }), null, { seed: `rulers-${tier}-${i}`, customContent: {} });
const tab = (s) => render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />).container;
/** Open the governing faction's roster row (one row opens at a time) so its crisis note is on the page. */
const openGoverning = (s) => fireEvent.click(screen.getByRole('button', { name: `${nameOf(governingFactionOf(s))} details` }));

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('"Holds power" is the ruler\'s word alone', () => {
  // Fixture re-seated by identity thorp 1 -> thorp 12 (LANDING-7 lane G, 2026-11-06): Register VII lit (3420d01e3, X-46 car 4)
  // re-draws the thorp rosters to one faction in most draws, so thorp 1 holds no contender (first-parent
  // bisect: green at fb5edb7f5, red from 3420d01e3).
  // Scanned rulers-thorp-0..59 in order: 4 thorps hold a contender (12, 28, 33, 42); 12 is the first.
  // Re-seated by identity thorp 12 -> thorp 28 (PEOPLE-LAND cure, 2026-11-07): lane 1 PEOPLE-1 CAST (dc655f712) re-draws
  // thorp 12 to its Elder Council alone (100), so it holds no contender (green at 262e8b255, red from dc655f712).
  // Re-scanned rulers-thorp-0..59 at the tip: 5 thorps hold a contender (28, 33, 42, 54, 57); 28 is the first.
  // Re-seated by identity thorp 28 -> thorp 57 (COHERENCE-POWERS-3, 2026-11-12): the lane's not-built rule (902378261: a
  // power of the roster's own that no house stands behind is not built) leaves thorp 28's roster with no contender (green at
  // the line f72262c68, red at 1a32c200a). Re-scanned rulers-thorp-0..59 at the tip: 1 thorp holds a contender (57).
  it('a thorp with a ruler and contenders marks the ruler once and each contender "Contests the seat"', () => {
    const s = born('thorp', 57);
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
  // Re-seated by identity thorp 3 -> thorp 12 (LANDING-7 lane G, 2026-11-06): Register VII lit (3420d01e3, X-46 car 4)
  // re-draws the thorp rosters, and thorp 3 is now its Elder Council alone, so no rival outranks it
  // (first-parent bisect: green at fb5edb7f5, red from 3420d01e3).
  // Scanned rulers-thorp-0..59 in order: 2 thorps carry the note AND an outranking rival (12: Grain
  // Holders 56 over the Elder Council 44; 42: Religious Authorities 76 over 24); 12 is the first.
  // Re-seated by identity thorp 12 -> thorp 42 (PEOPLE-LAND cure, 2026-11-07): lane 1 PEOPLE-1 CAST (dc655f712) re-draws
  // thorp 12 to its Elder Council alone, so no rival outranks it (green at 262e8b255, red from dc655f712).
  // Re-scanned rulers-thorp-0..59 at the tip: 3 carry the note AND an outranking rival (42: Religious Authorities 76
  // over the Elder Council 24; 54; 57); 42 is the first.
  // Re-seated by identity thorp 42 -> thorp 57 (COHERENCE-POWERS-3, 2026-11-12): the lane's not-built rule (902378261)
  // leaves thorp 42's Religious Authorities unbuilt (no religious house stands behind them; green at the line f72262c68, red
  // at 1a32c200a). Re-scanned rulers-thorp-0..59 at the tip: 1 carries the note AND an outranking rival (57: People's
  // Council 61 over the Elder Council 39).
  // Re-seated by the premise thorp 57 -> thorp 35 (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit (2bc483fc8, the seat and
  // fortune laws on), thorp 57's governing faction carries no crisis note. Re-scanned rulers-thorp-0..199 at the flipped
  // tip for the premise (the note AND a rival outranking the governing faction on power): 35, 73, 96, 106, 109, 136; 35
  // is the first (The Independent Bloc 78 over the Elder Council 22).
  it('names the outranking rival when one outranks the governing faction (thorp 35: The Independent Bloc)', () => {
    const s = born('thorp', 35);
    const gov = governingFactionOf(s);
    expect(String(gov.crisisNote), 'fixture premise: the generator wrote the note').toContain(NOTE);
    const rival = (s.powerStructure.factions || []).find((f) => nameOf(f) === 'The Independent Bloc');
    expect(rival?.power, 'fixture premise: the rival outranks the governing faction on power').toBeGreaterThan(gov.power);
    tab(s);
    openGoverning(s);
    const text = document.body.textContent;
    expect(text).toContain('Holds the title; the decisions that matter are made by The Independent Bloc.');
  });

  // The note carried "Governing authority is internally fractured." before #189; that reading now has one home, the
  // legitimacy panel's banner (and DS-POW-1's fractured line), so the unnamed claim leaves and the note with it.
  // Re-seated by the premise thorp 13 -> thorp 3 (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit (2bc483fc8), thorp 13's
  // governing faction carries no crisis note. Re-scanned rulers-thorp-0..199 at the flipped tip for the premise (the note
  // AND no rival outranking the governing faction): 3 is the first (its Elder Council alone, 100).
  it('drops the claim when no rival outranks the governing faction (thorp 3); the fracture reading stays in the banner', () => {
    const s = born('thorp', 3);
    expect(String(governingFactionOf(s).crisisNote), 'fixture premise: the generator wrote the note').toContain(NOTE);
    tab(s);
    openGoverning(s);
    const text = document.body.textContent;
    expect(text).toContain('Governance fractured.');
    expect(text).not.toContain('decisions that matter are made'); // anchored: the banner is asserted on this render
  });
});

describe('the vacant seat reads once', () => {
  // Premise re-stated by identity with its cause (LANDING-7 lane G, second seat, ruling R-G1, 2026-11-06):
  // since 6da7d3f64 (RUNG1-TRUTH unit D) a non-royal succession_void names its claimants from the
  // noble pool, so no faction is named "Claimant…" and the old name premise held on 0 of 1,000 thorps.
  // The vacancy is the record's own fact, the governing faction's `vacant` modifier, which
  // powerStrata.js :: rulingChainOf now reads. Scanned rulers-thorp-0..999 in order: 20 carry it;
  // thorp 11 is still the first. Its roster names no claimant, so the absence line is the unsettled one.
  it('thorp 11 (a claimant vacancy) never renders "The seat The seat"', () => {
    const s = born('thorp', 11);
    expect(governingFactionOf(s)?.modifiers || [], 'fixture premise: the governing seat is vacant').toContain('vacant');
    tab(s);
    const chain = screen.getByTestId('ruling-chain');
    const words = chain.innerText ?? chain.textContent;
    // Re-keyed by identity (COHERENCE-POWERS-3, F7: the seat row names who keeps the empty seat, in the caretaker's form)
    expect(screen.getByTestId('ruling-chain-absence').textContent).toBe('Stands empty; the succession is unsettled. Acting Elder Karima al-Hassan keeps the seat meanwhile.');
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
