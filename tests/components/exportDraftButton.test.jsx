/** @vitest-environment jsdom */
/**
 * exportDraftButton.test.jsx — the create-page "Export PDF" gate.
 *
 * The button lets a premium/elevated user export the unsaved draft without
 * saving. It must self-gate: shown only when canExport() is true AND a
 * settlement exists; hidden for free/anon (who get Buy / the subscription CTA)
 * and when there is nothing to export.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { settlement: { name: 'Test', tier: 'Town' }, canExport: () => true };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import ExportDraftButton from '../../src/components/generate/ExportDraftButton.jsx';
import { useStore } from '../../src/store/index.js';

describe('ExportDraftButton — premium-gated unsaved-draft export', () => {
  afterEach(() => {
    cleanup();
    useStore.__set({ settlement: { name: 'Test', tier: 'Town' }, canExport: () => true });
  });

  it('renders the Export PDF button when the user can export and a settlement exists', () => {
    render(<ExportDraftButton />);
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeTruthy();
  });

  it('renders nothing when the user cannot export (free / anon)', () => {
    useStore.__set({ canExport: () => false });
    const { container } = render(<ExportDraftButton />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when there is no settlement to export', () => {
    useStore.__set({ settlement: null, canExport: () => true });
    const { container } = render(<ExportDraftButton />);
    expect(container.firstChild).toBeNull();
  });
});
