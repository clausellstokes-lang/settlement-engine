/**
 * domain/display/occupationStatus.js — read-model SELECTOR for the DM UI:
 * the OCCUPATION layer in heuristic DM language.
 *
 * A `warStatus.js`-style projection of `worldState.occupations` (the stateful
 * ledger keyed by the OCCUPIED settlement) — surfacing, in PLAIN WORDS,
 * occupation BURDEN + BENEFIT, WHO RESISTS, and what the
 * occupation is worth vs. what it costs:
 *
 *   - the occupation STATE in DM language ("a contested occupation — the occupier
 *     does not yet hold it" … "a stabilized client state");
 *   - RESISTANCE in words ("the occupied population is in open revolt");
 *   - the BURDEN on the occupier ("garrisoning it is bleeding the occupier")
 *     vs. the BENEFIT ("the occupation now pays for itself") — the burden-vs-benefit
 *     balance the snowball-containment design hinges on;
 *   - WHO BENEFITS (the occupier) and WHO RESISTS (the occupied), by name.
 *
 * HEURISTIC DM LANGUAGE — NO INTERNALS. No state-machine enum is surfaced raw, no
 * resistance/benefitYield/burden float, no containment-cap number, no rng. The
 * scalars are bucketed into words.
 *
 * PRESENTATION ONLY. Pure projection: nothing here mutates worldState, forks rng,
 * or reads a wall clock. INERT, NOT CRASH, WHEN ABSENT — a no-war / war-off campaign
 * carries no `occupations` key (it materializes only on the first conquest) ⇒ every
 * reader returns []/null ⇒ byte-identical off-state. Codepoint-sorted everywhere.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

/** @param {any} a @param {any} b @returns {number} */
const codepoint = (a, b) => (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
/** @param {any} v @param {number} [d] @returns {number} */
const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const clamp01 = (/** @type {any} */ v) => Math.max(0, Math.min(1, num(v)));

// The occupation state ladder → DM phrase (occupied-side framing). Mirrors the
// engine STATE_LADDER but says nothing about the enum or the hysteresis.
const STATE_PHRASE = Object.freeze({
  contested: 'a contested occupation — the occupier has not yet taken hold',
  unstable: 'an unstable occupation — control is precarious',
  extractive: 'an extractive occupation — the occupier is bleeding it for what it can',
  stabilized: 'a stabilized occupation — the occupier holds it firmly',
  vassalized: 'a client state — the occupied settlement now serves its conqueror',
});

// Benefit framing: is the occupation net-positive for the occupier yet? A
// contested/resisted occupation is a drain; a stabilized one starts to pay.
const STATE_PAYS = Object.freeze({
  contested: false, unstable: false, extractive: true, stabilized: true, vassalized: true,
});

/** The DM phrase for an occupation state. Unknown states read as contested.
 * @param {string} state @returns {string} */
export function occupationStatePhrase(state) {
  return /** @type {Record<string, string>} */ (STATE_PHRASE)[String(state)] || STATE_PHRASE.contested;
}

// Resistance bands (0..1) → words.
const RESISTANCE_BANDS = Object.freeze([
  { floor: 0.6, phrase: 'in open revolt' },
  { floor: 0.35, phrase: 'simmering with resistance' },
  { floor: 0.2, phrase: 'restive — sabotage and noncompliance harry the garrison' },
  { floor: 0, phrase: 'largely quiescent' },
]);

/** The DM resistance phrase for a 0..1 resistance scalar. @param {number} v @returns {string} */
export function resistancePhrase(v) {
  const r = clamp01(v);
  const band = RESISTANCE_BANDS.find(b => r >= b.floor) || RESISTANCE_BANDS[RESISTANCE_BANDS.length - 1];
  return band.phrase;
}

/**
 * The live OCCUPATION status of ONE OCCUPIED settlement — its occupier (by name),
 * the occupation state in words, the resistance in words, and whether holding it
 * is a net burden or a benefit to the occupier. Null when the settlement is not
 * under a live occupation ⇒ self-gating.
 *
 * @param {Object} args
 * @param {any} args.settlementId   the OCCUPIED settlement id.
 * @param {any} args.worldState
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {{ occupierName: string, statePhrase: string, resistancePhrase: string, pays: boolean, burdened: boolean } | null}
 */
export function settlementOccupation({ settlementId, worldState, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  if (settlementId == null) return null;
  const ledger = worldState?.occupations && typeof worldState.occupations === 'object'
    ? worldState.occupations
    : {};
  const rec = ledger[String(settlementId)];
  if (!rec || rec.occupierId == null) return null;
  const state = String(rec.state || 'contested');
  const pays = /** @type {Record<string, boolean>} */ (STATE_PAYS)[state] === true;
  const resistance = clamp01(num(rec.resistance));
  return {
    occupierName: nameFor(rec.occupierId),
    statePhrase: occupationStatePhrase(state),
    resistancePhrase: resistancePhrase(resistance),
    pays,
    // A resisted, not-yet-paying occupation is a burden; a quiescent, paying one
    // is a benefit. The burden-outweighs-benefit framing the design guarantees.
    burdened: !pays || resistance >= 0.35,
  };
}

/**
 * What ONE OCCUPIER currently holds — the settlements it occupies (by name), and a
 * one-line burden/benefit read on its position: holding many resisted occupations
 * stretches it thin (overextension); a few stabilized ones strengthen it. Null when
 * the settlement occupies nothing ⇒ self-gating (who-benefits surface for the
 * occupier's own dossier).
 *
 * @param {Object} args
 * @param {any} args.settlementId   the OCCUPIER settlement id.
 * @param {any} args.worldState
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {{ holds: Array<{ name: string, statePhrase: string, resistancePhrase: string }>, stretchedThin: boolean, strengthened: boolean } | null}
 */
export function occupierHoldings({ settlementId, worldState, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  if (settlementId == null) return null;
  const id = String(settlementId);
  const ledger = worldState?.occupations && typeof worldState.occupations === 'object'
    ? worldState.occupations
    : {};
  /** @type {Array<{ name: string, statePhrase: string, resistancePhrase: string, resistance: number, pays: boolean }>} */
  const held = [];
  for (const occupiedId of Object.keys(ledger).sort(codepoint)) {
    const rec = ledger[occupiedId];
    if (String(rec?.occupierId) !== id) continue;
    const state = String(rec.state || 'contested');
    held.push({
      name: nameFor(occupiedId),
      statePhrase: occupationStatePhrase(state),
      resistancePhrase: resistancePhrase(num(rec.resistance)),
      resistance: clamp01(num(rec.resistance)),
      pays: /** @type {Record<string, boolean>} */ (STATE_PAYS)[state] === true,
    });
  }
  if (!held.length) return null;
  const resistedCount = held.filter(h => h.resistance >= 0.35).length;
  const payingCount = held.filter(h => h.pays).length;
  return {
    holds: held.map(h => ({ name: h.name, statePhrase: h.statePhrase, resistancePhrase: h.resistancePhrase })),
    // Overextension: many occupations, several resisted ⇒ stretched thin.
    stretchedThin: held.length >= 3 || resistedCount >= 2,
    // Net-positive when most holdings pay and few resist.
    strengthened: payingCount > resistedCount && payingCount > 0,
  };
}

/**
 * The cross-settlement OCCUPATION standings: one entry per live occupation (keyed by
 * the occupied settlement), codepoint-sorted, each with both parties named + the
 * state/resistance in words. Returns [] when the ledger is absent ⇒ byte-identical.
 *
 * @param {Object} args
 * @param {any} args.worldState
 * @param {(id:any)=>string} [args.nameFor]
 * @returns {Array<{ occupiedId: string, occupiedName: string, occupierName: string, statePhrase: string, resistancePhrase: string, pays: boolean }>}
 */
export function occupationStandings({ worldState, nameFor = (id) => String(id) } = /** @type {any} */ ({})) {
  const ledger = worldState?.occupations && typeof worldState.occupations === 'object'
    ? worldState.occupations
    : {};
  /** @type {Array<{ occupiedId: string, occupiedName: string, occupierName: string, statePhrase: string, resistancePhrase: string, pays: boolean }>} */
  const out = [];
  for (const occupiedId of Object.keys(ledger).sort(codepoint)) {
    const rec = ledger[occupiedId];
    if (!rec || rec.occupierId == null) continue;
    const state = String(rec.state || 'contested');
    out.push({
      occupiedId,
      occupiedName: nameFor(occupiedId),
      occupierName: nameFor(rec.occupierId),
      statePhrase: occupationStatePhrase(state),
      resistancePhrase: resistancePhrase(num(rec.resistance)),
      pays: /** @type {Record<string, boolean>} */ (STATE_PAYS)[state] === true,
    });
  }
  return out;
}

/**
 * Whether ANY live occupation is present (the panel gate). A dormant / war-off
 * campaign carries no `occupations` key ⇒ false ⇒ nothing renders ⇒ byte-identical.
 * @param {Object} args
 * @param {any} args.worldState
 * @returns {boolean}
 */
export function hasLiveOccupation({ worldState } = /** @type {any} */ ({})) {
  return occupationStandings({ worldState }).length > 0;
}

export const OCCUPATION_STATUS_PHRASES = Object.freeze({ STATE_PHRASE, RESISTANCE_BANDS });
