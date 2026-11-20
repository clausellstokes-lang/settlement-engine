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

/** @type {Readonly<Record<string, ReadonlyArray<{ id: string, text: string | null, needs: ReadonlyArray<string> }>>>} */
const POOLS = /** @type {any} */ (SIBLINGS).QUARREL_POOLS ?? {};
const POOL_OF = (/** @type {string} */ ledgerPool) => ledgerPool.replace(/^governanceNarrative:/, '');
const isQuarrelNote = (/** @type {{ pool?: unknown }} */ e) => typeof e?.pool === 'string' && /^governanceNarrative:(GRAZING|LEVIES)$/.test(e.pool);

/** The measure's birth (`depth/conflict/birth.mjs`): DEFAULT_CONFIG at the size, seed hxd-<size>-<i>. @param {string} size @param {number} i */
function born(size, i) {
  const seed = `hxd-${size}-${i}`;
  const { result, ledger } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
  const notes = ledger.filter(isQuarrelNote);
  return { seed, record: /** @type {any} */ (result), pick: notes.length ? notes[notes.length - 1] : null };
}

/** The pool line a ledger note names (the field rotation's row carries its text at the site). @param {{ pool: string, lineId: string | number }} note */
const lineOf = (note) => {
  const line = (POOLS[POOL_OF(note.pool)] || []).find((l) => l.id === note.lineId) ?? null;
  return line && line.text === null ? { ...line, text: FIELD_ROTATION_QUARREL } : line;
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
    expect(Object.keys(POOLS).sort()).toEqual(['GRAZING', 'LEVIES']);
    // the one row with no text is the field rotation's, whose literal stays at the site
    expect(Object.values(POOLS).flat().filter((l) => l.text === null).map((l) => l.needs)).toEqual([['tier: village']]);
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
    for (const { seed, record, pick } of picked) {
      const line = lineOf(/** @type {any} */ (pick));
      expect(line, `${seed}: the noted line is a pool line`).not.toBe(null);
      expect(pick?.atoms, `${seed}: the note carries the line's atoms`).toEqual(atomsOf(declarationOf(line)));
      const verdict = declarationAdmits(declarationOf(line), /** @type {any} */ (factsOf(record)));
      expect(verdict.refused, `${seed}: ${line?.id} needs ${line?.needs.join(', ') || 'nothing'}`).toEqual([]);
      expect(typeof record.powerStructure?.recentConflict, `${seed}: a sentence is stored`).toBe('string');
    }
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
});
