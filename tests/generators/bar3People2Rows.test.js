/**
 * bar3People2Rows.test.js — BAR3-PEOPLE-2 (REVIEW-BAR-3 and the wide read; the chair's directions P1, P4 and P6 of
 * 2026-11-15 and its grant PG1, vetoable by the owner), on births:
 *   THE PAIR HAS ONE DEBT (P1, C35097): an old-debt tie (debtor first) whose second card's own secret says it owes the
 *   first is written with the two exchanged (`npcData.js :: secretOwes`); the index is not moved.
 *   A POWER'S NAME IN A SECRET IS ITS SENTENCE NAME (P4, C5844): the crisis secret's {faction} slot reads
 *   `powerSentenceName.js`, never the roster's label "Military/Guard".
 *   A PERSONAL HONORIFIC THAT NAMES A SEX TAKES THE HOLDER'S FORM (P6, C33899, C35020): "Dairyman", "Goodman", "Tollman",
 *   "Brother Hospitaller", "Merchant Prince" are a man's; a woman takes "Dairy Farmer", "Goodwife", "Toll-Keeper",
 *   "Sister Hospitaller", "Merchant Princess". An office's title (Lord Mayor) is the office's and is untouched.
 * RED AT THE BASE (52f0a1684): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { FACE_HONORIFICS } from '../../src/data/faceHonorifics.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shapes (r2r-, r2s-) @param {string} seed */
function born(seed) {
  const plain = seed.match(/^r2r-(\w+)-\d+$/);
  const stressed = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (!plain && !stressed) throw new Error(`no shape for ${seed}`);
  const cfg = plain ? { ...DEFAULT_CONFIG, ...DIALS, settType: plain[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [stressed?.[1]], selectedStressesRandom: false, settType: stressed?.[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** [town, the text that must not print in the ties and secrets, what prints in its place] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2s-religious_conversion-village-0', 'Wilhelm Hoffmann owes Roswitha Becker for an old kindness.', 'Roswitha Becker owes Wilhelm Hoffmann for an old kindness.'],
  ['r2s-mass_migration-thorp-2', "Ivana Sidorov kept Kateryna Kozlov's name out of a scandal", "Kateryna Kozlov kept Ivana Sidorov's name out of a scandal"],
  ['r2s-famine-village-3', 'export decisions made by Military/Guard', 'export decisions made by The Guard'],
]);
/** KEEP: [town, a true line that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-village-29', "Lofn Halfdarson paid Thorstein Ljotsson's bail eleven years ago"], // the debtor's own secret agrees
  ['r2r-village-24', 'export decisions made by Elder Council'], // a name with no slash is its own sentence name
]);
/** P6: [town, card, the honorific refused, the honorific it takes] */
const HONORIFICS = /** @type {Array<[string, string, string, string]>} */ ([
  ['r2r-hamlet-2', 'Zipna Caan', 'Dairyman', 'Dairy Farmer'],
  ['r2r-city-3', 'Xenodoche Kataphloron', 'Merchant Prince', 'Merchant Princess'],
]);
/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const seeds = new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0]), ...HONORIFICS.map((r) => r[0])]);
  for (const seed of seeds) towns[seed] = born(seed);
}, 600000);

/** the ties' text and the secrets, as one string @param {any} s */
const said = (s) => JSON.stringify({ relationships: s.relationships, secrets: (s.npcs || []).map((/** @type {any} */ n) => n.secret ?? null) });
/** @param {any} s @param {string} name */
const card = (s, name) => (s.npcs || []).find((/** @type {any} */ n) => n.name === name);

describe('BAR3-PEOPLE-2 · one debt, a sentence name, the holder\'s honorific, (P1, P4, P6)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; what prints instead`, () => {
      const text = said(towns[seed]);
      expectAbsentWithAnchor(text, refused, instead, `${seed}: the refused claim; the same slot's true text`);
      expect(text).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(said(towns[seed])).toContain(kept);
    });
  }
  for (const [seed, name, refused, instead] of HONORIFICS) {
    it(`${seed}: ${name} is no ${refused}; she is the ${instead}`, () => {
      const c = card(towns[seed], name);
      expect(c?.gender).toBe('female');
      const honorific = cardHonorificOf(c, towns[seed]);
      expectAbsentWithAnchor([honorific], refused, instead, `${seed}: ${name}'s honorific`);
      expect(honorific).toBe(instead);
    });
  }
  it('P6: every gendered personal honorific gives a woman no word that names a man; an office stays the office\'s', () => {
    for (const [title, form, plain] of /** @type {Array<[string, string, string]>} */ ([['the dairy farmer', 'Dairyman', 'Dairy Farmer'], ['the eldest householder', 'Goodman', 'Elder'], ['the toll-keeper', 'Tollman', 'Toll-Keeper'], ['the hospitaller', 'Brother Hospitaller', 'Hospitaller'], ['the luxury merchant', 'Merchant Prince', 'Merchant']])) {
      const pool = FACE_HONORIFICS[title];
      expectAbsentWithAnchor(pool.filter((h) => typeof h === 'string'), form, plain, `${title}: no plain-string ${form}; the pool's neutral word`);
      expect(pool.some((h) => typeof h === 'object' && h.male === form), title).toBe(true);
    }
    expect(FACE_HONORIFICS['the mayor']).toContain('Lord Mayor');
  });
});
