/**
 * lib/engineRefusal.js — WHICH OF THE ENGINE SERVICE'S FAILURES HAS A SENTENCE OF ITS OWN.
 *
 * The remote transport rejects with a typed code (`lib/engineRemote.js ::
 * ENGINE_REMOTE_ERROR_CODES`). Three of them are said as their own refusal rather than the
 * generic "The forge stalled … Try once more", because that advice is false for each:
 *   engine_version_retired → ENGINE_VERSION_RETIRED (only a reload cures it; ENGINE-3)
 *   engine_rate_limited    → ENGINE_RATE_LIMITED    (a limit, not a failure; waiting cures it)
 *   engine_unavailable     → ENGINE_UNAVAILABLE     (not reached; nothing lost; the connection first)
 * (the last two: remote-path R3, 2026-11-10). This is the ONE map: the generation lane, the
 * section-regeneration lane and the hero's own catch all read it, so a surface cannot say a
 * code differently from the lane that recorded it.
 *
 * The codes are spelled here, not imported, so the lanes that read this never pull the remote
 * leaf; `tests/lib/engineRefusal.test.js` holds each spelling to the transport's vocabulary.
 */
import { REFUSAL_REASONS } from './refusalReasons.js';

/** @type {Readonly<Record<string, string>>} */
const ENGINE_CODE_REASONS = Object.freeze({
  engine_version_retired: REFUSAL_REASONS.ENGINE_VERSION_RETIRED,
  engine_rate_limited: REFUSAL_REASONS.ENGINE_RATE_LIMITED,
  engine_unavailable: REFUSAL_REASONS.ENGINE_UNAVAILABLE,
});

/** Every reason an engine service failure may be said as. @type {ReadonlyArray<string>} */
export const ENGINE_REFUSAL_REASONS = Object.freeze([...new Set(Object.values(ENGINE_CODE_REASONS))]);

/**
 * The reason an engine service failure is said as, or null when its code has no sentence of
 * its own (the generic failure then speaks).
 * @param {unknown} code the rejection's `code`
 * @returns {string|null}
 */
export function engineRefusalReason(code) {
  return typeof code === 'string' && Object.hasOwn(ENGINE_CODE_REASONS, code)
    ? ENGINE_CODE_REASONS[code]
    : null;
}
