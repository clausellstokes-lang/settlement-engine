/**
 * people/patronage.js — RULING PATRONAGE: the weight the ruling power's ranked three lend the other
 * powers they also belong to, DERIVED by ONE function and stored nowhere (the allegiance train, car 3,
 * ALLEGIANCE-CAR3, 2026-11-08; the design docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md §3.3, §2 A8,
 * §4 I-6 / I-7, §8, §9; the chair's rulings J-9 and J-12 in docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md).
 *
 * THE OWNER (2026-11-08, verbatim): "Say that an NPC becomes lord of a town but has dual allegiances
 * attributed to their institution, well scaling with their rank within that power that is ruling of
 * the top three NPCs those other allegiances (powers) of those NPCs also get an appropriate moderate
 * boost." The governing principle: "plausibility with confidence, not predictability" — the boost's
 * WHY is a receipt per patron (the DM view's evidence sentence).
 *
 *   boost(P)     = Σ over the ruling power's ranked three f, over f's memberships m in P ≠ ruler:
 *                    byRank[f's rank in the ruler] × m.share × base(P)
 *                  + the same over f's HIDDEN allegiance in P (allegiance.share; DM-only, §8)
 *                  (a steward in a vacant seat — the governing row carries the `vacant` modifier — at `steward`)
 *   effective(P) = base(P) + min( boost(P), cap·base(P), max(0, base(ruler) − ceilingGap − base(P)) )
 *
 * J-9: DERIVED, NEVER WRITTEN. `powerStructure.factions[].power` stays the generator's base (the
 * integer points summing to 100); this module reads it and writes nothing (I-7) — a receipt stored on
 * a `powerStructure` row would reach the public page, because both public projections keep
 * `powerStructure` whole (car 1's veil pin). Computed from the RANKS, never from boosted strengths. A
 * power above the ruler at base gains nothing (patronage never widens a lead over the ruler).
 *
 * EVERY reader of this function is DM-facing (the Power tab's DM panel, the PDF's DM chapter); the
 * public page reads the base strengths only. Pure, draw-free, total over any input.
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { membershipsOf } from './membership.js';
import { hiddenMembershipOf } from './allegiance.js';

/** @typedef {Record<string, unknown>} Rec */
/** @typedef {1 | 2 | 3 | 'steward'} PatronRank */
/**
 * One patron's part in a power's boost: a face of the ruling three (or the steward of its empty seat)
 * that also belongs to the power, openly or through its hidden allegiance.
 * @typedef {{ id: string, name: string, rank: PatronRank, kind: 'open' | 'hidden',
 *   share: number, raw: number, boost: number }} Patron
 */
/**
 * One power's patronage: its base (the stored figure), the boost it receives after the cap and the
 * ruler's ceiling, its effective strength, what bounded it, and its patrons.
 * @typedef {{ power: string, base: number, raw: number, boost: number, effective: number,
 *   bound: 'cap' | 'ceiling' | 'above-ruler' | null, hidden: boolean, patrons: Patron[] }} PowerPatronage
 */
/** @typedef {{ ruler: string | null, rulerBase: number, powers: PowerPatronage[] }} Patronage */

/**
 * THE DIALS of ruling patronage (§3.3; J-12 names it, `PATRONAGE_TUNING` being corruption.js's bought
 * watch). A DRAFT row in tests/lint/.tuning-register.json until the owner signs the estate. Units:
 * byRank.1 / .2 / .3 fraction01 (of the other power's own strength) · steward fraction01 · cap
 * fraction01 · ceilingGap points.
 */
export const RULING_PATRONAGE_TUNING = Object.freeze({
  /** a ranked face's weight, by its rank in the ruling power, of the other power's strength */
  byRank: Object.freeze({ 1: 0.15, 2: 0.10, 3: 0.05 }),
  /** a steward in a vacant seat counts at rank 2's weight */
  steward: 0.10,
  /** per-power cap: never more than a quarter of the power's own strength */
  cap: 0.25,
  /** a boosted power stops this many points under the ruler */
  ceilingGap: 1,
});

/** @param {unknown} v @returns {Rec} */
const rec = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Rec} */ (v) : {});
/** @param {unknown} v @returns {number} */
const finite = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

/**
 * The ruling power's ranked three, in rank order, each with its weight. A face ranked 1 in a ruling
 * power whose row carries the `vacant` modifier (the seat stands empty: powerStrata.js ::
 * rulingChainOf's own vacancy fact) holds it as a STEWARD, at `steward`'s weight.
 * @param {Rec[]} cards @param {string} ruler @param {boolean} vacant
 * @returns {Array<{ card: Rec, rank: PatronRank, weight: number }>}
 */
function rulingThreeOf(cards, ruler, vacant) {
  const T = RULING_PATRONAGE_TUNING;
  return cards
    .map((card, at) => ({ card, at, m: membershipsOf(card).find((x) => x.power === ruler) }))
    .filter((x) => x.m && (x.m.rank === 1 || x.m.rank === 2 || x.m.rank === 3))
    .sort((a, b) => (Number(a.m?.rank) - Number(b.m?.rank)) || (a.at - b.at))
    .map(({ card, m }) => {
      const rank = /** @type {1 | 2 | 3} */ (m?.rank);
      return rank === 1 && vacant
        ? { card, rank: /** @type {PatronRank} */ ('steward'), weight: T.steward }
        : { card, rank: /** @type {PatronRank} */ (rank), weight: T.byRank[rank] };
    });
}

/**
 * THE ONE FUNCTION (J-9): the town's ruling patronage, derived from the ranks and the stored base
 * strengths; NOTHING is written. One entry per power other than the ruler that a face of the ruling
 * three belongs to (openly, or through a hidden allegiance), in roster order — including a power that
 * receives 0 (above the ruler at base, or already at the ceiling), so a reader can say why.
 * @param {unknown} settlement @returns {Patronage}
 */
export function patronageOf(settlement) {
  const T = RULING_PATRONAGE_TUNING;
  const s = rec(settlement);
  const factions = (Array.isArray(rec(s.powerStructure).factions) ? /** @type {unknown[]} */ (rec(s.powerStructure).factions) : []).map(rec);
  const governing = governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s)));
  const ruler = nameOf(governing);
  if (!governing || !ruler) return { ruler: null, rulerBase: 0, powers: [] };
  const rulerBase = finite(rec(governing).power);
  const vacant = Array.isArray(rec(governing).modifiers) && /** @type {unknown[]} */ (rec(governing).modifiers).includes('vacant');
  const cards = (Array.isArray(s.npcs) ? /** @type {unknown[]} */ (s.npcs) : []).map(rec);
  const three = rulingThreeOf(cards, ruler, vacant);

  /** @type {Map<string, Array<Omit<Patron, 'raw' | 'boost'> & { weight: number }>>} */
  const ties = new Map();
  const add = (/** @type {string} */ power, /** @type {Omit<Patron, 'raw' | 'boost'> & { weight: number }} */ row) => {
    if (!power || power === ruler) return;
    if (!ties.has(power)) ties.set(power, []);
    /** @type {Array<Omit<Patron, 'raw' | 'boost'> & { weight: number }>} */ (ties.get(power)).push(row);
  };
  for (const { card, rank, weight } of three) {
    const id = String(card.id ?? '');
    const name = String(card.name ?? '');
    for (const m of membershipsOf(card)) add(m.power, { id, name, rank, kind: 'open', share: finite(m.share), weight });
    const hidden = hiddenMembershipOf(card);
    if (hidden) add(hidden.power, { id, name, rank, kind: 'hidden', share: finite(hidden.share), weight });
  }

  /** @type {PowerPatronage[]} */
  const powers = [];
  for (const f of factions) {
    const power = nameOf(f);
    const rows = ties.get(power);
    if (!rows || power === ruler) continue;
    const base = finite(f.power);
    const parts = rows.map((r) => r.weight * r.share * base);
    const raw = parts.reduce((a, b) => a + b, 0);
    const above = base > rulerBase;
    const ceiling = Math.max(0, rulerBase - T.ceilingGap - base);
    const boost = above ? 0 : Math.max(0, Math.min(raw, T.cap * base, ceiling));
    /** @type {PowerPatronage['bound']} */
    const bound = above ? 'above-ruler' : boost < raw ? (T.cap * base <= ceiling ? 'cap' : 'ceiling') : null;
    // each patron's part of the bounded boost, in proportion to its raw part
    const scale = raw > 0 ? boost / raw : 0;
    powers.push({
      power, base, raw, boost, effective: base + boost, bound,
      hidden: rows.every((r) => r.kind === 'hidden'),
      patrons: rows.map(({ weight: _w, ...r }, i) => ({ ...r, raw: parts[i], boost: parts[i] * scale })),
    });
  }
  return { ruler, rulerBase, powers };
}

/**
 * A power's EFFECTIVE strength for a DM-facing reader: its base plus its ruling patronage (the ruler
 * and a power no face of the ruling three belongs to read their base). DM-facing only (J-9; §8).
 * @param {unknown} settlement @param {string} power @param {Patronage} [patronage] a precomputed `patronageOf`
 * @returns {number}
 */
export function effectiveStrengthOf(settlement, power, patronage) {
  const p = patronage || patronageOf(settlement);
  const row = p.powers.find((x) => x.power === power);
  if (row) return row.effective;
  const factions = rec(rec(settlement).powerStructure).factions;
  const f = (Array.isArray(factions) ? factions : []).map(rec).find((x) => nameOf(x) === power);
  return f ? finite(f.power) : 0;
}
