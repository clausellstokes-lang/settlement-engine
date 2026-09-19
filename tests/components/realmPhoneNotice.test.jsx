/** @vitest-environment jsdom */
/**
 * realmPhoneNotice.test.jsx — /realm ON A PHONE SAYS SO, AND ENDS IN A DOOR.
 *
 * THE OWNER (ODQ §934.26): "I would remove the realm from the phone. No realm view for
 * phone but it can be viewed on a tablet." The ruling as built names the two answers
 * that are forbidden: "/realm at phone width renders an honest notice through the
 * refusal-notice primitive … NEVER a blank or a redirect."
 *
 * Both forbidden answers are shapes a green test can hide. A blank page satisfies "no
 * map was rendered"; a redirect satisfies "the map is gone". So every arm below asserts
 * the POSITIVE — the sentence a reader meets, the route still being /realm — and the
 * negatives are anchored on it.
 *
 * ⛔ THE SEAM UNDER TEST IS `focusEntity`'s RESERVED `tab:` NAMESPACE
 * (components/dossier/useCrossSettlementFocus.js). It is reused rather than replaced by
 * a new store action because a new uiSlice action costs an operation-registry row and a
 * raise of the shrink-only EXEMPT ceiling; the price of the reuse is that the two
 * namespaces must not collide, which the last arm proves over the REAL index built from
 * a real settlement shape rather than over a promise.
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  storeState: /** @type {Record<string, any>} */ ({}),
  navigate: vi.fn(),
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(mocks.storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({
  navigate: (...args) => mocks.navigate(...args),
  useRoute: () => ({ view: 'realm', params: {} }),
  replacePath: vi.fn(),
}));

import RealmPhoneNotice, { REALM_PHONE_REFUSAL, RELATIONSHIPS_TARGET } from '../../src/components/map/RealmPhoneNotice.jsx';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';
import { useCrossSettlementFocus } from '../../src/components/dossier/useCrossSettlementFocus.js';
import { buildDossierEntityIndex, TYPE_TO_TAB } from '../../src/domain/dossier/entityLinks.js';
import { t } from '../../src/copy/index.js';

/** The owner's own sentence, quoted from the order. */
const THE_SENTENCE = 'The realm map opens on a tablet or larger screen.';

function setStore(overrides = {}) {
  mocks.storeState = {
    settlement: null,
    activeSaveId: null,
    focusEntity: vi.fn(),
    ...overrides,
  };
}

beforeEach(() => { setStore(); mocks.navigate.mockClear(); });
afterEach(() => { cleanup(); });

describe('THE REALM ON A PHONE — a notice, never a blank and never a redirect', () => {
  test('the sentence the owner ordered is the one a reader meets', () => {
    render(<RealmPhoneNotice />);
    // The rubric and the body both come through the ONE refusal dictionary, so this also
    // proves the reason resolves rather than rendering nothing (RefusalNotice returns
    // null for a reason it cannot resolve — which would be the blank page again).
    const copy = refusalCopy(REFUSAL_REASONS.REALM_NEEDS_TABLET);
    expect(copy, 'the reason resolves to no words at all').not.toBeNull();
    expect(copy.body.startsWith(THE_SENTENCE), `the body no longer opens with the owner's sentence: ${copy.body}`).toBe(true);
    expect(screen.getByText(copy.body)).toBeTruthy();
    expect(screen.getByText(copy.rubric)).toBeTruthy();
  });

  test('it is ANNOUNCED, not merely shown, and it is not blank', () => {
    const { container } = render(<RealmPhoneNotice />);
    expect(screen.getByRole('alert'), 'the notice is not announced').toBeTruthy();
    // anchored: the alert above is asserted present on this same render, so "not blank"
    // is measured against a surface that really rendered.
    expect(container.textContent.trim().length, 'the phone realm route rendered nothing').toBeGreaterThan(40);
  });

  test('NO REDIRECT: rendering the notice navigates nowhere', () => {
    render(<RealmPhoneNotice />);
    expect(screen.getByTestId('realm-phone-notice'), 'presence control: the notice mounted').toBeTruthy();
    expect(
      mocks.navigate.mock.calls,
      '\nThe phone realm route navigated on its own. The owner\'s order forbids a redirect: the '
      + 'address must keep meaning what a bookmark or a shared link said.\n',
    ).toEqual([]);
  });

  test('with NO settlement loaded the notice is the sentence alone', () => {
    render(<RealmPhoneNotice />);
    // anchored: the notice's own text is asserted present in the arms above on the same
    // store shape, so an empty render cannot be what makes this pass.
    expect(screen.getByTestId('realm-phone-notice')).toBeTruthy();
    expect(
      screen.queryByRole('button', { name: t('dossier.relationshipsDoor') }),
      'a door to a dossier that is not open',
    ).toBeNull();
  });

  test('with a settlement loaded the notice ends in a door to the relationship web', () => {
    const focusEntity = vi.fn();
    setStore({ settlement: { name: 'Spitzplatz' }, activeSaveId: 'save-7', focusEntity });
    render(<RealmPhoneNotice />);

    const door = screen.getByRole('button', { name: t('dossier.relationshipsDoor') });
    fireEvent.click(door);

    // STAMP BEFORE NAVIGATION — the dossier reads the target as it mounts.
    expect(focusEntity).toHaveBeenCalledWith(RELATIONSHIPS_TARGET);
    expect(mocks.navigate).toHaveBeenCalledWith('settlements', { params: { id: 'save-7' } });
    expect(focusEntity.mock.invocationCallOrder[0]).toBeLessThan(mocks.navigate.mock.invocationCallOrder[0]);
  });

  test('a live draft with no save still gets its door, addressed at the library', () => {
    setStore({ settlement: { name: 'Spitzplatz' }, activeSaveId: null, focusEntity: vi.fn() });
    render(<RealmPhoneNotice />);
    fireEvent.click(screen.getByRole('button', { name: t('dossier.relationshipsDoor') }));
    expect(mocks.navigate).toHaveBeenCalledWith('settlements', {});
  });

  test('the refusal record is the registered reason, with no vars', () => {
    expect(REALM_PHONE_REFUSAL).toEqual({ reason: 'realmNeedsTablet', vars: null });
  });
});

describe('THE TAB TARGET — the dossier honours it, and it cannot collide with an entity', () => {
  /** Drive the real hook the dossier mounts, with a spy for its tab setter. */
  function driveFocus({ id, allTabs, index = { resolve: () => null } }) {
    const setActiveTab = vi.fn();
    renderHook(() => useCrossSettlementFocus({
      focusedEntity: { id, ts: 1 },
      index,
      allTabs,
      saveId: 'save-7',
      activeTab: 'overview',
      setActiveTab,
    }));
    return setActiveTab;
  }

  test('`tab:relationships` selects the Relationships tab when the settlement has one', () => {
    const setActiveTab = driveFocus({
      id: RELATIONSHIPS_TARGET,
      allTabs: [{ id: 'overview' }, { id: 'relationships' }],
    });
    expect(setActiveTab).toHaveBeenCalledWith('relationships', 'entity_link');
  });

  test('a settlement with no Relationships tab is a NO-OP, never a wrong tab', () => {
    // The door is honest by construction: the existing guard waits for a tab that is
    // really present rather than falling back to the first one.
    const setActiveTab = driveFocus({
      id: RELATIONSHIPS_TARGET,
      allTabs: [{ id: 'overview' }, { id: 'npcs' }],
    });
    expect(setActiveTab).not.toHaveBeenCalled();
  });

  test('an ENTITY target still resolves through the index (the seam is additive)', () => {
    const setActiveTab = driveFocus({
      id: 'faction.iron_guild',
      allTabs: [{ id: 'overview' }, { id: 'power' }],
      index: { resolve: (id) => (id === 'faction.iron_guild' ? { tab: 'power', anchor: null } : null) },
    });
    expect(setActiveTab).toHaveBeenCalledWith('power', 'entity_link');
  });

  test('no id the REAL index mints begins `tab:` — the namespaces cannot collide', () => {
    const settlement = {
      name: 'Spitzplatz',
      npcs: [{ name: 'Adel Vorn', role: 'Reeve' }, { name: 'Bela Krast', role: 'Smith' }],
      factions: [{ faction: 'Iron Guild' }, { faction: 'The Quiet Hand' }],
      institutions: [{ name: 'The Salt Hall' }],
      interSettlementRelationships: [{ neighbourName: 'Harrowgate' }],
      history: [{ name: 'The Long Winter', type: 'famine' }],
      config: { nearbyResources: ['mountain_timber'] },
      availableServices: [{ name: 'Smithy' }],
    };
    const index = buildDossierEntityIndex(settlement);
    // `byId` is the index's OWN key space — every id and alias it can ever resolve —
    // so this asks the collision question of the real answer set, not of a sample of it.
    const ids = [...index.byId.keys()];
    // ⛔ ANTI-VACUITY: a collision test over an empty id set proves nothing.
    expect(ids.length, 'the real index minted no ids — has its shape changed?').toBeGreaterThanOrEqual(5);
    expect(ids.filter((id) => String(id).startsWith('tab:')), 'an entity id entered the tab: namespace').toEqual([]);
    // …and the tab the door asks for is a tab the entity map already names, so the two
    // vocabularies agree about what "relationships" means.
    expect(Object.values(TYPE_TO_TAB)).toContain('relationships');
    expect(RELATIONSHIPS_TARGET).toBe('tab:relationships');
  });

  test('a repeated focus stamp fires once per event (the existing guard still holds)', () => {
    const setActiveTab = vi.fn();
    const props = {
      focusedEntity: { id: RELATIONSHIPS_TARGET, ts: 1 },
      index: { resolve: () => null },
      allTabs: [{ id: 'overview' }, { id: 'relationships' }],
      saveId: 'save-7',
      activeTab: 'overview',
      setActiveTab,
    };
    const { rerender } = renderHook((p) => useCrossSettlementFocus(p), { initialProps: props });
    act(() => { rerender({ ...props }); });
    expect(setActiveTab).toHaveBeenCalledTimes(1);
  });
});
