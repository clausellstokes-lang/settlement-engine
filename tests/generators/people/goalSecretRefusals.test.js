/**
 * goalSecretRefusals.test.js — A WANT REFUSED BESIDE THE CARD'S OWN SECRET (GOALS-1, builder 4; the brief's AMENDMENT 2 item 6
 * and AMENDMENT 3 items 8 and 9; the chair's rulings of 2026-11-20 11:15, 11:24 and 11:32 UTC).
 *
 *   (j) planted cards of the conviction cluster, each with a secret of the closed list: no want of theirs is of a refused
 *       cluster; the same cards with a secret off the list hold conviction wants (the draw is the same);
 *   (k) the rare deal's venal row on a card holding a conviction want (`refuseAfterRareSecrets`, as the two seams call it):
 *       the want is replaced by the next admitted candidate, the intent follows, the rare deal's output is otherwise kept,
 *       and a cast the rare deal left alone is returned as it is;
 *   (l) THE TOOTH: where the next candidate aims at the person the rare secret names, it is skipped. No row of the four names a
 *       person today (`data/rareSecrets.js`), so the row is planted through the data module (as (e) plants a reserve line).
 * Every line read here is derived from the data modules, never quoted; the fixture texts are this file's own (`zq`).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as goals from '../../../src/generators/people/goals.js';
import { GOAL_FAMILY_LINES, PERSONALITY_CLUSTER_OF } from '../../../src/data/people/goalFamilies.js';
import { RARE_SECRET_FAMILIES, RARE_SECRET_ROWS } from '../../../src/data/rareSecrets.js';
import { createPRNG } from '../../../src/kernel/prng.js';

/** The leaf, read live (absent on the base: the arms then red on their own assertions). */
const leaf = /** @type {any} */ (await import('../../../src/data/people/goalSecretRefusals.js').catch(() => ({})));
const REFUSED = /** @type {string[]} */ (leaf.GOAL_SECRET_REFUSED_CLUSTERS || ['conviction', 'duty']);
/** A listed secret with no token: the first title row of the closed list. */
const LISTED = /** @type {string | undefined} */ (Object.entries(leaf.GOAL_SECRET_REFUSAL_ROWS || {}).find(([k, t]) => k.startsWith('title:') && !String(t).includes('{'))?.[1]);
const CONVICTION = /** @type {string} */ (Object.keys(PERSONALITY_CLUSTER_OF).find((w) => /** @type {any} */ (PERSONALITY_CLUSTER_OF)[w] === 'conviction'));
const SETTLEMENT = { name: 'Testholm', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } };
/** A rare row of the venal kind, by key. @param {string} key */
const rareRow = (key) => RARE_SECRET_FAMILIES.flatMap((f) => /** @type {any[]} */ (/** @type {any} */ (RARE_SECRET_ROWS)[f])).find((r) => r.key === key);

/** n kept cards and n dealt, each the conviction cluster, allied to its own kept card, with `secret`. @param {string | undefined} what */
function plantedDeal(what) {
  const n = 8;
  const kept = Array.from({ length: n }, (_, k) => ({ id: `k${k}`, name: `Keeper${k} Alder`, goal: null }));
  const held = Array.from({ length: n }, (_, k) => ({ id: `c${k}`, name: `Holder${k} Rowan`, goal: null, personality: { dominant: CONVICTION }, secret: { what, stakes: 'Someone keeps a ledger zq' } }));
  const ties = held.map((c, k) => ({ from: c.id, to: kept[k].id, type: 'ally', strength: 'moderate' }));
  return goals.dealGoals(SETTLEMENT, [...kept, ...held], ties, createPRNG('goal-secret-refusal-j'), { keep: new Set(kept.map((c) => c.id)) }).slice(n);
}
const refusedWants = (/** @type {any[]} */ cast) => cast.flatMap((c) => ['short', 'long'].filter((v) => c.goal?.intent?.[v]?.family === 'PERSONALITY' && REFUSED.includes(c.goal.intent[v].kind)).map((v) => `${c.id}.${v}`));

describe('the want refused beside the card\'s own secret (j)', () => {
  it('(j) a conviction card with a listed secret holds no conviction or duty want; off the list it keeps its want', () => {
    expect(typeof LISTED, 'the closed list has a title row').toBe('string');
    const off = plantedDeal('Keeps a diary nobody has read zq');
    expect(refusedWants(off).length, 'anti-vacuity: off the list, conviction wants are held').toBeGreaterThan(0);
    const on = plantedDeal(LISTED);
    expect(refusedWants(on)).toEqual([]);
    // every want is still dealt (the refusal took the next admitted candidate, or the floor's next cluster)
    for (const c of on) for (const v of ['short', 'long']) expect(typeof c.goal[v], `${c.id}.${v}`).toBe('string');
    // a card whose want was of no refused cluster off the list keeps its goals byte for byte on it
    const same = off.filter((c) => !refusedWants([c]).length);
    for (const c of same) expect(on.find((x) => x.id === c.id).goal, c.id).toEqual(c.goal);
  });
});

/** A hand-made cast: x (the conviction cluster, its short want a conviction line) allied to each of `others`. @param {string[]} others */
function plantedBefore(others) {
  const line = GOAL_FAMILY_LINES.PERSONALITY.conviction.short[0];
  const text = typeof line === 'string' ? line : line.line;
  const x = { id: 'x', name: 'Xan Holt', personality: { dominant: CONVICTION }, secret: { what: 'Keeps a diary nobody has read zq', stakes: 'Someone keeps a ledger zq' },
    goal: { short: text, long: null, intent: { short: { family: 'PERSONALITY', kind: 'conviction', key: 'indulge_trait', target: null }, long: null } } };
  const cast = [x, ...others.map((id) => ({ id, name: `${id.toUpperCase()}an Moss`, goal: { short: `Tend the garden zq ${id}.`, long: null, intent: { short: null, long: null } } }))];
  const ties = others.map((id) => ({ from: 'x', to: id, type: 'ally', strength: 'moderate' }));
  return { cast, ties };
}
/** The cast as the rare deal would return it with x's secret replaced. @param {any[]} cast @param {{ what: string, stakes: string }} secret */
const withRare = (cast, secret) => cast.map((c) => (c.id === 'x' ? { ...c, secret } : c));

describe('the refusal read again after the rare deal (k)', () => {
  it('(k) a venal rare secret on a card holding a conviction want: the want is replaced, the intent follows, nothing else moves', () => {
    expect(typeof /** @type {any} */ (goals).refuseAfterRareSecrets, 'the one function both seams call').toBe('function');
    const row = rareRow('paidToForget');
    const { cast, ties } = plantedBefore(['y']);
    const after = withRare(cast, { what: row.what, stakes: row.stakes });
    const out = /** @type {any} */ (goals).refuseAfterRareSecrets(SETTLEMENT, cast, after, ties);
    const x = out.find((/** @type {any} */ c) => c.id === 'x');
    expect(REFUSED.includes(x.goal.intent.short.kind) && x.goal.intent.short.family === 'PERSONALITY', 'the want is replaced').toBe(false);
    expect(x.goal.short).not.toBe(cast[0].goal.short);
    expect([x.goal.intent.short.family, x.goal.intent.short.kind, x.goal.intent.short.target?.id], 'the next admitted: the ally tie').toEqual(['TIES', 'ally', 'y']);
    expect(x.goal.short).toContain('Yan Moss');
    expect(x.secret, 'the rare secret is kept').toEqual(after[0].secret);
    for (let i = 1; i < out.length; i += 1) expect(out[i], 'every other card as the rare deal left it').toBe(after[i]);
    // a cast the rare deal left alone, or changed to a row not of the four, is returned as it is
    expect(/** @type {any} */ (goals).refuseAfterRareSecrets(SETTLEMENT, cast, cast.slice(), ties)).toEqual(cast);
    const other = RARE_SECRET_FAMILIES.flatMap((f) => /** @type {any[]} */ (/** @type {any} */ (RARE_SECRET_ROWS)[f])).find((r) => !(leaf.GOAL_SECRET_REFUSAL_RARE_KEYS || []).includes(r.key) && !/\{/.test(r.what + r.stakes));
    const untouched = withRare(cast, { what: other.what, stakes: other.stakes });
    expect(/** @type {any} */ (goals).refuseAfterRareSecrets(SETTLEMENT, cast, untouched, ties)).toBe(untouched);
  });
});

describe('the tooth: the person the rare secret names (l)', () => {
  afterEach(() => { vi.doUnmock('../../../src/data/rareSecrets.js'); vi.resetModules(); });
  it('(l) where the next candidate aims at the person the rare secret names, it is skipped', async () => {
    vi.resetModules();
    vi.doMock('../../../src/data/rareSecrets.js', async (importOriginal) => {
      const real = /** @type {any} */ (await importOriginal());
      const plant = (/** @type {any} */ r) => (r.key === 'paidToForget' ? Object.freeze({ ...r, what: 'Saw {target} weigh the grain short zq', stakes: 'The payments from {target} have stopped zq' }) : r);
      return { ...real, RARE_SECRET_ROWS: Object.freeze(Object.fromEntries(Object.entries(real.RARE_SECRET_ROWS).map(([f, rows]) => [f, Object.freeze(/** @type {any[]} */ (rows).map(plant))]))) };
    });
    const fresh = /** @type {any} */ (await import('../../../src/generators/people/goals.js'));
    expect(typeof fresh.refuseAfterRareSecrets).toBe('function');
    const { cast, ties } = plantedBefore(['y', 'z']);
    // the planted row names y, the person the walk would reach first (x's tie to y is the first TIES call)
    const after = withRare(cast, { what: 'Saw Yan Moss weigh the grain short zq', stakes: 'The payments from Yan Moss have stopped zq' });
    const out = fresh.refuseAfterRareSecrets(SETTLEMENT, cast, after, ties);
    const x = out.find((/** @type {any} */ c) => c.id === 'x');
    expect([x.goal.intent.short.family, x.goal.intent.short.target?.id], 'y is passed over for z').toEqual(['TIES', 'z']);
    // CONTROL: the same row naming no one in the cast leaves the walk on y
    const plain = withRare(cast, { what: 'Saw Nobody Here weigh the grain short zq', stakes: 'The payments from Nobody Here have stopped zq' });
    expect(fresh.refuseAfterRareSecrets(SETTLEMENT, cast, plain, ties).find((/** @type {any} */ c) => c.id === 'x').goal.intent.short.target?.id).toBe('y');
  });
});
