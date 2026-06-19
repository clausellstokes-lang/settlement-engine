/** @vitest-environment jsdom */
import { afterEach, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { useStore } from '../../src/store/index.js';
import { DEFAULT_DETAIL_LEVEL } from '../../src/store/uiSlice.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);
beforeEach(() => {
  useStore.getState().setDetailLevel(DEFAULT_DETAIL_LEVEL);
});

let town;
beforeAll(() => {
  town = generateSettlementPipeline(
    { size: 'town', tradeRouteAccess: 'road' },
    null,
    { seed: 99001, customContent: {} },
  );
});

// Click into the Systems group so its sub-tab strip resolves (Substrate / Magic
// live there). Returns the strip text after the click.
function openSystemsGroup(container) {
  const systemsBtn = [...container.querySelectorAll('button')]
    .find(b => /^Systems/.test((b.textContent || '').trim()));
  if (systemsBtn) fireEvent.click(systemsBtn);
  return container.textContent || '';
}

describe('Dossier altitude gating — Substrate drops at Overview, appears at Engine', () => {
  test('the altitude control is mounted in the dossier header', () => {
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    expect(container.querySelector('[data-testid="altitude-control"]')).toBeTruthy();
  });

  test('at Overview (guided) the Systems strip drops Substrate but keeps Magic', () => {
    useStore.getState().setDetailLevel('guided');
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    const text = openSystemsGroup(container);
    expect(text).toMatch(/Magic/);
    expect(text).not.toMatch(/Substrate/);
  });

  test('at Engine (expert) the Systems strip includes Substrate', () => {
    useStore.getState().setDetailLevel('expert');
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    const text = openSystemsGroup(container);
    expect(text).toMatch(/Substrate/);
    expect(text).toMatch(/Magic/);
  });

  test('the dossier mounts without throwing at Engine altitude', () => {
    useStore.getState().setDetailLevel('expert');
    const { container } = render(<OutputContainer settlement={town} readOnly saveId={null} />);
    expect(container.firstChild).not.toBeNull();
  });
});
