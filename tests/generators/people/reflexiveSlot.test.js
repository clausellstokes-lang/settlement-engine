/**
 * reflexiveSlot.test.js — E8 (WORDS-1; the tenth chair's PRERELEASE-LIST row E8; the ninth chair's N26, amended by N28):
 * A REFLEXIVE SLOT IN THE TEMPLATES. A composed line whose reflexive binds ONE person the record genders writes that
 * person's own form ("himself", "herself"), never the they-form: "… an introduction he would rather keep to himself",
 * "Find a patron among those who lead the Guild, and make herself useful to them." Measured on the cures tip 0ec96f13d
 * (`docs/chair/2026-11-24/tenth/gen/words-1/tools/e8-records.mjs`, `e8-classes.mjs`, the hand-classed table): the tie
 * printed "themselves" for a gendered end on 157 places of C and 158 of V; the two want lines on 470 cards of C, 458 of V.
 * THE ORACLE is the raw record: the bound card's own `gender`, the card found by the name the line prints (the tie's
 * second end) or the card that holds the want; the lines are found by their own words (the hand-classed table), never by
 * the slot's code. A card with no gender keeps the they-form (an older stored town's card).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../../src/data/npcData.js';

/** @type {Readonly<Record<string, string>>} */
const OWN = Object.freeze({ male: 'himself', female: 'herself' });
/** the bound want lines, by their words (the reflexive captured) */
const BOUND_WANTS = [
  /^Find a patron among those who lead .+, and make (\w+) useful to them\.$/,
  /^Set the terms between .+ and .+ (\w+), and stop taking them from others\.$/,
];
/** the bound tie line (mutual_leverage.tension[12]): the second card asked, its reflexive captured */
const BOUND_TIE = /^(.+?) has asked (.+?) for an introduction (.+?) would rather keep to (\w+)\.$/;
/** births of the measure (C: `{ settType }`), with bound wants of both genders and the tie */
const SEEDS = ['dp-metropolis-95', 'dp-metropolis-83', 'dp-city-42', 'dp-metropolis-111', 'dp-metropolis-118'];
/** @param {string} seed */
const born = (seed) => generateSettlementPipeline(birthConfig({ settType: /** @type {RegExpMatchArray} */ (seed.match(/^dp-(\w+)-\d+$/))[1] }), null, { seed, customContent: {} });

/** @type {Record<string, any>} */ const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) towns[seed] = born(seed);
}, 600000);

describe('E8 · the reflexive slot', () => {
  it('the tie: the asked card\'s own form, and its later mention takes the pronoun again (both genders)', () => {
    const line = STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension.lines[12].line;
    const r = { name: 'Rhona Ashby', gender: 'female', role: 'the factor' };
    const s = { name: 'Silas Brent', gender: 'male', role: 'the miller' };
    expect(line(r, s)).toBe('Rhona Ashby has asked Silas Brent for an introduction Silas Brent would rather keep to himself.');
    expect(line(s, r)).toBe('Silas Brent has asked Rhona Ashby for an introduction Rhona Ashby would rather keep to herself.');
    expect(STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension(r, s, 12)).toBe('Rhona Ashby has asked Silas Brent for an introduction he would rather keep to himself.');
    expect(STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension(s, r, 12)).toBe('Silas Brent has asked Rhona Ashby for an introduction she would rather keep to herself.');
    // a card with no gender keeps the they-form, and the mention its next rung (N28)
    expect(STRESS_ECONOMIC_EFFECTS.mutual_leverage.tension({ name: 'Rhona Ashby', role: 'the factor' }, { name: 'Silas Brent', role: 'the miller' }, 12))
      .toBe('Rhona Ashby has asked Silas Brent for an introduction the miller would rather keep to themselves.');
  });

  it('every bound line of the births agrees with its card\'s own gender (the wants and the tie), both genders met', () => {
    /** @type {string[]} */ const wrong = []; const met = { want: new Set(), tie: new Set() };
    for (const [seed, s] of Object.entries(towns)) {
      const byName = new Map(s.npcs.map((/** @type {any} */ c) => [c.name, c]));
      for (const c of s.npcs) for (const v of ['short', 'long']) {
        const t = String(c.goal?.[v] ?? '');
        for (const re of BOUND_WANTS) {
          const m = re.exec(t); if (!m) continue;
          met.want.add(c.gender);
          if (m[1] !== OWN[c.gender]) wrong.push(`${seed} ${c.name} (${c.gender}) goal.${v}: ${t}`);
        }
      }
      for (const rel of s.relationships || []) {
        const m = BOUND_TIE.exec(String(rel.tension ?? '')); if (!m) continue;
        const asked = byName.get(m[2]);
        met.tie.add(asked?.gender);
        if (m[4] !== OWN[asked?.gender]) wrong.push(`${seed} tie: ${rel.tension} (${m[2]} is ${asked?.gender})`);
      }
    }
    expect(wrong).toEqual([]);
    expect([...met.want].sort()).toEqual(['female', 'male']);
    expect(met.tie.size).toBeGreaterThan(0);
  });
});
