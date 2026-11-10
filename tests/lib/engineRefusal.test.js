/**
 * engineRefusal.test.js — the engine service's code → refusal map (remote-path R3).
 * Every code it names is one the transport can reject with, and each maps to a registered
 * reason; the codes without a sentence of their own map to nothing.
 */
import { describe, it, expect } from 'vitest';
import { engineRefusalOf, engineRefusalReason, unsupportedWhat } from '../../src/lib/engineRefusal.js';
import { ENGINE_REMOTE_ERROR_CODES, ENGINE_VERSION_RETIRED_CODE } from '../../src/lib/engineRemote.js';
import { REFUSAL_REASONS, isRefusalReason } from '../../src/lib/refusalReasons.js';

describe('engineRefusalReason', () => {
  it('maps the three codes with a sentence of their own, each a member of the transport\'s vocabulary', () => {
    const mapped = ENGINE_REMOTE_ERROR_CODES.filter((code) => engineRefusalReason(code) != null);
    expect(mapped.sort()).toEqual(['engine_rate_limited', 'engine_remote_unsupported', 'engine_unavailable', ENGINE_VERSION_RETIRED_CODE].sort());
    for (const code of mapped) expect(isRefusalReason(engineRefusalReason(code)), code).toBe(true);
    expect(engineRefusalReason('engine_rate_limited')).toBe(REFUSAL_REASONS.ENGINE_RATE_LIMITED);
    expect(engineRefusalReason('engine_unavailable')).toBe(REFUSAL_REASONS.ENGINE_UNAVAILABLE);
    expect(engineRefusalReason(ENGINE_VERSION_RETIRED_CODE)).toBe(REFUSAL_REASONS.ENGINE_VERSION_RETIRED);
  });

  it('the rest, and anything that is not a code, map to nothing', () => {
    for (const code of ['engine_refused', 'engine_reply_invalid', undefined, null, 7, 'toString']) {
      expect(engineRefusalReason(code), String(code)).toBe(null);
    }
  });

  it('FU-3: an unsupported request names what was asked for, once each, in a fixed order; or nothing', () => {
    expect(unsupportedWhat(['contentEnvironment'], 'campaign')).toBe('inside a campaign');
    expect(unsupportedWhat(['contentEnvironment'], 'standalone')).toBe('with your own content');
    expect(unsupportedWhat(['customContent', 'contentTunables', 'contentEnvironment'], 'standalone')).toBe('with your own content');
    expect(unsupportedWhat(['contentEnvironment', 'neighbour'], 'campaign')).toBe('beside an imported neighbour and inside a campaign');
    expect(unsupportedWhat(['section'], null)).toBe(null);
    expect(engineRefusalOf({ code: 'engine_remote_unsupported', inputs: ['seed'] })).toBe(null);
    expect(engineRefusalOf({ code: 'engine_remote_unsupported', inputs: ['neighbour'] }))
      .toEqual({ reason: REFUSAL_REASONS.ENGINE_UNSUPPORTED, vars: { what: 'beside an imported neighbour' } });
    expect(engineRefusalOf({ code: 'engine_rate_limited' })).toEqual({ reason: REFUSAL_REASONS.ENGINE_RATE_LIMITED, vars: null });
  });
});
