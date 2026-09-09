/** @vitest-environment jsdom */
/**
 * surveyorGlossary.test.jsx — W-GUIDE-2 §6 "what am I reading?" affordance contract.
 *
 * Pins the honesty gate (a word with no backing glossary entry is never made
 * clickable), the popover open/close a11y, the code-truthful definition, and the
 * Compendium deep-link (?tab= + #anchor).
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import SurveyorGlossary from '../../src/components/guidance/SurveyorGlossary.jsx';
import { glossaryEntryFor } from '../../src/domain/display/glossary.js';

describe('SurveyorGlossary — the in-place glossary affordance', () => {
  afterEach(() => cleanup());

  it('renders an accessible trigger for a real glossary term', () => {
    render(<SurveyorGlossary id="stability-strained">Strained</SurveyorGlossary>);
    const trigger = screen.getByRole('button', { name: /what is/i });
    expect(trigger).toBeTruthy();
    expect(screen.getByText('Strained')).toBeTruthy();
  });

  it('honesty gate: an unknown id renders children as PLAIN text (no button)', () => {
    render(<SurveyorGlossary id="no-such-term">Mystery</SurveyorGlossary>);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Mystery')).toBeTruthy();
  });

  it('honesty gate: an unknown id with no children renders nothing', () => {
    const { container } = render(<SurveyorGlossary id="no-such-term" />);
    expect(container.firstChild).toBeNull();
  });

  it('opens a dialog with the code-truthful definition and a Compendium deep-link', () => {
    render(<SurveyorGlossary id="stability-strained">Strained</SurveyorGlossary>);
    fireEvent.click(screen.getByRole('button', { name: /what is/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    // The definition IS the code BAND_HINT (never invented).
    const entry = glossaryEntryFor('stability-strained');
    expect(screen.getByText(entry.definition)).toBeTruthy();
    const link = screen.getByRole('link', { name: /compendium/i });
    expect(link.getAttribute('href')).toContain('?tab=');
    expect(link.getAttribute('href')).toContain('#');
  });

  it('Escape closes the dialog', () => {
    render(<SurveyorGlossary id="capture-capture">Capture</SurveyorGlossary>);
    fireEvent.click(screen.getByRole('button', { name: /what is/i }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
