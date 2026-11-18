// @vitest-environment node
// FAULTS-WATCH (BRIEF-FAULTS, 2026-11-18): the guard of the seat's four repairs. Each law is read over fixed seeds born as
// the census births them (PAGE-COPY's `seedcfg.mjs`, its r2r- and bar0- arms, verbatim in shape); every seed loop collects
// its failures; a negative stands beside each positive. RED at the base 4288049ba, GREEN at the seat's tip.
//   1. THE CRIME-TYPE ROW: the "(lawless)" row of the Lawlessness crime type reads `lawlessRow` (r2r-city-41: "easily outbid"
//      where a court sits and a gaol holds); where no court sits it keeps "easily outbid" (r2r-city-31).
//   2. THE GATE AND THE LEVY (FR9): a gate held is a post, not a round by day; a levy that musters only "when danger"
//      comes walks no round (bar0-town-calm-rand-36, -37, -40); a force that keeps the day keeps the line (rand-39).
//   3. THE TRUE LINE LOST (BR30 (3)): bar0-city-under_siege+famine-rand-31's Military/Guard takes the final roster's
//      sentence; the Garrison Bloc's twin, which carries no standing, takes none.
//   4. `trade at work` UNDER A SIEGE (BR25 (5)): a house the page marks "Stopped by the siege." is not at work; the leaf's
//      verdict is held EQUAL to the page's on every house of the besieged towns; a curtailed house stays at work.
import { describe, it, expect, beforeAll } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { courtHoldersOf, defenceOf } from '../../src/domain/facts/defence.js';
import * as forceHours from '../../src/domain/facts/forceHours.js';
import * as tradeAtWork from '../../src/domain/facts/tradeAtWork.js';
import { rowStoppedBy } from '../../src/domain/display/crisisStoppedRow.js';
import { liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { crisisOf } from '../../src/domain/facts/crisisKind.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** PAGE-COPY seedcfg.mjs's r2r- and bar0- arms. @param {string} seed */
function configOf(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return { ...DIALS, settType: m[1] };
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (!m) throw new Error(`a guard seed is a census seed: ${seed}`);
  const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
}

const SEEDS = Object.freeze([
  'r2r-city-41', 'r2r-city-31',
  'bar0-town-calm-rand-36', 'bar0-town-calm-rand-37', 'bar0-town-calm-rand-40', 'bar0-town-calm-rand-39',
  'bar0-city-under_siege+famine-rand-31', 'bar0-city-under_siege+famine-rand-46', 'bar0-city-under_siege+famine-rand-36',
  'bar0-hamlet-under_siege-rand-29', 'bar0-hamlet-under_siege-rand-34',
]);

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of SEEDS) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 240_000);

const OUTBID = /\beasily outbid\b/;
const SLOW_LAW = /^The court sits and the gaol holds\b/;
/** the crime type's "(lawless)" rows. @param {any} t */
const lawlessRows = (t) => (t?.availableServices?.criminal || []).filter((/** @type {any} */ r) => r?.institution === '(lawless)');
/** @param {any} t */
const crimeTypes = (t) => (t?.economicState?.safetyProfile?.crimeTypes || []).map((/** @type {any} */ c) => c?.type);
/** @param {any} t */
const courtAndGaol = (t) => courtHoldersOf(t).length > 0 && !!defenceOf(t).prison;

describe('1 · the crime-type "(lawless)" row reads lawlessRow', () => {
  it('every town of the guard: "easily outbid" never prints where a court sits and a gaol holds', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const t = BORN.get(seed);
      for (const r of lawlessRows(t)) if (OUTBID.test(String(r.desc)) && courtAndGaol(t)) throw new Error(`"(lawless)" prints "${r.desc}" beside a sitting court and a gaol`);
    });
    expectNoSeedFailures(failures, 'item 1');
  });
  it('POSITIVE: r2r-city-41 (Lawlessness; a court sits, a gaol holds) prints the slow-law line in the row', () => {
    const t = BORN.get('r2r-city-41');
    expect(crimeTypes(t), 'premise: the crime type').toContain('Lawlessness');
    expect(courtAndGaol(t), 'premise: a court sits and a gaol holds').toBe(true);
    const descs = lawlessRows(t).map((/** @type {any} */ r) => String(r.desc));
    expect(descs.length).toBe(1);
    expect(descs[0]).toMatch(SLOW_LAW);
  });
  it('NEGATIVE: r2r-city-31 (Lawlessness; no gaol holds) keeps "easily outbid"', () => {
    const t = BORN.get('r2r-city-31');
    expect(crimeTypes(t), 'premise: the crime type').toContain('Lawlessness');
    expect(courtAndGaol(t), 'premise: no court and gaol both').toBe(false);
    expect(lawlessRows(t).map((/** @type {any} */ r) => String(r.desc)).some((d) => OUTBID.test(d))).toBe(true);
  });
});

const BY_DAY = /\bon the rounds most hours of the day\b/;
const OTHER_FRAMES = /\b(?:maintains? standard patrol coverage|walks? the usual rounds|patrols? on a regular round)\b/;
/** @param {any} t */
const guardLine = (t) => String(t?.economicState?.safetyProfile?.guardEffectivenessDesc || '');

describe('2 · a gate held is a post, not a round by day; a levy at need walks no round (FR9)', () => {
  it('the atom reads the force\'s own text (constructed rosters)', () => {
    const atom = (/** @type {Array<Record<string, unknown>>} */ institutions) => factsOf({ institutions }).forceWalksByDay;
    const failures = collectSeedFailures([
      { roster: [{ name: 'Town watch', desc: 'Part-time guards. Night patrol and gate duty.' }], want: false, why: 'the night walked, a gate held' },
      { roster: [{ name: 'Town watch', desc: 'Watchmen serving part-time. Night patrols and gate duty.' }], want: false, why: 'its plural' },
      { roster: [{ name: 'Town watch', desc: 'Part-time guards who walk the night and hold the gates.' }], want: false, why: 'the night walked, the gates held' },
      { roster: [{ name: 'Household levy', desc: 'One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields.' }], want: false, why: 'a levy at need' },
      // negatives: a text that keeps the day, or names no hours, walks by day
      { roster: [{ name: 'Town watch', desc: 'Part-time guards. Night patrol, and the market kept by day.' }], want: true, why: 'the day kept' },
      { roster: [{ name: 'Garrison', desc: 'A professional force, under arms full-time.' }], want: true, why: 'no hours named' },
      { roster: [{ name: 'Barracks', desc: 'Housing for guards or small garrison.' }, { name: 'Town watch', desc: 'Part-time guards. Night patrol and gate duty.' }], want: true, why: 'a barracks beside the night watch' },
    ], ({ roster, want, why }) => { expect(atom(roster), why).toBe(want); });
    expectNoSeedFailures(failures, 'item 2 atom');
    expect(forceHours.mustersOnlyAtNeed('Organised community defense. Musters for raids and monster incursions.')).toBe(false);
  });
  it('POSITIVE: bar0-town-calm-rand-36, -37, -40: the night watch at the gate is not on its rounds by day; a patrol frame of the pool prints', () => {
    const failures = collectSeedFailures(['bar0-town-calm-rand-36', 'bar0-town-calm-rand-37', 'bar0-town-calm-rand-40'], (seed) => {
      const t = BORN.get(seed);
      expect(factsOf(t).forceWalksByDay, seed).toBe(false);
      expectAbsentWithAnchor(guardLine(t), 'on the rounds most hours of the day', 'The town watch', `${seed}'s guard line`);
      expect(guardLine(t), seed).toMatch(OTHER_FRAMES);
    });
    expectNoSeedFailures(failures, 'item 2 positives');
  });
  it('NEGATIVE: bar0-town-calm-rand-39 (Barracks beside the watch) keeps the line', () => {
    const t = BORN.get('bar0-town-calm-rand-39');
    expect(factsOf(t).forceWalksByDay).toBe(true);
    expect(guardLine(t)).toMatch(BY_DAY);
  });
});

describe('3 · a power with no old standing takes the final roster\'s sentence (BR30 (3))', () => {
  /** @param {string} name */
  const power = (name) => (BORN.get('bar0-city-under_siege+famine-rand-31')?.powerStructure?.factions || []).find((/** @type {any} */ f) => f?.faction === name);
  it('POSITIVE: bar0-city-under_siege+famine-rand-31: Military/Guard prints "They and the religious authorities both keep people in line"', () => {
    const guard = power('Military/Guard');
    expect(guard, 'premise: the guard power stands').toBeTruthy();
    expect(power('Religious Authorities'), 'premise: the religious authorities stand on the final roster').toBeTruthy();
    expect(String(guard.desc)).toMatch(/ They and the religious authorities both keep people in line\. /);
  });
  it('NEGATIVE: the Garrison Bloc\'s twin (no standing of its own) takes no sentence', () => {
    const bloc = power('The Garrison Bloc');
    expect(bloc, 'premise: the bloc stands').toBeTruthy();
    expect(String(bloc.desc)).toBe('A rival bloc that wants a say over rationing, conscription and defence spending, and disputes the emergency committee\'s hold on them.');
  });
});

describe('4 · trade at work reads the siege\'s stop of a house (BR25 (5))', () => {
  const BESIEGED = SEEDS.filter((s) => /under_siege/.test(s));
  it('every house of the besieged towns: the leaf\'s verdict is the page\'s "Stopped by the siege."', () => {
    expect(typeof tradeAtWork.houseStoppedBySiege, 'the leaf states the stop').toBe('function');
    let stopped = 0;
    const failures = collectSeedFailures(BESIEGED, (seed) => {
      const t = BORN.get(seed);
      expect(crisisOf(t).has('under_siege'), seed).toBe(true);
      for (const h of liveInstitutions(t)) {
        const page = rowStoppedBy(t, 'house', h) === 'under_siege';
        if (page) stopped++;
        if (tradeAtWork.houseStoppedBySiege(t, h) !== page) throw new Error(`${h?.name}: page ${page}, leaf ${!page}`);
      }
    });
    expectNoSeedFailures(failures, 'item 4 equality');
    expect(stopped, 'the guard reads stopped houses').toBeGreaterThan(0);
  });
  it('POSITIVE: a besieged town whose only fish house (or stone house) the page stops: the trade is not at work', () => {
    const failures = collectSeedFailures([
      ['bar0-hamlet-under_siege-rand-29', 'fish', "Fisher's landing"],
      ['bar0-city-under_siege+famine-rand-46', 'fish', 'Fish market'],
      ['bar0-city-under_siege+famine-rand-46', 'stone', 'Stone quarry'],
    ], ([seed, key, house]) => {
      const t = BORN.get(seed);
      const h = liveInstitutions(t).find((/** @type {any} */ i) => i?.name === house);
      expect(rowStoppedBy(t, 'house', h), `premise: ${house} is "Stopped by the siege."`).toBe('under_siege');
      expect(tradeAtWork.tradeAtWorkOf(t, key), `${seed} ${key}`).toBe(false);
    });
    expectNoSeedFailures(failures, 'item 4 positives');
  });
  it('NEGATIVE: a house the siege curtails works what it holds: the trade stays at work', () => {
    const failures = collectSeedFailures([
      ['bar0-hamlet-under_siege-rand-34', 'fish', "Fisher's landing"],
      ['bar0-city-under_siege+famine-rand-36', 'stone', 'Mine'],
    ], ([seed, key, house]) => {
      const t = BORN.get(seed);
      const h = liveInstitutions(t).find((/** @type {any} */ i) => i?.name === house);
      expect(rowStoppedBy(t, 'house', h), `premise: ${house} is "Curtailed by the siege."`).toBe('under_siege:curtailed');
      expect(tradeAtWork.tradeAtWorkOf(t, key), `${seed} ${key}`).toBe(true);
    });
    expectNoSeedFailures(failures, 'item 4 negatives');
  });
});
