/**
 * libraryAdvancesNothing.walker.test.js — LIBRARY-SIMPLE (2026-11-10).
 *
 * The owner, verbatim: "I now want to simplify the library page. No longer does it
 * advance time. That will only be accessible in isolated (not in campaign settlements)
 * or the realm page. ... anything associated that is an independent campaign advance
 * time outside of the realm needs to be removed."
 *
 * A source-scan walker over the Library's own tree (SettlementsPanel.jsx and
 * src/components/settlements/*): it reads no campaign-advance store action, imports
 * no advance hook, and the two modules that existed only to serve the Library's
 * advance stay gone. The positive half pins that the Realm still offers the act, so
 * the negative cannot pass by the advance vanishing from the product.
 */

import { describe, expect, test } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const read = (rel) => readFileSync(new URL(rel, root), 'utf8');

const LIBRARY_FILES = [
  'src/components/SettlementsPanel.jsx',
  ...readdirSync(new URL('src/components/settlements/', root))
    .filter((f) => /\.(js|jsx)$/.test(f))
    .map((f) => `src/components/settlements/${f}`),
];

const FORBIDDEN = [
  ['the campaign world advance', /\badvanceCampaignWorld\b/],
  ['the shared auto-resolve setting', /\b(set)?[aA]dvanceAutoResolve\b/],
  ['the Library advance hook', /\buseCampaignAdvance\b/],
  ['the Library advance nav target', /\bADVANCE_TIME_NAV_TARGET\b|advanceTimeTarget/],
  ['an advance handler prop', /\bonAdvanceTime\b/],
];

describe('the Library advances nothing (owner, 2026-11-10)', () => {
  test('no Library file reaches a campaign advance', () => {
    const hits = [];
    for (const file of LIBRARY_FILES) {
      const src = read(file);
      for (const [what, re] of FORBIDDEN) if (re.test(src)) hits.push(`${file}: ${what}`);
    }
    expect(hits).toEqual([]);
  });

  test('the two modules that served only the Library advance are gone', () => {
    expect(existsSync(new URL('src/components/settlements/useCampaignAdvance.js', root))).toBe(false);
    expect(existsSync(new URL('src/components/settlements/advanceTimeTarget.js', root))).toBe(false);
  });

  test('a campaign still advances from the Realm (the act is offered, not lost)', () => {
    const toolbar = read('src/components/map/WorldMapToolbar.jsx');
    expect(toolbar.includes('onClick={handleAdvanceRealm}')).toBe(true);
    expect(toolbar.includes('aria-label="Realm advancement interval"')).toBe(true);
    expect(read('src/hooks/useAdvanceSession.js').includes('advanceCampaignWorld(')).toBe(true);
    expect(read('src/components/WorldMap.jsx').includes('<AdvanceAutoResolveToggle')).toBe(true);
  });
});
