/**
 * tests/store/appNavSsot.test.js — Store/app-shell cluster finding #4.
 *
 * The top-nav label/order metadata used to live in a parallel array in App.jsx,
 * duplicating the view-id set owned by routes.js — so a new/renamed/reordered
 * nav tab needed two edits and could silently drift (this is how About, then
 * Gallery, once got dropped from mobile). The fix makes lib/routes.js the single
 * source of truth: each nav ROUTES entry carries a `nav` block, and the derived
 * NAV export is what App consumes.
 *
 * These tests pin that derivation so the SSOT can't regress.
 */
import { describe, test, expect } from 'vitest';
import { NAV, ROUTES, isKnownView } from '../../src/lib/routes.js';

describe('routes NAV is the single source of truth (finding #4)', () => {
  test('NAV is derived from ROUTES entries that declare a nav block', () => {
    const navViews = new Set(NAV.map(n => n.id));
    const routesWithNav = ROUTES.filter(r => r.nav).map(r => r.view);
    expect([...navViews].sort()).toEqual([...routesWithNav].sort());
  });

  test('every NAV id is a real, routable view', () => {
    for (const item of NAV) {
      expect(isKnownView(item.id)).toBe(true);
      expect(typeof item.label).toBe('string');
      expect(item.label.length).toBeGreaterThan(0);
    }
  });

  test('NAV is sorted by nav.order (stable, one-place ordering)', () => {
    const orders = NAV.map(n => n.order);
    const sorted = [...orders].sort((a, b) => a - b);
    expect(orders).toEqual(sorted);
    // Orders are unique so the sort is deterministic.
    expect(new Set(orders).size).toBe(orders.length);
  });

  test('the desktop nav order + labels match the shipped IA', () => {
    // The exact tab set + order App renders. Locking it here means a routes.js
    // edit that reorders/relabels a tab is a conscious change, not a silent one.
    expect(NAV.map(n => ({ id: n.id, label: n.label }))).toEqual([
      { id: 'home',        label: 'Welcome' },
      { id: 'generate',    label: 'Create' },
      { id: 'settlements', label: 'Library' },
      { id: 'realm',       label: 'Realm' },
      { id: 'compendium',  label: 'Compendium' },
      { id: 'gallery',     label: 'Gallery' },
      { id: 'howto',       label: 'About' },
    ]);
  });

  test('NAV items keep the { id, label } shape App and the mobile cap rely on', () => {
    // The mobile bottom-nav picks from an explicit priority list by id and reads
    // label — so both fields must be present on every item.
    for (const item of NAV) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('label');
    }
  });
});
