/**
 * domain/worldPulse/patronExposure.js — IN-3, THE HOUSE PLAYS ITS OWN GAME: THE ORGANIC
 * EXPOSURE PRODUCER (docs/DESIGN_FP_ARCH_IN.md §4 IN-3 "the house sub-program stands whole";
 * docs/DESIGN_FP_INFORMATION.md §5 IN-3 (a); the survey's S13 gap).
 *
 * `brokeragePatronage.js :: projectPatronBindings` has always taken an `exposed` list, the
 * institution ids whose covert patronage the world has turned up, and nothing supplied one.
 * This leaf is that producer. A covert binding (an illegal house and the power it serves) is
 * EXPOSED while its host court's suspicion stands high enough that a keyed reading of the house
 * falls under the band's odds: one hash per (host, house), so the answer is stable while the
 * band holds, MONOTONE in the band (a house exposed at `pressing` stays exposed at `decisive`),
 * and fades as the evidence decays on its own laws. A sweep raises it through the same read,
 * because a caught watcher is a `spy_exposed` scar the suspicion read already counts.
 *
 * ZERO-DRAW (the `genesisPatronOf` idiom, a keyed hash, never a forked stream), NOTHING STORED
 * (exposure stays binary per read, J-INF-13; no key, no writer), DARK ⇒ NONE.
 *
 * ⛔ WHY THE WIRING LIVES HERE AND NOT IN `brokeragePatronage.js`: that module sits inside
 * `beliefMap.js`'s import closure (beliefMap imports the brokerage FEED, which imports it), and
 * this producer reads suspicion, which reads the belief gate. An import the other way would
 * close a cycle through the belief advance, so the projection is COMPOSED here instead and the
 * patronage module is left byte-identical.
 * @enforced-by tests/domain/counterIntelIn3.test.js
 */
import { compareCodepoint } from '../deterministicSort.js';
import { hash01 } from '../region/contestMath.js';
import { brokeragePatronBindings, projectPatronBindings } from './brokeragePatronage.js';
import { counterIntelActive, suspicionOf } from './suspicion.js';

/** @typedef {import('./brokeragePatronage.js').PatronBinding} PatronBinding */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * THE ODDS BY SUSPICION RANK (DRAFT register row; nothing signed): quiet and present expose
 * nothing, pressing some, decisive most. Rising by rank is what makes exposure monotone.
 */
export const PATRON_EXPOSURE_TUNING = Object.freeze({ oddsByRank: Object.freeze([0, 0, 0.35, 0.7]) });

/**
 * THE PRODUCER: the covert houses of one host whose patronage stands exposed now, in codepoint
 * order. Dark, or a host with no covert binding, none.
 * @param {{ worldState: unknown, snapshot: unknown, item: unknown, bindings?: readonly PatronBinding[]|null }} args
 * @returns {readonly string[]}
 */
export function exposedPatronInstitutions({ worldState, snapshot, item, bindings = null }) {
  if (!counterIntelActive(worldState)) return Object.freeze([]);
  const hostId = String(asObject(item).id ?? '');
  const rows = Array.isArray(bindings) ? bindings : brokeragePatronBindings({ worldState, item });
  const covert = rows.filter((row) => row && row.covert === true);
  if (!hostId || !covert.length) return Object.freeze([]);
  const reading = suspicionOf({ worldState, snapshot, settlementId: hostId });
  const odds = PATRON_EXPOSURE_TUNING.oddsByRank[reading.rank] ?? 0;
  const exposed = covert
    .filter((row) => hash01(`patron-exposure:${hostId}:${row.institutionId}`) < odds)
    .map((row) => String(row.institutionId));
  return Object.freeze([...new Set(exposed)].sort(compareCodepoint));
}

/**
 * THE PROJECTION, WIRED: the host's patron bindings projected for an audience with the producer
 * supplying `exposed` (`projectPatronBindings`' first non-test consumer is the Houses block).
 * @param {{ worldState: unknown, snapshot: unknown, item: unknown, audience?: string }} args
 * @returns {{ bindings: readonly PatronBinding[], exposed: readonly string[] }}
 */
export function projectedPatronBindingsFor({ worldState, snapshot, item, audience = 'dm' }) {
  const bindings = brokeragePatronBindings({ worldState, item });
  const exposed = exposedPatronInstitutions({ worldState, snapshot, item, bindings });
  return { bindings: projectPatronBindings(bindings, { audience, exposed }), exposed };
}
