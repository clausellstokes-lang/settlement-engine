/**
 * faceHonorificsHolder.test.js — TAIL-TITLES-2 KT1 (the chair's ruling of 2026-11-15 02:12 UTC; vetoable by the owner):
 * THE HONORIFIC TAKES THE HOLDER'S WORD. The Institutions tab's connection line prints a face's honorific before its
 * holder's name (domain/people/cardDoor.js :: faceNameOf, from data/faceHonorifics.js :: FACE_HONORIFICS). The pools of
 * seven faces held a sexed word as a plain string, read for every holder: a woman "Frontman", "Ferryman", "Foreman",
 * "Headman", "Spokesman"; a man "Mother" (174 of the census's 720 at b30c1b7aa). K-C's law: ONE FACE, ONE WORD across the
 * title, the role and the honorific: where K-C gave a holder a word (data/holderTitleForms.js), the pool's form for that
 * holder is the same word. Display only: the pick (pickVariant over the card id and the house) and every pool's length
 * are unchanged, so no draw and no record byte moves.
 *
 * Births through the census's births (DEFAULT_CONFIG and the browser's dials; an r2s- seed adds its one stress). MOVE: the
 * line must NOT open on the old word; each names the line that prints instead. KEEP: a holder of the face's own sex, and a
 * woman whose pick is the pool's other, unsexed form, print exactly what they did.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { faceNameOf } from '../../src/domain/people/cardDoor.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
/** @type {Map<string, any>} */
const births = new Map();
/** The census's seed r2r-<size>-<i> or r2s-<stress>-<size>-<i>, born once. @param {string} seed */
function born(seed) {
  if (!births.has(seed)) {
    const r = seed.match(/^r2r-(\w+)-\d+$/);
    const s = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
    if (!r && !s) throw new Error(seed);
    const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
      : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [s?.[1]], selectedStressesRandom: false, settType: s?.[2] };
    births.set(seed, generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} }));
  }
  return births.get(seed);
}
/** The connection line's name for the card of `name`, and the card. @param {string} seed @param {string} name */
function lineOf(seed, name) {
  const s = born(seed);
  const card = (s.npcs || []).find((/** @type {any} */ c) => c.name === name) || null;
  return { card, line: card ? faceNameOf(card, s) : null };
}

/** [seed, name, gender, the face, the old word (must not open the line), the line that prints instead]. */
const MOVE = Object.freeze([
  ['r2r-town-12', 'Shahd al-Kindi', 'female', 'the front man', 'Frontman', 'Nominal Owner Shahd al-Kindi'],
  ['r2r-village-2', 'Cveta Klimov', 'female', 'the ferryman', 'Ferryman', 'Ferry Keeper Cveta Klimov'],
  ['r2r-thorp-3', 'Borchigid Kiyad', 'female', 'the boat-headman', 'Headman', 'Boat-Master Borchigid Kiyad'],
  ['r2r-thorp-35', 'Messalina Maximus', 'female', 'the camp foreman', 'Foreman', 'Overseer Messalina Maximus'],
  ['r2s-insurgency-hamlet-0', 'Eirenika Comnenus', 'female', 'the headman', 'Headman', 'Chief Eirenika Comnenus'],
  ['r2s-mass_migration-hamlet-0', 'Plotina Varro', 'female', "the newcomers' spokesman", 'Spokesman', 'Speaker Plotina Varro'],
  ['r2r-city-3', 'Emmanuel Chrysoberges', 'male', 'the foundling-mother', 'Mother', 'Keeper Emmanuel Chrysoberges'],
]);
/** [seed, name, gender, the face, the line that still prints]. */
const KEEP = Object.freeze([
  ['r2r-town-11', 'Patrick MacNamara', 'male', 'the front man', 'Frontman Patrick MacNamara'],
  ['r2r-village-5', 'Jassim al-Farabi', 'male', 'the ferryman', 'Ferryman Jassim al-Farabi'],
  ['r2r-thorp-0', 'Cosij Chan', 'male', 'the boat-headman', 'Headman Cosij Chan'],
  ['r2r-thorp-0', 'Cuauhtli Ahau', 'male', 'the camp foreman', 'Foreman Cuauhtli Ahau'],
  ['r2r-town-10', 'Tamara al-Hassan', 'female', 'the foundling-mother', 'Mother Tamara al-Hassan'],
  ['r2r-hamlet-43', 'Indira Chatterjee', 'female', 'the headman', 'Mukhiya Indira Chatterjee'], // the culture's own word, unsexed
]);

describe('TAIL-TITLES-2 KT1 · the honorific takes the holder\'s word (one face, one word)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('MOVE (every row) seed · name (gender, face): the line does not open on the old word', () => {
    expectNoSeedFailures(collectSeedFailures(MOVE, ([seed, name, gender, face, old, now]) => {
      const { card, line } = lineOf(seed, name);
      expect(card?.gender).toBe(gender);
      expect(card?.institution?.title).toBe(face);
      expect(String(line).startsWith(`${old} `)).toBe(false);
      expect(line).toBe(now);
    }), 'MOVE: each holder\'s line does not open on the old word and prints the line named instead');
  });
  it('KEEP (every row) seed · name (gender, face) prints the line it printed', () => {
    expectNoSeedFailures(collectSeedFailures(KEEP, ([seed, name, gender, face, still]) => {
      const { card, line } = lineOf(seed, name);
      expect(card?.gender).toBe(gender);
      expect(card?.institution?.title).toBe(face);
      expect(line).toBe(still);
    }), 'KEEP: each holder\'s line still prints exactly what it did');
  });
});
