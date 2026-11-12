/**
 * seatKeeper.test.js — COHERENCE-POWERS-3, F7 (REVIEW-POWERS-1a32c200a-2026-11-12): WHERE THE SEAT STANDS EMPTY NO ONE
 * PRINTS AS HOLDING THE OFFICE. In a succession void the governing power's first is its caretaker: the card, the seat's
 * house's Connection row and the Power tab's seat row print the caretaker's form ("Acting <the office>"; a crown's
 * "Regent"; the chair's ruling of 2026-11-12, the owner's to veto), and the three agree. Before this cure all 194 vacant
 * births on both corpora printed the office as held beside a seat row that called it empty.
 *
 * Also: the Connection row never repeats a title a disambiguated name already carries ("First Councillor Gebhard
 * Schneider (the exchange master), the exchange master": 7 rows on both corpora before).
 *
 * The expectations are literals. Births go through birthConfig with the browser's dials.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';
import { caretakerFormOf, cardPowerLine, governingNameOf } from '../../../src/domain/people/cardPowers.js';
import { seatKeeperOf } from '../../../src/domain/people/seatKeeper.js';
import { connectionOf, shownHonorificOf } from '../../../src/domain/people/seatKeeperDisplay.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const CARETAKER = /^(Acting [A-Z]|Regent\b)/;
const voidBirth = (seed, settType) => generateSettlementPipeline(
  birthConfig({ ...DIALS, settType, selectedStresses: ['succession_void'], selectedStressesRandom: false }), null, { seed, customContent: {} });

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('COHERENCE-POWERS-3 F7 — the empty seat\'s keeper', () => {
  it('the caretaker\'s forms, as ruled', () => {
    expect(caretakerFormOf('Burgomaster', 'Merchant Council')).toBe('Acting Burgomaster');
    expect(caretakerFormOf('Lord Protector of the Faith', 'High Theocratic Council')).toBe('Acting Lord Protector of the Faith');
    expect(caretakerFormOf('Queen', 'Royal Authority')).toBe('Regent');
    expect(caretakerFormOf('King', 'Royal Authority')).toBe('Regent');
    expect(caretakerFormOf('Regent', 'Noble Regency')).toBe('Regent');
    expect(caretakerFormOf('Eldest', 'Free Elder Council')).toBe('Acting Elder');
    expect(caretakerFormOf('Eldest', 'Household Council')).toBe('Acting Household Elder');
    expect(caretakerFormOf('Starosta', 'Elder Council')).toBe('Acting Starosta');
    expect(caretakerFormOf('', 'Town Council')).toBe('');
  });

  it('every vacant seat on a corpus of six sizes: no place prints the office as held, and the three agree', () => {
    const misses = [];
    let vacant = 0;
    for (const settType of TIERS) for (let i = 0; i < 6; i++) {
      const seed = `f7g-${settType}-${i}`;
      const s = voidBirth(seed, settType);
      const keeper = seatKeeperOf(s);
      if (!keeper) continue;
      vacant += 1;
      const seat = String(rulingChainOf(s).absence?.line || '');
      const line = cardPowerLine(keeper, [], governingNameOf(s), true);
      const hat = /^[A-Z]/.test(line) && line.includes(', first of ');
      const cardForm = hat ? line.split(', first of ')[0] : shownHonorificOf(keeper, s);
      if (!CARETAKER.test(cardForm)) misses.push(`${seed}: the card prints "${cardForm}"`);
      if (!seat.includes(`${cardForm} ${keeper.name}`) || !seat.endsWith(' keeps the seat meanwhile.')) misses.push(`${seed}: the seat row reads "${seat}"`);
      const connection = connectionOf(keeper, s, hat);
      if (!connection.name.startsWith(`${cardForm} `)) misses.push(`${seed}: the Connection row reads "${connection.name}"`);
    }
    expect(vacant).toBeGreaterThan(20);
    expect(misses).toEqual([]);
  }, 120_000);

  it('the review\'s Grudino: a vacant crown is kept by its regent, in all three places', () => {
    const s = voidBirth('rvf-succession_void-city-4', 'city');
    expect(rulingChainOf(s).absence?.line).toBe('Stands empty; 2 claimants circle: Noble Claimant (Senior Line), Noble Claimant (Reform Line). Regent Biljana Nikolić keeps the seat meanwhile.');
    const keeper = seatKeeperOf(s);
    expect(shownHonorificOf(keeper, s)).toBe('Regent');
    expect(connectionOf(keeper, s, false).name).toBe('Regent Biljana Nikolić');
  });

  it('a held seat prints its office, and a disambiguated name\'s title is printed once', () => {
    const face = { id: 'npc_x', name: 'Gebhard Schneider (the exchange master)', title: 'the exchange master', role: 'First Councillor',
      institution: { kind: 'house', key: 'Merchant exchange', title: 'the exchange master' }, memberships: [{ power: 'City-State Council', rank: 1 }] };
    const held = { powerStructure: { factions: [{ faction: 'City-State Council', isGoverning: true, power: 100 }] }, npcs: [face], institutions: [] };
    expect(connectionOf(face, held, true)).toEqual({ name: 'First Councillor Gebhard Schneider (the exchange master)', tail: '' });
    const empty = { ...held, powerStructure: { factions: [{ faction: 'City-State Council', isGoverning: true, power: 100, modifiers: ['vacant'] }] } };
    expect(connectionOf(face, empty, true).name).toBe('Acting First Councillor Gebhard Schneider (the exchange master)');
    expect(cardPowerLine(face, [], 'City-State Council', false)).toBe('First Councillor, first of City-State Council');
  });
});
