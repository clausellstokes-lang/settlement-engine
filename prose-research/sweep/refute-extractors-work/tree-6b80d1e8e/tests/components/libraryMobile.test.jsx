/**
 * @vitest-environment jsdom
 *
 * libraryMobile.test.jsx — the Library surface's mobile (Phase 5c) pass.
 *
 * Verifies the mobile branch of the Library toolbar + bulk-action bar, and that
 * the desktop rendering is unchanged. The mobile flag is the shared
 * matchMedia-backed store (src/hooks/useIsMobile.js); jsdom has no matchMedia,
 * so we install a width-driven shim (mirrors tests/ui/mobile.smoke.test.jsx)
 * and flip the simulated viewport between desktop (1024px) and phone (360px).
 *
 * What we pin:
 *   1. On mobile, LibraryToolbar collapses the inline filter wall into a
 *      Filters BottomSheet trigger; the secondary chips are NOT in the DOM until
 *      the sheet is opened.
 *   2. On desktop, LibraryToolbar keeps its inline Filters disclosure (opening
 *      it reveals the chips inline, no sheet).
 *   3. On mobile, BulkActionBar stacks as a column (the trailing Delete keeps
 *      its right-anchor) and still exposes every bulk action.
 */

import React from 'react';
import { describe, test, expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import LibraryToolbar from '../../src/components/library/LibraryToolbar.jsx';
import BulkActionBar from '../../src/components/settlements/BulkActionBar.jsx';

// ── matchMedia width shim ─────────────────────────────────────────────────────
const ORIGINAL_INNER_WIDTH = window.innerWidth;
let currentWidth = ORIGINAL_INNER_WIDTH;
const liveMqls = new Set();

function evaluate(query) {
  const m = /max-width:\s*(\d+)px/.exec(query);
  return m ? currentWidth <= Number(m[1]) : false;
}

if (typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => {
    const listeners = new Set();
    const mql = {
      media: query,
      matches: evaluate(query),
      addEventListener: (_e, fn) => listeners.add(fn),
      removeEventListener: (_e, fn) => listeners.delete(fn),
      __reevaluate: () => {
        const next = evaluate(query);
        if (next !== mql.matches) {
          mql.matches = next;
          listeners.forEach((fn) => fn({ matches: next }));
        }
      },
    };
    liveMqls.add(mql);
    return mql;
  };
}

function setViewportWidth(width) {
  currentWidth = width;
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  liveMqls.forEach((mql) => mql.__reevaluate());
}

beforeAll(() => setViewportWidth(1024));
afterAll(() => setViewportWidth(ORIGINAL_INNER_WIDTH));
afterEach(cleanup);

function toolbarProps(overrides = {}) {
  return {
    query: '', setQuery: vi.fn(),
    sort: 'recent', setSort: vi.fn(),
    filters: {}, setFilters: vi.fn(),
    totalCount: 3, visibleCount: 3,
    campaigns: [],
    selectMode: false, onToggleSelectMode: vi.fn(),
    ...overrides,
  };
}

describe('LibraryToolbar — mobile filter sheet', () => {
  test('desktop: the inline Filters disclosure reveals chips inline (no sheet)', () => {
    setViewportWidth(1024);
    render(<LibraryToolbar {...toolbarProps()} />);
    // The filter panel is closed by default and renders inline on open.
    expect(screen.queryByTestId('library-filter-panel')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    const panel = screen.getByTestId('library-filter-panel');
    expect(panel).toBeTruthy();
    // A secondary chip is present once the inline disclosure is open.
    expect(screen.getByRole('button', { name: 'Has deity' })).toBeTruthy();
  });

  test('mobile: Filters is a sheet trigger; chips are hidden until opened', () => {
    setViewportWidth(360);
    render(<LibraryToolbar {...toolbarProps()} />);
    // Search + Sort + a Filters trigger; the secondary chips are NOT yet mounted.
    expect(screen.queryByRole('button', { name: 'Has deity' })).toBeNull();
    expect(screen.queryByTestId('library-filter-panel')).toBeNull();
    const trigger = screen.getByRole('button', { name: /Filters/i });
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  test('mobile: opening the Filters sheet reveals the phase lens + secondary chips', () => {
    setViewportWidth(360);
    render(<LibraryToolbar {...toolbarProps()} />);
    fireEvent.click(screen.getByRole('button', { name: /Filters/i }));
    // The sheet is a modal dialog with the filter body inside.
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByTestId('library-filter-panel')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'In crisis' })).toBeTruthy();
    // The phase lens (a Segmented control) is in the sheet too.
    expect(screen.getByRole('button', { name: 'Drafts' })).toBeTruthy();
  });
});

describe('BulkActionBar — mobile column layout', () => {
  function bulk(overrides = {}) {
    return {
      selectedIds: new Set(['a', 'b']),
      addToCampaignBulk: vi.fn(),
      canonizeBulk: vi.fn(),
      exportBulk: vi.fn(),
      setDeleteConfirm: vi.fn(),
      clear: vi.fn(),
      confirmDelete: vi.fn(),
      deleteConfirm: false,
      exportError: null,
      ...overrides,
    };
  }

  test('desktop: a single flexWrap row exposes every action', () => {
    setViewportWidth(1024);
    render(<BulkActionBar bulk={bulk()} campaigns={[]} canManageCampaigns={false} />);
    const bar = screen.getByTestId('bulk-action-bar');
    expect(bar.style.flexDirection).not.toBe('column');
    expect(screen.getByRole('button', { name: /Delete/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Done/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Export/i })).toBeTruthy();
  });

  test('mobile: the bar stacks as a column and keeps Delete right-anchored', () => {
    setViewportWidth(360);
    render(<BulkActionBar bulk={bulk()} campaigns={[]} canManageCampaigns={false} />);
    const bar = screen.getByTestId('bulk-action-bar');
    expect(bar.style.flexDirection).toBe('column');
    const del = screen.getByRole('button', { name: /Delete/i });
    expect(del.style.marginLeft).toBe('auto');
    // Every action survives the reflow.
    expect(screen.getByRole('button', { name: /Done/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Export/i })).toBeTruthy();
  });
});
