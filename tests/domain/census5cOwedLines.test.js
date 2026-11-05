/**
 * CENSUS-5c (2026-11-05), unit 3 — the owed lines, and the presumptions unit 2's reading found.
 *
 * Owed since CENSUS-5 (the lane record's "waiting / owed" table), now that their getters exist:
 *   DS-DEF-6 Economic Backing: Well-funded v2  "The soldiers at {settlement} are paid"      `soldiers` (1c)
 *   DS-DEF-4 capture none v2                   "There is a criminal interest … with the means"  `organised crime` (3b)
 *   DS-DEF-4 structure null v1                 "No criminal infrastructure has been identified" `no organised crime` (3b)
 *
 * Found by unit 2's reading (the {colour} pass), each a claim the record can contradict:
 *   DS-FTH-3 LEGITIMACY: established v1  "Nobody disputes it"                 `no crisis: religious_conversion`
 *     (CENSUS-5b's reading of LEGITIMACY secure: a conversion tests the patron's claim)
 *   (DS-FTH-1 SINK: unaffiliated present, arc rising v1, "Crisis has a way of ending indifference", presumes
 *   SOME crisis: `crisis: any` admits everywhere (R-H), and the bare `crisis` is F12's kernel mark word, which
 *   would partition DS-FTH-1 by a dimension its mount does not declare. Left undeclared, waiting on
 *   CENSUS-1d unit 8 (R-O: the F12 marks onto the vocabulary's dimensions); the lane record lists it.)
 *   DS-WAR-5 (unmounted; moves no birth) posture peace v3 "a town with no soldiers to speak of" `no soldiers`;
 *     settlementWarStatus null v1 / v3 (the town's quarrels are "the ordinary kind"; "nobody … is fighting
 *     anybody") `no crisis: unrest`; live war_front v2 and aftermath siege_lifted v1 (the gates) `gate`;
 *     aftermath trade_realignment v2 ("the stalls") `market`.
 *
 * Read through the kernel's own `eligibleVariants`, with facts built on R-N's one calm double.
 */
import { describe, expect, it } from 'vitest';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const LEAF = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_WAR_FAITH };

/** The texts one pool can draw under `facts`, walls answered both ways. */
function drawable(blockId, poolKey, facts) {
  const block = LEAF[blockId];
  const pool = block.pools[poolKey];
  const meta = (block.poolMeta || {})[poolKey] || {};
  const slots = Object.fromEntries(pool.flatMap((v) => v.slots || []).map((slot) => [slot, 'X']));
  const out = new Set();
  for (const walls of ['walls', 'no walls']) {
    for (const v of eligibleVariants(pool, { slots, audience: 'dm', dimensions: { walls }, facts, ...(meta.crisisScoped ? { crisisScoped: true } : {}) })) out.add(v.text);
  }
  return [...out];
}

/** The calm double with one fact overridden. */
const withFacts = (over) => ({ ...CALM_FACTS_ADMIT_ALL, ...over });
/** The calm double under one crisis kind (the crisis home's own reading). */
const under = (type) => withFacts({ crisis: factsOf({ stress: [{ type }] }).crisis });

/** [block, pool, the line, its marks must include, facts that refuse it, facts that admit it]. */
const OWED = Object.freeze([
  ['DS-DEF-6', 'Economic Backing: Well-funded', /The soldiers at \{settlement\} are paid/, 'soldiers', withFacts({ soldiers: false }), CALM_FACTS_ADMIT_ALL],
  ['DS-DEF-4', 'capture none', /There is a criminal interest at/, 'organised crime', withFacts({ crime: 'none' }), withFacts({ crime: 'organized' })],
  ['DS-DEF-4', 'structure null (nothing organized recognized)', /No criminal infrastructure has been identified/, 'no organised crime', withFacts({ crime: 'organized' }), withFacts({ crime: 'diffuse' })],
  ['DS-FTH-3', 'LEGITIMACY: established', /Nobody disputes it/, 'no crisis: religious_conversion', under('religious_conversion'), CALM_FACTS_ADMIT_ALL],
  ['DS-WAR-5', 'posture peace', /no soldiers to speak of/, 'no soldiers', CALM_FACTS_ADMIT_ALL, withFacts({ soldiers: false })],
  ['DS-WAR-5', 'settlementWarStatus null (peace, not missing data)', /quarrels are the ordinary kind/, 'no crisis: unrest', under('insurgency'), CALM_FACTS_ADMIT_ALL],
  ['DS-WAR-5', 'settlementWarStatus null (peace, not missing data)', /Nobody at \{settlement\} is fighting anybody/, 'no crisis: unrest', under('slave_revolt'), CALM_FACTS_ADMIT_ALL],
  ['DS-WAR-5', 'live war_front INTO the settlement (a genuine siege)', /The gates are shut/, 'gate', withFacts({ defence: { ...CALM_FACTS_ADMIT_ALL.defence, gate: false } }), CALM_FACTS_ADMIT_ALL],
  ['DS-WAR-5', 'aftermath siege_lifted', /The gates are open/, 'gate', withFacts({ defence: { ...CALM_FACTS_ADMIT_ALL.defence, gate: false } }), CALM_FACTS_ADMIT_ALL],
  ['DS-WAR-5', 'aftermath trade_realignment', /The stalls at \{settlement\}/, 'market', withFacts({ market: false }), CALM_FACTS_ADMIT_ALL],
]);

describe('CENSUS-5c unit 3 · the owed lines and the reading\'s presumptions declare', () => {
  for (const [blockId, poolKey, line, mark, refuse, admit] of OWED) {
    it(`${blockId} :: ${poolKey}: ${line.source} declares \`${mark}\`; the record that contradicts it refuses it, and the pool still speaks`, () => {
      const variant = LEAF[blockId].pools[poolKey].find((v) => line.test(v.text));
      expect(variant, 'the line is in the leaf').toBeTruthy();
      expect(variant.marks || []).toContain(mark);
      expect(drawable(blockId, poolKey, admit).some((t) => line.test(t)), 'admitted where the record holds it').toBe(true);
      const refused = drawable(blockId, poolKey, refuse);
      expect(refused.some((t) => line.test(t)), 'refused where the record contradicts it').toBe(false);
      expect(refused.length, 'the pool is not mute').toBeGreaterThan(0);
    });
  }
});
