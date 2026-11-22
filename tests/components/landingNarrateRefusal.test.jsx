/** @vitest-environment jsdom */
/**
 * landingNarrateRefusal.test.jsx — THE LANDING'S "NARRATE" STOPPED MOVING THE READER.
 *
 * ── THE DEFECT (REVIEW-P F4, the anonymous public-path walk, 2026-09-20) ──────
 * ⛔ NO GATE REFUSES SILENTLY, AND A REFUSAL NEVER NAVIGATES (ODQ §934.24(c)). The
 * landing's §03 voice section offers an ENABLED "Narrate" button under a "5 credits"
 * plate. Clicked from a clean anonymous context the walk measured `href: /create`,
 * `store.settlement: false`, `dialogs: []`, `alerts: []` — no notice, no settlement,
 * and the reader silently moved off the page they were reading
 * (`N-narrate-after-desktop.png`). It is the founding shape of this register ("three
 * of the four answered a refusal by navigating") wearing a call-to-action's coat.
 *
 * ── WHAT IS PROVED HERE ───────────────────────────────────────────────────────
 * The control is MOUNTED and CLICKED with an empty store, and both halves are read
 * back: the words that appeared, and the navigation that did NOT happen. The copy is
 * derived through `refusalCopy`, never typed here.
 *
 * THE ARM CARRIES ITS CONTROLS. With a settlement on the store this is not a refusal
 * at all and the navigation must survive untouched — the dossier is where the Narrate
 * control lives, and a cure that stranded a reader who HAS a town would be a worse
 * defect than the one it replaced. The notice's own door navigates on the reader's
 * second, informed click, which is what keeps this a gate that ends in an action.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { codeOnly } from '../helpers/codeOnlySource.js';

import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { tl } from '../../src/copy/landing.js';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

const storeState = {
  settlement: null,
  generateSettlement: vi.fn(),
  updateConfig: vi.fn(),
  setWizardMode: vi.fn(),
  setRandomSliderMode: vi.fn(),
  clearNeighbour: vi.fn(),
  lastRefusal: null,
  clearRefusal: vi.fn(),
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const narrateWords = () => refusalCopy(REFUSAL_REASONS.NARRATE_NEEDS_TOWN);

async function renderNarrate(onNavigate) {
  const { VoiceNarrateButton } = await import('../../src/components/home/LandingArtifacts.jsx');
  render(<VoiceNarrateButton onNavigate={onNavigate} />);
  return screen.getByRole('button', { name: tl('voice.cta') });
}

beforeEach(() => { storeState.settlement = null; });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('The landing voice CTA — a refusal never navigates', () => {
  test('with no town, the click says why and the reader stays put', async () => {
    const onNavigate = vi.fn();
    fireEvent.click(await renderNarrate(onNavigate));

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(narrateWords().rubric);
    expect(said).toContain('reads a town that already exists');
    expect(onNavigate, 'the refusal navigated, which is the defect it replaced').not.toHaveBeenCalled();
  });

  test('the notice offers the door, and the door is the reader\'s SECOND click', async () => {
    const onNavigate = vi.fn();
    fireEvent.click(await renderNarrate(onNavigate));
    await screen.findByRole('alert');

    fireEvent.click(screen.getByRole('button', { name: tl('voice.narrateDoor') }));
    expect(onNavigate).toHaveBeenCalledWith('generate');
  });

  test('CONTROL: with a town on the store the ask still travels to the dossier', async () => {
    storeState.settlement = { name: 'Cnocby', tier: 'village' };
    const onNavigate = vi.fn();
    fireEvent.click(await renderNarrate(onNavigate));

    expect(onNavigate).toHaveBeenCalledWith('generate');
    // anchored: the click above is proven to have run the handler, so an empty alert
    // set here is a quiet control rather than an unmounted surface.
    expect(screen.queryByRole('alert'), 'a reader who HAS a town was refused').toBeNull();
  });
});

describe('WIRING — the landing really uses the control, not the bare navigation', () => {
  /**
   * ⛔ THIS ARM EXISTS BECAUSE ITS ABSENCE WAS MEASURED (2026-09-20). The red-first proof
   * for this cure reverted §03's ask to `onClick={() => onNavigate('generate')}` — the
   * exact defect — and the arms above stayed GREEN, because they mount the control
   * directly and never read the section that renders it. A pin that cannot be reddened
   * by restoring the bug is not proving the bug is gone.
   */
  const BELOW_FOLD = readFileSync(join(process.cwd(), 'src/components/home/LandingBelowFold.jsx'), 'utf8');

  /**
   * Does §03 raise the reason through the control, rather than navigating outright?
   *
   * ⚠ ONE CLAUSE, DELIBERATELY. The obvious second clause — a NEGATIVE on the reverted
   * `onClick={() => onNavigate('generate')}>{tl('voice.cta')}` — cannot work here: it
   * quotes two string literals, and `codeOnly` blanks string CONTENTS by design, so that
   * pattern never matches and the clause is dead weight that reads as rigour. The two
   * shapes are mutually exclusive in that one JSX slot, and the guard below proves the
   * single clause really convicts the defect.
   */
  function usesNarrateControl(raw) {
    return /<VoiceNarrateButton\b/.test(codeOnly(raw));
  }

  test('the voice section renders the control that can refuse', () => {
    expect(
      usesNarrateControl(BELOW_FOLD),
      'the landing\'s Narrate ask navigates on every click again, so a reader with no town '
      + 'is moved off the page with nothing said — REVIEW-P F4 is live',
    ).toBe(true);
  });

  test('GUARD-THE-GUARD: the matcher convicts the defect it was written against', () => {
    const reverted = BELOW_FOLD.replace(
      '<VoiceNarrateButton onNavigate={onNavigate} />',
      "<Button variant=\"ai\" onClick={() => onNavigate('generate')}>{tl('voice.cta')}</Button>");
    expect(usesNarrateControl(reverted), 'the matcher does not see the original defect').toBe(false);
    // …and it reads CODE, so the defect quoted in a comment is not a conviction.
    expect(usesNarrateControl(BELOW_FOLD + "\n// onClick={() => onNavigate('generate')}>{tl('voice.cta')}")).toBe(true);
  });
});
