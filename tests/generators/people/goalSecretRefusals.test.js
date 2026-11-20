/**
 * goalSecretRefusals.test.js — A WANT REFUSED BESIDE THE CARD'S OWN SECRET (GOALS-1, builder 4; the brief's AMENDMENT 2 item 6
 * and AMENDMENT 3 items 8 and 9; the chair's rulings of 2026-11-20 11:15, 11:24 and 11:32 UTC; GOALS-2 builder 6, the chair's
 * rulings of 12:05 and 12:37 UTC: THE REFUSAL IS ONE POST-PASS after the deal and the rare deal, `refuseWantsBesideSecrets`, by
 * each card's final secret, and no other card is touched).
 *
 *   (j) planted cards of the conviction cluster, each with a secret of the closed list, through the seam's order (the deal,
 *       then the post-pass): no want of theirs is of a refused cluster; the same cards with a secret off the list hold
 *       conviction wants (the draw is the same);
 *   (k) the rare deal's venal row on a card holding a conviction want (the post-pass, as the two seams call it after the rare
 *       deal): the want is replaced by the next admitted candidate, the intent follows, the rare deal's output is otherwise
 *       kept, and a cast with no such card is returned as it is;
 *   (l) THE TOOTH: where the next candidate aims at the person the rare secret names, it is skipped. No row of the four names a
 *       person today (`data/rareSecrets.js`), so the row is planted through the data module (as (e) plants a reserve line);
 *   (m) THE CHAIR'S RED (12:05 UTC): a refused card EARLY in the roster, later cards of its cluster: through the deal and the
 *       post-pass, against the same cast with the closed list emptied, EVERY other card holds its goals byte for byte;
 *   (n) THE RUNGS: a refused card whose walk reaches a wording another card holds before a free one takes the free one;
 *   (o) THE CHAIR'S CHECK (12:37 UTC): the rare deal's output (every secret) is byte-identical with the refusal on and off.
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
  const keep = new Set(kept.map((c) => c.id));
  const dealt = goals.dealGoals(SETTLEMENT, [...kept, ...held], ties, createPRNG('goal-secret-refusal-j'), { keep });
  // the seam's order (12:05 UTC): the deal, then the post-pass over every card
  return /** @type {any} */ (goals).refuseWantsBesideSecrets(SETTLEMENT, dealt, ties, { keep }).slice(n);
}
const refusedWants = (/** @type {any[]} */ cast) => cast.flatMap((c) => ['short', 'long'].filter((v) => c.goal?.intent?.[v]?.family === 'PERSONALITY' && REFUSED.includes(c.goal.intent[v].kind)).map((v) => `${c.id}.${v}`));

describe('the want refused beside the card\'s own secret (j)', () => {
  it('(j) a conviction card with a listed secret holds no conviction or duty want; off the list it keeps its want', () => {
    expect(typeof LISTED, 'the closed list has a title row').toBe('string');
    expect(typeof /** @type {any} */ (goals).refuseWantsBesideSecrets, 'the one post-pass both seams call').toBe('function');
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
    expect(typeof /** @type {any} */ (goals).refuseWantsBesideSecrets, 'the one function both seams call').toBe('function');
    const row = rareRow('paidToForget');
    const { cast, ties } = plantedBefore(['y']);
    const after = withRare(cast, { what: row.what, stakes: row.stakes });
    const out = /** @type {any} */ (goals).refuseWantsBesideSecrets(SETTLEMENT, after, ties);
    const x = out.find((/** @type {any} */ c) => c.id === 'x');
    expect(REFUSED.includes(x.goal.intent.short.kind) && x.goal.intent.short.family === 'PERSONALITY', 'the want is replaced').toBe(false);
    expect(x.goal.short).not.toBe(cast[0].goal.short);
    expect([x.goal.intent.short.family, x.goal.intent.short.kind, x.goal.intent.short.target?.id], 'the next admitted: the ally tie').toEqual(['TIES', 'ally', 'y']);
    expect(x.goal.short).toContain('Yan Moss');
    expect(x.secret, 'the rare secret is kept').toEqual(after[0].secret);
    for (let i = 1; i < out.length; i += 1) expect(out[i], 'every other card as the rare deal left it').toBe(after[i]);
    // a cast the rare deal left alone, or changed to a row not of the four, is returned as it is
    expect(/** @type {any} */ (goals).refuseWantsBesideSecrets(SETTLEMENT, cast.slice(), ties)).toEqual(cast);
    const other = RARE_SECRET_FAMILIES.flatMap((f) => /** @type {any[]} */ (/** @type {any} */ (RARE_SECRET_ROWS)[f])).find((r) => !(leaf.GOAL_SECRET_REFUSAL_RARE_KEYS || []).includes(r.key) && !/\{/.test(r.what + r.stakes));
    const untouched = withRare(cast, { what: other.what, stakes: other.stakes });
    expect(/** @type {any} */ (goals).refuseWantsBesideSecrets(SETTLEMENT, untouched, ties)).toBe(untouched);
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
    expect(typeof fresh.refuseWantsBesideSecrets).toBe('function');
    const { cast, ties } = plantedBefore(['y', 'z']);
    // the planted row names y, the person the walk would reach first (x's tie to y is the first TIES call)
    const after = withRare(cast, { what: 'Saw Yan Moss weigh the grain short zq', stakes: 'The payments from Yan Moss have stopped zq' });
    const out = fresh.refuseWantsBesideSecrets(SETTLEMENT, after, ties);
    const x = out.find((/** @type {any} */ c) => c.id === 'x');
    expect([x.goal.intent.short.family, x.goal.intent.short.target?.id], 'y is passed over for z').toEqual(['TIES', 'z']);
    // CONTROL: the same row naming no one in the cast leaves the walk on y
    const plain = withRare(cast, { what: 'Saw Nobody Here weigh the grain short zq', stakes: 'The payments from Nobody Here have stopped zq' });
    expect(fresh.refuseWantsBesideSecrets(SETTLEMENT, plain, ties).find((/** @type {any} */ c) => c.id === 'x').goal.intent.short.target?.id).toBe('y');
  });
});

const LEAF_PATH = '../../../src/data/people/goalSecretRefusals.js';
/** The seam's order over a cast: the deal, then the post-pass (where the module has it). @param {any} mod @param {any[]} cast @param {any[]} ties @param {string} label */
const throughSeam = (mod, cast, ties, label) => {
  const dealt = mod.dealGoals(SETTLEMENT, cast, ties, createPRNG(label));
  return typeof mod.refuseWantsBesideSecrets === 'function' ? mod.refuseWantsBesideSecrets(SETTLEMENT, dealt, ties) : dealt;
};

describe('the chair\'s red: no other card is touched (m)', () => {
  afterEach(() => { vi.doUnmock(LEAF_PATH); vi.resetModules(); });
  it('(m) a refused card early in the roster: every other card holds its goals byte for byte against the emptied list', async () => {
    expect(typeof LISTED, 'the closed list has a title row').toBe('string');
    // c0 (the listed secret) stands first; c1..c11 share its cluster (conviction) with a secret off the list; each allied to the next
    const n = 12;
    const cast = Array.from({ length: n }, (_, k) => ({ id: `c${k}`, name: `Holder${k} Rowan`, goal: null, personality: { dominant: CONVICTION },
      secret: { what: k === 0 ? LISTED : `Keeps a diary nobody has read zq ${k}`, stakes: 'Someone keeps a ledger zq' } }));
    const ties = cast.slice(1).map((c, k) => ({ from: cast[k].id, to: c.id, type: 'ally', strength: 'moderate' }));
    const real = throughSeam(goals, cast, ties, 'goal-secret-refusal-m');
    vi.resetModules();
    vi.doMock(LEAF_PATH, async (importOriginal) => ({ .../** @type {any} */ (await importOriginal()), GOAL_SECRET_REFUSAL_ROWS: Object.freeze({}) }));
    const emptied = throughSeam(/** @type {any} */ (await import('../../../src/generators/people/goals.js')), cast, ties, 'goal-secret-refusal-m');
    // anti-vacuity: with the list emptied the refused card holds a conviction or duty want (the pairing stands)
    expect(refusedWants([emptied[0]]).length, 'c0 holds the pairing with the list emptied').toBeGreaterThan(0);
    expect(refusedWants([real[0]]), 'c0 holds no conviction or duty want').toEqual([]);
    const moved = real.slice(1).filter((c, k) => JSON.stringify(c.goal) !== JSON.stringify(emptied[k + 1].goal)).map((c) => c.id);
    expect(moved, 'the cards moved by the refusal of c0 (none may move)').toEqual([]);
  });
});

describe('the rungs: a free wording before a held one (n)', () => {
  it('(n) a refused card whose walk reaches a wording another card holds takes the first free wording', () => {
    const fn = /** @type {any} */ (goals).refuseWantsBesideSecrets;
    expect(typeof fn, 'the one post-pass').toBe('function');
    const line = GOAL_FAMILY_LINES.PERSONALITY.conviction.short[0];
    const text = typeof line === 'string' ? line : line.line;
    /** x1 and x2 (the conviction cluster, each holding a conviction want), x1 allied to y, x2 to z; `listed1`: x1's secret is listed @param {boolean} listed1 */
    const planted = (listed1) => {
      const mk = (/** @type {string} */ id, /** @type {string | undefined} */ what) => ({ id, name: `${id.toUpperCase()}an Holt`, personality: { dominant: CONVICTION }, secret: { what, stakes: 'Someone keeps a ledger zq' },
        goal: { short: text, long: null, intent: { short: { family: 'PERSONALITY', kind: 'conviction', key: 'indulge_trait', target: null }, long: null } } });
      const cast = [mk('x1', listed1 ? LISTED : 'Keeps a diary nobody has read zq'), mk('x2', LISTED), { id: 'y', name: 'Yan Moss', goal: null }, { id: 'z', name: 'Zan Moss', goal: null }];
      return { cast, ties: [{ from: 'x1', to: 'y', type: 'ally', strength: 'moderate' }, { from: 'x2', to: 'z', type: 'ally', strength: 'moderate' }] };
    };
    // CONTROL: x1 off the list keeps its want; x2's walk takes the first TIES line, free
    const control = planted(false);
    const c = fn(SETTLEMENT, control.cast, control.ties);
    const cw = goals.goalReceiptsOf(c).find((r) => r.id === 'x2')?.short?.wording;
    expect(c[0].goal, 'x1 kept').toEqual(control.cast[0].goal);
    expect([c[1].goal.intent.short.family, c[1].goal.intent.short.target?.id]).toEqual(['TIES', 'z']);
    // x1 refused too, first in the roster: it takes that wording (free), so x2's walk reaches it HELD and passes on to a free one
    const both = planted(true);
    const out = fn(SETTLEMENT, both.cast, both.ties);
    const receipts = new Map(goals.goalReceiptsOf(out).map((r) => [r.id, r]));
    expect(receipts.get('x1')?.short?.wording, 'x1 holds the wording x2 took in the control').toBe(cw);
    expect([out[1].goal.intent.short.family, out[1].goal.intent.short.target?.id]).toEqual(['TIES', 'z']);
    expect(receipts.get('x2')?.short?.wording, 'x2 takes a free wording').not.toBe(cw);
    expect(receipts.get('x2')?.short?.refusedBy).toBe('secret');
  });
});

const RARE_DATA_PATH = '../../../src/data/rareSecrets.js';
describe('the rare deal is the same with the refusal on and off (o)', () => {
  afterEach(() => { vi.doUnmock(RARE_DATA_PATH); vi.doUnmock(LEAF_PATH); vi.resetModules(); });
  it('(o) for every seed of a planted cast, every secret the seam leaves is byte-identical with the refusal on and off', async () => {
    expect(typeof LISTED, 'the closed list has a title row').toBe('string');
    // the rare deal planted to deal one row of the venal kind that names another person, to every eligible card that passes
    const plant = async (/** @type {any} */ importOriginal) => {
      const real = /** @type {any} */ (await importOriginal());
      const row = Object.freeze({ key: 'paidToForget', what: 'Saw {target} weigh the grain short zq', stakes: 'The payments from {target} have stopped zq', names: 'other' });
      return { ...real, RARE_SECRET_ROWS: Object.freeze({ ...real.RARE_SECRET_ROWS, deeds: Object.freeze([row]) }),
        RARE_SECRET_ODDS: Object.freeze({ deeds: { perPerson: 1 }, natures: { perPerson: 0 }, ties: { perPerson: 0 }, masters: { perPlace: 0 }, outsiders: { perPlace: 0 } }) };
    };
    const load = async (/** @type {boolean} */ on) => {
      vi.resetModules();
      vi.doMock(RARE_DATA_PATH, plant);
      if (on) vi.doUnmock(LEAF_PATH); else vi.doMock(LEAF_PATH, async (importOriginal) => ({ .../** @type {any} */ (await importOriginal()), GOAL_SECRET_REFUSAL_ROWS: Object.freeze({}) }));
      return { g: /** @type {any} */ (await import('../../../src/generators/people/goals.js')), r: /** @type {any} */ (await import('../../../src/generators/people/rareSecrets.js')) };
    };
    // x: the conviction cluster, a secret of the closed list, of years; allied to y and z; w stands untied
    const cast = [
      { id: 'x', name: 'Xan Holt', personality: { dominant: CONVICTION }, physical: { age: 'mid-forties' }, secret: { what: LISTED, stakes: 'Someone keeps a ledger zq' }, goal: null },
      { id: 'y', name: 'Yan Moss', goal: null }, { id: 'z', name: 'Zan Moss', goal: null }, { id: 'w', name: 'Wan Moss', goal: null },
    ];
    const ties = [{ from: 'x', to: 'y', type: 'ally', strength: 'moderate' }, { from: 'x', to: 'z', type: 'ally', strength: 'moderate' }];
    const place = { ...SETTLEMENT, tier: 'town' };
    /** the seam's order on a module pair (the post-pass where the module has it); `on`: the refusal read @param {any} m @param {boolean} on @param {string} seed */
    const seam = (m, on, seed) => {
      const dealt = m.g.dealGoals(place, cast, ties, createPRNG(`goal-secret-refusal-o-${seed}`));
      const rare = m.r.dealRareSecrets(place, dealt, ties, { seed });
      const pass = on ? (m.g.refuseWantsBesideSecrets ?? m.g.refuseAfterRareSecrets) : null;
      return !pass ? rare : m.g.refuseWantsBesideSecrets ? pass(place, rare, ties, { receiptsOf: dealt }) : pass(place, dealt, rare, ties);
    };
    const seeds = Array.from({ length: 24 }, (_, k) => `o${k}`);
    const on = await load(true); const withRefusal = seeds.map((seed) => seam(on, true, seed));
    const off = await load(false); const without = seeds.map((seed) => seam(off, false, seed));
    let changed = 0; /** @type {string[]} */ const moved = [];
    seeds.forEach((seed, k) => withRefusal[k].forEach((/** @type {any} */ c, /** @type {number} */ i) => {
      if (JSON.stringify(c.goal) !== JSON.stringify(without[k][i].goal)) changed += 1;
      if (JSON.stringify(c.secret) !== JSON.stringify(without[k][i].secret)) moved.push(`${seed}:${c.id}`);
    }));
    expect(withRefusal.some((c) => /zq$/.test(c[0].secret.stakes)), 'anti-vacuity: the planted rare row is dealt').toBe(true);
    expect(changed, 'anti-vacuity: the refusal changes a want').toBeGreaterThan(0);
    expect(moved, 'the secrets the refusal moved (none may move)').toEqual([]);
  });
});
