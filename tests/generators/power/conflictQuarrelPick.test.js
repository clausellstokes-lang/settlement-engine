/**
 * conflictQuarrelPick.test.js — BUILD-CONFLICT (DEPTH-2, 2026-11-20; the chair's word of 16:08 UTC): THE STORED "RECENT
 * CONFLICT" SENTENCE (`powerStructure.recentConflict`) CHOOSES, BY KEYED HASH WITH NO NEW DRAW, AMONG EVERYDAY QUARRELS
 * EACH NEEDING A HOUSE OR FACT THE RECORD HOLDS (`generators/power/quarrelPick.js :: pickQuarrel`, the pools
 * `data/powerSiblings.js :: QUARREL_POOLS`; the lines `docs/chair/2026-11-20/content/depth/lines/CONFLICT-LINES.md`).
 *
 * Before: three rungs of the ladder printed one sentence each (the grazing quarrel in 52 of 100 thorps, the levies in 58
 * of 100 towns; `docs/chair/2026-11-20/content/depth/conflict/CONFLICT-MEASURE.md` §1).
 *
 * THIS FILE COMPUTES, IT NEVER QUOTES A QUARREL (`tests/helpers/drawnProse.js`'s law): which quarrel a place picked is
 * read from the presumption ledger the pick notes through `drawDeclared` (the pool and the line's id), and every text
 * it compares is read from the shipped pools.
 *   (a) THE PICK DRAWS NOTHING: run under an active stream that counts its rolls, the governance step rolls nothing,
 *       yet the quarrel it prints moves with the stream's seed.
 *   (b) every printed quarrel's needs hold on the final record (the birth self-check's own rule, `declarationAdmits`
 *       over `factsOf(record)`), and the ledger notes exactly the line's own atoms.
 *   (c) no active seed: the rung's own line prints (index 0 at the levies and the default rungs; the field-rotation
 *       rung's own line at its rung), and nothing is noted.
 *   (d) over hxd-town-0..19 and hxd-village-0..19 (the measure's birth, DEFAULT_CONFIG): more than four distinct
 *       quarrels print in each size, none in more than eight of twenty, and distinct quarrels print distinct sentences.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import * as SIBLINGS from '../../../src/data/powerSiblings.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { FIELD_ROTATION_QUARREL, buildGovernanceLabels } from '../../../src/generators/power/governanceNarrative.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomsOf, declarationAdmits, declarationOf, parseAtom } from '../../../src/domain/facts/factVocabulary.js';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { clearActiveRng, getActiveRng, setActiveRng } from '../../../src/kernel/rngContext.js';
import { pickVariantMixed } from '../../../src/kernel/proseHash.js';
import { pickQuarrel } from '../../../src/generators/power/quarrelPick.js';

/** @type {Readonly<Record<string, ReadonlyArray<{ id: string, text?: string, needs: ReadonlyArray<string> }>>>} */
const POOLS = /** @type {any} */ (SIBLINGS).QUARREL_POOLS ?? {};
const POOL_OF = (/** @type {string} */ ledgerPool) => ledgerPool.replace(/^governanceNarrative:/, '');
const isQuarrelNote = (/** @type {{ pool?: unknown }} */ e) => typeof e?.pool === 'string' && e.pool.startsWith('governanceNarrative:') && Object.hasOwn(POOLS, POOL_OF(e.pool));
/** The three atoms the chair's leave added for the small places' quarrels (`facts/rosterGrounds.js`). */
const NEW_ATOMS = Object.freeze(['water source', 'access to external mill', 'common grazing land']);
/** The military rung's two pools (the chair's word of 16:22 UTC): the commanders' sub-branch, and the else sub-branch. */
const MILITARY = Object.freeze(['MILITARY_COURT', 'MILITARY_ARMED']);
/** A sentence the rewriter garbled: a doubled word, a doubled article, a possessive meetings, a doubled space or stop. @param {string} s */
const garbled = (s) => /\b(\w+)\s+\1\b/i.test(s) || /\bthe the\b|\bthe The\b|'s meetings|\s{2}|\.\.|undefined|null/.test(s) || !/^[A-Z].*\.$/.test(s);

/** The measure's birth (`depth/conflict/birth.mjs`): DEFAULT_CONFIG at the size, seed hxd-<size>-<i>. @param {string} size @param {number} i */
function born(size, i) {
  const seed = `hxd-${size}-${i}`;
  const { result, ledger } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
  const notes = ledger.filter(isQuarrelNote);
  return { seed, record: /** @type {any} */ (result), pick: notes.length ? notes[notes.length - 1] : null };
}

/** The pool line a ledger note names (the field rotation's slot carries no text: its text is the site's). @param {{ pool: string, lineId: string | number }} note */
const lineOf = (note) => {
  const line = (POOLS[POOL_OF(note.pool)] || []).find((l) => l.id === note.lineId) ?? null;
  return line && !Object.hasOwn(line, 'text') ? { ...line, text: FIELD_ROTATION_QUARREL } : line;
};

const BASE = Object.freeze({
  factions: [{ faction: 'Elected Reeve', isGoverning: true }],
  config: { monsterThreat: 'frontier' },
  stressFlags: {},
  instFlags: { criminalEffective: 20, militaryEffective: 45, economyOutput: 50, religionInfluence: 30 },
  neighbourRelationship: null,
  priorities: { military: 50, economy: 50 },
  governingFaction: 'Elected Reeve',
  hasNobleInstitution: false,
  stressTypes: [],
  fallbackStressType: null,
});
/** The three rungs, by the roster that reaches each (`deriveBaselineConflict`'s own conditions). */
const RUNGS = Object.freeze({
  default: { tier: 'village', instNames: [] },
  fieldRotation: { tier: 'village', instNames: ['Weekly market'] },
  levies: { tier: 'town', instNames: ['Town hall', 'Market square', 'Granary', 'Mill', 'Tavern', 'Town walls', 'Town watch', 'Blacksmith'] },
});
/** @param {{ tier: string, instNames: string[] }} rung */
const governance = (rung) => buildGovernanceLabels(/** @type {any} */ ({ ...BASE, ...rung })).recentConflict;

/** Run `fn` under an active stream with `seed` that counts every roll it is asked for. @template T @param {string} seed @param {() => T} fn */
function underCountingStream(seed, fn) {
  let rolls = 0;
  const prev = setActiveRng({ seed, random: () => { rolls += 1; return 0.5; } });
  try {
    return { result: fn(), rolls };
  } finally {
    clearActiveRng(prev);
  }
}

describe('BUILD-CONFLICT · the recent conflict picks its everyday quarrel by keyed hash', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('the pools: index 0 of each is the rung line it serves, and every line declares its needs in the vocabulary', () => {
    expect(Object.keys(POOLS).sort()).toEqual(['GRAZING', 'LEVIES', 'MILITARY_ARMED', 'MILITARY_COURT']);
    // the one row with no text is the field rotation's slot, whose literal stays at the site
    expect(Object.values(POOLS).flat().filter((l) => !Object.hasOwn(l, 'text')).map((l) => l.needs)).toEqual([['tier: village']]);
    for (const [name, pool] of Object.entries(POOLS)) {
      expect(new Set(pool.map((l) => l.id)).size, `${name}: ids are unique`).toBe(pool.length);
      expect(new Set(pool.map((l) => l.text)).size, `${name}: texts are unique`).toBe(pool.length);
      for (const line of pool.slice(1)) expect(line.needs.length, `${name} ${line.id} declares a need`).toBeGreaterThan(0);
      for (const line of pool) for (const atom of line.needs) expect(parseAtom(atom), `${name} ${line.id}: ${atom} is an atom`).not.toBe(null);
    }
    expect(withPresumptionLedger(() => governance(RUNGS.default)).result).toBe(POOLS.GRAZING[0].text);
  });

  it('(a) THE PICK DRAWS NOTHING: no roll is asked of the stream, and the quarrel still moves with its seed', () => {
    const seen = new Set();
    for (let i = 0; i < 24; i += 1) {
      for (const rung of Object.values(RUNGS)) {
        const { result, rolls } = underCountingStream(`hxd-pick-${i}`, () => governance(rung));
        expect(rolls, `hxd-pick-${i}: the governance step asked the stream for no roll`).toBe(0);
        seen.add(result);
      }
    }
    expect(getActiveRng()).toBe(null);
    expect(seen.size, 'the seed moves the quarrel (more than the three rung lines print)').toBeGreaterThan(3);
  });

  // THE MERGE READ OF da16f2f4b (the coordinator's defect): the no-grazing twin (`noGrazingQuarrelOf`, computed for EVERY
  // place) stood in for index 0 of EVERY pool, so a town whose levies pick landed on l1 printed the water dispute.
  it('(h) the no-grazing twin stands in for GRAZING\'s index 0 only: a LEVIES or MILITARY_COURT pick of index 0 prints its own line', () => {
    const noGrazing = /** @type {any} */ (SIBLINGS).noGrazingQuarrelOf({ institutionNames: [], grounds: [] });
    expect(typeof noGrazing, 'a place with no grazing carries the twin').toBe('string');
    const rosters = /** @type {Record<string, string[]>} */ ({
      LEVIES: ['Town hall', 'Market square', 'Granary', 'Mill', 'Tavern', 'Town walls', 'Town watch', 'Blacksmith'],
      MILITARY_COURT: ['Town hall', 'Courthouse', 'Town watch', 'Garrison', 'Town walls', 'Town gate'],
    });
    for (const [name, names] of Object.entries(rosters)) {
      const facts = factsOf({ institutions: names.map((n) => ({ name: n })), tier: 'town' });
      const admitted = POOLS[name].filter((l) => declarationAdmits(declarationOf(l), /** @type {any} */ (facts)).admitted);
      expect(admitted[0], `${name}: index 0 is admitted`).toBe(POOLS[name][0]);
      expect(admitted.length, `${name}: the planted place admits more than index 0`).toBeGreaterThan(1);
      // a seed whose mixed pick lands on index 0, found by computing the pick itself
      const seed = Array.from({ length: 200 }, (_, i) => `hxd-plant-${i}`).find((s) => pickVariantMixed(admitted, `${s}::governanceNarrative:${name}`) === POOLS[name][0]);
      expect(seed, `${name}: a seed that picks index 0`).toBeTruthy();
      const { result, rolls } = underCountingStream(/** @type {string} */ (seed), () => pickQuarrel(POOLS[name][0].text, { facts: () => facts, noGrazing }));
      expect(rolls).toBe(0);
      expect(result, `${name} under ${seed}: index 0's own line, never the no-grazing twin`).toBe(POOLS[name][0].text);
    }
  });

  it('(c) no active seed: the rung\'s own line prints, and nothing is picked or noted', () => {
    expect(getActiveRng()).toBe(null);
    const noted = withPresumptionLedger(() => [governance(RUNGS.default), governance(RUNGS.fieldRotation), governance(RUNGS.levies)]);
    const [grazing, rotation, levies] = noted.result;
    expect(noted.ledger.filter(isQuarrelNote)).toEqual([]);
    expect(grazing).toBe(POOLS.GRAZING[0].text);
    expect(rotation).toBe(FIELD_ROTATION_QUARREL);
    // the levies line opens with the council, which the rewriter names for the place; the rest is index 0's own words
    const tail = (/** @type {unknown} */ s) => String(s).slice(String(s).indexOf(' has been '));
    expect(tail(levies)).toBe(tail(POOLS.LEVIES[0].text));
  });

  /** @type {Record<string, ReturnType<typeof born>[]>} */
  const births = {};
  const birthsOf = (/** @type {string} */ size) => (births[size] ??= Array.from({ length: 20 }, (_, i) => born(size, i)));

  it('(b) every printed quarrel\'s needs hold on the final record, and the ledger notes the line\'s own atoms', () => {
    const picked = ['town', 'village'].flatMap(birthsOf).filter((b) => b.pick);
    expect(picked.length, 'places whose baseline quarrel printed and was picked').toBeGreaterThanOrEqual(20);
    // every place is read before one assertion (the seed-loop law): what each place shows, beside what it must show
    /** @type {Record<string, unknown>} */ const shown = {};
    /** @type {Record<string, unknown>} */ const owed = {};
    for (const { seed, record, pick } of picked) {
      const line = lineOf(/** @type {any} */ (pick));
      const at = `${seed}: ${line?.id ?? '(no pool line)'} needs ${line?.needs.join(', ') || 'nothing'}`;
      shown[at] = {
        poolLine: line !== null,
        atoms: pick?.atoms,
        refused: line ? declarationAdmits(declarationOf(line), /** @type {any} */ (factsOf(record))).refused : null,
        stored: typeof record.powerStructure?.recentConflict,
      };
      owed[at] = { poolLine: true, atoms: line ? atomsOf(declarationOf(line)) : null, refused: [], stored: 'string' };
    }
    expect(shown, 'each place: the noted line is a pool line, the note carries its atoms, its needs hold, a sentence is stored').toEqual(owed);
  }, 600_000);

  it('(d) over hxd-town-0..19 and hxd-village-0..19: more than four distinct quarrels print, none in more than eight of twenty', () => {
    for (const size of ['town', 'village']) {
      const picked = birthsOf(size).filter((b) => b.pick);
      /** @type {Map<string | number, number>} */ const byLine = new Map();
      for (const b of picked) byLine.set(/** @type {any} */ (b.pick).lineId, (byLine.get(/** @type {any} */ (b.pick).lineId) || 0) + 1);
      const shares = [...byLine].sort((x, y) => y[1] - x[1]);
      const label = `${size}: ${shares.map(([id, n]) => `${id} ${n}`).join(', ') || 'no quarrel picked'} (of ${picked.length} picked in 20)`;
      expect(byLine.size, label).toBeGreaterThan(4);
      expect(shares[0][1], label).toBeLessThanOrEqual(8);
      // distinct quarrels print distinct sentences: the stored text follows the pick
      const printed = new Set(picked.map((b) => b.record.powerStructure?.recentConflict));
      expect(printed.size, `${size}: the stored sentences follow the picks`).toBeGreaterThanOrEqual(byLine.size);
    }
  }, 600_000);

  it('(e) over hxd-thorp-0..19 and hxd-hamlet-0..19: a quarrel on each of the three new atoms prints, and every printed quarrel\'s needs hold', () => {
    const picked = ['thorp', 'hamlet'].flatMap(birthsOf).filter((b) => b.pick);
    expect(picked.length, 'places whose baseline quarrel printed and was picked').toBeGreaterThanOrEqual(20);
    /** @type {Record<string, unknown>} */ const refusedAt = {};
    for (const { seed, record, pick } of picked) {
      const line = lineOf(/** @type {any} */ (pick));
      refusedAt[`${seed}: ${line?.id}`] = declarationAdmits(declarationOf(line), /** @type {any} */ (factsOf(record))).refused;
    }
    expect(refusedAt, 'each small place: the printed quarrel\'s needs hold').toEqual(Object.fromEntries(Object.keys(refusedAt).map((k) => [k, []])));
    for (const atom of NEW_ATOMS) {
      const ids = (POOLS.GRAZING || []).filter((l) => l.needs.includes(atom)).map((l) => l.id);
      expect(ids.length, `GRAZING holds a quarrel needing ${atom}`).toBeGreaterThan(0);
      expect(picked.some((b) => ids.includes(/** @type {any} */ (b.pick).lineId)), `a quarrel needing ${atom} prints in 40 small places`).toBe(true);
    }
  }, 600_000);

  it('(f) the military rung picks among its pools: over hxd-city-0..39 and hxd-metropolis-0..19 its quarrels\' needs hold, and more than one prints', () => {
    for (const name of MILITARY) expect(Array.isArray(POOLS[name]), `the ${name} pool`).toBe(true);
    const births = [...Array.from({ length: 40 }, (_, i) => born('city', i)), ...Array.from({ length: 20 }, (_, i) => born('metropolis', i))];
    const military = births.filter((b) => b.pick && MILITARY.includes(POOL_OF(/** @type {any} */ (b.pick).pool)));
    expect(military.length, 'places whose military rung printed and was picked').toBeGreaterThanOrEqual(3);
    /** @type {Record<string, unknown>} */ const shownMil = {};
    /** @type {Record<string, unknown>} */ const owedMil = {};
    for (const { seed, record, pick } of military) {
      const line = lineOf(/** @type {any} */ (pick));
      const at = `${seed}: ${line?.id ?? '(no pool line)'}`;
      shownMil[at] = { poolLine: line !== null, refused: line ? declarationAdmits(declarationOf(line), /** @type {any} */ (factsOf(record))).refused : null };
      owedMil[at] = { poolLine: true, refused: [] };
    }
    expect(shownMil, 'each military place: the noted line is a pool line, and its needs hold').toEqual(owedMil);
    expect(new Set(military.map((b) => /** @type {any} */ (b.pick).lineId)).size, 'distinct military quarrels').toBeGreaterThan(1);
  }, 600_000);

  it('(g) the rewriter garbles no military quarrel: every line of both pools, under every council label, prints whole', () => {
    for (const name of MILITARY) expect(Array.isArray(POOLS[name]), `the ${name} pool`).toBe(true);
    const MIL = { criminalEffective: 20, militaryEffective: 80, economyOutput: 50, religionInfluence: 30 };
    const rosters = [
      { tier: 'town', instNames: ['Town hall', 'Courthouse', 'Town watch', 'Garrison', 'Town walls', 'Town gate'] },
      { tier: 'city', instNames: ['City hall', 'Courthouse', 'City watch', 'Garrison', 'City walls', 'Gatehouse'] },
      { tier: 'village', instNames: ['Village militia'] },
      { tier: 'hamlet', instNames: ['Village militia', 'Watch post'] },
    ];
    const seats = [null, 'Town Council', 'Merchant Guild Council', 'Elder Council'];
    /** @type {Map<string | number, Set<string>>} */ const reached = new Map();
    for (const roster of rosters) for (const seat of seats) for (let i = 0; i < 60; i += 1) {
      const factions = seat ? [{ faction: seat, isGoverning: true, category: 'government' }] : [];
      const { result, rolls } = underCountingStream(`hxd-mil-${i}`, () => withPresumptionLedger(() => buildGovernanceLabels(/** @type {any} */ ({ ...BASE, ...roster, factions, governingFaction: seat, instFlags: MIL }))));
      expect(rolls).toBe(0);
      const note = result.ledger.filter(isQuarrelNote).pop();
      if (!note || !MILITARY.includes(POOL_OF(note.pool))) continue;
      const said = String(result.result.recentConflict);
      expect(garbled(said), `${roster.tier} under ${seat}: ${said}`).toBe(false);
      (reached.get(note.lineId) ?? reached.set(note.lineId, new Set()).get(note.lineId))?.add(said);
    }
    for (const name of MILITARY) for (const line of POOLS[name] || []) expect(reached.has(line.id), `${name} ${line.id} printed and was read`).toBe(true);
    // the chair's wording of 18:00 UTC: the else sub-branch's pool holds a quarrel needing the militia, and it prints whole
    const militia = (POOLS.MILITARY_ARMED || []).filter((l) => l.needs.includes('militia'));
    expect(militia.length, 'MILITARY_ARMED holds a quarrel needing militia').toBeGreaterThan(0);
    for (const line of militia) expect(reached.get(line.id)?.size ?? 0, `${line.id} printed`).toBeGreaterThan(0);
  }, 600_000);
});
