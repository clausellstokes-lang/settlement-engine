/**
 * @vitest-environment jsdom
 *
 * Component smoke tests for the tab views — render + unmount with
 * various settlement shapes (full, sparse, null) and assert no throws.
 *
 * Catches the class of bug where a tab assumes a field is present and
 * crashes when it isn't. The build only verifies compilation; this
 * verifies actual mount-time behavior.
 *
 * Uses React.createElement instead of JSX because the test-side
 * transform pipeline doesn't currently apply the React JSX transform
 * to test files (vitest 4 + rolldown). createElement is uglier but
 * unambiguous and needs no extra config.
 */

import React from 'react';
import { describe, test, expect, beforeAll, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { OverviewTab }      from '../../src/components/new/tabs/OverviewTab.jsx';
import { ResourcesTab }     from '../../src/components/new/tabs/ResourcesTab.jsx';
import { EconomicsTab }     from '../../src/components/new/tabs/EconomicsTab.jsx';
import { DefenseTab }       from '../../src/components/new/tabs/DefenseTab.jsx';
import { HistoryTab }       from '../../src/components/new/tabs/HistoryTab.jsx';
import { NPCsTab }          from '../../src/components/new/tabs/NPCsTab.jsx';
import { PowerTab }         from '../../src/components/new/tabs/PowerTab.jsx';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { ServicesTab }      from '../../src/components/new/tabs/ServicesTab.jsx';
import { ViabilityTab }     from '../../src/components/new/tabs/ViabilityTab.jsx';
import InstitutionsTab, { institutionsWithServices } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import DMCompassTab         from '../../src/components/new/tabs/DMCompassTab.jsx';
import { staffValidationRows } from '../../src/domain/display/validationOnPage.js';

const e = React.createElement;
const SEED = 'smoke-test-seed-2026-05';

let villageSettlement;
let metropolisSettlement;

beforeAll(() => {
  villageSettlement = generateSettlementPipeline(
    { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: SEED, customContent: {} },
  );
  metropolisSettlement = generateSettlementPipeline(
    { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
    null,
    { seed: `${SEED}-metro`, customContent: {} },
  );
});

afterEach(() => { cleanup(); });

describe('OverviewTab smoke', () => {
  test('mounts with a full village settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: villageSettlement }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: metropolisSettlement }))).not.toThrow();
  });
  test('mounts with an extremely sparse settlement', () => {
    expect(() => render(e(OverviewTab, { settlement: { name: 'X', tier: 'thorp', population: 25 } }))).not.toThrow();
  });
  test('renders without crashing when settlement is null/undefined', () => {
    expect(() => render(e(OverviewTab, { settlement: null }))).not.toThrow();
    expect(() => render(e(OverviewTab, { settlement: undefined }))).not.toThrow();
  });

  // ODQ §767.3(b)+(c) — the walk's copy defects, pinned at the render site.
  // READER-R1 ruling 1 (2026-11-05): the suggestion left the DM page; the sentence pair is now
  // the Viability tab's staff row (validationOnPage.js :: staffValidationRows), pinned there.
  test('a structural suggestion reads as two clean sentences, never joined words (staff row); the Overview prints none', () => {
    const s = {
      name: 'X', tier: 'village', population: 300,
      structuralSuggestions: [{
        type: 'suggestion',
        reason: 'Frontier region: even small settlements benefit from a palisade or earthwork against monster incursions.',
        suggested: ['Palisade or earthworks', 'Citizen militia'],
      }],
    };
    const overview = render(e(OverviewTab, { settlement: s })).container.textContent;
    expectAbsentWithAnchor(overview, 'Consider:', 'Systems Health', 'a validator suggestion is back on the DM Overview');
    const text = staffValidationRows(s).map((r) => r.text).join('\n');
    // The exact sentence pair — one period, a space, the PDF's "Consider:" form.
    const pair = 'monster incursions. Consider: Palisade or earthworks, Citizen militia.';
    expect(text).toContain(pair);
    // The two shipped defects stay dead: the double stop and the joined words. Both
    // travel through the anchor, so a suggestion block that drifted away entirely can
    // never read as "the defect is fixed".
    expectAbsentWithAnchor(text, 'incursions..', pair, 'structural suggestion sentence pair');
    expectAbsentWithAnchor(text, 'ConsiderPalisade', pair, 'structural suggestion sentence pair');
  });

  // X-37 (the owner, 2026-11-01): "Remove the spatial layouts from the summary page". The
  // layout line, the Spatial Layout section and its quarter cards are gone from the Overview;
  // the record keeps `spatialLayout` for the plat. Anchored on the page's own name and the
  // terrain chip that still stands where the layout line stood.
  test('the Overview prints no spatial layout: not the layout line, not the quarters (X-37)', () => {
    const s = {
      name: 'Orderby', tier: 'village', population: 300,
      resourceAnalysis: { terrain: 'grassland' },
      spatialLayout: {
        layout: 'Village green beside the mill',
        quarters: [{ name: 'Market Quarter', desc: 'stalls and a well', landmarks: ['Parish churches (2-5)'] }],
      },
    };
    const text = render(e(OverviewTab, { settlement: s })).container.textContent || '';
    expect(text).toContain('grassland');
    for (const gone of ['Village green beside the mill', 'Spatial Layout', 'Market Quarter', 'stalls and a well', 'Parish']) {
      expectAbsentWithAnchor(text, gone, 'grassland', 'the spatial layout cut from the summary page (X-37)');
    }
    // X-38 (the owner, 2026-11-01): no sentence about the page itself. The routing line is gone.
    expectAbsentWithAnchor(text, 'Summary holds', 'grassland', 'the routing line cut from the Overview (X-38)');
  });
});

describe('ResourcesTab smoke', () => {
  test('mounts with a full village settlement', () => {
    expect(() => render(e(ResourcesTab, { settlement: villageSettlement }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(ResourcesTab, { settlement: metropolisSettlement }))).not.toThrow();
  });
  test('renders without crashing when settlement has no resources', () => {
    const { container } = render(e(ResourcesTab, { settlement: { name: 'X' } }));
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

describe('EconomicsTab smoke', () => {
  // Extra value here: we extracted EconomicFlowsSection from this tab
  // last round — these tests guard the refactor.
  test('mounts with a full village settlement', () => {
    expect(() => render(e(EconomicsTab, {
      economicState: villageSettlement.economicState,
      settlement: villageSettlement,
    }))).not.toThrow();
  });
  test('mounts with a full metropolis settlement', () => {
    expect(() => render(e(EconomicsTab, {
      economicState: metropolisSettlement.economicState,
      settlement: metropolisSettlement,
    }))).not.toThrow();
  });
  test('renders Empty branch when economicState is missing', () => {
    const { container } = render(e(EconomicsTab, { economicState: null, settlement: { name: 'X' } }));
    expect(container.textContent.length).toBeGreaterThan(0);
  });
});

// ── Helper for the remaining tabs ────────────────────────────────────────
// Most tabs follow the same "render with full + sparse" shape. This
// helper keeps the smoke suite concise.
function smokeTab(label, Component, propsForFull, propsForSparse = { settlement: { name: 'X' } }) {
  describe(`${label} smoke`, () => {
    test('mounts with a full village settlement', () => {
      expect(() => render(e(Component, propsForFull(villageSettlement)))).not.toThrow();
    });
    test('mounts with a full metropolis settlement', () => {
      expect(() => render(e(Component, propsForFull(metropolisSettlement)))).not.toThrow();
    });
    test('mounts with a sparse settlement', () => {
      expect(() => render(e(Component, propsForSparse))).not.toThrow();
    });
  });
}

// Simple settlement-prop tabs
smokeTab('DefenseTab',       DefenseTab,       s => ({ settlement: s }));
smokeTab('HistoryTab',       HistoryTab,       s => ({ settlement: s }));
smokeTab('RelationshipsTab', RelationshipsTab, s => ({ settlement: s }));
smokeTab('ViabilityTab',     ViabilityTab,     s => ({ settlement: s }));
smokeTab('DMCompassTab',     DMCompassTab,     s => ({ settlement: s }));
smokeTab('InstitutionsTab',  InstitutionsTab,  s => ({ settlement: s }));

describe('InstitutionsTab shape (owner addendum T1-14, inverted by X-35 on 2026-11-01)', () => {
  test('every institution appears once, its description first, the doors to its services beneath, and the legend', () => {
    const s = villageSettlement;
    const houses = institutionsWithServices(s);
    expect(houses.length).toBe((s.institutions || []).length);
    const { container } = render(e(InstitutionsTab, { settlement: s }));
    const cards = container.querySelectorAll('[data-testid="institution-card"]');
    expect(cards.length).toBe(houses.length);
    const withRows = houses.findIndex((h) => h.services.length > 0);
    expect(withRows, 'no house in the fixture provides a service row').toBeGreaterThanOrEqual(0);
    const doors = cards[withRows].querySelectorAll('[data-testid="institution-service"]');
    expect(doors.length).toBe(houses[withRows].services.length);
    // Each door sits under the house its row's own `institution` field names.
    for (const svc of houses[withRows].services) expect(svc.institution).toBe(houses[withRows].inst.name);
    // What the house is comes first: a generated house carries the catalogue's own line.
    const desc = cards[withRows].querySelector('[data-testid="institution-desc"]');
    expect(desc, 'the house leads with no description').toBeTruthy();
    expect(desc.textContent.length).toBeGreaterThan(10);
    expect(desc.compareDocumentPosition(cards[withRows].querySelector('[data-testid="institution-services"]')) & 4).toBeTruthy();
    // X-38/X-42: the legend row is gone; the page's ? pill carries the badge key.
    expect(container.textContent).not.toContain('= Historically required'); // anchored: the pill that replaced the legend is asserted present one line below
    expect(container.querySelector('[data-testid="institutions-header"] [data-testid="info-pill"]')).toBeTruthy();
  });

  test('a house with no service row still appears, with its description line', () => {
    const lone = { name: 'Y', institutions: [{ name: 'Old mill', category: 'Economy', desc: 'Mill fixture description.' }], availableServices: {} };
    const text = render(e(InstitutionsTab, { settlement: lone })).container.textContent || '';
    expect(text).toContain('Old mill');
    expect(text).toContain('Mill fixture description.');
  });
});

describe('OverviewTab carries the Table View trigger the removed DM Summary tab held (X-5)', () => {
  test('the button renders only when the router hands a trigger, and calls it', () => {
    let opened = 0;
    const { container, getByText } = render(e(OverviewTab, { settlement: villageSettlement, onOpenTableView: () => { opened += 1; } }));
    // TRIM-2 request 4: the trigger opens the one Tonight sheet, so it is called by that sheet's name.
    getByText('Open Tonight').click();
    expect(opened).toBe(1);
    expectAbsentWithAnchor(container.textContent || '', 'Open in Table View', 'Open Tonight', 'the old label left with the old view');
    cleanup();
    const text = render(e(OverviewTab, { settlement: villageSettlement })).container.textContent || '';
    expectAbsentWithAnchor(text, 'Open Tonight', villageSettlement.name, 'the trigger renders with no route to open');
    expect(container).toBeTruthy();
  });
});

// The X-18 routing sentence's own describe left with the sentence (X-38, the owner, 2026-11-01:
// no sentence about the page itself); its absence is pinned in the Overview smoke block above.

describe('OverviewTab follows the block law (X-16, BUILD-W2-BLOCKLAW U3)', () => {
  test('answer (strip, routing line, the place), then the facts, then the prose, then the DM material, then the reference', () => {
    const s = {
      name: 'Orderby', tier: 'village', population: 300,
      arrivalScene: 'Arrival fixture scene.',
      history: { currentTensions: [{ description: 'Tension fixture.' }] },
      settlementReason: 'Origin fixture.',
      // READER-R1: the validator's suggestions left the page; a coherence note is the DM material.
      coherenceNotes: [{ note: 'Coherence fixture.', severity: 'note' }],
    };
    const text = render(e(OverviewTab, { settlement: s })).container.textContent || '';
    const at = (needle) => {
      const i = text.indexOf(needle);
      expect(i, `${needle} is missing from the Overview`).toBeGreaterThanOrEqual(0);
      return i;
    };
    const sequence = [
      'Orderby',                // (1) the answer: the identity strip (its routing line left with X-38)
      'Arrival fixture scene.', // (1) the answer: THE PLACE, the walk-in scene (chair ruling X-25a)
      'Systems Health',         // (2) the facts: status tags
      'Tension fixture.',       // (2) the facts: tension rows
      'Origin fixture.',        // (3) prose: why it is here
      'Coherence fixture.',     // (4) DM material: the coherence notes (READER-R1 cut the validator's rows)
      // (5) the collapsed reference was the Spatial Layout section, cut by X-37 (2026-11-01);
      // the page now ends on its DM material and the campaign-only blocks beneath it.
    ].map(at);
    expect(sequence).toEqual([...sequence].sort((a, b) => a - b));
  });
});

describe('DMCompassTab shape (chair ruling, RULINGS-T1 DM Compass)', () => {
  test('one name ("Guidance"), the four panels, and no coaching captions under them', () => {
    const { container } = render(e(DMCompassTab, { settlement: {
      name: 'X',
      dmCompass: { hooks: ['Hook fixture one.'], redFlags: ['Flag fixture.'], twist: 'Twist fixture.' },
      identityMarkers: ['Marker fixture.'],
      frictionPoints: [{ who: 'Who fixture', what: 'What fixture.' }],
      connectionsMap: [{ from: 'From fixture', nature: 'owes', to: 'To fixture' }],
    } }));
    const text = container.textContent || '';
    for (const title of ['Guidance', 'Identity Markers', 'Friction Points', 'Connections Map']) expect(text).toContain(title);
    expectAbsentWithAnchor(text, 'DM Compass', 'Guidance', 'the section kept a second name for the tab');
    expectAbsentWithAnchor(text, 'Concrete details to drop into a scene', 'Marker fixture.', 'the Identity Markers caption is back');
    expectAbsentWithAnchor(text, 'Surface them in scenes', 'What fixture.', 'the Friction Points caption is back');
    expectAbsentWithAnchor(text, 'A map for the table', 'To fixture', 'the Connections Map caption is back');
  });
});

// Multi-prop tabs — these take additional slices alongside `settlement`.
smokeTab('PowerTab',    PowerTab,    s => ({ powerStructure: s.powerStructure, settlement: s }),
  { powerStructure: null, settlement: { name: 'X' } });
smokeTab('ServicesTab', ServicesTab, s => ({ services: s.economicState?.institutionalServices || [], settlement: s }),
  { services: [], settlement: { name: 'X' } });
smokeTab('NPCsTab',     NPCsTab,     s => ({ npcs: s.npcs || [], settlement: s, pinnedIds: [] }),
  { npcs: [], settlement: { name: 'X' }, pinnedIds: [] });
