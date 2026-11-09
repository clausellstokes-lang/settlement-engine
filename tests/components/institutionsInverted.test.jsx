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

import InstitutionsTab, { InstitutionCard, houseStatus, institutionDescription, institutionsWithServices } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { ServiceItem } from '../../src/components/new/serviceComponents.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { entityAnchor, entityIdFor, serviceEntityOf } from '../../src/domain/dossier/entityLinks.js';
import { deriveFactionSupport } from '../../src/domain/dossier/powerSupport.js';
import { INSTITUTION_IDENTITY } from '../../src/domain/display/institutionVocabulary.js';
import { useStore } from '../../src/store/index.js';

const GRAIN = { name: 'Grain sale', desc: 'Sacks by the stone, honest weight.', institution: 'Granary' };
const ROOTS = { name: 'Root storage', desc: 'A dry shelf for the winter.', institution: 'Communal root cellar' };
const LODGING = { name: 'Lodging', desc: 'A bed above the taproom.', institution: 'Inn' };
const SETTLEMENT = {
  id: 'settlement.orderby', name: 'Orderby', tier: 'village', population: 300,
  institutions: [
    { name: 'Granary', category: 'Economy', desc: 'Grain in, grain out.', factionSource: 'Merchant Council' },
    { name: 'Communal root cellar', category: 'Economy' }, // no desc → the authored identity line
    { name: 'Inn', category: 'Economy', desc: 'Beds and a fire.' },
    { name: 'Old mill', category: 'Economy', desc: 'A mill with nothing to sell.' }, // no service
  ],
  powerStructure: { factions: [{ faction: 'Merchant Council', category: 'merchant', power: 60 }] },
  availableServices: { provisioning: [GRAIN, ROOTS], lodging: [LODGING] },
};
const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'services' }, { id: 'power' }];

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
    const doors = within(granary.querySelector('[data-testid="institution-services"]')).getAllByRole('button', { name: /^Go to / });
    expect(doors.map((d) => d.textContent)).toEqual(['Grain sale']);
    expect(granary.querySelectorAll('[data-testid="institution-service"]').length).toBe(1);
    // the inverse, not a copy: the row's own sentence is NOT on this page (anchored on the name)
    expect(container.textContent).toContain('Grain sale');
    expect(container.textContent).not.toContain('Sacks by the stone'); // anchored: the row name is asserted present one line above
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
    expect(container.textContent).not.toContain('A bed above the taproom.'); // anchored: the same row text is asserted present after a focus in this test
    act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(LODGING))); });
    expect(container.textContent).toContain('A bed above the taproom.');
    // an unrelated focus does not reopen a category the reader folded (anchored on the reopen above)
    fireEvent.click(screen.getByRole('button', { name: /^Lodging/ }));
    expect(container.textContent).not.toContain('A bed above the taproom.'); // anchored: the same row text is asserted present after a focus in this test
    act(() => { useStore.getState().focusEntity(entityIdFor('service', serviceEntityOf(GRAIN))); });
    expect(container.textContent).not.toContain('A bed above the taproom.'); // anchored: the same row text is asserted present after a focus in this test
  });
});

// A component wrapper is referenced so React's static-components lint sees a real use of useState
// in this file's helpers (the Dossier provider above holds no state of its own).
void useState;

describe('5. the house wears one tag; the doors carry none (X-41)', () => {
  it('houseStatus is the worst state across the services, impaired over reduced over vulnerable', () => {
    const sets = { impaired: new Set(['Grain sale']), degraded: new Set(['Root storage']), vulnerable: new Set(['Lodging']) };
    expect(houseStatus([GRAIN, ROOTS], sets)?.label).toBe('Impaired');
    expect(houseStatus([ROOTS, LODGING], sets)?.label).toBe('Reduced');
    expect(houseStatus([LODGING], sets)?.label).toBe('Vulnerable');
    expect(houseStatus([], sets)).toBeNull();
    expect(houseStatus([GRAIN], { impaired: new Set(), degraded: new Set(), vulnerable: new Set() })).toBeNull();
  });

  it('the tag sits beside the name and the service doors print no state word', () => {
    const house = institutionsWithServices(SETTLEMENT).find((h) => h.inst.name === 'Granary');
    const sets = { impaired: new Set(), degraded: new Set(), vulnerable: new Set(['Grain sale']) };
    const { container } = render(<InstitutionCard {...house} sets={sets} />);
    const tag = container.querySelector('[data-testid="institution-status"]');
    expect(tag.textContent).toBe('Vulnerable');
    const doors = container.querySelector('[data-testid="institution-services"]');
    expect(doors.textContent).not.toContain('Vulnerable'); // anchored: the tag above carries the word
    expect(tag.compareDocumentPosition(doors) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe('6. the Backs line (X-40): who the house contributes to, each a door to the Power tab', () => {
  it('lists the powers from the support web and opens the Power tab on the faction', () => {
    const setActiveTab = vi.fn();
    const { container } = render(
      <Dossier settlement={SETTLEMENT} setActiveTab={setActiveTab}><InstitutionsTab settlement={SETTLEMENT} /></Dossier>,
    );
    const cards = [...container.querySelectorAll('[data-testid="institution-card"]')];
    const granary = cards.find((c) => c.textContent.includes('Granary'));
    const backs = granary.querySelector('[data-testid="institution-backs"]');
    expect(backs.textContent).toContain('Backs');
    expect(backs.textContent).toContain('Merchant Council');
    // under the description, above the doors
    expect(granary.querySelector('[data-testid="institution-desc"]').compareDocumentPosition(backs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(backs.compareDocumentPosition(granary.querySelector('[data-testid="institution-services"]')) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    fireEvent.click(within(backs).getByRole('button', { name: 'Go to Merchant Council' }));
    expect(setActiveTab).toHaveBeenCalledWith('power', 'entity_link');
    // a house that backs nobody prints no line (anchored on the granary's line above)
    const mill = cards.find((c) => c.textContent.includes('Old mill'));
    expect(mill.querySelector('[data-testid="institution-backs"]')).toBeNull();
  });
});

describe('7. the backs editor (X-45): the DM adds, removes or changes who a house backs', () => {
  // The same town with a seat: the granary is raised by the Merchant Council (the exact mark),
  // the root cellar is a civic store (the catalogue), the mill is a stranger with nothing of its
  // own (the default), so every house backs a power.
  const RULED = () => ({
    ...structuredClone(SETTLEMENT),
    powerStructure: { factions: [
      { faction: 'Merchant Council', category: 'merchant', power: 60 },
      { faction: 'Town Council', category: 'government', power: 40, isGoverning: true },
    ] },
  });
  /** The tab as the dossier mounts it: on the store's own settlement, so an edit re-renders it. */
  function Live({ canAuthor = true }) {
    const settlement = useStore((s) => s.settlement);
    return <InstitutionsTab settlement={settlement} canAuthor={canAuthor} />;
  }
  const cardOf = (container, name) => [...container.querySelectorAll('[data-testid="institution-card"]')].find((c) => c.textContent.includes(name));
  const lineOf = (container, name) => cardOf(container, name).querySelector('[data-testid="institution-backs"]');
  beforeEach(() => { act(() => { useStore.setState({ settlement: RULED(), editMode: true }); }); });
  afterEach(() => { act(() => { useStore.setState({ settlement: null, editMode: false }); }); });

  it('every house backs a power: the mill, with nothing of its own, answers to the seat; no edit affordance without authoring rights', () => {
    const { container } = render(<Live canAuthor={false} />);
    expect(lineOf(container, 'Old mill').textContent).toContain('Town Council');
    expect(lineOf(container, 'Communal root cellar').textContent).toContain('Town Council');
    expect(lineOf(container, 'Granary').textContent).toContain('Merchant Council');
    expect(within(cardOf(container, 'Granary')).queryByRole('button', { name: /Edit who/ })).toBeNull();
  });

  it('a viewer who may author, in edit mode, toggles the roster; the house keeps the DM word as one line and wears the mark', () => {
    const { container } = render(<Live />);
    fireEvent.click(within(cardOf(container, 'Granary')).getByRole('button', { name: 'Edit who Granary backs' }));
    const editor = cardOf(container, 'Granary').querySelector('[data-testid="institution-backs-editor"]');
    // the editor's hint names what the DM's choice does, without the machinery (SW-9; audit row InstitutionsTab:221)
    expect(editor.textContent).toContain('Who this house stands behind. Your choice replaces the original.');
    expect(editor.textContent).not.toMatch(/the engine derived/); // anchored: the hint is asserted present on the line above
    // the chips are the roster, the derived backer already pressed
    expect(within(editor).getByRole('button', { name: 'Merchant Council' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(editor).getByRole('button', { name: 'Town Council' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(within(editor).getByRole('button', { name: 'Town Council' }));
    fireEvent.click(within(editor).getByRole('button', { name: 'Done editing who Granary backs' }));
    const house = useStore.getState().settlement.institutions[0];
    expect(house._userEdits.backs.value).toBe('Merchant Council · Town Council');
    const line = lineOf(container, 'Granary');
    expect(line.textContent).toContain('Merchant Council');
    expect(line.textContent).toContain('Town Council');
    expect(line.querySelector('[data-testid="institution-backs-authored"]')).toBeTruthy();
    expect(cardOf(container, 'Granary').querySelector('[data-testid="institution-backs-editor"]')).toBeNull();
    // the Power tab's web agrees: the granary stands under both, by the DM word
    const web = deriveFactionSupport(useStore.getState().settlement);
    expect(web.get('Town Council').map((e) => [e.name, e.basis])).toContainEqual(['Granary', 'authored']);
    expect(web.get('Merchant Council').map((e) => [e.name, e.basis])).toContainEqual(['Granary', 'authored']);
  });

  it('clearing every chip means nobody, still marked; "As the engine has it" lets the DM word go', () => {
    const { container } = render(<Live />);
    fireEvent.click(within(cardOf(container, 'Granary')).getByRole('button', { name: 'Edit who Granary backs' }));
    let editor = cardOf(container, 'Granary').querySelector('[data-testid="institution-backs-editor"]');
    fireEvent.click(within(editor).getByRole('button', { name: 'Merchant Council' })); // off
    fireEvent.click(within(editor).getByRole('button', { name: 'Done editing who Granary backs' }));
    expect(useStore.getState().settlement.institutions[0]._userEdits.backs.value).toBe('');
    let line = lineOf(container, 'Granary');
    expect(line.textContent).toContain('nobody');
    expect(line.querySelector('[data-testid="institution-backs-authored"]')).toBeTruthy();
    // outside edit mode the emptied line still shows, marked, so the DM can see what they said
    act(() => { useStore.setState({ editMode: false }); });
    line = lineOf(container, 'Granary');
    expect(line.textContent).toContain('nobody');
    expect(within(cardOf(container, 'Granary')).queryByRole('button', { name: /Edit who/ })).toBeNull();
    act(() => { useStore.setState({ editMode: true }); });
    // revert
    fireEvent.click(within(cardOf(container, 'Granary')).getByRole('button', { name: 'Edit who Granary backs' }));
    editor = cardOf(container, 'Granary').querySelector('[data-testid="institution-backs-editor"]');
    fireEvent.click(within(editor).getByRole('button', { name: 'As the engine has it' }));
    expect(useStore.getState().settlement.institutions[0]._userEdits).toBeUndefined();
    line = lineOf(container, 'Granary');
    expect(line.textContent).toContain('Merchant Council');
    expect(line.textContent).not.toContain('nobody'); // anchored: the power name is asserted present on this line one line above
    expect(line.querySelector('[data-testid="institution-backs-authored"]')).toBeNull();
  });
});
