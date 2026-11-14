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
import { allegianceOf, criminalPowersOf, hiddenMembershipOf, isCriminalPower } from './allegiance.js';
import { CAPTURE_LINES, CAPTURE_RUNG_LABELS, PATRONAGE_LINES } from '../../data/people/dmPowerLines.js';
import { keeperFormOf } from './seatKeeper.js';
import { styledTitleOf } from '../../data/faceHonorifics.js';

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

// ── THE DM VIEW: "who really runs this town" (design §9; DM layer only) ─────────────────────────────

/**
 * The handler tie's kind in plain words, by the tie's archetype key (car 1's four kinds, the fear kind's
 * four sub-kinds; relationshipArchetypes.js). Every phrase is listed FOR THE OWNER'S VETO in the car's record.
 */
export const HANDLER_TIE_WORDS = Object.freeze({
  handler_partnership: 'a silent partnership',
  handler_patron: 'a patron no one names',
  handler_cause: 'sworn to the cause',
  handler_leverage_debt: 'held over them: a debt',
  handler_leverage_secret: 'held over them: a secret',
  handler_leverage_crime: 'held over them: a past crime',
  handler_leverage_loved: 'held over them: someone they love',
});

/** What an agent brings the guild, by `via` (allegiance.js :: leaveAllegianceReceipts's words). */
export const VIA_WORDS = Object.freeze({
  office: 'protection and decisions',
  front: 'a place for the money and the goods',
  retainer: 'information and small favours',
});

/** @param {Rec} card @returns {{ id: string, name: string, title: string, house: string }} */
const faceOf = (card) => ({
  id: String(card.id ?? ''),
  name: String(card.name ?? ''),
  title: String(styledTitleOf(card.title ?? card.role ?? '', card.gender)), // COHERENCE-POWERS-8 (R2's one home): a woman lord is "the lady" here too
  house: String(rec(card.institution).key ?? ''),
});

/**
 * The hall's rung and its one plain line, read from the stored `criminalCaptureState` and the ruling
 * three's agents. COMPOSED AT MERGE-TRAIN's car-3 point (2026-11-09): the stored state is now written by car 2's
 * ONE writer (`hallCapture.js :: writeHallCapture`, J-13) from the same agents, so this block reads the derived
 * state, never the retired classifier; `source` names that writer.
 * @param {Rec} s @param {string} ruler @param {Array<{ card: Rec, rank: PatronRank }>} three
 */
function hallOf(s, ruler, three) {
  const stored = String(rec(s.powerStructure).criminalCaptureState || 'none');
  const rung = /** @type {keyof typeof CAPTURE_LINES} */ (Object.hasOwn(CAPTURE_LINES, stored) ? stored : 'none');
  const governing = governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s)));
  const underworld = criminalPowersOf(s).map((p) => nameOf(p)).find((n) => n && n !== ruler) || null;
  const agents = three
    .map(({ card, rank }) => ({ card, rank: rank === 'steward' ? 1 : rank, a: allegianceOf(card) }))
    .filter((x) => x.a)
    .map((x) => ({ name: String(x.card.name ?? ''), rank: /** @type {1 | 2 | 3} */ (x.rank), guild: String(x.a?.power || x.a?.house || '') }));
  const facts = { ruler, agents, rulerCriminal: isCriminalPower(governing), underworld };
  // variant 0 is the receipt in rank words (§9's example); every 'capture' variant but the last names an
  // agent, so a capture the stored classifier reads with no agent in the three takes the last
  const variant = rung === 'capture' && !agents.length ? 2 : 0;
  return { rung, label: CAPTURE_RUNG_LABELS[rung], line: CAPTURE_LINES[rung][variant](facts), source: 'hallCapture.js :: writeHallCapture' };
}

/**
 * THE DM VIEW's rows (design §9), for the Power tab's DM panel and the PDF's DM chapter — DM-ONLY: it
 * names hidden allegiances, handlers, covert ties and a hidden power's boost. Never call it for a player
 * surface, a public page or the Foundry journal (the W7 receipt ruling). Pure; writes nothing.
 * @param {unknown} settlement
 */
export function dmPowerViewOf(settlement) {
  const s = rec(settlement);
  const patronage = patronageOf(s);
  const ruler = patronage.ruler;
  if (!ruler) return null;
  const governing = rec(governingFactionOf(/** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (s))));
  const vacant = Array.isArray(governing.modifiers) && /** @type {unknown[]} */ (governing.modifiers).includes('vacant');
  const cards = (Array.isArray(s.npcs) ? /** @type {unknown[]} */ (s.npcs) : []).map(rec);
  const byId = new Map(cards.map((c) => [String(c.id ?? ''), c]));
  const three = rulingThreeOf(cards, ruler, vacant);
  const ties = (Array.isArray(s.relationships) ? /** @type {unknown[]} */ (s.relationships) : []).map(rec).filter((t) => t.handler === true);
  const tieWords = (/** @type {string} */ from, /** @type {string} */ to) => {
    const t = ties.find((x) => String(x.from) === from && String(x.to) === to);
    const key = String(t?.archetypeKey || '');
    return Object.hasOwn(HANDLER_TIE_WORDS, key) ? HANDLER_TIE_WORDS[/** @type {keyof typeof HANDLER_TIE_WORDS} */ (key)] : null;
  };

  /** the evidence sentence for one patron of one power @param {Patron} pt @param {string} power @param {number} variant */
  const patronLine = (pt, power, variant) => PATRONAGE_LINES[pt.kind][variant]({ name: pt.name, rank: pt.rank, ruler, power, share: pt.share, boost: pt.boost });

  const rulingThree = three.map(({ card, rank }) => {
    const a = allegianceOf(card);
    const handler = a?.handler ? byId.get(a.handler) : null;
    const id = String(card.id ?? '');
    const lends = patronage.powers.flatMap((p) => p.patrons.filter((pt) => pt.id === id && pt.boost > 0)
      // the rank-2 face takes the third line, every other place the second (variant 0 is the boosts block's)
      .map((pt) => ({ powerName: p.power, kind: pt.kind, share: pt.share, boost: pt.boost, line: patronLine(pt, p.power, rank === 2 ? 2 : 1) })));
    return {
      rank, ...faceOf(card),
      // COHERENCE-POWERS-5 (N7): the keeper of an empty seat is labelled in the seat row's caretaker form (seatKeeper.js)
      ...(rank === 'steward' && keeperFormOf(s) ? { place: keeperFormOf(s) } : {}),
      openPowers: membershipsOf(card).filter((m) => m.power !== ruler).map((m) => ({ powerName: m.power, rank: m.rank })),
      answersTo: a ? { guild: a.power || a.house, handler: handler ? String(handler.name ?? '') : null } : null,
      lends,
    };
  });

  // who answers to whom: per criminal power (or the houses, where the allegiance names none) the boss,
  // then each handler with its agents
  const agents = cards.map((card) => ({ card, a: allegianceOf(card) })).filter((x) => x.a);
  /** @type {Map<string, { guild: string, kind: 'power' | 'house', boss: ReturnType<typeof faceOf> | null, handlers: Map<string, Rec & { agents: Rec[] }> }>} */
  const groups = new Map();
  for (const { card, a } of agents) {
    if (!a) continue;
    const guild = a.power || a.house;
    if (!groups.has(guild)) {
      const boss = a.power ? cards.find((c) => membershipsOf(c).some((m) => m.power === a.power && m.rank === 1)) : null;
      groups.set(guild, { guild, kind: a.power ? 'power' : 'house', boss: boss ? faceOf(boss) : null, handlers: new Map() });
    }
    const g = /** @type {{ handlers: Map<string, Rec & { agents: Rec[] }> }} */ (groups.get(guild));
    const hid = a.handler || '';
    const h = byId.get(hid);
    if (!g.handlers.has(hid)) g.handlers.set(hid, { ...(h ? faceOf(h) : { id: hid, name: '', title: '', house: '' }), agents: [] });
    /** @type {Rec & { agents: Rec[] }} */ (g.handlers.get(hid)).agents.push({ ...faceOf(card), via: a.via, brings: VIA_WORDS[a.via], tie: tieWords(String(card.id ?? ''), hid) });
  }
  const answers = [...groups.values()].map((g) => ({ guild: g.guild, kind: g.kind, boss: g.boss, handlers: [...g.handlers.values()] }));

  const fronts = agents.filter(({ a }) => a?.via === 'front').map(({ card, a }) => {
    const h = a?.handler ? byId.get(a.handler) : null;
    return { ...faceOf(card), guild: a?.power || a?.house || '', handler: h ? String(h.name ?? '') : null };
  });

  const boosts = patronage.powers.filter((p) => p.boost > 0).map((p) => {
    const lead = [...p.patrons].sort((x, y) => y.boost - x.boost)[0];
    return { powerName: p.power, base: p.base, boost: p.boost, effective: p.effective, bound: p.bound, hidden: p.hidden, line: patronLine(lead, p.power, 0) };
  });

  // the DM view names a power `powerName` (a WORD), never `power` (the prose-numerics walker's float token)
  // the panel's title names the settlement by its own tier ("who really runs this thorp"), never a fixed "town"
  const tierNoun = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].includes(String(s.tier)) ? String(s.tier) : 'place';
  return { ruler, tierNoun, rulingThree, answers, fronts, hall: hallOf(s, ruler, three), boosts, hunts: null };
}
