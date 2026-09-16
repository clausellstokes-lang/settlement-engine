/** @vitest-environment jsdom */
/**
 * ExportDraftButton — W4f. The unsaved-draft PDF export and its EXPORT-LADDER
 * GATE. Only export-capable tiers (elevated, or a tier whose export gate allows
 * it) can export an unsaved draft in place; a free account must save first and an
 * anon takes the hero Buy CTA — for both, this button renders NOTHING.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      settlement: { name: 'Emberhold', tier: 'town' },
      isElevated: () => false,
      canExport: () => false,
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import ExportDraftButton from '../../src/components/generate/ExportDraftButton.jsx';

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('ExportDraftButton — export-ladder gate', () => {
  it('renders nothing for a free account (no export gate, not elevated)', () => {
    useStore.__set({ isElevated: () => false, canExport: () => false });
    const { container } = render(<ExportDraftButton />);
    expect(container.textContent).toBe('');
    expect(screen.queryByText('Export PDF')).toBeNull();
  });

  it('renders nothing when there is no settlement', () => {
    useStore.__set({ settlement: null, canExport: () => true });
    const { container } = render(<ExportDraftButton />);
    expect(container.textContent).toBe('');
  });

  it('renders Export PDF for an export-capable tier', () => {
    useStore.__set({ canExport: () => true });
    render(<ExportDraftButton />);
    expect(screen.getByText('Export PDF')).toBeTruthy();
  });

  it('renders Export PDF for an elevated role', () => {
    useStore.__set({ isElevated: () => true, canExport: () => false });
    render(<ExportDraftButton />);
    expect(screen.getByText('Export PDF')).toBeTruthy();
  });
});
