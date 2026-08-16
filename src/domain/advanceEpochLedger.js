/**
 * advanceEpochLedger.js — THE ADVANCE-EPOCH LEDGER (docs/DESIGN_FP_ARCH_EP.md §3b.1a,
 * §3b.1b; wave EP-3 slice A).
 *
 * THE CLASS THIS LEAF EXISTS TO CLOSE. Freshening only the pulse ROOT ships a "fresh
 * future" whose weather, road cadence, succession contests, city demographic responses and
 * sovereignty-market buyers are bit-for-bit the OLD future — because those draws never
 * touch the pulse `rng`. They compose their own keys from `worldState.rngSeed` DIRECTLY.
 * Re-rooting them needs the advance's epoch at sites that are five module boundaries away
 * from the argument it arrives on, and the only thing every one of them already holds is
 * THE WORLD. So the epoch is STAMPED onto the world the calendar advance produced, and the
 * far sites read it back off the world they were handed.
 *
 * ⛔ A PLAIN `src/domain/` LEAF, NOT UNDER `worldPulse/` OR `spatial/`, and the reason is
 * layering rather than convenience: this is SUBSTRATE, and its importers span THREE sibling
 * directories (`worldPulse/`, `traditions/`, `townMap/`), so its correct home is their
 * parent. ONE leaf for all its symbols, because `pulseKernel.js` needs the writer AND (at
 * slice B) the year accessor, and two leaves would cost TWO import lines on a file banked
 * at tolerance zero in both directions.
 *
 * ⛔ THE SINGLE-WRITER LAW. `stampAdvanceEpochYear` is the ONLY writer of
 * `spatialLedgers.advanceEpoch`, anywhere in `src`. A second writer is enforced against by
 * a source scan with a planted control (tests/lint/advanceEpochSingleWriter.walker.test.js),
 * not by convention.
 *
 * ⭐ THE LEDGER SHAPE — conditionally materialized, drop-when-absent, JSON scalars only:
 *
 *   worldState.spatialLedgers.advanceEpoch = {
 *     latest: { tick: <the tick this stamp was written at>, epoch: '<epoch>' },  // slice A
 *     // byYear: { '<canonical 1-based year>': '<epoch>' },                      // slice B
 *   }
 *
 * ⭐⭐ WHY `latest` IS NOT A FOURTH FLAG-DARK LEAK SURFACE, and it is closed BY CONSTRUCTION
 * rather than by a fourth flag read. `latest` carries the tick it was written at, and
 * `tickStreamSeedOf` selects it ONLY when `latest.tick === worldState.tick`. A dark tick
 * writes nothing (the `!epochTerm` guard returns first), and the next composed tick is
 * always `startingWorldState.tick + 1` — so a stamp written under a lit flag becomes
 * UNREADABLE the moment the flag goes dark, without any gate down here. That property is
 * the whole reason this is `latest` and not the `current` J-EP-12 struck.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation.
 */

import { getSpatialLedger, setSpatialLedger } from './spatial/spatialLedgerAccess.js';
import { epochSuffix } from '../kernel/prng.js';

/** @typedef {{ latest?: { tick?: number, epoch?: string } }} AdvanceEpochLedger */

/** The ledger's namespace key inside `spatialLedgers`. One spelling, one home. */
const LEDGER_KEY = 'advanceEpoch';

/** A finite integer, or the fallback. Local so this leaf carries no cross-module edge. */
function num(/** @type {unknown} */ value, /** @type {number} */ fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** A world-shaped object, or an empty one. Never throws on a null world. */
function asObject(/** @type {unknown} */ value) {
  return /** @type {Record<string, unknown>} */ (value && typeof value === 'object' ? value : {});
}

/**
 * THE ONE WRITER of `spatialLedgers.advanceEpoch`. Called ONCE per tick, immediately after
 * the calendar advances (`pulseKernel.js` seam edit 9), and NEVER anywhere else.
 *
 * ⛔ DARK RETURNS FIRST, and that ordering is the dormancy property every fence asserts:
 * `setSpatialLedger` CREATES the `spatialLedgers` namespace when it is absent, so the
 * `!epochTerm` guard being the first statement is what makes an aspatial dark world come
 * out of a multi-tick advance with no `spatialLedgers` key at all. Returning the IDENTICAL
 * reference dark also means a dark tick allocates nothing here.
 *
 * ⚠ IT KEYS ON `epochTerm` — THE FLAG-GATED TERM — NEVER ON THE RAW THREADED VALUE. A
 * stamp guarded on the raw value would leave every stream assertion green while minting a
 * brand-new top-level serialized key into a flag-dark world's persisted state, which is
 * strictly worse than the same defect at the pulse record because this one creates a
 * namespace that was not there.
 *
 * @param {Record<string, unknown>} worldState the world the calendar advance just produced
 * @param {string|null} epochTerm the FLAG-GATED advance epoch, or null
 * @returns {Record<string, unknown>} the stamped world, or the IDENTICAL reference when dark
 */
export function stampAdvanceEpochYear(worldState, epochTerm) {
  if (!epochTerm) return worldState;
  const tick = num(asObject(worldState).tick, 0);
  return setSpatialLedger(worldState, LEDGER_KEY, { latest: { tick, epoch: String(epochTerm) } });
}

/**
 * THE FAMILY-1 ACCESSOR. Returns the calling site's OWN seed expression, with THIS TICK's
 * epoch appended when — and only when — the world carries a stamp written at the tick the
 * world is actually at.
 *
 * ⭐ THE CURRENT-TICK SELECTION RULE, and it is the whole of the dark contract down here:
 * `latest` is selected ONLY when `latest.tick === worldState.tick`. NO FLAG IS READ HERE
 * and none is needed — the tick equality IS the gate (see the header).
 *
 * ⛔⛔ `base` IS THE SITE'S OWN COERCION, HANDED IN — IT IS NOT RE-IMPLEMENTED HERE, AND
 * THAT IS A CORRECTION TO THE VOLUME'S SKETCHED SIGNATURE RATHER THAN A CONVENIENCE.
 * §3b.3 requires each re-rooted site to reproduce its own absent-seed coercion
 * CHARACTER-FOR-CHARACTER, and the volume's `{ absent }` shape — `String(raw)` for any
 * string-or-number, else `absent` — cannot do it for five of the six sites. Measured
 * against the volume's own per-site notes: `String(v || '')` renders `0` as `''` and the
 * sketch renders it `'0'`; the demographics site's typeof-STRING guard renders a numeric
 * seed as `'realm'` and the sketch renders it `'123'`; `text(v) || 'realm'` renders an
 * EMPTY-STRING seed as `'realm'` and the sketch renders it `''`. Two of those three
 * divergences are stated as requirements in the volume's own re-root table, so the sketch
 * contradicts its own spec. Taking the site's expression as an ARGUMENT makes the
 * byte-verbatim rule structural: the coercion is the one already at the site, unmoved and
 * unretyped, and the dark arm returns it by IDENTITY — same value, same type — so dark
 * byte-identity is a property of the code rather than a claim about a transcription.
 *
 * ⚠ THE RETURN TYPE IS `T | string` AND THAT IS NOT A LOOSE SPELLING — it is the dark/lit
 * split stated in the type system. Dark, the site gets ITS OWN expression back with its own
 * type (a string site stays a string, a raw-read site stays whatever it read, which is what
 * keeps a `||`-chain branching as it does today); lit, it gets a composed string. Typing
 * this `any` would have said neither, and this module carries a zero any-hole allowance.
 *
 * @template T
 * @param {Record<string, unknown>} worldState the world the CALLING STAGE received
 * @param {{ base: T }} opts `base` — the site's OWN seed expression, REQUIRED, no default
 * @returns {T | string} `base` verbatim, or `` `${base}${epochSuffix(epoch)}` `` when a
 *   current-tick stamp is present
 */
export function tickStreamSeedOf(worldState, { base }) {
  const ledger = /** @type {AdvanceEpochLedger|undefined} */ (getSpatialLedger(worldState, LEDGER_KEY));
  const latest = ledger?.latest || null;
  // STALE OR ABSENT ⇒ VERBATIM. Returning `base` itself (not a re-stringified copy) is what
  // keeps a dark `||`-chain site — where the raw value's TYPE decides the branch — identical.
  if (!latest || latest.tick !== num(asObject(worldState).tick, -1)) return base;
  return `${base}${epochSuffix(latest.epoch)}`;
}
