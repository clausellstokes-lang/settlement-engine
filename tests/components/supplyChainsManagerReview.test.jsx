/** @vitest-environment jsdom */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';

const { storeState } = vi.hoisted(() => ({
  storeState: {
    customContent: {},
    saveReviewedSupplyChain: vi.fn(),
    removeReviewedSupplyChain: vi.fn(),
  },
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector(storeState),
}));

beforeEach(() => {
  vi.clearAllMocks();
  storeState.saveReviewedSupplyChain.mockResolvedValue({});
  storeState.removeReviewedSupplyChain.mockResolvedValue({});
});

afterEach(cleanup);

function versioned(category, item, revisionNumber = 1) {
  return {
    ...item,
    definitionId: `definition:${category}:${item.localUid}`,
    revisionId: `revision:${category}:${item.localUid}:${revisionNumber}`,
    revisionNumber,
    contentHash: contentRevisionHash(category, item),
  };
}

function reviewDefinitions() {
  return {
    resources: [versioned('resources', {
      localUid: 'review-resin',
      name: 'Review Resin',
      category: 'forest',
      tierMax: 'metropolis',
      yields: ['custom:review-lacquer'],
    })],
    tradeGoods: [versioned('tradeGoods', {
      localUid: 'review-lacquer',
      name: 'Review Lacquer',
      requiredResources: ['custom:review-resin'],
    })],
  };
}

describe('SupplyChainsManager exact review identity', () => {
  it('returns a same-chainId mechanical revision to review and replaces its old confirmation', async () => {
    const v1 = reviewDefinitions();
    const oldConfirmation = {
      ...confirmCustomSupplyChainReview(inferSupplyChains(v1)[0]),
      id: 'saved-chain-review',
    };
    const v2 = reviewDefinitions();
    v2.resources[0] = versioned('resources', {
      ...v2.resources[0],
      tierMax: 'city',
    }, 2);
    storeState.customContent = {
      ...v2,
      institutions: [],
      services: [],
      supplyChains: [oldConfirmation],
    };

    const { default: SupplyChainsManager } = await import(
      '../../src/components/compendium/SupplyChainsManager.jsx'
    );
    render(<SupplyChainsManager />);

    expect(screen.getByText(/Definition identity or meaning changed/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Review again' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Review again' }));
    await waitFor(() => {
      expect(storeState.saveReviewedSupplyChain).toHaveBeenCalledTimes(1);
    });
    const [replacement] =
      storeState.saveReviewedSupplyChain.mock.calls[0];
    expect(replacement.verification).toMatchObject({
      state: 'confirmed',
      review: {
        schemaVersion: 1,
        projectionFingerprint: expect.stringMatching(/^[0-9a-f]{64}$/),
      },
    });
    expect(replacement.chainId).toBe(oldConfirmation.chainId);
  });

  it('does not trust a copied review fingerprint on a changed saved graph', async () => {
    const definitions = reviewDefinitions();
    const discovered = inferSupplyChains(definitions)[0];
    const confirmed = confirmCustomSupplyChainReview(discovered);
    const changedArtifact = {
      ...confirmed,
      id: 'copied-fingerprint-chain',
      discovered: {
        ...confirmed.discovered,
        edges: confirmed.discovered.edges.map((edge, index) => (
          index === 0
            ? { ...edge, commodity: 'Unreviewed Substitute' }
            : edge
        )),
      },
    };
    storeState.customContent = {
      ...definitions,
      institutions: [],
      services: [],
      supplyChains: [changedArtifact],
    };

    const { default: SupplyChainsManager } = await import(
      '../../src/components/compendium/SupplyChainsManager.jsx'
    );
    render(<SupplyChainsManager />);

    expect(screen.getByText(/Definition identity or meaning changed/))
      .toBeTruthy();
    expect(screen.getByRole('button', { name: 'Review again' }))
      .toBeTruthy();
  });
});
