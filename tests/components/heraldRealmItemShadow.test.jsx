/** @vitest-environment jsdom */
/**
 * G-3 shadow-parity integration pins.
 *
 * The shadow flag may pay for one canonical RealmItem derivation and expose its
 * accounting, but it must not promote the G-4 command shell or alter the legacy
 * Herald's seven-door addresses.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup, fireEvent, render, screen,
} from '@testing-library/react';

const harness = vi.hoisted(() => ({
  commandOn: false,
  shadowOn: false,
  derivations: 0,
  commandRenders: 0,
  legacySections: [],
  store: {
    savedSettlements: [],
    selectedSettlementId: null,
    clearSelectedSettlementId: vi.fn(),
    canUseCustomContent: vi.fn(() => true),
  },
}));

vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => {
    if (name === 'heraldCommandBrief') return harness.commandOn;
    if (name === 'realmItemShadowDiagnostics') return harness.shadowOn;
    return false;
  },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(harness.store),
}));

vi.mock('../../src/domain/realm/realmItemReadModel.js', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    buildRealmItemReadModel: () => {
      harness.derivations += 1;
      return {
        items: [{ id: 'proposal-1' }, { id: 'news-1' }, { id: 'news-2' }],
        ranked: [],
        counts: {
          total: 3,
          blocking: 1,
          bySource: {
            proposal: 1,
            wizard_news: 2,
          },
        },
        exclusions: [{
          sourceClass: 'pulse_digest',
          reason: 'Source entry is not a record.',
        }],
        diagnostics: [{
          code: 'source_identity_collision',
          severity: 'error',
          itemId: 'proposal-1',
          message: 'Conflicting projections were retained without interaction.',
        }, {
          code: 'duplicate_source_projection',
          severity: 'info',
          itemId: 'news-1',
          message: 'An exact repeated projection was accounted for once.',
        }],
      };
    },
  };
});

vi.mock('../../src/components/map/HeraldCommandBody.jsx', () => ({
  default: () => {
    harness.commandRenders += 1;
    return <div data-testid="command-body">Command shell</div>;
  },
}));

vi.mock('../../src/components/map/HeraldBody.jsx', () => ({
  default: ({ section }) => {
    harness.legacySections.push(section);
    return <div data-testid="legacy-body">{section}</div>;
  },
}));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';

const baseProps = {
  open: true,
  section: 'war',
  onSection: vi.fn(),
  onClose: vi.fn(),
  campaign: { id: 'campaign-shadow', worldState: {} },
  canManageCampaigns: true,
  tier: 'premium',
  inspectorSize: 'default',
  onSetSize: vi.fn(),
};

afterEach(() => {
  cleanup();
  harness.commandOn = false;
  harness.shadowOn = false;
  harness.derivations = 0;
  harness.commandRenders = 0;
  harness.legacySections = [];
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe('RealmItem legacy-Herald shadow diagnostics', () => {
  test('both flags off perform zero RealmItem derivation and render no accounting', () => {
    render(<RealmInspector {...baseProps} />);

    expect(harness.derivations).toBe(0);
    expect(screen.queryByTestId('realm-item-shadow-diagnostics')).toBeNull();
    expect(screen.getByTestId('legacy-body').textContent).toBe('war');
    expect(screen.queryByTestId('command-body')).toBeNull();
  });

  test('shadow-on keeps the legacy body while exposing source and failure accounting', () => {
    harness.shadowOn = true;
    render(<RealmInspector {...baseProps} />);

    expect(harness.derivations).toBe(1);
    expect(screen.getByTestId('legacy-body').textContent).toBe('war');
    expect(screen.queryByTestId('command-body')).toBeNull();

    const panel = screen.getByTestId('realm-item-shadow-diagnostics');
    fireEvent.click(panel.querySelector('summary'));
    expect(panel.textContent).toContain('3 items');
    expect(panel.textContent).toContain('3 source refs');
    expect(panel.textContent).toContain('Families present2/8');
    expect(panel.textContent).toContain('proposal 1');
    expect(panel.textContent).toContain('wizard news 2');
    expect(panel.textContent).toContain('Excluded1');
    expect(panel.textContent).toContain('Collisions 1 · errors 1 · deduplicated repeats 1');
    expect(panel.textContent).toContain('Source entry is not a record.');
    expect(panel.textContent).toContain('source_identity_collision');
  });

  test('the shadow flag does not switch tabs, callbacks, or body rendering to G-4', () => {
    harness.shadowOn = true;
    const onSection = vi.fn();
    render(<RealmInspector {...baseProps} onSection={onSection} />);

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'War' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Adjudication' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^Briefing/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /^Stories/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Faith' }));
    expect(onSection).toHaveBeenLastCalledWith('faith');
    expect(harness.commandRenders).toBe(0);
    expect(harness.legacySections).toContain('war');
  });
});
