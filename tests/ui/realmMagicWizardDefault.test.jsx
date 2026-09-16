/**
 * @vitest-environment jsdom
 *
 * tests/ui/realmMagicWizardDefault.test.jsx — MG-2 pins for the realm default's
 * ONE consumer and its read-only stance line (docs/DESIGN_REALM_MAGIC_TOGGLE §4,
 * MG-LAW-1 / MG-LAW-4 / MG-LAW-7).
 *
 * The pre-selection is the only place in the design where a realm-level value is
 * read at all, so it is exactly where the double-authority defect would grow
 * back. These pins hold it to being a DEFAULT and nothing more: it speaks only
 * when the DM has not, it writes without claiming the DM's authorship, and it
 * never speaks for a realm that did not answer mundane.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

afterEach(cleanup);

let state = {};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(state); }
  useStore.getState = () => state;
  return { useStore };
});

import { useRealmMagicDefault } from '../../src/components/generate/useRealmMagicDefault.js';
import { WorldLawAxes } from '../../src/components/map/SimulationRulesAxes.jsx';

function Host() {
  const mundane = useRealmMagicDefault();
  return <div data-testid="host">{mundane ? 'mundane' : 'magical'}</div>;
}

function mount({ rules = {}, config = { magicExists: true, priorityMagic: 50 }, authored = false, active = true } = {}) {
  const updateConfig = vi.fn();
  state = {
    activeCampaignId: active ? 'camp-1' : null,
    campaigns: [{ id: 'camp-1', worldState: { simulationRules: rules } }],
    config,
    configExplicitFields: authored ? { magicExists: true } : {},
    updateConfig,
  };
  render(<Host />);
  return { updateConfig };
}

const MUNDANE = { presetId: 'realistic_regional', realmMagicDefault: 'mundane' };

describe('MG-2 — the realm default pre-selects, once', () => {
  test('a mundane realm pre-selects magic-off, both fields, without claiming authorship', () => {
    const { updateConfig } = mount({ rules: MUNDANE });
    expect(screen.getByTestId('host').textContent).toBe('mundane');
    expect(updateConfig).toHaveBeenCalledTimes(1);
    expect(updateConfig).toHaveBeenCalledWith(
      { magicExists: false, priorityMagic: 0 },
      { recordIntent: false },
    );
  });

  test('a magical realm writes nothing at all', () => {
    const { updateConfig } = mount({ rules: { presetId: 'realistic_regional' } });
    expect(screen.getByTestId('host').textContent).toBe('magical');
    expect(updateConfig).not.toHaveBeenCalled();
  });

  test('no active campaign means no realm to speak for', () => {
    const { updateConfig } = mount({ rules: MUNDANE, active: false });
    expect(updateConfig).not.toHaveBeenCalled();
  });

  test("the DM's own answer is sovereign — an authored magic choice is left alone", () => {
    // MG-LAW-4: one strange glowing city in a mundane realm is a deliberate act.
    const { updateConfig } = mount({ rules: MUNDANE, authored: true });
    expect(screen.getByTestId('host').textContent).toBe('mundane');
    expect(updateConfig).not.toHaveBeenCalled();
  });

  test('an already-mundane config is not rewritten on every render', () => {
    const { updateConfig } = mount({ rules: MUNDANE, config: { magicExists: false, priorityMagic: 0 } });
    expect(updateConfig).not.toHaveBeenCalled();
  });
});

describe('MG-2 — the campaign surface states the stance, read-only (MG-LAW-7)', () => {
  const axes = (rules) => {
    render(
      <WorldLawAxes
        draft={rules}
        advanceBlocked={false}
        frozenAutonomyLaw={null}
        onSetField={vi.fn()}
      />,
    );
    return screen.getByTestId('axis-realmMagic');
  };

  test('a mundane realm reads as mundane, with the honest change verb', () => {
    state = {};
    const card = axes(MUNDANE);
    expect(card.textContent).toContain('A mundane world');
    expect(card.textContent).toContain('regenerate the realm to change it');
    // Read-only: the card offers no control at all, unlike every axis beside it.
    expect(card.querySelectorAll('button').length).toBe(0);
  });

  test('a realm that never answered reads as a world of magic', () => {
    state = {};
    const card = axes({ presetId: 'realistic_regional' });
    expect(card.textContent).toContain('A world of magic');
    expect(card.textContent).not.toContain('A mundane world');
  });
});
