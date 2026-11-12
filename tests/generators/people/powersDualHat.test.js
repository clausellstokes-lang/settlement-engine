/**
 * powersDualHat.test.js — COHERENCE-POWERS, phase 2's guard, written first (the chair, 2026-11-11:
 * "every leader has a house of the town unless the government appoints; every ruler of a kind has its
 * kind among its first three where the town has such a house"; and the ruler of a kind has a house of
 * its kind in the town).
 *
 * The owner (2026-11-11), verbatim: "whoever leads teh town, in any type of government is wearing a dual
 * hat (where appropraite) they come from an institution, and are elevated yet still tied to an
 * institution. for example, the miller is typically the lord mayor (unless appointed by an appropriate
 * government type) rather than a lord mayer simply existing in a vacuume".
 *
 * RED FIRST at decc7bf15: the leader is the office in 360 of 360 corpus towns, and a ruler of a kind
 * has its kind in its first three in 10 of 245 (docs/chair/2026-11-11/COHERENCE-POWERS-PHASE1-PROPOSAL.md).
 * It holds under either alternative the proposal names (A, the deal; B, both memberships).
 *
 * Read-only over the record: no new key is read. A card's HOUSE is its `institution` with kind 'house';
 * an OFFICE is a Government-shelf house, a hall (the seat face) or a minted power face; a house's KIND is
 * the largest share of its backing row. Criminal rulers stand outside the guard: naming the thieves'
 * house as the leader would break the veil, and that is the owner's call (the proposal, (b)).
 */
import { describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { backingArchetypeOf } from '../../../src/domain/dossier/powerSupport.js';
import { backingRowFor } from '../../../src/data/institutionBacking.js';
import { FACE_SEAT, faceOfInstitution, familyOfInstitution, isFabricInstitution } from '../../../src/data/institutionalCatalog.js';
import { isHideableHouse } from '../../../src/domain/people/cardVeil.js';
import { governingFactionOf, nameOf } from '../../../src/domain/rulingPower.js';

/** The browser's dials (the charters' §0.4). */
const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});

/** Seeds from the phase-1 corpus, one or more per kind of government and size. */
const SEEDS = Object.freeze([
  'critique-hamlet-25', 'critique-hamlet-5', 'critique-hamlet-99', 'critique-thorp-0', 'critique-village-0', 'critique-village-2', 'critique-village-6',
  'critique-town-0', 'critique-town-2', 'critique-town-3', 'critique-town-6', 'critique-town-13',
  'critique-city-0', 'critique-city-9', 'critique-metropolis-8', 'critique-metropolis-9',
]);

/** The governments that send their own man: the leader has no house of the town (the chair's ruling of
 *  2026-11-11, 23:2x UTC: the government's own name and description say who is sent; a stewardship is). */
const APPOINTED = Object.freeze(['Feudal Stewardship', 'Feudal Appointee', 'Noble Governorship', 'Ducal Governorship', 'Royal Authority',
  'Foreign Stewardship', 'Foreign Administration', 'Occupation Authority', 'Martial Administration', 'Noble Regency']);
/** The kinds a ruler can be of, criminal aside (the veil). */
const KINDS = Object.freeze(['religious', 'military', 'merchant', 'arcane', 'noble', 'craft']);

/** THE SMALL PLACE WITH NO HOUSE BUT ITS HOUSEHOLDS (the chair's ruling of 2026-11-12, item 1 (i)): no open house other than
 *  the government's has a face, so the eldest householder leads by the office's own name — exempt, and nothing wider.
 *  @param {Record<string, any>} s @returns {boolean} */
const onlyTheOffice = (s) => !(s.institutions || []).some((h) => !isFabricInstitution(h) && !isHideableHouse(h)
  && typeof faceOfInstitution(h) === 'string' && faceOfInstitution(h) !== FACE_SEAT && familyOfInstitution(h)?.shelf !== 'Government'
  && kindOf({ institution: { kind: 'house', key: h.name } }) !== 'office');

/** @param {Record<string, any>} card @returns {string} 'office' or the house's kind */
function kindOf(card) {
  const inst = card?.institution;
  if (!inst || inst.kind !== 'house') return 'office';
  const row = { name: inst.key };
  const family = familyOfInstitution(row);
  if (faceOfInstitution(row) === FACE_SEAT || family?.shelf === 'Government') return 'office';
  const backing = backingRowFor(inst.key);
  if (!backing) return 'unplaced';
  const top = Object.entries(backing.shares).sort((x, y) => y[1] - x[1])[0][0];
  return top === 'government' ? 'office' : top;
}

const births = SEEDS.map((seed) => {
  const tier = seed.split('-')[1];
  const s = generateSettlementPipeline({ ...DIALS, settType: tier }, null, { seed, customContent: {} });
  const rulerRow = governingFactionOf(s);
  const ruler = nameOf(rulerRow);
  const three = (s.npcs || [])
    .map((card) => ({ card, rank: (card.memberships || []).find((m) => m.power === ruler)?.rank }))
    .filter((x) => Number.isInteger(x.rank))
    .sort((x, y) => x.rank - y.rank)
    .map((x) => x.card);
  return { seed, s, ruler, arch: rulerRow ? backingArchetypeOf(rulerRow) : null, three };
});

/** Each check loops the seeds in its body and names every seed that misses (the sovereignty lint's park rule:
 *  a plain test over the rows, never an `each` call). */
describe('COHERENCE-POWERS guard — the dual hat', () => {
  it('the leader has a house of the town unless the government appoints', () => {
    const misses = [];
    for (const b of births) {
      if (APPOINTED.includes(b.ruler) || b.arch === 'criminal' || onlyTheOffice(b.s)) continue;
      const leader = b.three[0];
      if (!leader) misses.push(`${b.seed}: ${b.ruler} has no leader`);
      else if (kindOf(leader) === 'office') misses.push(`${b.seed}: ${b.ruler} is led by the office ${leader.name}`);
    }
    expect(misses).toEqual([]);
  });

  it('a ruler of a kind has its kind among its first three where the town has such a house', () => {
    const misses = [];
    for (const b of births) {
      if (!KINDS.includes(b.arch)) continue;
      const kin = (b.s.npcs || []).filter((card) => kindOf(card) === b.arch && !card.institution?.veiled);
      if (!kin.length) continue;
      if (!b.three.some((c) => kindOf(c) === b.arch)) misses.push(`${b.seed}: ${b.ruler}'s three are ${b.three.map((c) => `${c.name} (${kindOf(c)})`).join(', ')}`);
    }
    expect(misses).toEqual([]);
  });

  it('a ruler of a kind has a house of its kind in the town', () => {
    const misses = births.filter((b) => KINDS.includes(b.arch) && !(b.s.npcs || []).some((card) => kindOf(card) === b.arch))
      .map((b) => `${b.seed}: ${b.ruler} (${b.arch}) has no house of its kind`);
    expect(misses).toEqual([]);
  });
});
