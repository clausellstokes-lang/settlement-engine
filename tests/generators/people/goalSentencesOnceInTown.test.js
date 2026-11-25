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
 * d3937c3f8's, 4, at both vantages, with the reserve beside it; no pick ever holds a reserve line; and on the 300 towns no
 * pass-one wording (`receipt[v].drawn`) is a PERSONALITY reserve line.
 * (u) The chair's test (13:32 UTC): on the same towns, every card's goals (text and intent, each vantage) are byte-identical
 * to d3937c3f8's (`tests/fixtures/goal-hashes-d3937c3f8.json`, written once by `tests/fixtures/goalHashes.mjs` against an
 * archive of d3937c3f8) EXCEPT a holding the deal's pass two placed as a repeat (`receipt.repeat[v]`: rotated by the widened
 * holder set or the walk, standing, 'exhausted', a floor's reserve taken) or the post-pass moved (`receipt[v].refusedBy`,
 * whose walk reads the town); any other mover is named. The rosters are d3937c3f8's (ids and count, per town).
 * BORN UNDER ITS REFERENCE'S OWN LAW (the chair's N66, ruled (A), 2026-11-23, at the flip; CLOSE-5 F-SEAT): d3937c3f8 has no
 * seat or fortune law code, so (u) births its towns with BOTH laws forced to 1 in its own config, and the fixture moves by no
 * byte (its door is not run); (p) and (t) hold on the product's LIT births AND on those law-1 births, so each tier births twice.
 */
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { SIZES } from '../../components/pageCensusWalk.shared.mjs';
import { TERRAIN_DATA } from '../../../src/data/geographyData.js';
import { GOAL_FAMILY_LINES, GOAL_RESERVE_LINES, PERSONALITY_CLUSTERS, PERSONALITY_CLUSTER_OF } from '../../../src/data/people/goalFamilies.js';
import { dealGoals } from '../../../src/generators/people/goals.js';
import { createPRNG } from '../../../src/kernel/prng.js';
import { rowHashes, townRow, vantageHash } from '../../fixtures/goalHashes.mjs';
import BORN from '../../fixtures/goal-hashes-d3937c3f8.json';

/**
 * E1 (WORDS-1, the tenth chair's G5): a want's house fill of a person noun that holds a possessive takes its short title
 * ("the appointee's office", never "the lord's appointee's office"); d3937c3f8's hashes hold the long form, so a holding is
 * read in that form here. @param {any} c @returns {any}
 */
const longTitled = (c) => (c?.goal ? { ...c, goal: { ...c.goal, ...Object.fromEntries(['short', 'long'].map((v) => [v, typeof c.goal[v] === 'string' ? c.goal[v].replace(/\bthe (steward|reeve|appointee)'s office\b/g, "the lord's $1's office") : c.goal[v]])) } } : c);

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
// (u) AND THE LAND (point 117, the chair's ruling 117-5 (C), 2026-11-25). CAUSE: B1(i) (`src/domain/landWithholding.js`: the
// land withholds a house whose material it cannot give; only a terrain whose `TERRAIN_DATA[terrain].withholds` list is
// non-empty can) takes a house, and its people, out of some of the 300 law-1 towns, so their rosters are no longer
// d3937c3f8's. THE RULE: the fixture is NOT re-recorded and no town is struck out by a list; a town whose roster is not the
// reference's is a stray EXCEPT where the town's own terrain has a non-empty `withholds` list (read from TERRAIN_DATA): there
// (u) is not read on that town and the town is COUNTED (set aside). Every other town, and every withholding-terrain town
// whose roster matches, is read exactly as before. Over the six sizes (u) is read on at least 280 of the 300 towns and at
// most 20 are set aside. FOUND at the merge (point 117): 16 set aside, every one on the desert, and 284 read: thorp 0,
// hamlet 1 (22), village 4 (21 33 43 49), town 3 (12 20 38), city 2 (19 22), metropolis 6 (1 13 20 29 32 37).
/** @param {any} town @returns {boolean} the town's own terrain withholds something */
const landWithholdsHere = (town) => {
  const row = /** @type {Record<string, { withholds?: ReadonlyArray<string> }>} */ (TERRAIN_DATA)[String(town?.config?.terrainType ?? '')];
  return Array.isArray(row?.withholds) && row.withholds.length > 0;
};
/** (u) per size, filled by the size arms: towns read and towns set aside. @type {Map<string, { read: number, setAside: string[] }>} */
const U_TALLY = new Map();
/** A line's text (a bare string, or a declared `{ line }`). @param {any} l @returns {string} */
const textOf = (l) => (typeof l === 'string' ? l : l.line);
/** Every PERSONALITY reserve line. */
const PERSONALITY_RESERVE = new Set(Object.values(/** @type {any} */ (GOAL_RESERVE_LINES).PERSONALITY || {}).flatMap((vs) => Object.values(/** @type {any} */ (vs)).flat().map(textOf)));

/**
 * One size's fifty towns and what (p), (t) and (u) read on them. `law1`: born under d3937c3f8's own law (both laws forced to
 * 1 in this arm's own config), and only there is (u) read; otherwise the product's lit birth.
 * @param {string} size @param {boolean} law1
 */
function measure(size, law1) {
  let count = 0; let holdings = 0; let moved = 0;
  /** @type {string[]} */ const stray = []; /** @type {string[]} */ const drawnReserve = [];
  /** @type {string[]} */ const unexhausted = []; /** @type {string[]} */ const named = [];
  /** @type {string[]} */ const setAside = []; let read = 0;
  for (let i = 0; i < TOWNS; i += 1) {
    const seed = `hxd-${size}-${i}`;
    log.lists = [];
    const cfg = { ...DEFAULT_CONFIG, settType: size };
    const town = generateSettlementPipeline(law1 ? { ...birthConfig(cfg), _seatLawVersion: 1, _fortuneLawVersion: 1 } : birthConfig(cfg), null, { seed, customContent: {} });
    /** @type {Map<string, any>} */ const receipts = new Map();
    for (const list of log.lists) for (const r of list) receipts.set(String(r.id), r); // the post-pass's receipts replace the deal's
    // (u), on the law-1 births only: the roster is d3937c3f8's; a card whose goals moved is a repeat of pass two or a card the post-pass moved
    if (law1) {
      const row = /** @type {any} */ (BORN).towns[seed];
      const now = townRow(town);
      const rosterIsReference = !!row && row.ids === now.ids && row.n === now.n;
      if (!rosterIsReference && landWithholdsHere(town)) setAside.push(`${seed} (${town.config?.terrainType})`);
      else read += 1;
      if (!rosterIsReference && !landWithholdsHere(town)) stray.push(`${seed}: the roster is not d3937c3f8's (terrain ${town.config?.terrainType})`);
      else if (rosterIsReference) (town.npcs || []).forEach((/** @type {any} */ c, /** @type {number} */ k) => {
        const was = rowHashes(row, k); const r = receipts.get(String(c.id));
        for (const v of /** @type {const} */ (['short', 'long'])) {
          if (vantageHash(longTitled(c), v) === was[v]) continue; // E1: read in the reference's form (`longTitled`)
          moved += 1;
          if (!r?.repeat?.[v] && !r?.[v]?.refusedBy) stray.push(`${seed} ${c.id}.${v}: moved from d3937c3f8, no repeat and no refusal on its receipt ("${c.goal?.[v]}")`);
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
  return { count, holdings, moved, stray, drawnReserve, unexhausted, named, setAside, read };
}

describe("the gate's count: no goal sentence printed twice in one town (p)", () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  for (const size of SIZES) {
    it(`(p) ${size}: every sentence printed twice is held by an 'exhausted' card, and the count is at most ${/** @type {any} */ (CEILING)[size] ?? 0}`, () => {
      // (p) and (t) on the product's LIT births, then on the law-1 births (u) makes, where (u) is read
      for (const law1 of [false, true]) {
        const { count, holdings, moved, stray, drawnReserve, unexhausted, named, setAside, read } = measure(size, law1);
        if (law1) U_TALLY.set(size, { read, setAside });
        const law = law1 ? 'under law 1, the reference\'s own law' : 'lit';
        expect(holdings, `anti-vacuity (${law}): the towns print goals`).toBeGreaterThan(TOWNS);
        expect(unexhausted, `a sentence printed twice with no exhausted holder (${law})`).toEqual([]);
        expect(count, `identical goal sentences in ${size}, ${law} (${named.join(' | ') || 'none'})`).toBeLessThanOrEqual(/** @type {any} */ (CEILING)[size] ?? 0);
        if (law1) {
          expect(stray, `(u) ${size}, ${law}: only repeats and refused cards move (${moved} holdings moved)`).toEqual([]);
          if (size === 'city' || size === 'metropolis') expect(moved, `(u) ${law}: anti-vacuity: the cure moved repeats here`).toBeGreaterThan(0);
        }
        expect(drawnReserve, `(t) a reserve line drawn (${law})`).toEqual([]);
      }
    }, 240_000); // its own budget, carrying the measured figure (CI-FIT-3, CLOSE-5, 2026-11-23): each tier now births twice (lit, and law 1 for (u): the chair's N66); the slowest of the six (metropolis) 52.3 s here on the flipped tree (075fbdd89, --maxWorkers=3; 30.1 s born once); about 96.2 s on a CI runner (the measured factor), past three quarters of its old 120 s; was 120_000 (one budget covers all six)
  }

  it('(u) over the six sizes: read on at least 280 of the 300 towns, and at most 20 set aside on a withholding land', () => {
    expect([...U_TALLY.keys()].sort(), '(u) every size arm ran its law-1 births').toEqual([...SIZES].sort());
    const tallies = [...U_TALLY.values()];
    const read = tallies.reduce((n, t) => n + t.read, 0);
    const setAside = tallies.flatMap((t) => t.setAside);
    expect(read, `(u) towns read (set aside: ${setAside.join(', ') || 'none'})`).toBeGreaterThanOrEqual(280);
    expect(setAside.length, `(u) towns set aside: ${setAside.join(', ') || 'none'}`).toBeLessThanOrEqual(20);
  });
});

describe('the draw never reaches the PERSONALITY reserve (t)', () => {
  it("(t) every PERSONALITY cell draws among d3937c3f8's 4 lines at each vantage; the reserve is beside it; no pick holds a reserve line", () => {
    for (const k of PERSONALITY_CLUSTERS) for (const v of ['short', 'long']) expect(/** @type {any} */ (GOAL_FAMILY_LINES.PERSONALITY)[k][v].length, `${k}.${v}`).toBe(4);
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
    expect(Object.fromEntries([...seen].map(([k, n]) => [k, [...n]]))).toEqual(Object.fromEntries([...seen.keys()].map((k) => [k, [4]])));
  });
});
