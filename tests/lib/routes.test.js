/**
 * tests/lib/routes.test.js — path ↔ view routing table contract.
 *
 * Guards the invariants the rest of the routing layer leans on:
 *   - every view round-trips view → path → view
 *   - legacy ?view= links still resolve (already-sent emails must not break)
 *   - param routes (/settlements/:id) parse + encode safely
 *   - unknown paths fall back, not throw
 *   - the ?next= redirect guard rejects open-redirect attempts
 */

import { describe, it, expect } from 'vitest';
import {
  ROUTES,
  resolveLocation,
  viewToPath,
  titleForView,
  guardForView,
  isKnownView,
  isSafeNextPath,
} from '../../src/lib/routes.js';

describe('routes — table integrity', () => {
  it('has unique view ids and unique paths', () => {
    const views = ROUTES.map(r => r.view);
    const paths = ROUTES.map(r => r.path);
    expect(new Set(views).size).toBe(views.length);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('every path is absolute and lower-case', () => {
    for (const r of ROUTES) {
      expect(r.path.startsWith('/')).toBe(true);
      expect(r.path).toBe(r.path.toLowerCase());
    }
  });

  it('every route declares a non-empty title', () => {
    for (const r of ROUTES) {
      expect(typeof r.title).toBe('string');
      expect(r.title.length).toBeGreaterThan(0);
    }
  });
});

describe('routes — view ↔ path round-trip', () => {
  it('maps every view back to itself through its path', () => {
    for (const r of ROUTES) {
      const resolved = resolveLocation(viewToPath(r.view));
      expect(resolved.view).toBe(r.view);
      expect(resolved.notFound).toBeFalsy();
    }
  });

  it('exposes the expected public paths', () => {
    expect(viewToPath('generate')).toBe('/create');
    expect(viewToPath('settlements')).toBe('/settlements');
    expect(viewToPath('map')).toBe('/map');
    expect(viewToPath('howto')).toBe('/how-to');
    expect(viewToPath('signin')).toBe('/signin');
    expect(viewToPath('register')).toBe('/register');
    expect(viewToPath('compare-chatgpt')).toBe('/compare/chatgpt');
    expect(viewToPath('dossier-success')).toBe('/checkout/success');
  });

  it('falls back to /create for an unknown view', () => {
    expect(viewToPath('does-not-exist')).toBe('/create');
  });
});

describe('routes — resolveLocation paths', () => {
  it('resolves root to the default view', () => {
    expect(resolveLocation('/').view).toBe('generate');
    expect(resolveLocation('/').notFound).toBeFalsy();
  });

  it('tolerates trailing slashes, query, and hash', () => {
    expect(resolveLocation('/settlements/').view).toBe('settlements');
    expect(resolveLocation('/compendium?x=1#culture').view).toBe('compendium');
    expect(resolveLocation('/compare/kanka#top').view).toBe('compare-kanka');
  });

  it('marks an unknown path as notFound but still returns the default view', () => {
    const r = resolveLocation('/totally-made-up');
    expect(r.view).toBe('generate');
    expect(r.notFound).toBe(true);
  });

  it('never throws on garbage input', () => {
    expect(() => resolveLocation(null)).not.toThrow();
    expect(() => resolveLocation(undefined)).not.toThrow();
    expect(() => resolveLocation('')).not.toThrow();
  });
});

describe('routes — /settlements/:id param route', () => {
  it('extracts the id', () => {
    const r = resolveLocation('/settlements/abc-123');
    expect(r.view).toBe('settlements');
    expect(r.params.id).toBe('abc-123');
  });

  it('round-trips an id that needs URL-encoding', () => {
    const id = 'a b/c';
    const path = viewToPath('settlements', { id });
    expect(path).toBe('/settlements/a%20b%2Fc');
    const r = resolveLocation(path);
    expect(r.view).toBe('settlements');
    expect(r.params.id).toBe(id);
  });

  it('round-trips a gallery slug', () => {
    const slug = 'bramble fen';
    const path = viewToPath('gallery', { slug });
    expect(path).toBe('/gallery/bramble%20fen');
    const r = resolveLocation(path);
    expect(r.view).toBe('gallery');
    expect(r.params.slug).toBe(slug);
  });

  it('bare /settlements has no id param', () => {
    const r = resolveLocation('/settlements');
    expect(r.view).toBe('settlements');
    expect(r.params.id).toBeUndefined();
  });
});

describe('routes — legacy ?view= back-compat', () => {
  it('resolves already-sent email links', () => {
    expect(resolveLocation('/?view=settlements').view).toBe('settlements');
    expect(resolveLocation('/?view=pricing').view).toBe('pricing');
    // /?view=signin used to be a no-op; it must now reach the sign-in page.
    expect(resolveLocation('/?view=signin').view).toBe('signin');
  });

  it('flags legacy resolutions so the hook can upgrade the URL', () => {
    expect(resolveLocation('/?view=gallery').legacy).toBe(true);
    expect(resolveLocation('/create').legacy).toBeFalsy();
  });

  it('preserves the gallery slug as a param', () => {
    const r = resolveLocation('/?view=gallery&slug=bramblefen');
    expect(r.view).toBe('gallery');
    expect(r.params.slug).toBe('bramblefen');
  });

  it('ignores an unknown legacy view and falls through to the path', () => {
    const r = resolveLocation('/compendium?view=bogus');
    expect(r.view).toBe('compendium');
  });
});

describe('routes — titles + guards', () => {
  it('home is the bare site name; others are suffixed', () => {
    expect(titleForView('generate')).toBe('SettlementForge');
    expect(titleForView('pricing')).toBe('Pricing · SettlementForge');
    expect(titleForView('signin')).toBe('Sign In · SettlementForge');
  });

  it('declares guards only on the gated routes', () => {
    expect(guardForView('account')).toBe('auth');
    expect(guardForView('admin')).toBe('elevated');
    expect(guardForView('generate')).toBeUndefined();
    expect(guardForView('workshop')).toBeUndefined(); // component self-locks
  });

  it('isKnownView distinguishes declared views', () => {
    expect(isKnownView('settlements')).toBe(true);
    expect(isKnownView('nope')).toBe(false);
  });
});

describe('routes — isSafeNextPath (open-redirect guard)', () => {
  it('accepts internal absolute paths', () => {
    expect(isSafeNextPath('/account')).toBe(true);
    expect(isSafeNextPath('/settlements/abc')).toBe(true);
  });

  it('rejects protocol-relative and absolute URLs', () => {
    expect(isSafeNextPath('//evil.com')).toBe(false);
    expect(isSafeNextPath('https://evil.com')).toBe(false);
    expect(isSafeNextPath('/\\evil.com')).toBe(false);
    expect(isSafeNextPath('relative')).toBe(false);
    expect(isSafeNextPath(null)).toBe(false);
    expect(isSafeNextPath(undefined)).toBe(false);
  });
});
