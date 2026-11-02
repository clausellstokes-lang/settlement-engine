/** @vitest-environment jsdom */
/**
 * institutionsInverted.test.jsx — THE INSTITUTIONS TAB, INVERTED (THE OWNER, 2026-11-01, X-35):
 * "give the general description for each institution ... and then list off underneath that in
 * like a subtitle each of the services that it renders, each of those services ties to a
 * hyperlink that is appropriate to the services tab. This is the inverse of how the services
 * tab does things."
 *
 * Four pins, each anchored on a presence in the same render:
 *   1. every card LEADS with what the house is — the catalogue's own description, else the
 *      authored identity line — and a house with no service renders no subtitle;
 *   2. the subtitle is a row of DOORS: one link per service, labelled through the label seam,
 *      and the service's own description does NOT come along (it lives on the Services tab);
 *   3. a door opens the Services tab and stamps the row's id as the focused entity — the same id
 *      the row computes for itself (X-20 (c)), so the row scrolls itself to the top;
 *   4. a folded category on the Services tab opens when one of its rows is focused.
 */
import React, { useState } from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, cleanup, screen, fireEvent, act, within } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import InstitutionsTab, { InstitutionCard, institutionDescription, institutionsWithServices } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ServiceItem } from '../../src/components/new/serviceComponents.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { entityAnchor, entityIdFor, serviceEntityOf } from '../../src/domain/dossier/entityLinks.js';
import { INSTITUTION_IDENTITY } from '../../src/domain/display/institutionVocabulary.js';
import { useStore } from '../../src/store/index.js';

const GRAIN = { name: 'Grain sale', desc: 'Sacks by the stone, honest weight.', institution: 'Granary' };
const ROOTS = { name: 'Root storage', desc: 'A dry shelf for the winter.', institution: 'Communal root cellar' };
const LODGING = { name: 'Lodging', desc: 'A bed above the taproom.', institution: 'Inn' };
const SETTLEMENT = {
  id: 'settlement.orderby', name: 'Orderby', tier: 'village', population: 300,
  institutions: [
    { name: 'Granary', category: 'Economy', desc: 'Grain in, grain out.' },
    { name: 'Communal root cellar', category: 'Economy' }, // no desc → the authored identity line
    { name: 'Inn', category: 'Economy', desc: 'Beds and a fire.' },
    { name: 'Old mill', category: 'Economy', desc: 'A mill with nothing to sell.' }, // no service
  ],
  availableServices: { provisioning: [GRAIN, ROOTS], lodging: [LODGING] },
};
const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'services' }];

/** The dossier's own provider, with a spy for the tab setter the navigator drives. */
function Dossier({ settlement, setActiveTab, children }) {
  const value = useDossierEntityNav(settlement, setActiveTab, TABS, {});
  return <DossierEntityContext.Provider value={value}>{children}</DossierEntityContext.Provider>;
}

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
beforeEach(() => { act(() => { useStore.getState().clearFocusedEntity?.(); }); });
afterEach(() => cleanup());

describe('1. what the house is, first', () => {
  it('institutionDescription: the catalogue line, else the authored identity, else nothing', () => {
    expect(institutionDescription({ name: 'Granary', desc: 'Grain in, grain out.' })).toBe('Grain in, grain out.');
    expect(institutionDescription({ name: 'Communal root cellar' })).toBe(INSTITUTION_IDENTITY['Communal root cellar']);
    expect(institutionDescription({ name: 'Communal root cellar', desc: '   ' })).toBe(INSTITUTION_IDENTITY['Communal root cellar']);
    expect(institutionDescription({ name: 'A house nobody authored', source: 'custom' })).toBeNull();
  });

  it('every card leads with its description; a house with no service renders no subtitle', () => {
    const { container } = render(<InstitutionsTab settlement={SETTLEMENT} />);
    const cards = [...container.querySelectorAll('[data-testid="institution-card"]')];
    expect(cards.length).toBe(4);
    const granary = cards.find((c) => c.textContent.includes('Granary'));
    const cellar = cards.find((c) => c.textContent.includes('Communal root cellar'));
    const mill = cards.find((c) => c.textContent.includes('Old mill'));
    // the description is the first block under the title row, before the services row
    const granaryDesc = granary.querySelector('[data-testid="institution-desc"]');
    expect(granaryDesc.textContent).toBe('Grain in, grain out.');
    const granaryServices = granary.querySelector('[data-testid="institution-services"]');
    expect(granaryDesc.compareDocumentPosition(granaryServices) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // the authored identity stands in for a house the engine gave no line
    expect(cellar.querySelector('[data-testid="institution-desc"]').textContent).toBe(INSTITUTION_IDENTITY['Communal root cellar']);
    // no service, no subtitle — anchored: the granary's subtitle is on the same render
    expect(mill.querySelector('[data-testid="institution-desc"]').textContent).toBe('A mill with nothing to sell.');
    expect(mill.querySelector('[data-testid="institution-services"]')).toBeNull();
    expect(granaryServices).toBeTruthy();
  });
});

describe('2. the subtitle is a row of doors', () => {
  it('one link per service, named through the seam, and the service description stays on the Services tab', () => {
    const { container } = render(
      <Dossier settlement={SETTLEMENT} setActiveTab={() => {}}><InstitutionsTab settlement={SETTLEMENT} /></Dossier>,
    );
    const granary = [...container.querySelectorAll('[data-testid="institution-card"]')].find((c) => c.textContent.includes('Granary'));
    const doors = within(granary).getAllByRole('button', { name: /^Go to / });
    expect(doors.map((d) => d.textContent)).toEqual(['Grain sale']);
    expect(granary.querySelectorAll('[data-testid="institution-service"]').length).toBe(1);
    // the inverse, not a copy: the row's own sentence is NOT on this page (anchored on the name)
    expect(container.textContent).toContain('Grain sale');
    expect(container.textContent).not.toContain('Sacks by the stone');
  });

  it('outside a dossier (the search mount, an isolated card) the names print as plain text, never dead links', () => {
    const house = institutionsWithServices(SETTLEMENT).find((h) => h.inst.name === 'Granary');
    const sets = { impaired: new Set(), degraded: new Set(), vulnerable: new Set() };
    const { container } = render(<InstitutionCard {...house} sets={sets} />);
    expect(container.textContent).toContain('Grain sale');
    expect(container.querySelector('button')).toBeNull();
  });
});

describe('3. a door opens the Services tab on the row', () => {
  it('clicking a service opens the services tab and stamps the id the row itself computes', () => {
    const setActiveTab = vi.fn();
    const { container } = render(
      <Dossier settlement={SETTLEMENT} setActiveTab={setActiveTab}><InstitutionsTab settlement={SETTLEMENT} /></Dossier>,
    );
    const cellar = [...container.querySelectorAll('[data-testid="institution-card"]')].find((c) => c.textContent.includes('Communal root cellar'));
    fireEvent.click(within(cellar).getByRole('button', { name: 'Go to Root storage' }));
    expect(setActiveTab).toHaveBeenCalledWith('services', 'entity_link');
    const expectedId = entityIdFor('service', serviceEntityOf(ROOTS));
    expect(useStore.getState().focusedEntity?.id).toBe(expectedId);
    expect(expectedId).toBe('service.communal-root-cellar.root-storage');
  });

  it('the service row is the sink: it carries the anchor and scrolls itself when its id is focused', () => {
    const scrolled = [];
    const original = Element.prototype.scrollIntoView;
    Element.prototype.scrollIntoView = function scrollIntoView() { scrolled.push(this.id); };
    try {
      const { container } = render(<ServiceItem svc={ROOTS} impaired={new Set()} degraded={new Set()} vulnerable={new Set()} />);
      const row = container.querySelector('[data-testid="service-row"]');
      expect(row.id).toBe(entityAnchor('service', serviceEntityOf(ROOTS)));
      act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(ROOTS))); });
      expect(scrolled).toContain(row.id);
      // an unrelated focus leaves the row alone (anchored on the scroll above)
      act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(GRAIN))); });
      expect(scrolled.filter((id) => id === row.id).length).toBe(1);
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });
});

describe('4. a folded category opens for its focused row', () => {
  it('fold "Lodging", focus its row, and the row is back', () => {
    const { container } = render(<ServicesTab services={SETTLEMENT.availableServices} settlement={SETTLEMENT} narrativeNote={null} />);
    expect(container.textContent).toContain('A bed above the taproom.');
    const toggle = screen.getByRole('button', { name: /^Lodging/ });
    fireEvent.click(toggle);
    expect(container.textContent).not.toContain('A bed above the taproom.');
    act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(LODGING))); });
    expect(container.textContent).toContain('A bed above the taproom.');
    // an unrelated focus does not reopen a category the reader folded (anchored on the reopen above)
    fireEvent.click(screen.getByRole('button', { name: /^Lodging/ }));
    expect(container.textContent).not.toContain('A bed above the taproom.');
    act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(GRAIN))); });
    expect(container.textContent).not.toContain('A bed above the taproom.');
  });
});

// A component wrapper is referenced so React's static-components lint sees a real use of useState
// in this file's helpers (the Dossier provider above holds no state of its own).
void useState;
