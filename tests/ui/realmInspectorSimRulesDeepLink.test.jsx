/** @vitest-environment jsdom */
/**
 * tests/ui/realmInspectorSimRulesDeepLink.test.jsx — navigation-audit MAJOR #4.
 *
 * The Pantheon "Enable dynamics" CTA must land the GM on the religion-dynamics
 * toggle, which lives only in the Simulation Rules dialog. The strip sets the
 * one-shot `pendingSimulationRules` store signal, then routes to the Realm;
 * useRealmInspector consumes that signal on arrival and opens the dialog.
 *
 * This exercises the REAL hook: with an active, manageable campaign and the
 * signal set, the hook flips showSimulationRules true and consumes the signal
 * exactly once. With the signal absent, the dialog stays closed.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

import { useRealmInspector } from '../../src/hooks/useRealmInspector.js';

afterEach(cleanup);

const baseArgs = {
  canManageCampaigns: true,
  pendingMapWorkspace: null,
  activeCampaign: { id: 'camp-1' },
  activeCampaignId: 'camp-1',
  consumeMapWorkspace: () => null,
  updateCampaignSimulationRules: () => Promise.resolve(),
  onNavigate: () => {},
  showToast: () => {},
};

function Probe({ args, onState }) {
  const hook = useRealmInspector(args);
  onState(hook.showSimulationRules);
  return null;
}

describe('Realm Inspector — Simulation Rules one-shot deep-link', () => {
  test('opens the rules dialog and consumes the signal exactly once', () => {
    const consumeSimulationRules = vi.fn(() => true);
    let latest;
    act(() => {
      render(
        <Probe
          args={{ ...baseArgs, pendingSimulationRules: true, consumeSimulationRules }}
          onState={(v) => { latest = v; }}
        />,
      );
    });
    expect(latest).toBe(true);
    expect(consumeSimulationRules).toHaveBeenCalledTimes(1);
  });

  test('leaves the dialog closed when no signal is pending', () => {
    const consumeSimulationRules = vi.fn(() => false);
    let latest;
    act(() => {
      render(
        <Probe
          args={{ ...baseArgs, pendingSimulationRules: false, consumeSimulationRules }}
          onState={(v) => { latest = v; }}
        />,
      );
    });
    expect(latest).toBe(false);
    expect(consumeSimulationRules).not.toHaveBeenCalled();
  });

  test('leaves the dialog closed when the campaign is not yet active', () => {
    const consumeSimulationRules = vi.fn(() => true);
    let latest;
    act(() => {
      render(
        <Probe
          args={{ ...baseArgs, activeCampaign: null, pendingSimulationRules: true, consumeSimulationRules }}
          onState={(v) => { latest = v; }}
        />,
      );
    });
    expect(latest).toBe(false);
    expect(consumeSimulationRules).not.toHaveBeenCalled();
  });
});
