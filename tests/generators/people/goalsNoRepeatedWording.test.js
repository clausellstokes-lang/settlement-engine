/**
 * goalsNoRepeatedWording.test.js — GR1 FOR GOALS (GOALS-1, builder 1, 2026-11-20; the chair's rule GR1): within one town no
 * two people hold the same goal WORDING once the town's names are masked. Where the deal would repeat, the later person
 * takes, by rotation from the index it drew and with no new draw, a wording of its kind its own record admits that nobody
 * holds; else one held once by someone apart from it (not of its house, not tied to it; first sharing no power with it);
 * else its drawn wording stands, counted (generators/people/goals.js :: dealGoals, pass two; the chair's rulings of
 * 10:28 UTC). A person whose wording no earlier holding of the deal held keeps their goal (`receipt.repeat` names the rung).
 *
 * The wording of a printed goal is derived HERE, from the cells (data/people/goalFamilies.js), never from goals.js and never
 * by quoting a line: each cell template becomes a regex (every `{...}` matches any fill), and the wording is the template
 * with each NAME slot (a person, a power, a house) masked as `§` and each other slot (`resource`, `import`, `issue`) as its
 * captured fill. A printed text no template matches is its own wording (a crisis line).
 *
 *   (a) a planted city (the pipeline at untouched settings, seed `gr1-city-1`, re-dealt on a seeded stream so the
 *       receipts ride beside the cast) whose deal repeats wordings on the base: no two holdings share a wording, except
 *       where the receipts mark the repeat, and a wording two share is never two of one house nor two tied;
 *   (b) on that town, every holding whose receipt carries no `rotated` keeps the wording pass one dealt it (`drawn`);
 *   (c) a planted exhausted kind: twelve people (six of one house, two tied pairs) each allied to a different kept card,
 *       the TIES `ally` short cell holding five wordings: the two free wordings are taken first, then wordings are shared
 *       by two apart, and a wording that must be held a third time stands, counted;
 *   (d) a planted pair of one house: the later passes over its house-mate's wording for another holder's.
 * GOALS-1, builder 4 (the chair's approval of 10:48 UTC and rulings of 10:58 UTC):
 *   (f) with the real reserve (data/people/goalFamilies.js :: GOAL_RESERVE_LINES), the template repeats of the planted city
 *       of (a) and of a metropolis fall below their count on 84a8606b9 (no reserve), and (a)'s law holds on both;
 *   (g) the harsh-tie guard (GOAL_LINE_NOT_ON_TIES): a planted holder on an enemy tie at `mortal` whose rotation reaches
 *       the gentle reserve lines passes over them; the same holder on a `mild` enemy tie takes them; no draw moves;
 *   (h) a sentence and its mirror are one: two cards whose drawn template and name values are one pair in either order,
 *       the later rotates and never stands as 'twice' (and the sharing law, everywhere: no wording two share is a mirror).
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import * as goalFamilies from '../../../src/data/people/goalFamilies.js';
import { dealGoals, goalReceiptsOf } from '../../../src/generators/people/goals.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../../src/store/configSlice.js';
import { createPRNG } from '../../../src/kernel/prng.js';

/** The name slots: a person, a power, a house (the rule masks them); every other slot is its fill. */
const NAME_SLOTS = new Set(['above', 'below', 'other', 'handler', 'agent', 'target', 'priest', 'power', 'rival', 'guild',
  'house', 'otherHouse', 'front', 'targetHouse', 'shrine', 'arcaneHouse']);

/** Every line of every cell (the main cells and the reserve lines, if any). */
const LINES = [];
for (const table of [goalFamilies.GOAL_FAMILY_LINES, /** @type {any} */ (goalFamilies).GOAL_RESERVE_LINES || {}]) {
  for (const kinds of Object.values(table)) for (const vantages of Object.values(kinds)) for (const cell of Object.values(vantages)) {
    for (const l of cell) LINES.push(typeof l === 'string' ? l : l.line);
  }
}
const esc = (/** @type {string} */ s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** Each template as a matcher: its fixed text, its regex (a slot is any fill; a name's "'s" may have become a pronoun). */
const TEMPLATES = [...new Set(LINES)].map((line) => {
  const tokens = [...line.matchAll(/\{([^}]+)\}(?:'s)?/g)];
  const fixed = line.split(/\{[^}]+\}(?:'s)?/);
  const source = fixed.map((p, i) => esc(p) + (i < tokens.length ? (NAME_SLOTS.has(tokens[i][1]) || tokens[i][1].includes('|') ? '.+?' : '(.+?)') : '')).join('');
  return { line, fixedLength: fixed.join('').length, re: new RegExp(`^${source}$`, 'u') };
});

/** The wording of a printed goal: its template, names masked, other fills kept; else the text itself. @param {string} text */
function wordingOf(text) {
  let best = null; let match = null;
  for (const t of TEMPLATES) { const m = t.re.exec(text); if (m && (!best || t.fixedLength > best.fixedLength)) { best = t; match = m; } }
  if (!best || !match) return text;
  let g = 0;
  return best.line.replace(/\{([^}]+)\}/g, (whole, slot) => (NAME_SLOTS.has(slot) ? '§' : slot.includes('|') ? whole : match[++g]));
}

/** The holdings of a dealt cast, in roster order, short then long, with each card's receipt. @param {any[]} cast */
function holdingsOf(cast) {
  const receipts = new Map(goalReceiptsOf(cast).map((r) => [r.id, r]));
  const out = [];
  for (const c of cast) {
    const r = receipts.get(String(c.id));
    if (!r) continue;
    for (const v of /** @type {const} */ (['short', 'long'])) if (c.goal?.[v]) out.push({ id: String(c.id), v, text: c.goal[v], wording: wordingOf(c.goal[v]), receipt: r });
  }
  return out;
}

/** The holdings whose wording an earlier holding already holds. @param {ReturnType<typeof holdingsOf>} holdings */
function repeatsOf(holdings) {
  const seen = new Set(); const out = [];
  for (const h of holdings) { if (seen.has(h.wording)) out.push(h); seen.add(h.wording); }
  return out;
}

/** A holding's NAME values (its receipt's slots that the rule masks), sorted, as one key; '' when it names no one. @param {any} h */
const namesOf = (h) => { const v = Object.entries(h.receipt[h.v]?.slots || {}).filter(([k]) => NAME_SLOTS.has(k)).map(([, x]) => String(x)).sort(); return v.length ? JSON.stringify(v) : ''; };

/** The rungs whose holding shares its wording with an earlier holder (the chair's rulings of 10:28 UTC). */
const SHARED_RUNGS = ['twice', 'twice-same-power', 'stands'];

/**
 * The sharing law, read on the outcome: a wording is held by three or more only where a holder of it STANDS; a wording two
 * share (the second by rung 'twice' or 'twice-same-power') is never held by two of one house nor by two tied, and 'twice'
 * never by two of one power, and never by a mirror (the same name values in either order: the chair's ruling of 10:58 UTC).
 * @param {ReturnType<typeof holdingsOf>} holdings @param {any[]} cast @param {any[]} ties
 */
function sharingViolations(holdings, cast, ties) {
  const byId = new Map(cast.map((c) => [String(c.id), c]));
  const tied = new Set(ties.flatMap((t) => [`${t.from}|${t.to}`, `${t.to}|${t.from}`]));
  const house = (/** @type {any} */ c) => (c?.institution?.kind === 'house' ? c.institution.key : null);
  const powers = (/** @type {any} */ c) => new Set((c?.memberships || []).map((/** @type {any} */ m) => m.power).filter(Boolean));
  const out = [];
  /** @type {Map<string, typeof holdings>} */ const byWording = new Map();
  for (const h of holdings) byWording.set(h.wording, [...(byWording.get(h.wording) || []), h]);
  for (const [wording, hs] of byWording) {
    const sharing = hs.filter((h) => h.receipt.repeat?.[h.v] !== 'stands');
    if (sharing.length > 2) out.push(`${wording}: held by ${sharing.length} without a standing repeat`);
    if (sharing.length !== 2) continue;
    const [a, b] = sharing.map((h) => byId.get(h.id));
    if (house(a) && house(a) === house(b)) out.push(`${wording}: two of one house (${a.id}, ${b.id})`);
    if (tied.has(`${a.id}|${b.id}`)) out.push(`${wording}: two tied (${a.id}, ${b.id})`);
    const rung = sharing[1].receipt.repeat?.[sharing[1].v];
    if (rung === 'twice' && [...powers(a)].some((p) => powers(b).has(p))) out.push(`${wording}: 'twice' but one power (${a.id}, ${b.id})`);
    if (namesOf(sharing[0]) && namesOf(sharing[0]) === namesOf(sharing[1])) out.push(`${wording}: a mirror, ${namesOf(sharing[0])} (${a.id}, ${b.id})`);
  }
  return out;
}

const HOUSE = { kind: 'house', key: 'Traveling performers' }; // a house in no power: its cards keep no books (no INSTITUTION goal)
/**
 * A hand-built cast: n kept cards, and n dealt cards each allied to its own kept card (so the TIES `ally` short cell is
 * the only goal it can draw); `inHouse(k)` puts dealt card k in one house; `extraTies` tie dealt cards to each other
 * (covert, so they add no tie goal). @param {number} n @param {(k: number) => boolean} inHouse @param {any[]} extraTies @param {string} seed
 */
function plantedCast(n, inHouse, extraTies, seed) {
  const kept = Array.from({ length: n }, (_, k) => ({ id: `k${k}`, name: `Keeper${k} Alder`, goal: null }));
  const allies = Array.from({ length: n }, (_, k) => ({ id: `s${k}`, name: `Spoke${k} Rowan`, goal: null, ...(inHouse(k) ? { institution: HOUSE } : {}) }));
  const ties = [...allies.map((c, k) => ({ from: c.id, to: kept[k].id, type: 'ally' })), ...extraTies];
  const settlement = { name: 'Testholm', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } };
  const cast = dealGoals(settlement, [...kept, ...allies], ties, createPRNG(seed), { keep: new Set(kept.map((c) => c.id)) });
  return { cast, ties, dealt: cast.slice(n) };
}

describe('GR1 for goals: no wording twice in one town', () => {
  const SEED = 'gr1-city-1';
  /** @type {any[]} */ let cast = [];
  /** @type {any} */ let town = null;
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'city' }), null, { seed: SEED, customContent: {} });
    const cards = town.npcs.filter((c) => !c.temporary).map((c) => ({ ...c, goal: null }));
    cast = dealGoals(town, cards, town.relationships, createPRNG(`gr1::${SEED}`));
  }, 120_000);

  it('the wording reader knows every printed goal of the planted city (anti-vacuity: no crisis there, every text a template)', () => {
    const holdings = holdingsOf(cast);
    expect(holdings.length, 'anti-vacuity').toBeGreaterThan(60);
    expect(holdings.filter((h) => !TEMPLATES.some((t) => t.re.test(h.text))).map((h) => h.text)).toEqual([]);
  });

  it('(a) no two holdings share a wording, except where the receipts mark a repeat that stands', () => {
    const holdings = holdingsOf(cast);
    const unmarked = repeatsOf(holdings).filter((h) => !SHARED_RUNGS.includes(h.receipt.repeat?.[h.v]));
    expect(unmarked.map((h) => `${h.id}.${h.v}: ${h.wording}`)).toEqual([]);
    expect(sharingViolations(holdings, cast, town.relationships)).toEqual([]);
    // the rule did work on this town: the deal repeated, and the later holder rotated (red on the base, which rotates nothing)
    const rotated = holdings.filter((h) => h.receipt[h.v]?.rotated);
    expect(rotated.length, 'the planted city rotates').toBeGreaterThan(0);
    // a mark is never false: a holding marked as sharing does share its wording with an earlier holding
    const repeated = new Set(repeatsOf(holdings).map((h) => `${h.id}.${h.v}`));
    for (const h of holdings) if (SHARED_RUNGS.includes(h.receipt.repeat?.[h.v])) expect(repeated.has(`${h.id}.${h.v}`), `${h.id}.${h.v} marked but unique`).toBe(true);
  });

  it('(a) a rotation keeps the intent: family and kind stay, and the taken index differs from the drawn one', () => {
    const holdings = holdingsOf(cast).filter((h) => h.receipt[h.v]?.rotated);
    expect(holdings.length, 'anti-vacuity').toBeGreaterThan(0);
    const byId = new Map(cast.map((c) => [String(c.id), c]));
    for (const h of holdings) {
      const r = h.receipt[h.v];
      expect(r.rotated.to, `${h.id}.${h.v}`).not.toBe(r.rotated.from);
      const intent = byId.get(h.id).goal.intent[h.v];
      expect([intent.family, intent.kind], `${h.id}.${h.v}`).toEqual([r.family, r.kind]);
    }
  });

  it('(b) every holding whose receipt carries no rotation keeps the wording pass one dealt it; a rotated one moved', () => {
    const holdings = holdingsOf(cast);
    let kept = 0; let moved = 0;
    for (const h of holdings) {
      const r = h.receipt[h.v];
      expect(typeof r.drawn, `${h.id}.${h.v}: the drawn wording is on the receipt`).toBe('string');
      if (r.rotated) { expect(h.wording, `${h.id}.${h.v}`).not.toBe(r.drawn); moved += 1; } else { expect(h.wording, `${h.id}.${h.v}`).toBe(r.drawn); kept += 1; }
    }
    expect(kept, 'anti-vacuity').toBeGreaterThan(40);
    expect(moved, 'anti-vacuity').toBeGreaterThan(0);
  });
});

describe('GR1 for goals: an exhausted kind shares, then repeats, and every repeat is counted', () => {
  it('(c) twelve allies, five ally wordings: free wordings first, then twice where apart, then the repeat stands, counted', () => {
    const covert = [{ from: 's6', to: 's7', type: 'ally', covert: true }, { from: 's8', to: 's9', type: 'ally', covert: true }];
    // seed searched once (gr1-exhausted-0 … -299) for a pass one that leaves two wordings free, then shares and stands
    const { cast, ties, dealt } = plantedCast(12, (k) => k < 6, covert, 'gr1-exhausted-34');
    const cellSize = goalFamilies.GOAL_FAMILY_LINES.TIES.ally.short.length;
    for (const c of dealt) expect([c.goal.intent.short.family, c.goal.intent.short.kind]).toEqual(['TIES', 'ally']);
    const short = holdingsOf(cast).filter((h) => h.v === 'short');
    expect(short.length, 'anti-vacuity: twelve dealt').toBe(12);
    expect(cellSize * 2, 'the kind holds fewer than two wordings per holder').toBeLessThan(short.length);
    // the wordings pass one left free are taken first, by the first repeats in roster order; then every wording is held
    const free = cellSize - new Set(short.map((h) => h.receipt.short.drawn)).size;
    expect(free, 'two wordings free of count after pass one').toBe(2);
    const repeated = short.filter((h) => h.receipt.repeat?.short);
    expect(repeated.slice(0, free).map((h) => h.receipt.repeat.short), 'the free wordings go first').toEqual(['free', 'free']);
    expect(repeated.slice(free).some((h) => h.receipt.repeat.short === 'free'), 'and only first').toBe(false);
    expect(new Set(short.map((h) => h.wording)).size, 'every wording of the kind is held').toBe(cellSize);
    // no wording by three without a standing repeat; a wording two share is never two of one house nor two tied
    expect(sharingViolations(short, cast, ties)).toEqual([]);
    const rungs = short.map((h) => h.receipt.repeat?.short).filter(Boolean);
    expect(rungs.includes('twice'), 'anti-vacuity: a wording held twice').toBe(true);
    expect(rungs.includes('stands'), 'anti-vacuity: a repeat that stands').toBe(true);
    // every repeat is counted, and a holding that repeats nothing carries no mark
    expect(repeatsOf(short).map((h) => h.id).sort()).toEqual(short.filter((h) => SHARED_RUNGS.includes(h.receipt.repeat?.short)).map((h) => h.id).sort());
    // a repeat stands only where no wording was free and every wording held once was held by its house-mate or its tie
    // (the holders at its turn: every holding that repeated nothing, and every repeat placed before it)
    for (const h of short.filter((x) => x.receipt.repeat?.short === 'stands')) {
      const me = cast.find((c) => c.id === h.id);
      const before = short.slice(0, short.indexOf(h)).concat(short.filter((x) => !x.receipt.repeat?.short));
      for (const w of new Set(short.map((x) => x.wording))) {
        const others = [...new Set(before.filter((x) => x.wording === w))].map((x) => cast.find((c) => c.id === x.id));
        const near = others.length === 1 && ((others[0].institution?.key && others[0].institution.key === me.institution?.key) || ties.some((t) => (t.from === me.id && t.to === others[0].id) || (t.to === me.id && t.from === others[0].id)));
        expect(others.length >= 2 || near, `${h.id} stands though ${w} was open to it`).toBe(true);
      }
    }
    // the floor (every family held for the long) is never rotated: its repeats are counted
    const long = holdingsOf(cast).filter((h) => h.v === 'long');
    expect(long.every((h) => h.receipt.floor === true && !h.receipt.long.rotated)).toBe(true);
    expect(long.filter((h) => SHARED_RUNGS.includes(h.receipt.repeat?.long)).length).toBe(repeatsOf(long).length);
    expect(repeatsOf(long).length, 'anti-vacuity: the floors repeat').toBeGreaterThan(0);
  });

  it('(d) a pair of one house: the later of the two passes over its house-mate\'s wording for another holder\'s', () => {
    // seed searched once (gr1-pair-0 … gr1-pair-299) for the case: s1 drew s0's wording, every wording is held, and s1 shares
    const { cast, ties, dealt } = plantedCast(8, (k) => k < 2, [], 'gr1-pair-16');
    const short = holdingsOf(cast).filter((h) => h.v === 'short');
    const [s0, s1] = ['s0', 's1'].map((id) => /** @type {any} */ (short.find((h) => h.id === id)));
    expect(dealt.slice(0, 2).every((c) => c.institution?.key === HOUSE.key), 'the pair is of one house').toBe(true);
    expect(s1.receipt.short.drawn, 'the later of the pair drew its house-mate\'s wording').toBe(s0.wording);
    expect(s1.receipt.repeat?.short, 'no wording was free: it shares, apart').toBe('twice');
    expect(s1.receipt.short.rotated, 'it moved').toBeTruthy();
    expect(s1.wording).not.toBe(s0.wording);
    // its new wording is held by exactly one other, of no house of its own and not tied to it
    const partner = short.filter((h) => h.wording === s1.wording && h.id !== 's1');
    expect(partner.length).toBe(1);
    expect(cast.find((c) => c.id === partner[0].id).institution?.key).not.toBe(HOUSE.key);
    expect(sharingViolations(short, cast, ties)).toEqual([]);
  });
});

describe('GR1 for goals: a reserve line is taken, never drawn', () => {
  afterEach(() => { vi.doUnmock('../../../src/data/people/goalFamilies.js'); vi.resetModules(); });
  it('(e) a reserve line planted through the data module: no draw lands on it, and a repeat takes it when it is free', async () => {
    vi.resetModules();
    vi.doMock('../../../src/data/people/goalFamilies.js', async (importOriginal) => {
      const real = /** @type {any} */ (await importOriginal());
      return { ...real, GOAL_RESERVE_LINES: Object.freeze({ TIES: { ally: { short: ['Plant reserve {other} zq.'] } } }) };
    });
    const fresh = await import('../../../src/generators/people/goals.js');
    const kept = Array.from({ length: 7 }, (_, k) => ({ id: `k${k}`, name: `Keeper${k} Alder`, goal: null }));
    const allies = Array.from({ length: 7 }, (_, k) => ({ id: `s${k}`, name: `Spoke${k} Rowan`, goal: null }));
    const ties = allies.map((c, k) => ({ from: c.id, to: kept[k].id, type: 'ally' }));
    const settlement = { name: 'Testholm', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } };
    const cast = fresh.dealGoals(settlement, [...kept, ...allies], ties, createPRNG('gr1-reserve'), { keep: new Set(kept.map((c) => c.id)) });
    const receipts = fresh.goalReceiptsOf(cast);
    const cellSize = goalFamilies.GOAL_FAMILY_LINES.TIES.ally.short.length;
    // anchored: the planted line is this test's own invented fixture text, not a pool's sentence
    expect(receipts.some((r) => /zq\.$/.test(r.short.drawn)), 'the reserve line is never drawn').toBe(false);
    const takers = receipts.filter((r) => r.short.rotated?.to === cellSize);
    expect(takers.length, 'one repeat took the reserve line').toBe(1);
    expect(takers[0].repeat?.short).toBe('free');
    // anchored: the same invented fixture text, filled with the taker's own kept card
    expect(cast.find((c) => c.id === takers[0].id).goal.short).toMatch(/^Plant reserve Keeper\d Alder zq\.$/);
  });
});

/**
 * (f) THE COUNT ON THE BASE, read once by this file's own counter (`repeatsOf(holdingsOf(...)).length` over the deal of (a))
 * run against an archive copy of 84a8606b9, where the reserve is empty: gr1-city-1 held 5 repeated wordings there and
 * gr1-metropolis-0 held 29 (the metropolis seed searched once, gr1-metropolis-0 … -2: the first whose repeats fall).
 */
const REPEATS_AT_84A8606B9 = Object.freeze({ 'gr1-city-1': 5, 'gr1-metropolis-0': 29 });

describe('GR1 for goals: the real reserve lowers the repeats (f)', () => {
  /** @type {Map<string, { town: any, cast: any[] }>} */ const towns = new Map();
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (const seed of Object.keys(REPEATS_AT_84A8606B9)) {
      const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: seed.split('-')[1] }), null, { seed, customContent: {} });
      const cards = town.npcs.filter((/** @type {any} */ c) => !c.temporary).map((/** @type {any} */ c) => ({ ...c, goal: null }));
      towns.set(seed, { town, cast: dealGoals(town, cards, town.relationships, createPRNG(`gr1::${seed}`)) });
    }
  }, 240_000);

  for (const seed of Object.keys(REPEATS_AT_84A8606B9)) {
    it(`(f) ${seed}: the template repeats fall below the base's count, and (a)'s law holds`, () => {
      const { town, cast } = /** @type {{ town: any, cast: any[] }} */ (towns.get(seed));
      const holdings = holdingsOf(cast);
      expect(holdings.length, 'anti-vacuity').toBeGreaterThan(60);
      expect(repeatsOf(holdings).length, `${seed}: repeats with the reserve`).toBeLessThan(/** @type {any} */ (REPEATS_AT_84A8606B9)[seed]);
      const unmarked = repeatsOf(holdings).filter((h) => !SHARED_RUNGS.includes(h.receipt.repeat?.[h.v]));
      expect(unmarked.map((h) => `${h.id}.${h.v}: ${h.wording}`)).toEqual([]);
      expect(sharingViolations(holdings, cast, town.relationships)).toEqual([]);
      // the reserve did work here: some repeat took a reserve line (its taken index lies past its cell's own lines)
      const cellOf = (/** @type {any} */ r, /** @type {string} */ v) => (/** @type {any} */ (goalFamilies.GOAL_FAMILY_LINES)[r.family]?.[r.kind]?.[v] || []).length;
      expect(holdings.some((h) => h.receipt[h.v]?.rotated && h.receipt[h.v].rotated.to >= cellOf(h.receipt[h.v], h.v)), 'a reserve line is taken').toBe(true);
    });
  }
});

describe('GR1 for goals: a gentle line is never held on a harsh tie (g)', () => {
  const NOT_ON_TIES = /** @type {Record<string, Record<string, string[]>>} */ (/** @type {any} */ (goalFamilies).GOAL_LINE_NOT_ON_TIES || {});
  // the wordings refused on an enemy tie at `mortal`, derived from the map (a person slot masked as the rule masks it)
  const GENTLE = Object.entries(NOT_ON_TIES).filter(([, m]) => (m.enemy || []).includes('mortal')).map(([t]) => t.replace(/\{([^}]+)\}/g, '§'));
  const TRAIT = Object.keys(goalFamilies.PERSONALITY_CLUSTER_OF)[0];
  /** 24 kept cards and 24 dealt, each the ENEMY of its own kept card at `strength` (TIES rival_enemy, or its cluster). @param {string} strength */
  const enemies = (strength) => {
    const n = 24;
    const kept = Array.from({ length: n }, (_, k) => ({ id: `k${k}`, name: `Keeper${k} Alder`, goal: null }));
    const foes = Array.from({ length: n }, (_, k) => ({ id: `e${k}`, name: `Foe${k} Rowan`, goal: null, personality: { dominant: TRAIT } }));
    const ties = foes.map((c, k) => ({ from: c.id, to: kept[k].id, type: 'enemy', strength }));
    const settlement = { name: 'Testholm', tier: 'village', institutions: [], config: { magicExists: false, priorityMagic: 0 } };
    // seed searched once (gr1-harsh-0 … -9) for a deal whose rotation on a mild tie reaches a gentle line
    const cast = dealGoals(settlement, [...kept, ...foes], ties, createPRNG('gr1-harsh-1'), { keep: new Set(kept.map((c) => c.id)) });
    return holdingsOf(cast).filter((h) => h.v === 'long');
  };

  it('(g) on a mortal enemy tie the rotation passes over the gentle lines; on a mild one it takes them; no draw moves', () => {
    expect(GENTLE.length, 'the map names the gentle lines').toBe(2);
    const mild = enemies('mild'); const mortal = enemies('mortal');
    expect(mortal.map((h) => `${h.id}:${h.receipt.long.drawn}`), 'the guard moves no draw').toEqual(mild.map((h) => `${h.id}:${h.receipt.long.drawn}`));
    const takers = mild.filter((h) => GENTLE.includes(h.wording));
    expect(takers.length, 'anti-vacuity: on a mild tie a rotation takes a gentle line').toBeGreaterThan(0);
    for (const h of takers) expect(h.receipt.long.rotated, `${h.id}: it came by rotation`).toBeTruthy();
    expect(mortal.filter((h) => GENTLE.includes(h.wording)).map((h) => `${h.id}: ${h.text}`), 'none is held on a mortal tie').toEqual([]);
    for (const t of takers) {
      const h = /** @type {any} */ (mortal.find((x) => x.id === t.id));
      expect(h.receipt.long.drawn, `${t.id}: the same draw`).toBe(t.receipt.long.drawn);
      expect(h.receipt.repeat?.long, `${t.id}: still a repeat, placed elsewhere`).toBeTruthy();
      expect(GENTLE.includes(h.wording), `${t.id}: passed over`).toBe(false);
    }
  });
});

describe('GR1 for goals: a sentence and its mirror are one (h)', () => {
  it("(h) two cards whose drawn template and names are one pair in either order: the later rotates, never 'twice' on it", () => {
    const card = (/** @type {string} */ id, /** @type {string} */ power) => ({ id, name: `${id.toUpperCase()}ra Holt`, goal: null, memberships: [{ power, rank: 1 }] });
    // a and b: the firsts of two powers in competition; ten more, the firsts of two other powers in competition (no RANK
    // cell: a first with no second; no PERSONALITY: no traits), so every short goal is a POWER `competitive` line
    const cards = [card('a', 'Elder Council'), card('b', 'Merchant Guilds'), ...Array.from({ length: 10 }, (_, k) => card(`f${k}`, k % 2 ? 'Temple' : 'Watch'))];
    const powerStructure = { factions: ['Elder Council', 'Merchant Guilds', 'Watch', 'Temple'].map((f) => ({ faction: f, power: 10 })),
      factionRelationships: [{ pair: ['Elder Council', 'Merchant Guilds'], type: 'competitive' }, { pair: ['Watch', 'Temple'], type: 'competitive' }] };
    const settlement = { name: 'Testholm', tier: 'village', institutions: [], powerStructure, config: { magicExists: false, priorityMagic: 0 } };
    // seed searched once (gr1-mirror-0 … -59) for a deal where b draws a's line and, on 84a8606b9, stays on it as 'twice'
    const cast = dealGoals(settlement, cards, [], createPRNG('gr1-mirror-25'));
    const short = holdingsOf(cast).filter((h) => h.v === 'short');
    const [a, b] = ['a', 'b'].map((id) => /** @type {any} */ (short.find((h) => h.id === id)));
    for (const h of [a, b]) expect([h.receipt.short.family, h.receipt.short.kind], h.id).toEqual(['POWER', 'competitive']);
    expect(b.receipt.short.drawn, 'b drew the line a holds').toBe(a.wording);
    expect(namesOf(b), "b fills it with a's names").toBe(namesOf(a));
    expect(b.receipt.short.slots.power, 'in the other order').toBe(a.receipt.short.slots.rival);
    expect(b.receipt.short.rotated, 'b rotates').toBeTruthy();
    expect(b.wording, "b does not hold a's wording").not.toBe(a.wording);
    expect(SHARED_RUNGS.includes(b.receipt.repeat?.short) || b.receipt.repeat?.short === 'free', 'b is a counted repeat').toBe(true);
    expect(sharingViolations(short, cast, [])).toEqual([]);
  });
});
