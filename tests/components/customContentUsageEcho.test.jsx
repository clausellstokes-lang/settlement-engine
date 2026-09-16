/** @vitest-environment jsdom */

import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import {
  cleanup,
  render,
  screen,
} from '@testing-library/react';

const { storeRef } = vi.hoisted(() => ({
  storeRef: {
    current: {
      savedSettlements: [],
      campaigns: [],
    },
  },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(storeRef.current),
}));

import CustomContentUsageEcho from '../../src/components/compendium/CustomContentUsageEcho.jsx';

afterEach(() => {
  cleanup();
  storeRef.current = {
    savedSettlements: [],
    campaigns: [],
  };
});

describe('CustomContentUsageEcho evidence labels', () => {
  it('discloses a name-only Herald mention even without inferred settlement usage', () => {
    storeRef.current.campaigns = [{
      id: 'campaign:ember-coast',
      name: 'Ember Coast',
      wizardNews: {
        entries: [{
          headline: 'The Haunted Glassworks closes after midnight',
        }],
      },
    }];

    render(
      <CustomContentUsageEcho
        bucket="institutions"
        item={{
          localUid: 'glassworks',
          name: 'Haunted Glassworks',
        }}
        customContent={{}}
      />,
    );

    expect(screen.getByTestId('custom-content-usage-echo').textContent)
      .toMatch(/historical evidence is inferred by name/i);
  });

  it('does not add an inference caveat to exact revision-backed usage', () => {
    storeRef.current.savedSettlements = [{
      id: 'settlement:ashford',
      settlement: {
        customContentProvenance: {
          materializedDefinitions: [{
            definitionId: 'definition:glassworks',
            revisionId: 'revision:glassworks:4',
            contentHash: 'a'.repeat(64),
          }],
        },
      },
    }];

    render(
      <CustomContentUsageEcho
        bucket="institutions"
        item={{
          definitionId: 'definition:glassworks',
          revisionId: 'revision:glassworks:4',
          contentHash: 'a'.repeat(64),
          name: 'Haunted Glassworks',
        }}
        customContent={{}}
      />,
    );

    expect(screen.getByTestId('custom-content-usage-echo').textContent)
      .not.toMatch(/inferred by name/i);
  });
});
