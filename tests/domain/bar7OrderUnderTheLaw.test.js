/**
 * bar7OrderUnderTheLaw.test.js — BAR7-ORDER (BRIEF-BAR7's section BAR7-ORDER; vetoable by the owner): LAW 9's `9a.order` and
 * the audit's `low.hook-party` ("the old families") KEPT AS A GUARD, over fixed seeds.
 *   (a) 9a.order: in every siege town of the sixth read's thirty and the wide read's 150 (`bar0-hamlet-under_siege` and
 *       `bar0-city-under_siege+famine`, rand-27 to rand-44), the safety line AS PRINTED (`defenseDisplay.js ::
 *       deriveSafetyLine`) says no force keeps order where the page prints `Law & order · Collapsed` (the audit's own
 *       pattern, `tests/helpers/pageLaws/law9w.mjs :: rules9a`, verbatim), and holds no siege order clause there (its frame,
 *       `SIEGE_ORDER_FRAME`, which also reads the two subjects the audit's pattern does not);
 *   (b) THE CONTROL C5430 (bar0-city-under_siege+famine-rand-43): its STORED line keeps the drawn clause (the draw is not
 *       moved); the printed line holds the garrison's twin; a DM's own line prints as written;
 *   (c) KEEP: above Collapsed each siege clause prints as drawn;
 *   (d) low.hook-party: in the towns of the 720 and the 150 whose guard line named "the old families" with no power,
 *       conflict, tension or crisis of the record naming them (the audit's own reading, `lowFamiliesI.mjs`), the printed
 *       guard line names no such party; where the record holds them the drawn line prints as drawn;
 *   (g) THE CHAIR'S E88 (2026-11-22): a hook is a LEAD, not the record's party. The differential pin: where the record's only
 *       families word is inside a stored plot hook, the guard line prints as it prints with no such hook; where a tension's
 *       sides name the old families, the families' line stands.
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { deriveGuardAssessment, deriveSafetyLine } from '../../src/domain/display/defenseDisplay.js';
import { lawBandOf } from '../../src/domain/facts/lawBand.js';
import { GUARD_LAW_SIBLINGS, SIEGE_ORDER_FRAME, guardLineUnderTheLaw, safetyLineAsPrinted } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { applyUserEdit } from '../../src/domain/userEdits.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** CENSUS-3 seedcfg.mjs, its three arms verbatim (as `bar5SafetyLawBand.test.js`). @param {string} seed */
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

/** The siege shapes of the thirty (rand-42..44) and the 150 (rand-27..41). */
const SIEGE = ['bar0-hamlet-under_siege', 'bar0-city-under_siege+famine'].flatMap((s) => Array.from({ length: 18 }, (_, i) => `${s}-rand-${27 + i}`));
/** The siege branch's three subjects, read from the writer's own source (`safetyProfile.js :: milRef`), never pinned here. */
const SUBJECTS = /** @type {RegExpExecArray} */ (/const milRef = inst\.hasGarrison \? '([^']+)' : small \? '([^']+)' : '([^']+)'/
  .exec(readFileSync(new URL('../../src/generators/safetyProfile.js', import.meta.url), 'utf8'))).slice(1);
const TAIL = ', and more harshly as the food runs down';
/** THE AUDIT'S PATTERN, verbatim (`law9w.mjs :: ORDER_KEPT`, `ORDER_SPARED`). */
const ORDER_KEPT = /\b(?:The )?(?:garrison|watch|militia|guard|soldiers)(?: and (?:the )?(?:city )?watch)? keeps? (?:order|the peace)\b/i;
const ORDER_SPARED = /\b(nobody|no one|once kept|cannot keep|can no longer|could not keep|no longer)\b/i;
/** @param {string} line */
const orderKept = (line) => line.split(/(?<=\.)\s+/).filter((s) => ORDER_KEPT.test(s) && !ORDER_SPARED.test(s));

/** The towns whose guard line named the old families with no party on the record, at the base (the 720 and the 150). */
const FAMILIES_UNHELD_TOWNS = [
  // the census's 720 (7 the law-collapse twin, 5 the drawn line)
  'r2r-hamlet-0', 'r2r-hamlet-24', 'r2r-thorp-52', 'r2r-village-17', 'r2s-famine-hamlet-3', 'r2s-indebted-thorp-0', 'r2s-insurgency-hamlet-0',
  'r2s-insurgency-thorp-3', 'r2s-politically_fractured-thorp-3', 'r2s-politically_fractured-village-2', 'r2s-religious_conversion-village-0',
  'r2s-under_siege-thorp-3',
  // the 150 (rand-27..41)
  'bar0-hamlet-calm-rand-28', 'bar0-thorp-calm-rand-38', 'bar0-thorp-calm-rand-39', 'bar0-village-famine-rand-38', 'bar0-village-famine-rand-39',
];
/** THE AUDIT'S KEY, verbatim (`lowFamiliesI.mjs :: KEY['old families']`). */
const FAMILIES_KEY = /famil|noble|clan|elder/i;
/**
 * A tension as the record's party reads it (THE CHAIR'S E88, 2026-11-22): its description, issue, sides and lasting effects;
 * NOT its `plotHooks`. The audit's premise is "the record holds them as a party", and a hook is a lead, not the record's
 * party: since point 96's mixed key (`troubleHooksOf.js`) a resource-scarcity hook "A family that cannot pay the prices
 * asked …" (one household) is kept in five of the audit's towns and the planted Collapsed town, and the whole-tension reading
 * counted it as the old families. The same fields as `guardLineUnderTheLaw.js :: familiesHeldOf`. @param {any} t
 */
const tensionAsParty = (t) => (t && typeof t === 'object' ? { description: t.description, specificIssue: t.specificIssue, factions: t.factions, lastingEffects: t.lastingEffects } : t);
/** @param {any} rec @param {(t: any) => any} tension */
const recordRead = (rec, tension) => JSON.stringify([rec.powerStructure?.factions?.map((/** @type {any} */ f) => f?.faction), rec.conflicts, Array.isArray(rec.history?.currentTensions) ? rec.history.currentTensions.map(tension) : rec.history?.currentTensions, rec.stress, rec.powerStructure?.recentConflict]);
/** THE AUDIT'S READING (`lowFamiliesI.mjs`: the party's key against the record's powers, conflicts, tensions, crisis), each tension read as the record's party (E88). @param {any} rec */
const familiesHeld = (rec) => FAMILIES_KEY.test(recordRead(rec, tensionAsParty));
/** The audit's reading with each tension WHOLE, hooks and all (before E88): the families word anywhere in the record's slice. @param {any} rec */
const familiesWordAnywhere = (rec) => FAMILIES_KEY.test(recordRead(rec, (t) => t));

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR7-ORDER: the siege\'s order clause reads the law band at print; the old families are named only where held', () => {
  test('(a) 9a.order: beside Collapsed, no printed safety line says the force keeps order (the siege towns of the thirty and the 150)', () => {
    let collapsed = 0;
    const failures = collectSeedFailures(SIEGE, (seed) => {
      const t = town(seed);
      if (lawBandOf(t) !== 'collapsed') return;
      collapsed += 1;
      const printed = String(deriveSafetyLine(t) ?? '');
      expect(orderKept(printed), `${seed}: the audit's pattern`).toEqual([]);
      expect(SIEGE_ORDER_FRAME.frame.test(printed), `${seed}: the declared clause beside Collapsed`).toBe(false);
    });
    expectNoSeedFailures(failures);
    expect(collapsed, 'the law holds over towns that print Collapsed').toBeGreaterThan(0);
  }, 600_000);

  test('(b) the control C5430: the stored clause stands, the printed line holds its twin, a DM\'s own line prints as written', () => {
    const t = town('bar0-city-under_siege+famine-rand-43');
    const stored = t.economicState.safetyProfile.safetyDesc;
    expect(lawBandOf(t)).toBe('collapsed');
    expect(stored, 'C5430: the draw is not moved').toContain(`${SUBJECTS[0]}${TAIL}`);
    const twin = SIEGE_ORDER_FRAME.twin(/** @type {RegExpExecArray} */ (SIEGE_ORDER_FRAME.frame.exec(stored))[1]);
    expect(twin, 'the garrison\'s own twin').toBe(`${SUBJECTS[0].split(' keeps ')[0]} holds out, but order among the people has gone, and things get worse as the food runs down`);
    expect(deriveSafetyLine(t), 'the twin prints instead').toContain(twin);
    expect(orderKept(String(deriveSafetyLine(t)))).toEqual([]);
    const edited = structuredClone(t);
    applyUserEdit(edited, 'economicState.safetyProfile.safetyDesc', stored);
    expect(deriveSafetyLine(edited), 'a DM\'s own line is printed as written').toBe(stored);
  }, 600_000);

  test('(c) KEEP: above Collapsed each siege clause prints as drawn', () => {
    const neutral = { history: { currentTensions: [] } };
    expect(lawBandOf(neutral)).toBe('adequate');
    expect(SUBJECTS.length).toBe(3);
    for (const k of SUBJECTS) {
      const line = `${k}${TAIL}. People quarrel over rations.`;
      expect(SIEGE_ORDER_FRAME.frame.test(line), k).toBe(true);
      expect(safetyLineAsPrinted(line, neutral), k).toBe(line);
    }
  });

  test('(d) low.hook-party: the guard line names the old families only where the record holds them', () => {
    expect(FAMILIES_UNHELD_TOWNS.length, 'the towns the audit found').toBeGreaterThan(0);
    const failures = collectSeedFailures(FAMILIES_UNHELD_TOWNS, (seed) => {
      const t = town(seed);
      expect(familiesHeld(t), `${seed}: the record holds no such party`).toBe(false);
      expectPresentThenAbsent(String(t.economicState.safetyProfile.guardEffectivenessDesc), String(deriveGuardAssessment(t) ?? ''), 'The old families', `${seed}: stored, then printed`);
    });
    expectNoSeedFailures(failures);
    const drawn = Object.keys(GUARD_LAW_SIBLINGS)[0];
    const held = { history: { currentTensions: [] }, powerStructure: { factions: [{ faction: 'Council of Elders' }] } };
    expect(guardLineUnderTheLaw(drawn, held), 'held: the drawn line prints as drawn').toBe(drawn);
    expectPresentThenAbsent(drawn, guardLineUnderTheLaw(drawn, { history: { currentTensions: [] } }), 'The old families', 'unheld: no party');
  }, 600_000);

  // THE CHAIR'S READ OF 4275a997d (2026-11-17), point 4: planted Collapsed records, each subject and each families' line.
  test('(e) planted: beside Collapsed each subject prints its own twin ("holds out", "hold out"), presuming only the siege', () => {
    const t = structuredClone(town('bar0-city-under_siege+famine-rand-43'));
    expect(lawBandOf(t)).toBe('collapsed');
    const heads = SUBJECTS.map((k) => k.replace(/ (?:keeps? order|has taken charge of the streets)$/, ''));
    expect(heads.length).toBe(3);
    for (const [i, k] of SUBJECTS.entries()) {
      const drawn = `${k}${TAIL}. People quarrel over rations.`;
      t.economicState.safetyProfile.safetyDesc = drawn;
      const verb = heads[i] === 'Those holding the place' ? 'hold' : 'holds';
      const printed = String(deriveSafetyLine(t));
      expect(printed, k).toBe(`${heads[i]} ${verb} out, but order among the people has gone, and things get worse as the food runs down. People quarrel over rations.`);
      expectPresentThenAbsent(drawn, printed, `${k}${TAIL}`, `${heads[i]}: the drawn clause, then its twin`);
    }
  }, 600_000);

  test('(f) planted: the oldest families\' lines name no party where the record holds none, beside Collapsed and above it', () => {
    // every line of the table that names "the oldest families": the no-watch line, the two quarrel lines, and their twins
    const lines = [...new Set(Object.values(GUARD_LAW_SIBLINGS).flatMap((set) => set.map((l) => l.text)))].filter((l) => /\bthe oldest families\b/.test(l));
    expect(lines.length, 'the no-watch line, the two quarrel lines and their Collapsed twins').toBe(5);
    const collapsedUnheld = town('bar0-hamlet-under_siege-rand-29');
    expect(lawBandOf(collapsedUnheld)).toBe('collapsed');
    expect(familiesHeld(collapsedUnheld), 'the planted Collapsed record holds no party').toBe(false);
    const quiet = { history: { currentTensions: [] } };
    const held = { history: { currentTensions: [] }, powerStructure: { factions: [{ faction: 'Council of Elders' }] } };
    for (const line of lines) {
      for (const [label, rec] of /** @type {Array<[string, unknown]>} */ ([['collapsed', collapsedUnheld], ['above Collapsed', quiet]])) {
        const printed = guardLineUnderTheLaw(line, rec);
        expectPresentThenAbsent(line, printed, 'the oldest families', `${label}: ${line}`);
        expect(printed, `${label}: every place's words`).toContain('the heads of households');
      }
      expect(guardLineUnderTheLaw(line, held), 'held: as drawn').toBe(line);
    }
    // the noble pool's own names hold the party (the reading takes them from the pool, `powerData.js`)
    for (const faction of ['The Peerage', 'The Old Houses']) {
      expect(guardLineUnderTheLaw(lines[0], { history: { currentTensions: [] }, powerStructure: { factions: [{ faction }] } }), faction).toBe(lines[0]);
    }
    // whole words only: a welder or a clandestine house names no family
    const welder = { history: { currentTensions: ['A welder keeps a clandestine shop'] } };
    expectPresentThenAbsent(lines[0], guardLineUnderTheLaw(lines[0], welder), 'the oldest families', 'whole words only');
  }, 600_000);

  // THE CHAIR'S E88 (2026-11-22): CURE (B). The six towns whose ONLY families word on the record is the resource-scarcity hook
  // kept by point 96's mixed key ("A family that cannot pay the prices asked …"), found by the search over the 720 and the
  // 150 (the hook-only towns whose stored guard line names the old families; arm (d)'s five and arm (f)'s planted town);
  // the TRUE holder r2r-village-58 (Collapsed), whose population-friction tension's sides are "Old families".
  const HOOK_ONLY_TOWNS = ['r2r-hamlet-0', 'r2r-hamlet-24', 'r2s-famine-hamlet-3', 'bar0-village-famine-rand-38', 'bar0-village-famine-rand-39', 'bar0-hamlet-under_siege-rand-29'];
  const PARTY_WORDS = /\bThe old families\b|\bthe oldest families\b/;
  /** The record with every tension's stored plot hooks taken away, nothing else. @param {any} t */
  const withoutHooks = (t) => {
    const bare = structuredClone(t);
    for (const x of bare.history.currentTensions) if (x && typeof x === 'object') x.plotHooks = [];
    return bare;
  };
  test('(g) a hook is a lead, not the record\'s party: a families word only in a plot hook prints the no-hook line; a tension\'s sides naming the old families keep the families\' line', () => {
    const failures = collectSeedFailures(HOOK_ONLY_TOWNS, (seed) => {
      const t = town(seed);
      const bare = withoutHooks(t);
      expect(familiesWordAnywhere(t), `${seed}: a families word on the record, hooks and all`).toBe(true);
      expect(familiesWordAnywhere(bare), `${seed}: the hook is the ONLY families word`).toBe(false);
      const stored = String(t.economicState.safetyProfile.guardEffectivenessDesc);
      const printed = String(deriveGuardAssessment(t) ?? '');
      expect(printed, `${seed}: prints as the place with no such hook prints`).toBe(String(deriveGuardAssessment(bare) ?? ''));
      expectPresentThenAbsent(stored, printed, /** @type {RegExpExecArray} */ (PARTY_WORDS.exec(stored))[0], `${seed}: stored, then printed`);
      expect(printed, `${seed}: every place's words`).toMatch(/\bThe neighbours\b|\bthe heads of households\b/);
    });
    expectNoSeedFailures(failures);
    // the other direction: the true holder's sides name the old families, so the families' line stands, with its hooks or without
    const holder = town('r2r-village-58');
    expect(lawBandOf(holder)).toBe('collapsed');
    expect(holder.history.currentTensions.some((/** @type {any} */ x) => /\bold families\b/i.test(JSON.stringify([x?.description, x?.specificIssue, x?.factions]))), 'r2r-village-58: a tension\'s sides name the old families').toBe(true);
    const printed = String(deriveGuardAssessment(holder) ?? '');
    expect(printed, 'r2r-village-58: the families\' line').toMatch(PARTY_WORDS);
    expect(String(deriveGuardAssessment(withoutHooks(holder)) ?? ''), 'r2r-village-58: the hooks do not hold it').toBe(printed);
  }, 600_000);
});
