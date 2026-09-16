/** @vitest-environment jsdom */
/**
 * RealmVerbComposer's presentation boundary.
 *
 * The manifest's schema keys and enum values are durable machine identifiers:
 * they must remain byte-stable when staged, but they must not be shown verbatim
 * to the DM when an imported or future manifest entry lacks authored labels.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const { stageRealmVerb } = vi.hoisted(() => ({
  stageRealmVerb: vi.fn(),
}));

const STORE = {
  savedSettlements: [],
  stageRealmVerb,
};

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(STORE),
}));

vi.mock('../../src/domain/events/realmManifest.js', () => ({
  realmVerbs: () => [{
    verb: 'TEST_TRANSLATION',
    label: 'Test order',
    predicate: () => ({ available: true, reasons: [], unlocks: [] }),
    dials: [
      {
        key: 'war_reason_type',
        kind: 'enum',
        options: ['border_raid', 'trade-war'],
        default: 'border_raid',
      },
      {
        key: 'pressure01',
        label: 'Pressure',
        kind: 'band',
        bandWords: { low_pressure: 0.2, severe_pressure: 0.9 },
        default: 'low_pressure',
      },
    ],
  }],
  realmVetoProse: () => '',
}));

vi.mock('../../src/copy/index.js', () => ({ t: () => '' }));
vi.mock('../../src/lib/guidance.js', () => ({
  isGuidanceDismissed: () => true,
  markGuidanceDismissed: () => {},
}));

import RealmVerbComposer from '../../src/components/map/RealmVerbComposer.jsx';

beforeEach(() => {
  stageRealmVerb.mockReset();
  stageRealmVerb.mockResolvedValue({ ok: true });
});

afterEach(cleanup);

describe('RealmVerbComposer — schema translation without value mutation', () => {
  test('humanizes fallback labels and options while staging the original identifiers', async () => {
    const { container } = render(
      <RealmVerbComposer
        campaign={{
          id: 'realm-1',
          settlementIds: [],
          worldState: { canonizedAt: '2026-01-01T00:00:00.000Z', tick: 0 },
        }}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Test order' }));

    const reason = screen.getByRole('combobox', { name: 'war reason type' });
    expect(screen.getByRole('option', { name: 'border raid' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'trade war' })).toBeTruthy();

    const pressure = screen.getByRole('combobox', { name: 'Pressure' });
    expect(screen.getByRole('option', { name: 'low pressure' })).toBeTruthy();
    expect(screen.getByRole('option', { name: 'severe pressure' })).toBeTruthy();
    expect(container.textContent).not.toContain('war_reason_type');
    expect(container.textContent).not.toContain('trade-war');

    fireEvent.change(reason, { target: { value: 'trade-war' } });
    fireEvent.change(pressure, { target: { value: 'severe_pressure' } });
    fireEvent.click(screen.getByRole('button', { name: 'Stage the order' }));

    expect(stageRealmVerb).toHaveBeenCalledWith('realm-1', 'TEST_TRANSLATION', {
      war_reason_type: 'trade-war',
      pressure01: 0.9,
    });
  });
});
