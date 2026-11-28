/**
 * claimExclusions.test.js — THE READERS' PROPERTY (SURVEY S-C (2), the eleventh chair's SURVEY-DESIGN §2 (i)): NO RECORD ANSWERS
 * BOTH SIDES OF A ROW OF THE TABLE TRUE ON ITS FINAL RECORD (`src/domain/facts/claimExclusions.js`).
 *
 * Each side is answered by its atom's ONE reader on the final record, with the desks' facts (`factsAnswered.js :: deskFactsOf`,
 * where `place debt` is answered). A specific row is read as written; a GENERIC row over every atom of its shape (every presence
 * atom and key against its own negation; every pair of disjoint ranges of every band dimension, by the rungs each record holds;
 * every crisis kind against its own absence).
 * THE SAMPLE (re-born here, `birthConfig(row.config)`, options `{ seed, customContent: {} }`, as the corpora are born): the C and
 * V seeds below, chosen from a births measure over C's 900 (the S-B tree's render, its sides read on each final record) so that EVERY side of every specific row holds on at least one
 * record (asserted: a side never seen true would make the property vacuous), and every 25th config of the golden corpus
 * (`tests/fixtures/generator-golden-master.json`, read by its keys: 21 of 525). A row whose both sides CAN hold is a FINDING:
 * this test reds with the record that holds both.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CLAIM_EXCLUSIONS } from '../../../src/domain/facts/claimExclusions.js';
import { FACT_DIMENSIONS, CRISIS_KIND_WORDS, atomHolds } from '../../../src/domain/facts/factVocabulary.js';
import { deskFactsOf } from '../../../src/domain/facts/factsAnswered.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { configFromGoldenKey } from '../../../scripts/lib/golden-corpus-key.mjs';

/** THE SAMPLE of the corpora (see the header): `C:` born from `{ settType }`, `V:` from `{ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }`. */
const SAMPLE = Object.freeze([
  // each a witness of a side, found by the births measure over C (sides read on the final record, deskFactsOf):
  'C:dp-thorp-0', // place debt, nothing laid by, crisis: indebted, prosperity ≥ moderate
  'C:dp-thorp-8', 'C:dp-thorp-29', // place debt; crisis: indebted
  'C:dp-thorp-1', 'C:dp-thorp-12', // prosperity ≤ poor (dp-thorp-12 also crisis: under_siege)
  'C:dp-hamlet-54', 'C:dp-village-8', // guild
  'C:dp-thorp-24', 'C:dp-thorp-121', // crisis: plague_onset
  'C:dp-thorp-70', 'C:dp-thorp-94', // crisis: famine
  'C:dp-thorp-78', // crisis: under_siege
  'C:dp-thorp-22', 'C:dp-thorp-36', // crisis: monster_pressure
  'C:dp-village-141', 'C:dp-thorp-99', 'C:dp-hamlet-33', 'C:dp-hamlet-26', // the measure's worked examples (E rows 11 to 14)
  'V:dp-town-7', 'V:dp-city-12', // two of V's
]);
const GOLDEN_STRIDE = 25;

/** @param {string} atom @param {any} facts @returns {boolean|undefined} a side's answer (`no X` is the reader's negation) */
const side = (atom, facts) => {
  const m = /^no\s+(.+)$/i.exec(atom);
  const held = atomHolds(m ? m[1] : atom, facts);
  return held === undefined ? undefined : m ? !held : held;
};

/** Every pair a generic row stands for, as `[a, b]` atoms. */
function genericPairs(/** @type {string} */ shape) {
  /** @type {Array<[string, string]>} */ const out = [];
  for (const [name, d] of Object.entries(FACT_DIMENSIONS)) {
    if (d.needsContext || !d.reader) continue;
    if (shape === 'presence' && d.shape === 'presence') for (const key of d.keys || [null]) { const a = key ? `${name}: ${key}` : name; out.push([a, `no ${a}`]); }
    if (shape === 'band' && d.shape === 'band' && d.order) {
      for (let i = 0; i < d.order.length; i += 1) for (let j = i + 1; j < d.order.length; j += 1) out.push([`${name}: ≤ ${d.order[i]}`, `${name}: ≥ ${d.order[j]}`]);
    }
  }
  if (shape === 'crisis') for (const k of CRISIS_KIND_WORDS) out.push([`crisis: ${k}`, `no crisis: ${k}`]);
  return out;
}

/** @type {Array<{ key: string, facts: any }>} */ let records = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const golden = Object.keys(JSON.parse(readFileSync(join(__dirname, '../../fixtures/generator-golden-master.json'), 'utf8'))).sort()
    .filter((_, i) => i % GOLDEN_STRIDE === 0);
  const born = [
    ...SAMPLE.map((k) => {
      const [corpus, seed] = k.split(':'); const size = seed.split('-')[1];
      const config = corpus === 'C' ? { settType: size } : { ...DEFAULT_CONFIG, settType: size, _randomizePriorities: true };
      return { key: k, town: generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} }) };
    }),
    ...golden.map((key) => { const { _seed, ...cfg } = /** @type {any} */ (configFromGoldenKey(key)); return { key: `golden:${key}`, town: generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} }) }; }),
  ];
  records = born.map(({ key, town }) => ({ key, facts: deskFactsOf(town) }));
}, 1800000);

describe('the readers\' property: no record answers both sides of a row true', () => {
  test('the sample is the one named (the C and V seeds above and every 25th golden config)', () => {
    expect(records.length).toBe(SAMPLE.length + Math.ceil(525 / GOLDEN_STRIDE));
  });
  // ONE named test walks every row (the registry-walker idiom: the loop runs INSIDE a named test, never generates tests), and
  // collects instead of asserting inside, so a finding names its row, its pair and its record.
  test('no row of the table, specific or generic, has both sides true on one final record', () => {
    /** @type {string[]} */ const both = [];
    for (const row of CLAIM_EXCLUSIONS) {
      const pairs = row.generic ? genericPairs(row.generic) : [[String(row.a), String(row.b)]];
      if (!pairs.length) both.push(`${row.id}: no pair to read (vacuous)`);
      for (const [a, b] of pairs) for (const r of records) if (side(a, r.facts) === true && side(b, r.facts) === true) both.push(`${row.id} :: ${r.key}: ${a} AND ${b}`);
    }
    expect(both, 'a row whose both sides hold on one final record is a FINDING (STOP and send it)').toEqual([]);
  });
  test('not vacuous: each side of every specific row holds on some record of the sample', () => {
    /** @type {string[]} */ const unseen = [];
    for (const row of CLAIM_EXCLUSIONS.filter((r) => !r.generic)) for (const s of [String(row.a), String(row.b)]) {
      if (!records.some((r) => side(s, r.facts) === true)) unseen.push(`${row.id}: ${s}`);
    }
    expect(unseen).toEqual([]);
  });
});
