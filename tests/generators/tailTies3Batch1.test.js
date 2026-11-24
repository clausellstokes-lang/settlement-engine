/**
 * tests/generators/tailTies3Batch1.test.js — TAIL-TIES-3 batch 1 (the chair's ruling (T11) of 2026-11-15, vetoable by the
 * owner): `npcStructure.js :: reg`, a card's structural row claims no house and no rival the record does not give.
 *   (a) the trade's subordinate rows ("Runs a smaller house behind the leading one", "the bigger houses") need a power of the
 *       trade in the town: where none stands the card reads no row (it keeps its own goal and claims no position).
 *   (b) the 'contested' rows (public legitimacy in the contested band: many doubt the seat's right) claim no rival claimant.
 * NOT pairs: each printed at f00b248fe (the 720 census, by record); each names what prints instead.
 * KEEP pairs: a true print at the base that still prints.
 *
 * @enforced-by npx vitest run tests/generators/tailTies3Batch1.test.js
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { POSITION_VARIANTS } from '../../src/data/npcStructureVariants.js';
import { readFileSync } from 'node:fs';

// PEOPLE-1 B1c (the chair's ruling of 20:30 UTC): a pool's index 0 is the writer's own `T` row, its one home; read from the
// writer's table, SLICED FROM ITS FILE and evaluated (`npcPositionPools.test.js`'s method; never retyped)
const WRITER = readFileSync(new URL('../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cutT = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
/** @type {Record<string, { position: string, constraint: string }>} */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from([cutT('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cutT('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n')).toString('base64')}`);

/** PEOPLE-1 B1: a pooled row's member, by identity (a `{slot}` reads as any fill; the holder's house tail aside); the pool as
 * the writer composes it (B1c: [the T row's own line, ...the data pool]). @param {string} key @param {unknown} text */
const memberOf = (key, text) => [{ text: T[key].position }, ...POSITION_VARIANTS[key]].some((r) => new RegExp(`^${r.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(?:house|export|import)\\\}/g, '.+')}$`).test(String(text).replace(/ Still .+ as well\.$/, '')));
/** PEOPLE-1 B1: the contested rows' own words, as the contested pools say them (`data/npcStructureVariants.js`): the anchor is the first that prints. @param {string} printed */
const contestedWords = (printed) => ['many doubt', 'many question its right', "the seat's right is in doubt"].find((w) => printed.includes(w)) ?? 'many doubt';

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };

/** The census's births (`births.mjs :: cfgFor` and `seedcfg.mjs`'s r2s arm), as tailTiesBatch1 holds them. @param {string} seed @returns {any} */
const born = (seed) => {
  const r2r = /^r2r-(\w+)-\d+$/.exec(seed);
  if (r2r) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: r2r[1] }), null, { seed, customContent: {} });
  const r2s = /** @type {RegExpExecArray} */ (/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed));
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [r2s[1]], selectedStressesRandom: false, settType: r2s[2] }), null, { seed, customContent: {} });
};
/** @type {Map<string, any>} */
const cache = new Map();
const town = (/** @type {string} */ seed) => { if (!cache.has(seed)) cache.set(seed, born(seed)); return cache.get(seed); };
const card = (/** @type {string} */ seed, /** @type {string} */ name) => (town(seed).npcs || []).find((/** @type {any} */ n) => n.name === name);

describe('TAIL-TIES-3 batch 1', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('NOT (a): no "smaller house behind the leading one" where the town holds no house of the trade; the card claims no position', () => {
    // the rows as substrings (each was a plain-literal regex: exactly equivalent); the anchor is the seat-holder's own
    // structural row, which the same writer (`npcStructure.js :: reg`) prints on the same cards
    const NOT = [
      ['r2r-hamlet-57', 'Runs a smaller house behind the leading one in quiet times', 'Growing into the leading house'],
      ['r2r-hamlet-9', 'Runs a smaller house behind the leading one in the trade while the seat fails', 'disorder that lets the house get ahead'],
      ['r2r-hamlet-2', 'bigger houses take more of the trade', 'big houses leave alone'],
    ];
    const failures = collectSeedFailures(NOT, ([seed, position, constraint]) => {
      const s = town(/** @type {string} */ (seed));
      const printed = (s.npcs || []).map((/** @type {any} */ n) => `${n.structuralPosition ?? ''} ${n.activeConstraint ?? ''}`).join(' | ');
      expectAbsentWithAnchor(printed, position, 'Holds the seat', seed);
      expectAbsentWithAnchor(printed, constraint, 'Holds the seat', seed);
      expect((s.powerStructure?.factions || []).some((/** @type {any} */ f) => f.category === 'economy'), seed).toBe(false);
    });
    expectNoSeedFailures(failures, 'no trade-house row and no trade power where the town holds no house of the trade');
    // what prints instead: the card keeps its own goal and no structural position (the refusal's rule)
    const stableKeeper = (town('r2r-hamlet-57').npcs || []).find((/** @type {any} */ n) => n.title === 'the stable keeper');
    expect(stableKeeper.structuralPosition).toBeUndefined();
    expect(stableKeeper.goal?.short).toBeTruthy();
  });

  it('KEEP (a): a lesser trade house behind a leading one still reads its row', () => {
    const s = town('r2r-town-2');
    const guild = (s.npcs || []).find((/** @type {any} */ n) => n.title === 'the senior craft-guild master');
    // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20, the chair's ruling of 16:41 UTC): the smaller house's calm row is pooled
    expect(memberOf('economy__stable__subordinate', guild.structuralPosition), String(guild.structuralPosition)).toBe(true);
  });

  it('NOT (b): no rival claimant on a contested seat; each row says what the condition holds', () => {
    // the alternation's literals, one by one (exactly equivalent); the anchor is the contested rows' own words
    const NOT = ['a rival claims it', 'rivals fight over the seat', 'both sides in the fight for the seat', 'claimant'];
    // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23; CLOSE-5's ruling on 9df6731ee): lit, r2r-village-48
    // (Approved) and r2r-hamlet-32 (Tolerated) are no longer in the contested condition, so no contested row prints there.
    // Each is re-picked, lit, by the case's own predicate (the writer's condition, `npcStructure.js :: getPrimaryCondition`,
    // reads 'contested'), the lowest of its family of 200: r2r-hamlet-4; r2r-village-10, the lowest contested village that
    // also seats a faith card heading the first religious power (the faith's contested row below; village-1, the lowest
    // contested, seats none). Was r2r-village-48 and r2r-hamlet-32
    const failures = collectSeedFailures(['r2s-plague_onset-thorp-3', 'r2r-village-10', 'r2r-hamlet-4', 'r2r-town-35'], (seed) => {
      const printed = (town(seed).npcs || []).map((/** @type {any} */ n) => `${n.structuralPosition ?? ''} ${n.activeConstraint ?? ''} ${n.goal?.short ?? ''}`).join(' | ');
      for (const word of NOT) expectAbsentWithAnchor(printed, word, contestedWords(printed), seed); // RE-KEYED BY IDENTITY (PEOPLE-1 B1): the contested pools' own words
    });
    expectNoSeedFailures(failures, 'no contested seat names a rival claimant');
    // RE-PICKED BY THE PREMISE (THE FLIP, 2026-11-23): the faith's card of r2r-village-10 (was Santosh Dubey of r2r-village-48)
    expect(memberOf('religious__contested__dominant', card('r2r-village-10', 'Palnatoke Andersson').structuralPosition), 'the faith\'s contested row').toBe(true); // RE-KEYED BY IDENTITY (PEOPLE-1 B1): the row is pooled
    expect(card('r2r-town-35', 'Roxane Angelos').structuralPosition).toBe("Heads the crew while many doubt the seat's right and those who keep order look elsewhere.");
  });

  it('INSTEAD (b): the contested seat-holder still holds the seat on the card, in the condition\'s words', () => {
    // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20): the holder's contested row is pooled; every member opens "Holds the seat"
    // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit, r2r-thorp-30 is Tolerated and Prosperous, not in
    // the contested condition; r2r-thorp-5 is the lowest r2r-thorp of 200 lit in it (the writer's getPrimaryCondition), and
    // Banbh Ryan its seat-holder's card (was Thecla Schulz of r2r-thorp-30)
    const thecla = card('r2r-thorp-5', 'Banbh Ryan').structuralPosition;
    expect(thecla).toMatch(/^Holds the seat\b/);
    expect(memberOf('government__contested__dominant', thecla), String(thecla)).toBe(true);
  });
});
