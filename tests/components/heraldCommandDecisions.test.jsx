/** @vitest-environment jsdom */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';

const store = vi.hoisted(() => ({
  applyWorldPulseProposal: vi.fn(),
  dismissWorldPulseProposal: vi.fn(),
  canonizeCampaignWorld: vi.fn(),
  resolveIntervalMajors: vi.fn(),
  savedSettlements: [],
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(store),
}));

vi.mock('../../src/components/map/RealmVerbComposer.jsx', () => ({
  default: () => <div data-testid="realm-verb-composer" />,
}));

import HeraldAdjudication from '../../src/components/map/HeraldAdjudication.jsx';

function proposal(id, headline) {
  return {
    id,
    status: 'pending',
    headline,
    summary: `${headline} summary`,
    severity: 0.82,
    reasons: ['A recorded reason'],
    outcome: { id: `${id}:outcome`, candidateType: 'relationship_label_change' },
  };
}

function action(actionId, adapterKey, sourceId) {
  return {
    actionId,
    adapterKey,
    target: { sourceId, settlementId: null },
    availability: { available: true, refusalReason: null },
    revalidateOnInvoke: true,
  };
}

function decisionItem(source) {
  const itemId = `realm-item:campaign-1:decision:${source.id}`;
  return {
    id: itemId,
    presentationKey: itemId,
    identity: { state: 'authored', interactive: true },
    source: {
      primaryClass: 'proposal',
      classes: ['proposal'],
      records: [{ sourceClass: 'proposal', record: source }],
    },
    headline: source.headline,
    summary: source.summary,
    workflow: { kind: 'proposal' },
    resolution: { state: 'unresolved' },
    attention: { class: 'blocking_decision', significance: source.severity },
    legalActions: [
      action('apply-proposal', 'applyWorldPulseProposal', source.id),
      action('dismiss-proposal', 'dismissWorldPulseProposal', source.id),
    ],
    payload: { kind: 'proposal', sourceRecord: source },
  };
}

function resolvedDecisionItem(source, resolution = 'resolved') {
  return {
    ...decisionItem(source),
    workflow: { kind: 'verdict' },
    resolution: { state: resolution },
    attention: { class: 'routine_record', significance: source.severity },
    legalActions: [],
  };
}

const hiddenProposal = proposal('proposal-hidden', 'A hidden proposal');
const visibleProposal = proposal('proposal-visible', 'The visible proposal');
const visibleItem = decisionItem(visibleProposal);

function campaign() {
  return {
    id: 'campaign-1',
    name: 'The realm',
    worldState: {
      canonizedAt: '2026-01-01T00:00:00.000Z',
      proposals: [hiddenProposal, visibleProposal],
      simulationRules: {},
      pulseHistory: [],
    },
  };
}

function renderDecisions(props = {}) {
  return render(
    <HeraldAdjudication
      campaign={campaign()}
      realmDecisionItems={[visibleItem]}
      activeDecisionItemId={visibleItem.presentationKey}
      {...props}
    />,
  );
}

beforeEach(() => {
  store.applyWorldPulseProposal.mockReset();
  store.dismissWorldPulseProposal.mockReset();
  store.canonizeCampaignWorld.mockReset();
  store.resolveIntervalMajors.mockReset();
  store.savedSettlements = [];
});

afterEach(() => {
  cleanup();
});

describe('flagged Herald Decisions', () => {
  test('renders the canonical filtered RealmItem set and focuses the exact Briefing item', async () => {
    renderDecisions();

    expect(screen.queryByText(hiddenProposal.headline)).toBeNull();
    expect(screen.getByText(visibleProposal.headline)).toBeTruthy();
    const item = screen.getByTestId('herald-decision-item');
    expect(item.getAttribute('data-realm-item-id')).toBe(visibleItem.presentationKey);
    expect(item.getAttribute('aria-current')).toBe('true');
    await waitFor(() => expect(document.activeElement).toBe(item));
  });

  test('shows one exact apply receipt and disables a repeated local invocation', async () => {
    store.applyWorldPulseProposal.mockResolvedValue({
      worldState: {
        proposals: [{ ...visibleProposal, status: 'applied' }],
      },
    });
    renderDecisions();

    fireEvent.click(screen.getByTitle('Apply proposal'));

    await waitFor(() => {
      expect(store.applyWorldPulseProposal)
        .toHaveBeenCalledWith('campaign-1', 'proposal-visible');
      expect(screen.getByRole('status').textContent)
        .toContain('authoritative proposal is recorded as applied');
    });
    expect(screen.getAllByRole('status')).toHaveLength(1);

    fireEvent.click(screen.getAllByTitle('This decision was already recorded.')[0]);
    expect(store.applyWorldPulseProposal).toHaveBeenCalledTimes(1);
  });

  test('shows a truthful upgrade receipt when Apply safely supersedes a legacy proposal', async () => {
    store.applyWorldPulseProposal.mockResolvedValue({
      proposalDisposition: 'superseded',
      worldState: {
        proposals: [{ ...visibleProposal, status: 'superseded' }],
      },
    });
    renderDecisions();

    fireEvent.click(screen.getByTitle('Apply proposal'));

    await waitFor(() => {
      expect(screen.getByRole('status').textContent)
        .toContain('upgrade made this proposal obsolete');
    });
    fireEvent.click(screen.getAllByTitle('This decision was already recorded.')[0]);
    expect(store.applyWorldPulseProposal).toHaveBeenCalledTimes(1);
  });

  test('shows a truthful dismiss receipt from the exact returned proposal', async () => {
    store.dismissWorldPulseProposal.mockResolvedValue({
      ...visibleProposal,
      status: 'dismissed',
    });
    renderDecisions();

    fireEvent.click(screen.getByTitle('Dismiss proposal'));

    await waitFor(() => {
      expect(store.dismissWorldPulseProposal)
        .toHaveBeenCalledWith('campaign-1', 'proposal-visible');
      expect(screen.getByRole('status').textContent)
        .toContain('authoritative proposal is recorded as dismissed');
    });
  });

  test('does not manufacture a success receipt when the writer reports a stale no-op', async () => {
    store.dismissWorldPulseProposal.mockResolvedValue(null);
    renderDecisions();

    fireEvent.click(screen.getByTitle('Dismiss proposal'));

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent)
        .toContain('No decision was recorded');
    });
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('keeps terminal cases out of Pending and orders their log by recorded chronology', () => {
    const older = {
      ...proposal('proposal-older', 'The older decision'),
      status: 'dismissed',
      tick: 3,
      updatedAt: '2026-01-02T00:00:00.000Z',
    };
    const newer = {
      ...proposal('proposal-newer', 'The newer refusal'),
      status: 'refused',
      tick: 4,
      updatedAt: '2026-01-03T00:00:00.000Z',
    };

    renderDecisions({
      realmDecisionItems: [
        resolvedDecisionItem(older, 'dismissed'),
        resolvedDecisionItem(newer),
        visibleItem,
      ],
    });

    expect(screen.getByText(visibleProposal.headline)).toBeTruthy();
    const pending = screen.getByText('Pending Decisions').closest('section');
    expect(pending?.textContent).not.toContain(older.headline);
    expect(pending?.textContent).not.toContain(newer.headline);

    const log = screen.getByTestId('adjudication-resolved');
    expect(log.textContent).toContain('refused by the realm');
    expect(log.textContent).toContain('dismissed by you');
    expect(log.textContent.indexOf(newer.headline))
      .toBeLessThan(log.textContent.indexOf(older.headline));
  });

  test('the legacy Decisions projection retains an upgrade-superseded tombstone', () => {
    const superseded = {
      ...proposal('proposal-superseded', 'The obsolete hold'),
      status: 'superseded',
      tick: 4,
      supersededAt: '2026-01-03T00:00:00.000Z',
      supersessionReason: 'record_mode_upgrade',
    };
    const legacyCampaign = campaign();
    legacyCampaign.worldState.proposals = [superseded];
    render(<HeraldAdjudication campaign={legacyCampaign} />);

    const pending = screen.getByText('Pending Decisions').closest('section');
    expect(pending?.textContent).not.toContain(superseded.headline);
    expect(pending?.textContent).toContain('No decision awaits you');
    const log = screen.getByTestId('adjudication-resolved');
    expect(log.textContent).toContain(superseded.headline);
    expect(log.textContent).toContain('superseded by upgrade');
  });
});
