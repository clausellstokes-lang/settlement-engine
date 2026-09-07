/**
 * @vitest-environment jsdom
 *
 * consent.test.js — consent model v3 (the person-adjacent split, §359.6).
 *
 * ⚠ RE-POINTED FROM v2, DELIBERATELY. This file previously pinned v2's research
 * OPT-OUT (`research` defaulting ON). §359.6 rules anything person-adjacent OFF by
 * default, so `research` returns to opt-IN and the v2 expectations here are now
 * WRONG BY RULING, not by regression. Every changed assertion is a declared
 * re-point with that cause, never a silent re-record. The v2 arms that survive
 * unchanged are the ones that were never about the default's direction.
 *
 * Pins the split's load-bearing behavior:
 *   - research now defaults OFF (opt-IN), joining ai_prose and market;
 *   - essential is unchanged and stays ON unless DNT (chair C1) — it is the
 *     product's own operation, not a person-adjacent capture;
 *   - an explicit user choice (updatedAt > 0) is honored VERBATIM **in both
 *     directions** — a v2-era opt-IN survives the flip exactly as a v2-era
 *     opt-OUT survived the last one;
 *   - a record with updatedAt === 0 is treated as untouched → new default
 *     (this is what makes the "the user touched it" distinction real);
 *   - DNT is a hard override of every trackable tier.
 *
 * The flip is SILENT: there is no first-run disclosure notice. The disclosure
 * lives only in PrivacySettings (Privacy & data) — see tests/ui/privacySettings.test.jsx.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  CONSENT_KEY, CONSENT_MODEL_VERSION, MARKET_INSIGHTS_DEFAULT, CONSENT_TIERS,
  getConsent, setConsent, isClassAllowed,
} from '../../src/lib/consent.js';

function setDNT(on) {
  try { Object.defineProperty(navigator, 'doNotTrack', { value: on ? '1' : null, configurable: true }); } catch { /* ignore */ }
}

beforeEach(() => {
  localStorage.clear();
  setDNT(false);
});

describe('consent model v3 — the person-adjacent split', () => {
  // A1 — the untouched user. RE-POINTED: v2 asserted research true here.
  it('every person-adjacent plane defaults OFF for an untouched user; essential stays ON', () => {
    const c = getConsent();
    expect(c.essential).toBe(true);   // C1: unchanged by the split
    expect(c.research).toBe(false);   // §359.6: person-adjacent ⇒ OFF
    expect(c.ai_prose).toBe(false);
    expect(c.market).toBe(false);
    expect(isClassAllowed('research', c)).toBe(false);
    expect(isClassAllowed('essential', c)).toBe(true);
  });

  // A3 — DNT. Unchanged from v2 except that it now also has to hold when the
  // default is ALREADY off, so the essential arm is what carries the assertion.
  it('DNT is a hard override of every trackable tier', () => {
    setConsent({ essential: true, research: true, market: true }); // explicit grants
    setDNT(true);
    const c = getConsent();
    expect(c.essential).toBe(false);
    expect(c.research).toBe(false);
    expect(c.market).toBe(false);
    expect(isClassAllowed('research', c)).toBe(false);
    expect(isClassAllowed('essential', c)).toBe(false);
  });

  it('honors an explicit research opt-OUT verbatim', () => {
    setConsent({ research: false });
    expect(getConsent().research).toBe(false);
    expect(getConsent().research).toBe(false);
  });

  // A2 — THE ARM THE FLIP IS ABOUT. A user who deliberately opted IN under v2's UI
  // keeps their grant; the new OFF default must not reach across an explicit choice.
  it('honors an explicit research opt-IN verbatim — a v2-era grant SURVIVES the v3 flip', () => {
    setConsent({ research: true });
    expect(getConsent().research).toBe(true);
    // Re-reading (as if after the default flipped under them) must not silently opt them out.
    expect(getConsent().research).toBe(true);
  });

  // RE-POINTED: v2 expected research true here (it carried the opt-out default into
  // the record). Under v3 the carried value is the new OFF default.
  it('toggling essential carries the current research value into the record', () => {
    setConsent({ essential: false });
    const c = getConsent();
    expect(c.essential).toBe(false);
    expect(c.research).toBe(false);
  });

  // RE-POINTED: the phantom this guards against inverts with the default. Under v2
  // a phantom `false` must not stick; under v3 a phantom `true` must not stick.
  it('a stored record with updatedAt === 0 is treated as untouched → new default', () => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ essential: true, research: true, ai_prose: false, updatedAt: 0 }));
    expect(getConsent().research).toBe(false); // default applies, not the phantom true
  });

  it('setConsent stamps a positive updatedAt (marks the record as user-touched)', () => {
    const next = setConsent({ research: true });
    expect(next.updatedAt).toBeGreaterThan(0);
  });

  it('exposes CONSENT_MODEL_VERSION = 3', () => {
    expect(CONSENT_MODEL_VERSION).toBe(3);
  });

  // The v2 lesson, pinned as a property rather than a comment: the storage key is
  // NOT bumped by a model revision, because bumping it discards every stored record
  // and silently re-decides for users who had explicitly chosen.
  it('does NOT bump CONSENT_KEY across the model revision', () => {
    expect(CONSENT_KEY).toBe('sf_consent_v1');
  });
});

describe('market-insights consent plane (design §5, plane 3)', () => {
  it('is OFF by default (the trust-first ruling), via the single MARKET_INSIGHTS_DEFAULT constant', () => {
    expect(MARKET_INSIGHTS_DEFAULT).toBe(false);
    expect(getConsent().market).toBe(false);
  });

  it('is exposed as a tier and is opt-IN (only an explicit true grants it)', () => {
    expect(CONSENT_TIERS).toContain('market');
    setConsent({ market: true });
    expect(getConsent().market).toBe(true);
    setConsent({ market: false });
    expect(getConsent().market).toBe(false);
  });

  it('is a distinct plane — enabling market does not change research/essential and vice-versa', () => {
    setConsent({ market: true, research: false });
    const c = getConsent();
    expect(c.market).toBe(true);
    expect(c.research).toBe(false);
    expect(c.essential).toBe(true);
  });

  it('DNT hard-overrides market to false regardless of a stored grant', () => {
    setConsent({ market: true });
    setDNT(true);
    expect(getConsent().market).toBe(false);
  });

  it('does not gate a client event class (market is a corpus-inclusion flag, not an event class)', () => {
    // isClassAllowed only knows essential/research/ai_prose; an unknown class falls to
    // the essential gate. market never silences or admits an event class.
    setConsent({ market: false });
    expect(isClassAllowed('essential', getConsent())).toBe(true);
  });
});
