/** @vitest-environment jsdom */

import { useState } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  cleanup, fireEvent, render, screen, waitFor,
} from '@testing-library/react';

const harness = vi.hoisted(() => ({
  commandOn: false,
  commandProps: null,
  legacyProps: null,
  store: {
    savedSettlements: [],
    selectedSettlementId: null,
    clearSelectedSettlementId: vi.fn(),
    canUseCustomContent: vi.fn(() => true),
  },
  readModelOptions: null,
}));

vi.mock('../../src/lib/flags.js', () => ({
  flag: name => name === 'heraldCommandBrief' && harness.commandOn,
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(harness.store),
}));

vi.mock('../../src/domain/realm/realmItemReadModel.js', () => ({
  buildRealmItemReadModel: (_campaign, options) => {
    harness.readModelOptions = options;
    return {
      items: [{
        id: 'decision-1',
        source: { primaryClass: 'proposal', classes: ['proposal'] },
        epistemic: { class: 'pending_decision' },
        workflow: { kind: 'proposal' },
        resolution: { state: 'unresolved' },
        temporal: { phase: 'planned' },
        attention: { class: 'blocking_decision', significance: 0.8 },
        topic: { primary: 'trade', tags: [] },
        subjects: [],
        affectedEntities: [],
      }, {
        id: 'pulse-old',
        source: { primaryClass: 'pulse_outcome', classes: ['pulse_outcome'] },
        epistemic: { class: 'recorded_fact' },
        workflow: { kind: 'report' },
        resolution: { state: 'resolved' },
        temporal: { phase: 'historical' },
        attention: { class: 'routine_record', significance: 0.2 },
        topic: { primary: 'war', tags: [] },
        subjects: [],
        affectedEntities: [],
        tick: 2,
      }, {
        id: 'pulse-latest',
        source: { primaryClass: 'pulse_digest', classes: ['pulse_digest'] },
        epistemic: { class: 'recorded_fact' },
        workflow: { kind: 'report' },
        resolution: { state: 'resolved' },
        temporal: { phase: 'historical' },
        attention: { class: 'routine_record', significance: 0.2 },
        topic: { primary: 'trade', tags: [] },
        subjects: [],
        affectedEntities: [],
        tick: 5,
      }, {
        id: 'news-latest',
        source: { primaryClass: 'wizard_news', classes: ['wizard_news'] },
        epistemic: { class: 'recorded_fact' },
        workflow: { kind: 'report' },
        resolution: { state: 'resolved' },
        temporal: { phase: 'historical' },
        attention: { class: 'routine_record', significance: 0.2 },
        topic: { primary: 'events', tags: [] },
        subjects: [],
        affectedEntities: [],
        tick: 3,
      }],
      ranked: [],
    };
  },
}));

vi.mock('../../src/components/map/HeraldCommandBody.jsx', () => ({
  default: props => {
    harness.commandProps = props;
    return (
      <div data-testid="command-body">
        {props.view}:{props.topic || 'all'}
        {props.view === 'briefing' && (
          <button
            type="button"
            data-herald-command-origin="decision-1"
            onClick={event => props.onSection(
              'adjudication',
              { id: 'decision-1' },
              event.currentTarget,
            )}
          >
            Review decision
          </button>
        )}
        {props.view === 'decisions' && props.returnToOrigin && (
          <button type="button" onClick={props.onReturnToOrigin}>
            Return to {props.returnToOrigin.label}
          </button>
        )}
      </div>
    );
  },
}));

vi.mock('../../src/components/map/HeraldBody.jsx', () => ({
  default: props => {
    harness.legacyProps = props;
    return <div data-testid="legacy-body">{props.section}</div>;
  },
}));

import RealmInspector from '../../src/components/map/RealmInspector.jsx';

const baseProps = {
  open: true,
  section: 'dashboard',
  onSection: vi.fn(),
  onClose: vi.fn(),
  campaign: { id: 'campaign-1', worldState: {} },
  canManageCampaigns: true,
  tier: 'premium',
  inspectorSize: 'default',
  onSetSize: vi.fn(),
};

function ControlledInspector() {
  const [section, setSection] = useState('briefing');
  return (
    <RealmInspector
      {...baseProps}
      section={section}
      onSection={setSection}
    />
  );
}

afterEach(() => {
  cleanup();
  harness.commandOn = false;
  harness.commandProps = null;
  harness.legacyProps = null;
  harness.readModelOptions = null;
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe('RealmInspector command-brief compatibility shell', () => {
  test('flag off retains the established seven-door render path', () => {
    render(<RealmInspector {...baseProps} section="war" />);

    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'War' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Adjudication' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Briefing' })).toBeNull();
    expect(screen.getByTestId('legacy-body').textContent).toBe('war');
    expect(harness.commandProps).toBeNull();
  });

  test('legacy topic deep links open Stories with the matching filter', () => {
    harness.commandOn = true;
    render(<RealmInspector {...baseProps} section="war" />);

    expect(screen.getByRole('button', { name: /^Stories/ }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('command-body').textContent).toBe('stories:war');
    expect(screen.getByRole('button', { name: 'War' }).getAttribute('aria-pressed')).toBe('true');
    expect(harness.commandProps.view).toBe('stories');
    expect(harness.commandProps.topic).toBe('war');
  });

  test('task tabs and topic aliases preserve addressable callbacks', () => {
    harness.commandOn = true;
    const onSection = vi.fn();
    render(<RealmInspector {...baseProps} section="stories" onSection={onSection} />);

    fireEvent.click(screen.getByRole('button', { name: /^Plans/ }));
    expect(onSection).toHaveBeenCalledWith('divination');

    fireEvent.click(screen.getByRole('button', { name: 'Trade' }));
    expect(onSection).toHaveBeenCalledWith('trade');
  });

  test('task tabs keep their legacy semantic address when the flag is rolled back', () => {
    harness.commandOn = true;
    const onSection = vi.fn();
    const { rerender } = render(
      <RealmInspector {...baseProps} section="dashboard" onSection={onSection} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /^Plans/ }));
    expect(onSection).toHaveBeenLastCalledWith('divination');

    harness.commandOn = false;
    rerender(<RealmInspector {...baseProps} section="divination" onSection={onSection} />);
    expect(screen.getByTestId('legacy-body').textContent).toBe('divination');
    expect(screen.getByRole('button', { name: 'Divination' }).getAttribute('aria-pressed')).toBe('true');
  });

  test('Decisions carries a visible resting count without requiring a filter', () => {
    harness.commandOn = true;
    render(<RealmInspector {...baseProps} section="briefing" />);

    const decisions = screen.getByRole('button', { name: /^Decisions/ });
    expect(decisions.textContent).toContain('1');
    expect(harness.readModelOptions).toEqual({
      saves: harness.store.savedSettlements,
      canUseCustom: true,
    });
  });

  test('the visible time lens changes command archive counts', () => {
    harness.commandOn = true;
    render(<RealmInspector {...baseProps} section="briefing" />);

    expect(screen.getByRole('button', { name: /^Stories/ }).textContent).toContain('2');
    fireEvent.click(screen.getByRole('button', { name: 'Whole campaign' }));
    expect(screen.getByRole('button', { name: /^Stories/ }).textContent).toContain('3');
  });

  test('a decision round trip restores its originating item, reading position, and focus', async () => {
    harness.commandOn = true;
    render(<ControlledInspector />);

    const body = screen.getByTestId('realm-inspector-body');
    body.scrollTop = 84;
    const origin = screen.getByRole('button', { name: 'Review decision' });
    origin.focus();
    fireEvent.click(origin);

    expect(screen.getByTestId('command-body').textContent).toContain('decisions:all');
    expect(harness.commandProps.returnToOrigin).toMatchObject({
      section: 'briefing',
      itemId: 'decision-1',
      scrollTop: 84,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Return to Briefing' }));

    await waitFor(() => {
      expect(screen.getByTestId('command-body').textContent).toContain('briefing:all');
      expect(body.scrollTop).toBe(84);
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Review decision' }));
    });
  });

  test('Escape returns from a command destination through the same focus contract', async () => {
    harness.commandOn = true;
    render(<ControlledInspector />);

    const origin = screen.getByRole('button', { name: 'Review decision' });
    fireEvent.click(origin);
    expect(screen.getByTestId('command-body').textContent).toContain('decisions:all');

    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.getByTestId('command-body').textContent).toContain('briefing:all');
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Review decision' }));
    });
  });

  test('a route remount restores the campaign-scoped lens, search, and reading position', async () => {
    harness.commandOn = true;
    const first = render(<RealmInspector {...baseProps} section="dashboard" />);

    fireEvent.click(screen.getByRole('button', { name: 'Whole campaign' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Search the realm' }), {
      target: { value: 'eastern levy' },
    });
    const firstBody = screen.getByTestId('realm-inspector-body');
    firstBody.scrollTop = 121;
    fireEvent.scroll(firstBody);
    first.unmount();

    render(<RealmInspector {...baseProps} section="dashboard" />);

    expect(screen.getByRole('button', { name: 'Whole campaign' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('textbox', { name: 'Search the realm' }).value).toBe('eastern levy');
    await waitFor(() => {
      expect(screen.getByTestId('realm-inspector-body').scrollTop).toBe(121);
    });
  });
});
