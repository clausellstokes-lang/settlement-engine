/**
 * claimExclusions.walker.test.js — A LINE THAT ASSERTS A TABLED CLAIM DECLARES IT (SURVEY S-C (4), the eleventh chair's
 * SURVEY-DESIGN §2 (iii)).
 *
 * The table of exclusions (`src/domain/facts/claimExclusions.js`) carries, for a side that pool lines assert IN WORDS, the words
 * (`said`). Every line of the state-prose corpora (the six desks' generated leaves, every pool, every vid) whose words assert a
 * side either DECLARES that side's atom (its marks, read by the kernel's own `variantFactDeclaration`), or stands on it by its
 * POOL KEY (`scripts/census/page-clash.shared.mjs :: KEYED_POOLS`: the key is the fact), or is named below in ALLOWED with a
 * reason. A line that asserts and declares nothing is a line the door cannot refuse and the census cannot see: red.
 * RED FIRST BY A PLANT: a planted pool line that says the town pays its way and declares nothing is caught by name.
 * WHAT IT DOES NOT READ: pools outside the six state-prose leaves (Daily Life, the registries, the hooks): their claims reach the
 * census through the ledger only where they declare.
 */
import { describe, expect, test } from 'vitest';
import { CLAIM_EXCLUSIONS } from '../../src/domain/facts/claimExclusions.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { KEYED_POOLS } from '../../scripts/census/page-clash.shared.mjs';

const CORPORA = [DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL, DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH];

/**
 * THE ALLOW-LIST: `<block>::<pool>#<vid> <row> <side>` → why it asserts the side and does not declare it. Shrink-only in spirit:
 * a line leaves it in the commit that declares it.
 */
const ALLOWED = Object.freeze({
  'DS-DEF-2::Economic Survival: STRONG#3 place debt b': 'past tense ("had money laid by before this trouble began"): a sequence, not a present claim (E-clashes row 9, TENSE); the money family is S-D\'s (RULING S-B-1)',
  'DS-DEF-2::Economic Survival: STRONG#13 place debt b': 'past tense ("had money laid by when the occupiers came"): a sequence (E-clashes row 9, TENSE); S-D\'s',
  'DS-GEN-3::prosperity: Poverty / Impoverished#2 place debt b': '"pays its way only by doing without": the money family\'s residue, S-D\'s (RULING S-B-1: DS-GEN\'s lines to S-D); declaring it would move pages',
  'DS-GEN-3::prosperity: Moderate / Modest#1 place debt b': '"pays its way and keeps little over": S-D\'s (RULING S-B-1); declaring it would move pages',
  'DS-GEN-11::viable: true: the arithmetic closes#3 place debt b': '"The town works, and pays its way.": S-D\'s (RULING S-B-1); declaring it would move pages',
});

/**
 * Every line of the corpora that asserts a tabled side in words and neither declares it nor stands on it by its key.
 * @param {ReadonlyArray<Record<string, any>>} corpora @returns {string[]}
 */
function undeclaredAssertions(corpora) {
  /** @type {string[]} */ const out = [];
  for (const row of CLAIM_EXCLUSIONS) for (const side of /** @type {const} */ (['a', 'b'])) {
    const words = row.said?.[side]; if (!words) continue;
    const re = new RegExp(words, 'i'); const atom = String(row[side]);
    for (const corpus of corpora) for (const [block, entry] of Object.entries(corpus)) for (const [key, lines] of Object.entries(entry?.pools || {})) {
      for (const l of Array.isArray(lines) ? lines : []) {
        if (!l || typeof l.text !== 'string' || !re.test(l.text)) continue;
        const d = variantFactDeclaration(l);
        const declared = [...d.needs, ...d.excludes.map((x) => `no ${x}`), ...(d.crisis.length ? [`crisis: ${d.crisis.join(', ')}`] : [])];
        if (declared.includes(atom) || KEYED_POOLS[`${block}::${key}`] === atom) continue;
        out.push(`${block}::${key}#${l.vid} ${row.id} ${side}`);
      }
    }
  }
  return out.sort();
}

describe('the table of exclusions: a line that asserts a tabled claim declares it', () => {
  test('every state-prose line that asserts a side declares it, stands on it by its key, or is allowed by name', () => {
    expect(undeclaredAssertions(CORPORA)).toEqual(Object.keys(ALLOWED).sort());
  });
  test('the allow-list names only lines that exist and still assert their side (no stale row)', () => {
    const found = new Set(undeclaredAssertions(CORPORA));
    expect(Object.keys(ALLOWED).filter((k) => !found.has(k))).toEqual([]);
    for (const why of Object.values(ALLOWED)) expect(why.length).toBeGreaterThan(20);
  });
  test('RED BY A PLANT: a planted line that says the town pays its way and declares nothing is caught by name', () => {
    const plant = { 'DS-PLANT-1': { pools: { 'a planted pool': [{ vid: 1, text: '{settlement} pays its way.', angle: 'ledger' }, { vid: 2, text: '{settlement} pays its way.', marks: ['no place debt'] }] } } };
    expect(undeclaredAssertions([plant])).toEqual(['DS-PLANT-1::a planted pool#1 place debt b']);
  });
  test('the walker is not vacuous: the S-B lines are read and found declared', () => {
    const declaredHits = CLAIM_EXCLUSIONS.filter((r) => r.said).length;
    expect(declaredHits).toBeGreaterThanOrEqual(2);
    const eco = /** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)['DS-ECO-8'].pools.COMFORTABLE.find((/** @type {any} */ v) => v.vid === 1);
    expect(new RegExp(String(CLAIM_EXCLUSIONS.find((r) => r.id === 'place debt')?.said?.b), 'i').test(eco.text)).toBe(true);
  });
});
