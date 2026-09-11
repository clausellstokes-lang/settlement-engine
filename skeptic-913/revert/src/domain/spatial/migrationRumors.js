/**
 * migrationRumors.js — D-0 (deep-couplings): THE MIGRATION RUMOR CARRIER assembly.
 *
 * Refugee columns become the third mover-carried rumor lane (beside armies and smuggle
 * runs) — migration stops being the world's only silent mover (DESIGN_DEEP_COUPLINGS §4).
 * This leaf assembles the carrier PARAMS that pulseKernel feeds to advanceRumorLedgers;
 * pulseKernel is FROZEN at its effective-line ceiling, so the assembly lives OUT here
 * (a name-swap in the kernel — the old inline army/smuggle builders move here verbatim, and
 * the refugee lane is the addition). The rumor SINGLE WRITER (advanceRumorLedgers) is
 * unchanged in ownership — these are INPUTS to it; D-0 adds zero writers.
 *
 * TWO refugee-lane products, both gated on the virtual `migrationRumorsEnabled` flag:
 *   (a) migrantPaths — the in-flight columns' [origin, destination] legs, fed into the
 *       rumor relay fan-out (RUMOR_CARRIER_REFUGEE): a column carries the news of the towns
 *       it crosses, exactly as an army/smuggle run does.
 *   (b) flightEntries — the columns THEMSELVES as `migration_flight` rumor EVENTS (feed
 *       entries the seeder ingests at the origin+destination witnesses with standard
 *       lineage/fidelity/decay). BANDED magnitude (small/notable/exodus — never the exact
 *       count; rumor physics), the eventKey encodes origin/dest/departTick so the D-1
 *       demographic axis can recover the direction (origin emptying, destination swelling).
 *
 * THE PRE-DRAIN READ (DESIGN_DEEP_COUPLINGS §16 hazard): the migration RELEASE pass drains
 * the due (arrived-this-tick) columns EARLY, before the rumor pass runs, so the columns are
 * read from the PRE-DRAIN state (startingWorldState) — a column completing its journey this
 * tick still carries news on its final leg. The army/smuggle ledgers, by contrast, are read
 * from the post-apply carrier state (byte-identical to the inline builders they replace).
 *
 * LAG (DESIGN_DEEP_COUPLINGS law 14): migration DISPATCHES after the rumor pass, so a
 * column's first relay/event lands the NEXT tick — news travels behind the column.
 *
 * DORMANT (flag absent / no columns afield) ⇒ migrantPaths null + flightEntries [] ⇒
 * advanceRumorLedgers behaves byte-identically to the pre-D-0 engine (the refugee lane never
 * fires, no new feed entries seed). PURE + lazy: no Date, no Math.random, no store/React.
 */

import { armyTransitLedger } from './armyTransit.js';
import { getSpatialLedger, hasSpatialLedger } from './distanceRead.js';
import { RUMOR_NOTABLE_SCORE_FLOOR } from './rumorNetwork.js';
import { compareCodepoint } from '../deterministicSort.js';

/** Migration-flight magnitude bands (retuned in the checkpoint soak; DESIGN_DEEP_COUPLINGS
 *  does not owner-gate D-0 tuning). A column's arrivals count → a banded, classed rumor: the
 *  net never carries the exact head-count, only "a small departure / a notable displacement /
 *  an exodus". The severity maps through magnitudeBandOf to the content magnitude band (1..3);
 *  exodus is realm-shaking ⇒ 'major' (4 relay hops), the rest 'notable' (2). */
export const MIGRATION_RUMOR_TUNING = Object.freeze({
  EXODUS_FLOOR: 300,
  NOTABLE_FLOOR: 80,
});

/** The migration-rumor gate (DESIGN_DEEP_COUPLINGS law 1 idiom — the virtual flag, absent from
 *  DEFAULT_SIMULATION_RULES ⇒ dark everywhere until the owner lights it at THE ONE REGEN).
 *  @param {Record<string, unknown> | null | undefined} rules @returns {boolean} */
export function migrationRumorsActive(rules) {
  return !!(rules && typeof rules === 'object' && rules.migrationRumorsEnabled === true);
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/**
 * Classify a column's survivor count into a banded flight event (significance / score /
 * severity / reasonClass). The reasonClass is a DM-flavour class derived from the band (the
 * in-flight column ledger carries no reason field); the player projection value-scrubs it.
 * @param {number} arrivals @returns {{ significance: 'major'|'notable', score: number, severity: number, reasonClass: string }}
 */
function flightBand(arrivals) {
  const T = MIGRATION_RUMOR_TUNING;
  if (arrivals >= T.EXODUS_FLOOR) {
    return { significance: 'major', score: 82, severity: 0.85, reasonClass: 'exodus' };
  }
  if (arrivals >= T.NOTABLE_FLOOR) {
    return { significance: 'notable', score: 66, severity: 0.6, reasonClass: 'displacement' };
  }
  // Below the notable floor: a modest departure that BARELY enters the net (the significance
  // gate needs score >= RUMOR_NOTABLE_SCORE_FLOOR); a smaller trickle would fall below it.
  return { significance: 'notable', score: RUMOR_NOTABLE_SCORE_FLOOR, severity: 0.35, reasonClass: 'departure' };
}

/** A tolerant in-flight column read (the migration.js MigrationColumn shape). @param {unknown} rec */
function columnOf(rec) {
  if (!rec || typeof rec !== 'object' || Array.isArray(rec)) return null;
  const r = /** @type {Record<string, unknown>} */ (rec);
  const originId = String(r.originId ?? '');
  const destId = String(r.destId ?? '');
  const arrivals = Math.max(0, Math.floor(finiteNumber(r.arrivals, 0)));
  if (!originId || !destId || originId === destId || arrivals <= 0) return null;
  return { originId, destId, arrivals, departTick: Math.max(0, Math.floor(finiteNumber(r.departTick, 0))) };
}

/** The `migration_flight` feed entry for one in-flight column — the column as a rumor EVENT.
 *  eventKey `migration.${originId}.${destId}.${departTick}` (the D-1 axis recovers direction
 *  from it against the two witnesses). Witnesses at BOTH endpoints (origin sees the exodus,
 *  destination the arriving column). @param {{ originId: string, destId: string, arrivals: number, departTick: number }} col */
function flightEntryFor(col) {
  const band = flightBand(col.arrivals);
  const eventKey = `migration.${col.originId}.${col.destId}.${col.departTick}`;
  return {
    id: eventKey,
    sourceEventId: eventKey,
    tick: col.departTick,
    significance: band.significance,
    score: band.score,
    severity: band.severity,
    scope: 'regional',
    impactKind: 'migration_flight',
    settlementIds: [col.originId, col.destId],
    causeClass: band.reasonClass,
    tags: [],
  };
}

/**
 * @typedef {{ carrierState: Record<string, unknown>, migrationState: Record<string, unknown>,
 *   rules: Record<string, unknown> | null | undefined }} CarrierParamsArgs
 */

/**
 * Assemble the rumor-carrier params for advanceRumorLedgers: the army + smuggle mover paths
 * (read from the post-apply carrier state — byte-identical to the inline builders this
 * replaces) and, behind migrationRumorsEnabled, the refugee lane (migrantPaths + the
 * migration_flight feed entries, read from the PRE-DRAIN migration state).
 * @param {CarrierParamsArgs} args
 * @returns {{ armyPaths: Array<string[]> | null, smugglePaths: Array<string[]> | null,
 *   migrantPaths: Array<string[]> | null, flightEntries: Array<Record<string, unknown>> }}
 */
export function rumorCarrierParams({ carrierState, migrationState, rules }) {
  // M5 army carrier: the prior-tick in-transit armies' routes (empty when none afield ⇒ the
  // army lane is dormant ⇒ byte-identical). Verbatim from the former pulseKernel inline builder.
  const transitLedger = armyTransitLedger(carrierState);
  const armyPaths = transitLedger
    ? Object.keys(transitLedger).sort().map((id) => transitLedger[id].path).filter((p) => Array.isArray(p) && p.length > 1)
    : null;
  // M7 criminal carrier: this tick's SMUGGLE runs on the supplyShipments ledger relay news
  // between the towns they run — a [source, destination] leg per run. Verbatim (incl. the
  // empty ⇒ null normalization the former call site applied).
  const shipLedger = /** @type {Record<string, { smuggle?: unknown, sourceId?: unknown, settlementId?: unknown }> | null} */ (
    getSpatialLedger(carrierState, 'supplyShipments'));
  const smugglePathsRaw = shipLedger
    ? Object.keys(shipLedger).sort().map((k) => shipLedger[k])
        .filter((r) => r && r.smuggle === true && r.sourceId && r.settlementId && String(r.sourceId) !== String(r.settlementId))
        .map((r) => [String(r.sourceId), String(r.settlementId)])
    : null;
  const smugglePaths = smugglePathsRaw && smugglePathsRaw.length ? smugglePathsRaw : null;

  // D-0 refugee carrier (gated). Read the migration columns PRE-DRAIN (startingWorldState):
  // the due columns were drained from the post-apply carrier state by the early release pass.
  /** @type {Array<string[]> | null} */
  let migrantPaths = null;
  /** @type {Array<Record<string, unknown>>} */
  const flightEntries = [];
  if (migrationRumorsActive(rules)) {
    const migLedger = hasSpatialLedger(migrationState, 'migration')
      ? /** @type {Record<string, unknown> | null} */ (getSpatialLedger(migrationState, 'migration'))
      : null;
    if (migLedger && typeof migLedger === 'object' && !Array.isArray(migLedger)) {
      /** @type {Array<{ originId: string, destId: string, arrivals: number, departTick: number }>} */
      const cols = [];
      for (const key of Object.keys(migLedger).sort(compareCodepoint)) {
        const col = columnOf(/** @type {Record<string, unknown>} */ (migLedger)[key]);
        if (col) cols.push(col);
      }
      if (cols.length) {
        migrantPaths = cols.map((c) => [c.originId, c.destId]);
        for (const c of cols) flightEntries.push(flightEntryFor(c));
      }
    }
  }
  return { armyPaths, smugglePaths, migrantPaths, flightEntries };
}
