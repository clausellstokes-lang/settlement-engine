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
 *   NO FLAW ITS OWN TEMPERAMENT DENIES, AND THE FLAW STANDS (P7, the chair's ruling P7a: C7806, C7914): a temperament that
 *   is the plain contrary of the card's flaw takes the next of its own pool that admits the flaw
 *   (`npcData.js :: temperamentAdmitting`); every draw stands, the flaw and all it feeds as drawn.
 * RED AT THE BASE (52f0a1684): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { FACE_HONORIFICS } from '../../src/data/faceHonorifics.js';
import { FLAWS_DENIED_BY_TEMPERAMENT, NPC_PERSONALITY_TRAITS } from '../../src/data/npcData.js';

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
  // BAR3-CLOSE-SWEEP-A (2026-11-15): re-keyed at the joined line (98363cb84) where two declared cures meet: the places
  // branch's b7bf413a7 (H1, BAR3-PLACES-HANDBACK: "made worse by decisions taken by {faction}") rewords the famine secret,
  // the people branch's a2f332ec (P4) fills its {faction} slot with the power's sentence name; both show here
  ['r2s-famine-village-3', 'decisions taken by Military/Guard', 'decisions taken by the Guard'], // NAMES-2 (CN1): the article (NAMES-1 moved the text; this pin was left)
]);
/** KEEP: [town, a true line that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-village-29', "Lofn Halfdarson paid Thorstein Ljotsson's bail eleven years ago"], // the debtor's own secret agrees
  // BAR3-CLOSE-SWEEP-A (2026-11-15): the same famine secret in the places branch's b7bf413a7 words (H1), P4's sentence name
  ['r2r-village-24', 'decisions taken by the Elder Council'], // a name with no slash is its own sentence name; NAMES-2 (CN1): the article (NAMES-1 moved the text; this pin was left)
]);
/** P6: [town, card, the honorific refused, the honorific it takes] */
const HONORIFICS = /** @type {Array<[string, string, string, string]>} */ ([
  ['r2r-hamlet-2', 'Zipna Caan', 'Dairyman', 'Dairy Farmer'],
  ['r2r-city-3', 'Xenodoche Kataphloron', 'Merchant Prince', 'Merchant Princess'],
]);
/** P7: [town, card, the flaw (it stands), the temperament refused, the temperament it holds] */
const TEMPERAMENTS = /** @type {Array<[string, string, string, string, string]>} */ ([
  ['r2r-town-25', 'Hemavati Naidu', 'corrupt', 'incorruptible', 'warm-hearted'],
  ['r2r-town-12', 'Ola al-Amin', 'cruel', 'merciful', 'tenacious'],
]);
/** KEEP P7: [town, card, temperament, flaw] a pair that is no contrary stands as drawn */
const KEEP_PAIRS = /** @type {Array<[string, string, string, string]>} */ ([
  ['r2r-town-25', 'Lakshmana Chaudhary', 'scholarly', 'suspicious'],
  ['r2r-town-12', 'Shahd al-Kindi', 'good-humoured', 'wrathful'],
]);

/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const seeds = new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0]), ...HONORIFICS.map((r) => r[0]), ...TEMPERAMENTS.map((r) => r[0])]);
  for (const seed of seeds) towns[seed] = born(seed);
}, 600000);

/** the ties' text and the secrets, as one string @param {any} s */
const said = (s) => JSON.stringify({ relationships: s.relationships, secrets: (s.npcs || []).map((/** @type {any} */ n) => n.secret ?? null) });
/** @param {any} s @param {string} name */
const card = (s, name) => (s.npcs || []).find((/** @type {any} */ n) => n.name === name);

describe('BAR3-PEOPLE-2 · one debt, a sentence name, the holder\'s honorific, (P1, P4, P6, P7)', () => {
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
  for (const [seed, name, flaw, refused, held] of TEMPERAMENTS) {
    it(`${seed}: ${name} keeps the flaw "${flaw}" and is no longer "${refused}"; holds "${held}"`, () => {
      const p = card(towns[seed], name)?.personality ?? {};
      expect(p.flaw).toBe(flaw);
      expectAbsentWithAnchor([String(p.dominant)], refused, held, `${seed}: ${name}'s temperament`);
      expect(p.dominant).toBe(held);
    });
  }
  for (const [seed, name, dominant, flaw] of KEEP_PAIRS) {
    it(`KEEP ${seed}: ${name}'s ${dominant} / ${flaw} stands as drawn`, () => {
      const p = card(towns[seed], name)?.personality ?? {};
      expect([p.dominant, p.flaw]).toEqual([dominant, flaw]);
    });
  }
  it('P7: the table lists only the pools\' own words', () => {
    for (const [temperament, denied] of Object.entries(FLAWS_DENIED_BY_TEMPERAMENT)) {
      expect(NPC_PERSONALITY_TRAITS.positive, temperament).toContain(temperament);
      for (const flaw of denied) expect(NPC_PERSONALITY_TRAITS.negative, `${temperament} / ${flaw}`).toContain(flaw);
    }
  });
});
