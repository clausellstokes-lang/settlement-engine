import { describe, expect, test } from 'vitest';

import {
  COMMAND_VIEW_IDS,
  commandLocationOf,
  heraldDestinationForSceneAction,
  legacyAddressForCommandView,
  legacyAddressForStoryTopic,
} from '../../src/components/map/heraldCommandNavigation.js';

describe('Herald command-brief address compatibility', () => {
  test.each([
    ['dashboard', 'briefing', null],
    ['war', 'stories', 'war'],
    ['faith', 'stories', 'faith'],
    ['trade', 'stories', 'trade'],
    ['events', 'stories', 'events'],
    ['divination', 'plans', null],
    ['adjudication', 'decisions', null],
  ])('%s retains its semantic destination', (legacy, view, topic) => {
    expect(commandLocationOf(legacy)).toEqual({ view, topic });
  });

  test('accepts command-view aliases without changing the public callback language', () => {
    for (const view of COMMAND_VIEW_IDS) {
      expect(commandLocationOf(view).view).toBe(view);
    }

    expect(legacyAddressForCommandView('briefing')).toBe('dashboard');
    expect(legacyAddressForCommandView('stories')).toBe('events');
    expect(legacyAddressForCommandView('plans')).toBe('divination');
    expect(legacyAddressForCommandView('decisions')).toBe('adjudication');
  });

  test('Stories topic aliases emit their established section IDs', () => {
    expect(legacyAddressForStoryTopic('war')).toBe('war');
    expect(legacyAddressForStoryTopic('faith')).toBe('faith');
    expect(legacyAddressForStoryTopic('trade')).toBe('trade');
    expect(legacyAddressForStoryTopic('events')).toBe('events');
    expect(legacyAddressForStoryTopic('unknown')).toBe('events');
  });

  test('unknown addresses fall back to the historical dashboard destination', () => {
    expect(commandLocationOf('missing')).toEqual({ view: 'briefing', topic: null });
  });

  test('routes a portrait provenance action without inventing a story focus', () => {
    expect(heraldDestinationForSceneAction('inspect-scene-provenance')).toEqual({
      action: 'inspect-scene-provenance',
      section: 'events',
      view: 'stories',
      topic: 'events',
      label: 'Review recorded causes',
    });
    expect(heraldDestinationForSceneAction('invented-action')).toEqual({
      action: null,
      section: 'dashboard',
      view: 'briefing',
      topic: null,
      label: 'Open the Herald',
    });
  });
});
