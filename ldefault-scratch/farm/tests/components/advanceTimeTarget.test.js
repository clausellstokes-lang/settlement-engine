/**
 * advanceTimeTarget.test.js — the forward-compatible Advance-Time nav target
 * (UX Phase 3 → repointed in Phase 4, plan §4.2 / §4.5).
 *
 * The Library's Advance-Time CTA deep-links into the simulation via ONE constant.
 * Phase 4 (the Realm IA move) repoints `view` from the old World Map flow to the
 * Realm hub. This pins the contract: a single { view, workspace } target, now
 * pointing at the Realm (`workspace: 'news'` → the Realm Inspector's Chronicle).
 */

import { describe, it, expect } from 'vitest';
import { ADVANCE_TIME_NAV_TARGET } from '../../src/components/settlements/advanceTimeTarget.js';

describe('ADVANCE_TIME_NAV_TARGET', () => {
  it('is a single frozen { view, workspace } nav target', () => {
    expect(Object.isFrozen(ADVANCE_TIME_NAV_TARGET)).toBe(true);
    expect(typeof ADVANCE_TIME_NAV_TARGET.view).toBe('string');
    expect(typeof ADVANCE_TIME_NAV_TARGET.workspace).toBe('string');
  });

  it('deep-links into the Realm hub (Phase 4 repoint), post-advance Chronicle', () => {
    // Phase 4: the World Map moved into the Realm. The CTA now lands on `realm`;
    // the `news` workspace maps to the Realm Inspector's Chronicle section (the
    // post-advance "what changed" surface).
    expect(ADVANCE_TIME_NAV_TARGET.view).toBe('realm');
    expect(ADVANCE_TIME_NAV_TARGET.workspace).toBe('news');
  });
});
