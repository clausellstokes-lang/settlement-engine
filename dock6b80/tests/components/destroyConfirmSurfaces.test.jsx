/** @vitest-environment jsdom */
/**
 * destroyConfirmSurfaces.test.jsx — Wave R-1 (atlas queue #4): the COMPOSER
 * settlement-death lane's confirm gate + honest recovery copy.
 *
 * The §9c type-the-name gate must hold (Apply stays disabled until the exact
 * settlement name is typed), and the warning's recovery claim must name the
 * ACTUAL recovery model — undo from the Timeline, latest entry only — instead
 * of the old vague "deliberate action". Lane b's store-side twin is pinned in
 * tests/store/destroyConfirmGate.test.js; lane c (realm proposal) there too.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ApplyControls } from '../../src/components/settlement/eventComposer/ApplyControls.jsx';

afterEach(cleanup);

function renderControls(overrides = {}) {
  const props = {
    type: 'DESTROY_SETTLEMENT',
    phase: 'canon',
    isLinkNeighbour: false,
    canSubmit: true,
    settlement: { name: 'Testford' },
    destroyConfirm: '',
    setDestroyConfirm: vi.fn(),
    pendingPreview: null,
    dismissPreview: vi.fn(),
    onPreview: vi.fn(),
    onApply: vi.fn(),
    onAddToBatch: vi.fn(),
    ...overrides,
  };
  render(<ApplyControls {...props} />);
  return props;
}

describe('composer destroy lane — type-the-name gate (§9c)', () => {
  it('Apply is disabled until the exact settlement name is typed', () => {
    renderControls({ destroyConfirm: '' });
    expect(screen.getByRole('button', { name: /destroy settlement/i }).disabled).toBe(true);
  });

  it('a wrong or differently-cased name keeps Apply disabled', () => {
    renderControls({ destroyConfirm: 'testford' });
    expect(screen.getByRole('button', { name: /destroy settlement/i }).disabled).toBe(true);
  });

  it('the exact name arms Apply', () => {
    renderControls({ destroyConfirm: 'Testford' });
    expect(screen.getByRole('button', { name: /destroy settlement/i }).disabled).toBe(false);
  });

  it('non-destroy verbs render no confirm input', () => {
    renderControls({ type: 'ADD_NPC' });
    expect(screen.queryByLabelText(/type the settlement name/i)).toBeNull();
  });
});

describe('composer destroy lane — recovery copy matches the actual model', () => {
  it('names Timeline undo + the latest-event condition, not vague "deliberate action"', () => {
    renderControls();
    const warning = screen.getByText(/this destroys testford/i);
    expect(warning.textContent).toMatch(/undo on the timeline/i);
    expect(warning.textContent).toMatch(/latest event/i);
    expect(warning.textContent).not.toMatch(/deliberate action/i);
  });
});
