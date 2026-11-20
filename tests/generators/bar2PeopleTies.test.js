/**
 * bar2PeopleTies.test.js — BAR2-PEOPLE batch B (REVIEW-BAR-2, the TIES worklist; the chair's rulings PP4, PP6, PP7 and
 * PT3 of 2026-11-15, vetoable by the owner), on births:
 *   PP4 one home for a pair's trust: a later tie's line agrees with what the pair's first trust line stated
 *   PP6 the watch line claims neither funding nor order (false in 57 of 101), its `watch` kept
 * and (PP7) each line below claimed a fact the record may deny, and the vocabulary has no word to
 * declare it (a card's public council seat; the faith's relation to the seat; a monster threat): each is reworded to
 * claim no more than every town that prints it bears, text only, its declarations unchanged (no draw moves):
 *   - the bitter history's "placed on the same council committee" (95 ties; 70 name a card outside the ruling body)
 *   - the faith's stable seat "at peace with the seat beside it" (75 towns; 20 beside a competitive or tense relation)
 *   - the armed stable seat's "With nothing threatening" (74 towns; 15 beside a plagued monster threat)
 * RED AT THE BASE (f8042b61a): every refused pair; KEEP pairs green before and after.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CONSTRAINT_VARIANTS, POSITION_VARIANTS } from '../../src/data/npcStructureVariants.js';
import { readFileSync } from 'node:fs';

// PEOPLE-1 B1c (the chair's ruling of 20:30 UTC): a pool's index 0 is the writer's own `T` row, its one home; read from the
// writer's table, SLICED FROM ITS FILE and evaluated (`npcPositionPools.test.js`'s method; never retyped)
const WRITER = readFileSync(new URL('../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const cutT = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
/** @type {Record<string, { position: string, constraint: string }>} */
const { T } = await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from([cutT('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cutT('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n')).toString('base64')}`);

const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** the census's 720 shape (r2r-) @param {string} seed */
function born(seed) {
  const m = seed.match(/^r2r-(\w+)-\d+$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] }), null, { seed, customContent: {} });
  const b = seed.match(/^bar0-(\w+)-([a-z_+]+)-rand-\d+$/); // the bar's towns, born as the census bears them
  if (!b) throw new Error(`no shape for ${seed}`);
  const stresses = b[2] === 'calm' ? [] : b[2].split('+');
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: b[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true }), null, { seed, customContent: {} });
}

/** [town, the line that must not print, what prints in its place] */
const ROWS = /** @type {Array<[string, string, string]>} */ ([
  ['r2r-hamlet-48', 'have been placed on the same council committee.', 'have been handed the same dispute to settle together. The first meeting is next week.'],
  // RE-KEYED BY IDENTITY (PEOPLE-1 B1, 2026-11-20, the chair's ruling of 16:41 UTC): the faith's calm row is pooled
  // (`data/npcStructureVariants.js`); what prints in its slot is the member of its pool the town prints ('@<pool>')
  ['r2r-village-13', 'Leads the faith in quiet times, at peace with the seat beside it.', '@religious__stable__dominant'],
  // RE-KEYED BY IDENTITY (PEOPLE-1 B1b, 2026-11-20, the chair's ruling of 16:51 UTC): the armed calm constraint is pooled
  // ('@c:<pool>': the member of the constraint pool the town prints)
  ['r2r-village-46', 'With nothing threatening, it is hard to win the coin and the say that would be needed if trouble came.', '@c:military__stable__dominant'],
  // PP4 (C13193's town, Weihu: Tian Ma and Xiao Gao "disagree often and trust completely")
  ['bar0-hamlet-calm-rand-4', 'They cooperate efficiently and neither trusts the other at all.', 'Tian Ma and Xiao Gao trade favours on a strict count.'],
  // PP6 (a coordinated crime wave beside it)
  ['r2r-city-0', 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.', 'City watch; it answers for keeping order and is growing more sure of its own authority.'],
]);
/** KEEP: [town, a true sibling of the same row that must still print] */
const KEEP = /** @type {Array<[string, string]>} */ ([
  ['r2r-village-46', '@military__stable__dominant'], // RE-KEYED BY IDENTITY (PEOPLE-1 B1): the armed calm row's pool, a member of which prints
  ['r2r-village-13', '@c:religious__stable__dominant'], // RE-KEYED BY IDENTITY (PEOPLE-1 B1b): the faith's calm constraint is pooled
  ['bar0-hamlet-calm-rand-4', 'Xiao Gao and Tian Ma disagree often and trust completely.'], // the pair's first trust line stands
]);

/** @type {Record<string, string>} */
const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...ROWS.map((r) => r[0]), ...KEEP.map((r) => r[0])])) {
    const s = born(seed);
    towns[seed] = JSON.stringify({ npcs: s.npcs, relationships: s.relationships, rumour: s.prominentRelationship ?? null, powers: s.powerStructure.factions.map((f) => f.desc) });
  }
}, 600000);

/** PEOPLE-1 B1: '@<pool>' names a pooled row by identity: the town's printed position that is a member of it (a `{slot}` reads
 * as any fill); '@c:<pool>' the same of the printed constraint (B1b); any other value is itself. @param {string} seed @param {string} line */
const resolved = (seed, line) => {
  if (!line.startsWith('@')) return line;
  const field = line.startsWith('@c:') ? 'activeConstraint' : 'structuralPosition';
  const key = line.replace(/^@(?:c:)?/, '');
  // the pool as the writer composes it (B1c): [the T row's own line, ...the data pool]
  const pool = [{ text: T[key][field === 'activeConstraint' ? 'constraint' : 'position'] }, ...(field === 'activeConstraint' ? CONSTRAINT_VARIANTS : POSITION_VARIANTS)[key]].map((r) => new RegExp(`^${r.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{(?:house|export|import)\\\}/g, '.+')}$`));
  const printed = JSON.parse(towns[seed]).npcs.map((/** @type {any} */ n) => String(n[field] || ''));
  return printed.find((/** @type {string} */ p) => pool.some((re) => re.test(p))) ?? `(no member of ${key} prints)`;
};

describe('BAR2-PEOPLE batch B · the ties and the seats claim what every town bears (PP4, PP6, PP7)', () => {
  for (const [seed, refused, instead] of ROWS) {
    it(`${seed}: not "${refused.slice(0, 48)}…"; the reworded line prints`, () => {
      expectAbsentWithAnchor(towns[seed], refused, resolved(seed, instead), `${seed}: the refused line; its rewording in the same slot`);
      expect(towns[seed]).toContain(resolved(seed, instead));
    });
  }
  for (const [seed, kept] of KEEP) {
    it(`KEEP ${seed}: "${kept.slice(0, 48)}…" still prints`, () => {
      expect(towns[seed]).toContain(resolved(seed, kept));
    });
  }
});
