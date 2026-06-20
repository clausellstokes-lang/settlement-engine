/** @vitest-environment jsdom */
/**
 * renameConsolidation.test.jsx — the single inline header rename (UX overhaul
 * Phase 6, plan §4.3). The three old settlement-name edit places collapse into
 * ONE inline edit on the dossier header. This pins:
 *   • In the saved-dossier editor (readOnly OutputContainer), allowRename +
 *     onRenameSettlement make the header name inline-editable, and a commit
 *     routes to onRenameSettlement (the consolidated applyRename('settlement', …)).
 *   • Without allowRename, the saved-dossier header name stays plain text.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import DossierHeaderRow from '../../src/components/dossier/DossierHeaderRow.jsx';

const settlement = { name: 'Stoneford', tier: 'town', population: 1200, config: {} };
const REROLLABLE = {};

afterEach(cleanup);

describe('Rename consolidation — single inline header edit', () => {
  it('routes a header rename to onRenameSettlement when allowRename is on (saved editor)', () => {
    const onRenameSettlement = vi.fn();
    render(
      <DossierHeaderRow
        readOnly
        queueEdit={null}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
        allowRename
        onRenameSettlement={onRenameSettlement}
      />,
    );
    // The header name is now an editable trigger.
    const trigger = screen.getByRole('button', { name: /Edit settlement name/i });
    fireEvent.click(trigger);
    const input = screen.getByLabelText('Edit settlement name');
    fireEvent.change(input, { target: { value: 'New Stoneford' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onRenameSettlement).toHaveBeenCalledWith('New Stoneford');
  });

  it('keeps the header name plain text in the read-only viewer (no allowRename)', () => {
    render(
      <DossierHeaderRow
        readOnly
        queueEdit={null}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
      />,
    );
    // No editable trigger — the name is static.
    expect(screen.queryByRole('button', { name: /Edit settlement name/i })).toBeNull();
    expect(screen.getByText('Stoneford')).toBeTruthy();
  });

  it('falls back to queueEdit in the live editor (not readOnly, no allowRename)', () => {
    const queueEdit = vi.fn();
    render(
      <DossierHeaderRow
        readOnly={false}
        queueEdit={queueEdit}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
      />,
    );
    const trigger = screen.getByRole('button', { name: /Edit settlement name/i });
    fireEvent.click(trigger);
    const input = screen.getByLabelText('Edit settlement name');
    fireEvent.change(input, { target: { value: 'Live Edit' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(queueEdit).toHaveBeenCalledWith('rename-settlement', { newName: 'Live Edit' });
  });
});
