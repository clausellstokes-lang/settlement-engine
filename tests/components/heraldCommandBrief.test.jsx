/** @vitest-environment jsdom */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const headlineItems = vi.hoisted(() => []);
const legacyBodies = vi.hoisted(() => []);

vi.mock('../../src/components/map/HeraldBody.jsx', () => ({
  default: (props) => {
    legacyBodies.push(props);
    return <div data-testid={`legacy-${props.section}`}>{props.section}</div>;
  },
}));

vi.mock('../../src/components/map/HeraldHeadline.jsx', () => ({
  default: ({ item }) => {
    headlineItems.push(item);
    return <div data-testid="adapted-headline">{item.headline}</div>;
  },
}));

import HeraldCommandBody, {
  HERALD_ARCHIVE_PAGE_SIZE,
} from '../../src/components/map/HeraldCommandBody.jsx';
import { HERALD_COMMAND_SOURCE_PARITY } from '../../src/components/map/heraldCommandSourceParity.js';
import {
  largeHistoryHeraldFixture,
  peacefulHeraldFixture,
} from '../fixtures/gameGradeHeraldFixtures.js';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  headlineItems.length = 0;
  legacyBodies.length = 0;
});

function item({
  id,
  headline,
  topic = 'events',
  attentionClass = 'routine_record',
  reason = 'Recorded for reference; no immediate GM action is required.',
  blocking = false,
  workflow = 'report',
  epistemic = 'recorded_fact',
  temporal = 'historical',
  resolution = 'resolved',
  tick = 1,
  cause = null,
}) {
  return {
    id,
    headline,
    summary: '',
    tick,
    topic: { primary: topic, tags: [topic] },
    temporal: { phase: temporal },
    resolution: { state: resolution },
    operational: { state: 'active' },
    workflow: { kind: workflow },
    epistemic: { class: epistemic },
    attention: {
      class: attentionClass,
      blocking,
      urgency: blocking ? 1 : 0.15,
      significance: attentionClass === 'major_change' ? 0.8 : 0.3,
      reason,
    },
    subjects: [],
    affectedEntities: [],
    cause: cause || {
      available: false,
      receiptId: null,
      reason: 'No recorded cause receipt is available for this source.',
    },
    compatibility: { heraldSection: topic },
    payload: { sourceRecord: {} },
  };
}

const decision = item({
  id: 'decision-1',
  headline: 'The council awaits a ruling',
  topic: 'trade',
  attentionClass: 'blocking_decision',
  reason: 'A realm decision is unresolved and awaits the GM.',
  blocking: true,
  workflow: 'proposal',
  epistemic: 'pending_decision',
  temporal: 'planned',
  resolution: 'unresolved',
});

const warStory = item({
  id: 'story-war',
  headline: 'The eastern levy returned',
  topic: 'war',
  attentionClass: 'major_change',
  reason: 'The source records a major realm change.',
  tick: 4,
});

const civicStory = item({
  id: 'story-civic',
  headline: 'A market charter was recorded',
  topic: 'events',
  tick: 3,
  cause: {
    state: 'partial',
    available: true,
    rootRecordId: 'root-cause-1',
    receiptId: 'receipt-1',
    reason: 'The source record is indexed, but its deeper parent chain is partial.',
  },
});

const routine = item({
  id: 'routine-1',
  headline: 'The roads remain quiet',
  topic: 'trade',
});

const realmModel = {
  items: [decision, warStory, civicStory, routine],
  ranked: [decision, warStory, civicStory, routine],
};

const baseProps = {
  realmModel,
  campaign: { id: 'campaign-1', worldState: {} },
  feed: { bySection: {}, counts: {} },
  focusId: null,
  focusName: '',
  narrowing: false,
  query: '',
  attentionOn: false,
  filterBand: null,
  nameById: new Map(),
  saves: [],
  emptyHandlers: {},
  canManageCampaigns: true,
  tier: 'premium',
};

describe('Herald command brief', () => {
  test('Briefing shows the typed promotion reason and does not manufacture routine urgency', () => {
    const onSection = vi.fn();
    render(<HeraldCommandBody {...baseProps} view="briefing" onSection={onSection} />);

    expect(screen.getByText('A realm decision is unresolved and awaits the GM.')).toBeTruthy();
    expect(screen.getByText('The source records a major realm change.')).toBeTruthy();
    expect(screen.queryByText('The roads remain quiet')).toBeNull();
    expect(screen.getAllByTestId('command-briefing-item')).toHaveLength(2);
    expect(screen.getAllByTestId('herald-command-stable-lead')).toHaveLength(1);
    expect(screen.getAllByTestId('command-briefing-item')[0].getAttribute('aria-label'))
      .toContain('Requires your word: The council awaits a ruling');
    expect(screen.getByTestId('herald-command-stable-lead')
      .closest('[data-testid="command-briefing-item"]').textContent)
      .toContain(decision.headline);

    fireEvent.click(screen.getByRole('button', { name: /review decision/i }));
    expect(onSection).toHaveBeenCalledWith(
      'adjudication',
      decision,
      expect.any(HTMLButtonElement),
    );
  });

  test('Stories is the complete recorded archive with visible topic tags', () => {
    render(<HeraldCommandBody {...baseProps} view="stories" topic={null} onSection={() => {}} />);

    // Pending decisions belong to Decisions/Briefing, not the recorded archive.
    expect(screen.queryByText(decision.headline)).toBeNull();
    expect(screen.getByText(warStory.headline)).toBeTruthy();
    expect(screen.getByText(civicStory.headline)).toBeTruthy();
    expect(screen.getByText(routine.headline)).toBeTruthy();
    expect(screen.getByText('War')).toBeTruthy();
    expect(screen.getByText('Civic')).toBeTruthy();
    expect(screen.getAllByTestId('command-story-item')).toHaveLength(3);
    expect(screen.getAllByTestId('story-provenance-unavailable')).toHaveLength(2);
    expect(headlineItems.find(item => item.headline === civicStory.headline)?.rootId).toBe('root-cause-1');
  });

  test('a legacy topic address opens Stories already narrowed to that topic', () => {
    render(<HeraldCommandBody {...baseProps} view="stories" topic="war" onSection={() => {}} />);

    expect(screen.getByText(warStory.headline)).toBeTruthy();
    expect(screen.queryByText(civicStory.headline)).toBeNull();
    expect(screen.queryByText(routine.headline)).toBeNull();
    expect(screen.getByText('War stories')).toBeTruthy();
  });

  test('degraded identity and deleted subjects remain readable without unsafe routes', () => {
    const degraded = {
      ...warStory,
      id: 'shared-anonymous-id',
      presentationKey: 'shared-anonymous-id~projection-2',
      headline: 'An imported levy record survives',
      identity: { state: 'degraded_collision', interactive: false },
      subjects: [{ kind: 'settlement', id: 'missing-1', routeable: true }],
      affectedEntities: [{ kind: 'settlement', id: 'missing-1', routeable: true }],
      cause: {
        state: 'partial',
        available: true,
        rootRecordId: 'unsafe-root',
        receiptId: null,
        reason: 'The source root is only partially indexed.',
      },
    };
    const deletedSubject = {
      ...civicStory,
      id: 'deleted-subject',
      presentationKey: 'deleted-subject',
      headline: 'A vanished market is still on record',
      identity: { state: 'authored', interactive: true },
      subjects: [{
        kind: 'settlement',
        id: 'deleted-save',
        routeable: false,
        fallbackLabel: 'A settlement no longer in this campaign',
      }],
      affectedEntities: [{
        kind: 'settlement',
        id: 'deleted-save',
        routeable: false,
        fallbackLabel: 'A settlement no longer in this campaign',
      }],
    };

    render(
      <HeraldCommandBody
        {...baseProps}
        realmModel={{ items: [degraded, deletedSubject], ranked: [degraded, deletedSubject] }}
        view="stories"
        onSection={() => {}}
      />,
    );

    expect(screen.getByText(degraded.headline)).toBeTruthy();
    expect(screen.getByText(deletedSubject.headline)).toBeTruthy();
    expect(screen.getByText(/A settlement no longer in this campaign/i)).toBeTruthy();
    const degradedHeadline = headlineItems.find(entry => entry.headline === degraded.headline);
    const deletedHeadline = headlineItems.find(entry => entry.headline === deletedSubject.headline);
    expect(degradedHeadline.rootId).toBeNull();
    expect(degradedHeadline.subject.settlementId).toBeNull();
    expect(deletedHeadline.subject.settlementId).toBeNull();
    expect(deletedHeadline.affectedIds).toEqual([]);
  });

  test('Plans and Decisions retain the proven forecast/docket and adjudication bodies', () => {
    const { rerender } = render(<HeraldCommandBody {...baseProps} view="plans" onSection={() => {}} />);
    expect(screen.getByTestId('legacy-divination')).toBeTruthy();

    rerender(<HeraldCommandBody {...baseProps} view="decisions" onSection={() => {}} />);
    expect(screen.getByTestId('legacy-adjudication')).toBeTruthy();
  });

  test('the executable parity inventory keeps every specialist owner reachable', () => {
    expect(HERALD_COMMAND_SOURCE_PARITY.map(entry => entry.id)).toEqual([
      'realm_dashboard',
      'wizard_news',
      'war_specialists',
      'faith_specialists',
      'trade_specialists',
      'recorded_archive',
      'forecast',
      'docket',
      'adjudication',
    ]);

    const { rerender } = render(
      <HeraldCommandBody {...baseProps} view="briefing" onSection={() => {}} />,
    );
    expect(screen.getByTestId('herald-command-dashboard-parity')).toBeTruthy();
    expect(screen.getByTestId('legacy-dashboard')).toBeTruthy();

    for (const topic of ['war', 'faith', 'trade']) {
      rerender(
        <HeraldCommandBody
          {...baseProps}
          view="stories"
          topic={topic}
          onSection={() => {}}
        />,
      );
      expect(screen.getByTestId('herald-command-specialist-body')
        .getAttribute('data-herald-source-owner')).toBe(topic);
      expect(screen.getByTestId(`legacy-${topic}`)).toBeTruthy();
    }

    rerender(<HeraldCommandBody {...baseProps} view="plans" onSection={() => {}} />);
    expect(screen.getByTestId('legacy-divination')).toBeTruthy();
    rerender(<HeraldCommandBody {...baseProps} view="decisions" onSection={() => {}} />);
    expect(screen.getByTestId('legacy-adjudication')).toBeTruthy();
  });

  test('the named peaceful fixture renders one compact, non-urgent explanation', () => {
    const fixture = peacefulHeraldFixture();
    expect(fixture.settlementCount).toBeGreaterThanOrEqual(20);

    render(
      <HeraldCommandBody
        {...baseProps}
        realmModel={fixture.realmModel}
        view="briefing"
        onSection={() => {}}
      />,
    );

    expect(screen.queryByTestId('command-briefing-item')).toBeNull();
    expect(screen.getAllByText(/The realm asks nothing of you just now/i)).toHaveLength(1);
    expect(screen.getByTestId('herald-command-dashboard-parity').hasAttribute('open')).toBe(false);
  });

  test('the named large-history fixture pins top-three order and a bounded archive DOM', () => {
    const fixture = largeHistoryHeraldFixture();
    expect(fixture.settlementCount).toBeGreaterThanOrEqual(20);
    expect(fixture.historyCount).toBeGreaterThan(HERALD_ARCHIVE_PAGE_SIZE * 10);

    const { rerender } = render(
      <HeraldCommandBody
        {...baseProps}
        realmModel={fixture.realmModel}
        view="briefing"
        onSection={() => {}}
      />,
    );
    const briefingCards = screen.getAllByTestId('command-briefing-item');
    expect(briefingCards).toHaveLength(3);
    expect(briefingCards.map(card => card.getAttribute('data-realm-item-id')))
      .toEqual(fixture.expectedTopThreeIds);
    expect(briefingCards.map(card => card.textContent)).toEqual([
      expect.stringContaining('The northern council awaits a ruling'),
      expect.stringContaining('The southern levy order has lapsed'),
      expect.stringContaining('The western granaries face a critical shortage'),
    ]);

    rerender(
      <HeraldCommandBody
        {...baseProps}
        realmModel={fixture.realmModel}
        view="stories"
        topic={null}
        timeLens="campaign"
        onSection={() => {}}
      />,
    );
    expect(screen.getAllByTestId('command-story-item')).toHaveLength(HERALD_ARCHIVE_PAGE_SIZE);
    expect(screen.getByRole('status').textContent)
      .toBe(`${HERALD_ARCHIVE_PAGE_SIZE} of ${fixture.archiveCount} stories shown`);

    fireEvent.click(screen.getByRole('button', { name: /show 40 older stories/i }));
    expect(screen.getAllByTestId('command-story-item'))
      .toHaveLength(HERALD_ARCHIVE_PAGE_SIZE * 2);
  });

  test('Decisions receives only the canonical filtered set and the exact Briefing item', () => {
    const otherDecision = {
      ...decision,
      id: 'decision-2',
      headline: 'The harbor guild awaits a ruling',
    };
    render(
      <HeraldCommandBody
        {...baseProps}
        realmModel={{
          items: [decision, otherDecision, warStory],
          ranked: [decision, otherDecision, warStory],
        }}
        view="decisions"
        query="council"
        onSection={() => {}}
        returnToOrigin={{ label: 'Briefing', itemId: 'decision-1', scrollTop: 20 }}
      />,
    );

    const props = legacyBodies.at(-1);
    expect(props.section).toBe('adjudication');
    expect(props.realmDecisionItems).toEqual([decision]);
    expect(props.activeDecisionItemId).toBe('decision-1');
  });

  test.each(['briefing', 'stories', 'plans', 'decisions'])(
    'a locked %s address re-enters the established Dashboard gate',
    (view) => {
      render(
        <HeraldCommandBody
          {...baseProps}
          view={view}
          canManageCampaigns={false}
          tier="free"
          onSection={() => {}}
        />,
      );

      expect(screen.getByTestId('legacy-dashboard')).toBeTruthy();
      expect(screen.queryByTestId('herald-command-decisions')).toBeNull();
      expect(screen.queryByTestId('herald-command-plans')).toBeNull();
      expect(screen.queryByTestId('command-briefing-item')).toBeNull();
      expect(legacyBodies).toHaveLength(1);
      expect(legacyBodies[0]).toEqual(expect.objectContaining({
        section: 'dashboard',
        canManageCampaigns: false,
        tier: 'free',
      }));
    },
  );

  test('a player or share mount fails closed before a GM-only RealmItem reaches the DOM', () => {
    const secret = {
      ...warStory,
      id: 'covert-war-story',
      headline: 'GM ONLY: the hidden levy is compromised',
      payload: {
        sourceRecord: {
          id: 'covert-war-story',
          visibility: 'gm',
          covert: true,
        },
      },
    };
    render(
      <HeraldCommandBody
        {...baseProps}
        realmModel={{ items: [secret], ranked: [secret] }}
        view="stories"
        topic="war"
        canManageCampaigns={false}
        tier="free"
        onSection={() => {}}
      />,
    );

    expect(screen.queryByText(secret.headline)).toBeNull();
    expect(document.body.textContent).not.toContain('hidden levy');
    expect(screen.getByTestId('legacy-dashboard')).toBeTruthy();
  });

  test.each(['stories', 'plans', 'decisions'])(
    '%s keeps an explicit route back to the originating briefing item',
    (view) => {
      const onReturnToOrigin = vi.fn();
      render(
        <HeraldCommandBody
          {...baseProps}
          view={view}
          onSection={() => {}}
          returnToOrigin={{ label: 'Briefing', itemId: 'story-war', scrollTop: 32 }}
          onReturnToOrigin={onReturnToOrigin}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: 'Return to Briefing' }));
      expect(onReturnToOrigin).toHaveBeenCalledTimes(1);
    },
  );
});
