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
  engine_remote_unsupported: REFUSAL_REASONS.ENGINE_UNSUPPORTED,
});

/**
 * What an `engine_remote_unsupported` request asked for, as COPY KEYS (never words: the words live
 * under `refusals.engineUnsupported.what` in copy/en.js, where the style walker and a translator
 * look), from the refusal's own `inputs` and `scope` (remote-path FU-3). The order is fixed —
 * neighbour, content, campaign — and a key appears once. `contentEnvironment` is a campaign's
 * settlement when its scope is 'campaign', and the account's custom content otherwise.
 * RefusalNotice resolves the keys and joins them with `refusals.engineUnsupported.join`.
 * @param {unknown} inputs
 * @param {unknown} scope
 * @returns {string[]|null} null when no input is one the reader can be told about
 */
export function unsupportedWhatKeys(inputs, scope) {
  const asked = new Set(Array.isArray(inputs) ? inputs : []);
  const customContent = asked.has('customContent') || asked.has('contentTunables')
    || (asked.has('contentEnvironment') && scope !== 'campaign');
  const keys = [
    asked.has('neighbour') ? 'neighbour' : null,
    customContent ? 'customContent' : null,
    asked.has('contentEnvironment') && scope === 'campaign' ? 'campaign' : null,
  ].filter(Boolean).map((k) => `refusals.engineUnsupported.what.${k}`);
  return keys.length ? keys : null;
}

/**
 * The refusal record an engine service failure is said as — `{ reason, vars }` — or null when
 * it has no sentence of its own (the generic failure then speaks). An unsupported request whose
 * inputs name nothing a reader asked for (a bad section, a non-string seed) is null too.
 * @param {unknown} error the rejection
 * @returns {{ reason: string, vars: Record<string, string|string[]>|null }|null}
 */
export function engineRefusalOf(error) {
  const err = /** @type {{ code?: unknown, inputs?: unknown, scope?: unknown }|null|undefined} */ (error);
  const reason = engineRefusalReason(err?.code);
  if (!reason) return null;
  if (reason !== REFUSAL_REASONS.ENGINE_UNSUPPORTED) return { reason, vars: null };
  const what = unsupportedWhatKeys(err?.inputs, err?.scope);
  return what ? { reason, vars: { what } } : null;
}

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
