/** @vitest-environment jsdom */
/**
 * surveyorNote.test.jsx — W-GUIDE-2 §4 visual-grammar contract.
 *
 * The pure voice sidecar is exercised in tests/domain/guidanceNotes.test.js
 * (node). This file pins the presentational shell: the eyebrow + glyph +
 * serif prose + "— S." signature grammar, the honesty gate (an out-of-scope
 * topic renders nothing), the surface→topic path, and the deterministic
 * variant seed (same id ⇒ same note across renders).
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import SurveyorNote from '../../src/components/guidance/SurveyorNote.jsx';
import { noteKeyFor } from '../../src/domain/display/guidanceNotes.js';
import { t } from '../../src/copy/index.js';

describe('SurveyorNote — the Surveyor persona margin note', () => {
  afterEach(() => cleanup());

  it('renders the eyebrow, glyph, resolved serif prose, and the "— S." signature', () => {
    render(<SurveyorNote topic="library" moment="empty" id="fixture-1" />);
    expect(screen.getByText('A Note from the Surveyor')).toBeTruthy();
    expect(screen.getByText('— S.')).toBeTruthy();
    const expected = t(noteKeyFor('library', 'empty', 'fixture-1'));
    expect(screen.getByText(expected)).toBeTruthy();
  });

  it('the prose renders in a serif face (the register visual law)', () => {
    const { container } = render(<SurveyorNote topic="realm" moment="first" id="fixture-2" />);
    const paras = [...container.querySelectorAll('p')];
    expect(paras.length).toBeGreaterThan(0);
    expect(paras[0].style.fontFamily.toLowerCase()).toContain('georgia');
  });

  it('honesty gate: an out-of-scope topic renders nothing (no empty chrome)', () => {
    const { container } = render(<SurveyorNote topic="billing" moment="first" id="x" />);
    expect(container.firstChild).toBeNull();
  });

  it('resolves through the surface→topic + signal→moment path', () => {
    render(<SurveyorNote surface="world-map" signal={{ hasAny: false }} id="fixture-3" />);
    const expected = t(noteKeyFor('realm', 'empty', 'fixture-3'));
    expect(screen.getByText(expected)).toBeTruthy();
  });

  it('a stable id yields the same note across re-renders (no reshuffle)', () => {
    const first = render(<SurveyorNote topic="dossier" moment="onward" id="stable-9" />);
    const firstText = first.container.querySelector('p').textContent;
    cleanup();
    const second = render(<SurveyorNote topic="dossier" moment="onward" id="stable-9" />);
    expect(second.container.querySelector('p').textContent).toBe(firstText);
  });

  it('renders no interactive chrome — the note is furniture, not a control', () => {
    const { container } = render(<SurveyorNote topic="library" moment="onward" id="nd" />);
    expect(container.querySelectorAll('button').length).toBe(0);
  });
});
