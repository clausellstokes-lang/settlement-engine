/**
 * engineRefusal.test.js — the engine service's code → refusal map (remote-path R3).
 * Every code it names is one the transport can reject with, and each maps to a registered
 * reason; the codes without a sentence of their own map to nothing.
 */
import { describe, it, expect } from 'vitest';
import { engineRefusalReason } from '../../src/lib/engineRefusal.js';
import { ENGINE_REMOTE_ERROR_CODES, ENGINE_VERSION_RETIRED_CODE } from '../../src/lib/engineRemote.js';
import { REFUSAL_REASONS, isRefusalReason } from '../../src/lib/refusalReasons.js';

describe('engineRefusalReason', () => {
  it('maps the three codes with a sentence of their own, each a member of the transport\'s vocabulary', () => {
    const mapped = ENGINE_REMOTE_ERROR_CODES.filter((code) => engineRefusalReason(code) != null);
    expect(mapped.sort()).toEqual(['engine_rate_limited', 'engine_unavailable', ENGINE_VERSION_RETIRED_CODE].sort());
    for (const code of mapped) expect(isRefusalReason(engineRefusalReason(code)), code).toBe(true);
    expect(engineRefusalReason('engine_rate_limited')).toBe(REFUSAL_REASONS.ENGINE_RATE_LIMITED);
    expect(engineRefusalReason('engine_unavailable')).toBe(REFUSAL_REASONS.ENGINE_UNAVAILABLE);
    expect(engineRefusalReason(ENGINE_VERSION_RETIRED_CODE)).toBe(REFUSAL_REASONS.ENGINE_VERSION_RETIRED);
  });

  it('the rest, and anything that is not a code, map to nothing', () => {
    for (const code of ['engine_refused', 'engine_reply_invalid', 'engine_remote_unsupported', undefined, null, 7, 'toString']) {
      expect(engineRefusalReason(code), String(code)).toBe(null);
    }
  });
});
