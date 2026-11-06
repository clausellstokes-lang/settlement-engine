/**
 * tasteTowns.js — THE TASTE'S FIXTURE TOWNS, GENERATED RATHER THAN TRANSCRIBED (TASTE cars
 * M-5 and M-6).
 *
 * ⛔ WHY THE TOWNS ARE REAL AND THE IMPAIRMENT IS SYNTHETIC. Two of the taste's arms need a
 * world the shipped generator does not produce:
 *
 *   · THE PAIRED-TOWN ARM (ARCH §8.4, the player face over a covert fact) needs the SAME seed
 *     with a corruption impairment toggled. SEAM car 5b measured that NO generated town carries
 *     an institution impairment of any kind — impairments are world-pulse products — and that
 *     the 178 corrupt NPCs across 768 towns are homed to FACTIONS rather than to institutions,
 *     so `compromisedSecurityInstitutions` answers `{covert: [], revealed: []}` on all 768.
 *     A covert fact that cannot exist cannot be tested against, so the fixture MAKES one, on a
 *     real town, by the one shape `corruption.js` reads.
 *   · THE INTERESTED-FACT ARM (SITTING §Q.3, §R c-22) needs a town whose
 *     `powerStructure.criminalCaptureState` is `corrupted` and a clean control. Those the
 *     generator DOES produce — 15 corrupted of 768 — so those two towns are named by their
 *     RATE seed and taken as they come, with nothing synthesised at all.
 *
 * THE TOGGLE IS THE ONLY DIFFERENCE, and that is what makes the pair a pair: `withCorruption`
 * deep-copies the settlement and adds ONE impairment to ONE security institution. Everything
 * else — every score, every roll, every other institution — is the generator's own.
 *
 * PURE given the generator. No fixture bytes are transcribed and nothing is committed as data,
 * so a fixture cannot go stale against a generator that moved.
 *
 * @enforced-by tests/lint/proseTasteCorruption.walker.test.js
 */
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SECURITY_INSTITUTION_RE } from '../../src/domain/corruption.js';

/**
 * ⭐ THE PAIRED-TOWN SEED. A RATE-grid town that carries walls (so DS-DEF-11 draws a WALLED-*
 * spine, which is the only cell the two `watch:` pools attach to) and at least one institution
 * whose name matches `SECURITY_INSTITUTION_RE`. Named as a constant so the arm and the harness
 * cannot drift onto two different towns.
 */
export const PAIRED_TOWN = Object.freeze({
  seed: 'rate-9-2',
  config: Object.freeze({
    settType: 'town', tradeRouteAccess: 'road', monsterThreat: 'random_threat', culture: 'germanic', terrainOverride: 'hills',
  }),
});

/**
 * ⭐ RE-TAKEN 2026-11-06 (REVIEW-INTAKE-3, chair ruling R7), RE-KEYED BY IDENTITY WITH ITS CAUSE:
 * "a proxy is not a provider" (REVIEW-INTAKE unit 2) — a Housing row now rolls ONE service, so
 * the later service rolls fork in the generated town, and `rate-11-9`'s Town hall no longer
 * keeps the treasury (its DS-GEN-11 row reads LICENSED with no holder). The captured town is now
 * `rate-57-3` with its OWN grid config: the FIRST town of `prose-rate-corpus.mjs :: rateGrid`, in
 * the grid's own order (index 231 of 768; the whole grid scanned, 128 town-tier cells generated),
 * on which every precondition the four pins assert holds — `criminalCaptureState: corrupted`,
 * tier town, the treasury row INTERESTED with the Town hall as its holder, interested on the
 * state organs only. It is the ONLY grid town that holds all of them at this tip (`rate-9-2`
 * reads LICENSED with no holder, `rate-57-0` names the Weekly market, `rate-69-0` the Lord's
 * appointee). Unlike `rate-11-9` (a grid seed string under the paired config, off the grid's
 * four seeds per cell) it is a real grid town, taken as the generator makes it.
 *
 * ⭐ RE-TAKEN 2026-09-30 (the urban band, ODQ §934.86): `rate-9-2` is still corrupted, but the
 * same-seed shift left its Town hall without a tax service, so its treasury record has no
 * holder. `rate-11-9` is the first town in the same grid and config that is corrupted with the
 * Town hall alone keeping the treasury, taken as the generator makes it. PAIRED_TOWN keeps
 * rate-9-2, which still carries the walls and the security institution its arm needs.
 *
 * ⭐ THE INTERESTED-FACT PAIR (SITTING §R c-22). `rate-9-2` was the CAPTURED town — the chair's
 * own worked example, `criminalCaptureState: corrupted`, holder `Town hall` — and `rate-3-0`
 * is the CLEAN control the chair measured beside it. Both are RATE-grid seeds and neither is
 * doctored.
 */
export const INTERESTED_TOWNS = Object.freeze([
  Object.freeze({
    label: 'captured',
    // was 'rate-11-9' (town/road/random_threat/germanic/hills); re-keyed 2026-11-06, cause above.
    seed: 'rate-57-3',
    config: Object.freeze({
      settType: 'town', tradeRouteAccess: 'road', monsterThreat: 'heartland', culture: 'slavic', terrainOverride: 'riverside',
    }),
  }),
  Object.freeze({
    label: 'clean',
    // was 'rate-3-0' (arabic/riverside); re-keyed 2026-11-06 by the same cause and rule as the
    // captured town: rate-3-0's treasury is kept by its Weekly market again, so the pair no
    // longer differs by the capture alone. rate-3-2 is the FIRST grid town (index 14; 3 town
    // cells generated) that is uncaptured, a town, and has its Town hall keep the treasury.
    seed: 'rate-3-2',
    config: Object.freeze({
      settType: 'town', tradeRouteAccess: 'random_trade', monsterThreat: 'random_threat', culture: 'slavic', terrainOverride: 'forest',
    }),
  }),
]);

/**
 * One town, generated.
 * @param {{seed: string, config: object}} spec
 * @returns {object}
 */
export function tasteTown(spec) {
  return generateSettlementPipeline(spec.config, null, { seed: spec.seed, customContent: {} });
}

/**
 * The settlement's security institutions, by the reader's own regex rather than by a name this
 * fixture chose.
 * @param {object} settlement
 * @returns {Array<{name: string}>}
 */
export function securityInstitutionsOf(settlement) {
  const list = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  return list.filter((inst) => SECURITY_INSTITUTION_RE.test(String(inst?.name || '')));
}

/**
 * ⭐ THE TOGGLE. A deep copy of `settlement` with ONE corruption impairment on its FIRST
 * security institution, covert or revealed.
 *
 * ⛔ `covert: true` IS THE HIDDEN CHANNEL AND `covert` ABSENT IS THE PUBLIC SCANDAL —
 * `corruption.js`'s own reading, not this fixture's: a covert mark must not read as a public
 * scandal or it would drag exposure scrutiny onto the very NPC it was meant to conceal.
 * @param {object} settlement
 * @param {'covert'|'revealed'} mode
 * @returns {object} a new settlement; the input is untouched
 */
export function withCorruption(settlement, mode) {
  const copy = structuredClone(settlement);
  const security = securityInstitutionsOf(copy);
  if (security.length === 0) {
    throw new Error('withCorruption: the town carries no security institution to compromise;'
      + ' the fixture seed must name one (SECURITY_INSTITUTION_RE)');
  }
  const target = security[0];
  const impairment = mode === 'covert'
    ? { type: 'corruption', covert: true, severity: 'moderate' }
    : { type: 'corruption', severity: 'moderate' };
  target.impairments = [...(target.impairments || []), impairment];
  return copy;
}
