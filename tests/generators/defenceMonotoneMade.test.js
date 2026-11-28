/**
 * THE MONOTONE LAW OF THE DEFENCE RATING, ON MADE RECORDS (UPKEEP-15: the guard widened, the chair's ruling (a)
 * of 2026-11-14: "the guard holds made records as well as births: every crisis the generator knows beside every
 * kind of relief, one added at a time"). The births' guard is tests/generators/defenceMonotone.test.js.
 *
 * The law: ADDING A HOUSE NEVER LOWERS A SCORE OR READINESS. A hand fixture outside the births' set
 * (tests/generators/defenseEconomicGate.test.js, the famine's two reliefs) was read as a fall; so the class a
 * hand fixture reaches is tried here whole. A made record is a place of each tier at its people, under no crisis
 * or under each crisis the crisis table knows (`DEFENCE_TUNING.crises`, read from the table, so a new crisis is
 * tried the day it is written), on three rosters (nothing; a watch; walls, a garrison, a market and a hospital),
 * at the magic and faith dials either side of every relief's gate, with and without the food record's stores.
 * Each relief the crises name (the divine, the strong divine, the druids, the arcane, the arcane guild, the
 * teleport circle, the granary, the alchemists) is added, one at a time, to the place holding no relief, each
 * one, each two, and all but one. Defence is read by `generateDefenseProfile` at the record's own standing keep.
 *
 * The law is asserted on the PRINTED figures (each score and readiness in whole points, the page's) and on the
 * EXACT ones (the arithmetic's own, `defenceExactOf`, read at hundredths as the generator reads them before the
 * whole point: the holds re-scale parts and leave float noise of 1e-14, which is not a fall).
 *
 * Every change is tried and every fall collected; the assertion is on the whole collection, once (no loop
 * asserts). Red at the merged base b42be5de9 (279,136 printed score-falls), green at the build's tip.
 */
import { describe, expect, test } from 'vitest';
import { generateDefenseProfile, defenceExactOf } from '../../src/generators/defenseGenerator.js';
import { keepOfRecord } from '../../src/domain/facts/keep.js';
import { DEFENCE_TUNING } from '../../src/data/defenceWeights.js';

/** Each tier at its people. */
const TIERS = { thorp: 40, hamlet: 150, village: 600, town: 2400, city: 12000, metropolis: 40000 };
/** Every crisis the generator knows: the crisis table's own rows. */
const CRISES = Object.keys(DEFENCE_TUNING.crises);
/** Every kind of relief the crises name, as a catalogue house. */
const RELIEFS = {
  divine: 'Parish church', strong: 'Cathedral (10,000+ only)', druid: 'Druid Circle', arcane: 'Hedge wizard',
  guild: "Mages' guild", teleport: 'Teleportation circle', granary: 'Town granary', alchemy: 'Alchemist shop',
};
const KINDS = Object.keys(RELIEFS);
const ROSTERS = {
  none: [],
  watch: [{ name: 'Town Watch' }],
  built: [{ name: 'Town walls' }, { name: 'Garrison' }, { name: 'Market Square' }, { name: 'Hospital' }],
};
/** The magic and faith dials, either side of every gate the reliefs open at. */
const DIALS = [20, 40, 60, 80].flatMap((magic) => [40, 70].map((religion) => ({ magic, religion })));
/** The reliefs a place already holds: none, each one, each two, all but one. */
const HELD = [[]];
KINDS.forEach((a, i) => { HELD.push([a]); for (const b of KINDS.slice(i + 1)) HELD.push([a, b]); });
for (const a of KINDS) HELD.push(KINDS.filter((x) => x !== a));
const STRESSES = [[], ...CRISES.map((c) => [c])];

const SCORES = ['military', 'monster', 'internal', 'economic', 'magical'];
/** Hundredths: the generator's own reading before the whole point (UPKEEP-MEASURE-2 X9). @param {number} v */
const hundredths = (v) => Math.round(v * 100) / 100;
/** The printed scores and readiness, and the same six exactly as the arithmetic holds them. @param {any} s */
const readOf = (s) => {
  const keep = keepOfRecord(s.economicState);
  const p = generateDefenseProfile(s, keep);
  const exact = defenceExactOf(s, keep);
  return {
    ...Object.fromEntries(SCORES.map((k) => [k, p.scores[k]])), readiness: p.readiness.score,
    ...Object.fromEntries([...SCORES, 'readiness'].map((k) => [`${k} (exact)`, hundredths(exact[k])])),
  };
};
/** A made record. @param {string} tier @param {string[]} stressTypes @param {any[]} institutions @param {{ magic: number, religion: number }} dial @param {boolean} stores */
const made = (tier, stressTypes, institutions, dial, stores) => ({
  name: 'Made', tier, population: /** @type {Record<string, number>} */ (TIERS)[tier],
  config: {
    tradeRouteAccess: 'road', terrainType: 'plains', monsterThreat: 'frontier', magicExists: true,
    priorityEconomy: 50, priorityMilitary: 40, priorityCriminal: 20, priorityReligion: dial.religion, priorityMagic: dial.magic, stressTypes,
  },
  institutions,
  economicState: stores ? { foodSecurity: { storageMonths: 3, deficitPct: 0, surplusPct: 5, importDependency: 0.2, resilienceScore: 60 } } : {},
});

describe('the defence rating is monotone in its houses, on made records (UPKEEP-15)', () => {
  test('every crisis beside every relief: adding the relief never lowers a score or readiness', () => {
    /** Every fall: `place + relief: score before -> after`. @type {string[]} */
    const falls = [];
    let tried = 0;
    for (const tier of Object.keys(TIERS)) for (const st of STRESSES) for (const [rk, roster] of Object.entries(ROSTERS)) {
      for (const dial of DIALS) for (const stores of [false, true]) for (const held of HELD) {
        const inst = [...roster, ...held.map((k) => ({ name: /** @type {Record<string, string>} */ (RELIEFS)[k] }))];
        const r0 = readOf(made(tier, st, inst, dial, stores));
        for (const k of KINDS) {
          if (held.includes(k)) continue;
          tried += 1;
          const r1 = readOf(made(tier, st, [...inst, { name: /** @type {Record<string, string>} */ (RELIEFS)[k] }], dial, stores));
          for (const [score, v] of Object.entries(r1)) {
            const was = /** @type {Record<string, number>} */ (r0)[score];
            if (v < was) falls.push(`${tier} ${st.join('+') || 'calm'} ${rk} m${dial.magic}/r${dial.religion}${stores ? ' stores' : ''} [${held.join('+')}] + ${k}: ${score} ${was} -> ${v}`);
          }
        }
      }
    }
    expect(CRISES.length).toBeGreaterThan(10);
    expect(tried).toBe(Object.keys(TIERS).length * STRESSES.length * 3 * DIALS.length * 2 * HELD.reduce((a, h) => a + KINDS.length - h.length, 0));
    expect(falls, `${falls.length} score-falls of ${tried} tried:\n${falls.slice(0, 40).join('\n')}`).toEqual([]);
  }, 900000);
});
