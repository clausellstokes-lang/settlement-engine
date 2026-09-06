/**
 * domain/worldPulse/npcResidency.js — W-H3: UNAFFILIATES, RESIDENCY, AND THE DRIFT A
 * DECADE PUTS INTO A PERSON.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6c, owner amendment 2026-07-31; laws 4 FINITE
 * SEMANTICS, 5 DORMANCY, 6 CONSERVATION.)
 *
 * ROAMERS REST SOMEWHERE. A person in the pool is not an abstraction floating over the
 * map: they are lodging in a town, for a banded while, and that town's dossier lists
 * them under UNAFFILIATES. There is ONE truth and TWO views (the Wanderers register is
 * world-scoped, the unaffiliates section is settlement-scoped), which is why the local
 * view is a filter on npcLedgerProjection rather than a second read model.
 *
 * ── PREFERENCE IS WEIGHTED AND NEVER BOUNDED, WHICH IS THE INTERESTING PART ──
 * Design §6c is explicit: residency preference leans toward settlements matching the
 * roamer's own state, "weighted, never bounded". So the worst-matched town in the realm
 * still carries RESIDENCY_PREFERENCE_FLOOR of the best one's weight and a wanderer can
 * always turn up anywhere. A hard filter would produce tidy, dead demographics where
 * every cynic lives in the same three towns; a floored weight produces a lean you can
 * read at scale and a surprise you can meet at a crossroads.
 *
 * ── DRIFT RIDES THE EXISTING GROWTH SYSTEM, AND ONLY ITS EXPORTS ────────────
 * "Experiences reshape them through the EXISTING growth system within facet bands at
 * capped rates." This module therefore mints NOTHING of its own: the trait vocabulary is
 * npcGrowthKernel's ACQUIRED_TRAIT_VOCAB, the signal-to-trait routing is its
 * GROWTH_DEPOSIT_MAP, the distance-from-core resistance is its oppositionOf, and the
 * saturation and hysteresis are its GROWTH_TUNING. What residency adds is a SMALLER
 * loudness and a per-tick TOTAL cap, because lodging somewhere bends a person more
 * slowly than holding office there does.
 *
 * The SIGNALS are an input rather than a read. The growth kernel's settlement-signal
 * readers are private to it, and re-deriving "is this town in a bust" here would fork
 * them; the caller that already computed them for the office-holders passes the same
 * list, so the resident and the magistrate cannot disagree about what year it was.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation, and
 * ZERO rng draws (every choice is a labelled FNV-1a hash).
 *
 * @enforced-by tests/domain/npcResidency.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { clamp01 } from '../../kernel/math.js';
import { GROWTH_DEPOSIT_MAP, GROWTH_TUNING, ACQUIRED_TRAIT_VOCAB, oppositionOf } from './npcGrowthKernel.js';
import { npcConsequencesActive, npcLedgerOf, moveNpcRecord } from './npcLedger.js';
import { ALIGNMENT_READS, closedValue } from './npcLedgerFacets.js';
import { settlementTraitBias } from './npcReplacement.js';
import { advanceWanderer } from './npcCirculationTransit.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/** The seeded-fork labels (design §11's `npcfate:*` namespace). */
export const STAY_FORK_LABEL = 'npcfate:stay';
export const LODGING_FORK_LABEL = 'npcfate:lodging';

/** The composite-key delimiter, named for the same reason H1 and H2 name theirs. */
const KEY_DELIM = '|';

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * FNV-1a 32-bit. The estate's one hash idiom, carried locally so this leaf keeps a
 * narrow import posture (same constants as kernel/proseHash.js and its siblings).
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** A deterministic roll in [0, 1) from a labelled key. ZERO DRAWS.
 *  @param {string} key @returns {number} */
export function residencyRoll01(key) {
  return fnv1a32(text(key)) / 0x100000000;
}

// ── STAY DURATIONS (design §6c: banded, weeks to years) ─────────────────────
/**
 * HOW LONG THIS PERSON STAYS HERE. Banded and seeded per (roamer, settlement, arrival),
 * so the same lodging always lasts the same time and a reload cannot re-roll it shorter.
 * @param {{ wnpcId: string, settlementId: string, sinceTick: number }} args
 * @returns {number} a stay length in ticks, inside RESIDENCY_STAY_TICKS
 */
export function stayDurationTicks({ wnpcId, settlementId, sinceTick }) {
  const band = NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS;
  const span = Math.max(0, band.max - band.min);
  const key = [STAY_FORK_LABEL, text(wnpcId), text(settlementId), String(tickOf(sinceTick))].join(KEY_DELIM);
  const offset = span === 0 ? 0 : Math.min(span, Math.floor(residencyRoll01(key) * (span + 1)));
  return band.min + offset;
}

// ── PREFERENCE (design §6c: weighted, NEVER bounded) ────────────────────────
/**
 * HOW WELL THIS TOWN SUITS THIS PERSON, in [RESIDENCY_PREFERENCE_FLOOR, 1].
 *
 * The match is read on the SAME settlement-state axis the replacement bias uses
 * (settlementTraitBias), so "a settlement matching their personal state" means one
 * definite, single-sourced thing across the whole slice rather than two similar ones.
 * A roamer whose alignment reads unknown matches everywhere equally, which is the
 * honest answer for somebody nobody has formed a read on.
 *
 * THE FLOOR IS THE DESIGN. It is what makes the preference weighted rather than bounded,
 * and it is why this returns a weight instead of a boolean.
 *
 * @param {unknown} settlement
 * @param {unknown} roamer the RoamerRecord
 * @returns {number}
 */
export function residencyPreference01(settlement, roamer) {
  const floor = NPC_CONSEQUENCES_TUNING.RESIDENCY_PREFERENCE_FLOOR;
  const read = closedValue(asObject(asObject(roamer).reputation).alignmentRead, ALIGNMENT_READS);
  if (read === 'unknown') return clamp01((1 + floor) / 2);
  const lean = settlementTraitBias(settlement).alignmentLean;
  if (lean === read) return 1;
  // Neutral is adjacent to both ends: a good soul is less at home in an evil town than
  // in an indifferent one, and the weight says so without ever reaching zero.
  if (lean === 'neutral' || read === 'neutral') return clamp01((1 + floor) / 2);
  return floor;
}

/**
 * CHOOSE A LODGING among candidate settlements, by preference weight, seeded.
 *
 * Candidates are sorted by codepoint before the roulette so the choice is a pure
 * function of the SET rather than of the order it arrived in, which a reload or a regen
 * could permute. Returns null only when there is nowhere at all to go.
 *
 * @param {Object} args
 * @param {string} args.wnpcId
 * @param {unknown} args.roamer
 * @param {ReadonlyArray<{ settlementId: string, settlement: unknown }>} args.candidates
 * @param {number} args.tick
 * @returns {{ settlementId: string, preference: number }|null}
 */
export function pickLodging({ wnpcId, roamer, candidates, tick }) {
  const rows = asArray(candidates)
    .map((raw) => {
      const row = asObject(raw);
      return { settlementId: text(row.settlementId), settlement: row.settlement };
    })
    .filter((row) => row.settlementId)
    .sort((a, b) => compareCodepoint(a.settlementId, b.settlementId))
    .map((row) => ({ ...row, weight: residencyPreference01(row.settlement, roamer) }));
  if (rows.length === 0) return null;

  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  if (!(total > 0)) return { settlementId: rows[0].settlementId, preference: rows[0].weight };
  const roll = residencyRoll01([LODGING_FORK_LABEL, text(wnpcId), String(tickOf(tick))].join(KEY_DELIM)) * total;
  let acc = 0;
  for (const row of rows) {
    acc += row.weight;
    if (roll < acc) return { settlementId: row.settlementId, preference: row.weight };
  }
  const last = rows[rows.length - 1];
  return { settlementId: last.settlementId, preference: last.weight };
}

// ── DRIFT (design §6c: the EXISTING growth system, capped) ──────────────────
/**
 * @typedef {Object} ResidencyDeposit
 * @property {string} signal   the growth kernel's own signal token
 * @property {string} trait    an ACQUIRED_TRAIT_VOCAB member
 * @property {number} mag      the deposit magnitude for this tick
 */

/**
 * WHAT A TICK OF LODGING HERE DOES TO A PERSON.
 *
 * Every emitted row is the growth kernel's own shape and its own vocabulary; the only
 * thing residency contributes is a smaller loudness, the distance-from-core resistance
 * the kernel already defines, a RAMP with the length of the stay, and a hard TOTAL cap.
 *
 * THE THREE BOUNDS, all asserted by the pins:
 *   1. every trait is in ACQUIRED_TRAIT_VOCAB (no residency-only facet is invented);
 *   2. every row's magnitude is at most RESIDENCY_DRIFT_LOUD;
 *   3. the SUM over one tick is at most RESIDENCY_DRIFT_TICK_CAP.
 * Together with the growth kernel's own STOCK_MAX clamp and MAX_ACQUIRED cap, that is
 * what "bounded within facet bands at capped rates" means arithmetically: a decade bends
 * a person, and no length of stay can replace them.
 *
 * @param {Object} args
 * @param {ReadonlyArray<string>} args.signals  the growth kernel's live settlement signals
 * @param {unknown} args.npc                    the person, for the resistance read
 * @param {number} args.stayTicks               how long they have lodged here
 * @returns {ResidencyDeposit[]} codepoint-ordered by trait then signal
 */
export function residencyGrowthDeposits({ signals, npc, stayTicks }) {
  const live = new Set(asArray(signals).map(text).filter(Boolean));
  if (live.size === 0) return [];
  // THE RAMP: a person who arrived last week has barely been marked; one who has lodged
  // here for the whole band carries the full (already small) residency loudness.
  const ramp = clamp01(tickOf(stayTicks) / Math.max(1, NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS.max));

  /** @type {ResidencyDeposit[]} */
  const rows = [];
  for (const entry of GROWTH_DEPOSIT_MAP) {
    if (!live.has(entry.signal)) continue;
    const resistance = 1 + GROWTH_TUNING.RESIST_SCALE * oppositionOf(
      entry.trait,
      /** @type {Parameters<typeof oppositionOf>[1]} */ (asObject(npc)),
    );
    const mag = (NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_LOUD * entry.loud * ramp) / resistance;
    if (!(mag > 0)) continue;
    rows.push({ signal: entry.signal, trait: entry.trait, mag });
  }
  rows.sort((a, b) => compareCodepoint(a.trait, b.trait) || compareCodepoint(a.signal, b.signal));

  // THE TOTAL CAP, applied by even scaling rather than by truncating the tail, so a busy
  // year does not silently drop whichever signal happened to sort last.
  const total = rows.reduce((sum, row) => sum + row.mag, 0);
  const cap = NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_TICK_CAP;
  const scale = total > cap ? cap / total : 1;
  return rows.map((row) => ({
    signal: row.signal,
    trait: ACQUIRED_TRAIT_VOCAB.includes(row.trait) ? row.trait : ACQUIRED_TRAIT_VOCAB[0],
    mag: row.mag * scale,
  }));
}

// ── THE PER-ADVANCE TRANSITION (design §6c: on any advance, seeded) ─────────
/**
 * @typedef {Object} ResidencyStep
 * @property {Record<string, unknown>} worldState
 * @property {string} state       'travelling' | 'settled' | 'departed' | 'idle'
 * @property {string} atSettlementId
 * @property {boolean} changed
 */

/**
 * ADVANCE ONE ROAMER'S RESTING LIFE BY ONE TICK.
 *
 * The order is the physical one, and each branch does exactly one thing so a tick can
 * never both finish a journey and start another:
 *   - ON THE ROAD  ⇒ advance the leg (mid-route stays mid-route; an arrival lodges);
 *   - LODGED, stay not yet up ⇒ nothing at all;
 *   - LODGED, stay up ⇒ pick the next lodging and open the first leg toward it.
 *
 * Every write goes through the ONE conservation-safe mover, so a person cannot be lost
 * between the road and a roof.
 *
 * DORMANT, or an id that names nobody, ⇒ the caller's OWN worldState reference back.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.wnpcId
 * @param {number} args.tick
 * @param {import('../spatial/distanceRead.js').SpatialDigest|null|undefined} args.digest
 * @param {ReadonlyArray<{ settlementId: string, settlement: unknown }>} args.candidates
 * @param {((fromId: string) => ReadonlyArray<string>)|null} [args.hiddenHopsOf]
 * @returns {ResidencyStep}
 */
export function advanceResidency({ worldState, wnpcId, tick, digest, candidates, hiddenHopsOf = null }) {
  if (!npcConsequencesActive(worldState)) {
    return { worldState, state: 'idle', atSettlementId: '', changed: false };
  }
  const id = text(wnpcId);
  const roamer = npcLedgerOf(worldState).roamers[id];
  if (!roamer) return { worldState, state: 'idle', atSettlementId: '', changed: false };

  const record = /** @type {Record<string, unknown>} */ (/** @type {unknown} */ (roamer));
  const residency = asObject(record.residency);
  const leg = record.transit ? /** @type {import('./npcCirculationTransit.js').WanderLeg} */ (
    /** @type {unknown} */ (record.transit)
  ) : null;
  const now = tickOf(tick);

  // ── ON THE ROAD ──
  if (leg) {
    const step = advanceWanderer({
      digest, atSettlementId: '', leg, destId: text(leg.toId), tick: now, hiddenHopsOf,
    });
    if (!step.arrived) return { worldState, state: 'travelling', atSettlementId: '', changed: false };
    const arrivedAt = step.atSettlementId;
    const moved = moveNpcRecord({
      worldState,
      wnpcId: id,
      patch: {
        transit: null,
        residency: {
          settlementId: arrivedAt,
          sinceTick: now,
          untilTick: now + stayDurationTicks({ wnpcId: id, settlementId: arrivedAt, sinceTick: now }),
        },
      },
    });
    return { worldState: moved.worldState, state: 'settled', atSettlementId: arrivedAt, changed: moved.changed };
  }

  // ── LODGED ──
  const here = text(residency.settlementId);
  if (here && now < tickOf(residency.untilTick)) {
    return { worldState, state: 'settled', atSettlementId: here, changed: false };
  }

  const next = pickLodging({
    wnpcId: id,
    roamer: record,
    // The totality normalizer erases the row type the caller already declared, so the
    // declared shape is re-asserted here rather than widened at pickLodging's door: the
    // two functions state ONE candidate shape and a filter cannot change it.
    candidates: /** @type {ReadonlyArray<{ settlementId: string, settlement: unknown }>} */ (
      asArray(candidates).filter((raw) => text(asObject(raw).settlementId) !== here)
    ),
    tick: now,
  });
  if (!next) return { worldState, state: here ? 'settled' : 'idle', atSettlementId: here, changed: false };

  // NO ORIGIN TO WALK FROM: a soul who has never lodged anywhere takes their new roof
  // directly rather than teleporting along a road they were never on. The one-hop rule
  // governs MOVEMENT between known points, and this is the first point.
  if (!here || !digest) {
    const moved = moveNpcRecord({
      worldState,
      wnpcId: id,
      patch: {
        transit: null,
        residency: {
          settlementId: next.settlementId,
          sinceTick: now,
          untilTick: now + stayDurationTicks({ wnpcId: id, settlementId: next.settlementId, sinceTick: now }),
        },
      },
    });
    return { worldState: moved.worldState, state: 'settled', atSettlementId: next.settlementId, changed: moved.changed };
  }

  const step = advanceWanderer({
    digest, atSettlementId: here, leg: null, destId: next.settlementId, tick: now, hiddenHopsOf,
  });
  if (!step.leg) return { worldState, state: 'settled', atSettlementId: here, changed: false };
  const moved = moveNpcRecord({
    worldState, wnpcId: id, patch: { residency: null, transit: step.leg },
  });
  return { worldState: moved.worldState, state: 'departed', atSettlementId: '', changed: moved.changed };
}
