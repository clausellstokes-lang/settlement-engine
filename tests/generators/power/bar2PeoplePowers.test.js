/**
 * bar2PeoplePowers.test.js — BAR2-PEOPLE batch A (REVIEW-BAR-2, the POWERS worklist; the chair's rulings PP1, PP2, PP9,
 * PP10 of 2026-11-15, each vetoable by the owner), on births:
 *   PP1  the hall's free rung's label claims only the rung: the seat is not in the criminals' hold (was "Free of the
 *        criminals", 589 towns, which read as a claim about the whole town beside a shadow economy).
 *   PP2  ONE HOME FOR WHO DECIDES: under an occupation the occupier decides; where a relation line already names the
 *        decider ("<hall> carries out what Occupation Authority decides", "<hall> keeps the title; The Guard makes the
 *        decisions that matter") the strata's note is silent; elsewhere it names the outranking rival as before (KEEP).
 *   PP9  the mine captain's lines claim the trade, not present work on ore the record may lack (26 of the 50 towns that
 *        print "Sells ore by the cart" hold no ore): the tail round's hedge.
 *   PP10 under a siege nothing moves by road or water: the checkpoint's and the quay's hooks take a twin (no draw moves;
 *        a calm town keeps the line, KEEP); the occupier's standing line says it decides (17 towns printed a
 *        subordinate's line: "in the shadow of", "the gap ... is narrow", "worth buying", "petitions and procedure").
 * RED AT THE BASE (f8042b61a): every refused pair; KEEP pairs green before and after. No bare negative: each pair names
 * what prints instead, or that the slot is silent by design (`null`, the relation line named as the one home).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { crisisNoteFor } from '../../../src/domain/dossier/powerStrata.js';
import { governingFactionOf } from '../../../src/domain/rulingPower.js';
import { dmPowerViewOf } from '../../../src/domain/people/patronage.js';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** the census's shapes (the 720's r2r-/r2s-; the bar's bar0-) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-rand-\\d+$`));
  if (!m) throw new Error(`no shape for ${seed}`);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}

/** @type {Record<string, any>} */
const towns = {};
/** The texts of the slots this batch reads, one string a town. @param {any} s */
function slotsOf(s) {
  const gov = governingFactionOf(s);
  return JSON.stringify({
    hall: dmPowerViewOf(s)?.hall?.label ?? null,
    note: gov ? crisisNoteFor(s, gov) : null,
    relations: (s.powerStructure.factionRelationships || []).map((r) => r.narrative),
    descs: s.powerStructure.factions.map((f) => f.desc),
    hooks: (s.powerStructure.conflicts || []).map((c) => c.plotHooks),
    mine: s.npcs.filter((n) => n.title === 'the mine captain').map((n) => [n.presentation, n.secret]),
  });
}

/** [town, the line that must not print, what prints instead] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  // PP1 (the 589's label)
  ['r2r-thorp-0', '"hall":"Free of the criminals"', '"hall":"The seat is not in criminal hands"'],
  // PP2: under the occupation the relation line is the decider's one home (C28248's town); the Guard's line likewise
  ['bar0-town-occupied-rand-3', 'Holds the title; the decisions that matter are made by Merchant Guilds.', 'The Merchant Council carries out what the Occupation Authority decides.'], // NAMES-1 (CN1): the article
  ['r2r-hamlet-27', 'Holds the title; the decisions that matter are made by The Guard.', 'The Elder Council keeps the title; the Guard makes the decisions that matter.'], // NAMES-1 (CN1): the article
  // PP9
  ['r2r-hamlet-3', 'Sells ore by the cart; hires workers by the week.', 'Sells ore by the cart, from what the workings still give; hires workers by the week.'],
  ['r2r-hamlet-8', 'Has been sending miners into a gallery they know is unsafe, because the ore there is the richest', 'Has sent miners into a gallery they knew was unsafe, because the ore there was the richest'],
  // PP10: the siege twin (C3525's town); the occupier's own line (C28193's town; a thorp's "gap is narrow")
  ['bar0-city-under_siege+famine-rand-5', 'Carters are waiting at the post because two sets of men each claim the right to collect the toll.', 'The toll post has stood idle since the road closed, and two sets of men each claim the right to collect when it opens.'],
  ['bar0-town-occupied-rand-3', 'so they get their way through petitions and procedure instead.', 'It does not bargain for its way: the Merchant Council carries out what it decides, whatever its numbers.'], // NAMES-1 (CN1): the article
  ['r2r-thorp-27', 'The gap between them and the governing council is narrow. A single shift in patronage, scandal, or armed muscle could swap their positions.', 'It does not bargain for its way: the Household Council carries out what it decides, whatever its numbers.'], // NAMES-1 (CN1): the article
]);
/** KEEP: [town, a true sibling that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  // BAR3-PEOPLE (P2), 2026-11-15, re-keyed by identity: r2r-village-28 holds a relation row of the pair ("the two do not agree on
  // who decides"), so its note now claims no decider (bar3PeoplePowers.test.js refuses it); the same sibling where NO relation row of the pair stands:
  ['r2r-thorp-25', "Holds the title; the decisions that matter are made by People's Council."], // no relation row of the pair: the note stays its home
  ['r2r-city-41', 'Carters are waiting at the post because two sets of men each claim the right to collect the toll.'], // no siege
  ['r2r-hamlet-3', 'so they get their way through petitions and procedure instead.'], // the Guard, no occupier: the ladder's line stands
]);

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) towns[seed] = slotsOf(born(seed));
}, 600000);

describe('BAR2-PEOPLE batch A · the powers say what the record holds (PP1, PP2, PP9, PP10)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; "${instead.slice(0, 40)}…" prints`, () => {
      expectAbsentWithAnchor(towns[seed], refused, instead, `${seed}: the refused line; what prints in its place`);
      expect(towns[seed]).toContain(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(towns[seed]).toContain(kept);
    });
  }
});
