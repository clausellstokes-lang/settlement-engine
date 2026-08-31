/**
 * domain/rulingPowerSeat.js — THE FOREIGN SEAT: who looms over the ruler.
 *
 * W-SEAT D1 (DESIGN_W_SEAT §3, as amended by A1). The sibling leaf to
 * rulingPower.js (`governingFactionOf` — who rules) and rulingPowerCoup.js (the
 * contest model). One family, three files, stated:
 *
 *   rulingPower.js      EAGER  — who governs, and how rule changes hands.
 *   rulingPowerCoup.js  LAZY   — the coup field and the verdict.
 *   rulingPowerSeat.js  LAZY   — who looms OVER the one who governs.
 *
 * ⛔ THIS LEAF IS LAZY-ONLY, DELIBERATELY (A1.2.15). Homing `foreignSeatOf` in
 * rulingPower.js — where law §2.1 first put it, so that "who rules" and "who
 * looms over the ruler" would share one home — would drag this file's whole
 * import fan (region/graph, migrationKernel, hegemony's treaty vocabulary,
 * cultureDistance) into the FIRST-PAINT static closure through rulingPower's
 * eager entrance. That is the exact class the WEAVE panel struck. The law's
 * intent is served instead by co-location and this header: one family, and the
 * seat read consumes `governingFactionOf` rather than forking it.
 * @enforced-by tests/build/vendorPdfLazy.test.js (first-paint byte budget).
 *
 * PURE + DERIVED, NEVER PERSISTED (law §2.2): the seat is recomputed each call
 * from the three substrates that already exist. Zero writes, zero rng, zero wall
 * clock, INERT-NOT-CRASH on absent/garbage ledgers, every list codepoint-sorted.
 * The template is hegemony.js — "A PATTERN, NEVER AN ENTITY … ZERO persisted
 * state". The one exception the design allows (a CHOSEN posture is a decision,
 * and a decision is state) lands in SEAT-3 on the occupations record, not here.
 *
 * ── THE THREE SUBSTRATES, AND WHY ONE RESOLVER (law §2.1, §711.6) ────────────
 * "Is S under F's seat?" already had THREE partial answers before this file, and
 * none of them knew about the others (census V4(a4)):
 *
 *   1. `worldState.occupations[S]`            — the conquest ladder.
 *   2. a `vassal` relationship edge + state   — the diplomatic plane.
 *   3. a subordinating treaty tie             — the compact plane (hegemony.js).
 *
 * A fourth private answer would have been the fourth fork of exactly the class
 * the governing-faction resolver was already caught in. This is the one resolver
 * that consults all three, in that precedence order, and every consumer reads
 * its answer rather than re-deriving one.
 */

import { clamp01 } from '../kernel/math.js';
import { compareCodepoint } from './deterministicSort.js';
import { getSpatialLedger } from './spatial/distanceRead.js';
import { cultureAffinity } from './spatial/cultureDistance.js';
import { FACTION_ARCHETYPES, factionArchetype } from './factionArchetypes.js';
import { governingFactionOf, nameOf, num } from './rulingPower.js';
import { SUBORDINATING_TERM_TYPES } from './worldPulse/hegemony.js';
import { treatyOrientationOf } from './worldPulse/treatyOrientation.js';
import { buildCultureVector } from './worldPulse/migrationKernel.js';
import { activeChannelsFrom } from './region/graph.js';
import {
  ensureRelationshipState,
  getRelationshipSettlements,
  normalizeRelationshipEdge,
  relationshipKeyFromEdge,
  relationshipRoles,
} from './worldPulse/relationshipState.js';

const A = FACTION_ARCHETYPES;

/**
 * @typedef {Object} ForeignSeatView
 * @property {'occupation'|'vassalage'} regime  which substrate seats the foreign power
 * @property {string} patronSettlementId        the occupier / overlord
 * @property {number} weight01                  0..1 influence over this settlement's decisions
 * @property {'dominant'|'strong'|'present'|'marginal'} band
 * @property {string} basis                     the substrate the regime resolved from
 * @property {number} grip01                    the pre-scaler hold (regime-native)
 * @property {number} closeness01               culture affinity to the patron
 * @property {number} trade01                   pairwise trade closeness to the patron
 * @property {string|null} rung                 the occupation ladder rung, when occupation
 * @property {boolean} primacy                  whether this seat carries ORDERING rights
 */

// ── Tuning ───────────────────────────────────────────────────────────────────

/**
 * ⚠ PROVISIONAL, TUNING-ADJACENT (volume §3-D1; the band floors are the volume's
 * own word "PROVISIONAL"). Every number here is a candidate for the owner's
 * tuning signature and NONE of it is load-bearing for the ORDERING guarantee:
 * law §2.3 makes primacy a typed decision-class list, so no tuning pass can
 * invert the owner's "always just greater" by moving a float.
 *
 * The floors idiom is `HEGEMONY_TUNING.SHARE_BANDS` verbatim (descending floors,
 * `.find` picks the first match) so the two seat-adjacent reads band the same way.
 */
export const SEAT_TUNING = Object.freeze({
  /** Influence bands, descending floors. */
  BANDS: Object.freeze([
    { floor: 0.70, band: 'dominant' },
    { floor: 0.45, band: 'strong' },
    { floor: 0.20, band: 'present' },
    { floor: 0.00, band: 'marginal' },
  ]),
  /** influence01 = grip01 × (BASE + CLOSENESS·closeness01 + TRADE·trade01). Sums to 1. */
  BASE: 0.6,
  CLOSENESS: 0.2,
  TRADE: 0.2,
  /** Vassal grip blend (census V4 derivation sketch, all fields from the ensured state). */
  VASSAL_LEVERAGE: 0.35,
  VASSAL_DEPENDENCY: 0.25,
  VASSAL_PACT: 0.20,
  VASSAL_FEAR: 0.20,
  VASSAL_RESENTMENT: 0.25,
  /**
   * A subordinating treaty tie with NO relationship-vassal edge and no occupation
   * yields AT MOST `present` — influence without a compact is pressure, not a
   * seat. Chair ruling (§3-D1), owner-vetoable. The ceiling is the `present`
   * floor plus the band's own width, i.e. it can never reach `strong`.
   */
  TREATY_ONLY_CEILING: 0.44,
  /** Per-tie contribution of a subordinating treaty term, before compliance decay. */
  TREATY_TIE_STEP: 0.15,
  /**
   * The FIFTH signed additive term's magnitude in the coup pHold clamp (D4's
   * SUCCESS moment). Set to the estate's POLITICAL-READ tier (`authorityAdj` and
   * `economicAdj` are both ±0.125) and DELIBERATELY BELOW the physical tier
   * (`interventionAdj` and `warSentimentAdj` are both ±0.22): a foreign seat is
   * standing and leverage, not an army in the square. The army's term already
   * exists beside this one and must stay the louder of the two.
   */
  COUP_PHOLD_WEIGHT: 0.125,
});

/**
 * THE GRIP SCALE — how much of a hold an occupation rung actually confers.
 *
 * ⛔ THIS IS ITS OWN NAMED TABLE AND MUST NEVER BE FOLDED INTO occupation.js's
 * `STATE_BENEFIT_SCALE` (A1.2.15). The two tables are shaped alike and mean
 * different things, and §711.6's law — a numeric field with no declared unit
 * acquires a different unit at every consumer — is precisely what a shared table
 * would invite. BENEFIT_SCALE is an ECONOMIC unit: the fraction of extractable
 * yield a rung delivers. GRIP_SCALE is a POLITICAL unit: the fraction of the
 * occupied court's decisions the occupier can reach. They diverge at the bottom
 * of the ladder on purpose — a `contested` occupation yields NOTHING economically
 * (benefit 0.0) while still commanding the town at spearpoint (grip 0.25).
 *
 * `vassalized` is absent BY RULING, not by omission: A1.1.8 resolves that rung to
 * regime VASSALAGE, so it never reaches this table (see `occupationRegimeOf`).
 * @type {Readonly<Record<string, number>>}
 */
export const GRIP_SCALE = Object.freeze({
  contested: 0.25,
  unstable: 0.45,
  extractive: 0.70,
  stabilized: 0.95,
});

/**
 * The occupation ladder's rung order, mirrored for the `< vassalized` predicate.
 * ⚠ SECOND SPELLING, DELIBERATE AND PINNED: occupation.js owns `STATE_LADDER` and
 * does not export it. This leaf must not import occupation.js (that module is a
 * heavy tick kernel and this is a read leaf), so the order is mirrored here and
 * `tests/domain/foreignSeatResolver.test.js` asserts the two agree — the same
 * pin-rather-than-share treatment `warSeatBooks.seatAddressFactionId` gives
 * `realmFactionPulseId`.
 * @type {ReadonlyArray<string>}
 */
export const OCCUPATION_RUNGS = Object.freeze([
  'contested', 'unstable', 'extractive', 'stabilized', 'vassalized',
]);

/** The terminal rung, which A1.1.8 resolves OUT of occupation and INTO vassalage. */
const VASSALIZED_RUNG = 'vassalized';

/** worst-compliance decay on a subordinating tie: honored 1 · strained 0.6 · defaulted 0.2.
 * @type {Readonly<Record<string, number>>} */
const COMPLIANCE_SCALE = Object.freeze({ honored: 1, strained: 0.6, defaulted: 0.2 });

/**
 * The pairwise trade-tie strength the culture composite consumes, keyed by
 * relationship label. Mirrors migrationKernel's `TRADE_TIE` — pinned, not shared,
 * because that constant is module-private there.
 * @type {Readonly<Record<string, number>>}
 */
const TRADE_TIE = Object.freeze({ trade_partner: 1, allied: 0.7, vassal: 0.6, patron: 0.6 });

/** The P0 channel types that carry pairwise trade closeness (region/graph.js). */
const TRADE_CHANNEL_TYPES = Object.freeze(['trade_dependency', 'export_market', 'trade_route']);

// ── Small local helpers (kept private; none of these is a new public quantity) ─

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} snapshot @param {string} id @returns {unknown} */
function itemFor(snapshot, id) {
  const shaped = asObject(snapshot);
  const byId = shaped.byId;
  if (byId instanceof Map) return byId.get(id) || null;
  const items = Array.isArray(shaped.settlements) ? shaped.settlements : [];
  return items.find((raw) => String(asObject(raw).id ?? '') === id) || null;
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** @param {number} influence01 @returns {'dominant'|'strong'|'present'|'marginal'} */
function bandFor(influence01) {
  const s = clamp01(influence01);
  const row = SEAT_TUNING.BANDS.find((b) => s >= b.floor) || SEAT_TUNING.BANDS[SEAT_TUNING.BANDS.length - 1];
  return /** @type {'dominant'|'strong'|'present'|'marginal'} */ (row.band);
}

// ── (1) The occupied predicate — ONE spelling (law §2.1) ─────────────────────

/**
 * THE OCCUPATION REGIME READ — the one place that answers "is this settlement
 * occupied, and at what rung".
 *
 * ⚠ THIS IS THE UNIFIED PREDICATE AND IT IS NOT YET A MIGRATION. A1.1.2 rules
 * that the occupied-predicate move is "ruled, not assumed": the stressor spelling
 * and the ledger spelling provably diverge in BOTH directions, so SEAT-1 first
 * MEASURES that delta over the corpus and the move then lands FLAG-GATED, with
 * the written admission that dark worlds keep the stressor spelling. Nothing in
 * this file swaps a live predicate; this function is the destination the
 * flag-gated callers will move to, and until they do it has no production reader.
 * ⛔ "0-when-dark" is never cited for a predicate swap (A1.1.2).
 *
 * THE RUNG RULING (A1.1.8): `vassalized` is NOT occupied. The ladder's top rung
 * never exits the ledger (the sovereignty-sale machinery needs the row to
 * survive), so a predicate of mere ledger PRESENCE would keep a matured vassal
 * under occupation PRIMACY — and under W-COIN's zero-tax rule — forever, making
 * `cultivate` the road to permanent maximal domination and inverting the owner's
 * design. The predicate therefore qualifies to rung < vassalized, and the top
 * rung resolves to regime `vassalage` in `foreignSeatOf` below.
 *
 * @param {unknown} worldState
 * @param {string} settlementId
 * @returns {{ occupied: boolean, rung: string|null, occupierId: string|null,
 *             resistance: number, ledgerPresent: boolean }}
 */
export function occupationRegimeOf(worldState, settlementId) {
  const ledger = asObject(asObject(worldState).occupations);
  const record = asObject(ledger[String(settlementId)]);
  const occupierId = record.occupierId != null ? String(record.occupierId) : null;
  if (!occupierId) {
    return { occupied: false, rung: null, occupierId: null, resistance: 0, ledgerPresent: false };
  }
  const rung = String(record.state ?? '');
  const known = OCCUPATION_RUNGS.includes(rung);
  return {
    // An UNKNOWN rung is treated as occupied at the `contested` floor, mirroring
    // occupation.js's own `stateRank` ("unknown labels resolve to the contested
    // floor") — a garbage rung must never silently free a town.
    occupied: !known || rung !== VASSALIZED_RUNG,
    rung: known ? rung : OCCUPATION_RUNGS[0],
    occupierId,
    resistance: clamp01(num(Number(record.resistance), 0)),
    ledgerPresent: true,
  };
}

/**
 * THE OVERLORD OF A MATURED VASSALAGE — the ONE export (law §2.1's collapse).
 *
 * ⛔ TWO FUNCTIONS OF THIS NAME EXISTED, READING DIFFERENT SUBSTRATES, and
 * neither could be reused as-is:
 *
 *   • `occupation.js:1317` took a SNAPSHOT and walked the relationship EDGES,
 *     returning the senior of any `vassal` edge. Its own docstring called it "a
 *     re-export of the deploymentReturn idiom … for tests/integration", and it
 *     was a DEAD EXPORT — zero callers in src/, tests/, scripts/ or anywhere
 *     else in the tree. Deleted by this car; its behaviour lives on, correctly
 *     placed, inside `vassalageSeat` below.
 *   • `traditions/relations.js:84` took a WORLDSTATE and read the OCCUPATIONS
 *     LEDGER, returning `occupierId` only at the `vassalized` rung. Module-
 *     private, two live in-file callers. That is the semantics preserved here
 *     VERBATIM, and `relations.js` now consumes this export instead.
 *
 * So one name meant two different questions over two different substrates — the
 * §711.6 shape exactly. The name is kept for the LEDGER question (the one with
 * live callers); the edge question is not a separate public quantity at all, it
 * is one arm of `foreignSeatOf`.
 *
 * ⚠ THE KEY IS `occupierId`, NOT `overlordId`. A plausible-looking wrong key
 * once reported a zero for a whole sweep; `tests/domain/advanceEpochStampSurvival.test.js:582`
 * carries the scar and the pin.
 *
 * @param {unknown} worldState @param {string} sid @returns {string|null}
 */
export function vassalOverlordOf(worldState, sid) {
  const record = asObject(asObject(asObject(worldState).occupations)[String(sid)]);
  if (String(record.state) !== VASSALIZED_RUNG) return null;
  return typeof record.occupierId === 'string' && record.occupierId ? record.occupierId : null;
}

// ── (2) The legitimate remnant (A1.1.9) ──────────────────────────────────────

/**
 * THE LEGITIMATE SEAT UNDER AN OCCUPATION — the ruler the owner's directive names.
 *
 * A1.1.9 corrects §1 of the volume: conquest CONSUMES the old governing row into
 * the occupation administration (`installOccupationAuthority` cuts its power and
 * `transferRulingPower` then reshapes that same row into the occupier's
 * government), so after a conquest `governingFactionOf` answers the RELABELLED
 * OLD SEAT, and the "legitimate ruler" the directive contrasts the occupier with
 * exists nowhere except `previousGovernments`. This mints that missing party as
 * ONE exported law, consumed by D2's competing book, D4's aftermath, and D7's
 * liberation seating — never re-derived at three sites.
 *
 * The remnant is the strongest faction that is neither the crowned seat nor
 * marked as the occupier. Codepoint tiebreak on the display name (never
 * localeCompare — locale collation reorders non-ASCII names across machines and
 * would break replay).
 *
 * @param {import('./rulingPower.js').RulingPowerSettlement | null | undefined} settlement
 * @returns {import('./rulingPower.js').RulingFaction | null}
 */
export function legitimateRemnantOf(settlement) {
  const ps = asObject(asObject(settlement).powerStructure);
  const factions = Array.isArray(ps.factions)
    ? /** @type {import('./rulingPower.js').RulingFaction[]} */ (ps.factions)
    : [];
  const governing = governingFactionOf(settlement);
  /** @type {import('./rulingPower.js').RulingFaction | null} */
  let best = null;
  for (const faction of factions) {
    if (!faction || faction === governing) continue;
    // ⛔ THE OCCUPIER IS EXCLUDED BY ARCHETYPE, AND DELIBERATELY NOT BY MODIFIER.
    // The obvious second belt — `faction.modifiers.includes('occupier')` — was written
    // here and then REMOVED, because `scripts/check-observed-shape-readers.mjs` measured
    // it as a read of a key NO GENERATOR PRODUCES: `modifiers` is written only by the
    // SIM (applyWorldPulseOccupationAuthority mints the occupier row with it), so on a
    // freshly generated world that arm is dead and can only degrade to its default. The
    // estate already carries `modifiers on factions` as ACCEPTED DEBT in five files
    // (rulingPower, occupation, applyWorldPulseOccupationAuthority, ladderRead,
    // pdf/viewModel) and its ratchet law is "never add a file, never add an identity" —
    // so becoming the sixth to buy a redundant check was the wrong trade.
    // It IS redundant: the sim mints the occupier row with `category: 'occupation'`, and
    // `factionArchetype` reads category first, so the archetype test below catches every
    // occupier the estate actually produces.
    if (factionArchetype(faction) === A.OCCUPATION) continue;
    const name = nameOf(faction);
    if (!name) continue;
    if (best === null) { best = faction; continue; }
    const delta = num(faction.power) - num(best.power);
    if (delta > 0 || (delta === 0 && compareCodepoint(name, nameOf(best)) < 0)) best = faction;
  }
  return best;
}

// ── (3) The scalers ──────────────────────────────────────────────────────────

/**
 * Culture closeness between two settlements, in [0,1]. REUSES the constitutional
 * composite (§II.5-2: "culture is NOT ethnographic identity — it is a DERIVED
 * behavioural/economic SIMILARITY"); it does NOT mint an 11x11 heritage table,
 * which would need a new owner ruling (Q-S5, DEFERRED at dispatch).
 * @param {unknown} snapshot @param {unknown} worldState @param {string} a @param {string} b
 * @param {string|null} label the pair's relationship label, for the trade-tie term
 */
function closenessBetween(snapshot, worldState, a, b, label) {
  const itemA = itemFor(snapshot, a);
  const itemB = itemFor(snapshot, b);
  if (!itemA || !itemB) return 0;
  const tradeTie01 = label && Number.isFinite(TRADE_TIE[label]) ? TRADE_TIE[label] : 0;
  return clamp01(cultureAffinity(
    buildCultureVector(/** @type {Parameters<typeof buildCultureVector>[0]} */ (itemA), asObject(worldState)),
    buildCultureVector(/** @type {Parameters<typeof buildCultureVector>[0]} */ (itemB), asObject(worldState)),
    { tradeTie01 },
  ));
}

/**
 * Pairwise trade closeness in [0,1] — the strongest CONFIRMED P0 trade channel in
 * either direction on the pair. Suggested channels are excluded (they never
 * auto-confirm and a seat must not be seated by a guess).
 * @param {unknown} snapshot @param {string} a @param {string} b
 */
function tradeBetween(snapshot, a, b) {
  const graph = asObject(asObject(snapshot).regionalGraph);
  if (!Array.isArray(graph.channels)) return 0;
  let best = 0;
  for (const [from, to] of [[a, b], [b, a]]) {
    const channels = activeChannelsFrom(/** @type {Parameters<typeof activeChannelsFrom>[0]} */ (graph), from, {
      types: /** @type {string[]} */ (/** @type {unknown} */ (TRADE_CHANNEL_TYPES)),
    });
    for (const channel of channels) {
      if (String(asObject(channel).to) !== to) continue;
      best = Math.max(best, clamp01(num(Number(asObject(channel).strength), 0)));
    }
  }
  return best;
}

/**
 * The subordinating-treaty FLOOR: every term `patronId` is the obligee of over
 * `settlementId`, decayed by that treaty's worst compliance. Reuses hegemony's
 * closed `SUBORDINATING_TERM_TYPES` vocabulary and `treatyOrientationOf`'s
 * obligee/obligor resolution — the compact plane's own law, not a second reading.
 * @param {unknown} worldState @param {string} settlementId @param {string|null} patronId
 * @returns {{ floor01: number, ties: number, topPatronId: string|null }}
 */
function treatyFloorFor(worldState, settlementId, patronId) {
  const ledger = getSpatialLedger(/** @type {Record<string, unknown>} */ (asObject(worldState)), 'treaties');
  const rows = asObject(ledger);
  /** @type {Record<string, number>} */
  const byPatron = {};
  for (const key of Object.keys(rows).sort(compareCodepoint)) {
    const treaty = asObject(rows[key]);
    const orientation = treatyOrientationOf(treaty);
    if (!orientation || orientation.resolved !== true) continue;
    if (String(orientation.obligorId) !== settlementId) continue;
    const obligee = String(orientation.obligeeId || '');
    if (!obligee) continue;
    const terms = Array.isArray(treaty.terms) ? treaty.terms : [];
    for (const rawTerm of terms) {
      const term = asObject(rawTerm);
      if (!SUBORDINATING_TERM_TYPES.includes(String(term.type))) continue;
      const compliance = COMPLIANCE_SCALE[String(term.complianceState ?? 'honored')] ?? 1;
      byPatron[obligee] = (byPatron[obligee] || 0) + SEAT_TUNING.TREATY_TIE_STEP * compliance;
    }
  }
  if (patronId) {
    return { floor01: clamp01(byPatron[patronId] || 0), ties: 0, topPatronId: patronId };
  }
  // No named patron yet — the strongest obligee becomes the candidate seat.
  let topPatronId = null;
  let floor01 = 0;
  for (const id of Object.keys(byPatron).sort(compareCodepoint)) {
    if (byPatron[id] > floor01) { floor01 = byPatron[id]; topPatronId = id; }
  }
  return { floor01: clamp01(floor01), ties: topPatronId ? 1 : 0, topPatronId };
}

// ── (4) THE ONE SEAT READ ────────────────────────────────────────────────────

/**
 * `foreignSeatOf` — who looms over this settlement's ruler, and how hard.
 *
 * Resolution order (volume §3-D1, as ruled by A1.1.8):
 *   1. the occupations ledger at rung < vassalized  ⇒ regime `occupation`, PRIMACY;
 *   2. a vassal relationship edge on which this settlement is the junior, OR the
 *      `vassalized` rung                            ⇒ regime `vassalage`, weight;
 *   3. subordinating treaty ties alone              ⇒ regime `vassalage` capped at
 *      `present` — influence without a compact is pressure, not a seat.
 *
 * ⛔ MULTI-PATRON (A1.2.15): an occupation EXTINGUISHES rival seats. A town can be
 * occupied by one power and owe tribute to another; the occupier is the seat and
 * the creditor is not, though its REACTIONS still fire through D5. Where a single
 * substrate offers several candidates, the resolution is codepoint-first.
 *
 * ⚠ `stability01` IS DELIBERATELY ABSENT, AND THIS IS A CORRECTION TO THE VOLUME.
 * §3-D1 lists "the verbatim `stableVassalage` blend" among the scalers. That blend
 * is `0.34·trust + 0.28·pactStrength + 0.38·(1 − vassalStrain)`, and `vassalStrain`
 * (relationshipRulesCore.js:593) is `mean(vassalPressure.legitimacy, .trade,
 * .conflict, resentment)` — three of its four inputs come from the per-tick
 * PRESSURE INDEX, which a pure `(worldState, snapshot, id)` read does not have.
 * Reproducing it here would mean either threading a tick-scoped index into a pure
 * resolver or re-spelling `vassalStrain` from a different input set under the same
 * name — the second being precisely §711.6's failure (one name, two units, each
 * consumer internally consistent, nothing ever reds). So the blend STAYS where it
 * lives and is not forked; the seat read exposes `grip01` and the coup coupling
 * takes its legitimacy-side scaler at its own call site, where the index exists.
 * JUDGMENT — vetoable.
 *
 * @param {unknown} worldState
 * @param {unknown} snapshot
 * @param {string} settlementId
 * @returns {ForeignSeatView | null}
 */
export function foreignSeatOf(worldState, snapshot, settlementId) {
  const sid = String(settlementId || '');
  if (!sid) return null;

  const occupation = occupationRegimeOf(worldState, sid);

  // ── 1. OCCUPATION (primacy) ────────────────────────────────────────────────
  if (occupation.occupied && occupation.occupierId) {
    const patronId = occupation.occupierId;
    const rung = occupation.rung || OCCUPATION_RUNGS[0];
    const grip01 = clamp01((GRIP_SCALE[rung] ?? GRIP_SCALE.contested) * (1 - occupation.resistance));
    return seatView({
      regime: 'occupation',
      patronId,
      grip01,
      rung,
      basis: 'occupations_ledger',
      primacy: true,
      snapshot,
      worldState,
      sid,
      label: null,
    });
  }

  // ── 2. VASSALAGE ───────────────────────────────────────────────────────────
  // 2a. The matured occupation: the ledger row survives at `vassalized` (the sale
  //     machinery needs it) but the regime is vassalage, per A1.1.8.
  if (occupation.ledgerPresent && occupation.occupierId && !occupation.occupied) {
    const vassal = vassalageSeat(worldState, snapshot, sid, occupation.occupierId);
    if (vassal) return vassal;
    // The ladder topped out but no relationship edge carries the compact yet
    // (`vassalizationOutcomes` skips the relabel when no edge exists). The rung
    // itself is still a real compact; seat it at the treaty-only ceiling rather
    // than dropping the overlord entirely.
    return seatView({
      regime: 'vassalage',
      patronId: occupation.occupierId,
      grip01: SEAT_TUNING.TREATY_ONLY_CEILING,
      rung: VASSALIZED_RUNG,
      basis: 'occupation_rung_vassalized',
      primacy: false,
      snapshot,
      worldState,
      sid,
      label: 'vassal',
    });
  }

  // 2b. A vassal relationship edge on which this settlement is the junior.
  const edgeSeat = vassalageSeat(worldState, snapshot, sid, null);
  if (edgeSeat) return edgeSeat;

  // ── 3. TREATY TIES ALONE ───────────────────────────────────────────────────
  const treaty = treatyFloorFor(worldState, sid, null);
  if (treaty.topPatronId && treaty.floor01 > 0) {
    return seatView({
      regime: 'vassalage',
      patronId: treaty.topPatronId,
      grip01: Math.min(SEAT_TUNING.TREATY_ONLY_CEILING, treaty.floor01),
      rung: null,
      basis: 'treaty_subordinating_ties',
      primacy: false,
      snapshot,
      worldState,
      sid,
      label: null,
      ceiling: SEAT_TUNING.TREATY_ONLY_CEILING,
    });
  }

  return null;
}

/**
 * `foreignSeatCoupAdj` — D4's SUCCESS moment: the FIFTH signed additive term in
 * the coup verdict's `pHold` clamp.
 *
 * THE RULING, AND IT IS ONE DERIVATION FOR BOTH REGIMES (§711.6): **a foreign seat
 * defends the government it deals with.** An occupier crowned the sitting row
 * (conquest relabels the old governing faction rather than seating a separate one),
 * and an overlord's compact is written with that same sitting row — so a coup
 * threatens the arrangement in either regime, and the seat's weight lands on the
 * incumbent's side. The volume's "the seat backs OR RESISTS a challenger" is
 * satisfied by exactly this: resisting a challenger IS backing the incumbent.
 *
 * ⛔ THE CASE THIS DELIBERATELY DOES NOT MODEL is the seat that DISCARDS its
 * client. That is a typed STAKE in D11's intervention market (SEAT-8), where a
 * court weighs what it stands to gain from the chaos through its own believed
 * picture — not a sign a scalar here should be inventing. Choosing a signed
 * alignment here would have been a second, cheaper resolver for a quantity the
 * design already assigns elsewhere. JUDGMENT — vetoable.
 *
 * ⚠ WHERE IT ACTUALLY REACHES, STATED, because the obvious reading is wrong.
 * SEAT-1's own cure makes `coupSpawnGate` REFUSE a coup birth in a ledger-occupied
 * town when this flag is lit, so under occupation the stressor-born verdict is
 * mostly unreachable and this term's live population is VASSALAGE. The two layers
 * are consistent — force at spearpoint suppresses the plot before it forms, and
 * where it does form the seat leans on it — but a reader who assumed "this is the
 * occupation term" would mis-tune it.
 *
 * 0 when the flag is dark, when no seat resolves, or when the seat's weight is 0 ⇒
 * the verdict is byte-identical (the `interventionAdjFor` idiom verbatim).
 *
 * @param {unknown} worldState @param {unknown} snapshot @param {string} settlementId
 * @returns {number} signed, bounded by `SEAT_TUNING.COUP_PHOLD_WEIGHT`
 */
export function foreignSeatCoupAdj(worldState, snapshot, settlementId) {
  // ⛔ The positive `=== true` spelling is the engine-gated-key census's only
  // discoverable form; a negative-polarity early return is invisible to it.
  if (asObject(asObject(worldState).simulationRules).foreignSeatEnabled !== true) return 0;
  const seat = foreignSeatOf(worldState, snapshot, settlementId);
  if (!seat) return 0;
  return round4(SEAT_TUNING.COUP_PHOLD_WEIGHT * clamp01(seat.weight01));
}

/**
 * The vassalage arm: resolve the overlord from the relationship plane and blend
 * the grip from the compact's own numerics.
 *
 * ⛔ `patron` LABELS ARE DELIBERATELY EXCLUDED. The owner's directive (§735.2)
 * names "an occupied or vassal settlement"; the patron/client label is a softer
 * hierarchy with its own defaults (dependency 0.72 vs the vassal row's 0.82) and
 * seating it would widen the seat past the mandate. Recorded as a vetoable
 * exclusion rather than a silent omission.
 *
 * @param {unknown} worldState @param {unknown} snapshot @param {string} sid
 * @param {string|null} expectedPatronId when the occupation ladder already names one
 * @returns {ForeignSeatView | null}
 */
function vassalageSeat(worldState, snapshot, sid, expectedPatronId) {
  const states = asObject(asObject(worldState).relationshipStates);
  const shaped = asObject(snapshot);
  const edges = Array.isArray(asObject(shaped.regionalGraph).edges)
    ? /** @type {unknown[]} */ (asObject(shaped.regionalGraph).edges)
    : Array.isArray(shaped.relationships) ? /** @type {unknown[]} */ (shaped.relationships) : [];

  /** @type {{ patronId: string, relState: Record<string, unknown> } | null} */
  let best = null;
  for (const rawEdge of edges) {
    // ⛔ A NULL ELEMENT IS NOT AN EMPTY EDGE, AND THIS LEAF PROMISED IT WOULD NOT CRASH.
    // `normalizeRelationshipEdge(edge = {})` defaults only on `undefined`, so a literal
    // `null` in the edge array slips past the default and throws on `.relationshipType` —
    // and this file's own header promises "INERT-NOT-CRASH on absent/garbage ledgers". Found
    // by SEAT-4's garbage-ledger arm rather than by a reader; the seat resolver is now
    // reached from three passes (the seat books, the primacy axis, the reaction forecast),
    // and a throw here takes a whole pulse down rather than degrading one read.
    if (!rawEdge || typeof rawEdge !== 'object') continue;
    const edge = normalizeRelationshipEdge(rawEdge);
    const s = getRelationshipSettlements(edge);
    const from = String(s.from ?? '');
    const to = String(s.to ?? '');
    if (from !== sid && to !== sid) continue;
    const relState = ensureRelationshipState(edge, states[relationshipKeyFromEdge(rawEdge)]);
    if (String(relState?.relationshipType) !== 'vassal') continue;
    const roles = relationshipRoles(edge, relState);
    if (String(roles.juniorId) !== sid) continue;
    const patronId = String(roles.seniorId);
    if (expectedPatronId && patronId !== expectedPatronId) continue;
    // Codepoint-first on same-substrate multiplicity (A1.2.15).
    if (best === null || compareCodepoint(patronId, best.patronId) < 0) {
      best = { patronId, relState: asObject(relState) };
    }
  }
  if (!best) return null;

  const r = best.relState;
  const T = SEAT_TUNING;
  const grip01 = clamp01(
    T.VASSAL_LEVERAGE * clamp01(num(Number(r.leverage), 0))
    + T.VASSAL_DEPENDENCY * clamp01(num(Number(r.dependency), 0))
    + T.VASSAL_PACT * clamp01(num(Number(r.pactStrength), 0))
    + T.VASSAL_FEAR * clamp01(num(Number(r.fear), 0))
    - T.VASSAL_RESENTMENT * clamp01(num(Number(r.resentment), 0)) * (1 - clamp01(num(Number(r.fear), 0))),
  );
  // A subordinating treaty tie the SAME overlord holds raises the floor: the
  // compact plane and the diplomatic plane agreeing is strictly more hold than
  // either alone. The two never multiply — a floor, never a second scalar.
  const treaty = treatyFloorFor(worldState, sid, best.patronId);
  return seatView({
    regime: 'vassalage',
    patronId: best.patronId,
    grip01: Math.max(grip01, treaty.floor01),
    rung: null,
    basis: treaty.floor01 > grip01 ? 'vassal_edge_treaty_floor' : 'vassal_edge',
    primacy: false,
    snapshot,
    worldState,
    sid,
    label: 'vassal',
  });
}

/**
 * Apply the owner's three scaling signals and band the result. One place, so
 * `weight01` has exactly one derivation for both regimes (§711.6).
 * @param {{ regime: 'occupation'|'vassalage', patronId: string, grip01: number,
 *           rung: string|null, basis: string, primacy: boolean, snapshot: unknown,
 *           worldState: unknown, sid: string, label: string|null, ceiling?: number }} args
 * @returns {ForeignSeatView}
 */
function seatView({ regime, patronId, grip01, rung, basis, primacy, snapshot, worldState, sid, label, ceiling }) {
  const closeness01 = closenessBetween(snapshot, worldState, sid, patronId, label);
  const trade01 = tradeBetween(snapshot, sid, patronId);
  const T = SEAT_TUNING;
  const scaled = clamp01(grip01) * (T.BASE + T.CLOSENESS * closeness01 + T.TRADE * trade01);
  const weight01 = round4(clamp01(Number.isFinite(ceiling) ? Math.min(/** @type {number} */ (ceiling), scaled) : scaled));
  return {
    regime,
    patronSettlementId: patronId,
    weight01,
    band: bandFor(weight01),
    basis,
    grip01: round4(clamp01(grip01)),
    closeness01: round4(closeness01),
    trade01: round4(trade01),
    rung,
    primacy,
  };
}
