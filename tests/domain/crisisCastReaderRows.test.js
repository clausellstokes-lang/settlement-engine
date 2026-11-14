/**
 * R2-CODE-B-11 (the chair's rulings of 2026-11-14 on the bar's row 179 and the fresh reader's rows,
 * docs/chair/2026-11-14/REVIEW-R2-CODE-B-LINES-READ.md): the crisis cast reads ONE fact where two
 * lines of the same page meet.
 *   (a) row 179: THE COLLABORATOR IS NEVER THE OCCUPIER. In the occupation kinds no member of an
 *       occupying power (the face's own house) is cast as collaborator, and never the face; the famine's
 *       exploiter is read the same way when the link is read. Where no local remains the role is
 *       ABSENT by its own reason.
 *   (b) H2-1, H2-2, H2-3: THE BRUNT AND THE STAKES READ ONE FACT. The brunt is drawn only from a house whose stake
 *       the record holds as a loss; where the town's one power has no stake or gains, nobody of it bears the brunt:
 *       the role is ABSENT by its own reason (the one-power fallback is gone).
 * Births in the reader's own shapes (the census's r2r-/r2s-, the app's rr3-, the bar's bar0-), every
 * town named in the arms below failed at the lane's statement (045d19ac1) or guards a kept line.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CAST_ABSENCES, CAST_REASONS, STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { factionArchetype, FACTION_ARCHETYPES } from '../../src/domain/factionArchetypes.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** The reader's cfgFor (REVIEW-R2-CODE-B births.mjs), its three shapes; bar0- is the app's shape. @param {string} seed */
function cfgFor(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^(?:rr3|bar0)-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true });
}

// (a) Every town of the reader's 1,536 whose occupation collaborator was the face (27, one by the famine's link) or a
// member of the occupying power (6), and the bar's town (Ruixiang He, the occupying governor, cast as his own collaborator).
const OCCUPIER_CAST = [
  'bar0-town-occupied-rand-1', 'r2r-thorp-24', 'r2r-thorp-40', 'r2s-occupied-thorp-0', 'r2s-occupied-thorp-3', 'r2s-occupied-hamlet-0',
  'r2s-occupied-hamlet-2', 'r2s-occupied-village-1', 'r2s-occupied-village-2', 'r2s-occupied-town-0', 'r2s-occupied-town-3',
  'r2s-occupied-city-3', 'r2s-occupied-metropolis-1', 'rr3-thorp-occupied-rand-0', 'rr3-thorp-occupied-port-0',
  'rr3-hamlet-occupied-rand-1', 'rr3-hamlet-occupied-port-1', 'rr3-village-occupied-rand-0', 'rr3-town-occupied-port-1',
  'rr3-metropolis-occupied-rand-3', 'rr3-metropolis-occupied-rand-4', 'rr3-metropolis-occupied-port-0',
];
const LOCAL_KEPT = 'r2s-occupied-city-1'; // GUARD: a local collaborator (not of the occupier) stays cast
const TAKEN_OFF = 'r2r-thorp-24'; // GUARD: the occupier alone gains, so the role is absent by its own reason
const LINKED = 'r2s-occupied-hamlet-0'; // the famine's exploiter was the occupying governor: the link is not read

// (b) Of the reader's 66 brunt rows whose house holds no loss (45 "the only one", 19 "the least say" on an untouched
// house, 1 on a house that gains, 1 "one of the house"): every one but the 45's tail, and the rows' smallest and largest.
const BRUNT_NO_LOSS = [
  'r2r-thorp-5', 'r2r-thorp-10', 'r2r-thorp-19', 'r2s-plague_onset-thorp-0', 'r2s-plague_onset-hamlet-0', 'r2s-monster_pressure-thorp-0',
  'r2s-monster_pressure-hamlet-3', 'r2s-mass_migration-thorp-0', 'rr3-thorp-plague_onset-port-1', 'rr3-hamlet-monster_pressure-rand-4',
  'r2r-thorp-41', 'r2r-hamlet-9', 'r2r-hamlet-36', 'r2s-plague_onset-hamlet-1', 'r2s-plague_onset-hamlet-3', 'r2s-monster_pressure-hamlet-1',
  'r2s-monster_pressure-hamlet-2', 'r2s-mass_migration-hamlet-1', 'rr3-thorp-plague_onset-rand-2', 'rr3-thorp-mass_migration-port-0',
  'rr3-hamlet-plague_onset-rand-1', 'rr3-hamlet-plague_onset-port-0', 'rr3-hamlet-plague_onset-port-1', 'rr3-hamlet-monster_pressure-rand-0',
  'rr3-hamlet-monster_pressure-rand-5', 'rr3-hamlet-monster_pressure-port-0', 'rr3-hamlet-mass_migration-rand-4', 'rr3-hamlet-mass_migration-rand-5',
  'rr3-hamlet-mass_migration-port-0', 'r2s-monster_pressure-village-3', 'rr3-hamlet-monster_pressure-rand-1',
];
// GUARDS: a brunt on a house that loses stays, in each of its three words ("the only one", "the least say", "one of the house").
const BRUNT_KEPT = ['r2r-thorp-17', 'r2r-hamlet-16', 'r2r-village-58'];
const BRUNT_TAKEN_OFF = 'r2r-thorp-10'; // its one power, the Elder Council, has "no stake yet": the role is absent

/** @type {Record<string, any>} */
const born = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...OCCUPIER_CAST, LOCAL_KEPT, ...BRUNT_NO_LOSS, ...BRUNT_KEPT])) born[seed] = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
}, 600000);
/** @param {any} s @returns {any[]} */
const entries = (s) => (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
/** @param {any} f @returns {string} */
const nameOf = (f) => f.faction || f.name || '';
/** crisisCast.js :: isOccupier, read from the record. @param {any} s */
const occupiersOf = (s) => new Set((s.powerStructure?.factions || [])
  .filter((/** @type {any} */ f) => factionArchetype(f) === FACTION_ARCHETYPES.OCCUPATION || /occupation|occupying|garrison\s+rule|imperial\s+presence|annex/i.test(nameOf(f)))
  .map(nameOf));
/** @param {any} s @param {string} id */
const cardOf = (s, id) => (s.npcs || []).find((/** @type {any} */ n) => (n.id || n.name) === id);

describe('R2-CODE-B-11 (a) · the collaborator is never the occupier (the bar\'s row 179)', () => {
  it('collected: no occupation collaborator is the face or a member of an occupying power, and an absent role says why truly', () => {
    expectNoSeedFailures(collectSeedFailures(OCCUPIER_CAST, (seed) => {
      const s = born[seed];
      const occ = occupiersOf(s);
      expect(occ.size, seed).toBeGreaterThan(0);
      for (const e of entries(s).filter((x) => x.type === 'occupied' || x.type === 'infiltrated')) {
        const face = e.cast.roles.find((/** @type {any} */ r) => r.role === 'face');
        for (const r of e.cast.roles.filter((/** @type {any} */ x) => x.role === 'collaborator')) {
          expect(face && r.id === face.id, `${seed}: ${r.name} is the face and the collaborator`).toBeFalsy();
          const card = cardOf(s, r.id);
          expect((card?.memberships || []).filter((/** @type {any} */ m) => occ.has(m.power)).map((/** @type {any} */ m) => m.power), `${seed}: ${r.name}`).toEqual([]);
        }
        // "no power gains" is false where the occupier gains
        if (e.cast.stakes.some((/** @type {any} */ k) => occ.has(k.factionId) && k.stake === 'gains')) {
          expect(e.cast.absent.filter((/** @type {any} */ a) => a.role === 'collaborator' && a.reason === CAST_ABSENCES.noGains), seed).toEqual([]);
        }
      }
    }), 'no occupier collaborates with itself');
  });
  it('GUARD: a local collaborator stays cast', () => {
    const s = born[LOCAL_KEPT];
    const e = entries(s).find((x) => x.type === 'occupied');
    const r = e.cast.roles.find((/** @type {any} */ x) => x.role === 'collaborator');
    expect(r?.name).toBeTruthy();
    const occ = occupiersOf(s);
    expect((cardOf(s, r.id)?.memberships || []).some((/** @type {any} */ m) => occ.has(m.power))).toBe(false);
  });
  it('GUARD: where the occupier alone gains, the role is ABSENT by its own reason', () => {
    const e = entries(born[TAKEN_OFF]).find((x) => x.type === 'occupied');
    expect(e.cast.roles.some((/** @type {any} */ r) => r.role === 'collaborator')).toBe(false);
    expect(e.cast.absent).toContainEqual({ role: 'collaborator', reason: CAST_ABSENCES.occupierOnly });
  });
  it('the famine\'s exploiter who is the occupying governor is not read as the collaborator', () => {
    const s = born[LINKED];
    const e = entries(s).find((x) => x.type === 'occupied');
    expect(e.cast.roles.filter((/** @type {any} */ r) => r.reason.startsWith(CAST_REASONS.collaboratorLinked))).toEqual([]);
    expect(e.cast.links).not.toContain('famine');
  });
});

/** The stakes the record holds as a loss: 'loses', or 'split' that gains and loses at once (never "no stake yet"). @param {any} e */
const losingHouses = (e) => new Set(e.cast.stakes
  .filter((/** @type {any} */ k) => k.stake === 'loses' || (k.stake === 'split' && k.reason === STAKE_REASONS.split))
  .map((/** @type {any} */ k) => k.factionId));
/** Every brunt row's house holds a loss (a person: some membership of theirs; a power: its own stake). @param {any} s @param {any} e */
const bruntOffLoss = (s, e) => e.cast.roles.filter((/** @type {any} */ r) => r.role === 'brunt').filter((/** @type {any} */ r) => {
  const lose = losingHouses(e);
  return r.kind === 'faction' ? !lose.has(r.id) : !(cardOf(s, r.id)?.memberships || []).some((/** @type {any} */ m) => lose.has(m.power));
}).map((/** @type {any} */ r) => `${r.name} · ${r.reason}`);

describe('R2-CODE-B-11 (b) · the brunt and the stakes read one fact (H2-1, H2-2, H2-3)', () => {
  it('collected: nobody bears the brunt for a house whose stake is "no stake yet" or gains', () => {
    expectNoSeedFailures(collectSeedFailures(BRUNT_NO_LOSS, (seed) => {
      const s = born[seed];
      for (const e of entries(s)) expect(bruntOffLoss(s, e), `${seed} ${e.type}`).toEqual([]);
    }), 'every brunt is of a house that loses');
  });
  it('GUARD: a brunt of a house that loses stays, in each of its three words', () => {
    const words = BRUNT_KEPT.map((seed) => {
      const s = born[seed];
      const rows = entries(s).flatMap((e) => e.cast.roles.filter((/** @type {any} */ r) => r.role === 'brunt' && r.kind === 'npc'));
      expect(rows.length, seed).toBeGreaterThan(0);
      for (const e of entries(s)) expect(bruntOffLoss(s, e), seed).toEqual([]);
      return rows[0].reason;
    });
    // R2-CODE-B-13, M4 (RE-KEYED BY IDENTITY): r2r-village-58's brunt was the lever's holder (Sudha Ghosh, "one of the
    // house" by the cut's #268); the lever's holder no longer bears the brunt, and the next of the house takes it in the
    // same word with the vocabulary's own next-in-line clause (Anuradha Bhatt).
    expect(words).toEqual([CAST_REASONS.bruntOnly, CAST_REASONS.bruntLeast, `${CAST_REASONS.bruntMember}; ${CAST_REASONS.nextInLine}`]);
  });
  it('GUARD: where the one power has no stake, the role is ABSENT by its own reason', () => {
    const s = born[BRUNT_TAKEN_OFF];
    const e = entries(s).find((x) => x.cast?.stakes?.length);
    expect(e.cast.roles.some((/** @type {any} */ r) => r.role === 'brunt')).toBe(false);
    expect(e.cast.absent).toContainEqual({ role: 'brunt', reason: CAST_ABSENCES.noBase });
  });
});
