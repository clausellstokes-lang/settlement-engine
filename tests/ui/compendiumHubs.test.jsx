/**
 * @vitest-environment jsdom
 *
 * tests/ui/compendiumHubs.test.jsx — the Compendium (#20) render + reachability suite.
 *
 * Asserts the dashboard + every new registry hub renders from the generated
 * drift-contract artifact, and that the tier-band drift is corrected on screen.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { COMPENDIUM_DATA as CD } from '../../src/domain/compendium/generated/compendiumData.generated.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

const storeState = { getCustomContentCount: () => 0 };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

function clickTab(container, label) {
  const btn = [...container.querySelectorAll('button')].find((b) => b.textContent.trim().startsWith(label));
  if (!btn) throw new Error(`tab not found: ${label}`);
  fireEvent.click(btn);
}

describe('Compendium — dashboard + registry hubs', () => {
  it('opens on the Overview dashboard with source-rendered catalog counts', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    const text = container.textContent;
    // The demo world + the operations count, from the artifact. (The premade-deity
    // roster was removed by owner ruling 2026-07-21; no deity count is published.)
    expect(text).toContain(CD.meta.demoWorld.name);
    expect(text).toContain(String(CD.operations.count));
    expect(CD.deities).toBeUndefined();
  });

  it('the Operations hub is the op registry public (read/propose/write, every class)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Operations');
    const text = container.textContent;
    expect(text).toContain('applyEvent');            // a real canon op renders
    expect(text.toLowerCase()).toContain('reads');    // the S-stage story
    expect(text.toLowerCase()).toContain('proposes');
    expect(text.toLowerCase()).toContain('writes');
    expect(text).toContain(String(CD.operations.count));
    // The by-class tally is present.
    for (const k of Object.keys(CD.operations.byKlass)) expect(text).toContain(k);
  });

  it('the Living World hub renders the REAL 16 vars / 9 pressures (drift killed)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Living World');
    const text = container.textContent;
    expect(text).toContain(String(CD.causal.variableCount)); // 16
    expect(text).toContain(String(CD.pressures.count));      // 9
    // The real pressure kinds (not the stale "military, economic, social" list).
    expect(text).toContain(CD.pressures.kinds[0]);           // 'food'
  });

  it('Tiers render the corrected engine population bands (Thorp 8, not 20-80)', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    clickTab(container, 'Tiers');
    const text = container.textContent;
    const thorp = CD.tiers.find((t) => t.id === 'thorp');
    expect(text).toContain(`${thorp.min.toLocaleString()}–${thorp.max.toLocaleString()}`);
    expect(text).not.toContain('20-80'); // the old, wrong, hand-typed band
  });

  it('Calamity and the A–Z index render; the removed Map Lenses and Facets pages are gone', async () => {
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const { container } = render(<CompendiumPanel standalone />);
    // (No Deities tab: the premade-deity roster was removed by owner ruling 2026-07-21.
    // No Map Lenses or Facets tab: both removed by owner order 2026-09-16; neither the
    // settlement-map lenses nor building interiors ship. docs/FIRST_CONTACT_BACKLOG.md.)
    const tabLabels = [...container.querySelectorAll('[role="tab"]')].map((b) => b.textContent.trim());
    expectAbsentWithAnchor(tabLabels, 'Map Lenses', 'Calamity', 'compendium tab strip');
    expectAbsentWithAnchor(tabLabels, 'Facets', 'Calamity', 'compendium tab strip');
    // The Overview dashboard carries no card for either removed page.
    const cardHrefs = [...container.querySelectorAll('#overview a')].map((a) => a.getAttribute('href'));
    expectAbsentWithAnchor(cardHrefs, '/compendium?tab=lenses#lenses', '/compendium?tab=calamity#calamity', 'overview cards');
    expectAbsentWithAnchor(cardHrefs, '/compendium?tab=facets#facets', '/compendium?tab=calamity#calamity', 'overview cards');
    clickTab(container, 'Calamity');
    expect(container.textContent).toContain(CD.calamity.flavors[0].title);
    clickTab(container, 'A–Z Index');
    expect(container.textContent.toLowerCase()).toContain('alphabetical');
    // The A–Z index carries no Lens rows: every link lands on a live tab.
    const azTabs = [...container.querySelectorAll('#az a')].map((a) => new URL(a.getAttribute('href'), 'http://x').searchParams.get('tab'));
    expectAbsentWithAnchor(azTabs, 'lenses', 'calamity', 'A–Z index destinations');
    expectAbsentWithAnchor(azTabs, 'facets', 'calamity', 'A–Z index destinations');
  });

  // Old links (owner order 2026-09-16): the five /compendium/lens-* entry pages were
  // prerendered and listed in the sitemap. The router still matches the per-entry
  // pattern and the id no longer resolves to an index entry, so the panel opens on its
  // Overview dashboard AND replaces the dead address with /compendium. The route head
  // resolved from the replaced address (what App's head effect applies on the route
  // change) then canonicalizes to /compendium, with its own title and og tags, so the
  // dead path is never indexed as a duplicate of the Overview. A live entry id is the
  // negative control: it keeps its address. (The prerendered documents are gone; the
  // dist walk in tests/build/prerenderRoutes.test.js pins that.)
  it('an old /compendium/lens-* link lands on the Overview at /compendium, and the head follows the replaced address', async () => {
    const { resolveLocation } = await import('../../src/lib/routes.js');
    const { applyDocumentHead, headForView, ORIGIN } = await import('../../src/lib/seo.js');
    const { COMPENDIUM_INDEX } = await import('../../src/domain/compendium/searchIndex.js');
    const CompendiumPanel = (await import('../../src/components/CompendiumPanel.jsx')).default;
    const indexIds = COMPENDIUM_INDEX.map((e) => e.id);
    const here = () => window.location.pathname + window.location.search + window.location.hash;
    const headHref = (selector, attr) => document.head.querySelector(selector)?.getAttribute(attr);
    const overviewHead = headForView('compendium', {});
    expect(overviewHead.canonical).toBe(`${ORIGIN}/compendium`);
    try {
      for (const id of ['lens-parchment', 'lens-watercolor', 'lens-darkfantasy', 'lens-vtt', 'lens-accessible']) {
        window.history.replaceState(null, '', `/compendium/${id}`);
        const loc = resolveLocation(here());
        expect(loc, `${id} route`).toEqual({ view: 'compendium', params: { entry: id } });
        expectAbsentWithAnchor(indexIds, id, 'tier-thorp', 'compendium index ids');
        const { container, unmount } = render(<CompendiumPanel standalone routeEntry={loc.params.entry} />);
        const selected = container.querySelector('[role="tab"][aria-selected="true"]');
        expect(selected && selected.textContent.trim(), `${id} opens on`).toBe('Overview');
        expect(container.querySelector('#overview'), `${id} renders the dashboard`).not.toBeNull();
        expect(document.title, `${id} panel head`).toBe('The SettlementForge Compendium');
        // The dead address is REPLACED, and what it resolves to now carries no entry.
        expect(here(), `${id} address`).toBe('/compendium');
        const replaced = resolveLocation(here());
        expect(replaced, `${id} replaced route`).toEqual({ view: 'compendium', params: {} });
        applyDocumentHead(replaced.view, replaced.params);
        expect(headHref('link[rel="canonical"]', 'href'), `${id} canonical`).toBe(`${ORIGIN}/compendium`);
        expect(headHref('meta[property="og:url"]', 'content'), `${id} og:url`).toBe(`${ORIGIN}/compendium`);
        expect(headHref('meta[property="og:title"]', 'content'), `${id} og:title`).toBe(overviewHead.title);
        expect(headHref('meta[name="twitter:title"]', 'content'), `${id} twitter:title`).toBe(overviewHead.title);
        expect(headHref('meta[property="og:description"]', 'content'), `${id} og:description`).toBe(overviewHead.description);
        unmount();
      }
      // NEGATIVE CONTROL: a live entry page keeps its own address.
      window.history.replaceState(null, '', '/compendium/tier-thorp');
      expect(indexIds).toContain('tier-thorp');
      const live = render(<CompendiumPanel standalone routeEntry="tier-thorp" />);
      expect(here(), 'a live entry is not redirected').toBe('/compendium/tier-thorp');
      live.unmount();
    } finally {
      window.history.replaceState(null, '', '/');
    }
    // The removed section deep-links (?tab= and #anchor) fall back to the Overview too.
    try {
      for (const href of ['/compendium?tab=lenses', '/compendium?tab=facets', '/compendium#lenses', '/compendium#facets']) {
        window.history.replaceState(null, '', href);
        const { container, unmount } = render(<CompendiumPanel standalone />);
        const selected = container.querySelector('[role="tab"][aria-selected="true"]');
        expect(selected && selected.textContent.trim(), `${href} opens on`).toBe('Overview');
        unmount();
      }
    } finally {
      window.history.replaceState(null, '', '/');
    }
  });
});
