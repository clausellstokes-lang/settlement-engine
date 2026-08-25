/**
 * domain/worldPulse/clergyTraitPlane.js — the CLERGY per-trait PLANE-PROJECTION
 * leaf (Phase 4 W-F3, the owner's "clergy lens" addendum, 2026-07-10).
 *
 * The religious authority is staffed by NPCs, and WHO ministers is distinct from
 * who governs (the ruler lens in religionLegitimacy.js). This leaf reads the
 * character of those staffing clergy and projects it onto the SAME two 0..1 axes
 * the deity plane uses (evil / chaos), so a flawed or compromised priesthood can
 * later distort the god's influence, drag legitimacy, and open (or bar) the door
 * to rival cults.
 *
 * The owner's binding refinement (commit 61f935fb): the clergy input is NOT an
 * aggregate quality scalar — each temperament and each flaw individually carries
 * a lean on BOTH axes via ONE trait→plane table (the two-axis sibling of npcData's
 * TRAIT_ALIGNMENT). Coarse leans, MANY traits neutral; conflicting traits read as
 * VARIANCE (not averaged into a bland mean); a trait-neutral, unflawed priesthood
 * reads EXACTLY zero on every field — the neutrality theorem extends over the lens.
 *
 * W-F3 SCOPE (this file): author the reviewable table + the per-trait projection
 * reader (influence-weighted by orgPower; variance preserved; compromise noted).
 * piety.js consumes ONE derived field (the bleed-through integrity) this wave; the
 * fuller legitimacy / conversion-defense / targeted-foothold consumption is W-F4's
 * — the reading object is the named, typed seam it will read.
 *
 * PURE: no rng, no wall-clock, no mutation. Imports only the personality readers
 * from the (leaf) corruption module, so it carries no religion-engine dependency.
 */

import { npcCorruptibleFlaw, npcAlignmentScore } from '../corruption.js';
import { evil01, chaos01 } from './deityAxes.js';

/**
 * The trait→plane table: a lowercased AUTHORED personality descriptor (dominant /
 * flaw / modifier) → its signed lean on the two axes. `e` is the malice axis
 * (+1 evil … −1 good), `c` is the disorder axis (+1 chaotic … −1 lawful). Both
 * bounded |x| ≤ 1, intentionally COARSE. A descriptor absent from this map
 * contributes EXACTLY {e:0,c:0} (neutral) — the byte-identity anchor. The malice
 * column mirrors npcData's TRAIT_ALIGNMENT sign-flipped (there +good, here +evil);
 * the disorder column is the new law-axis reading the owner asked for.
 *
 * @type {Readonly<Record<string, { e: number, c: number }>>}
 */
export const TRAIT_PLANE = Object.freeze({
  // ── conscience present (good) — some also order-keeping (lawful) ──────────
  compassionate: { e: -0.85, c: 0 },
  merciful:      { e: -0.85, c: 0 },
  generous:      { e: -0.6, c: 0 },
  magnanimous:   { e: -0.65, c: 0 },
  'warm-hearted':{ e: -0.55, c: 0 },
  principled:    { e: -0.6, c: -0.5 },
  incorruptible: { e: -0.9, c: -0.4 },
  'fair-minded': { e: -0.55, c: -0.4 },
  honest:        { e: -0.6, c: -0.3 },
  forthright:    { e: -0.45, c: -0.2 },
  loyal:         { e: -0.3, c: -0.45 },
  dutiful:       { e: -0.15, c: -0.7 },
  disciplined:   { e: 0, c: -0.7 },
  methodical:    { e: 0, c: -0.6 },
  orderly:       { e: 0, c: -0.65 },
  traditional:   { e: 0, c: -0.5 },
  humble:        { e: -0.35, c: 0 },
  protective:    { e: -0.35, c: -0.2 },
  pious:         { e: -0.4, c: -0.3 },
  patient:       { e: -0.2, c: -0.2 },
  // ── conscience absent (evil) — method varies by trait ─────────────────────
  cruel:         { e: 0.85, c: 0 },
  'cold-blooded':{ e: 0.85, c: -0.2 },   // methodical cruelty leans lawful-evil
  ruthless:      { e: 0.8, c: 0 },
  callous:       { e: 0.6, c: 0 },
  wrathful:      { e: 0.5, c: 0.3 },
  vengeful:      { e: 0.55, c: 0.2 },
  vindictive:    { e: 0.6, c: 0.2 },
  deceitful:     { e: 0.6, c: 0.5 },     // liars break the letter — chaotic method
  manipulative:  { e: 0.6, c: 0.3 },
  mendacious:    { e: 0.55, c: 0.45 },
  corrupt:       { e: 0.8, c: 0.4 },
  greedy:        { e: 0.55, c: 0.2 },
  'self-serving':{ e: 0.5, c: 0.25 },
  hypocritical:  { e: 0.45, c: 0.35 },
  // ── disorder axis, morally quieter (temperament of METHOD) ────────────────
  reckless:      { e: 0.1, c: 0.6 },
  impulsive:     { e: 0, c: 0.55 },
  rebellious:    { e: 0.1, c: 0.7 },
  erratic:       { e: 0, c: 0.6 },
  capricious:    { e: 0.15, c: 0.6 },
  opportunistic: { e: 0.3, c: 0.4 },
  ambitious:     { e: 0.2, c: 0.15 },
  calculating:   { e: 0.25, c: -0.3 },   // scheming but ordered — lawful method
  rigid:         { e: 0, c: -0.45 },
  paranoid:      { e: 0.15, c: 0.2 },
});

const clamp = (/** @type {number} */ x, /** @type {number} */ lo, /** @type {number} */ hi) => (x < lo ? lo : x > hi ? hi : x);
const clamp01 = (/** @type {number} */ x) => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Lowercased AUTHORED personality descriptors of an NPC ({dominant,flaw,modifier},
 *  tolerant of string/array shapes). Mirrors corruption.authoredAlignmentTraits so
 *  the two lenses read the SAME strings. NEVER reads rng-rolled state. Pure.
 * @param {import('../settlement.schema.js').SimNpc} npc @returns {string[]} */
function authoredTraits(npc) {
  const p = npc?.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  return [p.dominant, p.flaw, p.modifier].filter((x) => typeof x === 'string');
}

/**
 * Project ONE NPC's authored personality onto the plane. Returns the SIGNED sum of
 * its trait leans on each axis (bounded), plus `spread` — the total lean MAGNITUDE
 * the traits carry, so a conflicted NPC (e.g. "compassionate" + "corrupt") reports
 * a large spread even though the signed sums partly cancel (conflict = variance,
 * not a bland zero). A trait-neutral NPC reads {e:0,c:0,spread:0}. Pure.
 * @param {import('../settlement.schema.js').SimNpc} npc @returns {{ e: number, c: number, spread: number }}
 */
export function npcTraitPlane(npc) {
  let e = 0; let c = 0; let spread = 0;
  for (const t of authoredTraits(npc)) {
    const lean = TRAIT_PLANE[String(t).trim().toLowerCase()];
    if (!lean) continue;
    e += lean.e; c += lean.c;
    spread += Math.abs(lean.e) + Math.abs(lean.c);
  }
  return { e: clamp(e, -1, 1), c: clamp(c, -1, 1), spread };
}

// Importance → org-power weight (mirrors religionLegitimacy.orgPower / entities
// importanceWeight; kept local so this stays a true leaf). A minor acolyte carries
// no institutional clout; a pillar high priest carries it all.
const ORG_POWER = /** @type {Record<string, number>} */ ({ minor: 0.0, notable: 0.4, key: 0.7, pillar: 1.0 });
/** @param {import('../settlement.schema.js').SimNpc} npc @returns {number} */
function orgPower(npc) {
  return ORG_POWER[String(npc?.importance || 'minor')] ?? 0;
}

/** @typedef {Object} ClergyPlaneReading
 * @property {number} e         −1..+1 influence-weighted MALICE lean of the clergy (0 = none)
 * @property {number} c         −1..+1 influence-weighted DISORDER lean of the clergy (0 = none)
 * @property {number} taint     0..1 influence-weighted corruptible-flaw presence in the clergy
 * @property {number} variance  0..1 disagreement among clergy (conflicting readings, not averaged away)
 * @property {number} revealedTaint  0..1 the taint that is already publicly REVEALED (compromise complicates)
 * @property {number} weight    total org-power mass of the clergy read (0 ⇒ no clergy ⇒ every field 0)
 */

/**
 * Read the clergy plane of a settlement: find the RELIGIOUS-archetype faction(s),
 * take their linked NPCs (the staffing priesthood), and project each onto the
 * plane influence-weighted by org-power. Preserves VARIANCE — clergy who read
 * opposite ways raise `variance` rather than cancelling to a bland mean — and
 * notes the REVEALED share of the taint (a public scandal reads sharper than a
 * covert one). A settlement with no religious faction / no clergy, or an entirely
 * trait-neutral unflawed priesthood, reads EXACTLY zero on every field. Pure.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {ClergyPlaneReading}
 */
export function readClergyPlane(settlement) {
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const clergyFactionIds = new Set(
    factions.filter((f) => String(f?.archetype || '') === 'religious' && f?.id != null)
      .map((f) => String(f.id)),
  );
  const empty = { e: 0, c: 0, taint: 0, variance: 0, revealedTaint: 0, weight: 0 };
  if (!clergyFactionIds.size) return empty;

  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  let weight = 0;
  let sumE = 0; let sumC = 0; let sumTaint = 0; let sumRevealed = 0; let sumSpread = 0;
  // Weighted first + second moment of the malice reading to recover disagreement.
  let sumE2 = 0;
  for (const npc of npcs) {
    const linked = Array.isArray(npc?.linkedFactionIds) ? npc.linkedFactionIds.map(String) : [];
    if (!linked.some((/** @type {string} */ id) => clergyFactionIds.has(id))) continue;
    const w = orgPower(npc);
    if (w <= 0) continue;
    const plane = npcTraitPlane(npc);
    // Malice reading of the whole NPC: the trait projection sharpened toward the
    // authored alignment score (the same signal the corruption lens reads).
    const malice = clamp(0.5 * plane.e + 0.5 * (-npcAlignmentScore(npc)), -1, 1);
    const flaw = npcCorruptibleFlaw(npc) ? 1 : 0;
    weight += w;
    sumE += w * malice; sumE2 += w * malice * malice;
    sumC += w * plane.c;
    sumTaint += w * flaw;
    // A flaw the settlement already has ON RECORD (corruption impairment revealed)
    // reads as revealed taint — W-F4 sharpens legitimacy drag when covert→revealed.
    sumRevealed += w * flaw * (npc?.corruptionImpaired || npc?.corruptTies?.revealed ? 1 : 0);
    sumSpread += w * plane.spread;
  }
  if (weight <= 0) return empty;
  const e = sumE / weight;
  const c = sumC / weight;
  const taint = clamp01(sumTaint / weight);
  // Variance = between-clergy disagreement on malice (weighted var) blended with the
  // per-NPC trait conflict (spread beyond the net lean). Both vanish for a uniform,
  // unconflicted priesthood ⇒ variance 0.
  const betweenVar = clamp01(sumE2 / weight - e * e);
  const withinConflict = clamp01(sumSpread / weight - (Math.abs(e) + Math.abs(c)));
  const variance = clamp01(Math.max(betweenVar, 0.5 * withinConflict));
  return { e, c, taint, variance, revealedTaint: clamp01(sumRevealed / weight), weight };
}

// ── TARGETED FOOTHOLDS (owner's clergy-lens refinement — W-F4b, item 3) ────────
// The clergy-plane-refined addendum: "misaligned influential clergy → conversion as
// TARGETED FOOTHOLDS — the rival whose plane matches a SPECIFIC NPC's traits recruits
// THAT NPC; usurpation is cast, named, and narratable per the legibility law." This
// reads the SAME per-trait plane, but per-NPC (not aggregated): an influential
// minister whose authored traits lean toward a present RIVAL's plane AND away from the
// PATRON's plane is AVAILABLE to that rival. A trait-neutral / unflawed priesthood
// projects the zero plane ⇒ no availability ⇒ no foothold ⇒ byte-identical.
export const FOOTHOLD_TUNING = Object.freeze({
  MATCH_MIN: 0.55,      // min availability (rivalFit − patronFit, over ±2 each) to cast a foothold
  MIN_ORG_POWER: 0.4,   // only NOTABLE+ clergy carry the institutional clout to matter (notable=0.4)
  CONFLICT_W: 0.5,      // a CONFLICTED minister (high trait spread) is MORE available to a usurper
  MAX_PER_SETTLEMENT: 2,// bound the emission (strongest availabilities first)
});

/** Signed plane coords of a deity snapshot: (malice, disorder) each −1..+1 (0 = neutral). @param {DeitySnapshot} d */
const deityPlaneOf = (/** @type {DeitySnapshot} */ d) => ({ e: 2 * evil01(d) - 1, c: 2 * chaos01(d) - 1 });
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */

/**
 * Find the influential ministering clergy each PRESENT RIVAL deity can recruit as a
 * TARGETED FOOTHOLD: an NPC whose authored trait plane leans toward the rival AND away
 * from the patron. `availability` = (rival plane · npc plane) − (patron plane · npc plane),
 * lifted by the NPC's own trait CONFLICT (spread) — the owner's "conflicted → available".
 * Returns codepoint-stable, strongest-first, at most one foothold per rival and at most
 * MAX_PER_SETTLEMENT overall. Empty for a trait-neutral priesthood / no rivals. Pure.
 *
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @param {DeitySnapshot|null|undefined} patronDeity
 * @param {Array<{ ref: string, snapshot: DeitySnapshot }>} rivals present non-patron deities
 * @returns {Array<{ npcId: string, npcName: string, rivalRef: string, rivalName: string, availability: number }>}
 */
export function targetedFootholds(settlement, patronDeity, rivals) {
  const T = FOOTHOLD_TUNING;
  if (!patronDeity || !Array.isArray(rivals) || !rivals.length) return [];
  const ps = settlement?.powerStructure || {};
  const factions = Array.isArray(ps.factions) ? ps.factions : [];
  const clergyFactionIds = new Set(
    factions.filter((f) => String(f?.archetype || '') === 'religious' && f?.id != null).map((f) => String(f.id)),
  );
  if (!clergyFactionIds.size) return [];
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  const patronPlane = deityPlaneOf(patronDeity);
  const dot = (/** @type {{e:number,c:number}} */ p, /** @type {{e:number,c:number}} */ q) => p.e * q.e + p.c * q.c;

  // Collect the influential, trait-bearing ministers ONCE (codepoint-stable order).
  const ministers = [];
  for (const npc of npcs) {
    const linked = Array.isArray(npc?.linkedFactionIds) ? npc.linkedFactionIds.map(String) : [];
    if (!linked.some((/** @type {string} */ id) => clergyFactionIds.has(id))) continue;
    if (orgPower(npc) < T.MIN_ORG_POWER) continue;
    const plane = npcTraitPlane(npc);
    if (plane.spread <= 0) continue;                          // trait-neutral ⇒ never available
    ministers.push({ id: String(npc?.id ?? ''), name: String(npc?.name || npc?.id || 'a minister'), plane });
  }
  if (!ministers.length) return [];
  ministers.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  /** @type {Array<{ npcId: string, npcName: string, rivalRef: string, rivalName: string, availability: number }>} */
  const matches = [];
  for (const rival of [...rivals].sort((a, b) => (a.ref < b.ref ? -1 : a.ref > b.ref ? 1 : 0))) {
    const rivalPlane = deityPlaneOf(rival.snapshot);
    let best = null;
    for (const m of ministers) {
      const availability = (dot(rivalPlane, m.plane) - dot(patronPlane, m.plane)) + T.CONFLICT_W * clamp(m.plane.spread - (Math.abs(m.plane.e) + Math.abs(m.plane.c)), 0, 2);
      if (availability < T.MATCH_MIN) continue;
      if (!best || availability > best.availability || (availability === best.availability && m.id < best.npcId)) {
        best = { npcId: m.id, npcName: m.name, rivalRef: rival.ref, rivalName: String(rival.snapshot?.name || rival.ref), availability };
      }
    }
    if (best) matches.push(best);
  }
  matches.sort((a, b) => b.availability - a.availability || (a.rivalRef < b.rivalRef ? -1 : a.rivalRef > b.rivalRef ? 1 : 0));
  return matches.slice(0, T.MAX_PER_SETTLEMENT);
}
