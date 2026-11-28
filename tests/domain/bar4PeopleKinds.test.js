// BAR4-PEOPLE (BRIEF-BAR4 amendment K, 2026-11-16): THE PEOPLE'S TWO KINDS, EACH BY ITS DETECTOR (tests/helpers/peopleKinds.js),
// KEPT AS A GUARD. P1 the pair's ties, cured AT THE DRAW by the chair's ruling TI1 (people/ties.js :: drawTies: a pair's second
// tie in the temper of its first; the `lone tie` and `shared place` atoms): a line claiming the two do not speak beside another
// tie of theirs; a warm tie beside an enemy's; a successor's line where the pair shares no house's trade or face and the namer
// heads no power the named sits in; P2 a sex-named everyday word a card is called
// by against its sex. Each arm: (a) THE ZERO over the census towns (CENSUS-3's 720 shapes, `r2r-`/`r2s-`) in which the
// detector fired at 8aef8e7d46 (the measure in docs/chair/2026-11-16/bar4/BAR4-PEOPLE-HANDBACK.md), every town run and
// every failure collected; (b) A POSITIVE CONTROL, a record built here on which the detector MUST fire, so it cannot go
// blind. And the read's own rows (REVIEW-BAR-4: C18833 C41801 C2708 C18802 C4412 C37293 C23720), each red at 8aef8e7d46:
// the refused words and what prints in their place, on the town the read met them in (`bar0-` seeds).
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { pairTieClashes, sexNamedTitleClashes, SEX_NAMED_WORDS, SEX_NAMED_EXCLUSIONS } from '../helpers/peopleKinds.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { cardHonorificOf } from '../../src/domain/people/cardDoor.js';
import { FACE_HONORIFICS, FACE_HONORIFICS_BY_CULTURE, FACE_HONORIFICS_INLAND } from '../../src/data/faceHonorifics.js';
import { STRESS_ECONOMIC_EFFECTS } from '../../src/data/npcData.js';

/** the census's dials (CENSUS-3 :: seedcfg.mjs, verbatim) */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
/** the census's shapes and the bar's read shape (CENSUS-3 :: seedcfg.mjs, its r2r-, r2s- and bar0- arms) @param {string} seed */
function born(seed) {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  let cfg = m ? { ...DEFAULT_CONFIG, ...DIALS, settType: m[1] } : null;
  if (!cfg && (m = seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)))) cfg = { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] };
  if (!cfg && (m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`)))) {
    cfg = { ...DEFAULT_CONFIG, ...(m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] }), settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true };
  }
  if (!cfg) throw new Error(`no shape for ${seed}`);
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}

/** P1: the census towns where the pair's ties clashed at 8aef8e7d46 ('broken' 5; 'successor' every sixth of its 288) */
const P1_TOWNS = Object.freeze([
  'r2r-village-19', 'r2r-city-22', 'r2s-indebted-village-2', 'r2s-monster_pressure-metropolis-0', 'r2s-mass_migration-city-2',
  'r2r-thorp-24', 'r2r-village-32', 'r2r-village-52', 'r2r-town-8', 'r2r-town-24',
  'r2r-town-38', 'r2r-town-52', 'r2r-city-3', 'r2r-city-12', 'r2r-city-23',
  'r2r-city-34', 'r2r-city-42', 'r2r-city-50', 'r2r-city-56', 'r2r-metropolis-2',
  'r2r-metropolis-8', 'r2r-metropolis-14', 'r2r-metropolis-20', 'r2r-metropolis-27', 'r2r-metropolis-33',
  'r2r-metropolis-40', 'r2r-metropolis-48', 'r2r-metropolis-55', 'r2s-under_siege-metropolis-0', 'r2s-famine-city-1',
  'r2s-famine-metropolis-3', 'r2s-occupied-city-3', 'r2s-politically_fractured-village-0', 'r2s-politically_fractured-city-2', 'r2s-indebted-town-3',
  'r2s-indebted-metropolis-2', 'r2s-recently_betrayed-city-1', 'r2s-recently_betrayed-metropolis-3', 'r2s-infiltrated-city-2', 'r2s-plague_onset-village-3',
  'r2s-plague_onset-metropolis-0', 'r2s-succession_void-town-1', 'r2s-succession_void-metropolis-1', 'r2s-monster_pressure-city-0', 'r2s-monster_pressure-metropolis-3',
  'r2s-insurgency-city-2', 'r2s-religious_conversion-village-1', 'r2s-religious_conversion-metropolis-0', 'r2s-slave_revolt-town-2', 'r2s-slave_revolt-metropolis-3',
  'r2s-wartime-metropolis-0', 'r2s-mass_migration-town-2', 'r2s-mass_migration-metropolis-1',
]);
/** P2: the census towns where a woman was called Landlord or Cunning-Man at 8aef8e7d46 (every fourth of its 119, and both Cunning-Man towns) */
const P2_TOWNS = Object.freeze([
  'r2r-hamlet-27', 'r2r-city-3', 'r2r-city-10', 'r2r-city-21', 'r2r-city-30',
  'r2r-city-37', 'r2r-city-44', 'r2r-city-56', 'r2r-metropolis-4', 'r2r-metropolis-9',
  'r2r-metropolis-14', 'r2r-metropolis-21', 'r2r-metropolis-32', 'r2r-metropolis-41', 'r2r-metropolis-51',
  'r2s-under_siege-hamlet-0', 'r2s-famine-city-3', 'r2s-occupied-city-2', 'r2s-politically_fractured-metropolis-1', 'r2s-indebted-hamlet-2',
  'r2s-indebted-metropolis-3', 'r2s-recently_betrayed-metropolis-3', 'r2s-infiltrated-metropolis-0', 'r2s-plague_onset-metropolis-0', 'r2s-succession_void-city-3',
  'r2s-insurgency-city-0', 'r2s-insurgency-metropolis-1', 'r2s-religious_conversion-city-3', 'r2s-slave_revolt-city-3', 'r2s-wartime-city-2',
  'r2s-mass_migration-city-2',
]);
/** P1 'warm-cold': the three census towns where a warm tie stood beside an enemy's at 8aef8e7d46 (the pairs named) */
const WARM_COLD_TOWNS = Object.freeze([
  ['r2r-hamlet-15', 'Otgonbayar Ongut|Üljeytü Merkit'],
  ['r2r-village-11', 'Ekaterina Kozlov|Nikoleta Komarov'],
  // the lit birth's value (the flip, 2026-11-23, CLOSE-5 F-SEAT): the town's ties moved and the base's pair (Dáirine
  // Flaherty|Emmet O'Meara) holds none lit; the town's one pair of two ties lit is this one, a lifelong teacher's (warm) first
  // and a formal teacher's second (the first's temper)
  ['r2s-infiltrated-town-0', "Emmet O'Sullivan|Tailtiu Fitzgerald"],
]);

/** The read's rows: [town, the text that must not print (ties, secrets, presentations), what prints in its place] */
const ROWS = /** @type {Array<[string, string, string, string]>} */ ([
  // the pair's second tie in the temper of its first (TI1): beside a devoted mentorship the enemy's kind is a rival's
  // RE-KEYED BY IDENTITY (BAR7-LINES, 2026-11-17; LAW 10's 10i, C19351): a rival is cold now (`npcData.js :: TIE_TEMPER`), so
  // beside the devoted mentorship the enemy's kind is a grudging respect's; the same town, the same refused words, and the
  // line its place now prints (was: "Alaa ibn Khalid and Latifa al-Amin trained together and have competed ever since.")
  ['C18833', 'bar0-hamlet-calm-rand-23', 'Latifa al-Amin lost a fortune and has not spoken to Alaa ibn Khalid since.', 'There is no arrangement between Alaa ibn Khalid and Latifa al-Amin, only a long record of kept words; in this settlement that makes them remarkable.'],
  // a successor drawn only where the place can pass (TI1): the index resolves to another of the pool's own lines
  // BAR4-CLOSE-SWEEP (2026-11-16, the chair's PD1): the pair keeps its drawn index 7 (as before the round) and prints the successor line's TWIN
  // (`mentor_legacy.desc#7`, where the two share no place); at f19c3b28b the gate had re-drawn it to desc#4's twin ("…spent seven years…")
  // the lit birth's value (the flip, 2026-11-23, CLOSE-5 F-SEAT): the town's ties moved, and the pair's mentor tie draws
  // mentor_legacy #0 lit (was #7's twin, "Bing Shimizu once told a full room that Wei Kimura was the best pupil they had taught.")
  ['C41801', 'bar0-town-occupied-rand-22', 'Bing Shimizu named Wei Kimura as successor in front of witnesses.', "Bing Shimizu made Wei Kimura's career, and he rarely says so."],
  ['C4412', 'bar0-city-under_siege+famine-rand-22', 'Bought the vineyard by lending its old owner money', 'Came by the business by lending its old owner money'],
  ['C37293', 'bar0-town-calm-rand-22', "Bashir al-Jabbar governs on Imad al-Andalusi's credit.", "Bashir al-Jabbar holds office on Imad al-Andalusi's credit."],
  ['C23720', 'bar0-metropolis-calm-rand-21', 'a good ear on the waterfront.', 'a good ear at the berths.'],
]);
/** The read's honorific rows: [row, town, the woman, the refused word, her word] */
const HONORIFICS = /** @type {Array<[string, string, string, string, string]>} */ ([
  ['C2708', 'bar0-city-under_siege+famine-rand-22', 'Khulood al-Misri', 'Landlord', 'Landlady'],
  ['C18802', 'bar0-hamlet-calm-rand-23', 'Latifa al-Amin', 'Landlord', 'Landlady'],
]);
/** KEEP: a successor's line that is true (the namer heads a power the named sits in: the place is the head's seat) still prints */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-hamlet-18', 'Rian Fitzgerald named Sadhbh Doherty as successor in front of witnesses.'],
  ['r2r-village-16', 'Hildegard Maier named Zita Lange as successor in front of witnesses.'],
]);

/** @type {Record<string, any>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const seeds = new Set([...P1_TOWNS, ...P2_TOWNS, ...WARM_COLD_TOWNS.map((r) => r[0]), ...ROWS.map((r) => r[1]), ...HONORIFICS.map((r) => r[1]), ...KEEP.map((r) => r[0])]);
  for (const seed of seeds) towns[seed] = born(seed);
}, 900000);

/** the ties' text, the secrets and the presentations, as one string @param {any} s */
const said = (s) => JSON.stringify({ relationships: s.relationships, npcs: (s.npcs || []).map((/** @type {any} */ n) => [n.secret ?? null, n.presentation ?? null]) });
/** @param {any} s @param {string} name */
const card = (s, name) => (s.npcs || []).find((/** @type {any} */ n) => n.name === name);

describe('BAR4-PEOPLE · P1 the pair\'s ties (detector: pairTieClashes)', () => {
  it('(a) the zero: no line claims a silence the pair\'s other tie denies, no successor is named where the place cannot pass, no warm tie stands beside an enemy\'s', () => {
    const failures = collectSeedFailures([...P1_TOWNS, ...WARM_COLD_TOWNS.map((r) => r[0]), ...KEEP.map((r) => r[0])], (seed) => {
      expect(pairTieClashes(towns[seed]), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'P1: zero in the towns where it printed at 8aef8e7d46');
  });
  it('(a) warm-cold: each named pair still carries its two ties, the second now in the first\'s temper (a rival\'s, or a formal teacher\'s)', () => {
    const failures = collectSeedFailures(WARM_COLD_TOWNS, ([seed, pair]) => {
      const ties = (towns[seed].relationships || []).filter((/** @type {any} */ t) => [t.npc1Name, t.npc2Name].sort().join('|') === pair);
      expect(ties.length, seed).toBe(2);
    });
    expectNoSeedFailures(failures, 'P1 warm-cold: the pair keeps both ties');
  });
  it('(b) positive control: a constructed town of three clashes, each of the three kinds', () => {
    const mentor = STRESS_ECONOMIC_EFFECTS.mentor_legacy;
    const successorRow = mentor.desc.lines.findIndex((/** @type {any} */ r) => r && r.successor);
    expect(successorRow).toBeGreaterThanOrEqual(0);
    const a = { id: 'a', name: 'Ada Tanner', gender: 'female', category: 'craft', institution: { kind: 'house', key: 'Tannery', family: 'Tannery', title: 'the tanner' }, memberships: [] };
    const b = { id: 'b', name: 'Bo Joiner', gender: 'male', category: 'religious', institution: { kind: 'house', key: 'Carpenter', family: 'Carpenter', title: 'the carpenter' }, memberships: [] };
    const line = /** @type {any} */ (mentor.desc.lines[successorRow]).line;
    const record = {
      institutions: [], npcs: [a, b],
      relationships: [
        { id: 't1', from: 'a', to: 'b', type: 'mentor_student', strength: 'devoted', typeName: mentor.label, archetypeKey: 'mentor_legacy', proseVariant: successorRow, description: line(a, b), tension: '', npc1Name: a.name, npc2Name: b.name },
        { id: 't2', from: 'b', to: 'a', type: 'enemy', strength: 'mortal', typeName: 'Unresolved History', archetypeKey: 'quiet', proseVariant: 0, description: 'Bo Joiner and Ada Tanner have not spoken in years.', tension: '', npc1Name: b.name, npc2Name: a.name },
      ],
    };
    const quiet = { desc: { lines: [{ line: (/** @type {any} */ r, /** @type {any} */ s) => `${r.name} and ${s.name} have not spoken in years.`, contact: 'none' }] }, tension: { lines: [] } };
    const kinds = pairTieClashes(record, { archetypes: { ...STRESS_ECONOMIC_EFFECTS, quiet } }).map((i) => i.kind).sort();
    expect(kinds).toEqual(['broken', 'successor', 'warm-cold']);
  });
});

describe('BAR4-PEOPLE · P2 a sex-named everyday title (detector: sexNamedTitleClashes)', () => {
  it('(a) the zero: no woman is called by a man\'s everyday word, nor a man by a woman\'s', () => {
    const failures = collectSeedFailures([...P2_TOWNS, ...HONORIFICS.map((r) => r[1])], (seed) => {
      expect(sexNamedTitleClashes(towns[seed]), seed).toEqual([]);
    });
    expectNoSeedFailures(failures, 'P2: zero in the towns where it printed at 8aef8e7d46');
  });
  it('(a) every pool: an honorific that names a sex is a { male, female } pair (all three tables, every culture)', () => {
    const pools = [FACE_HONORIFICS, FACE_HONORIFICS_INLAND, ...Object.values(FACE_HONORIFICS_BY_CULTURE)];
    /** @type {string[]} */
    const unpaired = [];
    for (const table of pools) for (const [title, pool] of Object.entries(table)) for (const h of pool) {
      if (typeof h !== 'string') continue;
      for (const sex of /** @type {const} */ (['male', 'female'])) {
        const holder = { id: 'x', name: 'X', gender: sex === 'male' ? 'female' : 'male', role: h };
        if (sexNamedTitleClashes({ npcs: [holder] }).length) unpaired.push(`${title}: ${h}`);
      }
    }
    expect(unpaired).toEqual([]);
  });
  it('(b) positive control: a woman whose role is "Landlord", a man whose role is "Alewife"; an excluded office stays quiet', () => {
    const record = { npcs: [
      { id: 'w', name: 'Wen', gender: 'female', role: 'Landlord' },
      { id: 'm', name: 'Mo', gender: 'male', role: 'Alewife' },
      { id: 'o', name: 'Ola', gender: 'female', role: 'Lord Mayor' },
    ] };
    expect(sexNamedTitleClashes(record).map((i) => `${i.card}:${i.word}`).sort()).toEqual(['Mo:alewife', 'Wen:landlord']);
    expect(SEX_NAMED_WORDS.male).toContain('landlord');
    expect(SEX_NAMED_EXCLUSIONS.length).toBeGreaterThan(0);
  });
  it('KEEP: a man who keeps an inn may still be its Landlord (somewhere among the towns born here)', () => {
    const men = Object.values(towns).flatMap((s) => (s.npcs || []).filter((/** @type {any} */ n) => n.gender === 'male').map((/** @type {any} */ n) => cardHonorificOf(n, s)));
    expect(men).toContain('Landlord');
  });
});

describe('BAR4-PEOPLE · the read\'s rows (REVIEW-BAR-4), each red at 8aef8e7d46', () => {
  for (const [row, seed, refused, instead] of ROWS) {
    it(`${row} ${seed}: not "${refused.slice(0, 44)}…"; what prints instead`, () => {
      const text = said(towns[seed]);
      expectAbsentWithAnchor(text, refused, instead, `${row}: the refused claim; the same slot's true text`);
      expect(text).toContain(instead);
    });
  }
  for (const [row, seed, name, refused, instead] of HONORIFICS) {
    it(`${row} ${seed}: ${name} is no ${refused}; she is the ${instead}`, () => {
      const c = card(towns[seed], name);
      expect(c?.gender).toBe('female');
      const honorific = cardHonorificOf(c, towns[seed]);
      expectAbsentWithAnchor([honorific], refused, instead, `${row}: ${name}'s honorific`);
      expect(honorific).toBe(instead);
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 44)}…" still prints (the namer heads a power the named sits in)`, () => {
      expect(said(towns[seed])).toContain(kept);
    });
  }
});
