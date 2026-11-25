/**
 * bar5SafetyLawBand.test.js — BAR5-SAFETY (BRIEF-BAR5 Amendment L, L4; vetoable by the owner): LAW 2's `L2.law.collapsed`
 * KEPT AS A GUARD. The audit's own rule (`tests/helpers/pageLaws/law2.mjs :: RULES`, its reach and its claim, unchanged)
 * read over births: the REACH is the Foundations row as the page prints it (`foundationBandShown.js`, the row's own reader
 * over the model's band), the CLAIM is read on the guard assessment as the Defense tab and the export print it
 * (`defenseDisplay.js :: deriveGuardAssessment`). The one fact both read: `facts/lawBand.js :: lawBandOf`.
 *   (a) ZERO over the census's small towns (r2r- and r2s- thorps, hamlets and villages of the 720: the no-watch lines are
 *       drawn only there) and the read towns of REVIEW-BAR-5 that print the band Collapsed;
 *   (b) THE FACT IS THE ROW (the chair's ruling LB2): the row reads `lawBandOf`, and its band over the census's 720 is the
 *       band it printed before the ruling, town by town;
 *   (c) A POSITIVE CONTROL from the read's real row C42116 (bar0-village-famine-rand-24): its STORED line (the draw is not
 *       moved) still fires the rule beside its band; the printed line does not; a DM's own line is printed as written;
 *   (d) KEEP: where the band is above Collapsed the drawn line prints as drawn.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { RULES } from '../helpers/pageLaws/law2.mjs';
import { bandForVariable } from '../../src/domain/causalState.js';
import { crimeWaveStands, foundationBandShown } from '../../src/domain/display/foundationBandShown.js';
import { deriveGuardAssessment } from '../../src/domain/display/defenseDisplay.js';
import { lawBandOf, ownCrimeUnsafe, quietPlaceKeepsLaw } from '../../src/domain/facts/lawBand.js';
import { readFileSync } from 'node:fs';
import { GUARD_LAW_FRAMES, GUARD_LAW_SIBLINGS, SIEGE_ORDER_FRAME, guardLineUnderTheLaw, safetyLineSaidOnce } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { deriveSafetyLine } from '../../src/domain/display/defenseDisplay.js';
import { governsLine } from '../../src/domain/summary/settlementQuickGuide.js';
import { COURT_AND_PRISON, COURT_NO_PRISON, NO_WATCH_SMALL } from '../../src/generators/safetyProfile.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its three arms verbatim. @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] });
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`)));
  const st = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
};
/** @type {Map<string, any>} */ const towns = new Map();
const town = (/** @type {string} */ seed) => {
  if (!towns.has(seed)) towns.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return towns.get(seed);
};

const SMALL = ['thorp', 'hamlet', 'village'];
const STRESSES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset', 'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
/** The census's 720 (CENSUS-3 seeds.txt), its small towns: r2r-<size>-0..59 and r2s-<stress>-<size>-0..3. */
const CENSUS_SMALL = [
  ...SMALL.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => SMALL.flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];
/** The read towns of REVIEW-BAR-5 the audit found the rule in (its sixty: C42116 and its two siblings), and the wide read's
 * four cities the chair named (18:20 UTC: "crimes carry real consequences", "arrested, heard and held" under Collapsed). */
const READ = ['bar0-village-famine-rand-24', 'bar0-hamlet-calm-rand-21', 'bar0-hamlet-under_siege-rand-21',
  'bar0-city-under_siege+famine-rand-30', 'bar0-city-under_siege+famine-rand-32', 'bar0-city-under_siege+famine-rand-36', 'bar0-city-under_siege+famine-rand-37'];
const SAMPLE = [...CENSUS_SMALL, ...READ];
/** The whole of the census's 720, for the row's band before and after the chair's ruling LB2. */
const CENSUS_720 = [
  ...[...SMALL, 'town', 'city', 'metropolis'].flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => [...SMALL, 'town', 'city', 'metropolis'].flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];
/** The row's law band AS IT WAS before LB2 (`foundationBandShown.js` at 9b719d10b: the model's band under the crime-wave cap). */
const RANK = Object.freeze({ collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 });
/** @param {any} t */
const rowBefore = (t) => {
  const band = /** @type {keyof typeof RANK} */ (bandForVariable(t, 'law_order'));
  return crimeWaveStands(t) && RANK[band] > RANK.strained ? 'strained' : band;
};
/** Every declared original the printed guard line still holds (the table's own declarations, read against the row). @param {string} line */
const declaredHeld = (line) => [...Object.keys(GUARD_LAW_SIBLINGS).filter((k) => line.includes(k)), ...GUARD_LAW_FRAMES.filter((f) => f.frame.test(line)).map((f) => String(f.frame))];

/** THE AUDIT'S RULE, unchanged (`law2.mjs`). */
const RULE = /** @type {{ reach: RegExp, claim: RegExp }} */ (RULES.find((r) => r.id === 'L2.law.collapsed'));
/** The Foundations row as printed (SubstrateTab.jsx: `Law & order · <Band>`), read by the row's own reader. @param {any} t */
const rowPrinted = (t) => {
  const band = foundationBandShown(t, 'law_order', /** @type {string} */ (bandForVariable(t, 'law_order')));
  return `Law & order · ${band.charAt(0).toUpperCase()}${band.slice(1)}`;
};
/** The rule's instances on one town: the printed guard line where the printed row is the rule's reach. @param {string} row @param {unknown} line */
const instances = (row, line) => (RULE.reach.test(row) && typeof line === 'string' && RULE.claim.test(line) ? [line] : []);

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR5-SAFETY: a line that says how a wrong is answered reads the law band the page prints', () => {
  test('(a) zero instances over the sample, by the audit\'s rule and by the table\'s own declarations', () => {
    const failures = collectSeedFailures(SAMPLE, (seed) => {
      const t = town(seed);
      const row = rowPrinted(t);
      const printed = deriveGuardAssessment(t);
      expect(instances(row, printed), `${seed}`).toEqual([]);
      if (row === 'Law & order · Collapsed') expect(declaredHeld(String(printed ?? '')), `${seed}: a declared original beside Collapsed`).toEqual([]);
    });
    expectNoSeedFailures(failures);
  }, 600_000);

  test('(b) ruling LB2: the row reads the one home, and no row moves by it (the 720, town by town)', () => {
    // RE-KEYED BY BAR5-BAND, 2026-11-16 (the chair's ruling LB1, written inside `lawBandOf` by LB2): a quiet place that keeps
    // no office of the law (`quietPlaceKeepsLaw`) prints at least "strained"; every other row is as before. 45 of the 720 lift.
    /** @type {string[]} */ const lifted = [];
    /** @type {string[]} */ const lowered = [];
    const failures = collectSeedFailures(CENSUS_720, (seed) => {
      const t = town(seed);
      const now = foundationBandShown(t, 'law_order', /** @type {string} */ (bandForVariable(t, 'law_order')));
      expect(now, `${seed}: the row reads lawBandOf`).toBe(lawBandOf(t));
      const before = rowBefore(t);
      const floored = quietPlaceKeepsLaw(t) && RANK[/** @type {keyof typeof RANK} */ (before)] < RANK.strained;
      if (floored) lifted.push(seed);
      // WORDS-2, the tenth chair's RULING G9 (1): where the place's own crime makes it Unsafe, the row is capped at `strained`
      const capped = ownCrimeUnsafe(t) && RANK[/** @type {keyof typeof RANK} */ (before)] > RANK.strained;
      if (capped) lowered.push(seed);
      expect(now, `${seed}: the row's band as before, the quiet place's floor, or the own-crime cap`).toBe(floored || capped ? 'strained' : before);
    });
    expectNoSeedFailures(failures);
    // WORDS-2 G9 (1): the own-crime cap lowers 7 of the 720 (measured at 0ec96f13d8 with the cap)
    expect(lowered.length, 'G9 (1): the own-crime places the cap lowers in the 720').toBe(7);
    // re-measured lit (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): the floor lifts 21 of the 720 lit (45 before the flip)
    expect(lifted.length, 'BAR5-BAND LB1: the quiet places the floor lifts in the 720').toBe(21);
  }, 900_000);

  test('(c) the positive control: C42116, its stored line fires beside its row; the printed line is its twin', () => {
    const t = town('bar0-village-famine-rand-24');
    const stored = t.economicState.safetyProfile.guardEffectivenessDesc;
    expect(rowPrinted(t), 'C42116: the page prints the law collapsed').toBe('Law & order · Collapsed');
    expect(stored, 'C42116: the draw is not moved').toBe(NO_WATCH_SMALL[3]);
    expect(instances(rowPrinted(t), stored).length, 'the detector fires on the stored line').toBe(1);
    const twin = GUARD_LAW_SIBLINGS[NO_WATCH_SMALL[3]][1].text;
    expect(deriveGuardAssessment(t), 'the twin prints instead').toBe(twin);
    expect(instances(rowPrinted(t), deriveGuardAssessment(t))).toEqual([]);
    // the same record with the field the DM's own (`userEdits.js`): the DM's words stand, even where the detector reads them
    const edited = structuredClone(t);
    applyUserEdit(edited, 'economicState.safetyProfile.guardEffectivenessDesc', stored);
    expect(deriveGuardAssessment(edited), 'a DM\'s own line is printed as written').toBe(stored);
  }, 600_000);

  test('(d) KEEP: above Collapsed the drawn line prints as drawn; every original is a line the safety writer prints', () => {
    // RE-KEYED BY BAR7-ORDER, 2026-11-17 (BRIEF-BAR7 item 2, low.hook-party): the old families' line names a party, so a
    // record that holds none now prints the no-party twin; the same claim (above Collapsed every original prints as drawn) is
    // held on a record that bears the families, a power named for them, still the model's neutral Adequate.
    const kept = Object.keys(GUARD_LAW_SIBLINGS).map((line) => guardLineUnderTheLaw(line, { history: { currentTensions: [] }, powerStructure: { factions: [{ faction: 'Council of Elders' }] } }));
    for (const [i, line] of Object.keys(GUARD_LAW_SIBLINGS).entries()) {
      // a record of no facts reads the model's neutral 50 (Adequate): every original stands
      expect(kept[i], line).toBe(line);
    }
    for (const line of NO_WATCH_SMALL) expect(Object.keys(GUARD_LAW_SIBLINGS), 'each no-watch line is declared').toContain(line);
    // BAR7-ORDER, 2026-11-17 (9a.order): the siege's order clause joins the law by its frame (the court's form: the subject
    // is the writer's own), each subject of the siege branch's `milRef` and the branch's own tail held to its source
    const SIEGE_SRC = readFileSync(new URL('../../src/generators/safetyProfile.js', import.meta.url), 'utf8');
    expect(SIEGE_SRC.includes('${milRef}, and more harshly as the food runs down`'), 'the siege branch\'s tail').toBe(true);
    const milRef = /const milRef = inst\.hasGarrison \? '([^']+)' : small \? '([^']+)' : '([^']+)'/.exec(SIEGE_SRC);
    expect(milRef, 'the siege branch\'s three subjects').not.toBeNull();
    for (const subject of /** @type {RegExpExecArray} */ (milRef).slice(1)) {
      expect(SIEGE_ORDER_FRAME.frame.test(`${subject}, and more harshly as the food runs down`), subject).toBe(true);
    }
    // the court's lines that say a wrong is answered: each declared or read by its frame, for every force noun the writer passes
    for (const lawRef of ['local watch', 'garrison and city watch', 'citizen militia']) {
      for (const line of COURT_AND_PRISON(lawRef)) {
        expect(Object.keys(GUARD_LAW_SIBLINGS).includes(line) || GUARD_LAW_FRAMES.some((f) => f.frame.test(line)), line).toBe(true);
      }
      expect(GUARD_LAW_FRAMES.some((f) => f.frame.test(COURT_NO_PRISON(lawRef)[2])), 'the court line that names the force').toBe(true);
      // the lines that only say what stands are true in every band: they print as drawn, even beside Collapsed
      const collapsed = { history: { currentTensions: [] }, institutions: [{ name: 'Courthouse' }], powerStructure: { publicLegitimacy: { score: 0 } } };
      for (const line of COURT_NO_PRISON(lawRef).slice(0, 2)) expect(guardLineUnderTheLaw(line, collapsed), line).toBe(line);
    }
  });
});

describe('G6 #11 (WORDS-2): "no stable governing authority" is not told a third time on the Defense tab', () => {
  const C = (/** @type {string} */ seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });
  test('C dp-city-117, dp-city-124 (a city line) and dp-thorp-101 (the small line): the identity line says it, the Defense line does not', () => {
    for (const seed of ['dp-city-117', 'dp-city-124', 'dp-thorp-101']) {
      const s = C(seed);
      expect(governsLine(s), `${seed}: the identity line says it`).toMatch(/no stable governing authority/i);
      const stored = deriveSafetyLine(s);
      expect(stored, `${seed}: the stored line opens with it`).toMatch(/No stable governing authority[.;] /);
      const owner = safetyLineSaidOnce(stored, s, false);
      expect(owner, `${seed}: the owner's Defense line`).not.toMatch(/no stable governing authority/i); // anchored: the stored line is proved to hold the words on the line above
      expect(owner?.length, `${seed}: the rest of the line stays`).toBeGreaterThan(20);
      expect(safetyLineSaidOnce(stored, s, true), `${seed}: a shared page keeps the line whole`).toBe(stored);
    }
  });
});
