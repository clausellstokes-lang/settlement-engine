/**
 * viewerSecrets.test.js — THE SECRETS SEAM predicate (R-1c): fail-closed unless PROVABLY the
 * owning DM's own authenticated session. DESIGN_THE_ROADS.md §15 binding 3.
 */
import { describe, it, expect } from 'vitest';
import { viewerSeesDmSecrets } from '../../src/domain/display/viewerSecrets.js';

describe('viewerSeesDmSecrets — fail closed (§15 binding 3)', () => {
  it('an owning-DM authenticated session sees secrets', () => {
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true })).toBe(true);
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, ownerUserId: 'u1', viewerUserId: 'u1' })).toBe(true);
  });

  it('unknown / ambiguous / empty context ⇒ HIDDEN', () => {
    expect(viewerSeesDmSecrets(undefined)).toBe(false);
    expect(viewerSeesDmSecrets(null)).toBe(false);
    expect(viewerSeesDmSecrets({})).toBe(false);
    expect(viewerSeesDmSecrets('owner')).toBe(false);
    expect(viewerSeesDmSecrets([])).toBe(false);
  });

  it('any share / gallery / anonymous / public path ⇒ HIDDEN even if flagged owner', () => {
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, shared: true })).toBe(false);
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, gallery: true })).toBe(false);
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, anonymous: true })).toBe(false);
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, public: true })).toBe(false);
  });

  it('a non-owner or unauthenticated session ⇒ HIDDEN', () => {
    expect(viewerSeesDmSecrets({ isOwner: false, authenticated: true })).toBe(false);
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: false })).toBe(false);
  });

  it('a user-id mismatch (owner viewing someone else’s campaign) ⇒ HIDDEN', () => {
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, ownerUserId: 'u1', viewerUserId: 'u2' })).toBe(false);
  });

  it('the FUTURE share toggle: explicit showDmSecrets:false hides even an owner session', () => {
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, showDmSecrets: false })).toBe(false);
    // absence of the toggle in an in-session owner view keeps visibility (roads mounts here today)
    expect(viewerSeesDmSecrets({ isOwner: true, authenticated: true, showDmSecrets: true })).toBe(true);
  });
});
