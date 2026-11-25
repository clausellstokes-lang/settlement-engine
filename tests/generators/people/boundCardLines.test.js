/**
 * boundCardLines.test.js — E8b (WORDS-1; the tenth chair's G20 (2) and G28 of 2026-11-25): THE BOUND CARD LINES. A drawn card
 * line whose reflexive binds the card's OWN person (a tell, an impression, a behaviour, a secret, a long goal) prints that
 * person's own form ("speaks of herself …", "Taught himself to read …"), resolved after the last draw from the card's own
 * `gender`; a card with no gender keeps the they-form. The draw and its dedupe are untouched (the lines are drawn as written).
 * Measured at 0ec96f13d (`docs/chair/2026-11-24/tenth/gen/words-1/tools/e8-classes.mjs`): C 1157 strings, V 1126, twelve rows.
 * THE ORACLE is the raw record: each line found by its own words (the rows below, written here, never read from the source's
 * table), the person by the card that holds it. A reader that knows a row by its words still knows it (`rareRowOf`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline, regenNPCsPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { boundReflexives } from '../../../src/data/people/personMention.js';
import { rareRowOf } from '../../../src/generators/people/rareSecrets.js';

/** @type {Readonly<Record<string, string>>} */
const OWN = Object.freeze({ male: 'himself', female: 'herself' });
/** the twelve bound rows, by their words: [card field, the line's words with the reflexive captured, a rare row?] */
/** @type {ReadonlyArray<readonly [string, string, RegExp, boolean]>} */
const ROWS = [
  ['personality', 'tell', /speaks of (\w+) in the third person when angry/, false],
  ['presentation', 'impression', /sure of (\w+), and not careless with it/, false],
  ['presentation', 'behaviour', /Gives away little about (\w+), and remembers/, false],
  ['secret', 'what', /Is (\w+) a newcomer, arrived a decade ago/, false],
  ['secret', 'what', /telling (\w+) it doesn't matter/, false],
  ['secret', 'what', /cannot bring (\w+) to sell it/, true],
  ['secret', 'what', /Is not (\w+) when the moon is full/, true],
  ['secret', 'what', /Taught (\w+) to read from a single book/, true],
  ['secret', 'what', /never once let (\w+) be seen/, true],
  ['secret', 'what', /the households pay and spending it on (\w+)/, false],
  ['secret', 'what', /moved the stone (\w+)/, false],
  ['goal', 'long', /whatever the cost to (\w+)/, false],
];
/** births of the measure (C: `{ settType }`), one or more per row */
const SEEDS = ['dp-city-1', 'dp-city-101', 'dp-village-0', 'dp-city-15', 'dp-city-125', 'dp-city-26', 'dp-metropolis-38', 'dp-metropolis-138', 'dp-hamlet-14', 'dp-thorp-148', 'dp-city-53'];
/** @type {Record<string, any>} */ const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) towns[seed] = generateSettlementPipeline(birthConfig({ settType: /** @type {RegExpMatchArray} */ (seed.match(/^dp-(\w+)-\d+$/))[1] }), null, { seed, customContent: {} });
}, 900000);

describe('E8b · the bound card lines', () => {
  it('every bound card line of the births reads its card\'s own reflexive; all twelve rows met; a rare row is still known by its words', () => {
    /** @type {string[]} */ const wrong = []; const met = new Set();
    for (const [seed, s] of Object.entries(towns)) {
      for (const c of s.npcs) {
        ROWS.forEach(([o, f, re, rare], k) => {
          const text = c?.[o]?.[f]; if (typeof text !== 'string') return;
          const m = re.exec(text); if (!m) return;
          met.add(k);
          if (m[1] !== (OWN[c.gender] || 'themselves')) wrong.push(`${seed} ${c.name} (${c.gender}) ${o}.${f}: ${text}`);
          if (rare && !rareRowOf(c.secret)) wrong.push(`${seed} ${c.name}: the rare row is no longer known by its words: ${text}`);
        });
      }
    }
    expect(wrong).toEqual([]);
    expect([...met].sort((a, b) => a - b)).toEqual(ROWS.map((_, k) => k));
  });

  it('a card with no gender keeps the they-form; the other gender takes its own form; the line drawn is the same line', () => {
    const born = Object.values(towns).flatMap((s) => s.npcs).find((c) => /^(?:male|female)$/.test(c?.gender) && ROWS[0][2].test(String(c?.personality?.tell)));
    expect(born, 'fixture premise: a born card with the bound tell').toBeTruthy();
    const drawn = String(born.personality.tell).replace(/\b(?:him|her)self\b/, 'themselves');
    const none = { ...born, gender: undefined, personality: { ...born.personality, tell: drawn } };
    expect(boundReflexives(none)).toBe(none);
    const other = born.gender === 'male' ? 'female' : 'male';
    const turned = boundReflexives({ ...none, gender: other });
    expect(turned.personality.tell).toBe(drawn.replace('themselves', OWN[other]));
    expect(turned.goal).toBe(none.goal);
  });

  it('the regen (G29): a kept card is untouched; every other card reads its own form; a re-resolve changes nothing', () => {
    const town = towns['dp-city-1'];
    const kept = town.npcs.find((/** @type {any} */ c) => /^(?:male|female)$/.test(c?.gender) && ROWS[0][2].test(String(c?.personality?.tell)));
    expect(kept, 'fixture premise: a born card with the bound tell').toBeTruthy();
    // a keeper: a card the user authored (canonStatus.js), which the regen preserves as it stands
    const held = { ...town, npcs: town.npcs.map((/** @type {any} */ c) => (c === kept ? { ...c, _authored: true } : c)) };
    const parts = regenNPCsPipeline(held, held.config, { seed: 'e8b-regen' });
    const after = parts.npcs.find((/** @type {any} */ c) => c?._authored === true && c?.name === kept.name);
    expect(after, 'the keeper survives the regen').toBeTruthy();
    expect(after?.personality?.tell).toBe(kept.personality.tell);
    /** @type {string[]} */ const wrong = [];
    for (const c of parts.npcs) {
      expect(boundReflexives(c)).toBe(c);
      for (const [o, f, re] of ROWS) {
        const m = re.exec(String(c?.[o]?.[f] ?? '')); if (!m) continue;
        if (m[1] !== (OWN[c.gender] || 'themselves')) wrong.push(`${c.name} (${c.gender}) ${o}.${f}: ${c[o][f]}`);
      }
    }
    expect(wrong).toEqual([]);
  });
});
