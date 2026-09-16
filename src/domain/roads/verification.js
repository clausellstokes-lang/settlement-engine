/**
 * roads/verification.js — §11b R-8 PURPOSE 7 RUMOR VERIFICATION (ENGINE LIFT #5;
 * DESIGN_THE_ROADS.md §11b). A lazy leaf: the genesis-side plan (what to verify, where) and the
 * RETURN-side write (LAW 6 write g — the home rumour ledger gains a freshness/fidelity boost for
 * the verified events). This promotes the coherence-mandate seed archetype — traveller-writes-
 * rumour — from a loop candidate to a first-class purpose. Pure, deterministic.
 *
 * DORMANCY: verification only PLANS when beliefs are live (beliefsActive — a non-omniscient
 * infoMode over a spatial canon), and only WRITES when a verification mission returns home. An
 * omniscient / dark world plans nothing and writes nothing ⇒ byte-identical.
 *
 * @enforced-by tests/domain/roadsEmbassy.test.js (verification block)
 */
import { getSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive } from '../worldPulse/beliefMap.js';
import { relationshipTypeBetween } from './embassyHazard.js';
import { ROADS_TUNING, asObject, num, clamp01, cmp } from './state.js';

/** A rung this un-trusted is not a "more trusted source" to confirm a rumour at. */
const UNTRUSTED_RUNGS = new Set(['rival', 'cold_war', 'hostile']);

/**
 * A rumour-verification PLAN for `sid`: the codepoint-first low-fidelity, already-arrived rumour
 * subject worth confirming, paired with a TRUSTED trade-reachable source to confirm it at. Null
 * when beliefs are dormant, no such rumour stands, or no trusted source is in range. Pure.
 * @param {Record<string, unknown>} worldState @param {Record<string, unknown>} graph @param {string} sid
 * @param {Array<{ dest: string, hopWeeksOut: number }>} inRange @param {number} now
 * @returns {{ dest: string, hopWeeksOut: number, subject: string }|null}
 */
export function findVerifyPlan(worldState, graph, sid, inRange, now) {
  if (!beliefsActive(worldState)) return null;
  const trusted = inRange.filter((c) => !UNTRUSTED_RUNGS.has(relationshipTypeBetween(graph, worldState, sid, c.dest)));
  if (!trusted.length) return null;
  const ledger = asObject(asObject(getSpatialLedger(/** @type {never} */ (worldState), 'rumorLedgers'))[String(sid)]);
  const ceil = ROADS_TUNING.VERIFY_FIDELITY_CEIL;
  let subject = '';
  for (const key of Object.keys(ledger).sort(cmp)) {
    const rec = asObject(ledger[key]);
    if (num(rec.arrivalTick, Infinity) > now) continue; // not yet known
    if (num(rec.completeness01, 1) >= ceil && num(rec.accuracy01, 1) >= ceil) continue; // already sure
    const where = String(asObject(rec.content).whereId || '');
    if (where && where !== sid) { subject = where; break; }
  }
  if (!subject) return null;
  const pick = trusted.find((c) => c.dest !== subject) || trusted[0];
  return { dest: pick.dest, hopWeeksOut: pick.hopWeeksOut, subject };
}

/**
 * THE RETURN-SIDE RUMOUR WRITE (§11b, LAW 6 write g): raise the home ledger's records ABOUT
 * `subjectId` to a confirmed fidelity + refresh their arrival (a trusted source confirmed them).
 * Records that DON'T implicate the subject, and records already fresh+sure, are untouched.
 * Returns a NEW rumorLedgers object, or null when nothing changed. Pure.
 * @param {Record<string, unknown>} rumorLedgers @param {string} homeId @param {string} subjectId @param {number} now
 * @returns {Record<string, unknown>|null}
 */
export function boostHomeRumorFidelity(rumorLedgers, homeId, subjectId, now) {
  const ledgers = asObject(rumorLedgers);
  const ledger = asObject(ledgers[String(homeId)]);
  if (!Object.keys(ledger).length) return null;
  const boost = clamp01(ROADS_TUNING.VERIFY_BOOST01);
  /** @type {Record<string, unknown>} */
  const nextLedger = {};
  let changed = false;
  for (const key of Object.keys(ledger)) {
    const rec = asObject(ledger[key]);
    const content = asObject(rec.content);
    const implicates = String(content.whereId || '') === String(subjectId)
      || (Array.isArray(content.partyIds) && content.partyIds.map(String).includes(String(subjectId)));
    if (implicates && (num(rec.completeness01, 1) < boost || num(rec.accuracy01, 1) < boost || num(rec.arrivalTick, 0) < now)) {
      nextLedger[key] = { ...rec, completeness01: boost, accuracy01: boost, arrivalTick: now };
      changed = true;
    } else {
      nextLedger[key] = rec;
    }
  }
  return changed ? { ...ledgers, [String(homeId)]: nextLedger } : null;
}
