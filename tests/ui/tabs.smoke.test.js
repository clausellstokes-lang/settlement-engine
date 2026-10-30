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
  test('a structural suggestion reads as two clean sentences, never joined words', () => {
    const s = {
      name: 'X', tier: 'village', population: 300,
      structuralSuggestions: [{
        type: 'suggestion',
        reason: 'Frontier region: even small settlements benefit from a palisade or earthwork against monster incursions.',
        suggested: ['Palisade or earthworks', 'Citizen militia'],
      }],
    };
    const { container } = render(e(OverviewTab, { settlement: s }));
    const text = container.textContent;
    // The exact sentence pair — one period, a space, the PDF's "Consider:" form.
    const pair = 'monster incursions. Consider: Palisade or earthworks, Citizen militia.';
    expect(text).toContain(pair);
    // The two shipped defects stay dead: the double stop and the joined words. Both
    // travel through the anchor, so a suggestion block that drifted away entirely can
    // never read as "the defect is fixed".
    expectAbsentWithAnchor(text, 'incursions..', pair, 'structural suggestion sentence pair');
    expectAbsentWithAnchor(text, 'ConsiderPalisade', pair, 'structural suggestion sentence pair');
  });

  test('a single quarter is a "quarter", not "1 quarters"', () => {
    const s = {
      name: 'X', tier: 'village', population: 300,
      spatialLayout: { layout: 'Village green beside the mill', quarters: [{ name: 'Market Quarter', desc: 'stalls' }] },
    };
    const { container } = render(e(OverviewTab, { settlement: s }));
    expectAbsentWithAnchor(container.textContent, '1 quarters', 'Spatial Layout (1 quarter)',
      'single-quarter pluralization');
    // Plural control: two quarters still read as quarters.
    cleanup();
    const two = { ...s, spatialLayout: { ...s.spatialLayout, quarters: [...s.spatialLayout.quarters, { name: 'Shrine', desc: 'quiet' }] } };
    const second = render(e(OverviewTab, { settlement: two }));
    expect(second.container.textContent).toContain('Spatial Layout (2 quarters)');
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

describe('InstitutionsTab shape (owner addendum T1-14)', () => {
  test('every institution appears once, with the service rows that name it beneath, and the legend', () => {
    const s = villageSettlement;
    const houses = institutionsWithServices(s);
    expect(houses.length).toBe((s.institutions || []).length);
    const { container } = render(e(InstitutionsTab, { settlement: s }));
    const cards = container.querySelectorAll('[data-testid="institution-card"]');
    expect(cards.length).toBe(houses.length);
    const withRows = houses.findIndex((h) => h.services.length > 0);
    expect(withRows, 'no house in the fixture provides a service row').toBeGreaterThanOrEqual(0);
    const rows = cards[withRows].querySelectorAll('[data-testid="institution-service"]');
    expect(rows.length).toBe(houses[withRows].services.length);
    // Each service row sits under the house its own `institution` field names.
    for (const svc of houses[withRows].services) expect(svc.institution).toBe(houses[withRows].inst.name);
    expect(container.textContent).toContain('= Historically required');
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
    getByText('Open in Table View').click();
    expect(opened).toBe(1);
    cleanup();
    const text = render(e(OverviewTab, { settlement: villageSettlement })).container.textContent || '';
    expectAbsentWithAnchor(text, 'Open in Table View', villageSettlement.name, 'the trigger renders with no route to open');
    expect(container).toBeTruthy();
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
