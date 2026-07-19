/**
 * domain/traditions/relations.js — THE TRADITIONS wave (Engine Lift #4), slice T-4: RELATIONS.
 *
 * Traditions do not live in isolation — they are IMPOSED by overlords and CARRIED by migrants
 * (owner spec §0: "vassals may be forced to trade a tradition for the overlord's · population
 * influx ⇒ adoption/replacement from the source settlement"). DESIGN_TRADITIONS §8 IMPOSITION +
 * §9 ADOPTION are this leaf's law. This pure leaf holds the two RELATION machineries the T-2
 * mover calls once per lit tick, AFTER politics (T-3) has settled ownership + expression and
 * BEFORE the occurrence engine resolves the year's festivals:
 *
 *   • IMPOSITION / SUPPRESSION (§8): the occupation ledger is the ONE authority — a settlement
 *     whose `worldState.occupations[sid].state === 'vassalized'` may (a seeded per-year chance)
 *     be forced to TRADE a tradition for its overlord's. The overlord's highest-scale rite is
 *     IMPOSED as a new local copy (adoptedFrom: overlordId, the overlord's expression); the local
 *     non-founding tradition it displaces is SUPPRESSED — never deleted, never moved — marked
 *     `suppressedBy {overlordId, sinceYear, traded:<the imposed copy>}` so it can return intact.
 *     The FOUNDING CORE (index 0) is immutable and is never suppressed.
 *   • LIBERATION / RESTORATION (§8): when the vassalization that suppressed a tradition is no
 *     longer in force (the occupation ended, its state dropped below vassalized, or a different
 *     overlord holds it), the suppressed core RETURNS — its `suppressedBy` clears, the imposed
 *     copy is removed, and a `restoration` mutationLog row is stamped. Liberation festivals
 *     emerge from pure mechanics: the restored rite simply occurs at its next window.
 *   • ADOPTION (§9, T4-b): culture travels with population — see advanceRelations's adoption pass.
 *
 * KEY DISCIPLINE (§8/§17): the occupation ledger is the SOLE imposition trigger (treaties and
 * hegemony stay derived-only — never read here). The imposed copy carries the overlord's
 * EXPRESSION verbatim (design §8) and a LOCAL id (`${victim.id}::imposed`) so ids stay unique
 * within the destination set. Every relation change appends a mutationLog {year, kind, cause}
 * (the tradition's own readable history — provenance-grade for the dossier register). Structural,
 * no hysteresis: imposition/restoration/adoption fire on-event (T-4 interface binding).
 *
 * PURITY: a true domain leaf — no store/React import, no Date/Math.random/localeCompare. All
 * entropy is a SEEDED PRNG (a tick-invariant world-seed fork for the imposition chance), so the
 * same campaign yields the same relation history on any device. The mover supplies the cross-
 * settlement reads (an overlord's / origin's rec set) through the `traditionsOf` resolver, and
 * the migration influx (§9) pre-computed from the in-transit column ledger, so this leaf never
 * reaches into another settlement's live state directly.
 */

import { createPRNG } from '../../kernel/prng.js';

/** @typedef {import('./genesis.js').TraditionRec} TraditionRec */

// ── §8 IMPOSITION dials (soak-certified; every entry vetoable) ──────────────────
const IMPOSE_CHANCE = 0.3;   // a vassalized settlement's per-year chance to be forced to trade a rite

// ── narrowing helpers (self-contained; the kernel's asObject idiom, 0-hole) ──
/** @param {unknown} x @returns {Record<string, unknown>} */
function asObject(x) {
  return x && typeof x === 'object' && !Array.isArray(x) ? /** @type {Record<string, unknown>} */ (x) : {};
}
/** @param {unknown} x @param {number} d @returns {number} */
function num(x, d) {
  const n = Number(x);
  return Number.isFinite(n) ? n : d;
}
/** Codepoint-stable compare (byte-stable ordering). @param {string} a @param {string} b @returns {number} */
function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Append a mutationLog {year, kind, cause} row (a new object; never mutate the input).
 *  @param {TraditionRec} rec @param {number} year @param {string} kind @param {string} cause @returns {TraditionRec} */
function logMutation(rec, year, kind, cause) {
  const raw = /** @type {Record<string, unknown>} */ (rec).mutationLog;
  const log = Array.isArray(raw) ? raw : [];
  return /** @type {TraditionRec} */ ({ ...rec, mutationLog: [...log, { year, kind, cause }] });
}

// ── §8 the occupation read (the ONE imposition authority) ──────────────────────
/**
 * The overlord id currently VASSALIZING a settlement, or null. Reads `worldState.occupations`
 * (the top-level occupation ledger — the documented exception to the spatialLedgers namespace,
 * per occupation.js): a record with state 'vassalized' (STATE_LADDER rung 4, the steady-state
 * max) is the ONE trigger. Any other state (or an absent record — the liberated exit rung) ⇒ null.
 * Pure, total.
 * @param {Record<string, unknown>} worldState @param {string} sid @returns {string|null}
 */
function vassalOverlordOf(worldState, sid) {
  const occ = asObject(asObject(worldState).occupations)[sid];
  const o = asObject(occ);
  if (String(o.state) !== 'vassalized') return null;
  const overlordId = typeof o.occupierId === 'string' && o.occupierId ? o.occupierId : null;
  return overlordId;
}

/** The highest-scale ACTIVE (non-suppressed) tradition in a rec set — the rite an overlord
 *  imposes / a migrant carries. Codepoint tie-break for determinism. Null when the set is
 *  empty or entirely suppressed. @param {TraditionRec[]|null|undefined} recs @returns {TraditionRec|null} */
function topTradition(recs) {
  const pool = (Array.isArray(recs) ? recs : []).filter((r) => !asObject(r).suppressedBy);
  if (!pool.length) return null;
  return pool.slice().sort((a, b) => (num(b.scaleBand, 0) - num(a.scaleBand, 0)) || cmp(String(a.id), String(b.id)))[0];
}

/** The imposition victim: the highest-scale NON-founding (index > 0), non-suppressed, non-imported
 *  local tradition — the slot the overlord's rite takes over. The founding core (index 0) is
 *  immutable and never a victim; an already-imported (adoptedFrom) rite is not re-suppressed.
 *  Returns the array index, or -1 when nothing is eligible (a one-rite settlement keeps its
 *  origin). @param {TraditionRec[]} recs @returns {number} */
function impositionVictimIndex(recs) {
  let best = -1;
  let bestScale = -Infinity;
  for (let i = 1; i < recs.length; i += 1) {
    const r = asObject(recs[i]);
    if (r.suppressedBy || (typeof r.adoptedFrom === 'string' && r.adoptedFrom)) continue;
    const scale = num(r.scaleBand, 0);
    if (scale > bestScale || (scale === bestScale && best >= 0 && cmp(String(recs[i].id), String(recs[best].id)) < 0)) {
      best = i; bestScale = scale;
    }
  }
  return best;
}

/**
 * Build the IMPOSED copy of an overlord's rite for a destination set (§8): the overlord's core
 * motif + expression + window + dedication travel verbatim; the scale is capped to what the
 * vassal can stage (min of the overlord's scale and the local tier band); the id is LOCAL
 * (`${victim.id}::imposed`) so the destination set stays id-unique; adoptedFrom stamps the
 * overlord. Owner fields stay null (the interim full-weight routing — the imposed rite's fortune
 * reflects on the vassal town). Pure.
 * @param {TraditionRec} overlordTop @param {TraditionRec} victim @param {string} overlordId
 * @param {number} localTierBand @param {number} year @returns {TraditionRec}
 */
function buildImposedCopy(overlordTop, victim, overlordId, localTierBand, year) {
  const scaleBand = Math.min(num(overlordTop.scaleBand, 0), Math.max(0, localTierBand));
  return /** @type {TraditionRec} */ ({
    id: `${victim.id}::imposed`,
    coreMotif: { ...asObject(overlordTop.coreMotif) },
    name: String(overlordTop.name || 'The Overlord’s Rite'),
    foundedYear: year,
    window: { ...asObject(overlordTop.window) },
    scaleBand,
    ownerKey: null,
    ownerKind: null,
    ownerLabel: null,
    deityRef: typeof overlordTop.deityRef === 'string' && overlordTop.deityRef ? overlordTop.deityRef : null,
    expression: { ...asObject(overlordTop.expression) },
    mutationLog: [{ year, kind: 'imposition', cause: `imposed under vassalage to ${overlordId}` }],
    lastHeldYear: null,
    lastOutcome: null,
    suppressedBy: null,
    adoptedFrom: overlordId,
  });
}

/**
 * §8 IMPOSITION — a vassalized settlement may be forced to trade a rite for its overlord's.
 * Seeded per-year chance (a tick-invariant world-seed fork). Idempotent: no second imposition
 * while this overlord already holds one here (a live suppressedBy.overlordId). Returns the
 * possibly-extended rec set + whether anything changed. Pure.
 * @param {Object} a
 * @param {TraditionRec[]} a.recs @param {Record<string, unknown>} a.worldState @param {string} a.sid
 * @param {number} a.year @param {number} a.localTierBand
 * @param {(otherSid: string) => TraditionRec[]|null} a.traditionsOf
 * @returns {{ recs: TraditionRec[], changed: boolean }}
 */
function applyImposition({ recs, worldState, sid, year, localTierBand, traditionsOf }) {
  const overlordId = vassalOverlordOf(worldState, sid);
  if (!overlordId) return { recs, changed: false };
  // Idempotency: this overlord already imposed a rite here ⇒ nothing further this vassalage.
  if (recs.some((r) => String(asObject(asObject(r).suppressedBy).overlordId) === overlordId)) {
    return { recs, changed: false };
  }
  const rngSeed = String(asObject(worldState).rngSeed || '');
  if (!createPRNG(`${rngSeed}::tradition:impose:${sid}:${year}`).chance(IMPOSE_CHANCE)) {
    return { recs, changed: false };
  }
  const overlordTop = topTradition(traditionsOf(overlordId));
  if (!overlordTop) return { recs, changed: false };
  const vi = impositionVictimIndex(recs);
  if (vi < 0) return { recs, changed: false }; // nothing but the immutable founding core — no trade

  const victim = recs[vi];
  const imposed = buildImposedCopy(overlordTop, victim, overlordId, localTierBand, year);
  const suppressed = logMutation(
    /** @type {TraditionRec} */ ({ ...victim, suppressedBy: { overlordId, sinceYear: year, traded: imposed } }),
    year, 'imposition', 'traded for the overlord’s rite under vassalage',
  );
  const next = recs.slice();
  next[vi] = suppressed;
  next.push(imposed); // appended at the end — the founding core (index 0) never moves
  return { recs: next, changed: true };
}

/**
 * §8 LIBERATION / RESTORATION — a suppressed rite returns when the vassalization that suppressed
 * it is no longer in force (the occupation ended, dropped below 'vassalized', or a different
 * overlord holds it). Clears suppressedBy, stamps a 'restoration' mutationLog, and removes the
 * imposed copy it was traded for. The founding core (index 0) is never involved. Pure.
 * @param {Object} a
 * @param {TraditionRec[]} a.recs @param {Record<string, unknown>} a.worldState @param {string} a.sid
 * @param {number} a.year
 * @returns {{ recs: TraditionRec[], changed: boolean }}
 */
function applyRestoration({ recs, worldState, sid, year }) {
  const overlordNow = vassalOverlordOf(worldState, sid);
  /** @type {Set<string>} the imposed-copy ids to remove (the rites the overlords traded in) */
  const removeIds = new Set();
  let changed = false;
  let next = recs.map((rec) => {
    const sup = asObject(asObject(rec).suppressedBy);
    const overlordId = typeof sup.overlordId === 'string' ? sup.overlordId : null;
    if (!overlordId) return rec;
    // Still in force iff the SAME overlord still holds this settlement vassalized.
    if (overlordNow && overlordNow === overlordId) return rec;
    const tradedId = String(asObject(sup.traded).id || '');
    if (tradedId) removeIds.add(tradedId);
    changed = true;
    return logMutation(
      /** @type {TraditionRec} */ ({ ...rec, suppressedBy: null }),
      year, 'restoration', 'the occupation ended; the old rite returned',
    );
  });
  if (removeIds.size) next = next.filter((rec) => !removeIds.has(String(asObject(rec).id)));
  return { recs: changed ? next : recs, changed };
}

/**
 * Advance a settlement's RELATIONS one lit tick (§8 imposition/restoration; §9 adoption in T4-b).
 * At the FIRST-LIT mint: a NO-OP (the minted set must stay byte-identical to the pure view-time
 * preview — relations begin the next tick, exactly as politics defers its mutations). Otherwise:
 * restoration first (a liberated rite returns), then imposition (a vassal may be forced to trade).
 * Restoration precedes imposition so a settlement re-vassalized by a NEW overlord restores the old
 * rite before the new imposition lands. Pure + deterministic.
 * @param {Object} a
 * @param {TraditionRec[]} a.recs
 * @param {Record<string, unknown>} a.settlement
 * @param {Record<string, unknown>} a.worldState
 * @param {string} a.sid
 * @param {number} a.year
 * @param {number} a.localTierBand  the destination's tier band index (0..6) — the imposed-scale cap
 * @param {boolean} a.minted
 * @param {(otherSid: string) => TraditionRec[]|null} a.traditionsOf  resolve another settlement's rec set
 * @returns {{ recs: TraditionRec[], changed: boolean }}
 */
export function advanceRelations({ recs, settlement, worldState, sid, year, localTierBand, minted, traditionsOf }) {
  void settlement;
  if (minted || !Array.isArray(recs) || !recs.length) return { recs, changed: false };
  let changed = false;
  let cur = recs;

  const restored = applyRestoration({ recs: cur, worldState, sid, year });
  if (restored.changed) { cur = restored.recs; changed = true; }

  const imposed = applyImposition({ recs: cur, worldState, sid, year, localTierBand, traditionsOf });
  if (imposed.changed) { cur = imposed.recs; changed = true; }

  return { recs: changed ? cur : recs, changed };
}
