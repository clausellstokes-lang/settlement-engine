/** @vitest-environment jsdom */
/**
 * tests/ui/realmInspectorSize.test.jsx — the Realm Inspector's 3-state size model.
 *
 * Covers plan §1–§6:
 *   - the three size states (min / default / expanded) each render their distinct
 *     container geometry and chrome,
 *   - the minimize / expand / restore / close controls fire the right transitions,
 *   - Esc restores from expanded (and is inert otherwise),
 *   - the hook persists + restores inspectorSize via sessionStorage.
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

afterEach(cleanup);

// Store mock — RealmInspector reads savedSettlements via the store selector.
const storeState = { savedSettlements: [], setActivePricingMoment: vi.fn() };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import RealmInspector from '../../src/components/map/RealmInspector.jsx';
import {
  readHeraldCommandSession,
  writeHeraldCommandSession,
} from '../../src/components/map/heraldCommandSession.js';
import { useRealmInspector } from '../../src/hooks/useRealmInspector.js';

const baseProps = {
  open: true,
  section: 'dashboard',
  onSection: () => {},
  onClose: () => {},
  campaign: null,
  canManageCampaigns: false,
  tier: 'anon',
};

describe('RealmInspector — size states render', () => {
  test('default: 420px dock, not expanded, full header + tabs + body', () => {
    render(<RealmInspector {...baseProps} inspectorSize="default" onSetSize={() => {}} />);
    const aside = screen.getByTestId('realm-inspector');
    // NOTE: jsdom's CSSOM drops a `width: min()/calc()` declaration it can't
    // parse, so width isn't observable here. The default dock is distinguished
    // from expanded by aria-expanded=false + a right-anchored full-height dock
    // (bottom set, left unset) and from min by rendering the full body + tabs.
    expect(aside.getAttribute('data-expanded')).toBe('false');
    expect(aside.style.left).toBe('');
    expect(aside.style.bottom).toBe('8px');
    // Full header: minimize + expand + close all present.
    expect(screen.getByLabelText('Minimize inspector')).toBeTruthy();
    expect(screen.getByLabelText('Expand inspector')).toBeTruthy();
    expect(screen.getByLabelText('Close inspector')).toBeTruthy();
  });

  test('expanded: symmetric edge-to-edge (width auto, left+right set), data-expanded true', () => {
    render(<RealmInspector {...baseProps} inspectorSize="expanded" onSetSize={() => {}} />);
    const aside = screen.getByTestId('realm-inspector');
    expect(aside.style.width).toBe('auto');
    expect(aside.style.left).not.toBe('');
    expect(aside.style.right).not.toBe('');
    expect(aside.getAttribute('data-expanded')).toBe('true');
    // Expanded shows the restore affordance, not a second expand.
    expect(screen.getByLabelText('Restore inspector')).toBeTruthy();
  });

  test('min: slim peek-bar (~280px), body hidden, restore control present', () => {
    render(<RealmInspector {...baseProps} inspectorSize="min" onSetSize={() => {}} />);
    const aside = screen.getByTestId('realm-inspector');
    // The peek-bar docks at the top-right with no bottom edge (auto/short height),
    // unlike the full-height default dock.
    expect(aside.style.bottom).toBe('');
    expect(aside.getAttribute('data-expanded')).toBe('false');
    // The scrolling body (and its lazy section bodies) is not rendered while min.
    expect(screen.queryByText('Loading…')).toBeNull();
    // Peek-bar still offers a restore + close.
    expect(screen.getByLabelText('Restore inspector')).toBeTruthy();
    expect(screen.getByLabelText('Close inspector')).toBeTruthy();
    // No standalone minimize in the peek-bar (already minimized).
    expect(screen.queryByLabelText('Minimize inspector')).toBeNull();
  });
});

describe('RealmInspector — control transitions', () => {
  test('minimize → min, expand → expanded, restore → default, close fires onClose', () => {
    const onSetSize = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <RealmInspector {...baseProps} inspectorSize="default" onSetSize={onSetSize} onClose={onClose} />,
    );
    fireEvent.click(screen.getByLabelText('Minimize inspector'));
    expect(onSetSize).toHaveBeenCalledWith('min');

    fireEvent.click(screen.getByLabelText('Expand inspector'));
    expect(onSetSize).toHaveBeenCalledWith('expanded');

    fireEvent.click(screen.getByLabelText('Close inspector'));
    expect(onClose).toHaveBeenCalledTimes(1);

    // From expanded, the expand control becomes a restore → default.
    rerender(<RealmInspector {...baseProps} inspectorSize="expanded" onSetSize={onSetSize} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Restore inspector'));
    expect(onSetSize).toHaveBeenCalledWith('default');

    // From the peek-bar, restore → default.
    onSetSize.mockClear();
    rerender(<RealmInspector {...baseProps} inspectorSize="min" onSetSize={onSetSize} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('Restore inspector'));
    expect(onSetSize).toHaveBeenCalledWith('default');
  });
});

describe('RealmInspector — Esc', () => {
  test('Esc restores from expanded to default', () => {
    const onSetSize = vi.fn();
    render(<RealmInspector {...baseProps} inspectorSize="expanded" onSetSize={onSetSize} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onSetSize).toHaveBeenCalledWith('default');
  });

  test('Esc is inert when not expanded', () => {
    const onSetSize = vi.fn();
    render(<RealmInspector {...baseProps} inspectorSize="default" onSetSize={onSetSize} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onSetSize).not.toHaveBeenCalled();
  });
});

describe('RealmInspector — settlement portrait handoff', () => {
  test('restores exact scene context and clears it only when the GM dismisses it', async () => {
    const campaign = { id: 'campaign-scene-context', worldState: {} };
    writeHeraldCommandSession(campaign.id, {
      open: true,
      section: 'events',
      sceneContext: {
        action: 'inspect-scene-provenance',
        settlementId: 'save-1',
        sceneId: 'building:market',
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: { kind: 'institution', id: 'market' },
        provenanceRefs: ['provenance:region'],
        provenance: [{
          id: 'provenance:region',
          effect: 'regional-grain',
          family: 'region',
          sourceRef: 'river terrace',
        }],
      },
    });

    render(
      <RealmInspector
        {...baseProps}
        campaign={campaign}
        canManageCampaigns
        tier="premium"
        section="events"
        inspectorSize="default"
        onSetSize={() => {}}
      />,
    );

    expect(screen.getByRole('heading', { name: 'The Covered Market' })).toBeTruthy();
    expect(screen.getByText('institution: market')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', {
      name: 'Dismiss settlement portrait context',
    }));
    expect(screen.queryByTestId('herald-scene-context')).toBeNull();
    await waitFor(() => {
      expect(readHeraldCommandSession(campaign.id)?.sceneContext).toBeNull();
    });
  });
});

describe('useRealmInspector — size persistence', () => {
  const hookArgs = {
    canManageCampaigns: true,
    pendingMapWorkspace: null,
    activeCampaign: { id: 'camp-1' },
    activeCampaignId: 'camp-1',
    consumeMapWorkspace: () => null,
    updateCampaignSimulationRules: () => Promise.resolve(),
    onNavigate: () => {},
    showToast: () => {},
  };

  function Probe({ onState }) {
    const hook = useRealmInspector(hookArgs);
    onState(hook);
    return null;
  }

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test('default is "default" and setInspectorSize persists to sessionStorage', () => {
    let hook;
    act(() => { render(<Probe onState={(h) => { hook = h; }} />); });
    expect(hook.inspectorSize).toBe('default');

    act(() => { hook.setInspectorSize('expanded'); });
    expect(window.sessionStorage.getItem('realmInspectorSize')).toBe('expanded');

    // An invalid value is ignored (validated against the known set).
    act(() => { hook.setInspectorSize('bogus'); });
    expect(window.sessionStorage.getItem('realmInspectorSize')).toBe('expanded');
  });

  test('restores a valid persisted size once on mount', () => {
    window.sessionStorage.setItem('realmInspectorSize', 'min');
    let hook;
    act(() => { render(<Probe onState={(h) => { hook = h; }} />); });
    expect(hook.inspectorSize).toBe('min');
  });

  test('ignores an invalid persisted size and falls back to default', () => {
    window.sessionStorage.setItem('realmInspectorSize', 'bogus');
    let hook;
    act(() => { render(<Probe onState={(h) => { hook = h; }} />); });
    expect(hook.inspectorSize).toBe('default');
  });

  test('restores the campaign-scoped open section after a route remount', () => {
    let hook;
    const first = render(<Probe onState={(h) => { hook = h; }} />);

    act(() => {
      hook.setInspectorOpen(true);
      hook.setInspectorSection('trade');
    });
    first.unmount();

    let restored;
    render(<Probe onState={(h) => { restored = h; }} />);
    expect(restored.inspectorOpen).toBe(true);
    expect(restored.inspectorSection).toBe('trade');
  });
});
