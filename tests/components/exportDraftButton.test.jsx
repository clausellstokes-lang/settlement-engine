/** @vitest-environment jsdom */
/**
 * exportDraftButton.test.jsx — the create-page "Export PDF" gate.
 *
 * The button lets an unlimited-export tier (Cartographer / Founder / elevated)
 * export the UNSAVED draft in place. Under the export ladder (108) it routes
 * through useDossierExportAccess(null): a null save id yields reason 'tier'
 * (allow) for those tiers, or 'unsaved' / 'anon' (deny) for a free / anonymous
 * user — who must save first (free) or use the one-shot Buy CTA (anon). The
 * button is hidden whenever access is denied or there is nothing to export.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    settlement: { name: 'Test', tier: 'Town' },
    auth: { tier: 'premium' },
    isElevated: () => false,
    dossierEntitlements: {},
    refreshDossierEntitlement: vi.fn(() => Promise.resolve(false)),
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import ExportDraftButton from '../../src/components/generate/ExportDraftButton.jsx';
import { useStore } from '../../src/store/index.js';

describe('ExportDraftButton — unlimited-tier unsaved-draft export', () => {
  afterEach(() => {
    cleanup();
    useStore.__set({
      settlement: { name: 'Test', tier: 'Town' },
      auth: { tier: 'premium' },
      isElevated: () => false,
      dossierEntitlements: {},
    });
  });

  it('renders the Export PDF button for an unlimited-export tier with a settlement', () => {
    render(<ExportDraftButton />);
    expect(screen.getByRole('button', { name: /Export PDF/i })).toBeTruthy();
  });

  it('renders nothing for a free account (must save first) and for anon', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const free = render(<ExportDraftButton />);
    expect(free.container.firstChild).toBeNull();
    cleanup();
    useStore.__set({ auth: { tier: 'anon' } });
    const anon = render(<ExportDraftButton />);
    expect(anon.container.firstChild).toBeNull();
  });

  it('renders nothing when there is no settlement to export', () => {
    useStore.__set({ settlement: null, auth: { tier: 'premium' } });
    const { container } = render(<ExportDraftButton />);
    expect(container.firstChild).toBeNull();
  });
});
