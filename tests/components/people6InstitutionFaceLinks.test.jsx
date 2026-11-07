/** @vitest-environment jsdom */
/**
 * people6InstitutionFaceLinks.test.jsx — PEOPLE-6 LINKS (the owner's word, 2026-11-07: "I would
 * like for the institution cards to have a small row in each card that has the name of their NPC
 * that also acts as a link to the NPC's card that NPC card also has a link to the institution card
 * the NPC belongs to").
 *
 * Both directions ride the dossier's ONE navigation (EntityLink → navigateToEntity → the target's
 * tab + focusedEntity), by the ids the target cards compute for themselves:
 *   1. the view model joins each house to its face (`institution.key` = the row's name);
 *   2. the Institutions card prints "<title> — <name>", the name a door to the NPC's card;
 *      a house with no face prints no row;
 *   3. the NPC card's institution line is a door to its house's card; a minted face (kind
 *      'power') leads to its power's card; a DM's person (`institution: null`) has no door;
 *   4. the gallery veil and the public-safe projection hide the join as they hide the NPC card's
 *      house: with the card's `institution` gone, no row and no door.
 */
import React from 'react';
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, act, within } from '@testing-library/react';

vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));

import InstitutionsTab, { institutionsWithServices } from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { NPCInlineCard } from '../../src/components/new/npcComponents.jsx';
import { DossierEntityContext } from '../../src/components/dossier/DossierEntityContext.jsx';
import { useDossierEntityNav } from '../../src/components/dossier/useNavigateToEntity.js';
import { entityIdFor } from '../../src/domain/dossier/entityLinks.js';
import { facesByHouse } from '../../src/domain/people/cardPowers.js';
import { cardInstitutionDoorOf, cardHonorificOf, faceNameOf } from '../../src/domain/people/cardDoor.js';
import { applyVeil } from '../../src/domain/display/galleryVeil.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';
import { factionIdFromName } from '../../src/lib/entities.js';
import { useStore } from '../../src/store/index.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const MILLER = {
  id: 'npc_mill', name: 'Edda Marl', role: 'the miller', title: 'the miller', category: 'craft',
  institution: { kind: 'house', key: 'Mill', family: 'mills', title: 'the miller' }, memberships: [],
};
const REEVE = {
  id: 'npc_seat', name: 'Osric Vane', role: 'the reeve', title: 'the reeve', category: 'government',
  institution: { kind: 'power', key: 'Village Moot', family: null, title: 'the reeve' }, memberships: [{ power: 'Village Moot', rank: 1 }],
};
const STRANGER = { id: 'npc_dm', name: 'Wynn Tallow', role: 'traveller', category: 'other', institution: null };
const SETTLEMENT = {
  id: 'settlement.marlby', name: 'Marlby', tier: 'village', population: 300,
  institutions: [
    { name: 'Mill', category: 'Crafts', desc: 'Grain ground for a share.' },
    { name: 'Weekly market', category: 'Economy', desc: 'Stalls on the green.' }, // NONE: no face
  ],
  npcs: [MILLER, REEVE, STRANGER],
  powerStructure: { factions: [{ faction: 'Village Moot', category: 'government', power: 60 }] },
  availableServices: {},
};
const TABS = [{ id: 'overview' }, { id: 'institutions' }, { id: 'npcs' }, { id: 'power' }];

function Dossier({ settlement, setActiveTab, children }) {
  const value = useDossierEntityNav(settlement, setActiveTab, TABS, {});
  return <DossierEntityContext.Provider value={value}>{children}</DossierEntityContext.Provider>;
}
const cardOf = (container, name) => [...container.querySelectorAll('[data-testid="institution-card"]')].find((c) => c.textContent.includes(name));

beforeAll(() => {
  if (typeof window !== 'undefined' && !window.matchMedia) {
    window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
  }
});
beforeEach(() => { act(() => { useStore.getState().clearFocusedEntity?.(); useStore.setState({ settlement: SETTLEMENT }); }); });
afterEach(() => cleanup());

describe('1. the view model joins each house to its face', () => {
  it('facesByHouse keys house faces by the row name; a minted face and a DM person are not houses', () => {
    const faces = facesByHouse(SETTLEMENT.npcs);
    expect(faces.get('Mill')?.id).toBe('npc_mill');
    expectAbsentWithAnchor([...faces.keys()], 'Village Moot', 'Mill', 'a minted face has no row');
    expect(faces.size).toBe(1);
  });

  it('institutionsWithServices carries the face, null for a house with none', () => {
    const rows = institutionsWithServices(SETTLEMENT);
    expect(rows.find((r) => r.inst.name === 'Mill')?.face?.name).toBe('Edda Marl');
    expect(rows.find((r) => r.inst.name === 'Weekly market')?.face).toBeNull();
  });
});

describe('2. the Institutions card: the face row is a door to the NPC card', () => {
  it('prints "<honorific> <name>" and it opens the NPC tab on the card\'s own id', () => {
    const setActiveTab = vi.fn();
    const { container } = render(<Dossier settlement={SETTLEMENT} setActiveTab={setActiveTab}><InstitutionsTab settlement={SETTLEMENT} /></Dossier>);
    const row = within(cardOf(container, 'Mill')).getByTestId('institution-face');
    expect(row.textContent).toBe('Master Miller Edda Marl'); // the pool's pick for npc_mill::Mill
    fireEvent.click(within(row).getByRole('button', { name: 'Go to Edda Marl' }));
    expect(setActiveTab).toHaveBeenCalledWith('npcs', 'entity_link');
    expect(useStore.getState().focusedEntity?.id).toBe(entityIdFor('npc', MILLER));
  });

  it('a house with no face shows no row', () => {
    const { container } = render(<Dossier settlement={SETTLEMENT} setActiveTab={vi.fn()}><InstitutionsTab settlement={SETTLEMENT} /></Dossier>);
    const rows = [...container.querySelectorAll('[data-testid="institution-face"]')].map((r) => r.closest('[data-testid="institution-card"]')?.textContent || '');
    expect(rows.length).toBe(1);
    expect(cardOf(container, 'Weekly market').querySelector('[data-testid="institution-face"]')).toBeNull();
  });
});

describe('3. the NPC card: the institution line is a door back', () => {
  it('cardInstitutionDoorOf: house → its row\'s card id; minted → its power\'s id; DM person → none', () => {
    expect(cardInstitutionDoorOf(MILLER, SETTLEMENT)).toEqual({ type: 'institution', id: entityIdFor('institution', SETTLEMENT.institutions[0]), name: 'Mill' });
    expect(cardInstitutionDoorOf(REEVE, SETTLEMENT)).toEqual({ type: 'faction', id: factionIdFromName('Village Moot'), name: 'Village Moot' });
    expect(cardInstitutionDoorOf(STRANGER, SETTLEMENT)).toBeNull();
    // a house the roster no longer holds keeps its name with no target (plain text)
    expect(cardInstitutionDoorOf({ institution: { kind: 'house', key: 'Gone', title: 'x' } }, SETTLEMENT)).toEqual({ type: 'institution', id: '', name: 'Gone' });
  });

  it('a house face\'s line opens the Institutions tab on the house\'s own id', () => {
    const setActiveTab = vi.fn();
    const { getByTestId } = render(<Dossier settlement={SETTLEMENT} setActiveTab={setActiveTab}><NPCInlineCard npc={MILLER} /></Dossier>);
    fireEvent.click(within(getByTestId('npc-institution-door')).getByRole('button', { name: /^Go to / }));
    expect(setActiveTab).toHaveBeenCalledWith('institutions', 'entity_link');
    expect(useStore.getState().focusedEntity?.id).toBe(entityIdFor('institution', SETTLEMENT.institutions[0]));
  });

  it('a minted face\'s line opens the Power tab on its power', () => {
    const setActiveTab = vi.fn();
    const { getByTestId } = render(<Dossier settlement={SETTLEMENT} setActiveTab={setActiveTab}><NPCInlineCard npc={REEVE} /></Dossier>);
    fireEvent.click(within(getByTestId('npc-institution-door')).getByRole('button', { name: /^Go to / }));
    expect(setActiveTab).toHaveBeenCalledWith('power', 'entity_link');
    expect(useStore.getState().focusedEntity?.id).toBe(factionIdFromName('Village Moot'));
  });

  it('a DM-authored card with institution: null shows no door', () => {
    const { container } = render(<Dossier settlement={SETTLEMENT} setActiveTab={vi.fn()}><NPCInlineCard npc={STRANGER} /></Dossier>);
    expect(container.textContent).toContain('Wynn Tallow');
    expect(container.querySelector('[data-testid="npc-institution-door"]')).toBeNull();
  });
});

describe('4. the veil and the public projection hide the join as they hide the card\'s house', () => {
  it('the gallery veil (the NPC card\'s ties eye) removes the row and the door together', () => {
    const veiled = applyVeil(SETTLEMENT, ['field:npc:npc_mill:ties']);
    const miller = veiled.npcs.find((n) => n.id === 'npc_mill');
    expect(miller.name).toBe('Edda Marl');
    expect(cardInstitutionDoorOf(miller, veiled)).toBeNull();
    const { container } = render(<Dossier settlement={veiled} setActiveTab={vi.fn()}><InstitutionsTab settlement={veiled} /></Dossier>);
    expect(cardOf(container, 'Mill').textContent).toContain('Grain ground');
    expect(container.querySelector('[data-testid="institution-face"]')).toBeNull();
    // the unveiled control prints the row
    expect(facesByHouse(SETTLEMENT.npcs).has('Mill')).toBe(true);
  });

  it('the public-safe projection strips the card\'s institution, so no row and no door', () => {
    const pub = toPublicSafe(SETTLEMENT);
    const miller = pub.npcs.find((n) => n.name === 'Edda Marl');
    expect(miller.name).toBe('Edda Marl');
    expect(cardInstitutionDoorOf(miller, pub)).toBeNull();
    const rows = institutionsWithServices(pub);
    expect(rows.find((r) => r.inst.name === 'Mill')?.inst.name).toBe('Mill');
    expect(rows.find((r) => r.inst.name === 'Mill')?.face).toBeNull();
  });
});

describe('5. step 2: the honorific (the owner: "Pastor Robert Thomas" on the institution card; the name alone on the NPC card, the role on its own row)', () => {
  const PASTOR = {
    id: 'npc_parish-church', name: 'Robert Thomas', role: 'the priest', title: 'the priest', category: 'religious', gender: 'male',
    institution: { kind: 'house', key: 'Parish church', family: 'parish', title: 'the priest' }, memberships: [],
  };
  const ABBESS = { ...PASTOR, id: 'npc_abbey', name: 'Hild Wren', gender: 'female', institution: { kind: 'house', key: 'Abbey', family: 'monastery', title: 'the abbot' } };
  const CHURCHED = { ...SETTLEMENT, institutions: [...SETTLEMENT.institutions, { name: 'Parish church', category: 'Religious', desc: 'Stone and a bell.' }], npcs: [...SETTLEMENT.npcs, PASTOR] };

  it('the resolvers: the registry form, by gender; nothing for a card with no institution', () => {
    expect(cardHonorificOf(PASTOR)).toBe('Pastor');
    expect(faceNameOf(PASTOR)).toBe('Pastor Robert Thomas');
    expect(cardHonorificOf(ABBESS)).toBe('Mother Abbess'); // the pool's pick for npc_abbey::Abbey, the feminine form
    // the pick is a pure function of the card's id and its house: stable, and the same on every call
    expect(cardHonorificOf({ ...PASTOR })).toBe(cardHonorificOf(PASTOR));
    expect(cardHonorificOf({ ...PASTOR, id: 'npc_robert' })).toBe('Reverend');
    expect(cardHonorificOf(REEVE)).toBe('Reeve');
    expect(faceNameOf(STRANGER)).toBe('Wynn Tallow');
    expect(cardHonorificOf(STRANGER)).toBe('');
  });

  it('the institution card prints "Pastor Robert Thomas" as the door', () => {
    act(() => { useStore.setState({ settlement: CHURCHED }); });
    const setActiveTab = vi.fn();
    const { container } = render(<Dossier settlement={CHURCHED} setActiveTab={setActiveTab}><InstitutionsTab settlement={CHURCHED} /></Dossier>);
    const row = within(cardOf(container, 'Stone and a bell.')).getByTestId('institution-face');
    expect(row.textContent).toBe('Pastor Robert Thomas');
    fireEvent.click(within(row).getByRole('button', { name: 'Go to Robert Thomas' }));
    expect(useStore.getState().focusedEntity?.id).toBe(entityIdFor('npc', PASTOR));
  });

  it('the NPC card: the heading is the full name alone; the role row under the door reads the honorific', () => {
    act(() => { useStore.setState({ settlement: CHURCHED }); });
    const { getByTestId, getByText } = render(<Dossier settlement={CHURCHED} setActiveTab={vi.fn()}><NPCInlineCard npc={PASTOR} /></Dossier>);
    const heading = getByText('Robert Thomas');
    expect(heading.parentElement.textContent.startsWith('Robert Thomas')).toBe(true);
    expectAbsentWithAnchor([...heading.parentElement.children].map((n) => n.textContent), 'the priest', 'Robert Thomas', 'no title beside the name');
    // the role row reads the SAME picked form as the institution card's row
    expect(getByTestId('npc-role').textContent).toBe('Pastor');
    expect(faceNameOf(PASTOR)).toBe(`${getByTestId('npc-role').textContent} Robert Thomas`);
    // the role row follows the line holding the door
    expect(getByTestId('npc-institution-door').closest('div').nextElementSibling).toBe(getByTestId('npc-role'));
    // the door is a link, so it sits under the toggle, never inside its <button> (invalid HTML)
    expect(getByTestId('npc-institution-door').closest('[data-testid="npc-card-line"]')).toBeTruthy();
    expect(getByTestId('npc-institution-door').closest('button[aria-expanded]')).toBeNull();
  });

  it('a minted face\'s role row reads its mint title\'s honorific; a DM\'s person has no role row', () => {
    const minted = render(<Dossier settlement={SETTLEMENT} setActiveTab={vi.fn()}><NPCInlineCard npc={REEVE} /></Dossier>);
    expect(minted.getByTestId('npc-role').textContent).toBe('Reeve');
    cleanup();
    const dm = render(<Dossier settlement={SETTLEMENT} setActiveTab={vi.fn()}><NPCInlineCard npc={STRANGER} /></Dossier>);
    expect(dm.container.textContent).toContain('Wynn Tallow');
    expect(dm.container.querySelector('[data-testid="npc-role"]')).toBeNull();
  });

  it('the veil and the public projection take the honorific with the house: the name stays bare', () => {
    const veiled = applyVeil(CHURCHED, ['field:npc:npc_parish-church:ties']);
    const v = veiled.npcs.find((n) => n.id === 'npc_parish-church');
    expect(faceNameOf(v)).toBe('Robert Thomas');
    expect(cardHonorificOf(v)).toBe('');
    const pub = toPublicSafe(CHURCHED).npcs.find((n) => n.name === 'Robert Thomas');
    expect(faceNameOf(pub)).toBe('Robert Thomas');
    expect(cardHonorificOf(pub)).toBe('');
    // the unveiled control
    expect(faceNameOf(CHURCHED.npcs.find((n) => n.id === 'npc_parish-church'))).toBe('Pastor Robert Thomas');
  });
});
