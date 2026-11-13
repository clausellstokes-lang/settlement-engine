/**
 * seatHolderCard.test.js — COHERENCE-POWERS-5 (REVIEW-POWERS-2 at e86d069be, N1–N3; the chair's ruling to the fifth seat).
 * The owner's principle: whoever leads the town is ELEVATED, YET STILL TIED to the institution they come from. The
 * dual hat tied the leader to a house; the review found the elevation lost on the leader's own card.
 *
 * N1 — THE SEAT-HOLDER'S CARD IS KEYED ON HOLDING THE SEAT. The person the seat's own home names
 * (powerStrata.js :: rulingChainOf, the Power tab's seat row) reads the seat's row for the record's condition
 * ("Holds the seat …"), never a row that makes them a subordinate; a dual-hat holder's house follows, second, in the
 * words the seat row already prints ("Still the boat-headman as well.").
 *
 * Births through birthConfig with the census's dials (DEFAULT_CONFIG and the browser's random dials, the review's
 * own seeds): literals, read from the record.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { rulingChainOf } from '../../../src/domain/dossier/powerStrata.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const CRISES = Object.freeze(['under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed',
  'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion',
  'slave_revolt', 'wartime', 'mass_migration']);

/** The census's cfgFor (docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/births.mjs), so a review town is the review's. */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  const cfg = m
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] })
    : (m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/))
      && birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  if (!cfg) throw new Error(seed);
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

/** The seat's rows' openings (npcStructure.js, government × condition × dominant), literals. */
const HOLDS = /^Holds the seat\b/;
/** Every row that places its holder under the seat, an office or a greater house (the review's C1 list and its kin). */
const SUBORDINATE = /(^|\. )(Heads an old family while the seat|Serves the faith under its leaders|Belongs to a lesser|Runs a smaller house|Leads a squad|Works spells under|Holds an office|Holds a place)/;

/** @param {any} s */
const holderOf = (s) => {
  const name = rulingChainOf(s).npc?.name;
  return name ? (s.npcs || []).find((c) => c.name === name) || null : null;
};
/** @param {any} c the dual-hat holder's office (castPowers.js FLOOR 1 writes it to `role` beside the house's `title`) */
const officeOf = (c) => (c?.institution?.kind === 'house' && c.role && c.role !== c.title && c.role !== c.institution.title ? c.role : null);

/** N1's misses in one birth. @param {any} s @param {string} key */
function n1MissesOf(s, key) {
  const c = holderOf(s);
  if (!c) return [];
  const p = String(c.structuralPosition || '');
  const out = [];
  if (!HOLDS.test(p)) out.push(`${key}: ${c.name} (${c.role}) does not hold the seat on the card: "${p || '(no position)'}"`);
  if (SUBORDINATE.test(p)) out.push(`${key}: ${c.name} reads as a subordinate: "${p}"`);
  if (officeOf(c) && c.title && !p.endsWith(`Still ${c.title} as well.`)) out.push(`${key}: ${c.name}'s house (${c.title}) is not second on the card: "${p}"`);
  return out;
}

/**
 * N2 — THE HIGHER OF THE TWO HATS: the holder's influence is never below the office's. The office's band is the one
 * the seat's own face draws through at each size (poolMap.js :: SEAT_ROLE_BY_TIER: an Elder in a thorp or hamlet, a
 * Mayor or Governor above), a literal here: the line read every village-to-metropolis leader high (480 of 480).
 */
const OFFICE_BAND = Object.freeze({ thorp: 'low', hamlet: 'low', village: 'high', town: 'high', city: 'high', metropolis: 'high' });
const BAND = Object.freeze({ low: 0, moderate: 1, high: 2 });
/** N2's misses in one birth. @param {any} s @param {string} key */
function n2MissesOf(s, key) {
  const c = holderOf(s);
  if (!c) return [];
  const want = OFFICE_BAND[s.tier];
  return BAND[c.influence] >= BAND[want] ? [] : [`${key}: ${c.name} (${c.role}) reads ${c.influence} (power ${c.power}) under a ${want} office`];
}

describe('COHERENCE-POWERS-5 — the seat-holder\'s card (REVIEW-POWERS-2 N1–N3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  it('N1: the review\'s four towns — the holder reads the seat\'s row, office first, house second', () => {
    const cases = {
      'r2r-thorp-0': 'Cosij Chan',
      'r2s-insurgency-town-0': 'Ghazi al-Rumi',
      'r2s-occupied-city-0': 'Guta Hoffmann',
      'r2r-city-0': 'Varvara Vorobev',
    };
    const misses = [];
    for (const [seed, name] of Object.entries(cases)) {
      const s = born(seed);
      const c = holderOf(s);
      if (c?.name !== name) misses.push(`${seed}: the seat row names ${c?.name}, not ${name}`);
      misses.push(...n1MissesOf(s, seed));
    }
    expect(misses).toEqual([]);
  }, 120_000);

  it('N1: at every size, random and under every crisis — every holder holds the seat on the card and is no one\'s subordinate', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 8; i++) misses.push(...n1MissesOf(born(`r2r-${t}-${i}`), `r2r-${t}-${i}`));
      for (const x of CRISES) misses.push(...n1MissesOf(born(`r2s-${x}-${t}-0`), `r2s-${x}-${t}-0`));
    }
    expect(misses).toEqual([]);
  }, 600_000);

  it('N2: the review\'s two towns — the city\'s Lord Burgomaster and the town\'s Archmage read high', () => {
    const misses = [];
    for (const [seed, name] of Object.entries({ 'r2r-city-0': 'Varvara Vorobev', 'r2r-town-1': 'Tabassum al-Dimashqi' })) {
      const s = born(seed);
      const c = holderOf(s);
      if (c?.name !== name) misses.push(`${seed}: the seat row names ${c?.name}, not ${name}`);
      else if (c.influence !== 'high' || !(c.power >= 8 && c.power <= 10)) misses.push(`${seed}: ${name} reads ${c.influence} (power ${c.power})`);
    }
    expect(misses).toEqual([]);
  }, 120_000);

  it('N2: at every size, random and under every crisis — no holder reads below the office', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 8; i++) misses.push(...n2MissesOf(born(`r2r-${t}-${i}`), `r2r-${t}-${i}`));
      for (const x of CRISES) misses.push(...n2MissesOf(born(`r2s-${x}-${t}-0`), `r2s-${x}-${t}-0`));
    }
    expect(misses).toEqual([]);
  }, 600_000);
});
