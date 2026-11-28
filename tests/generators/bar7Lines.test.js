// THE GUARD OF BAR7-LINES (BRIEF-BAR7, the seat's section, 2026-11-17): SEVEN SINGLE WRITERS, EACH CURED IN ITS OWN WORDS.
// The rules of BAR7-AUDIT-I's hand-back (`docs/chair/2026-11-17/bar7/AUDIT/BAR7-AUDIT-I-HANDBACK.md`), each held here over
// fixed seeds of the sixth read and the census (the towns its instances printed in at the base), and on the writer's table:
//   10i            one pair, one sense: no pair of people holds an ally's (a friend's, a lover's, a warm rung's) tie beside
//                  a rival's or an enemy's (C19351); kin who are rivals, and a rival's grudging or genuine respect, stay apart;
//   6e             the war's requisition goal and the town crier's proclamation name no crown (C16768; the LOW C35481);
//   low.agree      the standing sentence agrees its verb with a plural cause ("Weak defences are the reason");
//   low.generation forty to sixty years is two generations (`yearBand`), its band's id unmoved;
//   history        the iron dispute names no lord (the culture seat's rows 137 and 138) and the corruption hook no reformers;
//   design         a siege's food hook names the channel the food still comes by; the importer's hook says "comes in".
// THE DETECTORS are the auditor's own kinds (`tests/helpers/pageLaws/law10i.mjs :: WARM, COLD`) read on the record, and plain
// patterns of the printed words; none reads the table the cure changed (so a table gone wrong cannot certify itself).
// The counts before and after over the thirty, the 150 and the 720 are in docs/chair/2026-11-17/bar7/BAR7-LINES-HANDBACK.md.
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { WARM, COLD } from '../helpers/pageLaws/law10i.mjs';
import { STRESS_GOAL_OVERRIDES } from '../../src/generators/npcGenerator.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { HISTORICAL_EVENTS_DATA, HISTORY_DESC_SIBLINGS } from '../../src/data/historyData.js';
import { yearBand } from '../../src/domain/display/stateProse/generalStateProse.js';
import { governanceAccountOf } from '../../src/domain/display/governanceAccount.js';

/** The towns the base printed each rule in (the sixth read's controls first), with the rule each one holds. */
const TOWNS = Object.freeze({
  'bar0-hamlet-calm-rand-44': ['10i'], // C19351
  'bar0-city-wartime-rand-44': ['6e'], // C16768
  'bar0-city-under_siege+famine-rand-42': ['design'], // C0350, C0351
  'bar0-city-under_siege+famine-rand-44': ['design'], // C7307, C7309
  'bar0-town-calm-rand-42': ['design'], // C33342
  'bar0-village-famine-rand-44': ['design'], // C45848
  // RE-PICKED 2026-11-23 (THE FLIP, both birth laws lit) (A JUDGEMENT, AT ANOTHER SIZE): bar0-hamlet-calm-rand-42 and -28 lit name no plural cause ("Weak
  // defences keeps …" at the base), and no bar0-hamlet-calm-rand of 0..799 does; the two lowest of the sample's calm town family
  // that do are bar0-town-calm-rand-74 and -131 ("Weak defences are the reason."; 74 131 156 220 221 224 of 0..399)
  'bar0-town-calm-rand-74': ['agree'],
  'bar0-town-calm-rand-131': ['agree'],
});

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** CENSUS-3 seedcfg.mjs's arms (the census's r2r-/r2s- and the bar's bar0-), verbatim in shape. @param {string} seed */
function configOf(seed) {
  const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  let m = seed.match(new RegExp(`^r2r-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, settType: m[1] };
  m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-(\\d+)$`));
  if (m) return { ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-(\\d+)$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return { ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true };
  }
  throw new Error(`a guard seed is a census or a read seed: ${seed}`);
}

/** 10i on the record: each pair with a warm tie (WARM's kinds, or a devoted teacher, a deep respect) and a cold one. @param {any} town */
export function pairsOfTwoSenses(town) {
  const warmRung = { mentor_student: new Set(['devoted', 'lifelong']), respect: new Set(['deep']) };
  const isWarm = (/** @type {any} */ t) => WARM.has(String(t.type)) || !!(/** @type {Record<string, Set<string>>} */ (warmRung))[String(t.type)]?.has(String(t.strength));
  /** @type {Map<string, any[]>} */ const byPair = new Map();
  for (const t of Array.isArray(town?.relationships) ? town.relationships : []) {
    if (!t || t.from == null || t.to == null) continue;
    const k = [String(t.from), String(t.to)].sort().join('|');
    byPair.set(k, [...(byPair.get(k) || []), t]);
  }
  const out = [];
  for (const ts of byPair.values()) {
    if (ts.some((t) => t.covert === true || t.handler === true)) continue; // a covert or a handler's tie: apart, as the auditor reads it
    const warm = ts.filter(isWarm); const cold = ts.filter((t) => COLD.has(String(t.type)));
    if (!warm.length || !cold.length) continue;
    // kin who are rivals, and respect beside a rivalry, can both be true: apart (BRIEF-BAR7: never made impossible)
    if (warm.every((t) => String(t.type) === 'family' || String(t.type) === 'respect' || String(t.type) === 'mentor_student')) continue;
    out.push(ts.map((t) => `${t.npc1Name} -> ${t.npc2Name}: ${t.type}/${t.strength}`).join(' ; '));
  }
  return out;
}

const CROWN = /\b(crown|royal|king|queen)\b/i;
const PLURAL_SINGULAR = /\b(?:Weak defences|Strong defences|Full stores) (?:is|keeps|has)\b/;

/** @type {Map<string, any>} */
const BORN = new Map();
beforeAll(async () => {
  const boundary = await import('../../src/domain/density/densityCreateBoundary.js');
  const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
  const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
  await boundary.loadGenerationLawPayloads();
  for (const seed of Object.keys(TOWNS)) BORN.set(seed, generateSettlementPipeline(boundary.birthConfig({ ...DEFAULT_CONFIG, ...configOf(seed) }), null, { seed, customContent: {} }));
}, 600000);

describe('BAR7-LINES: seven single writers, each in its own words', () => {
  it('10i: one pair, one sense, in every town of the sample', () => {
    /** @type {string[]} */ const found = [];
    for (const [seed, town] of BORN) for (const p of pairsOfTwoSenses(town)) found.push(`${seed}: ${p}`);
    expect(found).toEqual([]);
    // LIVENESS: C19351's pair is still two ties, so the reading above is not blind
    const hamlet = BORN.get('bar0-hamlet-calm-rand-44');
    const ids = (hamlet.relationships || []).map((/** @type {any} */ t) => [String(t.from), String(t.to)].sort().join('|'));
    expect(ids.length - new Set(ids).size, 'a pair with two ties stands in the control town').toBeGreaterThan(0);
  });

  it('10i: the detector fires on the control\'s own pair as the base drew it', () => {
    const planted = { relationships: [
      { from: 'a', to: 'b', type: 'rival', strength: 'professional', npc1Name: 'Sorcha', npc2Name: 'Nessa' },
      { from: 'b', to: 'a', type: 'ally', strength: 'moderate', npc1Name: 'Nessa', npc2Name: 'Sorcha' },
    ] };
    expect(pairsOfTwoSenses(planted)).toHaveLength(1);
    const kin = { relationships: [{ from: 'a', to: 'b', type: 'rival', strength: 'personal' }, { from: 'b', to: 'a', type: 'family', strength: 'close' }] };
    expect(pairsOfTwoSenses(kin), 'kin who are rivals stay apart').toEqual([]);
  });

  it('6e: the war\'s requisition and the crier\'s proclamation name no crown', () => {
    const gov = STRESS_GOAL_OVERRIDES.wartime.gov;
    expect(`${gov.short} | ${gov.note}`.match(new RegExp(CROWN.source, 'gi')) ?? []).toEqual([]);
    expectAbsentWithAnchor(`${gov.short} | ${gov.note}`, 'crown', "the army's requisition order", 'the war goal names the army, no crown');
    const crier = /** @type {Record<string, { desc: string }>} */ (/** @type {any} */ (INSTITUTION_SERVICES)['Town crier']);
    expect(crier['Official announcements'].desc.match(new RegExp(CROWN.source, 'gi')) ?? []).toEqual([]);
    expectAbsentWithAnchor(crier['Official announcements'].desc, 'royal', 'laws, decrees and official notices', 'the crier proclaims no royal decree');
    const war = BORN.get('bar0-city-wartime-rand-44');
    const goals = (war.npcs || []).map((/** @type {any} */ n) => `${n?.goal?.short ?? ''} ${n?.goal?.note ?? ''} ${n?.goal?.stressNote ?? ''}`);
    expect(goals.filter((g) => /crown requisition|crown's requisition/.test(g))).toEqual([]);
    expect(goals.some((g) => /army's requisition order/.test(g)), 'C16768\'s card still wants the requisition met').toBe(true);
  });

  it('low.agree: a plural cause takes a plural verb', () => {
    const accounts = [...BORN].map(([seed, town]) => ({ seed, text: String(governanceAccountOf(town)?.text ?? '') }));
    const failures = collectSeedFailures(accounts, ({ seed, text }) => {
      expect(PLURAL_SINGULAR.test(text) ? `${seed}: ${text}` : null).toBe(null);
    });
    expectNoSeedFailures(failures, 'a plural cause takes a plural verb in every town of the sample');
    expect(accounts.filter(({ text }) => /\bWeak defences\b/.test(text)).length, 'POSITIVE: the plural cause is still named in the sample').toBeGreaterThan(0);
  });

  it('low.generation: forty to sixty years is two generations; the band keeps its id', () => {
    expect(yearBand(45).predicate).toBe('two generations old');
    expect(yearBand(40).id).toBe('a_generation');
    expect(yearBand(59).span).toBe('two generations');
    expect(yearBand(30).predicate, 'under forty years it is one generation').toBe('a generation old');
    expect(yearBand(20).predicate).toBe('a generation old');
  });

  it('history: the iron dispute names no lord; the corruption hook names no reformers', () => {
    const iron = Object.entries(HISTORY_DESC_SIBLINGS).filter(([k]) => /iron/.test(k)).flatMap(([, set]) => set.map((l) => /** @type {any} */ (l).text));
    expect(iron.length, 'LIVENESS: the iron dispute is still declared').toBeGreaterThan(1);
    expect(iron.filter((t) => /\blord\b/i.test(t))).toEqual([]);
    const hooks = HISTORICAL_EVENTS_DATA.flatMap((e) => e.plotHooks || []).map((h) => (typeof h === 'string' ? h : /** @type {any} */ (h).text));
    expect(hooks.filter((h) => /the reformers are being used/.test(String(h)))).toEqual([]);
    expect(hooks.some((h) => /corruption goes higher than anyone yet suspects/.test(String(h))), 'POSITIVE: the hook stands').toBe(true);
  });

  it('design: a siege\'s food hook names its channel; the importer holds what comes in', () => {
    const sieges = collectSeedFailures(['bar0-city-under_siege+famine-rand-42', 'bar0-city-under_siege+famine-rand-44'], (seed) => {
      expectAbsentWithAnchor(JSON.stringify(BORN.get(seed)), 'what food can still be bought from outside costs more every week',
        'what food the teleportation circle still brings in costs more every week', `${seed}: the siege's hook names its channel`);
    });
    expectNoSeedFailures(sieges, 'every siege town of the sample names the channel its food still comes by');
    // the importer's hook in every town of the sample, as one collection: the new words must print, the old ones nowhere
    const importerLines = [...BORN.values()].flatMap((t) => JSON.stringify(t).match(/One importer now [^"]*/g) ?? []).join('\n');
    expectAbsentWithAnchor(importerLines, 'One importer now brings in all the grain', 'One importer now holds all the grain that comes in from outside', 'the importer holds what comes in');
  });
});
