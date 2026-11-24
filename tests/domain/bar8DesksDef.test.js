/**
 * bar8DesksDef.test.js — BAR8-DESKS-DEF (the sixth chair's round BAR8, `docs/chair/2026-11-17/sixth/briefs/BRIEF-BAR8.md` on
 * the chair's lane, section DESKS-DEF). EACH CURED DESK LINE IS ABSENT WHERE ITS PREMISE IS FALSE, AND ITS TWIN, WHERE ONE
 * IS GIVEN, STANDS THERE.
 *
 *   13f  DS-DEF-4 semi-organized v4 "has no rival, and no crew is contesting the streets" leaves the key whose own note says
 *        "lacks a single controlling authority" (`crime: = organized`); v7 its twin there.
 *   13a  DS-DEF-2 full legal chain v1 "heard and held" (once "arrested, heard and held"; re-worded in place by
 *        CHAIR-2026-11-23-N70, same vid and marks) declares the court the Legal row prints (`court sits`), and so
 *        does its sibling v3 "there is a court to hear it" (drawn in v1's place where v1 alone was declared).
 *   14c  DS-POW-5 council v2 "goes to the whole {seat}" declares `seat members`; v6 the twin "goes to the {seat}" (BR15); its
 *        sibling v1 "the whole {seat} must agree" declares the same atom (drawn in v2's place where v2 alone was declared).
 *   12e  DS-POW-4 Stable v3 "nobody … stands ready to lead them" declares `no uprising`, the NEW atom (BR14 (c)): a live
 *        popular-uprising tension of the history (`domain/facts/uprising.js`).
 *   L9   DS-DEF-6 Legal None v1 and DS-POW-5 merchantArmy v1 ("order holds", "keeps order") want `law: > collapsed`, each
 *        a twin under the collapsed law.
 *   L8   DS-DEF-2 granary-and-parish v2, v3 ("can eat through a bad year", "a full grain store") want `stores: ≥ 3`, each
 *        a twin where the stores are short.
 *
 * THE ANCHORS (rule N7): the desk lines are read over a CONSTRUCTED record, the facts of one fixed born town on no road with
 * ONE premise atom set each way (a negative beside a positive); the new atom over constructed records (none of the 720 holds
 * the state: the seventh read's thirty holds one). THE SHARED PAGE (rule N4): the anchor's record, its public projection and
 * the share veil admit each line alike, and the new atom reads the rising alike on all three forms.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { variantFactDeclaration } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { projectShareVeil } from '../../src/domain/display/galleryVeil.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { defenseThreatProse } from '../../src/domain/display/stateProse/defenseStateProse.js';
import { courtHoldersOf } from '../../src/domain/facts/defence.js';

const DESKS = /** @type {Record<string, any>} */ ({ defense: DOSSIER_STATE_PROSE_DEFENSE, power: DOSSIER_STATE_PROSE_POWER });

/** @type {any} */ let anchor;
/** @type {any} */ let anchorFacts;
beforeAll(async () => {
  await loadGenerationLawPayloads();
  // A town on no road (`isolated`): no seat of this round lifts its marks, and nothing below reads its draw.
  anchor = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'town', tradeRouteAccess: 'isolated', selectedStressesRandom: false, selectedStresses: [] }), null, { seed: 'bar8-desks-def-anchor-town', customContent: {} });
  anchorFacts = factsOf(anchor);
});

/** the anchor's facts with the given readings set (a constructed record: one premise atom, each way) */
const over = (/** @type {Record<string, unknown>} */ o) => {
  const f = Object.create(anchorFacts);
  for (const [k, v] of Object.entries(o)) Object.defineProperty(f, k, { value: typeof v === 'function' ? v(anchorFacts) : v });
  return f;
};
const defenceWith = (/** @type {Record<string, boolean>} */ o) => (/** @type {any} */ b) => ({ ...(b.defence || {}), ...o });
/** the semi-organized key's own state: a village or larger, no rival rings, the structure semi-organized (or, the positive, organized) */
const crimeKey = (/** @type {string} */ crime) => ({ crime, tier: 'town', rivalRings: false });
const legalChain = (/** @type {boolean} */ sits) => ({ courtSits: sits, defence: defenceWith({ court: true, prison: true }), lawBand: 'adequate' });

/** [rule · line, desk, block, pool, the cured vid, its twin's vid or null, readings where the premise holds, where it fails] */
const DESK_LINES = /** @type {Array<[string, string, string, string, number, number|null, Record<string, unknown>, Record<string, unknown>]>} */ ([
  ['13f · has no rival', 'defense', 'DS-DEF-4', 'structure semi-organized', 4, 7, crimeKey('organized'), crimeKey('semi-organized')],
  ['13a · heard and held (v1; once "arrested, heard and held", re-worded in place by CHAIR-2026-11-23-N70)', 'defense', 'DS-DEF-2', 'Internal Security: full legal chain (court AND prison)', 1, null, legalChain(true), legalChain(false)],
  ['13a · a court to hear it (its sibling, drawn in v1\'s place at the first tip)', 'defense', 'DS-DEF-2', 'Internal Security: full legal chain (court AND prison)', 3, null, legalChain(true), legalChain(false)],
  ['14c · goes to the whole seat', 'power', 'DS-POW-5', 'council', 2, 6, { seatMembers: true }, { seatMembers: false }],
  ['14c · the whole seat must agree (its sibling, drawn in v2\'s place at the first tip)', 'power', 'DS-POW-5', 'council', 1, null, { seatMembers: true }, { seatMembers: false }],
  ['12e · nobody stands ready to lead them', 'power', 'DS-POW-4', 'riskLabel: Stable (no challengers)', 3, null, { uprising: false }, { uprising: true }],
  ['L9 · no complaint written down, order holds where someone armed stands', 'defense', 'DS-DEF-6', 'Legal Infrastructure: None', 1, 4, { lawBand: 'strained' }, { lawBand: 'collapsed' }],
  ['L9 · a private army that keeps order', 'power', 'DS-POW-5', 'FLAG: merchantArmy', 1, 3, { lawBand: 'strained' }, { lawBand: 'collapsed' }],
  ['L8 · the town can eat through a bad year', 'defense', 'DS-DEF-2', 'Disasters & Famine: granary AND parish care only', 2, 5, { storesMonths: 5 }, { storesMonths: 1.5 }],
  ['L8 · a full grain store', 'defense', 'DS-DEF-2', 'Disasters & Famine: granary AND parish care only', 3, 6, { storesMonths: 5 }, { storesMonths: 1.5 }],
]);

/** @returns {{ line: any, twin: any, admits: (v: any, f: any) => boolean }} */
function deskLine(/** @type {string} */ desk, /** @type {string} */ block, /** @type {string} */ pool, /** @type {number} */ vid, /** @type {number|null} */ twinVid) {
  const b = DESKS[desk]?.[block];
  const vs = b?.pools?.[pool] || [];
  const scoped = b?.poolMeta?.[pool]?.crisisScoped === true;
  return {
    line: vs.find((/** @type {any} */ v) => v.vid === vid) ?? null,
    twin: twinVid === null ? null : vs.find((/** @type {any} */ v) => v.vid === twinVid) ?? null,
    admits: (v, f) => declarationAdmits(variantFactDeclaration(v), f, { crisisScoped: scoped }).admitted,
  };
}

describe('BAR8-DESKS-DEF · the desk lines: absent where the premise is false, the twin there', () => {
  it('where the premise fails the line is refused and its twin admitted; where it holds, the line and not the twin (every row)', () => {
    expectNoSeedFailures(collectSeedFailures(DESK_LINES, ([name, desk, block, pool, vid, twinVid, yes, no]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(line, `${name}: ${block} ${pool} v${vid}`).toBeTruthy();
      expect(admits(line, over(no)), `${name}: v${vid} where its premise is false`).toBe(false);
      expect(admits(line, over(yes)), `${name}: v${vid} where its premise holds (the positive anchor)`).toBe(true);
      if (twinVid === null) return;
      expect(twin, `${name}: ${block} ${pool} has its twin v${twinVid}`).toBeTruthy();
      expect(admits(twin, over(no)), `${name}: the twin v${twinVid} where the premise is false`).toBe(true);
      expect(admits(twin, over(yes)), `${name}: the twin v${twinVid} where the premise holds`).toBe(false);
    }), 'each cured desk line and its twin');
  });

  it('THE SHARED PAGE (N4): the record, its public projection and the share veil admit each line and twin alike (every row)', () => {
    const forms = [['record', anchor], ['public', toPublicSafe(structuredClone(anchor))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(anchor)), null)]];
    const F = forms.map(([n, r]) => [n, factsOf(r)]);
    expectNoSeedFailures(collectSeedFailures(DESK_LINES, ([name, desk, block, pool, vid, twinVid]) => {
      const { line, twin, admits } = deskLine(desk, block, pool, vid, twinVid);
      expect(line, `${name}: v${vid}`).toBeTruthy();
      const read = (/** @type {any} */ f) => [admits(line, f), twin ? admits(twin, f) : null];
      for (const [n, f] of F.slice(1)) expect(read(f), `${name}: the ${n} form reads as the record does`).toEqual(read(F[0][1]));
    }), 'one reading on all three forms');
  });
});

describe('BAR8-DESKS-DEF · 12e: the new atom `uprising` reads the record\'s live tension (constructed records)', () => {
  const RISING = { type: 'popular_uprising', name: 'The Uprising', description: 'The common people are pressing those in charge over the grain levy, and each dispute grows louder than the last' };
  const OTHER = { type: 'crime_wave', name: 'The Crime Wave', description: 'Crime is rising faster than those in charge can answer it' };
  const withTensions = (/** @type {unknown[]} */ t) => ({ ...anchor, history: { ...(anchor.history || {}), currentTensions: t } });
  const STABLE_V3 = () => deskLine('power', 'DS-POW-4', 'riskLabel: Stable (no challengers)', 3, null);

  it('a live popular uprising is read; another tension, or none, is not (every case), and the line follows it', () => {
    const CASES = /** @type {Array<[string, unknown[], boolean]>} */ ([
      ['a popular uprising alone', [RISING], true],
      ['a popular uprising beside a crime wave', [OTHER, RISING], true],
      ['a crime wave alone', [OTHER], false],
      ['no tension', [], false],
    ]);
    expectNoSeedFailures(collectSeedFailures(CASES, ([name, tensions, rising]) => {
      const f = factsOf(withTensions(tensions));
      expect(f.uprising, `${name}: the atom`).toBe(rising);
      const { line, admits } = STABLE_V3();
      expect(admits(line, f), `${name}: DS-POW-4 Stable v3 "nobody stands ready to lead them"`).toBe(!rising);
    }), 'the atom and its line on constructed records');
  });

  it('THE SHARED PAGE (N4): the record, its public projection and the share veil read the rising alike (both ways)', () => {
    expectNoSeedFailures(collectSeedFailures(/** @type {Array<[string, unknown[]]>} */ ([['risen', [RISING]], ['quiet', [OTHER]]]), ([name, tensions]) => {
      const rec = withTensions(tensions);
      const pub = toPublicSafe(structuredClone(rec));
      const veil = projectShareVeil(toPublicSafe(structuredClone(rec)), null);
      const own = factsOf(rec).uprising;
      expect(factsOf(pub).uprising, `${name}: the public form`).toBe(own);
      expect(factsOf(veil).uprising, `${name}: the share veil`).toBe(own);
    }), 'one reading of the rising on all three forms');
  });
});

// ---------------------------------------------------------------------------------------------------------------- 14c
// Census towns of the 720 that printed "goes to the whole <seat>" beside "· 1 member" at the base f1ca75555 (runK 14c.whole),
// and three that printed it beside a seat of two members or more. Born as the census births them (PAGE-COPY `seedcfg.mjs`).
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function bornCensus(/** @type {string} */ seed) {
  const r = seed.match(/^r2r-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  const c = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/);
  if (!r && !c) throw new Error(`not a census seed: ${seed}`);
  const cfg = r ? { ...DEFAULT_CONFIG, ...DIALS, settType: r[1] }
    : { ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [/** @type {RegExpMatchArray} */ (c)[1]], selectedStressesRandom: false, settType: /** @type {RegExpMatchArray} */ (c)[2] };
  return generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
}
const ONE_MEMBER = ['r2r-hamlet-30', 'r2r-thorp-1', 'r2s-occupied-village-0', 'r2s-plague_onset-hamlet-0'];
const MANY_MEMBERS = ['r2r-hamlet-6', 'r2r-hamlet-25', 'r2r-hamlet-33'];

describe('BAR8-DESKS-DEF · 14c over born census towns: the seat of one takes the twin, the seat of many the line (every town, every form)', () => {
  // A PLAIN TEST THAT LOOPS OVER THE ROWS (2026-11-18, BAR8-DESKS-2, ruling BR32 (3)): it was an `it.each`, which the
  // law "THE EACH-FAMILY PARK DEBT ONLY SHRINKS" (`tests/lint/sovereigntyLightingContract.walker.test.js`) counted
  // 113 -> 114. Every town of both rows, at every form, is run and its failure collected (`seedFailures.js`).
  it('the seat of one takes the twin, the seat of many the line: every town of both rows', () => {
    const ROWS = /** @type {Array<[string, string[], boolean]>} */ ([['one member', ONE_MEMBER, false], ['two or more', MANY_MEMBERS, true]]);
    for (const [n, seeds] of ROWS) expect(seeds.length, `the anchors are named (${n})`).toBeGreaterThan(0);
    const { line, twin, admits } = deskLine('power', 'DS-POW-5', 'council', 2, 6);
    const sibling = deskLine('power', 'DS-POW-5', 'council', 1, null).line;
    const cases = ROWS.flatMap(([n, seeds, many]) => seeds.map((seed) => ({ n, seed, many })));
    expectNoSeedFailures(collectSeedFailures(cases, ({ seed, many }) => {
      const s = bornCensus(seed);
      for (const [form, r] of /** @type {Array<[string, any]>} */ ([['record', s], ['public', toPublicSafe(structuredClone(s))], ['the share veil', projectShareVeil(toPublicSafe(structuredClone(s)), null)]])) {
        const f = factsOf(r);
        expect(f.seatMembers, `${seed} (${form}): the seat's members`).toBe(many);
        expect(admits(line, f), `${seed} (${form}): "goes to the whole {seat}"`).toBe(many);
        expect(admits(twin, f), `${seed} (${form}): "goes to the {seat}"`).toBe(!many);
        expect(admits(sibling, f), `${seed} (${form}): "the whole {seat} must agree"`).toBe(many);
      }
    }), 'the council line beside a seat of one and a seat of many');
  }, 240_000);
});

// ---------------------------------------------------------------------------------------------------------------- 13a, the key
// BAR8-DESKS-2 (2026-11-18, the chair's ruling BR32 (4), the reader's M1): the internal row's pool key reads the Legal row's own
// court (`defence.js :: courtHoldersOf`, the atom `court sits`), not the town-hall NAME test `compound.hasCourtSystem`. The anchors
// are towns of the 720 born as the census births them: two that drew the full legal chain's "goes somewhere and takes time"
// (v2's words then; re-worded in place by CHAIR-2026-11-23-N70 to "A case that reaches the court ... gets a hearing")
// beside "Prison only" (r2r-town-5, r2r-town-15), one that drew "court without detention" beside "Legal Infrastructure · None"
// (r2r-town-4), and one whose courthouse and prison both stand (r2r-town-0, the full chain, unmoved).
describe('BAR8-DESKS-2 · 13a: the internal row is keyed by the court the Legal row prints', () => {
  it('each town\'s internal pool is the Legal row\'s own pair: the flag-court towns move, the court town does not', () => {
    const pk = (/** @type {any} */ o) => { if (!o || typeof o !== 'object') return null; if (o.provenance?.poolKey) return o.provenance.poolKey; for (const v of Object.values(o)) { const r = pk(v); if (r) return r; } return null; };
    const CASES = /** @type {Array<[string, string]>} */ ([
      ['r2r-town-5', 'Internal Security: detention without process'], ['r2r-town-15', 'Internal Security: detention without process'],
      ['r2r-town-4', 'Internal Security: no legal infrastructure'], ['r2r-town-0', 'Internal Security: full legal chain (court AND prison)'],
    ]);
    expectNoSeedFailures(collectSeedFailures(CASES, ([seed, key]) => {
      const s = /** @type {any} */ (bornCensus(seed));
      const court = courtHoldersOf(s).length > 0;
      expect(court, `${seed}: the Legal row's court`).toBe(key.includes('full legal chain'));
      expect(factsOf(s).courtSits, `${seed}: the atom reads the same court`).toBe(court);
      expect(pk(defenseThreatProse(s, { seed: String(s._seed ?? s.id ?? '') }).internal), `${seed}: the internal row's pool`).toBe(key);
    }), 'the internal row against the Legal row');
  }, 240_000);
});
