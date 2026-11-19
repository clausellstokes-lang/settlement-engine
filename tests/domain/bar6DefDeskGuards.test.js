/**
 * bar6DefDeskGuards.test.js — BAR6-DEFDESK (BRIEF-BAR6 L4, B3; vetoable by the owner): THE DEFENCE DESK'S LINES DECLARE WHAT
 * THEY PRESUME, KEPT AS A GUARD. The desk's every pool (`defense.generated.js`, the annex's DS-DEF blocks) read through the
 * kernel's own eligibility (`stateProseKernel.js :: eligibleVariants`, with the facts the desk hands in at its entry) over
 * births; every line a town's state admits is read by the auditors' rules:
 *   - LAW 6's `6a-size` BY THE AUDITOR'S OWN FUNCTION (`tests/helpers/pageLaws/law6.mjs :: law6a`, over the admitted lines
 *     written as the page's Defense tab): streets and alleys need a village, districts and quarters a town;
 *   - LAW 7's `7a-nothreat` and `7b-defence` and LAW 9's `9a.wave`, `9a.curfew`, `9a.contested`, `9a.balance`, `9c.putby`,
 *     `9c.nothing-over` and BAR5's court line: the auditors' claim words (`law7.mjs`, `law9.mjs`, copied below by rule) against
 *     the one fact each now reads (`monsterFrontier.js`, the crisis record, `foundationBandShown.js :: crimeWaveStands`,
 *     `storesMonths.js`, `growsMoreThanEats.js`, `lawBand.js :: lawBandOf`, the defence roster).
 *   (a) ZERO over the sample: no admitted line of the desk makes its claim in a town whose state denies it;
 *   (b) THE ATOMS: each new atom answers from its leaf, on constructed records, in the vocabulary's own reading;
 *   (c) A POSITIVE CONTROL from the wide read's real rows (REVIEW-WIDE-6, SECOND-CHECK.final221): each cured line's marks AT
 *       afa46d644 (written here) still admit it in its own town, and the rule fires on it: the guard cannot go blind;
 *   (d) KEEP: each twin is admitted where its original is refused, so no cured pool is left mute in its town.
 *   (e) THE CHAIR'S RULINGS EG1 and XA2: over the census's 720, the one reading (`lawBand.js :: crimeWaveStands`, BAR6-CRIME's,
 *       eager-safe) equals what the display leaf answers (`foundationBandShown.js :: crimeWaveStands`), and `monsterFrontier.js`'s band arm (below `SCORE_BAND_CUTS.adequate`,
 *       zero-import) equals the band `defenseScoreBands.js :: scoreBand` prints.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { eligibleVariants } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { factsAnswered } from '../../src/domain/facts/factsAnswered.js';
import { crisisAnswered } from '../../src/domain/crisis/crisisFacts.js';
import { wallsAnswered } from '../../src/domain/defense/defenseFacts.js';
import { atomHolds, FACT_DIMENSIONS } from '../../src/domain/facts/factVocabulary.js';
import { monsterFrontierOf } from '../../src/domain/facts/monsterFrontier.js';
import { growsMoreThanEatsOf } from '../../src/domain/facts/growsMoreThanEats.js';
import { crimeWaveStands } from '../../src/domain/display/foundationBandShown.js';
import { crimeWaveStands as crimeWaveOfLaw } from '../../src/domain/facts/lawBand.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { normalizeMonsterThreat } from '../../src/data/monsterThreat.js';
import { lawBandOf } from '../../src/domain/facts/lawBand.js';
import { storesMonthsOf } from '../../src/domain/facts/storesMonths.js';
import { crisisOf } from '../../src/domain/facts/crisisKind.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { readTownC } from '../helpers/pageLaws/pageC.mjs';
import { law6a } from '../helpers/pageLaws/law6.mjs';
import { DEF7_DARK_POOLS, DEF8_UNREACHABLE_POOLS, DEF10_DARK_POOLS } from '../../src/domain/display/stateProse/defenseStateProse.js';

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

/** The wide read's 150 (REVIEW-WIDE-6: `bar0-<shape>-rand-<27..41>`) and the census's small towns of the plain arm. */
const SHAPES = ['thorp-calm', 'hamlet-calm', 'hamlet-under_siege', 'village-famine', 'village-calm', 'town-calm', 'town-occupied', 'city-under_siege+famine', 'city-wartime', 'metropolis-calm'];
const WIDE = SHAPES.flatMap((s) => Array.from({ length: 15 }, (_, i) => `bar0-${s}-rand-${27 + i}`));
const SMALL = ['thorp', 'hamlet', 'village'].flatMap((size) => Array.from({ length: 20 }, (_, i) => `r2r-${size}-${i}`));
const SAMPLE = [...WIDE, ...SMALL];
/** The census's 720 (CENSUS-3 seeds.txt): r2r-<size>-0..59 and r2s-<stress>-<size>-0..3. */
const STRESSES = ['famine', 'indebted', 'infiltrated', 'insurgency', 'mass_migration', 'monster_pressure', 'occupied', 'plague_onset', 'politically_fractured', 'recently_betrayed', 'religious_conversion', 'slave_revolt', 'succession_void', 'under_siege', 'wartime'];
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CENSUS_720 = [
  ...TIERS.flatMap((size) => Array.from({ length: 60 }, (_, i) => `r2r-${size}-${i}`)),
  ...STRESSES.flatMap((st) => TIERS.flatMap((size) => [0, 1, 2, 3].map((i) => `r2s-${st}-${size}-${i}`))),
];

// ── the auditors' claim words, by rule (law7.mjs, law9.mjs; copied, not narrowed) ──
const NO_THREAT = /\b(nothing threatens it|nothing presses [A-Z][\w'-]* at present|raiders and rivals look elsewhere|nothing here to fear|no threat (to|worth))\b/i;
const ORDINARY_DEFENCE = /\bdefended in the ordinary way\b/i;
const KEPT_WORKING = /\b(fresh repairs show on|keeps its defences in working order)\b/i;
const CRIME_KEPT_DOWN = /\b(enforcement keeps it down and keeps it from growing|keeps the streets quiet because trouble brings the law|Crime exists but is well-managed)\b/;
const THEFT_DROPPED = /\b(ordinary theft has dropped|Thieves are scarce now)\b/;
const NO_ORG = /\b(organized crime has found no foothold|comes from lone thieves, not a gang|there is no boss to threaten or to bribe|with no gang behind it|with nothing to threaten and nobody to buy)\b/;
const LAW_PRESENT = /\bkeeps a working balance: the law is present\b/;
const PUT_BY = /\bless (food )?is being put by\b|\bless was put by than\b|\bwhat they fail to put by\b/;
const NOTHING_OVER = /\bleaves nothing over in an ordinary year\b|\ban ordinary year leaves nothing over\b/;
const COURT_HEARS = /\bthere is a court to hear it and a cell\b/;

/** The state each rule's claim is false in, read from the one fact (or null where the town's state bears the claim). @param {any} t */
function denials(t) {
  const crises = crisisOf(t);
  const wallCrisis = ['under_siege', 'wartime', 'occupied'].filter((c) => crises.has(c));
  const wave = crimeWaveStands(t);
  const stores = storesMonthsOf(t);
  const d = factsOf(t).defence || {};
  return [
    { rule: '7a-nothreat', claim: NO_THREAT, state: monsterFrontierOf(t) ? 'the page prints the beasts a threat' : wallCrisis.length ? `under ${wallCrisis.join('+')}` : null },
    { rule: '7b-defence', claim: ORDINARY_DEFENCE, state: wallCrisis.length ? `under ${wallCrisis.join('+')}` : null },
    { rule: '7b-defence', claim: KEPT_WORKING, state: crises.has('under_siege') ? 'the siege impairs the walls' : String(t?.config?.tradeRouteAccess) === 'isolated' ? 'an isolated route: the walls run on stockpiles' : null },
    { rule: '9a.wave', claim: CRIME_KEPT_DOWN, state: wave ? 'a crime wave stands' : null },
    { rule: '9a.curfew', claim: THEFT_DROPPED, state: wave ? 'a crime wave stands' : null },
    { rule: '9a.contested', claim: NO_ORG, state: wave ? 'a crime wave stands: its hook says it is coordinated' : null },
    { rule: '9a.balance', claim: LAW_PRESENT, state: lawBandOf(t) === 'collapsed' ? 'Law & order · Collapsed' : (!d.watch && !d.garrison) ? 'no watch, no garrison' : null },
    { rule: '9c.putby', claim: PUT_BY, state: typeof stores === 'number' && stores >= 12 ? `stores of ${stores} months` : null },
    { rule: '9c.nothing-over', claim: NOTHING_OVER, state: growsMoreThanEatsOf(t) ? 'the food record holds a surplus (growsMoreThanEats)' : null },
    { rule: 'L2.law.collapsed', claim: COURT_HEARS, state: lawBandOf(t) === 'collapsed' ? 'Law & order · Collapsed' : null },
  ];
}

/** A slot fill for every slot (the guard reads the claim, not the fill). */
const FILL = new Proxy({}, { get: (_o, k) => (k === 'settlement' ? 'Testholm' : typeof k === 'string' ? `the ${k}` : undefined), has: () => true });
/** @param {any} t the desk's read of one town, as each of its entries hands the kernel */
const readOf = (t) => factsAnswered(t, crisisAnswered(t, wallsAnswered(t, {})));

/**
 * Every line of the desk a town's state admits: { block, pool, vid, text }.
 * @param {any} t @param {Record<string, any>} [corpus]
 */
function admitted(t, corpus = DOSSIER_STATE_PROSE_DEFENSE) {
  const read = readOf(t);
  // THE NAMED EXCLUSION: the pools the desk declares dark (never printed: `defenseStateProse.js`, each with its measured reason)
  /** @type {Array<{ block: string, pool: string, vid: number, text: string }>} */ const out = [];
  for (const [block, b] of Object.entries(corpus)) {
    for (const [pool, vs] of Object.entries(b.pools || {})) {
      if ((block === 'DS-DEF-7' && DEF7_DARK_POOLS.includes(pool)) || (block === 'DS-DEF-8' && DEF8_UNREACHABLE_POOLS.includes(pool)) || (block === 'DS-DEF-10' && DEF10_DARK_POOLS.includes(pool))) continue;
      const meta = (b.poolMeta || {})[pool] || {};
      const slots = Object.fromEntries(vs.flatMap((v) => v.slots || []).map((s) => [s, FILL[s]]));
      const ok = eligibleVariants(vs, { ...read, slots, ...(Array.isArray(meta.declares) && meta.declares.length ? { poolDeclares: meta.declares } : {}), ...(meta.crisisScoped === true ? { crisisScoped: true } : {}) });
      for (const v of ok) out.push({ block, pool, vid: v.vid, text: v.text.replace(/\{([a-zA-Z]+)\}/g, (_m, s) => (s === 'settlement' ? 'Testholm' : `the ${s}`)) });
    }
  }
  return out;
}

/** The instances of the rules in one town's admitted lines. @param {any} t @param {string} seed @param {ReturnType<typeof admitted>} lines */
function instances(t, seed, lines) {
  /** @type {string[]} */ const out = [];
  for (const { rule, claim, state } of denials(t)) {
    if (!state) continue;
    for (const l of lines) if (claim.test(l.text)) out.push(`${rule} · ${l.block} › ${l.pool} › v${l.vid} (${state}): ${l.text}`);
  }
  // 6a-size: the auditor's own function, over the admitted lines written as the page's Defense tab
  const T = readTownC(`== Systems/Defense ==\n${lines.map((l) => l.text).join('\n')}\n`, t);
  for (const x of law6a(T, seed)) if (x.rule === '6a-size') out.push(`6a-size · ${x.line} (${x.why})`);
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120_000);

describe('BAR6-DEFDESK: the defence desk\'s lines declare what they presume', () => {
  test('(a) zero: no admitted line of the desk makes its claim where the town\'s own fact denies it (210 births)', () => {
    const failures = collectSeedFailures(SAMPLE, (seed) => {
      const t = town(seed);
      expect(instances(t, seed, admitted(t)), seed).toEqual([]);
    });
    expectNoSeedFailures(failures);
  }, 900_000);

  test('(b) the atoms answer from their leaves, through the vocabulary\'s own reading', () => {
    for (const word of ['monster frontier', 'crime wave', 'food surplus']) expect(FACT_DIMENSIONS[word]?.shape, word).toBe('presence');
    const facts = (/** @type {any} */ r) => factsOf(r);
    // the beasts: plagued country always; frontier country under a Weak or Critical band; settled country never; no country recorded, never
    expect(atomHolds('monster frontier', facts({ config: { monsterThreat: 'plagued' }, defenseProfile: { scores: { monster: 90 } } }))).toBe(true);
    expect(atomHolds('monster frontier', facts({ config: { monsterThreat: 'frontier' }, defenseProfile: { scores: { monster: 10 } } }))).toBe(true);
    expect(atomHolds('monster frontier', facts({ config: { monsterThreat: 'frontier' }, defenseProfile: { scores: { monster: 90 } } }))).toBe(false);
    expect(atomHolds('monster frontier', facts({ config: { monsterThreat: 'heartland' }, defenseProfile: { scores: { monster: 0 } } }))).toBe(false);
    expect(atomHolds('monster frontier', facts({ config: {} }))).toBe(false);
    // the crime wave: the history's live tension, its one reading
    expect(atomHolds('crime wave', facts({ history: { currentTensions: [{ type: 'crime_wave' }] } }))).toBe(true);
    expect(atomHolds('crime wave', facts({ history: { currentTensions: [{ type: 'external_threat' }] } }))).toBe(false);
    // the surplus: the food record's flag
    expect(atomHolds('food surplus', facts({ economicState: { foodSecurity: { foodRecord: { growsMoreThanEats: true } } } }))).toBe(true);
    expect(atomHolds('food surplus', facts({ economicState: { foodSecurity: { foodRecord: { growsMoreThanEats: false } } } }))).toBe(false);
    expect(atomHolds('food surplus', facts({}))).toBe(false);
  });

  test('(c) the positive controls: each cured line under its marks at afa46d644 fires in its own read town', () => {
    const B = DOSSIER_STATE_PROSE_DEFENSE;
    /** The wide read's standing rows (SECOND-CHECK.final221: C205552-kind 7a, C26390, C3247, C154050), the line's block, pool and vid, and its marks at the base. */
    const CONTROLS = [
      { seed: 'bar0-hamlet-calm-rand-28', block: 'DS-DEF-11', pool: 'UNWALLED-SMALL', vid: 4, base: ['ledger', 'no threat', 'no danger coming', 'no crisis: wartime', 'crisis: any'] },
      { seed: 'bar0-city-under_siege+famine-rand-36', block: 'DS-DEF-11', pool: 'WALLED-THREATENED', vid: 3, base: ['visitor'] },
      { seed: 'bar0-city-under_siege+famine-rand-28', block: 'DS-DEF-1', pool: 'readiness ADEQUATE', vid: 2, base: ['visitor', 'no crisis: occupied'] },
      { seed: 'bar0-hamlet-calm-rand-29', block: 'DS-DEF-4', pool: 'structure diffuse', vid: 5, base: ['visitor'] },
    ];
    for (const c of CONTROLS) {
      const t = town(c.seed);
      const pool = B[c.block].pools[c.pool];
      const now = pool.find((/** @type {any} */ v) => v.vid === c.vid); // the variant by its id (proseDrawnAnchors: no literal sentence as an anchor)
      expect(now, `${c.seed}: the line stands in its pool`).toBeTruthy();
      const atBase = { ...B, [c.block]: { ...B[c.block], pools: { [c.pool]: [{ ...now, marks: c.base.slice(1) }] }, poolMeta: { [c.pool]: (B[c.block].poolMeta || {})[c.pool] } } };
      const fired = instances(t, c.seed, admitted(t, { [c.block]: atBase[c.block] }));
      expect(fired.length, `${c.seed}: the rule fires on the line under its base marks`).toBeGreaterThan(0);
      const cured = instances(t, c.seed, admitted(t, { [c.block]: { ...B[c.block], pools: { [c.pool]: pool } } }));
      expect(cured, `${c.seed}: under its marks now the line is refused`).toEqual([]);
    }
  }, 600_000);

  test('(d) KEEP: in each control town the cured pool still speaks', () => {
    const B = DOSSIER_STATE_PROSE_DEFENSE;
    for (const [seed, block, pool] of /** @type {Array<[string, string, string]>} */ ([
      ['bar0-hamlet-calm-rand-28', 'DS-DEF-11', 'UNWALLED-SMALL'],
      ['bar0-city-under_siege+famine-rand-36', 'DS-DEF-11', 'WALLED-THREATENED'],
      ['bar0-city-under_siege+famine-rand-28', 'DS-DEF-1', 'readiness ADEQUATE'],
      ['bar0-hamlet-calm-rand-29', 'DS-DEF-4', 'structure diffuse'],
    ])) {
      const lines = admitted(town(seed), { [block]: { ...B[block], pools: { [pool]: B[block].pools[pool] } } });
      expect(lines.length, `${seed}: ${block} › ${pool} still admits a line`).toBeGreaterThan(0);
    }
  }, 600_000);

  test('(e) rulings EG1, XA2: the crime wave\'s one reading and the beasts\' band arm equal their page readings (the 720)', () => {
    let waves = 0; let frontierWeak = 0;
    const failures = collectSeedFailures(CENSUS_720, (seed) => {
      const t = town(seed);
      expect(crimeWaveOfLaw(t), `${seed}: the one reading = the display's`).toBe(crimeWaveStands(t));
      if (crimeWaveOfLaw(t)) waves += 1;
      const raw = t?.config?.monsterThreat;
      const family = typeof raw === 'string' && raw ? normalizeMonsterThreat(raw) : null;
      const band = scoreBand(Number(t?.defenseProfile?.scores?.monster) || 0);
      const byPage = family === 'plagued' || (family === 'frontier' && (band === 'WEAK' || band === 'CRITICAL'));
      expect(monsterFrontierOf(t), `${seed}: the band arm reads scoreBand's band`).toBe(byPage);
      if (family === 'frontier' && byPage) frontierWeak += 1;
    });
    expectNoSeedFailures(failures);
    expect(waves, 'the 720 hold crime waves').toBeGreaterThan(0);
    expect(frontierWeak, 'the 720 hold frontier towns under a Weak or Critical band').toBeGreaterThan(0);
  }, 1_800_000);
});
