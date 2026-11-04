/**
 * exportLaunchGate.test.js - the one question every export control asks before it works.
 *
 * THE OWNER (2026-11-03): "Oh and export (outside of gallery) buttons are not to work are to
 * say available at launch and have the purple gold combination as well." and, later the same
 * day: "In essence for right now. Anyone that is not a developer can only have access to the
 * free account version."
 *
 * exportsOpenFor({ staff, gallery, env }) is open when the account is staff (the developer and
 * admin roles, authSlice.isElevated), when the export is the gallery's, or when purchases have
 * opened (launchGate.purchasesOpen); closed otherwise. The env seam is the build's flags.
 */
import { describe, it, expect } from 'vitest';
import { exportsOpenFor } from '../../src/components/primitives/exportLaunchGate.js';

const CLOSED_BUILD = {};
const OPEN_BUILD = { VITE_PURCHASES_OPEN: 'true' };

describe('exportsOpenFor - who may export before launch', () => {
  it('a non-staff account outside the gallery, before launch: closed', () => {
    expect(exportsOpenFor({ staff: false, gallery: false, env: CLOSED_BUILD })).toBe(false);
    expect(exportsOpenFor({ env: CLOSED_BUILD })).toBe(false);
  });

  it('a staff account outside the gallery, before launch: open', () => {
    expect(exportsOpenFor({ staff: true, gallery: false, env: CLOSED_BUILD })).toBe(true);
  });

  it('the gallery export for a non-staff account, before launch: open', () => {
    expect(exportsOpenFor({ staff: false, gallery: true, env: CLOSED_BUILD })).toBe(true);
  });

  it('at launch every account exports, with no code change', () => {
    expect(exportsOpenFor({ staff: false, gallery: false, env: OPEN_BUILD })).toBe(true);
  });

  it('a misspelled launch flag keeps exports closed', () => {
    expect(exportsOpenFor({ staff: false, gallery: false, env: { VITE_PURCHASES_OPEN: 'yes' } })).toBe(false);
  });
});
