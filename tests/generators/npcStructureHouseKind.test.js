/**
 * npcStructureHouseKind.test.js — COHERENCE-POWERS-7 (needed by the chair's R1): THE HEAD OF THE STRONGEST POWER OF ITS OWN
 * KIND IS NEVER "BEHIND THE LEADING ONE". The trade's and the old families' subordinate rows ("Runs a smaller house behind
 * the leading one in the trade", "Belongs to a lesser old family, behind the leading one.") were dealt by a rank read
 * against the RULER (npcStructure.js :: getRank: the strongest of its category AND within reach of the governing power), so
 * the head of the strongest trading power, short of the ruler's weight, read that a house of its trade led it (r2r-hamlet-20
 * and 70 more of the census's 720), and a lord minted in the old families' category (R1) would read that an old family led
 * the body it heads. Such a card reads its kind's head row ("Heads the leading house in the trade …", "Heads an old
 * family …"); every other card keeps getRank. Draw-free (a T lookup).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const DIALS = Object.freeze({ tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' });
/** @param {string} t @param {string} seed */
const born = (t, seed) => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: t }), null, { seed, customContent: {} });
const KIND = /** @type {Record<string, string>} */ ({ economy: 'economy', other: 'noble' });

/** Cards heading the strongest power of their own kind that still read "behind the leading one". @param {any} s */
function headsBehind(s) {
  const fac = s.powerStructure.factions;
  return s.npcs.filter((c) => {
    const kind = KIND[c.category]; if (!kind) return false;
    const first = (c.memberships || []).find((m) => m.rank === 1); const mine = first && fac.find((f) => f.faction === first.power);
    if (!mine || mine.category !== kind) return false;
    if (!fac.filter((f) => f.category === kind).every((f) => (f.power || 0) <= (mine.power || 0))) return false;
    return /behind the leading one|smaller house|lesser (old )?family/.test(String(c.structuralPosition || ''));
  }).map((c) => `${c.name} (${c.title}): ${c.structuralPosition}`);
}

describe('COHERENCE-POWERS-7 · the head of its kind\'s strongest power reads its kind\'s head row', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it.each([['hamlet', 'r2r-hamlet-20'], ['town', 'r2r-town-3'], ['city', 'r2r-city-5'], ['village', 'r2r-village-8']])('%s %s', (t, seed) => {
    expect(headsBehind(born(t, seed))).toEqual([]);
  }, 60_000);
});
