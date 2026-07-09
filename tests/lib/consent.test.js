/**
 * @vitest-environment jsdom
 *
 * consent.test.js — consent model v2 (the research OPT-OUT flip).
 *
 * Pins the flip's load-bearing behavior:
 *   - research now defaults ON (opt-out) unless DNT;
 *   - an explicit user choice (updatedAt > 0) is honored VERBATIM;
 *   - a record with updatedAt === 0 is treated as untouched → new default
 *     (this is what makes the "the user touched it" distinction real);
 *   - DNT is a hard override of BOTH tiers.
 *
 * The opt-out is SILENT: there is no first-run disclosure notice. The disclosure
 * lives only in PrivacySettings (Privacy & data) — see tests/ui/privacySettings.test.jsx.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  CONSENT_KEY, CONSENT_MODEL_VERSION,
  getConsent, setConsent, isClassAllowed,
} from '../../src/lib/consent.js';

function setDNT(on) {
  try { Object.defineProperty(navigator, 'doNotTrack', { value: on ? '1' : null, configurable: true }); } catch { /* ignore */ }
}

beforeEach(() => {
  localStorage.clear();
  setDNT(false);
});

describe('consent model v2 — research opt-out default', () => {
  it('research defaults ON (opt-out) for an untouched user', () => {
    const c = getConsent();
    expect(c.essential).toBe(true);
    expect(c.research).toBe(true);
    expect(c.ai_prose).toBe(false);
    expect(isClassAllowed('research', c)).toBe(true);
  });

  it('DNT is a hard override of both essential and research', () => {
    setDNT(true);
    const c = getConsent();
    expect(c.essential).toBe(false);
    expect(c.research).toBe(false);
    expect(isClassAllowed('research', c)).toBe(false);
    expect(isClassAllowed('essential', c)).toBe(false);
  });

  it('honors an explicit research opt-OUT verbatim (survives the flip)', () => {
    setConsent({ research: false });
    expect(getConsent().research).toBe(false);
    // Re-reading (as if after the default flipped) must not silently re-opt-in.
    expect(getConsent().research).toBe(false);
  });

  it('honors an explicit research opt-IN verbatim', () => {
    setConsent({ research: true });
    expect(getConsent().research).toBe(true);
  });

  it('toggling essential leaves research at the (default-on) stored value', () => {
    setConsent({ essential: false });
    const c = getConsent();
    expect(c.essential).toBe(false);
    expect(c.research).toBe(true); // the opt-out default was carried into the record
  });

  it('a stored record with updatedAt === 0 is treated as untouched → new default', () => {
    // No writer produces one today, but if one existed it must NOT masquerade as
    // an explicit choice (that would make the provenance distinction fake).
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, research: false, ai_prose: false, updatedAt: 0 }));
    expect(getConsent().research).toBe(true); // default applies, not the phantom false
  });

  it('setConsent stamps a positive updatedAt (marks the record as user-touched)', () => {
    const next = setConsent({ research: false });
    expect(next.updatedAt).toBeGreaterThan(0);
  });

  it('exposes CONSENT_MODEL_VERSION = 2', () => {
    expect(CONSENT_MODEL_VERSION).toBe(2);
  });
});
