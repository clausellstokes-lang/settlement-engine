/** @vitest-environment node */
/**
 * tests/domain/voices/cardWordsMore.test.js — WHAT THE SECOND LINES DECLARE, ANSWERED BY THE CARD (S-G1; the eleventh chair's
 * ruling G1-9 of 2026-11-28: "what the lines declare that the engine does not yet answer is built, as declared").
 *
 *   • the HOUSE words of writer B (`lodging`, `food and drink`, `company`), each a set of catalogue ids exactly as B lists them;
 *   • the NEGATED house word (`card-not: digs or grows its own`): a version so marked prints only on a house OUTSIDE its ids;
 *   • the POWER-KIND words of writer A, read off the power's card through `factionArchetypes.js :: factionArchetype` (the
 *     stored category first): "a body with members and meetings", "not an occupier", "an old order".
 * A case per word: a card that holds it admits the version, one that does not refuses it. THE PLANT: on two born towns, the
 * version that wins a card, marked with a word its card does not hold, prints nowhere.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  CARD_NOT_WORDS, CARD_WORDS, POWER_WORDS, cardAdmits, cardNotHolds, cardWordHolds, powerWordHolds,
} from '../../../src/domain/voices/cardWords.js';
import { FACTION_ARCHETYPES, factionArchetype, supportedFactionArchetypes } from '../../../src/domain/factionArchetypes.js';
import { catalogIdForName, institutionalCatalog } from '../../../src/data/institutionalCatalog.js';
import { SAID_LINES } from '../../../src/data/voices/saidLines.js';

const CATALOGUE = new Set(Object.values(institutionalCatalog).flatMap((tier) => Object.values(tier || {}).flatMap((shelf) => Object.keys(shelf || {}).map((n) => catalogIdForName(n)))));
const FOOD_AND_DRINK = ['wayside_inn', 'alehouse', 'ale_house', 'travelers_inn', 'inn_multiple', 'taverns_5_20', 'coaching_inn', 'inns_and_taverns_district', 'caravanserai', 'waystation'];

describe('the house words of writer B, by catalogue id exactly as B lists them', () => {
  it('lodging: the eight houses that bed travellers', () => {
    expect([...CARD_WORDS.lodging].sort()).toEqual(['caravanserai', 'coaching_inn', 'inns_and_taverns_district', 'post_relay_station', 'travelers_inn', 'waystation', 'wayside_inn', 'inn_multiple'].sort());
    expect(cardWordHolds('lodging', 'coaching_inn')).toBe(true);
    expect(cardWordHolds('lodging', 'alehouse'), 'an alehouse beds no one').toBe(false);
  });
  it('food and drink: the ten houses that serve them', () => {
    expect([...CARD_WORDS['food and drink']].sort()).toEqual([...FOOD_AND_DRINK].sort());
    expect(cardWordHolds('food and drink', 'alehouse')).toBe(true);
    expect(cardWordHolds('food and drink', 'post_relay_station'), 'a relay station serves no meal').toBe(false);
  });
  it('company: those ten and the bathhouse', () => {
    expect([...CARD_WORDS.company].sort()).toEqual([...FOOD_AND_DRINK, 'public_bathhouse'].sort());
    expect(cardWordHolds('company', 'public_bathhouse')).toBe(true);
    expect(cardWordHolds('company', 'post_relay_station')).toBe(false);
  });
  it('every id of every house word is the catalogue\'s own', () => {
    for (const [word, ids] of [...Object.entries(CARD_WORDS), ...Object.entries(CARD_NOT_WORDS)]) for (const id of ids) expect(CATALOGUE.has(id), `${word}: ${id}`).toBe(true);
  });
});

describe('the negated house word: card-not "digs or grows its own"', () => {
  it('holds its seventeen ids, and admits a version only OUTSIDE them', () => {
    expect(CARD_NOT_WORDS['digs or grows its own'].length).toBe(17);
    expect(cardNotHolds('digs or grows its own', 'mine'), 'a mine digs its own').toBe(false);
    expect(cardNotHolds('digs or grows its own', 'farmland')).toBe(false);
    expect(cardNotHolds('digs or grows its own', 'mill'), 'a mill buys its grain in').toBe(true);
    expect(cardNotHolds('digs or grows its own', null), 'a house with no catalogue id is not known not to: refused').toBe(false);
    expect(cardNotHolds('a word no list holds', 'mill')).toBe(false);
  });
});

describe('the power-kind words of writer A, read through factionArchetype (the stored category first)', () => {
  it('a body with members and meetings: government, civic, merchant, craft, labor, religious, arcane', () => {
    for (const a of ['government', 'civic', 'merchant', 'craft', 'labor', 'religious', 'arcane']) expect(powerWordHolds('a body with members and meetings', a), a).toBe(true);
    for (const a of ['military', 'occupation', 'criminal', 'noble', 'outsider', 'other']) expect(powerWordHolds('a body with members and meetings', a), a).toBe(false);
  });
  it('not an occupier: any kind but occupation', () => {
    for (const a of supportedFactionArchetypes()) expect(powerWordHolds('not an occupier', a), a).toBe(a !== FACTION_ARCHETYPES.OCCUPATION);
    expect(powerWordHolds('not an occupier', null), 'no card kind read: refused').toBe(false);
  });
  it('an old order: noble, religious, civic', () => {
    for (const a of supportedFactionArchetypes()) expect(powerWordHolds('an old order', a), a).toBe(['noble', 'religious', 'civic'].includes(a));
  });
  it('the reader is factionArchetype, category first', () => {
    expect(factionArchetype({ name: 'Merchant Guilds', category: 'occupation' })).toBe('occupation');
    expect(Object.keys(POWER_WORDS).sort()).toEqual(['a body with members and meetings', 'an old order', 'not an occupier']);
  });
});

describe('cardAdmits: every word a version names must hold for its card', () => {
  it('reads the house words, the negated house words and the power words together', () => {
    expect(cardAdmits({ card: ['lodging'] }, { catalogId: 'coaching_inn', archetype: null })).toBe(true);
    expect(cardAdmits({ card: ['lodging'], cardNot: ['digs or grows its own'] }, { catalogId: 'coaching_inn', archetype: null })).toBe(true);
    expect(cardAdmits({ cardNot: ['digs or grows its own'] }, { catalogId: 'mine', archetype: null })).toBe(false);
    expect(cardAdmits({ power: ['an old order'] }, { catalogId: null, archetype: 'noble' })).toBe(true);
    expect(cardAdmits({ power: ['an old order'] }, { catalogId: null, archetype: 'merchant' })).toBe(false);
    expect(cardAdmits({}, { catalogId: null, archetype: null }), 'a version naming no word fits any card').toBe(true);
  });
});

// ── THE PLANT: through the plan itself ──
/** @type {Map<string, Record<string, any>>} */ const born = new Map();
beforeAll(async () => {
  const pipe = await import('../../../src/generators/generateSettlementPipeline.js');
  const dens = await import('../../../src/domain/density/densityCreateBoundary.js');
  await dens.loadGenerationLawPayloads();
  for (const [seed, settType] of [['dp-city-59', 'city'], ['dp-village-5', 'village']]) born.set(seed, pipe.generateSettlementPipeline(dens.birthConfig({ settType }), null, { seed, customContent: {} }));
}, 120_000);
afterEach(() => { vi.doUnmock('../../../src/data/voices/saidLines.js'); vi.resetModules(); });
/** @param {Record<string, any>} town @param {any} [said] */
async function planOver(town, said) {
  vi.resetModules();
  if (said) vi.doMock('../../../src/data/voices/saidLines.js', () => ({ SAID_LINES: said }));
  const vp = await import('../../../src/domain/voices/voicePlan.js');
  return vp.voicePlanOf(structuredClone(town), { audience: vp.OWNER_AUDIENCE });
}
const TEMPERS = /** @type {const} */ (['welcoming', 'transactional', 'cautious', 'dismissive']);
const lineIn = (/** @type {any} */ pools, /** @type {string} */ id) => Object.values(pools).flat().find((/** @type {any} */ l) => l.id === id);
const versionPrinted = (/** @type {any} */ line, /** @type {string} */ text) => TEMPERS.find((t) => new RegExp(`^${String(line.versions[t].text).replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+')}$`).test(text));

describe('THE PLANT: a winning version marked with a word its card does not hold prints nowhere', () => {
  it('a power\'s winning version, marked with a power word its kind does not hold (dp-city-59, dp-village-5)', async () => {
    for (const seed of ['dp-city-59', 'dp-village-5']) {
      const town = /** @type {Record<string, any>} */ (born.get(seed));
      const plan = await planOver(town);
      const power = [...plan.quotes.values()].find((q) => q.kind === 'power' && !q.liar);
      expect(power, `${seed} quotes a power`).toBeTruthy();
      const card = plan.cards.find((c) => c.kind === 'power' && c.id === power.id);
      expect(supportedFactionArchetypes(), `${seed}: the power card carries its kind`).toContain(card.archetype);
      const refused = Object.keys(POWER_WORDS).find((w) => !powerWordHolds(w, card.archetype));
      expect(refused, `${seed}: a power word ${card.archetype} does not hold`).toBeTruthy();
      const line = lineIn(SAID_LINES, power.lineId); const t = versionPrinted(line, power.text);
      const said = structuredClone(SAID_LINES); lineIn(said, power.lineId).versions[t].power = [refused];
      const after = await planOver(town, said);
      expect([...after.quotes.values()].filter((q) => q.lineId === power.lineId && versionPrinted(line, q.text) === t), seed).toEqual([]);
    }
  }, 120_000);

  it('a house\'s winning version, marked card-not with a list holding its own id, or a house word it does not hold (dp-village-5)', async () => {
    const town = /** @type {Record<string, any>} */ (born.get('dp-village-5'));
    const plan = await planOver(town);
    const houses = [...plan.quotes.values()].filter((q) => q.kind === 'institution' && !q.liar);
    expect(houses.length, 'dp-village-5 quotes its houses').toBeGreaterThan(0);
    const said = structuredClone(SAID_LINES); /** @type {Array<[any, string, string]>} */ const marked = [];
    for (const q of houses) {
      const card = plan.cards.find((c) => c.kind === 'institution' && c.id === q.id);
      const line = lineIn(SAID_LINES, q.lineId); const t = versionPrinted(line, q.text);
      const v = lineIn(said, q.lineId).versions[t];
      // a house that digs its own takes the negated word over its own id; any other takes a house word it does not hold
      if (card.catalogId && CARD_NOT_WORDS['digs or grows its own'].includes(card.catalogId)) v.cardNot = ['digs or grows its own'];
      else if (!cardWordHolds('lodging', card.catalogId)) v.card = ['lodging'];
      else v.cardNot = ['a word no list holds'];
      marked.push([line, t, q.lineId]);
    }
    const after = await planOver(town, said);
    for (const [line, t, id] of marked) expect([...after.quotes.values()].filter((q) => q.lineId === id && versionPrinted(line, q.text) === t), id).toEqual([]);
  }, 120_000);
});
