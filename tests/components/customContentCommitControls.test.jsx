/**
 * @vitest-environment jsdom
 */

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CustomContentCommitControls from '../../src/components/compendium/CustomContentCommitControls.jsx';

afterEach(cleanup);

describe('CustomContentCommitControls', () => {
  it('keeps a named draft uncommittable until its current sample is reviewed', () => {
    render(
      <CustomContentCommitControls
        definitionReady
        draft={{ name: 'Astral Observatory' }}
        editingId={null}
        handleSave={vi.fn()}
        manualSampleCurrent={false}
        resetDraft={vi.fn()}
        saveBusy={false}
      />,
    );

    expect(screen.getByRole('button', { name: /add versioned definition/i }).disabled)
      .toBe(true);
    expect(screen.getByRole('status').textContent)
      .toMatch(/forge the current unsaved sample/i);
  });

  it('commits only after the current sample and category requirements agree', () => {
    const handleSave = vi.fn();
    render(
      <CustomContentCommitControls
        definitionReady
        draft={{
          name: 'The Lantern Judge',
          alignmentAxis: 'good',
          rankAxis: 'major',
        }}
        editingId="definition:lantern-judge"
        handleSave={handleSave}
        manualSampleCurrent
        resetDraft={vi.fn()}
        saveBusy={false}
      />,
    );

    const button = screen.getByRole('button', { name: /create revision/i });
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    expect(handleSave).toHaveBeenCalledTimes(1);
  });

  it('does not let a reviewed sample bypass manifest-required fields', () => {
    render(
      <CustomContentCommitControls
        definitionReady={false}
        draft={{ name: 'Incomplete God' }}
        editingId={null}
        handleSave={vi.fn()}
        manualSampleCurrent
        resetDraft={vi.fn()}
        saveBusy={false}
      />,
    );

    expect(screen.getByRole('button', { name: /add versioned definition/i }).disabled)
      .toBe(true);
    expect(screen.getByRole('status').textContent)
      .toMatch(/required registered fields/i);
  });
});
