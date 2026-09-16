/**
 * proseTasteCorruption.walker.test.js — THE CLOSURE, AND THE PAIRED TOWN (TASTE car M-5;
 * ARCH §5.3, §8.4, §4.2 step 2).
 *
 * TWO PROPERTIES, both of which the estate has been carrying as prose until now:
 *
 *   1. THE CLOSURE IS A MEASUREMENT WITH A REFUSAL. ARCH §5.3 gates `corruption.js` into a
 *      desk on the 293,079 B precedent, and `defenseStateProse.js` refuses a second import at
 *      546,887 B by the same method — both figures measured by hand, in a receipt, once. This
 *      arm RE-MEASURES the closure on every run and reds the day an added import takes it over
 *      the precedent, so the refusal is a gate rather than a memory.
 *
 *   2. NOTHING A COVERT FACT DOES IS OBSERVABLE ON THE PLAYER FACE — the PAIRED-TOWN arm.
 *      The same seed is composed twice, once with a covert corruption impairment on a security
 *      institution and once without, and the two PLAYER pages must be byte-equal at every
 *      mount of all six desks. Byte-equal is the whole claim: not "no covert sentence
 *      appeared", which a page could satisfy while the withdrawal shifted a salience rank or
 *      spent a budget slot, but "the player's page is the page of a town where the fact does
 *      not exist".
 *
 * ⛔ AND THE NON-VACUITY IS THE OTHER HALF: the DM pages of the same pair MUST differ, and the
 * REVEALED variant — a public scandal, not a covert one — must differ on the PLAYER face too.
 * An arm that only proved equality would pass on a fixture where nothing was toggled at all.
 *
 * @enforced-by this file
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT } from '../helpers/dossierCorpus.js';
import { closureCost } from '../../scripts/lib/module-closure.mjs';
import { compromisedSecurityInstitutions } from '../../src/domain/corruption.js';
import { deskReturns } from '../../scripts/prose-rate-corpus.mjs';
import {
  PAIRED_TOWN, securityInstitutionsOf, tasteTown, withCorruption,
} from '../fixtures/tasteTowns.js';

/**
 * ARCH §5.3's own precedent, in bytes: what importing `viewModelPrimitives.js` would have cost
 * the first-paint closure, refused, and the reason `defenseScoreBands.js` exists.
 */
const PRECEDENT_BYTES = 293_079;

const CANDIDATES_LEAF = join(ROOT, 'src/domain/display/stateProse/defenseStateProseCandidates.js');
const CORRUPTION = join(ROOT, 'src/domain/corruption.js');
const DEFENSE_DESK = join(ROOT, 'src/domain/display/stateProse/defenseStateProse.js');
/** The candidates leaf's own source, read once — the ground of the standing measured below. */
const CANDIDATES_LEAF_SRC = readFileSync(CANDIDATES_LEAF, 'utf8');

/** Every composed sentence of a town, keyed by its mount position — the whole page. */
function pageOf(settlement, audience) {
  /** @type {string[]} */
  const rows = [];
  /** @param {unknown} node @param {number} depth */
  const walk = (node, depth = 0) => {
    if (!node || typeof node !== 'object' || depth > 10) return;
    const rung = /** @type {any} */ (node);
    const p = rung.provenance;
    if (p && typeof p.blockId === 'string' && typeof rung.sentence === 'string') {
      rows.push(`${p.blockId}::${p.poolKey}::${rung.sentence}`);
      return;
    }
    for (const value of Object.values(node)) walk(value, depth + 1);
  };
  const seed = String(settlement._seed ?? settlement.id ?? PAIRED_TOWN.seed);
  for (const entry of deskReturns(settlement, { seed, audience })) walk(entry.value);
  return rows;
}

describe('the corruption closure is re-measured, and refused above the precedent', () => {
  it('the candidates leaf pulls 6 files and stays under 293,079 B', () => {
    const cost = closureCost(CANDIDATES_LEAF, CORRUPTION);
    const names = cost.files.map((f) => f.replace(`${ROOT}/`, ''));
    console.log(`\n[closure] corruption.js into the defense candidates leaf: ${cost.files.length}`
      + ` file(s) / ${cost.bytes} B against the ${PRECEDENT_BYTES} B precedent`
      + ` (${Math.round((cost.bytes / PRECEDENT_BYTES) * 100)} %)\n`
      + names.map((n) => `  ${n}`).join('\n')
      + `\n[closure] the leaf's closure without the edge: ${cost.hostFiles} files / ${cost.hostBytes} B`
      + ` · with it: ${cost.withFiles} files / ${cost.withBytes} B\n`);
    expect(cost.bytes, `the import must stay under ARCH §5.3's ${PRECEDENT_BYTES} B precedent`)
      .toBeLessThanOrEqual(PRECEDENT_BYTES);
    // NON-VACUITY: the walker actually followed the graph rather than answering zero.
    expect(cost.files.length).toBeGreaterThanOrEqual(5);
    expect(names, 'corruption.js itself is in the added set').toContain('src/domain/corruption.js');
    expect(names, 'and it drags the settlement schema, which is most of the weight')
      .toContain('src/domain/settlement.schema.js');
  });

  it('the DESK\'s closure is what actually ships, and the import adds the same six files to it', () => {
    const leafCost = closureCost(CANDIDATES_LEAF, CORRUPTION);
    const deskCost = closureCost(DEFENSE_DESK, CORRUPTION);
    // The leaf is imported ONLY by its desk, so the two answers must agree: nothing new
    // reaches a bundle through the leaf that would not reach it through the desk.
    expect(deskCost.files.map((f) => f.replace(`${ROOT}/`, '')).sort())
      .toEqual(leafCost.files.map((f) => f.replace(`${ROOT}/`, '')).sort());
    expect(deskCost.bytes).toBe(leafCost.bytes);
    expect(deskCost.bytes).toBeLessThanOrEqual(PRECEDENT_BYTES);
  });
});

/**
 * ⛔⛔ THE COVERT CANDIDATE, MEASURED FROM ITS OWN LEAF (REWRITE car 8a-3).
 *
 * TASTE car M-5 wrote the paired-town arm in a dock where DS-DEF-11's covert candidate
 * function was landed beside it. THIS car lands the taste's INSTRUMENTS and refuses its seven
 * CANDIDATE FUNCTIONS to 8b with the desk sections they belong to (brief item 3; the chair's
 * ADDENDUM 1 ruling 4), so nothing in this tree reads a corruption impairment into a composed
 * sentence and the pair of pages is identical on BOTH faces.
 *
 * That makes all three arms below vacuous rather than false, which is the worse failure: the
 * EQUALITY arm would go on reading green for the rest of the program while proving nothing,
 * because two pages that were never going to differ are byte-equal for free. So the arms are
 * gated on the CAUSE and not on the outcome — the candidates leaf's own source, which either
 * names the corruption reader or does not — and each declares NOT-EXECUTABLE by asserting the
 * cause rather than asserting `[]` about the effect. The day 8b lands the function this flips
 * to `true` with no edit here and the three arms gate for real.
 */
const COVERT_CANDIDATE_LANDED = CANDIDATES_LEAF_SRC.includes('compromisedSecurityInstitutions');

describe('⭐⭐ THE PAIRED-TOWN ARM: a covert fact leaves no trace on the player page', () => {
  const clean = tasteTown(PAIRED_TOWN);
  const covert = withCorruption(clean, 'covert');
  const revealed = withCorruption(clean, 'revealed');

  it('⛔ THE STANDING OF THE THREE ARMS BELOW, stated before they run', () => {
    // A one-line record of which world this file is running in, so a reader of the output
    // never has to infer it from three greens.
    expect(typeof COVERT_CANDIDATE_LANDED).toBe('boolean');
    if (!COVERT_CANDIDATE_LANDED) {
      console.log('\n[taste-corruption] NOT-EXECUTABLE: DS-DEF-11\'s covert candidate function is'
        + ' refused to 8b, so no composed sentence reads a corruption impairment and the paired'
        + ' town cannot diverge on either face. The closure arms above are unaffected.\n');
    }
  });

  it('the fixture is a real town with a real security institution, and the toggle is the only difference', () => {
    expect(securityInstitutionsOf(clean).length, 'the seed names at least one security institution')
      .toBeGreaterThan(0);
    expect(compromisedSecurityInstitutions(clean)).toEqual({ covert: [], revealed: [] });
    expect(compromisedSecurityInstitutions(covert).covert).toHaveLength(1);
    expect(compromisedSecurityInstitutions(covert).revealed).toEqual([]);
    expect(compromisedSecurityInstitutions(revealed).revealed).toHaveLength(1);
    expect(compromisedSecurityInstitutions(revealed).covert).toEqual([]);
    // ⛔ THE TOGGLE IS ONE IMPAIRMENT AND NOTHING ELSE: every other byte of the settlement is
    // the generator's, which is what makes the pair a pair rather than two towns.
    // ⛔ THE STRIP IS RECURSIVE, and the first cut was not. A settlement's institution objects
    // are SHARED by reference between `settlement.institutions` and
    // `defenseProfile.institutions.<bucket>`, and `structuredClone` preserves that sharing —
    // so one impairment appears at TWO paths and a strip that only cleaned the roster reported
    // the pair as two different towns. The shared reference is the shipped world's own shape;
    // the arm reads it rather than working around it.
    const strip = (s) => JSON.stringify(s, (key, value) => (key === 'impairments' ? undefined : value));
    expect(strip(covert)).toBe(strip(clean));
    expect(strip(revealed)).toBe(strip(clean));
  });

  it('the two PLAYER pages are byte-equal at every mount', () => {
    if (!COVERT_CANDIDATE_LANDED) {
      expect(COVERT_CANDIDATE_LANDED, 'NOT-EXECUTABLE: no candidate in this tree reads a'
        + ' corruption impairment, so the two pages are equal for a reason that is not the'
        + ' arm\'s. Asserted as the CAUSE, which is a fact about the leaf and can be false.')
        .toBe(false);
      return;
    }
    const before = pageOf(clean, 'player');
    const after = pageOf(covert, 'player');
    expect(before.length, 'the page is not empty').toBeGreaterThan(20);
    expect(after.length, 'and the two pages carry the same number of rungs').toBe(before.length);
    const differ = before.map((row, i) => (row === after[i] ? null : `${i}: ${row}\n   ${after[i]}`))
      .filter(Boolean);
    expect(differ, 'nothing a covert piece does is observable on the player face').toEqual([]);
  });

  it('and the two DM pages DIFFER, which is what stops the arm being vacuous', () => {
    if (!COVERT_CANDIDATE_LANDED) {
      expect(COVERT_CANDIDATE_LANDED, 'NOT-EXECUTABLE: the covert candidate is refused to 8b')
        .toBe(false);
      return;
    }
    const before = pageOf(clean, 'dm');
    const after = pageOf(covert, 'dm');
    const differ = before.filter((row, i) => row !== after[i]);
    expect(differ.length, 'the DM face gains the covert sentence').toBeGreaterThan(0);
    expect(differ.join(' '), 'and it is the DS-DEF-11 unit that gained it').toContain('DS-DEF-11');
  });

  it('a REVEALED scandal is public, so it moves the player page too', () => {
    if (!COVERT_CANDIDATE_LANDED) {
      expect(COVERT_CANDIDATE_LANDED, 'NOT-EXECUTABLE: the revealed candidate is refused to 8b')
        .toBe(false);
      return;
    }
    const before = pageOf(clean, 'player');
    const after = pageOf(revealed, 'player');
    const differ = before.filter((row, i) => row !== after[i]);
    expect(differ.length, 'a public scandal is not a covert fact').toBeGreaterThan(0);
    expect(differ.join(' ')).toContain('DS-DEF-11');
  });
});
