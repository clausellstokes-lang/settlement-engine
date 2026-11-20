/**
 * goalSentencesOnceInTown.test.js — THE GATE'S COUNT (GOALS-3, builder 7, 2026-11-20; the chair's gate of 12:32 UTC and
 * rulings of 13:17 UTC): no goal SENTENCE printed twice in one town, short and long pooled.
 *
 * (p) The measure's towns (`docs/chair/2026-11-20/content/goals/measures/goals-final.mjs`): seeds `hxd-<size>-<i>`, i < 50,
 * every size of `tests/components/pageCensusWalk.shared.mjs :: SIZES`, born through the pipeline at the default settings
 * after `loadGenerationLawPayloads()`. Every sentence a town prints twice is held by a card whose goal receipt says
 * `'exhausted'` (generators/people/goals.js: its cell and its reserve all printed), and the count by size (k − 1 per sentence
 * held k times) is at or below the base's 3 (835fabd2d: city 1, metropolis 2, every other size 0). A failure names each town,
 * sentence and card. The receipts are read off the deal and its post-pass as the pipeline calls them (the module wrapped
 * here, every export the same function).
 * (t) The chair's test (13:32 UTC): every PERSONALITY cell's draw modulus (its drawn line count, what `fork.pick` sees) is
 * its whole drawn cell at both vantages (d3937c3f8's 4; since GOALS-4 the wants' tranche appended to six clusters, their
 * counts below), with the reserve beside it; no pick ever holds a reserve line; and on the 300 towns no pass-one wording
 * (`receipt[v].drawn`) is a PERSONALITY reserve line.
 * (u) The chair's test (13:32 UTC), RE-TAKEN BY ITS OWN DOOR AT GOALS-4 (the wants' tranche; the build brief): an appended
 * cell changes its `fork.pick` modulus, so the premise "only pass-two repeats move" no longer holds. The fixture is
 * re-taken at the build's base, d8b174237 (`tests/fixtures/goal-hashes-d8b174237.json`, written once by
 * `tests/fixtures/goalHashes.mjs` against an archive of d8b174237; d3937c3f8's stays as the record), and on the same towns
 * every card's goals (text and intent, each vantage) are byte-identical to the base's EXCEPT, each counted: a holding of a
 * cell the tranche appended to (`receipt[v]`'s family, kind and vantage among `WANT-LINES-FINAL.md`'s 35 cells); a holding
 * the deal's pass two placed as a repeat (`receipt.repeat[v]`); a card the post-pass moved (`receipt[v].refusedBy`); the
 * held-text knock-on (GOALS-2 §1.5, `goals.js :: cellCandidates`' held filter: another card of the town moved at the same
 * vantage, or, for a long want, the card's own short moved, whose family the long draw passes over). Any other mover is
 * named. The rosters are the base's (ids and count, per town).
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { SIZES } from '../../components/pageCensusWalk.shared.mjs';
import { GOAL_FAMILY_LINES, GOAL_RESERVE_LINES, PERSONALITY_CLUSTERS, PERSONALITY_CLUSTER_OF } from '../../../src/data/people/goalFamilies.js';
import { dealGoals } from '../../../src/generators/people/goals.js';
import { createPRNG } from '../../../src/kernel/prng.js';
import { rowHashes, townRow, vantageHash } from '../../fixtures/goalHashes.mjs';
import BORN from '../../fixtures/goal-hashes-d8b174237.json';

/** Every receipt list the deal and the post-pass returned, in call order (reset per town). */
const log = vi.hoisted(() => /** @type {{ lists: any[][] }} */ ({ lists: [] }));
vi.mock('../../../src/generators/people/goals.js', async (importOriginal) => {
  const real = /** @type {any} */ (await importOriginal());
  const kept = (/** @type {any} */ out) => { log.lists.push(real.goalReceiptsOf(out)); return out; };
  const post = (/** @type {any[]} */ ...a) => kept(real.refuseWantsBesideSecrets(...a));
  return { ...real, dealGoals: (/** @type {any[]} */ ...a) => kept(real.dealGoals(...a)), refuseWantsBesideSecrets: post, refuseAfterRareSecrets: post };
});

/** The base's count by size (835fabd2d, `goals-final.base-835fabd2d.out.txt`): the gate's ceiling. */
const CEILING = Object.freeze({ city: 1, metropolis: 2 });
const TOWNS = 50;
/** A line's text (a bare string, or a declared `{ line }`). @param {any} l @returns {string} */
const textOf = (l) => (typeof l === 'string' ? l : l.line);
/** The cells the wants' tranche appended to (GOALS-4), as `family.kind.vantage`, read off the one source's cell headers. */
const APPENDED = new Set([...readFileSync(new URL('../../../docs/chair/2026-11-20/content/goals/wants/WANT-LINES-FINAL.md', import.meta.url), 'utf8')
  .matchAll(/^### ([A-Z]+)\/([a-z_]+)\/(short|long) · /gm)].map((m) => `${m[1]}.${m[2]}.${m[3]}`));
/** Each PERSONALITY cell's drawn count (d3937c3f8's 4; GOALS-4's tranche appended to six clusters). THE PIN MOVED BY ITS OWN
 * DOOR, the cause: the wants' tranche (before: 4 at every cell and vantage). */
const PERSONALITY_COUNT = Object.freeze({
  greed: { short: 7, long: 7 }, fear: { short: 4, long: 5 }, forbidden_patron: { short: 4, long: 5 }, sway: { short: 9, long: 12 },
  grudge: { short: 8, long: 10 }, impulse: { short: 4, long: 5 },
});
/** @param {string} k @param {string} v */
const personalityCount = (k, v) => /** @type {any} */ (PERSONALITY_COUNT)[k]?.[v] ?? 4;
/** Every PERSONALITY reserve line. */
const PERSONALITY_RESERVE = new Set(Object.values(/** @type {any} */ (GOAL_RESERVE_LINES).PERSONALITY || {}).flatMap((vs) => Object.values(/** @type {any} */ (vs)).flat().map(textOf)));

describe("the gate's count: no goal sentence printed twice in one town (p)", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  for (const size of SIZES) {
    it(`(p) ${size}: every sentence printed twice is held by an 'exhausted' card, and the count is at most ${/** @type {any} */ (CEILING)[size] ?? 0}`, () => {
      let count = 0; let holdings = 0; let moved = 0;
      const cause = { appended: 0, repeat: 0, refused: 0, knockOn: 0 };
      /** @type {string[]} */ const stray = []; /** @type {string[]} */ const drawnReserve = [];
      /** @type {string[]} */ const unexhausted = []; /** @type {string[]} */ const named = [];
      for (let i = 0; i < TOWNS; i += 1) {
        const seed = `hxd-${size}-${i}`;
        log.lists = [];
        const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
        /** @type {Map<string, any>} */ const receipts = new Map();
        for (const list of log.lists) for (const r of list) receipts.set(String(r.id), r); // the post-pass's receipts replace the deal's
        // (u) the roster is the base's; a card whose goals moved holds a goal of an appended cell, is a repeat of pass two,
        // a card the post-pass moved, or the held-text knock-on (another card of the town moved at that vantage, or its own short)
        const row = /** @type {any} */ (BORN).towns[seed];
        const now = townRow(town);
        if (!row || row.ids !== now.ids || row.n !== now.n) stray.push(`${seed}: the roster is not the base's`);
        else {
          const cards = /** @type {any[]} */ (town.npcs || []);
          const movedAt = cards.map((c, k) => { const was = rowHashes(row, k); return { short: vantageHash(c, 'short') !== was.short, long: vantageHash(c, 'long') !== was.long }; });
          cards.forEach((c, k) => {
            const r = receipts.get(String(c.id));
            for (const v of /** @type {const} */ (['short', 'long'])) {
              if (!movedAt[k][v]) continue;
              moved += 1;
              if (r?.[v] && APPENDED.has(`${r[v].family}.${r[v].kind}.${v}`)) cause.appended += 1;
              else if (r?.repeat?.[v]) cause.repeat += 1;
              else if (r?.[v]?.refusedBy) cause.refused += 1;
              else if (movedAt.some((m, j) => j !== k && m[v]) || (v === 'long' && movedAt[k].short)) cause.knockOn += 1;
              else stray.push(`${seed} ${c.id}.${v}: moved from the base, in no appended cell, no repeat, no refusal, no other mover ("${c.goal?.[v]}")`);
            }
          });
        }
        // (t) no pass-one wording is a PERSONALITY reserve line
        for (const r of receipts.values()) for (const v of ['short', 'long']) if (PERSONALITY_RESERVE.has(r?.[v]?.drawn)) drawnReserve.push(`${seed} ${r.id}.${v}: ${r[v].drawn}`);
        /** @type {Map<string, Array<{ id: string, v: string, rung: string }>>} */ const by = new Map();
        for (const c of town.npcs || []) for (const v of ['short', 'long']) {
          const text = c.goal?.[v]; if (!text) continue;
          holdings += 1;
          by.set(text, [...(by.get(text) || []), { id: String(c.id), v, rung: receipts.get(String(c.id))?.repeat?.[v] ?? '-' }]);
        }
        for (const [text, hs] of by) {
          if (hs.length < 2) continue;
          count += hs.length - 1;
          const line = `${seed} (${town.name}) x${hs.length} "${text}": ${hs.map((h) => `${h.id}.${h.v} rung=${h.rung}`).join(', ')}`;
          named.push(line);
          if (!hs.some((h) => h.rung === 'exhausted')) unexhausted.push(line);
        }
      }
      expect(holdings, 'anti-vacuity: the towns print goals').toBeGreaterThan(TOWNS);
      expect(unexhausted, 'a sentence printed twice with no exhausted holder').toEqual([]);
      expect(count, `identical goal sentences in ${size} (${named.join(' | ') || 'none'})`).toBeLessThanOrEqual(/** @type {any} */ (CEILING)[size] ?? 0);
      expect(stray, `(u) ${size}: only appended cells, repeats, refused cards and the held-text knock-on move (${moved} holdings moved: ${JSON.stringify(cause)})`).toEqual([]);
      if (size === 'city' || size === 'metropolis') expect(cause.appended, '(u) anti-vacuity: the tranche moved holdings of its cells here').toBeGreaterThan(0);
      expect(drawnReserve, '(t) a reserve line drawn').toEqual([]);
    }, 120_000);
  }
});

describe('the draw never reaches the PERSONALITY reserve (t)', () => {
  it("(t) every PERSONALITY cell draws among its whole drawn cell at each vantage (d3937c3f8's 4, the wants' tranche appended); the reserve is beside it; no pick holds a reserve line", () => {
    for (const k of PERSONALITY_CLUSTERS) for (const v of ['short', 'long']) expect(/** @type {any} */ (GOAL_FAMILY_LINES.PERSONALITY)[k][v].length, `${k}.${v}`).toBe(personalityCount(k, v));
    expect(PERSONALITY_RESERVE.size, 'anti-vacuity: the reserve has lines').toBeGreaterThan(0);
    // one card per cluster, each the ally of its own kept card (TIES or PERSONALITY, one a vantage), dealt on a stream that
    // records every pick: the first holder of a cluster finds nothing held, so its PERSONALITY pick is the whole cell
    const traitOf = Object.fromEntries(Object.entries(PERSONALITY_CLUSTER_OF).map(([t, k]) => [k, t]).reverse());
    /** @type {any[][]} */ const picks = [];
    const recorded = (/** @type {any} */ r) => ({ ...r, pick: (/** @type {any[]} */ a) => { picks.push(a); return r.pick(a); },
      weightedPick: (/** @type {any[]} */ a, /** @type {number[]} */ w) => { picks.push(a); return r.weightedPick(a, w); }, fork: (/** @type {string} */ l) => recorded(r.fork(l)) });
    /** @type {Map<string, Set<number>>} */ const seen = new Map();
    const cellOf = (/** @type {string} */ k, /** @type {string} */ text) => (['short', 'long'].find((v) => /** @type {any} */ (GOAL_FAMILY_LINES.PERSONALITY)[k][v].map(textOf).includes(text)));
    for (let s = 0; s < 40 && seen.size < PERSONALITY_CLUSTERS.length * 2; s += 1) {
      const kept = PERSONALITY_CLUSTERS.map((k) => ({ id: `k-${k}`, name: `Keeper ${k}`, goal: null }));
      const cards = PERSONALITY_CLUSTERS.map((k) => ({ id: `c-${k}`, name: `Card ${k}`, goal: null, personality: { dominant: traitOf[k] } }));
      const ties = cards.map((c, i) => ({ from: c.id, to: kept[i].id, type: 'ally' }));
      const settlement = { name: 'Testholm', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } };
      picks.length = 0;
      dealGoals(settlement, [...kept, ...cards], ties, recorded(createPRNG(`goals3-modulus-${s}`)), { keep: new Set(kept.map((c) => c.id)) });
      for (const a of picks) {
        expect(a.filter((c) => PERSONALITY_RESERVE.has(c?.text)).map((c) => c.text), 'a pick holds a reserve line').toEqual([]);
        if (!a.length || !a.every((c) => c?.family === 'PERSONALITY' && c.kind === a[0].kind)) continue;
        const key = `${a[0].kind}.${cellOf(a[0].kind, a[0].text)}`;
        seen.set(key, new Set([...(seen.get(key) || []), a.length]));
      }
    }
    expect(seen.size, 'every cluster at both vantages was drawn').toBe(PERSONALITY_CLUSTERS.length * 2);
    expect(Object.fromEntries([...seen].map(([k, n]) => [k, [...n]]))).toEqual(Object.fromEntries([...seen.keys()].map((k) => [k, [personalityCount(...(/** @type {[string, string]} */ (k.split('.'))))]])));
  });
});
