/** @vitest-environment jsdom */
/**
 * Save-to-Library lazy-chunk failure test.
 *
 * Town-map edit code is loaded only when a generated settlement is saved. If
 * that chunk fails, the interface must surface a retryable error, release its
 * saving state, and perform no partial save or recovery-draft write.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  save: vi.fn(),
  writeDraft: vi.fn(),
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: selector => selector({ setActiveSaveId: vi.fn() }),
}));
vi.mock('../../src/lib/saves.js', () => ({ saves: { save: mocks.save } }));
vi.mock('../../src/lib/pendingSaveDraft.js', () => ({
  writeDraft: mocks.writeDraft,
  clearDraft: vi.fn(),
}));
vi.mock('../../src/domain/townMap/mapEdits.js', () => {
  throw new Error('map edit chunk failed');
});

import { SaveToLibraryButton } from '../../src/components/generate/SaveToLibraryButton.jsx';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe('SaveToLibraryButton chunk failure', () => {
  test('surfaces the failure and always releases the saving state', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <SaveToLibraryButton
        settlement={{ name: 'Newburg', tier: 'town' }}
        canSave
        isMobile={false}
        onSignIn={() => {}}
      />,
    );

    const button = screen.getByRole('button', { name: /save to library/i });
    fireEvent.click(button);

    expect((await screen.findByRole('alert')).textContent).toMatch(/couldn.t save/i);
    await waitFor(() => expect(button.disabled).toBe(false));
    expect(button.textContent).toMatch(/save to library/i);
    expect(mocks.save).not.toHaveBeenCalled();
    expect(mocks.writeDraft).not.toHaveBeenCalled();
  });
});
