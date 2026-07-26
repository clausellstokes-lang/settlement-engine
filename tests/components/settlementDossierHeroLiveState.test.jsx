/** @vitest-environment jsdom */
/**
 * The saved-dossier hero receives the save-identity-scoped live settlement from
 * SettlementDetail. This pin prevents the opening `detail` snapshot from taking
 * precedence again after a queued edit commits.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/store/index.js', () => {
  const state = {
    canonize: vi.fn(),
    isSettlementClockBound: () => false,
    setPurchaseModalOpen: vi.fn(),
  };
  return { useStore: (selector) => selector(state) };
});

vi.mock('../../src/components/OutputContainer.jsx', () => ({
  default: ({ settlement }) => (
    <div data-testid="dossier-body">{settlement?.name}</div>
  ),
}));
vi.mock('../../src/components/settlement/NextActionRail.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/settlementDetail/SettlementDossierBackdrop.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/settlementDetail/useNextActionRailHandlers.js', () => ({
  useNextActionRailHandlers: () => ({
    railHandlers: {},
    confirmCanonize: vi.fn(),
  }),
}));
vi.mock('../../src/components/settlementDetail/resolveExportSeam.js', () => ({
  resolveExportSeam: () => ({ campaign: null }),
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => false,
}));
vi.mock('../../src/components/settlementDetail/DetailErrorBoundary.jsx', () => ({
  default: ({ children }) => children,
}));
vi.mock('../../src/components/FeatureErrorBoundary.jsx', () => ({
  default: ({ children }) => children,
}));
vi.mock('../../src/components/primitives/Dialog.jsx', () => ({
  ConfirmDialog: () => null,
}));
vi.mock('../../src/components/dossier/ExportUnlockDialog.jsx', () => ({
  default: () => null,
}));

describe('SettlementDossierHero live settlement source', () => {
  test('the explicitly scoped live settlement wins over the opening detail snapshot', async () => {
    const SettlementDossierHero = (
      await import('../../src/components/settlementDetail/SettlementDossierHero.jsx')
    ).default;

    render(
      <SettlementDossierHero
        detail={{
          settlement: { id: 'save-1', name: 'Stoneford Before Commit' },
          saveData: { id: 'save-1' },
        }}
        settlement={{ id: 'save-1', name: 'Stoneford After Commit' }}
        editMode
        canEdit
        saveId="save-1"
        authTier="premium"
        phase="draft"
        narrated={false}
        toggleEditMode={vi.fn()}
        openExportSheet={vi.fn()}
        onRenameSettlement={vi.fn()}
      />,
    );

    expect((await screen.findByTestId('dossier-body')).textContent).toContain('Stoneford After Commit');
    expect(screen.queryByText('Stoneford Before Commit')).toBeNull();
  });
});
